import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const GiftcardsFetchContext = createContext();

export const GiftcardsFetchDataProvider = ({ children }) => {
    const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const [viewAllGiftcards, setViewAllGiftcards] = useState([]);
    const [giftcards, setGiftcards] = useState([]);
    const [filteredGiftcards, setFilteredGiftcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageCache, setImageCache] = useState({});

    // Fetch data once when component mounts
    const filterUniqueData = useCallback((giftcards) => {
        const uniqueRecords = [];
        const recordMap = {};

        giftcards.forEach(record => {
            if (!recordMap[record.giftcard_name]) {
                recordMap[record.giftcard_name] = true;
                uniqueRecords.push(record);
            }
        });

        return uniqueRecords;
    }, []);

    useEffect(() => {
        const fetchGiftcards = async () => {
            setLoading(true);
            try {
                const response = await axios.get(AGGiftcardsListAPI);
                const gcAll = response.data;
                const unique = filterUniqueData(response.data);
                unique.sort((a, b) => {
                    if (a.giftcard_name < b.giftcard_name) return -1;
                    if (a.giftcard_name > b.giftcard_name) return 1;
                    return 0;
                });
                response.data.sort((a, b) => {
                    if (a.giftcard_name < b.giftcard_name) return -1;
                    if (a.giftcard_name > b.giftcard_name) return 1;
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

                setViewAllGiftcards(gcAll);
                setGiftcards(stockInfo);
                setFilteredGiftcards(unique);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchGiftcards();
    }, []);

    const fetchAndCacheImageGiftcards = async (imageName) => {
        const baseUrl = 'https://2wave.io/GiftCardCovers/';
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
        <GiftcardsFetchContext.Provider value={{ 
            filterUniqueData, 
            setFilteredGiftcards, 
            viewAllGiftcards,
            giftcards, 
            filteredGiftcards, 
            loading,
            fetchAndCacheImageGiftcards,
            imageCache 
        }}>
            {children}
        </GiftcardsFetchContext.Provider>
    );
};

export const GiftcardsFetchData = () => useContext(GiftcardsFetchContext);