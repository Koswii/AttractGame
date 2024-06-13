import React,{ useState,useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/news.css'
import { 
  MdNewspaper,
} from "react-icons/md";
import { FaYoutube } from "react-icons/fa";

const News = () => {
// usestate
   const [newsList, setNewsList] = useState([]);
   const [loader, setLoader] = useState(true);
   const [previewData, setPreviewData] = useState([]);
   const [mainLinkData, setMainLinkData] = useState([]);
   const [subLinkData, setSubLinkData] = useState([]);
   const [error, setError] = useState("");

   useEffect(() => {
     retrieveDataNews();
   }, []);

   const retrieveDataNews = async () => {
     const retrieveNews = "https://engeenx.com/agNews.php";

     try {
       const response = await fetch(retrieveNews);
       const data = await response.json();

       const filterMain = data.filter((link) => link.type === "main");
       const filterSub = data.filter((link) => link.type === "sub");
       const filterOther = data.filter((link) => link.type === "other");

       setNewsList(filterOther);

       const mainlink = await Promise.all(
         filterMain.map(async (linkObj) => {
           const data = await fetchLinkPreview(linkObj.link);
           return data ? { id: linkObj.id, data } : null;
         })
       );

       const sublink = await Promise.all(
         filterSub.map(async (linkObj) => {
           const data = await fetchLinkPreview(linkObj.link);
           return data ? { id: linkObj.id, data } : null;
         })
       );

       const otherlink = await Promise.all(
         filterOther.map(async (linkObj) => {
           const data = await fetchLinkPreview(linkObj.link);
           return data ? { id: linkObj.id, data } : null;
         })
       );

       setMainLinkData(mainlink.filter(Boolean));
       setSubLinkData(sublink.filter(Boolean));
       setPreviewData(otherlink.filter(Boolean));
       setLoader(false);
     } catch (error) {
       console.error("Error retrieving data:", error);
       setError("Error fetching data");
       setLoader(false);
     }
   };

   const fetchLinkPreview = async (url) => {
     try {
       const response = await axios.get(
         `http://paranworld.com/link-preview?url=${encodeURIComponent(url)}`
       );
       return response.data;
     } catch (error) {
       console.error("Error fetching link preview:", error);
       setError("Error fetching preview data");
       return null;
     }
   };

  console.log(mainLinkData);
  return (
    <div className="mainContainer news">
      <section className="newsPageContainer top">
        <div className="newsContentPageTop">
          {loader ? (
            <>
              <div className="mainHeadline loading">
                <div className="subHeadlineContainerDummy">
                  <div className="subNewsContainerDummy">
                    <h3>
                      <MdNewspaper className="faIcons" />
                      MORE GAME NEWS
                    </h3>
                    <ul>
                      <li>
                        <div></div>
                        <p></p>
                        <p></p>
                        <p></p>
                      </li>
                      <li>
                        <div></div>
                        <p></p>
                        <p></p>
                        <p></p>
                      </li>
                      <li>
                        <div></div>
                        <p></p>
                        <p></p>
                        <p></p>
                      </li>
                      <li>
                        <div></div>
                        <p></p>
                        <p></p>
                        <p></p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {mainLinkData.length !== 0 && (
                <>
                  {mainLinkData.map((linkdata) => (
                    <div
                      className="mainHeadline"
                      style={{
                        background: `linear-gradient(transparent, black 85%), url('${linkdata.data.image}') center no-repeat`,
                        backgroundSize: "cover",
                      }}
                    >
                      <div className="mainHeadLineContent">
                        <h4>{linkdata.data.title}</h4>
                        <hr />
                        <p>{linkdata.data.description}</p>
                        <div className="mHHeaderBtns">
                          <Link to={linkdata.link} target="_blank">
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
                          <ul>
                            {subLinkData.map((link) => (
                              <li key={link.data.id}>
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
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </section>
      <section className="newsPageContainer mid">
        <div className="newsContentPageMid1">
          {loader ? (
            <></>
          ) : (
            <div className="newscpm1BreakingNews">
              {previewData.length !== 0 && (
                <ul>
                  {previewData.map((preview) => (
                    <Link key={preview.id} to={preview.link} target="_blank">
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
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default News