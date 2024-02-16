import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const searchProductApi = createApi({
    reducerPath: "searchProduct",
    baseQuery: fetchBaseQuery({
      baseUrl:  "http://localhost:8080"
    }),
    endpoints: (builder) => ({
      getSearchProduct: builder.query({
        query: (query) => `/api/search-product?query=${query}`  // Sử dụng query parameter 'query'
      })
    })
  });
export const {useGetSearchProductQuery} = searchProductApi
export default searchProductApi