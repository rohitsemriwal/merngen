#!/usr/bin/env node
import CommandController from "./controllers/command_controller.js";

const [
    nodePath,
    filePath,
    command,
    subCommand
] = process.argv;

const commands = {
    init: "init",
    createFeature: "create:feature"
};

function handleCommands() {
    if(!command) {
        console.log("Use: `rsmern init project-name` to create a new project");
        return;
    }

    switch(command) {
        case commands.init:
            CommandController.init(subCommand);
            break;
        case commands.createFeature:
            CommandController.createFeature((subCommand ?? "").toLowerCase());
            break;
        default:
            console.log(`Invalid command ${command}`);
            break;
    }
}

handleCommands();