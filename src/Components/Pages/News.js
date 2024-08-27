import React,{ useState,useEffect } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/news.css'
import { 
  MdNewspaper,
} from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import { NewsFetchData } from './NewsFetchContext';


const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
const TextSlicer = ({ text = '', maxLength }) => {
  const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <>{truncatedText}</>
  );
};



const News = () => {
  const { newsList } = NewsFetchData();
  const { loader } = NewsFetchData();
  const { previewData } = NewsFetchData();
  const { mainLinkData } = NewsFetchData();
  const { subLinkData } = NewsFetchData();
  const { error } = NewsFetchData();

  // console.log(mainLinkData);

  return (
    <div className="mainContainer news">
      {/* <Underdevelop/> */}
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
              {(mainLinkData.length !== 0) && (
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
                        <h4>{decodeHtml(linkdata.data.title)}</h4>
                        <hr />
                        <p>{decodeHtml(linkdata.data.description)}</p>
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
                          <ul className='mgnSubNews website'>
                            {subLinkData.map((link) => (
                              <li key={link.data.id}>
                                <Link to={link.link} target="_blank">
                                  <img src={link.data.image} alt="" />
                                </Link>
                                <p><TextSlicer text={`${decodeHtml(link.data.title)}`} maxLength={76} /></p>
                              </li>
                            ))}
                          </ul>
                          <ul className='mgnSubNews mobile'>
                            {subLinkData.slice(0, 4).map((link) => (
                              <li key={link.data.id}>
                                <Link to={link.link} target="_blank">
                                  <img src={link.data.image} alt="" />
                                </Link>
                                <p><TextSlicer text={`${decodeHtml(link.data.title)}`} maxLength={45} /></p>
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
                        <h3>{decodeHtml(preview.data.title)}</h3>
                        <p>{decodeHtml(preview.data.description)}</p>
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