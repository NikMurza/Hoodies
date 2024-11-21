import { api } from "../api"
import { Conversion } from "./types"

const conversionApi = import.meta.env.VITE_APP_TRACKDESK_CONVERSION_ENDPOINT_URL
const octopiXApiToken = import.meta.env
  .VITE_APP_TRACKDESK_CONVERSION_ENDPOINT_API_X_KEY

const trackDeskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addConversion: builder.mutation<void, Conversion>({
      query: (body) => ({
        url: `${conversionApi}`,
        method: "POST",
        body: body,
        headers: { "X-Api-Key": octopiXApiToken },
      }),
    }),
  }),
})

export const { useAddConversionMutation } = trackDeskApi
