import styled from 'styled-components';
import { Theme } from '../../types';

const getInputTheme = (theme: Theme) =>
  theme.input ?? {
    calendarBackground: '#ffffff',
    calendarHeaderBackground: '#e0e0e0',
    calendarDayHover: '#d4d0c8',
    calendarDaySelected: '#000080',
    textColor: '#000000',
    placeholderColor: '#999999',
    borderColor: '#808080',
  };

interface CalendarContainerProps {
  $theme: Theme;
}

export const CalendarContainer = styled.div<CalendarContainerProps>`
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  font-size: 12px;
  background: ${(props) =>
    getInputTheme(props.$theme).calendarBackground ?? '#ffffff'};
  border: 1px solid ${(props) => getInputTheme(props.$theme).borderColor};
  border-radius: 4px;
  padding: 8px;
  min-width: 220px;
`;

export const CalendarHeader = styled.div<CalendarContainerProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 4px 0;
  background: ${(props) =>
    getInputTheme(props.$theme).calendarHeaderBackground ?? '#e0e0e0'};
  border-radius: 2px;
  padding: 4px 8px;
`;

export const CalendarNavButton = styled.button<CalendarContainerProps>`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  font-size: 14px;
  color: ${(props) => getInputTheme(props.$theme).textColor};
  border-radius: 2px;

  &:hover {
    background: ${(props) =>
      getInputTheme(props.$theme).calendarDayHover ?? 'rgba(0,0,0,0.1)'};
  }
`;

export const CalendarMonthLabel = styled.span`
  font-weight: bold;
  color: inherit;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const CalendarWeekdayHeader = styled.div<CalendarContainerProps>`
  text-align: center;
  font-weight: bold;
  padding: 4px 0;
  color: ${(props) => getInputTheme(props.$theme).textColor};
  font-size: 11px;
`;

interface CalendarDayProps {
  $theme: Theme;
  $isToday: boolean;
  $isSelected: boolean;
  $isDisabled: boolean;
  $isOtherMonth: boolean;
}

export const CalendarDay = styled.button<CalendarDayProps>`
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: ${(props) => (props.$isDisabled ? 'default' : 'pointer')};
  font-size: 12px;
  border-radius: 2px;
  color: ${(props) => {
    const t = getInputTheme(props.$theme);
    if (props.$isOtherMonth) return t.placeholderColor ?? '#999';
    return t.textColor;
  }};
  opacity: ${(props) => (props.$isOtherMonth ? 0.5 : 1)};

  ${(props) =>
    props.$isToday &&
    !props.$isSelected &&
    `
    border: 1px solid ${getInputTheme(props.$theme).borderColor};
  `}

  ${(props) =>
    props.$isSelected &&
    `
    background: ${getInputTheme(props.$theme).calendarDaySelected ?? '#000080'};
    color: white;
  `}

  ${(props) =>
    props.$isDisabled &&
    `
    opacity: 0.4;
    cursor: not-allowed;
  `}

  &:hover:not(:disabled):not([data-other-month="true"]) {
    background: ${(props) =>
      getInputTheme(props.$theme).calendarDayHover ?? 'rgba(0,0,0,0.1)'};
  }

  ${(props) =>
    props.$isSelected &&
    `
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  `}
`;
