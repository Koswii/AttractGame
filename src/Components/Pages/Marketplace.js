import React, { useState, useEffect } from 'react'
import "../CSS/marketplace.css";
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
    TbShoppingCartBolt, 
    TbDeviceGamepad2,
    TbGiftCard,
    TbHeart,
    TbHeartFilled     
} from "react-icons/tb";
import axios from 'axios';

const Marketplace = () => {
    const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
    const [agGameTitle, setAGGameTitle] = useState('')


    useEffect(() => {
        const fetchDataGames = () => {
            axios.get(AGGamesListAPI1)
            .then((response) => {
                const gameData = response.data;
                console.log(gameData);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataGames();

        const fetchDataSample = () => {
            axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/Skull_and_Bones_(video game)')
            .then((response) => {
                const gameData = response.data;
                console.log(gameData);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataSample();


    }, []);











    return (
        <div className='mainContainer marketplace'>
            <section className="marketplacePageContainer top">
                <div className="mpPageContentTopNav">
                    <div className='mppctn left'>
                        <h6><FaSearch className='faIcons'/></h6>
                        <input type="text" placeholder='Search Games / Vouchers / Giftcards / Crypto / Merchandise'/>
                    </div>
                    <div className="mppctn right">
                        <span>
                            <h6>0 <TbShoppingCartBolt  className='faIcons'/></h6>
                        </span>
                        <span>
                            <h6>123 <TbDeviceGamepad2 className='faIcons'/></h6>
                        </span>
                        <span>
                            <h6>123 <TbGiftCard className='faIcons'/></h6>
                        </span>
                    </div>
                </div>
                {/* <h4>EXPLORE MARKETPLACE</h4> */}
                <div className='mpPageContentTop'>
                    <div className='mppContentTop left'>
                        <div className='mppctl left'>
                            <img src={require('../assets/imgs/GameBanners/ALONE IN THE DARK.png')} alt="" />
                        </div>
                        <div className="mppctl right">
                            <h4>ALONE IN THE DARK</h4>
                            <h6><FaFire className='faIcons'/>TRENDING GAME</h6>
                            <p>
                                Alone in the Dark is a 2024 survival horror video game developed by Pieces 
                                Interactive and published by THQ Nordic. The game is a reimagining of the 
                                original 1992 Alone in the Dark and is the seventh...
                            </p>
                            <div>
                                <button id='viewGameDetails'>VIEW GAME</button>
                                <button id='addToFavorite'><TbHeart className='faIcons'/></button>
                                <button id='addToFavorite'><TbShoppingCartBolt className='faIcons'/></button>
                            </div>
                        </div>
                    </div>
                    <div className="mppContentTop right">
                        <div className='mppctl left'>
                            <img src={require('../assets/imgs/GameBanners/ALONE IN THE DARK.png')} alt="" />
                        </div>
                        <div className="mppctl right">
                            <h4>ALONE IN THE DARK</h4>
                            <h6><FaFire className='faIcons'/>TRENDING GAME</h6>
                            <p>
                                Alone in the Dark is a 2024 survival horror video game developed by Pieces 
                                Interactive and published by THQ Nordic. The game is a reimagining of the 
                                original 1992 Alone in the Dark and is the seventh...
                            </p>
                            <div>
                                <button id='viewGameDetails'>VIEW GAME</button>
                                <button id='addToFavorite'><TbHeart className='faIcons'/></button>
                                <button id='addToFavorite'><TbShoppingCartBolt className='faIcons'/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Marketplace