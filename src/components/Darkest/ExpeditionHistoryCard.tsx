"use client"

import Image from "next/image";
import { Skull } from "lucide-react";
import { DungeonDifficulty, HeroClasses } from "@/models/darkest";
import { ExpeditionLogEntry, ExpeditionOutcome } from "@/models/expedition";
import { LOOT_STRINGS } from "@/utils/Constants/image";
import StarRating from "./StarRating";

interface ExpeditionHistoryCardProps {
    entry: ExpeditionLogEntry;
}

const formatHeroName = (hero: HeroClasses) =>
    HeroClasses[hero].replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

const difficultyLabel = (d: number): string => {
    const entry = Object.entries(DungeonDifficulty).find(
        ([k, v]) => v === d && isNaN(Number(k))
    );
    if (!entry) return String(d);
    return entry[0].charAt(0) + entry[0].slice(1).toLowerCase();
};

const OUTCOME_CLASS: Record<ExpeditionOutcome, string> = {
    [ExpeditionOutcome.SUCCESS]: "text-green-400",
    [ExpeditionOutcome.FAILURE]: "text-red-400",
    [ExpeditionOutcome.RETREAT]: "text-yellow-400",
};

const ExpeditionHistoryCard: React.FC<ExpeditionHistoryCardProps> = ({ entry }) => {
    const date = new Date(entry.createdAt).toLocaleDateString();
    const nonZeroLoot = Object.entries(entry.loot).filter(([, v]) => v > 0);

    return (
        <div className="bg-cool-gray-90 rounded-lg p-4 border border-cool-gray-80">

            {/* Header row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-bold text-white">{entry.dungeon}</span>
                <span className="text-cool-gray-20 text-sm">·</span>
                <span className="text-cool-gray-20 text-sm">{difficultyLabel(entry.difficulty)}</span>
                <span className="text-cool-gray-20 text-sm">·</span>
                <span className="text-cool-gray-20 text-sm capitalize">{entry.duration}</span>
                <span className="text-cool-gray-20 text-sm">·</span>
                <span className="text-cool-gray-20 text-sm">{date}</span>
            </div>

            {/* Outcome badge */}
            <p className={`font-semibold mb-2 capitalize ${OUTCOME_CLASS[entry.outcome]}`}>
                {entry.outcome}
            </p>

            {/* Heroes row */}
            <div className="flex flex-wrap gap-2 mb-2">
                {entry.heroes.map(hero => {
                    const isCasualty = entry.casualties.includes(hero);
                    return (
                        <span
                            key={hero}
                            className={`flex items-center gap-1 text-sm ${isCasualty ? "text-red-400 line-through" : "text-cool-gray-20"}`}
                        >
                            {isCasualty && <Skull size={12} />}
                            {formatHeroName(hero)}
                        </span>
                    );
                })}
            </div>

            {/* Loot row */}
            {nonZeroLoot.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {nonZeroLoot.map(([key, count]) => (
                        <div key={key} className="flex items-center gap-1">
                            <Image
                                src={LOOT_STRINGS[key as keyof typeof LOOT_STRINGS]}
                                alt={key}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                            <span className="text-cool-gray-20 text-xs">{count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Rating */}
            <div className="mb-2">
                <StarRating value={entry.rating} readOnly />
            </div>

            {/* Notes (collapsible) */}
            {entry.stressNotes && (
                <details className="mb-1">
                    <summary className="text-cool-gray-20 text-sm cursor-pointer select-none">Stress Notes</summary>
                    <p className="text-white text-sm mt-1 pl-2">{entry.stressNotes}</p>
                </details>
            )}
            {entry.notes && (
                <details>
                    <summary className="text-cool-gray-20 text-sm cursor-pointer select-none">General Notes</summary>
                    <p className="text-white text-sm mt-1 pl-2">{entry.notes}</p>
                </details>
            )}

        </div>
    );
};

export default ExpeditionHistoryCard;
