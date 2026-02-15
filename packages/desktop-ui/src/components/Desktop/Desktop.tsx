import React from 'react';
import { DesktopProps } from '../../types';
import { ThemeProvider, useDesktop } from '../../context/DesktopContext';
import { DesktopContainer } from './Desktop.styles';

const DesktopContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { theme } = useDesktop();

  return (
    <DesktopContainer data-desktop $theme={theme}>
      {children}
    </DesktopContainer>
  );
};

export const Desktop: React.FC<DesktopProps> = ({
  theme,
  grid = false,
  gridSize = 64,
  children,
}) => {
  return (
    <ThemeProvider theme={theme} grid={grid} gridSize={gridSize}>
      <DesktopContent>{children}</DesktopContent>
    </ThemeProvider>
  );
};
