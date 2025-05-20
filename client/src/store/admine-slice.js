import {createSlice} from "@reduxjs/toolkit"

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        userCount: 0,
        ordersCount: 0,
        activeSubscriptionCount: 0,
        allProductsCount: 0,
        allUsers: [],
        allActiveSubscription: [],
        allBoxes: [],
    },
    reducers: {
        totalUserCount(state, action) {
            state.userCount = action.payload;
        },
        totalOrderCount(state, action) {
            state.ordersCount = action.payload;
        },
        totalActiveSubscriptionCount(state, action) {
            state.activeSubscriptionCount = action.payload;
        },
        totalProductsCount(state, action) {
            state.allProductsCount = action.payload;
        },
        showAllUsers(state, action) {
            state.allUsers = action.payload;
        },
        showAllActveSubscription(state, action) {
            state.allActiveSubscription = action.payload;
        },
        showAllBoxes(state, action) {
            state.allBoxes = action.payload;
        }

    }
})

export const adminActions = adminSlice.actions;
export default adminSlice;