import React, { useState, useEffect } from 'react'
import "../CSS/store.css";
import placeholderImage from '../assets/imgs/GameBanners/DefaultNoBanner.png'
import { Link, useNavigate } from 'react-router-dom';
import { useActivePage } from './ActivePageContext';
import { 
    FaSearch,
    FaGamepad,
    FaBolt,
    FaTicketAlt,
    FaGem,
    FaFire,
    FaStar,     
    FaFacebookSquare,
    FaBitcoin 
} from 'react-icons/fa';
import { 
    FaRankingStar 
} from "react-icons/fa6";
import { 
    TbShoppingCartBolt,
    TbShoppingCartFilled,
    TbShoppingCartPlus,
    TbShoppingCartOff, 
    TbDiamond,
    TbDeviceGamepad2,
    TbGiftCard,
    TbHeart,
    TbHeartFilled,
    TbTrendingUp,
    TbAwardFilled,
    TbCampfireFilled,
    TbCalendarStar,
    TbSquareRoundedArrowRight,      
} from "react-icons/tb";
import { 
    MdOutlineFiberNew,
    MdDiscount 
} from "react-icons/md";
import axios from 'axios';
import { UserProfileData } from './UserProfileContext';
import { GamesFetchData } from './GamesFetchContext';
import { GiftcardsFetchData } from './GiftcardsFetchContext';
import { GamecreditsFetchData } from './GamecreditFetchContext';
import { FavoritesFetchData } from './FavoritesFetchContext';
import { CartsFetchData } from './CartsFetchContext';




const Store = () => {
  return (
    <div className='mainContainer sellerStore'>

    </div>
  )
}

export default Store