"use client"

import Image from "next/image";

interface ClickableItemGridProps {
    counts: Record<string, number>;
    images: Record<string, string>;
    labels: Record<string, string>;
    maxPerItem?: Record<string, number>;
    onChange: (key: string, delta: 1 | -1) => void;
}

const ClickableItemGrid: React.FC<ClickableItemGridProps> = ({
    counts,
    images,
    labels,
    maxPerItem,
    onChange,
}) => {
    return (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {Object.keys(images).map(key => {
                const count = counts[key] ?? 0;
                const max = maxPerItem ? (maxPerItem[key] ?? Infinity) : Infinity;

                return (
                    <div
                        key={key}
                        className={`relative cursor-pointer select-none ${count > 0 ? "opacity-100" : "opacity-40"}`}
                        title={labels[key] ?? key}
                        onClick={() => {
                            if (count < max) onChange(key, 1);
                        }}
                        onContextMenu={e => {
                            e.preventDefault();
                            if (count > 0) onChange(key, -1);
                        }}
                    >
                        <Image
                            src={images[key]}
                            alt={labels[key] ?? key}
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        {count > 0 && (
                            <span className="absolute top-0 right-0 text-xs font-bold text-white bg-cool-gray-100 rounded px-1 leading-none pointer-events-none">
                                {count}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ClickableItemGrid;
