import { useContext } from 'react';
import './CartPopup.css';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

function CartPopup({ game, mediaUrlArr, onClose, onViewCart, onRemoveSuccess }) {

    const { cartTotal } = useContext(AppContext);

    const handleRemove = async (gameId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/cart/remove?gameId=${gameId}`);
            onRemoveSuccess();
            onClose(); // đóng popup


        } catch (error) {
            console.error('Error removing game:', error.message, error.response?.status, error.response?.data);
        }
    };



    return (
        <div className="popup-overlay">
            <div className="popup-box">
                <h3>Added to your cart!</h3>
                <div className="game-info">
                    <div className='media-with-caption'>
                        <img src={mediaUrlArr[0]} alt={game.name} />
                    </div>
                    <div className="details d-flex flex-column">
                        <h4>{game.name}</h4>
                        <p>Price: <b>{game.price.toFixed(2)}</b>  </p>
                        {/* <span className="discount">({game.discount}%)</span> */}
                        <p id='remove-opt' onClick={() => handleRemove(game.gameId)}>Remove</p>
                    </div>
                </div>
                <div className="popup-actions ">
                    {/* <button onClick={onClose}>Continue Shopping</button>
                    <button className="view-cart" onClick={onViewCart}>View My Cart</button> */}
                    <div className='popup-btn' onClick={onClose}>Continue Shopping</div>
                    <div className='popup-btn view-cart' onClick={onViewCart}>View My Cart ({cartTotal})</div>
                </div>
            </div>
        </div>
    );
}

export default CartPopup;