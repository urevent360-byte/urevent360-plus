
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getSystemPromptAction, updateSystemPromptAction, getSystemPromptEsAction, updateSystemPromptEsAction } from './actions';
import { defaultSystemPrompt } from '@/lib/data-adapter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PromptEditorPage() {
    const { toast } = useToast();
    const [promptEn, setPromptEn] = useState('');
    const [promptEs, setPromptEs] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPrompts() {
            setIsLoading(true);
            const [resultEn, resultEs] = await Promise.all([
                getSystemPromptAction(),
                getSystemPromptEsAction()
            ]);

            if (resultEn.success) {
                setPromptEn(resultEn.prompt || defaultSystemPrompt);
            } else {
                toast({ title: "Error (EN)", description: resultEn.message, variant: 'destructive' });
                setPromptEn(defaultSystemPrompt);
            }

            if (resultEs.success) {
                setPromptEs(resultEs.prompt || 'Please add a Spanish system prompt.');
            } else {
                toast({ title: "Error (ES)", description: resultEs.message, variant: 'destructive' });
                setPromptEs('');
            }
            
            setIsLoading(false);
        }
        loadPrompts();
    }, [toast]);

    const handleSave = async (lang: 'en' | 'es') => {
        setIsSaving(true);
        const formData = new FormData();
        let result;

        if (lang === 'en') {
            formData.append('systemPrompt', promptEn);
            result = await updateSystemPromptAction(formData);
        } else {
            formData.append('systemPromptEs', promptEs);
            result = await updateSystemPromptEsAction(formData);
        }

        if (result.success) {
            toast({
                title: `System Prompt (${lang.toUpperCase()}) Saved!`,
                description: `The AI assistant will now use the updated ${lang === 'en' ? 'English' : 'Spanish'} prompt.`,
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
            
            <Tabs defaultValue="en">
                <TabsList className="mb-4">
                    <TabsTrigger value="en">English Prompt</TabsTrigger>
                    <TabsTrigger value="es">Spanish Prompt</TabsTrigger>
                </TabsList>
                <TabsContent value="en">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Assistant Prompt Editor (English)</CardTitle>
                            <CardDescription>
                                This is the core "System Prompt" for the AI assistant in English. It defines its personality, goals, and knowledge.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Label htmlFor="system-prompt-en" className="font-semibold text-lg">System Prompt (EN)</Label>
                                    <Textarea
                                        id="system-prompt-en"
                                        value={promptEn}
                                        onChange={(e) => setPromptEn(e.target.value)}
                                        className="min-h-[500px] font-mono text-sm"
                                        placeholder="Enter the AI's English system prompt here..."
                                    />
                                     <Button onClick={() => handleSave('en')} disabled={isSaving || isLoading}>
                                        {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                                        Save English Prompt
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="es">
                     <Card>
                        <CardHeader>
                            <CardTitle>AI Assistant Prompt Editor (Spanish)</CardTitle>
                            <CardDescription>
                                This is the core "System Prompt" for the AI assistant in Spanish.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Label htmlFor="system-prompt-es" className="font-semibold text-lg">System Prompt (ES)</Label>
                                    <Textarea
                                        id="system-prompt-es"
                                        value={promptEs}
                                        onChange={(e) => setPromptEs(e.target.value)}
                                        className="min-h-[500px] font-mono text-sm"
                                        placeholder="Enter the AI's Spanish system prompt here..."
                                    />
                                     <Button onClick={() => handleSave('es')} disabled={isSaving || isLoading}>
                                        {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                                        Save Spanish Prompt
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
