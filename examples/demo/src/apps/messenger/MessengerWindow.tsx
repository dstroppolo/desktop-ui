import React, { useState, useRef, useEffect } from 'react';
import {
  Window,
  ResizableSplitPane,
  TextInput,
  Button,
  useTheme,
} from 'desktop-ui';
import type { Theme } from 'desktop-ui';
import { useMessenger } from './useMessenger';
import type { Buddy } from './types';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const MessageList = styled.div<{ $theme: Theme }>`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: ${(p) => p.$theme.window?.backgroundColor ?? '#f0f0f0'};
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  font-size: 12px;
`;

const MessageBubble = styled.div<{
  $isMe: boolean;
  $theme: Theme;
}>`
  max-width: 75%;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  align-self: ${(p) => (p.$isMe ? 'flex-end' : 'flex-start')};
  background: ${(p) =>
    p.$isMe
      ? p.$theme.input?.focusBorderColor ?? '#0078d4'
      : p.$theme.input?.buttonSecondaryBackground ?? '#e8e4d5'};
  color: ${(p) =>
    p.$isMe ? '#ffffff' : p.$theme.input?.textColor ?? '#000000'};
  border: 1px solid
    ${(p) =>
      p.$isMe
        ? p.$theme.input?.focusBorderColor ?? '#0078d4'
        : p.$theme.input?.buttonBorderColor ?? '#7f9db9'};
`;

const MessageRow = styled.div<{ $isMe: boolean }>`
  display: flex;
  justify-content: ${(p) => (p.$isMe ? 'flex-end' : 'flex-start')};
`;

const MessageMeta = styled.span`
  font-size: 10px;
  opacity: 0.8;
  margin-bottom: 2px;
`;

const InputRow = styled.div<{ $theme: Theme }>`
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid ${(p) => p.$theme.window?.borderColor ?? '#c0c0c0'};
  background: ${(p) => p.$theme.window?.backgroundColor ?? '#f0f0f0'};
  flex-shrink: 0;
`;

const EmptyChat = styled.div<{ $theme: Theme }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.$theme.input?.placeholderColor ?? '#7f9db9'};
  font-size: 13px;
  background: ${(p) => p.$theme.window?.backgroundColor ?? '#f0f0f0'};
`;

const StatusBar = styled.div<{ $theme: Theme }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  font-size: 11px;
  background: ${(p) => p.$theme.input?.buttonSecondaryBackground ?? '#e8e4d5'};
  border-top: 1px solid ${(p) => p.$theme.window?.borderColor ?? '#c0c0c0'};
  flex-shrink: 0;
`;

const StatusSelect = styled.select<{ $theme: Theme }>`
  padding: 2px 6px;
  font-size: 11px;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  background: ${(p) => p.$theme.input?.backgroundColor ?? '#ffffff'};
  color: ${(p) => p.$theme.input?.textColor ?? '#000000'};
  border: 1px solid ${(p) => p.$theme.input?.borderColor ?? '#7f9db9'};
  border-radius: ${(p) => p.$theme.input?.borderRadius ?? '4px'};
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${(p) => p.$theme.input?.focusBorderColor ?? '#0078d4'};
  }
`;

const BuddyList = styled.div<{ $theme: Theme }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background: ${(p) => p.$theme.window?.backgroundColor ?? '#f0f0f0'};
`;

const BuddyRow = styled.div<{
  $selected: boolean;
  $theme: Theme;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  font-size: 12px;
  border-bottom: 1px solid ${(p) => p.$theme.window?.borderColor ?? '#e0e0e0'};
  background: ${(p) =>
    p.$selected
      ? p.$theme.folderTree?.itemSelectedBackground ?? '#d6ebf9'
      : 'transparent'};
  color: ${(p) =>
    p.$selected
      ? p.$theme.folderTree?.itemSelectedTextColor ?? '#000000'
      : p.$theme.folderTree?.itemTextColor ?? '#000000'};

  &:hover {
    background: ${(p) =>
      p.$selected
        ? p.$theme.folderTree?.itemSelectedBackground ?? '#d6ebf9'
        : p.$theme.folderTree?.itemHoverBackground ?? 'rgba(0, 120, 212, 0.1)'};
  }
`;

const AvatarPlaceholder = styled.div<{ $theme: Theme }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(p) => p.$theme.input?.buttonSecondaryBackground ?? '#d6d3c8'};
  border: 1px solid ${(p) => p.$theme.input?.buttonBorderColor ?? '#7f9db9'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const BuddyInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const BuddyName = styled.div`
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BuddyStatus = styled.div<{ $status: Buddy['status'] }>`
  font-size: 10px;
  color: ${(p) =>
    p.$status === 'online'
      ? '#228b22'
      : p.$status === 'away'
        ? '#b8860b'
        : '#666666'};
`;

const StatusDot = styled.span<{ $status: Buddy['status'] }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  background: ${(p) =>
    p.$status === 'online'
      ? '#228b22'
      : p.$status === 'away'
        ? '#b8860b'
        : '#666666'};
`;

export interface MessengerWindowProps {
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onClose?: (state?: { position: { x: number; y: number }; size: { width: number; height: number } }) => void;
  onLayoutChange?: (layout: { position: { x: number; y: number }; size: { width: number; height: number } }) => void;
}

export function MessengerWindow({ initialPosition, initialSize, onClose, onLayoutChange }: MessengerWindowProps) {
  const theme = useTheme();
  const {
    meId,
    buddies,
    activeBuddyId,
    myStatus,
    setActiveBuddy,
    setMyStatus,
    sendMessage,
    getMessagesForBuddy,
  } = useMessenger();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = activeBuddyId ? getMessagesForBuddy(activeBuddyId) : [];
  const activeBuddy = buddies.find((b) => b.id === activeBuddyId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (activeBuddyId && inputValue.trim()) {
      sendMessage(activeBuddyId, inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Window
      id="messenger"
      title="Windows Messenger"
      initialPosition={initialPosition ?? { x: 120, y: 100 }}
      initialSize={initialSize ?? { width: 480, height: 420 }}
      onClose={onClose}
      onLayoutChange={onLayoutChange}
    >
      <Layout>
        <ResizableSplitPane
          left={
            <BuddyList $theme={theme}>
              {buddies.map((buddy) => (
                <BuddyRow
                  key={buddy.id}
                  $selected={activeBuddyId === buddy.id}
                  $theme={theme}
                  onClick={() => setActiveBuddy(buddy.id)}
                >
                  <AvatarPlaceholder $theme={theme}>
                    {buddy.displayName.charAt(0).toUpperCase()}
                  </AvatarPlaceholder>
                  <BuddyInfo>
                    <BuddyName>{buddy.displayName}</BuddyName>
                    <BuddyStatus $status={buddy.status}>
                      <StatusDot $status={buddy.status} />
                      {buddy.status}
                      {buddy.customStatusMessage && ` - ${buddy.customStatusMessage}`}
                    </BuddyStatus>
                  </BuddyInfo>
                </BuddyRow>
              ))}
            </BuddyList>
          }
          right={
            <ChatArea>
              {activeBuddy ? (
                <>
                  <MessageList $theme={theme}>
                    {messages.map((msg) => {
                      const isMe = msg.fromId === meId;
                      return (
                        <MessageRow key={msg.id} $isMe={isMe}>
                          <MessageBubble $isMe={isMe} $theme={theme}>
                            <MessageMeta>
                              {isMe ? 'Me' : activeBuddy.displayName} •{' '}
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </MessageMeta>
                            <div>{msg.body}</div>
                          </MessageBubble>
                        </MessageRow>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </MessageList>
                  <InputRow $theme={theme}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <TextInput
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        style={{ width: '100%' }}
                      />
                    </div>
                    <Button variant="primary" onClick={handleSend}>
                      Send
                    </Button>
                  </InputRow>
                </>
              ) : (
                <EmptyChat $theme={theme}>
                  Select a buddy to start chatting
                </EmptyChat>
              )}
            </ChatArea>
          }
          defaultLeftWidth={180}
          minLeftWidth={140}
          maxLeftWidth={280}
        />
        <StatusBar $theme={theme}>
          <span>Status:</span>
          <StatusSelect
            $theme={theme}
            value={myStatus}
            onChange={(e) =>
              setMyStatus(e.target.value as 'online' | 'away' | 'busy')
            }
          >
            <option value="online">Online</option>
            <option value="away">Away</option>
            <option value="busy">Busy</option>
          </StatusSelect>
        </StatusBar>
      </Layout>
    </Window>
  );
}
