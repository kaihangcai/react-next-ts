"use client"
import { useState } from 'react';
import Image from 'next/image';
import { HEROES } from '@/data/heroes';
import { HeroEntry } from '@/models/wiki';
import WikiGrid from '@/components/Darkest/WikiGrid';
import WikiCard from '@/components/Darkest/WikiCard';
import Modal from '@/components/UI/Modal';

type ColCount = 3 | 5 | 10;

const HeroModalContent = ({ hero }: { hero: HeroEntry }) => (
    <div>
        <div className="relative aspect-square w-32 rounded bg-cool-gray-80 overflow-hidden mb-4 flex items-center justify-center">
            {hero.imagePath ? (
                <Image src={hero.imagePath} alt={hero.name} fill className="object-contain" sizes="128px" />
            ) : (
                <span className="text-4xl font-bold text-cool-gray-20">{hero.name.charAt(0)}</span>
            )}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-orange-30">{hero.combatStyle}</span>
            {hero.positions.map(p => (
                <span key={p} className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-cool-gray-20">Rank {p}</span>
            ))}
        </div>
        <p className="text-cool-gray-20 text-sm mb-4">{hero.description}</p>
        {hero.bestDungeons.length > 0 && (
            <div className="mb-4">
                <h3 className="text-white font-semibold text-sm mb-1">Best Dungeons</h3>
                <div className="flex flex-wrap gap-2">
                    {hero.bestDungeons.map(d => (
                        <span key={d} className="text-xs px-2 py-1 rounded bg-cool-gray-80 text-cool-gray-20">{d}</span>
                    ))}
                </div>
            </div>
        )}
        <div>
            <h3 className="text-white font-semibold text-sm mb-2">Abilities</h3>
            <ul className="space-y-2">
                {hero.abilities.map(a => (
                    <li key={a.name} className="text-sm">
                        <span className="font-semibold text-orange-30">{a.name}</span>
                        <span className="text-cool-gray-20"> — {a.description}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const HeroesPage = () => {
    const [columns, setColumns] = useState<ColCount>(5);
    const [selected, setSelected] = useState<HeroEntry | null>(null);

    return (
        <div className="flex flex-col p-2">
            <h1 className="font-bold text-xl mb-4">HEROES</h1>
            <WikiGrid columns={columns} onColumnsChange={setColumns}>
                {HEROES.map(hero => (
                    <WikiCard
                        key={hero.heroClass}
                        name={hero.name}
                        imagePath={hero.imagePath}
                        tags={hero.tags}
                        onClick={() => setSelected(hero)}
                    />
                ))}
            </WikiGrid>
            <Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
                {selected && <HeroModalContent hero={selected} />}
            </Modal>
        </div>
    );
};

export default HeroesPage;
