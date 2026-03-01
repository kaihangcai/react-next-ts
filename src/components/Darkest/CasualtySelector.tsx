"use client"

import { HeroClasses } from "@/models/darkest";
import { Skull } from "lucide-react";

interface CasualtySelectorProps {
    heroes: HeroClasses[];
    casualties: HeroClasses[];
    onChange: (casualties: HeroClasses[]) => void;
}

const formatHeroName = (hero: HeroClasses) =>
    HeroClasses[hero].replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

const CasualtySelector: React.FC<CasualtySelectorProps> = ({ heroes, casualties, onChange }) => {
    if (heroes.length === 0) {
        return <p className="text-cool-gray-20 text-sm">Select heroes first.</p>;
    }

    const toggle = (hero: HeroClasses) => {
        if (casualties.includes(hero)) {
            onChange(casualties.filter(h => h !== hero));
        } else {
            onChange([...casualties, hero]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {heroes.map(hero => {
                const isDead = casualties.includes(hero);
                return (
                    <button
                        key={hero}
                        type="button"
                        onClick={() => toggle(hero)}
                        className={`flex items-center gap-1 px-2 py-1 text-sm rounded border transition-colors ${
                            isDead
                                ? "border-red-500 text-red-400 bg-cool-gray-90"
                                : "border-cool-gray-80 text-cool-gray-20 hover:border-red-500 hover:text-red-400"
                        }`}
                    >
                        {isDead && <Skull size={12} />}
                        {formatHeroName(hero)}
                    </button>
                );
            })}
        </div>
    );
};

export default CasualtySelector;
