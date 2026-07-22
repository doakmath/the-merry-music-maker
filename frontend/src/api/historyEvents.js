import { getData } from "./client";

export function getHistoryEvents() {
  return getData("/history-events/");
}
