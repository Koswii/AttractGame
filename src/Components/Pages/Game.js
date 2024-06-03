import React, { useEffect, useState, useRef } from 'react'
import "../CSS/game.css";
import { useParams } from "react-router-dom";
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
    TbShoppingCartPlus,
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
import YouTubeEmbed from './YouTubeEmbed';

const formatDateToWordedDate = (numberedDate) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(numberedDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}


const Game = () => {
    const { gameCanonical } = useParams();
    const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGAddToFavorites = process.env.REACT_APP_AG_ADD_USER_FAV_API;
    const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [userLoggedData, setUserLoggedData] = useState('')
    const [favorites, setFavorites] = useState([]);
    const [viewAGData1, setViewAGData1] = useState([]);
    const [viewAGData2, setViewAGData2] = useState([]);
    const [viewWikiData, setViewWikiData] = useState([]);
    const [viewMetacriticData, setViewMetacriticData] = useState([]);
    const [loadingMarketData, setLoadingMarketData] = useState(false);
    const [scrapedMetacriticData, setScrapedMetacriticData] = useState('');
    const [viewGameTrailer, setViewGameTrailer] = useState('');

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        }

        const fetchGameData = async () => {
            try {
                const response = await axios.get(AGGamesListAPI1);
                const agOtherGamesData = response.data;
                const agGameData = response.data.find(game => game.game_canonical === gameCanonical);
                const gameCSFeatMetacritic = agGameData.game_title_ext2.toLowerCase().replace(/\s/g, '-') || agGameData.game_title.toLowerCase().replace(/\s/g, '-');
                const gameCSFeatWikipedia = agGameData.game_title_ext1.replace(/\s/g, '_') || agGameData.game_title.replace(/\s/g, '_');
                setViewAGData1(agGameData);
                setViewMetacriticData(gameCSFeatMetacritic);
                setViewWikiData(gameCSFeatWikipedia);
                setViewAGData2(agOtherGamesData);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchUserProfile();
        fetchGameData();
    }, [LoginUserID]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch details for a single game from Wikipedia
                const wikipediaUrl = await axios.get(`https://engeenx.com/proxyWikipedia.php?game=${viewWikiData}`);
                const wikipediaResponse = wikipediaUrl.data;

                const metacriticUrls = await axios.get(`https://engeenx.com/proxyMetacritic.php?game=${viewMetacriticData}/`);
                const html = metacriticUrls.data;
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

                const combinedMetaWikiData = {...wikipediaResponse, ...viewAGData1, metascore, metadescription, release, publisher, genre}

                if(combinedMetaWikiData.genre === "" && combinedMetaWikiData.title === "Not found."){
                    setLoadingMarketData(false);
                }else{
                    setScrapedMetacriticData(combinedMetaWikiData);
                    // console.log(combinedMetaWikiData);
                    setLoadingMarketData(true);
                    setViewGameTrailer(combinedMetaWikiData.game_trailer);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, [viewMetacriticData, viewWikiData]);
    const videoUrl = viewGameTrailer;

    const handleClickGames = () => {
        localStorage.setItem('games', 'active');
        localStorage.removeItem('dashboard');
        localStorage.removeItem('marketplace');
        localStorage.removeItem('giftcards');
        localStorage.removeItem('crypto');
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    const handleAddFavorite = (scrapedMetacriticData) => {
        const productFavGameCode = scrapedMetacriticData.game_canonical;
        const productFavGameName = scrapedMetacriticData.game_title;
    
        const formAddfavorite = {
          agFavUsername: userLoggedData.username,
          agFavUserID: userLoggedData.userid,
          agFavGameCode: productFavGameCode,
          agFavGameName: productFavGameName,
        }
    
        const jsonUserFavData = JSON.stringify(formAddfavorite);
        axios.post(AGAddToFavorites, jsonUserFavData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === true) {
            console.log(resMessage.message);
          } else {
            console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };
    const handleRemoveFavorite = (gameCanonical) => {
        const removeFav = {favorite: gameCanonical}
        const removeFavJSON = JSON.stringify(removeFav);
        axios({
            method: 'delete',
            url: AGUserRemoveFavAPI,
            data: removeFavJSON,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.data.success) {
                console.log('Product removed successfully');
            } else {
                console.log(`Error: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.log(`Error: ${error.message}`);
        });
    };
    const handleFavoriteToggle = (scrapedMetacriticData) => {
        if (favorites.includes(scrapedMetacriticData.game_canonical)) {
            handleRemoveFavorite(scrapedMetacriticData.game_canonical);
        } else {
            handleAddFavorite(scrapedMetacriticData);
        }
    };

    return (
        <div className='mainContainer gameProfile'>
            <section className="gamePageContainer top">
                {!loadingMarketData ? <div className="gpPageContentTop">
                    <div className="gppctGameDetails loading">
                        <div className="loader"></div>
                    </div>
                </div>:
                <div className="gpPageContentTop">
                    <div className="gppctGameDetails left">
                        <div className="gppctgdMetacritic">
                            <h3>{scrapedMetacriticData.metascore ? scrapedMetacriticData.metascore : 'tbd'}</h3>
                            <p>Metascore</p>
                        </div>
                        <div className="gppctgdCategory">
                            <h5>
                                {(scrapedMetacriticData.game_category === 'Trending') && <><TbTrendingUp className={`faIcons ${(scrapedMetacriticData.game_category === 'Trending') ? 'Trending' : ''}`}/> TRENDING</>}
                                {(scrapedMetacriticData.game_category === 'Hot') && <><TbCampfireFilled className={`faIcons ${(scrapedMetacriticData.game_category === 'Hot') ? 'Hot' : ''}`}/> HOT</>}
                                {(scrapedMetacriticData.game_category === 'Classic') && <><TbAwardFilled className={`faIcons ${(scrapedMetacriticData.game_category === 'Classic') ? 'Classic' : ''}`}/> CLASSIC</>}
                                {(scrapedMetacriticData.game_category === 'Preorder') && <><TbCalendarStar className={`faIcons ${(scrapedMetacriticData.game_category === 'Preorder') ? 'Preorder' : ''}`}/> PREORDER</>}
                            </h5>
                        </div>
                        <>{scrapedMetacriticData.game_cover !== '' ?
                        <img src={`https://2wave.io/GameCovers/${scrapedMetacriticData.game_cover}`} alt="" />
                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} alt="" />}</>
                    </div>
                    <div className="gppctGameDetails right">
                        <h3>{scrapedMetacriticData.game_title}</h3>
                        <div className='gppctgdrDetails'>
                            {scrapedMetacriticData.game_edition ? <h6>{scrapedMetacriticData.game_edition}</h6> : <></>}
                            {scrapedMetacriticData.game_platform ? <h6>{scrapedMetacriticData.game_platform ? scrapedMetacriticData.game_platform + ' Game' : ''}</h6> : <></>}
                            {scrapedMetacriticData.game_developer ? <h6>{scrapedMetacriticData.game_developer}</h6> : <></>}
                            {scrapedMetacriticData.publisher ? <h6>{scrapedMetacriticData.publisher}</h6> : <></>}
                            {scrapedMetacriticData.genre ? <h6>{scrapedMetacriticData.genre}</h6> : <></>}
                        </div>
                        <h5>GAME RELEASED: {scrapedMetacriticData.game_released ? formatDateToWordedDate(scrapedMetacriticData.game_released) : '-'}</h5>
                        <div className="gppctgdrMetacritic">
                            <p>{scrapedMetacriticData.metadescription ? 
                                <>{(scrapedMetacriticData.metadescription.slice(0, 300)+ '...')}</> 
                                :<>No Metacritic and Wikipedia details yet. <br /><br /><br /><br /><br /></>}
                            </p>
                            <div>
                                {scrapedMetacriticData.metadescription ? <a href={`https://www.metacritic.com/game/${viewMetacriticData}/`} target='blank'>View Metacritic</a> : <></>}
                                {scrapedMetacriticData.extract ? <a href={`https://en.wikipedia.org/wiki/${viewWikiData}`} target='blank'>View Wikipedia</a> : <></>}
                            </div>
                        </div>
                        <div className="gppctgdrExtras">
                            <h4>$ 999.99</h4>
                            {userLoggedIn ?<>
                                <button id={favorites.includes(scrapedMetacriticData.game_canonical) ? 'gppct2gdRemoveFav' : 'gppct2gdAddFav'} onClick={() => handleFavoriteToggle(scrapedMetacriticData)}>
                                    {favorites.includes(scrapedMetacriticData.game_canonical) ? <TbHeartFilled className='faIcons'/> : <TbHeart className='faIcons'/>}
                                </button>
                                <button><TbShoppingCartPlus className='faIcons'/></button>
                            </>:<>
                                <button><TbHeart className='faIcons'/></button>
                                <button><TbShoppingCartPlus className='faIcons'/></button>
                            </>}
                            <div>
                                <h6>Game On-Stock</h6>
                                <p>24 Stocks</p>
                            </div>
                        </div>
                    </div>
                </div>}
            </section>
            <section className="gamePageContainer mid">
                <div className="gpPageContentMid1">
                    <div className="gppcm1Container left">
                        <YouTubeEmbed videoUrl={videoUrl} />
                    </div>
                    <div className="gppcm1Container right">
                        <h4>LATEST REVIEWS <span>3 Reviews</span></h4>
                        <hr />
                        <div className='gppcm1crReviews'>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
                                has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                            </p>
                            <h6>Koswi <span>Jan 24, 2024</span></h6>
                        </div>
                        <div className='gppcm1crReviews'>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
                                has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                            </p>
                            <h6>Koswi <span>Jan 24, 2024</span></h6>
                        </div>
                        <div className='gppcm1crReviews'>
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum 
                                has been the industry's standard dummy text ever since the 1500s, when an unknown printer
                            </p>
                            <h6>Koswi <span>Jan 24, 2024</span></h6>
                        </div>
                        <button>ADD GAME REVIEW</button>
                    </div>
                </div>
            </section>
            <section className="gamePageContainer bot">
                <h4>GAMES YOU MIGHT LIKE</h4>
                <div className="gpPageContentMid3 website">
                    {viewAGData2.slice(0, 10).map((details, i) => (
                        <Link className="gppcm3OtherGame" key={i} to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>
                            <img src={`https://2wave.io/GameCovers/${details.game_cover}`} alt="" />
                            <div className="gppcm3ogPlatform">
                                <img src="" platform={details.game_platform} alt="" />
                            </div>
                            <div className="gppcm3ogDetails">
                                <h5>{details.game_title}</h5>
                                <p>{details.game_edition}</p>
                                <div>
                                    <div id="mppcm2GDView"><h5>$999.99</h5></div>
                                    <button id='mppcm2GDHeart'><TbHeart className='faIcons'/></button>
                                    <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="gpPageContentMid3 mobile">
                    {viewAGData2.slice(0, 6).map((details, i) => (
                        <Link className="gppcm3OtherGame" key={i} to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>
                            <img src={`https://2wave.io/GameCovers/${details.game_cover}`} alt="" />
                            <div className="gppcm3ogPlatform">
                                <img src="" platform={details.game_platform} alt="" />
                            </div>
                            <div className="gppcm3ogDetails">
                                <h5>{details.game_title}</h5>
                                <p>{details.game_edition}</p>
                                <div>
                                    <div id="mppcm2GDView"><h5>$999.99</h5></div>
                                    <button id='mppcm2GDHeart'><TbHeart className='faIcons'/></button>
                                    <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Game