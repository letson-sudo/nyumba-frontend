'use client';

import { useState } from 'react';

export default function FloatingChatInput() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() === '') return;
    console.log('Sending:', message);
    setMessage('');
    setOpen(false); // Optional: close after sending
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="flex items-center bg-black border border-gray-600 rounded-lg shadow-lg px-2 py-1 w-[280px] transition-all">
           <input
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Type your message..."
    className="w-full bg-transparent text-white placeholder-gray-400 px-2 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f5d478] focus:border-transparent transition-all"
  />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] text-black font-semibold rounded-md px-3 py-1 ml-2 hover:opacity-90"
          >
            Send
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-[#d6a531] via-[#f5d478] to-[#d6a531] text-black font-bold px-4 py-2 rounded-full shadow-lg transition-all hover:opacity-90"
        >
          Chat
        </button>
      )}
    </div>
  );
}
