import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartsFetchContext = createContext();

export const CartsFetchDataProvider = ({ children }) => {
    const LoginUserID = localStorage.getItem('profileUserID');
    const AGUserProductsCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
    const [productCart, setProductCarts] = useState([]);
    const [carts, setCarts] = useState([]);


    // Fetch data once when component mounts
    const fetchUserCart = async () => {
        try {
            const response = await axios.get(AGUserProductsCartAPI);
            const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
            const gameCartProducts = filteredData.filter(product => product.ag_product_type === 'Game' || 'Giftcards' || 'Game Credit');
            const filteredCartID = gameCartProducts.map(cart => cart.ag_product_id)
            setProductCarts(gameCartProducts);
            setCarts(filteredCartID);
        } catch (error) {
            console.error(error);
        }
    };

    // console.log(productCart);


    const gameProducts = productCart.filter(product => product.ag_product_type === 'Game');
    const giftcardProducts = productCart.filter(product => product.ag_product_type === 'Giftcard');
    const gamecreditProducts = productCart.filter(product => product.ag_product_type === 'Game Credit');

    // console.log(gameProducts);


    useEffect(() => {
        fetchUserCart();
    }, [carts]);

    return (
        <CartsFetchContext.Provider value={{ 
            fetchUserCart, 
            carts, 
            productCart, 
            setProductCarts,
            gameProducts,
            giftcardProducts,
            gamecreditProducts
        }}>
            {children}
        </CartsFetchContext.Provider>
    );
};

export const CartsFetchData = () => useContext(CartsFetchContext);