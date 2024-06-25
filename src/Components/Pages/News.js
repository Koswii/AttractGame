import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/news.css';
import { MdNewspaper } from 'react-icons/md';
import { FaYoutube } from 'react-icons/fa';
import Underdevelop from './underdevelop';

const News = () => {
    const AGAllNewsAPI = process.env.REACT_APP_AG_FETCH_NEWS_API;
    const [newsList, setNewsList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [previewData, setPreviewData] = useState([]);
    const [mainLinkData, setMainLinkData] = useState([]);
    const [subLinkData, setSubLinkData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        retrieveDataNews();
    }, []);

    const retrieveDataNews = async () => {
        try {
            const response = await fetch(AGAllNewsAPI);
            const data = await response.json();

            const filterMain = data.filter(link => link.type === 'main');
            const filterSub = data.filter(link => link.type === 'sub').sort((a, b) => b.id - a.id);
            const filterOther = data.filter(link => link.type === 'other').sort((a, b) => b.id - a.id);

            setNewsList(filterOther);

            const mainlink = await Promise.all(
                filterMain.map(async linkObj => {
                    const data = await fetchLinkPreview(linkObj.link);
                    return data ? { id: linkObj.id, data, link: linkObj.link } : null;
                })
            );

            const sublink = await Promise.all(
                filterSub.map(async linkObj => {
                    const data = await fetchLinkPreview(linkObj.link);
                    return data ? { id: linkObj.id, data, link: linkObj.link } : null;
                })
            );

            const otherlink = await Promise.all(
                filterOther.map(async linkObj => {
                    const data = await fetchLinkPreview(linkObj.link);
                    return data ? { id: linkObj.id, data, link: linkObj.link } : null;
                })
            );

            setMainLinkData(mainlink.filter(Boolean));
            setSubLinkData(sublink.filter(Boolean));
            setPreviewData(otherlink.filter(Boolean));
            setLoader(false);
        } catch (error) {
            console.error('Error retrieving data:', error);
            setError('Error fetching data');
            setLoader(false);
        }
    };

    const fetchLinkPreview = async url => {
        try {
            const response = await axios.get(`https://paranworld.com/link-preview?url=${encodeURIComponent(url)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching link preview:', error);
            setError('Error fetching preview data');
            return null;
        }
    };

    return (
        <div className="mainContainer news">
            {/* <Underdevelop/> */}
            <section className="newsPageContainer top">
                <div className="newsContentPageTop">
                    {loader ? (
                        <div className="mainHeadline loading">
                            <div className="subHeadlineContainerDummy">
                                <div className="subNewsContainerDummy">
                                    <h3>
                                        <MdNewspaper className="faIcons" />
                                        MORE GAME NEWS
                                    </h3>
                                    <ul>
                                        {[...Array(4)].map((_, index) => (
                                            <li key={index}>
                                                <div></div>
                                                <p></p>
                                                <p></p>
                                                <p></p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        mainLinkData.length > 0 && (
                            <div className="mainHeadline" style={{ background: `linear-gradient(transparent, black 85%), url('${mainLinkData[0].data.image}') center no-repeat`, backgroundSize: 'cover' }}>
                                <div className="mainHeadLineContent">
                                    <h4>{mainLinkData[0].data.title}</h4>
                                    <hr />
                                    <p>{mainLinkData[0].data.description}</p>
                                    <div className="mHHeaderBtns">
                                        <Link to={mainLinkData[0].link} target="_blank">
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                                <div className="subHeadlineContainer">
                                    <div className="subNewsContainer">
                                        <h3>
                                            <MdNewspaper className="faIcons" />
                                            MORE GAME NEWS
                                        </h3>
                                        <ul className='mgnSubNews website'>
                                            {subLinkData.map(link => (
                                                <li key={link.id}>
                                                    <Link to={link.link} target="_blank">
                                                        <img src={link.data.image} alt="" />
                                                    </Link>
                                                    <p>{link.data.title}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <ul className='mgnSubNews mobile'>
                                            {subLinkData.slice(0, 4).map(link => (
                                                <li key={link.id}>
                                                    <Link to={link.link} target="_blank">
                                                        <img src={link.data.image} alt="" />
                                                    </Link>
                                                    <p>{link.data.title}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </section>
            <section className="newsPageContainer mid">
                <div className="newsContentPageMid1">
                    {!loader && previewData.length > 0 && (
                        <div className="newscpm1BreakingNews">
                            <ul>
                                {previewData.map(preview => (
                                    <Link key={preview.id} to={preview.link} target="_blank">
                                        <li>
                                            {preview.data.image && (
                                                <img src={preview.data.image} alt={preview.data.title} />
                                            )}
                                            <h3>{preview.data.title}</h3>
                                            <p>{preview.data.description}</p>
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default News;
