import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export type initialType = {
    id:string,
}
const initialState :initialType = {
    id:"",
};

const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        setId:(state,action:PayloadAction<string>)=>{
            state.id = action.payload;
        },
    },
});

export const { setId } = authSlice.actions;
export default authSlice.reducer;

