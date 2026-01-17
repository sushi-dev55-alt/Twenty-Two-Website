import React, { useState } from "react";
import { ArrowUp, Download, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

// Configuration
const CONFIG = {
    GITHUB_REPO_URL: "https://github.com/sushi-dev55-alt/sushitools-games-repo-alt/raw/main",
    // Using corsproxy.io for better reliability with Steam API
    STEAM_API_URL: "https://corsproxy.io/?https://store.steampowered.com/api/appdetails?appids=",
};

// Types
interface SteamGameData {
    name: string;
    detailed_description: string;
    short_description: string;
    header_image: string;
    genres: { id: string; description: string }[];
    screenshots: { id: number; path_thumbnail: string; path_full: string }[];
}

interface LogEntry {
    id: string;
    message: string;
    status: "pending" | "success" | "error";
}

// Utility for merging classes
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

export const ManifestGenerator: React.FC = () => {
    const [appId, setAppId] = useState("");
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [gameData, setGameData] = useState<SteamGameData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addLog = (message: string, status: "pending" | "success" | "error" = "pending") => {
        const id = Math.random().toString(36).substr(2, 9);
        setLogs(prev => [...prev, { id, message, status }]);
        return id;
    };

    const updateLog = (id: string, status: "success" | "error") => {
        setLogs(prev => prev.map(log => log.id === id ? { ...log, status } : log));
    };

    const handleFetch = async () => {
        if (!appId.trim()) return;

        setIsLoading(true);
        setLogs([]);
        setGameData(null);
        setError(null);

        try {
            // Step 1: Steam API
            const log1 = addLog("Connecting to Steam API...");

            const response = await fetch(`${CONFIG.STEAM_API_URL}${appId}`);

            if (!response.ok) {
                throw new Error(`Steam API responded with status: ${response.status}`);
            }

            const data = await response.json();

            // Check if data exists for this AppID
            if (!data || !data[appId] || !data[appId].success) {
                throw new Error(`Game not found or invalid App ID (${appId})`);
            }

            updateLog(log1, "success");

            const gameRaw = data[appId].data;
            const game: SteamGameData = {
                name: gameRaw.name,
                detailed_description: gameRaw.detailed_description,
                short_description: gameRaw.short_description,
                header_image: gameRaw.header_image,
                genres: gameRaw.genres || [],
                screenshots: gameRaw.screenshots || [],
            };

            // Step 2: GitHub (Simulated check)
            const log2 = addLog("Connecting to GitHub Repository...");
            await new Promise(r => setTimeout(r, 600)); // Keep a small delay for UX

            updateLog(log2, "success");

            setGameData(game);

        } catch (err) {
            console.error("Fetch Error:", err);
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch game data";
            setError(errorMessage);
            if (logs.length > 0) {
                updateLog(logs[logs.length - 1].id, "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading) {
            handleFetch();
        }
    };

    const downloadUrl = `${CONFIG.GITHUB_REPO_URL}/${appId}.zip`;

    return (
        <div className="w-full max-w-xl mx-auto font-sans">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative flex items-center bg-[#1F2023] border border-[#333333] rounded-3xl p-2 shadow-2xl">
                    <input
                        type="text"
                        value={appId}
                        onChange={(e) => setAppId(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Steam App ID..."
                        disabled={isLoading}
                        className="flex-1 bg-transparent border-none text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-0 text-lg font-medium"
                    />
                    <button
                        onClick={handleFetch}
                        disabled={isLoading || !appId}
                        className="p-3 bg-white hover:bg-gray-200 text-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowUp className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Logs Area */}
            <div className="mt-6 space-y-2 px-2">
                <AnimatePresence mode="popLayout">
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 text-sm text-gray-400"
                        >
                            {log.status === "pending" && <Loader2 className="w-3 h-3 animate-spin text-blue-400" />}
                            {log.status === "success" && <CheckCircle className="w-3 h-3 text-green-500" />}
                            {log.status === "error" && <AlertCircle className="w-3 h-3 text-red-500" />}
                            <span className={cn(
                                log.status === "success" && "text-green-500/80",
                                log.status === "error" && "test-red-500/80"
                            )}>
                                {log.message}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Game Card */}
            <AnimatePresence>
                {gameData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="mt-8 bg-[#1F2023]/90 backdrop-blur-xl border border-[#333333] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="relative h-48 w-full">
                            <img
                                src={gameData.header_image}
                                alt={gameData.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2023] to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{gameData.name}</h2>
                                <div className="flex gap-2">
                                    {gameData.genres.map((g) => (
                                        <span key={g.id} className="text-xs font-mono bg-white/10 text-white px-2 py-1 rounded-full backdrop-blur-md">
                                            {g.description}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300/90 line-clamp-4" dangerouslySetInnerHTML={{ __html: gameData.short_description }} />

                            <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                                {gameData.screenshots.slice(0, 4).map(s => (
                                    <img key={s.id} src={s.path_thumbnail} className="h-20 rounded-lg border border-white/10" alt="screenshot" />
                                ))}
                            </div>

                            <div className="flex justify-center w-full pt-2">
                                <MagneticButton distance={0.5}>
                                    <a
                                        href={downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative group/btn flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-br from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold rounded-full transition-all shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_-5px_rgba(220,38,38,0.7)] overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <Download className="w-5 h-5 relative z-10 group-hover/btn:animate-bounce" />
                                        <span className="relative z-10">Download Manifest</span>
                                    </a>
                                </MagneticButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-2xl text-red-200 text-sm text-center"
                >
                    {error}
                </motion.div>
            )}
        </div>
    );
};
