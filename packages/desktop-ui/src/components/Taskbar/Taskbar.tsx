import React, { useEffect, useRef, useState } from 'react';
import { TaskbarProps } from '../../types';
import { useWindowManager } from '../../hooks/useWindowManager';
import { useTheme } from '../../context/DesktopContext';
import { TaskbarClock, TaskbarContainer, TaskbarItemsContainer } from './Taskbar.styles';
import { TaskbarItemComponent } from './TaskbarItem';
import { StartButton } from './StartButton';
import { StartMenu } from '../StartMenu/StartMenu';

const formatTaskbarTime = (date: Date): string =>
  date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export const Taskbar: React.FC<TaskbarProps> = ({ startMenuContent }) => {
  const windowManager = useWindowManager();
  const theme = useTheme();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => formatTaskbarTime(new Date()));
  const startButtonRef = useRef<HTMLButtonElement>(null);

  // Sort by ID for a stable taskbar order that doesn't shift when z-index changes.
  // This matches real OS behavior where taskbar items stay in place.
  const windows = windowManager.getAllWindows().sort((a, b) =>
    a.id.localeCompare(b.id)
  );

  useEffect(() => {
    const updateClock = () => setCurrentTime(formatTaskbarTime(new Date()));
    updateClock();

    const msUntilNextMinute = 60000 - (Date.now() % 60000);
    let intervalId: number | undefined;

    const timeoutId = window.setTimeout(() => {
      updateClock();
      intervalId = window.setInterval(updateClock, 60000);
    }, msUntilNextMinute);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const handleStartClick = () => {
    setStartMenuOpen((prev) => !prev);
  };

  return (
    <TaskbarContainer $theme={theme}>
      <StartButton
        ref={startButtonRef}
        onClick={handleStartClick}
      />
      <TaskbarItemsContainer>
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
      </TaskbarItemsContainer>
      <TaskbarClock $theme={theme} aria-live="off">
        {currentTime}
      </TaskbarClock>
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
