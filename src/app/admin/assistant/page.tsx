
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

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([
      { role: 'model', text: "Hello! I'm the AI assistant. I can help you with sales questions or you can take over the conversation." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const chatContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages, suggestions]);
  
  const processAndSetResponse = (responseText: string) => {
    const suggestionMatch = responseText.match(/SUGGEST:\s*\|([^|]+(?:\|[^|]+)*)\|/);
    if (suggestionMatch && suggestionMatch[1]) {
      const suggestedReplies = suggestionMatch[1].split('|').map(s => s.trim()).filter(Boolean);
      setSuggestions(suggestedReplies);
      const cleanText = responseText.replace(suggestionMatch[0], '').trim();
      setMessages(prev => [...prev, { role: 'model', text: cleanText }]);
    } else {
      setSuggestions([]);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (messageText.trim() === '' || isLoading) return;

    setIsLoading(true);
    setSuggestions([]);
    
    const userMessage: DisplayMessage = { role: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    
    if (messageText === input) {
        setInput('');
    }

    const conversationHistory: MessageData[] = [
        ...messages.map(msg => ({
            role: msg.role,
            content: [{ text: msg.text }],
        })),
        { role: 'user', content: [{ text: messageText }] },
    ];

    try {
        const aiResponseText = await continueConversation(conversationHistory);
        processAndSetResponse(aiResponseText);
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
                <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
                <p className="text-muted-foreground">Chat with leads and manage automated conversations.</p>
            </div>
        </div>

        <Card className="h-[70vh] flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> Active Conversation</CardTitle>
                <CardDescription>Lead: John Doe (john@example.com)</CardDescription>
            </CardHeader>
            <CardContent ref={chatContentRef} className="flex-grow overflow-y-auto p-4 space-y-4">
               {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                <AvatarFallback><Bot size={18} /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}`}>
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
                      <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                          <AvatarFallback><Bot size={18} /></AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                      </div>
                  </div>
                )}
                 {suggestions.length > 0 && !isLoading && (
                    <div className="flex flex-wrap gap-2 justify-start pt-2">
                        {suggestions.map((suggestion, index) => (
                        <Button key={index} variant="outline" size="sm" onClick={() => sendMessage(suggestion)}>
                            {suggestion}
                        </Button>
                        ))}
                    </div>
                )}
                {messages.length === 0 && !isLoading && (
                    <div className="text-center text-muted-foreground pt-16">
                        <p>No messages yet. Start a conversation below.</p>
                    </div>
                )}
            </CardContent>
            <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                    <Input 
                        placeholder="Type your message..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                        disabled={isLoading}
                    />
                    <Button onClick={() => sendMessage(input)} disabled={isLoading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    </div>
  );
}
