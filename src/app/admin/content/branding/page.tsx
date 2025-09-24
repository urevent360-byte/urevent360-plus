
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { updateBrandingAction, getBrandingAction } from './actions';

export default function BrandingPage() {
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBranding() {
      setIsLoading(true);
      const data = await getBrandingAction();
      if (data.success) {
        setLogoUrl(data.logoUrl || null);
        setHeroImageUrl(data.heroImageUrl || null);
      }
      setIsLoading(false);
    }
    loadBranding();
  }, []);


  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleHeroImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setHeroFile(file);
      setHeroImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    if (logoFile) {
        formData.append('logo', logoFile);
    }
    if (heroFile) {
        formData.append('heroImage', heroFile);
    }

    const result = await updateBrandingAction(formData);

    if (result.success) {
      toast({
        title: "Branding Saved!",
        description: "Your logo and hero image have been updated.",
      });
      // Optionally, clear file inputs after successful save
      setLogoFile(null);
      setHeroFile(null);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
    );
  }

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

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Site Branding</CardTitle>
            <CardDescription>Manage your logo and the main hero image for the landing page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Logo Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Logo</Label>
              <Card className="p-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Recommended size: 400x100 pixels. Max file size: 1MB.</p>
                        <Input id="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoSelect} />
                    </div>
                    <div className="flex justify-center items-center bg-muted/50 p-4 rounded-md min-h-[100px]">
                        {logoUrl ? (
                            <Image src={logoUrl} alt="Logo preview" width={200} height={50} className="h-auto" unoptimized />
                        ) : (
                            <p className="text-muted-foreground">Logo Preview</p>
                        )}
                    </div>
                 </div>
              </Card>
            </div>
            
            {/* Hero Image Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Landing Page Hero</Label>
               <Card className="p-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                         <p className="text-sm text-muted-foreground">Recommended aspect ratio: 16:9. Recommended width: 1920px. Max file size: 5MB.</p>
                        <Input id="hero-upload" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleHeroImageSelect} />
                    </div>
                    <div className="flex justify-center items-center bg-muted/50 p-4 rounded-md min-h-[150px]">
                         {heroImageUrl ? (
                            <Image src={heroImageUrl} alt="Hero image preview" width={320} height={180} className="object-cover rounded-md" unoptimized />
                        ) : (
                            <p className="text-muted-foreground">Hero Image Preview</p>
                        )}
                    </div>
                 </div>
              </Card>
            </div>

          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Upload className="mr-2" />}
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}
