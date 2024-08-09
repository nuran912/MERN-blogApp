//For dark mode toggle.

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: { //here we set the logic
        toggleTheme: (state) => {
            state.theme = ( state.theme === 'light' ? 'dark' : 'light' )    //if theme is light, set it to dark. else set it to light.
        }
    }
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;