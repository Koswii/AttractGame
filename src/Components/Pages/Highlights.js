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

const Highlights = () => {
    



    return (
        <div className='mainContainer highlights'>
            <section className="highlightsPageContainer top">
                <div className="hlsPageContent top">
                    <div className="hldpcTop1">
                        <div className="hldpct1">
                            <div>
                                <img src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                            </div>
                            <input type="text" placeholder='Post about a Gameplay...' readOnly/>
                            <button id='postAStory'><IoIosImages className='faIcons'/></button>
                        </div>
                    </div>
                    <div className="hldpcTop2 website">
                        <div className="hldpcT2 addStory">
                            <img src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
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
                            <img src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
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
                    <div className="hldpcMid1">
                        <div className="hldpcMid1User">
                            <div className='hldpcMid1Profile'>
                                <div>
                                    <img src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                                </div>
                                <span>
                                    <h6>Koswi <RiVerifiedBadgeFill className='faIcons'/></h6>
                                    <p>Apr 17</p>
                                </span>
                            </div>
                            <div className="hldpcMid1Option">
                                <button><MdAdminPanelSettings className='faIcons'/></button>
                                <button><MdOutlineShare className='faIcons'/></button>
                            </div>
                        </div>
                        <div className="hldpcMid1PostText">
                            <p>Hi guys I changed a profile</p>
                        </div>
                        <div className="hldpcMid1PostImg">
                            <img id='hldpcMid1pBG' src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                            <img id='hldpcMid1pImg' src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                        </div>
                    </div>
                    <div className="hldpcMid1">
                        <div className="hldpcMid1User">
                            <div className='hldpcMid1Profile'>
                                <div>
                                    <img src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                                </div>
                                <span>
                                    <h6>Koswi <RiVerifiedBadgeFill className='faIcons'/></h6>
                                    <p>Apr 17</p>
                                </span>
                            </div>
                            <div className="hldpcMid1Option">
                                <button><MdAdminPanelSettings className='faIcons'/></button>
                                <button><MdOutlineShare className='faIcons'/></button>
                            </div>
                        </div>
                        <div className="hldpcMid1PostText">
                            <p>Hi guys I changed a profile</p>
                        </div>
                        <div className="hldpcMid1PostImg">
                            <img id='hldpcMid1pBG' src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                            <img id='hldpcMid1pImg' src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                        </div>
                    </div>
                    <div className="hldpcMid1">
                        <div className="hldpcMid1User">
                            <div className='hldpcMid1Profile'>
                                <div>
                                    <img src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                                </div>
                                <span>
                                    <h6>Koswi <RiVerifiedBadgeFill className='faIcons'/></h6>
                                    <p>Apr 17</p>
                                </span>
                            </div>
                            <div className="hldpcMid1Option">
                                <button><MdAdminPanelSettings className='faIcons'/></button>
                                <button><MdOutlineShare className='faIcons'/></button>
                            </div>
                        </div>
                        <div className="hldpcMid1PostText">
                            <p>Hi guys I changed a profile</p>
                        </div>
                        <div className="hldpcMid1PostImg">
                            <img id='hldpcMid1pBG' src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                            <img id='hldpcMid1pImg' src='https://engeenx.com/ProfilePics/DefaultProfilePic.png' alt="" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Highlights