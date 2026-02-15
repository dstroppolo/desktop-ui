import React, { useState, useCallback } from 'react';
import { Window, Button, Checkbox, TextInput } from 'desktop-ui';
import styled from 'styled-components';

const DialogContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 360px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.label`
  min-width: 80px;
  font-size: 12px;
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const CheckboxRow = styled.div`
  display: flex;
  gap: 16px;
  margin-left: 88px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

export interface FindReplaceOptions {
  matchCase: boolean;
  wholeWord: boolean;
}

export interface FindReplaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFindNext: (needle: string, options: FindReplaceOptions) => void;
  onReplace: (needle: string, replacement: string, options: FindReplaceOptions) => void;
  onReplaceAll: (needle: string, replacement: string, options: FindReplaceOptions) => void;
  /** When true, show Replace section (Ctrl+H); when false, Find only (Ctrl+F) */
  showReplace?: boolean;
}

export const FindReplaceDialog: React.FC<FindReplaceDialogProps> = ({
  isOpen,
  onClose,
  onFindNext,
  onReplace,
  onReplaceAll,
  showReplace = true,
}) => {
  const [findWhat, setFindWhat] = useState('');
  const [replaceWith, setReplaceWith] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const options: FindReplaceOptions = { matchCase, wholeWord };

  const handleFindNext = useCallback(() => {
    if (findWhat) onFindNext(findWhat, options);
  }, [findWhat, options, onFindNext]);

  const handleReplace = useCallback(() => {
    if (findWhat) onReplace(findWhat, replaceWith, options);
  }, [findWhat, replaceWith, options, onReplace]);

  const handleReplaceAll = useCallback(() => {
    if (findWhat) onReplaceAll(findWhat, replaceWith, options);
  }, [findWhat, replaceWith, options, onReplaceAll]);

  if (!isOpen) return null;

  return (
    <Window
      id="find-replace-dialog"
      title={showReplace ? 'Find and Replace' : 'Find'}
      initialPosition={{ x: 300, y: 200 }}
      initialSize={{ width: 400, height: 220 }}
      onClose={onClose}
    >
      <DialogContent>
        <Row>
          <Label htmlFor="find-what">Find what:</Label>
          <InputWrapper>
            <TextInput
              id="find-what"
              value={findWhat}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFindWhat(e.target.value)}
              width={240}
            />
          </InputWrapper>
        </Row>
        {showReplace && (
          <Row>
            <Label htmlFor="replace-with">Replace with:</Label>
            <InputWrapper>
              <TextInput
                id="replace-with"
                value={replaceWith}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplaceWith(e.target.value)}
                width={240}
              />
            </InputWrapper>
          </Row>
        )}
        <CheckboxRow>
          <Checkbox
            checked={matchCase}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchCase(e.target.checked)}
            label="Match case"
          />
          <Checkbox
            checked={wholeWord}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWholeWord(e.target.checked)}
            label="Whole word"
          />
        </CheckboxRow>
        <ButtonRow>
          <Button variant="primary" onClick={handleFindNext}>
            Find Next
          </Button>
          {showReplace && (
            <>
              <Button variant="secondary" onClick={handleReplace}>
                Replace
              </Button>
              <Button variant="secondary" onClick={handleReplaceAll}>
                Replace All
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </ButtonRow>
      </DialogContent>
    </Window>
  );
};
