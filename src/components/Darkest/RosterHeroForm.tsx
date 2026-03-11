"use client"

import { useState, KeyboardEvent } from "react";
import { HeroClasses } from "@/models/darkest";
import { CreateRosterHeroDto, RosterHero, UpdateRosterHeroDto } from "@/models/expedition";
import HeroSelector from "./HeroSelector";
import Button from "@/components/UI/Button";

interface RosterHeroFormProps {
    gameSaveId: string;
    hero?: RosterHero;
    onSuccess: () => void;
    onCancel: () => void;
}

const LEVEL_LABELS = ["Novice", "Apprentice", "Journeyman", "Veteran", "Heroic", "Forsaken", "Stygian"];

const TagInput = ({
    tags,
    onChange,
    placeholder,
    tagClass,
}: {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder: string;
    tagClass: string;
}) => {
    const [input, setInput] = useState("");

    const addTag = () => {
        const trimmed = input.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInput("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { e.preventDefault(); addTag(); }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map(tag => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => onChange(tags.filter(t => t !== tag))}
                        className={`text-xs px-2 py-0.5 rounded border cursor-pointer ${tagClass}`}
                        title="Click to remove"
                    >
                        {tag} ×
                    </button>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={placeholder}
                className="w-full bg-cool-gray-90 border border-cool-gray-80 rounded px-2 py-1 text-white text-sm outline-none focus:border-orange-30"
            />
        </div>
    );
};

const SectionLabel = ({ text }: { text: string }) => (
    <h4 className="text-sm font-semibold text-white mb-1">{text}</h4>
);

const RosterHeroForm: React.FC<RosterHeroFormProps> = ({ gameSaveId, hero, onSuccess, onCancel }) => {
    const isEdit = !!hero;

    const [heroClass, setHeroClass]           = useState<HeroClasses[]>(hero ? [hero.heroClass] : []);
    const [customName, setCustomName]         = useState(hero?.customName ?? "");
    const [level, setLevel]                   = useState(hero?.level ?? 0);
    const [positiveQuirks, setPositiveQuirks] = useState<string[]>(hero?.positiveQuirks ?? []);
    const [negativeQuirks, setNegativeQuirks] = useState<string[]>(hero?.negativeQuirks ?? []);
    const [diseases, setDiseases]             = useState<string[]>(hero?.diseases ?? []);
    const [trinket1, setTrinket1]             = useState(hero?.trinket1 ?? "");
    const [trinket2, setTrinket2]             = useState(hero?.trinket2 ?? "");
    const [notes, setNotes]                   = useState(hero?.notes ?? "");
    const [isSubmitting, setIsSubmitting]     = useState(false);
    const [error, setError]                   = useState<string | null>(null);

    const handleSubmit = async () => {
        if (heroClass.length === 0) { setError("Please select a hero class."); return; }
        setIsSubmitting(true);
        setError(null);
        try {
            if (isEdit) {
                const body: UpdateRosterHeroDto = {
                    heroClass: heroClass[0],
                    customName, level,
                    positiveQuirks, negativeQuirks, diseases,
                    trinket1, trinket2, notes,
                };
                const res = await fetch(`/api/darkest/expedition/roster/${hero!.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) { const d = await res.json(); setError(d.message ?? "Failed to update hero."); return; }
            } else {
                const body: CreateRosterHeroDto = {
                    gameSaveId,
                    heroClass: heroClass[0],
                    customName, level,
                    positiveQuirks, negativeQuirks, diseases,
                    trinket1, trinket2, notes,
                };
                const res = await fetch("/api/darkest/expedition/roster", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (!res.ok) { const d = await res.json(); setError(d.message ?? "Failed to add hero."); return; }
            }
            onSuccess();
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 bg-cool-gray-90 rounded-lg p-4 border border-cool-gray-80">
            <h3 className="font-semibold text-white">{isEdit ? "Edit Hero" : "Add Hero"}</h3>

            <div>
                <SectionLabel text="Hero Class" />
                <HeroSelector selected={heroClass} onChange={setHeroClass} maxSelectable={1} />
            </div>

            <div>
                <SectionLabel text="Custom Name (optional)" />
                <input
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="e.g. Grave Robber"
                    className="w-full bg-cool-gray-90 border border-cool-gray-80 rounded px-2 py-1 text-white text-sm outline-none focus:border-orange-30"
                />
            </div>

            <div>
                <SectionLabel text="Resolve Level" />
                <div className="flex flex-wrap gap-2">
                    {LEVEL_LABELS.map((label, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setLevel(i)}
                            className={`px-3 py-1 text-sm rounded border transition-colors ${
                                level === i
                                    ? "border-orange-30 text-orange-30 bg-cool-gray-80"
                                    : "border-cool-gray-80 text-cool-gray-20 hover:text-white"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <SectionLabel text="Positive Quirks" />
                <TagInput
                    tags={positiveQuirks}
                    onChange={setPositiveQuirks}
                    placeholder="Type quirk and press Enter…"
                    tagClass="bg-green-900 text-green-300 border-green-700"
                />
            </div>

            <div>
                <SectionLabel text="Negative Quirks" />
                <TagInput
                    tags={negativeQuirks}
                    onChange={setNegativeQuirks}
                    placeholder="Type quirk and press Enter…"
                    tagClass="bg-red-900 text-red-300 border-red-700"
                />
            </div>

            <div>
                <SectionLabel text="Diseases" />
                <TagInput
                    tags={diseases}
                    onChange={setDiseases}
                    placeholder="Type disease and press Enter…"
                    tagClass="bg-yellow-900 text-yellow-300 border-yellow-700"
                />
            </div>

            <div className="flex gap-3">
                <div className="flex-1">
                    <SectionLabel text="Trinket 1" />
                    <input
                        type="text"
                        value={trinket1}
                        onChange={e => setTrinket1(e.target.value)}
                        placeholder="e.g. Ancestor's Pen"
                        className="w-full bg-cool-gray-90 border border-cool-gray-80 rounded px-2 py-1 text-white text-sm outline-none focus:border-orange-30"
                    />
                </div>
                <div className="flex-1">
                    <SectionLabel text="Trinket 2" />
                    <input
                        type="text"
                        value={trinket2}
                        onChange={e => setTrinket2(e.target.value)}
                        placeholder="e.g. Claustrophobic's Charm"
                        className="w-full bg-cool-gray-90 border border-cool-gray-80 rounded px-2 py-1 text-white text-sm outline-none focus:border-orange-30"
                    />
                </div>
            </div>

            <div>
                <SectionLabel text="Notes" />
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any notes about this hero…"
                    rows={2}
                    className="w-full bg-cool-gray-90 border border-cool-gray-80 rounded px-2 py-1 text-white text-sm outline-none focus:border-orange-30"
                />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3">
                <Button
                    label={isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Add Hero"}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                />
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded border border-cool-gray-80 text-cool-gray-20 hover:text-white transition-colors text-sm font-semibold"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default RosterHeroForm;
