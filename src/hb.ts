import * as vscode from "vscode";
import axios, { AxiosResponse } from "axios";
import { getApiKey } from "./utils";

export const getHoneybadgerProjects = (): Promise<AxiosResponse<any, any>> => {
  const settings = vscode.workspace.getConfiguration("honeybadger");
  const url = settings.apiRootURL + "/v2/projects/";
  return axios.get(url, getAuthHeader());
};

export const getHoneybadgerFaults = (
  projectId: string,
  occurredAfter: number,
  occurredBefore: number
): Promise<AxiosResponse<any, any>> => {
  const settings = vscode.workspace.getConfiguration("honeybadger");
  const rootUrl = `${settings.apiRootURL}/v2/projects/${projectId}/faults`;
  let url = `${rootUrl}?occurred_after=${occurredAfter}&occurred_before=${occurredBefore}`;
  return axios.get(url, getAuthHeader());
};

export const getNextHoneybadgerFaults = (
  nextUrl: string
): Promise<AxiosResponse<any, any>> => {
  const settings = vscode.workspace.getConfiguration("honeybadger");
  return axios.get(`${settings.apiRootURL}${nextUrl}`, getAuthHeader());
};

const getAuthHeader = () => {
  const apiKey = getApiKey();
  return {
    auth: {
      username: apiKey,
      password: "",
    },
  };
};

export interface HoneybadgerFault {
  created_at: string;
  environment: string;
  id: number;
  ignored: boolean;
  klass: string;
  last_notice_at: string;
  message: string;
  notice_count: number;
  notices_count_in_range: number;
  project_id: number;
  resolved: boolean;
  url: string;
}
