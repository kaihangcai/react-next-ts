"use client"

import { HeroClasses } from "@/models/darkest";

interface HeroSelectorProps {
    selected: HeroClasses[];
    onChange: (heroes: HeroClasses[]) => void;
    maxSelectable?: number;
}

const heroEntries = (
    Object.entries(HeroClasses).filter(([, v]) => typeof v === "number")
) as [string, HeroClasses][];

const formatHeroName = (key: string) =>
    key.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

const HeroSelector: React.FC<HeroSelectorProps> = ({ selected, onChange, maxSelectable = 4 }) => {
    const atMax = selected.length >= maxSelectable;

    const toggle = (hero: HeroClasses) => {
        if (selected.includes(hero)) {
            onChange(selected.filter(h => h !== hero));
        } else if (!atMax) {
            onChange([...selected, hero]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {heroEntries.map(([key, value]) => {
                const isActive = selected.includes(value);
                const isDisabled = !isActive && atMax;
                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => toggle(value)}
                        className={`px-2 py-1 text-sm rounded border transition-colors ${
                            isActive
                                ? "border-orange-30 text-orange-30 bg-cool-gray-90"
                                : isDisabled
                                    ? "border-cool-gray-80 text-cool-gray-20 opacity-40 cursor-not-allowed"
                                    : "border-cool-gray-80 text-cool-gray-20 hover:border-orange-30 hover:text-orange-30"
                        }`}
                    >
                        {formatHeroName(key)}
                    </button>
                );
            })}
        </div>
    );
};

export default HeroSelector;
