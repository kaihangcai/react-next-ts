"use client"

import { useCallback, useEffect, useState } from "react";
import { RosterHero } from "@/models/expedition";
import RosterHeroCard from "./RosterHeroCard";
import RosterHeroForm from "./RosterHeroForm";

interface RosterHeroListProps {
    gameSaveId: string;
}

const RosterHeroList: React.FC<RosterHeroListProps> = ({ gameSaveId }) => {
    const [heroes, setHeroes]           = useState<RosterHero[]>([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId]     = useState<string | null>(null);

    const fetchHeroes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/darkest/expedition/roster?saveId=${gameSaveId}`);
            if (!res.ok) throw new Error("Failed to fetch roster.");
            const data = await res.json();
            setHeroes(data.heroes);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [gameSaveId]);

    useEffect(() => { fetchHeroes(); }, [fetchHeroes]);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Hero Roster</h2>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-3 py-1.5 text-sm font-semibold rounded border border-orange-30 text-orange-30 hover:bg-cool-gray-90 transition-colors"
                    >
                        + Add Hero
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="mb-4">
                    <RosterHeroForm
                        gameSaveId={gameSaveId}
                        onSuccess={() => { setShowAddForm(false); fetchHeroes(); }}
                        onCancel={() => setShowAddForm(false)}
                    />
                </div>
            )}

            {loading && <p className="text-cool-gray-20">Loading…</p>}
            {error   && <p className="text-red-400">{error}</p>}
            {!loading && !error && heroes.length === 0 && !showAddForm && (
                <p className="text-cool-gray-20">No heroes on roster yet.</p>
            )}

            <div className="flex flex-col gap-4">
                {heroes.map(hero => (
                    editingId === hero.id ? (
                        <RosterHeroForm
                            key={hero.id}
                            gameSaveId={gameSaveId}
                            hero={hero}
                            onSuccess={() => { setEditingId(null); fetchHeroes(); }}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <RosterHeroCard
                            key={hero.id}
                            hero={hero}
                            onEdit={() => setEditingId(hero.id)}
                            onDeleted={() => fetchHeroes()}
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default RosterHeroList;
