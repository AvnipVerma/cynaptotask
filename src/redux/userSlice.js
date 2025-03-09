import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [
        { id: 1, name: "James", email: "james@gmail.com", phone: "8583453234" },
        { id: 2, name: "Clara", email: "clara@gmail.com", phone: "9983423854" },
        { id: 3, name: "Wayne", email: "wayne@gmail.com", phone: "4348273323" },
        { id: 4, name: "Maya", email: "maya@gmail.com", phone: "9920558566" },
    ],
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter((user) => user.id !== action.payload);
        },
    },
});

export const { addUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
