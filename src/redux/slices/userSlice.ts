// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { UsersState, User } from "../../types";

// const initialState: UsersState = {
//   users: [],
//   selectedUser: null,
//   loading: false,
//   error: null,
// };

// const userSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {
//     setUsers: (state, action: PayloadAction<User[]>) => {
//       state.users = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setSelectedUser: (state, action: PayloadAction<User | null>) => {
//       state.selectedUser = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setLoading: (state) => {
//       state.loading = true;
//     },
//     setError: (state, action: PayloadAction<string>) => {
//       state.error = action.payload;
//       state.loading = false;
//     },
//   },
// });

// export const { setUsers, setSelectedUser, setLoading, setError } =
//   userSlice.actions;
// export default userSlice.reducer;


// WITH ASYNCTHUNK
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getUsers } from "@/services/users";
import { DashboardUser } from "@/types/dashboard";
import { User } from "@/lib/types";

interface UserState {
  users: DashboardUser[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Async thunk to fetch users
// export const fetchUsers = createAsyncThunk(
//   "users/fetchUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await getUsers();
//       return data;
//     } catch (error) {
//       return rejectWithValue(
//         error instanceof Error ? error.message : "An unknown error occurred"
//       );
//     }
//   }
// );

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await getUsers();
      // Map User[] to DashboardUser[]
      const dashboardUsers: DashboardUser[] = users.map((user: User) => ({
        id: user.id,
        first_name: user.first_name || "N/A",
        last_name: user.last_name || "N/A",
        role: user.role || "General Back Office",
        status: user.status || "Active",
        created_at: user.createdAt || new Date().toISOString(),
      }));
      return dashboardUsers;
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
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUsers: (state, action: PayloadAction<DashboardUser[]>) => {
      state.users = action.payload;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setLoading, setUsers, setError } = userSlice.actions;
export default userSlice.reducer;
