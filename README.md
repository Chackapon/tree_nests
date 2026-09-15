# Tree Nests [Bedrock Addon]

![Minecraft Version](https://img.shields.io/badge/Minecraft_Bedrock-1.21.50-brightgreen)

This addon adds randomly spawning nests that can either contain loot or an inhabitant:)

<span style="color:#E03E2D;">**THIS ADDON IS ACHIEVEMENT FRIENDLY!**</span>

## Preface

I was inspired to make this addon by one of my favourite small mods for Java Edition - [Tree Hollows](https://modrinth.com/mod/tree-hollows) by [Reoseah](https://modrinth.com/user/Reoseah), which adds randomly generated tree holes with loots. While developing my version the implementation and features changed quite a bit, so I it's not a direct port. Still, wanted to shout out this adventure mod that consitantly makes exploration fun in my modpacks:)

## Features

The main addition of this addon are randomly generated tree nests. They're generated once for each chunk and their placement is dependant on the world seed, so in this regard they behave like any other vanilla minecraft structure generation!

Tree nests can generate on **ANY** tree - including modded! The only requirement is that their item ID ends with "_log".

![IMG_0830.jpeg](https://github.com/Chackapon/tree_nests/raw/main/assets/IMG_0830.jpeg)

Nests have a default **5%** chance to appear on each tree. That value can be changed in the mod settings. To open them use the custom command "/tree_nests:settings":
![Screenshot20260903at001314.png](https://github.com/Chackapon/tree_nests/raw/main/assets/settings_command.png)
![Screenshot20260903at001314.png](https://github.com/Chackapon/tree_nests/raw/main/assets/settings_menu.png)

So what do you do with those tree nests? In part due to how Script API works, and in part from a desire to give underused vanilla items more purpose, I made it so you have to use brush to interact with nests. If you right click with it on a nest you'll get some loot. After that the nest becomes empty - you can only interact with it **once**.

![brush_normal.jpeg](https://github.com/Chackapon/tree_nests/raw/main/assets/brush_normal.jpeg)

Here's the result of 10 rolls of the nest's loot table:

![loot_example.png](https://github.com/Chackapon/tree_nests/raw/main/assets/loot_example.png)

The loot is not supposed to be too overpowered, but should also encourage you to interact with the nests. I'll be tinkering with the loot table in the future, feedback is very appreciated!

Wait, what's this - whose eyes are those?

![eyes.jpeg](https://github.com/Chackapon/tree_nests/raw/main/assets/eyes.jpeg)

Every nest has a **25%** (configurable in "mod_config.json") chance to have a mob inside of them! If you brush a nest with an inhabitant in it, it will jump out of it.

![brush_zyjatko1.png](https://github.com/Chackapon/tree_nests/raw/main/assets/brush_zyjatko1.png)

![brush_zyjatko2.png](https://github.com/Chackapon/tree_nests/raw/main/assets/brush_zyjatko2.png)

This element of the addon might change in the future, as I'm still thinking of ideas to make it more interesting. Right now chickens and parrots can live in nests. Feel free to share your ideas with me:D

## Known bugs

* Nests don't generate on big mushrooms and nether trees
* Nests don't generate on 2x2 trees (and to be honest, idk if I am going to fix that)
* Loot and mobs spawn to the side of the nest
* Nest has wrong break particles and sounds
* Nest doesn't break off when the log it's on is destroyed

If you notice any other bugs, please let me know of them on the [GitHub Issues](https://github.com/Chackapon/tree_nests/issues) page!
