
import React, { useRef, useState } from 'react';
import { UploadCloud, ArrowUpRight, Music, FileAudio, Waves } from 'lucide-react';

interface AudioUploaderProps {
  onAudioLoad: (buffer: AudioBuffer, fileName: string, base64: string) => void;
  isAnalyzing: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioLoad, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.includes('audio')) return;
    
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    try {
        const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const reader = new FileReader();
        reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onAudioLoad(decodedBuffer, file.name, base64String);
        };
        reader.readAsDataURL(file);
    } catch (e) {
        console.error("Error decoding audio", e);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
       processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full relative group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-clay)] to-[var(--text-secondary)] rounded-[40px] opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-700 pointer-events-none"></div>

      <div 
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
           relative bg-white rounded-[40px] p-3 shadow-xl transition-all duration-500 cursor-pointer overflow-hidden transform
           ${isDragOver ? 'scale-[1.02] ring-1 ring-[var(--accent-clay)]' : 'hover:scale-[1.005] hover:shadow-2xl'}
        `}
      >
        {/* Main Interface Area */}
        <div className={`
           relative rounded-[32px] border border-[var(--border)] h-60 flex flex-col items-center justify-center space-y-6 transition-colors duration-500 overflow-hidden
           ${isDragOver ? 'bg-[var(--bg-primary)]' : 'bg-[var(--bg-surface)] bg-opacity-20 group-hover:bg-[var(--bg-primary)]'}
        `}>
            
            {/* Corner Brackets - Forensic Style */}
            <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-[var(--text-secondary)] opacity-30 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-[var(--text-secondary)] opacity-30 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-[var(--text-secondary)] opacity-30 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-[var(--text-secondary)] opacity-30 group-hover:opacity-100 transition-opacity"></div>

            {/* Central Interaction Hub */}
            <div className="relative z-10 flex flex-col items-center space-y-4">
               <div className="relative">
                   {/* Pulsing ring behind icon */}
                   <div className="absolute inset-0 bg-[var(--accent-clay)] rounded-full opacity-0 group-hover:animate-ping group-hover:opacity-10"></div>
                   
                   <div className={`
                       w-20 h-20 rounded-full bg-white border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] shadow-sm relative transition-all duration-500
                       ${isDragOver ? 'border-[var(--accent-clay)] text-[var(--accent-clay)]' : 'group-hover:border-[var(--accent-clay)] group-hover:text-[var(--text-primary)]'}
                   `}>
                       {isDragOver ? <FileAudio size={32} strokeWidth={1} /> : <UploadCloud size={32} strokeWidth={1} />}
                   </div>
                   
                   {/* Action Indicator */}
                   <div className="absolute -top-1 -right-1 w-7 h-7 bg-[var(--text-primary)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                       <ArrowUpRight size={12} />
                   </div>
               </div>

               {/* Text & Instructions */}
               <div className="text-center z-10 px-4">
                   <h3 className="serif text-2xl text-[var(--text-primary)] tracking-tight font-medium">
                     Upload Evidence
                   </h3>
                   <div className="flex items-center justify-center space-x-2 pt-2">
                       <div className="h-[1px] w-6 bg-[var(--border)]"></div>
                       <p className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-50">
                          Drop or Browse
                       </p>
                       <div className="h-[1px] w-6 bg-[var(--border)]"></div>
                   </div>
               </div>
            </div>

            {/* Scanning Scanline Animation */}
            <div className="absolute inset-x-0 h-[1px] bg-[var(--accent-clay)] shadow-[0_0_10px_rgba(182,138,115,0.5)] opacity-0 group-hover:opacity-40 group-hover:animate-[scan_2.5s_ease-in-out_infinite] pointer-events-none"></div>

            {/* Background Grid Pattern (Subtle) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} 
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac" 
        className="hidden" 
      />
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 0.4; }
          85% { opacity: 0.4; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AudioUploader;
