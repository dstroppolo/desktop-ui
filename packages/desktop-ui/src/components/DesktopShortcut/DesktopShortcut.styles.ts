import styled from 'styled-components';

export const ShortcutContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  cursor: pointer;
  user-select: none;
  width: 64px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export const ShortcutIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  font-size: 24px;
`;

export const ShortcutLabel = styled.span`
  font-size: 11px;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.6);
  word-break: break-word;
  line-height: 1.2;
`;
