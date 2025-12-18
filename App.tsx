
import React, { useState } from 'react';
import { 
  BarChart3, 
  Clapperboard, 
  Settings, 
  TrendingUp, 
  Cpu, 
  Monitor,
  Music,
  Download,
  Play,
  FileText,
  Zap,
  CheckCircle2,
  Copy,
  FileDown,
  Trash2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { SCENES, RETENTION_DATA, FILM_TITLE, PHASES } from './constants';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 translate-x-1' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
  >
    <Icon size={18} />
    <span className="font-bold text-xs uppercase tracking-wider">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyzing, setAnalyzing] = useState(false);
  const [script, setScript] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleScriptAnalysis = async () => {
    if (!script.trim()) return;
    setAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // The prompt is engineered for extreme detail as requested
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a world-class senior film editor with 20+ years of experience shaping Oscar-winning narratives. 
        Analyze the following script for a YouTube drama titled "${FILM_TITLE}". 
        
        Provide an exhaustive, frame-accurate editing blueprint. DO NOT SUMMARIZE. Provide instructions FOR EVERY SINGLE LINE and beat of the script.
        
        Follow this EXACT structure and tone:
        
        Intro: "As your editor, with 20+ years experience shaping Oscar-winning narratives, I see '${FILM_TITLE}' as a deep dive into [theme]. Scene [X] is crucial for [reason]. My approach will be to meticulously control pacing..."
        
        ---
        # SCENE [Number]: [Title/Setting]
        
        ## Emotional Pacing Strategy:
        [Detailed paragraph on rhythm, tension, and audience psychology]
        
        ## Shot List and Editing Instructions:
        [Provide a detailed list of shots. For EACH and EVERY line of dialogue and action, define a specific shot:]
        
        ### Shot [N]
        * **Type:** [e.g., CU, MCU, TCU, MWS, OTS]
        * **Timing:** [Seconds, e.g., 2.5s]
        * **Content:** [Visual description of what is happening]
        * **Dialogue:** [The specific line covered]
        * **Transition:** [e.g., Hard Cut, J-Cut, L-Cut]
        * **Audio:** [SFX/Music details, e.g., Sub-bass swell, low drone]
        * **Color Grading:** [Specific look for this shot]
        * **Emotional Pacing:** [Why this specific cut maintains 70%+ retention]
        
        [Continue for every line until the scene is finished]
        
        ---
        ## Technical Specifications & Workflow Notes:
        [Export specs, aspect ratio, frame rate, bin organization, and proxy workflow]

        Script to analyze:
        ${script}`,
      });
      setAnalysisResult(response.text);
    } catch (error) {
      console.error(error);
      setAnalysisResult("Error: Script optimization failed. Ensure your API key is valid and try a shorter segment if the script is massive.");
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      const headers = "Name,In,Out,Description,Color\n";
      const rows = SCENES.map(s => `"${s.title}",${s.timestamp},,${s.retentionHook},Red`).join('\n');
      downloadFile(headers + rows, `${FILM_TITLE}_MARKERS.csv`, 'text/csv');
      setExporting(false);
    }, 800);
  };

  const handleExportBlueprint = () => {
    if (!analysisResult) return;
    downloadFile(analysisResult, `${FILM_TITLE}_EDIT_BLUEPRINT.md`, 'text/markdown');
  };

  const copyToClipboard = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 selection:bg-red-500/40 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-900 flex flex-col p-8 gap-10 bg-[#080808] shrink-0 z-20">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/40 group-hover:scale-110 transition-transform duration-300">
            <Play size={24} fill="white" stroke="white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-xl tracking-tighter leading-none">VOW-CORE</h1>
            <span className="text-[10px] font-bold text-red-600 tracking-[0.3em] mt-1">OPTIMIZER PRO</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={BarChart3} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={FileText} label="Script Optimizer" active={activeTab === 'script'} onClick={() => setActiveTab('script')} />
          <SidebarItem icon={Clapperboard} label="Scene Analysis" active={activeTab === 'breakdown'} onClick={() => setActiveTab('breakdown')} />
          <SidebarItem icon={TrendingUp} label="Retention Map" active={activeTab === 'retention'} onClick={() => setActiveTab('retention')} />
          <SidebarItem icon={Settings} label="Export Engine" active={activeTab === 'export'} onClick={() => setActiveTab('export')} />
        </nav>

        <div className="p-5 bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-zinc-800 shadow-xl">
          <p className="text-[10px] text-zinc-500 font-black mb-4 uppercase tracking-widest flex items-center gap-2">
            <Zap size={10} className="text-red-600" fill="currentColor"/> Pulse Check
          </p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400">Viral Load</span>
            <span className="text-xs font-black text-green-500">92%</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full w-[92%] animate-pulse"></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_#0f0f0f_0%,_#050505_100%)] relative">
        
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-3xl bg-black/60 border-b border-zinc-900/50 px-12 py-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase italic flex items-center gap-3">
              {FILM_TITLE}
              <span className="not-italic text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-md tracking-widest font-bold">OPTIMIZING</span>
            </h2>
            <p className="text-zinc-600 text-xs font-bold tracking-widest mt-2 uppercase">Ready for Algorithmic Injection</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden xl:flex items-center gap-8 text-[10px] font-black text-zinc-500 tracking-widest border-r border-zinc-900 pr-8 mr-2">
                <span className="flex items-center gap-2 hover:text-white transition-colors cursor-help"><Monitor size={14} className="text-red-600"/> 4K HDR MASTER</span>
                <span className="flex items-center gap-2 hover:text-white transition-colors cursor-help"><Music size={14} className="text-red-600"/> 48KHZ SPATIAL</span>
             </div>
             <button className="bg-white text-black hover:scale-105 active:scale-95 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-white/10">
                Generate Preview
             </button>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] mx-auto min-h-screen">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
               {/* Stats Row */}
               <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { label: 'Retention Peak', value: '88%', sub: 'Target Met', color: 'text-red-600' },
                   { label: 'Watch Velocity', value: '4.2x', sub: 'Algorithm Favor', color: 'text-white' },
                   { label: 'CTR Forecast', value: '9.1%', sub: 'High Hook Strength', color: 'text-white' }
                 ].map((stat, i) => (
                   <div key={i} className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/50 p-10 rounded-[2.5rem] hover:border-red-900/50 transition-all duration-300 cursor-default group shadow-2xl">
                     <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 group-hover:text-red-600 transition-colors">{stat.label}</p>
                     <p className={`text-6xl font-black ${stat.color} mb-3 tracking-tighter italic`}>{stat.value}</p>
                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{stat.sub}</p>
                   </div>
                 ))}
               </div>

               {/* Pipeline */}
               <div className="col-span-12 bg-zinc-950/40 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md">
                  <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-black/20">
                    <h3 className="font-black text-xs flex items-center gap-4 uppercase tracking-[0.3em]"><Settings size={18} className="text-red-600"/> The Workflow Blueprint</h3>
                    <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                       <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-zinc-900">
                    {PHASES.map((phase, idx) => (
                      <div key={idx} className="p-12 group hover:bg-white/[0.01] transition-all duration-500">
                        <span className="text-[10px] text-red-600 font-black uppercase tracking-[0.4em] block mb-4">PHASE 0{idx+1}</span>
                        <h4 className="font-black text-2xl mb-8 group-hover:text-white transition-colors uppercase italic tracking-tighter">{phase.title}</h4>
                        <ul className="space-y-5">
                          {phase.tasks.map((task, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-4 text-sm text-zinc-500 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">
                              <CheckCircle2 size={20} className="text-zinc-800 mt-0.5 shrink-0 group-hover:text-red-600 transition-colors" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-8 duration-500 h-[calc(100vh-280px)]">
              {/* Editor Pane */}
              <div className="lg:col-span-5 bg-black border border-zinc-900 rounded-[3rem] flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                <div className="px-10 py-8 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={14} className="text-red-600"/> Script Input
                    </span>
                    <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mt-1">Source Material</span>
                  </div>
                  <button onClick={() => setScript('')} className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-600 hover:text-red-600 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea 
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="PASTE YOUR RAW SCREENPLAY OR SCENE NOTES HERE FOR DEEP ALGORITHMIC ANALYSIS..."
                  className="flex-1 p-12 bg-transparent border-none focus:ring-0 text-sm mono leading-relaxed text-zinc-400 resize-none placeholder:text-zinc-900 scrollbar-none font-medium"
                />
                <div className="p-10 border-t border-zinc-900 bg-zinc-950/50">
                  <button 
                    onClick={handleScriptAnalysis}
                    disabled={analyzing || !script}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-800 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-red-900/30 active:scale-95 active:shadow-none"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-5 h-5 border-[3px] border-white border-t-transparent animate-spin rounded-full"></div>
                        MAPPING NARRATIVE BEATS...
                      </>
                    ) : (
                      <>
                        <Zap size={20} fill="currentColor" /> Generate Master Blueprint
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output Pane */}
              <div className="lg:col-span-7 bg-[#080808]/80 border border-zinc-900 rounded-[3rem] flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="px-10 py-8 border-b border-zinc-900 flex justify-between items-center bg-black/40">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                      <Cpu size={14}/> Edit Instruction Matrix
                    </span>
                    <span className="text-[8px] font-bold text-zinc-700 uppercase tracking-widest mt-1">Algorithmic Output (V4.2)</span>
                  </div>
                  {analysisResult && (
                    <div className="flex gap-3">
                       <button onClick={copyToClipboard} className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all text-zinc-400 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                          <Copy size={14} /> Copy
                       </button>
                       <button onClick={handleExportBlueprint} className="p-3 bg-red-600 hover:bg-red-500 rounded-xl transition-all text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20">
                          <FileDown size={14} /> Download (.MD)
                       </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-12 overflow-y-auto custom-scrollbar-red bg-zinc-950/20">
                  {analysisResult ? (
                    <div className="max-w-none text-zinc-300 space-y-12 animate-in fade-in zoom-in-95 duration-1000">
                      <div className="prose prose-invert prose-red max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-[2.2] tracking-wide text-zinc-400 bg-transparent border-none p-0">
                          {analysisResult}
                        </pre>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 pt-12 border-t border-zinc-900/50">
                        <div className="p-8 bg-red-600/5 rounded-3xl border border-red-900/20 group hover:bg-red-600/10 transition-colors">
                          <p className="text-[10px] font-black text-red-900 uppercase tracking-[0.3em] mb-3">RETENTION LOCK</p>
                          <p className="text-red-500 font-black text-2xl italic tracking-tighter group-hover:scale-105 transition-transform origin-left">FRAME-ACCURATE</p>
                        </div>
                        <div className="p-8 bg-zinc-900/50 rounded-3xl border border-zinc-800/50">
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3">ENGINE CONFIDENCE</p>
                          <p className="text-white font-black text-2xl tracking-tighter">99.4% VALIDATED</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-20">
                      <div className="w-24 h-24 bg-zinc-900/50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-zinc-800 group hover:border-red-600/50 transition-all duration-500">
                        <Cpu size={48} className="text-zinc-700 group-hover:text-red-600 transition-colors" />
                      </div>
                      <h4 className="font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 text-sm">Engine Status: Idle</h4>
                      <p className="text-zinc-600 text-xs font-bold leading-relaxed max-w-sm uppercase tracking-widest opacity-60">
                        Submit a scene for a comprehensive, shot-by-shot editing masterclass optimized for viewer retention.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/40 border-b border-zinc-900">
                      <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Timestamp</th>
                      <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Beat Identifier</th>
                      <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Retention Anchor</th>
                      <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Pacing Engine</th>
                      <th className="px-10 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {SCENES.map((scene) => (
                      <tr key={scene.id} className="hover:bg-red-600/[0.02] group transition-all duration-300">
                        <td className="px-10 py-8 text-sm font-black mono text-red-600 italic tracking-tighter group-hover:translate-x-1 transition-transform">{scene.timestamp}</td>
                        <td className="px-10 py-8">
                          <div className="text-sm font-black text-white uppercase italic tracking-tight group-hover:text-red-500 transition-colors mb-1">{scene.title}</div>
                          <div className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{scene.seoMoment}</div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-[10px] font-black bg-zinc-900/80 text-zinc-400 px-5 py-2.5 rounded-full border border-zinc-800 uppercase tracking-widest group-hover:border-red-900 transition-colors">
                            {scene.retentionHook}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{scene.pacing}</td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                             <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Optimized</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'retention' && (
            <div className="space-y-10 animate-in zoom-in-95 duration-700">
              <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.6)] backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20 relative z-10">
                  <div>
                    <h3 className="text-5xl font-black mb-4 tracking-tighter uppercase italic leading-none">Retention Mapping</h3>
                    <p className="text-zinc-500 text-sm font-bold tracking-wide max-w-xl">Live algorithmic simulation of viewer cognitive load and drop-off probability across the 30-minute master edit.</p>
                  </div>
                  <div className="flex items-center gap-10 bg-black/60 px-10 py-5 rounded-[2.5rem] border border-zinc-800/80 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.7)]"></div>
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em]">VOW Prediction</span>
                    </div>
                    <div className="flex items-center gap-4 border-l border-zinc-800 pl-10">
                      <div className="w-5 h-5 rounded-full bg-zinc-800"></div>
                      <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.3em]">Industry Par</span>
                    </div>
                  </div>
                </div>

                <div className="h-[500px] w-full relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={RETENTION_DATA}>
                      <defs>
                        <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#dc2626" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="5 5" stroke="#1a1a1a" vertical={false} />
                      <XAxis 
                        dataKey="time" 
                        stroke="#333" 
                        fontSize={12} 
                        tickFormatter={(v) => `${v}M`}
                        axisLine={false}
                        tickLine={false}
                        fontFamily="JetBrains Mono"
                        fontWeight="black"
                        dy={20}
                      />
                      <YAxis 
                        stroke="#333" 
                        fontSize={12} 
                        domain={[0, 100]} 
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                        fontFamily="JetBrains Mono"
                        fontWeight="black"
                        dx={-20}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '24px', boxShadow: '0 40px 80px -10px rgba(0, 0, 0, 0.9)', padding: '20px' }}
                        itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        cursor={{ stroke: '#dc2626', strokeWidth: 4, strokeDasharray: '8 8' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="retention" 
                        stroke="#dc2626" 
                        strokeWidth={6}
                        fillOpacity={1} 
                        fill="url(#colorRet)" 
                        animationDuration={3500}
                        strokeLinecap="round"
                        activeDot={{ r: 10, fill: '#fff', stroke: '#dc2626', strokeWidth: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mt-24 relative z-10">
                   {RETENTION_DATA.filter(d => d.label !== "").slice(0, 5).map((point, idx) => (
                     <div key={idx} className="bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50 group hover:border-red-600/50 transition-all duration-500 cursor-default shadow-xl">
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-4 group-hover:text-red-600 transition-colors">{point.label}</p>
                        <p className="text-4xl font-black text-white mb-4 tracking-tighter italic group-hover:scale-105 transition-transform origin-left">{point.retention}%</p>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                           <div className="bg-red-600 h-full shadow-[0_0_15px_rgba(220,38,38,0.8)] transition-all duration-1000 ease-out" style={{ width: `${point.retention}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700">
               <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 shadow-2xl backdrop-blur-md relative overflow-hidden">
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full -ml-32 -mb-32"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20 relative z-10">
                    <div>
                       <h3 className="text-5xl font-black mb-4 tracking-tighter uppercase italic leading-none">Export Hub</h3>
                       <p className="text-zinc-500 text-sm font-bold tracking-wide">Synthesizing master assets for global algorithmic deployment.</p>
                    </div>
                    <div className="flex flex-col gap-4 w-full md:w-auto">
                      <button 
                        onClick={handleExportCSV}
                        disabled={exporting}
                        className="group bg-red-600 hover:bg-red-500 text-white font-black py-6 px-12 rounded-[2rem] flex items-center justify-center gap-5 transition-all shadow-[0_20px_40px_rgba(220,38,38,0.3)] active:scale-95 disabled:opacity-50"
                      >
                        {exporting ? (
                          <>
                            <div className="w-6 h-6 border-[4px] border-white border-t-transparent animate-spin rounded-full"></div>
                            ENCODING...
                          </>
                        ) : (
                          <>
                            <Download size={24} className="group-hover:translate-y-2 transition-transform duration-300" /> 
                            <span className="tracking-[0.2em] text-xs">MASTER MARKER LIST (.CSV)</span>
                          </>
                        )}
                      </button>
                      {analysisResult && (
                        <button 
                          onClick={handleExportBlueprint}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white font-black py-5 px-12 rounded-[2rem] flex items-center justify-center gap-5 transition-all border border-zinc-800"
                        >
                          <FileText size={20} className="text-red-600"/> 
                          <span className="tracking-[0.2em] text-[10px]">EDITING BLUEPRINT (.MD)</span>
                        </button>
                      )}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 relative z-10">
                   <div className="space-y-10">
                      <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] border-b border-zinc-900 pb-8">Encoding Protocol</h4>
                      {[
                        { label: '4K H.264 HEVC HDR', val: '45.0 MBPS', color: 'text-red-600' },
                        { label: 'Metadata Injector', val: 'INJECTED', color: 'text-zinc-100' },
                        { label: 'Loudness Compliance', val: '-14 LUFS', color: 'text-zinc-100' }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                           <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</span>
                           <span className={`text-xs font-black mono ${item.color} italic tracking-widest`}>{item.val}</span>
                        </div>
                      ))}
                   </div>
                   <div className="space-y-10">
                      <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] border-b border-zinc-900 pb-8">Asset Containers</h4>
                      {[
                        { label: 'Thumb 19:6 Ultra-Contrast', val: 'VERIFIED', color: 'text-zinc-100' },
                        { label: 'Dynamic Chapters SRT', val: 'GENERATED', color: 'text-red-600' },
                        { label: 'Post-Roll Buffer', val: '20.0 SEC', color: 'text-zinc-100' }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-zinc-900/40 p-6 rounded-3xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                           <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</span>
                           <span className={`text-xs font-black mono ${item.color} italic tracking-widest`}>{item.val}</span>
                        </div>
                      ))}
                   </div>
                 </div>

                 <div className="p-12 bg-red-600/[0.03] rounded-[3rem] border border-dashed border-red-900/40 text-center relative z-10 group">
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-xl mx-auto group-hover:text-zinc-400 transition-colors">
                      "BURNING VOWS" IS NOW FULLY COMPLIANT WITH CURRENT YOUTUBE NARRATIVE ENGAGEMENT STANDARDS. <br/>
                      <span className="text-red-600 mt-2 block tracking-widest">ALGORITHM TOKEN: VOW_882_PR_MASTER</span>
                    </p>
                 </div>
               </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Scroll Bar Styles */}
      <style>{`
        .custom-scrollbar-red::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-red::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar-red::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        .custom-scrollbar-red::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
        pre {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        pre::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;
