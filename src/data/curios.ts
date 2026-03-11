import { Dungeon } from '@/models/darkest';
import { CurioEntry } from '@/models/wiki';

export const CURIOS: CurioEntry[] = [
    {
        id: 'eldritch-altar',
        name: 'Eldritch Altar',
        dungeons: [Dungeon.COVE],
        description: 'A dark altar dedicated to nameless sea-gods. Interacting with it without purification risks afflicting a hero with a random negative quirk.',
        baseEffect: 'A random hero gains a negative quirk.',
        baseOutcome: 'negative',
        itemInteractions: [
            { item: 'Holy Water', result: 'Hero gains a positive quirk instead.' },
            { item: 'Eldritch Medallion', result: 'Receive a random trinket.' },
        ],
        tags: [
            { label: 'Negative', color: 'text-red-400' },
            { label: 'Cove', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'locked-strongbox',
        name: 'Locked Strongbox',
        dungeons: [],
        description: 'A heavy iron chest found in all dungeons. Without a key it must be forced open, which may trigger a trap.',
        baseEffect: 'Receive gold — or trigger a trap dealing damage and stress.',
        baseOutcome: 'variable',
        itemInteractions: [
            { item: 'Skeleton Key', result: 'Open safely; receive guaranteed gold and gems.' },
        ],
        tags: [
            { label: 'Variable', color: 'text-yellow-400' },
            { label: 'All Dungeons', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'moonshine-barrel',
        name: 'Moonshine Barrel',
        dungeons: [Dungeon.WEALD],
        description: 'A rotting barrel of potent backwoods spirit. Heroes who sample it directly may suffer negative quirks or become intoxicated.',
        baseEffect: 'A random hero gains a negative quirk or becomes Tipsy.',
        baseOutcome: 'negative',
        itemInteractions: [
            { item: 'Shovel', result: 'Safely tap the barrel; receive Medicinal Herbs.' },
        ],
        tags: [
            { label: 'Negative', color: 'text-red-400' },
            { label: 'Weald', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'pile-of-bones',
        name: 'Pile of Bones',
        dungeons: [Dungeon.RUINS],
        description: 'Skeletal remains scattered across the dungeon floor. Searching them bare-handed risks spreading disease among the party.',
        baseEffect: 'A random hero contracts a disease.',
        baseOutcome: 'negative',
        itemInteractions: [
            { item: 'Holy Water', result: 'Purify the bones; receive loot and no disease.' },
            { item: 'Shovel', result: 'Dig safely; chance of gold or gems.' },
        ],
        tags: [
            { label: 'Negative', color: 'text-red-400' },
            { label: 'Ruins', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'mouldy-tome',
        name: 'Mouldy Tome',
        dungeons: [],
        description: 'An ancient book covered in fungal growth. Reading it without light causes a random effect — enlightenment or madness.',
        baseEffect: 'Random hero gains or loses quirks; or receives stress.',
        baseOutcome: 'variable',
        itemInteractions: [
            { item: 'Torch', result: 'Read safely in good light; hero gains a positive quirk.' },
        ],
        tags: [
            { label: 'Variable', color: 'text-yellow-400' },
            { label: 'All Dungeons', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'torture-rack',
        name: 'Torture Rack',
        dungeons: [Dungeon.WARRENS, Dungeon.WEALD],
        description: 'A grotesque device used by the dungeon\'s denizens. Heroes who interact with it without herbs suffer injury and stress.',
        baseEffect: 'A random hero is damaged and stressed.',
        baseOutcome: 'negative',
        itemInteractions: [
            { item: 'Medicinal Herbs', result: 'Dismantle safely; a hero is healed instead.' },
        ],
        tags: [
            { label: 'Negative', color: 'text-red-400' },
            { label: 'Warrens', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'shallow-grave',
        name: 'Shallow Grave',
        dungeons: [Dungeon.WEALD],
        description: 'A recently disturbed burial mound. Digging with bare hands risks releasing plague spores or cursed spirits.',
        baseEffect: 'Random hero suffers disease or a negative quirk.',
        baseOutcome: 'negative',
        itemInteractions: [
            { item: 'Shovel', result: 'Excavate safely; receive gold and loot.' },
        ],
        tags: [
            { label: 'Negative', color: 'text-red-400' },
            { label: 'Weald', color: 'text-cool-gray-20' },
        ],
    },
    {
        id: 'bas-relief',
        name: 'Bas-Relief',
        dungeons: [Dungeon.RUINS],
        description: 'An ornate stone carving on the dungeon wall depicting ancient rituals. Touching it without cleansing may afflict a hero.',
        baseEffect: 'A random hero gains a negative quirk.',
        baseOutcome: 'negative',
        itemInteractions: [
            { item: 'Holy Water', result: 'Bless the relief; hero gains a positive quirk.' },
        ],
        tags: [
            { label: 'Negative', color: 'text-red-400' },
            { label: 'Ruins', color: 'text-cool-gray-20' },
        ],
    },
];
