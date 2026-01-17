import Hero from "@/components/ui/animated-shader-hero";
import GradientMenu from "@/components/ui/gradient-menu";
import { AnimatedProfileCard, ProfileCardContent } from "@/components/ui/animated-profile-card";

export default function CreditsPage() {
    const sushiData = {
        name: "Sushi",
        location: "Website Builder Partner",
        bio: "Building the best tools for the community.",
        avatarSrc: "https://github.com/sushi-dev55/Sushi-Launcher/blob/main/9e37f905d09779a7ca55cfb58bb696dd.webp?raw=true",
        avatarFallback: "SU",
        socials: []
    };

    const twentyTwoData = {
        name: "Twenty Two",
        location: "Founder of Twenty Two Cloud",
        bio: "API keys and manifest database management.",
        avatarSrc: "https://github.com/sushi-dev55/Sushi-Launcher/blob/main/6eefa56fddb29c4bcd81fb692fd2f82b.webp?raw=true",
        avatarFallback: "TT",
        socials: []
    };

    return (
        <Hero
            headline={{
                line1: "Credits",
                line2: "Team"
            }}
            subtitle="The minds behind the project."
            navContent={<GradientMenu />}
        >
            <div className="w-full flex flex-col items-center justify-center gap-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 place-items-center">
                    {/* Sushi Card - Pink Theme */}
                    <div className="group/card relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-[2rem] opacity-75 blur-xl group-hover/card:opacity-100 transition duration-500"></div>
                        <AnimatedProfileCard
                            accentColor="#ec4899" // pink-500
                            onAccentForegroundColor="#ffffff"
                            onAccentMutedForegroundColor="rgba(255, 255, 255, 0.9)"
                            className="relative bg-black"
                            baseCard={
                                <ProfileCardContent
                                    {...sushiData}
                                    variant="default"
                                    className="bg-zinc-950/90 border-zinc-800"
                                    descriptionClassName="text-pink-300"
                                />
                            }
                            overlayCard={
                                <ProfileCardContent
                                    {...sushiData}
                                    variant="on-accent"
                                    showAvatar={true}
                                    cardStyle={{
                                        background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
                                    }}
                                />
                            }
                        />
                    </div>

                    {/* Twenty Two Card - Red Theme */}
                    <div className="group/card relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-[2rem] opacity-75 blur-xl group-hover/card:opacity-100 transition duration-500"></div>
                        <AnimatedProfileCard
                            accentColor="#dc2626" // red-600
                            onAccentForegroundColor="#ffffff"
                            onAccentMutedForegroundColor="rgba(255, 255, 255, 0.9)"
                            className="relative bg-black"
                            baseCard={
                                <ProfileCardContent
                                    {...twentyTwoData}
                                    variant="default"
                                    className="bg-zinc-950/90 border-zinc-800"
                                    descriptionClassName="text-red-300"
                                />
                            }
                            overlayCard={
                                <ProfileCardContent
                                    {...twentyTwoData}
                                    variant="on-accent"
                                    showAvatar={true}
                                    cardStyle={{
                                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                    }}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
        </Hero>
    );
}
