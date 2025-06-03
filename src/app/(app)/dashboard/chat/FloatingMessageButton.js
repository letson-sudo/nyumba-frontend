'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import SkeletonMessageLoader from './SkeletonMessageLoader'

const FloatingMessageButton = () => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  const messagesEndRef = useRef(null)
  const soundRef = useRef(null)

  useEffect(() => {
    // Create an audio element
    soundRef.current = new Audio('/sounds/notification.WAV')

    // Simulate loading messages
    setTimeout(() => {
      setMessages([])
      setLoading(false)
    }, 2000)

    // Simulate incoming messages every 10 seconds
    const interval = setInterval(() => {
      const newIncoming = { id: Date.now(), text: 'Incoming new message!' }
      setMessages(prev => [...prev, newIncoming])
      if (!open) {
        setUnreadCount(prev => prev + 1)
        playSound()
        showNotification('New Message', newIncoming.text)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [open])

  useEffect(() => {
    if (open) {
      setUnreadCount(0)
      scrollToBottom()
    }
  }, [open, messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return
    const newMsg = { id: Date.now(), text: newMessage }
    setMessages(prev => [...prev, newMsg])
    setNewMessage('')
    scrollToBottom()
  }

  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body })
        }
      })
    }
  }

  const playSound = () => {
    if (soundRef.current) {
      soundRef.current.play().catch(error => {
        console.error('Sound play error:', error)
      })
    }
  }

  return (
    <>
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Button */}
        <motion.div
          className="absolute bottom-6 right-6 pointer-events-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <button
            onClick={() => setOpen(!open)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition relative z-50"
          >
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </motion.div>

        {/* Messages Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute bottom-24 right-6 w-80 bg-white border border-gray-300 rounded-lg shadow-2xl p-4 flex flex-col space-y-3 z-40 pointer-events-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Messages</h3>

              <div className="flex-1 overflow-y-auto max-h-60 space-y-2">
                {loading ? (
                  <SkeletonMessageLoader count={5} />
                ) : messages.length > 0 ? (
                  messages.map(msg => (
                    <div key={msg.id} className="p-2 bg-gray-100 rounded">
                      {msg.text}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center mt-10">
                    No messages available.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex items-center border-t pt-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 hover:bg-blue-600 p-2 rounded-r-lg text-white flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default FloatingMessageButton
