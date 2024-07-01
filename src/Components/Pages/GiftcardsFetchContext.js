import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GiftcardsFetchContext = createContext();

export const GiftcardsFetchDataProvider = ({ children }) => {
    const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const [giftcards, setGiftcards] = useState([]);
    const [filteredGiftcards, setFilteredGiftcards] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data once when component mounts
    const filterUniqueData = (giftcards) => {
        const uniqueRecords = [];
        const recordMap = {};

        giftcards.forEach(record => {
            if (!recordMap[record.giftcard_name]) {
                recordMap[record.giftcard_name] = true;
                uniqueRecords.push(record);
            }
        });

        return uniqueRecords;
    };

    useEffect(() => {
        const fetchGiftcards = async () => {
            setLoading(true);
            try {
                const response = await axios.get(AGGiftcardsListAPI);
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
                const stockInfo = unique.map(giftcard => {
                    const stockCount = stockListData.filter(stock => stock.ag_product_id === giftcard.giftcard_id).length;
                    return {
                        ...giftcard, stocks: stockCount
                    };
                });

                setGiftcards(stockInfo);
                setFilteredGiftcards(stockInfo);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchGiftcards();
    }, []);

    return (
        <GiftcardsFetchContext.Provider value={{ 
            filterUniqueData, 
            setFilteredGiftcards, 
            giftcards, 
            filteredGiftcards, 
            loading 
        }}>
            {children}
        </GiftcardsFetchContext.Provider>
    );
};

export const GiftcardsFetchData = () => useContext(GiftcardsFetchContext);