import { useNavigate } from "react-router-dom";
import { IoPersonCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addItemToCart } from "../store/cart-actions";
import { authActions } from "../store/auth-slice";
// import { TokenExpiredError } from "jsonwebtoken";

function Boxes({isLogged}) {
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [boxesForSell, setBoxesForSell] = useState([])

        
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
        fetchBoxes();
        
    }, []);


    const handleAddToCart = async(boxId) => {
        dispatch(addItemToCart(boxId))
    }
    
    async function fetchBoxes() {
        try{
            const response = await fetch('http://localhost:5000/api/boxes/', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                  },
            })
            const data = await response.json();
            console.log(data)
            setBoxesForSell(data)
        } catch(err) {
            console.error(err)
        }  
    }

    return(
        <div className="boxes">
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
                    <div className="boxes-title-text"><h2>Subcriptions</h2></div>
                    <div className="boxes-title-categories">
                        <button>All Categories</button>
                        <button>Sort by</button>
                    </div>
                </div>
                <div className="boxes-container">
                    {boxesForSell.map((box) => {
                        return(
                            <div className="dashboard-trending-child" key={box.id}>
                                <img src={box.image} width={"150px"} height={"150px"} alt="box"/>
                                <h4>{box.name}</h4>
                                <p>{box.price}</p>
                                <button onClick={() => handleAddToCart(box._id)} className="box-buy-button">Add to Cart</button>
                            </div>
                        )
                        
                    })}
                </div>
            </main>                       
        </div>
    )
    
}
export default Boxes