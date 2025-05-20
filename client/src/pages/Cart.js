import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { removeItemFromCart, fetchDataCart, increaseQuantity, decreaseQuantity, placeOrder } from "../store/cart-actions";

function Cart({ onCloseModal }) {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const cartBox = useSelector((state) => state.cart.items);
    const totalPrice = useSelector(state => state.cart.totalPrice)
    const token = localStorage.getItem('token')

    useEffect(()=> {
        dispatch(fetchDataCart())
    }, [])
    

    async function handleToRemove(boxId) {
        dispatch(removeItemFromCart(boxId))
        
    }
    console.log(cartBox)

    async function handleGoToOrder() {
        try {
            dispatch(placeOrder())
            navigate("/checkout")
            
        } catch(error) {
            console.error(error)
        }
    }
  
    return(
        <div className="cart">
            <main className="cart-container">
                <div className="cart-title">
                    <div><h2>Cart</h2></div>
                    <div className="cart-order">
                        <h5>Total: ${totalPrice}</h5>
                        <button onClick={() => handleGoToOrder()}>Go to order</button>
                    </div>
                </div>
                <div className="cart-main">
                {cartBox.map(box => (
                    <div className="cart-buyed" key={box.item?._id}>
                        <div className="cart-buyed-left">
                        <img src={box.item?.image} width={"150px"} height={"150px"} />
                        <h4>{box.item?.name}</h4>
                        </div>
                        <div className="cart-controller">
                        <button onClick={() => dispatch(decreaseQuantity(box._id))}>-</button>
                        <p>{box.quantity}</p>
                        <button onClick={() => dispatch(increaseQuantity(box._id))}>+</button>
                        <h5>${box.item?.price}</h5>
                        <button onClick={() => handleToRemove(box._id)} className="cart-remove">
                            <span><MdDeleteForever size={22} /></span>Remove
                        </button>
                        </div>
                    </div>
                ))}

                </div>
            </main>                       
        </div>
    )
    
}
export default Cart