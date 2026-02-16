import styled from 'styled-components';
import { Theme } from '../../types';

interface DesktopContainerProps {
  $theme: Theme;
}

export const DesktopContainer = styled.div<DesktopContainerProps>`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background: ${props => props.$theme.desktop.background};
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom, 0px);
`;
