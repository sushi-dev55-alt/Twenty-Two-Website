import React, { useState } from 'react';
import Hero from "@/components/ui/animated-shader-hero";
import GradientMenu from "@/components/ui/gradient-menu";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaPlus, FaSearch } from 'react-icons/fa';

// Mock data for discovery
const DISCOVER_GAMES = [
    {
        id: '730',
        title: 'Counter-Strike 2',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
        description: 'Tactical shooter'
    },
    {
        id: '570',
        title: 'Dota 2',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
        description: 'Action RTS'
    },
    {
        id: '440',
        title: 'Team Fortress 2',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg',
        description: 'Class-based shooter'
    },
    {
        id: '252490',
        title: 'Rust',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg',
        description: 'Survival game'
    }
];

export default function DashboardPage() {
    const [appId, setAppId] = useState('');

    const handleAddApp = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement add logic
        console.log('Adding App ID:', appId);
        setAppId('');
    };

    return (
        <Hero
            headline={{
                line1: "Game",
                line2: "Dashboard"
            }}
            subtitle="Discover new games or add your own."
            navContent={<GradientMenu />}
        >
            <div className="w-full max-w-6xl mx-auto px-4 space-y-12">

                {/* Add App ID Section */}
                <div className="w-full max-w-xl mx-auto">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-white">Add App ID</CardTitle>
                            <CardDescription className="text-white/60">
                                Enter the Steam App ID of the game you want to add.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddApp} className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="App ID (e.g., 730)"
                                    value={appId}
                                    onChange={(e) => setAppId(e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                                <MagneticButton>
                                    <button
                                        type="submit"
                                        className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <FaPlus /> Add
                                    </button>
                                </MagneticButton>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Discover Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Discover
                        </h2>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search games..."
                                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 w-64"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {DISCOVER_GAMES.map((game) => (
                            <Card key={game.id} className="bg-zinc-900/40 border-white/5 backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-300 group">
                                <div className="aspect-video relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <img
                                        src={game.image}
                                        alt={game.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <CardHeader className="relative z-20 -mt-12">
                                    <CardTitle className="text-white text-lg">{game.title}</CardTitle>
                                    <CardDescription className="text-white/70">{game.description}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <MagneticButton>
                                        <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-md py-2 px-4 text-sm font-medium transition-colors backdrop-blur-md">
                                            Add Game
                                        </button>
                                    </MagneticButton>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>

            </div>
        </Hero>
    );
}
