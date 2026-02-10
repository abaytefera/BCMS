import { APi } from "./CenteralAPI";

export const categoryApi = APi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all categories
    getCategories: builder.query({
  query: () => '/api/categories/',
  providesTags: ['Category'],
  
  transformResponse: (res) => res || [], 
}),
    // CREATE category
    createCategory: builder.mutation({
      query: (newCat) => ({
        url: '/api/categories',
        method: 'POST',
        body: newCat,
      }),
      // Invalidates both Category list and Dashboard stats
      invalidatesTags: ['Category', 'Dashboard'],
    }),
    // UPDATE/TOGGLE category
   OneUpdate: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/api/categories/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: 'DELETE', // Corrected method
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation, 
useOneUpdateMutation ,
useDeleteCategoryMutation
} = categoryApi;