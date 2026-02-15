export interface Buddy {
  id: string;
  displayName: string;
  status: 'online' | 'away' | 'offline';
  customStatusMessage?: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  body: string;
  timestamp: number;
}
