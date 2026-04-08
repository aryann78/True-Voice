
import React, { useState, useCallback, useRef, useEffect } from 'react';
import AudioUploader from './components/AudioUploader.tsx';
import SpectrogramView from './components/SpectrogramView.tsx';
import ModelIntrospection from './components/ModelIntrospection.tsx';
import ResourceOverlay from './components/ResourceOverlay.tsx';
import { detectVoiceAuthenticity } from './services/geminiService.ts';
import { Classification, DetectionResult } from './types.ts';
import { Play, Pause, X, BookOpen, Microscope, ShieldCheck, Mail, ArrowLeft, ArrowRight, Download, ExternalLink, Menu, Sparkles, Fingerprint, Activity, Info, BarChart3, Clock, Globe, ShieldAlert, CheckCircle2, Heart, FileText, Share2, Printer, AlertTriangle, ScanLine, Cpu, Radio, Hash, Split, Database, Shield } from 'lucide-react';

type ResourceId = 'whitepaper' | 'datasets' | 'compliance' | null;

const FooterSignature: React.FC<{ light?: boolean }> = ({ light = false }) => (
  <div className="flex flex-col items-center space-y-4 py-8 group">
    <div className={`w-12 h-[1px] transition-all duration-700 ${light ? 'bg-white opacity-20' : 'bg-[var(--text-primary)] opacity-10'} group-hover:w-24 group-hover:opacity-40`}></div>
    <p className={`flex items-center space-x-3 transition-all duration-700 ${light ? 'text-white' : 'text-[var(--text-primary)]'}`}>
      <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-40">made with</span>
      <span className="relative flex items-center justify-center">
        <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-red-400 opacity-20"></span>
        <span className="text-red-500 text-[10px] relative">❤️</span>
      </span>
      <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-40">by</span>
      <span className="serif text-xl italic font-medium tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">Aryan jani</span>
    </p>
  </div>
);

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = Math.floor(value * 100);
        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3); 
            
            setCount(Math.floor(start + (end - start) * easeOut));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [value]);

    return <span>{count}</span>;
};

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [base64Audio, setBase64Audio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<ResourceId>(null);
  
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (result) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [result]);

  const reset = useCallback(() => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch(e) {}
    }
    setResult(null);
    setAudioBuffer(null);
    setFileName(null);
    setBase64Audio(null);
    setError(null);
    setIsPlaying(false);
    setIsMenuOpen(false);
    setActiveResource(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAudioLoad = useCallback((buffer: AudioBuffer, name: string, base64: string) => {
    setAudioBuffer(buffer);
    setFileName(name);
    setBase64Audio(base64);
    setResult(null);
    setError(null);
    setIsPlaying(false);
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch(e) {}
    }
  }, []);

  const handleExport = () => {
    if (!result || !fileName) return;
    
    let classificationText = "UNKNOWN";
    let accentColor = "#666";
    let bgGradient = "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)";
    let glowColor = "rgba(255, 255, 255, 0.1)";
    
    if (result.classification === Classification.HUMAN) {
        classificationText = "ORGANIC HUMAN";
        accentColor = "#10b981"; // Emerald
        glowColor = "rgba(16, 185, 129, 0.2)";
    } else if (result.classification === Classification.AI_GENERATED) {
        classificationText = "SYNTHETIC AI";
        accentColor = "#ef4444"; // Red
        glowColor = "rgba(239, 68, 68, 0.2)";
    } else if (result.classification === Classification.HYBRID) {
        classificationText = "HYBRID / TAMPERED";
        accentColor = "#f59e0b"; // Amber
        glowColor = "rgba(245, 158, 11, 0.2)";
    }
    
    const caseId = `TV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const reportHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Forensic Certificate - ${fileName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,700;1,400&family=JetBrains+Mono:wght@300;400;700&family=Inter:wght@300;400;700&display=swap" rel="stylesheet">
          <style>
              :root {
                  --accent: ${accentColor};
                  --glow: ${glowColor};
                  --bg: #0a0a0a;
              }
              * { box-sizing: border-box; }
              body { 
                  margin: 0; 
                  padding: 40px; 
                  background-color: #111; 
                  color: #fff; 
                  font-family: 'Inter', sans-serif;
                  display: flex;
                  justify-content: center;
                  min-height: 100vh;
              }
              .certificate {
                  max-width: 900px;
                  width: 100%;
                  background: ${bgGradient};
                  border: 1px solid rgba(255,255,255,0.1);
                  border-radius: 40px;
                  position: relative;
                  overflow: hidden;
                  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                  padding: 60px;
              }
              .certificate::before {
                  content: '';
                  position: absolute;
                  top: 0; left: 0; right: 0; height: 4px;
                  background: var(--accent);
                  box-shadow: 0 0 20px var(--accent);
              }
              .grid-bg {
                  position: absolute;
                  inset: 0;
                  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                  background-size: 30px 30px;
                  pointer-events: none;
                  opacity: 0.5;
              }
              .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 60px;
                  position: relative;
              }
              .logo-area {
                  font-family: 'Crimson Pro', serif;
                  font-size: 28px;
                  font-style: italic;
                  letter-spacing: -1px;
              }
              .case-id {
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 10px;
                  letter-spacing: 3px;
                  color: rgba(255,255,255,0.4);
                  text-transform: uppercase;
              }
              .main-verdict {
                  text-align: center;
                  margin: 40px 0;
                  position: relative;
              }
              .verdict-tag {
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 11px;
                  letter-spacing: 5px;
                  color: var(--accent);
                  text-transform: uppercase;
                  margin-bottom: 20px;
                  display: block;
              }
              .verdict-value {
                  font-family: 'Crimson Pro', serif;
                  font-size: 64px;
                  font-style: italic;
                  margin: 0;
                  color: #fff;
                  text-shadow: 0 0 30px var(--glow);
              }
              .score-container {
                  margin: 40px auto;
                  width: 200px;
                  height: 200px;
                  border-radius: 50%;
                  border: 1px solid rgba(255,255,255,0.1);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  background: rgba(255,255,255,0.02);
              }
              .score-container::after {
                  content: '';
                  position: absolute;
                  inset: -10px;
                  border: 2px solid var(--accent);
                  border-radius: 50%;
                  opacity: 0.3;
                  clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%);
              }
              .score-value {
                  font-size: 52px;
                  font-weight: 300;
                  margin: 0;
              }
              .score-label {
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 8px;
                  letter-spacing: 2px;
                  color: rgba(255,255,255,0.4);
                  margin-top: 5px;
              }
              .section {
                  margin-top: 60px;
                  border-top: 1px solid rgba(255,255,255,0.1);
                  padding-top: 30px;
              }
              .section-title {
                  font-family: 'JetBrains Mono', monospace;
                  font-size: 10px;
                  letter-spacing: 3px;
                  color: var(--accent);
                  margin-bottom: 20px;
                  text-transform: uppercase;
              }
              .report-text {
                  font-family: 'Inter', sans-serif;
                  font-size: 16px;
                  line-height: 1.8;
                  font-weight: 300;
                  color: rgba(255,255,255,0.8);
              }
              .meta-grid {
                  display: grid;
                  grid-template-cols: repeat(3, 1fr);
                  gap: 30px;
                  margin-top: 40px;
              }
              .meta-item {
                  background: rgba(255,255,255,0.03);
                  padding: 20px;
                  border-radius: 15px;
                  border: 1px solid rgba(255,255,255,0.05);
              }
              .meta-label {
                  font-size: 9px;
                  font-family: 'JetBrains Mono', monospace;
                  color: rgba(255,255,255,0.4);
                  margin-bottom: 8px;
                  text-transform: uppercase;
              }
              .meta-value {
                  font-size: 14px;
                  color: #fff;
              }
              .footer {
                  margin-top: 80px;
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  color: rgba(255,255,255,0.2);
                  font-size: 10px;
                  font-family: 'JetBrains Mono', monospace;
              }
              .stamp {
                  width: 100px;
                  height: 100px;
                  border: 2px solid var(--accent);
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  font-size: 8px;
                  font-weight: bold;
                  text-transform: uppercase;
                  color: var(--accent);
                  opacity: 0.6;
                  transform: rotate(-15deg);
                  line-height: 1.2;
              }
              @media print {
                  body { padding: 0; background: #fff; color: #000; }
                  .certificate { box-shadow: none; border: 1px solid #ddd; }
                  .grid-bg { display: none; }
              }
          </style>
      </head>
      <body>
          <div class="certificate">
              <div class="grid-bg"></div>
              
              <div class="header">
                  <div>
                      <div class="logo-area">TrueVoice</div>
                      <div class="case-id">FORENSIC SIGNAL ANALYSIS</div>
                  </div>
                  <div style="text-align: right">
                      <div class="case-id">CASE ID: ${caseId}</div>
                      <div class="case-id" style="margin-top: 5px">${new Date().toLocaleDateString()} // ${new Date().toLocaleTimeString()}</div>
                  </div>
              </div>

              <div class="main-verdict">
                  <span class="verdict-tag">System Conclusion</span>
                  <h1 class="verdict-value">${classificationText}</h1>
                  
                  <div class="score-container">
                      <p class="score-value">${(result.confidence * 100).toFixed(1)}%</p>
                      <p class="score-label">MATCH PROBABILITY</p>
                  </div>
              </div>

              <div class="section">
                  <div class="section-title">Forensic Syntax Report</div>
                  <div class="report-text">
                      ${result.analysis_report}
                  </div>
              </div>

              <div class="meta-grid">
                  <div class="meta-item">
                      <div class="meta-label">Signal Source</div>
                      <div class="meta-value" style="word-break: break-all">${fileName}</div>
                  </div>
                  <div class="meta-item">
                      <div class="meta-label">Native Lexicon</div>
                      <div class="meta-value">${result.language || 'NEURAL-UNCERTAIN'}</div>
                  </div>
                  <div class="meta-item">
                      <div class="meta-label">Telemetry Engine</div>
                      <div class="meta-value">${result.model_version}</div>
                  </div>
              </div>

              <div class="footer">
                  <div>
                      &copy; TRUEVOICE RESEARCH LABS<br>
                      NON-REPUDIATION SECURED<br>
                      ISO-27001 COMPLIANT SYSTEM
                  </div>
                  <div class="stamp">
                      TRUEVOICE<br>CERTIFIED<br>GENUINE
                  </div>
                  <div style="text-align: right">
                      AUTHORIZED SIGNATURE<br>
                      <span style="font-family: 'Crimson Pro', serif; font-size: 18px; color: rgba(255,255,255,0.5); font-style: italic">Aryan Jani</span>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TrueVoice-Report-${caseId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const runDetection = async () => {
    if (!base64Audio || !audioBuffer) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const detection = await detectVoiceAuthenticity(base64Audio, audioBuffer.duration);
      setResult(detection);
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred during analysis.";
      setError(msg);
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioBuffer) return;
    if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioCtxRef.current = new AudioContextClass();
        } else {
            setError("Audio playback is not supported on this browser.");
            return;
        }
    }
    if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
    }
    if (isPlaying) {
      if (audioSourceRef.current) {
        try { audioSourceRef.current.stop(); } catch(e) {}
        audioSourceRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtxRef.current.destination);
      source.onended = () => setIsPlaying(false);
      source.start(0);
      audioSourceRef.current = source;
      setIsPlaying(true);
    }
  };

  const getUIState = () => {
      if (!result) return { bg: 'bg-[var(--bg-primary)]', accent: '', icon: null, text: '' };
      switch(result.classification) {
          case Classification.HUMAN:
              return {
                  bg: 'bg-[#2a3628]',
                  glow: 'bg-green-500',
                  accent: 'emerald',
                  icon: <Fingerprint size={24} className="text-emerald-400" />,
                  text: 'Human',
                  textClass: 'text-emerald-100',
                  desc: "Detected organic breath dynamics and natural noise floor."
              };
          case Classification.AI_GENERATED:
              return {
                  bg: 'bg-[#3d2b24]',
                  glow: 'bg-red-500',
                  accent: 'red',
                  icon: <Radio size={24} className="text-red-400" />,
                  text: 'AI Synthetic',
                  textClass: 'text-red-100',
                  desc: "Detected digital silence and spectral consistency artifacts."
              };
          case Classification.HYBRID:
              return {
                  bg: 'bg-[#3d3624]',
                  glow: 'bg-amber-500',
                  accent: 'amber',
                  icon: <Split size={24} className="text-amber-400" />,
                  text: 'Hybrid / Mixed',
                  textClass: 'text-amber-100',
                  desc: "Detected distinct transition between organic and synthetic audio segments."
              };
          default:
             return { bg: 'bg-gray-900', glow: 'bg-gray-500', accent: 'gray', icon: null, text: 'Unknown', textClass: 'text-white', desc: '' };
      }
  };

  const ui = getUIState();

  const openResource = (id: ResourceId) => {
    setActiveResource(id);
    setIsMenuOpen(false);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-1000 selection:bg-white selection:bg-opacity-20 ${ui.bg}`}>
      
      {/* Navigation */}
      <nav className={`h-24 flex items-center justify-between px-8 md:px-12 fixed w-full top-0 z-50 transition-all duration-700 ${result ? 'bg-transparent' : 'bg-[#6d5d51]'}`}>
        <button onClick={reset} className={`serif text-2xl tracking-tight font-medium transition-colors ${result ? 'text-white/90' : 'text-[#f9f7f2]'}`}>TrueVoice</button>
        
        {!result && (
          <div className="hidden md:flex items-center space-x-8">
             <button onClick={() => openResource('compliance')} className="text-[#efece4] hover:text-white text-sm font-medium transition-colors">Context</button>
             <button onClick={() => openResource('whitepaper')} className="text-[#efece4] hover:text-white text-sm font-medium transition-colors">Technology</button>
             <div className="w-[1px] h-4 bg-[#efece4] opacity-20 mx-2"></div>
             <button onClick={() => setIsMenuOpen(true)} className="text-[#efece4] hover:text-white transition-colors p-2">
               <Menu size={20} strokeWidth={1.5} />
             </button>
          </div>
        )}
        
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`md:hidden p-2 ${result ? 'text-white' : 'text-[#efece4]'}`}>
          {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
        </button>
      </nav>

      <main className={`flex-grow flex flex-col items-center w-full transition-all duration-1000 ${result ? 'pt-0' : 'pt-28 pb-20'}`}>
        
        {!audioBuffer && !isAnalyzing && (
          <div className="w-full max-w-4xl px-6 space-y-16 animate-in fade-in duration-1000 flex flex-col items-center relative">
            <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-white to-transparent opacity-60 -z-10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="text-center space-y-6 max-w-2xl pt-8 z-10">
               <h1 className="serif text-6xl md:text-7xl text-[var(--text-primary)] opacity-90 font-medium tracking-tight">TrueVoice</h1>
               <p className="text-[var(--text-secondary)] font-light text-[18px] leading-relaxed max-w-lg mx-auto">
                 In an age of AI synthesis, your ears can be deceived. Our forensic engine analyzes invisible spectral artifacts to reveal the true source.
               </p>
            </div>
            <div className="w-full max-w-xl z-20">
               <AudioUploader onAudioLoad={handleAudioLoad} isAnalyzing={isAnalyzing} />
            </div>
            <div className="relative flex items-center justify-center w-64 h-64 my-4 opacity-50 hover:opacity-80 transition-opacity duration-1000 grayscale-[0.2] hover:grayscale-0 pointer-events-none">
                  <div className="absolute w-56 h-56 border border-[#6d5d51] border-opacity-10 rounded-full"></div>
                  <div className="absolute w-48 h-48 border border-[#6d5d51] border-opacity-20 rounded-full border-dashed animate-spin" style={{ animationDuration: '12s' }}></div>
                  <div className="relative z-10 w-28 h-28 bg-gradient-to-br from-[#6d5d51] to-[#4a3e36] rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-[5px] border-[#f9f7f2]">
                     <div className="flex items-center gap-[3px] h-10">
                        {[0.4, 0.6, 0.9, 0.5, 0.3].map((scale, i) => (
                          <div key={i} className="w-1 bg-[#efece4] rounded-full animate-pulse opacity-90" style={{ height: '100%', transform: `scaleY(${scale})`, animationDelay: `${i * 150}ms` }} />
                        ))}
                     </div>
                  </div>
            </div>
             <div className="w-full pt-10 border-t border-[var(--border)]">
                <ModelIntrospection />
             </div>
          </div>
        )}

        {audioBuffer && !result && !isAnalyzing && (
          <div className="w-full max-w-lg px-6 py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-xl border border-[var(--border)] flex flex-col items-center text-center space-y-12">
              {error && (
                <div className="w-full bg-red-50 border border-red-100 p-4 rounded-xl flex items-start space-x-3 text-left animate-in slide-in-from-top-2">
                   <AlertTriangle className="text-red-500 shrink-0" size={20} />
                   <div>
                     <p className="text-red-800 font-medium text-sm">Analysis Failed</p>
                     <p className="text-red-600 text-xs mt-1 break-words">{error}</p>
                   </div>
                </div>
              )}
              <header className="space-y-4 w-full">
                <span className="mono text-[10px] uppercase tracking-[0.4em] text-[var(--text-secondary)] opacity-60">Audio Sample</span>
                <h2 className="serif text-4xl text-[var(--text-primary)] font-normal leading-tight px-4 truncate w-full">{fileName}</h2>
                <button onClick={reset} className="text-[var(--accent-clay)] mono text-[11px] hover:underline opacity-80">Choose a different file</button>
              </header>
              <div className="w-full aspect-square bg-[var(--bg-primary)] bg-opacity-50 rounded-[32px] flex flex-col items-center justify-center relative overflow-hidden px-8">
                <SpectrogramView buffer={audioBuffer} isPlaying={isPlaying} />
                <button 
                  onClick={togglePlayback}
                  className="mt-8 w-20 h-20 rounded-full border border-[var(--border)] bg-white flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all shadow-sm"
                >
                  {isPlaying ? <Pause size={32} strokeWidth={1} /> : <Play size={32} strokeWidth={1} className="ml-1" />}
                </button>
              </div>
              <button 
                onClick={runDetection}
                disabled={isAnalyzing}
                className={`w-full bg-[var(--accent-clay)] py-6 rounded-[30px] text-white serif text-xl italic hover:brightness-110 transition-all shadow-lg active:scale-[0.98] flex items-center justify-center space-x-3 ${isAnalyzing ? 'opacity-70 cursor-wait' : ''}`}
              >
                <Activity size={20} />
                <span>Analyze Recording</span>
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="w-full max-w-lg px-6 py-40 text-center space-y-12 animate-in fade-in duration-500">
             <div className="w-20 h-20 border-2 border-[var(--accent-clay)] border-t-transparent rounded-full animate-spin mx-auto opacity-40"></div>
             <div className="space-y-4">
                <h3 className="serif text-5xl italic text-[var(--text-primary)]">Observing Signal...</h3>
                <p className="mono text-[11px] uppercase tracking-[0.6em] text-[var(--text-secondary)]">Probing spectral phase consistency</p>
             </div>
          </div>
        )}

        {!isAnalyzing && result && (
          <div className="w-full min-h-screen relative overflow-hidden flex flex-col animate-in fade-in zoom-in-[0.98] duration-1000">
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-[pulse_8s_ease-in-out_infinite]"></div>
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${ui.glow}`}></div>
                <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 ${ui.glow}`}></div>
             </div>
             <div className="flex-grow flex flex-col items-center justify-center py-24 px-4 md:px-8 relative z-10 perspective-1000">
                <div className="w-full max-w-6xl preserve-3d transition-transform duration-700 hover:rotate-y-1">
                   <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl overflow-hidden text-white ring-1 ring-white/20">
                      <div className={`h-2 w-full bg-gradient-to-r from-${ui.accent}-500 to-${ui.accent}-300 opacity-80`}></div>
                      <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                         <div>
                            <div className="flex items-center space-x-2 text-white/50 mb-2">
                               <ScanLine size={14} className={`text-${ui.accent}-400`} />
                               <span className="mono text-[10px] uppercase tracking-[0.3em]">Forensic Report // ID-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                            </div>
                            <h2 className="serif text-3xl md:text-5xl italic font-light tracking-tight truncate max-w-xl text-shadow-sm">{fileName}</h2>
                         </div>
                         <div className="flex items-center space-x-3 bg-black/20 px-4 py-2 rounded-full border border-white/5">
                            <Clock size={14} className="text-white/40" />
                            <span className="mono text-xs text-white/60">{new Date().toLocaleTimeString()} UTC</span>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[450px]">
                         <div className="lg:col-span-2 p-12 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between relative overflow-hidden group bg-black/20">
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000 ${ui.glow}`}></div>
                            <div className="text-center w-full z-10">
                                <div className="mono text-[10px] uppercase tracking-[0.5em] text-white/50 mb-4">Final Verdict</div>
                                <div className={`py-4 px-6 rounded-2xl border flex items-center justify-center space-x-4 border-${ui.accent}-500/30 bg-${ui.accent}-500/10`}>
                                    {ui.icon}
                                    <span className={`serif text-3xl italic ${ui.textClass}`}>{ui.text}</span>
                                </div>
                            </div>
                            <div className="flex-grow flex flex-col items-center justify-center py-8 z-10">
                               <div className="relative">
                                  <span className="text-8xl md:text-9xl font-light tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    <AnimatedCounter value={result.confidence} />%
                                  </span>
                                </div>
                            </div>
                            <div className="w-full text-center z-10">
                                <p className="text-white/60 text-sm font-light italic">{ui.desc}</p>
                            </div>
                         </div>
                         <div className="lg:col-span-3 bg-black/5 flex flex-col">
                            <div className="p-8 md:p-12 flex-grow space-y-6">
                               <div className="flex items-center space-x-3 mb-2">
                                  <Cpu size={16} className="text-white/40" />
                                  <h4 className="mono text-[10px] uppercase tracking-[0.3em] text-white/50">Analysis Syntax</h4>
                               </div>
                               <div className="relative pl-6 border-l-2 border-white/10 font-light text-lg md:text-xl text-white/90 leading-relaxed font-sans min-h-[120px]">
                                  <div className={`absolute -left-[3px] top-0 h-8 w-[4px] rounded-full animate-pulse ${ui.glow}`}></div>
                                  <span className="typewriter-cursor">{result.analysis_report}</span>
                               </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 border-t border-white/10 bg-black/20">
                               <div className="p-6 border-r border-white/5 space-y-1">
                                  <div className="flex items-center space-x-2 text-white/40 mb-1">
                                     <Globe size={12} />
                                     <span className="mono text-[9px] uppercase tracking-widest">Language</span>
                                  </div>
                                  <div className="text-white text-lg">{result.language || 'UNKNOWN'}</div>
                               </div>
                               <div className="p-6 border-r border-white/5 space-y-1">
                                  <div className="flex items-center space-x-2 text-white/40 mb-1">
                                     <Activity size={12} />
                                     <span className="mono text-[9px] uppercase tracking-widest">Duration</span>
                                  </div>
                                  <div className="text-white text-lg">{result.audio_duration_sec.toFixed(2)}s</div>
                               </div>
                               <div className="p-6 md:border-none border-t md:border-t-0 border-white/5 col-span-2 md:col-span-1 space-y-1">
                                  <div className="flex items-center space-x-2 text-white/40 mb-1">
                                     <Hash size={12} />
                                     <span className="mono text-[9px] uppercase tracking-widest">Model</span>
                                  </div>
                                  <div className="text-white/80 text-xs mono pt-1">{result.model_version}</div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="mt-12 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <button onClick={reset} className="group px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all flex items-center space-x-3 backdrop-blur-md">
                       <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                       <span className="serif italic">Analyze Another Sample</span>
                    </button>
                    <button onClick={handleExport} className="group px-8 py-3 rounded-full bg-white text-[var(--text-primary)] hover:bg-gray-100 transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105">
                       <Download size={18} />
                       <span className="font-medium">Export Official Report</span>
                    </button>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-500"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      <aside className={`fixed right-0 top-0 h-full w-full max-w-[400px] bg-white z-[100] border-l border-[var(--border)] transform transition-transform duration-500 ease-in-out shadow-2xl ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-12 h-full flex flex-col">
           <div className="flex justify-between items-center mb-16">
              <span className="mono text-[10px] uppercase tracking-[0.5em] text-[var(--text-secondary)]">Menu Navigation</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} strokeWidth={1.5} /></button>
           </div>
           
           <nav className="flex-grow space-y-8">
              <button 
                onClick={() => openResource('whitepaper')}
                className="w-full text-left group"
              >
                 <div className="mono text-[9px] uppercase tracking-widest text-[var(--accent-clay)] mb-2 group-hover:translate-x-1 transition-transform">01 / Technical</div>
                 <div className="flex items-center justify-between">
                   <span className="serif text-3xl italic group-hover:text-[var(--accent-clay)] transition-colors">Core Architecture</span>
                   <FileText size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              </button>

              <button 
                onClick={() => openResource('datasets')}
                className="w-full text-left group"
              >
                 <div className="mono text-[9px] uppercase tracking-widest text-[var(--accent-clay)] mb-2 group-hover:translate-x-1 transition-transform">02 / Corpus</div>
                 <div className="flex items-center justify-between">
                   <span className="serif text-3xl italic group-hover:text-[var(--accent-clay)] transition-colors">Datasets & Training</span>
                   <Database size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              </button>

              <button 
                onClick={() => openResource('compliance')}
                className="w-full text-left group"
              >
                 <div className="mono text-[9px] uppercase tracking-widest text-[var(--accent-clay)] mb-2 group-hover:translate-x-1 transition-transform">03 / Legal</div>
                 <div className="flex items-center justify-between">
                   <span className="serif text-3xl italic group-hover:text-[var(--accent-clay)] transition-colors">Compliance Module</span>
                   <Shield size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              </button>

              <div className="h-[1px] w-12 bg-[var(--border)] my-12"></div>

              <a 
                href="mailto:contact@aryan-jani.com"
                className="block w-full text-left group"
              >
                 <div className="mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)] opacity-50 mb-2">Inquiry</div>
                 <div className="flex items-center justify-between">
                   <span className="serif text-2xl font-light">Research Contact</span>
                   <Mail size={18} className="opacity-40" />
                 </div>
              </a>
           </nav>

           <div className="pt-12 border-t border-[var(--border)]">
              <div className="flex items-center space-x-4 mb-4">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="mono text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">Nodes Online</span>
              </div>
              <p className="mono text-[10px] text-[var(--text-secondary)] opacity-60 leading-relaxed">
                v3.5.0-Forensic-TrueVoice<br/>
                STABLE SIGNAL CAPTURE
              </p>
           </div>
        </div>
      </aside>

      <ResourceOverlay activeResource={activeResource} onClose={() => setActiveResource(null)} />
      
      {!result && (
        <footer className="h-40 flex flex-col items-center justify-center space-y-4 opacity-100 transition-all duration-1000">
            <FooterSignature />
        </footer>
      )}
    </div>
  );
}
