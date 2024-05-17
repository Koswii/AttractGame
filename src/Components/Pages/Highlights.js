import React, { useEffect, useState } from 'react'
import "../CSS/highlights.css";
import { Link } from 'react-router-dom';
import { 
  MdSettings,
  MdAdminPanelSettings,
  MdOutlineShare, 
  MdOutlineSpaceDashboard,
  MdOutlineShoppingBag,
  MdOutlineVideogameAsset,
  MdOutlineGamepad,
  MdOutlineCardGiftcard,
  MdCurrencyBitcoin    
} from "react-icons/md";
import { 
    RiVerifiedBadgeFill,
    RiSparklingFill  
} from "react-icons/ri";
import { 
    IoLogoYoutube,
    IoIosImages,
    IoMdAddCircle  
} from "react-icons/io";
import axios from 'axios';



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
const Highlights = () => {
    const userStateAdmin = localStorage.getItem('agAdminLoggedIn');
    const userStateLogin = localStorage.getItem('isLoggedIn');
    const LoginUsername = localStorage.getItem('attractGameUsername');
    const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGUserPostAPI = process.env.REACT_APP_AG_FETCH_POST_API;
    
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
    const [viewFetchPost, setViewFetchPost] = useState([]);

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


            }else{
                axios.get(AGUserDataAPI)
                .then((response) => {
                    const userData = response.data.find(item => item.username == LoginUsername);
                    const profileDetailsJSON = JSON.stringify(userData)
                    localStorage.setItem('profileDataJSON', profileDetailsJSON);
                })
                .catch(error => {
                    console.log(error)
                })
            }
        }
        fetchUserProfile();

        const fetchUserDataPost = () => {
            axios.get(AGUserPostAPI)
            .then((response) => {
                const postSortData = response.data.sort((a, b) => b.id - a.id);

                setViewFetchPost(postSortData);
                // console.log(postDateData);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchUserDataPost();

    }, [LoginUsername]);




    return (
        <div className='mainContainer highlights'>
            <section className="highlightsPageContainer top">
                <div className="hlsPageContent top">
                    <div className="hldpcTop1">
                        <div className="hldpct1">
                            <div>
                                <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt="" />
                            </div>
                            <input type="text" placeholder='Post about a Gameplay...' readOnly/>
                            <button id='postAStory'><IoIosImages className='faIcons'/></button>
                        </div>
                    </div>
                    <div className="hldpcTop2 website">
                        <div className="hldpcT2 addStory">
                            <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt="" />
                            <span>
                                <h5><IoMdAddCircle className='faIcons'/></h5>
                                <p>Add Story</p>
                            </span>
                        </div>
                        <div className="hldpcT2 stories">
                            <div>
                                <span>
                                    <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                </span>
                                <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                            </div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div className="hldpcTop2 mobile">
                        <div className="hldpcT2 addStory">
                            <img src='https://2wave.io/ProfilePics/DefaultProfilePic.png' alt="" />
                            <span>
                                <h5><IoMdAddCircle className='faIcons'/></h5>
                                <p>Add Story</p>
                            </span>
                        </div>
                        <div className="hldpcT2 stories">
                            <div>
                                <span>
                                    <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                </span>
                                <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                            </div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>
                <hr />
            </section>
            <section className="highlightsPageContainer mid">
                <div className="hlsPageContent mid">
                    {viewFetchPost.map((post, i) => (
                        <div className="hldpcMid1" key={i}>
                            <div className="hldpcMid1User">
                                <div className='hldpcMid1Profile'>
                                    <div>
                                        <img src='https://2wave.io/ProfilePics/DefaultProfilePic.png' alt="" />
                                    </div>
                                    <span>
                                        <h6>{post.user} 
                                            {post.user_verified ? <>
                                                {post.user_verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                                {post.user_verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                            </>:<></>}
                                        </h6>
                                        <p>{formatDate(post.user_post_date)}</p>
                                    </span>
                                </div>
                                <div className="hldpcMid1Option">
                                    <button><MdAdminPanelSettings className='faIcons'/></button>
                                    <button><MdOutlineShare className='faIcons'/></button>
                                </div>
                            </div>
                            <div className="hldpcMid1PostText">
                                <p>{post.user_post_text}</p>
                            </div>
                            <div className="hldpcMid1PostImg">
                                <img id='hldpcMid1pBG' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                                <img id='hldpcMid1pImg' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Highlights