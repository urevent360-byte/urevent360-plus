
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Loader2, FileText, Share2, Download } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { updateCatalogAction, getCatalogAction } from './actions';

export default function CatalogPage() {
  const { toast } = useToast();
  const [catalogUrl, setCatalogUrl] = useState<string | null>(null);
  const [catalogFile, setCatalogFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      setIsLoading(true);
      const data = await getCatalogAction();
      if (data.success) {
        setCatalogUrl(data.catalogUrl || null);
      }
      setIsLoading(false);
    }
    loadCatalog();
  }, []);


  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
          toast({ title: "Invalid File Type", description: "Please upload a PDF file.", variant: "destructive"});
          return;
      }
      setCatalogFile(file);
      setCatalogUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!catalogFile) {
        toast({ title: "No file selected", description: "Please select a PDF file to upload.", variant: "destructive"});
        return;
    }
    setIsSaving(true);
    const formData = new FormData();
    formData.append('catalog', catalogFile);

    const result = await updateCatalogAction(formData);

    if (result.success) {
      toast({
        title: "Catalog Saved!",
        description: "Your service catalog has been updated.",
      });
      // Refetch the URL from the server to get the permanent path
      const data = await getCatalogAction();
      if (data.success) {
        setCatalogUrl(data.catalogUrl || null);
      }
      setCatalogFile(null);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };
  
  const handleShare = () => {
      if (!catalogUrl) return;
      const fullUrl = `${window.location.origin}${catalogUrl}`;
      navigator.clipboard.writeText(fullUrl);
      toast({
          title: "Link Copied!",
          description: "The link to your catalog has been copied to your clipboard."
      });
  }

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
            <CardTitle>Service Catalog (PDF)</CardTitle>
            <CardDescription>Upload a PDF of your service catalog to share with clients.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Upload New Catalog</Label>
              <Card className="p-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Upload a new PDF to replace the existing one. Max file size: 10MB.</p>
                        <Input id="catalog-upload" type="file" accept="application/pdf" onChange={handleFileSelect} />
                         <Button onClick={handleSave} disabled={isSaving || !catalogFile}>
                          {isSaving ? <Loader2 className="mr-2 animate-spin" /> : <Upload className="mr-2" />}
                          {isSaving ? 'Saving...' : 'Save New Catalog'}
                        </Button>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-muted/50 p-4 rounded-md min-h-[200px]">
                        {catalogUrl ? (
                            <div className="text-center">
                                <FileText className="h-24 w-24 text-primary" />
                                <p className="text-muted-foreground mt-4">
                                  {catalogFile ? catalogFile.name : 'Current Catalog'}
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No catalog uploaded</p>
                        )}
                    </div>
                 </div>
              </Card>
            </div>
            
            {catalogUrl && (
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Current Catalog</Label>
                 <Card className="p-4">
                   <div className="flex flex-col sm:flex-row items-center gap-4">
                       <FileText className="h-10 w-10 text-primary flex-shrink-0"/>
                       <p className="font-medium flex-grow">You have an active catalog. You can download it or share the link.</p>
                       <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <a href={catalogUrl} download target="_blank"><Download className="mr-2"/> Download</a>
                            </Button>
                            <Button onClick={handleShare}>
                                <Share2 className="mr-2"/> Share Link
                            </Button>
                       </div>
                   </div>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
