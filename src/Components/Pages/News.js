import React,{ useState,useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
// css
import '../CSS/news.css'
// icons
import { 
    ImNewspaper 
} from "react-icons/im";
import { 
    MdNewspaper,
  } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";

const News = () => {
// usestate
const [newsList, setNewslist] = useState();
const [loader,setLoader] = useState(true)


useEffect(() => {
  retrieveDatanews();
}, []);


    const retrieveNews = "https://engeenx.com/agNews.php";

    const retrieveDatanews = async () => {
      const response = await fetch(retrieveNews);
      const data = await response.json();
      const filterMain = data.filter(link => link.type === 'main')
      const filterSub = data.filter((link) => link.type === "sub");
      const filterOther = data.filter((link) => link.type === "other");
      setNewslist(filterOther);

      const mainlink = [];
      const sublink = [];
      const otherlink = [];
      for (const linkObj of filterMain) {
        const data = await fetchLinkPreview(linkObj.link);
        if (data) {
          mainlink.push({ id: linkObj.id, data });
        }
      }
      for (const linkObj of filterSub) {
        const data = await fetchLinkPreview(linkObj.link);
        if (data) {
          sublink.push({ id: linkObj.id, data });
        }
      }
      for (const linkObj of filterOther) {
        const data = await fetchLinkPreview(linkObj.link);
        if (data) {
          otherlink.push({ id: linkObj.id, data });
        }
      }
      const mergeData = (retrievedaata, filterdata) => {
        const dataMap = new Map();

        retrievedaata.forEach((item) => {
          dataMap.set(item.id, { ...item });
        });

        filterdata.forEach((item) => {
          if (dataMap.has(item.id)) {
            dataMap.set(item.id, { ...dataMap.get(item.id), ...item });
          } else {
            dataMap.set(item.id, { ...item });
          }
        });

        return Array.from(dataMap.values());
      };

      const combinedother = mergeData(otherlink, filterOther);
      const combinedmain = mergeData(mainlink, filterMain);
      const combinedsub = mergeData(sublink, filterSub);
      setSubLinkData(combinedsub);
      setMainLinkData(combinedmain);
      setPreviewData(combinedother);
      setLoader(false)
    };

    const [previewData, setPreviewData] = useState([]);
    const [mainLinkData, setMainLinkData] = useState([]);
    const [subLinkData, setSubLinkData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchLinkPreview = async (url) => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `http://82.197.94.35:5000/link-preview?url=${encodeURIComponent(url)}`
        );
        return response.data;
      } catch (err) {
        setError("Error fetching preview data");
        return null;
      } finally {
        setLoading(false);
      }
    };


  return (
    <div className="newsPage">
      <div className="newsMain">
        <div className="newsContainer">
          {loader ? 
          <div className="newsLoader">
            <div className="newsLoadercontents">
              <section>
                <div className="newsLoadercontentsdummy">
                </div>
                <div className="newsLoadercontentsdummy">
                </div>
                <div className="newsLoadercontentsdummy">
                </div>
                <div className="newsLoadercontentsdummy">
                </div>
              </section>
              <div className="dummyLinktext">
                <div className="dummylinktext"></div>
                <div className="dummylinktext"></div>
                <div className="dummylinktext"></div>
                <div className="dummylinktext"></div>
              </div>
            </div>
          </div>
          :
          <div className="newsContent">
            {mainLinkData.map((linkdata) => (
              <div
                className="mainHeadline"
                style={{
                  background: `linear-gradient(180deg, rgba(253,251,251,0) 0%, rgba(0,0,0,1) 100%), url('${linkdata.data.image}') center no-repeat`, backgroundSize: 'cover'
                }}
              >
                <div className="mainHeadlineHeader">
                  <section>
                    <h1>{linkdata.data.title}</h1>
                    <hr />
                    <p>{linkdata.data.description}</p>
                    <div className="mHHeaderBtns">
                      <Link to={linkdata.link} target="_blank"><button>Read more</button></Link>
                    </div>
                  </section>
                </div>
                <div className="mainHeadlineContents">
                  <div className="subNewsContainer">
                    <h1>More game news</h1>
                    <ul>
                      {subLinkData.map((link) => (
                        <li key={link.data.id}>
                          <Link to={link.link} target='_blank'>
                            <span>
                              <img src={link.data.image} alt="" />
                            </span>
                          </Link>
                          <p>{link.data.description}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <div className="breakingNews">
              <h2>
                <ImNewspaper id="brNewsIcon" />
                Game News
              </h2>
              <div className="breakingNewsContainer">
                <section>
                  <ul>
                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {previewData.map((preview) => (
                      <>
                        <Link
                          key={preview.id}
                          to={preview.link}
                          target="_blank"
                        >
                          <li>
                            {preview.data.image && (
                              <img
                                src={preview.data.image}
                                alt={preview.data.title}
                              />
                            )}
                            <h3>{preview.data.title}</h3>
                            <p>{preview.data.description}</p>
                          </li>
                        </Link>
                      </>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default News