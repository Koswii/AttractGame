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
import { VscSaveAs } from "react-icons/vsc";
import { FiEdit } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { TiArrowSortedDown } from "react-icons/ti";
import { UserProfileData } from './UserProfileContext';
import { GamesFetchData } from './GamesFetchContext';
import { GiftcardsFetchData } from './GiftcardsFetchContext';
import { GamecreditsFetchData } from './GamecreditFetchContext';



const SellerPanel = () => {
    const [activeView, setActiveView] = useState('default');
    const { userLoggedData } = UserProfileData();
    

    const AGAddGamesAPI = process.env.REACT_APP_AG_ADD_GAMES_API;
    const AGAddGameCoverAPI = process.env.REACT_APP_AG_ADD_GAME_COVER_API;
    const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGAddGiftcardsAPI = process.env.REACT_APP_AG_ADD_GIFTCARD_API;
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const AGAddGameCreditsAPI = process.env.REACT_APP_AG_ADD_GAMECREDIT_API;
    const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
    const AGInsertProductCodeAPI = process.env.REACT_APP_AG_INSERT_PRODUCT_CODES_API;
    const AGProductStateAPI = process.env.REACT_APP_AG_PRODUCT_STATE_CREDENTIALS_API;

    const { viewAGData1 } = GamesFetchData();
    const { giftcards } = GiftcardsFetchData();
    const { gamecredits } = GamecreditsFetchData();

    const [allSellerGamedata, setAllSellerGamedata] = useState ()
    const [allSellerGiftCarddata, setAllSellerGiftCarddata] = useState ()
    const [allSellerGameCreditsdata, setAllSellerGameCreditsdata] = useState ()
    
    const formatDateToWordedDate = (numberedDate) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date(numberedDate);
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        
        return `${month} ${day}, ${year}`;
    }
    
    
    useEffect(() => {
        const savedView = localStorage.getItem('activeView');
        if (savedView) {
        setActiveView(savedView);
        }
    }, []);
    useEffect(() => {
        const gameDatas = viewAGData1.filter(gameSeller => gameSeller.game_seller == userLoggedData.userid)
        const gamecreds = gamecredits.filter(gameSeller => gameSeller.gamecredit_seller == userLoggedData.userid)
        const giftcarddata = giftcards.filter(gameSeller => gameSeller.giftcard_seller == userLoggedData.userid)
        
        setAllSellerGamedata(gameDatas)
        setAllSellerGameCreditsdata(gamecreds)
        setAllSellerGiftCarddata(giftcarddata)


        


        const fetchDataGames = () => {
            axios.get(AGGamesListAPI)
            .then((response) => {
                const gameData = response.data;
                const gameAG = gameData.filter(seller => seller.game_seller == userLoggedData.userid)
                setViewGameTotal(gameAG);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataGames() 
        const fetchDataGiftcards = () => {
            axios.get(AGGiftcardsListAPI)
            .then((response) => {
                const giftcardData = response.data;
                const giftAG = giftcardData.filter(seller => seller.giftcard_seller == userLoggedData.userid)
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
                const gameCred = gamecreditData.filter(seller => seller.gamecredit_seller == userLoggedData.userid)
                setViewGamecreditTotal(gameCred);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataGamecredits();

    }, [viewAGData1])
    
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
    };
    const handleViewSell = () => {
        setActiveView('sell');
    };
    const handleViewFaqs = () => {
        setActiveView('faqs');
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
    const agSetGameCode1 = agSetGameTitle.replace(/\s/g, '');
    const agSetGameCode2 = agSetGamePlatform.replace(/\s/g, '');
    const agSetGameCode3 = agSetGameEdition.replace(/\s/g, '');
    const agFullSetGameCode = `${userLoggedData.userid}_${agSetGameCode1}_${agSetGameCode2}`;
    const agGameCanonical = `${agSetGameCode1}${agSetGamePlatform}_${agSetGameCode3}_${userLoggedData.userid}`;
    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
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
            agGameSeller: userLoggedData.userid,
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
            }
            // Sending game cover image
            const response = await axios.post(AGAddGameCoverAPI, formImageDataSeller, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
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
    const agSetGiftCardCanonical = `${agSetGiftCardCode3}_${userLoggedData.userid}`;
    const agFullSetGiftCardCode = `${userLoggedData.userid}_${agSetGiftCardCode1}_${agSetGiftCardCode2}`;
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
            agGiftcardSeller: userLoggedData.userid,
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
    const agFullSetGameCreditCode = `${userLoggedData.userid}_${agSetGameCreditCode4}GameCredit_${agSetGameCreditCode2}`;
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
            agGamecreditSeller: userLoggedData.userid,
            agGamecreditCategory: 'Gaming',
            agGamecreditDescription: agSetGameCreditDescription,
        };

        
        const test = JSON.stringify(formAddGamecreditsDetailsSeller)
        console.log(test);
    
        const formImageGCRData = new FormData();
        formImageGCRData.append('agGiftcardCover', imageGCR);
    
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

    
    const [dataListed, setDatalisted]= useState('')
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
    


    const [viewGameTotalStocks, setViewGameTotalStocks] = useState(0);
    const [viewGiftcardTotalStocks, setViewGiftcardTotalStocks] = useState(0);
    const [viewGamecreditTotalStocks, setViewGamecreditTotalStocks] = useState(0);
    const [viewOverAllStocks, setViewOverAllStocks] = useState(0)
    
    const [viewGameTotal, setViewGameTotal] = useState([]);
    const [viewGiftcardTotal, setViewGiftcardTotal] = useState([]);
    const [viewGamecreditTotal, setViewGamecreditTotal] = useState([]);

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
                const gameAG = gameData.filter(seller => seller.game_seller == userLoggedData.userid)
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
                const giftData = giftcardData.filter(seller => seller.giftcard_seller == userLoggedData.userid)
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
                const gameCred = gamecreditData.filter(seller => seller.gamecredit_seller == userLoggedData.userid)
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


    console.log(dataListed);
    console.log(viewGameTotal);
    
    
    return (
        <div className='mainContainer sellerPanel'>
            {dataListed === 'Games' &&(
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
                                        {/* <button onClick={addNewInput} disabled={isButtonDisabled}>Add more Codes</button> */}
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
                                        {/* <button onClick={addNewInput} disabled={isButtonDisabled}>Add more Codes</button> */}
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
                                        {/* <button onClick={addNewInput} disabled={isButtonDisabled}>Add more Codes</button> */}
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


            <section className="spPageContainer top">
                <div className="spPageContent top">
                    <div className="sppc top">
                        <div className="sppctViewNav">
                            <button className={activeView === 'default' ? 'activeNav': ''} onClick={handleViewNavigations}><h6>DASHBOARD</h6></button>
                            <button className={activeView === 'games' ? 'activeNav': ''} onClick={handleViewAddGames}><h6>ADD GAMES</h6></button>
                            <button className={activeView === 'giftcards' ? 'activeNav': ''} onClick={handleViewAddGiftcards}><h6>ADD GIFTCARDS</h6></button>
                            <button className={activeView === 'gamecredits' ? 'activeNav': ''} onClick={handleViewAddGamecredits}><h6>ADD GAME CREDITS</h6></button>
                            <button className={activeView === 'productList' ? 'activeNav': ''} onClick={handleViewAddCodes}><h6>ADD PRODUCT CODES</h6></button>
                            <button className={activeView === 'inventory' ? 'activeNav': ''} onClick={handleViewInventory}><h6>INVENTORY</h6></button>
                            <button className={activeView === 'tickets' ? 'activeNav': ''} onClick={handleViewTickets}><h6>TICKETS</h6></button>
                            <button className={activeView === 'sell' ? 'activeNav': ''} onClick={handleViewSell}><h6>SELL TO AG</h6></button>
                            <button className={activeView === 'faqs' ? 'activeNav': ''} onClick={handleViewFaqs}><h6>SELLER FAQs</h6></button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="spPageContainer mid">
                <div className="spPageContent mid1">
                    {activeView === 'default' && <div className="sppcm1Dashboard">
                        <h4>SELLER DASHBOARD</h4>
                        <div className="sppcm1dContainer">
                            <div className="sppcm1dContent left">
                                <div>
                                    <h4>0</h4>
                                    <h6>LISTED GAMES</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>LISTED GIFTCARDS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>LISTED GAME CREDITS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>GAME STOCKS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>GIFTCARD STOCKS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>GAMECREDIT STOCKS</h6>
                                </div>
                            </div>
                            <div className="sppcm1dContent right">
                                <div>
                                    <h4>$ 0</h4>
                                    <span>
                                        <h6><RiArrowUpSFill className='faIcons'/> NA</h6>
                                        <p>TOTAL SALES</p>
                                    </span>
                                </div>
                                <div>
                                    <h4>$ 0</h4>
                                    <span>
                                        <h6><RiArrowUpSFill className='faIcons'/> NA</h6>
                                        <p>TOTAL PROFIT</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'games' && <div className="sppcm1AddGames">
                        <div className="sppcm1AddGameContainer">
                            <div className="sppcm1AGameContent left">
                                <h4>WELCOME SELLER!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new games, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="sppcm1AGamesCAll">
                                    <div>
                                        <h4>0 Games</h4>
                                        <p>Total Listed Games</p>
                                    </div>
                                    <div>
                                        <h4>0 Stocks</h4>
                                        <p>Total Game Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="sppcm1AGameContent right">
                                <form id='addGamesFormContainer' onSubmit={handleAddGame}>
                                    <h5>ADD GAMES FORM</h5>
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
                                            <span>
                                                <label htmlFor=""><p>Available Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameAvailable} onChange={(e) => setAGSetGameAvailable(e.target.value)} placeholder='(Ex. JP, EG, VE)' required></textarea>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Restricted Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameRestricted} onChange={(e) => setAGSetGameRestricted(e.target.value)} placeholder='(Ex. JP, EG, VE)' required></textarea>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="sppc1agcfOthers">
                                        <div className="sppc1agcfo right">
                                            <span>
                                                <label htmlFor=""><p>Game Trailer (YouTube Link)</p></label>
                                                <input type="text" placeholder='ex. https://www.youtube.com/watch?v=Mr8fVT_Ds4Q' value={agSetGameTrailer} onChange={(e) => setAGSetGameTrailer(e.target.value)} required/>
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
                        <div className="sppcm1AddGiftCardContainer">
                            <div className="sppcm1AGiftCardContent left">
                                <h4>WELCOME SELLER!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new giftcards and vouchers, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="sppcm1AGiftcardsCAll">
                                    <div>
                                        <h4>0 Giftcards</h4>
                                        <p>Total Listed Giftcards</p>
                                    </div>
                                    <div>
                                        <h4>0 Stocks</h4>
                                        <p>Total Giftcards Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="sppcm1AGiftCardContent right">
                                <form id='addGiftCardFormContainer' onSubmit={handleAddGiftcard}>
                                    <h5>ADD GIFTCARDS/VOUCHER FORM</h5>
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
                        <div className="sppcm1AddGameCreditsContainer">
                            <div className="sppcm1AGameCreditsContent left">
                                <h4>WELCOME SELLER!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new game credits, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="sppcm1AGameCreditsCAll">
                                    <div>
                                        <h4>0 GCredits</h4>
                                        <p>Total Listed Game Credits</p>
                                    </div>
                                    <div>
                                        <h4>0 Stocks</h4>
                                        <p>Total Game Credits Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="sppcm1AGameCreditsContent right">
                                <form id='addGiftCardFormContainer' onSubmit={handleAddGamecredit}>
                                    <h5>ADD GAME CREDITS FORM</h5>
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
                        <div className="sppcm1ProductlistContainer">
                            <div className="sppcm1ProductlistContent left">
                                <div className="sppcm1ProductLeft-header">
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
                                            <h1>{allSellerGamedata.length} Games</h1>
                                            <p>Total Listed Games</p>
                                        </li>
                                        <li>
                                            <h1>{allSellerGiftCarddata.length} Giftcards</h1>
                                            <p>Total Listed Giftcards</p>
                                        </li>
                                        <li>
                                            <h1>{allSellerGameCreditsdata.length} GCredits</h1>
                                            <p>Total Listed Game Credits</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="sppcm1ProductlistContent right">
                                <div className="sppcm1ProductRight-header">
                                    <div className="sppcm1Filter">
                                        <h6 onClick={openFilterchange}>{filterName} <TiArrowSortedDown className='faIcons'/></h6>
                                        <section className={`sppcmviewFilterby ${filter}`}>
                                            <p onClick={selectGames}>Games</p>
                                            <p onClick={selectGCards}>Gift Cards</p>
                                            <p onClick={selectGCredits}>Game Credits</p>
                                        </section>
                                    </div>
                                    <div className="sppcm1Sort">
                                        <h6 onClick={toggleOrder}>{order ? <FaSortAlphaDown className='faIcons'/> : <FaSortAlphaUp className='faIcons'/>}</h6>
                                        <h6 onClick={showOrdering}>{sortName} <TiArrowSortedDown className='faIcons'/></h6>
                                        <section className={`sortingSelection ${orderSelect}`}>
                                            <p onClick={toggleFiltername}>Name</p>
                                            <p onClick={toggleFilternewest}>Date</p>
                                            {/* <p>Most Ordered</p> */}
                                        </section>
                                    </div>
                                    <div className="sppcmSearch">
                                        <form onSubmit={searchItem} className="spproductSearch">
                                            <input type="text" placeholder='Search Anything by Category' value={searchInput} onChange={handleSearch}/>
                                            <button type='submit'><FaSearch /></button>
                                        </form>
                                    </div>
                                </div>
                                <div className="sppcm1ProductRight-productList">
                                    {dataListed === '' &&(
                                    <div className="sppcm1ProductRight-loader">
                                        <span class="sppcm1ProductRightloader"></span>
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
                </div>
            </section>
        </div>
    )
}

export default SellerPanel