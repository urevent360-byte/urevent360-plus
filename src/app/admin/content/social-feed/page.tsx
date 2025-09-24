
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Instagram, Link as LinkIcon, Save } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function SocialFeedPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const [instagramSettings, setInstagramSettings] = useState({
        enabled: true,
        apiKey: 'IG-XXX-YYY-ZZZ-AAA' // Mock key
    });

    const [otherPlatformSettings, setOtherPlatformSettings] = useState({
        enabled: false,
        platformName: '',
        apiKey: ''
    });

    const handleSave = async () => {
        setIsSaving(true);
        // In a real app, this would save the settings to a config file or database
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        toast({
            title: "Social Feed Settings Saved!",
            description: "Your social media feed configuration has been updated.",
        });
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
                    <CardTitle>Social Media Feed</CardTitle>
                    <CardDescription>Connect your social media accounts to display a live feed on your landing page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Instagram Section */}
                    <div className="p-6 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <Label htmlFor="instagram-enabled" className="flex items-center gap-2">
                                <Instagram className="text-pink-500" />
                                <span className="text-lg font-semibold">Instagram Feed</span>
                            </Label>
                            <Switch
                                id="instagram-enabled"
                                checked={instagramSettings.enabled}
                                onCheckedChange={(checked) => setInstagramSettings(prev => ({ ...prev, enabled: checked }))}
                            />
                        </div>
                        {instagramSettings.enabled && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Enter your Instagram API Access Token. In a real application, this would involve a secure OAuth flow.
                                </p>
                                <div className="space-y-2">
                                    <Label htmlFor="instagram-key">Access Token</Label>
                                    <Input
                                        id="instagram-key"
                                        value={instagramSettings.apiKey}
                                        onChange={(e) => setInstagramSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                                        placeholder="Enter Instagram API Key"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Other Platform Section */}
                     <div className="p-6 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <Label htmlFor="other-enabled" className="flex items-center gap-2">
                                <LinkIcon />
                                <span className="text-lg font-semibold">Other Platform</span>
                            </Label>
                             <Switch
                                id="other-enabled"
                                checked={otherPlatformSettings.enabled}
                                onCheckedChange={(checked) => setOtherPlatformSettings(prev => ({ ...prev, enabled: checked }))}
                            />
                        </div>
                         {otherPlatformSettings.enabled && (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Configure another social media platform.
                                </p>
                                 <div className="space-y-2">
                                    <Label htmlFor="other-platform-name">Platform Name</Label>
                                    <Input
                                        id="other-platform-name"
                                        value={otherPlatformSettings.platformName}
                                        onChange={(e) => setOtherPlatformSettings(prev => ({ ...prev, platformName: e.target.value }))}
                                        placeholder="e.g., Facebook, TikTok"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="other-key">Access Token or API Key</Label>
                                    <Input
                                        id="other-key"
                                        value={otherPlatformSettings.apiKey}
                                        onChange={(e) => setOtherPlatformSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                                        placeholder="Enter API Key"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2 mt-8">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : <><Save className="mr-2"/>Save Changes</>}
                </Button>
            </div>
        </div>
    );
}
