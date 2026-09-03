# Tree Nests [Bedrock 26.40 Addon]

![Minecraft Version](https://img.shields.io/badge/Minecraft_Bedrock-26.40-brightgreen)

This addon adds randomly spawning nests that can either contain loot or an inhabitant:)

## Preface

I was inspired to make this addon by one of my favourite small mods for Java Edition - [] by [], which adds randomly generated tree holes with loots. While developing my version the implementation and features changed quite a bit, so I it's not a direct port. Still, wanted to shout out this adventure mod that consitantly makes exploration fun in my modpacks:)

## Features

The main addition of this addon are randomly generated tree nests. They're generated once for each chunk and their placement is dependant on the world seed, so in this regard they behave like any other vanilla minecraft structure generation!


Tree nests can generate on ANY tree - including modded! The only requirement is that their item ID ends with "_log".


Nests have a default X% chance to appear on each tree. That value can be changed in the "mod_config.js"
![Screenshot20260903at001314.png](assets/Screenshot 2026-09-03 at 00.13.14.png)

So what do you do with those tree nests? In part due to how Script API works, and in part from a desire to give underused vanilla items more purpose, I made it so you have to use brush to interact with nests. If you right click with it on a nest you'll get some loot. After that the nest becomes empty - you can only interact with it once.

Here's the result of 10 rolls of the nest's loot table:

The loot is supposed to not be too overpowered, but to also encourage you to interact with the nests. I'll be tinkering with the loot table in the future, feedback is very appreciated!

But what's this - whose eyes are those?
Every nest has a 25% (configurable in "mod_config.json") chance to have a mob inside of them! If you brush a nest with an inhabitant in it, it will jump out of it.

This element of the addon might change in the future, as I'm still thinking of ideas to make it more interesting. Right now chickens and parrots can live in nests. Feel free to share your ideas with me:D

## Known bugs

* Nests don't generate on big mushrooms and nether trees
* Nests don't generate on 2x2 trees (and to be honest, idk if I am going to fix that)
* Loot and mobs spawn to the side of the nest
* Nest doesn't drop anything and has wrong break particles and sounds
* Nest doesn't break off when the log it's on is destroyed

If you notice any other bugs, please let me know of them! [github plug].
