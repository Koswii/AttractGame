import React,{ useState,useEffect } from 'react'
import axios from 'axios';
// css
import '../CSS/news.css'
// icons
import { ImNewspaper } from "react-icons/im";
import { FaYoutube } from "react-icons/fa";
// assets
import sampleImg from '../assets/imgs/NewsImages/subNews.jpg'
import sampleImg1 from '../assets/imgs/GameBanners/DefaultNoBanner.png'
import sampleImg2 from '../assets/imgs/ProfilePics/DefaultProfilePic.png'

const News = () => {
// usestate
const initialNewsItems  = [
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg1 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg2 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg1 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg1 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg1 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg2 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg1 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg1 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg2 },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg },
    { heading: 'heading 1', content: 'news contents Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.', img: sampleImg1 },
];

const [newsItems, setNewsItems] = useState(initialNewsItems);

const handleScroll = () => {
    const container = document.querySelector('.breakingNewsContainer');
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        setNewsItems((prevNewsItems) => [...prevNewsItems, ...initialNewsItems]);
    }
};

useEffect(() => {
    const container = document.querySelector('.brNewsContents');
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
}, []);



const [url, setUrl] = useState('');
const [previewData, setPreviewData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const fetchLinkPreview = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await axios.get(`http://localhost:5000/link-preview?url=${encodeURIComponent(url)}`);
    setPreviewData(response.data);
  } catch (err) {
    setError('Error fetching preview data');
  } finally {
    setLoading(false);
  }
};

const handleInputChange = (e) => {
  setUrl(e.target.value);
};

const handleFetchPreview = () => {
  fetchLinkPreview();
};
  return (
    <div className="newsPage">
        <div className="newsMain">
            <div className="newsContainer">
                <div className="newsContent">
                    <div className="mainHeadline">
                        <div className="mainHeadlineHeader">
                            <section>
                                <span>Source here</span>
                                <h1>Headline Here</h1>
                                <hr />
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
                                <div className="mHHeaderBtns">
                                    <button>Read more</button>
                                </div>
                            </section>
                        </div>
                        <div className="mainHeadlineContents">
                            <div className="subNewsContainer">
                                <h1>More game news</h1>
                                <ul>
                                    <li>
                                        <span>
                                            <img src={sampleImg} alt="" />
                                        </span>
                                        <p>News Headline News Headline</p>
                                    </li>
                                    <li>
                                        <span>
                                            <img src={sampleImg} alt="" />
                                        </span>
                                        <p>News Headline News Headline</p>
                                    </li>
                                    <li>
                                        <span>
                                            <img src={sampleImg} alt="" />
                                        </span>
                                        <p>News Headline News Headline</p>
                                    </li>
                                    <li>
                                        <span>
                                            <img src={sampleImg} alt="" />
                                        </span>
                                        <p>News Headline News Headline</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="breakingNews">
                        <h2><ImNewspaper id='brNewsIcon' />Game News</h2>
                        <div className="breakingNewsContainer">
                            <section className='brNewsContents'>
                                <ul>
                                    {newsItems.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <img src={item.img} alt="" />
                                                <h3>{item.heading}</h3>
                                                <p>{item.content}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        </div>
                        <div className="ytNews">
                            <h2><FaYoutube id='brNewsIcon' />Youtuber plays</h2>
                            <div className="ytNewsContainer">
                                <div>
                                <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={url}
                                    onChange={handleInputChange}
                                />
                                <button onClick={handleFetchPreview}>Preview</button>
                                {loading && <p>Loading...</p>}
                                {error && <p>{error}</p>}
                                {previewData && (
                                    <div className="link-preview">
                                    <img src={previewData.image} alt={previewData.title} />
                                    <div>
                                        <h3>{previewData.title}</h3>
                                        <p>{previewData.description}</p>
                                    </div>
                                    </div>
                                )}
                                </div>
                                <ul>
                                    <li>

                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default News