"use client"

import { useEffect, useState } from "react";
import { GameSave } from "@/models/expedition";

interface GameSaveSelectorProps {
    onSaveSelected: (saveId: string) => void;
}

const SLOTS = [1, 2, 3] as const;

const GameSaveSelector: React.FC<GameSaveSelectorProps> = ({ onSaveSelected }) => {
    const [saves, setSaves] = useState<GameSave[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [creatingSlot, setCreatingSlot] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const fetchSaves = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/darkest/expedition/saves");
            if (!res.ok) throw new Error("Failed to load saves.");
            const data = await res.json();
            setSaves(data.saves);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSaves(); }, []);

    const handleSelect = (saveId: string) => {
        setSelectedId(saveId);
        onSaveSelected(saveId);
    };

    const handleCreateConfirm = async (slot: number) => {
        if (!newName.trim()) { setCreateError("Name is required."); return; }
        setCreating(true);
        setCreateError(null);
        try {
            const res = await fetch("/api/darkest/expedition/saves", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slot, name: newName.trim() }),
            });
            const data = await res.json();
            if (!res.ok) { setCreateError(data.message ?? "Failed to create save."); return; }
            setCreatingSlot(null);
            setNewName("");
            await fetchSaves();
            handleSelect(data.save.id);
        } catch {
            setCreateError("Network error. Please try again.");
        } finally {
            setCreating(false);
        }
    };

    if (loading) return <p className="text-cool-gray-20 text-sm">Loading saves…</p>;
    if (error)   return <p className="text-red-400 text-sm">{error}</p>;

    return (
        <div className="flex flex-wrap gap-3 mb-4">
            {SLOTS.map(slot => {
                const save = saves.find(s => s.slot === slot);
                const isSelected = save && selectedId === save.id;
                const isCreating = creatingSlot === slot;

                if (save) {
                    return (
                        <button
                            key={slot}
                            onClick={() => handleSelect(save.id)}
                            className={`flex flex-col items-start px-4 py-3 rounded border text-left transition-colors ${
                                isSelected
                                    ? "border-orange-30 bg-cool-gray-90 text-orange-30"
                                    : "border-cool-gray-80 text-cool-gray-20 hover:border-orange-30 hover:text-white"
                            }`}
                        >
                            <span className="text-xs uppercase tracking-wide opacity-60">Save {slot}</span>
                            <span className="font-semibold">{save.name}</span>
                        </button>
                    );
                }

                if (isCreating) {
                    return (
                        <div key={slot} className="flex flex-col gap-1 px-4 py-3 rounded border border-cool-gray-80 bg-cool-gray-90">
                            <span className="text-xs uppercase tracking-wide text-cool-gray-20">Save {slot}</span>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Save name…"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => { if (e.key === "Enter") handleCreateConfirm(slot); if (e.key === "Escape") { setCreatingSlot(null); setNewName(""); } }}
                                className="bg-transparent border-b border-cool-gray-80 text-white text-sm outline-none pb-0.5"
                            />
                            {createError && <p className="text-red-400 text-xs">{createError}</p>}
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={() => handleCreateConfirm(slot)}
                                    disabled={creating}
                                    className="text-xs px-2 py-0.5 rounded bg-orange-30 text-cool-gray-100 font-semibold disabled:opacity-40"
                                >
                                    {creating ? "Creating…" : "Create"}
                                </button>
                                <button
                                    onClick={() => { setCreatingSlot(null); setNewName(""); setCreateError(null); }}
                                    className="text-xs px-2 py-0.5 rounded border border-cool-gray-80 text-cool-gray-20"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    );
                }

                return (
                    <button
                        key={slot}
                        onClick={() => { setCreatingSlot(slot); setNewName(""); setCreateError(null); }}
                        className="flex flex-col items-start px-4 py-3 rounded border border-dashed border-cool-gray-80 text-cool-gray-20 hover:border-orange-30 hover:text-white transition-colors"
                    >
                        <span className="text-xs uppercase tracking-wide opacity-60">Save {slot}</span>
                        <span className="font-semibold">+ Create Save</span>
                    </button>
                );
            })}
        </div>
    );
};

export default GameSaveSelector;
