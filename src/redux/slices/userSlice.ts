import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUsers, getUserById } from "@/services/users";
import { DashboardUser, UserState } from "@/types/dashboard";

// Interface for pagination params
interface FetchUsersParams {
  page?: number;
  per_page?: number;
}

// Paginated response
interface PaginatedUsers {
  users: DashboardUser[];
  total: number;
  total_pages: number;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  totalUsers: 0,
  totalPages: 1,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page = 1, per_page = 6 }: FetchUsersParams, { rejectWithValue }) => {
    try {
      const response = await getUsers(page, per_page);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const user = await getUserById(id);
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setLoading: (state: UserState) => {
      state.loading = true;
      state.error = null;
    },
    setUsers: (
      state: UserState,
      action: PayloadAction<{
        users: DashboardUser[];
        total: number;
        total_pages: number;
      }>
    ) => {
      state.users = action.payload.users;
      state.totalUsers = action.payload.total;
      state.totalPages = action.payload.total_pages;
      state.loading = false;
    },
    setError: (state: UserState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSelectedUser: (
      state: UserState,
      action: PayloadAction<DashboardUser>
    ) => {
      state.loading = false;
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<PaginatedUsers>) => {
          state.users = action.payload.users;
          state.totalUsers = action.payload.total;
          state.totalPages = action.payload.total_pages;
          state.loading = false;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setUsers, setError, setSelectedUser } =
  userSlice.actions;
export default userSlice.reducer;
