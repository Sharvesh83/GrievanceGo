import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Users } from "lucide-react";

const LandingPage = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary selection:text-white">
            {/* Navbar */}
            <header className="px-6 py-4 flex items-center justify-between border-b bg-card/50 backdrop-blur-sm fixed w-full z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-2 rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">GrievanceGo</span>
                </div>
                <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                    <a href="#features" className="hover:text-primary transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
                </nav>
                <div className="flex gap-4">
                    {!isAuthenticated && (
                        <Button variant="ghost" onClick={() => loginWithRedirect()}>Login</Button>
                    )}
                    {isAuthenticated && (
                        <Button onClick={() => window.location.href = '/dashboard'}>Go to Dashboard</Button>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-background to-background dark:from-blue-950">
                <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground">
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        Rewriting Civic Engagement
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        Your Voice, <span className="text-primary">Empowered.</span><br />
                        Resolutions, <span className="text-primary">Tracked.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Connect directly with your representatives. Report issues, track progress, and build a better community together.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button size="lg" className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all" onClick={() => loginWithRedirect({ appState: { returnTo: '/dashboard' } })}>
                            <Users className="mr-2 h-5 w-5" />
                            Citizen Login
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg" onClick={() => {
                            // In a real app, we'd check roles after login. For demo:
                            loginWithRedirect({ appState: { returnTo: '/official' } });
                        }}>
                            <ShieldCheck className="mr-2 h-5 w-5" />
                            Official Login
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 px-6 bg-secondary/30">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                    <Card className="bg-card/60 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <CardTitle>Easy Reporting</CardTitle>
                            <CardDescription>File grievances in seconds with our intuitive interface. Attach photos and details effortlessly.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="bg-card/60 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <CardTitle>Real-time Tracking</CardTitle>
                            <CardDescription>Stay updated. Watch your grievance move from "Pending" to "Resolved" in real-time.</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="bg-card/60 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
                            </div>
                            <CardTitle>Official Dashboard</CardTitle>
                            <CardDescription>Dedicated tools for representatives to manage and resolve community issues efficiently.</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
