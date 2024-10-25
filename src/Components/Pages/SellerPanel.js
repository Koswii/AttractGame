import React, { useState, useEffect } from 'react'
import "../CSS/sellerPanel.css";
import axios from 'axios';
import { 
    RiArrowUpSFill,
    RiArrowDownSFill,
    RiAddBoxFill   
} from "react-icons/ri";
import { 
    FaBars,
    FaTimes,
    FaSortAlphaDown,
    FaSortAlphaUp,
    FaCheck,
    FaSearch,
    FaFilter,
    FaExternalLinkAlt  
} from 'react-icons/fa';
import { 
    TbLayoutDashboard,
    TbCubePlus ,
    TbGiftCard,
    TbDeviceGamepad2,
    TbDiamond,
    TbBuildingStore,
    TbCircleCheck,
    TbInfoCircle,
    TbTicket,
    TbPackages,
    TbDatabaseDollar,
    TbUserQuestion,
    TbMessages,
    TbMessage2,
    TbSend,
    TbTrash,
    TbReceipt, 
    TbCash,        
} from "react-icons/tb";
import { VscSaveAs } from "react-icons/vsc";
import { FiEdit } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { TiArrowSortedDown } from "react-icons/ti";
import { UserProfileData } from './UserProfileContext';
import { GamesFetchData } from './GamesFetchContext';
import { GiftcardsFetchData } from './GiftcardsFetchContext';
import { GamecreditsFetchData } from './GamecreditFetchContext';
import { FaTicket } from 'react-icons/fa6';


const formatDateToWordedDate = (numberedDate) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date = new Date(numberedDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}
const UsernameSlicer = ({ text = '', maxLength }) => {
    const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  
    return (
      <>{truncatedText}</>
    );
};


const SellerPanel = () => {
    const [activeView, setActiveView] = useState('default');
    const { 
        isLoading,
        fetchUserStores,
        viewAllUserList,
        viewAllUserProfile,
        userLoggedData, 
        viewSellerStock,
        viewAvailableStockNumber,
        viewSoldStockNumber,
        viewTicketReport,
        viewTicketMessages, 
        fetchUserTicketReport,
        fetchUserTicketMessages
    } = UserProfileData();
    const { 
        loadingMarketData,
        viewAGData1,
        fetchGames1,
        fetchGames2
    } = GamesFetchData();
    const { 
        loadingGiftcards,
        giftcards,
        fetchGiftcards
    } = GiftcardsFetchData();
    const { 
        loadingGamecredit,
        gamecredits,
        fetchGamecredits
    } = GamecreditsFetchData();
    

    const outsourceGames = viewAGData1.filter(seller => seller.game_seller != `${userLoggedData.store}`)
    const outsourceGiftcards = giftcards.filter(seller => seller.giftcard_seller != `${userLoggedData.store}`)
    const outsourceGameCredits = gamecredits.filter(seller => seller.gamecredit_seller != `${userLoggedData.store}`)
    const allExistingProducts = [...outsourceGames, ...outsourceGiftcards, ...outsourceGameCredits];

    const AGAddGamesAPI = process.env.REACT_APP_AG_ADD_GAMES_API;
    const AGAddGameCoverAPI = process.env.REACT_APP_AG_ADD_GAME_COVER_API;
    const AGAddGiftcardsAPI = process.env.REACT_APP_AG_ADD_GIFTCARD_API;
    const AGAddGiftcardCoverAPI = process.env.REACT_APP_AG_ADD_GIFTCARD_COVER_API;
    const AGAddGameCreditsAPI = process.env.REACT_APP_AG_ADD_GAMECREDIT_API;
    const AGAddGameCreditCoverAPI = process.env.REACT_APP_AG_ADD_GAMECREDIT_COVER_API;
    const AGInsertProductCodeAPI = process.env.REACT_APP_AG_USER_SELLER_ADD_STOCKS_API;
    const AGProductStateAPI = process.env.REACT_APP_AG_PRODUCT_STATE_CREDENTIALS_API;
    const AGSellerTixReponseAPI = process.env.REACT_APP_AG_USERS_TICKET_RESPONSE_API;
    const AGSendTixMessageAPI = process.env.REACT_APP_AG_USERS_TICKET_SEND_MESSAGE_API;
    const [addProductModal, setAddProductModal] = useState(false);
    const [addProductResponse, setAddProductResponse] = useState('');

    const gameStocksNum = viewAvailableStockNumber.filter(stock => stock.ag_product_type === "Games")
    const giftcardsStocksNum = viewAvailableStockNumber.filter(stock => stock.ag_product_type === "Giftcards")
    const gamecreditsStocksNum = viewAvailableStockNumber.filter(stock => stock.ag_product_type === "Game Credits")
    const currentProductSales = viewSoldStockNumber
        .map(sales => parseFloat(sales.ag_withdrawable_amount))
        .reduce((acc, curr) => acc + curr, 0);


    
    useEffect(() => {
        const savedView = localStorage.getItem('activeView');
        if (savedView) {
        setActiveView(savedView);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('activeView', activeView);
    }, [activeView]);
    const handleViewNavigations = () => {
        setActiveView('default');
    };
    const handleViewAddGames = () => {
        setActiveView('games');
    };
    const handleViewAddGiftcards = () => {
        setActiveView('giftcards');
    };
    const handleViewAddGamecredits = () => {
        setActiveView('gamecredits');
    };
    const handleViewAddCodes = () => {
        setActiveView('productList');
    };
    const handleViewInventory = () => {
        setActiveView('inventory');
    };
    const handleViewTickets = () => {
        setActiveView('tickets');
        fetchUserTicketReport();
    };
    const handleViewSell = () => {
        setActiveView('sell');
    };
    const handleViewFaqs = () => {
        setActiveView('faqs');
    };




    const handleFlipProduct = async (productCode) => {
        const pCode = allExistingProducts.find(pCodeID => 
        pCodeID.game_canonical === productCode || 
        pCodeID.giftcard_id === productCode || 
        pCodeID.gamecredit_id === productCode 
    );

        if (pCode.game_canonical){
            const agSetGameTitle = pCode.game_title;
            const agSetGameEdition = pCode.game_edition;
            const agSetGamePlatform = pCode.game_platform;
            const agSetGameCode1 = agSetGameTitle.replace(/\s/g, '');
            const agSetGameCode2 = agSetGamePlatform.replace(/\s/g, '');
            const agSetGameCode3 = agSetGameEdition.replace(/\s/g, '');
            
            const formFlipGameDetails = {
                agGameCode: `${userLoggedData.storesymbol}_${agSetGameCode1}_${agSetGameCode2}`,
                agGameCover: pCode.game_cover,
                agGameTitle: pCode.game_title,
                agGameCanonical: `${agSetGameCode1}${agSetGameCode2}_${agSetGameCode3}_${userLoggedData.storesymbol}`,
                agGameEdition: pCode.game_edition,
                agGameCountry: pCode.game_country,
                agGameDeveloper: pCode.game_developer,
                agGameRelease: pCode.game_released,
                agGameCategory: pCode.game_category,
                agGamePlatform: pCode.game_platform,
                agGameTrailer: pCode.game_trailer,
                agGameSeller: userLoggedData.store,
                agGameHighlight1: '',
                agGameSupplier: '',
                agGameAvailable: '',
                agGameRestricted: '',
            };

            // const test = JSON.stringify(formFlipGameDetails)
            // console.log(test);
            


            try {
                const addGameResponse = await axios.post(AGAddGamesAPI, formFlipGameDetails);
                const responseMessage = addGameResponse.data;
        
                if (responseMessage.success) {
                    setAddProductModal(true);
                    setAddProductResponse(responseMessage.message);
                    fetchGames2();

                    const timeoutId = setTimeout(() => {
                        setAddProductModal(false)
                        setAddProductResponse('');
                    }, 5000);
                    return () => clearTimeout(timeoutId);
                }
        
            } catch (error) {
                console.error(error);
            }
            
        }

        if (pCode.giftcard_id){
            const agSetGiftCardTitle = pCode.giftcard_name;
            const agSetGiftCardCode1 = agSetGiftCardTitle.replace(/\s/g, '');

            const formFlipGiftcardDetails = {
                agGiftcardCode: `${userLoggedData.storesymbol}_${agSetGiftCardCode1}_${pCode.giftcard_denomination}`,
                agGiftcardCover: pCode.giftcard_cover,
                agGiftcardTitle: pCode.giftcard_name,
                agGiftcardCanonical : pCode.giftcard_canonical,
                agGiftcardDenomination: pCode.giftcard_denomination,
                agGiftcardSupplier: pCode.giftcard_seller,
                agGiftcardSeller: userLoggedData.store,
                agGiftcardCategory: pCode.giftcard_category,
                agGiftcardDescription: pCode.giftcard_description,
            };

            
            // const test = JSON.stringify(formFlipGiftcardDetails)
            // console.log(test);

            try {
                const addGiftcardResponse = await axios.post(AGAddGiftcardsAPI, formFlipGiftcardDetails);
                const responseMessage = addGiftcardResponse.data;
        
                if (responseMessage.success) {
                    setAddProductModal(true);
                    setAddProductResponse(responseMessage.message);
                    fetchGiftcards()
                    
                    const timeoutId = setTimeout(() => {
                        setAddProductModal(false)
                        setAddProductResponse('');
                    }, 5000);
                    return () => clearTimeout(timeoutId);
                }
        
            } catch (error) {
                console.error(error);
            } 

        }

        if (pCode.gamecredit_id){
            const agSetGameCreditTitle = pCode.gamecredit_name;
            const agSetGameCreditCode1 = agSetGameCreditTitle.replace(/\s/g, '');

            const formAddGamecreditsDetails = {
                agGamecreditCode: `${userLoggedData.storesymbol}_${agSetGameCreditCode1}GameCredit_${pCode.gamecredit_denomination}`,
                agGamecreditCover: pCode.gamecredit_cover,
                agGamecreditTitle: pCode.gamecredit_name,
                agGamecreditNumber : pCode.gamecredit_number,
                agGamecreditType: pCode.gamecredit_type,
                agGamecreditCanonical : pCode.gamecredit_canonical,
                agGamecreditDenomination: pCode.gamecredit_denomination,
                agGamecreditSupplier: pCode.gamecredit_seller,
                agGamecreditSeller: userLoggedData.store,
                agGamecreditCategory: pCode.gamecredit_category,
                agGamecreditDescription: pCode.gamecredit_description,
            };

            
            // const test = JSON.stringify(formAddGamecreditsDetails)
            // console.log(test);

            try {
                const addGamecreditResponse = await axios.post(AGAddGameCreditsAPI, formAddGamecreditsDetails);
                const responseMessage = addGamecreditResponse.data;
        
                if (responseMessage.success) {
                    setAddProductModal(true);
                    setAddProductResponse(responseMessage.message);
                    fetchGamecredits()
                    
                    const timeoutId = setTimeout(() => {
                        setAddProductModal(false)
                        setAddProductResponse('');
                    }, 5000);
                    return () => clearTimeout(timeoutId);
                }
        
            } catch (error) {
                console.error(error);
            } 
        }
    
    };



    const [formResponse, setFormResponse] = useState('');
    // Seller Add Game Setup
    const [agSetGameCover, setAGSetGameCover] = useState('');
    const [agSetGameTitle, setAGSetGameTitle] = useState('');
    const [agSetGameEdition, setAGSetGameEdition] = useState('');
    const [agSetGameCountry, setAGSetGameCountry] = useState('');
    const [agSetGameDeveloper, setAGSetGameDeveloper] = useState('');
    const [agSetGameRelease, setAGSetGameRelease] = useState('');
    const [agSetGameCategory, setAGSetGameCategory] = useState('');
    const [agSetGamePlatform, setAGSetGamePlatform] = useState('');
    const [agSetGameTrailer, setAGSetGameTrailer] = useState('');
    const [agSetGameHighlight1, setAGSetGameHighlight1] = useState('');
    const [agSetGameAvailable, setAGSetGameAvailable] = useState('');
    const [agSetGameRestricted, setAGSetGameRestricted] = useState('');
    const agSetGameCode1 = agSetGameTitle.replace(/[^a-zA-Z0-9]/g, '');
    const agSetGameCode2 = agSetGamePlatform.replace(/\s/g, '');
    const agSetGameCode3 = agSetGameEdition.replace(/\s/g, '');
    const agFullSetGameCode = `${userLoggedData.storesymbol}_${agSetGameCode1}_${agSetGameCode2}`;
    const agGameCanonical = `${agSetGameCode1}${agSetGamePlatform}_${agSetGameCode3}_${userLoggedData.storesymbol}`;
    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setAGSetGameCover(file.name);
        }
    };
    const [agAddGameEdition, setAGAddGameEdition] = useState(false)
    const handleViewAddGameEdition = (e) => {
        e.preventDefault();
        setAGAddGameEdition(true)
    }
    const handleHideAddGameEdition = (e) => {
        e.preventDefault();
        setAGAddGameEdition(false)
    }
    const handleAddGame = async (e) => {
        e.preventDefault();
    
        const formAddGameDetailsSeller = {
            agGameCode: agFullSetGameCode,
            agGameCover: agSetGameCover,
            agGameTitle: agSetGameTitle,
            agGameCanonical: agGameCanonical,
            agGameEdition: agSetGameEdition,
            agGameCountry: agSetGameCountry,
            agGameDeveloper: agSetGameDeveloper,
            agGameRelease: agSetGameRelease,
            agGameCategory: agSetGameCategory,
            agGamePlatform: agSetGamePlatform,
            agGameTrailer: agSetGameTrailer,
            agGameHighlight1: agSetGameHighlight1,
            agGameSupplier: '',
            agGameSeller: userLoggedData.store,
            agGameAvailable: agSetGameAvailable,
            agGameRestricted: agSetGameRestricted,
        };

        // const test = JSON.stringify(formAddGameDetailsSeller)
        // console.log(test);
    
        const formImageDataSeller = new FormData();
        formImageDataSeller.append('agGameCover', image);

    
        try {
            // Sending game details
            const addGameResponse = await axios.post(AGAddGamesAPI, formAddGameDetailsSeller);
            const responseMessage = addGameResponse.data;
    
            setFormResponse(responseMessage.message);
            console.log(responseMessage.message);
    
            if (responseMessage.success) {
                setImage(null);
                setAGSetGameCover('');
                setAGSetGameTitle('');
                setAGSetGameEdition('');
                setAGSetGameCountry('');
                setAGSetGameDeveloper('');
                setAGSetGameRelease('');
                setAGSetGameCategory('');
                setAGSetGamePlatform('');
                setAGSetGameTrailer('');
                setAGSetGameHighlight1('');
                setAGSetGameAvailable('');
                setAGSetGameRestricted('');
                fetchGames1();
                fetchGames2();

                
                setAddProductModal(true);
                setAddProductResponse(responseMessage.message);

                const timeoutId = setTimeout(() => {
                    setAddProductModal(false)
                    setAddProductResponse('');
                }, 5000);
                return () => clearTimeout(timeoutId);
            }
            // Sending game cover image
            const response = await axios.post(AGAddGameCoverAPI, formImageDataSeller, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Seller Add Giftcards Setup
    const [agSetGiftCardTitle, setAGSetGiftCardTitle] = useState('');
    const [agSetGiftCardCover, setAGSetGiftCardCover] = useState('');
    const [agSetGiftCardDenomination, setAGSetGiftCardDenomination] = useState('');
    const [agSetGiftCardCategory, setAGSetGiftCardCategory] = useState('');
    const [agSetGiftCardDescription, setAGSetGiftCardDescription] = useState('');
    const agSetGiftCardCode1 = agSetGiftCardTitle.replace(/\s/g, '');
    const agSetGiftCardCode2 = agSetGiftCardDenomination.replace(/\s/g, '');
    const agSetGiftCardCode3 = agSetGiftCardTitle.replace(/ /g, '_');
    const agSetGiftCardCanonical = `${agSetGiftCardCode3}`;
    const agFullSetGiftCardCode = `${userLoggedData.storesymbol}_${agSetGiftCardCode1}_${agSetGiftCardCode2}`;
    const [imageGCV, setImageGCV] = useState(null);
    const handleFileInputGCVChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageGCV(file);
            setAGSetGiftCardCover(file.name);
        }
    };
    const handleAddGiftcard = async (e) => {
        e.preventDefault();
    
        const formAddGiftcardsDetailsSeller = {
            agGiftcardCode: agFullSetGiftCardCode,
            agGiftcardCover: agSetGiftCardCover,
            agGiftcardTitle: agSetGiftCardTitle,
            agGiftcardCanonical : agSetGiftCardCanonical,
            agGiftcardDenomination: agSetGiftCardDenomination,
            agGiftcardSupplier: '',
            agGiftcardSeller: userLoggedData.store,
            agGiftcardCategory: agSetGiftCardCategory,
            agGiftcardDescription: agSetGiftCardDescription,
        };

        
        // const test = JSON.stringify(formAddGiftcardsDetailsSeller)
        // console.log(test);
    
        const formImageGCVData = new FormData();
        formImageGCVData.append('agGiftcardCover', imageGCV);

        try {
            // Sending gift card details
            const addGiftcardsResponse = await axios.post(AGAddGiftcardsAPI, formAddGiftcardsDetailsSeller);
            const responseMessage = addGiftcardsResponse.data;
    
            setFormResponse(responseMessage.message);
            console.log(responseMessage.message);
    
            if (responseMessage.success) {
                setImageGCV(null);
                setAGSetGiftCardTitle('');
                setAGSetGiftCardDenomination('');
                setAGSetGiftCardCategory('');
                setAGSetGiftCardDescription('');
                fetchGiftcards();

                
                setAddProductModal(true);
                setAddProductResponse(responseMessage.message);
                
                const timeoutId = setTimeout(() => {
                    setAddProductModal(false)
                    setAddProductResponse('');
                }, 5000);
                return () => clearTimeout(timeoutId);
            }
            // Sending giftcard cover image
            const response = await axios.post(AGAddGiftcardCoverAPI, formImageGCVData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Seller Add Gamecredits Setup
    const [agSetGameCreditTitle, setAGSetGameCreditTitle] = useState('');
    const [agSetGameCreditCover, setAGSetGameCreditCover] = useState('');
    const [agSetGameCreditDenomination, setAGSetGameCreditDenomination] = useState('');
    const [agSetGameCreditNumber, setAGSetGameCreditNumber] = useState('');
    const [agSetGameCreditType, setAGSetGameCreditType] = useState('');
    const [agSetGameCreditDescription, setAGSetGameCreditDescription] = useState('');
    const agSetGameCreditCode1 = agSetGameCreditTitle.replace(/\s/g, '');
    const agSetGameCreditCode2 = agSetGameCreditDenomination.replace(/\s/g, '');
    const agSetGameCreditCode3 = agSetGameCreditTitle.replace(/[(){}\-.,]/g, '');
    const agSetGameCreditCode4 = agSetGameCreditCode3.replace(/\s/g, '');
    const agSetGameCreditCode5 = `${agSetGameCreditCode3.replace(/ /g, '_') + '_Game_Credit'}`;
    const agSetGameCreditCanonical = `${agSetGameCreditCode5}_${userLoggedData.userid}`;
    const agFullSetGameCreditCode = `${userLoggedData.storesymbol}_${agSetGameCreditCode4}GameCredit_${agSetGameCreditCode2}`;
    const [imageGCR, setImageGCR] = useState(null);
    const handleFileInputGCRChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageGCR(file);
            setAGSetGameCreditCover(file.name);
        }
    };
    const handleAddGamecredit = async (e) => {
        e.preventDefault();
    
        const formAddGamecreditsDetailsSeller = {
            agGamecreditCode: agFullSetGameCreditCode,
            agGamecreditCover: agSetGameCreditCover,
            agGamecreditTitle: agSetGameCreditTitle,
            agGamecreditNumber : agSetGameCreditNumber,
            agGamecreditType: agSetGameCreditType,
            agGamecreditCanonical : agSetGameCreditCanonical,
            agGamecreditDenomination: agSetGameCreditDenomination,
            agGamecreditSupplier: '',
            agGamecreditSeller: userLoggedData.store,
            agGamecreditCategory: 'Gaming',
            agGamecreditDescription: agSetGameCreditDescription,
        };
    
        const formImageGCRData = new FormData();
        formImageGCRData.append('agGamecreditCover', imageGCR);
    
        try {
            // Sending game credit details
            const addGameCreditsResponse = await axios.post(AGAddGameCreditsAPI, formAddGamecreditsDetailsSeller);
            const responseMessage = addGameCreditsResponse.data;
    
            setFormResponse(responseMessage.message);
            console.log(responseMessage.message);
    
            if (responseMessage.success) {
                setImageGCR(null);
                setAGSetGameCreditTitle('');
                setAGSetGameCreditDenomination('');
                setAGSetGameCreditNumber('');
                setAGSetGameCreditType('');
                setAGSetGameCreditDescription('');
                fetchGamecredits();

                
                setAddProductModal(true);
                setAddProductResponse(responseMessage.message);
                
                const timeoutId = setTimeout(() => {
                    setAddProductModal(false)
                    setAddProductResponse('');
                }, 5000);
                return () => clearTimeout(timeoutId);
            }
    
            // Sending game credit cover image
            const response = await axios.post(AGAddGameCreditCoverAPI, formImageGCRData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    
    // code id generator
    const postIDGenerator = (length) => {
        const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
        }
        return result;
    };
    const [viewAddCodeModal, setViewAddCodeModal] = useState(false);
    const [viewGameDetails, setViewGameDetails] = useState([]);
    const [viewGiftcardDetails, setViewGiftcardDetails] = useState([]);
    const [viewGamecreditDetails, setViewGamecrditsDetails] = useState([]);
    const viewSellerGames = viewAGData1.filter(seller => seller.game_seller === userLoggedData.store)
    const viewSellerGiftcards = giftcards.filter(seller => seller.giftcard_seller === userLoggedData.store)
    const viewSellerGamecredits = gamecredits.filter(seller => seller.gamecredit_seller === userLoggedData.store)
    const allMarketProducts = [...viewSellerGames, ...viewSellerGiftcards, ...viewSellerGamecredits]

    const currentSellerStocks = viewSellerStock.map(product => {
        const details = allMarketProducts.find(stock => 
            stock.game_canonical === product.ag_product_id ||
            stock.giftcard_id === product.ag_product_id ||
            stock.gamecredit_id === product.ag_product_id
        );
        return {
            ...product, ...details,
        };
    });
    const sellerOpenProduct = (productCode) => {
        const viewGameProduct = viewSellerGames.find(pCodeID => pCodeID.game_code === productCode)
        const viewGiftcardProduct = viewSellerGiftcards.find(pCodeID => pCodeID.giftcard_id === productCode)
        const viewGamecreditProduct = viewSellerGamecredits.find(pCodeID => pCodeID.gamecredit_id === productCode)
        setViewAddCodeModal(true);
        setViewGameDetails(viewGameProduct);
        setViewGiftcardDetails(viewGiftcardProduct);
        setViewGamecrditsDetails(viewGamecreditProduct);
    }
    const handleCloseModals = () => {
        setViewAddCodeModal(false)
        setViewTicketModal(false)
        setAddTicketResponse(false)
        setViewTicketMsgModal(false)
        setUserTixSentMsg('')
        fetchUserTicketMessages()
    }
    if(viewAddCodeModal == true){
        window.document.body.style.overflow = 'hidden';
    } else{
        window.document.body.style.overflow = 'auto';
    }

    const [searchTermGames, setSearchTermGames] = useState('');
    const [searchTermGiftcards, setSearchTermGiftcards] = useState('');
    const [searchTermGameCredits, setSearchTermGameCredits] = useState('');

    const filteredGames = outsourceGames.filter((game) =>
        game.game_title.toLowerCase().includes(searchTermGames.toLowerCase())
    );
    const filteredGiftCards = outsourceGiftcards.filter((giftcard) =>
        giftcard.giftcard_name.toLowerCase().includes(searchTermGiftcards.toLowerCase())
    );
    const filteredGameCredits = outsourceGameCredits.filter((gamecredit) =>
        gamecredit.gamecredit_name.toLowerCase().includes(searchTermGameCredits.toLowerCase())
    );

    const [productSellerPrice, setProductSellerPrice] = useState('')
    const [productSellerDiscount, setProductSellerDiscount] = useState('')
    const [productSellerCode, setProductSellerCode] = useState('');

    const handleAddProductCodeGames = async (e) => {
        e.preventDefault();
    
        const formAddProductCodeGames = {
            agProductName: viewGameDetails.game_title,
            agProductID: viewGameDetails.game_canonical,
            agProductPrice: productSellerPrice,
            agProductDiscount: productSellerDiscount,
            agProductType: 'Games',
            agProductCodeID: `AG${postIDGenerator(10)}`,
            agProductCode: productSellerCode,
            agProductState: 'Available',
            agProductStatus: 'Unredeemed',
            agProductSeller: viewGameDetails.game_seller,
            agProductOwner: 'None',
        };
        // const test = JSON.stringify(formAddProductCodeGames)
        // console.log(test);
        try {
            const submitCodeResponse = await axios.post(AGInsertProductCodeAPI, formAddProductCodeGames);
            const responseMessage = submitCodeResponse.data;
    
            if (responseMessage.success) {
                setProductSellerPrice('');
                setProductSellerDiscount('');
                setProductSellerCode('');
                fetchGames1();
                fetchGames2();
                fetchGiftcards();
                fetchGamecredits();
                setViewAddCodeModal(false)
            } else {
                console.log(responseMessage.message);
            }
    
        } catch (error) {
            console.error(error);
        }
    };
    const handleAddProductCodeGiftcards = async (e) => {
        e.preventDefault();
    
        const formAddProductCodeGiftcards = {
            agProductName: viewGiftcardDetails.giftcard_name,
            agProductID: viewGiftcardDetails.giftcard_id,
            agProductPrice: viewGiftcardDetails.giftcard_denomination,
            agProductDiscount: productSellerDiscount,
            agProductType: 'Giftcards',
            agProductCodeID: `AG${postIDGenerator(10)}`,
            agProductCode: productSellerCode,
            agProductState: 'Available',
            agProductStatus: 'Unredeemed',
            agProductSeller: viewGiftcardDetails.giftcard_seller,
            agProductOwner: 'None',
        };
        // const test = JSON.stringify(formAddProductCodeGiftcards)
        // console.log(test);
        try {
            const submitCodeResponse = await axios.post(AGInsertProductCodeAPI, formAddProductCodeGiftcards);
            const responseMessage = submitCodeResponse.data;
    
            if (responseMessage.success) {
                setProductSellerPrice('');
                setProductSellerDiscount('');
                setProductSellerCode('');
                fetchGames1();
                fetchGames2();
                fetchGiftcards();
                fetchGamecredits();
                setViewAddCodeModal(false)
            } else {
                console.log(responseMessage.message);
            }
    
        } catch (error) {
            console.error(error);
        }

    };
    const handleAddProductCodeGamecredits = async (e) => {
        e.preventDefault();
    
        const formAddProductCodeGamecredits = {
            agProductName: viewGamecreditDetails.gamecredit_name,
            agProductID: viewGamecreditDetails.gamecredit_id,
            agProductPrice: viewGamecreditDetails.gamecredit_denomination,
            agProductDiscount: productSellerDiscount,
            agProductType: 'Game Credits',
            agProductCodeID: `AG${postIDGenerator(10)}`,
            agProductCode: productSellerCode,
            agProductState: 'Available',
            agProductStatus: 'Unredeemed',
            agProductSeller: viewGamecreditDetails.gamecredit_seller,
            agProductOwner: 'None',
        };
        const test = JSON.stringify(formAddProductCodeGamecredits)
        console.log(test);
        try {
            const submitCodeResponse = await axios.post(AGInsertProductCodeAPI, formAddProductCodeGamecredits);
            const responseMessage = submitCodeResponse.data;
    
            if (responseMessage.success) {
                setProductSellerPrice('');
                setProductSellerDiscount('');
                setProductSellerCode('');
                fetchGames1();
                fetchGames2();
                fetchGiftcards();
                fetchGamecredits();
                setViewAddCodeModal(false)
            } else {
                console.log(responseMessage.message);
            }
    
        } catch (error) {
            console.error(error);
        }

    };

    
    



    const viewStoreTicket = viewTicketReport.filter(store => store.product_seller === userLoggedData.store)
    const lastestTicketSort = viewStoreTicket.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
  
        return dateB - dateA;
    });
    const sellerTickerReports = lastestTicketSort.map(users => {
        const userinfo = viewAllUserList.filter(ticket => ticket.userid === users.user_id);
        return {
            ...users, userinfo,
        };
    });

    const [viewTicketModal, setViewTicketModal] = useState(false);
    const [viewTicketMsgModal, setViewTicketMsgModal] = useState(false);
    const [viewTicketDetails, setViewTicketDetails] = useState([]);
    const [viewTicketUserMessages, setViewTicketUserMessages] = useState([]);
    const [addTicketResponse, setAddTicketResponse] = useState(false);
    const [tixResLoader, setTixResLoader] = useState(false)
    const [sellerResponse, setSellerResponse] = useState('');
    const [userTixMessage, setUserTixMessage] = useState('');
    const [userTixSentMsg, setUserTixSentMsg] = useState('');

    const handleViewTicketProduct = (ticketCode) => {
        setViewTicketModal(true)
        const pCode = sellerTickerReports.find(pCodeID => pCodeID.ticket_id === ticketCode)
        setViewTicketDetails(pCode)
        console.log(pCode);
    }
    const handleViewTicketMessages = (ticketCode) => {
        fetchUserTicketMessages();
        setViewTicketMsgModal(true);
        const pCode = sellerTickerReports.find(pCodeID => pCodeID.ticket_id === ticketCode);
        
        if (pCode) {
            // Get user ticket details based on ticketCode
            const userTicketDetails = [pCode].map(users => {
                const userinfo = viewAllUserProfile.filter(ticket => ticket.userid === users.user_id);
                return {
                    ...users,
                    userinfo,
                };
            });
            const ticketMessages = viewTicketMessages.filter(tHash => tHash.ticket_id === ticketCode);
            setViewTicketDetails(userTicketDetails[0]);
            setViewTicketUserMessages(ticketMessages);
            
        } else {
            console.error(`Ticket with code ${ticketCode} not found`);
        }
    };
    useEffect(() => {
        if (viewTicketMsgModal && viewTicketDetails) {
            // Update ticket messages whenever viewTicketMessages updates
            const updatedMessages = viewTicketMessages.filter(tHash => tHash.ticket_id === viewTicketDetails.ticket_id);
            setViewTicketUserMessages(updatedMessages);
        }
    }, [viewTicketMessages, viewTicketMsgModal, viewTicketDetails]);
    const handleAddTixResponse = () => {
        setAddTicketResponse(true)
    }
    const handleSubmitSellerResponse = async (e) => {
        e.preventDefault();
        setTixResLoader(true);
    
        const formSubmitSellerRes = {
            userTixID: viewTicketDetails.ticket_id,
            userTixStatus: 'Completed',
            userTixResponse: sellerResponse,
            userTixDateCompleted: new Date(),
        };

        // const test = JSON.stringify(formSubmitSellerRes)
        // console.log(test);
        
        
        try {
            const sellerTixResponse = await axios.post(AGSellerTixReponseAPI, formSubmitSellerRes);
            const responseMessage = sellerTixResponse.data;
    
            if (responseMessage.success) {
                setSellerResponse(false);
                setViewTicketModal(false);
                setTixResLoader(false);
                fetchUserTicketReport();
            } else {
                sellerTixResponse(responseMessage.message);
                setSellerResponse(false);
                setTixResLoader(false);
            }
    
        } catch (error) {
            console.error(error);
        }
    };
    const handleSendSellerMessage = async (e) => {
        e.preventDefault();
    
        const formSendUserMessage = {
            userTixID: viewTicketDetails.ticket_id,
            userTixUserid: userLoggedData.userid,
            userTixUserMgs: '',
            userTixUserDate: '',
            userTixSellerid: viewTicketDetails.product_seller,
            userTixSellerMgs: userTixMessage,
            userTixSellerDate: new Date(),
            userTixStatus: 'Processing',
        };
        
        try {
            const sellerTixResponse = await axios.post(AGSendTixMessageAPI, formSendUserMessage);
            const responseMessage = sellerTixResponse.data;
    
            if (responseMessage.success) {
                setUserTixMessage('');
                fetchUserTicketReport();
                fetchUserTicketMessages();
            } else {
                setUserTixMessage('');
            }
    
        } catch (error) {
            console.error(error);
        }
    };
    


    
    
    return (
        <div className='mainContainer sellerPanel'>

            <section className="spPageContainer top">
                <div className="spPageContent top">
                    <div className="sppc top">
                        <div className="sppctViewNav">
                            <button className={activeView === 'default' ? 'activeNav': ''} onClick={handleViewNavigations}><h6><TbLayoutDashboard className='faIcons'/> DASHBOARD</h6></button>
                            <button className={activeView === 'games' ? 'activeNav': ''} onClick={handleViewAddGames}><h6><TbDeviceGamepad2 className='faIcons'/> ADD GAMES</h6></button>
                            <button className={activeView === 'giftcards' ? 'activeNav': ''} onClick={handleViewAddGiftcards}><h6><TbGiftCard className='faIcons'/> ADD GIFTCARDS</h6></button>
                            <button className={activeView === 'gamecredits' ? 'activeNav': ''} onClick={handleViewAddGamecredits}><h6><TbDiamond className='faIcons'/> ADD GAME CREDITS</h6></button>
                            <button className={activeView === 'productList' ? 'activeNav': ''} onClick={handleViewAddCodes}><h6><TbCubePlus className='faIcons'/> ADD PRODUCT CODES</h6></button>
                            <button className={activeView === 'inventory' ? 'activeNav': ''} onClick={handleViewInventory}><h6><TbPackages className='faIcons'/> INVENTORY</h6></button>
                            <button className={activeView === 'tickets' ? 'activeNav': ''} onClick={handleViewTickets}><h6><TbTicket className='faIcons'/> TICKETS</h6></button>
                            <button className={activeView === 'sell' ? 'activeNav': ''} onClick={handleViewSell}><h6><TbDatabaseDollar className='faIcons'/> TRANSACTIONS</h6></button>
                            <button className={activeView === 'faqs' ? 'activeNav': ''} onClick={handleViewFaqs}><h6><TbUserQuestion className='faIcons'/> SELLER FAQs</h6></button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="spPageContainer mid">
                <div className="spPageContent mid1">
                    {activeView === 'default' && <div className="sppcm1Dashboard">
                        <h4>Welcome {userLoggedData.username},</h4>
                        <p id='sppcm1dInfo'>
                            Within this administrative panel, you have the ability to effortlessly 
                            integrate new games, gift cards, vouchers and its codes to be sold. 
                            Every detail is meticulously logged and securely stored in our database, 
                            ensuring thorough management and easy access.
                        </p>
                        <div className="sppcm1dContainer">
                            <div className="sppcm1dContent left">
                                <div>
                                    <h4>{viewSellerGames.length}</h4>
                                    <h6>LISTED GAMES</h6>
                                </div>
                                <div>
                                    <h4>{viewSellerGiftcards.length}</h4>
                                    <h6>LISTED GIFTCARDS</h6>
                                </div>
                                <div>
                                    <h4>{viewSellerGamecredits.length}</h4>
                                    <h6>LISTED GAME CREDITS</h6>
                                </div>
                                <div>
                                    <h4>{gameStocksNum.length}</h4>
                                    <h6>GAME STOCKS</h6>
                                </div>
                                <div>
                                    <h4>{giftcardsStocksNum.length}</h4>
                                    <h6>GIFTCARD STOCKS</h6>
                                </div>
                                <div>
                                    <h4>{gamecreditsStocksNum.length}</h4>
                                    <h6>GAMECREDIT STOCKS</h6>
                                </div>
                            </div>
                            <div className="sppcm1dContent right">
                                <div>
                                    <h4>{viewSoldStockNumber.length}</h4>
                                    <span>
                                        <h6></h6>
                                        <p>STOCKS SOLD</p>
                                    </span>
                                </div>
                                <div>
                                    <h4>$ {currentProductSales}</h4>
                                    <span>
                                        <h6></h6>
                                        <p>TOTAL SALES</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="sppcm1dOthers">
                            <div className="sppcm1doContent left">
                                <h5>RECENT TICKET REPORTS</h5>
                                <div className="sppcm1doclTickets">
                                    {sellerTickerReports.length ? 
                                        <>
                                        {sellerTickerReports.map((data, i) => (
                                            <div className="sppcm1doclTicket" key={i}>
                                                <span><p>{formatDateToWordedDate(data.date)}</p></span>
                                                <span><p>{data.ticket_id}</p></span>
                                                <span><p><UsernameSlicer text={`${data.userinfo[0].username}`} maxLength={10} /></p></span>
                                            </div>
                                        ))}</>:<div className="sppcm1docltEmpty">
                                            <span>
                                                <h5><TbTicket className='faIcons'/></h5>
                                                <p>No Tickets yet</p>
                                            </span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="sppcm1doContent center">
                                <h5>RECENT TRANSACTIONS</h5>
                                <div className="sppcm1doclTransactions">
                                    <div className="sppcm1docltEmpty">
                                        <span>
                                            <h5><TbReceipt className='faIcons'/></h5>
                                            <p>No Transactions yet</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="sppcm1doContent right">
                                <h5>WITHDRAWABLES</h5>
                                <div className="sppcm1doclWithdrawables">
                                    <div className="sppcm1docltEmpty">
                                        <span>
                                            <h5><TbCash className='faIcons'/></h5>
                                            <p>No Withdrawables yet</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'games' && <div className="sppcm1AddGames">
                        {addProductModal && <div className="sppcm1AddProductResponse">
                            <div className="sppcm1AddProductContent">
                                <img src={`https://2wave.io/StoreLogo/${userLoggedData.store}.png`} alt="" />
                                <p>{addProductResponse}</p>
                            </div>
                        </div>}
                        <div className="sppcm1AddGameContainer">
                            <div className="sppcm1AGameContent left">
                                <h5>ADD GAME TO LIST</h5>
                                <p id='sppcm1agclInfo'><TbInfoCircle className='faIcons'/> Add existing games to your game list.</p><br />
                                <div className='sppcm1agclContainer'>
                                    <span>
                                        <input
                                            type="text"
                                            placeholder="Search Games here..."
                                            value={searchTermGames}
                                            onChange={(e) => setSearchTermGames(e.target.value)} // Update state on input change
                                        />
                                    </span>
                                    <div className="sppcm1agclContents">
                                        {filteredGames.length > 0 ? (
                                            filteredGames.map((game, i) => (
                                                <div className="sppcm1agclcProducts" key={i}>
                                                    <button onClick={() => handleFlipProduct(game.game_canonical)}>+</button>
                                                    <div>
                                                        <h6>{game.game_title}</h6>
                                                        <p>
                                                            {game.game_edition} - {game.game_platform}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            viewAGData1.map((game, i) => (
                                                <div className="sppcm1agclcProducts" key={i}>
                                                    <button>+</button>
                                                    <div>
                                                        <h6>{game.game_title}</h6>
                                                        <p>
                                                            {game.game_edition} - {game.game_platform}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="sppcm1AGameContent right">
                                <form id='addGamesFormContainer' onSubmit={handleAddGame}>
                                    <h5>ADD NEW GAME</h5>
                                    <p id='agfcInfo'><TbInfoCircle className='faIcons'/> Add new games that are not existing on the market</p><br />
                                    <div className='sppcm1agcForm'>
                                        <div className="sppcm1agcf left">
                                            <div className='sppc1agcfImage'>
                                                {image ? (
                                                    <img src={URL.createObjectURL(image)} alt="Selected Image" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputChange}/>
                                            </div>
                                        </div>
                                        <div className="sppcm1agcf right">
                                            <span>
                                                <label htmlFor=""><p>Game Title</p></label>
                                                <input type="text" placeholder='ex. Tetris' value={agSetGameTitle} onChange={(e) => setAGSetGameTitle(e.target.value)}  required/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Game Edition</p></label>
                                                {!agAddGameEdition ? <select name="" id="" value={agSetGameEdition} onChange={(e) => setAGSetGameEdition(e.target.value)}>
                                                    <option value="">Select Game Edition</option>
                                                    <option value="Standard Edition">Standard Edition</option>
                                                    <option value="Deluxe Edition">Deluxe Edition</option>
                                                    <option value="Ultimate Edition">Ultimate Edition</option>
                                                    <option value="Limited Edition">Limited Edition</option>
                                                    <option value="Special Edition">Special Edition</option>
                                                    <option value="Silver Edition">Silver Edition</option>
                                                    <option value="Gold Edition">Gold Edition</option>
                                                    <option value="Platinum Edition">Platinum Edition</option>
                                                    <option value="Diamond Edition">Diamond Edition</option>
                                                    <option value="Other Edition">Other Edition</option>
                                                </select>
                                                :<input type="text" placeholder='Add Custom Edition' value={agSetGameEdition} onChange={(e) => setAGSetGameEdition(e.target.value)} />}
                                                <button onClick={!agAddGameEdition ? handleViewAddGameEdition : handleHideAddGameEdition}>{!agAddGameEdition ? <RiAddBoxFill className='faIcons'/>:<FaTimes className='faIcons'/>}</button>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Country</p></label>
                                                <input type="text" placeholder='ex. Global/US/EU' value={agSetGameCountry} onChange={(e) => setAGSetGameCountry(e.target.value)} required/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Game Developer</p></label>
                                                <input type="text" placeholder='ex. NAMCO LTD.' value={agSetGameDeveloper} onChange={(e) => setAGSetGameDeveloper(e.target.value)} required/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Date Released</p></label>
                                                <input type="date" value={agSetGameRelease} onChange={(e) => setAGSetGameRelease(e.target.value)} required/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Gaming Platform</p></label>
                                                <select name="" id="" value={agSetGamePlatform} onChange={(e) => setAGSetGamePlatform(e.target.value)} required>
                                                    <option value="">Select Platform</option>
                                                    <option value="MobileApp">Mobile Games</option>
                                                    <option value="PC">PC Games</option>
                                                    <option value="NintendoSwitch">Nintendo Switch Games</option>
                                                    <option value="XboxXS">Xbox X/S Games</option>
                                                    <option value="XboxOne">Xbox One Games</option>
                                                    <option value="PlayStation4">PS4 Games</option>
                                                    <option value="PlayStation5">PS5 Games</option>
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Category</p></label>
                                                <select name="" id="" value={agSetGameCategory} onChange={(e) => setAGSetGameCategory(e.target.value)} required>
                                                    <option value="">Select Category</option>
                                                    <option value="New">New Release</option>
                                                    <option value="Trending">Trending Games</option>
                                                    <option value="Hot">Hot Games</option>
                                                    <option value="Classic">Classic Games</option>
                                                    <option value="Preorder">Pre-Order Games</option>
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Highlight (Optional)</p></label>
                                                <select name="" id="" value={agSetGameHighlight1} onChange={(e) => setAGSetGameHighlight1(e.target.value)}>
                                                    <option value="">Select Highlight</option>
                                                    <option value="Featured">Featured Games</option>
                                                    <option value="Sale">On Sale Games</option>
                                                </select>
                                            </span>
                                            <span id='sppcm1agcfrTrailer'>
                                                <label htmlFor=""><p>Game Trailer (YouTube Link)</p></label>
                                                <input type="text" placeholder='ex. https://www.youtube.com/watch?v=Mr8fVT_Ds4Q' value={agSetGameTrailer} onChange={(e) => setAGSetGameTrailer(e.target.value)} required/>
                                            </span>
                                            <span id='sppcm1agcfrAvailable'>
                                                <label htmlFor=""><p>Available Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameAvailable} onChange={(e) => setAGSetGameAvailable(e.target.value)} placeholder='(Ex. JP, EG, VE)' required></textarea>
                                            </span>
                                            <span id='sppcm1agcfrRestricted'>
                                                <label htmlFor=""><p>Restricted Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameRestricted} onChange={(e) => setAGSetGameRestricted(e.target.value)} placeholder='(Ex. JP, EG, VE)' required></textarea>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='gameSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="sppc1agcfSubmit">
                                        <button type='submit' name='addGames'>Add Game</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'giftcards' && <div className="sppcm1GiftCards">
                        {addProductModal && <div className="sppcm1AddProductResponse">
                            <div className="sppcm1AddProductContent">
                                <img src={`https://2wave.io/StoreLogo/${userLoggedData.store}.png`} alt="" />
                                <p>{addProductResponse}</p>
                            </div>
                        </div>}
                        <div className="sppcm1AddGiftCardContainer">
                            <div className="sppcm1AGiftCardContent left">
                                <h5>ADD GIFTCARD TO LIST</h5>
                                <p id='sppcm1agclInfo'><TbInfoCircle className='faIcons'/> Add existing giftcard to your giftcard list.</p><br />
                                <div className='sppcm1agclContainer'>
                                    <span>
                                        <input
                                            type="text"
                                            placeholder="Search Giftcards here..."
                                            value={searchTermGiftcards}
                                            onChange={(e) => setSearchTermGiftcards(e.target.value)} // Update state on input change
                                        />
                                    </span>

                                    <div className="sppcm1agclContents">
                                        {filteredGiftCards.length > 0 ? (
                                            filteredGiftCards.map((giftcard, i) => (
                                                <div className="sppcm1agclcProducts" key={i}>
                                                    <button onClick={() => handleFlipProduct(giftcard.giftcard_id)}>+</button>
                                                    <div>
                                                        <h6>{giftcard.giftcard_name}</h6>
                                                        <p>
                                                            {giftcard.giftcard_category} Giftcard - ${giftcard.giftcard_denomination}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            giftcards.map((giftcard, i) => (
                                                <div className="sppcm1agclcProducts" key={i}>
                                                    <button>+</button>
                                                    <div>
                                                        <h6>{giftcard.giftcard_name}</h6>
                                                        <p>
                                                            {giftcard.giftcard_category} Giftcard - ${giftcard.giftcard_denomination}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="sppcm1AGiftCardContent right">
                                <form id='addGiftCardFormContainer' onSubmit={handleAddGiftcard}>
                                    <h5>ADD NEW GIFTCARDS/VOUCHER</h5>
                                    <p id='agfcInfo'><TbInfoCircle className='faIcons'/> Add new giftcards that are not existing on the market</p><br />
                                    <div className="sppcm1agcvForm">
                                        <div className="sppcm1agcvf left">
                                            <div className="sppc1agcvfImage">
                                                {imageGCV ? (
                                                    <img src={URL.createObjectURL(imageGCV)} alt="No image Selected" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputGCVChange}/>
                                            </div>
                                        </div>
                                        <div className="sppcm1agcvf right">
                                            <span>
                                                <label htmlFor=""><p>GiftCard/Voucher Name</p></label>
                                                <input type="text" placeholder='ex. AG Giftcard' required  value={agSetGiftCardTitle} onChange={(e) => setAGSetGiftCardTitle(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Valuation/Denomination ($)</p></label>
                                                <input type="number" placeholder='ex. 100' required value={agSetGiftCardDenomination} onChange={(e) => setAGSetGiftCardDenomination(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Category</p></label>
                                                <select name="" id="" value={agSetGiftCardCategory} onChange={(e) => setAGSetGiftCardCategory(e.target.value)}>
                                                    <option value="">Select Category</option>
                                                    <option value="Gaming">Gaming</option>
                                                    <option value="Utilities">Utilities</option>
                                                    <option value="Shopping">Shopping</option>
                                                    <option value="Cosmetics">Cosmetics</option>
                                                    <option value="Subscription">Subscription</option>
                                                    <option value="Foods and Groceries">Foods and Groceries</option>
                                                    <option value="Online Payment">Online Payment</option>
                                                    <option value="Crypto">Crypto</option>
                                                </select>
                                            </span>
                                            <span id='sppcm1agcvfDes'>
                                                <label htmlFor=""><p>Giftcard/Voucher Description</p></label>
                                                <textarea name="" id="" placeholder='Add Giftcard/Voucher Description here' value={agSetGiftCardDescription} onChange={(e) => setAGSetGiftCardDescription(e.target.value)}></textarea>
                                            </span>
                                            <span id='sppcm1agcvfDisclaimer'>
                                                <h6>Disclaimer:</h6>
                                                <p>Please be informed that the valuation/denomination listed reflects the exact value of the giftcard itself. For example, a $20 Giftcard will be sold for $20. For more questions, contact our Customer Support Agent.</p>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='giftcardSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="sppc1agcvfSubmit">
                                        <button type='submit' name='addGames'>Add Giftcards/Voucher</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'gamecredits' && <div className="sppcm1GameCredits">
                        {addProductModal && <div className="sppcm1AddProductResponse">
                            <div className="sppcm1AddProductContent">
                                <img src={`https://2wave.io/StoreLogo/${userLoggedData.store}.png`} alt="" />
                                <p>{addProductResponse}</p>
                            </div>
                        </div>}
                        <div className="sppcm1AddGameCreditsContainer">
                            <div className="sppcm1AGameCreditsContent left">
                                <h5>ADD GCREDITS TO LIST</h5>
                                <p id='sppcm1agclInfo'><TbInfoCircle className='faIcons'/> Add existing gcredit to your gcredit list.</p><br />
                                <div className='sppcm1agclContainer'>
                                    <span>
                                        <input
                                            type="text"
                                            placeholder="Search Game Credit here..."
                                            value={searchTermGameCredits}
                                            onChange={(e) => setSearchTermGameCredits(e.target.value)} // Update state on input change
                                        />
                                    </span>

                                    <div className="sppcm1agclContents">
                                        {filteredGameCredits.length > 0 ? (
                                            filteredGameCredits.map((gamecredit, i) => (
                                                <div className="sppcm1agclcProducts" key={i}>
                                                    <button onClick={() => handleFlipProduct(gamecredit.gamecredit_id)}>+</button>
                                                    <div>
                                                        <h6>{gamecredit.gamecredit_name}</h6>
                                                        <p>
                                                            {gamecredit.gamecredit_category} Giftcard - ${gamecredit.gamecredit_denomination}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            gamecredits.map((gamecredit, i) => (
                                                <div className="sppcm1agclcProducts" key={i}>
                                                    <button>+</button>
                                                    <div>
                                                        <h6>{gamecredit.gamecredit_name}</h6>
                                                        <p>
                                                            {gamecredit.gamecredit_category} Giftcard - ${gamecredit.gamecredit_denomination}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="sppcm1AGameCreditsContent right">
                                <form id='addGiftCardFormContainer' onSubmit={handleAddGamecredit}>
                                    <h5>ADD NEW GAMECREDITS</h5>
                                    <p id='agfcInfo'><TbInfoCircle className='faIcons'/> Add new gamecredits that are not existing on the market</p><br />
                                    <div className="sppcm1agcrForm">
                                        <div className="sppcm1agcrf left">
                                            <div className="sppc1agcrfImage">
                                                {imageGCR ? (
                                                    <img src={URL.createObjectURL(imageGCR)} alt="No image Selected" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputGCRChange}/>
                                            </div>
                                        </div>
                                        <div className="sppcm1agcrf right">
                                            <span>
                                                <label htmlFor=""><p>Game Name</p></label>
                                                <input type="text" placeholder='ex. Roblox' required  value={agSetGameCreditTitle} onChange={(e) => setAGSetGameCreditTitle(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Valuation/Denomination ($)</p></label>
                                                <input type="number" placeholder='ex. 100' required value={agSetGameCreditDenomination} onChange={(e) => setAGSetGameCreditDenomination(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Number of Credits (Optional)</p></label>
                                                <input type="number" placeholder='ex. 100'  value={agSetGameCreditNumber} onChange={(e) => setAGSetGameCreditNumber(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Type of Credit</p></label>
                                                <input type="text" placeholder='ex. Robux' required value={agSetGameCreditType} onChange={(e) => setAGSetGameCreditType(e.target.value)}/>
                                            </span>
                                            <span id='sppcm1agcrfDes'>
                                                <label htmlFor=""><p>Game Credit Description</p></label>
                                                <textarea name="" id="" placeholder='Add Game Credit Description here' value={agSetGameCreditDescription} onChange={(e) => setAGSetGameCreditDescription(e.target.value)}></textarea>
                                            </span>
                                            <span id="sppcm1agcrfDisclaimer">
                                                <h6>Disclaimer:</h6>
                                                <p>Please be informed that the valuation/denomination is different from the number of game credits. The valuation/denomination refers to the price of the game credits, while the number of game credits indicates the amount of in-game currency customer will receive. For further questions, please contact our Customer Support Agent.</p>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='gamecreditSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="sppc1agcrfSubmit">
                                        <button type='submit' name='addGames'>Add Game Credit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'productList' && <div className="sppcm1Product">
                        {viewAddCodeModal && (
                            <div className="mcsAddCodeContainer">
                                {viewGameDetails && 
                                    <>
                                        <div className="mcsacCodeContent">
                                            <button id='closeAddCode' onClick={handleCloseModals}><FaTimes/></button>
                                            <div className="mcsacccDetails">
                                                <img id='mcsacccDetailsImg' src={`https://2wave.io/GameCovers/${viewGameDetails.game_cover}`} alt="" />
                                                <div className="mcsacccdShadow"></div>
                                                <div className="mcsacccdTitle">
                                                    <div className="mcsacccdt">
                                                        <div className='mcsacccdtPlatform'>
                                                            <img src="" platform={viewGameDetails.game_platform} alt="" />
                                                        </div>
                                                        <div className='mcsacccdtName'>
                                                            <h4><UsernameSlicer text={`${viewGameDetails.game_title}`} maxLength={35} /></h4>
                                                            <p>{viewGameDetails.game_edition}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mcsacccdInfos">
                                                    <div className="mcsacccdiPrice">
                                                        <div className='mcsacccdip'>
                                                            <h6>Add Price ($)</h6>
                                                            <div>
                                                                <input type="number" placeholder='00.00' onChange={(e) => setProductSellerPrice(e.target.value)}/>
                                                            </div>
                                                        </div>
                                                        <div className='mcsacccdip'>
                                                            <h6>Add Discount (%)</h6>
                                                            <div>
                                                                <input type="number" placeholder='0' onChange={(e) => setProductSellerDiscount(e.target.value)}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mcsacccdiCode">
                                                        <input type="text" placeholder='Insert Product Code' onChange={(e) => setProductSellerCode(e.target.value)}/>
                                                    </div>
                                                    <div className="mcsacccdiSubmit">
                                                        <button className={(productSellerPrice && productSellerCode) ? 'active' : ''} onClick={handleAddProductCodeGames} disabled={!productSellerPrice && !productSellerCode}>Sell Product Code</button>
                                                    </div>
                                                    <p>Note: You can sell multiple codes with the same product.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                {viewGiftcardDetails && 
                                    <>
                                        <div className="mcsacCodeContent">
                                            <button id='closeAddCode' onClick={handleCloseModals}><FaTimes/></button>
                                            <div className="mcsacccDetails">
                                                <img id='mcsacccDetailsImg' src={`https://2wave.io/GiftCardCovers/${viewGiftcardDetails.giftcard_cover}`} alt="" />
                                                <div className="mcsacccdShadow"></div>
                                                <div className="mcsacccdTitle">
                                                    <div className="mcsacccdt">
                                                        <div className='mcsacccdtPlatform'>
                                                            <h5>{viewGiftcardDetails.giftcard_denomination}</h5>
                                                        </div>
                                                        <div className='mcsacccdtName'>
                                                            <h4>{viewGiftcardDetails.giftcard_name}</h4>
                                                            <p>{viewGiftcardDetails.giftcard_category}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mcsacccdInfos">
                                                    <div className="mcsacccdiPrice">
                                                        <div className='mcsacccdip'>
                                                            <h6>Fixed Price ($)</h6>
                                                            <div>
                                                                <input type="number" placeholder={`$ ${viewGiftcardDetails.giftcard_denomination}`} value={viewGiftcardDetails.giftcard_denomination} disabled/>
                                                            </div>
                                                        </div>
                                                        <div className='mcsacccdip'>
                                                            <h6>Add Discount (%)</h6>
                                                            <div>
                                                                <input type="number" placeholder='0' onChange={(e) => setProductSellerDiscount(e.target.value)}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mcsacccdiCode">
                                                        <input type="text" placeholder='Insert Product Code' onChange={(e) => setProductSellerCode(e.target.value)}/>
                                                    </div>
                                                    <div className="mcsacccdiSubmit">
                                                        <button className={(productSellerCode) ? 'active' : ''} onClick={handleAddProductCodeGiftcards} disabled={!productSellerCode}>Sell Product Code</button>
                                                    </div>
                                                    <p>Note: You can sell multiple codes with the same product.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                {viewGamecreditDetails && 
                                    <>
                                        <div className="mcsacCodeContent">
                                            <button id='closeAddCode' onClick={handleCloseModals}><FaTimes/></button>
                                            <div className="mcsacccDetails">
                                                <img id='mcsacccDetailsImg' src={`https://2wave.io/GameCreditCovers/${viewGamecreditDetails.gamecredit_cover}`} alt="" />
                                                <div className="mcsacccdShadow"></div>
                                                <div className="mcsacccdTitle">
                                                    <div className="mcsacccdt">
                                                        <div className='mcsacccdtPlatform'>
                                                            <h5>{viewGamecreditDetails.gamecredit_denomination}</h5>
                                                        </div>
                                                        <div className='mcsacccdtName'>
                                                            <h4>{viewGamecreditDetails.gamecredit_name}</h4>
                                                            <p>{viewGamecreditDetails.gamecredit_number} {viewGamecreditDetails.gamecredit_type}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mcsacccdInfos">
                                                    <div className="mcsacccdiPrice">
                                                        <div className='mcsacccdip'>
                                                            <h6>Fixed Price ($)</h6>
                                                            <div>
                                                                <input type="number" placeholder={`$ ${viewGamecreditDetails.gamecredit_denomination}`} value={viewGamecreditDetails.gamecredit_denomination} disabled/>
                                                            </div>
                                                        </div>
                                                        <div className='mcsacccdip'>
                                                            <h6>Add Discount (%)</h6>
                                                            <div>
                                                                <input type="number" placeholder='0' onChange={(e) => setProductSellerDiscount(e.target.value)}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mcsacccdiCode">
                                                        <input type="text" placeholder='Insert Product Code' onChange={(e) => setProductSellerCode(e.target.value)}/>
                                                    </div>
                                                    <div className="mcsacccdiSubmit">
                                                        <button className={(productSellerCode) ? 'active' : ''} onClick={handleAddProductCodeGamecredits} disabled={!productSellerCode}>Sell Product Code</button>
                                                    </div>
                                                    <p>Note: You can sell multiple codes with the same product.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        )}
                        <div className="sppcm1ProductlistContainer">
                            <div className="sppcm1ProductlistContent right">
                                <h4>ALL LISTED PRODUCTS</h4>
                                <p id='sppcm1pcrInfo'><TbInfoCircle className='faIcons'/> Add your digital codes here for all your listed products.</p>
                                <div className="sppcm1ProductRight-productList">
                                    <>
                                        <h5>GAMES LISTED</h5>
                                        {!loadingMarketData ? <>
                                            {(viewSellerGames.length > 0) ?
                                                <ul>
                                                    {viewSellerGames.map(game => (
                                                        <li key={game.id}>
                                                            <img src={`https://2wave.io/GameCovers/${game.game_cover}`} alt="" />
                                                            <div className="sppcm1giShadow"></div>
                                                            <div className="sppcm1Gameinfo-edit">
                                                                <section>
                                                                    <button onClick={() => sellerOpenProduct(game.game_code)}>Add Code</button>
                                                                    <Link to={`/Games/${game.game_canonical}`} target='_blank'><FaExternalLinkAlt className='faIcons'/></Link>
                                                                </section>
                                                            </div>
                                                            <div className="sppcm1Gameinfo">
                                                                <h1><UsernameSlicer text={`${game.game_title}`} maxLength={35} /></h1>
                                                                <p>{game.game_edition}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>:
                                                <div id='viewSellerProductEmpty'>
                                                    <h6>
                                                        <TbDeviceGamepad2 className='faIcons'/><br />
                                                        <span>You don't have any Game/s added yet.</span>
                                                    </h6>
                                                </div>
                                            }
                                        </>:<>
                                            <div id='viewSellerProductEmpty'>
                                                <h6>
                                                    <TbDeviceGamepad2 className='faIcons'/><br />
                                                    <span>Loading up the Games you added.</span>
                                                </h6>
                                            </div>
                                        </>}
                                    </>
                                    <>
                                        <h5>GIFTCARDS LISTED</h5>
                                        {!loadingGiftcards ? <>
                                            {(viewSellerGiftcards.length > 0) ?
                                            <ul>
                                                {viewSellerGiftcards.map(cards => (
                                                    <li key={cards.id}>
                                                        <img src={`https://2wave.io/GiftCardCovers/${cards.giftcard_cover}`} alt="" />
                                                        <div className="sppcm1giShadow"></div>
                                                        <div className="sppcm1gcDenomination">
                                                            <h6><sup>$</sup>{cards.giftcard_denomination}</h6>
                                                        </div>
                                                        <div className="sppcm1Gameinfo-edit">
                                                            <section>
                                                                <button onClick={() => sellerOpenProduct(cards.giftcard_id)}>Add Code</button>
                                                                <Link to={`/Giftcards/${cards.giftcard_canonical}`} target='_blank'><FaExternalLinkAlt className='faIcons'/></Link>
                                                            </section>
                                                        </div>
                                                        <div className="sppcm1Gameinfo">
                                                            <h1>{cards.giftcard_name}</h1>
                                                            <p>{cards.giftcard_category}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>:
                                            <div id='viewSellerProductEmpty'>
                                                <h6>
                                                    <TbGiftCard className='faIcons'/><br />
                                                    <span>You don't have any Giftcard/s added yet.</span>
                                                </h6>
                                            </div>}
                                        </>:<>
                                            <div id='viewSellerProductEmpty'>
                                                <h6>
                                                    <TbGiftCard className='faIcons'/><br />
                                                    <span>Loading up the Giftcards you added..</span>
                                                </h6>
                                            </div>
                                        </>}
                                    </>
                                    <>
                                        <h5>GAME CREDITS LISTED</h5>
                                        {!loadingGamecredit ? <>
                                            {(viewSellerGamecredits.length > 0) ?
                                            <ul>
                                                {viewSellerGamecredits.map(credits => (
                                                    <li key={credits.id}>
                                                        <img src={`https://2wave.io/GameCreditCovers/${credits.gamecredit_cover}`} alt="" />
                                                        <div className="sppcm1giShadow"></div>
                                                        <div className="sppcm1gcDenomination">
                                                            <h6><sup>$</sup>{credits.gamecredit_denomination}</h6>
                                                        </div>
                                                        <div className="sppcm1Gameinfo-edit">
                                                            <section>
                                                                <button onClick={() => sellerOpenProduct(credits.gamecredit_id)}>Add Code</button>
                                                                <Link to={`/GameCredits/${credits.gamecredit_id}`} target='_blank'><FaExternalLinkAlt className='faIcons'/></Link>
                                                            </section>
                                                        </div>
                                                        <div className="sppcm1Gameinfo">
                                                            <h1>{credits.gamecredit_name}</h1>
                                                            <p>{credits.gamecredit_number} {credits.gamecredit_type}</p>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            :
                                            <div id='viewSellerProductEmpty'>
                                                <h6>
                                                    <TbDiamond className='faIcons'/><br />
                                                    <span>You don't have any Game Credit/s added yet.</span>
                                                </h6>
                                            </div>}
                                        </>:<>
                                            <div id='viewSellerProductEmpty'>
                                                <h6>
                                                    <TbDiamond className='faIcons'/><br />
                                                    <span>Loading up the Gamecredits you added..</span>
                                                </h6>
                                            </div>
                                        </>}
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'inventory' && <div className="sppcm1Inventory">
                        <div className="sppcm1InventoryContainer">
                            <div className="sppcm1InventoryContent">
                                <h4>CODE INVENTORY</h4>
                                <p id='sppcm1pcrInfo'><TbInfoCircle className='faIcons'/> Here, you can easily check and monitor your code stocks listed on the market.</p>
                                <div className="sppcm1icSellerCodes">
                                    {(currentSellerStocks.length > 0) ? 
                                        <>
                                            {currentSellerStocks.map((data, i) => (
                                                <div className="sppcm1icscInfo" key={i}>
                                                    <div className='sppcm1icsciType'>
                                                        <p>{data.ag_product_type}</p>
                                                    </div>
                                                    <div className='sppcm1icsciName'>
                                                        <p>{data.game_title}</p>
                                                    </div>
                                                    <div className='sppcm1icsciState'>
                                                        <p>{data.ag_product_state}</p>
                                                    </div>
                                                    <div className='sppcm1icsciStatus'>
                                                        <p>{data.ag_product_status}</p>
                                                    </div>
                                                    <div className='sppcm1icsciOwner'>
                                                        <p>{data.ag_product_owner}</p>
                                                    </div>
                                                    <div className='sppcm1icsciDetails'>
                                                        <button className={(data.ag_product_state === "Sold") ? 'sold' : ''} disabled={data.ag_product_state === "Sold"}><TbSend className='faIcons'/></button>
                                                        <button className={(data.ag_product_state === "Sold") ? 'sold' : ''} disabled={data.ag_product_state === "Sold"}><TbTrash className='faIcons'/></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </>:<>
                                            <div className="sppcm1icscEmpty">
                                                <span>
                                                    <h5><TbPackages className='faIcons'/></h5>
                                                    <p>No Codes added yet</p>
                                                </span>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'tickets' && <div className="sppcm1Tickets">
                        {viewTicketModal && (<div className="mcsTicketReportContainer">
                            <div className="mcsatckrContent">
                                <button id='closeAddCode' onClick={handleCloseModals}><FaTimes/></button>
                                <div className="mcsatckrcDetails">
                                    <h5><FaTicket className='faIcons'/> {viewTicketDetails.ticket_id}</h5>
                                    <h6>{viewTicketDetails.product_name}</h6>
                                    <p>
                                        {viewTicketDetails.product_id}<br />
                                        <span>{viewTicketDetails.date}</span>
                                    </p>
                                </div>
                                <div className="mcsatckrcConcern">
                                    <div>
                                        <p><UsernameSlicer text={`${viewTicketDetails.userinfo[0].username}`} maxLength={10} /> ({viewTicketDetails.userinfo[0].userid})</p>
                                        <textarea name="" id="" disabled readOnly>{viewTicketDetails.concern}</textarea>
                                        {!addTicketResponse && <>
                                            {(viewTicketDetails.status != 'Completed') && 
                                            <span>
                                                <button onClick={handleSubmitSellerResponse}>Marked Complete</button>
                                                <button onClick={handleAddTixResponse}>Add Statement</button>
                                            </span>}
                                        </>}
                                    </div>
                                    {!viewTicketDetails.regards ? <>
                                        {addTicketResponse && <div>
                                            <p>Your Statement</p>
                                            <textarea name="" id="" 
                                                placeholder={(viewTicketDetails.regards === '') && 'Type ticket response here...'} 
                                                onChange={(e) => setSellerResponse(e.target.value)} 
                                                disabled={viewTicketDetails.regards}
                                            >    
                                                {viewTicketDetails.regards && viewTicketDetails.regards}
                                            </textarea>
                                            {!viewTicketDetails.regards && 
                                            <span>
                                                { !tixResLoader ?
                                                    <button onClick={handleSubmitSellerResponse} disabled={!sellerResponse}>Submit Statement</button>:
                                                    <button disabled>Sending Statement...</button>
                                                }
                                            </span>}
                                        </div>}
                                    </>:<>
                                        <div>
                                            <p>Your Statement</p>
                                            <textarea name="" id="" 
                                                placeholder={(viewTicketDetails.regards === '') && 'Type ticket statement here...'} disabled={viewTicketDetails.regards}>    
                                                {viewTicketDetails.regards && viewTicketDetails.regards}
                                            </textarea>
                                            <p id='tixSellerResDate'><TbCircleCheck className='faIcons'/> Sent {formatDateToWordedDate(viewTicketDetails.date_completed)}</p>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>)}
                        {viewTicketMsgModal && <div className="mcsTicketMessageContainer">
                            <div className="mcsatckmContent">
                                <button id='closeAddCode' onClick={handleCloseModals}><FaTimes/></button>
                                <div className="mcsatckmcHeader">
                                    <div>
                                        <img src={`https://2wave.io/ProfilePics/${viewTicketDetails.userinfo[0].profileimg}`} alt="" />
                                    </div>
                                    <span>
                                        <h6><UsernameSlicer text={`${viewTicketDetails.userinfo[0].username}`} maxLength={10} /></h6>
                                        <p>{viewTicketDetails.ticket_id}</p>
                                    </span>
                                </div>
                                <div className="mcsatckmcContent">
                                    <div className="mcsatckmccConvos">
                                        <div className="mcsatckmccConvo">
                                            <div className="mcsatckmccc hidden">
                                            </div>
                                            <div className="mcsatckmccc seller">
                                                <p id='mcsatckmcccStart'>Start your conversation with {viewTicketDetails.userinfo[0].username} here.</p>
                                            </div>
                                        </div>
                                        {viewTicketUserMessages.map((details, i) => (
                                            <div className="mcsatckmccConvo">
                                                <div className={details.user_chat ? "mcsatckmccc user" : "mcsatckmccc hidden"}>
                                                    <p>{details.user_chat}</p>
                                                </div>
                                                <div className={details.seller_chat ? "mcsatckmccc seller" : "mcsatckmccc hidden"}>
                                                    <p>{details.seller_chat}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {userTixSentMsg && 
                                            <div className="mcsatckmccConvo">
                                                <div className="mcsatckmccc hidden">
                                                </div>
                                                <div className="mcsatckmccc seller">
                                                    <p>{userTixSentMsg}</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="mcsatckmcMessage">
                                    <textarea name="" id="" placeholder='Type here...' value={userTixMessage} onChange={(e) => setUserTixMessage(e.target.value)}></textarea>
                                    <button onClick={handleSendSellerMessage} disabled={!userTixMessage}><TbSend className='faIcons'/></button>
                                </div>
                            </div>
                        </div>}
                        <div className="sppcm1TicketsContainer">
                            <div className="sppcm1TicketsContent">
                                <h4>PRODUCT TICKET REPORTS</h4>
                                <p id='sppcm1pcrInfo'><TbInfoCircle className='faIcons'/> Here, you can easily check and add notes regarding the reported products in your store.</p>
                                <div className="sppcm1tcReports">
                                    {(sellerTickerReports.length > 0) ? 
                                        <>
                                            {sellerTickerReports.map((data, i) => (
                                                <div className="sppcm1tcrpInfo" key={i}>
                                                    <div className='sppcm1tcrpiDate'>
                                                        <p>{formatDateToWordedDate(data.date)}</p>
                                                    </div>
                                                    <div className='sppcm1tcrpiTicket'>
                                                        <p>{data.ticket_id}</p>
                                                    </div>
                                                    <div className='sppcm1tcrpiUserID'>
                                                        <p><UsernameSlicer text={`${data.userinfo[0].username}`} maxLength={10} /> <span>({data.user_id})</span></p>
                                                    </div>
                                                    <div className='sppcm1tcrpiProduct'>
                                                        <p><UsernameSlicer text={`${data.product_name}`} maxLength={35} /></p>
                                                    </div>
                                                    <div className='sppcm1tcrpiStatus'>
                                                        <p>
                                                            {(data.status === 'On Queue') && 'On Queue'}
                                                            {(data.status === 'Processing') && 'Processing'}
                                                            {(data.status === 'Completed') && 'Completed'}
                                                        </p>
                                                    </div>
                                                    <div className='sppcm1tcrpiDetails'>
                                                        <button onClick={() => handleViewTicketProduct(data.ticket_id)}><TbTicket className='faIcons'/></button>
                                                        <button onClick={() => handleViewTicketMessages(data.ticket_id)}><TbMessages className='faIcons'/></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </>:<>
                                            <div className="sppcm1tcEmpty">
                                                <div>
                                                    <h5><FaTicket className='faIcons'/></h5>
                                                    <p>You don't have any Tickets.</p>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'sell' && <div className="sppcm1Sold">
                        <div className="sppcm1SoldContainer">
                            <div className="sppcm1TransactionContent">
                                <h4>PRODUCT TRANSACTIONS</h4>
                                <p id='sppcm1pcrInfo'><TbInfoCircle className='faIcons'/> Here, you can easily check and monitor all of your transactions.</p>
                                <div className="sppcm1Transactions">
                                    <div className="sppcm1tEmpty">
                                        <span>
                                            <h5><TbDatabaseDollar className='faIcons'/></h5>
                                            <p>No transactions yet</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'faqs' && <div className="sppcm1FAQS">
                        <div className="sppcm1FAQSContainer">
                            <h3>Test</h3>
                        </div>
                    </div>}
                </div>
            </section>
        </div>
    )
}

export default SellerPanel