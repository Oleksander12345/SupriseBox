import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function Checkout() {
  const token = localStorage.getItem('token');
  const user = useSelector((state) => state.auth.user);
  const [orders, setOrders] = useState([]);
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const totalPrice = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
  
  useEffect(() => {
    async function fetchOrders() {
    try {
      const response = await fetch(`http://localhost:5000/api/order`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // Відразу фільтруємо лише неоплачені
      const unpaid = data.filter((order) => !order.isPaid);
      setOrders(unpaid);
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
    }
  }
    fetchOrders();
  }, []);
  useEffect(() => {
    console.log("Client Secret →", clientSecret);
    console.log("Stripe Object →", stripe);
    }, [clientSecret, stripe]);

  

  async function handlePayment(orderId) {
    if (!stripe || !elements) return;

    try {
      const response = await fetch("http://localhost:5000/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(totalPrice) }) // у центах!
      });

      const data = await response.json();
      const secret = data.clientSecret;
      setClientSecret(secret); // збереження, якщо треба пізніше
      console.log(secret)

      const result = await stripe.confirmCardPayment(secret, {
      payment_method: {
          card: elements.getElement(CardElement)
      }
      });
        

        if (result.error) {
        console.error("❌ Payment failed:", result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
          alert("✅ Payment successful!");
          await handlePaymentSuccess(orderId);

          // Знаходимо order, щоб отримати підписки
          const order = orders.find((o) => o._id === orderId);
          if (order && order.subscriptions) {
            for (const sub of order.subscriptions) {
              await activeTheSubscription(sub.subscriptionId._id || sub.subscriptionId);
            }
          }
        }
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
  }
  
  async function handlePaymentSuccess(orderId) {
    try {
      const response = await fetch("http://localhost:5000/api/payment/payment-success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId })
      });

      const data = await response.json();
      console.log(data)
      setOrders([]);
    } catch (error) {
        console.error("❌ Error:", error);
    }
  }

  async function activeTheSubscription(subscriptionId) {
  try {
    const response = await fetch(`http://localhost:5000/api/subscription/activate/${subscriptionId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    const data = await response.json();
    console.log(`✅ Subscription ${subscriptionId} activated:`, data);
  } catch (error) {
    console.error(`❌ Failed to activate subscription ${subscriptionId}:`, error);
  }
}





  return (
    <div className="payment-container">
      <div className="shipping-info">
        <h2>Shipping Information</h2>
        <div className="info-block">
          <h4>Contact</h4>
          <div className="info-row">
            <span>{user?.email}</span>
            <button className="change-btn">Change</button>
          </div>
        </div>

        <div className="info-block">
          <h4>Shipping Address</h4>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '18px',
                  color: '#333',
                  '::placeholder': {
                    color: '#888',
                  },
                },
                invalid: {
                      color: 'red',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>

        <div className="box-scroll">
          {/* <h4>Boxes</h4> */}
          <div className="box-list">
            {orders.map((order) => {
  const boxItems = order.boxes.filter((box) => box.type !== "subscription");
  const subscriptionItems = order.subscriptions || [];

  return (
    <div key={order._id}>
      {boxItems.length > 0 && (
        <div className="box-scroll">
          <h4>Boxes</h4>
          <div className="box-list">
            {boxItems.map((box, index) => (
              <div className="box-item" key={`${order._id}-box-${index}`}>
                <img src={box.image} alt={box.name} />
                <div className="order-details">
                  <p className="item-name">{box.name}</p>
                  <p className="item-qty">Qty {box.quantity}</p>
                </div>
                <p className="item-price">${box.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {subscriptionItems.length > 0 && (
        <div className="subscription-scroll">
          <h4>Subscriptions</h4>
          <div className="box-list">
            {subscriptionItems.map((subscription, index) => (
              <div className="box-item" key={`${order._id}-sub-${index}`}>
                <img src={subscription.subscriptionId.image} alt={subscription.subscriptionId.name} />
                <div className="order-details">
                  <p className="item-name">{subscription.subscriptionId.name}</p>
                  <p className="item-qty">Duration: 12 months</p>
                </div>
                <p className="item-price">${subscription.subscriptionId.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="place-order-btn" onClick={() => handlePayment(order._id)}>Place Order</button>
    </div>
  );
})}


          </div>
        </div>

        <div className="total-row">
          <span>Total:</span>
          <span>${Number(totalPrice).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
