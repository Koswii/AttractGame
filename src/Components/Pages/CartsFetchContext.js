import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartsFetchContext = createContext();

export const CartsFetchDataProvider = ({ children }) => {
    const LoginUserID = localStorage.getItem('profileUserID');
    const AGUserProductsCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
    const [productCart, setProductCarts] = useState([]);
    const [carts, setCarts] = useState([]);


    // Use useCallback to memoize fetch function to avoid unnecessary re-renders.
    const fetchUserCart = useCallback(async () => {
      try {
        const response = await axios.get(AGUserProductsCartAPI);
        const filteredData = response.data.filter(
          (product) => product.ag_user_id === LoginUserID
        );

        const gameCartProducts = filteredData.filter((product) =>
          ['Game', 'Giftcard', 'Game Credit'].includes(product.ag_product_type)
        );

        const filteredCartID = gameCartProducts.map((cart) => cart.ag_product_id);

        setProductCarts(gameCartProducts);
        setCarts(filteredCartID);
      } catch (error) {
        console.error('Error fetching user cart:', error);
      }
    }, [AGUserProductsCartAPI, LoginUserID]);

    // Fetch the cart data once when the component mounts.
    useEffect(() => {
      fetchUserCart();
      // Optionally: Use polling every X minutes (if required).
      const interval = setInterval(() => fetchUserCart(), 1000); // 1 sec
      return () => clearInterval(interval); // Clean up on unmount
    }, [fetchUserCart]);

    // Filter products by type once the productCart state is updated.
    const gameProducts = productCart.filter(
      (product) => product.ag_product_type === 'Game'
    );
    const giftcardProducts = productCart.filter(
      (product) => product.ag_product_type === 'Giftcard'
    );
    const gamecreditProducts = productCart.filter(
      (product) => product.ag_product_type === 'Game Credit'
    );


    return (
        <CartsFetchContext.Provider value={{ 
            fetchUserCart, 
            carts,
            setCarts, 
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