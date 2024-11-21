import { Pageable } from "services/types"
import { DateRange } from "../new-hand-history/types"

export interface ShareRequest {
  aggregates: AggregateDTO[]
  shareWithUserIds: string[]
  targetAllFollowers?: boolean
  message?: string
  allowResharing?: boolean
}

export interface AggregateDTO {
  type: AggregateType
  id: string
  metadata?: { sim_state?: string }
}

export interface ShareAggregateDTO {
  id: string
  aggregate: AggregateDTO
  aggregateDetails: AggregateDetailsDto
  sharedByUserId: string
  sharedWithUserIds: { content: string[] }
  message?: string
  sharedAt: string
  permissions: ("PERMISSION_UNSPECIFIED" | "READ" | "SHARE" | "UNRECOGNIZED")[]
  metadata?: JsonNode
}

export interface AggregateShareSearchRequest {
  aggregateTypes?: string[]
  userIds?: string[]
  sharedAt?: DateRange
}

export type PostSharingMarkLogsReadApiResponse = unknown
export type PostSharingMarkLogsReadApiArg = {
  searchBy: SearchBy
}
export type PostSharingRejectApiResponse = unknown
export type PostSharingRejectApiArg = {
  searchBy: SearchBy
}
export type PostSharingSearchLogsApiResponse = Pageable<SharingLogDto>

/** status 200 OK */
export type PostSharingSearchLogsApiArg = {
  searchBy: SearchBy
  params?: {
    rowsPerPage?: number
    page?: number
    sort?: "sharedAt"
    direction?: "asc" | "desc"
  }
}
export type PostSharingShareLogsApiResponse = /** status 200 OK */ SharingResult
export type PostSharingShareLogsApiArg = {
  shareRequest: ShareRequestByFilter
}
export type GetSharingUnreadLogsStatusApiResponse =
  /** status 200 OK */ UnreadLogsStatus[]
export type GetSharingUnreadLogsStatusApiArg = void

export type SearchById = {
  target: "selected-sharing-logs"
  sharingLogIds: string[]
}
export type SearchByFilter = {
  target: "search-filter"
  aggregateTypes: AggregateType[]
  read?: boolean
  sharedByUserIds?: string[]
  sharedAt?: {
    start?: string
    end?: string
  }
}

export type SearchBy = SearchById | SearchByFilter

export type Instant = object
export type AggregateDto = {
  type?: AggregateType
  id?: string
}
export type HandDetailsDto = {
  playedAt?: Instant
  result?: number
  boardCards?: string[]
  holeCards?: string[]
}
export type AggregateDetailsDto = {
  handDetails?: HandDetailsDto
}
export type JsonNode = object
export type SharingDto = {
  id: string
  aggregate: AggregateDto
  aggregateDetails?: AggregateDetailsDto
  sharedByUserId: string
  sharedWithUserIds?: string
  message: string
  metadata?: JsonNode
  sharedAt: Instant
  permissions: ("PERMISSION_UNSPECIFIED" | "READ" | "SHARE" | "UNRECOGNIZED")[]
}
export type SharingLogDto = {
  id: string
  sharedAt: string
  sharedByUserId: string
  sharedWithUserId: string
  aggregate: AggregateDto
  aggregateDeleted?: boolean
  aggregateDetails?: AggregateDetailsDto
  read?: boolean
  sharing?: SharingDto
}
export type SharingResult = {
  sharedSuccessfullyCount?: number
  sharingsNotAllowedToReshare: string[]
}
export type ShareWithAll = {
  target: "all-followers"
}
export type ShareWithId = {
  target: "selected-followers"
  userIds: string[]
}
export type ShareWith = ShareWithAll | ShareWithId
export type ShareRequestByFilter = {
  searchBy: SearchBy
  message: string
  allowResharing?: boolean
  shareWith: ShareWith
}
export type UnreadLogsStatus = {
  aggregateType: AggregateType
  count?: number
}

export type AggregateType = "hand.pokerbase" | "hand" | "sim"
