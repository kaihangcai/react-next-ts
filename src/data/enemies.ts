import { Dungeon } from '@/models/darkest';
import { EnemyEntry } from '@/models/wiki';

export const ENEMIES: EnemyEntry[] = [
    {
        id: 'bone-soldier',
        name: 'Bone Soldier',
        dungeons: [Dungeon.RUINS],
        enemyType: 'Undead',
        combatStyle: 'Melee',
        ranks: [1, 2],
        description: 'A skeletal warrior that forms the backbone of undead forces in the Ruins. Capable of guarding allied back-rank units.',
        abilities: [
            { name: 'Bone Slash', description: 'Standard melee attack from ranks 1–2.' },
            { name: 'Rampart', description: 'Guard an allied back-rank enemy, redirecting attacks.' },
        ],
        tips: [
            'Use Vestal or Crusader for bonus damage against undead.',
            'Prioritise killing guarded allies before targeting the soldier.',
            'Blight and bleed are less effective — focus on direct damage.',
        ],
        tags: [
            { label: 'Undead', color: 'text-cool-gray-20' },
            { label: 'Melee', color: 'text-orange-30' },
            { label: 'Ruins', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'gargoyle',
        name: 'Gargoyle',
        dungeons: [Dungeon.RUINS],
        enemyType: 'Unholy',
        combatStyle: 'Melee',
        ranks: [1, 2],
        description: 'A stone-skinned beast with high PROT that can enrage to dramatically increase its damage output. Dangerous when ignored.',
        abilities: [
            { name: 'Stone Claw', description: 'Heavy melee attack from rank 1.' },
            { name: 'Enrage', description: 'Self-buff that greatly increases damage dealt.' },
        ],
        tips: [
            'Use Shieldbreaker\'s Pierce to bypass high PROT.',
            'Stun before it can Enrage if possible.',
            'Holy damage from Vestal deals bonus damage vs Unholy.',
        ],
        tags: [
            { label: 'Unholy', color: 'text-yellow-400' },
            { label: 'Melee', color: 'text-orange-30' },
            { label: 'Ruins', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'swine-slasher',
        name: 'Swine Slasher',
        dungeons: [Dungeon.WARRENS],
        enemyType: 'Beast',
        combatStyle: 'Melee',
        ranks: [1, 2],
        description: 'An aggressive porcine warrior that applies bleed with its cleaving attacks. Common in the Warrens and dangerous in packs.',
        abilities: [
            { name: 'Cleave', description: 'Melee attack that applies bleed to front ranks.' },
            { name: 'Tackle', description: 'Pushes a hero backward and deals damage.' },
        ],
        tips: [
            'Plague Doctor can cure bleed and retaliate with blight.',
            'Bleed and blight both work well against beasts.',
            'Watch for rank displacement disrupting party formation.',
        ],
        tags: [
            { label: 'Beast', color: 'text-green-300' },
            { label: 'Melee', color: 'text-orange-30' },
            { label: 'Warrens', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'fungal-scrub',
        name: 'Fungal Scrub',
        dungeons: [Dungeon.WEALD],
        enemyType: 'Eldritch',
        combatStyle: 'Ranged',
        ranks: [3, 4],
        description: 'A spore-spewing back-rank creature that applies blight to heroes at range. Its Spore Cloud ability can hit multiple party members.',
        abilities: [
            { name: 'Spore Shot', description: 'Ranged blight attack against any hero rank.' },
            { name: 'Spore Cloud', description: 'AoE blight applied to the entire party.' },
        ],
        tips: [
            'Eliminate quickly — prolonged blight stacks are dangerous.',
            'Occultist deals bonus damage vs Eldritch.',
            'Bring Plague Doctor for blight cures.',
        ],
        tags: [
            { label: 'Eldritch', color: 'text-purple-300' },
            { label: 'Ranged', color: 'text-blue-300' },
            { label: 'Weald', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'drowned-crew',
        name: 'Drowned Crew',
        dungeons: [Dungeon.COVE],
        enemyType: 'Undead',
        combatStyle: 'Melee',
        ranks: [1, 2],
        description: 'Waterlogged undead sailors that apply bleed and can drag heroes into vulnerable positions with Pull attacks.',
        abilities: [
            { name: 'Corroded Blade', description: 'Melee bleed attack from rank 1.' },
            { name: 'Undertow', description: 'Pull a hero to rank 1, disrupting formation.' },
        ],
        tips: [
            'Vestal and Crusader bonus damage applies here.',
            'Maintain party formation — guard heroes who might be pulled.',
            'Bleed cures from Plague Doctor prevent damage stacking.',
        ],
        tags: [
            { label: 'Undead', color: 'text-cool-gray-20' },
            { label: 'Melee', color: 'text-orange-30' },
            { label: 'Cove', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'cultist-brawler',
        name: 'Cultist Brawler',
        dungeons: [Dungeon.FARMSTEAD],
        enemyType: 'Human',
        combatStyle: 'Melee',
        ranks: [1, 2],
        description: 'A fanatical devotee of the Bloodmoon. High damage and stress-dealing attacks make them dangerous in the time-pressure Farmstead environment.',
        abilities: [
            { name: 'Frenzied Swing', description: 'High-damage melee attack with stress.' },
            { name: 'Rabid Charge', description: 'Move forward and attack; applies bleed.' },
        ],
        tips: [
            'Bounty Hunter\'s bonus damage vs humans is highly effective.',
            'Prioritise stress healing — Jester or Crusader recommended.',
            'Stun and bleed work normally against human enemies.',
        ],
        tags: [
            { label: 'Human', color: 'text-blue-300' },
            { label: 'Melee', color: 'text-orange-30' },
            { label: 'Farmstead', color: 'text-cool-gray-20' },
        ],
    },
];
