import {createSlice} from "@reduxjs/toolkit"

const cartModalSlice = createSlice({
    name: "cartModal",
    initialState: {isModalOpen: false},
    reducers: {
        setIsModalOpen(state) {
            state.isModalOpen = true;
        },
        setIsModalClose(state) {
            state.isModalOpen = false;
        }
    }
})

export const cartModalActions = cartModalSlice.actions;
export default cartModalSlice;