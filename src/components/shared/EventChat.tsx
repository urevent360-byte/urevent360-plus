

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Info, CheckCircle, FileText, BadgeDollarSign, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { listMessages, sendMessage, type ChatMessage } from '@/lib/data-adapter';
import { useToast } from '@/hooks/use-toast';

const systemIcons: Record<string, React.ReactNode> = {
    'Invoice created.': <BadgeDollarSign />,
    'Contract sent to client.': <FileText />,
    'Contract signed by client.': <CheckCircle />,
    'Deposit paid by client. Portal is now unlocked.': <CheckCircle />,
    'Event created from lead.': <Info />,
};

const getSystemIcon = (text: string) => {
    return systemIcons[text] || <Info />;
};


export function EventChat({ eventId, role }: { eventId: string; role: 'admin' | 'host' }) {
    console.log('[RSC] Enter: EventChat');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const chatContentRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const fetchedMessages = await listMessages(eventId);
            setMessages(fetchedMessages);
        } catch (error) {
            toast({ title: "Error", description: "Could not load chat messages.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [eventId]);

    useEffect(() => {
        if (chatContentRef.current) {
            chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (input.trim() === '') return;

        const newMessage: ChatMessage = {
            sender: role === 'admin' ? 'admin' : 'user',
            content: input,
            timestamp: new Date().toISOString(),
        };

        const optimisticMessages = [...messages, newMessage];
        setMessages(optimisticMessages);
        const currentInput = input;
        setInput('');
        
        try {
            await sendMessage(eventId, newMessage);
            // Optional: refetch messages to confirm, or trust the optimistic update
            // await fetchMessages(); 
        } catch (error) {
            toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
            // Revert optimistic update
            setMessages(messages);
            setInput(currentInput);
        }
    };
    
    const senderDetails = {
        admin: { name: 'Admin' },
        user: { name: 'Client' }
    };
    
    console.log('[RSC] Render: EventChat Content');
    return (
        <Card className="h-[70vh] flex flex-col">
            <CardHeader>
                <CardTitle>Communication</CardTitle>
                <CardDescription>This is the central chat for this event. Messages and system notifications will appear here.</CardDescription>
            </CardHeader>
            <CardContent ref={chatContentRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-muted/20">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </div>
                ) : messages.map((msg, index) => {
                    // Defensive guard: Do not render if msg or content is empty/invalid.
                    if (!msg || !msg.content) {
                        console.log(`[RSC] Warning: Skipping message at index ${index} due to invalid or empty content.`);
                        return null;
                    };

                    const isCurrentUser = (role === 'admin' && msg.sender === 'admin') || (role === 'host' && msg.sender === 'user');

                    if (msg.sender === 'system') {
                        return (
                             <div key={index} className="flex items-center justify-center gap-2 text-xs text-muted-foreground my-4">
                                <div className="h-px flex-grow bg-border"></div>
                                {getSystemIcon(msg.content)}
                                <span>{msg.content}</span>
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
                                    <p className="text-sm">{msg.content}</p>
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
                 {!isLoading && messages.length === 0 && (
                    <div className="text-center text-muted-foreground pt-16">
                        <p>No messages yet. Start the conversation!</p>
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
            {console.log('[RSC] Exit: EventChat')}
        </Card>
    );
}
