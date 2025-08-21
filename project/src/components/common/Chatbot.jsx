import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { EnhancedButton } from './EnhancedComponents';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hi! I'm your BookMyBox assistant. I can help you with booking sports boxes, finding locations, pricing, amenities, and any other questions about our platform. How can I assist you today?",
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Generate session ID on first load
    useEffect(() => {
        if (!sessionId) {
            setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
        }
    }, [sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    conversation_history: messages.slice(-5), // Send last 5 messages for context
                    session_id: sessionId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            
            // Update session ID if provided
            if (data.session_id && data.session_id !== sessionId) {
                setSessionId(data.session_id);
            }
            
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact our support team.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Floating Chat Icon */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
            >
                <motion.button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                        boxShadow: [
                            "0 0 0 0 rgba(59, 130, 246, 0.4)",
                            "0 0 0 10px rgba(59, 130, 246, 0)",
                            "0 0 0 0 rgba(59, 130, 246, 0)"
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                >
                    <MessageCircle size={24} />
                </motion.button>
                
                {/* Tooltip */}
                <motion.div
                    className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 pointer-events-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                >
                    Any questions? Ask me!
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </motion.div>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h3 className="font-semibold">BookMyBox Assistant</h3>
                                    <p className="text-sm opacity-90">Always here to help</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            message.type === 'user' 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                        }`}>
                                            {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                                        </div>
                                        <div className={`p-3 rounded-2xl ${
                                            message.type === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                        }`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            <p className={`text-xs mt-1 opacity-70 ${
                                                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    className="flex justify-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex items-start space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <Bot size={16} className="text-gray-600 dark:text-gray-300" />
                                        </div>
                                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex space-x-2">
                                <textarea
                                    ref={inputRef}
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    className="flex-1 resize-none border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-20"
                                    rows="1"
                                    disabled={isLoading}
                                />
                                <EnhancedButton
                                    onClick={sendMessage}
                                    variant="primary"
                                    size="sm"
                                    className="px-3"
                                    disabled={!inputMessage.trim() || isLoading}
                                    loading={isLoading}
                                    icon={!isLoading && <Send size={16} />}
                                >
                                    {isLoading ? '' : ''}
                                </EnhancedButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
