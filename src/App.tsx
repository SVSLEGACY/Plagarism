import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SecondaryTabBar, CategoryTab } from './components/SecondaryTabBar';
import { TextEditorPane } from './components/TextEditorPane';
import { ResultsPane } from './components/ResultsPane';
import { ReportModal } from './components/ReportModal';
import { SAMPLE_PRESETS } from './data/sampleTexts';
import { ScanApiResponse, FlaggedPassage } from './types/plagiarism';
import { runFullNLPScan } from './utils/nlpEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<CategoryTab>('plagiarism-checker');
  const [text, setText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('Untitled Document');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanApiResponse | null>(null);
  const [selectedPassage, setSelectedPassage] = useState<FlaggedPassage | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);

  // File upload handler
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Direct fast path for plain text and markdown
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const textContent = await file.text();
        if (textContent.trim()) {
          setText(textContent.trim());
          setUploadedFileName(file.name);
          setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
          setScanResult(null);
          setSelectedPassage(null);
          setIsUploading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.detail || 'Failed to extract text from document');
      }

      if (data.text && data.text.trim().length > 0) {
        setText(data.text.trim());
        setUploadedFileName(file.name);
        setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
        setScanResult(null);
        setSelectedPassage(null);
      } else {
        alert('No readable text could be found in this document. Please ensure it is not an image-only scan or password-protected.');
      }
    } catch (err: any) {
      alert(`Document upload: ${err.message || 'Could not parse document. Please check the file format.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Try sample text (cycles through realistic academic, tech, and original texts)
  const handleTrySampleText = () => {
    const sample = SAMPLE_PRESETS[sampleIndex % SAMPLE_PRESETS.length];
    setText(sample.content);
    setDocumentTitle(sample.title);
    setUploadedFileName(null);
    setScanResult(null);
    setSelectedPassage(null);
    setSampleIndex((prev) => prev + 1);
  };

  // Execute scan
  const handleScan = async () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.split(/\s+/).length < 3) return;

    setIsScanning(true);
    setSelectedPassage(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          title: documentTitle,
        }),
      });

      if (!res.ok) {
        throw new Error('Server scan failed');
      }

      const data: ScanApiResponse = await res.json();
      setScanResult(data);
      if (data.flagged_passages && data.flagged_passages.length > 0) {
        setSelectedPassage(data.flagged_passages[0]);
      }
    } catch (err) {
      console.warn('Fallback to client-side NLP calculation:', err);
      // Client-side high-precision NLP fallback
      const localResult = runFullNLPScan(trimmed, documentTitle);
      setScanResult(localResult);
      if (localResult.flagged_passages && localResult.flagged_passages.length > 0) {
        setSelectedPassage(localResult.flagged_passages[0]);
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-slate-800 font-sans selection:bg-[#E6F4F1] selection:text-[#0E7058]">
      
      {/* 1. Top Header: Minimalist branding, navigation & actions */}
      <Navbar
        onRequestDemo={() => alert('Demo request submitted. Our team will contact you shortly.')}
        onLogIn={() => alert('Log In modal')}
        onSignUp={() => alert('Sign Up free trial initiated')}
      />

      {/* 2. Secondary Tool Tabs */}
      <SecondaryTabBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'plagiarism-checker') {
            // Provide informative notification when switching to other suite tabs
          }
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col">
        
        {/* 3. Hero Title & Subtitle */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-[40px] font-bold text-[#111827] tracking-tight mb-3">
            Plagiarism Checker
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ensure every word is your own with Abaanly’s AI-powered plagiarism checker, which uses advanced
            AI to detect plagiarism in your text and check for other writing issues.
          </p>
        </div>

        {/* 4. Main Interaction Container (Two-column split with rounded border & subtle shadow) */}
        <div className="rounded-2xl border border-slate-200/90 shadow-sm bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* Left Section: Input & File Processing */}
          <div className="min-h-[460px] sm:min-h-[520px] flex flex-col">
            <TextEditorPane
              text={text}
              onTextChange={(newText) => {
                setText(newText);
                if (scanResult && Math.abs(newText.length - scanResult.character_count) > 10) {
                  // Text changed significantly
                }
              }}
              isScanning={isScanning}
              onScan={handleScan}
              onTrySampleText={handleTrySampleText}
              scanResult={scanResult}
              selectedPassage={selectedPassage}
              onSelectPassage={setSelectedPassage}
              uploadedFileName={uploadedFileName}
              onClearUploadedFile={() => {
                setUploadedFileName(null);
                setText('');
                setScanResult(null);
                setSelectedPassage(null);
              }}
              isUploading={isUploading}
              onFileUpload={handleFileUpload}
            />
          </div>

          {/* Right Section: Results & Diagnostic Card */}
          <div className="min-h-[460px] sm:min-h-[520px] flex flex-col bg-white">
            <ResultsPane
              scanResult={scanResult}
              isScanning={isScanning}
              selectedPassage={selectedPassage}
              onSelectPassage={setSelectedPassage}
              onDownloadReport={() => setIsReportModalOpen(true)}
              onReScan={handleScan}
            />
          </div>

        </div>

      </main>

      {/* 5. Bottom Dark Navy CTA Banner (matching screenshot exactly) */}
      <footer className="w-full bg-[#081528] text-white py-4 px-4 sm:px-6">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <p className="text-sm font-semibold text-slate-100">
            Join millions who write better, faster with Abaanly.
          </p>
          <button
            onClick={() => alert('Free registration started')}
            className="bg-white hover:bg-slate-100 text-[#081528] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-md transition-colors shadow-xs"
          >
            Sign Up <span className="font-medium text-slate-700">It's free</span>
          </button>
        </div>
      </footer>

      {/* Structured Report Export Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        scanResult={scanResult}
        documentTitle={documentTitle}
      />

    </div>
  );
}
