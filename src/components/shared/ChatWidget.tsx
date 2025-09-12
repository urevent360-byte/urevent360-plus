'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, MessageSquare, X, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { continueConversation } from '@/ai/flows/customer-support-flow';
import type { MessageData } from 'genkit';

type DisplayMessage = {
  role: 'user' | 'model';
  text: string;
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (messages.length === 0) {
      setMessages([{ role: 'model', text: 'Hello! How can I help you plan your perfect event today?' }]);
    }
  };

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
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-all duration-300", 
        isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
      )}>
        <Button onClick={handleToggle} className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90">
          <MessageSquare className="w-8 h-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>

      <div className={cn("fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-md transition-all duration-300",
        isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      )}>
        <Card className="h-[60vh] flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback><Bot /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>UREVENT 360 PLUS</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleToggle}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close Chat</span>
            </Button>
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
    </>
  );
}
