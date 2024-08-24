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
    FaCircleCheck  
} from "react-icons/fa6";
import { 
    TbUserSquareRounded,
    TbGiftCardFilled,
    TbSettings2,
    TbSettingsBolt,
    TbUpload,   
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



const formatDateToWordedDate = (numberedDate) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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

const Profile = () => {
    const { userLoggedData, userProductCodeIDData, viewTransactionList } = UserProfileData();
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
    const handleCloseAnyModals = (e) => {
        e.preventDefault();
        setEditSocialsModal(false)
        setAddCoverImg(false)
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
    const [viewUserTransactions, setViewUserTransactions] = useState(false);
    const [viewUserAddProducts, setViewUserAddProducts] = useState(false);
    const [viewUserRedeem, setViewUserRedeem] = useState(false);
    const [viewUserStore, setViewUserStore] = useState(false);
    const [viewUserTickets, setViewUserTickets] = useState(false)

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
    }
    const handleViewTransactions = () => {
        setViewUserTransactions(true)
        setViewUserProducts(false)
        setViewUserStore(false)
        setViewUserAddProducts(false)
        setViewUserRedeem(false)
        setViewUserTickets(false)
        setViewUserHighlight(false)
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
                            <p>My Referral Code</p>
                            <p>{userLoggedData.refcode}</p>
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
                        <button onClick={handleAddUserStory}><FaPlus className='faIcons'/>Add Story</button>
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
                        {/* <button className={viewUserRedeem ? 'active' : ''} onClick={handleViewRedeem}><h6>REDEEM</h6></button>
                        <button className={viewUserTickets ? 'active' : ''} onClick={handleViewTickets}><h6>TICKETS</h6></button> */}
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
                                                {details.productData.gamecredit_cover && <img src={`https://2wave.io/GiftCardCovers/${details.productData.gamecredit_cover}`} alt="" />}
                                                {/* <div>
                                                    <h6>{details.productCode.ag_product_name}</h6>
                                                </div> */}
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
                                            {/* <button onClick={() => toggleVisibility(i)}>{isVisible[i] ? <FaRegEyeSlash className='faIcons'/> : <FaRegEye className='faIcons'/>}</button> */}
                                            <div className="ppcrpcmppcCode">
                                                <div>
                                                    <h6>
                                                        {details.productCode.ag_product_name} <br /> 
                                                        <span>{details.productData.game_edition ? details.productData.game_edition : ''}</span>
                                                    </h6>
                                                </div>
                                                {/* <span>
                                                    <a href="">{!isVisible[i] ? '***** ***** *****' : `${details.productCode.ag_product_code}`}</a>
                                                </span> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>:<><div className="ppcrpcmpEmpty">
                                    <h6>You don't have any Products yet.</h6>
                                </div>
                            </>}
                        </>}
                    </div>}
                    {viewUserRedeem && <div className="ppcrProfileContents myStore">
                        <div className="ppcrpcmpMyProducts">
                            <>
                                <div className="ppcrpcmpEmpty">

                                </div>
                            </>
                        </div>
                    </div>}
                    {viewUserTickets && <div className="ppcrProfileContents myTickets">
                        <div className="ppcrpcmpMyTickets">
                            {/* <h3>MY LISTED PRODUCTS</h3> */}
                            <>
                                <div className="ppcrpcmpEmpty">
                                    <h6>You don't have any Tickets yet.</h6>
                                </div>
                            </>
                        </div>
                    </div>}
                    {viewUserTransactions &&<div className="ppcrProfileContents myTransactions">
                        {isLoading ?<>
                            <div className="ppcrpcmpEmpty">
                                <div className="loader"></div>
                            </div>
                        </>:<>{(viewTransactionList.length != 0) ?<>
                                <p>{userLoggedData.username}, here's your recent purchased products and Transaction History.</p>
                                <div className="ppcrpcmpTransactions">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th width='30%' id='ppcrpcmptName'><p>Product Name</p></th>
                                                <th width='20%' id='ppcrpcmptPrice'><p>Amount</p></th>
                                                <th width='25%' id='ppcrpcmptDate'><p>Date Purchased</p></th>
                                                <th width='25%' id='ppcrpcmptHash'><p>Transaction Hash</p></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div>
                                        <table id='ppcrpcmptContents'>
                                            <tbody>
                                                {viewTransactionList.map((data, i) => (
                                                <tr key={i}>
                                                    <td width='30%' id='ppcrpcmptName'><p>{data.ag_product_name}</p></td>
                                                    <td width='20%' id='ppcrpcmptPrice'><p>{data.ag_product_price}</p></td>
                                                    <td width='25%' id='ppcrpcmptDate'><p>{formatDateToWordedDate(data.ag_product_purchased_date)}</p></td>
                                                    <td width='25%' id='ppcrpcmptHash'><p>{data.ag_transaction_hash}</p></td>
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