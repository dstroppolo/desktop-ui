import React from 'react';
import {
  WindowHeader as StyledHeader,
  WindowTitle,
  WindowButtons,
  WindowButton,
  MinimizeIcon,
  MaximizeIcon,
  CloseIcon,
} from './Window.styles';
import { useTheme } from '../../context/DesktopContext';

interface WindowHeaderProps {
  title: string;
  maximized?: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  maximized = false,
  onMinimize,
  onMaximize,
  onClose,
  onMouseDown,
}) => {
  const theme = useTheme();

  return (
    <StyledHeader $theme={theme} $maximized={maximized} onMouseDown={onMouseDown}>
      <WindowTitle $theme={theme}>{title}</WindowTitle>
      <WindowButtons>
        <WindowButton
          $theme={theme}
          $type="minimize"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          aria-label="Minimize"
        >
          <MinimizeIcon />
        </WindowButton>
        <WindowButton
          $theme={theme}
          $type="maximize"
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          aria-label="Maximize"
        >
          <MaximizeIcon />
        </WindowButton>
        <WindowButton
          $theme={theme}
          $type="close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
        >
          <CloseIcon />
        </WindowButton>
      </WindowButtons>
    </StyledHeader>
  );
};
