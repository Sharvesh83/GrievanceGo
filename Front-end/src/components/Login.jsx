import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, Lock, ArrowRight, User } from "lucide-react";
import api from "@/api/axios";

const Login = () => {
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/login', { email, password });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            navigate('/dashboard');
        } catch (err) {
            console.error("Login failed", err);
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 bg-slate-50 relative overflow-hidden text-slate-900 flex items-center justify-center p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            </div>

            <Card className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/60 shadow-2xl relative z-10">
                <CardHeader className="space-y-1 text-center pb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-blue-500/30">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                    <CardDescription className="text-slate-500 text-base">
                        Enter your credentials to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    className="pl-10 h-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-10 h-10 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-blue-900/10 h-11 text-base">
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full h-11 border-slate-200 hover:bg-slate-50 hover:text-slate-900 relative"
                            onClick={() => loginWithRedirect()}
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2 absolute left-4" alt="Google" />
                            Continue with Google
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm pt-4">
                    <p className="text-slate-500">
                        Don't have an account?{' '}
                        <span className="text-blue-600 hover:underline font-semibold cursor-pointer" onClick={() => navigate('/signup')}>
                            Sign up
                        </span>
                    </p>
                    <p className="text-slate-400 text-xs mt-4">
                        <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate('/')}>Back to Home</span>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
