import React, { useState, useEffect } from 'react';
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
} from 'desktop-ui';
import { NotepadWindow } from './apps/notepad/NotepadWindow';
import { MessengerWindow } from './apps/messenger/MessengerWindow';
import type { FolderTreeItem } from 'desktop-ui';
import './App.css';

function App() {
  const [themeName, setThemeName] = useState<'xp' | '98'>('xp');
  const [windowCount, setWindowCount] = useState(1);
  const [formWindowOpen, setFormWindowOpen] = useState(false);
  const [explorerWindowOpen, setExplorerWindowOpen] = useState(false);
  const [notepadWindowOpen, setNotepadWindowOpen] = useState(false);
  const [messengerWindowOpen, setMessengerWindowOpen] = useState(false);
  const [hmrKey, setHmrKey] = useState(0);
  
  // Always get fresh theme reference - this ensures we get the latest theme object
  const theme = themeName === 'xp' ? windowsXPTheme : windows98Theme;
  
  // HMR: Force re-render when theme files update
  // This ensures theme changes are picked up without manual refresh
  useEffect(() => {
    if (import.meta.hot) {
      // Accept updates from desktop-ui (the alias points to packages/desktop-ui/src)
      // When any file in the library changes, force Desktop to re-render
      import.meta.hot.accept('desktop-ui', () => {
        setHmrKey(prev => prev + 1);
      });
    }
  }, []);

  const createNewWindow = () => {
    setWindowCount(prev => prev + 1);
  };

  const toggleTheme = () => {
    setThemeName(prev => prev === 'xp' ? '98' : 'xp');
  };

  return (
    <div>
    <Desktop key={`desktop-${hmrKey}`} theme={theme} grid gridSize={64}>
      <DesktopShortcut
        id="shortcut-1"
        label="My Computer"
        icon="🖥️"
        initialPosition={{ x: 16, y: 16 }}
        onDoubleClick={() => createNewWindow()}
      />
      <DesktopShortcut
        id="shortcut-2"
        label="Recycle Bin"
        icon="🗑️"
        initialPosition={{ x: 16, y: 80 }}
        onDoubleClick={() => createNewWindow()}
      />
      <DesktopShortcut
        id="shortcut-3"
        label="Documents"
        icon="📁"
        initialPosition={{ x: 96, y: 16 }}
        onDoubleClick={() => createNewWindow()}
      />
      <DesktopShortcut
        id="shortcut-form"
        label="Form Demo"
        icon="📋"
        initialPosition={{ x: 176, y: 16 }}
        onDoubleClick={() => setFormWindowOpen(true)}
      />
      <DesktopShortcut
        id="shortcut-explorer"
        label="File Explorer"
        icon="📂"
        initialPosition={{ x: 256, y: 16 }}
        onDoubleClick={() => setExplorerWindowOpen(true)}
      />
      <DesktopShortcut
        id="shortcut-notepad"
        label="Notepad"
        icon="📝"
        initialPosition={{ x: 336, y: 16 }}
        onDoubleClick={() => setNotepadWindowOpen(true)}
      />
      <DesktopShortcut
        id="shortcut-messenger"
        label="Messenger"
        icon="💬"
        initialPosition={{ x: 416, y: 16 }}
        onDoubleClick={() => setMessengerWindowOpen(true)}
      />
      {Array.from({ length: windowCount }, (_, i) => (
        <Window
          key={`window-${i + 1}`}
          id={`window-${i + 1}`}
          title={`Window ${i + 1}`}
          initialPosition={{ x: 100 + i * 50, y: 100 + i * 50 }}
          initialSize={{ width: 500, height: 400 }}
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
      ))}
      {formWindowOpen && (
        <Window
          id="form-demo"
          title="Form Components Demo"
          initialPosition={{ x: 150, y: 80 }}
          initialSize={{ width: 380, height: 480 }}
          onClose={() => setFormWindowOpen(false)}
        >
          <FormDemo />
        </Window>
      )}
      {explorerWindowOpen && (
        <Window
          id="file-explorer"
          title="File Explorer"
          initialPosition={{ x: 80, y: 60 }}
          initialSize={{ width: 520, height: 400 }}
          onClose={() => setExplorerWindowOpen(false)}
        >
          <FileExplorerDemo />
        </Window>
      )}
      {notepadWindowOpen && (
        <NotepadWindow onClose={() => setNotepadWindowOpen(false)} />
      )}
      {messengerWindowOpen && (
        <MessengerWindow onClose={() => setMessengerWindowOpen(false)} />
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
              onClick={() => setFormWindowOpen(true)}
            />
            <StartMenuSubmenu icon="📂" label="Programs">
              <StartMenuItem
                icon="📂"
                label="File Explorer"
                onClick={() => setExplorerWindowOpen(true)}
              />
              <StartMenuItem
                icon="📝"
                label="Notepad"
                onClick={() => setNotepadWindowOpen(true)}
              />
              <StartMenuItem
                icon="💬"
                label="Messenger"
                onClick={() => setMessengerWindowOpen(true)}
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

export default App;
