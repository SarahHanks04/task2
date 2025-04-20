// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { SidebarState } from "../../types";

// const initialState: SidebarState = {
//   isCollapsed: false,
//   isMobileMenuOpen: false,
// };

// const sidebarSlice = createSlice({
//   name: "sidebar",
//   initialState,
//   reducers: {
//     setIsCollapsed: (state, action: PayloadAction<boolean>) => {
//       state.isCollapsed = action.payload;
//     },
//     setIsMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
//       state.isMobileMenuOpen = action.payload;
//     },
//   },
// });

// export const { setIsCollapsed, setIsMobileMenuOpen } = sidebarSlice.actions;
// export default sidebarSlice.reducer;


// redux/slices/sidebarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
}

const initialState: SidebarState = {
  isCollapsed: false,
  isMobileMenuOpen: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setCollapse: (state, action: PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenu: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const { toggleCollapse, setCollapse, toggleMobileMenu, setMobileMenu } = sidebarSlice.actions;
export default sidebarSlice.reducer;
// redux/slices/sidebarSlice.ts (add to the end)
export const selectIsCollapsed = (state: { sidebar: SidebarState }) => state.sidebar.isCollapsed;
export const selectIsMobileMenuOpen = (state: { sidebar: SidebarState }) => state.sidebar.isMobileMenuOpen;