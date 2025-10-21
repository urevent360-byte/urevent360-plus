
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import QRCode from 'qrcode.react';

export default function QrCodePage() {
    const [pageUrl, setPageUrl] = useState('');

    useEffect(() => {
        // This runs only on the client, where window is available
        setPageUrl(window.location.origin);
    }, []);

    const downloadQRCode = () => {
        const canvas = document.getElementById('website-qr-code') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "urevent360plus-website-qr.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
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
          <CardTitle>Shareable Website QR Code</CardTitle>
          <CardDescription>
            Use this QR code on business cards, flyers, or social media to direct potential clients to your homepage.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8">
            <div className="p-6 bg-white rounded-lg shadow-inner">
                 {pageUrl ? (
                    <QRCode
                        id="website-qr-code"
                        value={pageUrl}
                        size={256}
                        level={"H"}
                        includeMargin={true}
                    />
                ) : (
                    <div className="w-[256px] h-[256px] flex items-center justify-center bg-gray-200 rounded-md">
                        <RefreshCw className="animate-spin" />
                    </div>
                )}
            </div>

            <Button onClick={downloadQRCode} disabled={!pageUrl}>
                <Download className="mr-2"/>
                Download QR Code
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
