import React, { useState, useEffect } from 'react'
import "../CSS/applyAsSeller.css";
import { Link, useNavigate } from 'react-router-dom';

const ApplyAsSeller = () => {
  return (
    <div className='mainContainer applySeller'>
        <section className="asellerPageContainer top">
            <div className="asPageContentTop">
                <h4>Elevate your Digital Code Business <br /> with Attract Game!</h4>
                <p>Join us today and start selling digital games, giftcards, and game credits.</p>
            </div>
        </section>
        <section className="asellerPageContainer mid">
            <div className="asPageContentMid1">
                <div className="aspcm1Content left">
                    <form action="">
                        <div className='applicationForm'>
                            <span>
                                <label htmlFor=""><p>Fullname</p></label>
                                <input type="text" placeholder='Ex. John Doe'/>
                            </span>
                            <span>
                                <label htmlFor=""><p>Business Name</p></label>
                                <input type="text" placeholder='Ex. JDoe Gamestop'/>
                            </span>
                            <span>
                                <label htmlFor=""><p>Business Email</p></label>
                                <input type="text" placeholder='ex. jdoegamestop@email.com'/>
                            </span>
                            <span>
                                <label htmlFor=""><p>Business Address</p></label>
                                <textarea name="" id="" placeholder='...'></textarea>
                            </span>
                        </div>
                        <div className="afAgree">
                            <input type="checkbox" />
                            <p>
                                By Checking this I agree to Attract Game Seller Program's <br />
                                <Link to='/SellerTermsAndConditions'>Terms and Condition</Link> and <Link to="/SellerPrivacyPolicies">Privacy Policies</Link>
                            </p>
                        </div>
                        <div className="afAgree">
                            <input type="checkbox" />
                            <p>
                                By checking this box, I acknowledge and accept all penalties for any 
                                violations of the Attract Game Sellers Program's Rules and Regulations.
                            </p>
                        </div>
                        <div className="afContact">
                            <p>
                                Once submitted, join our <a href="https://discord.com/invite/3Rc2QF3Zqz">DISCORD SERVER HERE</a> for the 
                                initial interview <br /> and to submit the necessary documents and files.
                            </p>
                        </div>
                        <div className="afSubmitButton">
                            <button>Submit Contact</button>
                        </div>
                    </form>
                </div>
                <div className="aspcm1Content right">
                    <video className='aspcm1crVideo' autoPlay muted loop>
                        <source src={require('../assets/vids/ApplyAsSeller.mp4')} type='video/mp4' />
                    </video>
                </div>
            </div>
        </section>
    </div>
  )
}

export default ApplyAsSeller