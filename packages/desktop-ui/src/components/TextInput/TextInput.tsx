import React, { useState, useCallback } from 'react';
import { TextInputProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import { InputWrapper, StyledInput } from './TextInput.styles';

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      error,
      width,
      type = 'text',
      disabled,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalValue(e.target.value);
        }
        onChange?.(e);
      },
      [isControlled, onChange]
    );

    return (
      <InputWrapper $theme={theme} $error={error} $width={width}>
        <StyledInput
          ref={ref}
          $theme={theme}
          $error={error}
          type={type}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
      </InputWrapper>
    );
  }
);

TextInput.displayName = 'TextInput';
