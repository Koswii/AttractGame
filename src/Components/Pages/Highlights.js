import React, { useEffect, useState, useCallback } from 'react'
import "../CSS/highlights.css";
import { Link } from 'react-router-dom';
import { 
  MdSettings,
  MdAdminPanelSettings,
  MdOutlineShare, 
  MdDelete,
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


const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
const AGUserPostAPI = process.env.REACT_APP_AG_FETCH_POST_API;
const AGUserStoryAPI = process.env.REACT_APP_AG_FETCH_STORY_API;
const PAGE_SIZE = 5; // Number of items to fetch per page
const fetchUserData = async (url) => {
    try {
        const response = await axios.get(url);
        const sortedData = response.data.sort((a, b) => b.id - a.id);
        const userDataResponse = await axios.get(AGUserDataAPI);
        const dataWithUserData = sortedData.map(item => {
            const userData = userDataResponse.data.find(user => user.username === item.user);
            return { ...item, userData };
        });
        return dataWithUserData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};
const fetchAllUserData = async (setViewFetchStory, setViewFetchPost, offset, setLoading) => {
    setLoading(true);
    const [storyData, postData] = await Promise.all([
        fetchUserData(`${AGUserStoryAPI}?offset=${offset}&limit=${PAGE_SIZE}`),
        fetchUserData(`${AGUserPostAPI}?offset=${offset}&limit=${PAGE_SIZE}`)
    ]);

    if (storyData.length > 0 || postData.length > 0) {
        setViewFetchStory(prevData => [...prevData, ...storyData]);
        setViewFetchPost(prevData => [...prevData, ...postData]);
    }

    setLoading(false);
};



const Highlights = () => {
    const userStateLogin = localStorage.getItem('isLoggedIn');
    const adminLoggedIn = localStorage.getItem('agAdminLoggedIn');
    const LoginUsername = localStorage.getItem('attractGameUsername');
    const userDetailData = localStorage.getItem('profileDataJSON');
    const AGUserDeletePostAPI = process.env.REACT_APP_AG_DELETE_USER_POST_API;
    
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
    const [viewFetchStory, setViewFetchStory] = useState([]);
    const [postLoading, setPostLoading] = useState(true);
    const [offset, setOffset] = useState(0);


    useEffect(() => {
        const fetchUserProfile = () => {
            if(userStateLogin && userDetailData != undefined){
                const storedProfileData = localStorage.getItem('profileDataJSON')
                if (storedProfileData) {
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
        }
        fetchUserProfile();
        // const fetchUserData = (url, setData) => {
        //     return axios.get(url)
        //         .then(response => {
        //             const sortedData = response.data.sort((a, b) => b.id - a.id);
        //             return axios.get(AGUserDataAPI)
        //                 .then(userDataResponse => {
        //                     const dataWithUserData = sortedData.map(item => {
        //                         const userData = userDataResponse.data.find(user => user.username === item.user);
        //                         return { ...item, userData };
        //                     });
        //                     setData(dataWithUserData);
        //                     return dataWithUserData;
        //                 });
        //         })
        //         .catch(error => {
        //             console.error('Error fetching data:', error);
        //             return [];
        //         });
        // };
        // const fetchAllUserData = () => {
        //     Promise.all([
        //         fetchUserData(AGUserStoryAPI, setViewFetchStory),
        //         fetchUserData(AGUserPostAPI, setViewFetchPost)
        //     ])
        //     .then(([storyData, postData]) => {
        //         if (storyData.length > 0 || postData.length > 0) {
        //             setPostLoading(false);
        //         }
        //     });
        // };
        // fetchAllUserData();
    }, [LoginUsername]);


    const handleScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        if (!postLoading && scrollTop + clientHeight >= scrollHeight * 0.5) {
            setOffset(prevOffset => prevOffset + PAGE_SIZE);
        }
    }, [postLoading]);
    useEffect(() => {
        fetchAllUserData(setViewFetchStory, setViewFetchPost, offset, setPostLoading);
    }, [offset]);
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    
    const [addUserPost, setAddUserPost] = useState(false);
    const [addUserPost2, setAddUserPost2] = useState(false);
    const [addPostStory, setAddPostStory] = useState(false);
    const [deletePostResponse, setDeletePostResponse] = useState(false);

    const handleAddUserPost = () => {
        setAddUserPost(true)
    }
    const handleAddUserPost2 = () => {
        setAddUserPost2(true)
    }
    const handleAddUserStory = () => {
        setAddPostStory(true)
    }
    const handleDeletePost = (post) => {
        const deletePost = {post: post.user_post_id}
        const deletePostJSON = JSON.stringify(deletePost)
        axios({
            method: 'delete',
            url: AGUserDeletePostAPI,
            data: deletePostJSON,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.data.success) {
                console.log('Post deleted successfully');
                setDeletePostResponse(true);
                const timerDelRes = setInterval(() => {
                    setDeletePostResponse(false);
                }, 5000);
                return () => clearInterval(timerDelRes);
            } else {
                console.log(`Error: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.log(`Error: ${error.message}`);
        });
    };



    return (
        <div className='mainContainer highlights'>
            {addPostStory && <UserStoryModal setAddPostStory={setAddPostStory}/>}
            {addUserPost && <UserPostModal setAddUserPost={setAddUserPost}/>}
            {addUserPost2 && <UserPostModal2 setAddUserPost2={setAddUserPost2}/>}


            <section className="highlightsPageContainer top">
                <div className="hlsPageContent top">
                    {(userStateLogin && userDetailData != undefined) && <div className="hldpcTop1">
                        <div className="hldpct1">
                            <div>
                                <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt="" />
                            </div>
                            <input type="text" placeholder='Post about a Gameplay...' readOnly onClick={handleAddUserPost}/>
                            <button id='postAStory'><IoIosImages className='faIcons' onClick={handleAddUserPost2}/></button>
                        </div>
                    </div>}
                    <div className="hldpcTop2 website">
                        {(userStateLogin && userDetailData != undefined) && <div className="hldpcT2 addStory" onClick={handleAddUserStory}>
                            <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt="" />
                            <span>
                                <h5><IoMdAddCircle className='faIcons'/></h5>
                                <p>Add Story</p>
                            </span>
                        </div>}
                        {(userStateLogin && userDetailData != undefined) ? 
                        <div className="hldpcT2 stories">
                            {viewFetchStory.slice(0, 4).map((story, i) => (
                                <div key={i}>
                                    <span>
                                        {story.userData.profileimg ?
                                        <img src={`https://2wave.io/ProfilePics/${story.userData.profileimg}`} alt="" />:
                                        <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                    </span>
                                    <img src={`https://2wave.io/AGMediaStory/${story.user_story_image}`} alt="" />
                                </div>
                            ))}
                        </div>:
                        <div className="hldpcT2 stories public">
                            {viewFetchStory.slice(0, 5).map((story, i) => (
                                <div key={i}>
                                    <span>
                                        {story.userData.profileimg ?
                                        <img src={`https://2wave.io/ProfilePics/${story.userData.profileimg}`} alt="" />:
                                        <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                    </span>
                                    <img src={`https://2wave.io/AGMediaStory/${story.user_story_image}`} alt="" />
                                </div>
                            ))}
                        </div>}
                    </div>
                    <div className="hldpcTop2 mobile">
                        {(userStateLogin && userDetailData != undefined) &&<div className="hldpcT2 addStory" onClick={handleAddUserStory}>
                            <img src={`https://2wave.io/ProfilePics/${viewProfileImg}`} alt="" />
                            <span>
                                <h5><IoMdAddCircle className='faIcons'/></h5>
                                <p>Add Story</p>
                            </span>
                        </div>}
                        {(userStateLogin && userDetailData != undefined) ? 
                            <div className="hldpcT2 stories">
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
                            :<div className="hldpcT2 stories public">
                                {viewFetchStory.slice(0, 4).map((story, i) => (
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
                        }
                    </div>
                </div>
                <hr />
            </section>
            <section className="highlightsPageContainer mid">
                {deletePostResponse && <div className="hlsPageContentDelete">
                    <div>
                        <p>Post Deleted Successfully.</p>
                    </div>
                </div>}
                <div className="hlsPageContent mid">
                    {viewFetchPost.map(post => (
                        <div className="hldpcMid1" key={post.user_post_id}>
                            <div className="hldpcMid1User">
                                <div className='hldpcMid1Profile'>
                                    <div>
                                        {post.userData.profileimg ?
                                        <img src={`https://2wave.io/ProfilePics/${post.userData.profileimg}`} alt="" />:
                                        <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                    </div>
                                    <span>
                                        <h6>{post.user}
                                            {post.userData.verified ? <>
                                                {post.userData.verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                                {post.userData.verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                            </>:<></>}
                                        </h6>
                                        <p>{formatDate(post.user_post_date)}</p>
                                    </span>
                                </div>
                                <div className="hldpcMid1Option">
                                    {adminLoggedIn && 
                                        <>
                                            <button><MdAdminPanelSettings className='faIcons'/></button>
                                            <button onClick={() => handleDeletePost(post)}><MdDelete className='faIcons'/></button>
                                        </>
                                    }
                                    {/* <button><MdOutlineShare className='faIcons'/></button> */}
                                </div>
                            </div>
                            <div className="hldpcMid1PostText">
                                <p>
                                    {post.user_post_text}
                                </p>
                            </div>
                            {post.user_post_image ? <div className="hldpcMid1PostImg">
                                <img id='hldpcMid1pBG' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                                <img id='hldpcMid1pImg' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                            </div>:<></>}
                        </div>
                    ))}
                    {postLoading && 
                    <>
                        <div className="hlspcmDummy">
                            <div className="hldpcMid1ProfileDummy">
                                <div></div>
                                <span>
                                    <h6></h6>
                                    <p></p>
                                </span>
                            </div>
                            <div className="hldpcMid1PostTextDummy">
                                <p></p>
                                <p></p>
                            </div>
                        </div>
                        <div className="hlspcmDummy">
                            <div className="hldpcMid1ProfileDummy">
                                <div></div>
                                <span>
                                    <h6></h6>
                                    <p></p>
                                </span>
                            </div>
                            <div className="hldpcMid1PostTextDummy">
                                <p></p>
                                <p></p>
                            </div>
                            <div className="hldpcMid1PostImgDummy"></div>
                        </div>
                        <div className="hlspcmDummy">
                            <div className="hldpcMid1ProfileDummy">
                                <div></div>
                                <span>
                                    <h6></h6>
                                    <p></p>
                                </span>
                            </div>
                            <div className="hldpcMid1PostTextDummy">
                                <p></p>
                                <p></p>
                            </div>
                            <div className="hldpcMid1PostImgDummy"></div>
                        </div>
                        <div className="hlspcmDummy">
                            <div className="hldpcMid1ProfileDummy">
                                <div></div>
                                <span>
                                    <h6></h6>
                                    <p></p>
                                </span>
                            </div>
                            <div className="hldpcMid1PostTextDummy">
                                <p></p>
                                <p></p>
                            </div>
                        </div>
                        <div className="hlspcmDummy">
                            <div className="hldpcMid1ProfileDummy">
                                <div></div>
                                <span>
                                    <h6></h6>
                                    <p></p>
                                </span>
                            </div>
                            <div className="hldpcMid1PostTextDummy">
                                <p></p>
                                <p></p>
                            </div>
                            <div className="hldpcMid1PostImgDummy"></div>
                        </div>
                        <div className="hlspcmDummy">
                            <div className="hldpcMid1ProfileDummy">
                                <div></div>
                                <span>
                                    <h6></h6>
                                    <p></p>
                                </span>
                            </div>
                            <div className="hldpcMid1PostTextDummy">
                                <p></p>
                                <p></p>
                            </div>
                            <div className="hldpcMid1PostImgDummy"></div>
                        </div>
                    </>}
                </div>
            </section>
        </div>
    )
}

export default Highlights