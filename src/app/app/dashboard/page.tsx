
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, Shield } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 dark:text-white">
                        Welcome to UREVENT 360 PLUS
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Please select your portal to continue.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Host Portal Card */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
                                <LogIn />
                                Host Portal
                            </CardTitle>
                            <CardDescription>
                                For clients to manage their event details, gallery, and timeline.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            
                                <Link href="/app/login">
                                    Login as Host
                                </Link>
                            
                        </CardContent>
                    </Card>

                    {/* Admin Portal Card */}
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold text-primary">
                                <Shield />
                                Admin Portal
                            </CardTitle>
                            <CardDescription>
                                For staff to manage clients, services, and platform settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            
                                <Link href="/admin/login">
                                    Login as Admin
                                </Link>
                            
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
