"use client"

import { useEffect, useState } from "react";
import { ExpeditionLogEntry } from "@/models/expedition";
import ExpeditionHistoryCard from "./ExpeditionHistoryCard";

const ExpeditionHistoryList: React.FC = () => {
    const [entries, setEntries] = useState<ExpeditionLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/darkest/expedition/log");
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
    }, []);

    if (loading) return <p className="text-cool-gray-20">Loading…</p>;
    if (error)   return <p className="text-red-400">{error}</p>;
    if (entries.length === 0) return <p className="text-cool-gray-20">No expeditions logged yet.</p>;

    return (
        <div className="flex flex-col gap-4">
            {entries.map(e => <ExpeditionHistoryCard key={e.id} entry={e} />)}
        </div>
    );
};

export default ExpeditionHistoryList;
