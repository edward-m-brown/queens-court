import to_town from '../images/to_castle_town.jpg'
import blacksmith from '../images/blacksmith.jpg'
import fields_quest from '../images/fields_quest.jpg'
import to_fields from '../images/to_fields.jpg'
import temple from '../images/temple.jpg'

/** 
 * directions will be used to map the index of each tile with a cardinal
 * direction (plus one extra for center).
 * Each map will define what can be found at each index.
 */ 
const directions = [
    ['North-West', 'North', 'North-East'], // row 0
    ['West', 'Center','East'],             // row 1
    ['South-West', 'South', 'South-East']  // row 2
];

/**
 * Current map implementation has the map itself defining all of the fields
 * that make up an Encounter, Location, or Interaction.
 * We may want to turn these into actual components.
 * The components might want to inherit from Tile and then we would define
 * all of their variables when we create the component.
 * 
 * For now, each entry in the world_map is tied to other locations through
 * the Name. If the type is "Location", the map will be changed to the map
 * with the location's name.
 * This means we have to be very careful about the "name" property and making
 * sure it aligns with one of the keys in world_map.
 */
const world_map = {
    "Plains":
        {"map": [
            null, /* North-West */
            null, /* North */
            {image: to_town, name: 'Castle Town', cost: 0, type: 'Location'}, /* North-East */
            null, /* West */
            {image: fields_quest, name: 'Fields', cost: 1, type: 'Encounter'}, /* Center */
            {image: temple, name: 'Temple', cost: 0, type: 'Interaction'}, /* East */
            {image: 'dark-forest-image', name: 'Dark Forest', cost: 1, type: 'Location', discovered: false, level: 5}, /* South-West */
            {image: 'goblin-caves-image', name: 'Goblin Caves', cost: 1, type: 'Location', discovered: false, level: 10}, /* South */
            null, /* South-East */
        ],
        "background_color": '#917029'},
    "Castle Town":
        {"map": [
            null, /* North-West */
            null, /* North */
            {image: blacksmith, name: 'Smithy', cost: 0, type: 'Interaction'}, /* North-East */
            null, /* West */
            null, /* Center */
            null, /* East */
            {image: to_fields, name: 'Plains', cost: 0, type: 'Location'}, /* South-West */
            null, /* South */
            null, /* South-East */
        ],
        "background_color": '#54872f'},
};

export {world_map, directions};