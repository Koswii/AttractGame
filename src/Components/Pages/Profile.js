import React, { useState } from 'react'
import "../CSS/profile.css";
import { Link } from 'react-router-dom';
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
    FaTimes
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
    TbGiftCardFilled,
    TbSettings2,
    TbSettingsBolt   
} from "react-icons/tb";
import { 
    RiVerifiedBadgeFill,
    RiSparklingFill  
} from "react-icons/ri";
import { 
    IoLogoYoutube,
    IoIosImages,
    IoMdAddCircle  
} from "react-icons/io";

const Profile = () => {

    const [pickProfileImg00, setPickProfileImg00] = useState('DefaultProfilePic.png');
    const [editSocialsModal, setEditSocialsModal] = useState(false);
    const [addUserPost, setAddUserPost] = useState(false);
    const [addPostYoutubeLink, setAddPostYoutubeLink] = useState(false);
    const [addPostMedia, setAddPostMedia] = useState(false);
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
        setAddUserPost(true)
        setAddPostMedia(true)
    }
    const handleAddUserStory = () => {
        setAddPostStory(true)
    }
    const handleCloseAnyModals = () => {
        setEditSocialsModal(false)
        setAddUserPost(false)
        setAddPostStory(false)
        setAddPostYoutubeLink(false)
        setAddPostMedia(false)
        setImageStory(null)
    }
    const handlePostYoutubeLink = () => {
        setAddPostYoutubeLink(true)
    }
    const closeAddYoutubeLink = () => {
        setAddPostYoutubeLink(false)
    }
    const handlePostMedia = () => {
        setAddPostMedia(true)
    }
    const closeAddPostMedia = () => {
        setAddPostMedia(false)
        setImage(null);
    }

    
    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    const [imageDP, setImageDP] = useState(null);
    const handleUploadUserDP = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageDP(file);
        }
    };
    const [imageStory, setImageStory] = useState(null);
    const handleUploadUserStory = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageStory(file);
        }
    };
    const handleRemoveUserImage = () => {
        setImage(null)
        setImageDP(null);
        setImageStory(null)
    };

    return (
        <div className='mainContainer profile'>
            {editSocialsModal && <div className="modalContainerProfile settings">
                <div className="modalContentProfile">
                    <button id='closeModalSettings' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                    <div className="mdcpSettingsContainer">
                        <div className="mdcpsContent left">
                            <div className='mdcpscProfileDP'>
                                {!imageDP ?
                                <>
                                    <img src={`https://engeenx.com/ProfilePics/${pickProfileImg00 ? pickProfileImg00 : 'DefaultProfilePic.png'}`} alt="" />
                                    <input type="text" value={pickProfileImg00} readOnly disabled/>
                                </>:
                                <>
                                    <img src={URL.createObjectURL(imageDP)} alt="No image Selected" />
                                    <button onClick={handleRemoveUserImage}><FaTimes className='faIcons'/></button>
                                </>}
                            </div>
                            <div className='mdcpscSampleProfile'>
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
                            </div>
                            <div className='mdcpscCustomProfile'>
                                <p>Choose from Computer</p>
                                <input type="file" onChange={handleUploadUserDP}/>
                            </div>
                        </div>
                        <div className="mdcpsContent right">
                            <h4>Koswi <RiVerifiedBadgeFill className='faIcons'/></h4>
                            <p>djmaglaqui@gmail.com</p>
                            <div className="mdcpccrSocials">
                                <h6>ADD/EDIT SOCIALS</h6>
                                <div>
                                    <span>
                                        <label htmlFor=""><p><FaSquareFacebook className='faIcons'/> Facebook</p></label>
                                        <input type="text" placeholder='Facebook Profile Link'/>
                                    </span>
                                    <span>
                                        <label htmlFor=""><p><FaInstagram className='faIcons'/> Instagram</p></label>
                                        <input type="text" placeholder='Instagram Profile Link'/>
                                    </span>
                                    <span>
                                        <label htmlFor=""><p><FaTiktok className='faIcons'/> TikTok</p></label>
                                        <input type="text" placeholder='TikTok Profile Link'/>
                                    </span>
                                    <span>
                                        <label htmlFor=""><p><FaYoutube className='faIcons'/> YouTube</p></label>
                                        <input type="text" placeholder='YouTube Channel Link'/>
                                    </span>
                                    <span>
                                        <label htmlFor=""><p><FaTwitch className='faIcons'/> Twitch</p></label>
                                        <input type="text" placeholder='Twitch Channel Link'/>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mdcpccrSubmit">
                        <button id='mdcpccrsVerified'>APPLY SUBSCRIPTION <RiSparklingFill className='faIcons'/></button>
                        <button id='mdcpccrsSubmit' type='submit'>Update Profile</button>
                    </div>
                </div>
            </div>}
            {addUserPost && <div className="modalContainerProfile posting">
                <div className="modalContentPosting">
                    <button id='closeModalPosting' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                    <div className="mdcpPostingContainer">
                        <div className='mdcppcPostUser'>
                            <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                            <span>
                                <h5>Koswi <RiVerifiedBadgeFill className='faIcons'/></h5>
                                <p>AG_Koswi</p>
                            </span>
                        </div>
                        <div className="mdcppcPostContent">
                            <div className='mdcppcpcPost'>
                                <textarea name="" id="" maxLength={150} placeholder='Post about your Gameplay...'></textarea>
                                <p>1 / 250</p>
                            </div>
                            {addPostYoutubeLink && <div className="mdcppcpcAddition youtube">
                                <input type="text" placeholder='Place YouTube Link here...'/>
                                <button onClick={closeAddYoutubeLink}><FaTimes className='faIcons'/></button>
                            </div>}
                            {addPostMedia && <div className="mdcppcpcAddition media">
                                <div className='mdcppcpcaMedia'>
                                    <div>
                                        {image ? 
                                            <img src={URL.createObjectURL(image)} alt="No image Selected" /> :
                                            <h6>Select/Drop Image or Video only</h6>
                                        }
                                    </div>
                                    <input type="file" onChange={handleFileInputChange}/>    
                                </div>
                                <button onClick={closeAddPostMedia}><FaTimes className='faIcons'/></button>
                            </div>}
                        </div>
                        <div className="mdcppcPostButton">
                            <div className='mdcppcpb left'>
                                <button className={addPostYoutubeLink ? 'active' : ''} onClick={handlePostYoutubeLink}><IoLogoYoutube className='faIcons'/></button>
                                <button className={addPostMedia ? 'active' : ''} onClick={handlePostMedia}><IoIosImages className='faIcons'/></button>
                            </div>
                            <div className='mdcppcpb right'>
                                <button>Post Highlight</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            {addPostStory && <div className="modalContainerProfile addStory">
                <div className="modalContentStory">
                    <button id='closeModalStory' onClick={handleCloseAnyModals}><FaTimes className='faIcons'/></button>
                    <div className="mdcsStoryContainer">
                        {imageStory ? 
                            <img src={URL.createObjectURL(imageStory)} alt="No image Selected" /> :
                            <h6>Add Gamer Story...</h6>
                        }
                        <input type="file" onChange={handleUploadUserStory}/>
                        <button><FaCircleCheck className='faIcons'/></button>
                    </div>
                </div>
            </div>}


            <section className="profilePageContainer top">
                <img src={require('../assets/imgs/DefaultProfile.jpg')} alt="" />
                <div></div>
            </section>
            <section className="profilePageContainer mid">
                <div className="profilePageContent left">
                    <div className='ppclProfilePic'>
                        <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" onClick={handleOpenSocialSettings}/>
                    </div>
                    <div className="ppclProfileName">
                        <h5>Koswi <RiVerifiedBadgeFill className='faIcons'/></h5>
                        <p>djmaglaqui@gmail.com</p>
                    </div>
                    <div className="ppclProfileSocials">
                        <a href=""><h6><FaSquareFacebook className='faIcons'/></h6></a>
                        <a href=""><h6><FaInstagram className='faIcons'/></h6></a>
                        <a href=""><h6><FaTiktok className='faIcons'/></h6></a>
                        <a href=""><h6><FaYoutube className='faIcons'/></h6></a>
                        <a href=""><h6><FaTwitch className='faIcons'/></h6></a>
                        <div>
                            <button onClick={handleOpenSocialSettings}>Edit Profile <TbSettingsBolt className='faIcons'/></button>
                        </div>
                    </div>
                    <div className="ppclProfileDetails">
                        <span>
                            <p>My Referral Code</p>
                            <p>AG_KoswiFilo</p>
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
                                <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                <input type="text" placeholder='Post about a Gameplay...' onClick={handleAddUserPost} readOnly/>
                                <button id='postAStory' onClick={handleAddUserPost2}><IoIosImages className='faIcons'/></button>
                            </div>
                            <div className="ppcrpchpStories">
                                <div className='postAStory' onClick={handleAddUserStory}>
                                    <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                    <span>
                                        <h5><IoMdAddCircle className='faIcons'/></h5>
                                        <p>Add Story</p>
                                    </span>
                                </div>
                                <div className='viewAStory'>
                                    <div className="storiesContents">
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
                            <div className="ppcrpchpMyPosts">
                                <div className='ppcrpchpPost'>
                                    <div className='ppcrpchpUser'>
                                        <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        <span>
                                            <h6>Koswi <RiVerifiedBadgeFill className='faIcons'/></h6>
                                            <p>Apr 17</p>
                                        </span>
                                    </div>
                                    <div className="ppcrpchpupWords">
                                        <p>Hi guys I changed a profile</p>
                                    </div>
                                    <div className="ppcrpchpuPosting">
                                        <img id='ppcrpchpuPostingBG' src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                        <img id='ppcrpchpuPostingImg' src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                    </div>
                                </div>
                                <div className='ppcrpchpNoPost'>
                                    <h6>No Highlights Available...</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Profile