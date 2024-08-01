import React, { useEffect, useState, useRef, useCallback  } from 'react'
import "../CSS/gamecredits.css";
import { Link } from 'react-router-dom';
import placeholderImage from '../assets/imgs/GameBanners/DefaultNoBanner.png'
import axios from 'axios';
import { GamecreditsFetchData } from './GamecreditFetchContext';


const ImageComponentGamecredits = ({ imageName }) => {
  const { fetchAndCacheImageGamecredits, imageCache } = GamecreditsFetchData();
  const [loading, setLoading] = useState(true);
  const baseUrl = 'https://2wave.io/GameCreditCovers/';
  const url = `${baseUrl}${imageName}`;

  useEffect(() => {
      fetchAndCacheImageGamecredits(imageName);
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


const Gamecredits = () => {
  const { 
      filterUniqueData: originalFilterUniqueData,
      setFilteredGamecredits,
      gamecredits,
      filteredGamecredits,
      loading 
  } = GamecreditsFetchData();
  const [searchTerm, setSearchTerm] = useState("");

  const filterUniqueData = useCallback((data) => {
    return originalFilterUniqueData(data);
  }, [originalFilterUniqueData]);

  useEffect(() => {
    const results = gamecredits.filter(gamecredit =>
      gamecredit.gamecredit_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const uniqueResults = filterUniqueData(results);

    // Check if the filtered results are different from the current state to avoid unnecessary updates
    if (JSON.stringify(uniqueResults) !== JSON.stringify(filteredGamecredits)) {
      setFilteredGamecredits(uniqueResults);
    }
  }, [searchTerm, filterUniqueData, gamecredits, filteredGamecredits, setFilteredGamecredits]);


  const handleSearch = (e) => {
      setSearchTerm(e.target.value);
  };


  return (
    <div className='mainContainer gamecreditList'>
      <section className="gamecreditsPageContainer top">
        <div className="gcrdtspContent top">
          <input type="text" placeholder='Search Giftcard Here...' value={searchTerm} onChange={handleSearch}/>
          <h5>{filteredGamecredits.length} GIFTCARDS LISTED</h5>
        </div>
      </section>
      <section className="giftcardsPageContainer mid">
        <div className="gcspContent mid1">
            {loading ? <>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
                <div className="gcspContentMid1Dummy"></div>
            </>:<>{filteredGamecredits.map((details, i) => (
                <Link className="gcspContentMid1" key={i} to={`/GameCredits/${details.gamecredit_canonical}`}>
                  <div className="gcspcmid1 left">
                    <ImageComponentGamecredits imageName={details.gamecredit_cover} />
                  </div>
                  <div className="gcspcmid1 right">
                    <h5>{details.gamecredit_name}</h5>
                    <h6>{details.gamecredit_category}</h6>
                    <p id='gcspcmid1Web'>{details.gamecredit_description}</p>
                    <p id='gcspcmid1Mob'>{details.gamecredit_description.slice(0, 200)}...</p>
                    <div>
                        <p>${details.gamecredit_denomination} and Up</p>
                        <p>{(details.stocks === 0) ? 'Out of Stock' : 'On Stock'}</p>
                    </div>
                  </div>
                </Link>
            ))}</>}
        </div>
      </section>
    </div>
  )
}

export default Gamecredits