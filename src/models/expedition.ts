import { Dungeon, DungeonDifficulty, DungeonLength, GameDifficulty, HeroClasses } from './darkest';

export interface Expedition {

}

// strictly only for things that you would get from the shop prior to an expedition
export interface Provisions {
    food: number;
    shovel: number;
    antivenom: number;
    bandage: number;
    medicinalHerb: number;
    skeletonKey: number;
    holyWater: number;
    laudanum: number;
    torch: number;
    fireWood: number;
    dogTreats: number;
    aegisScale: number;
    curseCure: number;
    theBlood: number;
}

export interface Loot {
    gold: number;
    bust: number;
    crest: number;
    deed: number;
    portrait: number;
    citrine: number;
    onyx: number;
    emerald: number;
    jade: number;
    sapphire: number;
    ruby: number;
    tapestry: number;
    minorAntique: number;
    rareAntique: number;
    pewRelic: number;
    trapezohedron: number;
    shard: number;
}

export interface ProvisionsByDuration {
    [DungeonLength.SHORT]: Provisions;
    [DungeonLength.MEDIUM]: Provisions;
    [DungeonLength.LONG]: Provisions;
}

export interface CostByDuration {
    [DungeonLength.SHORT]: number;
    [DungeonLength.MEDIUM]: number;
    [DungeonLength.LONG]: number;
}

// for 1 specific dungeon type + length
export interface DungeonRecommendation {
    dungeon: Dungeon;
    provisions: ProvisionsByDuration;
    cost: CostByDuration;
    heroes: number[];   // array of hero ids (could change to use custom 'Hero' type)
    tips: string[];
}

export interface SingleDungeonRec {
    dungeon: Dungeon;
    duration: DungeonLength;
    provisions: Provisions;
    cost: number;
    heroes: number[];
    tips: string[];
}

export enum ExpeditionOutcome {
    SUCCESS = 'success',
    FAILURE = 'failure',
    RETREAT = 'retreat',
}

export interface ExpeditionLogEntry {
    id: string;
    userId: string;
    dungeon: Dungeon;
    duration: DungeonLength;
    difficulty: DungeonDifficulty;
    gameDifficulty?: GameDifficulty;
    heroes: HeroClasses[];
    provisions: Provisions;
    outcome: ExpeditionOutcome;
    casualties: HeroClasses[];
    loot: Loot;
    stressNotes: string;
    notes: string;
    rating: number;
    createdAt: string;
}

export interface CreateExpeditionLogDto {
    dungeon: Dungeon;
    duration: DungeonLength;
    difficulty: DungeonDifficulty;
    gameDifficulty?: GameDifficulty;
    heroes: HeroClasses[];
    provisions: Provisions;
    outcome: ExpeditionOutcome;
    casualties: HeroClasses[];
    loot: Loot;
    stressNotes: string;
    notes: string;
    rating: number;
}