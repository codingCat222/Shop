import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Send, ArrowLeft, MoreVertical, Paperclip, Pin, Phone, Video, ShieldAlert, CheckCircle } from 'lucide-react';
import { ChatRoom, ChatMessage, UserProfile } from '../types';

interface ChatViewProps {
  chatRooms: ChatRoom[];
  activeProfile: UserProfile;
  onSendMessage: (roomId: string, text: string) => void;
  onNavigateToTradeDetail?: (tradeId: string) => void;
}

export default function ChatView({ chatRooms, activeProfile, onSendMessage, onNavigateToTradeDetail }: ChatViewProps) {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRoom?.messages]);

  const filteredRooms = chatRooms.filter((room) =>
    room.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !messageText.trim()) return;

    onSendMessage(selectedRoom.id, messageText.trim());
    setMessageText('');
  };

  return (
    <div className="flex-1 flex bg-white h-full overflow-hidden pb-24">

      <div className={`w-full flex-col h-full ${selectedRoom ? 'hidden' : 'flex'}`}>

        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 border-b border-slate-50">
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-3">Chats</h1>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, contacts..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-sans text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 focus:bg-white transition-all"
            />
            <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar space-y-2"
        >
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedRoom(room)}
                className="p-3.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 font-sans font-bold flex items-center justify-center shrink-0 border border-purple-200">
                    {room.participantAvatar}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-extrabold text-sm text-slate-800 truncate">
                        {room.participantName}
                      </span>
                      {room.isPinned && (
                        <Pin className="w-3 h-3 text-purple-400 rotate-45" />
                      )}
                    </div>
                    <p className="text-xs font-sans text-slate-400 truncate max-w-[200px]">
                      {room.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-sans text-slate-400 block mb-1">
                    {room.lastMessageTime}
                  </span>
                  {room.unreadCount > 0 && (
                    <span className="inline-flex bg-purple-600 text-white font-sans font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-xs">
                      {room.unreadCount}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 px-6">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-sans text-slate-500 font-medium">No active conversation threads.</p>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed inset-0 z-40 bg-white flex flex-col h-full overflow-hidden pb-24"
          >
            <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 font-sans font-bold text-sm flex items-center justify-center">
                    {selectedRoom.participantAvatar}
                  </div>
                  <div>
                    <span className="block text-xs font-sans font-extrabold text-slate-800 leading-tight">
                      {selectedRoom.participantName}
                    </span>
                    <span className="text-[9px] font-sans text-green-500 font-semibold flex items-center gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <button className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-full"><Phone className="w-4 h-4" /></button>
                <button className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-full"><Video className="w-4 h-4" /></button>
                <button className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-full"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>

            {selectedRoom.associatedTradeId && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-purple-50 border-b border-purple-100 p-3 flex items-center justify-between px-5"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-600 shrink-0" />
                  <div className="text-[11px] font-sans">
                    <span className="font-bold text-slate-700 block">Linked Escrow Trade: #{selectedRoom.associatedTradeId}</span>
                    <span className="text-slate-400 text-[10px]">Multi-sig protection is active</span>
                  </div>
                </div>
                {onNavigateToTradeDetail && (
                  <button
                    onClick={() => {
                      onNavigateToTradeDetail(selectedRoom.associatedTradeId!);
                      setSelectedRoom(null);
                    }}
                    className="text-[10px] font-sans font-bold text-purple-600 bg-white border border-purple-200 px-3 py-1 rounded-lg shadow-2xs hover:bg-purple-100 transition-colors"
                  >
                    View Status
                  </button>
                )}
              </motion.div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/40">
              <div className="text-center py-2">
                <span className="text-[9px] font-mono tracking-wider text-slate-300 uppercase font-bold bg-white px-2.5 py-1 rounded-full border border-slate-100">
                  Secure Chat Channel
                </span>
              </div>

              {selectedRoom.messages.map((msg, idx) => {
                const isMe = msg.senderUsername === activeProfile.username;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.3) }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3.5 text-xs font-sans shadow-2xs ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                      }`}
                    >
                      {!isMe && (
                        <span className="block text-[9px] font-bold text-purple-500 mb-1 uppercase tracking-wider">
                          {msg.senderName}
                        </span>
                      )}

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                      <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-60">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCircle className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your secure message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-sans text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 focus:bg-white transition-all"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-colors shrink-0"
              >
                <Send className="w-4.5 h-4.5 stroke-[2]" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}