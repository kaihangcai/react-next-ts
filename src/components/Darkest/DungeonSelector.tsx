import { Dungeon } from "@/models/darkest";
import { COLORS } from "@/utils/color";
import Image from "next/image";

interface DungeonSelectorProps {
    selected: Dungeon | undefined;
    handleClick: (dungeon: Dungeon) => void;
}

const DungeonSelector: React.FC<DungeonSelectorProps> = ({ selected, handleClick }) => {
    const renderButtons = () => {
        return Object.keys(Dungeon).map((key) => {
            const active = selected ? Dungeon[key as keyof typeof Dungeon] === selected : false;

            return (
                <div
                    key={key}
                    className="cursor-pointer"
                    onClick={handleClick.bind(null, Dungeon[key as keyof typeof Dungeon])}
                >
                    <div className="flex flex-col justify-center items-center">
                        <Image src={active ? '/darkest/torch_100.png' : '/darkest/torch_0.png'} alt={active ? 'Active' : 'Inactive'} width={40} height={55} />
                        <span style={{color: `${active ? COLORS.ORANGE_30 : 'white'}`, fontSize: '16px', lineHeight: '14px', fontWeight: '600', textAlign: 'center'}}>{Dungeon[key as keyof typeof Dungeon]}</span>
                    </div>
                </div>
            );
        })
    }

    return (
        <div className="flex justify-center items-center gap-1 flex-wrap">
            {renderButtons()}
        </div>
    );
}

export default DungeonSelector;
