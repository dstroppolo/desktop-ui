import styled from 'styled-components';
import { Theme } from '../../types';

interface WindowContainerProps {
  $position: { x: number; y: number };
  $size: { width: number; height: number };
  $zIndex: number;
  $minimized: boolean;
  $maximized: boolean;
  $theme: Theme;
}

export const WindowContainer = styled.div<WindowContainerProps>`
  position: absolute;
  left: ${props => props.$maximized ? 0 : props.$position.x}px;
  top: ${props => props.$maximized ? 0 : props.$position.y}px;
  width: ${props => props.$maximized ? '100%' : `${props.$size.width}px`};
  height: ${props => props.$maximized ? '100%' : `${props.$size.height}px`};
  z-index: ${props => props.$zIndex};
  display: ${props => props.$minimized ? 'none' : 'flex'};
  flex-direction: column;
  background-color: ${props => props.$theme.window.backgroundColor};
  border: ${props => props.$maximized ? 'none' : `${props.$theme.window.borderWidth} solid ${props.$theme.window.borderColor}`};
  /* Windows XP: Rounded top corners, sharp bottom corners */
  border-radius: ${props => props.$maximized ? 0 : `${props.$theme.window.borderRadius} ${props.$theme.window.borderRadius} 0 0`};
  box-shadow: ${props => props.$maximized ? 'none' : props.$theme.window.shadow};
  overflow: hidden;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
`;

interface WindowHeaderProps {
  $theme: Theme;
  $maximized?: boolean;
}

export const WindowHeader = styled.div<WindowHeaderProps>`
  height: ${props => props.$theme.window.header.height};
  background: ${props => props.$theme.window.header.backgroundColor};
  color: ${props => props.$theme.window.header.textColor};
  display: flex;
  align-items: center;
  padding: ${props => props.$theme.window.header.padding};
  cursor: ${props => props.$maximized ? 'default' : 'move'};
  user-select: none;
  flex-shrink: 0;
  /* Windows XP: Rounded top corners on title bar */
  border-radius: ${props => props.$maximized ? 0 : '6px 6px 0 0'};
  /* Subtle inner highlight at top of title bar */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
`;

interface WindowTitleProps {
  $theme: Theme;
}

export const WindowTitle = styled.span<WindowTitleProps>`
  flex: 1;
  font-size: ${props => props.$theme.window.header.fontSize};
  font-weight: ${props => props.$theme.window.header.fontWeight};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* Windows XP: Text shadow for better readability on gradient background */
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
`;

export const WindowButtons = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 8px;
`;

interface WindowButtonProps {
  $theme: Theme;
  $type: 'minimize' | 'maximize' | 'close';
}

export const WindowButton = styled.button<WindowButtonProps>`
  width: ${props => props.$theme.window.button.size};
  height: ${props => props.$theme.window.button.size};
  border: none;
  border-radius: ${props => props.$theme.window.button.borderRadius};
  /* Windows XP: Gray/metallic button base */
  background: ${props => props.$type === 'close' && props.$theme.window.button.closeColor === '#000000' 
    ? 'transparent' 
    : 'transparent'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0 1px;
  position: relative;
  
  /* Windows XP: Gray button background with 3D effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => {
      if (props.$type === 'close') {
        return 'transparent';
      }
      return 'linear-gradient(to bottom, #e0e0e0 0%, #c0c0c0 50%, #a0a0a0 100%)';
    }};
    border: 1px solid #808080;
    border-radius: ${props => props.$theme.window.button.borderRadius};
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  
  &:hover::before {
    opacity: ${props => props.$type === 'close' ? 0 : 1};
  }
  
  /* Windows XP: Red close button on hover */
  &:hover {
    background: ${props => {
      if (props.$type === 'close') {
        return '#e81123'; // Windows XP red close button
      }
      return 'transparent';
    }};
    
    &::before {
      opacity: ${props => props.$type === 'close' ? 0 : 1};
    }
  }
  
  &:active {
    background: ${props => {
      if (props.$type === 'close') {
        return '#c50e1f'; // Darker red when active
      }
      return 'linear-gradient(to bottom, #c0c0c0 0%, #a0a0a0 50%, #808080 100%)';
    }};
    
    &::before {
      opacity: ${props => props.$type === 'close' ? 0 : 1};
      background: ${props => props.$type === 'close' 
        ? 'transparent' 
        : 'linear-gradient(to bottom, #c0c0c0 0%, #a0a0a0 50%, #808080 100%)'};
    }
  }
  
  /* Ensure icons are above the background */
  & > * {
    position: relative;
    z-index: 1;
  }
`;

export const MinimizeIcon = styled.div`
  width: 11px;
  height: 1px;
  background: #000000;
  border-top: 1px solid #000000;
`;

export const MaximizeIcon = styled.div`
  width: 9px;
  height: 9px;
  border: 1px solid #000000;
  background: transparent;
  position: relative;
  
  /* Windows XP maximize icon has a second square overlay */
  &::after {
    content: '';
    position: absolute;
    width: 7px;
    height: 7px;
    border: 1px solid #000000;
    top: -3px;
    left: -3px;
    background: transparent;
  }
`;

export const CloseIcon = styled.div`
  width: 12px;
  height: 12px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 1.5px;
    background: #000000;
    top: 50%;
    left: 50%;
    transform-origin: center;
    transition: background 0.15s ease;
  }
  
  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  
  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
  
  /* Windows XP: White X on red background when parent button is hovered */
  button:hover > & {
    &::before,
    &::after {
      background: #ffffff;
    }
  }
`;

interface WindowContentProps {
  $theme: Theme;
}

export const WindowContent = styled.div<WindowContentProps>`
  flex: 1;
  overflow: auto;
  background-color: ${props => props.$theme.window.backgroundColor};
  /* This ensures responsive content works correctly */
  width: 100%;
  height: 100%;
  /* Windows XP: Light gray background with subtle texture */
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.03) 2px,
      rgba(255, 255, 255, 0.03) 4px
    );
`;

interface ResizeHandleProps {
  $handle: string;
  $theme: Theme;
}

export const ResizeHandle = styled.div<ResizeHandleProps>`
  position: absolute;
  background: transparent;
  z-index: 10;
  
  ${props => {
    const handle = props.$handle;
    const size = 8;
    
    if (handle === 'n') {
      return `
        top: 0;
        left: 0;
        right: 0;
        height: ${size}px;
        cursor: ns-resize;
      `;
    }
    if (handle === 's') {
      return `
        bottom: 0;
        left: 0;
        right: 0;
        height: ${size}px;
        cursor: ns-resize;
      `;
    }
    if (handle === 'e') {
      return `
        top: 0;
        right: 0;
        bottom: 0;
        width: ${size}px;
        cursor: ew-resize;
      `;
    }
    if (handle === 'w') {
      return `
        top: 0;
        left: 0;
        bottom: 0;
        width: ${size}px;
        cursor: ew-resize;
      `;
    }
    if (handle === 'ne') {
      return `
        top: 0;
        right: 0;
        width: ${size}px;
        height: ${size}px;
        cursor: nesw-resize;
      `;
    }
    if (handle === 'nw') {
      return `
        top: 0;
        left: 0;
        width: ${size}px;
        height: ${size}px;
        cursor: nwse-resize;
      `;
    }
    if (handle === 'se') {
      return `
        bottom: 0;
        right: 0;
        width: ${size}px;
        height: ${size}px;
        cursor: nwse-resize;
      `;
    }
    if (handle === 'sw') {
      return `
        bottom: 0;
        left: 0;
        width: ${size}px;
        height: ${size}px;
        cursor: nesw-resize;
      `;
    }
    return '';
  }}
`;
