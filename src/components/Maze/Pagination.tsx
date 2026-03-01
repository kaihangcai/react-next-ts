"use client"

import { useCallback, useEffect } from "react";

const pageSize = 1;

interface GamePaginationProps {
    updateGrid: (page: number) => void;
    curPage: number;
    pageCount: number;
}

/*
    Idea: GamePagination is purely used to display the current active grid AND the total number of available grids (a.k.a maps)
        - 2 methods of navigating to different pages:
            1. keybinds [q] -> prev page and [e] -> next page
            2. directly clicking the page buttons in Pagination
*/
const GamePagination: React.FC<GamePaginationProps> = ({ updateGrid, curPage, pageCount }) => {
    // page given here is NOT 0-indexed
    const handlePageChange = useCallback((page: number) => {
        updateGrid(page);
    }, [updateGrid])

    // To trigger an onChange when curPage changes (strictly via key presses that change the value of curPage)
    useEffect(() => {
        handlePageChange(curPage)
    }, [curPage, handlePageChange])

    const totalPages = Math.ceil(pageCount / pageSize);

    return (
        <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                        page === curPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                >
                    {page}
                </button>
            ))}
        </div>
    )
}

export default GamePagination;
