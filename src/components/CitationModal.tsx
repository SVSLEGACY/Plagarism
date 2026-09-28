import React, { useState } from 'react';
import { Quote, X, Copy, Check, ExternalLink, Bookmark } from 'lucide-react';
import { MatchedSource } from '../types/plagiarism';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: MatchedSource | null;
  onInsertCitation?: (citationText: string) => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({
  isOpen,
  onClose,
  source,
  onInsertCitation
}) => {
  const [activeFormat, setActiveFormat] = useState<'apa' | 'mla' | 'chicago' | 'intext' | 'bibtex'>('apa');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !source) return null;

  const authorSurname = source.author?.split(' ').slice(-1)[0] || 'Author';
  const year = source.year || '2023';

  const inTextCitation = `(${authorSurname}, ${year})`;
  const bibtex = `@misc{${source.id},
  author = {${source.author || 'Contributor'}},
  title = {${source.title}},
  year = {${year}},
  url = {${source.url}},
  note = {Accessed: ${new Date().toLocaleDateString()}}
}`;

  let currentCitation = source.citation.apa;
  if (activeFormat === 'mla') currentCitation = source.citation.mla;
  if (activeFormat === 'chicago') currentCitation = source.citation.chicago;
  if (activeFormat === 'intext') currentCitation = inTextCitation;
  if (activeFormat === 'bibtex') currentCitation = bibtex;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Citation Generator
              </h3>
              <p className="text-xs text-slate-600">
                Scholarly bibliographic attribution for matched source
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

        {/* Source metadata card */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-slate-900 text-sm">{source.title}</h4>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-slate-800 p-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
              <span>Author: {source.author || 'Scholarly Source'}</span>
              <span>·</span>
              <span>Year: {source.year || '2023'}</span>
              <span>·</span>
              <span>Domain: {source.domain}</span>
            </div>
          </div>

          {/* Style Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            {[
              { id: 'apa', label: 'APA 7th' },
              { id: 'mla', label: 'MLA 9th' },
              { id: 'chicago', label: 'Chicago' },
              { id: 'intext', label: 'In-Text' },
              { id: 'bibtex', label: 'BibTeX' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFormat(tab.id as any)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeFormat === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Formatted Citation Output */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs sm:text-sm leading-relaxed relative selection:bg-emerald-600">
            {currentCitation}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Citation'}</span>
            </button>

            {onInsertCitation && (
              <button
                onClick={() => {
                  onInsertCitation(` ${inTextCitation}`);
                  onClose();
                }}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Insert In-Text Reference
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
