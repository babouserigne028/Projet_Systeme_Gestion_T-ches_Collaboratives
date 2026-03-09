import { createSlice } from "@reduxjs/toolkit";

const loadUserFromSession = () => {
  try {
    const savedUser = sessionStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Erreur lors du chargement de l'utilisateur:", error);
    return null;
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: { currentUser: loadUserFromSession() },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      // Sauvegarder dans sessionStorage
      sessionStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      // Nettoyer sessionStorage
      sessionStorage.removeItem("currentUser");
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
