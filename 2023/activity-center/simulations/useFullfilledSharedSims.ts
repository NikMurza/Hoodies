import { skipToken } from "@reduxjs/toolkit/dist/query"
import { useEffect, useMemo, useState } from "react"
import { SearchPublicUser } from "services/types"
import { useGetUsersByIdsV2Query } from "services/userApi"
import { SharingLog, useSharedSims } from "./useSharedSims"

export type SharedSimBase = {
  sharedBy?: SearchPublicUser
  sharedWith: SearchPublicUser[]
}

export type SharedSimEvent = SharingLog & SharedSimBase

function canUseQuery({
  isFetching,
  isUninitialized,
}: {
  isFetching: boolean
  isUninitialized: boolean
}) {
  return !isFetching || isUninitialized
}

export function useFullfilledSharedSims() {
  const rawHandsQuery = useSharedSims()

  const userIds = useMemo(
    () =>
      rawHandsQuery.data
        ? Array.from(
            new Set(
              rawHandsQuery.data.content
                .map((e) => [e.sharedByUserId, ...e.sharedWithUserIds])
                .flat()
            )
          )
        : undefined,
    [rawHandsQuery.data]
  )
  const usersQuery = useGetUsersByIdsV2Query(
    userIds && userIds.length > 0
      ? {
          userIds,
        }
      : skipToken
  )
  const { data: rawHands } = rawHandsQuery

  const [hands, setData] = useState<SharedSimEvent[]>([])

  useEffect(() => {
    if (canUseQuery(usersQuery)) {
      setData(
        rawHands?.content.map<SharedSimEvent>((e) => {
          return {
            ...e,
            sharedBy: usersQuery.data?.find((u) => u.id == e.sharedByUserId),
            sharedWith: e.sharedWithUserIds
              .map((user) => usersQuery.data?.find((u) => u.id == user))
              .filter<SearchPublicUser>((u): u is SearchPublicUser => !!u),
          }
        }) || []
      )
    }
  }, [rawHands, usersQuery])

  return {
    rawHandsQuery,
    hands,
  }
}
