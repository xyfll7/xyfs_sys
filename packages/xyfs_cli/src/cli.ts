#!/usr/bin/env node
import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commandsDir = join(__dirname, "commands");

const argv = yargs(hideBin(process.argv));

for (const file of readdirSync(commandsDir)) {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    const modulePath = pathToFileURL(join(commandsDir, file)).href;
    const commandModule = await import(modulePath);
    argv.command(commandModule.default || commandModule);
  }
}

argv.demandCommand(1).help().parse();
