
import { APi } from "./CenteralAPI";

export const complaintApi = APi.injectEndpoints({
  endpoints: (builder) => ({
    getComplaintById: builder.query({
      query: (id) => `/api/staff/details/${id}`,
      providesTags: (result, error, id) => [{ type: 'Complaints', id }],
      transformResponse: (res) => res || null,
    }),

    getComplaintHistory: builder.query({
      query: (id) => `/api/workflow/complaints/${id}/history`,
      providesTags: (result, error, id) => [{ type: 'ComplaintHistory', id }],
    }),

    updateComplaintStatus: builder.mutation({
      query: ({ id, status, comment }) => ({
        url: `/api/workflow/status/${id}`,
        method: 'PATCH',
        body: { status, comment },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Complaints", id },
        { type: "ComplaintHistory", id },
        "Complaints",
        "Dashboard",
      ],
    }),

    getComplaints: builder.query({
      query: (params) => ({
        url: '/api/staff/list',
        method: 'GET',
        params: params,
      }),
      providesTags: ['Complaints'],
      transformResponse: (res) => res,
    }),

    getUnassignedComplaints: builder.query({
      query: (params) => ({
        url: '/api/staff/unassigned', // Added /api/ for consistency
        method: 'GET',
        params: params,
      }),
      providesTags: ['Complaints'],
      transformResponse: (res) => res || [],
    }),

    getComplaintsDashboard: builder.query({
      query: (params) => ({
        url: `/api/dashboard/${params}`,
        method: 'GET',
        params: params,
      }),
      providesTags: ['Complaints'],
      transformResponse: (res) => res,
    }),

    getComplaintsList: builder.query({
      query: (params) => ({
        url: `/api/staff/list`, // Removed ${params} from URL since they are passed in params object
        method: 'GET',
        params: params,
      }),
      providesTags: ['Complaints'],
      transformResponse: (res) => res,
    }),

    getComplaintsbyCatagory: builder.query({
      query: ({ role, type }) => ({
        url: `/api/dashboard/${role}/list/`,
        method: 'GET',
        params: { type: type },
      }),
      providesTags: ['Complaints'],
      transformResponse: (res) => res,
    }),

    getInternalNotes: builder.query({
      query: ({ complaintId }) => `/api/workflow/complaints/${complaintId}/notes`,
      providesTags: (result) =>
        result
          ? [...result.map((note) => ({ type: "InternalNote", id: note.id })), { type: 'InternalNote', id: 'LIST' }]
          : [{ type: 'InternalNote', id: 'LIST' }],
    }),

    createInternalNote: builder.mutation({
      query: ({ complaintId, note }) => ({
        url: `/api/workflow/notes/${complaintId}`,
        method: "POST",
        body: { note }
      }),
      invalidatesTags: [{ type: 'InternalNote', id: 'LIST' }],
    }),
    
    approveMeeting: builder.mutation({
      query: ({ compileid, manager_id, commit, isapprove, meeting_id }) => ({
        url: `/api/workflow/assign-executive`,
        method: "POST",
        body: {
          compileid,
          manager_id,
          commit,
          isapprove,
          meeting_id
        }
      }),
      invalidatesTags: [{ type: "Complaint", id: "DETAIL" }]
    }),

    scheduleMeeting: builder.mutation({
      query: ({ meeting_id, scheduledDate, scheduledTime, durationMinutes, location }) => ({
        url: `/api/secretary/meetings/${meeting_id}/schedule`,
     
        method: "PUT",
        body: {
          scheduledDate,
          scheduledTime,
          durationMinutes,
          location
        }
      }),
      invalidatesTags: [{ type: "Complaint", id: "DETAIL" }]
    }),

    completeMeeting: builder.mutation({
      query: ({ meeting_id, outcome, outcomeNotes }) => ({
        url: `/api/secretary/meetings/${meeting_id}/outcome`,
    
        method: "POST",
        body: {
          outcome,
          outcomeNotes
        }
      }),
      invalidatesTags: [{ type: "Complaint", id: "DETAIL" }]
    }),

    cancelMeeting: builder.mutation({
      query: ({ meeting_id }) => ({
        url: `/api/workflow/meeting/cancel/${meeting_id}`,
        method: "PUT"
      }),
      invalidatesTags: [{ type: "Complaint", id: "DETAIL" }]
    })
  }),
});

export const {
  useGetComplaintByIdQuery,
  useGetComplaintHistoryQuery, // Added this export for you
  useGetComplaintsQuery,
  useGetUnassignedComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useGetComplaintsDashboardQuery,
  useGetComplaintsListQuery,
  useGetComplaintsbyCatagoryQuery,
  useGetInternalNotesQuery,
  useCreateInternalNoteMutation

} = complaintApi;

