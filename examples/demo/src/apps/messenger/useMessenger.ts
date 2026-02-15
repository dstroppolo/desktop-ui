import { useState, useCallback } from 'react';
import type { Buddy, Message } from './types';

const ME_ID = 'me';

const FAKE_BUDDIES: Buddy[] = [
  { id: 'buddy-1', displayName: 'CoolFriend99', status: 'online', customStatusMessage: 'Listening to music' },
  { id: 'buddy-2', displayName: 'GamerDude', status: 'away', customStatusMessage: 'BRB, getting snacks' },
  { id: 'buddy-3', displayName: 'TechWizard', status: 'online' },
  { id: 'buddy-4', displayName: 'NightOwl', status: 'offline', customStatusMessage: 'Zzz...' },
];

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getConversationKey(fromId: string, toId: string): string {
  const ids = [fromId, toId].filter((id) => id !== ME_ID);
  return ids[0] ?? '';
}

export function useMessenger() {
  const [buddies] = useState<Buddy[]>(FAKE_BUDDIES);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [activeBuddyId, setActiveBuddy] = useState<string | null>(null);
  const [myStatus, setMyStatus] = useState<'online' | 'away' | 'busy'>('online');

  const addMessage = useCallback((msg: Message) => {
    const key = getConversationKey(msg.fromId, msg.toId);
    setConversations((prev) => ({
      ...prev,
      [key]: [...(prev[key] ?? []), msg],
    }));
  }, []);

  const sendMessage = useCallback(
    (toId: string, body: string) => {
      if (!body.trim()) return;
      const msg: Message = {
        id: generateId(),
        fromId: ME_ID,
        toId,
        body: body.trim(),
        timestamp: Date.now(),
      };
      addMessage(msg);

      // Simulate remote echo with random delay (500–2500ms)
      const delay = 500 + Math.random() * 2000;
      setTimeout(() => {
        receiveMessage(toId, body.trim());
      }, delay);
    },
    [addMessage]
  );

  const receiveMessage = useCallback(
    (fromId: string, body: string) => {
      const msg: Message = {
        id: generateId(),
        fromId,
        toId: ME_ID,
        body,
        timestamp: Date.now(),
      };
      addMessage(msg);
    },
    [addMessage]
  );

  const getMessagesForBuddy = useCallback(
    (buddyId: string): Message[] => {
      return conversations[buddyId] ?? [];
    },
    [conversations]
  );

  return {
    meId: ME_ID,
    buddies,
    conversations,
    activeBuddyId,
    myStatus,
    setActiveBuddy,
    setMyStatus,
    sendMessage,
    receiveMessage,
    getMessagesForBuddy,
  };
}
