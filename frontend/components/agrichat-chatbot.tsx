'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
// Removed unused Card imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Leaf, 
  Sprout, 
  Clock,
  Loader2,
  MessageSquare,
  Zap,
  Menu
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function AgriChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m AgriSense AI Assistant. I can help you with crop recommendations, weather analysis, farming tips, and more. How can I assist you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (sidebarOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
    }
  }, [sidebarOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "What are the best crops for my soil type?",
    "How can I improve water efficiency on my farm?",
    "What's the optimal planting schedule for this season?",
    "How to manage pests organically?",
    "Weather patterns and crop selection advice",
    "Soil nutrition and fertilizer recommendations",
    "Irrigation techniques for different crops",
    "Sustainable farming practices"
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shrink-0">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-emerald-600"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent">
                  AgriChat
                </h1>
                <p className="text-gray-600 text-sm">Your AI Farming Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hidden sm:flex">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <div className="text-sm text-gray-500 hidden md:block">
                {messages.length} messages
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Sidebar - Desktop */}
        <div className={`hidden lg:block w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 p-6 shrink-0 ${sidebarOpen ? 'lg:block' : ''}`}>
          <div className="space-y-6">
            {/* Quick Questions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                Quick Questions
              </h3>
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-sm text-gray-700 transition-all duration-200 hover:shadow-md"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                What I Can Help With
              </h3>
              <div className="space-y-3">
                {[
                  { icon: "🌱", title: "Crop Selection", desc: "Best crops for your conditions" },
                  { icon: "🌤️", title: "Weather Analysis", desc: "Climate and seasonal advice" },
                  { icon: "💧", title: "Irrigation", desc: "Water management strategies" },
                  { icon: "🛡️", title: "Pest Control", desc: "Organic and sustainable methods" },
                  { icon: "📊", title: "Soil Health", desc: "Nutrition and improvement tips" },
                  { icon: "💰", title: "Yield Optimization", desc: "Maximize your harvest" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                      <div className="text-gray-600 text-xs">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-4 text-white">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Pro Tip
              </h4>
              <p className="text-sm opacity-90">
                Be specific about your location, soil type, and current season for the most accurate advice.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-600 hover:text-emerald-600"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-6">
                {/* Quick Questions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    Quick Questions
                  </h3>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-sm text-gray-700 transition-all duration-200 hover:shadow-md"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages Area - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="min-h-full pb-40 md:pb-44"> {/* Extra padding for fixed input */}
                <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                            : 'bg-gradient-to-br from-emerald-500 to-green-600'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div
                        className={`max-w-[85%] space-y-2 ${
                          message.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block px-4 py-3 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                              : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatTime(message.timestamp)}
                          {message.role === 'assistant' && (
                            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                              AgriSense AI
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <div>
                            <div className="text-sm font-medium">AgriSense is thinking...</div>
                            <div className="text-xs text-gray-500">Analyzing your farming question</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Invisible element for auto-scroll */}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Fixed Input Area - Always at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-16 pb-6 px-6 border-t border-gray-200/50 backdrop-blur-sm z-40">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1 bg-white rounded-2xl border-2 border-gray-200 shadow-lg hover:border-emerald-300 transition-colors duration-200">
                  <textarea
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about crops, weather, soil health, irrigation, pests, or any farming topic..."
                    className="w-full border-0 focus:outline-none focus:ring-0 py-4 px-5 text-base h-auto min-h-[60px] resize-none rounded-2xl"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-[60px] w-[60px] shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <div className="flex justify-between items-center mt-3 px-1">
                <p className="text-xs text-gray-500">
                  Press Enter to send • Shift+Enter for new line
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  AgriSense AI is online
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}