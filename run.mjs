import { $ } from "zx";

async function run() {
  const res = await $`ls`;
  console.log(res);
}

run();