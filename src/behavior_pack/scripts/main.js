// TREENESTS ADDON

import {
   world,
   system,
   ItemStack,
	BlockPermutation,
	LocationInUnloadedChunkError
} from "@minecraft/server";

import { log, warn } from "./logger.js";
import { loadWorldData, saveWorldData } from './world_data_save.js';

// @@@@@@@@@@@@ Random number generator world current world seed
function random2(a, b) {
  let h = Number(world.seed);

  h ^= Math.imul(a | 0, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 16), 0xc2b2ae35);

  h ^= Math.imul(b | 0, 0x27d4eb2d);
  h = Math.imul(h ^ (h >>> 13), 0x165667b1);

  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;

  return (h >>> 0) / 4294967296;
}

//TODO consider moving randomization stuff into a different file
/**
 * Function that generates a random float based on the world coordinates
 * @param x
 * @param z
 * @returns {*}
 */
function world_random( x, z ) {
	//return Math.random();
	return random2( x, z );
}



// @@@@@@@@@@@@ Important constsants
const NEST_BLOCK = "tree_nests:nest";
const LOOT_TABLE = "tree_nests/nest";

const INTERACT_ITEM = "minecraft:brush";
const DEFAULT_ITEM = "minecraft:stick";


const HOLLOW_CHANCE = 0.01; // [0,1] float 
const INHABITANT_CHANCE = 0.25; // [0,1] float 


// @@@@@@@ Data storage
world.afterEvents.worldLoad.subscribe((event) => {
	loadWorldData( "tree_nests", processed_chunks );
});


// @@@@@@@@@@@@ Interaction with block
world.afterEvents.playerInteractWithBlock.subscribe((event) => {

	
	const player = event.player;
	const block = event.block;
	const item = event.itemStack;
	
	
	// Nest can only be interacted with once
	if( block.typeId !== NEST_BLOCK || item.typeId !== INTERACT_ITEM ) {
		return;
	}
	if ( block.permutation.getState("tree_nests:is_empty") === true ) return;
	
	
	// Get the front coordinates of the nest
	//todo: make separate spawn locations for each cardinal direction
	const spawn_location = {
		x: block.location.x,
		y: block.location.y,
		z: block.location.z
	};
	
	
	// If no mob is in the nest
	if ( block.permutation.getState("tree_nests:inhabitant") === "empty" ) {
	
		// Generate item from loot table
		// todo: consider making more than one
		const loot_table = world.getLootTableManager().getLootTable(LOOT_TABLE);
		let loot = world.getLootTableManager().generateLootFromTable(loot_table); //handle unregistered items somehwere here
		if (loot[0] === undefined) {
			loot = [new ItemStack(DEFAULT_ITEM, 1)]; //handl
		}
		
		
		// Spawn item in the world
		for (let entry of loot) {
			block.dimension.spawnItem( entry, spawn_location );
		}
	
	} else {
	
		// Spawn nest inhabitant in the world
		//todo: get the state and summon THAT mob
		const inhabitant_list = [
			"minecraft:parrot",
			"minecraft:chicken"
		];
		const random_entity = inhabitant_list[ Math.floor( world_random( block.location.x, block.location.z ) * inhabitant_list.length ) ];
		block.dimension.spawnEntity( random_entity, spawn_location );
		block.setPermutation( block.permutation.withState("tree_nests:inhabitant", "empty") );
	}
	
	
	block.setPermutation( block.permutation.withState("tree_nests:is_empty", true) ); //todo: maybe different texture? also more states, maybe enchanted, bird inside, etc
	
	// Apply damage to brush item
	const container = player.getComponent("minecraft:inventory").container;
	const slot = player.selectedSlotIndex;
   const brush_item = container.getItem( slot );
   const durability = brush_item.getComponent("minecraft:durability");
	durability.damage = durability.damage + 1;
   container.setItem( slot, brush_item );
});



// @@@@@@@@@@@@ Block spawning


const direction_vector = { 
	north: { x: 0, y: 0, z: 1 }, 
	south: { x: 0, y: 0, z: -1 }, 
	east: { x: -1, y: 0, z: 0 }, 
	west: { x: 1, y: 0, z: 0 } 
};


/**
 * Detect a pillar of log blocks
 * @param top_block
 * @returns {*[]} array of blocks valid for nest placement
 */
function detectTrunk( top_block ) {
	const dimension = top_block.dimension
	let block_it = top_block;
	const logs = [];
	
	while ( block_it.typeId.endsWith("_log") ) {
		let flagged = false;
		for (const [direction, vector] of Object.entries(direction_vector)) {
			const neighbor = dimension.getBlock({
				x: block_it.location.x + vector.x,
				y: block_it.location.y + vector.y,
				z: block_it.location.z + vector.z
			});
			
			//todo: make a set of allowed blocks + tag system if possible for blocks
			if ( neighbor.typeId !== "minecraft:air" && neighbor.typeId !== "minecraft:vine" ) flagged = true; // or not leaves
		}

		if (!flagged) {
			logs.push(block_it);
		}
		
		
		block_it = dimension.getBlock({
			x: block_it.location.x,
			y: block_it.location.y - 1,
			z: block_it.location.z
		});
	}
	
	if ( logs.length > 1 )logs.pop(0);
	return logs;
}

/**
 *
 * @param location
 * @param chance
 * @returns {boolean}
 */
function randomWorldChance( location, chance ) {
	return world_random( location.x, location.z ) / HOLLOW_CHANCE < chance;
}


/**
 *
 * @param x
 * @param z
 * @returns {string}
 */
export function randomCardinalDirection( x, z ) { 
	const directions = [ "north", "south", "east", "west" ]; 
	return directions[Math.floor( (world_random(x,z)/HOLLOW_CHANCE) * directions.length)];
}


/**
 * Places a nest block on the randomly picked side of a log block
 * @param dimension
 * @param trunk_coords location member of a block object
 * @returns {*}
 */
function placeNest( dimension, trunk_coords ) {
	const rand_dir = randomCardinalDirection( trunk_coords.x, trunk_coords.z ); 
	const offset = direction_vector[rand_dir];
	
	const nest_coords = { 
		x: trunk_coords.x + offset.x, 
		y: trunk_coords.y + offset.y, 
		z: trunk_coords.z + offset.z 
	}; 
	
	dimension.setBlockType( nest_coords, NEST_BLOCK ); 
	const nest_block = dimension.getBlock(nest_coords); 
	//if (!newBlock) { return undefined; } 
	
	// Pick random facing direction for the nest
	const permutation = BlockPermutation.resolve( NEST_BLOCK, { "minecraft:cardinal_direction": rand_dir } ); 	nest_block.setPermutation(permutation); 
	
	// Put a mob in the nest
	if ( randomWorldChance(trunk_coords, INHABITANT_CHANCE) ) {
		//todo: roll a random mob
		//todo: make tag driven
		const permutation = nest_block.permutation.withState( "tree_nests:inhabitant", "mystery" );
		nest_block.setPermutation( permutation );
	}
		
	return nest_block;
}


/**
 *
 * @param dimension
 * @param chunkX
 * @param chunkZ
 */
function scanForTrees(dimension, chunkX, chunkZ) {
    const startX = chunkX * 16;
    const startZ = chunkZ * 16;

    for (let x = startX; x < startX + 16; x++) {
        for (let z = startZ; z < startZ + 16; z++) {

				//console.log(world_random(x,z) >= HOLLOW_CHANCE);
				//if ( world_random(x,z) >= HOLLOW_CHANCE ) continue; 
				if ( Math.floor(world_random(x,z) / HOLLOW_CHANCE) !== 0 ) continue;
				
            const top_block = dimension.getTopmostBlock({ x, z });
            if (!top_block) continue;

            if( top_block.typeId.endsWith("_log") && top_block.permutation.getState("pillar_axis") === "y" ) { //access error on teleportation here LocationInUnloadedChunkError:

					const logs = detectTrunk( top_block );
					
					if (logs.length > 0) {
						const random_y = Math.floor( world_random(x,z) * logs.length );
						placeNest( dimension, logs[random_y] );
					}
				}
				
        }
    }
}

const processed_chunks = new Set();
// Check if chunk if new

/**
 *
 */
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
    	const chunkX = Math.floor(player.location.x / 16);
      const chunkZ = Math.floor(player.location.z / 16);

		//if (processed_chunks.has(`${chunkX},${chunkZ})`) return;

		for ( let x = -2; x < 3; x++ ) {
			for ( let z = -2; z < 3; z++ ) {
				const key = `${chunkX+x},${chunkZ+z}`;
					
				if (!processed_chunks.has( key )) { 
					try {
						saveWorldData( "tree_nests", processed_chunks ); //access error on teleportation here
						scanForTrees(player.dimension, chunkX+x, chunkZ+z); 
						processed_chunks.add( key );
					}
					catch (error) {
						if ( error instanceof LocationInUnloadedChunkError ) {
							console.warn("Tried to access unloaded chunk, not adding it to processed yet");
						}
						else throw error;
					}

					
				}   
			}
		}
   }
	
}, 1);


/// debug
/*
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (!player.isSneaking) continue;

			
			if (player.getComponent("minecraft:equippable")
    ?.getEquipment("Offhand")?.typeId !== "minecraft:arrow") return;

			let r = world_random(player.location.x, player.location.z);
			
        //console.log( player.location.x, player.location.z, r*4 );
    }
}, 5);
*/