import * as moment from "moment";
import * as vscode from "vscode";

/**
 * Generates array with N dates in descending format starting with the current day.
 *
 * @param n Number of dates to generate.
 * @param dateFormat Date format.
 * @returns
 */
export const getDates = (
  n: number,
  dateFormat: string = "YYYY-MM-DD"
): string[] => {
  const days = Array.from(Array(n).keys());
  return days.map((day) => moment().subtract(day, "days").format(dateFormat));
};

export const getApiKey = (): string => {
  const settings = vscode.workspace.getConfiguration("honeybadger");
  return settings.apiKey;
}
