import { Box, Stack } from "@mui/material"
import Flex from "lib/components/foundation/chatbot/Flex"
import { Pagination } from "lib/components/foundation/pagination/Pagination"
import {
  selectFollowings,
  selectIsFollowingsFilterEmpty,
  setFollowingsCount,
  setFollowingsPage,
  setFollowingsRowsPerPage,
  setFollowingsSelectedId,
} from "lib/following/followingSlice"
import CurrentFilterNoData from "lib/images/no-following-by-filter.png"
import NoFollowings from "lib/images/no-followings.png"
import { ReactElement, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FollowingRow } from "./FollowingRow"
import { useFullfilledFolowings } from "./useFullfilledFolowings"

export function FollowingList(): ReactElement {
  const dispatch = useDispatch()
  const { page, rowsPerPage } = useSelector(selectFollowings)
  const isFilterEmpty = useSelector(selectIsFollowingsFilterEmpty)
  const { followings, totalElements } = useFullfilledFolowings()

  useEffect(() => {
    if (followings) {
      if (page > Math.floor(totalElements ? totalElements / rowsPerPage : 0)) {
        dispatch(setFollowingsPage(0))
      }

      dispatch(setFollowingsCount(totalElements || 0))
      dispatch(setFollowingsSelectedId(undefined))
    }
  }, [followings, dispatch, page, rowsPerPage, totalElements])

  return followings && followings.length > 0 ? (
    <Stack sx={{ flexGrow: 1, justifyContent: "space-between" }}>
      <Stack sx={{ overflowY: "auto" }}>
        {followings.map((f) => {
          return (
            <Flex
              key={f.id}
              style={{
                width: "100%",
              }}
            >
              <FollowingRow following={f} />
            </Flex>
          )
        })}
      </Stack>

      <Pagination
        count={totalElements || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        changePage={(page: number): unknown =>
          dispatch(setFollowingsPage(page))
        }
        changeRowsPerPage={(rowsPerPage: number) =>
          dispatch(setFollowingsRowsPerPage(rowsPerPage))
        }
      />
    </Stack>
  ) : (
    <Box>
      <img
        width="100%"
        height="100%"
        style={{ objectFit: "scale-down" }}
        src={!isFilterEmpty ? CurrentFilterNoData : NoFollowings}
      />
    </Box>
  )
}
