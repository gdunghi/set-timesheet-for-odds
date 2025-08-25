import {downloadCheckIns} from "./basecamp-checkins.js";
import {openHTML} from "./generate-html.js";
import {sendTimesheet} from "./set-timesheet.js";
import * as readline from "node:readline";


downloadCheckIns().then(async ({setTimesheet, oddsWorkingDays}) => {
  console.log("ODDS MD =", oddsWorkingDays);
  await openHTML(setTimesheet, oddsWorkingDays);

  const rl = readline.createInterface({input: process.stdin, output: process.stdout});
  const aws = await new Promise((resolve) => rl.question("Confirm to summit timesheet ?: ", (ans) => {
    rl.close();
    resolve(ans);
  }));

  if (aws === "yes" || aws === "y") {
    await sendTimesheet(setTimesheet)
      .then(() => {
        console.log("Done");
      }).catch((error) => {
        console.log(error)
      });
  }

}).catch((error) => {
  console.error("Error downloading check-ins:", error);
});