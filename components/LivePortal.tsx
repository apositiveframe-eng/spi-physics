import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { X, Mic, MicOff, Zap, ShieldCheck, Activity, RefreshCw, Terminal, Power } from 'lucide-react';
import UniversalHost from './UniversalHost';

interface LivePortalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate?: (mode: any) => void;
    theme?: 'dark' | 'light';
}

const LivePortal: React.FC<LivePortalProps> = ({ isOpen, onClose, onNavigate, theme = 'dark' }) => {
    const [status, setStatus] = useState<'connecting' | 'active' | 'closed'>('connecting');
    const [audioLevel, setAudioLevel] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [transcription, setTranscription] = useState('Initializing neural link...');
    
    const sessionPromiseRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputNodeRef = useRef<GainNode | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);

    // Manual Base64 Helpers
    const decode = (base64: string) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        return bytes;
    };

    const encode = (bytes: Uint8Array) => {
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
    };

    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> => {
        const dataInt16 = new Int16Array(data.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        return buffer;
    };

    const createPcmBlob = (data: Float32Array) => {
        const int16 = new Int16Array(data.length);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            int16[i] = data[i] * 32768;
            sum += Math.abs(data[i]);
        }
        setAudioLevel(sum / data.length * 10); // Scale for visual
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    };

    const navFunction: FunctionDeclaration = {
        name: 'navigateToSector',
        parameters: {
            type: Type.OBJECT,
            description: 'Navigate the user to a specific diagnostic sector or tool.',
            properties: {
                destination: {
                    type: Type.STRING,
                    description: 'The target view mode: command-deck, mission-map, diagnostic-unit, the-lexicon, the-archive, or neuro-deck.',
                }
            },
            required: ['destination'],
        },
    };

    useEffect(() => {
        if (!isOpen) return;

        const startSession = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                micStreamRef.current = micStream;

                const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                inputAudioContextRef.current = inputCtx;
                audioContextRef.current = outputCtx;
                
                const outputNode = outputCtx.createGain();
                outputNode.connect(outputCtx.destination);
                outputNodeRef.current = outputNode;

                const sessionPromise = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                    callbacks: {
                        onopen: () => {
                            setStatus('active');
                            setTranscription('Neural Link Established. Speak freely, scholar.');
                            
                            const source = inputCtx.createMediaStreamSource(micStream);
                            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                            processor.onaudioprocess = (e) => {
                                if (isMuted) return;
                                const inputData = e.inputBuffer.getChannelData(0);
                                const blob = createPcmBlob(inputData);
                                sessionPromise.then(s => s.sendRealtimeInput({ media: blob }));
                            };
                            source.connect(processor);
                            processor.connect(inputCtx.destination);
                        },
                        onmessage: async (msg: LiveServerMessage) => {
                            if (msg.toolCall) {
                                for (const fc of msg.toolCall.functionCalls) {
                                    if (fc.name === 'navigateToSector' && onNavigate) {
                                        onNavigate(fc.args.destination);
                                        sessionPromise.then(s => s.sendToolResponse({
                                            functionResponses: { id: fc.id, name: fc.name, response: { result: "Navigation Successful" } }
                                        }));
                                    }
                                }
                            }

                            if (msg.serverContent?.outputTranscription) {
                                setTranscription(prev => prev.length > 100 ? msg.serverContent!.outputTranscription!.text : prev + ' ' + msg.serverContent!.outputTranscription!.text);
                            }

                            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                            if (audioData) {
                                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                                const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000);
                                const source = outputCtx.createBufferSource();
                                source.buffer = buffer;
                                source.connect(outputNode);
                                source.onended = () => sourcesRef.current.delete(source);
                                source.start(nextStartTimeRef.current);
                                nextStartTimeRef.current += buffer.duration;
                                sourcesRef.current.add(source);
                            }

                            if (msg.serverContent?.interrupted) {
                                sourcesRef.current.forEach(s => s.stop());
                                sourcesRef.current.clear();
                                nextStartTimeRef.current = 0;
                            }
                        },
                        onerror: () => setStatus('closed'),
                        onclose: () => setStatus('closed'),
                    },
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
                        systemInstruction: "You are HARVEY, the diagnostic sonography intelligence. You are currently in a real-time voice link. Be concise. Guide the user through SPI physics with technical gravitas. You can navigate the app using tools if requested.",
                        tools: [{ functionDeclarations: [navFunction] }],
                        outputAudioTranscription: {},
                    }
                });
                sessionPromiseRef.current = sessionPromise;
            } catch (e) {
                setStatus('closed');
            }
        };

        startSession();

        return () => {
            if (sessionPromiseRef.current) sessionPromiseRef.current.then((s: any) => s.close());
            if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
            if (inputAudioContextRef.current) inputAudioContextRef.current.close();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 animate-fade-in overflow-hidden">
            <div className="absolute inset-0 bg-midnight/90 backdrop-blur-2xl" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl glass-panel rounded-[4rem] border-accent-blue/30 bg-dark-secondary/95 shadow-blue-bright flex flex-col items-center p-12 space-y-10 animate-slide-up">
                
                <div className="absolute top-8 right-8">
                    <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-text-muted hover:text-white transition-all"><X className="w-6 h-6" /></button>
                </div>

                <div className="space-y-4 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                        <Zap className="w-4 h-4" /> Neural_Live_Handshake
                    </div>
                    <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Harvey Active Link</h2>
                </div>

                <div className="relative w-full py-10 flex justify-center">
                    <UniversalHost 
                        status={status === 'connecting' ? 'thinking' : status === 'active' ? 'listening' : 'error'} 
                        audioLevel={audioLevel} 
                        theme={theme}
                        className="scale-125"
                    />
                </div>

                <div className="w-full space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-black/40 border border-white/5 min-h-[120px] flex flex-col justify-center items-center text-center">
                        <p className="text-xl md:text-2xl font-serif italic text-white/90 leading-relaxed">
                            {status === 'connecting' ? "Synchronizing vectors..." : `"${transcription}"`}
                        </p>
                    </div>

                    <div className="flex justify-center gap-6">
                        <button 
                            onClick={() => setIsMuted(!isMuted)} 
                            className={`p-8 rounded-[2.5rem] transition-all active:scale-95 shadow-xl border-2 flex flex-col items-center gap-3 ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-accent-blue/10 border-accent-blue/40 text-accent-blue'}`}
                        >
                            {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                            <span className="text-[8px] font-black uppercase tracking-widest">{isMuted ? 'Muted' : 'Live'}</span>
                        </button>
                        
                        <button 
                            onClick={onClose} 
                            className="p-8 rounded-[2.5rem] bg-white/5 border-2 border-white/10 text-white hover:bg-red-500 hover:border-red-500 transition-all active:scale-95 shadow-xl flex flex-col items-center gap-3"
                        >
                            <Power className="w-8 h-8" />
                            <span className="text-[8px] font-black uppercase tracking-widest">End Session</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[9px] font-black text-text-muted/40 uppercase tracking-[0.4em]">
                   <ShieldCheck className="w-4 h-4" /> SSL_ENCRYPTED_VOICE_MATRIX_v2.5
                </div>
            </div>
        </div>
    );
};

export default LivePortal;