import { useNavigate } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa6";
import { IoIosLock } from "react-icons/io";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth-slice";
import { useEffect, useState } from "react";


function Dashboard() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const [popularBoxes, setPopularBoxes] = useState()
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [userSubscription, setUserSubscription] = useState()
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    console.log("User role:", role);
    console.log("User:", user);
    console.log("User:", user.name);

    useEffect(() => {
        const userDataRaw = localStorage.getItem("userData");

        const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

        if (token && userData) {
        console.log("DISPATCHING LOGIN:", userData);
        dispatch(authActions.login(userData));
        // dispatch(authActions.logout())
        }

        fetchTrandingBox();
        fetchSubscriptions();
    }, []);

    async function fetchTrandingBox() {
        try {
            const response = await fetch('http://localhost:5000/api/stats/popular-boxes', {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
        
        const data = await response.json();
        setPopularBoxes(data)
        console.log(data)
        } catch(error) {
            console.error(error)
        }
    }

    async function fetchSubscriptions() {
        try {
            const response = await fetch("http://localhost:5000/api/order/paid-subscriptions", {
                method: "GEt",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            setUserSubscription(data)
            console.log(data)
        } catch(error) {
            console.error(error)
        }
    }

    return(
        <div className="dashboard">
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
            <main className="dashboard-main">
                <div className="dashboard-left">
                    <div className="dashboard-left-top">
                        <div className="dashboard-left-top-decription">
                            <h1>Gift boxes & subcriptions</h1>
                            <p>Suprize Someone special</p>
                            <div>
                                <button onClick={() => navigate('/boxes')} style={{color: "#ffffff"}} className="dashboard-button1">Buy Boxes</button>
                                <button onClick={() => navigate('/subcriptions')} className="dashboard-button2">View Plans</button>
                            </div>
                        </div>
                        <div className="dashboard-left-top-img-conatiner">
                            <img className="dashboard-left-top-img" src ="/boxes/box.png" alt="box" />
                        </div>
                    </div>
                    <div  className="dashboard-left-bottom">
                        <div>
                            <h3>Trending</h3>
                        </div>
                        <div className="dashboard-trending">
                            {popularBoxes?.map((box) => (
                                <div className="dashboard-trending-child" style={{width: '155px'}} key={box._id}>
                                    <img src={box.image} width={"150px"} alt="box"/>
                                    <h4>{box.name}</h4>
                                    <p>{box.price}$</p>
                                </div>
                            ))}                            
                        </div>
                        
                    </div>
                </div>
                <div className="dashboard-right">
                    {/* <div className="dashboard-upcoming">
                        <div><h2 style={{textAlign: "center"}}>Upcoming deliveries</h2></div>
                        {user.isLogged && (
                            <div className="dashboard-upcoming-container">
                                <div><FaBoxOpen size={80} color="hsl(39, 100%, 61%)"/></div>
                                <div>
                                    <h4 style={{fontSize: "24px", textAlign: "center"}}>My box</h4>
                                    <p>March 25</p>
                                </div>
                            </div>
                        )}
                        {!user.isLogged && (
                            <div className="dashboard-upcoming-container">
                                <div><IoIosLock size={80} color="hsl(60, 33.30%, 0.60%)"/></div>
                                <div>
                                    <h4 style={{fontSize: "20px", textAlign: "center"}}>Not Avaliable</h4>
                                    <p  style={{fontSize: "15px", textAlign: "center"}}>Please log in to view your upcomming deliveries</p>
                                </div>
                            </div>
                        )}
                    </div> */}
                    <div className="dashboard-subcription">
                        <div><h2 style={{textAlign: "center"}}>Your subcription</h2></div>
                        {!user.isLogged && (
                            <div className="dashboard-subcription-container">
                                <div className="dashboard-lock-container"><IoIosLock  size={80} className="dashboard-lock"/></div>
                                <div>
                                    <h4>Not Avaliable</h4>
                                    <p>Please log in to view your subcreption</p>
                                    {user.isLogged && (<div className="dashboard-subcription-buttons">
                                        <button onClick={() => navigate('/login')} className="dashboard-subcription-login">Login</button>
                                        <button onClick={() => navigate('/registration')}>Registration</button>
                                    </div>)}
                                </div>
                            </div>
                        )}
                        {user.isLogged && (
                            <div className="dashboard-subcription-container">
                                {userSubscription?.map((subscription) => (
                                    <div className="dashboard-subcription-box" key={subscription._id}>
                                        <div><img src={subscription.image} width={"75px"}  alt="box"/></div>
                                        <div>
                                            <h5>{subscription.name}</h5>
                                        </div>    
                                    </div>
                                ))}
                                
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Dashboard