
import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, Download, Zap, ShieldCheck, Key, Lock, Music, 
  Printer, ExternalLink, Database, Search, Filter, 
  Eye, BookOpen, Activity, Layout, Terminal, Sparkles, Loader2, Save, FastForward, Info, X
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from '../lib/supabase';

interface Asset {
  id: string;
  title: string;
  category: 'Strategy' | 'Reference' | 'Memory' | 'Data' | 'Monograph';
  description: string;
  content?: string;
  icon: React.ElementType;
  fileType: string;
  color: string;
  version: string;
  classification: string;
}

const initialAssets: Asset[] = [
  {
    id: 'doppler-mastery',
    title: 'Doppler Precision Protocol',
    category: 'Monograph',
    description: 'Deconstructing the Doppler equation for rapid color/spectral optimization.',
    icon: Activity,
    fileType: 'NEURAL_LINK',
    color: 'accent-blue',
    version: '4.5.0',
    classification: 'CLASS-S'
  },
  {
    id: 'aliasing-keys',
    title: 'Aliasing & Nyquist Control',
    category: 'Strategy',
    description: '3 tactical maneuvers to resolve aliasing without compromising frame rate.',
    icon: Key,
    fileType: 'TACTICAL_PDF',
    color: 'accent-gold',
    version: '4.2.1',
    classification: 'CLASS-A'
  },
];

const ReferenceLibrary: React.FC<{ onSyncReport?: (r: any) => void }> = ({ onSyncReport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [synthTopic, setSynthTopic] = useState('');
  const [customAssets, setCustomAssets] = useState<Asset[]>([]);
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);

  useEffect(() => {
      const loadCustom = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const { data } = await supabase.from('user_profiles').select('vault_entries').eq('user_id', user.id).maybeSingle();
          // Filter specifically for monograph items stored in vault_entries or a dedicated field
      };
      loadCustom();
  }, []);

  const filteredAssets = useMemo(() => {
    const all = [...initialAssets, ...customAssets];
    return all.filter(asset => {
      const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || asset.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, customAssets]);

  const handleSynthesize = async () => {
    if (!synthTopic.trim()) return;
    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Generate a structured technical monograph for: "${synthTopic}". Structure: Diagnostic Objective, Physical Equation, Clinical Manifestation, Optimization Steps. Professional, concise, high-fidelity style.`,
        });

        const newAsset: Asset = {
            id: `synth-${Date.now()}`,
            title: `Neural: ${synthTopic.substring(0, 15)}`,
            category: 'Monograph',
            description: `AI-Synthesized technical data on ${synthTopic}.`,
            content: response.text,
            icon: Sparkles,
            fileType: 'SYNTH_LOG',
            color: 'accent-blue',
            version: 'AUTO-GEN',
            classification: 'NEURAL-LINK'
        };

        setCustomAssets(prev => [newAsset, ...prev]);
        setSynthTopic('');
    } catch (e) {
        console.error("Synthesis failed");
    } finally { setIsGenerating(false); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-10 md:p-20 custom-scrollbar animate-fade-in bg-dark-primary/10 relative">
      <div className="max-w-7xl mx-auto space-y-16 pb-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-4"><div className="p-3 bg-accent-blue/20 rounded-xl border border-accent-blue/30 text-accent-blue shadow-blue"><Terminal className="w-6 h-6 animate-pulse" /></div><span className="text-[11px] font-black text-accent-blue uppercase tracking-[0.5em]">Central Archive</span></div>
            <h1 className="text-4xl md:text-9xl font-display font-black text-white uppercase tracking-tighter luxury-text leading-none">The Archives</h1>
          </div>
          <div className="w-full lg:w-96 glass-panel p-6 rounded-3xl border-accent-blue/20 space-y-4">
             <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-accent-blue" /><span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Synthesis Engine</span></div>
             <input type="text" placeholder="Domain focus (e.g. Bernoulli)..." value={synthTopic} onChange={e => setSynthTopic(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-accent-blue" />
             <button onClick={handleSynthesize} disabled={isGenerating || !synthTopic.trim()} className="w-full btn-blue py-3 rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">{isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Generate Protocol</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAssets.map(asset => (
                <div key={asset.id} className="glass-panel p-8 rounded-[3rem] border-white/5 bg-dark-secondary/60 tactical-border flex flex-col group hover:border-accent-blue/30 transition-all">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-white/5 rounded-2xl text-accent-blue group-hover:scale-110 transition-transform"><asset.icon className="w-6 h-6" /></div>
                        <span className="text-[8px] font-black uppercase px-3 py-1 bg-white/5 border border-white/10 rounded-full">{asset.classification}</span>
                    </div>
                    <h3 className="text-2xl font-display font-black text-white uppercase mb-4 tracking-tight group-hover:text-accent-blue transition-colors">{asset.title}</h3>
                    <p className="text-sm text-text-muted italic leading-relaxed mb-10 flex-1">"{asset.description}"</p>
                    <button onClick={() => setViewingAsset(asset)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-blue hover:text-dark-primary transition-all flex items-center justify-center gap-3"><Eye className="w-4 h-4" /> Open Dossier</button>
                </div>
            ))}
        </div>
      </div>

      {viewingAsset && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-fade-in">
              <div className="absolute inset-0 bg-midnight/95 backdrop-blur-3xl" onClick={() => setViewingAsset(null)} />
              <div className="relative w-full max-w-3xl max-h-[80vh] glass-panel rounded-[3.5rem] border-accent-blue/40 bg-dark-secondary/95 shadow-blue-bright flex flex-col overflow-hidden animate-slide-up">
                  <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/40">
                      <div className="flex items-center gap-4"><div className="p-3 bg-accent-blue/10 rounded-xl text-accent-blue"><BookOpen className="w-6 h-6" /></div><div><h4 className="text-xl font-display font-black text-white uppercase tracking-widest">{viewingAsset.title}</h4><p className="text-[9px] font-black text-accent-blue/60 uppercase tracking-[0.4em]">{viewingAsset.version}</p></div></div>
                      <button onClick={() => setViewingAsset(null)} className="p-3 bg-white/5 rounded-xl text-text-muted hover:text-white"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                      <div className="flex items-center gap-3 p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-2xl">
                          <Info className="w-5 h-5 text-accent-blue" />
                          <p className="text-xs text-text-muted font-sans italic">Classification: {viewingAsset.classification} Technical Monograph. Proceed with analytical focus.</p>
                      </div>
                      <div className="font-mono text-sm text-text-main leading-relaxed whitespace-pre-line border-l-2 border-accent-blue/20 pl-8">
                          {viewingAsset.content || viewingAsset.description + "\n\nFull diagnostic dataset available in Command Hub remediation vectors."}
                      </div>
                  </div>
                  <div className="p-8 bg-black/40 border-t border-white/5 flex justify-center"><button onClick={() => setViewingAsset(null)} className="btn-blue px-12 py-4 rounded-xl font-black uppercase tracking-widest text-[10px]">Acknowledge Vector</button></div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ReferenceLibrary;
