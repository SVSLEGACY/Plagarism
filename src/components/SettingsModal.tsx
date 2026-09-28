import React from 'react';
import { X, Settings, Sliders, Shield } from 'lucide-react';
import { ScanOptions } from '../types/plagiarism';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ScanOptions;
  onOptionsChange: (newOptions: ScanOptions) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  options,
  onOptionsChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base">
              Scan & Sensitivity Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Sensitivity Tier */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              NLP Detection Sensitivity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'standard', 'high'] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => onOptionsChange({ ...options, sensitivity: tier })}
                  className={`p-2.5 rounded-xl border text-center font-bold capitalize transition-all ${
                    options.sensitivity === tier
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-600">
              {options.sensitivity === 'high'
                ? 'Flags mild paraphrasing, short idioms, and high semantic similarity.'
                : options.sensitivity === 'low'
                ? 'Only flags strict verbatim blocks and high-confidence copies.'
                : 'Balanced academic threshold matching Grammarly and Turnitin norms.'}
            </p>
          </div>

          {/* Filtering Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
              Filter Exclusions
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.excludeQuotes}
                onChange={(e) => onOptionsChange({ ...options, excludeQuotes: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">Exclude Direct Quotations</span>
                <span className="text-[11px] text-slate-600 block">
                  Ignores text enclosed in standard quotation marks ("...")
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={options.excludeBibliography}
                onChange={(e) => onOptionsChange({ ...options, excludeBibliography: e.target.checked })}
                className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">Exclude Bibliography & References</span>
                <span className="text-[11px] text-slate-600 block">
                  Automatically omits terminal citation lists and Works Cited sections
                </span>
              </div>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
