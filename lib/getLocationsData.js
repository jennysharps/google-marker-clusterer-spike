import googleAPIs from "googleapis";
import { parse } from "csv-parse/sync";

const getLocationsCSV = async (fileId) => {
  const auth = await new googleAPIs.google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  }).getClient();
  const drive = googleAPIs.google.drive({
    version: "v3",
    auth,
  });

  // The drive file will have to grant access to the email address used
  // in GOOGLE_APPLICATION_CREDENTIALS or be openly accessible
  const { data } = await drive.files.export({
    fileId,
    mimeType: "text/csv",
  });

  return data;
};

const projectTypes = {
  "PAST PROJECTS": "PAST",
  "CURRENT PROJECTS THAT ARE APPLYING FOR SECOND YEAR FUNDING": "ONGOING",
  "NEW 2021 / 2022 PROJECTS": "NEW",
};

const getLocationsData = async (fileId) => {
  let projectType = "";
  const locationsCSV = await getLocationsCSV(fileId);

  const data = parse(locationsCSV, {
    columns: true,
    trim: true,
    from_line: 2,
    skip_empty_lines: true,
  }).reduce((accumulatedValues, values, i) => {
    let coords = values.Coordinates.split(", ");
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    const projectName = values["Project Name"];

    if (isNaN(lat) || isNaN(lng)) {
      if (projectName) {
        if (projectTypes[projectName]) {
          console.log(
            `Project type ${projectType ? "progressed" : "set"} to ${
              projectTypes[projectName]
            }`
          );
          projectType = projectTypes[projectName];
        } else {
          console.warn(
            `Skipping "${projectName}": ${
              coords.length && coords[0].length
                ? `coords=${JSON.stringify(coords)}`
                : "no coords"
            }`
          );
        }
      }
      return accumulatedValues;
    }

    const numberOfChildren = parseInt(values["Number of children"], 10);

    return [
      ...accumulatedValues,
      {
        location: { lat, lng },
        projectName,
        locationName: values.Location,
        description: values["Website Map Sentence"],
        projectType,
        numberOfChildren: isNaN(numberOfChildren) ? null : numberOfChildren,
      },
    ];
  }, []);

  return data;
};

export default getLocationsData;
