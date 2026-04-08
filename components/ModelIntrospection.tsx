
import React from 'react';

const ModelIntrospection: React.FC = () => {
  return (
    <div className="w-full space-y-20 animate-in fade-in duration-1000">
      <div className="space-y-10">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-1 bg-[var(--accent-peach)] rounded-full"></div>
          <h3 className="mono text-[10px] uppercase tracking-[0.5em] text-[var(--accent-clay)]">Inference Pipeline</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {[
            { id: 'I', title: 'Signal Preparation', detail: 'Calibrated Normalization' },
            { id: 'II', title: 'Spectral Mapping', detail: 'Log-Mel Projection' },
            { id: 'III', title: 'Temporal Aggregation', detail: 'LSTM Contextual Analysis' },
            { id: 'IV', title: 'Confidence Calibration', detail: 'Bayesian Weighting' },
          ].map(stage => (
            <div key={stage.id} className="flex space-x-8 items-start group">
              <span className="serif text-3xl italic text-[var(--accent-sage)] opacity-40 group-hover:opacity-100 group-hover:text-[var(--accent-clay)] transition-all">{stage.id}</span>
              <div className="space-y-2">
                <div className="serif text-xl font-normal text-[var(--text-primary)]">{stage.title}</div>
                <div className="mono text-[11px] text-[var(--text-secondary)] uppercase tracking-widest">{stage.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-16 border-t border-[var(--border)] relative">
        <div className="absolute top-0 right-0 -translate-y-1/2">
           <span className="bg-[var(--bg-surface)] px-4 py-1 rounded-full mono text-[8px] uppercase tracking-[0.4em] text-[var(--accent-peach)] border border-[var(--border)]">Philosophy</span>
        </div>
        <p className="serif text-[18px] leading-relaxed text-[var(--text-secondary)] font-light max-w-lg italic">
          Biological speech possesses a soft, stochastic resonance. We listen for the presence of this human jitter, distinguishing it from the clinical, deterministic precision of synthetic vocoders.
        </p>
      </div>
    </div>
  );
};

export default ModelIntrospection;
