import React, { useEffect, useState, useCallback } from 'react'
import "../CSS/highlights.css";
import { Link } from 'react-router-dom';
import { 
    FaTimes
} from 'react-icons/fa';
import { 
    FaSquareFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
    FaTwitch,
} from "react-icons/fa6";
import { 
    MdAdminPanelSettings,
    MdDelete,
} from "react-icons/md";
import { 
    RiVerifiedBadgeFill,
} from "react-icons/ri";
import { 
    IoIosImages,
    IoMdAddCircle
} from "react-icons/io";
import { 
    GiLotus, 
    GiGhost, 
    GiCrystalShine, 
    GiPlantSeed,
    GiSharkJaws  
} from "react-icons/gi";
import axios from 'axios';
import YouTubeEmbed from './YouTubeEmbed';
import HashtagHighlighter from './HashtagHighlighter';
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
const isWithinLastTwelveHours = (date) => {
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
    return new Date(date) >= twelveHoursAgo;
};
const isWithinLastThreeDays = (date) => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(date) >= threeDaysAgo;
};
const fetchUserData = async (url, filterFunc) => {
    try {
        const response = await axios.get(url);
        const filteredData = response.data.filter(item => filterFunc(item.user_post_date || item.user_story_date));
        const sortedData = filteredData.sort((a, b) => new Date(b.user_post_date || b.user_story_date) - new Date(a.user_post_date || a.user_story_date));
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
        fetchUserData(`${AGUserStoryAPI}?offset=${offset}&limit=${PAGE_SIZE}`, isWithinLastTwelveHours),
        fetchUserData(`${AGUserPostAPI}?offset=${offset}&limit=${PAGE_SIZE}`, isWithinLastThreeDays)
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
    const userDetailData = localStorage.getItem('profileDataJSON');
    const AGUserDeletePostAPI = process.env.REACT_APP_AG_DELETE_USER_POST_API;
    
    const [userLoggedData, setUserLoggedData] = useState('')
    const [viewFetchPost, setViewFetchPost] = useState([]);
    const [viewFetchStory, setViewFetchStory] = useState([]);
    const [postLoading, setPostLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [viewProfileDetails, setViewProfileDetails] = useState(false);
    const [selectedPostData, setSelectedPostData] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    const handleScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        if (!postLoading && scrollTop + clientHeight >= scrollHeight * 0.5) {
            setOffset(prevOffset => prevOffset + PAGE_SIZE);
        }
    }, [postLoading]);

    const fetchUserProfile = () => {
        const storedProfileData = localStorage.getItem('profileDataJSON');
        if (storedProfileData) {
            setUserLoggedData(JSON.parse(storedProfileData));
        }
    }

    useEffect(() => {
        if (initialLoad || offset !== 0) {
            fetchAllUserData(setViewFetchStory, setViewFetchPost, offset, setPostLoading);
            setInitialLoad(false);
        }
        if (userStateLogin && userDetailData !== undefined){
            fetchUserProfile()
        }
    }, [offset, initialLoad]);

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
    const handleViewProfileDetails = (user_post_id) => {
        const viewProfileDetailsID = viewFetchPost.find(post => post.user_post_id === user_post_id)
        setSelectedPostData(viewProfileDetailsID);
        setViewProfileDetails(true);
    }
    const handleCloseDetails = () => {
        setViewProfileDetails(false);
    }


    return (
        <div className='mainContainer highlights'>
            {addPostStory && <UserStoryModal setAddPostStory={setAddPostStory}/>}
            {addUserPost && <UserPostModal setAddUserPost={setAddUserPost}/>}
            {addUserPost2 && <UserPostModal2 setAddUserPost2={setAddUserPost2}/>}

            {viewProfileDetails && <div className="highlightProfileModal">
                {selectedPostData && <div className="highlightProfileDetails"
                style={selectedPostData.userData.coverimg ? {background: `linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/${selectedPostData.userData.coverimg})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}
                :{background: 'linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <button id='closeModalProfile' onClick={handleCloseDetails}><FaTimes className='faIcons'/></button>
                    <div className="hpdPostContent left">
                        <div>
                            {selectedPostData.userData.profileimg ?
                            <img src={`https://2wave.io/ProfilePics/${selectedPostData.userData.profileimg}`} alt="" />:
                            <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                        </div>
                    </div>
                    <div className="hpdPostContent right">
                        <h4>
                            {selectedPostData.user}
                            {selectedPostData.userData.verified ? <>
                                {selectedPostData.userData.verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                {selectedPostData.userData.verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                            </>:<></>}
                        </h4>
                        <h6>{selectedPostData.userData.email} {selectedPostData.userData.refcode ? `• ${selectedPostData.userData.refcode}` : ''}</h6>
                        {(selectedPostData.userData.facebook || selectedPostData.userData.instagram || selectedPostData.userData.tiktok || selectedPostData.userData.youtube || selectedPostData.userData.twitch) && 
                        <div className="hpdpcSocials">
                            {selectedPostData.userData.facebook && <a href={selectedPostData.userData.facebook} target='blank'><FaSquareFacebook className='faIcons'/></a>}
                            {selectedPostData.userData.instagram && <a href={selectedPostData.userData.instagram} target='blank'><FaInstagram className='faIcons'/></a>}
                            {selectedPostData.userData.tiktok && <a href={selectedPostData.userData.tiktok} target='blank'><FaTiktok className='faIcons'/></a>}
                            {selectedPostData.userData.youtube && <a href={selectedPostData.userData.youtube} target='blank'><FaYoutube className='faIcons'/></a>}
                            {selectedPostData.userData.twitch && <a href={selectedPostData.userData.twitch} target='blank'><FaTwitch className='faIcons'/></a>}
                        </div>}
                        <div className="hpdpcBadge">
                            {selectedPostData.userData.developer && <p className='developer'><GiLotus className='faIcons'/> Developer</p>}
                            {selectedPostData.userData.admod && <p className='moderator'><GiGhost className='faIcons'/> Moderator</p>}
                            {selectedPostData.userData.verified && <p className='verified'><GiCrystalShine className='faIcons'/> Verified</p>}
                            {selectedPostData.userData.adpioneer && <p className='pioneer'><GiPlantSeed className='faIcons'/> Pioneer</p>}
                            {selectedPostData.userData.adshark && <p className='shark'><GiSharkJaws className='faIcons'/> Shark</p>}
                        </div>
                    </div>
                </div>}
            </div>}


            <section className="highlightsPageContainer top">
                <div className="hlsPageContent top">
                    {(userStateLogin && userDetailData != undefined) && <div className="hldpcTop1">
                        <div className="hldpct1">
                            <div>
                                <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt="" />
                            </div>
                            <input type="text" placeholder='Post about a Gameplay...' readOnly onClick={handleAddUserPost}/>
                            <button id='postAStory'><IoIosImages className='faIcons' onClick={handleAddUserPost2}/></button>
                        </div>
                    </div>}
                    <div className="hldpcTop2 website">
                        {(userStateLogin && userDetailData != undefined) && <div className="hldpcT2 addStory" onClick={handleAddUserStory}>
                            <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt="" />
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
                            <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt="" />
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
                    {viewFetchPost.map((post, i) => (
                        <div className="hldpcMid1" key={i}>
                            <div className="hldpcMid1User">
                                <div className='hldpcMid1Profile'>
                                    <div className='hldpcMid1ProfileImg' onClick={() => handleViewProfileDetails(post.user_post_id)}>
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
                                <HashtagHighlighter text={post.user_post_text}/>
                                {/* <p>
                                    {post.user_post_text}
                                </p> */}
                            </div>
                            {post.user_post_image ? <div className="hldpcMid1PostImg">
                                <img id='hldpcMid1pBG' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                                <img id='hldpcMid1pImg' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                            </div>:<></>}
                            {post.user_post_youtube ? <div className="hldpcMid1PostYT">
                                <YouTubeEmbed videoUrl={post.user_post_youtube} />
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