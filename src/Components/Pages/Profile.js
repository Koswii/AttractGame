import React, { useState, useEffect } from 'react'
import "../CSS/profile.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FaSearch,
    FaBolt,
    FaTicketAlt,
    FaGem,
    FaCoins,
    FaFire,
    FaStar,     
    FaFacebookSquare,
    FaBitcoin, 
    FaTimes,
    FaRegImages,
    FaEdit,  
    FaPlus,
    FaRegEye,
    FaRegEyeSlash, 
} from 'react-icons/fa';
import { 
    FaSquareFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
    FaTwitch,
    FaCircleCheck,  
    FaTicket
} from "react-icons/fa6";
import { 
    TbUserSquareRounded,
    TbGiftCardFilled,
    TbSettings2,
    TbSettingsBolt,
    TbUpload,
    TbCubeSend,
    TbCubePlus,
    TbTicket,
    TbMessages,
    TbMessage2,
    TbSend,   
} from "react-icons/tb";
import { 
    RiVerifiedBadgeFill,
    RiSparklingFill,
    RiImageEditLine,
    RiUserSettingsLine    
} from "react-icons/ri";
import { 
    IoLogoYoutube,
    IoIosImages,
    IoMdAddCircle  
} from "react-icons/io";
import { UserProfileData } from './UserProfileContext';
import HashtagHighlighter from './HashtagHighlighter';
import YouTubeEmbed from './YouTubeEmbed';
import UserPostModal from './UserPostModal';
import UserPostModal2 from './UserPostModal2';
import UserStoryModal from './UserStoryModal';
import TicketForm from './ticketForm';



const formatDateToWordedDate = (numberedDate) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date = new Date(numberedDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}
const formatDate = (date) => {
    const givenDate = new Date(date);
    const currentDate = new Date();
  
    // Clear the time part of the dates
    const currentDateNoTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const givenDateNoTime = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());
  
    const timeDifference = currentDateNoTime - givenDateNoTime;
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  
    if (timeDifference === 0) {
      return "Today";
    } else if (timeDifference === oneDay) {
      return "Yesterday";
    } else {
      return formatDateToWordedDate(givenDate);
    }
};
const parseDateString = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
};
const AGUserStoryAPI = process.env.REACT_APP_AG_FETCH_STORY_API;
const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
const isWithinLastTwelveHours = (date) => {
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
    return new Date(date) >= twelveHoursAgo;
};
const fetchUserDataStory = async (setViewFetchStory) => {
    try {
        const response = await axios.get(AGUserStoryAPI);
        const filteredData = response.data.filter(story => isWithinLastTwelveHours(story.user_story_date));
        const storySortData = filteredData.sort((a, b) => new Date(b.user_story_date) - new Date(a.user_story_date));

        try {
            const userDataResponse = await axios.get(AGUserDataAPI);
            const storiesWithUserData = storySortData.map(story => {
                const userData = userDataResponse.data.find(user => user.userid === story.user_id);
                return { ...story, userData };
            });
            setViewFetchStory(storiesWithUserData);
        } catch (userDataError) {
            console.error('Error fetching user data:', userDataError);
        }
    } catch (storyError) {
        console.error('Error fetching stories:', storyError);
    }
};
const defaultImages = [
    'AG Logo1.png',
    'AG Logo2.png',
    'AG Logo3.png',
    'AG Logo4.png',
    'AG Logo5.png',
    'DefaultProfilePic.png',
    'MaleDP01.png',
    'MaleDP02.png',
    'FemaleDP01.png',
    'FemaleDP02.png'
];
const UsernameSlicer = ({ text = '', maxLength }) => {
    const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  
    return (
      <>{truncatedText}</>
    );
};

const Profile = () => {
    const { 
        userLoggedData, 
        userProductCodeIDData, 
        viewTransactionList,
        viewTicketReport,
        viewTicketMessages,
        fetchUserProductIds,
        fetchUserTransactionHistory, 
        fetchUserTicketReport,
        fetchUserTicketMessages,
    } = UserProfileData();
    // User Profile Fetching
    const AGUserPostAPI = process.env.REACT_APP_AG_FETCH_POST_API;
    const AGUsersTransactions = process.env.REACT_APP_AG_USERS_TRANSACTIONS_API;
    const LoginUsername = localStorage.getItem('attractGameUsername');
    const LoginUserID = localStorage.getItem('profileUserID');
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const storedSellerState = localStorage.getItem('agSellerLoggedIn');
    const [userProductIDData, setUserProductIDData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [randomNumber, setRandomNumber] = useState('');
    const [randomPostID, setRandomPostID] = useState('');
    const [viewFetchPost, setViewFetchPost] = useState([]);
    const [viewFetchStory, setViewFetchStory] = useState([]);


    const [gamePrice, setGamePrice] = useState('');
    const [giftcardPrice, setGiftcardPrice] = useState('');
    const [gamecreditPrice, setGamecreditPrice] = useState('');
    const [receiverUserID, setReceiverUserID] = useState('');
    const AGFlipProductsAPI = process.env.REACT_APP_AG_USER_FLIP_CODE_API;
    const AGSendProductsAPI = process.env.REACT_APP_AG_USER_SEND_CODE_API;
    const AGSendingTrasactionsAPI = process.env.REACT_APP_AG_USER_SEND_TRANSACTION_API;
    const AGRedeemProductsAPI = process.env.REACT_APP_AG_USER_REDEEM_CODE_API;
    const AGAddGamesAPI = process.env.REACT_APP_AG_ADD_GAMES_API;
    const AGAddGiftcardsAPI = process.env.REACT_APP_AG_ADD_GIFTCARD_API;
    const AGAddGameCreditsAPI = process.env.REACT_APP_AG_ADD_GAMECREDIT_API;

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //     const number = Math.floor(Math.random() * 900000) + 100000; // Generates a 6-digit number
    //     setRandomNumber(number);
    //     }, 1000); // Change interval as needed (in milliseconds)

    //     return () => clearInterval(interval);
    // }, []);
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //     const number = Math.floor(Math.random() * 90000000) + 10000000; // Generates a 8-digit number
    //     setRandomPostID(number);
    //     }, 1000); // Change interval as needed (in milliseconds)

    //     return () => clearInterval(interval);
    // }, []);
    // useEffect(() => {
    //     const fetchUserDataPost = () => {
    //         setIsLoading(true);
    //         axios.get(AGUserPostAPI)
    //         .then((response) => {
    //             const postSortData = response.data.sort((a, b) => b.id - a.id);
    //             const postData = postSortData.filter(post => post.user_id == LoginUserID);
    //             setViewFetchPost(postData);
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         })
    //         .finally(() => {
    //             setIsLoading(false); // Set loading to false after the fetch is complete
    //         });
    //     }
    //     fetchUserDataPost();
    //     fetchUserDataStory(setViewFetchStory);
    // }, [LoginUserID]);

    

    const [pickProfileImg00, setPickProfileImg00] = useState(null);
    const [editSocialsModal, setEditSocialsModal] = useState(false);
    const [addUserPost, setAddUserPost] = useState(false);
    const [addUserPost2, setAddUserPost2] = useState(false);
    const [addCoverImg, setAddCoverImg] = useState(false);
    const [addPostStory, setAddPostStory] = useState(false);
    const [viewProductCode, setViewProductCode] = useState(false);
    const [viewSendProducts, setViewSendProducts] = useState(null);
    const [viewFlipProducts, setViewFlipProducts] = useState(null);
    const [viewProductDetails, setViewProductDetails] = useState(null);
    const [viewProductTicket, setViewProductTicket] = useState(false);
    const [viewRedeemProduct, setViewRedeemProduct] = useState(false);


    const handleImageSelect = (image) => {
        setPickProfileImg00(image);
        setImageDP(null);
    };
    const handleOpenSocialSettings = () => {
        setEditSocialsModal(true)
    }
    const handleAddUserPost = () => {
        setAddUserPost(true)
    }
    const handleAddUserPost2 = () => {
        setAddUserPost2(true)
    }
    const handleAddCoverImg = () => {
        setAddCoverImg(true)
    }
    const handleAddUserStory = () => {
        setAddPostStory(true)
    }
    const handleViewProductCode = (productCode) => {
        setViewProductCode(true)
        const pCode = userProductCodeIDData.find(pCodeID => pCodeID.ag_product_id_code === productCode)
        setViewProductDetails(pCode)
    }
    const handleViewRedeemProducts = (productCode) => {
        setViewRedeemProduct(productCode);
        setViewSendProducts(false);
        setViewFlipProducts(false);
        setReceiverUserID('')
        setViewSendResponse('')
    }
    const handleViewSendProducts = (productCode) => {
        setViewSendProducts(productCode);
        setViewRedeemProduct(false);
        setViewFlipProducts(false);
        setReceiverUserID('')
        setViewSendResponse('')
    }
    const handleViewFlipProducts = (productCode) => {
        setViewFlipProducts(productCode);
        setViewRedeemProduct(false);
        setViewSendProducts(false);
        setReceiverUserID('')
        setViewSendResponse('')
    }
    const handleViewTicketProduct = (productCode) => {
        setViewProductTicket(true)
        setViewProductCode(false)
        const pCode = userProductCodeIDData.find(pCodeID => pCodeID.ag_product_id_code === productCode)
        setViewProductDetails(pCode)
    }
    const handleCloseAnyModals = (e) => {
        e.preventDefault();
        setEditSocialsModal(false);
        setAddCoverImg(false);
        setViewProductCode(false);
        setViewRedeemProduct(false);
        setViewSendProducts(null);
        setViewFlipProducts(null);
        setReceiverUserID('');
        setViewSendResponse('');
        setViewTransactionRecord(false)
        setViewTicketReportRecord(false)
    }
    
    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    const [imageDP, setImageDP] = useState(null);
    const [imageDPName, setImageDPName] = useState('');
    const handleUploadUserDP = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageDP(file);
            setImageDPName(file.name);
        }
    };
    const [imageCoverPhoto, setImageCoverPhoto] = useState(null);
    const [imageCoverPhotoName, setImageCoverPhotoName] = useState('')
    const handleUploadUserCoverPhoto = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageCoverPhoto(file);
            setImageCoverPhotoName(file.name);
        }
    };
    const handleRemoveUserImage = (e) => {
        e.preventDefault()
        setImage(null);
        setImageDP(null);
        setImageDPName('');
        setPickProfileImg00(null);
    };


    const [agEditFacebook, setAGEditFacebook] = useState('');
    const [agEditInstagram, setAGEditInstagram] = useState('');
    const [agEditTiktok, setAGEditTiktok] = useState('');
    const [agEditYoutube, setAGEditYoutube] = useState('');
    const [agEditTwitch, setAGEditTwitch] = useState('');
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const [agBioContent, setAGBioContent] = useState('');
    const [agEditBioContent, setAGEditBioContent] = useState(false);
    const bioMaxCharacters = 50;
    const AGUserDataUPDATEAPI = process.env.REACT_APP_AG_USERS_PROFILE_UPDATE_API;
    const AGUserCustomDPAPI = process.env.REACT_APP_AG_USERS_CUSTOM_DP_API;
    const AGUserCustomCPAPI = process.env.REACT_APP_AG_USERS_CUSTOM_CP_API;
    const AGUserCustomBioAPI = process.env.REACT_APP_AG_USERS_CUSTOM_BIO_API;
    const [isVisible, setIsVisible] = useState([]);


    const handleBioCharacters = (event) => {
        if (event.target.value.length <= bioMaxCharacters) {
            setAGBioContent(event.target.value);
        }
    };
    const handleViewEditBio = () => {
        setAGEditBioContent(true);
    }
    const renderProfileUser = () => {
        if (userLoggedData){
            if(userLoggedData.profileimg == ''){
                if(imageDPName == ''){
                    return (
                        `DefaultProfilePic.png`
                    );
                }else{
                    return (
                        `${userLoggedData.username}_${randomNumber}_${imageDPName}`
                    );
                }
            }else{
                if(imageDPName == ''){
                    return (
                        userLoggedData.profileimg
                    );
                }else{
                    return (
                        `${userLoggedData.username}_${randomNumber}_${imageDPName}`
                    );
                }
            }
        } else {
            return (
                pickProfileImg00
            );
        }
    };
    const renderProfileCoverUser = () => {
        if (userLoggedData.verified == 'Gold' || userLoggedData.verified == 'Blue'){
            if(userLoggedData.coverimg == ''){
                return (
                  `${userLoggedData.username}_${randomNumber}_${imageCoverPhotoName}`
                );
            }else{
                if(imageCoverPhotoName == ''){
                    return (
                        userLoggedData.coverimg
                    );
                }else{
                    return (
                        `${userLoggedData.username}_${randomNumber}_${imageCoverPhotoName}`
                    );
                }
            }
        } 
    };
    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        setIsEditSubmitting(true);
    
        const formEditProfileData = {
            id: userLoggedData.id,
            date: userLoggedData.date,
            email: userLoggedData.email,
            username: userLoggedData.username,
            profileimg: renderProfileUser(),
            coverimg: renderProfileCoverUser(),
            refcode: userLoggedData.refcode,
            facebook: agEditFacebook || userLoggedData.facebook,
            instagram: agEditInstagram || userLoggedData.instagram,
            tiktok: agEditTiktok || userLoggedData.tiktok,
            youtube: agEditYoutube || userLoggedData.youtube,
            twitch: agEditTwitch || userLoggedData.twitch,
            agelite: userLoggedData.agelite,
            cryptoaddress: userLoggedData.cryptoaddress,
            verified: userLoggedData.verified,
        };
    
        const formUserDPData = new FormData();
        formUserDPData.append('profileuser', userLoggedData.username);
        formUserDPData.append('profileimg', imageDP);
        formUserDPData.append('profileimgid', randomNumber);

        const formUserCPData = new FormData();
        formUserCPData.append('profileuser', userLoggedData.username);
        formUserCPData.append('profilecover', imageCoverPhoto);
        formUserCPData.append('profilecoverid', randomNumber);
    
        try {
            const [responseEditProfile, responseCustomDP] = await Promise.all([
                axios.post(AGUserDataUPDATEAPI, JSON.stringify(formEditProfileData)),
                axios.post(AGUserCustomDPAPI, formUserDPData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }),
                axios.post(AGUserCustomCPAPI, formUserCPData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
            ]);
            const resMessageEditProfile = responseEditProfile.data;
            const resMessageCustomDP = responseCustomDP.data;
            const resMessageCustomCP = responseCustomDP.data;
            if (resMessageEditProfile.success) {
                window.location.reload();
            }
            if (!resMessageCustomDP.success) {
                console.log(resMessageCustomDP.message);
            }
            if (!resMessageCustomCP.success) {
                console.log(resMessageCustomCP.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsEditSubmitting(false); // Stop loader
        }
    
        setTimeout(() => {
            window.location.reload();
        }, 200);
    };
    const handleEditProfileBio = async (e) => {
        e.preventDefault();

        const formBioContent = {
            userid: userLoggedData.userid,
            userbio: agBioContent,
        }

        const jsonUserBioData = JSON.stringify(formBioContent);
        axios.post(AGUserCustomBioAPI, jsonUserBioData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === false) {
            console.log(resMessage.message);
          }
          if (resMessage.success === true) {
            window.location.reload();
            setAGEditBioContent(false);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };
    const toggleVisibility = (i) => {
        setIsVisible(prev => {
            const updatedVisibility = [...prev]; // Create a copy of isVisible array
            updatedVisibility[i] = !updatedVisibility[i]; // Toggle the visibility at the clicked index
            return updatedVisibility;
        });
    };

    const [viewUserHighlight, setViewUserHighlight] = useState(true);
    const [viewUserProducts, setViewUserProducts] = useState(true);
    const [viewUserTickets, setViewUserTickets] = useState(false);
    const [viewUserTransactions, setViewUserTransactions] = useState(false);
    const [viewUserAddProducts, setViewUserAddProducts] = useState(false);
    const [viewUserRedeem, setViewUserRedeem] = useState(false);
    const [viewUserStore, setViewUserStore] = useState(false);
    const [viewTransactionRecord, setViewTransactionRecord] = useState(false);
    const [viewTransactionDetails, setViewTransactionDetails] = useState([]);
    const [viewTicketReportRecord, setViewTicketReportRecord] = useState(false);
    const [viewTicketMessageRecord, setViewTicketMessageRecord] = useState(false);
    const [viewTicketReportDetails, setViewTicketReportDetails] = useState([]);
    const [viewTicketMessagesDetails, setViewTicketMessagesDetails] = useState([]);
    const AGSendTixMessageAPI = process.env.REACT_APP_AG_USERS_TICKET_SEND_MESSAGE_API;




    // const handleViewDefault = () => {
    //     setViewUserHighlight(true)
    //     setViewUserProducts(false)
    // }
    const handleViewProducts = () => {
        setViewUserProducts(true)
        setViewUserHighlight(false)
        setViewUserStore(false)
        setViewUserAddProducts(false)
        setViewUserRedeem(false)
        setViewUserTickets(false)
        setViewUserTransactions(false)
    }
    const handleViewStore = () => {
        setViewUserTransactions(false)
        setViewUserProducts(false)
        setViewUserStore(true)
        setViewUserAddProducts(false)
        setViewUserRedeem(false)
        setViewUserTickets(false)
        setViewUserHighlight(false)
    }
    const handleViewAddProduct = () => {
        setViewUserTransactions(false)
        setViewUserProducts(false)
        setViewUserStore(false)
        setViewUserAddProducts(true)
        setViewUserRedeem(false)
        setViewUserTickets(false)
        setViewUserHighlight(false)
    }
    const handleViewRedeem = () => {
        setViewUserTransactions(false)
        setViewUserProducts(false)
        setViewUserStore(false)
        setViewUserAddProducts(false)
        setViewUserRedeem(true)
        setViewUserTickets(false)
        setViewUserHighlight(false)
    }
    const handleViewTickets = () => {
        setViewUserTransactions(false)
        setViewUserProducts(false)
        setViewUserStore(false)
        setViewUserAddProducts(false)
        setViewUserRedeem(false)
        setViewUserTickets(true)
        setViewUserHighlight(false)
        setViewTransactionRecord(false)
        setViewTicketReportRecord(false)
        setViewTicketMessageRecord(false)
        fetchUserTicketReport();
        fetchUserTicketMessages();
    }
    const handleViewTransactions = () => {
        setViewUserTransactions(true)
        setViewUserProducts(false)
        setViewUserStore(false)
        setViewUserAddProducts(false)
        setViewUserRedeem(false)
        setViewUserTickets(false)
        setViewUserHighlight(false)
        setViewTransactionRecord(false)
        setViewTicketReportRecord(false)
        setViewTicketMessageRecord(false)
    }

    if(viewProductCode == true || viewProductTicket == true){
        window.document.body.style.overflow = 'hidden';
    } else{
        window.document.body.style.overflow = 'auto';
    }

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

    
    const [resellLoader, setResellLoader] = useState(false);
    const handleFlipProduct = async (productCode) => {
        const pCode = userProductCodeIDData.find(pCodeID => pCodeID.ag_product_id_code === productCode)
        setResellLoader(true)

        if (pCode.ag_product_type === 'Games'){
            const agSetGameTitle = pCode.productData.game_title;
            const agSetGameEdition = pCode.productData.game_edition;
            const agSetGamePlatform = pCode.productData.game_platform;
            const agSetGameCode1 = agSetGameTitle.replace(/\s/g, '');
            const agSetGameCode2 = agSetGamePlatform.replace(/\s/g, '');
            const agSetGameCode3 = agSetGameEdition.replace(/\s/g, '');
            
            const formFlipGameDetails = {
                agGameCode: `${userLoggedData.storesymbol}_${agSetGameCode1}_${agSetGameCode2}`,
                agGameCover: pCode.productData.game_cover,
                agGameTitle: pCode.productData.game_title,
                agGameCanonical: `${agSetGameCode1}${agSetGameCode2}_${agSetGameCode3}_${userLoggedData.storesymbol}`,
                agGameEdition: pCode.productData.game_edition,
                agGameCountry: pCode.productData.game_country,
                agGameDeveloper: pCode.productData.game_developer,
                agGameRelease: pCode.productData.game_released,
                agGameCategory: pCode.productData.game_category,
                agGamePlatform: pCode.productData.game_platform,
                agGameTrailer: pCode.productData.game_trailer,
                agGameSeller: userLoggedData.store,
                agGameHighlight1: '',
                agGameSupplier: '',
                agGameAvailable: '',
                agGameRestricted: '',
            };
            const formFlipGameCodeDetails = {
                agProductID: `${agSetGameCode1}${agSetGameCode2}_${agSetGameCode3}_${userLoggedData.storesymbol}`,
                agProductName: pCode.productCode.ag_product_name,
                agProductPrice: gamePrice,
                agProductDiscount: '',
                agProductType: pCode.ag_product_type,
                agProductIDCode: pCode.ag_product_id_code,
                agProductState: 'Available',
                agProductStatus: 'Unredeemed',
                agProductSeller: userLoggedData.userid,
                agProductOwner: 'None',
                agProductCode: pCode.productCode.ag_product_code,
                agProductTHash: `AG_${postIDGenerator(18)}`,
                agProductTDate: new Date(),
                agProductQuantity: 1,
                agProductCommand: 'Resell'
            }
            try {
                const addGameResponse = await axios.post(AGAddGamesAPI, formFlipGameDetails);
                const responseMessage = addGameResponse.data;

                const flipProductResponse = await axios.post(AGFlipProductsAPI, formFlipGameCodeDetails);
                const flipResponseMessage = flipProductResponse.data;
        
                if (responseMessage.success && flipResponseMessage.success) {
                    fetchUserProductIds();
                    fetchUserTransactionHistory();
                }
        
            } catch (error) {
                console.error(error);
            } finally {
                fetchUserProductIds();
                fetchUserTransactionHistory();
            }
            
        }

        if (pCode.ag_product_type === 'Giftcards'){
            const agSetGiftCardTitle = pCode.productData.giftcard_name;
            const agSetGiftCardCode1 = agSetGiftCardTitle.replace(/\s/g, '');

            const formFlipGiftcardDetails = {
                agGiftcardCode: `${userLoggedData.storesymbol}_${agSetGiftCardCode1}_${pCode.productData.giftcard_denomination}`,
                agGiftcardCover: pCode.productData.giftcard_cover,
                agGiftcardTitle: pCode.productData.giftcard_name,
                agGiftcardCanonical : pCode.productData.giftcard_canonical,
                agGiftcardDenomination: pCode.productData.giftcard_denomination,
                agGiftcardSupplier: pCode.productData.giftcard_seller,
                agGiftcardSeller: userLoggedData.store,
                agGiftcardCategory: pCode.productData.giftcard_category,
                agGiftcardDescription: pCode.productData.giftcard_description,
            };
            const formFlipGiftcardCodeDetails = {
                agProductID: `${userLoggedData.storesymbol}_${agSetGiftCardCode1}_${pCode.productData.giftcard_denomination}`,
                agProductName: pCode.productCode.ag_product_name,
                agProductPrice: pCode.ag_product_price,
                agProductDiscount: '',
                agProductType: pCode.ag_product_type,
                agProductIDCode: pCode.ag_product_id_code,
                agProductState: 'Available',
                agProductStatus: 'Unredeemed',
                agProductSeller: userLoggedData.userid,
                agProductOwner: 'None',
                agProductCode: pCode.productCode.ag_product_code,
                agProductTHash: `AG_${postIDGenerator(18)}`,
                agProductTDate: new Date(),
                agProductQuantity: 1,
                agProductCommand: 'Resell'
            }
            try {
                const addGiftcardResponse = await axios.post(AGAddGiftcardsAPI, formFlipGiftcardDetails);
                const responseMessage = addGiftcardResponse.data;

                const flipProductResponse = await axios.post(AGFlipProductsAPI, formFlipGiftcardCodeDetails);
                const flipResponseMessage = flipProductResponse.data;
        
                if (responseMessage.success && flipResponseMessage.success) {
                    fetchUserProductIds();
                    fetchUserTransactionHistory();
                }
        
            } catch (error) {
                console.error(error);
            } finally {
                fetchUserProductIds();
                fetchUserTransactionHistory();
            }


        }

        if (pCode.ag_product_type === 'Game Credits'){
            const agSetGameCreditTitle = pCode.productData.gamecredit_name;
            const agSetGameCreditCode1 = agSetGameCreditTitle.replace(/\s/g, '');

            const formAddGamecreditsDetails = {
                agGamecreditCode: `${userLoggedData.storesymbol}_${agSetGameCreditCode1}GameCredit_${gamecreditPrice}`,
                agGamecreditCover: pCode.productData.gamecredit_cover,
                agGamecreditTitle: pCode.productData.gamecredit_name,
                agGamecreditNumber : pCode.productData.gamecredit_number,
                agGamecreditType: pCode.productData.gamecredit_type,
                agGamecreditCanonical : pCode.productData.gamecredit_canonical,
                agGamecreditDenomination: gamecreditPrice,
                agGamecreditSupplier: pCode.productData.gamecredit_seller,
                agGamecreditSeller: userLoggedData.store,
                agGamecreditCategory: pCode.productData.gamecredit_category,
                agGamecreditDescription: pCode.productData.gamecredit_description,
            };
            const formFlipGamecreditCodeDetails = {
                agProductID: `${userLoggedData.storesymbol}_${agSetGameCreditCode1}GameCredit_${gamecreditPrice}`,
                agProductName: pCode.productCode.ag_product_name,
                agProductPrice: pCode.ag_product_price,
                agProductDiscount: '',
                agProductType: pCode.ag_product_type,
                agProductIDCode: pCode.ag_product_id_code,
                agProductState: 'Available',
                agProductStatus: 'Unredeemed',
                agProductSeller: userLoggedData.userid,
                agProductOwner: 'None',
                agProductCode: pCode.productCode.ag_product_code,
                agProductTHash: `AG_${postIDGenerator(18)}`,
                agProductTDate: new Date(),
                agProductQuantity: 1,
                agProductCommand: 'Resell'
            }
            try {
                const addGamecreditResponse = await axios.post(AGAddGameCreditsAPI, formAddGamecreditsDetails);
                const responseMessage = addGamecreditResponse.data;

                const flipProductResponse = await axios.post(AGFlipProductsAPI, formFlipGamecreditCodeDetails);
                const flipResponseMessage = flipProductResponse.data;
        
                if (responseMessage.success && flipResponseMessage.success) {
                    fetchUserProductIds();
                    fetchUserTransactionHistory();
                }
        
            } catch (error) {
                console.error(error);
            } finally {
                fetchUserProductIds();
                fetchUserTransactionHistory();
            }
        }
    
    };

    const [viewSendResponse, setViewSendResponse] = useState('');
    const [sendingLoader, setSendingLoader] = useState(false);
    const handleSendProduct = async (productCode) => {
        const pCode = userProductCodeIDData.find(pCodeID => pCodeID.ag_product_id_code === productCode)
        setSendingLoader(true)
        
        const formSendProductDetails = {
            agProductID: pCode.ag_product_id,
            agProductRececiver: receiverUserID,
            agProductCode: pCode.ag_product_id_code,
        }
        const formSendProductTransaction = {
            agProductID: pCode.ag_product_id,
            agProductName: pCode.productData.game_title || pCode.productData.giftcard_name || pCode.productData.gamecredit_name,
            agProductReceiver: receiverUserID,
            agProductSender: userLoggedData.userid,
            agProductCode: pCode.ag_product_id_code,
            agProductTHash: `AG_${postIDGenerator(18)}`,
            agProductTDate: new Date(),
            agProductQuantity: 1,
            agProductPrice: pCode.ag_product_price,
            agProductCommand: 'Transfer'
        }
        

        try {
            const sendProductResponse = await axios.post(AGSendProductsAPI, formSendProductDetails);
            const responseMessage = sendProductResponse.data;

            const sendTransactionResponse = await axios.post(AGSendingTrasactionsAPI, formSendProductTransaction);
            const trasactionResponseMessage = sendTransactionResponse.data;
    
            if (responseMessage.success && trasactionResponseMessage.success) {
                fetchUserProductIds();
                fetchUserTransactionHistory();
            } else {
                setReceiverUserID('')
                setSendingLoader(false)
                setViewSendResponse(responseMessage.message)
            }
    
        } catch (error) {
            console.error(error);
        } finally {
            fetchUserProductIds();
            fetchUserTransactionHistory();
        }
    }

    
    const [redeemingLoader, setRedeemingLoader] = useState(false);
    const handleRedeemProduct = async (productCode) => {
        const pCode = userProductCodeIDData.find(pCodeID => pCodeID.ag_product_id_code === productCode)
        setRedeemingLoader(true);
        

        const formRedeemProductDetails = {
            agProductCode: pCode.ag_product_id_code,
            agProductState: 'Sold',
            agProductStatus: 'Redeemed',
            agProductOwner: userLoggedData.userid,
            agProductID: pCode.ag_product_id,
            agProductName: pCode.productData.game_title || pCode.productData.giftcard_name || pCode.productData.gamecredit_name,
            agProductTHash: `AG_${postIDGenerator(18)}`,
            agProductTDate: new Date(),
            agProductQuantity: 1,
            agProductPrice: pCode.ag_product_price,
            agProductCommand: 'Redeem'
        }

        // const test = JSON.stringify(formRedeemProductDetails)
        // console.log(test);
        

        try {
            const redeemProductResponse = await axios.post(AGRedeemProductsAPI, formRedeemProductDetails);
            const responseMessage = redeemProductResponse.data;
    
            if (responseMessage.success) {
                console.log(responseMessage.message);
                fetchUserProductIds();
                fetchUserTransactionHistory();
            }
    
        } catch (error) {
            console.error(error);
        } finally {
            fetchUserProductIds();
            fetchUserTransactionHistory();
        }
    }
    
    const [tixSellerResponse, setTixSellerResponse] = useState(false);
    const [userTixMessage, setUserTixMessage] = useState('');
    const [userTixSentMsg, setUserTixSentMsg] = useState('');


    const userTicketFilter = viewTicketReport.filter(user => user.user_id === userLoggedData.userid)
    const TicketReportSort = userTicketFilter.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
  
        return dateA - dateB - dateA;
    });
    const handleTixSellerResponse = () => {
        setTixSellerResponse(true)
    }
    const handleViewTicketDetails = (hashCode) => {
        setViewTicketReportRecord(true)
        const transactionDetails = viewTicketReport.find(tHash => tHash.ticket_id === hashCode)
        setViewTicketReportDetails(transactionDetails)
    }
    const handleViewTicketMessage = (hashCode) => {
        setViewTicketMessageRecord(true)
        const transactionDetails = viewTicketReport.find(tHash => tHash.ticket_id === hashCode)
        const ticketMessages = viewTicketMessages.filter(tHash => tHash.ticket_id === hashCode)
        
        setViewTicketReportDetails(transactionDetails)
        setViewTicketMessagesDetails(ticketMessages)
    }
    useEffect(() => {
        if (viewTicketMessageRecord && viewTicketReportDetails) {
            // Update ticket messages whenever viewTicketMessages updates
            const updatedMessages = viewTicketMessages.filter(tHash => tHash.ticket_id === viewTicketReportDetails.ticket_id);
            setViewTicketMessagesDetails(updatedMessages);
        }
    }, [viewTicketMessages, viewTicketMessageRecord, viewTicketReportDetails]);
    const handleSendSellerMessage = async (e) => {
        e.preventDefault();
    
        const formSendSellerMessage = {
            userTixID: viewTicketReportDetails.ticket_id,
            userTixUserid: userLoggedData.userid,
            userTixUserMgs: userTixMessage,
            userTixUserDate: new Date(),
            userTixSellerid: '',
            userTixSellerMgs: '',
            userTixSellerDate: '',
        };
        
        try {
            const sellerTixResponse = await axios.post(AGSendTixMessageAPI, formSendSellerMessage);
            const responseMessage = sellerTixResponse.data;
    
            if (responseMessage.success) {
                setUserTixMessage('');
                fetchUserTicketMessages();
            } else {
                setUserTixMessage('');
            }
    
        } catch (error) {
            console.error(error);
        }
    };
    const handleViewTransactionDetails = (hashCode) => {
        setViewTransactionRecord(true);
        const transactionDetails = viewTransactionList.find(tHash => tHash.ag_transaction_hash === hashCode);
        setViewTransactionDetails(transactionDetails);
    }
    const handleCloseTransactionDetails = () => {
        setViewTransactionRecord(false);
        setViewTicketReportRecord(false);
        setViewTicketMessageRecord(false);
        setTixSellerResponse(false);
        setUserTixSentMsg('');
    }
    





    

    return (
        <div className='mainContainer profile'>
            {editSocialsModal && <div className="modalContainerProfile settings">
                <div className="modalContentProfile" 
                    style={userLoggedData.coverimg ? {background: `linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/${userLoggedData.coverimg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <button id='closeModalSettings' onClick={handleCloseAnyModals} type='button'><FaTimes className='faIcons'/></button>
                    <form id='userEditSocialsContainer' onSubmit={handleEditProfileSubmit}>
                        <div className="mdcpSettingsContainer">
                            <div className="mdcpsContent left">
                                <div className='mdcpscProfileDP'>
                                    {!imageDP ? (<>
                                        <img 
                                            src={!pickProfileImg00 ? `https://2wave.io/ProfilePics/${userLoggedData.profileimg}`:`https://2wave.io/ProfilePics/${pickProfileImg00  || 'DefaultProfilePic.png'}`} 
                                            alt="" 
                                        />
                                        <input type="file" onChange={handleUploadUserDP} />
                                        <button onClick={handleRemoveUserImage}><FaTimes className='faIcons' /></button>
                                    </>) : (<>
                                        <img src={URL.createObjectURL(imageDP)} alt="No image Selected" />
                                        <button onClick={handleRemoveUserImage}><FaTimes className='faIcons' /></button>
                                    </>
                                    )}
                                </div>
                                <div className='mdcpscSampleProfile web'>
                                    {defaultImages.map((image, index) => (
                                    <img
                                        key={index}
                                        onClick={() => handleImageSelect(image)}
                                        src={require(`../assets/imgs/ProfilePics/${image}`)}
                                        alt={`Default ${index}`}
                                    />
                                    ))}
                                </div>
                                <div className='mdcpscSampleProfile mob'>
                                    {defaultImages.slice(2, 10).map((image, index) => (
                                    <img
                                        key={index}
                                        onClick={() => handleImageSelect(image)}
                                        src={require(`../assets/imgs/ProfilePics/${image}`)}
                                        alt={`Default ${index}`}
                                    />
                                    ))}
                                    <div className="mdcpscSPInput">
                                        <input type="file" onChange={handleUploadUserDP} />
                                        <span>
                                            <h5><TbUpload className='faIcons' /></h5>
                                            <p>Upload</p>
                                        </span>
                                    </div>
                                </div>
                                <div className='mdcpscCustomProfile'>
                                    <p><TbUpload className='faIcons' />Upload from Computer</p>
                                    <input type="file" onChange={handleUploadUserDP} />
                                </div>
                            </div>
                            <div className="mdcpsContent right">
                                <h4>{userLoggedData.username} 
                                    {userLoggedData.verified ? <>
                                        {userLoggedData.verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                        {userLoggedData.verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                    </>:<></>}
                                </h4>
                                <p>{userLoggedData.email}</p>
                                <div className="mdcpccrSocials">
                                    <h6>EDIT PROFILE</h6>
                                    <div>
                                        <span>
                                            <label><p><FaSquareFacebook className='faIcons'/> Facebook</p></label>
                                            <input name='agEditProfileFB' type="text" placeholder={userLoggedData.facebook ? userLoggedData.facebook : 'Facebook Profile Link'} onChange={(e) => setAGEditFacebook(e.target.value)}/>
                                        </span>
                                        <span>
                                            <label><p><FaInstagram className='faIcons'/> Instagram</p></label>
                                            <input name='agEditProfileIG' type="text" placeholder={userLoggedData.instagram ? userLoggedData.instagram : 'Instagram Profile Link'} onChange={(e) => setAGEditInstagram(e.target.value)}/>
                                        </span>
                                        <span>
                                            <label><p><FaTiktok className='faIcons'/> TikTok</p></label>
                                            <input name='agEditProfileTT' type="text" placeholder={userLoggedData.tiktok ? userLoggedData.tiktok : 'TikTok Profile Link'} onChange={(e) => setAGEditTiktok(e.target.value)}/>
                                        </span>
                                        <span>
                                            <label><p><FaYoutube className='faIcons'/> YouTube</p></label>
                                            <input name='agEditProfileYT' type="text" placeholder={userLoggedData.youtube ? userLoggedData.youtube : 'YouTube Channel Link'} onChange={(e) => setAGEditYoutube(e.target.value)}/>
                                        </span>
                                        <span>
                                            <label><p><FaTwitch className='faIcons'/> Twitch</p></label>
                                            <input name='agEditProfileTC' type="text" placeholder={userLoggedData.twitch ? userLoggedData.twitch : 'Twitch Channel Link'} onChange={(e) => setAGEditTwitch(e.target.value)}/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mdcpccrSubmit">
                            {!userLoggedData.verified ? 
                                <button id='mdcpccrsVerified'>APPLY SUBSCRIPTION <RiSparklingFill className='faIcons'/></button>
                                :<></>}
                            {!isEditSubmitting ? 
                            <button id='mdcpccrsSubmit' type='submit'>Update Profile</button>
                            :<button id='mdcpccrsSubmit' type='button'>Loading Update...</button>}
                        </div>
                    </form>
                </div>
            </div>}
            {addCoverImg && <div className="modalContainerProfile coverImg">
                <div className="modalContentCover"
                    style={userLoggedData.coverimg ? {background: `linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/${userLoggedData.coverimg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <button id='closeModalCover' onClick={handleCloseAnyModals} type='button'><FaTimes className='faIcons'/></button>
                    <form id='userCoverImageContainer' onSubmit={handleEditProfileSubmit}>
                        <div className="mdcpCoverContainer">
                            {imageCoverPhoto ? 
                                <img src={URL.createObjectURL(imageCoverPhoto)} alt="No image Selected" /> :
                                <h6>Change Cover Photo</h6>
                            }
                            <input type="file" onChange={handleUploadUserCoverPhoto}/>
                            {(imageCoverPhoto) ? <> 
                            {!isEditSubmitting ?
                            <button type='submit'>UPDATE COVER</button> 
                            :<button type='button'>UPLOADING...</button>}</>:<>
                            <button id='emptyCover' type='button'>INSERT COVER</button> 
                            </>}
                        </div>
                    </form>
                </div>
            </div>}
            {viewProductCode && <div className="modalContainerProfile viewProduct" onClick={handleCloseAnyModals}>
                <div className="modalContentProduct" style={userLoggedData.coverimg ? {background: `linear-gradient(transparent, black 75%), url(https://2wave.io/CoverPics/${userLoggedData.coverimg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 75%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <div className="mdcProductContainer">
                        <div className="mdcpcContent">
                            <div className="mdcpccImg">
                                {(viewProductDetails.ag_product_type === 'Games') && <img src={`https://2wave.io/GameCovers/${viewProductDetails.productData.game_cover}`} alt="" />}
                                {(viewProductDetails.ag_product_type === 'Giftcards') && <img src={`https://2wave.io/GiftCardCovers/${viewProductDetails.productData.giftcard_cover}`} alt="" />}
                                {(viewProductDetails.ag_product_type === 'Game Credits') && <img src={`https://2wave.io/GameCreditCovers/${viewProductDetails.productData.gamecredit_cover}`} alt="" />}
                                <button onClick={() => handleViewTicketProduct(viewProductDetails.ag_product_id_code)}><FaTicket /></button>
                            </div>
                            <div className="mdcpccStatus">
                                <p>REDEEMED</p>
                            </div>
                            <div className="mdcpccPlatform">
                                {(viewProductDetails.ag_product_type === 'Games') && <img src="" platform={viewProductDetails.productData.game_platform} alt="" />}
                                {(viewProductDetails.ag_product_type === 'Giftcards') &&
                                    <div>
                                        <h4>{viewProductDetails.productData.giftcard_denomination}</h4>
                                        <p>DOLLARS</p>
                                    </div>
                                }
                                {(viewProductDetails.ag_product_type === 'Game Credits') &&
                                    <div>
                                        <h4>{viewProductDetails.productData.gamecredit_denomination}</h4>
                                        <p>DOLLARS</p>
                                    </div>
                                }
                            </div>
                            <div className="mdcpccTitle">
                                <h6>
                                    {viewProductDetails.productCode.ag_product_name}<br />
                                    <span>
                                        {viewProductDetails.productData.game_edition}
                                        {viewProductDetails.productData.giftcard_category}
                                        {viewProductDetails.productData.gamecredit_number} {viewProductDetails.productData.gamecredit_type}
                                    </span>
                                </h6>
                            </div>
                            <div className="mdcpccCodes">
                                <p>{viewProductDetails.productCode.ag_product_code}</p>
                            </div>
                            <div className="mdcpccNoResale">
                                <p>Disclaimer: This Digital Code cannot be Resell</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {viewProductTicket && <div className="tcktsndContainer">
                <TicketForm 
                    ticketform = {setViewProductTicket} 
                    agGameDataCover = { viewProductDetails.productData.game_cover || viewProductDetails.productData.giftcard_cover || viewProductDetails.productData.gamecredit_cover } 
                    agGameDataName = { viewProductDetails.productCode.ag_product_name } 
                    agGameDataSeller = { viewProductDetails.productData.game_seller || viewProductDetails.productData.giftcard_seller || viewProductDetails.productData.gamecredit_seller }
                    agGameDataEdition = { viewProductDetails.productData.game_edition || viewProductDetails.productData.giftcard_category || viewProductDetails.productData.gamecredit_type } 
                    agGameCreditNumber = { viewProductDetails.productData.gamecredit_number }
                    agProductType = { viewProductDetails.ag_product_type }
                    gameCanonical = { viewProductDetails.productCode.ag_product_id }
                />
            </div>}
            
            {addPostStory && <UserStoryModal setAddPostStory={setAddPostStory}/>}
            {addUserPost && <UserPostModal setAddUserPost={setAddUserPost}/>}
            {addUserPost2 && <UserPostModal2 setAddUserPost2={setAddUserPost2}/>}

            <section className="profilePageContainer top">
                {userLoggedData.coverimg ? 
                <img src={`https://2wave.io/CoverPics/${userLoggedData.coverimg}`}/>
                :<img src={require('../assets/imgs/LoginBackground.jpg')} alt="" />}
                <div className='ppctShadow'></div>
                {userLoggedData.verified && <div className='ppctEditCoverImg'>
                    <div className="ppctecimg">
                        <button id='ppctecimgBtnWeb' onClick={handleAddCoverImg}>Change Cover Photo</button>
                        <button id='ppctecimgBtnMob' onClick={handleAddCoverImg}><RiImageEditLine className='faIcons' /></button>
                        <button id='ppcteprofileBtn' onClick={handleOpenSocialSettings}><RiUserSettingsLine className='faIcons'/></button>
                    </div>
                </div>}
            </section>
            <section className="profilePageContainer mid">
                <div className="profilePageContent left">
                    <div className='ppclProfilePic'>
                        {userLoggedData.profileimg ? 
                        <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt="" onClick={handleOpenSocialSettings}/>
                        :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt="" onClick={handleOpenSocialSettings}/>}
                    </div>
                    <div className="ppclProfileName">
                        <h5>
                            {userLoggedData.username} 
                            {userLoggedData.verified ? <>
                                {userLoggedData.verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                {userLoggedData.verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                            </>:<></>}
                        </h5>
                        <p>{userLoggedData.email}</p>
                    </div>
                    <div className="ppclProfileBio">
                        {!agEditBioContent ? <>
                            <button onClick={handleViewEditBio}><FaEdit className='faIcons'/></button>
                            {userLoggedData.bio ?
                            <p>{userLoggedData.bio}</p>:
                            <p>No Bio Added</p>}
                        </>:<>
                            <button onClick={handleEditProfileBio}><FaCircleCheck className='faIcons'/></button>
                            <textarea name="" id="" value={agBioContent} maxLength={50} onChange={handleBioCharacters} placeholder='Type Short Bio Here'></textarea>
                            <span>{agBioContent.length}/{bioMaxCharacters}</span>
                        </>}
                    </div>
                    <div className="ppclProfileSocials">
                        {userLoggedData.facebook ? <a href={userLoggedData.facebook} target='blank'><h6><FaSquareFacebook className='faIcons'/></h6></a> : <></>}
                        {userLoggedData.instagram ? <a href={userLoggedData.instagram} target='blank'><h6><FaInstagram className='faIcons'/></h6></a> : <></>}
                        {userLoggedData.tiktok ? <a href={userLoggedData.tiktok} target='blank'><h6><FaTiktok className='faIcons'/></h6></a> : <></>}
                        {userLoggedData.youtube ? <a href={userLoggedData.youtube} target='blank'><h6><FaYoutube className='faIcons'/></h6></a> : <></>}
                        {userLoggedData.twitch ? <a href={userLoggedData.twitch} target='blank'><h6><FaTwitch className='faIcons'/></h6></a> : <></>}
                        {/* <div>
                            <button onClick={handleOpenSocialSettings}>Edit Profile <TbSettingsBolt className='faIcons'/></button>
                        </div> */}
                    </div>
                    <div className="ppclProfileDetails">
                        <span>
                            <p>My User ID</p>
                            <p>{userLoggedData.userid}</p>
                        </span>
                        <span>
                            <p>AG Points</p>
                            <p id='agPoints'>0 <FaBolt className='faIcons'/></p>
                        </span>
                        <span>
                            <p>AG Gems</p>
                            <p id='agGems'>0 <FaGem className='faIcons'/></p>
                        </span>
                        <span>
                            <p>AG Balance</p>
                            <p id='agGems'>0 <FaCoins  className='faIcons'/></p>
                        </span>
                    </div>
                    <div className="ppclProfileExtra">
                        {(storedSellerState && userLoggedIn) ? 
                            <Link to='/SellerPanel'><TbCubePlus className='faIcons'/>Add a Product</Link>:
                            <Link to='/ClaimACode'><TbTicket className='faIcons'/>Claim a Code</Link>
                        }
                        <span>
                            <p id='agPoints'>0 <FaBolt className='faIcons'/></p>
                        </span>
                        <span>
                            <p id='agGems'>0 <FaGem className='faIcons'/></p>
                        </span>
                        <span>
                            <p id='agGems'>0 <FaCoins  className='faIcons'/></p>
                        </span>
                    </div>
                </div>
                <div className="profilePageContent right">
                    <div className="ppcrProfileNavigations">
                        {/* <button className={viewUserHighlight ? 'active' : ''} onClick={handleViewDefault}><h6>HIGHLIGHTS</h6></button> */}
                        <button className={viewUserProducts ? 'active' : ''} onClick={handleViewProducts}><h6>MY PRODUCTS</h6></button>
                        {/* <button className={viewUserRedeem ? 'active' : ''} onClick={handleViewRedeem}><h6>REDEEM</h6></button> */}
                        <button className={viewUserTickets ? 'active' : ''} onClick={handleViewTickets}><h6>TICKETS</h6></button>
                        <button className={viewUserTransactions ? 'active' : ''} onClick={handleViewTransactions}><h6>TRANSACTION HISTORY</h6></button>
                        {/* <button><h6>MISSIONS</h6></button>
                        <button><h6>FEEDBACKS</h6></button> */}
                    </div>
                    {/* {viewUserHighlight &&<div className="ppcrProfileContents highlights">
                        <div className="ppcrpchPosting">
                            <div className="ppcrpchpWhat">
                                {userLoggedData.profileimg ? 
                                <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt=""/>
                                :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                <input id='dummyFormWhatToPost' type="text" placeholder='Post about a Gameplay...' onClick={handleAddUserPost} readOnly/>
                                <button id='postAStory' onClick={handleAddUserPost2}><IoIosImages className='faIcons'/></button>
                            </div>
                            <div className="ppcrpchpStories">
                                <div className='postAStory' onClick={handleAddUserStory}>
                                    {userLoggedData.profileimg ? 
                                    <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt=""/>
                                    :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                    <span>
                                        <h5><IoMdAddCircle className='faIcons'/></h5>
                                        <p>Add Story</p>
                                    </span>
                                </div>
                                <div className='viewAStory'>
                                    <div className="storiesContents">
                                        {viewFetchStory.slice(0, 3).map((story, i) => (
                                            <div key={i}>
                                                <span>
                                                    {story.userData.profileimg ?
                                                    <img src={`https://2wave.io/ProfilePics/${story.userData.profileimg}`} alt="" />:
                                                    <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                                </span>
                                                <img src={`https://2wave.io/AGMediaStory/${story.user_story_image}`} alt="" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <hr /><br />
                            <div className="ppcrpchpMyPosts">
                                {isLoading ? <>
                                    <div className='ppcrpchpNoPost'>
                                        <div className="loader"></div>
                                    </div>
                                </>:<>
                                    {viewFetchPost.length != 0 ? <>
                                        {viewFetchPost.map((post, i) => (
                                            <div className='ppcrpchpPost' key={i}>
                                                <div className='ppcrpchpUser'>
                                                    {userLoggedData.profileimg ? 
                                                    <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt=""/>
                                                    :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                                    <span>
                                                        <h6>
                                                            {userLoggedData.username} 
                                                            {userLoggedData.verified ? <>
                                                                {userLoggedData.verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                                                {userLoggedData.verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                                            </>:<></>}
                                                        </h6>
                                                        <p>{formatDate(post.user_post_date)}</p>
                                                    </span>
                                                </div>
                                                <div className="ppcrpchpupWords">
                                                    <HashtagHighlighter text={post.user_post_text}/>
                                                </div>
                                                {post.user_post_image ? <div className="ppcrpchpuPosting">
                                                    <img id='ppcrpchpuPostingBG' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                                                    <img id='ppcrpchpuPostingImg' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                                                </div>:<></>}
                                                {post.user_post_youtube ? <div className="ppcrpchpuPosting youtube">
                                                    <YouTubeEmbed videoUrl={post.user_post_youtube} />
                                                </div>:<></>}
                                            </div>
                                        ))}
                                    </>:<>
                                    <div className='ppcrpchpNoPost'>
                                        <h6>No Highlights Available...</h6>
                                    </div></>}
                                </>}
                            </div>
                        </div>
                    </div>} */}
                    {viewUserProducts &&<div className="ppcrProfileContents myProducts">
                        {isLoading ?<>
                            <div className="ppcrpcmpEmpty">
                                <div className="loader"></div>
                            </div>
                        </>:<>{(userProductCodeIDData.length != 0) ?<>
                                <h3>PURCHASED PRODUCTS</h3>
                                <div className="ppcrpcmpProducts">
                                    {userProductCodeIDData.map((details, i) => (
                                        <div className="ppcrpcmppContents" key={i}>
                                            <div className="ppcrpcmppcImage">
                                                {details.productData.game_cover && <img src={`https://2wave.io/GameCovers/${details.productData.game_cover}`} alt="" />}
                                                {details.productData.giftcard_cover && <img src={`https://2wave.io/GiftCardCovers/${details.productData.giftcard_cover}`} alt="" />}
                                                {details.productData.gamecredit_cover && <img src={`https://2wave.io/GameCreditCovers/${details.productData.gamecredit_cover}`} alt="" />}
                                            </div>
                                            <div className="ppcrpcmppcPlatform">
                                                {details.productData.game_platform && 
                                                <img src="" platform={details.productData.game_platform} alt="" />}
                                                {details.productData.giftcard_denomination &&
                                                <div>
                                                    <h4>{details.productData.giftcard_denomination}</h4>
                                                    <p>DOLLARS</p>
                                                </div>}
                                                {details.productData.gamecredit_denomination &&
                                                <div>
                                                    <h4>{details.productData.gamecredit_denomination}</h4>
                                                    <p>DOLLARS</p>
                                                </div>}
                                            </div>
                                            <div className="ppcrpcmppcCode">
                                                <div className='ppcrpcmppccName'>
                                                    <h6>
                                                        {details.productCode.ag_product_name} <br /> 
                                                        <span>
                                                            {details.productData.game_edition}
                                                            {details.productData.giftcard_category}
                                                            {details.productData.gamecredit_number} {details.productData.gamecredit_type}
                                                        </span>
                                                    </h6>
                                                </div>
                                                {(details.ag_product_status === "Redeemed") ? 
                                                    <div className="ppcrpcmppccRedeemed">
                                                        <button onClick={() => handleViewProductCode(details.ag_product_id_code)}>View Product</button>
                                                    </div>:
                                                    <>
                                                    {storedSellerState ? 
                                                        <div className="ppcrpcmppccBtns hybrid">
                                                            <button onClick={() => handleViewRedeemProducts(details.ag_product_id_code)}>Redeem</button>
                                                            <button onClick={() => handleViewSendProducts(details.ag_product_id_code)}>Send</button>
                                                            <button onClick={() => handleViewFlipProducts(details.ag_product_id_code)}>Flip</button>
                                                        </div>:
                                                        <div className="ppcrpcmppccBtns customer">
                                                            <button onClick={() => handleViewRedeemProducts(details.ag_product_id_code)}>Redeem</button>
                                                            <button onClick={() => handleViewSendProducts(details.ag_product_id_code)}>Send</button>
                                                        </div>
                                                    }
                                                    </>
                                                }
                                            </div>
                                            {(viewRedeemProduct === details.ag_product_id_code) && <>
                                                {(details.ag_product_status === "Unredeemed") && <div className="ppcrpcmppcRedeem">
                                                    <button id='ppcrpcmppcrClose' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                                                    <div className="ppcrpcmppcrContent">
                                                        <p>
                                                            <span>Redeem</span><br />
                                                            {details.productCode.ag_product_name} ?
                                                        </p>
                                                        { !redeemingLoader ?
                                                            <button onClick={() => handleRedeemProduct(details.ag_product_id_code)}>Redeem Code</button>:
                                                            <button>Redeeming...</button>
                                                        }
                                                        <span>
                                                            <p>Once redeemed, Product cannot be sold to AG Marketplace.</p>
                                                        </span>
                                                    </div>
                                                    <div className="productSendATicket">
                                                        <button onClick={() => handleViewTicketProduct(details.ag_product_id_code)}><FaTicket/></button>
                                                    </div>
                                                </div>}
                                            </>}
                                            {(viewSendProducts === details.ag_product_id_code) && <>
                                                {(details.ag_product_status === "Unredeemed") && <div className="ppcrpcmppcSend">
                                                    <button id='ppcrpcmppcsClose' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                                                    <div className="ppcrpcmppcsContent">
                                                        <p>
                                                            {details.productCode.ag_product_name}<br />
                                                            <span>
                                                                {details.productData.game_edition ? details.productData.game_edition : ''}
                                                                {details.productData.giftcard_category ? details.productData.giftcard_category : ''}
                                                                {details.productData.gamecredit_type ? details.productData.gamecredit_type : ''}
                                                            </span>
                                                        </p>
                                                        {!sendingLoader ? <>
                                                            <input type="text" placeholder='Receiver User ID Here' onChange={(e) => setReceiverUserID(e.target.value)} required/>
                                                            <button className={receiverUserID ? 'active' : ''} onClick={() => handleSendProduct(details.ag_product_id_code)} disabled={!receiverUserID}>Send Now</button>
                                                        </>:<>
                                                            <h6>
                                                                <TbCubeSend className='faIcons'/>
                                                            </h6>
                                                        </>}
                                                        <span>
                                                            {viewSendResponse ? 
                                                                <p id='sendingErrorMsg'>{viewSendResponse}</p>:
                                                                <p>Once sent, it cannot be Retrieved.</p>
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="productSendATicket">
                                                        <button onClick={() => handleViewTicketProduct(details.ag_product_id_code)}><FaTicket/></button>
                                                    </div>
                                                </div>}
                                            </>}
                                            {(viewFlipProducts === details.ag_product_id_code) && <>
                                                {(details.ag_product_status === "Unredeemed") && <div className="ppcrpcmppcFlip">
                                                    <button id='ppcrpcmppcfClose' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                                                    <div className="ppcrpcmppcfContent">
                                                        <p>
                                                            {details.productCode.ag_product_name}<br />
                                                            <span>
                                                                {details.productData.game_edition}
                                                                {details.productData.giftcard_category}
                                                                {details.productData.gamecredit_number} {details.productData.gamecredit_type}
                                                            </span>
                                                        </p>
                                                        <div className="ppcrpcmppcfPrice">
                                                            {(details.ag_product_type === 'Games') && 
                                                                <div className='ppcrpcmppcfpContent'>
                                                                    <span>
                                                                        <label htmlFor=""><p>Current Price</p></label>
                                                                        <input id='ppcrpcmppcfpcGames' placeholder={`$ ${details.ag_product_price}`} readOnly/>
                                                                    </span>
                                                                    <span>
                                                                        <label htmlFor=""><p>Resell Price</p></label>
                                                                        <input id='ppcrpcmppcfpcGames' type='number' min={1} placeholder='$ 00.00' onChange={(e) => setGamePrice(e.target.value)}/>
                                                                    </span>
                                                                </div>
                                                            }
                                                            {(details.ag_product_type === 'Game Credits') && 
                                                                <div className='ppcrpcmppcfpContent'>
                                                                    <span>
                                                                        <label htmlFor=""><p>Current Price</p></label>
                                                                        <input id='ppcrpcmppcfpcGames' placeholder={`$ ${details.ag_product_price}`} readOnly/>
                                                                    </span>
                                                                    <span>
                                                                        <label htmlFor=""><p>Resell Price</p></label>
                                                                        <input id='ppcrpcmppcfpcGames' type='number' min={1} placeholder='$ 00.00' onChange={(e) => setGamecreditPrice(e.target.value)}/>
                                                                    </span>
                                                                </div>
                                                            }
                                                            {(details.ag_product_type === 'Giftcards') && 
                                                                <div className='ppcrpcmppcfpContent'>
                                                                    <span id='ppcrpcmppcfpGiftcards'>
                                                                        <label htmlFor=""><p>Fixed Pricing</p></label>
                                                                        <input id='ppcrpcmppcfpGiftcards' type="text" placeholder={`$ ${details.ag_product_price}`} value={details.ag_product_price} readOnly/>
                                                                    </span>
                                                                </div>
                                                            }
                                                        </div>
                                                        { !resellLoader ?
                                                            <button onClick={() => handleFlipProduct(details.ag_product_id_code)}>Resell Product</button>:
                                                            <button disabled>Posting...</button>
                                                        }
                                                        <div className="ppcrpcmppcfpcDisclaimer">
                                                            <p>Once Flipped to the Market, it can't be undone.</p>
                                                        </div>
                                                    </div>
                                                    <div className="productSendATicket">
                                                        <button onClick={() => handleViewTicketProduct(details.ag_product_id_code)}><FaTicket/></button>
                                                    </div>
                                                </div> } 
                                            </>}
                                        </div>
                                    ))}
                                </div>
                            </>:<><div className="ppcrpcmpEmpty">
                                    <h6>You don't have any Products yet.</h6>
                                </div>
                            </>}
                        </>}
                    </div>}
                    {/* {viewUserRedeem && <div className="ppcrProfileContents myStore">
                        <div className="ppcrpcmpMyProducts">
                            <>
                                <div className="ppcrpcmpEmpty">

                                </div>
                            </>
                        </div>
                    </div>} */}
                    {viewUserTickets && <div className="ppcrProfileContents myTickets">
                        {isLoading ?<>
                            <div className="ppcrpcmpEmpty">
                                <div className="loader"></div>
                            </div>
                        </>:<>{(viewTicketReport.length != 0) ?<>
                                {viewTicketReportRecord && <div className="ppcrpcmptReceipt">
                                    <div className="ppcrpcmptckrDetails">
                                        <button id='closeTicketModal' onClick={handleCloseTransactionDetails}><FaTimes className='faIcons'/></button>
                                        <h6>Ticket Report Details</h6>
                                        <p id='ppcrpcmptckrcHash'>Ticket: {viewTicketReportDetails.ticket_id}</p>
                                        <div className="ppcrpcmptckrdInfo">
                                            <p>
                                                <UsernameSlicer text={`${viewTicketReportDetails.product_name}`} maxLength={35} />
                                            </p>
                                            <p>
                                                <span><UsernameSlicer text={`${viewTicketReportDetails.product_seller}`} maxLength={30} /> Store</span>
                                            </p>
                                            <div className="ppcrpcmptckrdiReport">
                                                {!tixSellerResponse ? 
                                                <div>
                                                    <textarea name="" id="ppcrpcmptckrdirReport" readOnly disabled>{viewTicketReportDetails.concern}</textarea>
                                                </div>
                                                :<div>
                                                    <p>Seller Statement:</p>
                                                    <textarea name="" id="ppcrpcmptckrdirSeller" readOnly disabled>{viewTicketReportDetails.regards}</textarea>
                                                </div>}
                                            </div>
                                            <div className='ppcrpcmptckrdiUser'>
                                                <p>
                                                    <span>
                                                        {(viewTicketReportDetails.status === 'On Queue') && 'Status: On Queue'}
                                                        {(viewTicketReportDetails.status === 'Processing') && 'Status: Processing'}
                                                        {(viewTicketReportDetails.status === 'Completed') && 'Completed'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <p id='ppcrpcmptckrcDate'>{formatDateToWordedDate(viewTicketReportDetails.date)}{viewTicketReportDetails.date_completed && ` - ${formatDateToWordedDate(viewTicketReportDetails.date_completed)}`}</p>
                                    </div>
                                </div>}
                                {viewTicketMessageRecord && <div className="ppcrpcmptReceipt">
                                    <div className="ppcrpcmptckrDetails chat">
                                        <h6>Ticket Report Details</h6>
                                        <p id='ppcrpcmptckrcHash'>Ticket: {viewTicketReportDetails.ticket_id}</p>
                                        <div className="ppcrpcmptckrdInfo">
                                            <p>
                                                <UsernameSlicer text={`${viewTicketReportDetails.product_name}`} maxLength={35} />
                                            </p>
                                            <p>
                                                <span><UsernameSlicer text={`${viewTicketReportDetails.product_seller}`} maxLength={30} /> Store</span>
                                            </p>
                                            <div className="ppcrpcmptckrdiReport">
                                                {!tixSellerResponse ? 
                                                <div>
                                                    <textarea name="" id="ppcrpcmptckrdirReport" readOnly disabled>{viewTicketReportDetails.concern}</textarea>
                                                </div>
                                                :<div>
                                                    <p>Seller Statement:</p>
                                                    <textarea name="" id="ppcrpcmptckrdirSeller" readOnly disabled>{viewTicketReportDetails.regards}</textarea>
                                                </div>}
                                            </div>
                                            <div className='ppcrpcmptckrdiUser'>
                                                <p>
                                                    <span>
                                                        {(viewTicketReportDetails.status === 'On Queue') && 'Status: On Queue'}
                                                        {(viewTicketReportDetails.status === 'Processing') && 'Status: Processing'}
                                                        {(viewTicketReportDetails.status === 'Completed') && 'Completed'}
                                                    </span>
                                                </p>
                                                {viewTicketReportDetails.regards &&
                                                    <button onClick={handleTixSellerResponse}><TbMessage2 classNamefaIcons/></button>
                                                }
                                            </div>
                                        </div>
                                        <p id='ppcrpcmptckrcDate'>{formatDateToWordedDate(viewTicketReportDetails.date)}{viewTicketReportDetails.date_completed && ` - ${formatDateToWordedDate(viewTicketReportDetails.date_completed)}`}</p>
                                    </div>
                                    <div className="ppcrpcmptckrChat">
                                        <button id='closeTicketModal' onClick={handleCloseTransactionDetails}><FaTimes className='faIcons'/></button>
                                        <div className="ppcrpcmptckrcSeller">
                                            <div>
                                                <img src={`https://2wave.io/StoreLogo/${viewTicketReportDetails.product_seller}.png`} alt="" />
                                            </div>
                                            <span>
                                                <h6><UsernameSlicer text={`${viewTicketReportDetails.product_seller}`} maxLength={15} /></h6>
                                                <p>{viewTicketReportDetails.ticket_id}</p>
                                            </span>
                                        </div>
                                        <div className="ppcrpcmptckrcConversations">
                                            <div className="ppcrpcmptckrcConvos">
                                                <div className="ppcrpcmptckrcConvo">
                                                    <div className="ppcrpcmptckrcc seller">
                                                        <p id='ppcrpcmptckrccStart'>Hello, Let's start our conversation here. Let me know what's your concern?</p>
                                                    </div>
                                                    <div className="ppcrpcmptckrcc hidden">
                                                    </div>
                                                </div>
                                                {viewTicketMessagesDetails.map((details, i) => (
                                                    <div className="ppcrpcmptckrcConvo" key={i}>
                                                        <div className={details.seller_chat ? "ppcrpcmptckrcc seller" : "ppcrpcmptckrcc hidden"}>
                                                            <p>{details.seller_chat}</p>
                                                        </div>
                                                        <div className={details.user_chat ? "ppcrpcmptckrcc user" : "ppcrpcmptckrcc hidden"}>
                                                            <p>{details.user_chat}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {userTixSentMsg && 
                                                    <div className="ppcrpcmptckrcConvo">
                                                        <div className="ppcrpcmptckrcc hidden">
                                                        </div>
                                                        <div className="ppcrpcmptckrcc user">
                                                            <p>{userTixSentMsg}</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="ppcrpcmptckrcSend">
                                            <textarea name="" id="" placeholder='Type here...' value={userTixMessage} onChange={(e) => setUserTixMessage(e.target.value)}></textarea>
                                            <button onClick={handleSendSellerMessage} disabled={!userTixMessage}><TbSend className='faIcons'/></button>
                                        </div>
                                    </div>
                                </div>}
                                <div className="ppcrpcmpTicket website">
                                    <div>
                                        {TicketReportSort.map((data, i) => (
                                        <ul key={i}>
                                            <li id='ppcrpcmptckcDate'>{formatDateToWordedDate(data.date)}</li>
                                            <li id='ppcrpcmptckcId'>{data.ticket_id}</li>
                                            <li id='ppcrpcmptckcName'><UsernameSlicer text={`${data.product_name}`} maxLength={35} /></li>
                                            <li id='ppcrpcmptckcStatus'>
                                                {(data.status === 'On Queue') && 'On Queue'}
                                                {(data.status === 'Processing') && 'Processing'}
                                                {(data.status === 'Completed') && 'Completed'}
                                            </li>
                                            <li id='ppcrpcmptckcView'><button onClick={() => handleViewTicketDetails(data.ticket_id)}><TbTicket className='faIcons'/></button></li>
                                            <li id='ppcrpcmptckcView'><button onClick={() => handleViewTicketMessage(data.ticket_id)}><TbMessages className='faIcons'/></button></li>
                                        </ul>))}
                                    </div>
                                </div>
                            </>:<><div className="ppcrpcmpEmpty">
                                    <h6>You don't have any Tickets.</h6>
                                </div>
                            </>}
                        </>}
                    </div>}
                    {viewUserTransactions &&<div className="ppcrProfileContents myTransactions">
                        {isLoading ?<>
                            <div className="ppcrpcmpEmpty">
                                <div className="loader"></div>
                            </div>
                        </>:<>{(viewTransactionList.length != 0) ?<>
                                {/* <p>{userLoggedData.username}, here's all of your product transactions and history.</p> */}
                                {viewTransactionRecord && <div className="ppcrpcmptReceipt">
                                    <div className="ppcrpcmptrContent">
                                        <button onClick={handleCloseTransactionDetails}><FaTimes className='faIcons'/></button>
                                        <h6>{viewTransactionDetails.ag_transaction_command} Receipt</h6>
                                        <p id='ppcrpcmptrcHash'>TxH: {viewTransactionDetails.ag_transaction_hash}</p>
                                        <div className="ppcrpcmptrcDetails">
                                            <div className='ppcrpcmptrcdTitle'>
                                                <h6>{viewTransactionDetails.ag_product_name}</h6>
                                                <p>{viewTransactionDetails.ag_product_id}</p>
                                            </div>
                                            <div className='ppcrpcmptrcdInfo current'>
                                                <p>
                                                    <span>Txn By:</span><br />
                                                    {viewTransactionDetails.ag_user_id}
                                                </p>
                                                <p>
                                                    <span>Qnty:</span><br />
                                                    {viewTransactionDetails.ag_product_quantity}
                                                </p>
                                                <p>
                                                    <span>Prd Price:</span><br />
                                                    $ {viewTransactionDetails.ag_product_price}
                                                </p>
                                            </div>
                                        </div>
                                        <p id='ppcrpcmptrcDate'>{formatDateToWordedDate(viewTransactionDetails.ag_transaction_date)}</p>
                                    </div>
                                </div>}
                                <div className="ppcrpcmpTransactions website">
                                    <table id='ppcrpcmptHeader'>
                                        <thead>
                                            <tr>
                                                <th width='15%' id='ppcrpcmptDate'><p>Transaction Date</p></th>
                                                <th width='15%' id='ppcrpcmptPrice'><p>Transaction</p></th>
                                                <th width='30%' id='ppcrpcmptName'><p>Product Name</p></th>
                                                <th width='25%' id='ppcrpcmptHash'><p>Transaction Hash</p></th>
                                                <th width='15%' id='ppcrpcmptView'><p></p></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div>
                                        <table id='ppcrpcmptContents'>
                                            <tbody>
                                                {viewTransactionList.map((data, i) => (
                                                <tr key={i}>
                                                    <td width='15%' id='ppcrpcmptDate'><p>{formatDateToWordedDate(data.ag_transaction_date)}</p></td>
                                                    <td width='15%' id='ppcrpcmptPrice'><p>{data.ag_transaction_command}</p></td>
                                                    <td width='30%' id='ppcrpcmptName'><p><UsernameSlicer text={`${data.ag_product_name}`} maxLength={30} /></p></td>
                                                    <td width='25%' id='ppcrpcmptHash'><p>{data.ag_transaction_hash}</p></td>
                                                    <td width='15%' id='ppcrpcmptView'><button onClick={() => handleViewTransactionDetails(data.ag_transaction_hash)}>Info</button></td>
                                                </tr>))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="ppcrpcmpTransactions mobile">
                                    <table id='ppcrpcmptHeader'>
                                        <thead>
                                            <tr>
                                                <th width='15%' id='ppcrpcmptCommand'><p>Transaction</p></th>
                                                <th width='30%' id='ppcrpcmptName'><p>Product Name</p></th>
                                                <th width='15%' id='ppcrpcmptView'><p></p></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div>
                                        <table id='ppcrpcmptContents'>
                                            <tbody>
                                                {viewTransactionList.map((data, i) => (
                                                <tr key={i}>
                                                    <td width='15%' id='ppcrpcmptCommand'><p>{data.ag_transaction_command}</p></td>
                                                    <td width='30%' id='ppcrpcmptName'><p>{data.ag_product_name}</p></td>
                                                    <td width='15%' id='ppcrpcmptView'><button onClick={() => handleViewTransactionDetails(data.ag_transaction_hash)}>Info</button></td>
                                                </tr>))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>:<><div className="ppcrpcmpEmpty">
                                    <h6>You don't have any transaction made.</h6>
                                </div>
                            </>}
                        </>}
                    </div>}
                </div>
            </section>
        </div>
    )
}

export default Profile