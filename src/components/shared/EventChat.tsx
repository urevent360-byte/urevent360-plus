
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Info, CheckCircle, FileText, BadgeDollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type Message = {
    sender: 'user' | 'admin' | 'system';
    text: string;
    timestamp: string;
    icon?: React.ReactNode;
};

const placeholderMessages: Message[] = [
    { sender: 'system', text: 'Event created from lead.', timestamp: '2024-07-30T10:00:00Z', icon: <Info /> },
    { sender: 'admin', text: 'Hi! I\'ve sent over the contract and invoice for you to review.', timestamp: '2024-07-30T10:05:00Z' },
    { sender: 'system', text: 'Contract sent to client.', timestamp: '2024-07-30T10:05:10Z', icon: <FileText /> },
    { sender: 'system', text: 'Invoice created.', timestamp: '2024-07-30T10:05:20Z', icon: <BadgeDollarSign /> },
    { sender: 'user', text: 'Great, thanks! I will review it shortly.', timestamp: '2024-07-30T10:15:00Z' },
    { sender: 'user', text: 'I\'ve signed the contract and paid the deposit!', timestamp: '2024-07-30T11:30:00Z' },
    { sender: 'system', text: 'Contract signed by client.', timestamp: '2024-07-30T11:30:05Z', icon: <CheckCircle /> },
    { sender: 'system', text: 'Deposit paid by client. Portal is now unlocked.', timestamp: '2024-07-30T11:30:15Z', icon: <CheckCircle /> },
];

export function EventChat({ role }: { role: 'admin' | 'host' }) {
    const [messages, setMessages] = useState<Message[]>(placeholderMessages);
    const [input, setInput] = useState('');
    const chatContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim() === '') return;

        const newMessage: Message = {
            sender: role === 'admin' ? 'admin' : 'user',
            text: input,
            timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');
    };
    
    // Determine which name and avatar to show for admin/user
    const senderDetails = {
        admin: { name: 'Admin', avatar: '/avatars/admin.png' },
        user: { name: 'Client', avatar: '/avatars/client.png' }
    };

    return (
        <Card className="h-[70vh] flex flex-col">
            <CardHeader>
                <CardTitle>Communication</CardTitle>
                <CardDescription>This is the central chat for this event. Messages and system notifications will appear here.</CardDescription>
            </CardHeader>
            <CardContent ref={chatContentRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20">
                {messages.map((msg, index) => {
                    const isCurrentUser = (role === 'admin' && msg.sender === 'admin') || (role === 'host' && msg.sender === 'user');

                    if (msg.sender === 'system') {
                        return (
                             <div key={index} className="flex items-center justify-center gap-2 text-xs text-muted-foreground my-4">
                                <div className="h-px flex-grow bg-border"></div>
                                {msg.icon}
                                <span>{msg.text}</span>
                                <span className="text-xs">({format(new Date(msg.timestamp), 'p')})</span>
                                <div className="h-px flex-grow bg-border"></div>
                            </div>
                        )
                    }

                    return (
                        <div key={index} className={cn("flex items-end gap-3", isCurrentUser ? 'justify-end' : 'justify-start')}>
                            {!isCurrentUser && (
                                <Avatar className="h-8 w-8">
                                     <AvatarFallback>
                                        {msg.sender === 'admin' ? <Bot size={18} /> : <User size={18} />}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div>
                                {!isCurrentUser && (
                                     <p className="text-xs text-muted-foreground mb-1 ml-2">
                                        {msg.sender === 'admin' ? senderDetails.admin.name : senderDetails.user.name}
                                    </p>
                                )}
                                <div className={cn("rounded-lg px-4 py-2 max-w-sm break-words", isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-card')}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                                <p className={cn("text-xs text-muted-foreground mt-1", isCurrentUser ? 'text-right' : 'text-left')}>
                                    {format(new Date(msg.timestamp), 'p')}
                                </p>
                            </div>
                            {isCurrentUser && (
                                 <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {msg.sender === 'admin' ? <Bot size={18} /> : <User size={18} />}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    );
                })}
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
    );
}
