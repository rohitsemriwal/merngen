#!/usr/bin/env node
import CommandController from "./controllers/command_controller.js";

const [
    nodePath,
    filePath,
    command,
    subCommand
] = process.argv;

const commands = {
    init: "init"
};

function handleCommands() {
    if(!command) {
        console.log("Use: `merngen init project-name` to create a new project");
        return;
    }

    switch(command) {
        case commands.init:
            CommandController.init(subCommand);
            break;
        default:
            console.log(`Invalid command ${command}`);
            break;
    }
}

handleCommands();