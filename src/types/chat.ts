export interface ChatMessage {
  id: string;
  chatId: string;
  senderUsername: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'admin' | 'system';
  content: string;
  timestamp: string;
  attachmentName?: string;
}

export interface ChatRoom {
  id: string;
  participantUsername: string;
  participantName: string;
  participantAvatar: string;
  participantRole: 'buyer' | 'seller' | 'admin';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned?: boolean;
  messages: ChatMessage[];
  associatedTradeId?: string;
}
