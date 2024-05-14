import React, { useState, useEffect } from 'react'
import "./CSS/nav.css";
import { 
  FaBars, 
  FaTimes,
  FaRegUserCircle,
  FaRegEye,
  FaRegEyeSlash, 
} from 'react-icons/fa';
import { 
  MdSettings,
  MdAdminPanelSettings,
  MdOutlineSpaceDashboard,
  MdOutlineShoppingBag,
  MdOutlineVideogameAsset,
  MdOutlineGamepad,
  MdOutlineCardGiftcard,
  MdCurrencyBitcoin    
} from "react-icons/md";
import { 
  TbUserSquareRounded,
  TbShoppingCartBolt 
} from "react-icons/tb";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';



const Nav = () => {
  const navigate = useNavigate ();
  const [viewRegForm, setViewRegForm] = useState(false)
  const [viewLoginForm, setViewLoginForm] = useState(false)
  const [viewUserCredentials, setViewUserCredentials] = useState(false)
  const [viewAdminCredentials, setViewAdminCredentials] = useState(false)


  const handleViewRegistration = () => {
    setViewRegForm(true)
    setViewLoginForm(false)
    setMessageResponse('')
  }
  const handleViewLogin = () => {
    setViewLoginForm(true)
    setViewRegForm(false)
    setMessageResponse('')
  }
  const handleCloseModal = () => {
    setViewRegForm(false)
    setViewLoginForm(false)
    setMessageResponse('')
  }

  const addAGUserAPI = process.env.REACT_APP_AG_USER_REGISTER_API;
  const loginAGUserAPI = process.env.REACT_APP_AG_USER_LOGIN_API;
  const logoutAGUserAPI = process.env.REACT_APP_AG_USER_LOGOUT_API;
  const AGUserListAPI = process.env.REACT_APP_AG_USERS_LIST_API;
  const AGUserDataAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;

  const [agUserEmail, setAGUserEmail] = useState('')
  const [agUserUsername, setAGUserUsername] = useState('')
  const [agUserPassword, setAGUserPassword] = useState('')
  const [agTimestamp, setAgTimestamp] = useState(new Date().toLocaleDateString())
  const [agUserReferral, setAGUserReferral] = useState('')
  const [agUserAccount, setAGUserAccount] = useState('Customer')
  const [agUserStatus, setAGUserStatus] = useState('Active')
  const [messageResponse, setMessageResponse] = useState('')
  const [captcha, setCaptcha] = useState('');
  const [inputValueCaptcha, setInputValueCaptcha] = useState('');


  const generateCaptcha = () => {
    // Generate a random 4-digit number for the CAPTCHA
    const randomCaptcha = Math.floor(1000 + Math.random() * 9000);
    setCaptcha(randomCaptcha.toString());
  };
  useEffect(() => {
    generateCaptcha();
  }, []);


  const LoginUsername = localStorage.getItem('attractGameUsername');
  const [dataUser, setDataUser] = useState([]);
  const [dataStatus, setDataUserStatus] = useState('');
  const [viewProfileImg, setViewProfileImg] = useState('');
  const [viewTextPassword, setViewTextPassword] = useState(false);

  useEffect(() => {
    const fetchDataUser = () => {
      axios.get(AGUserListAPI)
      .then((response) => {
        const allUsersStatus = response.data.find(item => item.username == agUserUsername);
        const userData = response.data.find(item => item.username == LoginUsername);
        setDataUser(userData);

        if(userData){
          if(userData['account'] == 'Admin'){
            localStorage.setItem('agAdminLoggedIn', true)
            setViewAdminCredentials(true)
          }else{
            setViewAdminCredentials(false)
          }
        }

        if(allUsersStatus){
          if(allUsersStatus['status'] == 'Blocked'){
            setDataUserStatus(true);
            handleUserLogout();
          }else{
            setDataUserStatus(false)
          }
        }


      })
      .catch(error => {
        console.log(error)
      })
    }
    fetchDataUser();
    const userFromLocalStorage = localStorage.getItem('isLoggedIn');
    const adminNavBtn = localStorage.getItem('agAdminLoggedIn')

    if (userFromLocalStorage) {
      setViewUserCredentials(true);
    }

    if (adminNavBtn) {
      setViewAdminCredentials(true);
    }
  }, [LoginUsername, agUserUsername]);
  useEffect(() => {
    const fetchUserProfile = () => {
      axios.get(AGUserDataAPI)
      .then((response) => {
        const userData = response.data.find(item => item.username == LoginUsername);
        const profileDetailsJSON = JSON.stringify(userData)
        localStorage.setItem('profileDataJSON', profileDetailsJSON);

        if(userData){
          const storedProfileData = localStorage.getItem('profileDataJSON');
          const parsedProfileData = JSON.parse(storedProfileData);
          setViewProfileImg(parsedProfileData.profileimg);
        }
      })
      .catch(error => {
          console.log(error)
      })
    }
    fetchUserProfile();

  }, [LoginUsername]);
  const handleUserRegister = async (e) => {
    e.preventDefault();

    const formAddUser = {
      agSetEmail: agUserEmail,
      agSetUsername: agUserUsername,
      agSetPassword: agUserPassword,
      agSetDateRegister: agTimestamp,
      agSetReferral: agUserReferral,
      agSetAccount: agUserAccount,
      agSetStatus: agUserStatus,
    }

    const jsonUserData = JSON.stringify(formAddUser);
    if (inputValueCaptcha === captcha) {
      // CAPTCHA verification successful
      axios.post(addAGUserAPI, jsonUserData)
      .then(response => {
        const resMessage = response.data;
        if (resMessage.success === false) {
            setMessageResponse(resMessage.message);
        }
        if (resMessage.success === true) {
            setMessageResponse(resMessage.message);
            setAGUserEmail('')
            setAGUserUsername('')
            setAGUserPassword('')
            setAGUserReferral('')
        }
      }) 
      .catch (error =>{
        setMessageResponse(error);
      });
    } else {
      alert('CAPTCHA verification failed. Please try again.');
      setInputValueCaptcha('');
      generateCaptcha(); // Regenerate CAPTCHA
    }
  };
  const handleUserLogin = (e) => {
    e.preventDefault();


    if (!agUserUsername || !agUserPassword) {
      setMessageResponse('Please fill in all fields.');
      return;
    }

    if (dataStatus == true) {
      setMessageResponse('Your Account was Blocked');
    } else {
      fetch(loginAGUserAPI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${agUserUsername}&password=${agUserPassword}`,
      })
        .then(response => response.json())
        .then(data => {
          if (data.success === true) {
            localStorage.setItem('attractGameUsername', data.username);
            localStorage.setItem('isLoggedIn', 'true');
            window.location.reload();
          } else {
            setMessageResponse(data.message);
          }
      })
      .catch(error => console.error('Error:', error));
    }
  };
  const handleUserLogout = () => {
    fetch(logoutAGUserAPI, {
        method: 'GET',
    })
    .then(response => {
      if (response.redirected) {
        window.location.href = '/';
      }
    });
    localStorage.removeItem('agAdminLoggedIn');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('attractGameUsername');
    localStorage.removeItem('featuredGameData');
    localStorage.removeItem('profileDataJSON')
    window.location.href = '/';
  };
  useEffect(() => {
    const handleUsernameStorageChange = (event) => {
      if (event.key === 'attractGameUsername') {
        handleUserLogout();
      }
    };
    window.addEventListener('storage', handleUsernameStorageChange);
    return () => {
      window.removeEventListener('storage', handleUsernameStorageChange);
    };
  }, []);
  const handleViewPassword = (e) => {
    e.preventDefault();
    setViewTextPassword(true)
  }
  const handleHidePassword = (e) => {
    e.preventDefault();
    setViewTextPassword(false)
  }

  if(viewRegForm == true ||
    viewLoginForm == true){
    window.document.body.style.overflow = 'hidden';
  } else{
    window.document.body.style.overflow = 'auto';
  }

  const handleClickHome = () => {
    localStorage.removeItem('dashboard');
    localStorage.removeItem('marketplace');
    localStorage.removeItem('games');
    localStorage.removeItem('giftcards');
    localStorage.removeItem('crypto');
  }

  const handleClickDashboadrd = () => {
    localStorage.setItem('dashboard', 'active');
    localStorage.removeItem('marketplace');
    localStorage.removeItem('games');
    localStorage.removeItem('giftcards');
    localStorage.removeItem('crypto');
    navigate('/Highlights');
  }
  const handleClickMarketplace = () => {
    localStorage.setItem('marketplace', 'active');
    localStorage.removeItem('dashboard');
    localStorage.removeItem('games');
    localStorage.removeItem('giftcards');
    localStorage.removeItem('crypto');
    navigate('/Marketplace');
  }
  const handleClickGames = () => {
    localStorage.setItem('games', 'active');
    localStorage.removeItem('dashboard');
    localStorage.removeItem('marketplace');
    localStorage.removeItem('giftcards');
    localStorage.removeItem('crypto');
    navigate('/Games');
  }
  const handleClickGiftcards = () => {
    localStorage.setItem('giftcards', 'active');
    localStorage.removeItem('dashboard');
    localStorage.removeItem('marketplace');
    localStorage.removeItem('games');
    localStorage.removeItem('crypto');
  }
  const handleClickCrypto = () => {
    localStorage.setItem('crypto', 'active');
    localStorage.removeItem('dashboard');
    localStorage.removeItem('marketplace');
    localStorage.removeItem('games');
    localStorage.removeItem('giftcards');
  }



  return (
    <nav>
      {viewRegForm &&
      <div className="navContainerModal">
          <div className="navContentModal">
            <button id='closeModalContent' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
            <form className="navRegistrationContent" onSubmit={handleUserRegister}>
              <h6>REGISTER AN ACCOUNT</h6>
              <div className='navRegContents'>
                <div>
                  <label htmlFor=""><p>Email</p></label>
                  <input type="email" placeholder='ex. playerOne01@email.com' value={agUserEmail} onChange={(e) => setAGUserEmail(e.target.value)} required/>
                </div>
                <div>
                  <label htmlFor=""><p>Username</p></label>
                  <input type="text" placeholder='ex. Player One' value={agUserUsername} onChange={(e) => setAGUserUsername(e.target.value)} required/>
                </div>
                <div>
                  <label htmlFor=""><p>Password</p></label>
                  <input type={!viewTextPassword ? "password" : "text"} minLength={8} maxLength={16} placeholder={!viewTextPassword ? '********' : 'Password Length 8-16 Characters'} value={agUserPassword} min={8} max={16} onChange={(e) => setAGUserPassword(e.target.value)} required/>
                  {!viewTextPassword ? <button className='navRefContViewPass' onClick={handleViewPassword}><FaRegEyeSlash className='faIcons'/></button>
                  :<button className='navRefContViewPass' onClick={handleHidePassword}><FaRegEye className='faIcons'/></button>}
                </div>
                <div>
                  <label htmlFor=""><p>Referrer (Optional)</p></label>
                  <input type="text" placeholder='ex. PlayerTwo' value={agUserReferral} onChange={(e) => setAGUserReferral(e.target.value)}/>
                </div>
                <div className='recaptchaSetup' id='recaptchaSetup'>
                  <img id='captchaContent' src={`https://dummyimage.com/150x50/000/fff&text=${captcha}`} alt="Captcha" />
                  <img id='captchaBG' src={require('./assets/imgs/LoginBackground.jpg')} alt="" />
                  <input type="text" onChange={(e) => setInputValueCaptcha(e.target.value)} placeholder="Enter CAPTCHA"/>
                </div>
                <div className='submitAccount'>
                  <button type='submit'>
                    <h6>REGISTER</h6>
                  </button>
                </div>
                <div className='registrationTCPP'>
                  <p>
                    By registering, you agree to Attract Game's <br />
                    <Link>Terms & Conditions</Link> and <Link>Privacy Policy</Link><br /><br /><br />
                    <span>{messageResponse}</span>
                  </p>
                  <p>
                    Already have an Account? <a onClick={handleViewLogin}>Login Here</a>
                  </p>
                </div>
              </div>
            </form>
          </div>
      </div>}
      {viewLoginForm &&
      <div className="navContainerModal">
          <div className="navContentModal">
            <button id='closeModalContent' onClick={handleCloseModal}><FaTimes className='faIcons'/></button>
            <form className="navRegistrationContent" onSubmit={handleUserLogin}>
              <h6>LOGIN ACCOUNT</h6>
              <div className='navRegContents'>
                <div>
                  <label htmlFor=""><p>Username</p></label>
                  <input type="text" placeholder='ex. Player One' value={agUserUsername} onChange={e => setAGUserUsername(e.target.value)} required/>
                </div>
                <div>
                  <label htmlFor=""><p>Password</p></label>
                  <input type={!viewTextPassword ? "password" : "text"} placeholder='*****' value={agUserPassword} onChange={e => setAGUserPassword(e.target.value)} required/>
                  {!viewTextPassword ? <button className='navRefContViewPass' onClick={handleViewPassword}><FaRegEyeSlash className='faIcons'/></button>
                  :<button className='navRefContViewPass' onClick={handleHidePassword}><FaRegEye className='faIcons'/></button>}
                </div><br /><br />
                <div className='submitAccount'>
                  <button type='submit'>
                    <h6>LOGIN</h6>
                  </button>
                </div>
                <div className='errorMessage'>
                  <p>{messageResponse}</p>
                </div><br />
                <div className='registrationTCPP'>
                  <p>
                    Didn't have an Account? <a onClick={handleViewRegistration}>Register Here</a>
                  </p>
                </div>
              </div>
            </form>
          </div>
      </div>}


      <div className="mainNavContainer">
        <div className="navContainer website">
          <div className="navContent left">
              <Link to='/' onClick={handleClickHome}>
                  <img id='nclLogoWebsite' src={require('./assets/imgs/AGLogoWhite.png')} alt="" />
                  {/* <h5>ATTRACT GAME</h5> */}
                  <img id='nclLogoMobile' src={require('./assets/imgs/AGLogoNameWhite2.png')} alt="" />
              </Link>
          </div>
          <div className="navContent center">
            <Link to="/Highlights" onClick={handleClickDashboadrd}><h6>HIGHLIGHTS</h6></Link>
            <Link to="/Marketplace" onClick={handleClickMarketplace}><h6>MARKETPLACE</h6></Link>
            <Link to="/Games" onClick={handleClickGames}><h6>GAMES</h6></Link>
            <Link onClick={handleClickGiftcards}><h6>GIFTCARDS</h6></Link>
          </div>
          <div className="navContent right">
            {!viewUserCredentials ? <div>
              <a id='agLoginBtn' onClick={handleViewLogin}><h6><TbUserSquareRounded className='faIcons'/></h6></a>
              <a id='agRegisterBtn' onClick={handleViewRegistration}><h6>REGISTER</h6></a>
            </div>:
            <div id='userProfile'>
              {viewAdminCredentials &&<Link id='agAdminBtn' to='/Admin'><h6><MdAdminPanelSettings className='faIcons'/></h6></Link>}
              <Link id='agCartBtn'><h6><TbShoppingCartBolt className='faIcons'/></h6></Link>
              <Link id='agSettingsBtn'><h6><MdSettings className='faIcons'/></h6></Link>
              <Link id='agProfileBtn' to='/Profile'>
                {viewProfileImg ? 
                <img src={`https://engeenx.com/ProfilePics/${viewProfileImg}`} alt=""/>
                :<img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
              </Link>
              <a id='agLogoutBtn' onClick={handleUserLogout}><h6>LOGOUT</h6></a>
            </div>}
          </div>
        </div>
        <div className="navContainer mobile">
          <button className={localStorage.getItem('dashboard')} onClick={handleClickDashboadrd}><h5><MdOutlineSpaceDashboard className='faIcons'/></h5></button>
          <button className={localStorage.getItem('marketplace')} onClick={handleClickMarketplace}><h5><MdOutlineShoppingBag className='faIcons'/></h5></button>
          <button className={localStorage.getItem('games')} onClick={handleClickGames}><h5><MdOutlineGamepad  className='faIcons'/></h5></button>
          <button className={localStorage.getItem('giftcards')} onClick={handleClickGiftcards}><h5><MdOutlineCardGiftcard className='faIcons'/></h5></button>
          <button className={localStorage.getItem('crypto')} onClick={handleClickCrypto}><h5><MdCurrencyBitcoin className='faIcons'/></h5></button>
          {viewUserCredentials && 
            <Link id='agProfileBtn' to='/Profile'>
              {viewProfileImg ? 
              <img src={`https://engeenx.com/ProfilePics/${viewProfileImg}`} alt=""/>
              :<img src={require('./assets/imgs/ProfilePics/DefaultSilhouette.png')} alt=""/>}
            </Link>
          }
        </div>
        <hr />
      </div>
    </nav>
  ); 
}

export default Nav;