import React from 'react'
import "../CSS/nav.css";
import { 
  FaSquareFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaTwitch 
} from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer = () => {
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
              <a href=""><FaSquareFacebook className='faIcons'/></a>
              <a href=""><FaInstagram className='faIcons'/></a>
              <a href=""><FaTiktok className='faIcons'/></a>
              <a href=""><FaYoutube className='faIcons'/></a>
              <a href=""><FaTwitch className='faIcons'/></a>
            </div>
          </div>
          <div className="footContent right">
            <div>
              <h6>PRODUCTS</h6>
              <ul>
                <li><Link>Marketplace</Link></li>
                <li><Link>Games</Link></li>
                <li><Link>Giftcards</Link></li>
                <li><Link>Game Credits</Link></li>
                <li><Link>AG Crypto</Link></li>
                <li><Link>Apply as Seller</Link></li>
              </ul>
            </div>
            <div>
              <h6>EXPLORE</h6>
              <ul>
                <li><Link>About Us</Link></li>
                <li><Link>Contact Us</Link></li>
                <li><Link>FAQs</Link></li>
                <li><Link>Terms and Condition</Link></li>
                <li><Link>Privacy Policy</Link></li>
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