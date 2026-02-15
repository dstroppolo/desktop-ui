import React from 'react';
import { WindowState } from '../../types';
import { TaskbarItem as StyledTaskbarItem } from './Taskbar.styles';
import { useTheme } from '../../context/DesktopContext';

interface TaskbarItemProps {
  window: WindowState;
  onClick: () => void;
}

export const TaskbarItemComponent: React.FC<TaskbarItemProps> = ({ window, onClick }) => {
  const theme = useTheme();
  const isActive = !window.minimized;

  return (
    <StyledTaskbarItem
      $theme={theme}
      $active={isActive}
      $minimized={window.minimized}
      onClick={onClick}
      title={window.title}
    >
      {window.title}
    </StyledTaskbarItem>
  );
};
