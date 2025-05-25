import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth-slice';

export default function Profile() {
    const email = localStorage.getItem('email')
    const username = localStorage.getItem('username');
    const user = useSelector(state => state.auth.user);
    const [paymentedOrder , setPaymentedOrder] = useState()
    const dispatch = useDispatch()
    const [subscriptions, setSubscriptions] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {      
        const userDataRaw = localStorage.getItem("userData");
    
        const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    
        if (token && userData) {
            console.log("DISPATCHING LOGIN:", userData);
            dispatch(authActions.login(userData));
        }
        async function fetchSubscriptions() {
          try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/subscription", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const data = await res.json();
            setSubscriptions(data);
          } catch (err) {
            console.error("❌ Failed to load subscriptions", err);
          }
        }

        fetchSubscriptions();
        fetchData();
    
    }, []);

    async function fetchData() {
        try {
            const response = await fetch("http://localhost:5000/api/order/paid", {
                method: "GEt",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            setPaymentedOrder(data)
        } catch(error) {
            console.error(error)
        }
    }
    console.log(paymentedOrder)


    return (
        <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
            <div>
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            </div>
            {/* <button className="profile-change-password-button">Change Password</button> */}
        </div>
        <div className="profile-paid-orders-section">

  <div className="profile-section">
  <h2 className="profile-section-title">Purchased Items</h2>
<div className="scroll-container">
  <div className="profile-box-grid scrollable">
    {paymentedOrder?.flatMap(order =>
      order.boxes
        .filter(box => box.type === "box")
        .map((box, index) => (
          <div
            className="profile-box-card"
            key={`${order._id}-box-${index}`}
            style={{ minWidth: "200px", flexShrink: 0 }}
          >
            <img src={box.image} alt={box.name} className="profile-box-image" />
            <div className="profile-box-info">
              <h3>{box.name}</h3>
              <p>${box.price.toFixed(2)}</p>
            </div>
          </div>
        ))
    )}
  </div>
</div>

  <h2 className="profile-section-title">Active Subscriptions</h2>
<div className="scroll-container">
  <div className="profile-box-grid scrollable">
    {subscriptions?.map((box, index) => (
          <div
            className="profile-box-card"
            key={`${box._id}-sub-${index}`}
            style={{ minWidth: "200px", flexShrink: 0 }}
          >
            <img src={box.image} alt={box.name} className="profile-box-image" />
            <div className="profile-box-info">
              <h3>{box.name}</h3>
              <p>Next Delivery: May 12</p>
            </div>
          </div>
        ))
    }
  </div>
</div>
</div>
</div>

        </div>
    );
}
