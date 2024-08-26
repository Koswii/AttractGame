import React, { useState, useEffect } from 'react'
import "../CSS/marketplace.css";
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

// slider
import finalFantasy from '../assets/imgs/marketSlider/finalFantasy7.png'
import likeAdragon from '../assets/imgs/marketSlider/likeAdragon.png'
import tekken8 from '../assets/imgs/marketSlider/tekken8.png'
 

const AGGameCreditsListAPI = process.env.REACT_APP_AG_GAMECREDIT_LIST_API;
const AGGamesRobloxPartners = process.env.REACT_APP_AG_GAMES_ROBLOX_API;
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



const ImageComponentGames = ({ imageName }) => {
    const { fetchAndCacheImageGames, imageCache } = GamesFetchData();
    const [loading, setLoading] = useState(true);
    const baseUrl = 'https://2wave.io/GameCovers/';
    const url = `${baseUrl}${imageName}`;

    useEffect(() => {
        fetchAndCacheImageGames(imageName);
    }, [imageName]);

    useEffect(() => {
        if (imageCache[url]) {
            setLoading(false);
        }
    }, [imageCache, url]);

    return (
        <img src={loading ? placeholderImage : imageCache[url]} alt="Loading..." />
    );
};
const ImageComponentGiftcards = ({ imageName }) => {
    const { fetchAndCacheImageGiftcards, imageCache } = GiftcardsFetchData();
    const [loading, setLoading] = useState(true);
    const baseUrl = 'https://2wave.io/GiftCardCovers/';
    const url = `${baseUrl}${imageName}`;

    useEffect(() => {
        fetchAndCacheImageGiftcards(imageName);
    }, [imageName]);

    useEffect(() => {
        if (imageCache[url]) {
            setLoading(false);
        }
    }, [imageCache, url]);

    return (
        <img src={loading ? placeholderImage : imageCache[url]} alt="Loading..." />
    );
};

const Marketplace = () => {
    const { setActivePage } = useActivePage();
    const navigate = useNavigate ();
    const { 
        userLoggedData,
        handleLoginForm  
    } = UserProfileData();
    const { 
        viewAllGames,
        viewAllGamesNum,
        viewAllListedGames,
        viewAGData2,
        viewWikiData,
        viewMetacriticData,
        loadingMarketData2 
    } = GamesFetchData();
    const { filteredGiftcards } = GiftcardsFetchData();
    const { filteredGamecredits } = GamecreditsFetchData();
    const { 
        fetchFavorites, 
        favorites, 
        setFavorites,
        numberOfLikes 
    } = FavoritesFetchData();
    const { 
        fetchUserCart, 
        productCart, 
        setProductCarts 
    } = CartsFetchData();

    const [viewRegularGiftcards, setViewRegularGiftcards] = useState([]);

    useEffect(() => {
        const regularGiftcards = filteredGiftcards.filter(giftcard => giftcard.giftcard_category !== "Special");
        setViewRegularGiftcards(regularGiftcards);
    }, [filteredGiftcards]);



    const AGAddToFavorites = process.env.REACT_APP_AG_ADD_USER_FAV_API;
    const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [viewAllGameCredits, setViewAllGameCredits] = useState([]);
    const [loadingMarketData, setLoadingMarketData] = useState(false);
    const [loadingMarketData1, setLoadingMarketData1] = useState(true);
    const [scrapedMetacriticData, setScrapedMetacriticData] = useState('');
    const [viewRobloxPartners, setViewRobloxPartners] = useState([]);
    const [productFavAdded, setProductFavAdded] = useState('');
    const [productCartAdded, setProductCartAdded] = useState('');

    useEffect(() => {
        fetchUserCart();
        fetchFavorites();
        fetchDataGameCredits(setLoadingMarketData1, setViewAllGameCredits);
        fetchRobloxPartners(setViewRobloxPartners);
    }, [LoginUserID]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const storedGameData = localStorage.getItem('featuredGameData');

    //             if (storedGameData) {
    //                 // If data is already stored in localStorage, use it directly
    //                 const parsedData = JSON.parse(storedGameData);
    //                 setScrapedMetacriticData(parsedData);
    //                 setLoadingMarketData(true);

    //             }else {
    //                 const metacriticUrls = viewMetacriticData.map(game => `https://engeenx.com/proxyMetacritic.php?game=${game}/`);
    //                 const metacriticResponses = await Promise.all(metacriticUrls.map(url => axios.get(url)));
        
    //                 // Combine all Wikipedia URLs into one request
    //                 const wikipediaUrls = viewWikiData.map(game => `https://engeenx.com/proxyWikipedia.php?game=${game}`);
    //                 const wikipediaResponses = await Promise.all(wikipediaUrls.map(url => axios.get(url)));
        
    //                 // Combine Metacritic and Wikipedia data
    //                 const combinedData = metacriticResponses.map((metacriticResponse, index) => {
    //                     const html = metacriticResponse.data;
    //                     const parser = new DOMParser();
    //                     const doc = parser.parseFromString(html, 'text/html');
    //                     const targetElementMetaScore = doc.querySelector('.c-siteReviewScore');
    //                     const targetElementDescription = doc.querySelector('.c-productionDetailsGame_description');
    //                     const targetElementReleaseDate = doc.querySelector('.c-gameDetails_ReleaseDate .g-outer-spacing-left-medium-fluid');
    //                     const targetElementPublisher = doc.querySelector('.c-gameDetails_Distributor .g-outer-spacing-left-medium-fluid');
    //                     const targetElementGenre = doc.querySelector('.c-genreList .c-genreList_item .c-globalButton .c-globalButton_container .c-globalButton_label');
        
    //                     const metascore = targetElementMetaScore ? targetElementMetaScore.textContent.trim() : '';
    //                     const metadescription = targetElementDescription ? targetElementDescription.textContent.trim() : '';
    //                     const release = targetElementReleaseDate ? targetElementReleaseDate.textContent.trim() : 'To Be Announced';
    //                     const publisher = targetElementPublisher ? targetElementPublisher.textContent.trim() : '';
    //                     const genre = targetElementGenre ? targetElementGenre.textContent.trim() : '';
        
    //                     const wikiDetailsData = wikipediaResponses[index] ? wikipediaResponses[index].data : {};
    //                     return { metascore, metadescription, release, publisher, genre, ...wikiDetailsData, agData1: viewAGData2[index] };
    //                 });
        
    //                 if(combinedData.length == 0){
    //                     setLoadingMarketData(false);
    //                 }else{
    //                     setLoadingMarketData(true);
    //                     setScrapedMetacriticData(combinedData.slice(0, 7));
    //                     const combineDataJSON = JSON.stringify(combinedData.slice(0, 7));
    //                     localStorage.setItem('featuredGameData', combineDataJSON);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //     fetchData()
    // }, [viewMetacriticData, viewWikiData]);
    const handleClickGames = () => {
        setActivePage('games');
    }
    const handleClickGiftcards = () => {
        setActivePage('giftcards');
    }
    const handleClickGamecredits = () => {
        setActivePage('gamecredits');
    }
    const handleAddFavorite = (details) => {
        const productFavGameCode = details.game_canonical;
        const productFavGameName = details.game_title;
        setProductFavAdded(productFavGameCode)
    
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
            setFavorites([...favorites, productFavGameCode]);
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
        setProductFavAdded('')
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
        setProductCartAdded(productCartGameCode)
    
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
            // console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            // console.log(error);
        });
    };


    const gameLikes = viewAllListedGames.map(games => {
        const prodLikes = numberOfLikes.filter(stock => stock.ag_product_id === games.game_canonical).length;
        return {
            ...games, prodLikes,
        };
    });


    const [sliderFeat,setSliderFeat] = useState('first')

    useEffect(() => {
        const interval = setInterval(() => {
            setSliderFeat(prevFeat => {
                if (prevFeat === 'first') {
                    return 'second';
                } else if (prevFeat === 'second') {
                    return 'third';
                } else {
                    return 'first';
                }
            });
        }, 3000);

        // Clear interval on component unmount to avoid memory leaks
        return () => clearInterval(interval);
    }, []);

    
    return (
        <div className='mainContainer marketplace'>
            <section className="marketplacePageContainer top">
                <div className="mpPageContentTopNav">
                    {/* <div className='mppctn left'>
                        <h6><FaSearch className='faIcons'/></h6>
                        <input type="text" placeholder='Search Games / Vouchers / Giftcards / Crypto / Merchandise'/>
                    </div> */}
                    <div className="mppctn right">
                        <span>
                            <h6>{viewAllGamesNum.length} <TbDeviceGamepad2 className='faIcons'/></h6>
                        </span>
                        <span>
                            <h6>{viewRegularGiftcards.length} <TbGiftCard className='faIcons'/></h6>
                        </span>
                        <span>
                            <h6>{filteredGamecredits.length} <TbDiamond className='faIcons'/></h6>
                        </span>
                    </div>
                </div>
            </section>
            <section className="marketplacePageContainer mid">
                <h4 id='mppcthTitlesfeatured'><TbDeviceGamepad2 className='faIcons'/> FEATURED GAMES</h4>
                <div className="mppctFeaturedGame">
                    <div className="mppctFeaturedGameSlider">
                        <section>
                            <div className={`sliderImgs ${sliderFeat}`}>
                                <img src={finalFantasy} alt=""/>
                                <img src={tekken8} alt="" />
                                <img src={likeAdragon} alt="" />
                            </div>
                        </section>
                    </div>
                </div>
                {/* <div className="mpPageContentMid1">
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
                </div> */}
                <h4 id='mppcmhTitles'><TbDeviceGamepad2 className='faIcons'/> LISTED GAMES</h4>
                <div className="mpPageContentMid2 website">
                    {loadingMarketData2 ? <>
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
                    </>:<>{gameLikes.slice(0, 10).map((details, i) => (
                    <div className="mppContentMid2" key={i}>
                        <div className="mppcm2GamePlatform" to={`/Games/${details.game_canonical}`}>
                            <img platform={details.game_platform} src="" alt="" />
                        </div>
                        {(details.game_seller === 'Attract Game') && 
                        <div className="mppcm2GameSeller">
                            <img src={require('../assets/imgs/AGLogoWhite01.png')} alt="" />
                        </div>}
                        <Link to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>{details.game_cover !== '' ?
                        <ImageComponentGames imageName={details.game_cover} />
                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                        <div className="mppcm2GameDetails">
                            <div className="mppcm2gdTitle">
                                <h5>{details.game_title}<br /><span>{details.game_edition}</span></h5>
                            </div>
                            {/* <p>{details.game_edition}</p> */}
                            <div className="mppcm2gdPricing">
                                <div id="mppcm2GDView">
                                    {(details.stock === undefined) ?
                                    <h5 id='gameNoStocks'>No Stocks</h5>:
                                    <h5>$ {((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                                    </h5>}
                                    </div>
                                {userLoggedIn ?<>
                                    <button id={favorites.includes(details.game_canonical) ? 'mppcm2GDHRemove' : 'mppcm2GDAdd'} onClick={() => handleFavoriteToggle(details)}>
                                        {favorites.includes(details.game_canonical) ? <TbHeartFilled className='faIcons'/> : 
                                        <>
                                            {(productFavAdded === details.game_canonical) ? 
                                            <TbHeartFilled className='faIcons red'/>:
                                            <TbHeart className='faIcons'/>}
                                        </>
                                        }
                                    </button>
                                    {productCart.some(cartItem => cartItem.ag_product_id === details.game_canonical) ?
                                        <button id='mppcm2GDAddedCart'><TbShoppingCartFilled className='faIcons'/></button>:
                                        <button id='mppcm2GDCart' onClick={() => handleAddToCartGame(details)} disabled={(details.stockCount === 0) ? true : false}>
                                            {(details.stock === undefined) ? <TbShoppingCartOff className='faIcons'/> : 
                                            <>
                                                {(productCartAdded === details.game_canonical) ? 
                                                <TbShoppingCartFilled className='faIcons gold'/>:
                                                <TbShoppingCartPlus className='faIcons'/>}
                                            </>}
                                        </button>
                                    }
                                </>:<>
                                    <button id='mppcm2GDAdd' onClick={handleLoginForm}><TbHeart className='faIcons'/></button>
                                    <button id='mppcm2GDCart' onClick={handleLoginForm}><TbShoppingCartPlus className='faIcons'/></button>
                                </>}
                            </div>
                            {/* <div className="mppcm2GameCategory">
                                <span>
                                    {(details.game_seller === 'Attract Game') && <img src={require('../assets/imgs/AGLogoWhite01.png')} alt="" />}
                                </span>
                                {(details.prodLikes >= 1) && <h4><TbHeartFilled className='faIcons'/> {details.prodLikes}</h4>}
                            </div> */}
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
                    </>:<>{gameLikes.slice(0, 4).map((details, i) => (
                    <Link className="mppContentMid2" key={i} to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>
                        <div className="mppcm2GamePlatform">
                            <img platform={details.game_platform} src="" alt="" />
                        </div>
                        <>{details.game_cover !== '' ?
                        <ImageComponentGames imageName={details.game_cover} />
                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</>
                        <div className="mppcm2GameDetails">
                            <div className="mppcm2gdTitle">
                                <h5>{details.game_title}<br /><span>{details.game_edition}</span></h5>
                            </div>
                            {/* <p>{details.game_edition}</p> */}
                            <div className="mppcm2gdPricing">
                                <div id="mppcm2GDView">
                                    {(details.stock === undefined) ?
                                    <h5 id='gameNoStocks'>No Stocks</h5>:
                                    <h5>$ {((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                                    </h5>}
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
                            {/* <div className="mppcm2GameCategory">
                                <span>
                                    <img src={require('../assets/imgs/AGLogoWhite.png')} alt="" />
                                </span>
                                {(details.prodLikes >= 3) && <h4><TbHeartFilled className='faIcons'/> {details.prodLikes} Liked This</h4>}
                            </div> */}
                        </div>
                    </Link>
                    ))}</>}
                </div>
                <div className="mpPageContentM2ShowMore">
                    <Link to='/Games' onClick={handleClickGames}><TbSquareRoundedArrowRight className='faIcons'/> View More Games</Link>
                </div>
                <div className="mpPageContentMid3">
                    <div className="mppcm3Content">
                        
                    </div>
                </div>
                <div className="mpPageContentMid4">
                    <div className="mppcm4GiftCard">
                        <h6>ROBLOX GIFTCARDS</h6>
                        <p>Purchase Roblox Giftcards to get AG Points and a chance to win on Attract Game's monthly Raffle</p>
                        <img src={require('../assets/imgs/GiftCards/RobloxGiftCard.png')} alt="" />
                        <div>
                            <Link to='/GameCredits/Robux'>View Guide</Link>
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
                    {loadingMarketData2 ? <>
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
                    </>:<>{viewRegularGiftcards.slice(0, 10).map((details, i) => (
                            <Link className="mppContentMid6" key={i} to={`/Giftcards/${details.giftcard_canonical}`} onClick={handleClickGiftcards}>
                                <ImageComponentGiftcards imageName={details.giftcard_cover} />
                            </Link>
                        ))}
                    </>}
                </div>
                <div className="mpPageContentMid6 mobile">
                    {loadingMarketData2 ? <>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                        <div className="mppContentMid6Dummy"></div>
                    </>:<>{viewRegularGiftcards.slice(0, 4).map((details, i) => (
                            <Link className="mppContentMid6" key={i} to={`/Giftcards/${details.giftcard_canonical}`} onClick={handleClickGiftcards}>
                                <ImageComponentGiftcards imageName={details.giftcard_cover} />
                            </Link>
                        ))}
                    </>}
                </div>
                <div className="mpPageContentM2ShowMore">
                    <Link to='/Giftcards' onClick={handleClickGiftcards}><TbSquareRoundedArrowRight className='faIcons'/> View All Giftcards</Link>
                </div>
                <h4 id='mppcmhTitles'><TbDiamond className='faIcons'/> AVAILABLE GAME CREDITS</h4>
                <div className="mpPageContentMid7 website">
                    {loadingMarketData2 ? <>
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
                    </>:<>
                        {filteredGamecredits.slice(0, 10).map((details, i) => (
                            <Link className="mppContentMid6" key={i} to={`/GameCredits/${details.gamecredit_canonical}`} onClick={handleClickGiftcards}>
                                <img src={`https://2wave.io/GameCreditCovers/${details.gamecredit_cover}`} alt="" />
                            </Link>
                        ))}
                    </>}
                </div>
                <div className="mpPageContentMid7 mobile">
                    {loadingMarketData2 ? <>
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
                    </>:<>
                        {filteredGamecredits.slice(0, 4).map((details, i) => (
                            <Link className="mppContentMid6" key={i} to={`/GameCredits/${details.gamecredit_canonical}`} onClick={handleClickGiftcards}>
                                <img src={`https://2wave.io/GameCreditCovers/${details.gamecredit_cover}`} alt="" />
                            </Link>
                        ))}
                    </>}
                </div>
                <div className="mpPageContentM2ShowMore">
                    <Link to='/GameCredits' onClick={handleClickGamecredits}><TbSquareRoundedArrowRight className='faIcons'/> View All Game Credits</Link>
                </div>
            </section>
        </div>
    )
}

export default Marketplace