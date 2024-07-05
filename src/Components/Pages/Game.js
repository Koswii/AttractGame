import React, { useEffect, useState, useRef } from 'react'
import "../CSS/game.css";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useActivePage } from './ActivePageContext';
import { UserProfileData } from './UserProfileContext';
import { GamesFetchData } from './GamesFetchContext';
import { FavoritesFetchData } from './FavoritesFetchContext';
import { CartsFetchData } from './CartsFetchContext';
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
    TbShoppingCartFilled,  
    TbShoppingCartOff,
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
        <img src={imageCache[url]} alt="Loading..." />
    );
};




const Game = () => {
    const { gameCanonical } = useParams();
    const { setActivePage } = useActivePage();
    const { userLoggedData } = UserProfileData();
    const { 
        viewAGData1,
        loadingMarketData,
        viewAllListedGames,
        setLoadingMarketData,
        fetchAndCacheImage,
        imageCache 
    } = GamesFetchData();
    const { 
        fetchFavorites, 
        favorites, 
        setFavorites 
    } = FavoritesFetchData();
    const { 
        fetchUserCart, 
        carts,
        productCart, 
        setProductCarts 
    } = CartsFetchData();
    const AGAddToFavorites = process.env.REACT_APP_AG_ADD_USER_FAV_API;
    const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [scrapedMetacriticData, setScrapedMetacriticData] = useState('');
    const [productFavAdded, setProductFavAdded] = useState(false);
    const [productCartAdded, setProductCartAdded] = useState(false);

    const getRandomItems = (array, numItems) => {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numItems);
    };

    const agGameData = viewAGData1.filter(game => game.game_canonical === gameCanonical);
    const agGameTitle = agGameData.map(game => game.game_title);
    const agGameTitleExt1 = agGameData.map(game => game.game_title_ext1);
    const agGameTitleExt2 = agGameData.map(game => game.game_title_ext2);
    
    const gameTitleExt2 = agGameTitleExt2.length > 0 ? agGameTitleExt2[0].toLowerCase().replace(/\s/g, '-') : null;
    const gameTitle = agGameTitle.length > 0 ? agGameTitle[0].toLowerCase().replace(/\s/g, '-') : null;
    const gameCSFeatMetacritic = gameTitleExt2 || gameTitle;
    
    const gameTitleExt1 = agGameTitleExt1.length > 0 ? agGameTitleExt1[0].replace(/\s/g, '_') : null;
    const gameTitleForWikipedia = agGameTitle.length > 0 ? agGameTitle[0].replace(/\s/g, '_') : null;
    const gameCSFeatWikipedia = gameTitleExt1 || gameTitleForWikipedia;

    const agGameDataCanonical = agGameData.map(game => game.game_canonical);
    const agGameDataName = agGameData.map(game => game.game_title);
    const agGameDataCover = agGameData.map(game => game.game_cover);
    const agGameDataCategory = agGameData.map(game => game.game_category);
    const agGameDataEdition = agGameData.map(game => game.game_edition);
    const agGameDataPlatform = agGameData.map(game => game.game_platform);
    const agGameDataDeveloper = agGameData.map(game => game.game_developer);
    const agGameDataReleased = agGameData.map(game => game.game_released);
    const agGameDataTrailer = agGameData.map(game => game.game_trailer);
    const agGameStockCount = agGameData.map(game => game.stockCount);
    const agGameStock = `${agGameData.map(game => game.stock)}`;
    const agGameStockPrice = (agGameStock !== '') ? agGameData.map(game => game.stock.ag_product_price) : 0;
    const agGameStockDiscount = (agGameStock !== '') ? agGameData.map(game => game.stock.ag_product_discount) : 0;
    const agGameTotalPrice = ((parseFloat(agGameStockPrice) - parseFloat(agGameStockDiscount / 100) * parseFloat(agGameStockPrice)).toFixed(2))

    const agGameOnCart = agGameDataCanonical.filter(game => carts.includes(game));
    const agGameOnFavorites = agGameDataCanonical.filter(game => favorites.includes(game));


    useEffect(() => {
        if(`${agGameOnCart}` === `${agGameDataCanonical}`){
            setIsInCart(true);
        }else{
            setIsInCart(false);
        }
    }, []);
    useEffect(() => {
        if(`${agGameOnFavorites}` === `${agGameDataCanonical}`){
            setIsFavorite(true);
        }else{
            setIsFavorite(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch details for a single game from Wikipedia
                const wikipediaUrl = await axios.get(`https://engeenx.com/proxyWikipedia.php?game=${gameCSFeatWikipedia}`);
                const wikipediaResponse = wikipediaUrl.data;

                const metacriticUrls = await axios.get(`https://engeenx.com/proxyMetacritic.php?game=${gameCSFeatMetacritic}/`);
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


                const combinedMetaWikiData = {...wikipediaResponse, metascore, metadescription, release, publisher, genre};
                setScrapedMetacriticData(combinedMetaWikiData);

            } catch (error) {
                console.error('Error fetching data:', error);
            } 
        };
        fetchData();
        fetchUserCart();
        fetchFavorites();
    }, [gameCSFeatMetacritic, gameCSFeatWikipedia, scrapedMetacriticData]);

    const handleClickGames = () => {
        setActivePage('games');
    }
    const handleAddFavorite = () => {
        setProductFavAdded(true)
        const formAddfavorite = {
          agFavUsername: userLoggedData.username,
          agFavUserID: userLoggedData.userid,
          agFavGameCode: gameCanonical,
          agFavGameName: `${agGameDataName}`,
        }
    
        const jsonUserFavData = JSON.stringify(formAddfavorite);
        axios.post(AGAddToFavorites, jsonUserFavData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === true) {
            setIsFavorite(true);
            fetchFavorites();
          } else {
            console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };
    const handleRemoveFavorite = () => {
        setProductFavAdded(false)
        const removeFav = {
            user: userLoggedData.userid,
            favorite: gameCanonical,
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
                setIsFavorite(false);
                fetchFavorites();
            } else {
                console.log(`Error: ${response.data.message}`);
            }
        })
        .catch(error => {
            console.log(`Error: ${error.message}`);
        });
    };
    const handleFavoriteToggle = () => {
        if (isFavorite) {
            handleRemoveFavorite();
        } else {
            handleAddFavorite();
        }
    };
    const handleAddToCart = () => {
        setProductCartAdded(true)
        const formAddCart = {
          agCartUsername: userLoggedData.username,
          agCartUserID: userLoggedData.userid,
          agCartProductCode: gameCanonical,
          agCartProductName: `${agGameDataName}`,
          agCartProductPrice: `${agGameStockPrice}`,
          agCartProductDiscount: `${agGameStockDiscount}`,
          agCartProductType: 'Game',
          agCartProductState: 'Pending',
        }
    
        const jsonUserCartData = JSON.stringify(formAddCart);
        axios.post(AGAddToCartsAPI, jsonUserCartData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === true) {
            fetchUserCart(setProductCarts, LoginUserID);
            setIsInCart(true);
          } else {
            console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };







    return (
        <div className='mainContainer gameProfile'>
            <section className="gamePageContainer top">
                {!loadingMarketData ? 
                <div className="gpPageContentTop">
                    <div className="gppctGameDetails loading">
                        <div className="gppctgdlmageDummy"></div>
                        <div className="gppctgdDetailsDummy">
                            <div className="gppctgdddTitle"></div>
                            <div className="gppctgdddCategories"></div>
                            <div className="gppctgdddRelease"></div><br />
                            <p></p>
                            <p></p>
                            <p></p>
                        </div>
                    </div>
                </div>:
                <div className="gpPageContentTop">
                    <div className="gppctGameDetails left">
                        {scrapedMetacriticData.metascore ?
                        <div className="gppctgdMetacritic">
                            <h3>{scrapedMetacriticData.metascore ? scrapedMetacriticData.metascore : 'tbd'}</h3>
                            <p>Metascore</p>
                        </div>:
                        <div className="gppctgdMetacriticDummy"></div>
                        }
                        <div className="gppctgdCategory">
                            <h5>
                                {(agGameDataCategory === 'Trending') && <><TbTrendingUp className={`faIcons ${(agGameDataCategory === 'Trending') ? 'Trending' : ''}`}/> TRENDING</>}
                                {(agGameDataCategory === 'Hot') && <><TbCampfireFilled className={`faIcons ${(agGameDataCategory === 'Hot') ? 'Hot' : ''}`}/> HOT</>}
                                {(agGameDataCategory === 'Classic') && <><TbAwardFilled className={`faIcons ${(agGameDataCategory === 'Classic') ? 'Classic' : ''}`}/> CLASSIC</>}
                                {(agGameDataCategory === 'Preorder') && <><TbCalendarStar className={`faIcons ${(agGameDataCategory === 'Preorder') ? 'Preorder' : ''}`}/> PREORDER</>}
                            </h5>
                        </div>
                        <>{scrapedMetacriticData.game_cover !== '' ?
                        <img src={`https://2wave.io/GameCovers/${agGameDataCover}`} alt="" />
                        :<img src={scrapedMetacriticData.originalimage.source} alt="" />}</>
                    </div>
                    <div className="gppctGameDetails right">
                        <h3>{agGameDataName}</h3>
                        <div className='gppctgdrDetails'>
                            {agGameDataEdition ? <h6>{agGameDataEdition}</h6> : <></>}
                            {agGameDataPlatform ? <h6>{agGameDataPlatform ? agGameDataPlatform + ' Game' : ''}</h6> : <></>}
                            {agGameDataDeveloper ? <h6>{agGameDataDeveloper}</h6> : <></>}
                            {scrapedMetacriticData.publisher ? 
                                <h6>{scrapedMetacriticData.publisher}</h6> : 
                                <h6 className='gppctgdrdDummy'></h6>
                            }
                            {scrapedMetacriticData.genre ? 
                                <h6>{scrapedMetacriticData.genre}</h6> : 
                                <h6 className='gppctgdrdDummy'></h6>
                            }
                        </div>
                        <h5>GAME RELEASED: {agGameDataReleased ? formatDateToWordedDate(agGameDataReleased) : '-'}</h5>
                        <div className="gppctgdrMetacritic">
                            {scrapedMetacriticData.metadescription ?
                                <p>{scrapedMetacriticData.metadescription ? 
                                    <>{(scrapedMetacriticData.metadescription.slice(0, 300)+ '...')}</> 
                                    :<>No Metacritic and Wikipedia details yet. <br /><br /><br /><br /><br /></>}
                                </p>:
                                <>
                                    <p className='gppctgdrmDummy'></p>
                                    <p className='gppctgdrmDummy'></p>
                                    <p className='gppctgdrmDummy'></p>
                                </>
                            }
                            <div>
                                {scrapedMetacriticData.metadescription ? <a href={`https://www.metacritic.com/game/${gameCSFeatMetacritic}/`} target='blank'>View Metacritic</a> : <></>}
                                {scrapedMetacriticData.extract ? <a href={`https://en.wikipedia.org/wiki/${gameCSFeatWikipedia}`} target='blank'>View Wikipedia</a> : <></>}
                            </div>
                        </div>
                        <div className="gppctgdrExtras">
                            {(agGameStock === '' || 0) ?
                            <h4 id='gameNoStock'>No Stocks</h4>:
                            <h4>$ {agGameTotalPrice}
                            </h4>}
                            {userLoggedIn ?<>
                                <button id={isFavorite ? 'gppct2gdRemoveFav' : 'gppct2gdAddFav'} onClick={handleFavoriteToggle}>
                                    {isFavorite ? <TbHeartFilled className='faIcons'/> : 
                                    <>
                                        {(productFavAdded) ? 
                                        <TbHeartFilled className='faIcons red'/>:
                                        <TbHeart className='faIcons'/>}
                                    </>
                                    }
                                </button>
                                {isInCart ? 
                                    <button id='gppct2gdGameCart'><TbShoppingCartFilled className='faIcons'/></button>:
                                    <button onClick={handleAddToCart} disabled={(agGameStock === '' || 0) ? true : false}>
                                        {(agGameStock === '' || 0) ? <TbShoppingCartOff className='faIcons'/> : 
                                        <>
                                            {(productCartAdded) ? 
                                            <TbShoppingCartFilled className='faIcons gold'/>:
                                            <TbShoppingCartPlus className='faIcons'/>}
                                        </>}
                                    </button>
                                }
                            </>:<>
                                <button><TbHeart className='faIcons'/></button>
                                <button><TbShoppingCartPlus className='faIcons'/></button>
                            </>}
                            <div>
                                <h6>{(agGameStockCount === 0 ? 'Out of Stock':'Game On-Stock')}</h6>
                                <p>{agGameStockCount} Stocks</p>
                            </div>
                        </div>
                    </div>
                </div>}
            </section>
            <section className="gamePageContainer mid">
                <div className="gpPageContentMid1">
                    <div className="gppcm1Container left">
                        <YouTubeEmbed videoUrl={`${agGameDataTrailer}`} />
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
                <h4>GAMES YOU MIGHT ALSO LIKE</h4>
                <div className="gpPageContentMid3 website">
                    {viewAllListedGames.slice(0, 10).map((details, i) => (
                        <Link className="gppcm3OtherGame" key={i} to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>
                            <ImageComponentGames imageName={details.game_cover} />
                            <div className="gppcm3ogPlatform">
                                <img src="" platform={details.game_platform} alt="" />
                            </div>
                            <div className="gppcm3ogDetails">
                                <h5>{details.game_title}</h5>
                                <p>{details.game_edition}</p>
                                <div>
                                    <div id="mppcm2GDView">
                                        {(details.stock === undefined) ?
                                        <h5 id='gameNoStocks'>No Stocks</h5>:
                                        <h5>$ {((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                                        </h5>}
                                    </div>
                                    {/* <button id='mppcm2GDHeart'><TbHeart className='faIcons'/></button>
                                    <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button> */}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="gpPageContentMid3 mobile">
                    {viewAllListedGames.slice(0, 6).map((details, i) => (
                        <Link className="gppcm3OtherGame" key={i} to={`/Games/${details.game_canonical}`} onClick={handleClickGames}>
                            <ImageComponentGames imageName={details.game_cover} />
                            <div className="gppcm3ogPlatform">
                                <img src="" platform={details.game_platform} alt="" />
                            </div>
                            <div className="gppcm3ogDetails">
                                <h5>{details.game_title}</h5>
                                <p>{details.game_edition}</p>
                                <div>
                                    <div id="mppcm2GDView">
                                        <h5>$ {(details.stock === undefined) ? 
                                            '--.--': 
                                            ((parseFloat(details.stock.ag_product_price) - parseFloat(details.stock.ag_product_discount / 100) * parseFloat(details.stock.ag_product_price)).toFixed(2))}
                                        </h5>
                                    </div>
                                    {/* <button id='mppcm2GDHeart'><TbHeart className='faIcons'/></button>
                                    <button id='mppcm2GDCart'><TbShoppingCartBolt className='faIcons'/></button> */}
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