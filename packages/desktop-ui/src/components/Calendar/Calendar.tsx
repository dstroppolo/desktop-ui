import React, { useState, useCallback, useMemo } from 'react';
import { CalendarProps } from '../../types';
import { useTheme } from '../../context/DesktopContext';
import {
  CalendarContainer,
  CalendarHeader,
  CalendarNavButton,
  CalendarMonthLabel,
  CalendarGrid,
  CalendarWeekdayHeader,
  CalendarDay,
} from './Calendar.styles';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, n: number): Date {
  const result = new Date(d);
  result.setMonth(result.getMonth() + n);
  return result;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function getCalendarDays(month: Date): Date[] {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const startDay = start.getDay();
  const daysInMonth = end.getDate();

  const days: Date[] = [];
  const padStart = startDay;

  for (let i = 0; i < padStart; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() - (padStart - i));
    days.push(d);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth() + 1, i));
  }

  return days;
}

export const Calendar: React.FC<CalendarProps> = ({
  value: valueProp,
  defaultValue,
  onChange,
  month: monthProp,
  onMonthChange,
  minDate,
  maxDate,
  locale = 'en-US',
}) => {
  const theme = useTheme();

  const isValueControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(
    defaultValue ?? null
  );
  const value = isValueControlled ? valueProp ?? null : internalValue;

  const isMonthControlled = monthProp !== undefined;
  const [internalMonth, setInternalMonth] = useState(() => {
    const ref = value ?? new Date();
    return startOfMonth(ref);
  });
  const month = isMonthControlled ? startOfMonth(monthProp) : internalMonth;

  const setMonth = useCallback(
    (newMonth: Date) => {
      if (!isMonthControlled) {
        setInternalMonth(startOfMonth(newMonth));
      }
      onMonthChange?.(startOfMonth(newMonth));
    },
    [isMonthControlled, onMonthChange]
  );

  const days = useMemo(() => getCalendarDays(month), [month]);

  const handlePrevMonth = useCallback(() => {
    setMonth(addMonths(month, -1));
  }, [month, setMonth]);

  const handleNextMonth = useCallback(() => {
    setMonth(addMonths(month, 1));
  }, [month, setMonth]);

  const handleDayClick = useCallback(
    (d: Date) => {
      if (minDate && d < minDate) return;
      if (maxDate && d > maxDate) return;

      const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (!isValueControlled) {
        setInternalValue(date);
      }
      onChange?.(date);
    },
    [minDate, maxDate, onChange, isValueControlled]
  );

  const isDisabled = useCallback(
    (d: Date) => {
      if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()))
        return true;
      if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()))
        return true;
      return false;
    },
    [minDate, maxDate]
  );

  const monthLabel = month.toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <CalendarContainer $theme={theme}>
      <CalendarHeader $theme={theme}>
        <CalendarNavButton
          $theme={theme}
          type="button"
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          ‹
        </CalendarNavButton>
        <CalendarMonthLabel>{monthLabel}</CalendarMonthLabel>
        <CalendarNavButton
          $theme={theme}
          type="button"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          ›
        </CalendarNavButton>
      </CalendarHeader>
      <CalendarGrid>
        {WEEKDAYS.map((day) => (
          <CalendarWeekdayHeader key={day} $theme={theme}>
            {day}
          </CalendarWeekdayHeader>
        ))}
        {days.map((d, i) => {
          const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          const disabled = isDisabled(dayStart);
          const isOtherMonth = !isSameMonth(dayStart, month);
          const isSelected = value ? isSameDay(dayStart, value) : false;
          const isToday = isSameDay(dayStart, today);

          return (
            <CalendarDay
              key={i}
              $theme={theme}
              $isToday={isToday}
              $isSelected={isSelected}
              $isDisabled={disabled}
              $isOtherMonth={isOtherMonth}
              type="button"
              onClick={() => handleDayClick(dayStart)}
              disabled={disabled}
              data-other-month={isOtherMonth}
              aria-label={dayStart.toLocaleDateString(locale)}
            >
              {d.getDate()}
            </CalendarDay>
          );
        })}
      </CalendarGrid>
    </CalendarContainer>
  );
};
