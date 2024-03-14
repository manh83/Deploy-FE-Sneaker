import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrder } from "../Models/interfaces";

const orderApi = createApi({
  reducerPath: "order",
  tagTypes: ["Order"],
  baseQuery: fetchBaseQuery({
    baseUrl : "http://localhost:8080",

    // baseUrl: "https://datn-be-sneaker.onrender.com",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      const token = localStorage.getItem("token") || "";
      if (token) {
          headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
      }
      return headers;
  },
  }),
  endpoints: (builder) => ({

    getUserOrders: builder.query<any, void>({
      query: () => `/api/order/view`,
      providesTags: ["Order"]
    }),

    getAllOrders: builder.query<IOrder[], void>({
      query: () => `/api/order`,
      providesTags: ["Order"]
    }),


    getOrderById: builder.query<any, number | string>({
      query: (_id) => `/api/order/${_id}`,
      providesTags: ["Order"]
    }),

    addOrder: builder.mutation<any, any>({
      query: (order) => ({
        url: `/api/order`,
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["Order"]
    }),

    updateOrder: builder.mutation<any, any>({
      query: (order:any) => ({
        url: `/api/order/${order._id}/update`,
        method: "PATCH",
        body: order,
      }),
      invalidatesTags: ["Order"]
    }),

    removeOrder: builder.mutation<IOrder, number | string>({
      query: (_id) => ({
        url: `/api/order/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"]
    }),

    
  }),
});

export const {
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useAddOrderMutation,
  useRemoveOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation
} = orderApi;
export default orderApi;