export type MatchType = 'exact' | 'paraphrased' | 'quote';

export type SourceCategory = 'academic' | 'web' | 'encyclopedia' | 'news' | 'journal';

export interface MatchedSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  similarity: number;
  matchedWords: number;
  category: SourceCategory;
  author?: string;
  year?: string;
  publisher?: string;
  citation: {
    apa: string;
    mla: string;
    chicago: string;
  };
}

export interface MatchedSegment {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  matchType: MatchType;
  similarity: number;
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  matchedOriginal: string;
  explanation: string;
  suggestedRewrite: string;
}

export interface PlagiarismReport {
  id: string;
  scannedAt: string;
  documentTitle: string;
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  readingTimeMinutes: number;
  overallSimilarity: number;
  originalityScore: number;
  exactMatchPercentage: number;
  paraphrasePercentage: number;
  quotesPercentage: number;
  aiProbabilityPercentage: number;
  databaseCoverage: string;
  summaryVerdict: string;
  sources: MatchedSource[];
  matchedSegments: MatchedSegment[];
  recommendations: string[];
}

export interface ScanMetrics {
  grammar_score: string;
  spelling_issues: number;
  conciseness: string;
  readability: string;
  vocabulary_richness: string;
  punctuation_issues: number;
  word_choice_score: string;
  additional_issues: number;
}

export interface FlaggedPassage {
  id?: string;
  text: string;
  similarity: number; // 0 to 1 or 0 to 100
  matched_source: string;
  source_url?: string;
  source_domain?: string;
  explanation?: string;
  match_type?: 'exact' | 'paraphrased' | 'quote';
  start_index?: number;
  end_index?: number;
  suggested_rewrite?: string;
}

export interface MatchedSourceInfo {
  title: string;
  domain: string;
  url: string;
  similarity: number;
  matched_words: number;
}

export interface ScanApiResponse {
  similarity_score: number;
  originality_score: number;
  word_count: number;
  character_count: number;
  sentence_count?: number;
  reading_time_minutes?: number;
  flagged_passages: FlaggedPassage[];
  metrics: ScanMetrics;
  sources?: MatchedSourceInfo[];
  summary_verdict?: string;
}

export interface ScanOptions {
  excludeQuotes: boolean;
  excludeBibliography: boolean;
  sensitivity: 'low' | 'standard' | 'high';
}
