import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserProfileContext = createContext();

export const UserProfileDataProvider = ({ children }) => {
    const [userLoggedData, setUserLoggedData] = useState([]);
    const [viewProfileBtn, setViewProfileBtn] = useState(false);
    const [rapidcentAcessToken, setRapidcentAccessToken] = useState([]);
    const [userEmail, setUserEmaiil] = useState([]);
    const [viewLoginForm, setViewLoginForm] = useState(false);
    const [userProductCodeIDData, setUserProductCodeIDData] = useState([]);
    const [viewTransactionList, setViewTransactionList] = useState([]);
    const [viewSellerStock, setViewSellerStock] = useState([]);
    const [viewStockNumber, setViewStockNumber] = useState([]);
    const [viewStoreList, setViewStoreList] = useState([]);
    const [viewTicketReport, setViewTicketReport] = useState([]);
    const [viewTicketMessages, setViewTicketMessages] = useState([]);
    const [viewAllUserList, setViewAllUserList] = useState([]);
    const [viewAllUserProfile, setViewAllUserProfile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const LoginUsername = localStorage.getItem('attractGameUsername');
    const LoginUserID = localStorage.getItem('profileUserID');
    const RapidcentClientIDAPI = process.env.REACT_APP_RAPIDCENT_CLIENT_ID;
    const RapidcentClientSecretAPI = process.env.REACT_APP_RAPIDCENT_CLIENT_SECRET;
    const RapidcentAccessTokenFetchAPI = process.env.REACT_APP_RAPIDCENT_FETCH_ACCESS_TOKEN;
    const RapidcentRefreshTokenAPI = process.env.REACT_APP_RAPIDCENT_TRIGGER_REFRESH_TOKEN;
    const RapidcentRedirectURI = 'https://attractgame-beta-website.vercel.app/MyCart'
    const RapidcentTokenEndPoint = 'https://uatstage00-api.rapidcents.com/oauth/token'
    const AGUserListAPI = process.env.REACT_APP_AG_USERS_LIST_API;
    const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGUserEmailsAPI = process.env.REACT_APP_AG_USER_EMAIL_API;
    const AGProductIDCodeAPI = process.env.REACT_APP_AG_USER_PRODUCTS_ID_API;
    const AGUserProductsCodeAPI = process.env.REACT_APP_AG_USER_PRODUCTS_CODE_API;
    const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const AGUsersTransactions = process.env.REACT_APP_AG_USERS_TRANSACTIONS_API;
    const AGUsersTicketReport = process.env.REACT_APP_AG_USERS_FETCH_TICKET_API;
    const AGTixMessageAPI = process.env.REACT_APP_AG_USERS_TICKET_MESSAGES_API;
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
    const fetchUserTicketReport = async () => {
        try {
            const response = await axios.get(AGUsersTicketReport);
            const TicketReportData = response.data;
            const TicketReportSort = TicketReportData.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
          
                return dateB - dateA;
            });
            setViewTicketReport(TicketReportSort);
        } catch (error) {
            console.error(error);
        }
    };
    const fetchUserTicketMessages = async () => {
        try {
            const intervalId = setInterval(async () => {
                const response = await axios.get(AGTixMessageAPI);
                const TicketMsgData = response.data;
                setViewTicketMessages(TicketMsgData);
            }, 1000);
            return () => clearInterval(intervalId);
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


                const sortUserProductItems = userProductCodeData.sort((a, b) => {
                    const dateA = a.productCode.ag_redeem_date ? new Date(a.productCode.ag_redeem_date) : null;
                    const dateB = b.productCode.ag_redeem_date ? new Date(b.productCode.ag_redeem_date) : null;
                  
                    // If dateA is empty and dateB is not, dateA should come first
                    if (!dateA && dateB) return -1;
                    
                    // If dateB is empty and dateA is not, dateB should come first
                    if (!dateB && dateA) return 1;
                    
                    // If both dates are empty, keep them in their current order
                    if (!dateA && !dateB) return 0;
                    
                    // Otherwise, compare the dates normally
                    return dateB - dateA;
                });
                
                setUserProductCodeIDData(sortUserProductItems);
    
            } else {
                setUserProductCodeIDData([]);
            }

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
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
                setViewAllUserList(userListResponse.data);
                setViewAllUserProfile(userDataResponse.data)
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
        const fetchRCAccessToken = async () => {
            try {
                const response = await axios.get(RapidcentAccessTokenFetchAPI);
                const AuthCodesData = response.data;
                const sortedAuthCodes  = AuthCodesData.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
              
                    return dateB - dateA;
                });
                // Get the first (most recent) item
                const RecentAuthCode = sortedAuthCodes[0];
                console.log(RecentAuthCode);
                
                setRapidcentAccessToken(RecentAuthCode);
                
            } catch (error) {
                console.error(error);
            }
        };
        

        fetchUsersEmails();
        fetchUserTransactionHistory();
        fetchUserTicketReport();
        fetchUserTicketMessages();
        fetchUserStores();
        fetchUserProductIds();
        fetchUserProfile();
        fetchSellerStockList();
        fetchRCAccessToken();
    }, []);

    const handleLoginForm = () => {
        setViewLoginForm(true)
    }

    useEffect(() => {
        const fetchRefreshToken = () => {
            if (rapidcentAcessToken) {
            // Exchange authorization code for access and refresh tokens
            const fetchTokens = async () => {
                try {
                // Prepare the credentials to be sent to the PHP backend
                const body = new URLSearchParams();
                body.append('grant_type', 'refresh_token');
                body.append('client_id', RapidcentClientIDAPI);
                body.append('client_secret', RapidcentClientSecretAPI);
                body.append('redirect_uri', RapidcentRedirectURI);
                body.append('refresh_token', rapidcentAcessToken.refresh_token);

                // Send the request to your PHP backend
                const response = await axios.post(RapidcentTokenEndPoint, body, {
                    headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
            
                console.log(response.data);
                } catch (error) {
                console.error('Error exchanging authorization code for tokens', error);
                }
            };

            fetchTokens();
            }
      };
      fetchRefreshToken();
    }, [rapidcentAcessToken]);


    return (
        <UserProfileContext.Provider value={{ 
            rapidcentAcessToken,
            viewAllUserList,
            viewAllUserProfile,
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
            fetchUserTicketReport,
            fetchUserTicketMessages,
            viewTransactionList,
            viewTicketReport,
            viewTicketMessages,
            viewSellerStock,
            viewStockNumber,
            viewStoreList
            }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const UserProfileData = () => useContext(UserProfileContext);