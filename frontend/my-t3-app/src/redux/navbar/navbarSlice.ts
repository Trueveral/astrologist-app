import { createSlice } from "@reduxjs/toolkit";

type NavbarStatus = "pending" | "instant message" | "idle";

export type NavbarState = {
  links: string[];
  collapsed: boolean;
  selectedLink: string;
  selectedLinkRect: DOMRect | null;
  hoveredLink: string;
  anchor: null | DOMRect;
  status: NavbarStatus;
};

const initialState: NavbarState = {
  links: ["Panel", "Profile", "Tool", "Help"],
  collapsed: false,
  selectedLinkRect: null,
  selectedLink: "",
  hoveredLink: "",
  anchor: null,
  status: "idle",
};

const navbarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    setNavbarCollapsed: (state, action) => {
      state.collapsed = action.payload as boolean;
    },
    setNavbarSelectedLink: (state, action) => {
      state.selectedLink = action.payload as string;
    },
    setNavbarHoveredLink: (state, action) => {
      state.hoveredLink = action.payload as string;
    },
    setNavbarAnchor: (state, action) => {
      state.anchor = action.payload as DOMRect;
    },
    setNavbarStatus: (state, action) => {
      state.status = action.payload as NavbarStatus;
    },
    setNavbarLinks: (state, action) => {
      state.links = action.payload as string[];
    },
    setNavbarSelectedLinkRect: (state, action) => {
      state.selectedLinkRect = action.payload as DOMRect;
    },
  },
});

export const {
  setNavbarCollapsed,
  setNavbarAnchor,
  setNavbarHoveredLink,
  setNavbarStatus,
  setNavbarSelectedLink,
  setNavbarLinks,
  setNavbarSelectedLinkRect,
} = navbarSlice.actions;
export default navbarSlice.reducer;
