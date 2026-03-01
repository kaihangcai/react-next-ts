import { DungeonLength } from "@/models/darkest";
import { Provisions, SingleDungeonRec } from "@/models/expedition";
import React, { useEffect, useState } from "react";
import Bag from "./Bag";
import { PROVISION_COSTS, SHOP_PROVISIONS } from "@/utils/Constants/shop";
import Button from "../UI/Button";
import { calculateProvisionCost } from "@/utils/costCalculator";

interface DungeonRecommendationsProps {
    recommendations: SingleDungeonRec | undefined;
    duration: DungeonLength;
    updateRec: (newProvision: Provisions, newCost: number) => void;
}

// Need a 'normal' view and a 'edit' view
const DungeonRecommendations: React.FC<DungeonRecommendationsProps> = ({
    recommendations, duration, updateRec
}) => {
    const [showShop, setShowShop] = useState<boolean>(false);

    const [shopProvisions, setShopProvisions] = useState<Provisions>();
    const [inventory, setInventory] = useState<Provisions>();

    const [inventoryCost, setInventoryCost] = useState<number>();

    // [WIP]: to update the provisions displayed based on the selected dungeon type + duration
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setInventory(recommendations?.provisions);
        updateShopProvisions(recommendations?.provisions);

        setInventoryCost(calculateProvisionCost(recommendations?.provisions));
    }, [recommendations])

    const onShopItemClick = (item: keyof Provisions) => {
        setShopProvisions((prevState) => {
            if(prevState == undefined) return;
            return {
                ...prevState,
                [item]: prevState[item] - 1
            }
        })
        setInventory((prevState) => {
            if(prevState == undefined) return;
            const newState = {
                ...prevState,
                [item]: prevState[item] + 1
            }
            setInventoryCost((prevState) => {
                if(prevState) return prevState + PROVISION_COSTS[item];
                return;
            });
            return newState
        })
    }

    const onInventoryItemClick = (item: keyof Provisions) => {
        setInventory((prevState) => {
            if(prevState == undefined) return;
            const newState = {
                ...prevState,
                [item]: prevState[item] - 1
            }
            setInventoryCost((prevState) => {
                if(prevState) return prevState - PROVISION_COSTS[item];
                return;
            });
            return newState
        })
        setShopProvisions((prevState) => {
            if(prevState == undefined) return;
            return {
                ...prevState,
                [item]: prevState[item] + 1
            }
        })
    }

    const updateShopProvisions = (prov: Provisions | undefined) => {
        if(prov == undefined) setShopProvisions(SHOP_PROVISIONS[duration]);
        else {
            const baseShopProvisions: Provisions = SHOP_PROVISIONS[duration];
            setShopProvisions({
                food: baseShopProvisions.food - prov.food,
                shovel: baseShopProvisions.shovel - prov.shovel,
                antivenom: baseShopProvisions.antivenom - prov.antivenom,
                bandage: baseShopProvisions.bandage - prov.bandage,
                medicinalHerb: baseShopProvisions.medicinalHerb - prov.medicinalHerb,
                skeletonKey: baseShopProvisions.skeletonKey - prov.skeletonKey,
                holyWater: baseShopProvisions.holyWater - prov.holyWater,
                laudanum: baseShopProvisions.laudanum - prov.laudanum,
                torch: baseShopProvisions.torch - prov.torch,
                aegisScale: 0,
                curseCure: 0,
                dogTreats: 0,
                fireWood: 0,
                theBlood: 0,
            })
        }
    };

    // should display shop AND bag view if true, else just the bag view
    const toggleView = () => {
        setShowShop(prevState => !prevState);
    }

    const saveInventory = () => {
        if(inventory == undefined) {
            console.error("inventory is undefined!");
            return;
        }
        if(inventoryCost == undefined) {
            console.error("inventoryCost is undefined!");
            return;
        }

        updateRec(inventory, inventoryCost);
    }

    return (
        <div className="flex justify-center items-center flex-col gap-6">
            {showShop && (
                <div className="flex flex-col gap-3">
                    <label style={{fontSize: '24px', lineHeight: '18px'}}>SHOP</label>
                    <Bag items={shopProvisions} onItemClick={onShopItemClick} isShop={true}/>
                </div>
            )}
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <label style={{fontSize: '24px', lineHeight: '18px'}}>INVENTORY <span style={{color: 'gold'}}>({inventoryCost})</span></label>
                    <div className="flex gap-3">
                        <Button label={showShop ? "Cancel" : "Edit"} onClick={toggleView} />
                        {showShop && <Button label={"Save"} onClick={saveInventory}/>}
                    </div>
                </div>
                <Bag items={inventory} onItemClick={onInventoryItemClick}/>
            </div>
        </div>
    );
}

export default DungeonRecommendations;
