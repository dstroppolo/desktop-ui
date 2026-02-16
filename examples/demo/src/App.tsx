import React, { useState, useEffect, useCallback } from 'react';
import {
  Desktop,
  DesktopShortcut,
  Window,
  Taskbar,
  StartMenuItem,
  StartMenuSubmenu,
  FolderTree,
  ResizableSplitPane,
  TextInput,
  DateInput,
  Calendar,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  windowsXPTheme,
  windows98Theme,
  useDesktopPersistence,
} from 'desktop-ui';
import { NotepadWindow } from './apps/notepad/NotepadWindow';
import { MessengerWindow } from './apps/messenger/MessengerWindow';
import type { FolderTreeItem } from 'desktop-ui';
import './App.css';

const DEFAULT_SHORTCUT_POSITIONS: Record<string, { x: number; y: number }> = {
  'shortcut-1': { x: 16, y: 16 },
  'shortcut-2': { x: 16, y: 80 },
  'shortcut-3': { x: 96, y: 16 },
  'shortcut-form': { x: 176, y: 16 },
  'shortcut-explorer': { x: 256, y: 16 },
  'shortcut-notepad': { x: 336, y: 16 },
  'shortcut-messenger': { x: 416, y: 16 },
};

function AppContent() {
  const persistence = useDesktopPersistence({ storageKey: 'desktop-ui-demo' });
  const {
    shortcutPositions,
    windowLayouts,
    openWindows,
    theme: persistedTheme,
    saveShortcutPosition,
    saveWindowLayout,
    setOpenWindows,
    setTheme,
  } = persistence;

  const [themeName, setThemeName] = useState<'xp' | '98'>(() =>
    (persistedTheme === 'xp' || persistedTheme === '98') ? persistedTheme : 'xp'
  );
  const [hmrKey, setHmrKey] = useState(0);

  const theme = themeName === 'xp' ? windowsXPTheme : windows98Theme;
  const genericWindowIds = (openWindows ?? []).filter((id) => /^window-\d+$/.test(id));
  const formWindowOpen = (openWindows ?? []).includes('form-demo');
  const explorerWindowOpen = (openWindows ?? []).includes('file-explorer');
  const notepadWindowOpen = (openWindows ?? []).includes('notepad');
  const messengerWindowOpen = (openWindows ?? []).includes('messenger');

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.accept('desktop-ui', () => {
        setHmrKey((prev) => prev + 1);
      });
    }
  }, []);

  useEffect(() => {
    setTheme(themeName);
  }, [themeName, setTheme]);

  useEffect(() => {
    if (openWindows.length === 0) {
      setOpenWindows(['window-1']);
    }
  }, []);

  const createNewWindow = () => {
    const maxNum = genericWindowIds.length > 0
      ? Math.max(...genericWindowIds.map((id) => parseInt(id.replace('window-', ''), 10)))
      : 0;
    setOpenWindows([...openWindows, `window-${maxNum + 1}`]);
  };

  const openWindow = (id: string) => {
    if (!openWindows.includes(id)) {
      setOpenWindows([...openWindows, id]);
    }
  };

  const closeWindow = (id: string) => {
    setOpenWindows(openWindows.filter((x) => x !== id));
  };

  const toggleTheme = () => {
    setThemeName((prev) => (prev === 'xp' ? '98' : 'xp'));
  };

  const saveAndClose = useCallback(
    (id: string, state: { position: { x: number; y: number }; size: { width: number; height: number } } | undefined) => {
      if (state) {
        saveWindowLayout(id, {
          x: state.position.x,
          y: state.position.y,
          width: state.size.width,
          height: state.size.height,
        });
      }
      setOpenWindows(openWindows.filter((x) => x !== id));
    },
    [saveWindowLayout, setOpenWindows, openWindows]
  );

  return (
    <div>
    <Desktop key={`desktop-${hmrKey}`} theme={theme} grid gridSize={64}>
      <DesktopShortcut
        id="shortcut-1"
        label="My Computer"
        icon="🖥️"
        initialPosition={shortcutPositions['shortcut-1'] ?? DEFAULT_SHORTCUT_POSITIONS['shortcut-1']}
        onPositionChange={(pos) => saveShortcutPosition('shortcut-1', pos)}
        onDoubleClick={() => createNewWindow()}
      />
      <DesktopShortcut
        id="shortcut-2"
        label="Recycle Bin"
        icon="🗑️"
        initialPosition={shortcutPositions['shortcut-2'] ?? DEFAULT_SHORTCUT_POSITIONS['shortcut-2']}
        onPositionChange={(pos) => saveShortcutPosition('shortcut-2', pos)}
        onDoubleClick={() => createNewWindow()}
      />
      <DesktopShortcut
        id="shortcut-3"
        label="Documents"
        icon="📁"
        initialPosition={shortcutPositions['shortcut-3'] ?? DEFAULT_SHORTCUT_POSITIONS['shortcut-3']}
        onPositionChange={(pos) => saveShortcutPosition('shortcut-3', pos)}
        onDoubleClick={() => createNewWindow()}
      />
      <DesktopShortcut
        id="shortcut-form"
        label="Form Demo"
        icon="📋"
        initialPosition={shortcutPositions['shortcut-form'] ?? DEFAULT_SHORTCUT_POSITIONS['shortcut-form']}
        onPositionChange={(pos) => saveShortcutPosition('shortcut-form', pos)}
        onDoubleClick={() => openWindow('form-demo')}
      />
      <DesktopShortcut
        id="shortcut-explorer"
        label="File Explorer"
        icon="📂"
        initialPosition={shortcutPositions['shortcut-explorer'] ?? DEFAULT_SHORTCUT_POSITIONS['shortcut-explorer']}
        onPositionChange={(pos) => saveShortcutPosition('shortcut-explorer', pos)}
        onDoubleClick={() => openWindow('file-explorer')}
      />
      <DesktopShortcut
        id="shortcut-notepad"
        label="Notepad"
        icon="📝"
        initialPosition={shortcutPositions['shortcut-notepad'] ?? DEFAULT_SHORTCUT_POSITIONS['shortcut-notepad']}
        onPositionChange={(pos) => saveShortcutPosition('shortcut-notepad', pos)}
        onDoubleClick={() => openWindow('notepad')}
      />
      <DesktopShortcut
        id="shortcut-messenger"
        label="Messenger"
        icon="💬"
        initialPosition={shortcutPositions['shortcut-messenger'] ?? DEFAULT_SHORTCUT_POSITIONS['shortcut-messenger']}
        onPositionChange={(pos) => saveShortcutPosition('shortcut-messenger', pos)}
        onDoubleClick={() => openWindow('messenger')}
      />
      {genericWindowIds.map((wid, i) => {
        const layout = windowLayouts[wid];
        return (
        <Window
          key={wid}
          id={wid}
          title={`Window ${i + 1}`}
          initialPosition={layout ? { x: layout.x, y: layout.y } : { x: 100 + i * 50, y: 100 + i * 50 }}
          initialSize={layout ? { width: layout.width, height: layout.height } : { width: 500, height: 400 }}
          onClose={(state) => saveAndClose(wid, state)}
          onLayoutChange={(l) => saveWindowLayout(wid, { x: l.position.x, y: l.position.y, width: l.size.width, height: l.size.height })}
        >
          <div style={{ padding: '20px' }}>
            <h2>Window {i + 1}</h2>
            <p>This is a demo window in the Desktop UI library.</p>
            <p>You can:</p>
            <ul>
              <li>Drag the window by clicking and dragging the title bar</li>
              <li>Resize the window by dragging the edges or corners</li>
              <li>Minimize the window using the minimize button</li>
              <li>Close the window using the close button</li>
            </ul>
            <div style={{ marginTop: '20px' }}>
              <h3>Responsive Content Test</h3>
              <p>This window uses actual CSS width/height, so responsive content works!</p>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#e0e0e0', 
                padding: '10px',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                <p>Window width: <span id={`width-${i + 1}`}>-</span>px</p>
                <p>Window height: <span id={`height-${i + 1}`}>-</span>px</p>
              </div>
            </div>
          </div>
        </Window>
        );
      })}
      {formWindowOpen && (
        <Window
          id="form-demo"
          title="Form Components Demo"
          initialPosition={windowLayouts['form-demo'] ? { x: windowLayouts['form-demo'].x, y: windowLayouts['form-demo'].y } : { x: 150, y: 80 }}
          initialSize={windowLayouts['form-demo'] ? { width: windowLayouts['form-demo'].width, height: windowLayouts['form-demo'].height } : { width: 380, height: 480 }}
          onClose={(state) => saveAndClose('form-demo', state)}
          onLayoutChange={(l) => saveWindowLayout('form-demo', { x: l.position.x, y: l.position.y, width: l.size.width, height: l.size.height })}
        >
          <FormDemo />
        </Window>
      )}
      {explorerWindowOpen && (
        <Window
          id="file-explorer"
          title="File Explorer"
          initialPosition={windowLayouts['file-explorer'] ? { x: windowLayouts['file-explorer'].x, y: windowLayouts['file-explorer'].y } : { x: 80, y: 60 }}
          initialSize={windowLayouts['file-explorer'] ? { width: windowLayouts['file-explorer'].width, height: windowLayouts['file-explorer'].height } : { width: 520, height: 400 }}
          onClose={(state) => saveAndClose('file-explorer', state)}
          onLayoutChange={(l) => saveWindowLayout('file-explorer', { x: l.position.x, y: l.position.y, width: l.size.width, height: l.size.height })}
        >
          <FileExplorerDemo />
        </Window>
      )}
      {notepadWindowOpen && (
        <NotepadWindow
          initialPosition={windowLayouts['notepad'] ? { x: windowLayouts['notepad'].x, y: windowLayouts['notepad'].y } : undefined}
          initialSize={windowLayouts['notepad'] ? { width: windowLayouts['notepad'].width, height: windowLayouts['notepad'].height } : undefined}
          onClose={(state) => saveAndClose('notepad', state)}
          onLayoutChange={(l) => saveWindowLayout('notepad', { x: l.position.x, y: l.position.y, width: l.size.width, height: l.size.height })}
        />
      )}
      {messengerWindowOpen && (
        <MessengerWindow
          initialPosition={windowLayouts['messenger'] ? { x: windowLayouts['messenger'].x, y: windowLayouts['messenger'].y } : undefined}
          initialSize={windowLayouts['messenger'] ? { width: windowLayouts['messenger'].width, height: windowLayouts['messenger'].height } : undefined}
          onClose={(state) => saveAndClose('messenger', state)}
          onLayoutChange={(l) => saveWindowLayout('messenger', { x: l.position.x, y: l.position.y, width: l.size.width, height: l.size.height })}
        />
      )}
      <Taskbar
        startMenuContent={
          <>
            <StartMenuItem
              icon="🖥️"
              label="My Computer"
              onClick={createNewWindow}
            />
            <StartMenuItem
              icon="🗑️"
              label="Recycle Bin"
              onClick={createNewWindow}
            />
            <StartMenuSubmenu icon="📁" label="Documents">
              <StartMenuItem
                icon="📄"
                label="My Documents"
                onClick={createNewWindow}
              />
              <StartMenuItem
                icon="📋"
                label="Recent"
                onClick={createNewWindow}
              />
            </StartMenuSubmenu>
            <StartMenuItem
              icon="📋"
              label="Form Demo"
              onClick={() => openWindow('form-demo')}
            />
            <StartMenuSubmenu icon="📂" label="Programs">
              <StartMenuItem
                icon="📂"
                label="File Explorer"
                onClick={() => openWindow('file-explorer')}
              />
              <StartMenuItem
                icon="📝"
                label="Notepad"
                onClick={() => openWindow('notepad')}
              />
              <StartMenuItem
                icon="💬"
                label="Messenger"
                onClick={() => openWindow('messenger')}
              />
            </StartMenuSubmenu>
          </>
        }
      />
    </Desktop>
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={createNewWindow}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0078d4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Open New Window
        </button>
        <button
          onClick={toggleTheme}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0078d4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Switch Theme ({themeName === 'xp' ? 'XP' : '98'})
        </button>
      </div>
    </div>
  );
}

function FormDemo() {
  const [text, setText] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState('a');

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
            Text Input
          </label>
          <TextInput
            value={text}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setText(e.target.value)}
            placeholder="Enter text..."
            width={320}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
            Date Input
          </label>
          <DateInput
            value={date}
            onChange={setDate}
            placeholder="Select date"
            width={320}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
            Standalone Calendar
          </label>
          <Calendar value={date} onChange={setDate} />
        </div>
        <div>
          <Checkbox
            checked={checked}
            onChange={(e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => setChecked(e.target.checked)}
            label="Check this box"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
            Radio Group
          </label>
          <RadioGroup value={radioValue} onChange={setRadioValue} name="demo">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
              <Radio value="c" label="Option C" />
            </div>
          </RadioGroup>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <Button variant="primary" onClick={() => alert('Primary clicked!')}>
            Primary
          </Button>
          <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
            Secondary
          </Button>
          <Button variant="danger" size="small">
            Danger
          </Button>
        </div>
      </div>
    </div>
  );
}

const SAMPLE_FOLDER_DATA: FolderTreeItem[] = [
  {
    id: 'documents',
    label: 'Documents',
    icon: '📁',
    children: [
      { id: 'doc-github', label: 'GitHub', icon: '📁', children: [] },
      { id: 'doc-capstone', label: 'Capstone', icon: '📁', children: [] },
      { id: 'doc-work', label: 'work', icon: '📁', children: [] },
    ],
  },
  {
    id: 'onedrive',
    label: 'OneDrive - Personal',
    icon: '☁️',
    children: [
      { id: 'od-apps', label: 'Apps', icon: '📁', children: [] },
      { id: 'od-attachments', label: 'Attachments', icon: '📁', children: [] },
      { id: 'od-documents', label: 'Documents', icon: '📁', children: [] },
    ],
  },
  {
    id: 'this-pc',
    label: 'This PC',
    icon: '🖥️',
    children: [
      { id: 'pc-3d', label: '3D Objects', icon: '📁', children: [] },
      { id: 'pc-desktop', label: 'Desktop', icon: '📁', children: [] },
      { id: 'pc-docs', label: 'Documents', icon: '📁', children: [] },
      { id: 'pc-downloads', label: 'Downloads', icon: '📁', children: [] },
      { id: 'pc-music', label: 'Music', icon: '📁', children: [] },
      { id: 'pc-pictures', label: 'Pictures', icon: '📁', children: [] },
      { id: 'pc-videos', label: 'Videos', icon: '📁', children: [] },
    ],
  },
  {
    id: 'drive-c',
    label: 'Local Disk (C:)',
    icon: '💾',
    children: [],
  },
  {
    id: 'drive-d',
    label: 'Joe Biden (D:)',
    icon: '💾',
    children: [
      {
        id: 'd-oldest',
        label: 'oldest phone',
        icon: '📁',
        children: [
          {
            id: 'd-oldest-dcim',
            label: 'DCIM',
            icon: '📁',
            children: [
              { id: 'dcim-camera', label: 'Camera', icon: '📁', children: [] },
              { id: 'dcim-facebook', label: 'Facebook', icon: '📁', children: [] },
              { id: 'dcim-pictures', label: 'Pictures', icon: '📁', children: [] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'drive-e',
    label: 'Rapido (E:)',
    icon: '💾',
    children: [],
  },
  {
    id: 'libraries',
    label: 'Libraries',
    icon: '📚',
    children: [
      { id: 'lib-docs', label: 'Documents', icon: '📁', children: [] },
      { id: 'lib-music', label: 'Music', icon: '📁', children: [] },
      { id: 'lib-pictures', label: 'Pictures', icon: '📁', children: [] },
    ],
  },
];

function findItemById(items: FolderTreeItem[], id: string): FolderTreeItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function FileExplorerDemo() {
  const [selectedId, setSelectedId] = useState<string | undefined>('drive-d');
  const selectedItem = selectedId ? findItemById(SAMPLE_FOLDER_DATA, selectedId) : undefined;

  return (
    <ResizableSplitPane
      left={
        <FolderTree
          items={SAMPLE_FOLDER_DATA}
          selectedId={selectedId}
          onSelect={(item: { id: React.SetStateAction<string | undefined>; }) => setSelectedId(item.id)}
          defaultExpandedIds={['this-pc', 'drive-d', 'd-oldest', 'd-oldest-dcim']}
          minWidth={120}
        />
      }
      right={
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fff',
            height: '100%',
            overflow: 'auto',
          }}
        >
          <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
            {selectedItem ? `Selected: ${selectedItem.label}` : 'Select a folder from the list'}
          </p>
        </div>
      }
      defaultLeftWidth={220}
      minLeftWidth={120}
      maxLeftWidth={400}
      handleSize={6}
    />
  );
}

function App() {
  return <AppContent />;
}

export default App;
