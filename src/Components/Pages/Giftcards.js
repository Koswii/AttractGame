import React, { useEffect, useState, useRef } from 'react'
import "../CSS/giftcards.css";
import { Link } from 'react-router-dom';
import axios from 'axios';

const Giftcards = () => {
    const AGGiftcardsListAPI = process.env.REACT_APP_AG_GIFTCARDS_LIST_API;
    const [giftcards, setGiftcards] = useState([]);
    const [uniqueData, setUniqueData] = useState([]);
    const [filteredGiftcards, setFilteredGiftcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
        const fetchGiftcards = async () => {
            setLoading(true);
            try {
                const response = await axios.get(AGGiftcardsListAPI);
                const unique = filterUniqueData(response.data);
                unique.sort((a, b) => {
                    if (a.giftcard_name < b.giftcard_name) return -1;
                    if (a.giftcard_name > b.giftcard_name) return 1;
                    return 0;
                });
                response.data.sort((a, b) => {
                    if (a.giftcard_name < b.giftcard_name) return -1;
                    if (a.giftcard_name > b.giftcard_name) return 1;
                    return 0;
                });
                setGiftcards(response.data);
                setFilteredGiftcards(unique);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchGiftcards();
    }, []);

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
                                <img src={`https://2wave.io/GiftCardCovers/${details.giftcard_cover}`} alt="" />
                            </div>
                            <div className="gcspcmid1 right">
                                <h5>{details.giftcard_name}</h5>
                                <h6>{details.giftcard_category}</h6>
                                <p id='gcspcmid1Web'>{details.giftcard_description}</p>
                                <p id='gcspcmid1Mob'>{details.giftcard_description.slice(0, 200)}...</p>
                                <div>
                                    <p>$20 - $500</p>
                                    <p>On Stock</p>
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