import React, { useEffect, useState, useRef } from 'react'
import "../CSS/cart.css";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
    const [userLoggedData, setUserLoggedData] = useState('');
    const [productDetails, setProductDetails] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        }

        fetchUserProfile();
    }, []);


  return (
    <div className='mainContainer cart'>
        <section className="cartPageContainer top">
            <div className="cartpcTopProfile">
                <div className="cartpctProfile left">
                    {userLoggedData.profileimg ? 
                    <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt=""/>
                    :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                </div>
                <div className="cartpctProfile right">
                    <h5>{userLoggedData.username}'s Cart</h5>
                    <p>Products you checked-out</p>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Cart