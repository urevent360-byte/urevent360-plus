
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, addDays, getWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

type EventStatus = 'planning' | 'active' | 'completed' | 'on-hold' | 'booked';

type Project = {
    id: string;
    clientName: string;
    eventName: string;
    eventDate: Date;
    status: EventStatus;
    services: string[];
    team: string[]; // Placeholder for team members assigned
};

// Updated placeholder data for projects
const placeholderProjects: Project[] = [
    { id: 'evt-123', clientName: 'John Doe', eventName: "John's Quinceañera", eventDate: new Date('2024-10-15'), status: 'planning', services: ['360 Photo Booth', 'Cold Sparklers'], team: ['Alex', 'Maria'] },
    { id: 'evt-456', clientName: 'David Lee', eventName: "Lee Corporate Gala", eventDate: new Date('2024-07-20'), status: 'completed', services: ['Magic Mirror'], team: ['Alex'] },
    { id: 'evt-789', clientName: 'Jane Smith', eventName: "Smith Wedding", eventDate: new Date('2024-11-01'), status: 'booked', services: ['Photo Booth Printer'], team: ['Carlos'] },
    { id: 'evt-test-this-week', clientName: 'Test Client', eventName: "Weekly Test Event", eventDate: addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2), status: 'active', services: ['Projector'], team: ['Maria'] },
];


const allServices = [...new Set(placeholderProjects.flatMap(p => p.services))];
const allStatuses: EventStatus[] = ['planning', 'active', 'completed', 'on-hold', 'booked'];
const allTeamMembers = [...new Set(placeholderProjects.flatMap(p => p.team))];

export default function ProjectsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filters, setFilters] = useState({
        status: 'all',
        service: 'all',
        team: 'all',
    });

    const handleFilterChange = (filterName: keyof typeof filters) => (value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const weekStartsOn = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStartsOn, i));

    const filteredProjects = placeholderProjects.filter(project => {
        const statusMatch = filters.status === 'all' || project.status === filters.status;
        const serviceMatch = filters.service === 'all' || project.services.includes(filters.service);
        const teamMatch = filters.team === 'all' || project.team.includes(filters.team);
        return statusMatch && serviceMatch && teamMatch;
    });

    const projectsByDay: Record<string, Project[]> = {};
    weekDates.forEach(date => {
        const dateString = format(date, 'yyyy-MM-dd');
        projectsByDay[dateString] = filteredProjects.filter(p => isSameDay(p.eventDate, date));
    });

    const totalProjectsThisWeek = Object.values(projectsByDay).reduce((acc, dayProjects) => acc + dayProjects.length, 0);

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects (Weekly View)</h1>
                    <p className="text-muted-foreground">A weekly, chronological list of projects.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, -7))}><ChevronLeft /></Button>
                    <div className="text-center">
                        <div className="font-semibold">{format(weekStartsOn, 'MMM d')} - {format(addDays(weekStartsOn, 6), 'd, yyyy')}</div>
                        <div className="text-sm text-muted-foreground">Week {getWeek(currentDate)}</div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 7))}><ChevronRight /></Button>
                </div>
            </div>

            <Card className="mb-8">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Filter projects by status, service, or team member.</CardDescription>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 md:pt-0">
                        <Select onValueChange={handleFilterChange('status')} value={filters.status}>
                            <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {allStatuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={handleFilterChange('service')} value={filters.service}>
                            <SelectTrigger><SelectValue placeholder="Filter by Service" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Services</SelectItem>
                                {allServices.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select onValueChange={handleFilterChange('team')} value={filters.team}>
                            <SelectTrigger><SelectValue placeholder="Filter by Team" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Team Members</SelectItem>
                                {allTeamMembers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Week Overview</CardTitle>
                    <CardDescription>
                        Displaying {totalProjectsThisWeek} project(s) for the selected week that match your filters.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {weekDates.map(date => {
                        const dateString = format(date, 'yyyy-MM-dd');
                        const dayProjects = projectsByDay[dateString];
                        
                        return (
                            <div key={dateString}>
                                <h3 className="font-semibold text-lg mb-2 border-b pb-1">{format(date, 'EEEE, MMMM d')}</h3>
                                {dayProjects.length > 0 ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {dayProjects.map(project => (
                                            <Card key={project.id}>
                                                <CardHeader>
                                                    <CardTitle className="text-base truncate">{project.eventName}</CardTitle>
                                                    <CardDescription>{project.clientName}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <Badge variant="outline" className="capitalize">{project.status.replace('_', ' ')}</Badge>
                                                    <div className="text-sm space-y-1">
                                                        <p className="font-medium">Services:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {project.services.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm space-y-1">
                                                        <p className="font-medium">Team:</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {project.team.map(t => <Badge key={t} variant="secondary" className="bg-blue-100 text-blue-800">{t}</Badge>)}
                                                        </div>
                                                    </div>
                                                    <Button asChild variant="link" className="p-0 h-auto">
                                                        <Link href={`/admin/events/${project.id}`}>View Project Details</Link>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No projects scheduled for this day.</p>
                                )}
                            </div>
                        )
                    })}
                     {totalProjectsThisWeek === 0 && (
                        <p className="text-muted-foreground text-center py-12">No projects scheduled for this week match the current filters.</p>
                     )}
                </CardContent>
            </Card>
        </div>
    );
}

    