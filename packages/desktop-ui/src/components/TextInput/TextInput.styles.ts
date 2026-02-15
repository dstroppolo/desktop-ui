import styled from 'styled-components';
import { Theme } from '../../types';

const getInputTheme = (theme: Theme) =>
  theme.input ?? {
    backgroundColor: '#ffffff',
    borderColor: '#808080',
    borderWidth: '1px',
    borderRadius: '0px',
    textColor: '#000000',
    placeholderColor: '#808080',
    focusBorderColor: '#000080',
    disabledBackground: '#c0c0c0',
    disabledTextColor: '#808080',
    errorBorderColor: '#ff0000',
  };

interface InputWrapperProps {
  $theme: Theme;
  $error?: boolean;
  $width?: number;
}

export const InputWrapper = styled.div<InputWrapperProps>`
  display: inline-block;
  width: ${(props) => (props.$width ? `${props.$width}px` : '100%')};
`;

interface StyledInputProps {
  $theme: Theme;
  $error?: boolean;
}

export const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  box-sizing: border-box;
  padding: 4px 6px;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  font-size: 13px;

  background-color: ${(props) => getInputTheme(props.$theme).backgroundColor};
  color: ${(props) => getInputTheme(props.$theme).textColor};
  border: ${(props) => {
    const t = getInputTheme(props.$theme);
    const borderColor = props.$error ? t.errorBorderColor ?? t.borderColor : t.borderColor;
    return `${t.borderWidth} solid ${borderColor}`;
  }};
  border-radius: ${(props) => getInputTheme(props.$theme).borderRadius};

  appearance: none;
  outline: none;

  &::placeholder {
    color: ${(props) => getInputTheme(props.$theme).placeholderColor};
  }

  &:focus {
    border-color: ${(props) =>
      getInputTheme(props.$theme).focusBorderColor ?? getInputTheme(props.$theme).borderColor};
  }

  &:disabled {
    background-color: ${(props) =>
      getInputTheme(props.$theme).disabledBackground ?? getInputTheme(props.$theme).backgroundColor};
    color: ${(props) =>
      getInputTheme(props.$theme).disabledTextColor ?? getInputTheme(props.$theme).textColor};
    cursor: not-allowed;
  }
`;
