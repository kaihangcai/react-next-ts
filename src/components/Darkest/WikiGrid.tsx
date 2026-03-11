interface WikiGridProps {
    columns: 3 | 5 | 10;
    onColumnsChange: (c: 3 | 5 | 10) => void;
    children: React.ReactNode;
}

const COLS_CLASS: Record<3 | 5 | 10, string> = {
    3:  'grid-cols-3',
    5:  'grid-cols-5',
    10: 'grid-cols-10',
};

const COLUMN_OPTIONS: (3 | 5 | 10)[] = [3, 5, 10];

const WikiGrid: React.FC<WikiGridProps> = ({ columns, onColumnsChange, children }) => {
    return (
        <div>
            <div className="flex gap-2 mb-4">
                {COLUMN_OPTIONS.map(c => (
                    <button
                        key={c}
                        onClick={() => onColumnsChange(c)}
                        className={`px-3 py-1 rounded border text-sm transition-colors ${
                            columns === c
                                ? 'border-orange-30 text-orange-30 bg-cool-gray-90'
                                : 'border-cool-gray-80 text-cool-gray-20 hover:border-orange-30 hover:text-orange-30'
                        }`}
                    >
                        {c}
                    </button>
                ))}
            </div>
            <div className={`grid gap-3 ${COLS_CLASS[columns]}`}>
                {children}
            </div>
        </div>
    );
};

export default WikiGrid;
