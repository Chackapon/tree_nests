const ADDON_NAME = "Tree Nests";

import { DEBUG_MODE} from "./mod_config";


export function log( str ) {
    if (DEBUG_MODE) console.log(`[${ADDON_NAME}]`, str);
}

export function warn( str ) {
    if (DEBUG_MODE) console.log(`[${ADDON_NAME}]`, str);
}