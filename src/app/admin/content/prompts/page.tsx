
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { updateSystemPromptAction, getSystemPromptAction } from './actions';
import { defaultSystemPrompt } from '@/lib/data-adapter';


export default function PromptEditorPage() {
    const { toast } = useToast();
    const [prompt, setPrompt] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPrompt() {
            setIsLoading(true);
            const result = await getSystemPromptAction();
            if (result.success) {
                // Use fetched prompt, or default if it's empty/missing
                setPrompt(result.prompt || defaultSystemPrompt);
            } else {
                toast({ title: "Error", description: result.message, variant: 'destructive' });
                setPrompt(defaultSystemPrompt); // Fallback to default on error
            }
            setIsLoading(false);
        }
        loadPrompt();
    }, [toast]);

    const handleSave = async () => {
        setIsSaving(true);
        const formData = new FormData();
        formData.append('systemPrompt', prompt);

        const result = await updateSystemPromptAction(formData);

        if (result.success) {
            toast({
                title: "System Prompt Saved!",
                description: "The AI assistant will now use the updated prompt.",
            });
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: 'destructive',
            });
        }
        setIsSaving(false);
    };

    return (
        <div>
            <div className="mb-8">
                <Button variant="outline" asChild>
                    <Link href="/admin/content">
                        <ArrowLeft className="mr-2" />
                        Back to Content
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>AI Assistant Prompt Editor</CardTitle>
                    <CardDescription>
                        This is the core "System Prompt" for the AI assistant. It defines its personality, goals, knowledge, and constraints.
                        Edit the text below to change how the AI responds to customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <Label htmlFor="system-prompt" className="font-semibold text-lg">System Prompt</Label>
                            <Textarea
                                id="system-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="min-h-[500px] font-mono text-sm"
                                placeholder="Enter the AI's system prompt here..."
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2 mt-8">
                <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving || isLoading}>
                    {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                    Save Prompt
                </Button>
            </div>
        </div>
    );
}
