import { createSlice } from "@reduxjs/toolkit";

//initially the user doesn't exist so it is null
const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: { //here we set the logic
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => { //action is the data we get back as the response and wanna add
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
})

//the logic needs to be exported inorder to be used elsewhere
export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;  

export default userSlice.reducer;