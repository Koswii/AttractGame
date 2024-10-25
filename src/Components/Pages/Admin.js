import React, { useState, useEffect } from 'react'
import "../CSS/admin.css";
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
import { FiEdit } from "react-icons/fi";
import { 
    RiArrowUpSFill,
    RiArrowDownSFill,
    RiAddBoxFill   
} from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";
import { VscSaveAs } from "react-icons/vsc";
import { IoMdAddCircle, IoMdCheckmarkCircle } from "react-icons/io";
import axios from 'axios';
import {getGameReviews} from 'unofficial-metacritic';
import { Link } from 'react-router-dom';
import { GamesFetchData } from './GamesFetchContext';
import { GiftcardsFetchData } from './GiftcardsFetchContext';
import { GamecreditsFetchData } from './GamecreditFetchContext';
import ConcernTicket from './concernTicket';


const formatDateToWordedDate = (numberedDate) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(numberedDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}


const Admin = () => {
    const { viewAGData1 } = GamesFetchData();
    const { giftcards } = GiftcardsFetchData();
    const { gamecredits } = GamecreditsFetchData();
    const AGUserProfileListAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGAddSupplieAPI = process.env.REACT_APP_AG_ADD_SUPPLIER_API;
    const AGSupplierListAPI = process.env.REACT_APP_AG_SUPPLIER_LIST_API;
    const AGAddGamesAPI = process.env.REACT_APP_AG_ADD_GAMES_API;
    const AGAddGameCoverAPI = process.env.REACT_APP_AG_ADD_GAME_COVER_API;
    const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGAddGiftcardsAPI = process.env.REACT_APP_AG_ADD_GIFTCARD_API;
    const AGAddGiftcardCoverAPI = process.env.REACT_APP_AG_ADD_GIFTCARD_COVER_API;
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const AGAddGameCreditsAPI = process.env.REACT_APP_AG_ADD_GAMECREDIT_API;
    const AGAddGameCreditCoverAPI = process.env.REACT_APP_AG_ADD_GAMECREDIT_COVER_API;
    const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
    const AGInsertProductCodeAPI = process.env.REACT_APP_AG_INSERT_PRODUCT_CODES_API;
    const AGProductStateAPI = process.env.REACT_APP_AG_PRODUCT_STATE_CREDENTIALS_API;
    const AGInsertNewsLinkAPI = process.env.REACT_APP_AG_INSERT_NEWS_API;
    const AGRetriveNewsAPI = process.env.REACT_APP_AG_FETCH_NEWS_API;
    const AGDeleteNewsAPI = process.env.REACT_APP_AG_DELETE_NEWS_API;
    const AGUsersTransactions = process.env.REACT_APP_AG_USERS_TRANSACTIONS_API;

    const [viewGameTotalStocks, setViewGameTotalStocks] = useState(0);
    const [viewGiftcardTotalStocks, setViewGiftcardTotalStocks] = useState(0);
    const [viewGamecreditTotalStocks, setViewGamecreditTotalStocks] = useState(0);
    const [viewOverAllStocks, setViewOverAllStocks] = useState(0)

    const sumArray = (arr) => {
        return arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    };


    const viewGameNumStocks = viewAGData1.map(stocks => stocks.stockCount);
    const viewGiftcardNumStocks = giftcards.map(stocks => stocks.stocks);
    const viewGamecreditNumStocks = gamecredits.map(stocks => stocks.stocks);

    useEffect(() => {
        setViewGameTotalStocks(sumArray(viewGameNumStocks));
        setViewGiftcardTotalStocks(sumArray(viewGiftcardNumStocks));
        setViewGamecreditTotalStocks(sumArray(viewGamecreditNumStocks));

        const viewTotal = [ viewGameTotalStocks, viewGiftcardTotalStocks, viewGamecreditTotalStocks ]
        setViewOverAllStocks(sumArray(viewTotal));


    }, [ viewGameNumStocks, viewGameTotalStocks, viewGiftcardTotalStocks, viewGamecreditTotalStocks ]);





    const [viewAdminNavigations, setViewAdminNavigations] = useState(false)
    const [activeView, setActiveView] = useState('default');

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
        setFormResponse('');
    };
    const handleViewAddNews = () => {
        setActiveView('news');
        setFormResponse('');
    };
    const handleViewAddSupplier = () => {
        setActiveView('supplier');
        setFormResponse('');
    };
    const handleViewAddGames = () => {
        setActiveView('games');
        setFormResponse('');
    };
    const handleViewAddGiftCards = () => {
        setActiveView('giftCards');
        setFormResponse('');
    };
    const handleViewAddGameCredit = () => {
        setActiveView('gameCredit');
        setFormResponse('');
    };
    const handleViewAddSeller = () => {
        setActiveView('seller');
        setFormResponse('');
    };
    const handleViewProducts = () => {
        setActiveView('productList');
        setFormResponse('');
    };
    const handleViewUsers = () => {
        setActiveView('userList');
        setFormResponse('');
    };
    const handleViewAddPopup = () => {
        setActiveView('popupAds');
        setFormResponse('');
    };
    const handleViewTransactions = () => {
        setActiveView('transactions');
    };
    const handleViewTickets = () => {
        setActiveView('tickets');
    };

    
    const [viewUserProfiles, setViewUserProfiles] = useState([]);
    const [viewTotalAGElite, setViewTotalAGElite] = useState('');
    const [viewSupplierProfiles, setViewSupplierProfiles] = useState([]);
    const [viewActiveSupplier, setViewActiveSupplie] = useState('');
    const [viewGameTotal, setViewGameTotal] = useState([]);
    const [viewGiftcardTotal, setViewGiftcardTotal] = useState([]);
    const [viewGamecreditTotal, setViewGamecreditTotal] = useState([]);
    const [agSetCompany, setAGSetCompany] = useState('');
    const [agSetContact, setAGSetContact] = useState('');
    const [agSetEmail, setAGSetEmail] = useState('');
    const [agSetWebsite, setAGSetWebsite] = useState('');
    const [agSetStatus, setAGSetStatus] = useState('');
    const [agSetNotes, setAGSetNotes] = useState('');
    const [formResponse, setFormResponse] = useState('');
    
    const [dataListed, setDatalisted]= useState('')

    useEffect(() => {
        const fetchDataUser = () => {
            axios.get(AGUserProfileListAPI)
            .then((response) => {
                const userData = response.data.sort((a, b) => b.id - a.id);
                const userAGEliteData = response.data.filter(user => user.agelite == 'Yes');
                setViewUserProfiles(userData);
                setViewTotalAGElite(userAGEliteData);

            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataUser();

        const fetchDataSupplier = () => {
            axios.get(AGSupplierListAPI)
            .then((response) => {
                const supplierData = response.data;
                const userAGActiveSupplier = response.data.filter(supplier => supplier.status == 'Active');
                setViewSupplierProfiles(supplierData);
                setViewActiveSupplie(userAGActiveSupplier);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataSupplier();

        const fetchDataGames = () => {
            axios.get(AGGamesListAPI)
            .then((response) => {
                const gameData = response.data;
                const gameAG = gameData.filter(seller => seller.game_seller == "Attract Game")
                setViewGameTotal(gameAG);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataGames();

        const fetchDataGiftcards = () => {
            axios.get(AGGiftcardsListAPI)
            .then((response) => {
                const giftcardData = response.data;
                const giftAG = giftcardData.filter(seller => seller.giftcard_seller == "Attract Game")
                setViewGiftcardTotal(giftAG);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataGiftcards();

        const fetchDataGamecredits = () => {
            axios.get(AGGameCreditsListAPI)
            .then((response) => {
                const gamecreditData = response.data;
                const gameCred = gamecreditData.filter(seller => seller.gamecredit_seller == "Attract Game")
                setViewGamecreditTotal(gameCred);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataGamecredits();

    }, []);
    const handleAddSupplier = async (e) => {
        e.preventDefault();
  
        const formAddSupplier = {
            agSupplierCompany: agSetCompany,
            agSupplierContact: agSetContact,
            agSupplierEmail: agSetEmail,
            agSupplierWebsite: agSetWebsite,
            agSupplierStatus: agSetStatus,
            agSupplierNotes: agSetNotes,
        }
  
        const jsonAddSupplier = JSON.stringify(formAddSupplier);
        axios.post(AGAddSupplieAPI, jsonAddSupplier)
        .then(response => {
            const responseMessage = response.data;
            if (responseMessage.success === false) {
                setFormResponse(responseMessage.message);
            }
            if (responseMessage.success === true) {
                setFormResponse(responseMessage.message);
                setAGSetCompany('')
                setAGSetContact('')
                setAGSetEmail('')
                setAGSetWebsite('')
                setAGSetNotes('')
            }
        }) 
        .catch (error =>{
          // Handle errors
          console.log(error);
        });
    };

    const [agSetGameCover, setAGSetGameCover] = useState('');
    const [agSetGameTitle, setAGSetGameTitle] = useState('');
    const [agSetGameEdition, setAGSetGameEdition] = useState('');
    const [agSetGameCountry, setAGSetGameCountry] = useState('');
    const [agSetGameDeveloper, setAGSetGameDeveloper] = useState('');
    const [agSetGameRelease, setAGSetGameRelease] = useState('');
    const [agSetGameCategory, setAGSetGameCategory] = useState('');
    const [agSetGamePlatform, setAGSetGamePlatform] = useState('');
    const [agSetGameTrailer, setAGSetGameTrailer] = useState('');
    const [agSetGameDescription, setAGSetGameDescription] = useState('');
    const [agSetGameHighlight1, setAGSetGameHighlight1] = useState('');
    const [agSetGameSupplier, setAGSetGameSupplier] = useState('');
    const [agSetGameSeller, setAGSetGameSeller] = useState('');
    const [agSetGameAvailable, setAGSetGameAvailable] = useState('');
    const [agSetGameRestricted, setAGSetGameRestricted] = useState('');
    const agSetGameCode1 = agSetGameTitle.replace(/\s/g, '');
    const agSetGameCode2 = agSetGamePlatform.replace(/\s/g, '');
    const agSetGameCode3 = agSetGameEdition.replace(/\s/g, '');
    const agFullSetGameCode = `AG_${agSetGameCode1}_${agSetGameCode2}`;
    const agGameCanonical = `${agSetGameCode1}${agSetGamePlatform}_${agSetGameCode3}`;
    const MAX_PAYLOAD_SIZE = 5 * 1024 * 1024;

    const [agSetGiftCardTitle, setAGSetGiftCardTitle] = useState('');
    const [agSetGiftCardCover, setAGSetGiftCardCover] = useState('');
    const [agSetGiftCardDenomination, setAGSetGiftCardDenomination] = useState('');
    const [agSetGiftCardSupplier, setAGSetGiftCardSupplier] = useState('');
    const [agSetGiftCardCategory, setAGSetGiftCardCategory] = useState('');
    const [agSetGiftCardDescription, setAGSetGiftCardDescription] = useState('');
    const agSetGiftCardCode1 = agSetGiftCardTitle.replace(/\s/g, '');
    const agSetGiftCardCode2 = agSetGiftCardDenomination.replace(/\s/g, '');
    const agSetGiftCardCanonical = agSetGiftCardTitle.replace(/ /g, '_');
    const agFullSetGiftCardCode = `AG_${agSetGiftCardCode1}_${agSetGiftCardCode2}`;

    const [agSetGameCreditTitle, setAGSetGameCreditTitle] = useState('');
    const [agSetGameCreditCover, setAGSetGameCreditCover] = useState('');
    const [agSetGameCreditDenomination, setAGSetGameCreditDenomination] = useState('');
    const [agSetGameCreditNumber, setAGSetGameCreditNumber] = useState('');
    const [agSetGameCreditType, setAGSetGameCreditType] = useState('');
    const [agSetGameCreditSupplier, setAGSetGameCreditSupplier] = useState('');
    const [agSetGameCreditCategory, setAGSetGameCreditCategory] = useState('');
    const [agSetGameCreditDescription, setAGSetGameCreditDescription] = useState('');
    const agSetGameCreditCode1 = agSetGameCreditTitle.replace(/\s/g, '');
    const agSetGameCreditCode2 = agSetGameCreditDenomination.replace(/\s/g, '');
    const agSetGameCreditCode3 = agSetGameCreditTitle.replace(/[(){}\-.,]/g, '');
    const agSetGameCreditCode4 = agSetGameCreditCode3.replace(/\s/g, '');
    const agSetGameCreditCanonical = `${agSetGameCreditCode3.replace(/ /g, '_') + '_Game_Credit'}`;
    const agFullSetGameCreditCode = `AG_${agSetGameCreditCode4}GameCredit_${agSetGameCreditCode2}`;


    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setAGSetGameCover(file.name);
        }
    };
    const [imageGCV, setImageGCV] = useState(null);
    const handleFileInputGCVChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageGCV(file);
            setAGSetGiftCardCover(file.name);
        }
    };
    const [imageGCR, setImageGCR] = useState(null);
    const handleFileInputGCRChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageGCR(file);
            setAGSetGameCreditCover(file.name);
        }
    };


    // Add Game Details
    const handleAddGame = async (e) => {
        e.preventDefault();
    
        const formAddGameDetails = {
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
            agGameSupplier: agSetGameSupplier,
            agGameSeller: agSetGameSeller,
            agGameAvailable: agSetGameAvailable,
            agGameRestricted: agSetGameRestricted,
        };
    
        const formImageData = new FormData();
        formImageData.append('agGameCover', image);
    
        try {
            // Sending game details
            const addGameResponse = await axios.post(AGAddGamesAPI, formAddGameDetails);
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
                setAGSetGameSupplier('');
                setAGSetGameSeller('');
                setAGSetGameAvailable('');
                setAGSetGameRestricted('');
            }
    
            // Sending game cover image
            await axios.post(AGAddGameCoverAPI, formImageData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
        } catch (error) {
            console.error(error);
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

    // Add Giftcard/Voucher Details
    const handleAddGiftcard = async (e) => {
        e.preventDefault();
    
        const formAddGiftcardsDetails = {
            agGiftcardCode: agFullSetGiftCardCode,
            agGiftcardCover: agSetGiftCardCover,
            agGiftcardTitle: agSetGiftCardTitle,
            agGiftcardCanonical : agSetGiftCardCanonical,
            agGiftcardDenomination: agSetGiftCardDenomination,
            agGiftcardSupplier: agSetGiftCardSupplier,
            agGiftcardSeller: "Attract Game",
            agGiftcardCategory: agSetGiftCardCategory,
            agGiftcardDescription: agSetGiftCardDescription,
        };
    
        const formImageGCVData = new FormData();
        formImageGCVData.append('agGiftcardCover', imageGCV);

        try {
            // Sending gift card details
            const addGiftcardsResponse = await axios.post(AGAddGiftcardsAPI, formAddGiftcardsDetails);
            const responseMessage = addGiftcardsResponse.data;
    
            setFormResponse(responseMessage.message);
            console.log(responseMessage.message);
    
            if (responseMessage.success) {
                setAGSetGiftCardTitle('');
                setAGSetGiftCardDenomination('');
                setAGSetGiftCardSupplier('');
                setAGSetGiftCardCategory('');
                setAGSetGiftCardDescription('');
            }
    
            // Sending gift card cover image
            // await axios.post(AGAddGiftcardCoverAPI, formImageGCVData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });
    
        } catch (error) {
            console.error(error);
        }
    };

    // Add Game Credits Details
    const handleAddGamecredit = async (e) => {
        e.preventDefault();
    
        const formAddGamecreditsDetails = {
            agGamecreditCode: agFullSetGameCreditCode,
            agGamecreditCover: agSetGameCreditCover,
            agGamecreditTitle: agSetGameCreditTitle,
            agGamecreditNumber : agSetGameCreditNumber,
            agGamecreditType: agSetGameCreditType,
            agGamecreditCanonical : agSetGameCreditCanonical,
            agGamecreditDenomination: agSetGameCreditDenomination,
            agGamecreditSupplier: agSetGameCreditSupplier,
            agGamecreditSeller: "Attract Game",
            agGamecreditCategory: agSetGameCreditCategory,
            agGamecreditDescription: agSetGameCreditDescription,
        };
    
        const formImageGCRData = new FormData();
        formImageGCRData.append('agGiftcardCover', imageGCR);
    
        try {
            // Sending game credit details
            const addGameCreditsResponse = await axios.post(AGAddGameCreditsAPI, formAddGamecreditsDetails);
            const responseMessage = addGameCreditsResponse.data;
    
            setFormResponse(responseMessage.message);
            console.log(responseMessage.message);
    
            if (responseMessage.success) {
                setImageGCR(null);
                setAGSetGameCreditTitle('');
                setAGSetGameCreditDenomination('');
                setAGSetGameCreditNumber('');
                setAGSetGameCreditType('');
                setAGSetGameCreditSupplier('');
                setAGSetGameCreditCategory('');
                setAGSetGameCreditDescription('');
            }
    
            // Sending game credit cover image
            // await axios.post(AGAddGameCreditCoverAPI, formImageGCRData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });
    
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
    
    // Product List Data
    const [editableData, setEditableData] = useState({});
    const [openEditModal, setEditModal] = useState(false);
    const [editInfoPrice, setEditInfoPrice] = useState(true);
    const [editInfoDiscount, setEditInfoDiscount] = useState(true);
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [gameID, setGameID] = useState('');
    const [inputs, setInputs] = useState([{ id: 'AG' + postIDGenerator(10), value: ''}]);
    const [clickCount,setClickcount] = useState(0)

    
    const [sortName, setsortName] = useState('All Products');
    const [filterName,setFiltername] = useState('')
    const [order, setOrder] = useState(false);
    const [orderSelect,setOrderselect] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);


    const handleChangePrice = (event) => {
        setPrice(event.target.value);
    };
    const handleChangeDiscount = (event) => {
        setDiscount(event.target.value);
    };
    const handleEditProd = (game) => {
        setGameID(game.game_canonical);
        setEditableData(game);
        setEditModal(true);
        // console.log(game);
    };
    const handleCloseEditModal = () => {
        setEditModal(false);
        setInputs([{ id: 'AG' + postIDGenerator(10), value: '' }]);
        setClickcount(0)
    };
    const toggleDisablePrice = () => {
        setEditInfoPrice((prevState) => !prevState);
    };
    const toggleDisableDiscount = () => {
        setEditInfoDiscount((prevState) => !prevState);
    };
    const addNewInput = () => {
        setInputs([...inputs, { id: 'AG' + postIDGenerator(10), value: ''}]);
    };
    const resetInputs = () => {
        setInputs([...inputs, { id: 'AG' + postIDGenerator(10), value: '' }]);
    };
    const handleInputChange = (id, field, value) => {
        setInputs(inputs.map(input => input.id === id ? { ...input, [field]: value } : input));
    };
    useEffect(() => {
        // Check if any input is empty
        const allInputsFilled = inputs.every(input => input.value.trim() !== '');
        setIsButtonDisabled(!allInputsFilled);
    }, [inputs]);
    const toggleOrder = () => {
        setOrder(prev => !prev)
    }
    const toggleFilternewest = () => {
        setsortName('Date')
        if (dataListed === 'Games') {
            const sortnewest = viewGameTotal.sort((a,b) => {
                if (order === false) {
                    return (a.game_released > b.game_released ? -1 : 1)
                } else {
                    return (a.game_released < b.game_released ? -1 : 1)
                }
            })
            setViewGameTotal(sortnewest);
        } else if (dataListed === 'GCards') {
            const sortnewest = viewGiftcardTotal.sort((a,b) => {
                if (order === false) {
                    return (a.date > b.date ? -1 : 1)
                } else {
                    return (a.date < b.date ? -1 : 1)
                }
            })
            setViewGiftcardTotal(sortnewest);
        }
        setOrderselect(false)
    }
    const toggleFiltername = () => {
        setsortName('Name')
        if (dataListed === 'Games') {
            const sortnewest = viewGameTotal.sort((a,b) => {
                if (order === false) {
                    return (a.game_title > b.game_title ? -1 : 1)
                } else {
                    return (a.game_title < b.game_title ? -1 : 1)
                }
            })
            setViewGameTotal(sortnewest);
        } else if (dataListed === 'GCards') {
            const sortnewest = viewGiftcardTotal.sort((a,b) => {
                if (order === false) {
                    return (a.giftcard_name > b.giftcard_name ? -1 : 1)
                } else {
                    return (a.giftcard_name < b.giftcard_name ? -1 : 1)
                }
            })
            setViewGiftcardTotal(sortnewest);
        }
        setOrderselect(false)
    }

    const insertGameData = async () => {
        try {
            const productCodesString = inputs.map(input => input.value).join(',');
            const productCodesID = inputs.map(input => input.id).join(',');
            if (dataListed === 'Games') {
                const dataInput = {
                    productName: editableData.game_title,
                    productPrice: price,
                    productDiscount: discount,
                    productCannonical: editableData.game_canonical,
                    productIDcode: productCodesID,
                    productCodes: productCodesString,
                    productType: 'Games',
                    productState: 'Available',
                    productSeller: 'Attract Game',
                    productOwner: 'None',
                };
                const response = await axios.post(AGInsertProductCodeAPI, dataInput);
                console.log('Data submitted successfully:', response.data);
            } else if (dataListed === 'GCards') {
                const dataInput = {
                    productName: editableData.giftcard_name,
                    productPrice: price,
                    productDiscount: discount,
                    productCannonical: editableData.giftcard_id,
                    productIDcode: productCodesID,
                    productCodes: productCodesString,
                    productType: 'Giftcards',
                    productState: 'Available',
                    productSeller: 'Attract Game',
                    productOwner: 'None',
                };
                const response = await axios.post(AGInsertProductCodeAPI, dataInput);
                console.log('Data submitted successfully:', response.data);
            } else {
                const dataInput = {
                    productName: editableData.gamecredit_name,
                    productPrice: price,
                    productDiscount: discount,
                    productCannonical: editableData.gamecredit_id,
                    productIDcode: productCodesID,
                    productCodes: productCodesString,
                    productType: 'Game Credits',
                    productState: 'Available',
                    productSeller: 'Attract Game',
                    productOwner: 'None',
                };
                const response = await axios.post(AGInsertProductCodeAPI, dataInput);
                console.log('Data submitted successfully:', response.data);
            }
            
            setPrice('');
            setDiscount('');
            resetInputs(); 
            setInputs([{ id: 'AG' + postIDGenerator(10), value: '' }]);
            setEditModal(false);

            setEditInfoDiscount(true);
            setEditInfoPrice(true);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };
    useEffect(() => {
        fetchProductcodes();
        const getFiltername = localStorage.getItem('filterName')
        setFiltername(getFiltername)

        const getDatalisted = localStorage.getItem('dataListed')
        setDatalisted(getDatalisted)

    }, [])
    async function fetchProductcodes() {
        try {
            const response = await fetch(AGProductStateAPI);
            const data = await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const showOrdering = () => {
        setOrderselect(prev => !prev)
    }
    const openEditquick = (game) => {
        setClickcount(clickCount + 1)
        if (clickCount === 1) {
            handleEditProd(game)
        }
    }
    const [filter, setFilter] = useState(false)
    const openFilterchange = () => {
        setFilter(prev => !prev)
    }
    const selectGames = () => {
        localStorage.setItem('dataListed', 'Games')
        localStorage.setItem('filterName','All Games')
        setDatalisted('Games')
        setFiltername('All Games')
        setFilter(false)
    }
    const selectGCards = () => {
        localStorage.setItem('dataListed', 'GCards')
        localStorage.setItem('filterName', 'All Gift Cards')
        setDatalisted('GCards')
        setFiltername('All Gift Cards')
        setFilter(false)
    }
    const selectGCredits = () => {
        localStorage.setItem('dataListed', 'GCredits')
        localStorage.setItem('filterName', 'All Gift Cards')
        setDatalisted('GCredits')
        setFiltername('All Game Credits')
        setFilter(false)
    }
    const [searchInput, setSearchinput] = useState()
    const handleSearch = (event) => {
        setSearchinput(event.target.value)
    }
    async function searchItem (e) {
        e.preventDefault()
        if (dataListed === 'Games') {
            axios.get(AGGamesListAPI)
            .then((response) => {
                const gameData = response.data;
                const gameAG = gameData.filter(seller => seller.game_seller == "Attract Game")
                const search = gameAG.filter(item => {
                    return Object.values(item).some(value => 
                        typeof value === 'string' && value.toLowerCase().includes(searchInput.toLowerCase())
                    );
                });
                setViewGameTotal(search)
            })
            .catch(error => {
                console.log(error)
            })
        } else if (dataListed === 'GCards') {
            axios.get(AGGiftcardsListAPI)
            .then((response) => {
                const giftcardData = response.data;
                const giftData = giftcardData.filter(seller => seller.giftcard_seller == "Attract Game")
                const search = giftData.filter(item => {
                    return Object.values(item).some(value => 
                        typeof value === 'string' && value.toLowerCase().includes(searchInput.toLowerCase())
                    );
                });
                setViewGiftcardTotal(search);
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            axios.get(AGGameCreditsListAPI)
            .then((response) => {
                const gamecreditData = response.data;
                const gameCred = gamecreditData.filter(seller => seller.gamecredit_seller == "Attract Game")
                const search = gameCred.filter(item => {
                    return Object.values(item).some(value => 
                        typeof value === 'string' && value.toLowerCase().includes(searchInput.toLowerCase())
                    );
                });
                setViewGamecreditTotal(search)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    // News Setup
    const [mainnewsLink,setMainNewslink] = useState()
    const [subnewsLink,setSubNewslink] = useState([
        { id: 'newsID_' + Date.now()+1, type: 'sub', link: '' },
        { id: 'newsID_' + Date.now()+3, type: 'sub', link: '' },
        { id: 'newsID_' + Date.now()+4, type: 'sub', link: '' },
        { id: 'newsID_' + Date.now()+5, type: 'sub', link: '' }
    ])
    const [newsLink, setNewsLink] = useState([{ id: 'newsID_' + Date.now(), type: 'other', link: '' }]);
    const handleChangeNewsLinkInput = (id, field, value) => {
        const updatedLinks = newsLink.map(input => input.id === id ? { ...input, [field]: value } : input);
        setNewsLink(updatedLinks);
    };
    const addNewsLinkInput = () => {
        setNewsLink([...newsLink, { id: 'newsID_' + Date.now(), type: 'other', link: '' }]);
    };
    const handleChangeMainNewslinkinput = (event) => {
        setMainNewslink(event.target.value)
    }
    const handleChangeSubNewsLinkInput = (id, link) => {
        const updatedLinks = subnewsLink.map(linkdata => linkdata.id === id ? { ...linkdata, link } : linkdata);
        setSubNewslink(updatedLinks);
    };
    const addNews = async (e) => {
        e.preventDefault();

        const newsData = {
            mainnewsLink,
            subnewsLink,
            newsLink
        };

        try {
            await axios.post(AGInsertNewsLinkAPI, newsData);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };
    const [dataNewsretrieve,setDataNewsRetrieve] = useState()
    useEffect(() => {
        retriveNews()
    }, [])
    const retriveNews = async () => {
        const response = await fetch(AGRetriveNewsAPI)
        const data = await response.json()
        const sortedData = [...data].sort((a,b) => {
            return a.type.localeCompare(b.type)
        })
        setDataNewsRetrieve(sortedData);
    }
    const deleteNewsLink = async (news_id, type) => {
        try {
            const response = await axios.delete(AGDeleteNewsAPI, { data: { id: news_id, type } });
            if (response.data.success) {
                setDataNewsRetrieve(dataNewsretrieve.filter(link => link.news_id !== news_id));
                retriveNews()
            } else {
                console.error('There was an error deleting the link!', response.data.message);
            }
        } catch (error) {
            console.error('There was an error deleting the link!', error);
        }
    };

    // Users Transactions History
    const [viewUserTransactionHistory, setViewUserTransaction] = useState([]);
    const [viewOverallSales, setViewOverAllSales] = useState('');
    const [viewOverallProfit, setViewOverallProfit] = useState('');
    
    useEffect(() => {
        const fetchUserTransactionHistory = async () => {
            try {
                const response = await axios.get(AGUsersTransactions);
                const TransactionHistoryData = response.data.sort((a, b) => b.id - a.id);
                const overAllSalesSum = TransactionHistoryData.map(sales => parseFloat(sales.ag_product_price)).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                const overAllSalesWithInt = overAllSalesSum + (overAllSalesSum*0.075)
                const oaswiFixed = overAllSalesWithInt.toFixed(2)
                const oaswiProfit = oaswiFixed - overAllSalesSum
                setViewOverAllSales(oaswiFixed);
                setViewOverallProfit(oaswiProfit.toFixed(2));
                setViewUserTransaction(TransactionHistoryData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserTransactionHistory();
        fetchTicketConcern();
    }, []);


    const [ticketData,setTicketData] = useState()

    const ticketFetchAPI = process.env.REACT_APP_AG_USERS_FETCH_TICKET_API

    const fetchTicketConcern = async () => {
        try {
            axios.get(ticketFetchAPI).then((response)=>{
                setTicketData(response.data)
            })
        } catch (error) {
            
        }
    }


    const [ concernTicket,setConcernTicket ] = useState(false)
    const [ currentTicket, setCurrentTicket ] = useState()

    const openConcernTicket = (data) => {
        setConcernTicket(true)
        setCurrentTicket(data)
    }

    return (
        <div className='mainContainer admin'>
            {dataListed === 'Games' && (
                <>
                    {openEditModal&&(
                        <div className="admineditGamedata">
                            <div className="admineditData-container">
                                <div className="closeEditModal">
                                    <FaTimes id='closeEditbtn' onClick={handleCloseEditModal}/>
                                </div>
                                <div className="admineditData-contents">
                                    <section id='gameEditdetails'  style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GameCovers/${editableData.game_cover}')no-repeat center`, backgroundSize: 'cover'}}>
                                        <div className="editableGamedata">
                                            <div className="editableGamedata-header">
                                                <h1>{editableData.game_title}</h1>
                                                <p>{editableData.game_edition}</p>
                                            </div>
                                            <div className="editableGamedata-contents">
                                                <hr/>
                                                <div className="editableGamedata-info">
                                                    <span>
                                                        <h1>Developer</h1>
                                                        <p>{editableData.game_developer}</p>
                                                    </span>
                                                    <hr />
                                                    <span>
                                                        <h1>Platform</h1>
                                                        <p>{editableData.game_platform}</p>
                                                    </span>
                                                    <hr />
                                                    <span>
                                                        <h1>Category</h1>
                                                        <p>{editableData.game_category}</p>
                                                    </span>
                                                    <hr />
                                                    <span>
                                                        <h1>Date Listed</h1>
                                                        <p>{formatDateToWordedDate(editableData.date)}</p>
                                                    </span>
                                                    <hr />
                                                    <span>
                                                        <h1>Game Release</h1>
                                                        <p>{formatDateToWordedDate(editableData.game_released)}</p>
                                                    </span>
                                                </div>
                                                <ul>
                                                    <li>
                                                        <h1>price</h1>
                                                        <span>
                                                            <input type="text" placeholder='input price' value={price} onChange={handleChangePrice} disabled={editInfoPrice}/>
                                                            {editInfoPrice ? <FiEdit id='editItemIcon' onClick={toggleDisablePrice}/> : <VscSaveAs id='editItemIcon' onClick={toggleDisablePrice}/>}
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <h1>discount ( % )</h1>
                                                        <span>
                                                            <input type="text" placeholder='input discount' value={discount} onChange={handleChangeDiscount} disabled={editInfoDiscount}/>
                                                            {editInfoDiscount ? <FiEdit id='editItemIcon' onClick={toggleDisableDiscount}/> : <VscSaveAs id='editItemIcon' onClick={toggleDisableDiscount}/>}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </section>
                                    <hr className='hrSpace'/>
                                    <section>
                                        <div className="addgameCodeinfo">
                                            <span>
                                                <h6>ADD PRODUCT CODE</h6>
                                                {inputs.map(input => (
                                                    <div key={input.id}>
                                                        <input
                                                            type="text"
                                                            value={input.value}
                                                            onChange={(e) => handleInputChange(input.id, 'value', e.target.value)}
                                                            placeholder='Insert here...'
                                                        />
                                                    </div>
                                                ))}
                                                <button onClick={addNewInput} disabled={isButtonDisabled}>Add more Codes</button>
                                            </span>
                                            <div className="submitEditabledata">
                                                <p>Avoid unnecessary blank inputs.</p>
                                                <button onClick={insertGameData}>Publish Codes</button>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {dataListed === 'GCards' &&(
            <>
                {openEditModal&&(
                <div className="admineditGamedata">
                    <div className="admineditData-container">
                        <div className="closeEditModal">
                            <FaTimes id='closeEditbtn' onClick={handleCloseEditModal}/>
                        </div>
                        <div className="admineditData-contents">
                            <section id='gameEditdetails'  style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GiftCardCovers/${editableData.giftcard_cover}')no-repeat center`, backgroundSize: 'cover'}}>
                                <div className="editableGamedata">
                                    <div className="editableGamedata-header">
                                        <h1>{editableData.giftcard_name} - ${editableData.giftcard_denomination}</h1>
                                        <p>{editableData.giftcard_description}</p>
                                    </div>
                                    <div className="editableGamedata-contents">
                                        <hr/>
                                        <div className="editableGamedata-info">
                                            <span>
                                                <h1>Supplier</h1>
                                                <p>{editableData.giftcard_supplier}</p>
                                            </span>
                                            <hr />
                                            <span>
                                                <h1>Category</h1>
                                                <p>{editableData.giftcard_category}</p>
                                            </span>
                                            <hr />
                                            <span>
                                                <h1>Date Listed</h1>
                                                <p>{formatDateToWordedDate(editableData.date)}</p>
                                            </span>
                                        </div>
                                        <ul>
                                            <li>
                                                <h1>price</h1>
                                                <span>
                                                    <input type="text" placeholder='input price' value={price} onChange={handleChangePrice} disabled={editInfoPrice}/>
                                                    {editInfoPrice ? <FiEdit id='editItemIcon' onClick={toggleDisablePrice}/> : <VscSaveAs id='editItemIcon' onClick={toggleDisablePrice}/>}
                                                </span>
                                            </li>
                                            <li>
                                                <h1>discount ( % )</h1>
                                                <span>
                                                    <input type="text" placeholder='input discount' value={discount} onChange={handleChangeDiscount} disabled={editInfoDiscount}/>
                                                    {editInfoDiscount ? <FiEdit id='editItemIcon' onClick={toggleDisableDiscount}/> : <VscSaveAs id='editItemIcon' onClick={toggleDisableDiscount}/>}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                            <hr className='hrSpace'/>
                            <section>
                                <div className="addgameCodeinfo">
                                    <span>
                                        <h6>ADD PRODUCT CODE</h6>
                                        {inputs.map(input => (
                                            <div key={input.id}>
                                                <input
                                                    type="text"
                                                    value={input.value}
                                                    onChange={(e) => handleInputChange(input.id, 'value', e.target.value)}
                                                    placeholder='Insert here...'
                                                />
                                            </div>
                                        ))}
                                        <button onClick={addNewInput} disabled={isButtonDisabled}>Add more Codes</button>
                                    </span>
                                    <div className="submitEditabledata">
                                        <p>Avoid unnecessary blank inputs.</p>
                                        <button onClick={insertGameData}>Publish Codes</button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                )}
            </>
            )}
            {dataListed === 'GCredits' &&(
            <>
                {openEditModal&&(
                <div className="admineditGamedata">
                    <div className="admineditData-container">
                        <div className="closeEditModal">
                            <FaTimes id='closeEditbtn' onClick={handleCloseEditModal}/>
                        </div>
                        <div className="admineditData-contents">
                            <section id='gameEditdetails'  style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GameCreditCovers/${editableData.gamecredit_cover}')no-repeat center`, backgroundSize: 'cover'}}>
                                <div className="editableGamedata">
                                    <div className="editableGamedata-header">
                                        <h1>{editableData.gamecredit_name} - ${editableData.gamecredit_denomination}</h1>
                                        <p>{editableData.gamecredit_description}</p>
                                    </div>
                                    <div className="editableGamedata-contents">
                                        <hr/>
                                        <div className="editableGamedata-info">
                                            <span>
                                                <h1>Supplier</h1>
                                                <p>{editableData.gamecredit_supplier}</p>
                                            </span>
                                            <hr />
                                            <span>
                                                <h1>Category</h1>
                                                <p>{editableData.gamecredit_category}</p>
                                            </span>
                                            <hr />
                                            <span>
                                                <h1>Date Listed</h1>
                                                <p>{formatDateToWordedDate(editableData.date)}</p>
                                            </span>
                                        </div>
                                        <ul>
                                            <li>
                                                <h1>price</h1>
                                                <span>
                                                    <input type="text" placeholder='input price' value={price} onChange={handleChangePrice} disabled={editInfoPrice}/>
                                                    {editInfoPrice ? <FiEdit id='editItemIcon' onClick={toggleDisablePrice}/> : <VscSaveAs id='editItemIcon' onClick={toggleDisablePrice}/>}
                                                </span>
                                            </li>
                                            <li>
                                                <h1>discount ( % )</h1>
                                                <span>
                                                    <input type="text" placeholder='input discount' value={discount} onChange={handleChangeDiscount} disabled={editInfoDiscount}/>
                                                    {editInfoDiscount ? <FiEdit id='editItemIcon' onClick={toggleDisableDiscount}/> : <VscSaveAs id='editItemIcon' onClick={toggleDisableDiscount}/>}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                            <hr className='hrSpace'/>
                            <section>
                                <div className="addgameCodeinfo">
                                    <span>
                                        <h6>ADD PRODUCT CODE</h6>
                                        {inputs.map(input => (
                                            <div key={input.id}>
                                                <input
                                                    type="text"
                                                    value={input.value}
                                                    onChange={(e) => handleInputChange(input.id, 'value', e.target.value)}
                                                    placeholder='Insert here...'
                                                />
                                            </div>
                                        ))}
                                        <button onClick={addNewInput} disabled={isButtonDisabled}>Add more Codes</button>
                                    </span>
                                    <div className="submitEditabledata">
                                        <p>Avoid unnecessary blank inputs.</p>
                                        <button onClick={insertGameData}>Publish Codes</button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                )}
            </>
            )}

            {concernTicket &&(
                <div className="userConcernTicket">
                    <ConcernTicket setConcernTicket={setConcernTicket} currentTicket={currentTicket} fetchTicketConcern={fetchTicketConcern}/>
                </div>
            )}


            <section className="adminPageContainer top">
                <div className="admPageContent top">
                    <div className="admpc top">
                        <div className='admpcViewNav'>
                            <button className={activeView === 'default' ? 'activeNav': ''} onClick={handleViewNavigations}><h6>DASHBOARD</h6></button>
                            <button className={activeView === 'news' ? 'activeNav': ''} onClick={handleViewAddNews}><h6>ADD NEWS</h6></button>
                            <button className={activeView === 'supplier' ? 'activeNav': ''} onClick={handleViewAddSupplier}><h6>ADD SUPPLIER</h6></button>
                            <button className={activeView === 'games' ? 'activeNav': ''} onClick={handleViewAddGames}><h6>ADD GAMES</h6></button>
                            <button className={activeView === 'giftCards' ? 'activeNav': ''} onClick={handleViewAddGiftCards}><h6>ADD GIFTCARDS</h6></button>
                            <button className={activeView === 'gameCredit' ? 'activeNav': ''} onClick={handleViewAddGameCredit}><h6>ADD GAME CREDIT</h6></button>
                            <button className={activeView === 'productList' ? 'activeNav': ''} onClick={handleViewProducts}><h6>PRODUCTS</h6></button>
                            <button className={activeView === 'userList' ? 'activeNav': ''} onClick={handleViewUsers}><h6>USERS LIST</h6></button>
                            <button className={activeView === 'seller' ? 'activeNav': ''} onClick={handleViewAddSeller}><h6>ADD SELLER</h6></button>
                            <button className={activeView === 'popupAds' ? 'activeNav': ''} onClick={handleViewAddPopup}><h6>OTHERS</h6></button>
                            <button className={activeView === 'transactions' ? 'activeNav': ''} onClick={handleViewTransactions}><h6>TRANSACTION HISTORY</h6></button>
                            <button className={activeView === 'tickets' ? 'activeNav': ''} onClick={handleViewTickets}><h6>TICKETS</h6></button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="adminPageContainer mid">
                <div className="admPageContent mid1">
                    {activeView === 'default' &&<div className="admpcm1Dashboard">
                        <h4>DASHBOARD</h4>
                        <div className="admpcm1dContainer">
                            <div className="admpcm1dContent left">
                                <div>
                                    <h4>{viewSupplierProfiles.length}</h4>
                                    <h6>TOTAL SUPPLIERS</h6>
                                </div>
                                <div>
                                    <h4>{viewUserProfiles.length}</h4>
                                    <h6>REGISTERED USERS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>TOTAL REGISTERED SELLERS</h6>
                                </div>
                                <div>
                                    <h4>{viewGameTotal.length}</h4>
                                    <h6>LISTED GAMES</h6>
                                </div>
                                <div>
                                    <h4>{viewGiftcardTotal.length}</h4>
                                    <h6>LISTED GIFTCARDS</h6>
                                </div>
                                <div>
                                    <h4>{viewGamecreditTotal.length}</h4>
                                    <h6>LISTED GAME CREDITS</h6>
                                </div>
                            </div>
                            <div className="admpcm1dContent right">
                                <div>
                                    <h4>$ {viewOverallSales}</h4>
                                    <p>TOTAL SALES</p>
                                    <span>
                                        <h6><RiArrowUpSFill className='faIcons'/> NA</h6>
                                    </span>
                                </div>
                                <div>
                                    <h4>$ {viewOverallProfit}</h4>
                                    <p>TOTAL PROFIT</p>
                                    <span>
                                        <h6><RiArrowUpSFill className='faIcons'/> NA</h6>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <h5>RECENT REGISTRATION</h5>
                        <div className="admpcm1dTransaction">
                            <table>
                                <thead>
                                    <tr>
                                        <th width='20%'><p>EMAIL</p></th>
                                        <th width='20%'><p>USERNAME</p></th>
                                        <th width='10%'><p>AG ELITE</p></th>
                                        <th width='20%'><p>DATE REGISTERED</p></th>
                                        <th width='20%'><p>REFERRAL CODE</p></th>
                                        <th width='10%'><p>REFEREE</p></th>
                                    </tr>
                                </thead>
                            </table>
                            <table id='admpcm1dtContent'>
                                <tbody>
                                    {viewUserProfiles.slice(0,10).map((item, i) => (
                                        <tr key={i}>
                                            <td width='20%'><p>{item.email}</p></td>
                                            <td width='20%'><p>{item.username}</p></td>
                                            <td width='10%'><p>{item.agelite ? <FaCheck className='faIcons'/>: ''}</p></td>
                                            <td width='20%'><p>{formatDateToWordedDate(item.date)}</p></td>
                                            <td width='20%'><p>{item.refcode}</p></td>
                                            <td width='10%'><p>0</p></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>}
                    {activeView === 'supplier' &&<div className="admpcm1Supplier">
                        <div className="admpcm1AddSuppContainer">
                            <div className="admpcm1ASuppContent left">
                                <h4>WELCOME ADMIN!</h4><br />
                                <p>
                                    Here, you have the authority to seamlessly add suppliers for both games 
                                    and gift cards. Every detail you input will be meticulously recorded 
                                    and stored within our database, ensuring comprehensive management and 
                                    accessibility.
                                </p>
                                <div className="admpcm1ASuppCAll">
                                    <div>
                                        <h4>{viewSupplierProfiles.length}</h4>
                                        <p>Listed Suppliers</p>
                                    </div>
                                    <div>
                                        <h4>{viewActiveSupplier.length}</h4>
                                        <p>Active Suppliers</p>
                                    </div>
                                </div>
                                <div className="admpcm1ASuppCView">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th width='30%'><p>COMPANY</p></th>
                                                <th width='30%'><p>CONTACT PERSON</p></th>
                                                <th width='40%'><p>EMAIL</p></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <table>
                                        <tbody>
                                            {viewSupplierProfiles.slice(0,8).map((item, i) => (
                                                <tr key={i}>
                                                    <td width='30%'><p>{item.company}</p></td>
                                                    <td width='30%'><p>{item.contact}</p></td>
                                                    <td width='40%'><p>{item.email}</p></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="admpcm1ASuppContent right">
                                <form id='addSupplierFormContainer' onSubmit={handleAddSupplier}>
                                    <h5>ADD SUPPLIER FORM</h5>
                                    <div className='admpcm1ASuppContentForm'>
                                        <span>
                                            <label htmlFor=""><p>Company</p></label>
                                            <input type="text" placeholder='ex. ABC Company' value={agSetCompany} onChange={(e) => setAGSetCompany(e.target.value)} required/>
                                        </span>
                                        <span>
                                            <label htmlFor=""><p>Contact Person</p></label>
                                            <input type="text" placeholder='ex. John Doe' value={agSetContact} onChange={(e) => setAGSetContact(e.target.value)} required/>
                                        </span>
                                        <span>
                                            <label htmlFor=""><p>Email</p></label>
                                            <input type="email" placeholder='ex. johndoe@abccompany.com' value={agSetEmail} onChange={(e) => setAGSetEmail(e.target.value)} required/>
                                        </span>
                                        <span>
                                            <label htmlFor=""><p>Website</p></label>
                                            <input type="text" placeholder='abccompany.com' value={agSetWebsite} onChange={(e) => setAGSetWebsite(e.target.value)} required/>
                                        </span>
                                        <span>
                                            <label htmlFor=""><p>Notes (Optional)</p></label>
                                            <textarea name="" id="" maxLength={1000} placeholder='Type notes/comment here...' value={agSetNotes} onChange={(e) => setAGSetNotes(e.target.value)}></textarea>
                                        </span>
                                        <span className='supplierSubmitStatus'>
                                            <p>{formResponse}</p>
                                        </span>
                                        <span className='supplierSubmit'>
                                            <button type='submit'>Add Supplier</button>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'games' &&<div className="admpcm1Games">
                        <div className="admpcm1AddGameContainer">
                            <div className="admpcm1AGameContent left">
                                <h4>WELCOME ADMIN!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new games, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="admpcm1AGamesCAll">
                                    <div>
                                        <h4>{viewGameTotal.length} Games</h4>
                                        <p>Total Listed Games</p>
                                    </div>
                                    <div>
                                        <h4>{viewGameTotalStocks} Stocks</h4>
                                        <p>Total Game Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="admpcm1AGameContent right">
                                <form id='addGamesFormContainer' onSubmit={handleAddGame}>
                                    <h5>ADD GAMES FORM</h5>
                                    <div className='admpcm1agcForm'>
                                        <div className="admpcm1agcf left">
                                            <div className='admpc1agcfImage'>
                                                {image ? (
                                                    <img src={URL.createObjectURL(image)} alt="Selected Image" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputChange}/>
                                            </div>
                                        </div>
                                        <div className="admpcm1agcf right">
                                            <span>
                                                <label htmlFor=""><p>Game Title</p></label>
                                                <input type="text" placeholder='ex. Tetris' value={agSetGameTitle} onChange={(e) => setAGSetGameTitle(e.target.value)} required/>
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
                                                :<input type="text" value={agSetGameEdition} onChange={(e) => setAGSetGameEdition(e.target.value)} placeholder='Add Custom Edition'/>}
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
                                                <label htmlFor=""><p>Highlight (Optional)</p></label>
                                                <select name="" id="" value={agSetGameHighlight1} onChange={(e) => setAGSetGameHighlight1(e.target.value)}>
                                                    <option value="">Select Highlight</option>
                                                    <option value="Featured">Featured Games</option>
                                                    <option value="Sale">On Sale Games</option>
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Supplier</p></label>
                                                <select name="" id="" value={agSetGameSupplier} onChange={(e) => setAGSetGameSupplier(e.target.value)}>
                                                    <option value="">Select Supplier</option>
                                                    {viewSupplierProfiles.slice(0,8).map((item, i) => (
                                                        <option key={i} value={item.company}>{item.company}</option>
                                                    ))}
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Seller</p></label>
                                                <select name="" id="" value={agSetGameSeller} onChange={(e) => setAGSetGameSeller(e.target.value)} required>
                                                    <option value="">Select Seller</option>
                                                    <option value="Attract Game">Attract Game Stocks</option>
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Category</p></label>
                                                <select name="" id="" value={agSetGameCategory} onChange={(e) => setAGSetGameCategory(e.target.value)} required>
                                                    <option value="">Select Category</option>
                                                    <option value="Trending">Trending Games</option>
                                                    <option value="Hot">Hot Games</option>
                                                    <option value="Classic">Classic Games</option>
                                                    <option value="Preorder">Pre-Order Games</option>
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Platform</p></label>
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
                                        </div>
                                    </div>
                                    <div className="admpc1agcfOthers">
                                        <div className="admpc1agcfo left">
                                            <span>
                                                <label htmlFor=""><p>Available Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameAvailable} onChange={(e) => setAGSetGameAvailable(e.target.value)} placeholder='Type Countries here..' required></textarea>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Restricted Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameRestricted} onChange={(e) => setAGSetGameRestricted(e.target.value)} placeholder='Type Countries here..' required></textarea>
                                            </span>
                                        </div>
                                        <div className="admpc1agcfo right">
                                            <span>
                                                <label htmlFor=""><p>Game Trailer (YouTube Link)</p></label>
                                                <input type="text" placeholder='ex. https://www.youtube.com/watch?v=Mr8fVT_Ds4Q' value={agSetGameTrailer} onChange={(e) => setAGSetGameTrailer(e.target.value)} required/>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='gameSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="admpc1agcfSubmit">
                                        <button type='submit' name='addGames'>Add Games</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'giftCards' && <div className="admpcm1GiftCards">
                        <div className="admpcm1AddGiftCardContainer">
                            <div className="admpcm1AGiftCardContent left">
                                <h4>WELCOME ADMIN!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new giftcards and vouchers, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="admpcm1AGiftcardsCAll">
                                    <div>
                                        <h4>{viewGiftcardTotal.length} Giftcards</h4>
                                        <p>Total Listed Giftcards</p>
                                    </div>
                                    <div>
                                        <h4>{viewGiftcardTotalStocks} Stocks</h4>
                                        <p>Total Giftcards Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="admpcm1AGiftCardContent right">
                                <form id='addGiftCardFormContainer' onSubmit={handleAddGiftcard}>
                                    <h5>ADD GIFTCARDS/VOUCHER FORM</h5>
                                    <div className="admpcm1agcvForm">
                                        <div className="admpcm1agcvf left">
                                            <div className="admpc1agcvfImage">
                                                {imageGCV ? (
                                                    <img src={URL.createObjectURL(imageGCV)} alt="No image Selected" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputGCVChange}/>
                                            </div>
                                        </div>
                                        <div className="admpcm1agcvf right">
                                            <span>
                                                <label htmlFor=""><p>GiftCard/Voucher Name</p></label>
                                                <input type="text" placeholder='ex. AG Voucher' required  value={agSetGiftCardTitle} onChange={(e) => setAGSetGiftCardTitle(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Valuation/Denomination ($)</p></label>
                                                <input type="number" placeholder='ex. 100' required value={agSetGiftCardDenomination} onChange={(e) => setAGSetGiftCardDenomination(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Supplier</p></label>
                                                <select name="" id="" value={agSetGiftCardSupplier} onChange={(e) => setAGSetGiftCardSupplier(e.target.value)}>
                                                    <option value="">Select Supplier</option>
                                                    <option value="Local">Local</option>
                                                    {viewSupplierProfiles.slice(0,8).map((item, i) => (
                                                        <option key={i} value={item.company}>{item.company}</option>
                                                    ))}
                                                </select>
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
                                                    <option value="Special">Special</option>
                                                </select>
                                            </span>
                                            <span id='admpcm1agcvfDes'>
                                                <label htmlFor=""><p>Giftcard/Voucher Description</p></label>
                                                <textarea name="" id="" placeholder='Add Giftcard/Voucher Description here' value={agSetGiftCardDescription} onChange={(e) => setAGSetGiftCardDescription(e.target.value)}></textarea>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='giftcardSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="admpc1agcvfSubmit">
                                        <button type='submit' name='addGames'>Add Giftcards/Voucher</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'gameCredit' && <div className="admpcm1GameCredits">
                        <div className="admpcm1AddGameCreditsContainer">
                            <div className="admpcm1AGameCreditsContent left">
                                <h4>WELCOME ADMIN!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new game credits, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="admpcm1AGameCreditsCAll">
                                    <div>
                                        <h4>{viewGamecreditTotal.length} GCredits</h4>
                                        <p>Total Listed Game Credits</p>
                                    </div>
                                    <div>
                                        <h4>{viewGamecreditTotalStocks} Stocks</h4>
                                        <p>Total Game Credits Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="admpcm1AGameCreditsContent right">
                                <form id='addGiftCardFormContainer' onSubmit={handleAddGamecredit}>
                                    <h5>ADD GAME CREDITS FORM</h5>
                                    <div className="admpcm1agcrForm">
                                        <div className="admpcm1agcrf left">
                                            <div className="admpc1agcrfImage">
                                                {imageGCR ? (
                                                    <img src={URL.createObjectURL(imageGCR)} alt="No image Selected" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputGCRChange}/>
                                            </div>
                                        </div>
                                        <div className="admpcm1agcrf right">
                                            <span>
                                                <label htmlFor=""><p>Game Credit Name</p></label>
                                                <input type="text" placeholder='ex. AG Voucher' required  value={agSetGameCreditTitle} onChange={(e) => setAGSetGameCreditTitle(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Valuation/Denomination ($)</p></label>
                                                <input type="number" placeholder='ex. 100' required value={agSetGameCreditDenomination} onChange={(e) => setAGSetGameCreditDenomination(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Number of Credits</p></label>
                                                <input type="number" placeholder='ex. 100'  value={agSetGameCreditNumber} onChange={(e) => setAGSetGameCreditNumber(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Type of Credit</p></label>
                                                <input type="text" placeholder='ex. Robux' required value={agSetGameCreditType} onChange={(e) => setAGSetGameCreditType(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Supplier</p></label>
                                                <select name="" id="" value={agSetGameCreditSupplier} onChange={(e) => setAGSetGameCreditSupplier(e.target.value)} required>
                                                    <option value="">Select Supplier</option>
                                                    <option value="Roblox Developer">Roblox Developer</option>
                                                    {viewSupplierProfiles.slice(0,8).map((item, i) => (
                                                        <option key={i} value={item.company}>{item.company}</option>
                                                    ))}
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Category</p></label>
                                                <select name="" id="" value={agSetGameCreditCategory} onChange={(e) => setAGSetGameCreditCategory(e.target.value)} required>
                                                    <option value="">Select Category</option>
                                                    <option value="Gaming">Gaming</option>
                                                    <option value="Utilities">Utilities</option>
                                                    <option value="Shopping">Shopping</option>
                                                    <option value="Crypto">Crypto</option>
                                                </select>
                                            </span>
                                            <span id='admpcm1agcrfDes'>
                                                <label htmlFor=""><p>Game Credit Description</p></label>
                                                <textarea name="" id="" placeholder='Add Game Credit Description here' value={agSetGameCreditDescription} onChange={(e) => setAGSetGameCreditDescription(e.target.value)}></textarea>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='gamecreditSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="admpc1agcrfSubmit">
                                        <button type='submit' name='addGames'>Add Game Credit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'productList' && <div className="admpcm1Product">
                        <div className="admpcm1ProductlistContainer">
                            <div className="admpcm1ProductlistContent left">
                                <div className="admpcm1ProductLeft-header">
                                    <h4>WELCOME ADMIN!</h4><br />
                                    <p>
                                        Within this administrative interface, you have the ability to effortlessly 
                                        integrate new codes for games, gift cards and vouchers. 
                                        Every detail is meticulously logged and securely stored in our database, 
                                        ensuring thorough management and easy access.
                                    </p>
                                </div>
                                <div className="totalGameProducts">
                                    <ul>
                                        <li>
                                            <h1>{viewAGData1.length} Games</h1>
                                            <p>Total Listed Games</p>
                                        </li>
                                        <li>
                                            <h1>{giftcards.length} Giftcards</h1>
                                            <p>Total Listed Giftcards</p>
                                        </li>
                                        <li>
                                            <h1>{gamecredits.length} GCredits</h1>
                                            <p>Total Listed Game Credits</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="admpcm1ProductlistContent right">
                                <div className="admpcm1ProductRight-header">
                                    <div className="admpcm1Filter">
                                        <h6 onClick={openFilterchange}>{filterName} <TiArrowSortedDown className='faIcons'/></h6>
                                        <section className={`admpcmviewFilterby ${filter}`}>
                                            <p onClick={selectGames}>Games</p>
                                            <p onClick={selectGCards}>Gift Cards</p>
                                            <p onClick={selectGCredits}>Game Credits</p>
                                        </section>
                                    </div>
                                    <div className="admpcm1Sort">
                                        <h6 onClick={toggleOrder}>{order ? <FaSortAlphaDown className='faIcons'/> : <FaSortAlphaUp className='faIcons'/>}</h6>
                                        <h6 onClick={showOrdering}>{sortName} <TiArrowSortedDown className='faIcons'/></h6>
                                        <section className={`sortingSelection ${orderSelect}`}>
                                            <p onClick={toggleFiltername}>Name</p>
                                            <p onClick={toggleFilternewest}>Date</p>
                                            {/* <p>Most Ordered</p> */}
                                        </section>
                                    </div>
                                    <div className="admpcmSearch">
                                        <form onSubmit={searchItem} className="admproductSearch">
                                            <input type="text" placeholder='Search Anything by Category' value={searchInput} onChange={handleSearch}/>
                                            <button type='submit'><FaSearch /></button>
                                        </form>
                                    </div>
                                </div>
                                <div className="admpcm1ProductRight-productList">
                                    {dataListed === '' &&(
                                    <div className="admpcm1ProductRight-loader">
                                        <span class="admpcm1ProductRightloader"></span>
                                    </div>
                                    )}
                                    {dataListed === 'Games' &&(
                                        <>
                                        <ul>
                                        {viewGameTotal.map(game => (
                                            <li key={game.id} style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GameCovers/${game.game_cover}')no-repeat center`, backgroundSize: 'cover'}} onClick={() => openEditquick(game)}>
                                                <div className="prdGameinfo-edit">
                                                    <section>
                                                        <button onClick={() => handleEditProd(game)}>Add Codes</button>
                                                        <Link to={`/Games/${game.game_canonical}`} target='_blank'><FaExternalLinkAlt className='faIcons'/></Link>
                                                    </section>
                                                </div>
                                                <div className="prdGameinfo">
                                                    <h1>{game.game_title}</h1>
                                                    <p>{game.game_edition}</p>
                                                </div>
                                            </li>
                                        ))}
                                        </ul>
                                        </>
                                    )}
                                    {dataListed === 'GCards' &&(
                                        <>
                                        <ul>
                                        {viewGiftcardTotal.map(cards => (
                                            <li key={cards.id} style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GiftCardCovers/${cards.giftcard_cover}')no-repeat center`, backgroundSize: 'cover'}} onClick={() => openEditquick(cards)}>
                                                <div className="prdgcDenomination">
                                                    <h6>${cards.giftcard_denomination}</h6>
                                                </div>
                                                <div className="prdGameinfo-edit">
                                                    <section>
                                                        <button onClick={() => handleEditProd(cards)}>Add Codes</button>
                                                        <Link to={`/Giftcards/${cards.giftcard_canonical}`} target='_blank'><FaExternalLinkAlt className='faIcons'/></Link>
                                                    </section>
                                                </div>
                                                <div className="prdGameinfo">
                                                    <h1>{cards.giftcard_name}</h1>
                                                    <p>{cards.giftcard_supplier}</p>
                                                </div>
                                            </li>
                                        ))}
                                        </ul>
                                        </>
                                    )}
                                    {dataListed === 'GCredits' &&(
                                        <>
                                        <ul>
                                        {viewGamecreditTotal.map(credits => (
                                            <li key={credits.id} style={{ background: `linear-gradient(360deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 100%),url('https://2wave.io/GameCreditCovers/${credits.gamecredit_cover}')no-repeat center`, backgroundSize: 'cover'}} onClick={() => openEditquick(credits)}>
                                                <div className="prdgcDenomination">
                                                    <h6>${credits.gamecredit_denomination}</h6>
                                                </div>
                                                <div className="prdGameinfo-edit">
                                                    <section>
                                                        <button onClick={() => handleEditProd(credits)}>Add Codes</button>
                                                        <Link to={`/GameCredits/${credits.gamecredit_id}`} target='_blank'><FaExternalLinkAlt className='faIcons'/></Link>
                                                    </section>
                                                </div>
                                                <div className="prdGameinfo">
                                                    <h1>{credits.gamecredit_name}</h1>
                                                    <p>{credits.gamecredit_supplier}</p>
                                                </div>
                                            </li>
                                        ))}
                                        </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'news' && <div className="admpcm1News">
                            <div className="admpcm1NewsContainer">
                                <div className="admpcm1NewsHeader">
                                    <h1>Welcome Admin!</h1>
                                    <p>Access and Add latest news and articles here</p>
                                </div>
                                <hr />
                                <div className="admpcm1NewsContents">
                                    <h1>Add news link here</h1>
                                    <div className="admpcm1Addnews">
                                        <section>
                                            <ul>
                                                <hr />
                                                <li>
                                                    <p>Main News</p>
                                                    <div className="admpcm1AddnewsInput">
                                                        <input type="text" value={mainnewsLink} onChange={handleChangeMainNewslinkinput} />
                                                    </div>
                                                </li>
                                                <hr />
                                                <li>
                                                    <p>Sub News</p>
                                                    {subnewsLink.map(input => (
                                                        <div className="admpcm1AddnewsInput" key={input.id}>
                                                            <input
                                                                type="text"
                                                                value={input.link}
                                                                onChange={(e) => handleChangeSubNewsLinkInput(input.id, e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    ))}
                                                </li>
                                                <hr />
                                                <li>
                                                    <p>Other News</p>
                                                    <section>
                                                        {newsLink.map(input => (
                                                        <div className="admpcm1AddnewsInput" key={input.id}>
                                                            <input
                                                                type="text"
                                                                value={input.link}
                                                                onChange={(e) => handleChangeNewsLinkInput(input.id, 'link', e.target.value)}
                                                            />
                                                        </div>
                                                        ))}
                                                    </section>
                                                    <button type='button' onClick={addNewsLinkInput}>add link input</button>
                                                </li>
                                                <hr />
                                            </ul>
                                            <div className="submitLinksbtn">
                                                <button onClick={addNews}>add link</button>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="newsContentsTable">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th width="25%"><p>News ID</p></th>
                                                    <th width="55%"><p>News Link</p></th>
                                                    <th width="10%"><p>Category</p></th>
                                                    <th width="10%"><p>Function</p></th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <div>
                                            <table id='linksTable'>
                                                {dataNewsretrieve&&(
                                                    <tbody>
                                                    {dataNewsretrieve.map(link => (
                                                        <tr key={link.id}>
                                                            <td width="25%"><p>{link.news_id}</p></td>
                                                            <td width="55%"><p>{link.link}</p></td>
                                                            <td width="10%"><p>{link.type}</p></td>
                                                            <td width="10%"><button onClick={() => deleteNewsLink(link.news_id, link.type)}>Delete</button></td>
                                                        </tr>
                                                    ))}
                                                </tbody>)}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>}
                    {activeView === 'transactions' && <div className="admpcm1TransactionHistory">
                        <div className="admpcm1AllTransactionContainer">
                            <div className="admpcm1atcTop">
                                <h5>USERS TRANSACTION HISTORY</h5>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th width='15%'><p>User ID</p></th>
                                        <th width='25%'><p>Product Name</p></th>
                                        <th width='10%'><p>Quantity</p></th>
                                        <th width='15%'><p>Price</p></th>
                                        <th width='15%'><p>Purchased Date</p></th>
                                        <th width='20%'><p>Transaction Hash</p></th>
                                    </tr>
                                </thead>
                            </table>
                            <div className='admpcm1atContents'>
                                <table id='admpcm1atcs'>
                                    {viewUserTransactionHistory&&(
                                    <tbody>
                                        {viewUserTransactionHistory.map((data, i) => (
                                        <tr key={i}>
                                            <td width='15%'><p>{data.ag_user_id}</p></td>
                                            <td width='25%'><p>{data.ag_product_name}</p></td>
                                            <td width='10%'><p>{data.ag_product_quantity}</p></td>
                                            <td width='15%'><p>$ {data.ag_product_price}</p></td>
                                            <td width='15%'><p>{formatDateToWordedDate(data.ag_product_purchased_date)}</p></td>
                                            <td width='20%'><p>{data.ag_transaction_hash}</p></td>
                                        </tr>))}
                                    </tbody>)}
                                </table>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'tickets' && <div className="admpcm1TransactionHistory">
                        <div className="admpcm1AllTransactionContainer">
                            <div className="admpcm1atcTop">
                                <h5>USERS CONCERN TICKET</h5>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th width='25%'><p>Date</p></th>
                                        <th width='25%'><p>Product Name</p></th>
                                        <th width='25%'><p>User ID</p></th>
                                        <th width='12.5%'><p>Status</p></th>
                                        <th width='12.5%'><p>View Concern</p></th>
                                    </tr>
                                </thead>
                            </table>
                            <div className='admpcm1atContents'>
                                <table id='admpcm1atcs'>
                                    {ticketData&&(
                                    <tbody>
                                        {ticketData.map((data, i) => (
                                        <tr key={i}>
                                            <td width='25%'><p>{data.date}</p></td>
                                            <td width='25%'><p>{data.product_name}</p></td>
                                            <td width='25%'><p>{data.user_id}</p></td>
                                            <td width='12.5%'><p>{data.status}</p></td>
                                            <td width='12.5%'><button onClick={() => openConcernTicket(data)}>View</button></td>
                                        </tr>))}
                                    </tbody>)}
                                </table>
                            </div>
                        </div>
                    </div>}
                </div>
            </section>
        </div>
    )
}

export default Admin
