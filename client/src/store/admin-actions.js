import { adminActions } from "./admine-slice";
const token = localStorage.getItem("token");

export const fetchAllUsersCount = () => {
    return async(dispatch) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/stats/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            dispatch(adminActions.totalUserCount(data.total))
        } catch(error) {
            console.error(error)
        }
    }
}

export const fetchOrdersCount = () => {
    return async(dispatch) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/stats/orders", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            dispatch(adminActions.totalOrderCount(data.total))
        } catch(error) {
            console.error(error)
        }
    }
}

export const fetchAllActiveSubscription = () => {
    return async(dispatch) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/stats/subscriptions", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            dispatch(adminActions.totalActiveSubscriptionCount(data.total))
            
        } catch(error) {
            console.error(error)
        }
    }
}

export const fetchAllProducts = () => {
    return async(dispatch) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/stats/boxes", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            dispatch(adminActions.totalProductsCount(data.total))
        } catch(error) {
            console.error(error)
        }
    }
}

export const fetchAllUsers = () => {
    return async(dispatch) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            dispatch(adminActions.showAllUsers(data))
        } catch(error) {
            console.error(error)
        }
    }
}

export const fetchAllSubscriptions = () => {
    return async(dispatch) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/subscriptions/active", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            dispatch(adminActions.showAllActveSubscription(data))
        } catch(error) {
            console.error(error)
        }
    }
}

export const fetchAllBoxes = () => {
    return async(dispatch) => {
        try {
            const response = await fetch("http://localhost:5000/api/admin/orders", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            dispatch(adminActions.showAllBoxes(data))
        } catch(error) {
            console.error(error)
        }
    }
}
