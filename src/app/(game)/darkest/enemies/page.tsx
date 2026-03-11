"use client"
import { useState } from 'react';
import Image from 'next/image';
import { ENEMIES } from '@/data/enemies';
import { EnemyEntry } from '@/models/wiki';
import WikiGrid from '@/components/Darkest/WikiGrid';
import WikiCard from '@/components/Darkest/WikiCard';
import Modal from '@/components/UI/Modal';

type ColCount = 3 | 5 | 10;

const EnemyModalContent = ({ enemy }: { enemy: EnemyEntry }) => (
    <div>
        <div className="relative aspect-square w-32 rounded bg-cool-gray-80 overflow-hidden mb-4 flex items-center justify-center">
            {enemy.imagePath ? (
                <Image src={enemy.imagePath} alt={enemy.name} fill className="object-contain" sizes="128px" />
            ) : (
                <span className="text-4xl font-bold text-cool-gray-20">{enemy.name.charAt(0)}</span>
            )}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-cool-gray-20">{enemy.enemyType}</span>
            <span className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-orange-30">{enemy.combatStyle}</span>
            {enemy.ranks.map(r => (
                <span key={r} className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-cool-gray-20">Rank {r}</span>
            ))}
            {enemy.dungeons.map(d => (
                <span key={d} className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-cool-gray-20">{d}</span>
            ))}
        </div>
        <p className="text-cool-gray-20 text-sm mb-4">{enemy.description}</p>
        <div className="mb-4">
            <h3 className="text-white font-semibold text-sm mb-2">Abilities</h3>
            <ul className="space-y-2">
                {enemy.abilities.map(a => (
                    <li key={a.name} className="text-sm">
                        <span className="font-semibold text-orange-30">{a.name}</span>
                        <span className="text-cool-gray-20"> — {a.description}</span>
                    </li>
                ))}
            </ul>
        </div>
        {enemy.tips.length > 0 && (
            <div>
                <h3 className="text-white font-semibold text-sm mb-2">Tips</h3>
                <ul className="space-y-1 list-disc list-inside">
                    {enemy.tips.map((tip, i) => (
                        <li key={i} className="text-cool-gray-20 text-sm">{tip}</li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);

const EnemiesPage = () => {
    const [columns, setColumns] = useState<ColCount>(5);
    const [selected, setSelected] = useState<EnemyEntry | null>(null);

    return (
        <div className="flex flex-col p-2">
            <h1 className="font-bold text-xl mb-4">ENEMIES</h1>
            <WikiGrid columns={columns} onColumnsChange={setColumns}>
                {ENEMIES.map(enemy => (
                    <WikiCard
                        key={enemy.id}
                        name={enemy.name}
                        imagePath={enemy.imagePath}
                        tags={enemy.tags}
                        onClick={() => setSelected(enemy)}
                    />
                ))}
            </WikiGrid>
            <Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
                {selected && <EnemyModalContent enemy={selected} />}
            </Modal>
        </div>
    );
};

export default EnemiesPage;
