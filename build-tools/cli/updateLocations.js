import dotenv from "dotenv";
dotenv.config();

import os from "os";
import fs from "fs";
import { exit } from "process";
import getLocationsData from "../lib/getLocationsData.js";

const googleDriveFileId = process.env.LOCATIONS_FILE_ID;
if (!googleDriveFileId) {
  console.error("LOCATIONS_FILE_ID` required in env");
  exit(1);
}

const OUTPUT_PATH = "../_data/locations.json";

(async () => {
  try {
    console.log("Starting locations update");
    const locations = await getLocationsData(googleDriveFileId);

    await fs.writeFileSync(
      OUTPUT_PATH,
      JSON.stringify(locations, null, 2) + os.EOL,
      "utf8"
    );

    console.log(`Locations updated at ${OUTPUT_PATH}`);
    exit();
  } catch (e) {
    console.log(`Error: ${e}\n${e.stack}`);
    exit(1);
  }
})();
