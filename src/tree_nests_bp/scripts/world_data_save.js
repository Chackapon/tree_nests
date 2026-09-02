const ADDON_NAME = "Tree Nests";
/**
 * Functions that handle saving and loading of world dynamic properties
 */

import {
   world,
} from "@minecraft/server";
import { log, warn } from "./logger.js";

/**
 * Saves a collection (either a Set or a Map) as a world dynamic property by converting it into string
 * ! Important: string size limit is 32,767 bytes
 * @param id
 * @param collection Map|Set
 */
export function saveWorldData( id, collection ) {

	// Handle depending on collection type
	if ( collection instanceof Set  ) {
		world.setDynamicProperty(id, JSON.stringify([...collection]));
	}

	else if ( collection instanceof Map  ) {
		world.setDynamicProperty(id, JSON.stringify( Object.fromEntries( collection ) ) );
	}
}

/**
 * Loads a dynamic property into a collection (either a Set or a Map)
 * @param id
 * @param destination Map|Set
 */
export function loadWorldData( id, destination ) {

	// Pre-load clean up
	destination.clear();

	// Get dynamic property and check if it exists
	const property = world.getDynamicProperty(id);
	if (property) {
		log(`Loading data from dyn. property with id=${id}`);

		// Handle depending on collection type
		if ( destination instanceof Set  ) {
			const loaded_data = new Set(JSON.parse(property));
			for (let entry of loaded_data) destination.add(entry);
		}
		
		else if ( destination instanceof Map  ) {
			const loaded_data = new Map(Object.entries(JSON.parse(property)));
			for (const [key,value] of loaded_data) destination.set(key, value);
		} 
		
	}

	// If no dynamic property with id found
	else {
		warn(`No saved data found for id=${id}`);
	}
}

