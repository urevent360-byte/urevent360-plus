
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, BarChart3, Bot, Edit, Instagram, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';

const placeholderLeads = [
    { id: 'lead-1', name: 'Jennifer Aniston', location: 'Winter Park, FL', potential: 'High' },
    { id: 'lead-2', name: 'Brad Pitt', location: 'Lake Nona, FL', potential: 'High' },
    { id: 'lead-3', name: 'Angelina Jolie', location: 'Kissimmee, FL', potential: 'Medium' },
    { id: 'lead-4', name: 'George Clooney', location: 'Downtown Orlando, FL', potential: 'Medium' },
    { id: 'lead-5', name: 'Julia Roberts', location: 'Pine Hills, FL', potential: 'Low' },
];

const placeholderCampaigns = [
    { id: 'camp-1', name: 'IG Story - Quinceañera Promo', clicks: 1250, leads: 45, gender: '90% Female', age: '14-19', location: 'Orlando, FL' },
    { id: 'camp-2', name: 'FB Ad - Wedding 360 Booth', clicks: 3400, leads: 32, gender: '65% Female', age: '25-35', location: 'Central Florida' },
    { id: 'camp-3', name: 'TikTok - LED Robot Post', clicks: 15200, leads: 120, gender: '55% Female', age: '16-24', location: 'USA' },
];

const getPotentialBadge = (potential: string) => {
    switch (potential) {
        case 'High': return 'bg-green-100 text-green-800 border-green-300';
        case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'Low': return 'bg-red-100 text-red-800 border-red-300';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export default function MarketingPage() {

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marketing Dashboard</h1>
                    <p className="text-muted-foreground">Track leads, analyze campaign performance, and get AI-powered recommendations.</p>
                </div>
                 <Button>
                    <PlusCircle className="mr-2" />
                    Add New Campaign
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Instagram /> Active Campaigns</CardTitle>
                            <CardDescription>An overview of your current social media marketing campaigns.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Leads</TableHead>
                                        <TableHead>Top Audience</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {placeholderCampaigns.map((campaign) => (
                                        <TableRow key={campaign.id}>
                                            <TableCell>
                                                <div className="font-medium">{campaign.name}</div>
                                                <div className="text-sm text-muted-foreground">{campaign.clicks} Clicks</div>
                                            </TableCell>
                                            <TableCell className="font-bold">{campaign.leads}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">{campaign.gender}</div>
                                                <div className="text-sm text-muted-foreground">{campaign.age} ({campaign.location})</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" className="mr-2"><Edit/></Button>
                                                <Button variant="ghost" size="sm" className="text-destructive"><Trash2/></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bot /> AI Recommendations</CardTitle>
                            <CardDescription>Suggestions from the AI to optimize your marketing efforts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <Alert>
                                <BarChart3 className="h-4 w-4" />
                                <AlertTitle>Optimization Opportunity</AlertTitle>
                                <AlertDescription>
                                    Your "IG Story - Quinceañera Promo" campaign has a high click-through rate but lower lead conversion.
                                    <span className="font-bold"> Recommendation: </span>
                                    Try adding a clearer "Get a Quote" call-to-action in the story.
                                </AlertDescription>
                           </Alert>
                           <Alert>
                                <ArrowUpRight className="h-4 w-4" />
                                <AlertTitle>Audience Insight</AlertTitle>
                                <AlertDescription>
                                    Your TikTok campaigns are reaching a broad national audience. 
                                    <span className="font-bold"> Recommendation: </span>
                                     Create a lookalike audience focused on Central Florida ZIP codes to increase local leads.
                                </AlertDescription>
                           </Alert>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Leads by Location</CardTitle>
                            <CardDescription>Recent inquiries from high-value areas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Potential</TableHead>
                                        <TableHead>Client</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {placeholderLeads.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell className="font-medium">{lead.location}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getPotentialBadge(lead.potential)}>
                                                    {lead.potential}
                                                </Badge>
                                            </TableCell>
                                             <TableCell>
                                                <Link href={`/admin/crm/${lead.id}`} className="hover:underline">{lead.name}</Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
