import React, { useState, useEffect } from 'react'
import "../CSS/marketplace.css";
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



const LoginUserID = localStorage.getItem('profileUserID');
const AGStocksListAPI = process.env.REACT_APP_AG_STOCKS_LIST_API;
const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
const AGGamesRobloxPartners = process.env.REACT_APP_AG_GAMES_ROBLOX_API;
const AGUserFavoritesAPI = process.env.REACT_APP_AG_FETCH_USER_FAV_API;
const AGUserProductsCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
const formatDateToWordedDate = (numberedDate) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(numberedDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}
const getRandomItems = (array, numItems) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
};
const fetchGames = async (setLoadingMarketData1, setViewAllGamesNum, setViewAGData1, setViewMetacriticData, setViewWikiData, setViewAllListedGames) => {
    try {
        setLoadingMarketData1(true);
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
        const stockListResponse = await axios.get(AGStocksListAPI);
        const stockListData = stockListResponse.data;


        const calculateEffectivePrice = (price, discount) => {
            return price - (price * (discount / 100));
        };
        const stockInfo = sortedCurrentYearGames.map(games => {
            const stock = stockListData.find(stock => stock.ag_product_id === games.game_canonical);
            const stockCount = stockListData.filter(stock => stock.ag_product_id === games.game_canonical).length;
            const effectivePrice = calculateEffectivePrice(stock.ag_product_price, stock.ag_product_discount);
            return {
                ...games, stock, stockCount,
            };
        });

        setViewAllGamesNum(agAllGames);
        setViewAGData1(sortedCurrentYearGames);
        // setViewAllListedGames(sortedCurrentYearGames);
        setViewMetacriticData(gameCSFeatMetacritic);
        setViewWikiData(gameCSFeatWikipedia)

        if (stockInfo.length > 0) {
            const randomItems = getRandomItems(stockInfo, 15);
            setViewAllListedGames(randomItems);
        }

    } catch (error) {
        console.error(error);
    } finally {
        setLoadingMarketData1(false);
    }
};
const fetchDataGiftcards = async (setLoadingMarketData1, filterUniqueData, setViewAllGiftcard) => {
    setLoadingMarketData1(true);
    try {
        const response = await axios.get(AGGiftcardsListAPI);
        const unique = filterUniqueData(response.data);
        setViewAllGiftcard(unique);
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingMarketData1(false);
    }
}
const fetchDataGameCredits = async (setLoadingMarketData1, setViewAllGameCredits) => {
    setLoadingMarketData1(true);
    try {
        const response = await axios.get(AGGameCreditsListAPI);
        setViewAllGameCredits(response.data.slice(0, 10));
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingMarketData1(false);
    }
}
const fetchRobloxPartners = (setViewRobloxPartners) => {
    axios.get(AGGamesRobloxPartners)
    .then((response) => {
        const robloxData = response.data.sort((a, b) => b.id - a.id);
        setViewRobloxPartners(robloxData);
    })
    .catch(error => {
        console.log(error)
    })
}
const fetchFavorites = async (setFavorites) => {
    try {
        const response = await axios.get(AGUserFavoritesAPI);
        const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
        const favoriteGameCodes = filteredData.map(fav => fav.ag_product_id);
        setFavorites(favoriteGameCodes);
    } catch (error) {
        console.error(error);
    }
};
const fetchUserCart = async (setProductCarts, LoginUserID) => {
    try {
        const response = await axios.get(AGUserProductsCartAPI);
        const filteredData = response.data.filter(product => product.ag_user_id	=== LoginUserID);
        const gameCartProducts = filteredData.filter(product => product.ag_product_type === 'Game');
        setProductCarts(gameCartProducts);
    } catch (error) {
        console.error(error);
    }
};
const Marketplace = () => {
    const navigate = useNavigate ();
    const { setActivePage } = useActivePage();
    const AGAddToFavorites = process.env.REACT_APP_AG_ADD_USER_FAV_API;
    const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [userLoggedData, setUserLoggedData] = useState('')
    const [favorites, setFavorites] = useState([]);
    const [productCart, setProductCarts] = useState([]);
    const [viewAllGamesNum, setViewAllGamesNum] = useState([]);
    const [viewAllListedGames, setViewAllListedGames] = useState([]);
    const [viewAGData1, setViewAGData1] = useState([]);
    const [viewAGData2, setViewAGData2] = useState([]);
    const [viewWikiData, setViewWikiData] = useState([]);
    const [viewMetacriticData, setViewMetacriticData] = useState([]);
    const [viewAllGiftcard, setViewAllGiftcard] = useState([]);
    const [viewAllGameCredits, setViewAllGameCredits] = useState([]);
    const [loadingMarketData, setLoadingMarketData] = useState(false);
    const [loadingMarketData1, setLoadingMarketData1] = useState(true);
    const [scrapedMetacriticData, setScrapedMetacriticData] = useState('');
    const [viewRobloxPartners, setViewRobloxPartners] = useState([]);


    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        }
        fetchUserProfile();
    }, []);
    const filterUniqueData = (giftcards) => {
        const uniqueRecords = [];
        const recordMap = {};

        giftcards.forEach(record => {
            if (!recordMap[record.giftcard_name]) {
                recordMap[record.giftcard_name] = true;
                uniqueRecords.push(record);
            }
        });

        return uniqueRecords;
    };
    useEffect(() => {
        fetchFavorites(setFavorites);
        fetchUserCart(setProductCarts, LoginUserID);
        fetchGames(setLoadingMarketData1, setViewAllGamesNum, setViewAGData1, setViewMetacriticData, setViewWikiData, setViewAllListedGames);
        fetchDataGameCredits(setLoadingMarketData1, setViewAllGameCredits);
        fetchDataGiftcards(setLoadingMarketData1, filterUniqueData, setViewAllGiftcard);
        fetchRobloxPartners(setViewRobloxPartners);
    }, [LoginUserID]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedGameData = localStorage.getItem('featuredGameData');

                if (storedGameData) {
                    // If data is already stored in localStorage, use it directly
                    const parsedData = JSON.parse(storedGameData);
                    setScrapedMetacriticData(parsedData);
                    setLoadingMarketData(true);

                }else {
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
                        const combineDataJSON = JSON.stringify(combinedData.slice(0, 7));
                        localStorage.setItem('featuredGameData', combineDataJSON);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData()
    }, [viewMetacriticData, viewWikiData]);
    const handleClickGames = () => {
        setActivePage('games');
    }
    const handleClickGiftcards = () => {
        setActivePage('giftcards');
    }
    const handleAddFavorite = (details) => {
        const productFavGameCode = details.game_canonical;
        const productFavGameName = details.game_title;
    
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
            setFavorites([...favorites, productFavGameCode]);
            fetchGames(setViewAGData1, setLoadingMarketData);
            fetchFavorites(setFavorites, LoginUserID);
          } else {
            console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };
    const handleRemoveFavorite = (gameCanonical) => {
        const removeFav = {
            user: userLoggedData.userid,
            favorite: gameCanonical
        }
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
                setFavorites(favorites.filter(fav => fav !== gameCanonical));
            } else {
                console.log(`Error: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.log(`Error: ${error.message}`);
        });
    };
    const handleFavoriteToggle = (details) => {
        if (favorites.includes(details.game_canonical)) {
            handleRemoveFavorite(details.game_canonical);
        } else {
            handleAddFavorite(details);
        }
    };
    

    const handleAddToCartGame = (details) => {
        const productCartGameCode = details.game_canonical;
        const productCartGameName = details.game_title;
    
        const formAddCart = {
          agCartUsername: userLoggedData.username,
          agCartUserID: userLoggedData.userid,
          agCartProductCode: productCartGameCode,
          agCartProductName: productCartGameName,
          agCartProductPrice: '',
          agCartProductDiscount: '',
          agCartProductType: 'Game',
          agCartProductState: 'Pending',
        }
    
        const jsonUserCartData = JSON.stringify(formAddCart);
        axios.post(AGAddToCartsAPI, jsonUserCartData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === true) {
            fetchUserCart(setProductCarts, LoginUserID);
          } else {
            console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };


    
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
                            <h6>0 <TbShoppingCartPlus  className='faIcons'/></h6>
                        </span>
                        <span>
                            <h6>{viewAllGamesNum.length} <TbDeviceGamepad2 className='faIcons'/></h6>
                        </span>
                        <span>
                            <h6>{viewAllGiftcard.length} <TbGiftCard className='faIcons'/></h6>
                        </span>
                    </div>
                </div>
                {/* <h4 id='mppcth4Title'><FaStar className='faIcons'/> FEATURED GAMES</h4>
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
                                <img src={`https://2wave.io/GameCovers/${details.agData1.game_cover}`} alt="" />
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
                </>} */}
            </section>
            <section className="marketplacePageContainer mid">
                <h4 id='mppcthTitlesfeatured'><TbDeviceGamepad2 className='faIcons'/> FEATURED GAMES</h4>
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
                            <img src={`https://2wave.io/GameCovers/${details.agData1.game_cover}`} alt="" />
                            :<img src={details.originalimage.source} alt="" />}</>
                            <div className="mppcmGameDetails">
                                <h6>{details.agData1.game_title}</h6>
                                <p>
                                    {details.agData1.game_edition} <br /><br />
                                    {details.metadescription.slice(0, 100)+ '...'}
                                </p>
                                <div>
                                    <Link to={`/Games/${details.agData1.game_canonical}`} onClick={handleClickGames}>View Game</Link>
                                </div>
                            </div>
                        </div>
                        ))}
                    </>}
                </div>
                <h4 id='mppcmhTitles'><TbDeviceGamepad2 className='faIcons'/> LISTED GAMES</h4>
                <div className="mpPageContentMid2 website">
                    {loadingMarketData1 ? <>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                    </>:<>{viewAllListedGames.slice(0, 10).map((details, i) => (
                    <div className="mppContentMid2" key={i}>
                        <div className="mppcm2GamePlatform" to={`/Games/${details.game_canonical}`}>
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
                        <Link to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>{details.game_cover !== '' ?
                        <img src={`https://2wave.io/GameCovers/${details.game_cover}`} alt="Image Not Available" />
                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                        {/* <div className="mppcm2GameDiscount">
                            <h4><MdDiscount className='faIcons'/></h4>
                        </div> */}
                        <div className="mppcm2GameDetails">
                            <h5>{details.game_title}</h5>
                            <p>{details.game_edition}</p>
                            <div>
                                <div id="mppcm2GDView">
                                    <h5>$ {(details.stock === undefined) ? 
                                        '--.--': 
                                        ((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                                    </h5>
                                    </div>
                                {userLoggedIn ?<>
                                    <button id={favorites.includes(details.game_canonical) ? 'mppcm2GDHRemove' : 'mppcm2GDAdd'} onClick={() => handleFavoriteToggle(details)}>
                                        {favorites.includes(details.game_canonical) ? <TbHeartFilled className='faIcons'/> : <TbHeart className='faIcons'/>}
                                    </button>
                                    {productCart.some(cartItem => cartItem.ag_product_id === details.game_canonical) ?
                                        <button id='mppcm2GDAddedCart'><TbShoppingCartFilled className='faIcons'/></button>:
                                        <button id='mppcm2GDCart' onClick={() => handleAddToCartGame(details)} disabled={(details.stockCount === 0) ? true : false}>
                                            {(details.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : <TbShoppingCartPlus className='faIcons'/>}
                                        </button>
                                    }
                                </>:<>
                                    <button id='mppcm2GDAdd'><TbHeart className='faIcons'/></button>
                                    <button id='mppcm2GDCart'><TbShoppingCartPlus className='faIcons'/></button>
                                </>}
                            </div>
                        </div>
                    </div>
                    ))}</>}
                </div>
                <div className="mpPageContentMid2 mobile">
                    {loadingMarketData1 ? <>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                        <div className="mppContentMid2Dummy"><div className="mppcm2gpDummy"></div></div>
                    </>:<>{viewAllListedGames.slice(0, 4).map((details, i) => (
                    <Link className="mppContentMid2" key={i} to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>
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
                        <img src={`https://2wave.io/GameCovers/${details.game_cover}`} alt="Image Not Available" />
                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</>
                        <div className="mppcm2GameDiscount">
                            <h4><MdDiscount className='faIcons'/></h4>
                        </div>
                        <div className="mppcm2GameDetails">
                            <h5>{details.game_title}</h5>
                            <p>{details.game_edition}</p>
                            <div>
                                <div id="mppcm2GDView">
                                    <h5>$ {(details.stock === undefined) ? 
                                        '--.--': 
                                        ((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                                    </h5>
                                </div>
                                {userLoggedIn ?<>
                                    <button id={favorites.includes(details.game_canonical) ? 'mppcm2GDHRemove' : 'mppcm2GDAdd'} onClick={() => handleFavoriteToggle(details)}>
                                        {favorites.includes(details.game_canonical) ? <TbHeartFilled className='faIcons'/> : <TbHeart className='faIcons'/>}
                                    </button>
                                    {productCart.some(cartItem => cartItem.ag_product_id === details.game_canonical) ?
                                        <button id='mppcm2GDAddedCart'><TbShoppingCartFilled className='faIcons'/></button>:
                                        <button id='mppcm2GDCart' onClick={() => handleAddToCartGame(details)} disabled={(details.stockCount === 0) ? true : false}>
                                            {(details.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : <TbShoppingCartPlus className='faIcons'/>}
                                        </button>
                                    }
                                </>:<>
                                    <button id='mppcm2GDAdd'><TbHeart className='faIcons'/></button>
                                    <button id='mppcm2GDCart'><TbShoppingCartPlus className='faIcons'/></button>
                                </>}
                            </div>
                        </div>
                    </Link>
                    ))}</>}
                </div>
                {/* <div className="mpPageContentMid3">
                    <Link className="mppcm3TrendingGames">
                        <h5><TbTrendingUp className='faIcons'/>TRENDING GAMES</h5>
                    </Link>
                    <Link className="mppcm3HotGames">
                        <h5><TbCampfireFilled className='faIcons'/>HOT GAMES</h5>
                    </Link>
                    <Link className="mppcm3ClassicGames">
                        <h5><TbAwardFilled className='faIcons'/>CLASSIC GAMES</h5>
                    </Link>
                </div> */}
                <div className="mpPageContentM2ShowMore">
                    <Link to='/Games' onClick={handleClickGames}><TbSquareRoundedArrowRight className='faIcons'/> View More Games</Link>
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
                <h4 id='mppcmhTitles'><TbGiftCard className='faIcons'/> AVAILABLE GIFTCARDS</h4>
                <div className="mpPageContentMid6 website">
                    {loadingMarketData1 ? <>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                    </>:<>{viewAllGiftcard.slice(0, 10).map((details, i) => (
                            <Link className="mppContentMid6" key={i} to={`/Giftcards/${details.giftcard_canonical}`} onClick={handleClickGiftcards}>
                                <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                            </Link>
                        ))}
                    </>}
                </div>
                <div className="mpPageContentMid6 mobile">
                    {loadingMarketData1 ? <>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                    </>:<>{viewAllGiftcard.slice(0, 4).map((details, i) => (
                            <Link className="mppContentMid6" key={i} to={`/Giftcards/${details.giftcard_canonical}`} onClick={handleClickGiftcards}>
                                <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                            </Link>
                        ))}
                    </>}
                </div>
                <div className="mpPageContentM2ShowMore">
                    <Link to='/Giftcards' onClick={handleClickGiftcards}><TbSquareRoundedArrowRight className='faIcons'/> View More Giftcards</Link>
                </div>
                <h4 id='mppcmhTitles'><TbDiamond className='faIcons'/> AVAILABLE GAME CREDITS</h4>
                <div className="mpPageContentMid7">
                    <>
                        {viewAllGameCredits.slice(0, 1).map((details, i) => (
                            <Link className="mppContentMid6" key={i} to={`/GameCredits/Robux`} onClick={handleClickGiftcards}>
                                <img src={`https://2wave.io/GameCreditCovers/${details.gamecredit_cover}`} alt="" />
                            </Link>
                        ))}
                    </>
                </div>
            </section>
        </div>
    )
}

export default Marketplace