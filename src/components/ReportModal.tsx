import React from 'react';
import { X, Printer, Download, Award, CheckCircle2, FileText, Code } from 'lucide-react';
import { ScanApiResponse } from '../types/plagiarism';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanApiResponse | null;
  documentTitle?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  scanResult,
  documentTitle = 'Untitled Document'
}) => {
  if (!isOpen || !scanResult) return null;

  const handlePrint = () => {
    window.print();
  };

  const downloadJsonReport = () => {
    const data = JSON.stringify(scanResult, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Plagiarism_Report_${documentTitle.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTextReport = () => {
    const lines = [
      `=============================================================`,
      `ABAANLY PLAGIARISM CHECKER & NLP REPORT`,
      `=============================================================`,
      `Document Title     : ${documentTitle}`,
      `Scan Date          : ${new Date().toLocaleString()}`,
      `Word Count         : ${scanResult.word_count} words`,
      `Character Count    : ${scanResult.character_count} characters`,
      `-------------------------------------------------------------`,
      `OVERALL INTEGRITY & SIMILARITY`,
      `-------------------------------------------------------------`,
      `Similarity Score   : ${scanResult.similarity_score}%`,
      `Originality Score  : ${scanResult.originality_score}%`,
      `-------------------------------------------------------------`,
      `DIAGNOSTIC LINGUISTIC METRICS`,
      `-------------------------------------------------------------`,
      `Grammar Score      : ${scanResult.metrics.grammar_score}`,
      `Spelling Issues    : ${scanResult.metrics.spelling_issues}`,
      `Conciseness        : ${scanResult.metrics.conciseness}`,
      `Readability        : ${scanResult.metrics.readability}`,
      `Vocabulary Richness: ${scanResult.metrics.vocabulary_richness}`,
      `Punctuation Issues : ${scanResult.metrics.punctuation_issues ?? 0}`,
      `Word Choice        : ${scanResult.metrics.word_choice_score ?? 'Diverse'}`,
      `Additional Issues  : ${scanResult.metrics.additional_issues ?? 0}`,
      `-------------------------------------------------------------`,
      `SUMMARY VERDICT`,
      `-------------------------------------------------------------`,
      scanResult.summary_verdict || 'Analysis completed successfully.',
      ``,
      `-------------------------------------------------------------`,
      `FLAGGED PASSAGES (${scanResult.flagged_passages.length})`,
      `-------------------------------------------------------------`,
      ...scanResult.flagged_passages.map((p, idx) => 
        `${idx + 1}. [${(p.similarity * 100).toFixed(0)}% Similarity] Source: ${p.matched_source}\n   "${p.text}"`
      ),
      `=============================================================`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Plagiarism_Report_${documentTitle.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Modal Controls */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0E7058]" />
            <span className="font-bold text-slate-800 text-sm">
              Plagiarism & Originality Diagnostic Audit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadJsonReport}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-slate-600" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={downloadTextReport}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download Text</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#0E7058] hover:bg-[#0b5744] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 print:p-0 print:space-y-4 text-slate-900 bg-white">
          
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-full bg-[#0E7058] text-white flex items-center justify-center font-bold text-sm select-none">
                  A
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  ABAANLY AUDIT REPORT
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Comprehensive NLP Similarity & Multi-Metric Textual Evaluation
              </p>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-slate-900">{new Date().toLocaleDateString()}</div>
              <div className="text-emerald-700 font-bold flex items-center gap-1 justify-end mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Analysis</span>
              </div>
            </div>
          </div>

          {/* Document Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Document</span>
              <span className="font-bold text-slate-900 truncate block">{documentTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Word Count</span>
              <span className="font-bold text-slate-900">{scanResult.word_count.toLocaleString()} words</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Characters</span>
              <span className="font-bold text-slate-900">{scanResult.character_count.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Originality Score</span>
              <span className="font-bold text-emerald-700">{scanResult.originality_score}% Original</span>
            </div>
          </div>

          {/* Score Banner */}
          <div className="p-6 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Evaluation Verdict
              </span>
              <div className="text-3xl font-black mt-1 mb-2">
                {scanResult.similarity_score}% <span className="text-base font-normal text-slate-300">Similarity Detected</span>
              </div>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                {scanResult.summary_verdict}
              </p>
            </div>

            <div className="p-4 bg-white/10 rounded-xl text-center min-w-[120px] border border-white/10">
              <span className="text-[10px] text-slate-300 uppercase font-bold block mb-1">
                Original Content
              </span>
              <span className="text-3xl font-black text-emerald-400">
                {scanResult.originality_score}%
              </span>
            </div>
          </div>

          {/* 8-Category Multi-Metric Diagnostic Analysis */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">
              Diagnostic Multi-Metric Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Grammar Score</span>
                <span className="text-sm font-bold text-slate-900">{scanResult.metrics.grammar_score}</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Spelling Issues</span>
                <span className="text-sm font-bold text-slate-900">{scanResult.metrics.spelling_issues}</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Conciseness</span>
                <span className="text-sm font-bold text-slate-900">{scanResult.metrics.conciseness}</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Readability</span>
                <span className="text-sm font-bold text-slate-900">{scanResult.metrics.readability}</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Vocabulary Richness</span>
                <span className="text-sm font-bold text-[#0E7058]">{scanResult.metrics.vocabulary_richness}</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Punctuation</span>
                <span className="text-sm font-bold text-slate-900">
                  {scanResult.metrics.punctuation_issues === 0 ? 'Correct' : `${scanResult.metrics.punctuation_issues} alert`}
                </span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Word Choice</span>
                <span className="text-sm font-bold text-slate-900">{scanResult.metrics.word_choice_score}</span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px] block">Additional Issues</span>
                <span className="text-sm font-bold text-slate-900">{scanResult.metrics.additional_issues ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Flagged Passages */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900">
              Flagged Passages & Sources ({scanResult.flagged_passages.length})
            </h3>
            {scanResult.flagged_passages.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-lg">
                No plagiarized passages detected in this document.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {scanResult.flagged_passages.map((p, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{idx + 1}. Source: {p.matched_source}</span>
                      <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        {(p.similarity * 100).toFixed(0)}% match
                      </span>
                    </div>
                    <p className="text-slate-700 italic">"{p.text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
