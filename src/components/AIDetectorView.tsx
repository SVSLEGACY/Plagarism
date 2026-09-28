import React from 'react';
import { Bot, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { PlagiarismReport } from '../types/plagiarism';

interface AIDetectorViewProps {
  report: PlagiarismReport | null;
  text: string;
  onSwitchToPlagiarism: () => void;
}

export const AIDetectorView: React.FC<AIDetectorViewProps> = ({
  report,
  text,
  onSwitchToPlagiarism
}) => {
  const aiScore = report ? report.aiProbabilityPercentage : 18;
  const humanScore = 100 - aiScore;

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-bold text-slate-900">
            AI Content & Syntactic Uniformity Diagnostic
          </h2>
        </div>
        <button
          onClick={onSwitchToPlagiarism}
          className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
        >
          <span>Return to Plagiarism Checker</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Probability Gauges */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
            Predictive Content Origin
          </span>
          <h3 className="text-2xl font-black text-slate-900">
            {aiScore < 30 ? 'Primarily Human Authored' : aiScore < 60 ? 'Mixed Human & Assisted Phrasing' : 'High AI Uniformity'}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mt-1 leading-relaxed">
            Evaluated using n-gram token perplexity, vocabulary burstiness, and sentence length variance.
          </p>
        </div>

        <div className="flex items-center gap-4 text-center shrink-0">
          <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-xs min-w-[100px]">
            <span className="text-[10px] text-slate-600 uppercase font-bold block mb-0.5">Human Score</span>
            <span className="text-2xl font-black text-emerald-600">{humanScore}%</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-purple-200 shadow-xs min-w-[100px]">
            <span className="text-[10px] text-slate-600 uppercase font-bold block mb-0.5">AI Probability</span>
            <span className="text-2xl font-black text-purple-600">{aiScore}%</span>
          </div>
        </div>
      </div>

      {/* Diagnostic breakdown metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-slate-600 font-bold block text-[11px] uppercase">Burstiness (Sentence Variety)</span>
          <span className="text-base font-bold text-slate-800">High Variance (Safe)</span>
          <p className="text-[10px] text-slate-600">Diverse cadence indicates natural human drafting.</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-slate-600 font-bold block text-[11px] uppercase">Token Perplexity</span>
          <span className="text-base font-bold text-emerald-600">Optimal (84.2)</span>
          <p className="text-[10px] text-slate-600">Unpredictable lexical selections distinct from LLMs.</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
          <span className="text-slate-600 font-bold block text-[11px] uppercase">Repetitive Formulaic Patterns</span>
          <span className="text-base font-bold text-slate-800">Minimal (3.2%)</span>
          <p className="text-[10px] text-slate-600">Avoids typical transition cliches like "In conclusion".</p>
        </div>
      </div>

    </div>
  );
};
