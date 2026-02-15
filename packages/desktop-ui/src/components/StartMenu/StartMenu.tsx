import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/DesktopContext';
import { StartMenuPanel, StartMenuItemsList } from './StartMenu.styles';
import { StartMenuSubmenu } from './StartMenuSubmenu';

export interface StartMenuProps {
  /** Whether the menu is open */
  open: boolean;
  /** Callback when the menu should close */
  onClose: () => void;
  /** Ref to the anchor element (Start button) for positioning */
  anchorRef: React.RefObject<HTMLElement | null>;
  /** Menu items (StartMenuItem and StartMenuSubmenu components) */
  children: React.ReactNode;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  open,
  onClose,
  anchorRef,
  children,
}) => {
  const theme = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && typeof child.type !== 'string') {
      if (child.type === StartMenuSubmenu) {
        return React.cloneElement(child as React.ReactElement<{ onClose?: () => void }>, {
          onClose,
        });
      }
      const originalOnClick = (child.props as { onClick?: () => void }).onClick;
      return React.cloneElement(child as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => {
          originalOnClick?.();
          onClose();
        },
      });
    }
    return child;
  });

  useEffect(() => {
    if (!open || !anchorRef.current) return;

    const updatePosition = () => {
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top,
          left: rect.left,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, { capture: true });
    return () =>
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <StartMenuPanel
      ref={panelRef}
      $theme={theme}
      $top={position.top}
      $left={position.left}
      role="menu"
    >
      <StartMenuItemsList>{wrappedChildren}</StartMenuItemsList>
    </StartMenuPanel>
  );
};
