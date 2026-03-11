"use client"
import { useState } from 'react';
import Image from 'next/image';
import { CURIOS } from '@/data/curios';
import { CurioEntry } from '@/models/wiki';
import WikiGrid from '@/components/Darkest/WikiGrid';
import WikiCard from '@/components/Darkest/WikiCard';
import Modal from '@/components/UI/Modal';

type ColCount = 3 | 5 | 10;

const OUTCOME_COLOR: Record<CurioEntry['baseOutcome'], string> = {
    positive: 'text-green-300',
    negative: 'text-red-400',
    variable: 'text-yellow-400',
};

const CurioModalContent = ({ curio }: { curio: CurioEntry }) => (
    <div>
        <div className="relative aspect-square w-32 rounded bg-cool-gray-80 overflow-hidden mb-4 flex items-center justify-center">
            {curio.imagePath ? (
                <Image src={curio.imagePath} alt={curio.name} fill className="object-contain" sizes="128px" />
            ) : (
                <span className="text-4xl font-bold text-cool-gray-20">{curio.name.charAt(0)}</span>
            )}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
            {curio.dungeons.length > 0
                ? curio.dungeons.map(d => (
                      <span key={d} className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-cool-gray-20">{d}</span>
                  ))
                : <span className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-cool-gray-20">All Dungeons</span>
            }
        </div>
        <p className="text-cool-gray-20 text-sm mb-3">{curio.description}</p>
        <p className={`text-sm mb-4 ${OUTCOME_COLOR[curio.baseOutcome]}`}>
            <span className="text-white font-semibold">Base effect: </span>
            {curio.baseEffect}
        </p>
        {curio.itemInteractions.length > 0 && (
            <div>
                <h3 className="text-white font-semibold text-sm mb-2">Item Interactions</h3>
                <div className="space-y-2">
                    {curio.itemInteractions.map(interaction => (
                        <div key={interaction.item} className="flex gap-2 text-sm">
                            <span className="text-orange-30 font-semibold whitespace-nowrap">{interaction.item}</span>
                            <span className="text-cool-gray-20">→ {interaction.result}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

const CuriosPage = () => {
    const [columns, setColumns] = useState<ColCount>(5);
    const [selected, setSelected] = useState<CurioEntry | null>(null);

    return (
        <div className="flex flex-col p-2">
            <h1 className="font-bold text-xl mb-4">CURIOS</h1>
            <WikiGrid columns={columns} onColumnsChange={setColumns}>
                {CURIOS.map(curio => (
                    <WikiCard
                        key={curio.id}
                        name={curio.name}
                        imagePath={curio.imagePath}
                        tags={curio.tags}
                        onClick={() => setSelected(curio)}
                    />
                ))}
            </WikiGrid>
            <Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
                {selected && <CurioModalContent curio={selected} />}
            </Modal>
        </div>
    );
};

export default CuriosPage;
