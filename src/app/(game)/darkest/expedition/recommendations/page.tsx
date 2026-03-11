"use client"

import DungeonRecommendations from "@/components/Darkest/DungeonRecommendations";
import DungeonSelector from "@/components/Darkest/DungeonSelector";
import DurationSelector from "@/components/Darkest/DurationSelector";
import useHttp from "@/hooks/use-http";
import { Dungeon, DungeonLength } from "@/models/darkest";
import { DungeonRecommendation, Provisions, SingleDungeonRec } from "@/models/expedition";
import { mapDungeonToIndex } from "@/utils/Constants/constants";
import { calculateProvisionCost } from "@/utils/costCalculator";
import { useEffect, useState } from "react";

const DarkestRecommendationsPage = () => {
    const [selectedDungeon, setSelectedDungeon] = useState<Dungeon>(Dungeon.RUINS);
    const [selectedDuration, setSelectedDuration] = useState<DungeonLength>(DungeonLength.SHORT);

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

    return (
        <div className="flex flex-col p-2">
            <h1 className="font-bold text-xl" style={{marginBottom: "8px"}}>EXPEDITION RECOMMENDATIONS</h1>

            <div className="flex flex-col gap-4 justify-center items-center pt-3 pb-6">
                <DungeonSelector selected={selectedDungeon} handleClick={handleDungeonClick} />
                <DurationSelector selected={selectedDuration} handleClick={handleDurationClick} />
            </div>
            {selectedDungeon && (
                <DungeonRecommendations
                    recommendations={recommendations}
                    duration={selectedDuration}
                    updateRec={updateRecommendation}
                />
            )}
        </div>
    )
}

export default DarkestRecommendationsPage;
