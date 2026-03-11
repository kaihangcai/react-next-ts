"use client"

import { useState } from "react";
import { HeroClasses } from "@/models/darkest";
import { RosterHero } from "@/models/expedition";

interface RosterHeroCardProps {
    hero: RosterHero;
    onEdit: () => void;
    onDeleted: () => void;
}

const LEVEL_LABELS = ["Novice", "Apprentice", "Journeyman", "Veteran", "Heroic", "Forsaken", "Stygian"];

const formatHeroName = (heroClass: HeroClasses) =>
    HeroClasses[heroClass].replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

const RosterHeroCard: React.FC<RosterHeroCardProps> = ({ hero, onEdit, onDeleted }) => {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await fetch(`/api/darkest/expedition/roster/${hero.id}`, { method: "DELETE" });
            onDeleted();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="bg-cool-gray-90 rounded-lg p-4 border border-cool-gray-80">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white">{formatHeroName(hero.heroClass)}</span>
                    {hero.customName && (
                        <span className="text-cool-gray-20 text-sm">&ldquo;{hero.customName}&rdquo;</span>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded bg-cool-gray-80 text-orange-30 font-semibold">
                        {LEVEL_LABELS[hero.level] ?? `Level ${hero.level}`}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="text-xs px-2 py-1 rounded border border-cool-gray-80 text-cool-gray-20 hover:text-white transition-colors"
                    >
                        Edit
                    </button>
                    {confirmDelete ? (
                        <div className="flex gap-1">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-xs px-2 py-1 rounded bg-red-700 text-white font-semibold disabled:opacity-40"
                            >
                                {deleting ? "…" : "Confirm"}
                            </button>
                            <button
                                onClick={() => setConfirmDelete(false)}
                                className="text-xs px-2 py-1 rounded border border-cool-gray-80 text-cool-gray-20"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="text-xs px-2 py-1 rounded border border-cool-gray-80 text-cool-gray-20 hover:border-red-500 hover:text-red-400 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Quirks */}
            {(hero.positiveQuirks.length > 0 || hero.negativeQuirks.length > 0 || hero.diseases.length > 0) && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {hero.positiveQuirks.map(q => (
                        <span key={q} className="text-xs px-2 py-0.5 rounded bg-green-900 text-green-300 border border-green-700">{q}</span>
                    ))}
                    {hero.negativeQuirks.map(q => (
                        <span key={q} className="text-xs px-2 py-0.5 rounded bg-red-900 text-red-300 border border-red-700">{q}</span>
                    ))}
                    {hero.diseases.map(d => (
                        <span key={d} className="text-xs px-2 py-0.5 rounded bg-yellow-900 text-yellow-300 border border-yellow-700">{d}</span>
                    ))}
                </div>
            )}

            {/* Trinkets */}
            {(hero.trinket1 || hero.trinket2) && (
                <div className="flex flex-wrap gap-3 mb-3 text-sm">
                    <span className="text-cool-gray-20">
                        Trinket 1: <span className="text-white">{hero.trinket1 || "— empty —"}</span>
                    </span>
                    <span className="text-cool-gray-20">
                        Trinket 2: <span className="text-white">{hero.trinket2 || "— empty —"}</span>
                    </span>
                </div>
            )}

            {/* Notes */}
            {hero.notes && (
                <details>
                    <summary className="text-cool-gray-20 text-sm cursor-pointer select-none">Notes</summary>
                    <p className="text-white text-sm mt-1 pl-2">{hero.notes}</p>
                </details>
            )}
        </div>
    );
};

export default RosterHeroCard;
