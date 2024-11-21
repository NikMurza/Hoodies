import { Avatar, Stack, SxProps, Typography } from "@mui/material"
import { selectCurrentUser } from "features/auth/authSlice"
import Flex from "lib/components/foundation/chatbot/Flex"
import { dateToString } from "lib/hand-history/utilities"
import George from "lib/images/george-square.png"
import { ReactElement } from "react"
import { useSelector } from "react-redux"
import { SharedAvatars } from "../SharedAvatars"
import { SharedSimTree } from "./SharedSimTree"
import { selectSharedSims } from "./sharedSimsSlice"

const RowSxProps: SxProps = {
  gap: "4px",
  alignItems: "center",
  height: 24,
}

export function SharedSimDetails(): ReactElement | null {
  const { selectedEvent } = useSelector(selectSharedSims)
  const user = useSelector(selectCurrentUser)
  const simData = selectedEvent?.simData

  if (!selectedEvent) return null

  return (
    <Stack
      sx={{
        gap: "16px",
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      <Stack sx={{ gap: "16px" }}>
        <Typography variant="b2" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Sim Details
        </Typography>
        <Flex
          sx={{
            flexGrow: 1,
            pl: "8px",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <Stack sx={{ gap: "4px", flex: "1px 1 0" }}>
            <Flex sx={{ gap: "4px", alignItems: "end" }}>
              <Typography variant="b3">Owner:</Typography>
              <Avatar
                sx={{
                  height: 32,
                  width: 32,
                  borderRadius: "25%",
                  border: "none !important",
                }}
                variant="rounded"
                src={George}
                alt="Avatar"
              />
              <Typography variant="b3semibold" color="custom.neutralblack">
                Octopi Sim Library
              </Typography>
            </Flex>
            <Flex sx={{ ...RowSxProps }}>
              <Typography variant="b3">Action:</Typography>
              <Typography variant="b3semibold">
                {selectedEvent.simData?.spotLookupInfo.action}
              </Typography>
            </Flex>
            <Flex sx={{ ...RowSxProps }}>
              <Typography variant="b3">Depth:</Typography>
              <Typography variant="b3semibold">
                {selectedEvent.simData?.spotLookupInfo.stack}
              </Typography>
            </Flex>
          </Stack>
          <Stack sx={{ gap: "4px", flex: "1px 1 0" }}>
            <Flex sx={{ gap: "4px", alignItems: "end" }}>
              <Typography variant="b3">
                {user?.id == selectedEvent.sharedByUserId
                  ? "Shared with:"
                  : "Shared from:"}
              </Typography>
              <SharedAvatars event={selectedEvent} alignItemsEnd={true} />
            </Flex>
            <Flex sx={{ ...RowSxProps }}>
              <Typography variant="b3">Shared date:</Typography>
              <Typography variant="b3semibold">
                {dateToString(new Date(selectedEvent.sharedAt))}
              </Typography>
            </Flex>
            <Flex sx={{ ...RowSxProps }}>
              <Typography variant="b3">Type:</Typography>
              <Typography variant="b3semibold">Postflop</Typography>
            </Flex>
            <Flex sx={{ ...RowSxProps }}>
              <Typography variant="b3">Positions:</Typography>
              <Typography variant="b3semibold">
                {selectedEvent.simData?.spotLookupInfo.players.join(" vs ")}
              </Typography>
            </Flex>
          </Stack>
        </Flex>
        {selectedEvent.message && (
          <Typography variant="b3" sx={{ pl: "8px" }}>
            {selectedEvent.message}
          </Typography>
        )}
      </Stack>
      <Flex
        sx={{
          borderBottom: (theme) =>
            `1px solid ${theme.palette.custom.neutralgray05}`,
        }}
      />
      <Stack sx={{ gap: "16px" }}>
        <Typography variant="b2" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Postflop tree
        </Typography>
        <Stack gap={"24px"} sx={{ pl: "8px", flexGrow: 1 }}>
          {simData?.treeUUID && <SharedSimTree key={selectedEvent.id} />}
        </Stack>
      </Stack>
    </Stack>
  )
}
