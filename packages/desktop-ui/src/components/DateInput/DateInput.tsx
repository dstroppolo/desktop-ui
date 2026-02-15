import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DateInputProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import { Calendar } from '../Calendar/Calendar';
import { DateInputWrapper, StyledDateInput, Popover } from './DateInput.styles';

function formatDate(date: Date, format?: string): string {
  if (format === 'MM/dd/yyyy') {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const y = date.getFullYear();
    return `${m}/${d}/${y}`;
  }
  if (format === 'dd/MM/yyyy') {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  }
  return date.toLocaleDateString();
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      format = 'MM/dd/yyyy',
      placeholder = 'Select date',
      disabled,
      width,
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<Date | null>(
      defaultValue ?? null
    );

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const displayValue = value ? formatDate(value, format) : '';

    const handleClick = useCallback(() => {
      if (!disabled) setOpen(true);
    }, [disabled]);

    const handleChange = useCallback(
      (date: Date | null) => {
        if (!isControlled) {
          setInternalValue(date);
        }
        onChange?.(date);
        setOpen(false);
      },
      [isControlled, onChange]
    );

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [open]);

    const widthNum =
      typeof width === 'number' ? width : typeof width === 'string' ? parseInt(width, 10) : undefined;

    return (
      <DateInputWrapper ref={wrapperRef} $theme={theme} $width={widthNum}>
        <StyledDateInput
          ref={ref}
          $theme={theme}
          type="text"
          value={displayValue}
          readOnly
          placeholder={placeholder}
          onClick={handleClick}
          disabled={disabled}
          {...rest}
        />
        {open && (
          <Popover>
            <Calendar
              value={value}
              onChange={handleChange}
              minDate={minDate}
              maxDate={maxDate}
            />
          </Popover>
        )}
      </DateInputWrapper>
    );
  }
);

DateInput.displayName = 'DateInput';
