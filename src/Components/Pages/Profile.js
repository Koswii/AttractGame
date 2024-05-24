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
    FaRegImages 
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
    RiImageEditLine    
} from "react-icons/ri";
import { 
    IoLogoYoutube,
    IoIosImages,
    IoMdAddCircle  
} from "react-icons/io";
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
      return "Now";
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
                const userData = userDataResponse.data.find(user => user.username === story.user);
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
const Profile = () => {

    // User Profile Fetching

    const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGUserPostAPI = process.env.REACT_APP_AG_FETCH_POST_API;
    const AGUserStoryAPI = process.env.REACT_APP_AG_FETCH_STORY_API;
    const LoginUsername = localStorage.getItem('attractGameUsername');

    const [viewUserID, setViewUserID] = useState('')
    const [viewUserRegistration, setViewUserRegistration] = useState('')
    const [viewAGElite, setViewAGElite] = useState('');
    const [viewRefCode, setViewRefCode] = useState('');
    const [viewCoverImg, setViewCoverImg] = useState('');
    const [viewProfileImg, setViewProfileImg] = useState('');
    const [viewCryptoAddress, setViewCryptoAddress] = useState('');
    const [viewEmailAddress, setViewEmailAddress] = useState('');
    const [viewFacebook, setViewFacebook] = useState('');
    const [viewInstagram, setViewInstagram] = useState('');
    const [viewTiktok, setViewTiktok] = useState('');
    const [viewTwitch, setViewTwitch] = useState('');
    const [viewYoutube, setViewYoutube] = useState('');
    const [viewUsername, setViewUsername] = useState('');
    const [viewVerifiedUser, setViewVerifiedUser] = useState('');
    const [randomNumber, setRandomNumber] = useState('');
    const [randomPostID, setRandomPostID] = useState('');
    const [viewFetchPost, setViewFetchPost] = useState([]);
    const [viewFetchStory, setViewFetchStory] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
        const number = Math.floor(Math.random() * 900000) + 100000; // Generates a 6-digit number
        setRandomNumber(number);
        }, 1000); // Change interval as needed (in milliseconds)

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
        const number = Math.floor(Math.random() * 90000000) + 10000000; // Generates a 8-digit number
        setRandomPostID(number);
        }, 1000); // Change interval as needed (in milliseconds)

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setViewUserID(parsedProfileData.id);
                setViewUserRegistration(parsedProfileData.date)
                setViewUsername(parsedProfileData.username);
                setViewAGElite(parsedProfileData.agelite);
                setViewProfileImg(parsedProfileData.profileimg);
                setViewCoverImg(parsedProfileData.coverimg);
                setViewEmailAddress(parsedProfileData.email);
                setViewCryptoAddress(parsedProfileData.cryptoaddress);
                setViewVerifiedUser(parsedProfileData.verified);
                setViewFacebook(parsedProfileData.facebook);
                setViewInstagram(parsedProfileData.instagram);
                setViewTiktok(parsedProfileData.tiktok);
                setViewYoutube(parsedProfileData.youtube);
                setViewTwitch(parsedProfileData.twitch);
                setViewRefCode(parsedProfileData.refcode);
            }
        }
        fetchUserProfile();

        const fetchUserDataPost = () => {
            axios.get(AGUserPostAPI)
            .then((response) => {
                const postSortData = response.data.sort((a, b) => b.id - a.id);
                const postData = postSortData.filter(post => post.user == LoginUsername);
                setViewFetchPost(postData);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchUserDataPost();

        fetchUserDataStory(setViewFetchStory);

    }, [LoginUsername]);


    const [pickProfileImg00, setPickProfileImg00] = useState('DefaultProfilePic.png');
    const [editSocialsModal, setEditSocialsModal] = useState(false);
    const [addUserPost, setAddUserPost] = useState(false);
    const [addUserPost2, setAddUserPost2] = useState(false);
    const [addCoverImg, setAddCoverImg] = useState(false);
    const [addPostStory, setAddPostStory] = useState(false);

    

    const switchToDP01 = () => {
        setPickProfileImg00('AG Logo1.png')
    }
    const switchToDP02 = () => {
        setPickProfileImg00('AG Logo2.png')
    }
    const switchToDP03 = () => {
        setPickProfileImg00('AG Logo3.png')
    }
    const switchToDP04 = () => {
        setPickProfileImg00('AG Logo4.png')
    }
    const switchToDP05 = () => {
        setPickProfileImg00('AG Logo5.png')
    }
    const switchToDP06 = () => {
        setPickProfileImg00('DefaultProfilePic.png')
    }
    const switchToDP07 = () => {
        setPickProfileImg00('MaleDP01.png')
    }
    const switchToDP08 = () => {
        setPickProfileImg00('MaleDP02.png')
    }
    const switchToDP09 = () => {
        setPickProfileImg00('FemaleDP01.png')
    }
    const switchToDP10 = () => {
        setPickProfileImg00('FemaleDP02.png')
    }

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
    const handleRemoveUserImage = () => {
        setImage(null);
        setImageDP(null);
        setImageDPName('');
        
    };


    const [agEditFacebook, setAGEditFacebook] = useState('');
    const [agEditInstagram, setAGEditInstagram] = useState('');
    const [agEditTiktok, setAGEditTiktok] = useState('');
    const [agEditYoutube, setAGEditYoutube] = useState('');
    const [agEditTwitch, setAGEditTwitch] = useState('');
    const [isEditSubmitting, setIsEditSubmitting] = useState(false);
    const AGUserDataUPDATEAPI = process.env.REACT_APP_AG_USERS_PROFILE_UPDATE_API;
    const AGUserCustomDPAPI = process.env.REACT_APP_AG_USERS_CUSTOM_DP_API;
    const AGUserCustomCPAPI = process.env.REACT_APP_AG_USERS_CUSTOM_CP_API;

    const renderProfileUser = () => {
        if (viewVerifiedUser == 'Gold' || viewVerifiedUser == 'Blue'){
            if(viewProfileImg == ''){
                return (
                  `${viewUsername}_${randomNumber}_${imageDPName}`
                );
            }else{
                if(imageDPName == ''){
                    return (
                        viewProfileImg
                    );
                }else{
                    return (
                        `${viewUsername}_${randomNumber}_${imageDPName}`
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
        if (viewVerifiedUser == 'Gold' || viewVerifiedUser == 'Blue'){
            if(viewCoverImg == ''){
                return (
                  `${viewUsername}_${randomNumber}_${imageCoverPhotoName}`
                );
            }else{
                if(imageCoverPhotoName == ''){
                    return (
                        viewCoverImg
                    );
                }else{
                    return (
                        `${viewUsername}_${randomNumber}_${imageCoverPhotoName}`
                    );
                }
            }
        } 
    };
    const handleEditProfileSubmit = async (e) => {
        e.preventDefault();
        setIsEditSubmitting(true);
    
        const formEditProfileData = {
            id: viewUserID,
            date: viewUserRegistration,
            email: viewEmailAddress,
            username: viewUsername,
            profileimg: renderProfileUser(),
            coverimg: renderProfileCoverUser(),
            refcode: viewRefCode,
            facebook: agEditFacebook || viewFacebook,
            instagram: agEditInstagram || viewInstagram,
            tiktok: agEditTiktok || viewTiktok,
            youtube: agEditYoutube || viewYoutube,
            twitch: agEditTwitch || viewTwitch,
            agelite: viewAGElite,
            cryptoaddress: viewCryptoAddress,
            verified: viewVerifiedUser,
        };
    
        const formUserDPData = new FormData();
        formUserDPData.append('profileuser', viewUsername);
        formUserDPData.append('profileimg', imageDP);
        formUserDPData.append('profileimgid', randomNumber);

        const formUserCPData = new FormData();
        formUserCPData.append('profileuser', viewUsername);
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
                localStorage.setItem('profileDataJSON', JSON.stringify(formEditProfileData));
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


    return (
        <div className='mainContainer profile'>
            {editSocialsModal && <div className="modalContainerProfile settings">
                <div className="modalContentProfile" 
                    style={viewCoverImg ? {background: `linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/${viewCoverImg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <button id='closeModalSettings' onClick={handleCloseAnyModals} type='button'><FaTimes className='faIcons'/></button>
                    <form onSubmit={handleEditProfileSubmit}>
                        <div className="mdcpSettingsContainer">
                            <div className="mdcpsContent left">
                                <div className='mdcpscProfileDP'>
                                    {!imageDP ? <>
                                        {viewVerifiedUser ? 
                                        <img src={`https://2wave.io/ProfilePics/${viewProfileImg ? viewProfileImg : 'DefaultProfilePic.png'}`} alt="" />
                                        :<img src={`https://2wave.io/ProfilePics/${pickProfileImg00 ? pickProfileImg00 : 'DefaultProfilePic.png'}`} alt="" />}
                                    </>:<>
                                        <img src={URL.createObjectURL(imageDP)} alt="No image Selected" />
                                        <button onClick={handleRemoveUserImage}><FaTimes className='faIcons'/></button>
                                    </>}
                                </div>
                                {!viewVerifiedUser && <div className='mdcpscSampleProfile'>
                                    <img onClick={switchToDP01} src={require('../assets/imgs/ProfilePics/AG Logo1.png')} alt="" />
                                    <img onClick={switchToDP02} src={require('../assets/imgs/ProfilePics/AG Logo2.png')} alt="" />
                                    <img onClick={switchToDP03} src={require('../assets/imgs/ProfilePics/AG Logo3.png')} alt="" />
                                    <img onClick={switchToDP04} src={require('../assets/imgs/ProfilePics/AG Logo4.png')} alt="" />
                                    <img onClick={switchToDP05} src={require('../assets/imgs/ProfilePics/AG Logo5.png')} alt="" />
                                    <img onClick={switchToDP06} src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                    <img onClick={switchToDP07} src={require('../assets/imgs/ProfilePics/MaleDP01.png')} alt="" />
                                    <img onClick={switchToDP08} src={require('../assets/imgs/ProfilePics/MaleDP02.png')} alt="" />
                                    <img onClick={switchToDP09} src={require('../assets/imgs/ProfilePics/FemaleDP01.png')} alt="" />
                                    <img onClick={switchToDP10} src={require('../assets/imgs/ProfilePics/FemaleDP02.png')} alt="" />
                                </div>}
                                {(viewVerifiedUser) ? <div className='mdcpscCustomProfile'>
                                    <p><TbUpload className='faIcons'/>Upload from Computer</p>
                                    <input type="file" onChange={handleUploadUserDP}/>
                                </div>:<></>}
                            </div>
                            <div className="mdcpsContent right">
                                <h4>{viewUsername} 
                                    {viewVerifiedUser ? <>
                                        {viewVerifiedUser === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                        {viewVerifiedUser === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                    </>:<></>}
                                </h4>
                                <p>{viewEmailAddress}</p>
                                <div className="mdcpccrSocials">
                                    <h6>EDIT PROFILE</h6>
                                    <div>
                                        <span>
                                            <label><p><FaSquareFacebook className='faIcons'/> Facebook</p></label>
                                            <input name='agEditProfileFB' type="text" placeholder={viewFacebook ? viewFacebook : 'Facebook Profile Link'} onChange={(e) => setAGEditFacebook(e.target.value)}/>
                                        </span>
                                        <span>
                                            <label><p><FaInstagram className='faIcons'/> Instagram</p></label>
                                            <input name='agEditProfileIG' type="text" placeholder={viewInstagram ? viewInstagram : 'Instagram Profile Link'} onChange={(e) => setAGEditInstagram(e.target.value)}/>
                                        </span>
                                        <span>
                                            <label><p><FaTiktok className='faIcons'/> TikTok</p></label>
                                            <input name='agEditProfileTT' type="text" placeholder={viewTiktok ? viewTiktok : 'TikTok Profile Link'} onChange={(e) => setAGEditTiktok(e.target.value)}/>
                                        </span>
                                        <span>
                                            <label><p><FaYoutube className='faIcons'/> YouTube</p></label>
                                            <input name='agEditProfileYT' type="text" placeholder={viewYoutube ? viewYoutube : 'YouTube Channel Link'} onChange={(e) => setAGEditYoutube(e.target.value)}/>
                                        </span>
                                        <span>
                                            <label><p><FaTwitch className='faIcons'/> Twitch</p></label>
                                            <input name='agEditProfileTC' type="text" placeholder={viewTwitch ? viewTwitch : 'Twitch Channel Link'} onChange={(e) => setAGEditTwitch(e.target.value)}/>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isEditSubmitting ? 
                        <div className="mdcpccrLoader"><p>Loading Update...</p></div>
                        :<div className="mdcpccrLoader"><p></p></div>}
                        <div className="mdcpccrSubmit">
                            {!viewVerifiedUser ? 
                                <button id='mdcpccrsVerified'>APPLY SUBSCRIPTION <RiSparklingFill className='faIcons'/></button>
                                :<></>}
                            <button id='mdcpccrsSubmit' type='submit'>Update Profile</button>
                        </div>
                    </form>
                </div>
            </div>}
            {addCoverImg && <div className="modalContainerProfile coverImg">
                <div className="modalContentCover"
                    style={viewCoverImg ? {background: `linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/${viewCoverImg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}
                    :{background: 'linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <button id='closeModalCover' onClick={handleCloseAnyModals} type='button'><FaTimes className='faIcons'/></button>
                    <form onSubmit={handleEditProfileSubmit}>
                        <div className="mdcpCoverContainer">
                            {imageCoverPhoto ? 
                                <img src={URL.createObjectURL(imageCoverPhoto)} alt="No image Selected" /> :
                                <h6>Change Cover Photo</h6>
                            }
                            <input type="file" onChange={handleUploadUserCoverPhoto}/> 
                            <button type='submit'><FaCircleCheck className='faIcons'/></button>  
                        </div>
                    </form>
                </div>
            </div>}
            
            {addPostStory && <UserStoryModal setAddPostStory={setAddPostStory}/>}
            {addUserPost && <UserPostModal setAddUserPost={setAddUserPost}/>}
            {addUserPost2 && <UserPostModal2 setAddUserPost2={setAddUserPost2}/>}

            <section className="profilePageContainer top">
                {viewCoverImg ? 
                <img src={`https://2wave.io/CoverPics/${viewCoverImg}`}/>
                :<img src={require('../assets/imgs/LoginBackground.jpg')} alt="" />}
                <div className='ppctShadow'></div>
                {viewVerifiedUser && <div className='ppctEditCoverImg'>
                    <div className="ppctecimg">
                        <button id='ppctecimgBtnWeb' onClick={handleAddCoverImg}>Change Cover Photo</button>
                        <button id='ppctecimgBtnMob' onClick={handleAddCoverImg}><RiImageEditLine className='faIcons' /></button>
                    </div>
                </div>}
            </section>
            <section className="profilePageContainer mid">
                <div className="profilePageContent left">
                    <div className='ppclProfilePic'>
                        {viewProfileImg ? 
                        <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt="" onClick={handleOpenSocialSettings}/>
                        :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt="" onClick={handleOpenSocialSettings}/>}
                    </div>
                    <div className="ppclProfileName">
                        <h5>
                            {viewUsername} 
                            {viewVerifiedUser ? <>
                                {viewVerifiedUser === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                {viewVerifiedUser === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                            </>:<></>}
                        </h5>
                        <p>{viewEmailAddress}</p>
                    </div>
                    <div className="ppclProfileSocials">
                        {viewFacebook ? <a href={viewFacebook} target='blank'><h6><FaSquareFacebook className='faIcons'/></h6></a> : <></>}
                        {viewInstagram ? <a href={viewInstagram} target='blank'><h6><FaInstagram className='faIcons'/></h6></a> : <></>}
                        {viewTiktok ? <a href={viewTiktok} target='blank'><h6><FaTiktok className='faIcons'/></h6></a> : <></>}
                        {viewYoutube ? <a href={viewYoutube} target='blank'><h6><FaYoutube className='faIcons'/></h6></a> : <></>}
                        {viewTwitch ? <a href={viewTwitch} target='blank'><h6><FaTwitch className='faIcons'/></h6></a> : <></>}
                        <div>
                            <button onClick={handleOpenSocialSettings}>Edit Profile <TbSettingsBolt className='faIcons'/></button>
                        </div>
                    </div>
                    <div className="ppclProfileDetails">
                        <span>
                            <p>My Referral Code</p>
                            <p>{viewRefCode}</p>
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
                        <button onClick={handleAddUserStory}>Add Story</button>
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
                        <button className='active'><h6>HIGHLIGHTS</h6></button>
                        <button><h6>MY PRODUCTS</h6></button>
                        <button><h6>MISSIONS</h6></button>
                        <button><h6>FEEDBACKS</h6></button>
                    </div>
                    <div className="ppcrProfileContents highlights">
                        <div className="ppcrpchPosting">
                            <div className="ppcrpchpWhat">
                                {viewProfileImg ? 
                                <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt=""/>
                                :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                <input type="text" placeholder='Post about a Gameplay...' onClick={handleAddUserPost} readOnly/>
                                <button id='postAStory' onClick={handleAddUserPost2}><IoIosImages className='faIcons'/></button>
                            </div>
                            <div className="ppcrpchpStories">
                                <div className='postAStory' onClick={handleAddUserStory}>
                                    {viewProfileImg ? 
                                    <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt=""/>
                                    :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                    <span>
                                        <h5><IoMdAddCircle className='faIcons'/></h5>
                                        <p>Add Story</p>
                                    </span>
                                </div>
                                <div className='viewAStory'>
                                    <div className="storiesContents">
                                        {viewFetchStory.slice(0, 3).map((story, i) => (
                                            <div>
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
                                <>
                                    {viewFetchPost.map((post, i) => (
                                        <div className='ppcrpchpPost' key={i}>
                                            <div className='ppcrpchpUser'>
                                                {viewProfileImg ? 
                                                <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt=""/>
                                                :<img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                                <span>
                                                    <h6>
                                                        {viewUsername} 
                                                        {viewVerifiedUser ? <>
                                                            {viewVerifiedUser === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                                            {viewVerifiedUser === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                                        </>:<></>}
                                                    </h6>
                                                    <p>{formatDate(post.user_post_date)}</p>
                                                </span>
                                            </div>
                                            <div className="ppcrpchpupWords">
                                                <p>{post.user_post_text}</p>
                                            </div>
                                            {post.user_post_image ? <div className="ppcrpchpuPosting">
                                                <img id='ppcrpchpuPostingBG' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                                                <img id='ppcrpchpuPostingImg' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                                            </div>:<></>}
                                            {post.user_post_youtube ? <div className="ppcrpchpuPosting">
                                                <YouTubeEmbed videoUrl={post.user_post_youtube} />
                                            </div>:<></>}
                                        </div>
                                    ))}
                                </>
                                {viewFetchPost.length == 0 ?
                                <div className='ppcrpchpNoPost'>
                                    <h6>No Highlights Available...</h6>
                                </div>:<></>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Profile