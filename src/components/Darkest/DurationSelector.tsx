import { DungeonLength } from "@/models/darkest";
import { COLORS } from "@/utils/color";
import Image from "next/image";

interface DurationSelectorProps {
    selected: DungeonLength | undefined;
    handleClick: (duration: DungeonLength) => void;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({ selected, handleClick }) => {
    const renderButtons = () => {
        return Object.keys(DungeonLength).map((key) => {
            const active = selected ? DungeonLength[key as keyof typeof DungeonLength] === selected : false;

            return (
                <div
                    key={key}
                    className="cursor-pointer"
                    onClick={handleClick.bind(null, DungeonLength[key as keyof typeof DungeonLength])}
                >
                    <div className="flex flex-col justify-center items-center">
                        <Image src={active ? '/darkest/torch_100.png' : '/darkest/torch_0.png'} alt={active ? 'Active' : 'Inactive'} width={40} height={55} />
                        <span style={{color: `${active ? COLORS.ORANGE_30 : 'white'}`, fontSize: '20px', lineHeight: '14px', fontWeight: '600', textTransform: 'capitalize'}}>{DungeonLength[key as keyof typeof DungeonLength]}</span>
                    </div>
                </div>
            );
        })
    }

    return (
        <div className="flex justify-center items-center gap-2">
            {renderButtons()}
        </div>
    );
}

export default DurationSelector;
