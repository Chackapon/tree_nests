import {
    DEFAULT_HOLLOW_CHANCE, DEFAULT_INHABITANT_CHANCE,
    MOD_NAMESPACE,
} from "./default_const";

import {
    system,
    world,

    CommandPermissionLevel,
    CustomCommandStatus, Player,
} from "@minecraft/server";

import {
    ModalFormData
} from "@minecraft/server-ui";
import {DEBUG_MODE, setDebugMode} from "./logger";
import {saveWorldData} from "./world_data_save";

export let HOLLOW_CHANCE = DEFAULT_HOLLOW_CHANCE;
export let INHABITANT_CHANCE = DEFAULT_INHABITANT_CHANCE;

export function setHollowChance( chance: number ) {
    HOLLOW_CHANCE = chance ?? DEFAULT_HOLLOW_CHANCE;
}

export function setInhabitantChance( chance: number ) {
    INHABITANT_CHANCE = chance ?? DEFAULT_INHABITANT_CHANCE;
}

export function registerSettingsCommand() {
    system.beforeEvents.startup.subscribe(({customCommandRegistry}) => {

        customCommandRegistry.registerCommand(
            {
                name: MOD_NAMESPACE + ":settings",
                description: "Opens the settings menu for the Tree Nests addon",
                permissionLevel: CommandPermissionLevel.Host, //must be non opener,
                cheatsRequired: false
            },
            (origin) => {
                const player = origin.sourceEntity as Player;

                system.run(() => {
                    let settings_form = new ModalFormData();

                    settings_form.title("Tree Nests Settings");
                    settings_form.header("Gameplay");

                    settings_form.slider("Nests spawn rate [%%]", 0, 100, {
                        defaultValue: HOLLOW_CHANCE * 100,
                        tooltip: "Chance for a tree to be selcted during chunk generation to have a nest generated on it."
                    });
                    settings_form.slider("Nest inhabitant spawn rate [%%]", 0, 100, {
                        defaultValue: INHABITANT_CHANCE * 100,
                        tooltip: "Chance for a nest to have a mob in it when it is generated."
                    });
                    settings_form.divider();

                    settings_form.header("Developer");
                    settings_form.toggle("Debug logging", {
                        defaultValue: DEBUG_MODE
                    });

                    settings_form.show(player).then(result => {

                        if ( !result || result.canceled ) return;

                        setHollowChance(  (result.formValues?.at(1) as number ?? 0) / 100 );
                        saveWorldData(`${MOD_NAMESPACE}:hollow_chance`, HOLLOW_CHANCE);

                        setInhabitantChance( (result.formValues?.at(2) as number ?? 0) / 100 );
                        saveWorldData(`${MOD_NAMESPACE}:inhabitant_chance`, INHABITANT_CHANCE);

                        setDebugMode(result.formValues?.at(5) as boolean);
                        saveWorldData(`${MOD_NAMESPACE}:debug_mode`, DEBUG_MODE);


                    });
                });


                /*return {
                    CustomCommandStatus.Success,
                    message: "Opened the settings menu"
                };*/
            }
        );
    });
}