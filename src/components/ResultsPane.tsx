import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Download, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  Info,
  Layers,
  FileCheck
} from 'lucide-react';
import { ScanApiResponse, FlaggedPassage } from '../types/plagiarism';

interface ResultsPaneProps {
  scanResult: ScanApiResponse | null;
  isScanning: boolean;
  selectedPassage: FlaggedPassage | null;
  onSelectPassage: (passage: FlaggedPassage | null) => void;
  onDownloadReport: () => void;
  onReScan: () => void;
}

export const ResultsPane: React.FC<ResultsPaneProps> = ({
  scanResult,
  isScanning,
  selectedPassage,
  onSelectPassage,
  onDownloadReport,
  onReScan,
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'matches'>('metrics');

  // Default state placeholder rows (matching the image exactly!)
  const defaultLeftRows = [
    { label: 'No plagiarism found', value: '—' },
    { label: 'Spelling', value: '—' },
    { label: 'Conciseness', value: '—' },
    { label: 'Word choice', value: '—' },
  ];

  const defaultRightRows = [
    { label: 'Grammar', value: '—' },
    { label: 'Punctuation', value: '—' },
    { label: 'Readability', value: '—' },
    { label: 'Additional issues', value: '—' },
  ];

  // Helper for color coding the score
  const getSimilarityTheme = (sim: number) => {
    if (sim <= 5) {
      return {
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        border: 'border-emerald-200',
        stroke: '#10b981',
        title: 'No plagiarism found',
        tag: '100% Original',
      };
    }
    if (sim <= 25) {
      return {
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-700',
        border: 'border-amber-200',
        stroke: '#f59e0b',
        title: `${sim}% Similarity Detected`,
        tag: `${(100 - sim).toFixed(1)}% Original`,
      };
    }
    return {
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      border: 'border-rose-200',
      stroke: '#ef4444',
      title: `${sim}% Significant Overlap`,
      tag: 'Critical Plagiarism Risk',
    };
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 sm:p-8">
      
      {/* Header: ❝ Plagiarism Checker results */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="text-[#0E7058] font-serif text-xl leading-none select-none font-black">
            ❝
          </span>
          <span>Plagiarism Checker results</span>
        </h2>

        {scanResult && !isScanning && (
          <div className="flex items-center gap-2">
            <button
              onClick={onReScan}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="Re-run analysis"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onDownloadReport}
              className="flex items-center gap-1 text-xs font-semibold text-[#0E7058] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors"
              title="Download structured analysis report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Container Content */}
      <div className="flex-1 py-6 flex flex-col justify-start overflow-y-auto">
        
        {/* ------------------------------------------------------------------ */}
        {/* 1. IDLE / DEFAULT STATE (Shown in image.png)                         */}
        {/* ------------------------------------------------------------------ */}
        {!scanResult && !isScanning && (
          <div className="flex flex-col h-full justify-between animate-in fade-in duration-200">
            <div>
              {/* Helper text exactly from the image */}
              <p className="text-slate-700 text-sm font-medium mb-8 leading-relaxed">
                Add your text and click Scan for plagiarism to see your results.
              </p>

              {/* 2-Column Key-Value Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                
                {/* Left Column */}
                <div className="space-y-4">
                  {defaultLeftRows.map((row, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between py-2 border-b border-slate-200/80 text-sm"
                    >
                      <span className="text-slate-700 font-normal">{row.label}</span>
                      <span className="text-slate-400 font-light select-none">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {defaultRightRows.map((row, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between py-2 border-b border-slate-200/80 text-sm"
                    >
                      <span className="text-slate-700 font-normal">{row.label}</span>
                      <span className="text-slate-400 font-light select-none">{row.value}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Subtle bottom helper info */}
            <div className="pt-8 text-xs text-slate-400 flex items-center justify-between">
              <span>Cross-references 16B+ web pages & academic papers</span>
              <span>Fast & confidential</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 2. LOADING / SCANNING STATE                                        */}
        {/* ------------------------------------------------------------------ */}
        {isScanning && (
          <div className="flex flex-col items-center justify-center my-auto py-12 text-center">
            <div className="w-14 h-14 rounded-full border-4 border-slate-100 border-t-[#0E7058] animate-spin mb-4" />
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Analyzing text & checking sources...
            </h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Evaluating sentence embeddings, verbatim n-grams, and multi-metric linguistic readability.
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 3. ACTIVE SCANNED STATE                                             */}
        {/* ------------------------------------------------------------------ */}
        {scanResult && !isScanning && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Overall Similarity Gauge Banner */}
            {(() => {
              const theme = getSimilarityTheme(scanResult.similarity_score);
              return (
                <div className={`p-4 rounded-xl border ${theme.border} ${theme.badgeBg} flex items-center justify-between gap-4 shadow-2xs`}>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          className="stroke-slate-200/60"
                          strokeWidth="3.2"
                          fill="transparent"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          stroke={theme.stroke}
                          strokeWidth="3.2"
                          strokeDasharray="100"
                          strokeDashoffset={100 - scanResult.similarity_score}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <span className={`absolute text-xs font-black ${theme.badgeText}`}>
                        {scanResult.similarity_score}%
                      </span>
                    </div>

                    <div>
                      <div className={`font-bold text-sm ${theme.badgeText}`}>
                        {theme.title}
                      </div>
                      <div className="text-xs text-slate-600">
                        {scanResult.originality_score}% Original Content · {scanResult.word_count} words scanned
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${theme.badgeBg} ${theme.badgeText} border ${theme.border}`}>
                    {theme.tag}
                  </span>
                </div>
              );
            })()}

            {/* Toggle view tabs: Overview Metrics vs Matched Passages */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('metrics')}
                className={`py-1 px-2.5 rounded-md transition-colors ${
                  activeTab === 'metrics'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Diagnostic Overview
              </button>

              <button
                onClick={() => setActiveTab('matches')}
                className={`py-1 px-2.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  activeTab === 'matches'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Flagged Matches</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  scanResult.flagged_passages.length > 0 
                    ? 'bg-rose-100 text-rose-800 font-bold' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {scanResult.flagged_passages.length}
                </span>
              </button>
            </div>

            {/* View 1: 8-Category Detailed Metrics Breakdown */}
            {activeTab === 'metrics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5">
                  
                  {/* Left Column populated */}
                  <div className="space-y-3">
                    {/* 1. Plagiarism status */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 text-sm">
                      <span className="text-slate-700 font-normal">No plagiarism found</span>
                      <span className={`font-semibold text-xs ${
                        scanResult.similarity_score > 0 ? 'text-rose-600 font-bold' : 'text-emerald-700'
                      }`}>
                        {scanResult.similarity_score > 0 ? `${scanResult.similarity_score}% overlap` : 'Looking good'}
                      </span>
                    </div>

                    {/* 2. Spelling */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 text-sm">
                      <span className="text-slate-700 font-normal">Spelling</span>
                      <span className="font-semibold text-xs text-slate-800">
                        {scanResult.metrics.spelling_issues === 0 
                          ? '0 issues' 
                          : `${scanResult.metrics.spelling_issues} issue${scanResult.metrics.spelling_issues > 1 ? 's' : ''}`}
                      </span>
                    </div>

                    {/* 3. Conciseness */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 text-sm">
                      <span className="text-slate-700 font-normal">Conciseness</span>
                      <span className="font-semibold text-xs text-slate-800">
                        {scanResult.metrics.conciseness}
                      </span>
                    </div>

                    {/* 4. Word choice */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 text-sm">
                      <span className="text-slate-700 font-normal">Word choice</span>
                      <span className="font-semibold text-xs text-[#0E7058]">
                        {scanResult.metrics.vocabulary_richness} ({scanResult.metrics.word_choice_score})
                      </span>
                    </div>
                  </div>

                  {/* Right Column populated */}
                  <div className="space-y-3">
                    {/* 5. Grammar */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 text-sm">
                      <span className="text-slate-700 font-normal">Grammar</span>
                      <span className="font-semibold text-xs text-slate-800">
                        {scanResult.metrics.grammar_score}
                      </span>
                    </div>

                    {/* 6. Punctuation */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 text-sm">
                      <span className="text-slate-700 font-normal">Punctuation</span>
                      <span className="font-semibold text-xs text-slate-800">
                        {scanResult.metrics.punctuation_issues === 0 ? 'Correct' : `${scanResult.metrics.punctuation_issues} alert`}
                      </span>
                    </div>

                    {/* 7. Readability */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 text-sm">
                      <span className="text-slate-700 font-normal">Readability</span>
                      <span className="font-semibold text-xs text-slate-800">
                        {scanResult.metrics.readability}
                      </span>
                    </div>

                    {/* 8. Additional issues */}
                    <div className="flex items-center justify-between py-2 border-b border-slate-200 text-sm">
                      <span className="text-slate-700 font-normal">Additional issues</span>
                      <span className="font-semibold text-xs text-slate-800">
                        {scanResult.metrics.additional_issues === 0 ? '0' : `${scanResult.metrics.additional_issues} detected`}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Summary verdict line */}
                {scanResult.summary_verdict && (
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800 mr-1">Integrity Evaluation:</span>
                    {scanResult.summary_verdict}
                  </div>
                )}
              </div>
            )}

            {/* View 2: Matched Passages List */}
            {activeTab === 'matches' && (
              <div className="space-y-3">
                {scanResult.flagged_passages.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <span className="font-bold text-slate-800 block text-sm">No Flagged Passages</span>
                    <span>All sentences exhibit authentic, original scholastic vocabulary.</span>
                  </div>
                ) : (
                  scanResult.flagged_passages.map((passage, idx) => {
                    const isSelected = selectedPassage?.text === passage.text;
                    const simPct = (passage.similarity * 100).toFixed(0);
                    return (
                      <div
                        key={idx}
                        onClick={() => onSelectPassage(passage)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="font-bold text-slate-900 truncate">
                            {passage.matched_source}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            passage.similarity > 0.7 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {simPct}% match
                          </span>
                        </div>

                        <p className="text-slate-700 italic line-clamp-2 leading-relaxed mb-1.5">
                          "{passage.text}"
                        </p>

                        {passage.source_url && (
                          <div className="flex items-center gap-1 text-[11px] text-[#0E7058] hover:underline">
                            <span className="truncate">{passage.source_domain || passage.source_url}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Bottom Export Report Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Full integrity audit ready
              </span>
              <button
                onClick={onDownloadReport}
                className="text-xs font-bold text-[#0E7058] hover:text-[#0b5744] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Download Report (PDF / JSON)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
