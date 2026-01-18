import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from "@/components/ui/animated-shader-hero";
import GradientMenu from "@/components/ui/gradient-menu";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FaSearch, FaDownload, FaSteam, FaSpinner, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaTimes, FaWindows, FaApple, FaLinux } from 'react-icons/fa';

// GitHub repo constants
const GITHUB_REPO = 'sushi-dev55-alt/sushitools-games-repo-alt';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents`;
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main`;

// Steam API proxy (using a public CORS proxy for demo - in production use your own backend)
const STEAM_STORE_API = 'https://store.steampowered.com/api/appdetails';

// Items per page
const ITEMS_PER_PAGE = 24;

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
    short_description: string;
    detailed_description?: string;
    about_the_game?: string;
    screenshots?: Array<{ path_thumbnail: string; path_full: string }>;
    pc_requirements?: { minimum?: string; recommended?: string };
    mac_requirements?: { minimum?: string; recommended?: string };
    linux_requirements?: { minimum?: string; recommended?: string };
    platforms?: { windows: boolean; mac: boolean; linux: boolean };
    genres?: Array<{ description: string }>;
    developers?: string[];
    publishers?: string[];
    release_date?: { date: string };
}

// Helper to format file size
function formatBytes(bytes: number, decimals = 1) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// Strip HTML tags helper
function stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

export default function DashboardPage() {
    const [games, setGames] = useState<GameFile[]>([]);
    const [gameDetails, setGameDetails] = useState<Record<string, SteamAppDetails | null>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGame, setSelectedGame] = useState<GameFile | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

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

                const gameFiles: GameFile[] = files
                    .filter((f: { name: string; type: string }) => f.name.endsWith('.zip') && f.type === 'file')
                    .map((f: { name: string; size: number }) => ({
                        name: f.name,
                        appId: f.name.replace('.zip', ''),
                        downloadUrl: `${GITHUB_RAW_BASE}/${f.name}`,
                        size: f.size
                    }));

                setGames(gameFiles);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load games');
            } finally {
                setLoading(false);
            }
        }

        fetchGames();
    }, []);

    // Fetch Steam details for a specific game
    async function fetchSteamDetails(appId: string) {
        if (gameDetails[appId] !== undefined) return gameDetails[appId];

        try {
            // Note: Steam API has CORS restrictions, so we use images directly
            // For full details, you'd need a backend proxy
            const steamImageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

            // Create minimal details from what we can access
            const details: SteamAppDetails = {
                name: `Steam App ${appId}`,
                header_image: steamImageUrl,
                short_description: 'Loading game details...',
                screenshots: Array.from({ length: 4 }, (_, i) => ({
                    path_thumbnail: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/ss_${i}.jpg`,
                    path_full: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/ss_${i}.jpg`
                }))
            };

            setGameDetails(prev => ({ ...prev, [appId]: details }));
            return details;
        } catch (err) {
            console.error(`Failed to fetch Steam details for ${appId}`, err);
            setGameDetails(prev => ({ ...prev, [appId]: null }));
            return null;
        }
    }

    // Handle game click
    async function handleGameClick(game: GameFile) {
        setSelectedGame(game);
        setLoadingDetails(true);
        await fetchSteamDetails(game.appId);
        setLoadingDetails(false);
    }

    // Filter games based on search
    const filteredGames = useMemo(() => {
        if (!searchQuery) return games;

        const query = searchQuery.toLowerCase();
        return games.filter(game =>
            game.appId.includes(query) ||
            (gameDetails[game.appId]?.name?.toLowerCase().includes(query))
        );
    }, [games, searchQuery, gameDetails]);

    // Pagination
    const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
    const paginatedGames = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredGames.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredGames, currentPage]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const details = selectedGame ? gameDetails[selectedGame.appId] : null;

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
                            placeholder="Search by App ID or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all font-light"
                        />
                    </div>
                    <div className="mt-3 text-xs text-white/40 text-center">
                        {loading ? 'Loading...' : `${filteredGames.length.toLocaleString()} games found`}
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
                        <FaSpinner className="animate-spin text-4xl text-rose-500" />
                    </div>
                )}

                {/* Games Grid */}
                {!loading && !error && (
                    <>
                        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 w-full relative z-10">
                            <AnimatePresence>
                                {paginatedGames.map((game) => (
                                    <motion.div
                                        layout
                                        key={game.appId}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => handleGameClick(game)}
                                        className="group relative bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-rose-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(244,63,94,0.15)] flex flex-col cursor-pointer"
                                    >
                                        {/* Image Container */}
                                        <div className="aspect-[16/7] relative overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 opacity-60" />
                                            <img
                                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appId}/header.jpg`}
                                                alt={`App ${game.appId}`}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md border border-white/10 p-1.5 rounded-md">
                                                <FaSteam className="text-white/80 text-xs" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 flex flex-col flex-1 relative z-20">
                                            <h3 className="text-sm font-semibold text-white leading-tight group-hover:text-rose-400 transition-colors truncate">
                                                {gameDetails[game.appId]?.name || `App ${game.appId}`}
                                            </h3>
                                            <p className="text-[10px] text-white/40 mt-1">
                                                ID: {game.appId} • {formatBytes(game.size)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-10">
                                <MagneticButton>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                                    >
                                        <FaChevronLeft className="text-xs" />
                                        <span>Previous</span>
                                    </button>
                                </MagneticButton>

                                <span className="text-white/60 text-sm">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <MagneticButton>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                                    >
                                        <span>Next</span>
                                        <FaChevronRight className="text-xs" />
                                    </button>
                                </MagneticButton>
                            </div>
                        )}
                    </>
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

            {/* Game Detail Modal */}
            <AnimatePresence>
                {selectedGame && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedGame(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedGame(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all"
                            >
                                <FaTimes />
                            </button>

                            {loadingDetails ? (
                                <div className="flex items-center justify-center py-32">
                                    <FaSpinner className="animate-spin text-4xl text-rose-500" />
                                </div>
                            ) : (
                                <>
                                    {/* Header Image */}
                                    <div className="relative aspect-video">
                                        <img
                                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedGame.appId}/header.jpg`}
                                            alt={details?.name || selectedGame.appId}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 -mt-20 relative z-10">
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {details?.name || `App ${selectedGame.appId}`}
                                        </h2>

                                        <p className="text-white/60 text-sm mb-6">
                                            App ID: {selectedGame.appId} • File Size: {formatBytes(selectedGame.size)}
                                        </p>

                                        {/* Download Button */}
                                        <MagneticButton className="mb-8">
                                            <a
                                                href={selectedGame.downloadUrl}
                                                download
                                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-rose-900/30"
                                            >
                                                <FaDownload />
                                                <span>Download</span>
                                            </a>
                                        </MagneticButton>

                                        {/* Screenshots */}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-white mb-4">Screenshots</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                                    <img
                                                        key={i}
                                                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${selectedGame.appId}/ss_${['1', '2', '3', '4', '5', '6'][i]}.jpg`}
                                                        alt={`Screenshot ${i + 1}`}
                                                        className="w-full aspect-video object-cover rounded-lg bg-zinc-800"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* About */}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold text-white mb-4">About</h3>
                                            <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                                                <p className="text-white/70 text-sm leading-relaxed">
                                                    This game is available for download from our repository. Click the download button above to get the game files.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Requirements */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-4">System Requirements</h3>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 text-white/80 font-medium mb-3">
                                                        <FaWindows />
                                                        <span>Minimum</span>
                                                    </div>
                                                    <ul className="text-white/50 text-xs space-y-1">
                                                        <li>• OS: Windows 7/8/10</li>
                                                        <li>• Processor: Intel Core i3 or equivalent</li>
                                                        <li>• Memory: 4 GB RAM</li>
                                                        <li>• Graphics: DirectX 10 compatible</li>
                                                        <li>• Storage: 2 GB available space</li>
                                                    </ul>
                                                </div>
                                                <div className="bg-black/30 border border-white/5 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 text-white/80 font-medium mb-3">
                                                        <FaWindows />
                                                        <span>Recommended</span>
                                                    </div>
                                                    <ul className="text-white/50 text-xs space-y-1">
                                                        <li>• OS: Windows 10</li>
                                                        <li>• Processor: Intel Core i5 or better</li>
                                                        <li>• Memory: 8 GB RAM</li>
                                                        <li>• Graphics: DirectX 11 compatible</li>
                                                        <li>• Storage: 4 GB available space</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Hero>
    );
}
