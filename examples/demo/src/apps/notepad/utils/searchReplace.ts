import type { FindReplaceOptions } from '../FindReplaceDialog';

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegex(needle: string, options: FindReplaceOptions): RegExp {
  const flags = options.matchCase ? 'g' : 'gi';
  const pattern = options.wholeWord ? `\\b${escapeRegex(needle)}\\b` : escapeRegex(needle);
  return new RegExp(pattern, flags);
}

export function findNextMatch(
  text: string,
  needle: string,
  options: FindReplaceOptions,
  startIndex: number
): { start: number; end: number } | null {
  if (!needle) return null;
  const regex = buildRegex(needle, options);
  regex.lastIndex = startIndex;
  const match = regex.exec(text);
  if (!match) return null;
  return { start: match.index, end: match.index + match[0].length };
}

export function replaceOne(
  text: string,
  needle: string,
  replacement: string,
  options: FindReplaceOptions,
  startIndex: number
): { newText: string; start: number; end: number } | null {
  const match = findNextMatch(text, needle, options, startIndex);
  if (!match) return null;
  const before = text.substring(0, match.start);
  const after = text.substring(match.end);
  const newText = before + replacement + after;
  const newStart = match.start;
  const newEnd = match.start + replacement.length;
  return { newText, start: newStart, end: newEnd };
}

export function replaceAll(
  text: string,
  needle: string,
  replacement: string,
  options: FindReplaceOptions
): string {
  if (!needle) return text;
  const regex = buildRegex(needle, options);
  return text.replace(regex, replacement);
}
