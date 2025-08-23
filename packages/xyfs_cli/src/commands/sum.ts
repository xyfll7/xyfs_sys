import { type CommandModule } from "yargs";

const command: CommandModule = {
  command: "sum <a> <b>",
  describe: "计算两个数的和",
  builder: (yargs) =>
    yargs
      .positional("a", { type: "number", describe: "第一个数" })
      .positional("b", { type: "number", describe: "第二个数" }),
  handler: (argv) => {
    const a = argv.a as number;
    const b = argv.b as number;
    console.log(`结果: ${a + b}`);
  },
};

export default command;

