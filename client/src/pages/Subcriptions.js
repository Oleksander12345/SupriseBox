import { useNavigate } from "react-router-dom";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { authActions } from "../store/auth-slice";
import { addSubscriptionToCart } from "../store/cart-actions";

function Subcriptions() {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user)
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username');
    const dispatch = useDispatch()
    const [subscription, setSubscription] = useState()
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userDataRaw = localStorage.getItem("userData");
    
        console.log("TOKEN:", token); // чи є токен
        console.log("USER_DATA_RAW:", userDataRaw); // має бути JSON string
    
        const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    
        if (token && userData) {
            console.log("DISPATCHING LOGIN:", userData);
            dispatch(authActions.login(userData));
        }
        fetchSubscription()
    }, []);

    async function fetchSubscription() {
        try {
            const response = await fetch("http://localhost:5000/api/subscription", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            
            const data = await response.json()
            setSubscription(data)
        } catch(error) {
            console.error(error)
        }
    }
    console.log(subscription)
    const handleAddToCart = async(boxId) => {
        dispatch(addSubscriptionToCart(boxId))
    }


    return(
        <div className="subcriptions">
            <header className="dashboard-header">
                <div className="dashboard-search">
                    <input className="search" placeholder="Search"/>
                </div>
                {!user.isLogged && (
                    <nav className="dashboard-nav">
                        <button onClick={() => navigate('/login')}>Login</button>
                        <button onClick={() => navigate('/registration')}>Registration</button>
                    </nav>
                )}
                {user.isLogged && (
                    <nav className="dashboard-nav">
                        <button onClick={() => navigate('/login')}><IoPersonCircleSharp  size={23}/>{user.name}</button>
                    </nav>
                )}
            </header>
            <main>
                <div className="boxes-title">
                    <div className="boxes-title-text"><h2>Gift Subcription</h2> <h3>It's buyes you a box avery month in a period of year</h3></div>
                    <div className="boxes-title-categories">
                        <button>All Categories</button>
                        <button>Sort by</button>
                    </div>
                </div>
                <div className="boxes-container">
                    {Array.isArray(subscription) && subscription.map((subscription) => (
                        <div className="dashboard-trending-child" key={subscription._id}>
                            <img src={subscription.image} width={"150px"} height={"150px"} alt="subscription"/>
                            <h4>{subscription.category}</h4>
                            <p>{subscription.price}$</p>
                            <button className="box-buy-button"onClick={() => handleAddToCart(subscription._id)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </main>             
        </div>
    )
}
export default Subcriptions