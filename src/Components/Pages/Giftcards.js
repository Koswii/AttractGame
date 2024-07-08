import React, { useEffect, useState, useRef } from 'react'
import "../CSS/giftcards.css";
import { Link } from 'react-router-dom';
import placeholderImage from '../assets/imgs/GameBanners/DefaultNoBanner.png'
import axios from 'axios';
import { GiftcardsFetchData } from './GiftcardsFetchContext';

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

const Giftcards = () => {
    const { 
        filterUniqueData,
        setFilteredGiftcards,
        giftcards,
        filteredGiftcards,
        loading 
    } = GiftcardsFetchData();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const results = giftcards.filter(giftcard =>
            giftcard.giftcard_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredGiftcards(filterUniqueData(results));
    }, [searchTerm, filterUniqueData, giftcards]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='mainContainer giftcardList'>
            <section className="giftcardsPageContainer top">
                <div className="gcspContent top">
                    <input type="text" placeholder='Search Giftcard Here...' value={searchTerm} onChange={handleSearch}/>
                    <h5>{filteredGiftcards.length} GIFTCARDS LISTED</h5>
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
                        <div className="gcspContentMid1Dummy"></div>
                        <div className="gcspContentMid1Dummy"></div>
                        <div className="gcspContentMid1Dummy"></div>
                        <div className="gcspContentMid1Dummy"></div>
                        <div className="gcspContentMid1Dummy"></div>
                        <div className="gcspContentMid1Dummy"></div>
                    </>:<>{filteredGiftcards.map((details, i) => (
                        <Link className="gcspContentMid1" key={i} to={`/Giftcards/${details.giftcard_canonical}`}>
                            <div className="gcspcmid1 left">
                                <ImageComponentGiftcards imageName={details.giftcard_cover} />
                            </div>
                            <div className="gcspcmid1 right">
                                <h5>{details.giftcard_name}</h5>
                                <h6>{details.giftcard_category}</h6>
                                <p id='gcspcmid1Web'>{details.giftcard_description}</p>
                                <p id='gcspcmid1Mob'>{details.giftcard_description.slice(0, 200)}...</p>
                                <div>
                                    <p>${details.giftcard_denomination} and Up</p>
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

export default Giftcards