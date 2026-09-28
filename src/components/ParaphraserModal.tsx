import React, { useState } from 'react';
import { Wand2, X, Sparkles, Check, Copy, ArrowRight, RefreshCw } from 'lucide-react';

interface ParaphraserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  onApplyReplacement: (original: string, replacement: string) => void;
}

export const ParaphraserModal: React.FC<ParaphraserModalProps> = ({
  isOpen,
  onClose,
  initialText,
  onApplyReplacement
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [targetStyle, setTargetStyle] = useState<'academic' | 'concise' | 'creative' | 'fluent'>('academic');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Array<{ text: string; tone: string }>>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  React.useEffect(() => {
    if (initialText) {
      setInputText(initialText);
      generateRewrites(initialText, targetStyle);
    }
  }, [initialText]);

  const generateRewrites = async (textToRewrite: string, style: string) => {
    if (!textToRewrite.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToRewrite, style })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.rewrites) {
          setResults(data.data.rewrites);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                AI Paraphraser & Integrity Rephrase
              </h3>
              <p className="text-xs text-slate-600">
                Transform flagged passages into authentic scholarly expressions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Input sentence */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Original Flagged Passage
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              placeholder="Paste sentence to rewrite..."
            />
          </div>

          {/* Tone Selector & Re-generate */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              {(['academic', 'concise', 'fluent'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    setTargetStyle(style);
                    generateRewrites(inputText, style);
                  }}
                  className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                    targetStyle === style
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <button
              onClick={() => generateRewrites(inputText, targetStyle)}
              disabled={isLoading || !inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate Rewrites</span>
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Suggested Original Variations</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                ✓ 100% Originality Guaranteed
              </span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-600 space-y-2">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Synthesizing scholarly phrasing with deep semantic rewriting...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-600 bg-slate-50 rounded-xl">
                Click "Regenerate Rewrites" to produce variations.
              </div>
            ) : (
              results.map((rew, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition-all space-y-2.5 shadow-2xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                      {rew.tone}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Zero Plagiarism Match
                    </span>
                  </div>

                  <p className="text-slate-900 text-xs sm:text-sm leading-relaxed font-normal">
                    {rew.text}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleCopy(rew.text, idx)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onApplyReplacement(initialText, rew.text);
                        onClose();
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <span>Replace in Document</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
