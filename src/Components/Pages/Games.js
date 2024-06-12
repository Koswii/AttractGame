import React, { useEffect, useState, useRef } from 'react'
import "../CSS/games.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    TbShoppingCartPlus,
    TbShoppingCartFilled,  
    TbHeart,
    TbHeartFilled,     
} from "react-icons/tb";
import { GiConsoleController } from "react-icons/gi";
import { TbCategoryFilled } from "react-icons/tb";
import { MdOutlineFavorite } from "react-icons/md";
import { VscVersions } from "react-icons/vsc";

const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
const AGUserFavoritesAPI = process.env.REACT_APP_AG_FETCH_USER_FAV_API;
const AGUserProductsCartAPI = process.env.REACT_APP_AG_FETCH_USER_CART_API;
const fetchGames = async (setViewAGData1, setLoadingMarketData) => {
    try {
        const response1 = await axios.get(AGGamesListAPI1);
        const agAllGames = response1.data;
        const agSortAllGamesByDate = agAllGames.sort((a, b) => new Date(b.game_released) - new Date(a.game_released));
        setViewAGData1(agSortAllGamesByDate);
        setLoadingMarketData(true);
    } catch (error) {
        console.error(error);
    }
};
const fetchFavorites = async (setFavorites, LoginUserID) => {
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




const Games = () => {
    const AGAddToFavoritesAPI = process.env.REACT_APP_AG_ADD_USER_FAV_API;
    const AGUserRemoveFavAPI = process.env.REACT_APP_AG_REMOVE_USER_FAV_API;
    const AGAddToCartsAPI = process.env.REACT_APP_AG_ADD_USER_CART_API;
    const userLoggedIn = localStorage.getItem('isLoggedIn')
    const LoginUserID = localStorage.getItem('profileUserID');
    const [userLoggedData, setUserLoggedData] = useState('')
    const [viewAGData1, setViewAGData1] = useState([]);
    const [searchGameName, setSearchGameName] = useState('');
    const [loadingMarketData, setLoadingMarketData] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [productCart, setProductCarts] = useState([]);
    const [currentPage, setCurrentPage] = useState(
        parseInt(localStorage.getItem('currentPage')) || 1
    ); // state to track current page
    const [itemsPerPage] = useState(30); // number of items per page

    useEffect(() => {
        const fetchUserProfile = () => {
            const storedProfileData = localStorage.getItem('profileDataJSON')
            if(storedProfileData) {
                const parsedProfileData = JSON.parse(storedProfileData);
                setUserLoggedData(JSON.parse(storedProfileData))
            }
        }
        fetchUserProfile();
        fetchGames(setViewAGData1, setLoadingMarketData);
        fetchFavorites(setFavorites, LoginUserID);
        fetchUserCart(setProductCarts, LoginUserID);
    }, [LoginUserID]);
    const handleSearchChange = event => {
        setSearchGameName(event.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };
    // Filter data based on search term
    const filteredData = viewAGData1.filter(game =>
      game.game_title.toLowerCase().includes(searchGameName.toLowerCase())
    );
    useEffect(() => {
        localStorage.setItem('currentPage', currentPage);
    }, [currentPage]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => (
        <li
        key={number}
        onClick={() => setCurrentPage(number)}
        className={currentPage === number ? 'active' : ''}
        >
        {number}
        </li>
    ));

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
        axios.post(AGAddToFavoritesAPI, jsonUserFavData)
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


    const handleAddToCart = (details) => {
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
            fetchGames(setViewAGData1, setLoadingMarketData);
            fetchUserCart(setProductCarts, LoginUserID);
            setLoader(false)
          } else {
            // console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };

    const [loader,setLoader] = useState(true)
    const [filterChanging,setFilterChanging] = useState(false)
    const gamePlatform = [...new Set(viewAGData1.map(game => game.game_platform))].sort();
    const gameCategory = [...new Set(viewAGData1.map(game => game.game_category))].sort();
    const gameEdition = [...new Set(viewAGData1.map(game => game.game_edition))].sort();
  
    const [filters, setFilters] = useState({
      platform: {},
      category: {},
      edition: {},
      favorite: false,
    });
  
    const handleFilterChange = (filterType, value) => {
      setFilters(prevFilters => ({
        ...prevFilters,
        [filterType]: {
          ...prevFilters[filterType],
          [value]: !prevFilters[filterType][value]
        }
      }));
      setFilterChanging(true)
    };
  
    const handleFavoriteChange = () => {
      setFilters(prevFilters => ({
        ...prevFilters,
        favorite: !prevFilters.favorite
      }));
    };
  
    const filteredDatagames = viewAGData1.filter(game => {
      const platformMatch = filters.platform[game.game_platform] || Object.values(filters.platform).every(v => !v);
      const categoryMatch = filters.category[game.game_category] || Object.values(filters.category).every(v => !v);
      const editionMatch = filters.edition[game.game_edition] || Object.values(filters.edition).every(v => !v);
      const favoriteMatch = !filters.favorite || game.favorite; // Assuming `game.favorite` indicates if a game is favorite

      return platformMatch && categoryMatch && editionMatch && favoriteMatch;
    });

    useEffect(() => {
        // Check if any filter is active
        if (filterChanging && Object.values(filters.platform).every(v => !v) && Object.values(filters.category).every(v => !v) && Object.values(filters.edition).every(v => !v) && !filters.favorite) {
        setFilterChanging(false);
        }
    }, [filters, filterChanging]);
    return (
        <div className='mainContainer gameList'>
            <section className="gamesPageContainer top">
                <div className="gmspContent top1">
                    {/* <h5>ALL GAMES</h5> */}
                    <input type="text" placeholder='Search Game Here...' value={searchGameName} onChange={handleSearchChange}/>
                    <ul className="pagination">
                        {loadingMarketData ? renderPageNumbers : <li>0</li>}
                    </ul>
                </div>
                <div className="gmspContent top2">
                    <div className="gmspContentTop2 left">
                    <section>
                        <div className="filterSelectgames">
                            <h1>filter items by:</h1>
                            <p><GiConsoleController id='filterIconcheck'/> Console Platform</p>
                            <ul>
                                {!loader ? 
                                    <>
                                        {gamePlatform.map(platform => (
                                            <li key={platform}>
                                            <input
                                                type="checkbox"
                                                checked={filters.platform[platform] || false}
                                                onChange={() => handleFilterChange('platform', platform)}
                                            /> {platform}
                                            </li>
                                        ))}
                                    </> :
                                    <>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />NintendoSwitch
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />PC
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />PlayStation4
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />PlayStation5
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />XboXs
                                        </li>
                                    </>
                                }
                            </ul>
                            <p><TbCategoryFilled id='filterIconcheck'/> Category</p>
                            <ul>
                                {!loader ? 
                                    <>
                                        {gameCategory.map(category => (
                                            <li key={category}>
                                            <input
                                                type="checkbox"
                                                checked={filters.category[category] || false}
                                                onChange={() => handleFilterChange('category', category)}
                                            /> {category}
                                            </li>
                                        ))}
                                    </> :
                                    <>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Classic
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Hot
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Preorder
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Trending
                                        </li>
                                    </>
                                }
                            </ul>
                            <p><VscVersions id='filterIconcheck'/> Edition</p>
                            <ul>
                                {!loader ?
                                    <>
                                        {gameEdition.map(edition => (
                                            <li key={edition}>
                                            <input
                                                type="checkbox"
                                                checked={filters.edition[edition] || false}
                                                onChange={() => handleFilterChange('edition', edition)}
                                            /> {edition}
                                            </li>
                                        ))}
                                    </> :
                                    <>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Complete Edition
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Deluxe Edition
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Royal Edition
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Standard Edition
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Super Citizen Edition
                                        </li>
                                        <li>
                                            <input
                                                type="checkbox"
                                            />Ultimate Edition
                                        </li>
                                    </>
                                }
                            </ul>
                            <p><MdOutlineFavorite id='filterIconcheck'/> Favorite</p>
                            <ul>
                            <li>
                                <input
                                type="checkbox"
                                checked={filters.favorite}
                                onChange={handleFavoriteChange}
                                /> Favorite
                            </li>
                            </ul>
                        </div>
                        </section>
                    </div>
                    <div className='gmspContentTop2 right'>

                        {!filterChanging ? 
                            <>
                            {loadingMarketData ? <>
                                {currentItems.map((details, index) => (
                                    <div className="gmspct2Game" key={index}>
                                        <div className="gmspct2gPlatform">
                                            <img src='' platform={details.game_platform} alt="" />
                                        </div>
                                        <Link to={`/Games/${details.game_canonical}`}>{details.game_cover !== '' ?
                                        <img src={`https://2wave.io/GameCovers/${details.game_cover}`} alt="Image Not Available" />
                                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                                        <div className="gmspct2gDetails">
                                            <h5>{details.game_title}</h5>
                                            <p>{details.game_edition}</p>
                                            <div>
                                                <h6>$ 999.99</h6>
                                                {userLoggedIn ?<>
                                                    <button id={favorites.includes(details.game_canonical) ? 'gmspct2gdRemoveFav' : 'gmspct2gdAddFav'} onClick={() => handleFavoriteToggle(details)}>
                                                        {favorites.includes(details.game_canonical) ? <TbHeartFilled className='faIcons'/> : <TbHeart className='faIcons'/>}
                                                    </button>
                                                    {productCart.some(cartItem => cartItem.ag_product_id === details.game_canonical) ?
                                                        <button id='gmspct2gdCartAdded'><TbShoppingCartFilled className='faIcons'/></button>:
                                                        <button onClick={() => handleAddToCart(details)}><TbShoppingCartPlus className='faIcons'/></button>
                                                    }
                                                </>:<>
                                                    <button><TbHeart className='faIcons'/></button>
                                                    <button><TbShoppingCartPlus className='faIcons'/></button>
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>:<>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                                <div className="gmspct2GameDummy"><div className="gmspct2gpfDummy"></div></div>
                            </>}
                            </> :
                            <>
                            {filteredDatagames.map((details, index) => (
                                    <div className="gmspct2Game" key={index}>
                                        <div className="gmspct2gPlatform">
                                            <img src='' platform={details.game_platform} alt="" />
                                        </div>
                                        <Link to={`/Games/${details.game_canonical}`}>{details.game_cover !== '' ?
                                        <img src={`https://2wave.io/GameCovers/${details.game_cover}`} alt="Image Not Available" />
                                        :<img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} />}</Link>
                                        <div className="gmspct2gDetails">
                                            <h5>{details.game_title}</h5>
                                            <p>{details.game_edition}</p>
                                            <div>
                                                <h6>$ 999.99</h6>
                                                {userLoggedIn ?<>
                                                    <button id={favorites.includes(details.game_canonical) ? 'gmspct2gdRemoveFav' : 'gmspct2gdAddFav'} onClick={() => handleFavoriteToggle(details)}>
                                                        {favorites.includes(details.game_canonical) ? <TbHeartFilled className='faIcons'/> : <TbHeart className='faIcons'/>}
                                                    </button>
                                                    {productCart.some(cartItem => cartItem.ag_product_id === details.game_canonical) ?
                                                        <button id='gmspct2gdCartAdded'><TbShoppingCartFilled className='faIcons'/></button>:
                                                        <button onClick={() => handleAddToCart(details)}><TbShoppingCartPlus className='faIcons'/></button>
                                                    }
                                                </>:<>
                                                    <button><TbHeart className='faIcons'/></button>
                                                    <button><TbShoppingCartPlus className='faIcons'/></button>
                                                </>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        }

                    </div>
                </div>
                {searchGameName == '' && <div className="gmspContent top1 mobile">
                    <h5></h5>
                    <ul className="pagination">
                        {loadingMarketData ? renderPageNumbers : <></>}
                    </ul>
                </div>}
            </section>
        </div>
    )

    
}

export default Games