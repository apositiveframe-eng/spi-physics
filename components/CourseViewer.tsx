import React, { useState, useEffect, useRef, useMemo } from 'react';
import { courseData, Module, Topic, glossaryTerms } from '../data/courseContent';
import Simulations from './Simulations';
import SpaceBackground from './SpaceBackground';
import LightLiveBackground from './LightLiveBackground';
import UniversalHost from './UniversalHost';
import MockExam from './MockExam';
import Flashcards from './Flashcards';
import FormulaOverlay from './FormulaOverlay';
import ReferenceLibrary from './ReferenceLibrary';
import LivePortal from './LivePortal';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { cacheHelper } from '../utils/cacheHelper';
import { supabase } from '../lib/supabase';
import { 
    ChevronRight, ChevronLeft, CheckCircle, Brain, X,
    LayoutGrid, ArrowRight, ArrowUp, Clock, Target, Key,
    Calculator, Activity, Info, Layers, Monitor,
    Sun, Moon, Menu, Sparkles, Scan, Map, History, 
    BookOpen, ShieldCheck, Database, Award, Zap, HelpCircle,
    FlaskConical, Beaker, Terminal, Settings, Waves, Library,
    BarChart3, Globe, ZapOff, LogOut, FileText, Star, Microscope,
    Sliders, ShieldAlert, Shield, Cpu, Users, Server, AlertTriangle,
    Loader2, Search, Filter, PlayCircle, Eye, Gauge, Sparkle, FastForward,
    ChevronDown, Circle, CheckCircle2, MonitorCheck, Network, RefreshCw,
    Book, FileSearch, Radio, MoveVertical, MoveHorizontal, Droplets, Binary, Volume2, VolumeX, DownloadCloud,
    Podcast, Mic2, Compass, Command, List, Tags, Boxes, Milestone, XCircle, Zap as ZapIcon
} from 'lucide-react';

interface ExamReport {
    id: string;
    timestamp: number;
    score: number;
    correct: number;
    total: number;
    timeSpent: number;
    missedTopics: string[];
}

interface RemediationPath {
    priorityModules: string[];
    reasoning: string;
    estimatedTimeToSync: string;
}

interface CourseViewerProps {
    onExit: () => void;
    onPlayCorrect: () => void;
    onPlayIncorrect: () => void;
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
}

type ViewMode = 'command-deck' | 'mission-map' | 'sync-stage' | 'diagnostic-unit' | 'the-lexicon' | 'the-archive' | 'neuro-deck';

const CourseViewer: React.FC<CourseViewerProps> = ({ onExit, onPlayCorrect, onPlayIncorrect, theme, onToggleTheme }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentModuleIdx, setCurrentModuleIdx] = useState<number>(0);
    const [currentTopicIdx, setCurrentTopicIdx] = useState<number>(0);
    const [viewMode, setViewMode] = useState<ViewMode>('command-deck');
    const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set());
    const [vaultEntries, setVaultEntries] = useState<Record<string, string>>({});
    const [examReports, setExamReports] = useState<ExamReport[]>([]);
    const [remediation, setRemediation] = useState<RemediationPath | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showFormulas, setShowFormulas] = useState(false);
    const [showLivePortal, setShowLivePortal] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([courseData[0].id]));
    const [showModuleIntro, setShowModuleIntro] = useState(false);
    const [isHarveySpeaking, setIsHarveySpeaking] = useState(false);
    const [harveyStatus, setHarveyStatus] = useState<any>('idle');
    
    const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const syncFromSupabase = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUser(user);
            const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle();
            if (data) {
                setCompletedTopicIds(new Set(data.completed_topics || []));
                setVaultEntries(data.vault_entries || {});
                setExamReports(data.exam_reports || []);
                if (data.current_module_idx !== undefined) setCurrentModuleIdx(data.current_module_idx);
                if (data.current_topic_idx !== undefined) setCurrentTopicIdx(data.current_topic_idx);
                if (data.exam_reports?.length > 0) generateRemediation(data.exam_reports);
            }
        };
        syncFromSupabase();
    }, []);

    const stopHarveyVoice = () => {
        if (currentAudioSourceRef.current) {
            currentAudioSourceRef.current.stop();
            currentAudioSourceRef.current = null;
        }
        setIsHarveySpeaking(false);
        setHarveyStatus('idle');
    };

    const playHarveyVoice = async (text: string) => {
        if (!text) return;
        stopHarveyVoice();
        const cacheKey = `v-lecture-${btoa(text.substring(0, 50)).substring(0, 32)}`;
        
        try {
            setIsHarveySpeaking(true);
            setHarveyStatus('speaking');
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') await ctx.resume();

            let audioData = await cacheHelper.getBlob(cacheKey);

            if (!audioData) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-preview-tts',
                    contents: [{ parts: [{ text }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
                    },
                });

                const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (base64Audio) {
                    const binaryString = atob(base64Audio);
                    audioData = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) audioData[i] = binaryString.charCodeAt(i);
                    await cacheHelper.putBlob(cacheKey, audioData, 'audio/pcm');
                }
            }

            if (audioData) {
                const dataInt16 = new Int16Array(audioData.buffer);
                const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
                const channelData = buffer.getChannelData(0);
                for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.onended = () => {
                    setIsHarveySpeaking(false);
                    setHarveyStatus('idle');
                };
                currentAudioSourceRef.current = source;
                source.start();
            }
        } catch (e) {
            setIsHarveySpeaking(false);
            setHarveyStatus('idle');
        }
    };

    const generateRemediation = async (reports: ExamReport[]) => {
        if (reports.length === 0 || isAnalyzing) return;
        setIsAnalyzing(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analyze these exam reports: ${JSON.stringify(reports.slice(0, 3))}. Identify the core physics weaknesses and provide a priority remediation path.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            priorityModules: { type: Type.ARRAY, items: { type: Type.STRING } },
                            reasoning: { type: Type.STRING },
                            estimatedTimeToSync: { type: Type.STRING }
                        },
                        required: ["priorityModules", "reasoning", "estimatedTimeToSync"]
                    }
                }
            });
            const path = JSON.parse(response.text || '{}');
            setRemediation(path);
        } catch (e) {
            console.error("Neural analysis failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const toggleTopicCompletion = (id: string, takeaway: string) => {
        setCompletedTopicIds(prev => {
            const next = new Set(prev);
            if (!next.has(id)) {
                next.add(id);
                const updatedVault = { ...vaultEntries, [id]: takeaway };
                setVaultEntries(updatedVault);
                supabase.auth.getUser().then(({ data: { user } }) => {
                   if (user) supabase.from('user_profiles').upsert({ user_id: user.id, completed_topics: Array.from(next), vault_entries: updatedVault, updated_at: new Date() });
                });
            }
            return next;
        });
    };

    const handleNextTopic = () => {
        const mod = courseData[currentModuleIdx];
        if (currentTopicIdx < mod.topics.length - 1) {
            setCurrentTopicIdx(prev => prev + 1);
        } else if (currentModuleIdx < courseData.length - 1) {
            setCurrentModuleIdx(prev => prev + 1);
            setCurrentTopicIdx(0);
            setShowModuleIntro(true);
        } else {
            setViewMode('command-deck');
        }
    };

    const handlePrevTopic = () => {
        if (currentTopicIdx > 0) {
            setCurrentTopicIdx(prev => prev - 1);
        } else if (currentModuleIdx > 0) {
            const prevMod = courseData[currentModuleIdx - 1];
            setCurrentModuleIdx(prev => prev - 1);
            setCurrentTopicIdx(prevMod.topics.length - 1);
        }
    };

    const toggleModule = (id: string) => {
        setExpandedModules(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const selectTopic = (mIdx: number, tIdx: number) => {
        setCurrentModuleIdx(mIdx);
        setCurrentTopicIdx(tIdx);
        setViewMode('sync-stage');
        if (tIdx === 0) setShowModuleIntro(true);
        if (window.innerWidth < 1024) setIsSidebarOpen(false);
    };

    const handleAutonomousNavigation = (destination: ViewMode) => {
        setViewMode(destination);
        setShowLivePortal(false); 
    };

    const sidebarNavItems = [
        { id: 'command-deck', label: 'Command Deck', icon: LayoutGrid },
        { id: 'mission-map', label: 'Mission Map', icon: Network },
        { id: 'the-lexicon', label: 'The Lexicon', icon: Book },
        { id: 'the-archive', label: 'The Archive', icon: Database },
        { id: 'diagnostic-unit', label: 'Diagnostic Unit', icon: Target },
        { id: 'neuro-deck', label: 'Neuro Deck', icon: FlaskConical },
    ];

    const currentModule = courseData[currentModuleIdx] || courseData[0];
    const currentTopic = currentModule.topics[currentTopicIdx] || currentModule.topics[0];
    const totalTopics = courseData.reduce((acc, m) => acc + m.topics.length, 0);
    const progressPercent = Math.round((completedTopicIds.size / totalTopics) * 100);

    return (
        <div className={`fixed inset-0 z-[60] flex flex-col md:flex-row overflow-hidden transition-colors duration-700 font-sans text-left ${theme === 'light' ? 'bg-light-primary text-text-lightMain' : 'bg-midnight text-text-main'}`}>
            
            {/* Responsive Sidebar */}
            <div 
                className={`fixed inset-y-0 left-0 w-[280px] md:w-[320px] backdrop-blur-3xl border-r flex flex-col transition-all duration-700 transform z-[120] md:static md:translate-x-0 shrink-0 tactical-border ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${theme === 'light' ? 'bg-light-tertiary border-black/5' : 'bg-midnight-light border-accent-blue/15'}`}
            >
                <div className="p-6 md:p-8 border-b border-white/5 flex items-center gap-4 group cursor-pointer" onClick={() => setViewMode('command-deck')}>
                    <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-accent-blue/30 rounded-xl flex items-center justify-center font-display font-black text-lg md:text-xl text-accent-blue shadow-blue transition-transform group-hover:scale-105">S</div>
                    <div className="flex flex-col">
                        <h2 className={`font-display font-black tracking-[0.1em] text-xs md:text-sm uppercase leading-none ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>SPIPHYSIC.COM</h2>
                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] mt-1.5 text-accent-blue/40">Master_The_Pulse</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1.5 md:space-y-2 custom-scrollbar">
                    {sidebarNavItems.map((nav) => (
                        <button 
                            key={nav.id} 
                            onClick={() => { setViewMode(nav.id as any); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} 
                            className={`w-full text-left px-4 md:px-6 py-3 md:py-4 rounded-[1rem] md:rounded-[1.2rem] flex items-center gap-3 md:gap-4 transition-all ${viewMode === nav.id ? 'bg-accent-blue text-dark-primary shadow-blue-bright scale-[1.02]' : theme === 'light' ? 'hover:bg-black/5 text-slate-500' : 'hover:bg-white/5 text-text-muted hover:text-white'}`}
                        >
                            <nav.icon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                            <span className="uppercase tracking-[0.2em] text-[8px] md:text-[9px] font-black">{nav.label}</span>
                        </button>
                    ))}
                    
                    <div className="pt-6 md:pt-8 px-4 md:px-6 pb-2">
                        <span className="text-[7px] md:text-[8px] font-black text-accent-blue/40 uppercase tracking-[0.4em]">Active Protocols</span>
                    </div>

                    {courseData.map((mod, mIdx) => (
                        <div key={mod.id} className="px-1 md:px-2">
                            <button 
                                onClick={() => toggleModule(mod.id)}
                                className={`w-full flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 hover:bg-white/5 rounded-lg transition-colors group ${expandedModules.has(mod.id) ? 'text-accent-blue' : 'text-text-muted'}`}
                            >
                                <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest truncate">{mod.title.split(':')[1] || mod.title}</span>
                                <ChevronDown className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform ${expandedModules.has(mod.id) ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedModules.has(mod.id) && (
                                <div className="ml-3 md:ml-4 border-l border-white/5 mt-1 space-y-1">
                                    {mod.topics.map((t, tIdx) => (
                                        <button 
                                            key={t.id} 
                                            onClick={() => selectTopic(mIdx, tIdx)}
                                            className={`w-full text-left px-3 md:px-4 py-1.5 md:py-2 rounded-md text-[8px] md:text-[10px] transition-all ${viewMode === 'sync-stage' && currentTopic.id === t.id ? 'bg-accent-blue/10 text-accent-blue font-black' : 'text-text-muted/60 hover:text-white'}`}
                                        >
                                            {t.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={`p-4 md:p-6 border-t ${theme === 'light' ? 'bg-slate-50/50 border-black/5' : 'bg-black/40 border-white/5'}`}>
                    <div className="flex justify-between items-center mb-2 md:mb-3">
                        <span className="text-[7px] md:text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">Neural Sync</span>
                        <span className="text-[9px] md:text-[10px] font-black text-accent-blue">{progressPercent}%</span>
                    </div>
                    <div className={`w-full h-1 md:h-1.5 rounded-full overflow-hidden ${theme === 'light' ? 'bg-black/5' : 'bg-white/5'}`}>
                        <div className="h-full bg-accent-blue shadow-blue transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {theme === 'dark' ? <SpaceBackground /> : <LightLiveBackground />}
                
                {/* Responsive Header */}
                <div className={`h-16 md:h-20 border-b flex items-center justify-between px-4 md:px-10 shrink-0 backdrop-blur-3xl z-[100] ${theme === 'light' ? 'bg-white/60 border-black/5' : 'bg-black/20 border-white/5'}`}>
                    <div className="flex items-center gap-3 md:gap-10">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 rounded-lg border border-white/10 active:scale-90 transition-all"><Menu className="w-5 h-5" /></button>
                        <div className="flex items-center gap-3 md:gap-6">
                            <UniversalHost status={harveyStatus} theme={theme} className="!w-10 !h-10 md:!w-12 md:!h-12" />
                            <div className="hidden sm:flex gap-2 md:gap-4">
                                <div className="px-3 md:px-4 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-blue">Mastery: {progressPercent}%</div>
                                <button onClick={() => setShowLivePortal(true)} className="px-3 md:px-4 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-gold hover:bg-accent-gold/20 transition-all active:scale-95 flex items-center gap-2">
                                    <Activity className="w-3 h-3 animate-pulse" /> Live Handshake
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={onToggleTheme} className="p-2 md:p-3 rounded-xl border border-white/10 text-text-muted hover:text-accent-blue transition-all active:scale-90">{theme === 'light' ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}</button>
                        <button onClick={() => setShowFormulas(true)} className="p-2 md:p-3 border border-accent-blue/30 text-accent-blue rounded-xl bg-accent-blue/10 hover:bg-accent-blue/20 active:scale-90 transition-all"><Calculator className="w-4 h-4 md:w-5 md:h-5" /></button>
                        <button onClick={onExit} className="p-2 md:p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white active:scale-90 transition-all"><LogOut className="w-4 h-4 md:w-5 md:h-5" /></button>
                    </div>
                </div>

                {/* Main View Container */}
                <div className="flex-1 relative z-10 overflow-hidden">
                    {viewMode === 'command-deck' && (
                        <CommandDeck 
                            reports={examReports} 
                            remediation={remediation} 
                            theme={theme} 
                            onEnterMap={() => setViewMode('mission-map')} 
                            onInitiateLive={() => setShowLivePortal(true)}
                            hostStatus={harveyStatus}
                        />
                    )}
                    {viewMode === 'mission-map' && <MissionMap completedIds={completedTopicIds} theme={theme} onSelectModule={(mIdx) => selectTopic(mIdx, 0)} />}
                    {viewMode === 'sync-stage' && (
                        <SyncStage 
                            topic={currentTopic} 
                            module={currentModule} 
                            theme={theme}
                            completedIds={completedTopicIds}
                            onMarkComplete={toggleTopicCompletion} 
                            isCompleted={completedTopicIds.has(currentTopic.id)} 
                            onNext={handleNextTopic} 
                            onPrev={handlePrevTopic} 
                            onSelectTopic={(tIdx) => setCurrentTopicIdx(tIdx)}
                            onPlayCorrect={onPlayCorrect} 
                            onPlayIncorrect={onPlayIncorrect} 
                            harveySpeaking={isHarveySpeaking}
                            onNarrate={() => playHarveyVoice(currentTopic.timeSaverHook)}
                            setHarveyStatus={setHarveyStatus}
                            hostStatus={harveyStatus}
                        />
                    )}
                    {viewMode === 'diagnostic-unit' && <MockExam theme={theme} onReturn={() => setViewMode('command-deck')} onPlayCorrect={onPlayCorrect} onPlayIncorrect={onPlayIncorrect} onSaveReport={(r) => { setExamReports([r, ...examReports]); generateRemediation([r, ...examReports]); }} />}
                    {viewMode === 'the-lexicon' && <TheLexicon theme={theme} />}
                    {viewMode === 'the-archive' && <ReferenceLibrary theme={theme} />}
                    {viewMode === 'neuro-deck' && <NeuroDeck theme={theme} />}
                </div>
            </div>
            <FormulaOverlay isOpen={showFormulas} onClose={() => setShowFormulas(false)} />
            <LivePortal isOpen={showLivePortal} onClose={() => setShowLivePortal(false)} onNavigate={handleAutonomousNavigation} theme={theme} />
            {showModuleIntro && <ModuleIntro module={currentModule} moduleIndex={currentModuleIdx + 1} theme={theme} onComplete={() => setShowModuleIntro(false)} />}
        </div>
    );
};

// --- Sub-Components (Harvey Centric) ---

const CommandDeck: React.FC<{ 
    reports: ExamReport[], 
    remediation: RemediationPath | null, 
    theme: string, 
    onEnterMap: () => void, 
    onInitiateLive: () => void,
    hostStatus: string
}> = ({ reports, remediation, theme, onEnterMap, onInitiateLive, hostStatus }) => {
    const isLight = theme === 'light';
    return (
        <div className="p-4 md:p-10 lg:p-20 overflow-y-auto custom-scrollbar h-full animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-12 md:space-y-20">
                
                {/* Featured Harvey Briefing Area */}
                <div className="flex flex-col items-center text-center space-y-10">
                    <UniversalHost 
                        status={hostStatus as any} 
                        variant="featured" 
                        theme={theme as any}
                        message={remediation ? "Protocol recalibrated. I've identified critical resonance gaps in your spectral knowledge." : "Welcome to the Command Hub. Diagnostic sensors are awaiting your instructions."}
                    />
                    
                    <div className="flex flex-wrap justify-center gap-6">
                        <button onClick={onInitiateLive} className="btn-blue px-12 py-5 rounded-2xl flex items-center gap-4 font-black uppercase tracking-widest text-[10px] shadow-blue-bright transition-all active:scale-95">
                            <ZapIcon className="w-5 h-5 animate-pulse" /> Direct Neural Link
                        </button>
                        <button onClick={onEnterMap} className="btn-gold px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-gold-bright transition-all active:scale-95">
                            Launch Mission Map
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    <div className={`lg:col-span-8 glass-panel p-8 md:p-12 rounded-[2rem] md:rounded-[4rem] tactical-border relative overflow-hidden ${isLight ? 'bg-white shadow-2xl' : 'bg-black/40'}`}>
                        <div className="absolute top-0 right-0 p-6 md:p-12 opacity-[0.05]"><Brain className="w-32 h-32 md:w-64 md:h-64 text-accent-gold" /></div>
                        <h3 className="text-lg md:text-2xl font-display font-black uppercase tracking-widest text-accent-gold mb-6 md:mb-8">Active Intelligence Directive</h3>
                        {remediation ? (
                            <div className="space-y-8 md:space-y-10 relative z-10">
                                <p className={`text-xl md:text-3xl font-serif italic leading-relaxed border-l-4 border-accent-gold/40 pl-8 ${isLight ? 'text-slate-700' : 'text-text-main'}`}>"{remediation.reasoning}"</p>
                                <div className="flex flex-wrap gap-3 md:gap-5">
                                    {remediation.priorityModules.map((m, i) => (
                                        <div key={i} className="px-5 md:px-7 py-2.5 md:py-3 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold text-[8px] md:text-[11px] font-black uppercase tracking-widest rounded-xl flex items-center gap-3">
                                            <Shield className="w-3 h-3" /> {m}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 md:py-16 space-y-6 md:space-y-8">
                                <p className="text-base md:text-xl text-text-muted italic max-w-lg mx-auto">"Complete a diagnostic audit to initialize Harvey's remediation logic and personalized trajectory."</p>
                                <button onClick={onEnterMap} className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-white/10 transition-all">Initialize Mission Vectors</button>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
                        <div className={`glass-panel p-8 md:p-12 text-center rounded-2xl md:rounded-[3rem] tactical-border flex flex-col justify-center items-center ${isLight ? 'bg-white' : ''}`}>
                            <div className="text-[8px] md:text-[11px] font-black text-accent-blue uppercase tracking-widest mb-4">Neural Sync Peak</div>
                            <div className="text-4xl md:text-7xl font-display font-black text-accent-blue">{reports[0]?.score || 0}%</div>
                            <div className="w-12 h-1 bg-accent-blue/20 mt-4 rounded-full" />
                        </div>
                        <div className={`glass-panel p-8 md:p-12 text-center rounded-2xl md:rounded-[3rem] tactical-border flex flex-col justify-center items-center ${isLight ? 'bg-white' : ''}`}>
                            <div className="text-[8px] md:text-[11px] font-black text-accent-gold uppercase tracking-widest mb-4">Total Interactions</div>
                            <div className="text-4xl md:text-7xl font-display font-black text-accent-gold">{reports.length}</div>
                            <div className="w-12 h-1 bg-accent-gold/20 mt-4 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MissionMap: React.FC<{ completedIds: Set<string>, theme: string, onSelectModule: (idx: number) => void }> = ({ completedIds, theme, onSelectModule }) => (
    <div className="p-4 md:p-10 lg:p-20 overflow-y-auto custom-scrollbar h-full animate-fade-in">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-16">
            <div className="space-y-2 md:space-y-4 text-center md:text-left">
                <h1 className={`text-4xl md:text-6xl lg:text-9xl font-display font-black uppercase tracking-tighter luxury-text leading-none ${theme === 'light' ? '!filter-none' : ''}`}>Sectors</h1>
                <p className="text-text-muted italic font-serif text-base md:text-xl border-l-2 border-accent-blue/30 pl-4 md:pl-8 max-w-2xl mx-auto md:mx-0">"Navigate the diagnostic sectors of the SPI blueprint."</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                {courseData.map((mod, idx) => {
                    const completed = mod.topics.filter(t => completedIds.has(t.id)).length;
                    const percent = Math.round((completed / mod.topics.length) * 100);
                    return (
                        <button 
                            key={mod.id} 
                            onClick={() => onSelectModule(idx)}
                            className={`aspect-square glass-panel p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] tactical-border transition-all duration-500 hover:-translate-y-2 hover:border-accent-blue/50 flex flex-col items-center justify-between text-center relative group overflow-hidden ${theme === 'light' ? 'bg-white shadow-xl' : 'bg-black/40'}`}
                        >
                            <div className="absolute inset-0 bg-accent-blue/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-10 h-10 md:w-16 md:h-16 mb-2 md:mb-4">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                                    <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="100%" strokeDashoffset={`${100 - percent}%`} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-[7px] md:text-[10px] font-black">{percent}%</div>
                            </div>
                            <div className="space-y-0.5 md:space-y-1 overflow-hidden w-full">
                                <div className="text-[6px] md:text-[7px] font-black text-accent-blue uppercase tracking-widest">Sector_0{idx+1}</div>
                                <h4 className={`text-[8px] md:text-xs font-black uppercase tracking-widest truncate ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{mod.title.split(':')[1] || mod.title}</h4>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
);

const SyncStage: React.FC<{ 
    topic: Topic, module: Module, theme: string, completedIds: Set<string>, onMarkComplete: any, isCompleted: boolean, onNext: any, onPrev: any, onSelectTopic: any, onPlayCorrect: any, onPlayIncorrect: any, harveySpeaking: boolean, onNarrate: any, setHarveyStatus: any, hostStatus: string 
}> = ({ topic, module, theme, completedIds, onMarkComplete, isCompleted, onNext, onPrev, onSelectTopic, onPlayCorrect, onPlayIncorrect, harveySpeaking, onNarrate, setHarveyStatus, hostStatus }) => {
    const [mode, setMode] = useState<'story' | 'lab'>('story');
    const [selected, setSelected] = useState<number | null>(null);
    const [verified, setVerified] = useState(false);
    const isLight = theme === 'light';

    useEffect(() => { setSelected(null); setVerified(false); }, [topic.id]);

    const handleVerify = () => {
        if (selected === null) return;
        setVerified(true);
        const isCorrect = selected === topic.assessment[0].correctAnswer;
        
        if (isCorrect) {
            onPlayCorrect();
            onMarkComplete(topic.id, topic.harveyTakeaways);
            setHarveyStatus('syncing');
            setTimeout(() => setHarveyStatus('idle'), 1500);
        } else {
            onPlayIncorrect();
            setHarveyStatus('error');
            setTimeout(() => setHarveyStatus('idle'), 1000);
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col h-full animate-fade-in overflow-hidden">
            {/* Optimized Mode Nav */}
            <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-[100] flex gap-1 p-1 rounded-full backdrop-blur-2xl border border-white/10 bg-black/40 shadow-2xl">
                <button onClick={() => setMode('story')} className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all ${mode === 'story' ? 'bg-accent-blue text-dark-primary shadow-blue' : 'text-text-muted hover:text-white'}`}>Story</button>
                <button onClick={() => setMode('lab')} className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all ${mode === 'lab' ? 'bg-accent-blue text-dark-primary shadow-blue' : 'text-text-muted hover:text-white'}`}>Lab</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10 lg:p-24 pb-32 md:pb-48">
                <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-16 pt-12 md:pt-0">
                    
                    {/* Left Column: Harvey Presence (Featured Prominence) */}
                    <div className="xl:w-80 shrink-0 space-y-10 flex flex-col items-center xl:items-start">
                        <div className="sticky top-0 pt-10 space-y-10">
                            <UniversalHost status={hostStatus as any} theme={theme as any} className="scale-125 xl:scale-110" />
                            <div className={`p-8 rounded-[2.5rem] glass-panel border border-white/5 animate-slide-up text-left hidden xl:block`}>
                                <div className="flex items-center gap-3 mb-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                                   <span className="text-[9px] font-black text-accent-blue uppercase tracking-widest">Co-Pilot Feed</span>
                                </div>
                                <p className="text-sm italic font-serif leading-relaxed text-text-muted">"{isCompleted ? "Protocol complete. Excellent neural persistence." : "Awaiting vector audit for Sector Synchronization."}"</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex-1 max-w-4xl space-y-12 md:space-y-24">
                        {mode === 'story' ? (
                            <div className="space-y-8 md:space-y-16 animate-fade-in">
                                <div className="text-center md:text-left space-y-4 md:space-y-8">
                                    <div className="text-[7px] md:text-[10px] font-black text-accent-blue uppercase tracking-[0.6em]">Sector Protocol Sync</div>
                                    <h1 className={`text-3xl md:text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter luxury-text leading-none ${isLight ? '!filter-none' : ''}`}>{topic.title}</h1>
                                    <p className={`text-base md:text-2xl lg:text-3xl font-serif italic font-light leading-relaxed max-w-3xl mx-auto md:mx-0 border-y py-6 md:py-10 ${isLight ? 'text-slate-600 border-black/5' : 'text-text-muted border-white/5'}`}>"{topic.timeSaverHook}"</p>
                                </div>
                                <div className={`glass-panel p-6 md:p-12 lg:p-20 rounded-[2rem] md:rounded-[4rem] tactical-border leading-[1.8] md:leading-[2] font-serif italic text-base md:text-xl lg:text-2xl space-y-8 md:space-y-12 ${isLight ? 'bg-white text-slate-700' : 'bg-black/20 text-text-main/90'}`}>
                                    <p className="whitespace-pre-line">{topic.roadmap}</p>
                                    <div className={`p-6 md:p-10 rounded-2xl md:rounded-[3rem] border-l-4 md:border-l-8 border-accent-gold bg-accent-gold/5`}>
                                        <h5 className="font-display font-black uppercase tracking-widest text-accent-gold mb-2 md:mb-4 text-[9px] md:text-sm">Neural Analogy</h5>
                                        <p>{topic.analogy}</p>
                                    </div>
                                    <p>{topic.practicalApplication}</p>
                                    <div className="pt-6 flex justify-center md:justify-start">
                                        <button onClick={onNarrate} className={`flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[8px] md:text-xs ${harveySpeaking ? 'bg-accent-blue text-dark-primary border-accent-blue animate-pulse' : 'text-accent-blue border-accent-blue/30 hover:bg-accent-blue/10'}`}>
                                            <Mic2 className="w-4 h-4 md:w-5 md:h-5" /> {harveySpeaking ? 'Neural_Broadcasting...' : 'Begin_Instructional_Sync'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-fade-in h-full">
                                <div className="glass-panel p-1 rounded-[2rem] md:rounded-[4rem] border-accent-blue/30 shadow-blue-bright h-[400px] md:h-[600px]"><Simulations type={topic.visualType} isLabMode={true} /></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-10">
                                    <div className={`glass-panel p-6 md:p-10 rounded-2xl md:rounded-[3rem] tactical-border ${isLight ? 'bg-white' : 'bg-dark-secondary/60'}`}>
                                        <h4 className="text-sm md:text-xl font-display font-black text-accent-gold uppercase tracking-widest mb-2 md:mb-4">Mindset Shift</h4>
                                        <p className="font-serif italic text-text-muted text-sm md:text-lg">"{topic.mindsetShift}"</p>
                                    </div>
                                    <div className={`glass-panel p-6 md:p-10 rounded-2xl md:rounded-[3rem] tactical-border ${isLight ? 'bg-white' : 'bg-dark-secondary/60'}`}>
                                        <h4 className="text-sm md:text-xl font-display font-black text-accent-blue uppercase tracking-widest mb-2 md:mb-4">Mnemonic Link</h4>
                                        <p className="font-serif italic text-text-muted text-sm md:text-lg">"{topic.mnemonic}"</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Diagnostic Matrix */}
                        <div className={`glass-panel p-6 md:p-12 lg:p-20 rounded-[2rem] md:rounded-[4rem] tactical-border space-y-8 md:space-y-12 ${isLight ? 'bg-white shadow-xl' : 'bg-midnight/60'}`}>
                            <div className="text-center space-y-2 md:space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[8px] font-black uppercase tracking-widest mb-2"><MonitorCheck className="w-3 h-3" /> Integrity Check</div>
                                <h3 className="text-xl md:text-4xl font-display font-black uppercase tracking-tight text-white">Diagnostic Verification</h3>
                                <p className="text-[10px] md:text-base text-text-muted italic">"Confirm neural synchronization via vector audit."</p>
                            </div>
                            
                            <div className="space-y-6 md:space-y-10">
                                <div className={`p-6 md:p-10 rounded-[2rem] border-2 text-center bg-black/20 ${isLight ? 'bg-slate-50' : ''}`}>
                                    <p className="text-base md:text-2xl font-serif italic text-white leading-relaxed">"{topic.assessment[0].question}"</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    {topic.assessment[0].options.map((opt, i) => {
                                        const isCorrect = i === topic.assessment[0].correctAnswer;
                                        const isSelected = selected === i;
                                        const showResult = verified;

                                        let buttonStyle = "border-white/5 hover:border-white/10";
                                        let iconStyle = "border-white/10";

                                        if (showResult) {
                                            if (isCorrect) {
                                                buttonStyle = "border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)] scale-105 z-10 animate-pulse";
                                                iconStyle = "bg-green-500 border-green-500 text-dark-primary";
                                            } else if (isSelected) {
                                                buttonStyle = "border-red-500 bg-red-500/10 opacity-100 animate-shake";
                                                iconStyle = "bg-red-500 border-red-500 text-white";
                                            } else {
                                                buttonStyle = "opacity-20 grayscale border-transparent";
                                            }
                                        } else if (isSelected) {
                                            buttonStyle = "border-accent-blue bg-accent-blue/10";
                                            iconStyle = "bg-accent-blue border-accent-blue text-dark-primary";
                                        }

                                        return (
                                            <button 
                                                key={i} 
                                                onClick={() => !verified && setSelected(i)} 
                                                className={`w-full text-left p-4 md:p-8 rounded-xl md:rounded-3xl border-2 transition-all duration-500 flex items-center gap-4 md:gap-6 group/opt ${buttonStyle}`}
                                            >
                                                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg border-2 flex items-center justify-center font-black text-[10px] md:text-xs shrink-0 transition-colors ${iconStyle}`}>
                                                    {showResult && isCorrect ? <CheckCircle2 className="w-5 h-5" /> : showResult && isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> : String.fromCharCode(65 + i)}
                                                </div>
                                                <span className="text-sm md:text-xl font-medium leading-tight">{opt}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {!verified ? (
                                    <button 
                                        disabled={selected === null} 
                                        onClick={handleVerify} 
                                        className="w-full btn-blue py-5 md:py-8 rounded-xl md:rounded-3xl font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-base shadow-blue-bright transition-all active:scale-95 disabled:opacity-20 disabled:grayscale"
                                    >
                                        Submit Vector Analysis
                                    </button>
                                ) : (
                                    <div className="space-y-6 md:space-y-8 animate-slide-up">
                                        <div className={`p-8 md:p-12 rounded-[2.5rem] border-2 relative overflow-hidden ${selected === topic.assessment[0].correctAnswer ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                                {selected === topic.assessment[0].correctAnswer ? <ShieldCheck className="w-24 h-24 text-green-500" /> : <AlertTriangle className="w-24 h-24 text-red-500" />}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`p-3 rounded-xl border-2 ${selected === topic.assessment[0].correctAnswer ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                                                    {selected === topic.assessment[0].correctAnswer ? <CheckCircle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h4 className={`font-display font-black uppercase tracking-widest text-lg ${selected === topic.assessment[0].correctAnswer ? 'text-green-500' : 'text-red-500'}`}>
                                                        {selected === topic.assessment[0].correctAnswer ? 'Resonance Confirmed' : 'Signal Rejected'}
                                                    </h4>
                                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Protocol Post-Analysis</p>
                                                </div>
                                            </div>

                                            <div className={`p-6 rounded-2xl bg-black/20 border border-white/5 font-serif italic text-base md:text-xl leading-relaxed ${selected === topic.assessment[0].correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                                                "{topic.harveyTakeaways}"
                                            </div>
                                        </div>

                                        <button onClick={onNext} className="btn-gold w-full py-5 md:py-8 rounded-xl md:rounded-[3rem] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-base shadow-gold-bright flex flex-col items-center group/next">
                                            <div className="flex items-center gap-3">
                                                <span>Resume Navigation</span>
                                                <FastForward className="w-5 h-5 group-hover/next:translate-x-2 transition-transform" />
                                            </div>
                                            <span className="text-[6px] md:text-[8px] opacity-40 mt-1 uppercase tracking-widest">Next Protocol Initiating</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tactical Comm Dock (Bottom) */}
            <div className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 md:gap-6 p-1.5 md:p-2 rounded-full backdrop-blur-3xl border border-white/10 bg-midnight/90 shadow-2xl animate-slide-up">
                <button onClick={onPrev} className="p-3 md:p-5 rounded-full hover:bg-white/5 text-text-muted hover:text-white transition-all active:scale-90"><ChevronLeft className="w-6 h-6 md:w-8 md:h-8" /></button>
                <div className="h-8 md:h-10 w-[1px] md:w-[1.5px] bg-white/10 mx-1 md:mx-2" />
                <div className="flex flex-col items-center gap-0.5 md:gap-1.5 px-2 md:px-6">
                    <div className="text-[6px] md:text-[8px] font-black text-accent-blue uppercase tracking-widest hidden xs:block">Progress</div>
                    <div className="flex gap-1 md:gap-2">
                        {module.topics.map((t, i) => (
                            <div key={t.id} onClick={() => onSelectTopic(i)} className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition-all ${t.id === topic.id ? 'bg-accent-blue scale-125 shadow-blue' : completedIds.has(t.id) ? 'bg-green-500/40' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
                <div className="h-8 md:h-10 w-[1px] md:w-[1.5px] bg-white/10 mx-1 md:mx-2" />
                <button onClick={onNext} className="p-3 md:p-5 rounded-full bg-accent-blue text-dark-primary shadow-blue hover:scale-110 active:scale-95 transition-all"><ChevronRight className="w-6 h-6 md:w-8 md:h-8" /></button>
            </div>
        </div>
    );
};

// ... Remaining components ...

const TheLexicon: React.FC<{ theme: string }> = ({ theme }) => {
    const [search, setSearch] = useState('');
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-20 custom-scrollbar h-full animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-8 md:space-y-16 pb-32">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-10">
                    <div className="space-y-4 md:space-y-6 flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 md:gap-4 px-4 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em]"><Book className="w-4 h-4" /> Semantic Database</div>
                        <h1 className={`text-4xl md:text-6xl lg:text-9xl font-display font-black text-white uppercase tracking-tighter luxury-text leading-none ${theme === 'light' ? '!filter-none' : ''}`}>The Lexicon</h1>
                    </div>
                    <div className="w-full lg:w-96 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-accent-gold/40" />
                        <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search diagnostic terms..." className={`w-full py-4 md:py-6 pl-14 md:pl-16 pr-6 md:pr-8 rounded-xl md:rounded-2xl border bg-black/20 text-white text-xs md:text-sm placeholder:text-text-muted/40 focus:border-accent-gold outline-none transition-all`} />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {glossaryTerms.filter(t => t.term.toLowerCase().includes(search.toLowerCase())).map((t, idx) => (
                        <div key={idx} className="glass-panel p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] tactical-border group hover:border-accent-gold/30 transition-all flex flex-col gap-4 md:gap-6">
                            <div className="flex justify-between items-center"><div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-accent-gold group-hover:scale-110 transition-transform"><Binary className="w-5 h-5 md:w-6 md:h-6" /></div><span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest opacity-40">{t.cat}</span></div>
                            <h3 className="text-xl md:text-3xl font-display font-black text-white uppercase tracking-tight leading-none">{t.term}</h3>
                            <p className="text-text-muted font-serif italic text-sm md:text-lg leading-relaxed">"{t.def}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NeuroDeck: React.FC<{ theme: string }> = ({ theme }) => (
    <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-20 custom-scrollbar h-full animate-fade-in">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-16 pb-32">
            <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 md:gap-4 text-accent-blue text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em]"><FlaskConical className="w-4 h-4" /> Simulation_Bay_v4.5</div>
                <h1 className={`text-4xl md:text-6xl lg:text-9xl font-display font-black text-white uppercase tracking-tighter luxury-text leading-none ${theme === 'light' ? '!filter-none' : ''}`}>Neuro Deck</h1>
                <p className="text-text-muted italic font-serif text-sm md:text-xl border-l-2 border-accent-blue/30 pl-4 md:pl-8 max-w-2xl mx-auto md:mx-0">"Vision & logic interactive labs. Adjust diagnostic vectors."</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                <div className="lg:col-span-8 space-y-6 md:space-y-8">
                    <div className="glass-panel p-1 rounded-2xl md:rounded-[4rem] border-accent-blue/30 shadow-blue-bright h-[400px] md:h-[700px]"><Simulations type="InteractivePhantomScan" isLabMode={true} /></div>
                </div>
                <div className="lg:col-span-4 space-y-6 md:space-y-8">
                    <div className="glass-panel p-6 md:p-10 rounded-2xl md:rounded-[3rem] tactical-border space-y-4 md:space-y-6">
                        <h4 className="text-base md:text-xl font-display font-black text-accent-gold uppercase tracking-widest">Logic: Resolution Vector</h4>
                        <div className="h-[250px] md:h-auto"><Simulations type="TransducerAnatomyVisual" /></div>
                    </div>
                    <div className="glass-panel p-6 md:p-10 rounded-2xl md:rounded-[3rem] tactical-border space-y-4 md:space-y-6">
                        <h4 className="text-base md:text-xl font-display font-black text-accent-blue uppercase tracking-widest">Vision: Doppler Shift</h4>
                        <div className="h-[250px] md:h-auto"><Simulations type="DopplerPrincipleVisual" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ModuleIntro: React.FC<{ module: Module, moduleIndex: number, theme: string, onComplete: () => void }> = ({ module, moduleIndex, theme, onComplete }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-midnight animate-fade-in p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />
            <div className="max-w-4xl w-full px-4 md:px-10 text-center relative z-10 space-y-8 md:space-y-12">
                <div className="space-y-2 md:space-y-4">
                    <div className="text-accent-blue text-[8px] md:text-[12px] font-black uppercase tracking-[0.5em] md:tracking-[1em] animate-pulse">Initializing Protocol_Sector_0{moduleIndex}</div>
                    <h1 className="text-4xl md:text-6xl lg:text-9xl font-display font-black uppercase tracking-tighter luxury-text leading-none">{module.title.split(':')[1] || module.title}</h1>
                </div>
                <div className="glass-panel p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] tactical-border text-left space-y-6 md:space-y-8 bg-black/40">
                    <div className="flex items-center gap-3 md:gap-4 text-accent-gold"><Zap className="w-5 h-5 md:w-6 md:h-6" /><span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Sector Intelligence Overview</span></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {module.topics.map((t, i) => (
                            <div key={t.id} className="flex items-center gap-3 md:gap-4 opacity-0 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center font-black text-[8px] md:text-[10px] text-accent-blue">0{i+1}</div>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80 truncate">{t.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={onComplete} className="btn-blue w-full md:w-auto px-10 md:px-24 py-5 md:py-10 rounded-xl md:rounded-[3rem] font-black text-lg md:text-2xl uppercase tracking-[0.3em] md:tracking-[0.6em] shadow-blue-bright transition-all active:scale-95">Commence Sync</button>
            </div>
        </div>
    );
};

export default CourseViewer;