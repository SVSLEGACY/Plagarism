import React, { useRef, useState } from 'react';
import { Upload, ArrowUp, Loader2, FileText, X, Check, Copy } from 'lucide-react';
import { ScanApiResponse, FlaggedPassage } from '../types/plagiarism';

interface TextEditorPaneProps {
  text: string;
  onTextChange: (newText: string) => void;
  isScanning: boolean;
  onScan: () => void;
  onTrySampleText: () => void;
  scanResult: ScanApiResponse | null;
  selectedPassage: FlaggedPassage | null;
  onSelectPassage: (passage: FlaggedPassage | null) => void;
  uploadedFileName: string | null;
  onClearUploadedFile: () => void;
  isUploading: boolean;
  onFileUpload: (file: File) => void;
}

export const TextEditorPane: React.FC<TextEditorPaneProps> = ({
  text,
  onTextChange,
  isScanning,
  onScan,
  onTrySampleText,
  scanResult,
  selectedPassage,
  onSelectPassage,
  uploadedFileName,
  onClearUploadedFile,
  isUploading,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Compute live word count
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Render text with highlight marks if scanned
  const renderHighlightedText = () => {
    if (!scanResult || scanResult.flagged_passages.length === 0) {
      return (
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Type, paste, or upload your text."
          className="w-full h-full min-h-[360px] sm:min-h-[420px] bg-transparent resize-none border-0 text-slate-800 placeholder-slate-400 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-0 font-normal selection:bg-[#E6F4F1]"
          spellCheck="false"
        />
      );
    }

    // Sort passages by start index
    const sorted = [...scanResult.flagged_passages].sort((a, b) => (a.start_index ?? 0) - (b.start_index ?? 0));
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((passage, idx) => {
      const start = passage.start_index ?? text.indexOf(passage.text);
      const end = passage.end_index ?? (start + passage.text.length);

      if (start > lastIndex && start <= text.length) {
        elements.push(
          <span key={`text-${idx}`}>{text.substring(lastIndex, start)}</span>
        );
      }

      const isSelected = selectedPassage?.text === passage.text;

      elements.push(
        <mark
          key={`flag-${idx}`}
          onClick={() => onSelectPassage(passage)}
          className={`cursor-pointer px-1 py-0.5 rounded transition-all duration-150 ${
            passage.similarity > 0.7
              ? 'bg-rose-100 border-b-2 border-rose-500 text-rose-950 hover:bg-rose-200'
              : 'bg-amber-100 border-b-2 border-amber-500 text-amber-950 hover:bg-amber-200'
          } ${isSelected ? 'ring-2 ring-slate-900 shadow-xs' : ''}`}
          title={`Match: ${(passage.similarity * 100).toFixed(0)}% with ${passage.matched_source}`}
        >
          {text.substring(start, end) || passage.text}
        </mark>
      );

      lastIndex = Math.max(lastIndex, end);
    });

    if (lastIndex < text.length) {
      elements.push(
        <span key="tail">{text.substring(lastIndex)}</span>
      );
    }

    return (
      <div className="w-full h-full min-h-[360px] sm:min-h-[420px] text-sm sm:text-base leading-relaxed text-slate-800 whitespace-pre-wrap font-normal selection:bg-[#E6F4F1]">
        {elements}
      </div>
    );
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full bg-white transition-colors relative ${
        isDragging ? 'bg-emerald-50/40 ring-2 ring-dashed ring-[#0E7058]' : ''
      }`}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Uploaded File Badge / Progress Bar */}
      {uploadedFileName && (
        <div className="mx-6 mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs text-slate-700 animate-in fade-in duration-100">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-[#0E7058] shrink-0" />
            <span className="font-semibold text-slate-900 truncate">{uploadedFileName}</span>
            <span className="text-slate-500">({wordCount.toLocaleString()} words)</span>
          </div>
          <button
            onClick={onClearUploadedFile}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
            title="Remove uploaded file tag"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Text Content Area */}
      <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {isUploading ? (
          <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-slate-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#0E7058]" />
            <span className="text-sm font-medium">Extracting document text...</span>
          </div>
        ) : (
          renderHighlightedText()
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="px-6 py-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white">
        
        {/* Left Action Buttons */}
        <div className="flex items-center flex-wrap gap-3">
          
          {/* Primary Action Button: "Scan for plagiarism" */}
          <button
            onClick={onScan}
            disabled={isScanning || wordCount < 3}
            className={`font-bold text-sm px-5 py-2.5 rounded-lg text-white transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
              wordCount < 3
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : isScanning
                ? 'bg-[#0E7058] opacity-90 cursor-wait'
                : 'bg-[#0E7058] hover:bg-[#0b5744] active:scale-[0.98]'
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Scanning...</span>
              </>
            ) : (
              <span>Scan for plagiarism</span>
            )}
          </button>

          {/* Secondary Action Button: "Upload file ↑" */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isScanning}
            className="border border-slate-300 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>Upload file</span>
            <ArrowUp className="w-4 h-4 text-slate-500 stroke-[2.5]" />
          </button>

          {/* Text Link: "Try sample text" */}
          <button
            onClick={onTrySampleText}
            className="text-slate-600 hover:text-[#0E7058] hover:underline font-medium text-sm transition-colors cursor-pointer py-1 px-1"
          >
            Try sample text
          </button>
        </div>

        {/* Live Word Count & Clear controls */}
        {wordCount > 0 && (
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span>{wordCount.toLocaleString()} words</span>
            {scanResult && (
              <button
                onClick={() => onTextChange(text)} // triggers re-edit
                className="text-slate-500 hover:text-slate-800 transition-colors"
                title="Edit mode"
              >
                Clear highlights
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
