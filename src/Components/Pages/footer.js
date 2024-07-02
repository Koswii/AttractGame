import React from 'react'
import "../CSS/nav.css";
import { 
  FaSquareFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTwitch,
  FaDiscord 

} from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useActivePage } from '../Pages/ActivePageContext';

const Footer = () => {
  const { setActivePage } = useActivePage();
  const handleClickMarketplace = () => {
    setActivePage('marketplace');
  }
  const handleClickGames = () => {
    setActivePage('games');
  }
  const handleClickGiftcards = () => {
    setActivePage('giftcards');
  }


  const handleClickUnderdevelopment = () => {
    setActivePage('');
  }

  return (
    <div className="footerContainer">
        <div className="footerContents">
          <div className="footContent left">
            <img src={require('../assets/imgs/AGLogoNameWhite.png')} alt="" />
            <h6>ATTRACT GAME - GAMESTORE</h6>
            <p>
              Your ultimate destination for the most affordable and hottest games worldwide! Dive into a world where gaming meets affordability, offering you access to the latest and most trending titles at unbeatable prices.
            </p><br />
            <p>FOLLOW US:</p>
            <div className="ftcSocialsContainer">
              <a href="https://www.facebook.com/attractgamestore" target='blank'><FaSquareFacebook className='faIcons'/></a>
              <a href="https://www.instagram.com/attract_gamestore" target='blank'><FaInstagram className='faIcons'/></a>
              <a href="https://www.tiktok.com/@attractgame" target='blank'><FaTiktok className='faIcons'/></a>
              <a href="https://www.youtube.com/@ATTRACTGAME" target='blank'><FaYoutube className='faIcons'/></a>
              <a href="https://www.twitch.tv/attractgamecom" target='blank'><FaTwitch className='faIcons'/></a>
              <a href="https://discord.com/invite/3Rc2QF3Zqz" target='blank'><FaDiscord className='faIcons'/></a>
            </div>
          </div>
          <div className="footContent right">
            <div>
              <h6>AFFILIATION (Soon)</h6>
              <ul>
                <li><Link to="/AGElite" onClick={handleClickUnderdevelopment}>AG Elite</Link></li>
                <li><Link to="/ApplyAsSeller" onClick={handleClickUnderdevelopment}>Apply as Seller</Link></li>
                <li><Link to="/ContentCreation" onClick={handleClickUnderdevelopment}>Content Creation</Link></li>
              </ul>
            </div>
            <div>
              <h6>PRODUCTS</h6>
              <ul>
                <li><Link to="/Games" onClick={handleClickGames}>Games</Link></li>
                <li><Link to="/Giftcards" onClick={handleClickGiftcards}>Giftcards</Link></li>
                <li><Link to="/GameCredits/Robux">Roblox: Robux</Link></li>
                <li><Link to="/AGCrypto">AG Crypto</Link></li>
              </ul>
            </div>
            <div>
              <h6>EXPLORE</h6>
              <ul>
                <li><Link to='/AboutUs' onClick={handleClickUnderdevelopment}>About Us</Link></li>
                <li><Link to='/ContactUs' onClick={handleClickUnderdevelopment}>Contact Us</Link></li>
                <li><Link to='/FAQs' onClick={handleClickUnderdevelopment}>FAQs</Link></li>
                <li><Link to='/TermsAndConditions' onClick={handleClickUnderdevelopment}>Terms and Conditions</Link></li>
                <li><Link to='/PrivacyAndPolicies' onClick={handleClickUnderdevelopment}>Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footerContentsBottom">
          <p>© Copyright 2024 AttractGame. All rights reserved.</p>
        </div>
    </div>
  )
}

export default Footer;