import React, { useCallback, useEffect, useState } from 'react';
import { Button, Window, useTheme } from 'desktop-ui';
import type { Theme } from 'desktop-ui';
import styled from 'styled-components';

type Operator = '+' | '-' | '*' | '/';

const MAX_DISPLAY_LENGTH = 16;

const Layout = styled.div<{ $theme: Theme }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 0;
  padding: 12px;
  box-sizing: border-box;
  background: ${(p) => p.$theme.window.backgroundColor};
`;

const DisplayFrame = styled.div<{ $theme: Theme }>`
  border: 1px solid ${(p) => p.$theme.input?.borderColor ?? '#7f9db9'};
  background: ${(p) => p.$theme.input?.backgroundColor ?? '#ffffff'};
  border-radius: 2px;
  box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.8),
    inset -1px -1px 0 rgba(0, 0, 0, 0.2);
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 66px;
`;

const Expression = styled.div<{ $theme: Theme }>`
  min-height: 14px;
  font-size: 11px;
  color: ${(p) => p.$theme.input?.placeholderColor ?? '#666666'};
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DisplayValue = styled.div<{ $theme: Theme }>`
  font-size: 30px;
  line-height: 1;
  text-align: right;
  color: ${(p) => p.$theme.input?.textColor ?? '#000000'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
`;

const Keypad = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  align-content: stretch;
`;

const KeyButton = styled(Button)`
  width: 100%;
  height: 36px;
  min-width: 0;
  font-size: 13px;
`;

const isOperator = (value: string): value is Operator =>
  value === '+' || value === '-' || value === '*' || value === '/';

const normalizeNumber = (value: number): string => {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = Number(value.toPrecision(12));
  const asText = `${rounded}`;
  if (asText.length <= MAX_DISPLAY_LENGTH) {
    return asText;
  }

  return rounded.toExponential(8);
};

const runOperation = (left: number, right: number, operator: Operator): number | null => {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return right === 0 ? null : left / right;
    default:
      return null;
  }
};

export interface CalculatorWindowProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: (state?: { position: { x: number; y: number }; size: { width: number; height: number } }) => void;
  onLayoutChange?: (layout: { position: { x: number; y: number }; size: { width: number; height: number } }) => void;
}

export function CalculatorWindow({ initialPosition, initialSize, onClose, onLayoutChange }: CalculatorWindowProps) {
  const theme = useTheme();

  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<Operator | null>(null);
  const [lastOperator, setLastOperator] = useState<Operator | null>(null);
  const [lastOperand, setLastOperand] = useState<number | null>(null);
  const [replaceDisplay, setReplaceDisplay] = useState(false);

  const resetState = useCallback(() => {
    setDisplay('0');
    setStoredValue(null);
    setPendingOperator(null);
    setLastOperator(null);
    setLastOperand(null);
    setReplaceDisplay(false);
  }, []);

  const showError = useCallback(() => {
    setDisplay('Error');
    setStoredValue(null);
    setPendingOperator(null);
    setReplaceDisplay(true);
  }, []);

  const clearErrorIfPresent = useCallback(() => {
    if (display === 'Error') {
      setDisplay('0');
      setStoredValue(null);
      setPendingOperator(null);
      setLastOperator(null);
      setLastOperand(null);
      setReplaceDisplay(false);
      return true;
    }
    return false;
  }, [display]);

  const handleDigit = useCallback(
    (digit: string) => {
      clearErrorIfPresent();

      if (replaceDisplay) {
        setDisplay(digit);
        setReplaceDisplay(false);
        return;
      }

      setDisplay((previous) => {
        if (previous === '0') return digit;
        if (previous.length >= MAX_DISPLAY_LENGTH) return previous;
        return `${previous}${digit}`;
      });
    },
    [replaceDisplay, clearErrorIfPresent]
  );

  const handleDecimal = useCallback(() => {
    clearErrorIfPresent();

    if (replaceDisplay) {
      setDisplay('0.');
      setReplaceDisplay(false);
      return;
    }

    setDisplay((previous) => (previous.includes('.') ? previous : `${previous}.`));
  }, [replaceDisplay, clearErrorIfPresent]);

  const handleBackspace = useCallback(() => {
    if (display === 'Error') {
      resetState();
      return;
    }

    if (replaceDisplay) return;

    setDisplay((previous) => {
      if (previous.length <= 1) return '0';
      if (previous.length === 2 && previous.startsWith('-')) return '0';
      return previous.slice(0, -1);
    });
  }, [display, replaceDisplay, resetState]);

  const handleToggleSign = useCallback(() => {
    if (display === 'Error') return;
    if (display === '0') return;

    setDisplay((previous) => (previous.startsWith('-') ? previous.slice(1) : `-${previous}`));
  }, [display]);

  const handlePercent = useCallback(() => {
    if (display === 'Error') return;

    const value = Number(display);
    const result = normalizeNumber(value / 100);
    setDisplay(result);
    setReplaceDisplay(true);
  }, [display]);

  const handleOperator = useCallback(
    (nextOperator: Operator) => {
      if (display === 'Error') return;

      const inputValue = Number(display);
      if (Number.isNaN(inputValue)) return;

      if (pendingOperator && storedValue !== null) {
        if (replaceDisplay) {
          setPendingOperator(nextOperator);
          return;
        }

        const resultValue = runOperation(storedValue, inputValue, pendingOperator);
        if (resultValue === null) {
          showError();
          return;
        }

        const resultText = normalizeNumber(resultValue);
        if (resultText === 'Error') {
          showError();
          return;
        }

        setDisplay(resultText);
        setStoredValue(resultValue);
        setLastOperator(pendingOperator);
        setLastOperand(inputValue);
      } else {
        setStoredValue(inputValue);
      }

      setPendingOperator(nextOperator);
      setReplaceDisplay(true);
    },
    [display, pendingOperator, storedValue, replaceDisplay, showError]
  );

  const handleEquals = useCallback(() => {
    if (display === 'Error') return;

    const inputValue = Number(display);
    if (Number.isNaN(inputValue)) return;

    if (pendingOperator && storedValue !== null) {
      const operand = replaceDisplay ? storedValue : inputValue;
      const resultValue = runOperation(storedValue, operand, pendingOperator);
      if (resultValue === null) {
        showError();
        return;
      }

      const resultText = normalizeNumber(resultValue);
      if (resultText === 'Error') {
        showError();
        return;
      }

      setDisplay(resultText);
      setStoredValue(resultValue);
      setLastOperator(pendingOperator);
      setLastOperand(operand);
      setPendingOperator(null);
      setReplaceDisplay(true);
      return;
    }

    if (lastOperator && lastOperand !== null) {
      const resultValue = runOperation(inputValue, lastOperand, lastOperator);
      if (resultValue === null) {
        showError();
        return;
      }

      const resultText = normalizeNumber(resultValue);
      if (resultText === 'Error') {
        showError();
        return;
      }

      setDisplay(resultText);
      setStoredValue(resultValue);
      setReplaceDisplay(true);
    }
  }, [display, pendingOperator, storedValue, replaceDisplay, lastOperator, lastOperand, showError]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key >= '0' && event.key <= '9') {
        event.preventDefault();
        handleDigit(event.key);
        return;
      }

      if (event.key === '.') {
        event.preventDefault();
        handleDecimal();
        return;
      }

      if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        handleEquals();
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        handleBackspace();
        return;
      }

      if (event.key === 'Escape' || event.key === 'Delete') {
        event.preventDefault();
        resetState();
        return;
      }

      if (event.key === '%') {
        event.preventDefault();
        handlePercent();
        return;
      }

      if (isOperator(event.key)) {
        event.preventDefault();
        handleOperator(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, handleDecimal, handleDigit, handleEquals, handleOperator, handlePercent, resetState]);

  const expression = storedValue !== null && pendingOperator
    ? `${normalizeNumber(storedValue)} ${pendingOperator}`
    : '\u00a0';

  return (
    <Window
      id="calculator"
      title="Calculator"
      initialPosition={initialPosition ?? { x: 180, y: 120 }}
      initialSize={initialSize ?? { width: 290, height: 390 }}
      onClose={onClose}
      onLayoutChange={onLayoutChange}
    >
      <Layout $theme={theme}>
        <DisplayFrame $theme={theme}>
          <Expression $theme={theme}>{expression}</Expression>
          <DisplayValue $theme={theme}>{display}</DisplayValue>
        </DisplayFrame>

        <Keypad>
          <KeyButton variant="danger" size="small" onClick={resetState}>
            C
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={handleBackspace}>
            ←
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={handlePercent}>
            %
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleOperator('/')}>
            ÷
          </KeyButton>

          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('7')}>
            7
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('8')}>
            8
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('9')}>
            9
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleOperator('*')}>
            ×
          </KeyButton>

          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('4')}>
            4
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('5')}>
            5
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('6')}>
            6
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleOperator('-')}>
            -
          </KeyButton>

          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('1')}>
            1
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('2')}>
            2
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('3')}>
            3
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleOperator('+')}>
            +
          </KeyButton>

          <KeyButton variant="secondary" size="small" onClick={handleToggleSign}>
            ±
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={() => handleDigit('0')}>
            0
          </KeyButton>
          <KeyButton variant="secondary" size="small" onClick={handleDecimal}>
            .
          </KeyButton>
          <KeyButton variant="primary" size="small" onClick={handleEquals}>
            =
          </KeyButton>
        </Keypad>
      </Layout>
    </Window>
  );
}
