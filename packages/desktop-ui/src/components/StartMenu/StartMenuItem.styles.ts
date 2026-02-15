import styled from 'styled-components';
import { Theme } from '../../types';

const getStartMenuTheme = (theme: Theme) =>
  theme.startMenu ?? {
    itemTextColor: theme.input?.textColor ?? '#000000',
    itemHoverBackground: theme.input?.buttonHoverBackground ?? 'rgba(0, 0, 0, 0.08)',
    itemHoverTextColor: undefined,
    itemPadding: '8px 24px 8px 12px',
    itemFontSize: '12px',
  };

interface StartMenuItemContainerProps {
  $theme: Theme;
}

export const StartMenuItemContainer = styled.button<StartMenuItemContainerProps>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${(props) => getStartMenuTheme(props.$theme).itemPadding};
  font-size: ${(props) => getStartMenuTheme(props.$theme).itemFontSize};
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  color: ${(props) => getStartMenuTheme(props.$theme).itemTextColor};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${(props) =>
      getStartMenuTheme(props.$theme).itemHoverBackground ?? 'rgba(0, 0, 0, 0.08)'};
    color: ${(props) =>
      getStartMenuTheme(props.$theme).itemHoverTextColor ??
      getStartMenuTheme(props.$theme).itemTextColor};
  }

  &:active {
    background: ${(props) =>
      getStartMenuTheme(props.$theme).itemHoverBackground ?? 'rgba(0, 0, 0, 0.08)'};
    color: ${(props) =>
      getStartMenuTheme(props.$theme).itemHoverTextColor ??
      getStartMenuTheme(props.$theme).itemTextColor};
  }
`;

export const StartMenuItemIcon = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

export const StartMenuItemLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
