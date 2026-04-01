import { APi } from "./CenteralAPI";

export const managementApi = APi.injectEndpoints({
  endpoints: (builder) => ({

    /* ================= MANAGEMENT STATS ================= */

    getManagementStats: builder.query({
      query: () => "/management/stats",
      providesTags: ["ManagementStats"],
    }),

    /* ================= DASHBOARD CHART DATA ================= */

    getDashboardCharts: builder.query({
      query: () => "/management/charts",
      providesTags: ["DashboardCharts"],
      transformResponse: (res) => ({
        trends: res?.trends ?? [],
        resolution: res?.resolution ?? []
      })
    }),

    /* ================= NEW MANAGEMENT STATE ================= */

    getManagementNewState: builder.query({
      query: () => "/api/executive/dashboard",
      providesTags: ["ManagementState"],
      transformResponse: (res) => ({
        pendingRequests: res?.pendingRequests ,
        scheduledToday: res?.scheduledToday ,
        scheduledThisWeek: res?.scheduledThisWeek  ,
        completedThisMonth: res?.completedThisMonth ,
        averageDuration: res?.averageDuration ,
        escalatedComplaints: res?.escalatedComplaints ,
        averageResolutionTime: res?.averageResolutionTime ,
        topCategories: res?.topCategories ?? [],
        subCityBreakdown: res?.subCityBreakdown ?? []
      })
    }),

  }),
});

export const {
  useGetManagementStatsQuery,
  useGetDashboardChartsQuery,
  useGetManagementNewStateQuery
} = managementApi;