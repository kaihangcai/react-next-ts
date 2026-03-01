import { Provisions } from "@/models/expedition";
import ItemDisplay from "./ItemDisplay";
import { useEffect, useState } from "react";
import { PROVISION_COSTS, PROVISION_MAX_STACK } from "@/utils/Constants/shop";

interface BagItem {
    name: keyof Provisions;
    count: number;
}

interface BagProps {
    items: Provisions | undefined;
    onItemClick: (item: keyof Provisions) => void;
    isShop?: boolean;
}

// there are 16 inventory slots in a bag (that you bring in an expedition)
// need to display them as a 2 x 8 "grid"
const Bag: React.FC<BagProps> = ({items, onItemClick, isShop=false}) => {
    const [updatedBag, setUpdatedBag] = useState<BagItem[]>([]);

    const addItem = (item: keyof Provisions, value: number) => {
        setUpdatedBag((prevState) => {
            const newItem: BagItem = {
                name: item,
                count: value
            }
            return [...prevState, newItem];
        })
    }

    const handleItemClick = (index: number) => {
        const item: BagItem = updatedBag[index];
        onItemClick(item.name);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        setUpdatedBag([]);
        if(items != undefined) {
            // check for stacks (i.e. value exceeding max stack count, meaning that the item will take up another slot)
            Object.entries(items).forEach(([key, value]) => {
                const maxStack = isShop ? 99 : PROVISION_MAX_STACK[key as keyof Provisions];
                if(value > maxStack) {  // if amount exceeds maximum amount per item slot,
                    // add the necessary no. of extra slots to the updated bag
                    let tempVal = value;
                    while(tempVal > maxStack) {
                        addItem(key as keyof Provisions, maxStack);
                        tempVal -= maxStack;
                    }
                    addItem(key as keyof Provisions, tempVal);
                } else if(value <= 0) { // exclude items with 0 for value maybe
                    return;
                } else {
                    addItem(key as keyof Provisions, value);
                }
            })
        }
    }, [items])

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-wrap gap-1" style={{width: '600px', height: '300px'}}>
                {updatedBag.map((item: BagItem, index: number) => {
                    return <ItemDisplay
                                key={item.name + index}
                                item={item.name}
                                value={PROVISION_COSTS[item.name]}
                                showValue={isShop}
                                amount={item.count}
                                onClick={handleItemClick.bind(this, index)}
                            />
                })}
            </div>
        </div>
    );
}

export default Bag;
