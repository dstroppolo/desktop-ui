import React, { useCallback, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getCursorPosition } from './utils/cursorPosition';

export interface NotepadEditorProps {
  value: string;
  onChange: (text: string) => void;
  wordWrap: boolean;
  fontSize: number;
  onCursorChange?: (info: { line: number; column: number }) => void;
}

export interface NotepadEditorRef {
  focus: () => void;
  setSelectionRange: (start: number, end: number) => void;
  selectAll: () => void;
}

export const NotepadEditor = forwardRef<NotepadEditorRef, NotepadEditorProps>(({
  value,
  onChange,
  wordWrap,
  fontSize,
  onCursorChange,
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    setSelectionRange: (start, end) => textareaRef.current?.setSelectionRange(start, end),
    selectAll: () => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(0, el.value.length);
      }
    },
  }), []);

  const updateCursorInfo = useCallback(() => {
    const el = textareaRef.current;
    if (!el || !onCursorChange) return;
    const { line, column } = getCursorPosition(value, el.selectionStart);
    onCursorChange({ line, column });
  }, [value, onCursorChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleSelect = useCallback(() => {
    updateCursorInfo();
  }, [updateCursorInfo]);

  const handleKeyUp = useCallback(() => {
    updateCursorInfo();
  }, [updateCursorInfo]);

  const handleClick = useCallback(() => {
    updateCursorInfo();
  }, [updateCursorInfo]);

  useEffect(() => {
    updateCursorInfo();
  }, [value, updateCursorInfo]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      onSelect={handleSelect}
      onKeyUp={handleKeyUp}
      onClick={handleClick}
      wrap={wordWrap ? 'soft' : 'off'}
      spellCheck={false}
      style={{
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: `${fontSize}px`,
        width: '100%',
        height: '100%',
        padding: '8px',
        margin: 0,
        border: 'none',
        outline: 'none',
        resize: 'none',
        boxSizing: 'border-box',
        overflowX: wordWrap ? 'hidden' : 'auto',
        overflowY: 'auto',
        backgroundColor: 'transparent',
      }}
    />
  );
});

NotepadEditor.displayName = 'NotepadEditor';
