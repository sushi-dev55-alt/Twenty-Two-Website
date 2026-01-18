import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from "@/components/ui/animated-shader-hero";
import GradientMenu from "@/components/ui/gradient-menu";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FaPlus, FaSearch, FaDownload, FaSteam, FaTimes } from 'react-icons/fa';
import { cn } from "@/lib/utils";

// Mock data for discovery
const DISCOVER_GAMES = [
    {
        id: '730',
        title: 'Counter-Strike 2',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
        description: 'For over two decades, Counter-Strike has offered an elite competitive experience.',
        size: '30 GB'
    },
    {
        id: '570',
        title: 'Dota 2',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
        description: 'Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes.',
        size: '15 GB'
    },
    {
        id: '440',
        title: 'Team Fortress 2',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/440/header.jpg',
        description: 'Nine distinct classes provide a broad range of tactical abilities and personalities.',
        size: '24 GB'
    },
    {
        id: '252490',
        title: 'Rust',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg',
        description: 'The only aim in Rust is to survive. Everything wants you to die.',
        size: '10 GB'
    },
    {
        id: '271590',
        title: 'Grand Theft Auto V',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
        description: 'Explore the stunning world of Los Santos and Blaine County.',
        size: '110 GB'
    },
    {
        id: '1172470',
        title: 'Apex Legends',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
        description: 'Master your character\'s abilities and make strategic calls as the squad.',
        size: '60 GB'
    },
    {
        id: '1085660',
        title: 'Destiny 2',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg',
        description: 'Dive into the world of Destiny 2 to explore the mysteries of the solar system.',
        size: '100 GB'
    },
    {
        id: '1938090',
        title: 'Call of Duty®',
        image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1938090/header.jpg',
        description: 'Welcome to Call of Duty® HQ, the home of Call of Duty®: Modern Warfare® III.',
        size: '150 GB'
    }
];

export default function DashboardPage() {
    const [appId, setAppId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    const filteredGames = useMemo(() => {
        return DISCOVER_GAMES.filter(game =>
            game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.id.includes(searchQuery)
        );
    }, [searchQuery]);

    const handleAddApp = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Adding App ID:', appId);
        setAppId('');
        setIsAddOpen(false); // Close after adding
    };

    return (
        <Hero
            headline={{ line1: "Discover", line2: "Games" }}
            subtitle="Browse the library or add your own Steam App ID."
            navContent={<GradientMenu />}
            className="overflow-hidden" // Prevent scrollbar flicker during anims
        >
            <div className="w-full max-w-7xl mx-auto px-4 pb-20 flex flex-col items-center">

                {/* Control Bar */}
                <div className="w-full max-w-4xl backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4 mb-12 flex flex-col md:flex-row items-center gap-4 shadow-2xl shadow-black/50 z-20">

                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
                        <input
                            type="text"
                            placeholder="Search games by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-light"
                        />
                    </div>

                    {/* Toggle Add ID */}
                    <MagneticButton>
                        <button
                            onClick={() => setIsAddOpen(!isAddOpen)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 border",
                                isAddOpen
                                    ? "bg-rose-500/20 text-rose-400 border-rose-500/50"
                                    : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {isAddOpen ? <FaTimes /> : <FaPlus />}
                            <span>Add ID</span>
                        </button>
                    </MagneticButton>
                </div>

                {/* Collapsible Add ID Section */}
                <AnimatePresence>
                    {isAddOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginBottom: 48 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="w-full max-w-lg overflow-hidden"
                        >
                            <form onSubmit={handleAddApp} className="p-6 bg-zinc-900/80 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col gap-4">
                                <h3 className="text-white font-semibold text-lg">Add Custom Game</h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Steam App ID (e.g., 730)"
                                        value={appId}
                                        onChange={(e) => setAppId(e.target.value)}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 rounded-lg transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <p className="text-xs text-white/40">Enter the numeric ID from the Steam store URL.</p>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Games Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full relative z-10">
                    <AnimatePresence>
                        {filteredGames.map((game) => (
                            <motion.div
                                layout
                                key={game.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)] flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="aspect-[16/9] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 opacity-60" />
                                    <img
                                        src={game.image}
                                        alt={game.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    {/* Badges/Tags */}
                                    <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md text-[10px] uppercase font-bold text-white/80 tracking-wider">
                                        Steam
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1 relative z-20">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-cyan-400 transition-colors">
                                            {game.title}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-gray-400 line-clamp-2 mb-4 font-light">
                                        {game.description}
                                    </p>

                                    <div className="mt-auto pt-4 flex gap-3">
                                        {/* Download Button */}
                                        <MagneticButton className="flex-1">
                                            <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-cyan-900/20">
                                                <FaDownload />
                                                <span>Download</span>
                                            </button>
                                        </MagneticButton>

                                        {/* Add/Size Button (Secondary) */}
                                        <button className="flex items-center justify-center w-12 h-auto bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white" title="View Details">
                                            <FaPlus />
                                        </button>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-white/30">
                                        <span>ID: {game.id}</span>
                                        <span>{game.size}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredGames.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-2xl text-white/30 font-light">No games found matching "{searchQuery}"</p>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="mt-4 text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                        >
                            Add custom App ID?
                        </button>
                    </motion.div>
                )}

            </div>
        </Hero>
    );
}
