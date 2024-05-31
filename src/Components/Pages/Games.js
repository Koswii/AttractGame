import React, { useEffect, useState, useRef } from 'react'
import "../CSS/games.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
    TbShoppingCartPlus,  
    TbHeart,
    TbHeartFilled,     
} from "react-icons/tb";

const Games = () => {
    const AGGamesListAPI1 = process.env.REACT_APP_AG_GAMES_LIST_API;
    const AGAddToFavorites = process.env.REACT_APP_AG_ADD_USER_FAV_API;
    const [viewAGData1, setViewAGData1] = useState([]);
    const [searchGameName, setSearchGameName] = useState('');
    const [loadingMarketData, setLoadingMarketData] = useState(false);
    const [currentPage, setCurrentPage] = useState(
        parseInt(localStorage.getItem('currentPage')) || 1
    ); // state to track current page
    const [itemsPerPage] = useState(30); // number of items per page

    const [userLoggedData, setUserLoggedData] = useState('')
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
    useEffect(() => {
        const fetchGames = async () => {
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
        fetchGames();
    }, []);
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
        axios.post(AGAddToFavorites, jsonUserFavData)
        .then(response => {
          const resMessage = response.data;
          if (resMessage.success === false) {
            console.log(resMessage.message);
          }
          if (resMessage.success === true) {
            console.log(resMessage.message);
          }
        }) 
        .catch (error =>{
            console.log(error);
        });
    };

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
                    <div className="gmspContentTop left">

                    </div>
                    <div className='gmspContentTop2 right'>
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
                                            <button onClick={() => handleAddFavorite(details)}><TbHeart className='faIcons'/></button>
                                            <button><TbShoppingCartPlus className='faIcons'/></button>
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