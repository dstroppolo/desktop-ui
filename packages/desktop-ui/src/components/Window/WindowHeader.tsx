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
  onTouchStart: (e: React.TouchEvent) => void;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  maximized = false,
  onMinimize,
  onMaximize,
  onClose,
  onMouseDown,
  onTouchStart,
}) => {
  const theme = useTheme();
  const handleButtonMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
  };
  const handleButtonTouchStart: React.TouchEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <StyledHeader
      $theme={theme}
      $maximized={maximized}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <WindowTitle $theme={theme}>{title}</WindowTitle>
      <WindowButtons>
        <WindowButton
          $theme={theme}
          $type="minimize"
          onMouseDown={handleButtonMouseDown}
          onTouchStart={handleButtonTouchStart}
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
          onMouseDown={handleButtonMouseDown}
          onTouchStart={handleButtonTouchStart}
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
          onMouseDown={handleButtonMouseDown}
          onTouchStart={handleButtonTouchStart}
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
