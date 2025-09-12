
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { continueConversation } from '@/ai/flows/customer-support-flow';
import type { MessageData } from 'genkit';

type DisplayMessage = {
  role: 'user' | 'model';
  text: string;
};

export default function AppChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([
      { role: 'model', text: 'Hello! How can I help you with your event today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: DisplayMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const conversationHistory: MessageData[] = [
        ...messages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.text }],
        })),
        { role: 'user', content: [{ text: input }] },
    ];

    try {
        const aiResponseText = await continueConversation(conversationHistory);
        const aiMessage: DisplayMessage = { role: 'model', text: aiResponseText };
        setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        console.error("AI Error:", error);
        const errorMessage: DisplayMessage = { role: 'model', text: "I'm sorry, I encountered an error. Please try again." };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant Chat</h1>
          <p className="text-muted-foreground">Ask questions about our services or your event.</p>
        </div>
      </div>
      <Card className="h-[70vh] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bot /> Active Conversation</CardTitle>
          <CardDescription>Chat with our AI assistant for support.</CardDescription>
        </CardHeader>
        <CardContent ref={chatContentRef} className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <Avatar className="h-8 w-8 bg-muted text-muted-foreground">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn("rounded-lg px-4 py-2 max-w-[80%]", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User size={18} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
              <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 bg-muted text-muted-foreground">
                      <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                   <div className="rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                  </div>
              </div>
          )}
        </CardContent>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask about our services..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
