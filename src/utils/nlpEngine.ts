import { 
  ScanApiResponse, 
  FlaggedPassage, 
  ScanMetrics, 
  MatchedSourceInfo, 
  ScanOptions,
  PlagiarismReport,
  MatchedSegment,
  MatchedSource
} from '../types/plagiarism';

// Pre-seeded academic & web reference database entries
export const REFERENCE_CORPUS: Array<{
  id: string;
  title: string;
  url: string;
  domain: string;
  category: 'academic' | 'web' | 'encyclopedia' | 'news' | 'journal';
  author: string;
  year: string;
  publisher: string;
  keySnippets: string[];
}> = [
  {
    id: 'src-wiki-blockchain',
    title: 'Blockchain: Architecture and Consensus Mechanisms',
    url: 'https://en.wikipedia.org/wiki/Blockchain',
    domain: 'wikipedia.org',
    category: 'encyclopedia',
    author: 'Wikipedia Contributors',
    year: '2024',
    publisher: 'Wikimedia Foundation',
    keySnippets: [
      'A blockchain is a distributed ledger with growing lists of records (blocks) that are securely linked together via cryptographic hashes.',
      'Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data.',
      'The timestamp proves that the transaction data existed when the block was published in order to get into its hash.',
      'Because blocks each contain a timestamp and information linking them to the previous block, they form a chain, with each additional block reinforcing the ones before it.',
      'Therefore, blockchains are resistant to the modification of their data because once recorded, the data in any given block cannot be altered retroactively without altering all subsequent blocks.'
    ]
  },
  {
    id: 'src-wiki-pow',
    title: 'Proof of work - Distributed Consensus Systems',
    url: 'https://en.wikipedia.org/wiki/Proof_of_work',
    domain: 'wikipedia.org',
    category: 'encyclopedia',
    author: 'Wikipedia Contributors',
    year: '2024',
    publisher: 'Wikimedia Foundation',
    keySnippets: [
      'Proof of work is a form of cryptographic zero-knowledge proof in which one party proves to others that a certain amount of a specific computational effort has been expended.',
      'Verifiers can subsequently confirm this expenditure with minimal effort on their part.',
      'The concept was invented by Cynthia Dwork and Moni Naor in 1993 as a way to deter denial-of-service attacks and other service abuses such as spam on a network.'
    ]
  },
  {
    id: 'src-turing-1950',
    title: 'Computing Machinery and Intelligence',
    url: 'https://academic.oup.com/mind/article/LIX/236/433/986238',
    domain: 'academic.oup.com',
    category: 'academic',
    author: 'A. M. Turing',
    year: '1950',
    publisher: 'Mind (Oxford University Press)',
    keySnippets: [
      'Computing machinery and intelligence begins with the question: Can machines think?',
      'If we wish to consider whether machines can think, we should first define the meaning of the terms machine and think.',
      'Turing proposed replacing this question with an operational test called the imitation game.',
      'In this game, an interrogator in a separate room attempts to distinguish between a human and a computer through written conversational exchanges.'
    ]
  },
  {
    id: 'src-vaswani-attention',
    title: 'Attention Is All You Need (Transformer Architecture)',
    url: 'https://arxiv.org/abs/1706.03762',
    domain: 'arxiv.org',
    category: 'academic',
    author: 'Ashish Vaswani, Noam Shazeer, et al.',
    year: '2017',
    publisher: 'NeurIPS Proceedings / arXiv',
    keySnippets: [
      'Deep learning architectures, particularly the Transformer model introduced in 2017, rely on multi-head self-attention mechanisms to dispense with recurrent connections.',
      'Attention mechanisms allow modeling of dependencies without regard to their distance in the input or output sequences.',
      'In contrast to convolutional networks, attention calculates pairwise similarity matrix representations across the full token sequence.'
    ]
  },
  {
    id: 'src-nature-energy',
    title: 'Levelized Costs of Electricity and Solar Photovoltaic Grid Parity',
    url: 'https://www.nature.com/articles/s41560-022-01048-2',
    domain: 'nature.com',
    category: 'journal',
    author: 'Dr. Elena Vance & K. Sorenson',
    year: '2023',
    publisher: 'Nature Energy',
    keySnippets: [
      'The worldwide switch toward clean power solutions is picking up rapid momentum due to plunging production expenses for silicon photovoltaic modules.',
      'Over the previous decade, the levelized expense of photovoltaic power generation has plunged by more than eighty percent, making solar energy competitively superior to conventional fossil thermal generation in most sun-rich latitudes.',
      'Integrating high shares of fluctuating renewable resources presents formidable structural obstacles for conventional electricity transmission networks.',
      'Because generation output is dictated by atmospheric variations and solar irradiance cycles rather than peak consumer demand, grid controllers must deploy grid-scale battery repositories and adjustable demand-response protocols to avert transmission congestion and frequency instabilities.'
    ]
  }
];

export function cleanTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export function generateNgrams(tokens: string[], n = 3): Set<string> {
  const ngrams = new Set<string>();
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.add(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

export function computeJaccardSimilarity(textA: string, textB: string, n = 3): number {
  const tokensA = cleanTokens(textA);
  const tokensB = cleanTokens(textB);
  if (tokensA.length < n || tokensB.length < n) {
    const setA = new Set(tokensA);
    const setB = new Set(tokensB);
    let intersection = 0;
    for (const t of setA) {
      if (setB.has(t)) intersection++;
    }
    const union = new Set([...tokensA, ...tokensB]).size;
    return union > 0 ? intersection / union : 0;
  }
  const ngramsA = generateNgrams(tokensA, n);
  const ngramsB = generateNgrams(tokensB, n);

  let intersection = 0;
  for (const gram of ngramsA) {
    if (ngramsB.has(gram)) intersection++;
  }
  const union = ngramsA.size + ngramsB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

export interface SentenceSpan {
  text: string;
  startIndex: number;
  endIndex: number;
}

export function extractSentenceSpans(text: string): SentenceSpan[] {
  const spans: SentenceSpan[] = [];
  const regex = /[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const trimmed = raw.trim();
    if (trimmed.length > 5) {
      const leadingSpace = raw.indexOf(trimmed);
      const start = match.index + leadingSpace;
      spans.push({
        text: trimmed,
        startIndex: start,
        endIndex: start + trimmed.length
      });
    }
  }

  if (spans.length === 0 && text.trim().length > 0) {
    spans.push({
      text: text.trim(),
      startIndex: text.indexOf(text.trim()),
      endIndex: text.indexOf(text.trim()) + text.trim().length
    });
  }

  return spans;
}

function countSyllables(word: string): number {
  const w = word.toLowerCase();
  if (w.length <= 3) return 1;
  const cleaned = w.replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export function calculateLinguisticMetrics(text: string): ScanMetrics {
  const words = cleanTokens(text);
  const totalWords = words.length;
  const uniqueWords = new Set(words).size;

  // 1. Vocabulary Richness (TTR)
  const ttr = totalWords > 0 ? uniqueWords / totalWords : 0;
  const vocabularyRichness = `${ttr.toFixed(2)} TTR`;
  const wordChoiceScore = ttr >= 0.70 ? 'Rich' : ttr >= 0.50 ? 'Diverse' : 'Repetitive';

  // 2. Readability (Flesch-Kincaid)
  const sentences = extractSentenceSpans(text);
  const totalSentences = Math.max(1, sentences.length);
  const totalSyllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const asl = totalWords / totalSentences;
  const asw = totalWords > 0 ? totalSyllables / totalWords : 1.5;

  const flesch = Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw));
  let readabilityStr = 'College Level (64.2)';
  if (flesch >= 80) readabilityStr = `Easy (${flesch.toFixed(1)})`;
  else if (flesch >= 60) readabilityStr = `Standard (${flesch.toFixed(1)})`;
  else if (flesch >= 50) readabilityStr = `College Level (${flesch.toFixed(1)})`;
  else readabilityStr = `Scholarly (${flesch.toFixed(1)})`;

  // 3. Spelling & Grammar heuristics
  const typos = new Set(['teh', 'recieve', 'seperate', 'definately', 'occured', 'untill', 'goverment']);
  let spellingIssues = 0;
  for (const w of words) {
    if (typos.has(w)) spellingIssues++;
  }

  // 4. Conciseness
  const wordyPhrases = ['in order to', 'due to the fact that', 'at this point in time', 'for the purpose of'];
  let concisenessFlags = 0;
  const lower = text.toLowerCase();
  for (const phrase of wordyPhrases) {
    if (lower.includes(phrase)) concisenessFlags++;
  }
  const conciseness = concisenessFlags === 0 ? 'Clear' : `${concisenessFlags} wordy alert${concisenessFlags > 1 ? 's' : ''}`;

  // 5. Punctuation
  let punctuationIssues = 0;
  if (text.includes('  ') || (text.split('"').length - 1) % 2 !== 0) {
    punctuationIssues++;
  }

  const grammarScore = concisenessFlags < 2 && spellingIssues === 0 ? 'Good' : 'Review needed';
  const additionalIssues = (punctuationIssues + concisenessFlags) > 1 ? 1 : 0;

  return {
    grammar_score: grammarScore,
    spelling_issues: spellingIssues,
    conciseness,
    readability: readabilityStr,
    vocabulary_richness: vocabularyRichness,
    punctuation_issues: punctuationIssues,
    word_choice_score: wordChoiceScore,
    additional_issues: additionalIssues
  };
}

export function runFullNLPScan(
  inputText: string,
  docTitle = 'Untitled Document',
  options: ScanOptions = { excludeQuotes: false, excludeBibliography: false, sensitivity: 'standard' }
): ScanApiResponse {
  const words = inputText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = inputText.length;
  const sentences = extractSentenceSpans(inputText);
  const sentenceCount = sentences.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 225));

  if (wordCount < 10) {
    const metrics = calculateLinguisticMetrics(inputText);
    return {
      similarity_score: 0,
      originality_score: 100,
      word_count: wordCount,
      character_count: charCount,
      sentence_count: sentenceCount,
      reading_time_minutes: readingTimeMinutes,
      flagged_passages: [],
      metrics,
      sources: [],
      summary_verdict: 'Document contains insufficient text for deep semantic analysis (minimum 10 words).'
    };
  }

  const flaggedPassages: FlaggedPassage[] = [];
  const sourceHitsMap = new Map<string, { source: typeof REFERENCE_CORPUS[0]; matchedWords: number }>();

  const thresholdExact = options.sensitivity === 'high' ? 0.75 : options.sensitivity === 'low' ? 0.88 : 0.80;
  const thresholdParaphrase = options.sensitivity === 'high' ? 0.40 : options.sensitivity === 'low' ? 0.58 : 0.48;

  let matchedWordsTotal = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sent = sentences[i];
    const sentText = sent.text;
    const isQuoted = (sentText.startsWith('"') && sentText.endsWith('"')) ||
                     (sentText.startsWith('“') && sentText.endsWith('”'));

    if (isQuoted && options.excludeQuotes) continue;

    let bestMatch: {
      similarity: number;
      refSnippet: string;
      refSource: typeof REFERENCE_CORPUS[0];
      type: 'exact' | 'paraphrased' | 'quote';
    } | null = null;

    for (const ref of REFERENCE_CORPUS) {
      for (const snippet of ref.keySnippets) {
        const jaccard = computeJaccardSimilarity(sentText, snippet, 3);
        const lowerSent = sentText.toLowerCase();
        const lowerSnip = snippet.toLowerCase();
        const exactRatio = lowerSent.includes(lowerSnip) || lowerSnip.includes(lowerSent) ? 0.94 : jaccard;
        const effectiveSim = Math.max(jaccard, exactRatio);

        if (effectiveSim >= thresholdParaphrase) {
          const type = isQuoted ? 'quote' : effectiveSim >= thresholdExact ? 'exact' : 'paraphrased';
          if (!bestMatch || effectiveSim > bestMatch.similarity) {
            bestMatch = {
              similarity: effectiveSim,
              refSnippet: snippet,
              refSource: ref,
              type
            };
          }
        }
      }
    }

    if (bestMatch) {
      const sentWords = sentText.split(/\s+/).length;
      matchedWordsTotal += sentWords;

      flaggedPassages.push({
        id: `flag-${i + 1}`,
        text: sentText,
        similarity: parseFloat(bestMatch.similarity.toFixed(2)),
        matched_source: bestMatch.refSource.title,
        source_url: bestMatch.refSource.url,
        source_domain: bestMatch.refSource.domain,
        match_type: bestMatch.type,
        start_index: sent.startIndex,
        end_index: sent.endIndex,
        explanation: bestMatch.type === 'exact'
          ? `Direct verbatim match against ${bestMatch.refSource.title}.`
          : `Paraphrased overlap detected against published literature.`,
        suggested_rewrite: `Scholarly analysis of ${bestMatch.refSource.title} emphasizes how these foundational mechanisms operate.`
      });

      const existing = sourceHitsMap.get(bestMatch.refSource.id) || {
        source: bestMatch.refSource,
        matchedWords: 0
      };
      existing.matchedWords += sentWords;
      sourceHitsMap.set(bestMatch.refSource.id, existing);
    }
  }

  const similarityScore = parseFloat(Math.min(100, (matchedWordsTotal / Math.max(1, wordCount)) * 100).toFixed(1));
  const originalityScore = parseFloat(Math.max(0, 100 - similarityScore).toFixed(1));

  const metrics = calculateLinguisticMetrics(inputText);

  const sources: MatchedSourceInfo[] = Array.from(sourceHitsMap.values()).map(({ source, matchedWords }) => ({
    title: source.title,
    domain: source.domain,
    url: source.url,
    similarity: parseFloat(Math.min(similarityScore, Math.max(4, (matchedWords / wordCount) * 100)).toFixed(1)),
    matched_words: matchedWords
  })).sort((a, b) => b.similarity - a.similarity);

  let summaryVerdict = '';
  if (similarityScore <= 5) {
    summaryVerdict = 'No plagiarism found. Document exhibits authentic and original scholastic authorship.';
  } else if (similarityScore <= 20) {
    summaryVerdict = 'Mild similarity detected. Contains standard common phrasing or minor unquoted references.';
  } else if (similarityScore <= 45) {
    summaryVerdict = 'Moderate similarity detected. Several sentences closely reflect external publications without citation.';
  } else {
    summaryVerdict = 'Critical plagiarism detected. Substantial portions match published literature verbatim or through close paraphrasing.';
  }

  return {
    similarity_score: similarityScore,
    originality_score: originalityScore,
    word_count: wordCount,
    character_count: charCount,
    sentence_count: sentenceCount,
    reading_time_minutes: readingTimeMinutes,
    flagged_passages: flaggedPassages,
    metrics,
    sources,
    summary_verdict: summaryVerdict
  };
}
