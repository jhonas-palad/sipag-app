import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useWs } from "../useWebSocket";

import { produce } from "immer";
import { log } from "@/utils/logger";
import { KEYWORDS } from "@/lib/constants";
import { SuccessResponseData } from "@/types/response";

export const useRealtimeAnnouncements = () => {
  const queryClient = useQueryClient();
  const handleSetQueryData = useCallback(
    (event: WebSocketEventMap["message"]) => {
      const { message } = JSON.parse(event.data);
      queryClient.setQueryData(
        [KEYWORDS.ANNOUNCEMENTS.base],
        (oldResponse: SuccessResponseData<any>) => {
          return produce(oldResponse, (draftResponse) => {
            if (draftResponse?.data) {
              draftResponse.data = [message, ...draftResponse.data];
            }
          });
        }
      );
    },
    [queryClient]
  );

  const ws = useWs("announcements/", {
    onMessage: handleSetQueryData,
    onError: (e) =>
      log.error("Failed to connect to waste-report-activites/ ws endpoint"),
    onOpen(event) {
      log.info("Connected to waste-report-activities/ ws endpoint");
    },
  });
  return ws;
};
