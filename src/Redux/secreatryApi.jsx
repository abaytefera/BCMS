import { APi } from "./CenteralAPI";

export const SecretaryApi = APi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Existing Dashboard Stats
    getSecretaryDashboard: builder.query({
      query: () => "/api/secretary/meetings/stats",
      providesTags: ["secretary"],
    }),

    // 2. Dynamic Meetings by Status (PENDING, APPROVED, SCHEDULED)
    getMeetingsByStatus: builder.query({
      query: (status) => `/api/secretary/meetings?status=${status}`,
      providesTags: ["secretary"],
    }),

    // 3. Dynamic Timeframe Meetings (today, week)
    getScheduledMeetings: builder.query({
      query: (timeframe) => `/api/executive/meetings/scheduled?timeframe=${timeframe}`,
      providesTags: ["secretary"],
    }),

    // 4. Executive Stats (escalated complaints, etc.)
     getExecutiveStats: builder.query({
  query: ({ category, status }) => `/api/executive/${category}/${status}`,
  providesTags: ["secretary"],
}),

    // 5. Specifically for Completed Meetings
    getCompletedMeetings: builder.query({
      query: () => "/api/executive/meetings/completed",
      providesTags: ["secretary"],
    }),
  }),
  overrideExisting: false,
});

// Export all the auto-generated hooks
export const { 
  useGetSecretaryDashboardQuery,
  useGetMeetingsByStatusQuery,
  useGetScheduledMeetingsQuery,
  useGetExecutiveStatsQuery,
  useGetCompletedMeetingsQuery
} = SecretaryApi;