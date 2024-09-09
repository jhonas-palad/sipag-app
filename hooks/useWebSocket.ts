import useWebSocket, { Options } from "react-use-websocket";
import { BASE_URL } from "@/lib/fetch";

const WS_URL = (() => {
  if (BASE_URL?.startsWith("http")) {
    return BASE_URL.replace("http", "ws");
  } else if (BASE_URL?.startsWith("https")) {
    return BASE_URL.replace("https", "wss");
  }
  return "wss://sipagapi.online";
})();

export const useWs = (url: string, opts?: Options) => {
  //Recieved events for recieving message, connected
  return useWebSocket(`${WS_URL}/ws/${url}`, { ...opts });
};
