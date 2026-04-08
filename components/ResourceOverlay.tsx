
import React from 'react';
import { X, FileText, Database, Shield, ArrowRight } from 'lucide-react';

type ResourceId = 'whitepaper' | 'datasets' | 'compliance' | null;

interface ResourceOverlayProps {
  activeResource: ResourceId;
  onClose: () => void;
}

const ResourceOverlay: React.FC<ResourceOverlayProps> = ({ activeResource, onClose }) => {
  if (!activeResource) return null;

  const content = {
    whitepaper: {
      title: "The Architecture of Authenticity",
      subtitle: "Technical Whitepaper v1.0",
      icon: <FileText size={48} strokeWidth={1} />,
      sections: [
        {
          heading: "Abstract",
          text: "TrueVoice utilizes a hybrid neural architecture combining Convolutional Neural Networks (CNNs) for spatial feature extraction from log-Mel spectrograms and Bidirectional Long Short-Term Memory (BiLSTM) networks for temporal sequence modeling. This dual approach allows for the detection of both spectral artifacts and unnatural temporal cadence characteristic of diffusion-based synthesis models."
        },
        {
          heading: "Spectral Analysis",
          text: "The system analyzes audio in the frequency domain using Short-Time Fourier Transform (STFT). AI-generated speech often exhibits 'checkerboard' artifacts and super-resolution inconsistencies in the high-frequency range (>8kHz) which are invisible to the human ear but distinct to our forensic classifiers."
        },
        {
          heading: "Model Training",
          text: "Trained on the ASVspoof 2021 dataset and a proprietary corpus of 50,000+ DeepVoice, Silero, and ElevenLabs samples, the model achieves a 99.2% AUC on known synthesis engines. It employs calibrated confidence scoring to minimize false positives in high-stakes forensic environments."
        }
      ]
    },
    compliance: {
      title: "Ethical Usage Framework",
      subtitle: "Compliance & Governance",
      icon: <Shield size={48} strokeWidth={1} />,
      sections: [
        {
          heading: "Mission Statement",
          text: "TrueVoice is designed to protect truth, not to arbitrate reality without oversight. This tool is intended to be a 'signal' in the investigative process, not the final verdict."
        },
        {
          heading: "Acceptable Use Policy",
          text: "1. Do not use for automated legal rulings.\n2. Do not use to harass or intimidate individuals.\n3. Always have a human-in-the-loop for critical decision making.\n4. Respect privacy: Do not analyze private conversations without consent unless part of a lawful investigation."
        },
        {
          heading: "Limitations",
          text: "Current generation synthesis detection is probabilistic. Low-quality audio, heavy background noise, or lossy compression (GSM/VoIP) can significantly degrade accuracy. Results should be treated as 'indicative' rather than 'conclusive' evidence."
        }
      ]
    },
    datasets: {
       title: "Training Data & Corpus",
       subtitle: "Open Source Initiatives",
       icon: <Database size={48} strokeWidth={1} />,
       sections: [
         { heading: "Primary Corpus", text: "ASVspoof 2019/2021 Logical Access Database." },
         { heading: "Synthetic Sources", text: "Samples generated via Tacotron 2, FastSpeech 2, VITS, and proprietary diffusion models." }
       ]
    }
  };

  const data = content[activeResource] || content.whitepaper;

  return (
    <div className="fixed inset-0 z-[80] bg-[var(--bg-primary)] overflow-y-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-4xl mx-auto px-8 py-32 md:py-40 relative">
        <button 
          onClick={onClose}
          className="absolute top-12 right-8 md:top-20 md:right-0 w-12 h-12 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--accent-clay)] hover:text-white transition-all"
        >
          <X size={24} strokeWidth={1} />
        </button>

        <header className="space-y-8 border-b border-[var(--border)] pb-16 mb-16">
          <div className="text-[var(--accent-clay)]">{data.icon}</div>
          <div className="space-y-2">
             <div className="mono text-[12px] uppercase tracking-[0.4em] text-[var(--text-secondary)] opacity-60">{data.subtitle}</div>
             <h1 className="serif text-5xl md:text-6xl text-[var(--text-primary)] font-medium leading-tight">{data.title}</h1>
          </div>
        </header>

        <div className="space-y-16">
          {data.sections.map((section, idx) => (
            <section key={idx} className="space-y-6">
              <h2 className="serif text-3xl italic text-[var(--text-primary)]">{section.heading}</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed text-lg font-light whitespace-pre-line">
                {section.text}
              </p>
            </section>
          ))}
        </div>

        <div className="pt-24 mt-24 border-t border-[var(--border)] flex items-center justify-between">
           <span className="mono text-[10px] uppercase tracking-widest text-[var(--text-secondary)] opacity-40">TrueVoice Research Labs</span>
           <button onClick={onClose} className="flex items-center space-x-3 text-[var(--accent-clay)] hover:text-[var(--text-primary)] transition-colors">
              <span className="serif text-xl italic">Return to Analyzer</span>
              <ArrowRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceOverlay;
