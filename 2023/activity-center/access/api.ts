import { api } from "../api"
import { HandShareSearchRequestNew } from "../new-hand-history/types"
import {
  GetSharingUnreadLogsStatusApiArg,
  GetSharingUnreadLogsStatusApiResponse,
  PostSharingMarkLogsReadApiArg,
  PostSharingMarkLogsReadApiResponse,
  PostSharingRejectApiArg,
  PostSharingRejectApiResponse,
  PostSharingSearchLogsApiArg,
  PostSharingSearchLogsApiResponse,
  PostSharingShareLogsApiArg,
  PostSharingShareLogsApiResponse,
  ShareAggregateDTO,
  ShareRequest,
} from "./types"

const BASE_URI = "/api/access/sharing/v1"
const accessApi = api.injectEndpoints({
  endpoints: (builder) => ({
    shareAggregates: builder.mutation<void, ShareRequest>({
      invalidatesTags: ["SharedByMeHandsLog"],
      query: (body) => ({
        url: `${BASE_URI}`,
        method: "POST",
        body: body,
      }),
    }),
    searchShareAggregates: builder.query<
      { content: ShareAggregateDTO[]; totalElements: number },
      HandShareSearchRequestNew
    >({
      providesTags: ["SharedByMeHandsLog"],
      query: ({ params, ...body }) => ({
        url: `${BASE_URI}/search`,
        method: "POST",
        body: body,
        params: {
          size: params?.rowsPerPage,
          page: params?.page,
          sort: params?.sort
            ? `${params?.sort},${params?.direction}`
            : undefined,
        },
      }),
    }),
    postSharingMarkLogsRead: builder.mutation<
      PostSharingMarkLogsReadApiResponse,
      PostSharingMarkLogsReadApiArg
    >({
      invalidatesTags: ["LogsStatus", "SharedHandsLog"],
      query: (queryArg) => ({
        url: `${BASE_URI}/mark-logs-read`,
        method: "POST",
        body: queryArg.searchBy,
      }),
    }),
    postSharingReject: builder.mutation<
      PostSharingRejectApiResponse,
      PostSharingRejectApiArg
    >({
      invalidatesTags: ["SharedHandsLog", "LogsStatus"],
      query: (queryArg) => ({
        url: `${BASE_URI}/reject`,
        method: "POST",
        body: queryArg.searchBy,
      }),
    }),
    getSharingSearchLogs: builder.query<
      PostSharingSearchLogsApiResponse,
      PostSharingSearchLogsApiArg
    >({
      providesTags: ["SharedHandsLog"],
      query: ({ params, ...queryArg }) => ({
        url: `${BASE_URI}/search-logs`,
        method: "POST",
        params: {
          size: params?.rowsPerPage,
          page: params?.page,
          sort: params?.sort
            ? `${params?.sort},${params?.direction}`
            : undefined,
        },
        body: queryArg.searchBy,
      }),
    }),
    postSharingShareLogs: builder.mutation<
      PostSharingShareLogsApiResponse,
      PostSharingShareLogsApiArg
    >({
      query: (queryArg) => ({
        url: `${BASE_URI}/share-logs`,
        method: "POST",
        body: queryArg.shareRequest,
      }),
    }),
    getSharingUnreadLogsStatus: builder.query<
      GetSharingUnreadLogsStatusApiResponse,
      GetSharingUnreadLogsStatusApiArg
    >({
      providesTags: ["LogsStatus"],
      query: () => ({ url: `${BASE_URI}/unread-logs-status` }),
    }),
  }),
})

export const {
  useShareAggregatesMutation,
  useSearchShareAggregatesQuery,
  useGetSharingUnreadLogsStatusQuery,
  useGetSharingSearchLogsQuery,
  usePostSharingMarkLogsReadMutation,
  usePostSharingRejectMutation,
} = accessApi
