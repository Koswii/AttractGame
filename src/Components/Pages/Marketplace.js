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
import { 
    MdOutlineFiberNew 
} from "react-icons/md";
import axios from 'axios';
import { getGameReviews } from 'unofficial-metacritic';

const Marketplace = () => {
    const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGGamesListAPI2 = process.env.REACT_APP_AG_GAMES_STATUS_API;
    const AGGamesWikiDetails = process.env.REACT_APP_AG_GAMES_WIKI_API;
    const [viewAllGamesNum, setViewAllGamesNum] = useState([])
    const [viewAGData1, setViewAGData1] = useState([]);
    const [viewAGData2, setViewAGData2] = useState([]);
    const [viewWikiData, setViewWikiData] = useState([]);
    const [viewMetacriticData, setViewMetacriticData] = useState([]);
    const [loadingMarketData, setLoadingMarketData] = useState(false);
    const [scrapedMetacriticData, setScrapedMetacriticData] = useState('');
    const [viewImageGameCover, setViewImageGameCover] = useState('');


    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response1 = await axios.get(AGGamesListAPI1);
                const agAllGames = response1.data
                // const gameCategory1 = response1.data.filter(game => game.game_category === 'Trending');
                // const gameCatSort1 = gameCategory1.sort((a, b) => b.id - a.id);
                // const gameCSFeatMetacritic = gameCatSort1.map(game => game.game_title.toLowerCase().replace(/\s/g, '-'))
                // setViewAllGamesNum(agAllGames.length);
                // setViewAGData1(gameCatSort1);
                // setViewMetacriticData(gameCSFeatMetacritic);

                // Get current year
                const currentYear = new Date().getFullYear();
                // Filter games based on the current year
                const currentYearGames = agAllGames.filter(game => {
                    const gameDate = new Date(game.game_released);
                    return gameDate.getFullYear() === currentYear;
                });

                // Sort the games by release month and year
                const sortedCurrentYearGames = currentYearGames.sort((a, b) => {
                    const dateA = new Date(a.game_released);
                    const dateB = new Date(b.game_released);
                    if (dateA.getFullYear() === dateB.getFullYear()) {
                        return dateB.getMonth() - dateA.getMonth(); // Sort by month if years are the same
                    }
                    return dateB.getFullYear() - dateA.getFullYear(); // Sort by year
                });

                const gameCSFeatMetacritic = sortedCurrentYearGames.map(game => game.game_title.toLowerCase().replace(/\s/g, '-'));

                setViewAllGamesNum(agAllGames.length);
                setViewAGData1(sortedCurrentYearGames);
                setViewMetacriticData(gameCSFeatMetacritic);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGames();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingMarketData(false);
    
                // Combine all Metacritic URLs into one request
                const metacriticUrls = viewMetacriticData.map(game => `https://engeenx.com/proxyMetacritic.php?game=${game}/`);
                const metacriticResponses = await Promise.all(metacriticUrls.map(url => axios.get(url)));
    
                // Combine all Wikipedia URLs into one request
                const wikipediaUrls = metacriticResponses.map(response => {
                    const html = response.data;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const targetElementTitle = doc.querySelector('.c-productHero_title');
                    return targetElementTitle ? `https://engeenx.com/proxyWikipedia.php?game=${encodeURIComponent(targetElementTitle.textContent.trim().replace(/\s/g, '_'))}` : null;
                });
    
                const wikipediaResponses = await Promise.all(wikipediaUrls.map(url => url ? axios.get(url) : Promise.resolve(null)));
    
                // Combine Metacritic and Wikipedia data
                const combinedData = metacriticResponses.map((metacriticResponse, index) => {
                    const html = metacriticResponse.data;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const targetElementMetaScore = doc.querySelector('.c-siteReviewScore');
                    const targetElementDescription = doc.querySelector('.c-productionDetailsGame_description');
                    const targetElementReleaseDate = doc.querySelector('.c-gameDetails_ReleaseDate .g-outer-spacing-left-medium-fluid');
                    const targetElementPublisher = doc.querySelector('.c-gameDetails_Distributor .g-outer-spacing-left-medium-fluid');
    
                    const metascore = targetElementMetaScore ? targetElementMetaScore.textContent.trim() : '';
                    const metadescription = targetElementDescription ? targetElementDescription.textContent.trim() : '';
                    const release = targetElementReleaseDate ? targetElementReleaseDate.textContent.trim() : 'To Be Announced';
                    const publisher = targetElementPublisher ? targetElementPublisher.textContent.trim() : '';
    
                    const wikiDetailsData = wikipediaResponses[index] ? wikipediaResponses[index].data : {};
                    return { metascore, metadescription, release, publisher, ...wikiDetailsData, agData1: viewAGData1[index] };
                    
                });
    
                setLoadingMarketData(true);
                setScrapedMetacriticData(combinedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [viewMetacriticData]);





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
                            <h6>{viewAllGamesNum} <TbDeviceGamepad2 className='faIcons'/></h6>
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
                                <h6><MdOutlineFiberNew className='faIcons'/>New Released</h6>
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
                                <h6><MdOutlineFiberNew className='faIcons'/>New Released</h6>
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
                                    <h4>{details.metascore}</h4>
                                    <p>Metascore</p>
                                </div>
                                <>{details.agData1.game_cover !== '' ?
                                <img src={`https://engeenx.com/GameCovers/${details.agData1.game_cover}`} alt="" />
                                :<img src={details.originalimage.source} alt="" />}</>
                            </div>
                            <div className="mppctl right">
                                <h4>{details.title}</h4>
                                <h6>{details.publisher}</h6>
                                <p>
                                    {details.metadescription.slice(0, 300)+ '...'} <br /><br />
                                    Released Date: {details.release}
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
            <section className="marketplacePageContainer mid">
                <div className="mpPageContentMid">
                    {!loadingMarketData ? <>
                        <div className="mppContentMid">
                            <div className="loader"></div>
                        </div>
                        <div className="mppContentMid">
                            <div className="loader"></div>
                        </div>
                        <div className="mppContentMid">
                            <div className="loader"></div>
                        </div>
                        <div className="mppContentMid">
                            <div className="loader"></div>
                        </div>
                        <div className="mppContentMid">
                            <div className="loader"></div>
                        </div>
                    </>:<>
                        {scrapedMetacriticData.slice(2, 7).map((details, i) => (
                        <div className="mppContentMid">
                            <div className="mppcmMetascore">
                                <h4>{details.metascore}</h4>
                                <p>Metascore</p>
                            </div>
                            <div className="mppcmNewGames">
                                <h4><MdOutlineFiberNew className='faIcons'/></h4>
                            </div>
                            <>{details.agData1.game_cover !== '' ?
                            <img src={`https://engeenx.com/GameCovers/${details.agData1.game_cover}`} alt="" />
                            :<img src={details.originalimage.source} alt="" />}</>
                            <div className="mppcmGameDetails">
                                <h6>{details.agData1.game_title}</h6>
                                <p>
                                    {details.agData1.game_edition} <br /><br />
                                    {details.metadescription.slice(0, 100)+ '...'}
                                </p>
                                <div>
                                    <button>View Game</button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </>}
                </div>
            </section>
        </div>
    )
}

export default Marketplace