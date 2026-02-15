import React, { useRef, useState, useCallback } from 'react';
import { useTheme } from '../../context/DesktopContext';
import { StartMenuItemIcon, StartMenuItemLabel } from './StartMenuItem.styles';
import {
  SubmenuWrapper,
  SubmenuTrigger,
  SubmenuTriggerContent,
  SubmenuArrow,
  SubmenuPanel,
} from './StartMenuSubmenu.styles';
import { StartMenuSubmenuProps } from '../../types';

const HOVER_OPEN_DELAY_MS = 150;
const HOVER_CLOSE_DELAY_MS = 200;

export const StartMenuSubmenu: React.FC<StartMenuSubmenuProps> = ({
  icon,
  label,
  children,
  id,
  onClose,
}) => {
  const theme = useTheme();
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimeouts = useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimeouts();
    closeTimeoutRef.current = null;
    openTimeoutRef.current = setTimeout(() => {
      setSubmenuVisible(true);
      openTimeoutRef.current = null;
    }, HOVER_OPEN_DELAY_MS);
  }, [clearTimeouts]);

  const handleMouseLeave = useCallback(() => {
    clearTimeouts();
    openTimeoutRef.current = null;
    closeTimeoutRef.current = setTimeout(() => {
      setSubmenuVisible(false);
      closeTimeoutRef.current = null;
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearTimeouts]);

  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && typeof child.type !== 'string') {
      const childProps = child.props as { onClick?: () => void };
      const originalOnClick = childProps.onClick;
      return React.cloneElement(child as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => {
          originalOnClick?.();
          onClose?.();
        },
      });
    }
    return child;
  });

  return (
    <SubmenuWrapper
      $theme={theme}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SubmenuTrigger
        $theme={theme}
        type="button"
        id={id}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={submenuVisible}
      >
        <SubmenuTriggerContent>
          <StartMenuItemIcon>{icon ?? '📄'}</StartMenuItemIcon>
          <StartMenuItemLabel>{label}</StartMenuItemLabel>
        </SubmenuTriggerContent>
        <SubmenuArrow aria-hidden>▶</SubmenuArrow>
      </SubmenuTrigger>
      <SubmenuPanel $theme={theme} $visible={submenuVisible} role="menu">
        {wrappedChildren}
      </SubmenuPanel>
    </SubmenuWrapper>
  );
};

StartMenuSubmenu.displayName = 'StartMenuSubmenu';
