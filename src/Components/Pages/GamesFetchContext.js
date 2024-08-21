import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const GamesFetchContext = createContext();

export const GamesFetchDataProvider = ({ children }) => {
    const [viewAllGames, setViewAllGames] = useState([]);
    const [viewAllGamesNum, setViewAllGamesNum] = useState([]);
    const [viewAllListedGames, setViewAllListedGames] = useState([]);
    const [viewAGData1, setViewAGData1] = useState([]);
    const [viewAGData2, setViewAGData2] = useState([]);
    const [viewWikiData, setViewWikiData] = useState([]);
    const [viewMetacriticData, setViewMetacriticData] = useState([]);
    const [loadingMarketData, setLoadingMarketData] = useState(true);
    const [loadingMarketData2, setLoadingMarketData2] = useState(true);
    const [imageCache, setImageCache] = useState({});
    const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGGamesStatusAPI1 = process.env.REACT_APP_AG_GAMES_STATUS_API;
    const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
    const getRandomItems = (array, numItems) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numItems);
    };

    const fetchGames1 = async () => {
        setLoadingMarketData(false);
        try {
            const response1 = await axios.get(AGGamesListAPI1);
            const agAllGames = response1.data;
            const agSortAllGamesByDate = agAllGames.sort((a, b) => new Date(b.game_released) - new Date(a.game_released));
    
            const stockListResponse = await axios.get(AGStocksListAPI);
            const stockListData = stockListResponse.data;
    
            const stockInfo = agSortAllGamesByDate.map(games => {
                const stock = stockListData.find(stock => stock.ag_product_id === games.game_canonical);
                const stockCount = stockListData.filter(stock => stock.ag_product_id === games.game_canonical).length;
                return {
                    ...games, stock, stockCount,
                };
            });
            setViewAGData1(stockInfo);
            setLoadingMarketData(true);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGames2 = async () => {
        try {
            setLoadingMarketData2(true);
            const response1 = await axios.get(AGGamesListAPI1);
            const agAllGames = response1.data;
            setViewAllGames(agAllGames)
    
            // Get current year
            const currentYear = new Date().getFullYear();
            // Filter games based on the current year
            const currentYearGames = agAllGames.filter(game => {
                const gameDate = new Date(game.game_released);
                return gameDate.getFullYear() === currentYear;
            });
    
            // Sort the games by release month and year
            const sortedCurrentYearGames = currentYearGames.sort((a, b) => {
                const dateA = new Date(a.game_released);
                const dateB = new Date(b.game_released);
                if (dateA.getFullYear() === dateB.getFullYear()) {
                    return dateB.getMonth() - dateA.getMonth(); // Sort by month if years are the same
                }
                return dateB.getFullYear() - dateA.getFullYear(); // Sort by year
            });
    
            const gameCSFeatMetacritic = sortedCurrentYearGames.map(game => game.game_title.toLowerCase().replace(/\s/g, '-'));
            const gameCSFeatWikipedia = sortedCurrentYearGames.map(game => game.game_title_ext1.replace(/\s/g, '_') || game.game_title.replace(/\s/g, '_'));
            const stockListResponse = await axios.get(AGStocksListAPI);
            const stockListData = stockListResponse.data;
    
            const stockInfo = agAllGames.map(games => {
                const stock = stockListData.find(stock => stock.ag_product_id === games.game_canonical);
                const stockCount = stockListData.filter(stock => stock.ag_product_id === games.game_canonical).length;
                return {
                    ...games, stock, stockCount,
                };
            });
    
            
            setViewAllGamesNum(agAllGames);
            setViewAGData2(sortedCurrentYearGames);
            // setViewAllListedGames(sortedCurrentYearGames);
            setViewMetacriticData(gameCSFeatMetacritic);
            setViewWikiData(gameCSFeatWikipedia)
    
            if (stockInfo.length) {
                const getInstockGames = stockInfo.filter(instock => instock.stockCount > 0)
                const randomItems = getRandomItems(getInstockGames, 15);
                setViewAllListedGames(randomItems);
            }
    
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMarketData2(false);
        }
    };


    const fetchAndCacheImageGames = async (imageName) => {
        const baseUrl = 'https://2wave.io/GameCovers/';
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
    // Fetch data once when component mounts
    useEffect(() => {
        fetchGames1();
        fetchGames2();
    }, []);

    return (
        <GamesFetchContext.Provider value={{ 
            viewAllGames, 
            viewAllGamesNum, 
            viewAllListedGames, 
            viewAGData1, 
            viewAGData2, 
            setLoadingMarketData,
            loadingMarketData, 
            loadingMarketData2, 
            viewMetacriticData, 
            viewWikiData,
            fetchAndCacheImageGames,
            imageCache
        }}>
            {children}
        </GamesFetchContext.Provider>
    );
};

export const GamesFetchData = () => useContext(GamesFetchContext);