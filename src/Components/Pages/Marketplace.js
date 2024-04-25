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
    TbHeartFilled,
    TbTrendingUp      
} from "react-icons/tb";
import axios from 'axios';
import { getGameReviews } from 'unofficial-metacritic';

const Marketplace = () => {
    const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGGamesListAPI2 = process.env.REACT_APP_AG_GAMES_STATUS_API;
    const AGGamesWikiDetails = process.env.REACT_APP_AG_GAMES_WIKI_API;
    const [viewAGData1, setViewAGData1] = useState([]);
    const [viewAGData2, setViewAGData2] = useState([]);
    const [viewWikiData, setViewWikiData] = useState([]);
    const [viewMetacriticData, setViewMetacriticData] = useState([]);
    const [loadingMarketData, setLoadingMarketData] = useState(false);
    const [scrapedMetacriticData, setScrapedMetacriticData] = useState('');


    useEffect(() => {
        const fetchGamesCategory1 = () => {
            axios.get(AGGamesListAPI1)
            .then((response) => {
                const gameCategory = response.data.filter(game => game.game_category == 'Trending');
                const gameCatSort = gameCategory.sort((a, b) => b.id - a.id);
                setViewAGData1(gameCatSort);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchGamesCategory1();

        const fetchGamesCategory2 = () => {
            axios.get(AGGamesListAPI2)
            .then((response) => {
                const gameCategory = response.data.filter(game => game.game_category == 'Trending');
                const gameCatSort = gameCategory.sort((a, b) => b.id - a.id);
                const gameCSFeatMetacritic = gameCatSort.map(game => game.game_title.toLowerCase().replace(/\s/g, '-'))
                setViewAGData2(gameCatSort);
                setViewMetacriticData(gameCSFeatMetacritic);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchGamesCategory2();
    }, []);

    useEffect(() => {
        const fetchDataMetacritic = async () => {
            try {
                setLoadingMarketData(false);
                const detailsPromises = viewMetacriticData.map(viewMetacriticData => {
                    return axios.get(`https://engeenx.com/proxyMetacritic.php?game=${viewMetacriticData}/`);
                });
                const detailsResponses = await Promise.all(detailsPromises);
                const scrapedDataArray = detailsResponses.map(response => {
                    const html = response.data;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const targetElementTitle = doc.querySelector('.c-productHero_title');
                    const targetElementMetaScore = doc.querySelector('.c-siteReviewScore');
                    const targetElementDescription = doc.querySelector('.c-productionDetailsGame_description');
                    const targetElementReleaseDate = doc.querySelector('.c-gameDetails_ReleaseDate .g-outer-spacing-left-medium-fluid');
                    const targetElementPublisher = doc.querySelector('.c-gameDetails_Distributor .g-outer-spacing-left-medium-fluid');

                    return {
                        title: targetElementTitle ? targetElementTitle.textContent : '',
                        metascore: targetElementMetaScore ? targetElementMetaScore.textContent : '',
                        description: targetElementDescription ? targetElementDescription.textContent : '',
                        release: targetElementReleaseDate ? targetElementReleaseDate.textContent : 'To Be Announced',
                        publisher: targetElementPublisher ? targetElementPublisher.textContent : ''
                    };
                });

                const viewMetacriticGameTitle = scrapedDataArray.map(gameMetacritic => {
                    const viewGameTitle = gameMetacritic.title.replace(/\s/g, '_');
                    return axios.get(`https://engeenx.com/proxyWikipedia.php?game=${viewGameTitle}`);
                });
                const wikiDataResponses = await Promise.all(viewMetacriticGameTitle);
                const wikiDetailsData = wikiDataResponses.map(response => response.data);
                const mergedWikiMetaData = wikiDetailsData.map((data, index) => {
                    return { ...data, metacriticData: scrapedDataArray[index] };
                });
                const combinedAllData1 = mergedWikiMetaData.map((data, index) => {
                    return { ...data, agData1: viewAGData1[index] };
                });
                const combinedAllData2 = combinedAllData1.map((data, index) => {
                    return { ...data, agData2: viewAGData2[index] };
                });
                setLoadingMarketData(true);
                setScrapedMetacriticData(combinedAllData2);
                console.log(combinedAllData2);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataMetacritic();
    }, [viewMetacriticData, viewAGData1, viewAGData2]);


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
                <h4>FEATURED GAMES</h4>
                {!loadingMarketData ? <>
                    <div className='mpPageContentTop'>
                        <div className='mppContentTop'>
                            <div className='mppctl left'>
                                <div className="loader"></div>
                            </div>
                            <div className="mppctl right">
                                <h4 id='mppctlLoadTitle'></h4>
                                <h6><TbTrendingUp className='faIcons'/>Trending Game</h6>
                                <p id='mppctlLoadTitle'></p>
                                <div>
                                    <button id='viewGameDetails'>VIEW GAME</button>
                                    <button id='addToFavorite'><TbHeart className='faIcons'/></button>
                                    <button id='addToFavorite'><TbShoppingCartBolt className='faIcons'/></button>
                                </div>
                            </div>
                        </div>
                        <div className='mppContentTop'>
                            <div className='mppctl left'>
                                <div className="loader"></div>
                            </div>
                            <div className="mppctl right">
                                <h4 id='mppctlLoadTitle'></h4>
                                <h6><TbTrendingUp className='faIcons'/>Trending Game</h6>
                                <p id='mppctlLoadTitle'></p>
                                <div>
                                    <button id='viewGameDetails'>VIEW GAME</button>
                                    <button id='addToFavorite'><TbHeart className='faIcons'/></button>
                                    <button id='addToFavorite'><TbShoppingCartBolt className='faIcons'/></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>:<>
                    <div className='mpPageContentTop'>
                        {scrapedMetacriticData.slice(0, 2).map((details, i) => (
                        <div className='mppContentTop' key={i}>
                            <div className='mppctl left'>
                                <div className='mppctlMetascore'>
                                    <h4>{details.metacriticData.metascore}</h4>
                                    <p>Metascore</p>
                                </div>
                                {(details.agData1.game_cover) ?
                                <><img src={`https://engeenx.com/GameCovers/${details.agData1.game_cover}`} alt="" /></>:
                                <><img src={details.originalimage.source} alt="" /></>}
                            </div>
                            <div className="mppctl right">
                                <h4>{details.metacriticData.title}</h4>
                                <h6><TbTrendingUp className='faIcons'/>{details.agData2.game_category + ' Game'}</h6>
                                <p>
                                    {details.metacriticData.description.slice(0, 300)+ '...'} <br /><br />
                                    Released Date: {details.metacriticData.release}
                                </p>
                                <div>
                                    <button id='viewGameDetails'>VIEW GAME</button>
                                    <button id='addToFavorite'><TbHeart className='faIcons'/></button>
                                    <button id='addToFavorite'><TbShoppingCartBolt className='faIcons'/></button>
                                </div>
                            </div>
                        </div>))}
                    </div>
                </>}
            </section>
        </div>
    )
}

export default Marketplace