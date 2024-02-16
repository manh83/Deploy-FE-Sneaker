import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IColor } from "../Models/interfaces"
import { pause } from "../utils/pause";

export const colorApi = createApi({
  reducerPath: "color",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:8080`,
    headers: {
      
    },
    fetchFn: async (...args) => (
      await pause(1000),
      fetch(...args)
    )
  }),
  tagTypes: ["Color"],
  endpoints: (builder) => ({
    getColors: builder.query<IColor[],void>({
      query: () => "/api/colors",
      providesTags: ["Color"],
    }),
    getOneColor: builder.query({
      query: (id) => `/api/color/${id}`,
      providesTags: ["Color"],
    }),
    createColor: builder.mutation({
      query: (color: IColor) => ({
        url: "/api/color",
        method: "POST",
        body: color,
      }),
      invalidatesTags: ["Color"],
    }),
    removeColor: builder.mutation({
      query: (id) => ({
        url: `/api/color/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Color"],
    }),
    updateColor: builder.mutation({
      query: (color: IColor) => ({
        url: `/api/color/${color._id}`,
        method: "PATCH",
        body: color,
      }),
      invalidatesTags: ["Color"],
    }),
  }),
})

export const {
  useGetColorsQuery,
  useGetOneColorQuery,
  useCreateColorMutation,
  useRemoveColorMutation,
  useUpdateColorMutation,
} = colorApi
export default colorApi;