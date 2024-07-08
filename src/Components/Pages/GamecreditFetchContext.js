import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GamecreditsFetchContext = createContext();

export const GamecreditsFetchDataProvider = ({ children }) => {
    const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
    const AGGamecreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
    const [viewAllGamecredits, setViewAllGamecredits] = useState([]);
    const [gamecredits, setGamecredits] = useState([]);
    const [filteredGamecredits, setFilteredGamecredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageCache, setImageCache] = useState({});

    // Fetch data once when component mounts
    const filterUniqueData = (gamecredits) => {
        const uniqueRecords = [];
        const recordMap = {};

        gamecredits.forEach(record => {
            if (!recordMap[record.gamecredit_name]) {
                recordMap[record.gamecredit_name] = true;
                uniqueRecords.push(record);
            }
        });

        return uniqueRecords;
    };

    useEffect(() => {
        const fetchGamecredits = async () => {
            setLoading(true);
            try {
                const response = await axios.get(AGGamecreditsListAPI);
                const gcAll = response.data;
                const unique = filterUniqueData(response.data);
                unique.sort((a, b) => {
                    if (a.gamecredit_name < b.gamecredit_name) return -1;
                    if (a.gamecredit_name > b.gamecredit_name) return 1;
                    return 0;
                });
                response.data.sort((a, b) => {
                    if (a.gamecredit_name < b.gamecredit_name) return -1;
                    if (a.gamecredit_name > b.gamecredit_name) return 1;
                    return 0;
                });

                const stockListResponse = await axios.get(AGStocksListAPI);
                const stockListData = stockListResponse.data;
                const stockInfo = gcAll.map(giftcard => {
                    const stockCount = stockListData.filter(stock => stock.ag_product_id === giftcard.giftcard_id).length;
                    return {
                        ...giftcard, stocks: stockCount
                    };
                });

                setViewAllGamecredits(gcAll);
                setGamecredits(stockInfo);
                setFilteredGamecredits(unique);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchGamecredits();
    }, []);

    const fetchAndCacheImageGamecredits = async (imageName) => {
        const baseUrl = 'https://2wave.io/GameCreditCovers/';
        const url = `${baseUrl}${imageName}`;
        if (!imageCache[url]) {
            try {
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    setImageCache(prevCache => ({ ...prevCache, [url]: img.src }));
                };
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }
    };

    return (
        <GamecreditsFetchContext.Provider value={{ 
            filterUniqueData, 
            setFilteredGamecredits, 
            viewAllGamecredits,
            gamecredits, 
            filteredGamecredits, 
            loading,
            fetchAndCacheImageGamecredits,
            imageCache 
        }}>
            {children}
        </GamecreditsFetchContext.Provider>
    );
};

export const GamecreditsFetchData = () => useContext(GamecreditsFetchContext);