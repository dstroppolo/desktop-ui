import React, { useState, useCallback } from 'react';
import { RadioProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import { useRadioContext } from './RadioContext';
import {
  RadioWrapper,
  HiddenInput,
  RadioCircle,
  RadioDot,
  RadioLabel,
} from './Radio.styles';

export const Radio: React.FC<RadioProps> = ({
  value,
  checked: checkedProp,
  defaultChecked,
  onChange,
  label,
  disabled: disabledProp,
  name: nameProp,
  id,
  ...rest
}) => {
  const theme = useTheme();
  const context = useRadioContext();
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);

  const name = nameProp ?? context?.name;
  const disabled = disabledProp ?? context?.disabled;

  const isControlled =
    checkedProp !== undefined || (context && context.value !== undefined);
  const checked =
    checkedProp !== undefined
      ? checkedProp
      : context
        ? context.value === value
        : internalChecked;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled && !context) {
        setInternalChecked(e.target.checked);
      }
      if (context) {
        context.onChange(value);
      }
      onChange?.(e);
    },
    [isControlled, context, value, onChange]
  );

  const generatedId = React.useId();
  const inputId = id ?? `radio-${generatedId}`;

  if (context && !nameProp) {
    return (
      <RadioWrapper $theme={theme} $disabled={disabled}>
        <HiddenInput
          type="radio"
          id={inputId}
          name={context.name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...rest}
        />
        <RadioCircle $theme={theme} $checked={checked} $disabled={disabled}>
          {checked && (
            <RadioDot $color={theme.input?.checkColor ?? '#000000'} />
          )}
        </RadioCircle>
        {label != null && <RadioLabel>{label}</RadioLabel>}
      </RadioWrapper>
    );
  }

  return (
    <RadioWrapper $theme={theme} $disabled={disabled}>
      <HiddenInput
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...rest}
      />
      <RadioCircle $theme={theme} $checked={checked} $disabled={disabled}>
        {checked && <RadioDot $color={theme.input?.checkColor ?? '#000000'} />}
      </RadioCircle>
      {label != null && <RadioLabel>{label}</RadioLabel>}
    </RadioWrapper>
  );
};
