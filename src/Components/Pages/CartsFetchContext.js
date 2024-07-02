import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartsFetchContext = createContext();

export const CartsFetchDataProvider = ({ children }) => {
    const LoginUserID = localStorage.getItem('profileUserID');
    const AGUserProductsCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
    const [productCart, setProductCarts] = useState([]);


    // Fetch data once when component mounts
    const fetchUserCart = async () => {
        try {
            const response = await axios.get(AGUserProductsCartAPI);
            const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
            const gameCartProducts = filteredData.filter(product => product.ag_product_type === 'Game' || 'Giftcards' || 'Game Credit');
            setProductCarts(gameCartProducts);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserCart();
    }, []);

    return (
        <CartsFetchContext.Provider value={{ fetchUserCart, productCart, setProductCarts }}>
            {children}
        </CartsFetchContext.Provider>
    );
};

export const CartsFetchData = () => useContext(CartsFetchContext);