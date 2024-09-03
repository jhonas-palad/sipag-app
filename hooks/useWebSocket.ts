import useWebSocket, { Options } from "react-use-websocket";
export const BASE_URL =
  process.env.EXPO_PUBLIC_MODE === "development"
    ? process.env.EXPO_PUBLIC_SIPAG_API_URL
    : "";

const WS_URL = (() => {
  return BASE_URL?.replace("http", "ws");
})();

export const useWs = (url: string, opts?: Options) => {
  //Recieved events for recieving message, connected
  return useWebSocket(`${WS_URL}/${url}`, { ...opts });
};
