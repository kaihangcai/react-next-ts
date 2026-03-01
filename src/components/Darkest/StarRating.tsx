"use client"

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
    value: number;
    onChange?: (rating: number) => void;
    readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, readOnly = false }) => {
    const [hoverIndex, setHoverIndex] = useState(-1);

    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => {
                const filled = hoverIndex >= 0 ? i <= hoverIndex : i < value;
                return (
                    <Star
                        key={i}
                        size={20}
                        fill={filled ? "#F7BA50" : "transparent"}
                        color={filled ? "#F7BA50" : "#BBC5D0"}
                        className={readOnly ? "" : "cursor-pointer"}
                        onClick={() => !readOnly && onChange?.(i + 1)}
                        onMouseEnter={() => !readOnly && setHoverIndex(i)}
                        onMouseLeave={() => !readOnly && setHoverIndex(-1)}
                    />
                );
            })}
        </div>
    );
};

export default StarRating;
