import React from 'react';
import { StartMenuItemProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import {
  StartMenuItemContainer,
  StartMenuItemIcon,
  StartMenuItemLabel,
} from './StartMenuItem.styles';

export const StartMenuItem: React.FC<StartMenuItemProps> = ({
  icon,
  label,
  onClick,
  id,
}) => {
  const theme = useTheme();

  return (
    <StartMenuItemContainer
      $theme={theme}
      type="button"
      onClick={onClick}
      id={id}
      aria-label={label}
    >
      <StartMenuItemIcon>{icon ?? '📄'}</StartMenuItemIcon>
      <StartMenuItemLabel>{label}</StartMenuItemLabel>
    </StartMenuItemContainer>
  );
};
