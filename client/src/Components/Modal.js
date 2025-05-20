import { useDispatch, useSelector } from "react-redux";
import { cartModalActions } from "../store/cartModal-slice";

const Modal = ({ children }) => {
    const dispatch = useDispatch()
    const isModalOpen = useSelector(state => state.cartModal.isModalOpen)
    if (!isModalOpen) return null;
        function RemoveClassActive(e) {
        const cart = document.querySelector('.menu-active-cart');
        if(cart) {
            cart.classList.remove('menu-active-cart')
            dispatch(cartModalActions.setIsModalClose()); 
        }

    }

    return (
        <div className="modal-overlay" onClick={() => dispatch(cartModalActions.setIsModalClose())}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={
                    RemoveClassActive
                }>✕</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
