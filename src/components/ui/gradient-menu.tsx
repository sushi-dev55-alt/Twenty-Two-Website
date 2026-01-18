import React from 'react';
import { Link } from 'react-router-dom';
import { FaDiscord, FaInfoCircle, FaHome, FaGamepad } from 'react-icons/fa'; // Added FaHome

const menuItems = [
    {
        title: 'Home',
        icon: <FaHome />,
        gradientFrom: '#a955ff',
        gradientTo: '#ea51ff',
        to: '/',
        type: 'internal'
    },
    {
        title: 'Dashboard',
        icon: <FaGamepad />,
        gradientFrom: '#06b6d4', // Cyan
        gradientTo: '#3b82f6',   // Blue
        to: '/dashboard',
        type: 'internal'
    },
    {
        title: 'Discord',
        icon: <FaDiscord />,
        gradientFrom: '#5865F2', // Discord Blue
        gradientTo: '#7289da',
        href: 'https://discord.gg/JTS7wgQXCb',
        type: 'external'
    },
    {
        title: 'Credits',
        icon: <FaInfoCircle />,
        gradientFrom: '#FF9966',
        gradientTo: '#FF5E62',
        to: '/credits',
        type: 'internal'
    }
];

export default function GradientMenu() {
    return (
        <div className="flex justify-center items-center py-4 bg-transparent z-[100] relative">
            <ul className="flex gap-6 p-2 rounded-full border border-white/5 bg-black/20 backdrop-blur-sm">
                {menuItems.map((item, idx) => {
                    const content = (
                        <li
                            style={{ '--gradient-from': item.gradientFrom, '--gradient-to': item.gradientTo } as React.CSSProperties}
                            className="relative w-[50px] h-[50px] bg-zinc-900/50 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:w-[140px] group cursor-pointer border border-white/10 hover:border-white/20"
                        >
                            {/* Gradient background on hover */}
                            <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-300 group-hover:opacity-100"></span>

                            {/* Icon - Removed absolute positioning to prevent clipping issue */}
                            <span className="relative z-10 transition-all duration-300 group-hover:scale-0 delay-0 group-hover:opacity-0 flex items-center justify-center w-full h-full">
                                <span className="text-xl text-white/90">{item.icon}</span>
                            </span>

                            {/* Title */}
                            <span className="absolute z-20 text-white uppercase tracking-wider text-xs font-bold transition-all duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                {item.title}
                            </span>
                        </li>
                    );

                    if (item.type === 'internal') {
                        return (
                            <Link key={idx} to={item.to!}>
                                {content}
                            </Link>
                        );
                    } else {
                        return (
                            <a
                                key={idx}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {content}
                            </a>
                        );
                    }
                })}
            </ul>
        </div>
    );
}
