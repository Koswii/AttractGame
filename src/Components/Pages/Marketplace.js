import React, { useState, useEffect } from 'react'
import "../CSS/marketplace.css";
import { Link } from 'react-router-dom';
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
import { getGameReviews } from 'unofficial-metacritic';


const formatDateToWordedDate = (numberedDate) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(numberedDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}
const Marketplace = () => {
    const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGGamesListAPI2 = process.env.REACT_APP_AG_GAMES_STATUS_API;
    const AGGamesWikiDetails = process.env.REACT_APP_AG_GAMES_WIKI_API;
    const AGGamesRobloxPartners = process.env.REACT_APP_AG_GAMES_ROBLOX_API;
    const [viewAllGamesNum, setViewAllGamesNum] = useState([]);
    const [viewAllListedGames, setViewAllListedGames] = useState([]);
    const [viewAGData1, setViewAGData1] = useState([]);
    const [viewAGData2, setViewAGData2] = useState([]);
    const [viewWikiData, setViewWikiData] = useState([]);
    const [viewMetacriticData, setViewMetacriticData] = useState([]);
    const [loadingMarketData, setLoadingMarketData] = useState(false);
    const [scrapedMetacriticData, setScrapedMetacriticData] = useState('');
    const [viewRobloxPartners, setViewRobloxPartners] = useState([]);


    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response1 = await axios.get(AGGamesListAPI1);
                const agAllGames = response1.data;

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
                const gameCSFeatWikipedia = sortedCurrentYearGames.map(game => game.game_title_ext1.replace(/\s/g, '_') || game.game_title.replace(/\s/g, '_'));

                setViewAllGamesNum(agAllGames.length);
                setViewAGData1(sortedCurrentYearGames);
                setViewAllListedGames(sortedCurrentYearGames);
                // console.log(sortedCurrentYearGames);
                setViewMetacriticData(gameCSFeatMetacritic);
                setViewWikiData(gameCSFeatWikipedia)
            } catch (error) {
                console.error(error);
            }
        };
        fetchGames();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Combine all Metacritic URLs into one request
                const metacriticUrls = viewMetacriticData.map(game => `https://engeenx.com/proxyMetacritic.php?game=${game}/`);
                const metacriticResponses = await Promise.all(metacriticUrls.map(url => axios.get(url)));
    
                // Combine all Wikipedia URLs into one request
                const wikipediaUrls = viewWikiData.map(game => `https://engeenx.com/proxyWikipedia.php?game=${game}`);
                const wikipediaResponses = await Promise.all(wikipediaUrls.map(url => axios.get(url)));
    
                // Combine Metacritic and Wikipedia data
                const combinedData = metacriticResponses.map((metacriticResponse, index) => {
                    const html = metacriticResponse.data;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const targetElementMetaScore = doc.querySelector('.c-siteReviewScore');
                    const targetElementDescription = doc.querySelector('.c-productionDetailsGame_description');
                    const targetElementReleaseDate = doc.querySelector('.c-gameDetails_ReleaseDate .g-outer-spacing-left-medium-fluid');
                    const targetElementPublisher = doc.querySelector('.c-gameDetails_Distributor .g-outer-spacing-left-medium-fluid');
                    const targetElementGenre = doc.querySelector('.c-genreList .c-genreList_item .c-globalButton .c-globalButton_container .c-globalButton_label');
    
                    const metascore = targetElementMetaScore ? targetElementMetaScore.textContent.trim() : '';
                    const metadescription = targetElementDescription ? targetElementDescription.textContent.trim() : '';
                    const release = targetElementReleaseDate ? targetElementReleaseDate.textContent.trim() : 'To Be Announced';
                    const publisher = targetElementPublisher ? targetElementPublisher.textContent.trim() : '';
                    const genre = targetElementGenre ? targetElementGenre.textContent.trim() : '';
    
                    const wikiDetailsData = wikipediaResponses[index] ? wikipediaResponses[index].data : {};
                    return { metascore, metadescription, release, publisher, genre, ...wikiDetailsData, agData1: viewAGData1[index] };
                });
    
                if(combinedData.length == 0){
                    setLoadingMarketData(false);
                }else{
                    setLoadingMarketData(true);
                    setScrapedMetacriticData(combinedData.slice(0, 7));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [viewMetacriticData, viewWikiData]);

    useEffect(() => {
        const fetchRobloxPartners = () => {
            axios.get(AGGamesRobloxPartners)
            .then((response) => {
                const robloxData = response.data.sort((a, b) => b.id - a.id);
                setViewRobloxPartners(robloxData);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchRobloxPartners();
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
                            <h6>{viewAllGamesNum} <TbDeviceGamepad2 className='faIcons'/></h6>
                        </span>
                        <span>
                            <h6>123 <TbGiftCard className='faIcons'/></h6>
                        </span>
                    </div>
                </div>
                <h4 id='mppcth4Title'><FaStar className='faIcons'/> FEATURED GAMES</h4>
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
                                    <h4>{details.metascore ? details.metascore : 'tbd'}</h4>
                                    <p>Metascore</p>
                                </div>
                                <>{details.agData1.game_cover !== '' ?
                                <img src={`https://engeenx.com/GameCovers/${details.agData1.game_cover}`} alt="" />
                                :<img src={details.originalimage.source} alt="" />}</>
                            </div>
                            <div className="mppctl right">
                                <h4>{details.agData1.game_title || details.title}</h4>
                                <h6>{details.publisher || details.agData1.game_developer}</h6>
                                <p>
                                    {details.metadescription ? details.metadescription.slice(0, 300)+ '...' : <>No Metacritic and Wikipedia details yet. <br /><br /><br /><br /><br /></>} <br /><br />
                                    Released Date: {formatDateToWordedDate(details.agData1.game_released)}
                                </p>
                                <div>
                                    <Link id='viewGameDetails' to={`/Games/${details.agData1.game_canonical}`} key={i}>VIEW GAME</Link>
                                    <button id='addToFavorite'><TbHeart className='faIcons'/></button>
                                    <button id='addToFavorite'><TbShoppingCartBolt className='faIcons'/></button>
                                </div>
                            </div>
                        </div>))}
                    </div>
                </>}
            </section>
            <section className="marketplacePageContainer mid">
                <div className="mpPageContentMid1">
                    {!loadingMarketData ? <>
                        <div className="mppContentMid1">
                            <div className="loader"></div>
                        </div>
                        <div className="mppContentMid1">
                            <div className="loader"></div>
                        </div>
                        <div className="mppContentMid1">
                            <div className="loader"></div>
                        </div>
                        <div className="mppContentMid1">
                            <div className="loader"></div>
                        </div>
                        <div className="mppContentMid1">
                            <div className="loader"></div>
                        </div>
                    </>:<>
                        {scrapedMetacriticData.slice(2, 7).map((details, i) => (
                        <div className="mppContentMid1" key={i}>
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
                                    <Link to={`/Games/${details.agData1.game_canonical}`}>View Game</Link>
                                </div>
                            </div>
                        </div>
                        ))}
                    </>}
                </div>
                <h4 id='mppcmh4Title'><FaGamepad className='faIcons'/> AVAILABLE GAMES</h4>
                <div className="mpPageContentMid2">
                    {viewAllListedGames.slice(0, 15).map((details, i) => (
                    <div className="mppContentMid2" key={i}>
                        <div className="mppcm2GamePlatform">
                            <img platform={details.game_platform} src="" alt="" />
                        </div>
                        <div className="mppcm2GameCategory">
                            <h4>
                                <TbTrendingUp className={`faIcons ${(details.game_category === 'Trending') ? 'Trending' : ''}`}/>
                                <TbCampfireFilled className={`faIcons ${(details.game_category === 'Hot') ? 'Hot' : ''}`}/>
                                <TbAwardFilled className={`faIcons ${(details.game_category === 'Classic') ? 'Classic' : ''}`}/>
                                <TbCalendarStar className={`faIcons ${(details.game_category === 'Preorder') ? 'Preorder' : ''}`}/>
                            </h4>
                        </div>
                        <>{details.game_cover !== '' ?
                        <img src={`https://engeenx.com/GameCovers/${details.game_cover}`} alt="Image Not Available" />
                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</>
                        <div className="mppcm2GamePrice">
                            <p>$ 999.99</p>
                        </div>
                        <div className="mppcm2GameDiscount">
                            <h4><MdDiscount className='faIcons'/></h4>
                        </div>
                        <div className="mppcm2GameDetails">
                            <h5>{details.game_title}</h5>
                            <p>{details.game_edition}</p>
                            <div>
                                <Link id='mppcm2GDView' to={`/Games/${details.game_canonical}`}>View Game</Link>
                                <button id='mppcm2GDHeart'><TbHeart className='faIcons'/></button>
                                <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="mpPageContentMid3">
                    <Link className="mppcm3TrendingGames">
                        <h5><TbTrendingUp className='faIcons'/>TRENDING GAMES</h5>
                    </Link>
                    <Link className="mppcm3HotGames">
                        <h5><TbCampfireFilled className='faIcons'/>HOT GAMES</h5>
                    </Link>
                    <Link className="mppcm3ClassicGames">
                        <h5><TbAwardFilled className='faIcons'/>CLASSIC GAMES</h5>
                    </Link>
                </div>
                <div className="mpPageContentM2ShowMore">
                    <Link><TbSquareRoundedArrowRight className='faIcons'/> View {viewAllGamesNum - 15} More Games</Link>
                </div>
                <div className="mpPageContentMid4">
                    <div className="mppcm4GiftCard">
                        <h6>ROBLOX GIFTCARDS</h6>
                        <p>Purchase Roblox Giftcards to get AG Points and a chance to win on Attract Game's monthly Raffle</p>
                        <img src={require('../assets/imgs/GiftCards/RobloxGiftCard.png')} alt="" />
                        <div>
                            <button>View Guide</button>
                        </div>
                    </div>
                </div>
                <div className="mpPageContentMid5">
                    <div className="mppcm5Join left">
                        <h3>HANGOUT AND PLAY WITH US!</h3>
                        <h6>JOIN OUR PARTNER ROBLOX GAMES AND UNIVERSE</h6>
                        <div>
                            <span>
                                <h4>0</h4>
                                <p>Influencers</p>
                            </span>
                            <span>
                                <h4>{viewRobloxPartners.length}</h4>
                                <p>Partners</p>
                            </span>
                            <span>
                                <h4>2</h4>
                                <p>Developers</p>
                            </span>
                            <span>
                                <h4>{viewRobloxPartners.length}</h4>
                                <p>Games</p>
                            </span>
                        </div>
                    </div>
                    <div className="mppcm5Join right">
                        {viewRobloxPartners.slice(0, 2).map((details, i) => (
                            <a key={i} className="mppcm5Roblox" href={details.roblox_url} target='blank'>
                                <img src={details.roblox_cover} alt="" />
                                <div className='mppcm5RTitle'>
                                    <h6>{details.roblox_title}</h6>
                                    <p>
                                        By {details.roblox_dev} <br />
                                        {details.roblox_description.slice(0, 50)}
                                    </p>
                                </div>
                            </a>
                        ))}
                        <div className='mppcm5RobloxMore'>
                            {viewRobloxPartners.length > 2 ? <button>View More Games</button> : ''}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Marketplace