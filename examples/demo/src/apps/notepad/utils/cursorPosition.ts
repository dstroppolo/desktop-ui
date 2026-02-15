/**
 * Compute line and column (1-based) from text and caret position.
 */
export function getCursorPosition(text: string, selectionStart: number): { line: number; column: number } {
  const lines = text.substring(0, selectionStart).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}
