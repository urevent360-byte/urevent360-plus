
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadCloud, FileImage, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getEvent, type Event } from '@/lib/data-adapter'; // Assuming getEvent can find event by token for mock

export default function PhotoUploadClient({ eventId }: { eventId: string }) {
    const { toast } = useToast();
    const [event, setEvent] = useState<Event | null>(null);
    const [validationState, setValidationState] = useState<'validating' | 'valid' | 'invalid'>('validating');
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);

    useEffect(() => {
        async function validateToken() {
            // In a real app, you'd have a getEventByToken function.
            // For this mock, we'll assume eventId is the token and also the ID.
            const fetchedEvent = await getEvent(eventId);
            if (fetchedEvent && fetchedEvent.qrUpload?.status === 'active') {
                setEvent(fetchedEvent);
                setValidationState('valid');
            } else {
                setValidationState('invalid');
            }
        }
        validateToken();
    }, [eventId]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast({
                title: 'No files selected',
                description: 'Please select some photos to upload.',
                variant: 'destructive'
            });
            return;
        }

        setIsUploading(true);

        // In a real app, you'd upload to Firebase Storage here.
        console.log(`Uploading ${files.length} files for event: ${eventId}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload delay

        setIsUploading(false);
        setUploadComplete(true);
    };

    if (validationState === 'validating') {
        return (
            <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                            Validating Link...
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-48">
                         <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (validationState === 'invalid' || !event) {
         return (
            <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl md:text-4xl text-destructive flex items-center justify-center gap-2">
                            <AlertTriangle />
                            Link Invalid or Expired
                        </CardTitle>
                        <CardDescription className="text-lg">
                            This photo upload link is no longer active. Please contact the event host for a new link.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }
    
    if (uploadComplete) {
         return (
            <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
                <Card className="max-w-2xl w-full shadow-xl">
                    <CardHeader className="text-center">
                         <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                            Upload Successful!
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Thank you for sharing your photos for the <span className="font-bold">{event.eventName}</span> event.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
            <Card className="max-w-2xl w-full shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                        Upload Photos
                    </CardTitle>
                    <CardDescription className="text-lg">
                        Add your photos to the gallery for the <span className="font-bold">{event.eventName}</span> event.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-center w-full">
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <Input id="dropzone-file" type="file" className="hidden" multiple onChange={handleFileChange} />
                        </label>
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-lg font-medium">Selected Files:</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {files.map((file, index) => (
                                    <div key={index} className="relative group">
                                        <div className="flex items-center space-x-2 p-2 border rounded-md bg-secondary">
                                            <FileImage className="h-5 w-5 text-muted-foreground" />
                                            <span className="text-sm truncate">{file.name}</span>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Button onClick={handleUpload} disabled={isUploading || files.length === 0} className="w-full">
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <UploadCloud className="mr-2" />
                                Upload {files.length} {files.length === 1 ? 'Photo' : 'Photos'}
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

