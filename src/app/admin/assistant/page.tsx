'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
        const aiResponse: Message = { sender: 'ai', text: "I'm sorry, my conversational abilities are still under development. Please check back later!" };
        setMessages(prev => [...prev, aiResponse]);
    }, 1000);
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
            <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
               {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && (
                            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                <AvatarFallback><Bot size={18} /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p>{msg.text}</p>
                        </div>
                         {msg.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User size={18} /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
               ))}
                {messages.length === 0 && (
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                        <Send className="mr-2" /> Send
                    </Button>
                </div>
            </div>
        </Card>
    </div>
  );
}
