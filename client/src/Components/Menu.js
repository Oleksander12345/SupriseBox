import { useNavigate } from "react-router-dom";
import { useRef } from 'react';
// import { BsBoxSeam } from "react-icons/bs";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { MdSpaceDashboard } from "react-icons/md";
import { IoIosGift } from "react-icons/io";
import { RiFileList3Fill } from "react-icons/ri";
import { HiShoppingCart } from "react-icons/hi";
import { IoPersonCircleSharp } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";
import Modal from "./Modal";
import Cart from "../pages/Cart";
import { useDispatch, useSelector } from "react-redux";
import { cartModalActions } from "../store/cartModal-slice";

function Menu() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cartButtonRef = useRef(null);
    const isModalOpen = useSelector(state => state.cartModal.isModalOpen)
    function handleAddActivecCart(e) {
        cartButtonRef.current?.classList.add('menu-active-cart');
        dispatch(cartModalActions.setIsModalOpen())
    }
      


    return (
        <aside className="menu">
            <div className="menu-title">
                {/* <BsBoxSeam color="hsla(0, 0%, 0%, 0.542)" size={60} className="menu-box"/>  */}
                <img src="/logo1.png" width={"100px"} style={{display: "flex", margin: "auto"}} alt="box"/>
                
            </div>
            <div className="menu-main">
                <ul>
                    <li onClick={() => navigate("/")}><p  className="menu-main-item"><span style={{marginRight: "5px"}}><MdSpaceDashboard size={20}/></span>  Dashboard</p></li>
                    <li onClick={() => navigate("/boxes")}><p  className="menu-main-item"><span style={{marginRight: "5px"}}><IoIosGift  size={20}/></span> Boxes</p></li>
                    <li onClick={() => navigate("/subcriptions")}><p  className="menu-main-item"><span style={{marginRight: "5px"}}><RiFileList3Fill  size={20}/></span> Subcriptions</p></li>
                    <li
                    //  onClick={() => navigate("/cart")}
                    ref={cartButtonRef}
                    style={{transition: "all 0.3s easy"}}
                    onClick={(e) => handleAddActivecCart(e)}
                    ><p className="menu-main-item"><span style={{marginRight: "5px"}}><HiShoppingCart  size={20}/></span><Modal onClose={() => dispatch(cartModalActions.setIsModalClose())}><Cart/></Modal>Cart</p></li>
                    <li onClick={() => navigate("/profile")}><p  className="menu-main-item"><span style={{marginRight: "5px"}}><IoPerson  size={20}/></span> Profile</p></li>
                    <li onClick={() => navigate("/admin")}><p  className="menu-main-item"><span style={{marginRight: "5px"}}><IoPersonCircleSharp  size={20}/></span> Admin Panel</p></li>
                </ul>
            </div>
        </aside>
    );
}

export default Menu;
