import React, { useState, useEffect } from 'react'
import "./CSS/nav.css";
import { 
    FaBars, 
    FaTimes,
    FaRegUserCircle,
} from 'react-icons/fa';
import { 
  MdAdminPanelSettings 
} from "react-icons/md";
import axios from 'axios';
import { Link } from 'react-router-dom';



const Nav = () => {
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

  useEffect(() => {
    const fetchDataUser = () => {
      axios.get(AGUserListAPI)
      .then((response) => {
        const allUsersStatus = response.data.find(item => item.username == agUserUsername);
        const userData = response.data.find(item => item.username == LoginUsername);
        setDataUser(userData);

        if(userData){
          if(userData['account'] == 'Admin'){
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

    if (userFromLocalStorage) {
      setViewUserCredentials(true);
    }
  }, [LoginUsername, agUserUsername]);
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('attractGameUsername');
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
            <form className="navRegistrationContent" onSubmit={handleUserRegister}>
              <h6>REGISTER AN ACCOUNT</h6>
              <div>
                <span>
                  <label htmlFor=""><p>Email</p></label>
                  <input type="email" placeholder='ex. playerOne01@email.com' value={agUserEmail} onChange={(e) => setAGUserEmail(e.target.value)} required/>
                </span>
                <span>
                  <label htmlFor=""><p>Username</p></label>
                  <input type="text" placeholder='ex. Player One' value={agUserUsername} onChange={(e) => setAGUserUsername(e.target.value)} required/>
                </span>
                <span>
                  <label htmlFor=""><p>Password</p></label>
                  <input type="password" placeholder='********' value={agUserPassword} minLength={8} maxLength={16} onChange={(e) => setAGUserPassword(e.target.value)} required/>
                </span>
                <span>
                  <label htmlFor=""><p>Referrer (Optional)</p></label>
                  <input type="text" placeholder='ex. PlayerTwo' value={agUserReferral} onChange={(e) => setAGUserReferral(e.target.value)}/>
                </span>
                <span className='recaptchaSetup'>
                  <img id='captchaContent' src={`https://dummyimage.com/150x50/000/fff&text=${captcha}`} alt="Captcha" />
                  <img id='captchaBG' src={require('./assets/imgs/LoginBackground.jpg')} alt="" />
                  <input type="text" onChange={(e) => setInputValueCaptcha(e.target.value)} placeholder="Enter CAPTCHA"/>
                </span>
                <span className='submitAccount'>
                  <button type='submit'>
                    <h6>REGISTER</h6>
                  </button>
                </span>
                <span className='registrationTCPP'>
                  <p>
                    By registering, you agree to Attract Game's <br />
                    <Link>Terms & Conditions</Link> and <Link>Privacy Policy</Link><br /><br />
                    <span>{messageResponse}</span>
                  </p>
                  <p>
                    Already have an Account? <a onClick={handleViewLogin}>Login Here</a>
                  </p>
                </span>
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
              <div>
                <span>
                  <label htmlFor=""><p>Username</p></label>
                  <input type="text" placeholder='ex. Player One' value={agUserUsername} onChange={e => setAGUserUsername(e.target.value)} required/>
                </span>
                <span>
                  <label htmlFor=""><p>Password</p></label>
                  <input type="password" placeholder='*****' value={agUserPassword} onChange={e => setAGUserPassword(e.target.value)} required/>
                </span><br /><br />
                <span className='submitAccount'>
                  <button type='submit'>
                    <h6>LOGIN</h6>
                  </button>
                </span>
                <span className='errorMessage'>
                  <p>{messageResponse}</p>
                </span><br />
                <span className='registrationTCPP'>
                  <p>
                    Didn't have an Account? <a onClick={handleViewRegistration}>Register Here</a>
                  </p>
                </span>
              </div>
            </form>
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
          <div className="navContent center">
            <Link><h6>HIGHLIGHTS</h6></Link>
            <Link to="/Marketplace"><h6>MARKETPLACE</h6></Link>
            <Link><h6>CRYPTO</h6></Link>
          </div>
          <div className="navContent right">
            {!viewUserCredentials ? <div>
              <a id='agLoginBtn' onClick={handleViewLogin}><h6>LOGIN</h6></a>
              <a id='agRegisterBtn' onClick={handleViewRegistration}><h6>REGISTER</h6></a>
            </div>:
            <div id='userProfile'>
              {viewAdminCredentials &&<Link id='agProfileBtn' to='/Admin'><h6><MdAdminPanelSettings className='faIcons'/></h6></Link>}
              <Link id='agProfileBtn' to='/Profile'>
                <img src="https://engeenx.com/ProfilePics/DefaultProfilePic.png" alt="" />
              </Link>
              <a id='agLogoutBtn' onClick={handleUserLogout}><h6>LOGOUT</h6></a>
            </div>}
          </div>
        </div>
      </div>
    </nav>
  ); 
}

export default Nav;