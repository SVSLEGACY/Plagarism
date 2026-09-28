import JSZip from 'jszip';
import zlib from 'zlib';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

export interface ExtractionResult {
  text: string;
  method: string;
}

/**
 * Robust DOCX text extraction
 * 1. Tries mammoth.extractRawText
 * 2. Fallback to JSZip reading word/document.xml and stripping XML tags
 * 3. Fallback to scanning XML fragments
 */
export async function extractTextFromDocx(buffer: Buffer): Promise<ExtractionResult> {
  // Strategy 1: Mammoth
  try {
    const res = await mammoth.extractRawText({ buffer });
    if (res && res.value && res.value.trim().length > 0) {
      return { text: res.value.trim(), method: 'mammoth' };
    }
  } catch (err) {
    console.warn('Mammoth extraction failed, falling back to JSZip:', err);
  }

  // Strategy 2: JSZip
  try {
    const zip = await JSZip.loadAsync(buffer);
    const docXmlFile = zip.file('word/document.xml');
    if (docXmlFile) {
      const xml = await docXmlFile.async('string');
      // Format paragraphs and extract all <w:t> tags
      const text = xml
        .replace(/<w:p[^>]*>/g, '\n')
        .replace(/<w:tab[^>]*\/>/g, '\t')
        .replace(/<w:br[^>]*\/>/g, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/\n\s*\n/g, '\n\n')
        .trim();

      if (text.length > 0) {
        return { text, method: 'jszip-document-xml' };
      }
    }
  } catch (zipErr) {
    console.warn('JSZip extraction failed:', zipErr);
  }

  // Strategy 3: Raw string extraction from docx zip buffer
  const rawStr = buffer.toString('utf-8');
  const textChunks = rawStr.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
  if (textChunks && textChunks.length > 0) {
    const combined = textChunks
      .map(c => c.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, ''))
      .join(' ')
      .trim();
    if (combined.length > 0) {
      return { text: combined, method: 'regex-xml-chunks' };
    }
  }

  throw new Error('Unable to extract text from Word document. The file may be password-protected or empty.');
}

/**
 * Robust Legacy Word .doc binary extraction
 */
export function extractTextFromLegacyDoc(buffer: Buffer): ExtractionResult {
  // .doc files store text in 0x00 padded UTF-16LE or plain 8-bit ASCII
  const str = buffer.toString('latin1');
  
  // Try extracting printable ASCII sequences
  const asciiMatches = str.match(/[\x20-\x7E\t\r\n]{4,}/g);
  let asciiText = '';
  if (asciiMatches) {
    asciiText = asciiMatches
      .filter(m => !m.startsWith('Root Entry') && !m.includes('WordDocument') && !m.includes('CompObj'))
      .join(' ')
      .trim();
  }

  // Try extracting UTF-16LE sequences
  const utf16Buf = buffer.toString('utf16le');
  const utf16Matches = utf16Buf.match(/[\x20-\x7E\t\r\n]{4,}/g);
  let utf16Text = '';
  if (utf16Matches) {
    utf16Text = utf16Matches
      .filter(m => !m.includes('WordDocument') && !m.includes('SummaryInformation'))
      .join(' ')
      .trim();
  }

  const bestText = (utf16Text.length > asciiText.length ? utf16Text : asciiText).trim();
  if (bestText.length > 10) {
    return { text: bestText, method: 'legacy-doc-binary' };
  }

  throw new Error('Could not extract readable text from legacy .doc file. Please save as .docx or .pdf.');
}

/**
 * Robust PDF text extraction
 * 1. Tries PDFParse
 * 2. Fallback to direct stream decompression (FlateDecode) & regex extraction of Tj/TJ operators
 * 3. Fallback to uncompressed BT...ET text blocks
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<ExtractionResult> {
  // Strategy 1: PDFParse
  try {
    const parser = new PDFParse({ data: buffer });
    const res = await parser.getText();
    await parser.destroy();
    if (res && res.text && res.text.trim().length > 0) {
      return { text: res.text.trim(), method: 'pdf-parse' };
    }
  } catch (err: any) {
    console.warn('PDFParse failed, falling back to stream decompressor:', err?.message || err);
  }

  // Strategy 2: Stream decompression & Tj / TJ operator parser
  try {
    const str = buffer.toString('latin1');
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let match: RegExpExecArray | null;
    const extractedParts: string[] = [];

    while ((match = streamRegex.exec(str)) !== null) {
      const rawStream = Buffer.from(match[1], 'latin1');
      let decompressed = '';

      // Try zlib inflate
      try {
        decompressed = zlib.inflateSync(rawStream).toString('utf-8');
      } catch {
        try {
          decompressed = zlib.inflateRawSync(rawStream).toString('utf-8');
        } catch {
          decompressed = rawStream.toString('utf-8');
        }
      }

      if (decompressed) {
        // Extract Tj (single string)
        const tjMatches = decompressed.match(/\((.*?)\)\s*Tj/g);
        if (tjMatches) {
          for (const m of tjMatches) {
            const inner = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '').trim();
            if (inner) extractedParts.push(inner);
          }
        }

        // Extract TJ (array of strings)
        const tjArrMatches = decompressed.match(/\[(.*?)\]\s*TJ/g);
        if (tjArrMatches) {
          for (const m of tjArrMatches) {
            const innerStrings = m.match(/\((.*?)\)/g);
            if (innerStrings) {
              const combined = innerStrings.map(s => s.slice(1, -1)).join('');
              if (combined.trim()) extractedParts.push(combined.trim());
            }
          }
        }
      }
    }

    if (extractedParts.length > 0) {
      const finalPdfText = extractedParts.join(' ').replace(/\s+/g, ' ').trim();
      if (finalPdfText.length > 10) {
        return { text: finalPdfText, method: 'pdf-stream-decompression' };
      }
    }
  } catch (streamErr) {
    console.warn('PDF stream extraction failed:', streamErr);
  }

  // Strategy 3: Plain text BT...ET scanning
  try {
    const plainStr = buffer.toString('latin1');
    const btMatches = plainStr.match(/BT[\s\S]*?ET/g);
    if (btMatches) {
      const parts: string[] = [];
      for (const block of btMatches) {
        const textParts = block.match(/\((.*?)\)/g);
        if (textParts) {
          parts.push(textParts.map(p => p.slice(1, -1)).join(' '));
        }
      }
      const plainResult = parts.join('\n').trim();
      if (plainResult.length > 10) {
        return { text: plainResult, method: 'pdf-plain-bt-et' };
      }
    }
  } catch (btErr) {
    console.warn('PDF plain BT scanner failed:', btErr);
  }

  throw new Error('No readable text could be extracted from this PDF. It may be an image-only scan or encrypted.');
}

/**
 * Master document extractor handling DOCX, DOC, PDF, TXT, MD, RTF
 */
export async function extractDocumentText(buffer: Buffer, originalName: string): Promise<ExtractionResult> {
  const ext = (originalName.split('.').pop() || '').toLowerCase();

  if (ext === 'docx') {
    return await extractTextFromDocx(buffer);
  }

  if (ext === 'doc') {
    // Try as docx first (in case it was just misnamed)
    try {
      return await extractTextFromDocx(buffer);
    } catch {
      return extractTextFromLegacyDoc(buffer);
    }
  }

  if (ext === 'pdf') {
    return await extractTextFromPdf(buffer);
  }

  if (['txt', 'md', 'rtf', 'csv', 'json'].includes(ext)) {
    let text = buffer.toString('utf-8');
    if (!text || text.includes('\ufffd')) {
      text = buffer.toString('latin1');
    }
    return { text: text.trim(), method: 'plaintext' };
  }

  // Fallback: test if file starts with PDF signature %PDF
  if (buffer.subarray(0, 5).toString() === '%PDF-') {
    return await extractTextFromPdf(buffer);
  }

  // Fallback: test if file is a zip (PK..)
  if (buffer[0] === 0x50 && buffer[1] === 0x4B) {
    try {
      return await extractTextFromDocx(buffer);
    } catch {
      // Not docx
    }
  }

  // Last attempt: read as UTF-8 text
  const plainFallback = buffer.toString('utf-8').trim();
  if (plainFallback.length > 5) {
    return { text: plainFallback, method: 'raw-utf8-fallback' };
  }

  throw new Error(`Unsupported file type: .${ext}. Please upload a .docx, .pdf, or .txt document.`);
}
