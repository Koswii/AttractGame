import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserProfileContext = createContext();

export const UserProfileDataProvider = ({ children }) => {
    const [userLoggedData, setUserLoggedData] = useState([]);
    const [viewProfileBtn, setViewProfileBtn] = useState(false);
    const [userEmail, setUserEmaiil] = useState([]);
    const [viewLoginForm, setViewLoginForm] = useState(false);
    const [userProductCodeIDData, setUserProductCodeIDData] = useState([]);
    const [viewTransactionList, setViewTransactionList] = useState([]);
    const [viewSellerStock, setViewSellerStock] = useState([]);
    const [viewStockNumber, setViewStockNumber] = useState([]);
    const [viewStoreList, setViewStoreList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const LoginUsername = localStorage.getItem('attractGameUsername');
    const LoginUserID = localStorage.getItem('profileUserID');
    const AGUserListAPI = process.env.REACT_APP_AG_USERS_LIST_API;
    const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGUserEmailsAPI = process.env.REACT_APP_AG_USER_EMAIL_API;
    const AGProductIDCodeAPI = process.env.REACT_APP_AG_USER_PRODUCTS_ID_API;
    const AGUserProductsCodeAPI = process.env.REACT_APP_AG_USER_PRODUCTS_CODE_API;
    const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const AGUsersTransactions = process.env.REACT_APP_AG_USERS_TRANSACTIONS_API;
    const AGSellerStockList = process.env.REACT_APP_AG_USER_SELLER_STOCKS_API;
    const AGUserStoreList = process.env.REACT_APP_AG_USERS_STORE_LIST_API;


    const fetchUsersEmails = async () => {
        try {
          const response = await axios.get(AGUserEmailsAPI);
          setUserEmaiil(response.data);
        } catch (error) {
          console.error(error);
        }
    };
    const fetchUserStores = async () => {
        try {
          const response = await axios.get(AGUserStoreList);
          const storeList = response.data.filter(store => store.store != '')
          setViewStoreList(storeList);
          
        } catch (error) {
          console.error(error);
        }
    };
    const fetchUserProductIds = async () => {
        setIsLoading(true);
        const userRequestCode = {
            ag_product_owner: LoginUserID,
        };
    
        try {
            const userRequestCodeJSON = JSON.stringify(userRequestCode);
            const response = await axios.post(AGProductIDCodeAPI, userRequestCodeJSON);
    
            const reqData = response.data;
            if (reqData.success === true) {
                const productIDs = reqData.data;
                const gameProducts = productIDs.filter(product => product.ag_product_type === 'Games');
                const giftcardProducts = productIDs.filter(product => product.ag_product_type === 'Giftcards');
                const gamecreditProducts = productIDs.filter(product => product.ag_product_type === 'Game Credits');
                const productCodeIDs = productIDs.map(productID => productID.ag_product_id_code);
                const requestProductCode = {
                    userProductCode: productCodeIDs,
                };
                const requestProductCodeJSON = JSON.stringify(requestProductCode);
                const responseCode = await axios.post(AGUserProductsCodeAPI, requestProductCodeJSON);
                const userActualCodeData = responseCode.data.data;
                const [userGameDataResponse, userGiftcardDataResponse, userGamecreditDataResponse] = await Promise.all([
                    axios.get(AGGamesListAPI),
                    axios.get(AGGiftcardsListAPI),
                    axios.get(AGGameCreditsListAPI)
                ]);
                const cartGameWithData = gameProducts.map(product => {
                    const productData = userGameDataResponse.data.find(game => game.game_canonical === product.ag_product_id);
                    return { ...product, productData};
                });
                const cartGiftcardWithData = giftcardProducts.map(product => {
                    const productData = userGiftcardDataResponse.data.find(giftcard => giftcard.giftcard_id === product.ag_product_id);
                    return { ...product, productData};
                });
                const cartGamecreditWithData = gamecreditProducts.map(product => {
                    const productData = userGamecreditDataResponse.data.find(gamecredit => gamecredit.gamecredit_id === product.ag_product_id);
                    return { ...product, productData};
                });
                const combinedAllData = [...cartGameWithData, ...cartGiftcardWithData, ...cartGamecreditWithData];
                const userProductCodeData = combinedAllData.map(product => {
                    const productCode = userActualCodeData.find(productCode => productCode.ag_product_id_code === product.ag_product_id_code);
                    return {...product, productCode};
                });
                setUserProductCodeIDData(userProductCodeData);
    
            } else {
                setUserProductCodeIDData([]);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const fetchUserTransactionHistory = async () => {
        try {
            const response = await axios.get(AGUsersTransactions);
            const TransactionHistoryData = response.data.filter(user => user.ag_user_id === LoginUserID);
            const TransactionHistorySort = TransactionHistoryData.sort((a, b) => {
                const dateA = new Date(a.ag_transaction_date);
                const dateB = new Date(b.ag_transaction_date);
          
                return dateB - dateA;
            });
            setViewTransactionList(TransactionHistorySort);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch data once when component mounts
    useEffect(() => {
        const fetchUserProfile = async  () => {
            try {
                const [userListResponse, userDataResponse] = await Promise.all([
                  axios.get(AGUserListAPI),
                  axios.get(AGUserDataAPI)
                ]);
                const userDataStatus = userListResponse.data.find(item => item.userid === LoginUserID);
                
                const storedProfileData = localStorage.getItem('profileDataJSON')
                if(storedProfileData) {
                    setUserLoggedData(JSON.parse(storedProfileData))
                }
            } catch (error) {
                console.error(error);
            }
        }
        const fetchSellerStockList = async () => {
            try {
                const response = await axios.get(AGSellerStockList);
                const stockSeller = response.data.filter(user => user.ag_product_seller === LoginUserID);
                const availableStocks = stockSeller.filter(stocks => stocks.ag_product_state === 'Sold')
                setViewSellerStock(stockSeller);
                setViewStockNumber(availableStocks.length);
                
                
            } catch (error) {
                console.error(error);
            }
        };

        


        fetchUsersEmails();
        fetchUserStores();
        fetchUserProductIds();
        fetchUserProfile();
        fetchUserTransactionHistory();
        fetchSellerStockList();
    }, []);

    const handleLoginForm = () => {
        setViewLoginForm(true)
    }

    return (
        <UserProfileContext.Provider value={{ 
            viewProfileBtn, 
            setViewProfileBtn,
            userLoggedData, 
            userEmail, 
            fetchUsersEmails, 
            viewLoginForm, 
            setViewLoginForm, 
            handleLoginForm,
            userProductCodeIDData, 
            setUserProductCodeIDData,
            isLoading, 
            setIsLoading,
            fetchUserProductIds,
            fetchUserTransactionHistory,
            viewTransactionList,
            viewSellerStock,
            viewStockNumber,
            viewStoreList
            }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const UserProfileData = () => useContext(UserProfileContext);