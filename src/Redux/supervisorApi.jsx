// Redux/supervisorApi.js
import { APi } from "./CenteralAPI";

export const supervisorApi = APi.injectEndpoints({
  endpoints: (builder) => ({
    getSupervisorStats: builder.query({
      // Correct endpoint for supervisor-level metrics
      query: () => 'api/dashboard/supervisor',
      providesTags: ['Complaints', 'Dashboard'],
      // Standardizing response to target the 'data' key
      transformResponse: (res) => res || { total: 0, pending: 0, assigned: 0 },
    }),
    getActiveManager: builder.query({
      // Correct endpoint for supervisor-level metrics
      query: () => '/api/users/executives/active',
      providesTags: ['user'],
      // Standardizing response to target the 'data' key
      transformResponse: (res) => res || [],
    }),

    getOfficers: builder.query({
      // Correct endpoint to fetch staff with the officer role
      query: () => 'api/users?role=OFFICER',
      providesTags: ['User'],
      transformResponse: (response) => response?.data || [],
    }),

 // Redux/supervisorApi.js
updateAssign: builder.mutation({
  query: (assignmentData) => ({
    // Use the absolute path or relative to your baseQuery
    url: 'api/workflow/assign', 
    method: 'POST', // Ensure your backend is app.post() not app.put()
    body: {
      complaintId: assignmentData.id,
      officerId: assignmentData.officerId,
      priority: assignmentData.priority,
      timeline: assignmentData.timeline
    },
  }),
  invalidatesTags: ['Complaints', 'Dashboard'], 
}),
  }),
  overrideExisting: false,
});

// Export the injected hook (Names kept exactly as requested)
export const { 
  useGetOfficersQuery, 
useUpdateAssignMutation,
 useGetActiveManagerQuery,
  useGetSupervisorStatsQuery, 
} = supervisorApi;