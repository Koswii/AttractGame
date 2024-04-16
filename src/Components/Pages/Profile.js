import React from 'react'
import "../CSS/profile.css";
import { Link } from 'react-router-dom';
import { 
    FaSearch,
    FaBolt,
    FaTicketAlt,
    FaGem,
    FaFire,
    FaStar,     
    FaFacebookSquare,
    FaBitcoin 
} from 'react-icons/fa';
import { 
    FaSquareFacebook,
    FaInstagram,
    FaTiktok,
    FaYoutube,
    FaTwitch 
} from "react-icons/fa6";
import { 
    TbGiftCardFilled,
    TbSettings2  
} from "react-icons/tb";
import { 
    RiVerifiedBadgeFill 
} from "react-icons/ri";
import { 
    IoIosImages,
    IoMdAddCircle  
} from "react-icons/io";

const Profile = () => {
  return (
    <div className='mainContainer profile'>
        <section className="profilePageContainer top">
            <img src={require('../assets/imgs/DefaultProfile.jpg')} alt="" />
            <div></div>
        </section>
        <section className="profilePageContainer mid">
            <div className="profilePageContent left">
                <div className='ppclProfilePic'>
                    <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
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
                        <button>Edit Profile <TbSettings2 className='faIcons'/></button>
                    </div>
                </div>
                <div className="ppclProfileDetails">
                    <span>
                        <p>My Referral Code</p>
                        <p>AG_KoswiFilo</p>
                    </span>
                    <span>
                        <p>AG Points</p>
                        <p>0 Points</p>
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
                            <input type="text" placeholder='Post your Gameplay...' readOnly/>
                            <button id='postAStory'><IoIosImages className='faIcons'/></button>
                        </div>
                        <div className="ppcrpchpStories">
                            <div className='postAStory'>
                                <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                <span>
                                    <h5><IoMdAddCircle className='faIcons'/></h5>
                                    <p>Add Story</p>
                                </span>
                            </div>
                            <div className='viewAStory'>
                                <div className="storiesContents">
                                    <div>
                                        <img src={require('../assets/imgs/ProfilePics/DefaultProfilePic.png')} alt="" />
                                    </div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Profile