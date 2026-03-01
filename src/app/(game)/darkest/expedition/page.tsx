"use client"

import DungeonRecommendations from "@/components/Darkest/DungeonRecommendations";
import DungeonSelector from "@/components/Darkest/DungeonSelector";
import DurationSelector from "@/components/Darkest/DurationSelector";
import ExpeditionLogForm from "@/components/Darkest/ExpeditionLogForm";
import ExpeditionHistoryList from "@/components/Darkest/ExpeditionHistoryList";
import useHttp from "@/hooks/use-http";
import { Dungeon, DungeonLength } from "@/models/darkest";
import { DungeonRecommendation, Provisions, SingleDungeonRec } from "@/models/expedition";
import { mapDungeonToIndex } from "@/utils/Constants/constants";
import { calculateProvisionCost } from "@/utils/costCalculator";
import { useEffect, useState } from "react";

type TabId = "recommendations" | "new-entry" | "history";

const DarkestExpeditionPage = () => {
    const [activeTab, setActiveTab] = useState<TabId>("recommendations");
    const [selectedDungeon, setSelectedDungeon] = useState<Dungeon>(Dungeon.RUINS);
    const [selectedDuration, setSelectedDuration] = useState<DungeonLength>(DungeonLength.SHORT);

    // to store the entire dungeon recommendation data (for easier POST req. creation)
    const [fullRec, setFullRec] = useState<DungeonRecommendation>();
    const [recommendations, setRecommendations] = useState<SingleDungeonRec>();

    const { sendRequest } = useHttp();

    const handleDungeonClick = (dungeon: Dungeon) => {
        setSelectedDungeon(dungeon);
    }

    const handleDurationClick = (duration: DungeonLength) => {
        setSelectedDuration(duration);
    }

    useEffect(() => {
        // fetch recommendation data
        const fetchData = async() => {
            const response = await fetch(`/api/darkest/expedition/recommendations/${mapDungeonToIndex(selectedDungeon)}`, {
                method: 'GET',
            })
            const result = await response.json();
            return result;
        }
        if(selectedDungeon && selectedDuration) {
            fetchData().then((data: DungeonRecommendation) => {
                setFullRec(data);

                setRecommendations({
                    dungeon: data.dungeon,
                    duration: selectedDuration,
                    provisions: data.provisions[selectedDuration],
                    cost: calculateProvisionCost(data.provisions[selectedDuration]),
                    heroes: data.heroes,
                    tips: data.tips
                })
            })
        }
    }, [selectedDungeon, selectedDuration])

    const updateRecommendation = (newProvision: Provisions, newCost: number) => {
        if(fullRec == null) return;
        const newRec: DungeonRecommendation = {
            ...fullRec,
            provisions: {
                ...fullRec.provisions,
                [selectedDuration]: newProvision
            },
            cost: {
                ...fullRec.cost,
                [selectedDuration]: newCost
            }
        }
        // send 'inventory' to backend to update the database
        const postData = async() => {
            try {
                const response = await fetch(`/api/darkest/expedition/recommendations/${mapDungeonToIndex(selectedDungeon)}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRec)
                })
                if(response.ok) {
                    const result = await response.json();
                    console.log(result.message);
                } else {
                    console.error(response.statusText);
                }
            } catch(error) {
                console.error(error);
            }
        }
        postData();
    }

    const debugText = `DARKEST COMPANION (${selectedDungeon} : ${selectedDuration})`;

    return (
        <div className="flex flex-col p-2">
            <h1 className="font-bold text-xl" style={{marginBottom: "8px"}}>{debugText}</h1>

            {/* Tab bar */}
            <div className="flex border-b border-cool-gray-80 mb-4">
                {(["recommendations", "new-entry", "history"] as TabId[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-semibold transition-colors ${
                            activeTab === tab
                                ? "border-b-2 border-orange-30 text-orange-30"
                                : "text-cool-gray-20 hover:text-white"
                        }`}
                    >
                        {tab === "new-entry" ? "New Entry" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Recommendations tab */}
            {activeTab === "recommendations" && (
                <>
                    <div className="flex flex-col gap-4 justify-center items-center pt-3 pb-6">
                        <DungeonSelector selected={selectedDungeon} handleClick={handleDungeonClick} />
                        <DurationSelector selected={selectedDuration} handleClick={handleDurationClick} />
                    </div>
                    {selectedDungeon && <DungeonRecommendations recommendations={recommendations} duration={selectedDuration} updateRec={updateRecommendation} />}
                </>
            )}

            {/* New Entry tab */}
            {activeTab === "new-entry" && (
                <ExpeditionLogForm onSuccess={() => setActiveTab("history")} />
            )}

            {/* History tab */}
            {activeTab === "history" && <ExpeditionHistoryList />}
        </div>
    )
}

export default DarkestExpeditionPage;
