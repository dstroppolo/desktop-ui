import styled from 'styled-components';
import { Theme } from '../../types';

interface SplitPaneContainerProps {
  $theme: Theme;
}

export const SplitPaneContainer = styled.div<SplitPaneContainerProps>`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
`;

interface LeftPaneProps {
  $width: number;
}

export const LeftPane = styled.div<LeftPaneProps>`
  width: ${(props) => props.$width}px;
  min-width: ${(props) => props.$width}px;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
`;

interface ResizeHandleProps {
  $theme: Theme;
  $size: number;
}

export const ResizeHandle = styled.div<ResizeHandleProps>`
  width: ${(props) => props.$size}px;
  min-width: ${(props) => props.$size}px;
  height: 100%;
  background: ${(props) => props.$theme.window.borderColor ?? '#e0e0e0'};
  cursor: col-resize;
  flex-shrink: 0;
  position: relative;
  user-select: none;

  &:hover {
    background: ${(props) => props.$theme.input?.focusBorderColor ?? '#0078d4'};
  }

  &:active {
    background: ${(props) => props.$theme.input?.focusBorderColor ?? '#0078d4'};
  }
`;

export const RightPane = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow: hidden;
`;
