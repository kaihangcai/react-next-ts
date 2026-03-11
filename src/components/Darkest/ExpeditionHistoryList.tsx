"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExpeditionLogEntry } from "@/models/expedition";
import ExpeditionHistoryCard from "./ExpeditionHistoryCard";

interface ExpeditionHistoryListProps {
    gameSaveId: string;
}

const ExpeditionHistoryList: React.FC<ExpeditionHistoryListProps> = ({ gameSaveId }) => {
    const router = useRouter();
    const [entries, setEntries] = useState<ExpeditionLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchLogs = async () => {
            try {
                const res = await fetch(`/api/darkest/expedition/log?saveId=${gameSaveId}`);
                if (!res.ok) throw new Error("Failed to fetch expedition logs.");
                const data = await res.json();
                setEntries(data.logs);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [gameSaveId]);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Expedition History</h2>
                <button
                    onClick={() => router.push(`/darkest/expedition/new?saveId=${gameSaveId}`)}
                    className="px-3 py-1.5 text-sm font-semibold rounded border border-orange-30 text-orange-30 hover:bg-cool-gray-90 transition-colors"
                >
                    + New Entry
                </button>
            </div>

            {loading && <p className="text-cool-gray-20">Loading…</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!loading && !error && entries.length === 0 && (
                <p className="text-cool-gray-20">No expeditions logged yet.</p>
            )}
            {!loading && !error && entries.length > 0 && (
                <div className="flex flex-col gap-4">
                    {entries.map(e => <ExpeditionHistoryCard key={e.id} entry={e} />)}
                </div>
            )}
        </div>
    );
};

export default ExpeditionHistoryList;
