import styled from 'styled-components';
import { Theme } from '../../types';

const getInputTheme = (theme: Theme) =>
  theme.input ?? {
    backgroundColor: '#ffffff',
    borderColor: '#808080',
    focusBorderColor: '#000080',
    checkColor: '#000000',
    checkBackground: '#ffffff',
    disabledBackground: '#c0c0c0',
  };

interface CheckboxWrapperProps {
  $theme: Theme;
  $disabled?: boolean;
}

export const CheckboxWrapper = styled.label<CheckboxWrapperProps>`
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

interface CheckboxBoxProps {
  $theme: Theme;
  $checked: boolean;
  $indeterminate: boolean;
  $disabled?: boolean;
}

export const CheckboxBox = styled.span<CheckboxBoxProps>`
  width: 13px;
  height: 13px;
  min-width: 13px;
  min-height: 13px;
  flex-shrink: 0;

  background-color: ${(props) => getInputTheme(props.$theme).checkBackground};
  border: 1px solid ${(props) => getInputTheme(props.$theme).borderColor};
  border-radius: 2px;

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

interface CheckmarkProps {
  $color: string;
}

export const Checkmark = styled.span<CheckmarkProps>`
  width: 4px;
  height: 8px;
  border: solid ${(props) => props.$color};
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
`;

interface IndeterminateLineProps {
  $color: string;
}

export const IndeterminateLine = styled.span<IndeterminateLineProps>`
  width: 6px;
  height: 2px;
  background-color: ${(props) => props.$color};
`;

export const CheckboxLabel = styled.span`
  color: inherit;
`;
