import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FavoritesFetchContext = createContext();

export const FavoritesFetchDataProvider = ({ children }) => {
    const LoginUserID = localStorage.getItem('profileUserID');
    const AGUserFavoritesAPI = process.env.REACT_APP_AG_FETCH_USER_FAV_API;
    const [favorites, setFavorites] = useState([]);


    // Fetch data once when component mounts
    const fetchFavorites = async () => {
        try {
            const response = await axios.get(AGUserFavoritesAPI);
            const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
            const favoriteGameCodes = filteredData.map(fav => fav.ag_product_id);
            setFavorites(favoriteGameCodes);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    return (
        <FavoritesFetchContext.Provider value={{ fetchFavorites, favorites, setFavorites }}>
            {children}
        </FavoritesFetchContext.Provider>
    );
};

export const FavoritesFetchData = () => useContext(FavoritesFetchContext);