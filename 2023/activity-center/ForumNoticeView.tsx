import { CircularProgress, Stack } from "@mui/material"
import { ReactElement, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { util } from "services/forum/api"
import { ActivityCenterGridViewer } from "./ActivityCenterGridViewer"

export function ForumNoticeView(): ReactElement {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const { current } = iframeRef
    if (!current || !current.contentWindow) {
      return
    }
    const onMessage = (
      event: MessageEvent<{ type: "notification_read" }>
    ): void => {
      if (event.source !== current.contentWindow) {
        return
      }

      if (
        typeof event.data === "object" &&
        event.data?.type === "notification_read"
      ) {
        dispatch(util.invalidateTags(["ForumStatus"]))
      }
    }
    window.addEventListener("message", onMessage)

    return () => window.removeEventListener("message", onMessage)
  }, [dispatch])

  return (
    <ActivityCenterGridViewer
      content={
        <Stack sx={{ position: "relative", flex: 1 }}>
          {loading && (
            <Stack
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress color="primary" />
            </Stack>
          )}
          <iframe
            onLoad={(): void | boolean => setLoading(false)}
            ref={iframeRef}
            src={`${import.meta.env.VITE_APP_FORUM_BASE_URL}/activity`}
            style={{ flex: 1, border: "0", position: "relative" }}
          />
        </Stack>
      }
    />
  )
}
