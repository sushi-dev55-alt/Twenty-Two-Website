import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from "@/components/ui/animated-shader-hero";
import GradientMenu from "@/components/ui/gradient-menu";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FaSearch, FaDownload, FaSteam, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

// GitHub repo constants
const GITHUB_REPO = 'sushi-dev55-alt/sushitools-games-repo-alt';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents`;
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main`;

// Type definitions
interface GameFile {
    name: string;
    appId: string;
    downloadUrl: string;
    size: number;
}

interface SteamAppDetails {
    name: string;
    header_image: string;
    short_description?: string;
}

// Helper to format file size
function formatBytes(bytes: number, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

export default function DashboardPage() {
    const [games, setGames] = useState<GameFile[]>([]);
    const [gameDetails, setGameDetails] = useState<Record<string, SteamAppDetails>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch game list from GitHub
    useEffect(() => {
        async function fetchGames() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(GITHUB_API_URL);
                if (!response.ok) {
                    throw new Error(`Failed to fetch games: ${response.status}`);
                }

                const files = await response.json();

                // Filter for .zip files and extract app IDs
                const gameFiles: GameFile[] = files
                    .filter((f: any) => f.name.endsWith('.zip') && f.type === 'file')
                    .map((f: any) => ({
                        name: f.name,
                        appId: f.name.replace('.zip', ''),
                        downloadUrl: `${GITHUB_RAW_BASE}/${f.name}`,
                        size: f.size
                    }));

                setGames(gameFiles);
            } catch (err: any) {
                setError(err.message || 'Failed to load games');
            } finally {
                setLoading(false);
            }
        }

        fetchGames();
    }, []);

    // Fetch Steam details for visible games (lazy load)
    useEffect(() => {
        async function fetchSteamDetails(appId: string) {
            // Only fetch if we don't already have it
            if (gameDetails[appId]) return;

            try {
                // Use a CORS proxy or Steam API directly (may have CORS issues in browser)
                // For now, we'll use a simple placeholder approach
                // In production, you'd want a backend proxy
                const steamImageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

                setGameDetails(prev => ({
                    ...prev,
                    [appId]: {
                        name: `App ${appId}`,
                        header_image: steamImageUrl,
                        short_description: 'Steam Game'
                    }
                }));
            } catch (err) {
                console.error(`Failed to fetch Steam details for ${appId}`, err);
            }
        }

        // Fetch details for first 20 games on load
        games.slice(0, 20).forEach(game => {
            fetchSteamDetails(game.appId);
        });
    }, [games]);

    // Filter games based on search
    const filteredGames = useMemo(() => {
        if (!searchQuery) return games.slice(0, 50); // Show first 50 by default

        const query = searchQuery.toLowerCase();
        return games.filter(game =>
            game.appId.includes(query) ||
            (gameDetails[game.appId]?.name?.toLowerCase().includes(query))
        ).slice(0, 100); // Cap at 100 results
    }, [games, searchQuery, gameDetails]);

    return (
        <Hero
            headline={{ line1: "Discover", line2: "Games" }}
            subtitle="Search and download games from our repository."
            navContent={<GradientMenu />}
            className="overflow-hidden"
        >
            <div className="w-full max-w-7xl mx-auto px-4 pb-20 flex flex-col items-center">

                {/* Search Bar */}
                <div className="w-full max-w-2xl backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-4 mb-8 shadow-2xl shadow-black/50 z-20">
                    <div className="relative w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
                        <input
                            type="text"
                            placeholder="Search by App ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all font-light"
                        />
                    </div>
                    <div className="mt-3 text-xs text-white/40 text-center">
                        {loading ? 'Loading...' : `${games.length.toLocaleString()} games available`}
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="w-full max-w-lg bg-red-500/20 border border-red-500/50 text-red-400 rounded-2xl p-6 mb-8 text-center flex items-center justify-center gap-3">
                        <FaExclamationTriangle className="text-xl" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <FaSpinner className="animate-spin text-4xl text-cyan-500" />
                    </div>
                )}

                {/* Games Grid */}
                {!loading && !error && (
                    <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full relative z-10">
                        <AnimatePresence>
                            {filteredGames.map((game) => (
                                <motion.div
                                    layout
                                    key={game.appId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="group relative bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)] flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="aspect-[16/7] relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 opacity-60" />
                                        <img
                                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`}
                                            alt={`App ${game.appId}`}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                            onError={(e) => {
                                                // Fallback gradient if image fails
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                        {/* Steam Badge */}
                                        <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-md">
                                            <FaSteam className="text-white/80 text-xs" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-3 flex flex-col flex-1 relative z-20">
                                        <h3 className="text-sm font-semibold text-white leading-tight group-hover:text-cyan-400 transition-colors truncate">
                                            {game.appId}
                                        </h3>

                                        <p className="text-[10px] text-white/40 mt-1">
                                            {formatBytes(game.size)}
                                        </p>

                                        <div className="mt-auto pt-3">
                                            <MagneticButton className="w-full">
                                                <a
                                                    href={game.downloadUrl}
                                                    download
                                                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-2 rounded-lg text-xs transition-all shadow-lg shadow-cyan-900/20"
                                                >
                                                    <FaDownload className="text-[10px]" />
                                                    <span>Download</span>
                                                </a>
                                            </MagneticButton>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* No Results */}
                {!loading && !error && filteredGames.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-xl text-white/30 font-light">No games found matching "{searchQuery}"</p>
                    </motion.div>
                )}

            </div>
        </Hero>
    );
}
