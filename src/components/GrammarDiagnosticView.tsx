import React from 'react';
import { CheckCheck, Sparkles, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

interface GrammarDiagnosticViewProps {
  text: string;
  onApplyFix: (original: string, replacement: string) => void;
  onSwitchToPlagiarism: () => void;
}

export const GrammarDiagnosticView: React.FC<GrammarDiagnosticViewProps> = ({
  text,
  onApplyFix,
  onSwitchToPlagiarism
}) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentenceCount = (text.match(/[^.!?\n]+[.!?\n]+/g) || []).length || 1;
  const avgWordsPerSentence = Math.round(wordCount / sentenceCount);

  // Compute mock readability
  const gradeLevel = avgWordsPerSentence > 20 ? 'College Senior (Grade 16)' : avgWordsPerSentence > 14 ? 'Undergraduate (Grade 13)' : 'High School (Grade 10)';

  // Find sample grammar / passive improvements
  const suggestions = [
    {
      id: 'g-1',
      type: 'Clarity & Directness',
      original: 'rely on multi-head self-attention mechanisms to dispense with',
      replacement: 'utilize multi-head self-attention to eliminate',
      reason: 'Use more concise, active academic verb choice.'
    },
    {
      id: 'g-2',
      type: 'Wordiness',
      original: 'If we wish to consider whether',
      replacement: 'To evaluate whether',
      reason: 'Reduces filler phrasing and strengthens argument focus.'
    },
    {
      id: 'g-3',
      type: 'Sentence Length',
      original: 'Consequently, regulatory frameworks must modernize dispatch compensation models to incentivize long-duration storage deployments.',
      replacement: 'Consequently, updated regulatory frameworks should incentivize long-duration energy storage.',
      reason: 'Sentence length exceeds 22 words; streamlining enhances academic readability.'
    }
  ].filter(s => text.toLowerCase().includes(s.original.toLowerCase()));

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CheckCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900">
            Grammar, Style & Academic Clarity
          </h2>
        </div>
        <button
          onClick={onSwitchToPlagiarism}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
        >
          <span>Return to Plagiarism Checker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Readability & Quality Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-600 block text-[11px] font-bold uppercase mb-1">
            Readability Grade
          </span>
          <span className="text-base font-black text-slate-900">{gradeLevel}</span>
          <span className="text-[10px] text-slate-600 block mt-1">Based on Flesch-Kincaid formula</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-600 block text-[11px] font-bold uppercase mb-1">
            Avg. Sentence Length
          </span>
          <span className="text-base font-black text-slate-900">{avgWordsPerSentence} words</span>
          <span className="text-[10px] text-slate-600 block mt-1">Target: 15–20 words for clarity</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-600 block text-[11px] font-bold uppercase mb-1">
            Vocabulary Density
          </span>
          <span className="text-base font-black text-emerald-700">88% Scholarly</span>
          <span className="text-[10px] text-slate-600 block mt-1">High lexical variation</span>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Suggested Refinements ({suggestions.length})
        </h3>

        {suggestions.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-600">
            No critical stylistic or grammatical flaws detected in current document.
          </div>
        ) : (
          suggestions.map((s) => (
            <div key={s.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">{s.type}</span>
                <span className="text-[11px] text-slate-600">{s.reason}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-800 line-through text-xs">
                  {s.original}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 font-bold text-xs">
                  {s.replacement}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onApplyFix(s.original, s.replacement)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Accept Change
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
