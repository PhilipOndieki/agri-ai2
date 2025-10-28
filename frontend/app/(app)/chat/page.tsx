"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Sprout, User, AlertCircle, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { apiCall, API_URL } from "@/lib/api"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AgriAI assistant. I can help you with farming advice, crop management, pest control, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Get or create session ID
      let sessionId = sessionStorage.getItem('chatSessionId')
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        sessionStorage.setItem('chatSessionId', sessionId)
      }

      // Call backend API using apiCall helper
      const response = await apiCall('/api/chatbot/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: userMessage.content,
          sessionId: sessionId,
          language: 'en'
        }),
      })

      // Log response for debugging
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`)
      }

      // Update session ID if provided
      if (data.data?.sessionId) {
        sessionStorage.setItem('chatSessionId', data.data.sessionId)
      }

      // Extract AI response from various possible response structures
      let aiContent = data.data?.response || 
                      data.data?.message || 
                      data.response || 
                      data.message

      if (!aiContent) {
        console.error('Unexpected response structure:', data)
        aiContent = "I apologize, but I couldn't generate a proper response. Please try again."
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      console.error('Chat error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Failed to get response'
      setError(errorMsg)
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AgriAI assistant. I can help you with farming advice, crop management, pest control, and more. What would you like to know?",
        timestamp: new Date(),
      },
    ])
    sessionStorage.removeItem('chatSessionId')
    setError(null)
  }

  const quickQuestions = [
    "How do I prevent tomato blight?",
    "What's the best fertilizer for vegetables?",
    "How often should I water my crops?",
    "How do I control pests naturally?",
  ]

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader title="AI Assistant" subtitle="Get expert farming advice" />

      <main className="flex-1 flex flex-col">
        {/* Error Banner */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-destructive hover:text-destructive/80"
            >
              ×
            </button>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {/* Clear Chat Button */}
          {messages.length > 1 && (
            <div className="flex justify-end mb-2">
              <Button
                onClick={handleClearChat}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Chat
              </Button>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sprout className="w-4 h-4 text-primary" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        // Headings
                        h1: ({ node, ...props }) => (
                          <h1 className="text-lg font-bold mt-4 mb-2 text-foreground" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-base font-bold mt-3 mb-2 text-foreground" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-sm font-semibold mt-2 mb-1 text-foreground" {...props} />
                        ),
                        // Paragraphs
                        p: ({ node, ...props }) => (
                          <p className="mb-2 leading-relaxed text-muted-foreground last:mb-0" {...props} />
                        ),
                        // Strong/Bold
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold text-foreground" {...props} />
                        ),
                        // Emphasis/Italic
                        em: ({ node, ...props }) => (
                          <em className="italic text-foreground" {...props} />
                        ),
                        // Unordered Lists
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc list-inside space-y-1 mb-2 text-muted-foreground" {...props} />
                        ),
                        // Ordered Lists
                        ol: ({ node, ...props }) => (
                          <ol className="list-decimal list-inside space-y-1 mb-2 text-muted-foreground" {...props} />
                        ),
                        // List Items
                        li: ({ node, ...props }) => (
                          <li className="leading-relaxed ml-2" {...props} />
                        ),
                        // Code blocks
                        code: ({ node, inline, ...props }: any) => (
                          inline ? (
                            <code className="bg-muted-foreground/10 px-1.5 py-0.5 rounded text-xs font-mono text-foreground" {...props} />
                          ) : (
                            <code className="block bg-muted-foreground/10 p-2 rounded text-xs font-mono overflow-x-auto text-foreground my-2" {...props} />
                          )
                        ),
                        // Blockquotes
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-primary/30 pl-3 italic text-muted-foreground my-2" {...props} />
                        ),
                        // Links
                        a: ({ node, ...props }) => (
                          <a className="text-primary hover:underline" {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-primary-foreground">{message.content}</p>
                )}
                <p className={`text-xs opacity-70 mt-1 ${message.role === "user" ? "text-primary-foreground" : "text-muted-foreground"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sprout className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm text-muted-foreground mb-3">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4 safe-bottom">
          <div className="flex gap-2 max-w-4xl mx-auto">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about farming..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-primary hover:bg-primary-hover text-white flex-shrink-0"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}