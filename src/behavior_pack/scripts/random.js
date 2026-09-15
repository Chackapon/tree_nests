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
export function world_random(x, z) {
    //return Math.random();
    return random2(x, z);
}
