import Image from 'next/image';
import { WikiTag } from '@/models/wiki';

interface WikiCardProps {
    name: string;
    imagePath?: string;
    tags: WikiTag[];
    onClick: () => void;
}

const WikiCard: React.FC<WikiCardProps> = ({ name, imagePath, tags, onClick }) => {
    return (
        <div
            className="bg-cool-gray-90 rounded-lg p-2 border border-cool-gray-80 cursor-pointer hover:border-orange-30 transition-colors"
            onClick={onClick}
        >
            <div className="relative aspect-square w-full rounded bg-cool-gray-80 overflow-hidden mb-2 flex items-center justify-center">
                {imagePath ? (
                    <Image
                        src={imagePath}
                        alt={name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 33vw, 20vw"
                    />
                ) : (
                    <span className="text-2xl font-bold text-cool-gray-20">
                        {name.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <p className="text-white text-sm font-semibold text-center truncate">{name}</p>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className={`text-xs px-1.5 py-0.5 rounded bg-cool-gray-80 ${tag.color ?? 'text-cool-gray-20'}`}
                    >
                        {tag.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default WikiCard;
