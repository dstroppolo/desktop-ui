import styled from 'styled-components';
import { Theme } from '../../types';

const getStartMenuTheme = (theme: Theme) =>
  theme.startMenu ?? {
    backgroundColor: theme.window.backgroundColor,
    borderColor: theme.window.borderColor,
    borderWidth: theme.window.borderWidth,
    borderRadius: theme.window.borderRadius,
    shadow: theme.window.shadow,
    minWidth: '220px',
  };

interface StartMenuPanelProps {
  $theme: Theme;
  $top: number;
  $left: number;
}

export const StartMenuPanel = styled.div<StartMenuPanelProps>`
  position: fixed;
  top: ${(props) => props.$top}px;
  left: ${(props) => props.$left}px;
  transform: translateY(-100%);
  margin-top: -4px;
  min-width: ${(props) => getStartMenuTheme(props.$theme).minWidth ?? '220px'};
  max-width: 320px;
  background: ${(props) =>
    getStartMenuTheme(props.$theme).backgroundColor ?? props.$theme.window.backgroundColor};
  border: ${(props) => {
    const t = getStartMenuTheme(props.$theme);
    return `${t.borderWidth ?? '1px'} solid ${t.borderColor ?? props.$theme.window.borderColor}`;
  }};
  border-radius: ${(props) =>
    getStartMenuTheme(props.$theme).borderRadius ?? props.$theme.window.borderRadius};
  box-shadow: ${(props) =>
    getStartMenuTheme(props.$theme).shadow ?? '2px 2px 8px rgba(0, 0, 0, 0.2)'};
  padding: 6px 0;
  z-index: 10001;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
`;

export const StartMenuItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
