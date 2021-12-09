import gapi from "googleapis";

import { applyTextFormatRuns } from "./applyTextFormatRuns.js";

const getSpreadsheetData = async (spreadsheetId) => {
  const auth = await new gapi.google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  }).getClient();
  const sheets = gapi.google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    ranges: ["Sheet1!A2:L"],
    includeGridData: true,
  });

  const [headerRowData, ...restRowData] =
    response.data.sheets[0].data[0].rowData;

  return restRowData.reduce((accRows, { values }) => {
    const row = values.reduce(
      (accCell, { formattedValue, textFormatRuns }, i) => {
        const columnName = headerRowData.values[i].formattedValue;
        return {
          ...accCell,
          [columnName]: textFormatRuns
            ? applyTextFormatRuns(formattedValue, textFormatRuns)
            : formattedValue,
        };
      },
      {}
    );

    if (Object.keys(row).length) {
      accRows.push(row);
    }

    return accRows;
  }, []);
};

const projectTypes = {
  "PAST PROJECTS": "PAST",
  "CURRENT PROJECTS THAT ARE APPLYING FOR SECOND YEAR FUNDING": "ONGOING",
  "NEW 2021 / 2022 PROJECTS": "NEW",
};

const getLocationsData = async (fileId) => {
  let projectType = "";

  const rows = await getSpreadsheetData(fileId);

  const data = rows.reduce((accumulatedValues, values) => {
    let coords = values.Coordinates ? values.Coordinates.split(", ") : [];
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
