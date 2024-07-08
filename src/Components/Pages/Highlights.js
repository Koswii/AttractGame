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
    FaRegComment
} from "react-icons/fa6";
import { 
    MdAdminPanelSettings,
    MdDelete,
} from "react-icons/md";
import { 
    RiVerifiedBadgeFill,
} from "react-icons/ri";
import { 
    IoIosCloseCircle,
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
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai";
import { PiGifFill } from "react-icons/pi";
import axios from 'axios';
import YouTubeEmbed from './YouTubeEmbed';
import HashtagHighlighter from './HashtagHighlighter';
import UserPostModal from './UserPostModal';
import UserPostModal2 from './UserPostModal2';
import UserStoryModal from './UserStoryModal';
import { HighlightsFetchData } from './HighlightsFetchContext';
import { RiEmojiStickerFill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import GifPicker from 'gif-picker-react';



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
  
    const currentDateNoTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const givenDateNoTime = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());
  
    const timeDifference = currentDateNoTime - givenDateNoTime;
    const oneDay = 24 * 60 * 60 * 1000;
  
    if (timeDifference === 0) {
      return "Today";
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


const isWithinLastWeek = (date) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(date) >= oneWeekAgo;
};

const fetchUserData = async (url, filterFunc) => {
    try {
        const response = await axios.get(url);
        const filteredData = response.data.filter(item => filterFunc(item.user_post_date || item.user_story_date));
        const sortedData = filteredData.sort((a, b) => new Date(b.user_post_date || b.user_story_date) - new Date(a.user_post_date || a.user_story_date));
        const userDataResponse = await axios.get(AGUserDataAPI);
        const dataWithUserData = sortedData.map(item => {
            const userData = userDataResponse.data.find(user => user.userid === item.user_id);
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
        // fetchUserData(`${AGUserPostAPI}?offset=${offset}&limit=${PAGE_SIZE}`, isWithinLastThreeDays),
        fetchUserData(`${AGUserPostAPI}?offset=${offset}&limit=${PAGE_SIZE}`, isWithinLastWeek)
    ]);

    if (storyData.length > 0 || postData.length > 0) {
        setViewFetchStory(prevData => {
            const newStoryData = storyData.filter(newStory => !prevData.some(prevStory => prevStory.user_story_id === newStory.user_story_id));
            return [...prevData, ...newStoryData];
        });
        setViewFetchPost(prevData => [...prevData, ...postData]);
    } else {
        console.log('No story and post uploaded');
    }
    setLoading(false);
};



const Highlights = () => {
    const {
        userStateLogin, 
        adminLoggedIn,
        userDetailData,
        userLoggedData,
        fetchUserProfile,
    } = HighlightsFetchData();

    const AGUserDeletePostAPI = process.env.REACT_APP_AG_DELETE_USER_POST_API;
    const [viewFetchPost, setViewFetchPost] = useState([]);
    const [viewFetchStory, setViewFetchStory] = useState([]);
    const [postLoading, setPostLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [viewProfileDetails, setViewProfileDetails] = useState(false);
    const [selectedPostData, setSelectedPostData] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [userData,setUserdata] = useState()

    const handleScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        if (!postLoading && scrollTop + clientHeight >= scrollHeight * 0.8) {
            setOffset(prevOffset => prevOffset + PAGE_SIZE);
        }
    }, [postLoading]);

    useEffect(() => {
        if (initialLoad || offset !== 0) {
            fetchAllUserData(setViewFetchStory, setViewFetchPost, offset, setPostLoading);
            setInitialLoad(false);
        }
        if (userStateLogin && userDetailData) {
            const data = JSON.parse(userDetailData);
            setUserdata(data);
            fetchUserProfile();
            fetchPost();
        }

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [offset, initialLoad, handleScroll]);


    
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


    const [currentStory, setCurrentStory] = useState(null);
    const [seenStories, setSeenStories] = useState([]);


    const handleStoryClick = (story) => {
        setCurrentStory(story);
    };
    const handleCloseModal = () => {
        setSeenStories([...seenStories, currentStory.id]);
        setCurrentStory(null);
    };
    
    useEffect(() => {
        let timer;
        if (currentStory !== null) {
            timer = setTimeout(() => {
                const currentIndex = viewFetchStory.findIndex((story) => story.id === currentStory.id);
                const nextIndex = (currentIndex + 1) % viewFetchStory.length;
                const nextStory = viewFetchStory[nextIndex];
                setSeenStories([...seenStories, currentStory.id]);
                setCurrentStory(nextStory);
            }, 3000);
        } else {
            setPostLoading(false)
            setVisiblestories([])
        }
        return () => clearTimeout(timer);
    }, [currentStory, viewFetchStory, seenStories]);

    const [visibleStories, setVisiblestories] = useState()
    useEffect(() => {
        if (seenStories.length === viewFetchStory.length && seenStories.length > 0) {
            setSeenStories([]);
        }
        
        const visibleStory = viewFetchStory.filter(story => !seenStories.includes(story.id));
        setVisiblestories(visibleStory)
    }, [seenStories, viewFetchStory]);

    

    const likePost = process.env.REACT_APP_AG_USERS_LIKE_POST_API;
    const [likeCount,setLikecount] = useState(0)
    const [clickCount,setClickCount] = useState(0)
    

    // Function to calculate time difference
    const calculateTimeDifference = (registeredTimestamp) => {
        const currentTime = new Date();
        const registeredTime = new Date(registeredTimestamp);

        const differenceInMilliseconds = currentTime - registeredTime;

        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);
        const differenceInWeeks = Math.floor(differenceInDays / 7);

        if (differenceInWeeks > 0) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return registeredTime.toLocaleDateString(undefined, options);
        } else if (differenceInDays > 0) {
        return `${differenceInDays} day${differenceInDays > 1 ? "s" : ""} ago`;
        } else if (differenceInHours > 0) {
        return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
        } else if (differenceInMinutes > 0) {
        return `${differenceInMinutes} minute${
            differenceInMinutes > 1 ? "s" : ""
        } ago`;
        } else {
        return `${differenceInSeconds} second${
            differenceInSeconds > 1 ? "s" : ""
        } ago`;
        }
  };

  const fetchPost = async () => {
    try {
        const commentDataResponse = await fetch(process.env.REACT_APP_AG_USERS_COMMENTS);
        const commentData = await commentDataResponse.json();
        const userDataResponse = await fetch(process.env.REACT_APP_AG_USERS_PROFILE_API);
        const userDatas = await userDataResponse.json();

        // If userData is a single object
        const mappedPost = viewFetchPost.map((post) => {
            const likesData = JSON.parse(post.user_post_like);
            const likeCount = likesData.likeCount || 0;
            const likedBy = Array.isArray(likesData.likedBy) ? likesData.likedBy : [];
            const isLiked = likedBy.includes(userLoggedData.userid);

            const commentsForPost = commentData
                .filter(comment => comment.user_post_id === post.user_post_id)
                .map(comment => {
                    const timeDiff = calculateTimeDifference(comment.timestamp);
                    const userDataForComment = userDatas.find(user => user.userid === comment.user_id);
                    if (!userDataForComment) {
                      console.error(`No user data found for comment with customerID: ${comment.customerID}`);
                    }

                    return {
                        ...comment,
                        timeDiffcom: timeDiff,
                        userData: userDataForComment
                    };
                });

            return {
                ...post,
                likes: likeCount,
                isLiked: isLiked,
                likedBy,
                comments: commentsForPost
            };
        });

        if (viewFetchPost.length > 0) {
            setViewFetchPost(mappedPost);
        }
    } catch (error) {
        console.error("Error fetching posts or comments:", error);
    }
};



    const toggleLike = async (isLiked, user_post_id) => {
        setClickCount(clickCount + 1);
        if (clickCount <= 5) {
            const likeData = {
                postId: user_post_id,
                customerId: userLoggedData.userid,
                isLiked: !isLiked,
            };
    
            // Optimistically update the UI
            const updatedPosts = viewFetchPost.map((post) => {
                if (post.user_post_id === user_post_id) {
                    return {
                        ...post,
                        likes: post.likes + (isLiked ? -1 : 1),
                        isLiked: !isLiked,
                    };
                }
                return post;
            });
            setViewFetchPost(updatedPosts);
    
            try {
                const response = await axios.post(likePost, likeData);
                const updatedLikes = response.data;
                
                // Reconcile with the response from the server
                const finalUpdatedPosts = viewFetchPost.map((post) => {
                    if (post.user_post_id === user_post_id) {
                        return {
                            ...post,
                            likes: updatedLikes.likeCount,
                            isLiked: !isLiked,
                        };
                    }
                    return post;
                });
                setViewFetchPost(finalUpdatedPosts);
            } catch (error) {
                console.error("Error toggling like:", error);
                // Revert optimistic update if there's an error
                const revertedPosts = viewFetchPost.map((post) => {
                    if (post.user_post_id === user_post_id) {
                        return {
                            ...post,
                            likes: post.likes + (isLiked ? 1 : -1),
                            isLiked: isLiked,
                        };
                    }
                    return post;
                });
                setViewFetchPost(revertedPosts);
            }
        } else {
            alert('Click disabled');
        }
    };

    
    // comment
    const [commentValue, setCommentvalue ] = useState([''])
    const [openGIF, setOpenGif] = useState(null)
    const [displayGif,setDisplaygif] = useState(null)
    const [gifvalue,setGifvalue] = useState(null)

    const [openEMOJI, setOpenemoji] = useState(null)

    const commentIDGenerator = (length) => {
        const charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          result += charset.charAt(randomIndex);
        }
        return result;
      };
    
    // comment 
    const handleCommentChange = (index, value) => {
        setCommentvalue((prev) => ({
        ...prev,
        [index]: value,
        }));
    };

    const handleGifSelect = (gif, index) => {
        setGifvalue(gif.url);
        setDisplaygif(index);
        setOpenGif(null)
    };

    const handleEmojiSelect = (emoji, index) => {
        setCommentvalue((prev) => ({
        ...prev,
        [index]: (prev[index] || '') + emoji.emoji,
        }));
        setOpenGif(null)
    };

    const removeGIF = () => {
        setGifvalue('');
        setDisplaygif(null);
    };

    const openGif = (index) => {
        setOpenGif((prev) => (prev === index ? null : index));
        setOpenemoji(null)
    };

    const openEmoji = (index) => {
        setOpenemoji((prev) => (prev === index ? null : index));
        setOpenGif(null)
    };


    const commentSubmit = async (e,postid,index) => {
        e.preventDefault();

        const commentPost = process.env.REACT_APP_AG_USERS_ADD_COMMENT

        const generatedID = "agComment" + userData.username + commentIDGenerator(20)

        const dataComment = {
            customerID: userData.userid,
            postID: postid,
            commentID: generatedID,
            image: gifvalue === null ? "" : gifvalue,
            comment: commentValue[index]
        }
        const response = await axios.post(commentPost,dataComment)
        fetchPost()
        setCommentvalue("")
        setGifvalue('');
        setDisplaygif(null);
    }
    return (
        <div className='mainContainer highlights'>
            {addPostStory && <UserStoryModal setAddPostStory={setAddPostStory}/>}
            {addUserPost && <UserPostModal setAddUserPost={setAddUserPost}/>}
            {addUserPost2 && <UserPostModal2 setAddUserPost2={setAddUserPost2}/>}
            {viewProfileDetails && <div className="highlightProfileModal">
                {selectedPostData && <div className="highlightProfileDetails"
                style={selectedPostData.userData.coverimg ? {background: `linear-gradient(transparent, black 70%), url(https://2wave.io/CoverPics/${selectedPostData.userData.coverimg.replace(/ /g, '%20')})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}
                :{background: 'linear-gradient(transparent, black 80%), url(https://2wave.io/CoverPics/LoginBackground.jpg)', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
                    <button id='closeModalProfile' onClick={handleCloseDetails}><FaTimes className='faIcons'/></button>
                    <div className="hpdPostContent left">
                        <div>
                            {selectedPostData.userData.profileimg ?
                            <img src={`https://2wave.io/ProfilePics/${selectedPostData.userData.profileimg}`} alt="" />:
                            <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                            {/* <img className='verifiedFire' src={require('../assets/imgs/Verified/FireGIF.gif')} alt="" /> */}
                        </div>
                    </div>
                    <div className="hpdPostContent right">
                        <h4>
                            {selectedPostData.userData.username}
                            {selectedPostData.userData.verified ? <>
                                {selectedPostData.userData.verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                {selectedPostData.userData.verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                            </>:<></>}
                        </h4>
                        <h6>{selectedPostData.userData.bio ? selectedPostData.userData.bio : 'No Bio Added'}</h6>
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
                    <div className="hpdpcSpecialVerified">
                        {/* <img className='verifiedSnow' src={require('../assets/imgs/Verified/SnowGIF.gif')} alt="" /> */}
                        {/* <img className='verifiedFire' src={require('../assets/imgs/Verified/FireGIF.gif')} alt="" /> */}
                        {/* <img className='verifiedNarutoSage' src={require('../assets/imgs/Verified/NarutoSageGIF.gif')} alt="" /> */}
                        {/* <img className='verifiedZelda' src={require('../assets/imgs/Verified/ZeldaGIF.gif')} alt="" /> */}
                        {/* <img className='verifiedCharizard' src={require('../assets/imgs/Verified/CharizardGIF.gif')} alt="" /> */}
                        {/* <img className='verifiedMegaman' src={require('../assets/imgs/Verified/MegamanGIF.gif')} alt="" /> */}
                        {/* <img className='verifiedLuffy' src={require('../assets/imgs/Verified/LuffyGIF.gif')} alt="" /> */}
                    </div>
                </div>}
            </div>}

            {currentStory && <div className="modalContainerProfile showStory">
                <div className="modalContentStory">
                    {currentStory.userData.coverimg ? 
                    <img id='modalCSCover' src={`https://2wave.io/CoverPics/${currentStory.userData.coverimg.replace(/ /g, '%20')}`} alt="" />
                    :<img id='modalCSCover' src={require('../assets/imgs/LoginBackground.jpg')} alt="" />}
                    <div className="modalCSCoverShadow"></div>
                    <button id='closeModalStory' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
                    <div className="mdcsStoryContainer show">
                        <div className='mdcsscDP'>
                            {currentStory.userData.profileimg ? 
                            <>
                                <div>
                                    <img src={`https://2wave.io/ProfilePics/${currentStory.userData.profileimg}`} alt=""/>
                                </div>
                            </>
                            :<>
                                <div>
                                    <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>
                                </div>
                            </>}
                            <h6>
                                {currentStory.userData.username} 
                                {currentStory.userData.verified ? <>
                                    {currentStory.userData.verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                    {currentStory.userData.verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                </>:<></>} <br />
                                <span>{currentStory.userData.refcode}</span>
                            </h6>
                        </div>
                        <img src={`https://2wave.io/AGMediaStory/${currentStory.user_story_image}`} alt="" />
                    </div>
                </div>
            </div>}

            {(userStateLogin && userDetailData !== undefined) ? 
            <section className="highlightsPageContainer top">
                <div className="hlsPageContent top">
                    {(userStateLogin && userDetailData !== undefined) && <div className="hldpcTop1">
                        <div className="hldpct1">
                            <div>
                                {userLoggedData.profileimg ?
                                <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt="" />:
                                <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                            </div>
                            <input type="text" placeholder='Post about a Gameplay...' readOnly onClick={handleAddUserPost}/>
                            <button id='postAStory'><IoIosImages className='faIcons' onClick={handleAddUserPost2}/></button>
                        </div>
                    </div>}
                    <div className="hldpcTop2 website">
                        {(userStateLogin && userDetailData !== undefined) && <div className="hldpcT2 addStory" onClick={handleAddUserStory}>
                            {userLoggedData.profileimg ?
                            <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt="" />:
                            <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                            <span>
                                <h5><IoMdAddCircle className='faIcons'/></h5>
                                <p>Add Story</p>
                            </span>
                        </div>}
                        {(userStateLogin && userDetailData !== undefined) ? 
                        <div className="hldpcT2 stories">
                            {!postLoading ?
                            <>{visibleStories.slice(0, 4).map((story, i) => (
                                <div key={i} onClick={() => handleStoryClick(story)}>
                                    <span>
                                        {story.userData.profileimg ?
                                        <img src={`https://2wave.io/ProfilePics/${story.userData.profileimg}`} alt="" />:
                                        <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                    </span>
                                    <img src={`https://2wave.io/AGMediaStory/${story.user_story_image}`} alt="" />
                                </div>
                            ))}</>:<>
                            <div className="hldpcT2Dummy"><span></span></div>
                            <div className="hldpcT2Dummy"><span></span></div>
                            <div className="hldpcT2Dummy"><span></span></div>
                            <div className="hldpcT2Dummy"><span></span></div>
                            </>}
                        </div>:
                        <div className="hldpcT2 stories public">
                            {!postLoading ?
                            <>{visibleStories.slice(0, 5).map((story, i) => (
                                <div key={i} onClick={() => handleStoryClick(story)}>
                                    <span>
                                        {story.userData.profileimg ?
                                        <img src={`https://2wave.io/ProfilePics/${story.userData.profileimg}`} alt="" />:
                                        <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                    </span>
                                    <img src={`https://2wave.io/AGMediaStory/${story.user_story_image}`} alt="" />
                                </div>
                            ))}</>:<>
                            <div className="hldpcT2Dummy"><span></span></div>
                            <div className="hldpcT2Dummy"><span></span></div>
                            <div className="hldpcT2Dummy"><span></span></div>
                            <div className="hldpcT2Dummy"><span></span></div>
                            <div className="hldpcT2Dummy"><span></span></div>
                            </>}
                        </div>}
                    </div>
                    <div className="hldpcTop2 mobile">
                        {(userStateLogin && userDetailData !== undefined) &&<div className="hldpcT2 addStory" onClick={handleAddUserStory}>
                            <img src={`https://2wave.io/ProfilePics/${userLoggedData.profileimg}`} alt="" />
                            <span>
                                <h5><IoMdAddCircle className='faIcons'/></h5>
                                <p>Add Story</p>
                            </span>
                        </div>}
                        {(userStateLogin && userDetailData !== undefined) ? 
                            <div className="hldpcT2 stories">
                                {!postLoading ?
                                <>{visibleStories.slice(0, 3).map((story, i) => (
                                    <div key={i} onClick={() => handleStoryClick(story)}>
                                        <span>
                                            {story.userData.profileimg ?
                                            <img src={`https://2wave.io/ProfilePics/${story.userData.profileimg}`} alt="" />:
                                            <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                        </span>
                                        <img src={`https://2wave.io/AGMediaStory/${story.user_story_image}`} alt="" />
                                    </div>
                                ))}</>:<>
                                <div className="hldpcT2Dummy"><span></span></div>
                                <div className="hldpcT2Dummy"><span></span></div>
                                <div className="hldpcT2Dummy"><span></span></div>
                                </>}
                            </div>
                            :<div className="hldpcT2 stories public">
                                {!postLoading ?
                                <>{visibleStories.slice(0, 4).map((story, i) => (
                                    <div key={i} onClick={() => handleStoryClick(story)}>
                                        <span>
                                            {story.userData.profileimg ?
                                            <img src={`https://2wave.io/ProfilePics/${story.userData.profileimg}`} alt="" />:
                                            <img src={require('../assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
                                        </span>
                                        <img src={`https://2wave.io/AGMediaStory/${story.user_story_image}`} alt="" />
                                    </div>
                                ))}</>:<>
                                <div className="hldpcT2Dummy"><span></span></div>
                                <div className="hldpcT2Dummy"><span></span></div>
                                <div className="hldpcT2Dummy"><span></span></div>
                                <div className="hldpcT2Dummy"><span></span></div>
                                </>}
                            </div>
                        }
                    </div>
                </div>
                <hr />
            </section>:<><section className="highlightsPageContainer top"></section></>}
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
                                        <h6>{post.userData.username}
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
                            </div>
                            {post.user_post_image ? <div className="hldpcMid1PostImg">
                                <img id='hldpcMid1pBG' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                                <img id='hldpcMid1pImg' src={`https://2wave.io/AGMediaPost/${post.user_post_image}`} alt="" />
                            </div>:<></>}
                            {post.user_post_youtube ? <div className="hldpcMid1PostYT">
                                <YouTubeEmbed videoUrl={post.user_post_youtube} />
                            </div>:<></>}
                            <div className="hldpcMid1-rct-container">
                                <div className="hldpcMid1-rct-containents">
                                    <ul>
                                        {userDetailData === null ? 
                                        <li id='likereactIcons'>
                                            {post.isLiked ? (
                                                <AiFillLike className='likeIcon'/>
                                            ) : (
                                                <AiOutlineLike className='likeIcon'  />
                                            )}
                                            <p>{post.likes !== 0 ? post.likes : ''}</p>
                                        </li>
                                        :
                                        <li id='likereactIcons' onClick={() => toggleLike(post.isLiked, post.user_post_id)} disabled={clickCount >= 5}>
                                            {post.isLiked ? (
                                                <AiFillLike className='likeIcon'/>
                                            ) : (
                                                <AiOutlineLike className='likeIcon'  />
                                            )}
                                            <p>{post.likes !== 0 ? post.likes : ''}</p>
                                        </li>
                                        }
                                        <li id='commentreactIcons'>
                                            <FaRegComment className='commenIcon'/>
                                            {post.comments &&(<p>{post.comments.length === 0 ? "" : post.comments.length}</p>)}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {userData &&(
                            <>
                            <form onSubmit={(e) => commentSubmit(e,post.user_post_id,i)}>
                                <div className="hldpcMid1-comment-input">
                                    <img src={`https://2wave.io/ProfilePics/${userData.profileimg}`} alt="" id='comPrfimg'/>
                                    <span>
                                        <section>
                                            <ul>
                                                <input type="text" placeholder={`comment as ${userData.username}`} value={commentValue[i] ?? ''} onChange={(e) => handleCommentChange(i, e.target.value)}/>
                                                <li onClick={() => openGif(i)}><PiGifFill /></li>
                                                <li onClick={() => openEmoji(i)}><RiEmojiStickerFill /></li>
                                                {openGIF === i && (
                                                    <div className="gifPick">
                                                        <GifPicker tenorApiKey={"AIzaSyCbguq2zBSDlAwuHH4lIcZNtFA47Q6ycBY"} height={400} width={350} onGifClick={(gif) => handleGifSelect(gif, i)} />
                                                    </div>
                                                )}
                                            </ul>
                                        </section>
                                        {openEMOJI === i && (
                                            <div className="emojiPick">
                                                <EmojiPicker height={500} width={300} onEmojiClick={(emoji) => handleEmojiSelect(emoji, i)} />
                                            </div>
                                        )}
                                        {displayGif === i && (
                                            <div className="gifSelected">
                                                <IoIosCloseCircle id="removeGif" onClick={removeGIF} />
                                                <img src={gifvalue} alt="" />
                                            </div>
                                        )}
                                    </span>
                                </div>
                            </form>
                            {post.comments && (
                                <div className="prContent-Comments">
                                    <ul>
                                    {post.comments
                                        .sort((a, b) => {
                                        const timestampA = new Date(a.timestamp).getTime();
                                        const timestampB = new Date(b.timestamp).getTime();
                                        return timestampB - timestampA; // Sort in descending order by timestamp
                                        })
                                        .slice(0, 3) // Take the first three comments after sorting
                                        .map((comment, i) => (
                                        <li key={i}>
                                            <div className="comPrfpic">
                                                <img src={`https://2wave.io/ProfilePics/${comment.userData.profileimg}`} alt="User" />
                                            </div>
                                            <span>
                                                <h2>
                                                    {comment.userData.username}
                                                    {comment.userData.verified ? <>
                                                        {comment.userData.verified === 'Gold' ? <RiVerifiedBadgeFill className='faIcons gold'/> : <></>}
                                                        {comment.userData.verified === 'Blue' ? <RiVerifiedBadgeFill className='faIcons blue'/> : <></>}
                                                    </>:<></>}
                                                </h2>
                                                <h1>{comment.user_comment}</h1>
                                                {comment.user_comment_image && (
                                                    <div className="commImg">
                                                    <img src={comment.user_comment_image} alt="" />
                                                    </div>
                                                )}
                                                {/* <p>{comment.timeDiffcom}</p> */}
                                            </span>
                                        </li>
                                        ))}
                                    {/* {post.comments.length > 3 && (
                                        <div className="rmComments">
                                        <p>Read more comments</p>
                                        </div>
                                    )} */}
                                    </ul>
                                </div>
                            )}
                            </>
                            )}
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