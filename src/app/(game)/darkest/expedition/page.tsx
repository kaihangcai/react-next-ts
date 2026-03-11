"use client"

import { useState } from "react";
import GameSaveSelector from "@/components/Darkest/GameSaveSelector";
import ExpeditionHistoryList from "@/components/Darkest/ExpeditionHistoryList";
import RosterHeroList from "@/components/Darkest/RosterHeroList";

type TabId = "history" | "heroes";

const DarkestExpeditionPage = () => {
    const [activeTab, setActiveTab] = useState<TabId>("history");
    const [saveId, setSaveId] = useState<string | null>(null);

    return (
        <div className="flex flex-col p-2">
            <h1 className="font-bold text-xl mb-4">EXPEDITION JOURNAL</h1>

            {/* Save selector */}
            <GameSaveSelector onSaveSelected={setSaveId} />

            {/* Tab bar */}
            <div className="flex border-b border-cool-gray-80 mb-4">
                {(["history", "heroes"] as TabId[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-semibold transition-colors ${
                            activeTab === tab
                                ? "border-b-2 border-orange-30 text-orange-30"
                                : "text-cool-gray-20 hover:text-white"
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Gate content behind save selection */}
            {!saveId ? (
                <p className="text-cool-gray-20">Select or create a save above to view your journal.</p>
            ) : (
                <>
                    {activeTab === "history" && <ExpeditionHistoryList gameSaveId={saveId} />}
                    {activeTab === "heroes"  && <RosterHeroList gameSaveId={saveId} />}
                </>
            )}
        </div>
    )
}

export default DarkestExpeditionPage;
