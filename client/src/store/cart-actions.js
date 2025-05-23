import { cartActions } from "./cart-slice";


export const fetchDataCart = () => {
    return async (dispatch) => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/cart', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      dispatch(cartActions.showCartItem(data));
      console.log("fetchDataCart returned:", data.cart); 
      console.log("📦 fetchDataCart returned:", data);
    };
};

export const addItemToCart = (boxId) => {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/cart/add-random/${boxId}`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ boxId })
        })
        const data = await response.json()
        console.log("Server responded:", data);
        dispatch(cartActions.showCartItem(data.cart));
        console.log("Dispatched to Redux:", data.cart);
    };
};
  

export const removeItemFromCart = (boxId) => {
    return async (dispatch) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cart/remove/${boxId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      dispatch(cartActions.showCartItem(data.cart)); // ✅
    };
};

export const increaseQuantity = (boxId) => {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/cart/increase/${boxId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json()
        dispatch(cartActions.showCartItem(data.cart));
    }
}

export const decreaseQuantity = (boxId) => {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/cart/decrease/${boxId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json()
        dispatch(cartActions.showCartItem(data.cart));
    }
}

export const placeOrder = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("✅ Order response:", data);
      // можна тут зробити dispatch(cartActions.clearCart()), якщо потрібно
      return data;
    } catch (err) {
      console.error("❌ Failed to place order:", err);
      throw err;
    }
  };
};

export const addSubscriptionToCart = (subscriptionId) => {
  return async (dispatch) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/cart/add-subscription/${subscriptionId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message); // ← тут ти отримаєш повідомлення "Subscription is already active"
        return;
      }

      dispatch(cartActions.showCartItem(data.cart));
    } catch (error) {
      console.error("❌ Error adding subscription:", error);
      alert("Something went wrong while adding subscription");
    }
  };
};
