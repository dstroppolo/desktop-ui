import React from 'react';
import { StartButton as StyledStartButton, StartButtonText, WindowsLogo } from './Taskbar.styles';
import { useTheme } from '../../context/DesktopContext';

export interface StartButtonProps {
  onClick?: () => void;
}

export const StartButton = React.forwardRef<HTMLButtonElement, StartButtonProps>(
  ({ onClick }, ref) => {
    const theme = useTheme();
    const logoColors = theme.taskbar.startButton.logoColors || {
      color1: '#0078d4',
      color2: '#00a4ef',
    };

    return (
      <StyledStartButton ref={ref} $theme={theme} onClick={onClick}>
      <WindowsLogo>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Windows logo - four colored squares (themeable) */}
          <rect x="2" y="2" width="6" height="6" fill={logoColors.color1} />
          <rect x="10" y="2" width="6" height="6" fill={logoColors.color2} />
          <rect x="2" y="10" width="6" height="6" fill={logoColors.color2} />
          <rect x="10" y="10" width="6" height="6" fill={logoColors.color1} />
        </svg>
      </WindowsLogo>
      <StartButtonText $theme={theme}>start</StartButtonText>
    </StyledStartButton>
  );
  }
);

StartButton.displayName = 'StartButton';
