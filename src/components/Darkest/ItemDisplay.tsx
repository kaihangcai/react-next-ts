import { Provisions } from "@/models/expedition";
import { FOOD_IMG_SRC, GOLD_IMG_SRC, PROVISION_IMG_SRC } from "@/utils/Constants/image";
import Image from "next/image";

interface ItemDisplayProps {
    item: keyof Provisions;
    amount: number;     // count
    value: number;      // $$ amount
    showValue: boolean;
    onClick: () => void;
}

const ItemDisplay: React.FC<ItemDisplayProps> = ({
    item,
    amount,
    value,
    showValue=false,
    onClick,
}) => {
    const provision = item == "food" ? checkFood(amount) : checkItem(item);

    return (
        <div className="cursor-pointer relative" onClick={onClick}>
            <Image src={provision} alt={item} width={64} height={128} />
            <p style={{position: 'absolute', left: '12px', top: '8px', color: 'yellow', fontSize: '18px', zIndex: 1}}>{amount > 1 ? amount : ""}</p>
            {showValue && (
                <div className="flex justify-center gap-1">
                    <Image src={GOLD_IMG_SRC.coin} alt={"coin"} width={20} height={20}/>
                    <p style={{textAlign: 'center', color: 'gold'}}>{value}</p>
                </div>
            )}
        </div>
    );
}

const checkItem = (item: keyof Provisions) => {
    return PROVISION_IMG_SRC[item];
}

const checkFood = (amount: number) => {
    if(amount > 8) return FOOD_IMG_SRC.foodHigh;
    else if(amount > 4) return FOOD_IMG_SRC.foodMed;
    else return FOOD_IMG_SRC.foodLow;
}

export default ItemDisplay;
