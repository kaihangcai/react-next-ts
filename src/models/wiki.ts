import { Dungeon, HeroClasses } from './darkest';

export interface WikiTag {
    label: string;
    color?: string; // Tailwind text-color class, e.g. "text-orange-30"
}

export type CombatStyle = 'Melee' | 'Ranged' | 'Support' | 'Hybrid';

export interface HeroAbility {
    name: string;
    description: string;
}

export interface HeroEntry {
    heroClass: HeroClasses;
    name: string;
    combatStyle: CombatStyle;
    positions: number[];         // attacking positions (1 = front, 4 = back)
    bestDungeons: Dungeon[];
    description: string;
    abilities: HeroAbility[];
    imagePath?: string;
    tags: WikiTag[];             // max 3, pre-computed
}

export type EnemyType = 'Undead' | 'Beast' | 'Eldritch' | 'Human' | 'Unholy';

export interface EnemyAbility {
    name: string;
    description: string;
}

export interface EnemyEntry {
    id: string;                  // kebab-case slug, used as React key
    name: string;
    dungeons: Dungeon[];
    enemyType: EnemyType;
    combatStyle: 'Melee' | 'Ranged' | 'Support';
    ranks: number[];             // positions this enemy occupies (1 = front)
    description: string;
    abilities: EnemyAbility[];
    tips: string[];
    imagePath?: string;
    tags: WikiTag[];
}

export interface CurioItemInteraction {
    item: string;                // e.g. "Holy Water", "Skeleton Key"
    result: string;
}

export interface CurioEntry {
    id: string;
    name: string;
    dungeons: Dungeon[];         // empty = all dungeons
    description: string;
    baseEffect: string;
    baseOutcome: 'positive' | 'negative' | 'variable';
    itemInteractions: CurioItemInteraction[];
    imagePath?: string;
    tags: WikiTag[];
}
