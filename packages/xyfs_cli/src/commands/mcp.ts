import { type CommandModule } from "yargs";

const command: CommandModule = {
  command: "mcp [name]",
  describe: "打招呼",
  builder: (yargs) =>
    yargs.positional("name", {
      type: "string",
      default: "世界",
      describe: "名字",
    }),
  handler: (argv) => {
    console.log(`你好, ${argv.name}!`);
  },
};

export default command;
