import styled from 'styled-components';
import { Theme } from '../../types';

interface TaskbarContainerProps {
  $theme: Theme;
}

export const TaskbarContainer = styled.div<TaskbarContainerProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${props => props.$theme.taskbar.height};
  background: ${props => props.$theme.taskbar.backgroundColor};
  border-top: ${props => props.$theme.taskbar.borderTop};
  display: flex;
  align-items: center;
  padding: 0;
  z-index: 10000;
  gap: 2px;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  /* Windows XP: Subtle inner highlight at top of taskbar */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
`;

export const TaskbarItemsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
`;

interface TaskbarClockProps {
  $theme: Theme;
}

export const TaskbarClock = styled.div<TaskbarClockProps>`
  margin-left: auto;
  margin-right: 6px;
  padding: 0 10px;
  min-width: 72px;
  height: calc(${(props) => props.$theme.taskbar.height} - 8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.$theme.taskbar.item.textColor};
  font-size: ${(props) => props.$theme.taskbar.item.fontSize};
  white-space: nowrap;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
`;

interface StartButtonProps {
  $theme: Theme;
}

export const StartButton = styled.button<StartButtonProps>`
  height: ${props => props.$theme.taskbar.height};
  min-width: ${props => props.$theme.taskbar.startButton.minWidth};
  background: ${props => props.$theme.taskbar.startButton.backgroundColor};
  border: none;
  border-radius: 0 ${props => props.$theme.taskbar.startButton.borderRadius} ${props => props.$theme.taskbar.startButton.borderRadius} 0;
  padding: ${props => props.$theme.taskbar.startButton.padding};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  margin: 0;
  margin-right: 8px;
  position: relative;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  
  /* 3D effect with highlight */
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: ${props => props.$theme.taskbar.startButton.hoverBackground};
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(0, 0, 0, 0.15),
      0 1px 3px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    background: ${props => props.$theme.taskbar.startButton.activeBackground};
    box-shadow: 
      inset 0 1px 2px rgba(0, 0, 0, 0.3),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(1px);
  }
`;

export const WindowsLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface StartButtonTextProps {
  $theme: Theme;
}

export const StartButtonText = styled.span<StartButtonTextProps>`
  color: ${props => props.$theme.taskbar.startButton.textColor};
  font-size: ${props => props.$theme.taskbar.startButton.fontSize};
  font-weight: ${props => props.$theme.taskbar.startButton.fontWeight};
  text-transform: lowercase;
  letter-spacing: 0.5px;
  user-select: none;
`;

interface TaskbarItemProps {
  $theme: Theme;
  $active: boolean;
  $minimized: boolean;
}

export const TaskbarItem = styled.button<TaskbarItemProps>`
  background: ${props => 
    props.$active 
      ? props.$theme.taskbar.item.activeBackground 
      : props.$theme.taskbar.item.backgroundColor};
  color: ${props => props.$theme.taskbar.item.textColor};
  border: none;
  padding: ${props => props.$theme.taskbar.item.padding};
  font-size: ${props => props.$theme.taskbar.item.fontSize};
  border-radius: ${props => props.$theme.taskbar.item.borderRadius};
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  min-width: 200px;
  height: calc(${props => props.$theme.taskbar.height} - 6px);
  bottom: 1px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  position: relative;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  
  /* Windows XP: 3D effect on active taskbar button */
  ${props => props.$active && `
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    border-left: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
  `}
  
  /* Windows XP: Border outline for minimized windows */
  ${props => props.$minimized && !props.$active && `
    border: 1px solid rgba(255, 255, 255, 0.25);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  `}
  
  &:hover {
    background: ${props => 
      props.$active 
        ? props.$theme.taskbar.item.activeBackground 
        : props.$theme.taskbar.item.hoverBackground};
    
    /* Windows XP: Subtle highlight on hover */
    ${props => !props.$active && `
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
    `}
  }
  
  &:active {
    background: ${props => props.$theme.taskbar.item.activeBackground};
    box-shadow: 
      inset 0 1px 2px rgba(0, 0, 0, 0.2),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  }
`;
