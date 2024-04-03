import React, { useState, useEffect } from 'react'
import "./CSS/nav.css";
import { 
    FaBars, 
    FaTimes,
    FaWindowClose,
    FaArrowCircleDown,
    FaComments,
    FaTh,
    FaTelegramPlane,
    FaTwitter,
    FaGithub,
    FaYoutube
} from 'react-icons/fa';

import { Link } from 'react-router-dom';

const Nav = () => {
  const [viewRegForm, setViewRegForm] = useState(false)
  const [viewLoginForm, setViewLoginForm] = useState(false)


  const handleViewRegistration = () => {
    setViewRegForm(true)
    setViewLoginForm(false)
  }
  const handleViewLogin = () => {
    setViewLoginForm(true)
    setViewRegForm(false)
  }

  const handleCloseModal = () => {
    setViewRegForm(false)
    setViewLoginForm(false)
  }


  if(viewRegForm == true ||
    viewLoginForm == true){
    window.document.body.style.overflow = 'hidden';
  } else{
    window.document.body.style.overflow = 'auto';
  }


  return (
    <nav>
      {viewRegForm &&
      <div className="navContainerModal">
          <div className="navContentModal">
            <button id='closeModalContent' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
            <div className="navRegistrationContent">
              <h6>REGISTER AN ACCOUNT</h6>
              <div>
                <span>
                  <label htmlFor=""><p>Email</p></label>
                  <input type="email" placeholder='ex. playerOne01@email.com' required/>
                </span>
                <span>
                  <label htmlFor=""><p>Username</p></label>
                  <input type="text" placeholder='ex. Player One' required/>
                </span>
                <span>
                  <label htmlFor=""><p>Password</p></label>
                  <input type="password" placeholder='*****' required/>
                </span>
                <span>
                  <label htmlFor=""><p>Referrer (Optional)</p></label>
                  <input type="text" placeholder='ex. PlayerTwo'/>
                </span>
                <span className='submitAccount'>
                  <button type='submit'>
                    <h6>REGISTER</h6>
                  </button>
                </span>
                <span className='registrationTCPP'>
                  <p>
                    By registering, you agree to Attract Game's <br />
                    <Link>Terms & Conditions</Link> and <Link>Privacy Policy</Link>
                  </p> <br />
                  <p>
                    Already have an Account? <a onClick={handleViewLogin}>Login Here</a>
                  </p>
                </span>
              </div>
            </div>
          </div>
      </div>}
      {viewLoginForm &&
      <div className="navContainerModal">
          <div className="navContentModal">
            <button id='closeModalContent' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
            <div className="navRegistrationContent">
              <h6>LOGIN ACCOUNT</h6>
              <div>
                <span>
                  <label htmlFor=""><p>Username</p></label>
                  <input type="text" placeholder='ex. Player One' required/>
                </span>
                <span>
                  <label htmlFor=""><p>Password</p></label>
                  <input type="password" placeholder='*****' required/>
                </span><br /><br />
                <span className='submitAccount'>
                  <button type='submit'>
                    <h6>LOGIN</h6>
                  </button>
                </span>
                <span className='errorMessage'>
                  <p></p>
                </span><br />
                <span className='registrationTCPP'>
                  <p>
                    Didn't have an Account? <a onClick={handleViewRegistration}>Register Here</a>
                  </p>
                </span>
              </div>
            </div>
          </div>
      </div>}
      <div className="mainNavContainer">
        <div className="navContainer website">
          <div className="navContent left">
              <Link to="/">
                  <img src={require('./assets/imgs/AGLogoWhite.png')} alt="" />
                  {/* <h5>ATTRACT GAME</h5> */}
              </Link>
          </div>
          <div className="navContent right">
            <Link><h6>GAMES</h6></Link>
            <Link><h6>VOUCHERS</h6></Link>
            <Link><h6>CRYPTO</h6></Link>
            <Link><h6>MERCHANDISE</h6></Link>
            <div>
              <a id='agLoginBtn' onClick={handleViewLogin}><h6>LOGIN</h6></a>
              <a id='agRegisterBtn' onClick={handleViewRegistration}><h6>REGISTER</h6></a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  ); 
}

export default Nav;