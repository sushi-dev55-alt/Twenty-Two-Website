import Hero from "@/components/ui/animated-shader-hero";
import { ManifestGenerator } from "@/components/ui/manifest-generator";
import GradientMenu from "@/components/ui/gradient-menu";

export default function HomePage() {
    return (
        <Hero
            headline={{
                line1: "Twenty Two",
                line2: "Cloud"
            }}
            subtitle="The best website manifest gen ever built."
            navContent={<GradientMenu />}
        >
            <ManifestGenerator />
        </Hero>
    );
}
