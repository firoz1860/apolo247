"use client";

import IntroAnimation from "@/components/ui/scroll-morph-hero";

// Demo route for the scroll-morph-hero component.
// Visit /scroll-morph-hero-demo to preview it. Safe to delete if not needed.
export default function ScrollMorphHeroDemo() {
    return (
        <div className="mx-auto w-full max-w-6xl p-6">
            <div className="relative h-[800px] w-full overflow-hidden rounded-lg border">
                <IntroAnimation />
            </div>
        </div>
    );
}
