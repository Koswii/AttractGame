import React, { useState, useEffect } from 'react'
import "../CSS/applyAsSeller.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplyAsSeller = () => {
    const AGAddSellerApplicantAPI = process.env.REACT_APP_AG_ADD_SELLER_APPLICANT_API;
    const [applicantFullname, setApplicantFullname] = useState('')
    const [applicantBusiness, setApplicantBusiness] = useState('')
    const [applicantEmail, setApplicantEmail] = useState('')
    const [applicantAddress, setApplicantAddress] = useState('')
    const [applicantAgree1, setApplicantAgree1] = useState('')
    const [applicantAgree2, setApplicantAgree2] = useState('')



    const handleSellerRegister = async (e) => {
        e.preventDefault();
    
        const formAddSeller = {
            sellerFullname: applicantFullname,
            sellerBusiness: applicantBusiness,
            sellerEmail: applicantEmail,
            sellerAddress: applicantAddress,
            sellerAccept1: applicantAgree1,
            sellerAccept2: applicantAgree2,
        };
    
        console.log(formAddSeller); // Log the form data object
    
        try {
            const responseUserRegister = await axios.post(
                AGAddSellerApplicantAPI,
                formAddSeller, // Send the object directly
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const resMessageUserRegister = responseUserRegister.data;
    
            if (resMessageUserRegister.success) {
                console.log(resMessageUserRegister.message);
                setApplicantFullname('')
                setApplicantBusiness('')
                setApplicantEmail('')
                setApplicantAddress('')
                setApplicantAgree1('')
                setApplicantAgree2('')
            } else {
                console.log(resMessageUserRegister.message);
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            // Any additional finalization if needed
        }
    };



    
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
                        <form action="" onSubmit={handleSellerRegister}>
                            <div className='applicationForm'>
                                <span>
                                    <label htmlFor=""><p>Fullname</p></label>
                                    <input type="text" placeholder='Ex. John Doe' name='sellerFullname' onChange={(e) => setApplicantFullname(e.target.value)} />
                                </span>
                                <span>
                                    <label htmlFor=""><p>Store Name</p></label>
                                    <input type="text" placeholder='Ex. JDoe Gamestop' name='sellerBusiness' onChange={(e) => setApplicantBusiness(e.target.value)} />
                                </span>
                                <span>
                                    <label htmlFor=""><p>Contact Email</p></label>
                                    <input type="email" placeholder='ex. jdoegamestop@email.com' name='sellerEmail' onChange={(e) => setApplicantEmail(e.target.value)} />
                                </span>
                                <span>
                                    <label htmlFor=""><p>Business Short Description</p></label>
                                    <textarea id="" placeholder='Type description here...' name='sellerAddress' onChange={(e) => setApplicantAddress(e.target.value)} ></textarea>
                                </span>
                            </div>
                            <div className="afAgree">
                                <input type="checkbox" name='sellerAccept1' onChange={(e) => setApplicantAgree1(e.target.value)}  />
                                <p>
                                    By Checking this I agree to Attract Game Seller Program's <br />
                                    <Link to='/SellerTermsAndConditions'>Terms and Condition</Link> and <Link to="/SellerPrivacyPolicies">Privacy Policies</Link>
                                </p>
                            </div>
                            <div className="afAgree">
                                <input type="checkbox" name='sellerAccept2' onChange={(e) => setApplicantAgree2(e.target.value)} />
                                <p>
                                    By checking this box, I acknowledge and accept all penalties for any 
                                    violations of the Attract Game Sellers Program's Rules and Regulations.
                                </p>
                            </div>
                            <div className="afContact">
                                <p>
                                    Note: <br />
                                    You can submit business reseller ticket on our <a href="https://discord.com/invite/3Rc2QF3Zqz" target='blank'>DISCORD SERVER</a> for fast replies.
                                     <br /> Please expect an email 2-3 days after Initial Application.
                                </p>
                            </div>
                            <div className="afSubmitButton">
                                <button disabled={!applicantAgree1 || !applicantAgree2} type='submit'>Submit Application</button>
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