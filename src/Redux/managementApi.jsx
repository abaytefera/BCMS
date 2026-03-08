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
        pendingRequests: res?.pendingRequests ?? 0,
        scheduledToday: res?.scheduledToday ?? 0,
        scheduledThisWeek: res?.scheduledThisWeek ?? 0,
        completedThisMonth: res?.completedThisMonth ?? 0,
        averageDuration: res?.averageDuration ?? 0,
        escalatedComplaints: res?.escalatedComplaints ?? 0,
        averageResolutionTime: res?.averageResolutionTime ?? "0",
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