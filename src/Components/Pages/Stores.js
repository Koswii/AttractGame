import React, { useState, useEffect } from 'react'
import "../CSS/stores.css";
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


const UsernameSlicer = ({ text = '', maxLength }) => {
    const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  
    return (
      <>{truncatedText}</>
    );
};

const Stores = () => {
    const { setActivePage } = useActivePage();
    const navigate = useNavigate ();
    const { 
        viewStoreList  
    } = UserProfileData();
    const { 
        viewAllGames
    } = GamesFetchData();
    const { 
        viewAllGiftcards
    } = GiftcardsFetchData();
    const { 
        viewAllGamecredits
    } = GamecreditsFetchData();



    const storeTotalDetails = viewStoreList.map(seller => {
        const gameTotal = viewAllGames.filter(stores => stores.game_seller === seller.store).length;
        const giftcardTotal = viewAllGiftcards.filter(stores => stores.giftcard_seller === seller.store).length;
        const gamecreditTotal = viewAllGamecredits.filter(stores => stores.gamecredit_seller === seller.store).length;
        return {
            ...seller, gameTotal, giftcardTotal, gamecreditTotal
        }
    });

    console.log(storeTotalDetails);
    


    return (
        <div className='mainContainer allStores'>
            <section className="allStorePageContainer top">
                <div className="storesPageContentTop">
                    <h3>ALL STORES</h3>
                </div>
            </section>
            <section className="allStorePageContainer mid">
                <div className="storesPageContentMid">
                    {storeTotalDetails.map((details, i) => (
                        <Link className="storeDetailsContent" to={`/Stores/${details.store}`}>
                            <div className="storCoverImg">
                                <img src={`https://2wave.io/StoreLogo/${details.store}.png`} alt="" />
                            </div>
                            <h5><UsernameSlicer text={`${details.store}`} maxLength={14} /></h5>
                            <h6>{details.username} <span>({details.userid})</span></h6>
                            <div className='strdcItems'>
                                <p>{details.gameTotal} <TbDeviceGamepad2 className='faIcons'/></p>
                                <p>{details.giftcardTotal} <TbGiftCard className='faIcons'/></p>
                                <p>{details.gamecreditTotal} <TbDiamond className='faIcons'/></p>
                            </div>
                            <div className="strdcStocks">
                                <p>0 Stock/s</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Stores