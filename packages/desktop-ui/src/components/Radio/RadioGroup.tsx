import React, { useState, useCallback } from 'react';
import { RadioGroupProps } from '../../types';
import { RadioContextProvider } from './RadioContext';

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value: valueProp,
  defaultValue,
  onChange,
  name,
  children,
  disabled,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const generatedName = React.useId();
  const groupName = name || `radio-group-${generatedName}`;

  return (
    <RadioContextProvider
      value={{
        name: groupName,
        value,
        onChange: handleChange,
        disabled,
      }}
    >
      {children}
    </RadioContextProvider>
  );
};
