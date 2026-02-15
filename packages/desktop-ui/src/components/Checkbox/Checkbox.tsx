import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CheckboxProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import {
  CheckboxWrapper,
  HiddenInput,
  CheckboxBox,
  Checkmark,
  IndeterminateLine,
  CheckboxLabel,
} from './Checkbox.styles';

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked: checkedProp,
      defaultChecked,
      onChange,
      indeterminate = false,
      label,
      disabled,
      id,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

    const isControlled = checkedProp !== undefined;
    const checked = isControlled ? checkedProp : internalChecked;

    const handleRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
          setInternalChecked(e.target.checked);
        }
        onChange?.(e);
      },
      [isControlled, onChange]
    );

    const generatedId = React.useId();
    const inputId = id ?? `checkbox-${generatedId}`;

    return (
      <CheckboxWrapper $theme={theme} $disabled={disabled}>
        <HiddenInput
          ref={handleRef}
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
        <CheckboxBox
          $theme={theme}
          $checked={checked}
          $indeterminate={indeterminate}
          $disabled={disabled}
        >
          {checked && !indeterminate && (
            <Checkmark $color={theme.input?.checkColor ?? '#000000'} />
          )}
          {indeterminate && (
            <IndeterminateLine $color={theme.input?.checkColor ?? '#000000'} />
          )}
        </CheckboxBox>
        {label != null && <CheckboxLabel>{label}</CheckboxLabel>}
      </CheckboxWrapper>
    );
  }
);

Checkbox.displayName = 'Checkbox';
