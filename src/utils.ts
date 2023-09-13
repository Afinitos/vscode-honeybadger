import * as moment from "moment";
import * as vscode from "vscode";
import { parseISO } from "date-fns";

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

export const formatElapsedTimeFromDate = (date: string) => {
  const seconds = Math.round((new Date().valueOf() - parseISO(date).valueOf()) / 1000);

  if(seconds < 60){
    return `${seconds} ${seconds > 1 ? "seconds ago" : "second ago"}`;
  }else if(seconds < 60 * 60){
    const elapsedMinutes = Math.round(seconds / 60);
    return `${elapsedMinutes} ${elapsedMinutes > 1 ? "minutes ago" : "minute ago"}`;
  }else if(seconds < 60 * 60 * 24){
    const hoursElapsed = Math.round(seconds / (60 * 60));
    return `${hoursElapsed} ${hoursElapsed > 1 ? "hours ago" : "hour ago"}`;
  }else{
    const elapsedDays = Math.round(seconds / (60 * 60 *24));
    return `${elapsedDays} ${elapsedDays > 1 ? "days ago" : "day ago"}`;
  }
};

export const getApiKey = (): string => {
  const settings = vscode.workspace.getConfiguration("honeybadger");
  return settings.apiKey;
}
