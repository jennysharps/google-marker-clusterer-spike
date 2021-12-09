// TODO: this is a very basic implementation written to quickly parse a single link in a single cell in the source spreadhsheet;
// It does nothing else at the moment;  I was unable to find any Google utils to process this rich text data given the textFormatRuns documentation here https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/cells#TextFormatRun
export const applyTextFormatRuns = (formattedValue, textFormatRuns = []) => {
  let processedValue = formattedValue;

  textFormatRuns.forEach(({ startIndex = -1, format }, i) => {
    // Empty format, designates the start or end of an adjacent format
    if (startIndex === -1) {
      return;
    }

    // Only links are currently supported
    const { link } = format;
    if (link) {
      // "The format of this run continues until the start index of the next run."
      const { startIndex: endIndex } = textFormatRuns[i + 1];
      const beforeLinkedText = processedValue.substring(0, startIndex);
      const linkedText = processedValue.substring(startIndex, endIndex);
      const afterLinkedText = processedValue.substring(
        endIndex,
        processedValue.length
      );
      processedValue = `${beforeLinkedText}<a href="${link.uri}">${linkedText}</a>${afterLinkedText}`;
    }
  });

  return processedValue;
};
