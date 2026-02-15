import styled from 'styled-components';
import { Theme } from '../../types';
import { StartMenuItemContainer } from './StartMenuItem.styles';

const getStartMenuTheme = (theme: Theme) =>
  theme.startMenu ?? {
    itemTextColor: theme.input?.textColor ?? '#000000',
    itemHoverBackground: theme.input?.buttonHoverBackground ?? 'rgba(0, 0, 0, 0.08)',
    itemHoverTextColor: undefined,
    itemPadding: '8px 24px 8px 12px',
    itemFontSize: '12px',
    backgroundColor: theme.window.backgroundColor,
    borderColor: theme.window.borderColor,
    borderWidth: theme.window.borderWidth,
    borderRadius: theme.window.borderRadius,
    shadow: theme.window.shadow,
  };

interface SubmenuWrapperProps {
  $theme: Theme;
}

export const SubmenuWrapper = styled.div<SubmenuWrapperProps>`
  position: relative;
`;

export const SubmenuTrigger = styled(StartMenuItemContainer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const SubmenuTriggerContent = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
`;

export const SubmenuArrow = styled.span`
  font-size: 10px;
  opacity: 0.7;
  flex-shrink: 0;
  margin-left: 4px;
`;

interface SubmenuPanelProps {
  $theme: Theme;
  $visible: boolean;
}

export const SubmenuPanel = styled.div<SubmenuPanelProps>`
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 2px;
  min-width: 180px;
  padding: 6px 0;
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
  z-index: 10002;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? 'visible' : 'hidden')};
  pointer-events: ${(props) => (props.$visible ? 'auto' : 'none')};
  transition: opacity 0.1s ease, visibility 0.1s ease;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;
