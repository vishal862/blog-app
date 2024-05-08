import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser : null,
    error : null,
    loading : null
}

export const userSlice = createSlice({
    initialState,
    name : "user",
    reducers : {
        signinStart :(state) =>{
            state.loading = true,
            state.error = null
        },
        signinSuccess :(state,action) =>{
            state.currentUser = action.payload
            state.loading = false,
            state.error = null
        },
        signinFailure :(state,action) =>{
            state.loading = false,
            state.error = action.payload
        }
    }
})

export const {signinStart,signinSuccess,signinFailure} = userSlice.actions
export default userSlice.reducer