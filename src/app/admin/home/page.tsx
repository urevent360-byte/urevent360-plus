
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookUser, Briefcase, Bot, Newspaper, Users, Calendar, Settings } from 'lucide-react';
import Link from 'next/link';

const overviewCards = [
    { title: 'New Leads', value: 4, icon: <BookUser />, link: '/admin/crm' },
    { title: 'Confirmed Events', value: 1, icon: <Calendar />, link: '/admin/calendar' },
    { title: 'Services', value: 9, icon: <Briefcase />, link: '/admin/services' },
    { title: 'Active Users', value: 3, icon: <Users />, link: '/admin/users' },
];

export default function AdminHomePage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Home</h1>
                    <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of your platform.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewCards.map(card => (
                     <Card key={card.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <div className="text-muted-foreground">{card.icon}</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                             <Button variant="link" asChild className="p-0 h-auto text-xs">
                                <Link href={card.link}>View All</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                       <Button asChild variant="outline"><Link href="/admin/crm"><BookUser className="mr-2"/> Manage Leads</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/services/new"><Briefcase className="mr-2"/> Add New Service</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/assistant"><Bot className="mr-2"/> Chat with AI</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/content"><Newspaper className="mr-2"/> Edit Content</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/calendar"><Calendar className="mr-2"/> View Calendar</Link></Button>
                       <Button asChild variant="outline"><Link href="/admin/settings"><Settings className="mr-2"/> Platform Settings</Link></Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <div className="text-sm"><span className="font-bold">New Lead:</span> Maria Garcia submitted an inquiry.</div>
                                <div className="text-xs text-muted-foreground ml-auto">2 hours ago</div>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="text-sm"><span className="font-bold">Event Confirmed:</span> John Doe's event status changed to "confirmed".</div>
                                <div className="text-xs text-muted-foreground ml-auto">1 day ago</div>
                            </li>
                             <li className="flex items-center gap-3">
                                <div className="text-sm"><span className="font-bold">User Registered:</span> client@urevent360.com created an account.</div>
                                <div className="text-xs text-muted-foreground ml-auto">3 days ago</div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
