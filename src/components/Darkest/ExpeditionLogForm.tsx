"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dungeon, DungeonDifficulty, DungeonLength, GameDifficulty, HeroClasses } from "@/models/darkest";
import {
    CreateExpeditionLogDto,
    DungeonRecommendation,
    ExpeditionOutcome,
    Loot,
    Provisions,
} from "@/models/expedition";
import { mapDungeonToIndex } from "@/utils/Constants/constants";
import { LOOT_STRINGS, PROVISION_IMG_SRC } from "@/utils/Constants/image";
import { PROVISION_MAX_STACK } from "@/utils/Constants/shop";
import DungeonSelector from "./DungeonSelector";
import DurationSelector from "./DurationSelector";
import ClickableItemGrid from "./ClickableItemGrid";
import HeroSelector from "./HeroSelector";
import CasualtySelector from "./CasualtySelector";
import StarRating from "./StarRating";
import Button from "@/components/UI/Button";

interface ExpeditionLogFormProps {
    onSuccess: () => void;
}

const EMPTY_PROVISIONS: Provisions = {
    food: 0, shovel: 0, antivenom: 0, bandage: 0, medicinalHerb: 0,
    skeletonKey: 0, holyWater: 0, laudanum: 0, torch: 0, fireWood: 0,
    dogTreats: 0, aegisScale: 0, curseCure: 0, theBlood: 0,
};

const EMPTY_LOOT: Loot = {
    gold: 0, bust: 0, crest: 0, deed: 0, portrait: 0, citrine: 0,
    onyx: 0, emerald: 0, jade: 0, sapphire: 0, ruby: 0, tapestry: 0,
    minorAntique: 0, rareAntique: 0, pewRelic: 0, trapezohedron: 0, shard: 0,
};

const camelToLabel = (key: string) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());

const PROVISION_LABELS: Record<string, string> = Object.fromEntries(
    Object.keys(EMPTY_PROVISIONS).map(k => [k, camelToLabel(k)])
);
const LOOT_LABELS: Record<string, string> = Object.fromEntries(
    Object.keys(EMPTY_LOOT).map(k => [k, camelToLabel(k)])
);

const DIFFICULTY_OPTIONS = [
    { value: DungeonDifficulty.APPRENTICE, label: "Apprentice" },
    { value: DungeonDifficulty.VETERAN,    label: "Veteran" },
    { value: DungeonDifficulty.CHAMPION,   label: "Champion" },
];

const GAME_DIFFICULTY_OPTIONS = [
    { value: GameDifficulty.RADIANT, label: "Radiant" },
    { value: GameDifficulty.DARKEST, label: "Darkest" },
    { value: GameDifficulty.STYGIAN, label: "Stygian" },
];

const OUTCOME_OPTIONS = [
    { value: ExpeditionOutcome.SUCCESS, label: "Success", active: "border-green-500 text-green-400 bg-cool-gray-90", hover: "hover:border-green-500 hover:text-green-400" },
    { value: ExpeditionOutcome.FAILURE, label: "Failure", active: "border-red-500 text-red-400 bg-cool-gray-90",   hover: "hover:border-red-500 hover:text-red-400" },
    { value: ExpeditionOutcome.RETREAT, label: "Retreat", active: "border-yellow-500 text-yellow-400 bg-cool-gray-90", hover: "hover:border-yellow-500 hover:text-yellow-400" },
];

const SectionLabel = ({ text }: { text: string }) => (
    <h3 className="font-semibold text-white mb-2">{text}</h3>
);

const ExpeditionLogForm: React.FC<ExpeditionLogFormProps> = ({ onSuccess }) => {
    const [dungeon, setDungeon]               = useState<Dungeon>(Dungeon.RUINS);
    const [duration, setDuration]             = useState<DungeonLength>(DungeonLength.SHORT);
    const [difficulty, setDifficulty]         = useState<DungeonDifficulty>(DungeonDifficulty.APPRENTICE);
    const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty | undefined>(undefined);
    const [heroes, setHeroes]                 = useState<HeroClasses[]>([]);
    const [provisions, setProvisions]         = useState<Provisions>(EMPTY_PROVISIONS);
    const [outcome, setOutcome]               = useState<ExpeditionOutcome | undefined>(undefined);
    const [casualties, setCasualties]         = useState<HeroClasses[]>([]);
    const [loot, setLoot]                     = useState<Loot>(EMPTY_LOOT);
    const [stressNotes, setStressNotes]       = useState("");
    const [notes, setNotes]                   = useState("");
    const [rating, setRating]                 = useState(3);
    const [isSubmitting, setIsSubmitting]     = useState(false);
    const [error, setError]                   = useState<string | null>(null);

    // Pre-fill provisions from recommendation
    useEffect(() => {
        if (!dungeon || !duration) return;
        const controller = new AbortController();
        const fetchRec = async () => {
            try {
                const res = await fetch(
                    `/api/darkest/expedition/recommendations/${mapDungeonToIndex(dungeon)}`,
                    { signal: controller.signal }
                );
                const data: DungeonRecommendation = await res.json();
                setProvisions(data.provisions[duration]);
            } catch (e) {
                if (e instanceof Error && e.name === "AbortError") return;
            }
        };
        fetchRec();
        return () => controller.abort();
    }, [dungeon, duration]);

    // Remove stale casualties when hero selection changes
    useEffect(() => {
        setCasualties(prev => prev.filter(c => heroes.includes(c)));
    }, [heroes]);

    const handleProvisionChange = (key: string, delta: 1 | -1) => {
        setProvisions(prev => ({ ...prev, [key]: (prev[key as keyof Provisions] ?? 0) + delta }));
    };

    const handleLootChange = (key: string, delta: 1 | -1) => {
        setLoot(prev => ({ ...prev, [key]: (prev[key as keyof Loot] ?? 0) + delta }));
    };

    const handleSubmit = async () => {
        if (!outcome) { setError("Please select an outcome."); return; }
        setIsSubmitting(true);
        setError(null);
        try {
            const body: CreateExpeditionLogDto = {
                dungeon, duration, difficulty, gameDifficulty,
                heroes, provisions, outcome, casualties, loot,
                stressNotes, notes, rating,
            };
            const res = await fetch("/api/darkest/expedition/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.status === 201) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.message ?? "Failed to save expedition log.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-2">

            {/* Section 1: Dungeon */}
            <div>
                <SectionLabel text="Dungeon" />
                <DungeonSelector selected={dungeon} handleClick={setDungeon} />
            </div>

            {/* Section 2: Duration */}
            <div>
                <SectionLabel text="Duration" />
                <DurationSelector selected={duration} handleClick={setDuration} />
            </div>

            {/* Section 3: Difficulty */}
            <div>
                <SectionLabel text="Difficulty" />
                <div className="flex justify-center gap-4">
                    {DIFFICULTY_OPTIONS.map(opt => (
                        <div key={opt.value} className="cursor-pointer flex flex-col items-center" onClick={() => setDifficulty(opt.value)}>
                            <Image
                                src={difficulty === opt.value ? "/darkest/torch_100.png" : "/darkest/torch_0.png"}
                                alt={opt.label} width={40} height={55}
                            />
                            <span style={{ color: difficulty === opt.value ? "#F7BA50" : "white", fontSize: "16px", fontWeight: "600" }}>
                                {opt.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 4: Game Difficulty (optional) */}
            <div>
                <SectionLabel text="Game Difficulty (optional)" />
                <div className="flex justify-center gap-4">
                    {GAME_DIFFICULTY_OPTIONS.map(opt => (
                        <div
                            key={opt.value}
                            className="cursor-pointer flex flex-col items-center"
                            onClick={() => setGameDifficulty(prev => prev === opt.value ? undefined : opt.value)}
                        >
                            <Image
                                src={gameDifficulty === opt.value ? "/darkest/torch_100.png" : "/darkest/torch_0.png"}
                                alt={opt.label} width={40} height={55}
                            />
                            <span style={{ color: gameDifficulty === opt.value ? "#F7BA50" : "white", fontSize: "16px", fontWeight: "600" }}>
                                {opt.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 5: Heroes */}
            <div>
                <SectionLabel text="Heroes (select up to 4)" />
                <HeroSelector selected={heroes} onChange={setHeroes} maxSelectable={4} />
            </div>

            {/* Section 6: Provisions */}
            <div>
                <SectionLabel text="Provisions" />
                <p className="text-cool-gray-20 text-xs mb-2">Left-click to add · Right-click to remove</p>
                <ClickableItemGrid
                    counts={provisions as unknown as Record<string, number>}
                    images={PROVISION_IMG_SRC}
                    labels={PROVISION_LABELS}
                    maxPerItem={PROVISION_MAX_STACK}
                    onChange={handleProvisionChange}
                />
            </div>

            {/* Section 7: Outcome */}
            <div>
                <SectionLabel text="Outcome" />
                <div className="flex gap-3">
                    {OUTCOME_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setOutcome(opt.value)}
                            className={`px-4 py-2 rounded border font-semibold transition-colors ${
                                outcome === opt.value
                                    ? opt.active
                                    : `border-cool-gray-80 text-cool-gray-20 ${opt.hover}`
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section 8: Casualties */}
            {heroes.length > 0 && (
                <div>
                    <SectionLabel text="Casualties" />
                    <CasualtySelector heroes={heroes} casualties={casualties} onChange={setCasualties} />
                </div>
            )}

            {/* Section 9: Loot */}
            <div>
                <SectionLabel text="Loot Collected" />
                <p className="text-cool-gray-20 text-xs mb-2">Left-click to add · Right-click to remove</p>
                <ClickableItemGrid
                    counts={loot as unknown as Record<string, number>}
                    images={LOOT_STRINGS}
                    labels={LOOT_LABELS}
                    onChange={handleLootChange}
                />
            </div>

            {/* Section 10: Stress Notes */}
            <div>
                <SectionLabel text="Stress Notes" />
                <textarea
                    className="w-full bg-cool-gray-90 border border-cool-gray-80 rounded p-2 text-white text-sm"
                    rows={3}
                    value={stressNotes}
                    onChange={e => setStressNotes(e.target.value)}
                    placeholder="Afflictions, virtues, notable stress events…"
                />
            </div>

            {/* Section 11: General Notes */}
            <div>
                <SectionLabel text="General Notes" />
                <textarea
                    className="w-full bg-cool-gray-90 border border-cool-gray-80 rounded p-2 text-white text-sm"
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any other notes about this expedition…"
                />
            </div>

            {/* Section 12: Rating */}
            <div>
                <SectionLabel text="Rating" />
                <StarRating value={rating} onChange={setRating} />
            </div>

            {/* Section 13: Submit */}
            <div>
                <Button
                    label={isSubmitting ? "Saving…" : "Save Expedition"}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                />
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

        </div>
    );
};

export default ExpeditionLogForm;
