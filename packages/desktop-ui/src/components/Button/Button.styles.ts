import styled from 'styled-components';
import { Theme } from '../../types';

const getInputTheme = (theme: Theme) =>
  theme.input ?? {
    buttonBackground: '#c0c0c0',
    buttonHoverBackground: '#d4d0c8',
    buttonActiveBackground: '#808080',
    buttonBorderColor: '#808080',
    buttonTextColor: '#000000',
    buttonDisabledBackground: '#c0c0c0',
    buttonSecondaryBackground: '#e0e0e0',
    buttonSecondaryHoverBackground: '#d4d0c8',
    buttonDangerBackground: '#dc3545',
    buttonDangerHoverBackground: '#c82333',
  };

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface StyledButtonProps {
  $theme: Theme;
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
}

const getBackground = (theme: Theme, variant: ButtonVariant) => {
  const t = getInputTheme(theme);
  switch (variant) {
    case 'secondary':
      return t.buttonSecondaryBackground ?? t.buttonBackground;
    case 'danger':
      return t.buttonDangerBackground ?? t.buttonBackground;
    default:
      return t.buttonBackground;
  }
};

const getHoverBackground = (theme: Theme, variant: ButtonVariant) => {
  const t = getInputTheme(theme);
  switch (variant) {
    case 'secondary':
      return t.buttonSecondaryHoverBackground ?? t.buttonHoverBackground;
    case 'danger':
      return t.buttonDangerHoverBackground ?? t.buttonHoverBackground;
    default:
      return t.buttonHoverBackground;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return { padding: '2px 8px', fontSize: '11px' };
    case 'large':
      return { padding: '8px 20px', fontSize: '14px' };
    default:
      return { padding: '4px 14px', fontSize: '13px' };
  }
};

export const StyledButton = styled.button<StyledButtonProps>`
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  font-weight: normal;
  border: 1px solid ${(props) => getInputTheme(props.$theme).buttonBorderColor};
  border-radius: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;

  background: ${(props) => getBackground(props.$theme, props.$variant)};
  color: ${(props) => getInputTheme(props.$theme).buttonTextColor};

  ${(props) => {
    const styles = getSizeStyles(props.$size);
    return `
      padding: ${styles.padding};
      font-size: ${styles.fontSize};
    `;
  }}

  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background: ${(props) => getHoverBackground(props.$theme, props.$variant)};
  }

  &:active:not(:disabled) {
    background: ${(props) => getInputTheme(props.$theme).buttonActiveBackground};
  }

  &:disabled {
    background: ${(props) =>
      getInputTheme(props.$theme).buttonDisabledBackground ??
      getInputTheme(props.$theme).buttonBackground};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;
