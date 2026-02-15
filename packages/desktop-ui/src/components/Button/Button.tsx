import React from 'react';
import { ButtonProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import { StyledButton } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <StyledButton
      $theme={theme}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};
