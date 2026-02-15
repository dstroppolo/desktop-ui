import React, { useState, useRef } from 'react';
import { TaskbarProps } from '../../types';
import { useWindowManager } from '../../hooks/useWindowManager';
import { useTheme } from '../../context/DesktopContext';
import { TaskbarContainer } from './Taskbar.styles';
import { TaskbarItemComponent } from './TaskbarItem';
import { StartButton } from './StartButton';
import { StartMenu } from '../StartMenu/StartMenu';

export const Taskbar: React.FC<TaskbarProps> = ({ startMenuContent }) => {
  const windowManager = useWindowManager();
  const theme = useTheme();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // Sort by ID for a stable taskbar order that doesn't shift when z-index changes.
  // This matches real OS behavior where taskbar items stay in place.
  const windows = windowManager.getAllWindows().sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  const handleStartClick = () => {
    setStartMenuOpen((prev) => !prev);
  };

  return (
    <TaskbarContainer $theme={theme}>
      <StartButton
        ref={startButtonRef}
        onClick={handleStartClick}
      />
      {windows.map((win) => (
        <TaskbarItemComponent
          key={win.id}
          window={win}
          onClick={() => {
            // Read fresh state at click time
            const current = windowManager.getWindow(win.id);
            if (!current) return;
            if (current.minimized) {
              windowManager.restoreWindow(win.id);
            } else {
              windowManager.minimizeWindow(win.id);
            }
          }}
        />
      ))}
      {startMenuContent && (
        <StartMenu
          open={startMenuOpen}
          onClose={() => setStartMenuOpen(false)}
          anchorRef={startButtonRef}
        >
          {startMenuContent}
        </StartMenu>
      )}
    </TaskbarContainer>
  );
};
