import React, { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Window } from 'desktop-ui';
import { NotepadEditor, type NotepadEditorRef } from './NotepadEditor';
import { MenuBar, type MenuDef } from './MenuBar';
import { FindReplaceDialog, type FindReplaceOptions } from './FindReplaceDialog';
import { findNextMatch, replaceOne, replaceAll } from './utils/searchReplace';
import styled from 'styled-components';

const DEFAULT_FILE_NAME = 'Untitled.txt';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

const EditorArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const StatusBar = styled.div`
  display: flex;
  gap: 16px;
  padding: 4px 8px;
  font-size: 11px;
  background: #f0f0f0;
  border-top: 1px solid #c0c0c0;
  flex-shrink: 0;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

export interface NotepadWindowProps {
  id?: string;
  onClose?: () => void;
}

export interface NotepadWindowRef {
  isDirty: boolean;
}

export const NotepadWindow = forwardRef<NotepadWindowRef, NotepadWindowProps>(({ id = 'notepad', onClose }, ref) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState(DEFAULT_FILE_NAME);
  const [wordWrap, setWordWrap] = useState(true);
  const [fontSize, setFontSize] = useState(12);
  const [isDirty, setIsDirty] = useState(false);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);
  const [findDialogOpen, setFindDialogOpen] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [lastSearchIndex, setLastSearchIndex] = useState(0);
  const lastMatchRef = useRef<{ start: number; end: number } | null>(null);
  const editorRef = useRef<NotepadEditorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const saveLinkRef = useRef<HTMLAnchorElement>(null);

  useImperativeHandle(ref, () => ({ isDirty }), [isDirty]);

  const markDirty = useCallback(() => setIsDirty(true), []);
  const markClean = useCallback(() => setIsDirty(false), []);

  const handleTextChange = useCallback(
    (newText: string) => {
      setText(newText);
      markDirty();
    },
    [markDirty]
  );

  const handleNew = useCallback(() => {
    if (isDirty && !window.confirm('Save changes before creating new file?')) return;
    setText('');
    setFileName(DEFAULT_FILE_NAME);
    markClean();
  }, [isDirty, markClean]);

  const handleOpen = useCallback(() => {
    if (isDirty && !window.confirm('Save changes before opening?')) return;
    fileInputRef.current?.click();
  }, [isDirty]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result ?? ''));
      setFileName(file.name);
      setIsDirty(false);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const handleSave = useCallback(() => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = saveLinkRef.current || document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    markClean();
  }, [text, fileName, markClean]);

  const handleSaveAs = useCallback(() => {
    handleSave();
  }, [handleSave]);

  const handleExit = useCallback(() => {
    if (isDirty && !window.confirm('Save changes before closing?')) return;
    onClose?.();
  }, [isDirty, onClose]);

  const handleFindNext = useCallback(
    (needle: string, options: FindReplaceOptions) => {
      let match = findNextMatch(text, needle, options, lastSearchIndex);
      if (!match) {
        match = findNextMatch(text, needle, options, 0);
        if (match) setLastSearchIndex(match.end);
        else setLastSearchIndex(0);
      } else {
        setLastSearchIndex(match.end);
      }
      lastMatchRef.current = match;
      if (match) {
        editorRef.current?.focus();
        editorRef.current?.setSelectionRange(match.start, match.end);
      }
    },
    [text, lastSearchIndex]
  );

  const handleReplace = useCallback(
    (needle: string, replacement: string, options: FindReplaceOptions) => {
      const match = lastMatchRef.current;
      const startFrom = match ? match.start : lastSearchIndex;
      const result = replaceOne(text, needle, replacement, options, startFrom);
      if (result) {
        setText(result.newText);
        setLastSearchIndex(result.end);
        lastMatchRef.current = { start: result.start, end: result.end };
        markDirty();
        editorRef.current?.focus();
        editorRef.current?.setSelectionRange(result.start, result.end);
      }
    },
    [text, lastSearchIndex, markDirty]
  );

  const handleReplaceAll = useCallback(
    (needle: string, replacement: string, options: FindReplaceOptions) => {
      const newText = replaceAll(text, needle, replacement, options);
      setText(newText);
      setLastSearchIndex(0);
      markDirty();
    },
    [text, markDirty]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'f') {
          e.preventDefault();
          setFindDialogOpen(true);
        } else if (e.key === 'h') {
          e.preventDefault();
          setReplaceDialogOpen(true);
        }
      }
    },
    []
  );

  useEffect(() => {
    setLastSearchIndex(0);
    lastMatchRef.current = null;
  }, [text]);

  const menus: MenuDef[] = [
    {
      label: 'File',
      items: [
        { label: 'New', shortcut: 'Ctrl+N', onClick: handleNew },
        { label: 'Open...', shortcut: 'Ctrl+O', onClick: handleOpen },
        { separator: true },
        { label: 'Save', shortcut: 'Ctrl+S', onClick: handleSave },
        { label: 'Save As...', onClick: handleSaveAs },
        { separator: true },
        { label: 'Exit', shortcut: 'Alt+F4', onClick: handleExit },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => document.execCommand('undo') },
        { label: 'Redo', shortcut: 'Ctrl+Y', onClick: () => document.execCommand('redo') },
        { separator: true },
        { label: 'Cut', shortcut: 'Ctrl+X', onClick: () => document.execCommand('cut') },
        { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => document.execCommand('copy') },
        { label: 'Paste', shortcut: 'Ctrl+V', onClick: () => document.execCommand('paste') },
        { separator: true },
        { label: 'Select All', shortcut: 'Ctrl+A', onClick: () => editorRef.current?.selectAll() },
        { separator: true },
        { label: 'Find...', shortcut: 'Ctrl+F', onClick: () => setFindDialogOpen(true) },
        { label: 'Replace...', shortcut: 'Ctrl+H', onClick: () => setReplaceDialogOpen(true) },
      ],
    },
    {
      label: 'Format',
      items: [
        { label: 'Word Wrap', onClick: () => setWordWrap((w) => !w) },
        { separator: true },
        { label: '10', onClick: () => setFontSize(10) },
        { label: '12', onClick: () => setFontSize(12) },
        { label: '14', onClick: () => setFontSize(14) },
        { label: '16', onClick: () => setFontSize(16) },
      ],
    },
  ];

  const windowTitle = `${fileName}${isDirty ? ' *' : ''} - Notepad`;

  const handleWindowClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleBeforeClose = useCallback(() => {
    if (isDirty && !window.confirm('Save changes before closing?')) return false;
    return true;
  }, [isDirty]);

  return (
    <Window
      id={id}
      title={windowTitle}
      initialPosition={{ x: 100, y: 80 }}
      initialSize={{ width: 600, height: 450 }}
      onBeforeClose={handleBeforeClose}
      onClose={handleWindowClose}
    >
      <Layout onKeyDown={handleKeyDown} tabIndex={0}>
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept=".txt,text/*"
        onChange={handleFileChange}
      />
      <a ref={saveLinkRef} style={{ display: 'none' }} />
      <MenuBar menus={menus} />
      <EditorArea>
        <NotepadEditor
          ref={editorRef}
          value={text}
          onChange={handleTextChange}
          wordWrap={wordWrap}
          fontSize={fontSize}
          onCursorChange={({ line, column }) => {
            setCursorLine(line);
            setCursorCol(column);
          }}
        />
      </EditorArea>
      <StatusBar>
        <span>Ln {cursorLine}, Col {cursorCol}</span>
        <span>Chars: {text.length}</span>
      </StatusBar>
      {(findDialogOpen || replaceDialogOpen) && (
        <FindReplaceDialog
          isOpen={findDialogOpen || replaceDialogOpen}
          showReplace={replaceDialogOpen}
          onClose={() => {
            setFindDialogOpen(false);
            setReplaceDialogOpen(false);
          }}
          onFindNext={handleFindNext}
          onReplace={handleReplace}
          onReplaceAll={handleReplaceAll}
        />
      )}
    </Layout>
    </Window>
  );
});

NotepadWindow.displayName = 'NotepadWindow';
