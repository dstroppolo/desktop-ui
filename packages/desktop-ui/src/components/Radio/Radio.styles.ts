import styled from 'styled-components';
import { Theme } from '../../types';

const getInputTheme = (theme: Theme) =>
  theme.input ?? {
    borderColor: '#808080',
    focusBorderColor: '#000080',
    checkColor: '#000000',
    checkBackground: '#ffffff',
    disabledBackground: '#c0c0c0',
  };

interface RadioWrapperProps {
  $theme: Theme;
  $disabled?: boolean;
}

export const RadioWrapper = styled.label<RadioWrapperProps>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: ${(props) => (props.$disabled ? 'not-allowed' : 'pointer')};
  user-select: none;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  font-size: 13px;

  &:hover input:not(:disabled) + span {
    border-color: ${(props) =>
      getInputTheme(props.$theme).focusBorderColor ?? getInputTheme(props.$theme).borderColor};
  }
`;

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  pointer-events: none;
`;

interface RadioCircleProps {
  $theme: Theme;
  $checked: boolean;
  $disabled?: boolean;
}

export const RadioCircle = styled.span<RadioCircleProps>`
  width: 13px;
  height: 13px;
  min-width: 13px;
  min-height: 13px;
  flex-shrink: 0;

  background-color: ${(props) => getInputTheme(props.$theme).checkBackground};
  border: 1px solid ${(props) => getInputTheme(props.$theme).borderColor};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  ${(props) =>
    props.$disabled &&
    `
    background-color: ${getInputTheme(props.$theme).disabledBackground ?? getInputTheme(props.$theme).checkBackground};
    opacity: 0.7;
  `}
`;

interface RadioDotProps {
  $color: string;
}

export const RadioDot = styled.span<RadioDotProps>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

export const RadioLabel = styled.span`
  color: inherit;
`;
