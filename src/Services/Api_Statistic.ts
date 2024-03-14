import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const statisticApi = createApi({
    reducerPath: "statistic",
    baseQuery: fetchBaseQuery({
    baseUrl : "http://localhost:8080",

        // baseUrl: "https://datn-be-sneaker.onrender.com",
    }),
    endpoints: (builder) => ({

        StatisticsByDay: builder.mutation({
            query: (date) => ({
                url: "/api/statistic/day",
                method: "POST",
                body: date
            }),
        }),

        StatisticsByMonth: builder.mutation({
            query: (date) => ({
                url: "/api/statistic/month",
                method: "POST",
                body: date
            }),
        })
    }),
});

export const { useStatisticsByDayMutation,useStatisticsByMonthMutation } = statisticApi;
export default statisticApi;