import React, { useState, useEffect } from 'react'
import "../CSS/admin.css";
import { 
    FaBars,
    FaTimes,
    FaCheck 
} from 'react-icons/fa';
import { 
    RiArrowUpSFill,
    RiArrowDownSFill  
} from "react-icons/ri";
import axios from 'axios';



const formatDateToWordedDate = (numberedDate) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(numberedDate);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
}
const Admin = () => {
    const [viewAdminNavigations, setViewAdminNavigations] = useState(false)
    const [viewAdminDefault, setViewAdminDefault] = useState(true)
    const [viewAdminSupplier, setViewAdminSupplier] = useState(false)
    const [viewAdminGames, setViewAdminGames] = useState(false)
    const [viewAdminGiftCard, setViewAdminGiftCards] = useState(false)
    const [viewAdminSeller, setViewAdminSeller] = useState(false)
    const [viewAdminProductList, setViewAdminProductList] = useState(false)
    const [viewAdminUserList, setViewAdminUserList] = useState(false)
    const [viewAdminPopupAds, setViewAdminPopupAds] = useState(false)
    const [viewAdminTransactions, setViewAdminTransactions] = useState(false)
    

    const handleViewNavigations = () => {
        setViewAdminNavigations(true)
    }
    const handleCloseNavigations = () =>{
        setViewAdminNavigations(false)
    }
    const handleViewAddSupplier = () => {
        setViewAdminSupplier(true)
        setViewAdminGames(false)
        setViewAdminGiftCards(false)
        setViewAdminSeller(false)
        setViewAdminProductList(false)
        setViewAdminUserList(false)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(false)
    }
    const handleViewAddGames = () => {
        setViewAdminSupplier(false)
        setViewAdminGames(true)
        setViewAdminGiftCards(false)
        setViewAdminSeller(false)
        setViewAdminProductList(false)
        setViewAdminUserList(false)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(false)
    }
    const handleViewAddGiftCards = () => {
        setViewAdminSupplier(false)
        setViewAdminGames(false)
        setViewAdminGiftCards(true)
        setViewAdminSeller(false)
        setViewAdminProductList(false)
        setViewAdminUserList(false)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(false)
    }
    const handleViewAddSeller = () => {
        setViewAdminSupplier(false)
        setViewAdminGames(false)
        setViewAdminGiftCards(false)
        setViewAdminSeller(true)
        setViewAdminProductList(false)
        setViewAdminUserList(false)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(false)
    }
    const handleViewProducts = () => {
        setViewAdminSupplier(false)
        setViewAdminGames(false)
        setViewAdminGiftCards(false)
        setViewAdminSeller(false)
        setViewAdminProductList(true)
        setViewAdminUserList(false)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(false)
    }
    const handleViewUsers = () => {
        setViewAdminSupplier(false)
        setViewAdminGames(false)
        setViewAdminGiftCards(false)
        setViewAdminSeller(false)
        setViewAdminProductList(false)
        setViewAdminUserList(true)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(false)
    }
    const handleViewAddPopup = () => {
        setViewAdminSupplier(false)
        setViewAdminGames(false)
        setViewAdminGiftCards(false)
        setViewAdminSeller(false)
        setViewAdminProductList(false)
        setViewAdminUserList(false)
        setViewAdminPopupAds(true)
        setViewAdminTransactions(false)
    }
    const handleViewTransactions = () => {
        setViewAdminSupplier(false)
        setViewAdminGames(false)
        setViewAdminGiftCards(false)
        setViewAdminSeller(false)
        setViewAdminProductList(false)
        setViewAdminUserList(false)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(true)
    }

    const [viewUserProfiles, setViewUserProfiles] = useState([])
    useEffect(() => {
        const fetchDataUser = () => {
          axios.get('https://engeenx.com/agUserProfile.php')
          .then((response) => {
            const userData = response.data.sort((a, b) => b.id - a.id);
            setViewUserProfiles(userData);
          })
          .catch(error => {
            console.log(error)
          })
        }
        fetchDataUser();
    }, []);








    return (
        <div className='mainContainer admin'>
            <section className="adminPageContainer top">
                <div className="admPageContent top">
                    <div className="admpc top">
                        {!viewAdminNavigations ? 
                        <button id='adminNavBars'onClick={handleViewNavigations}><h6><FaBars className='faIcons'/></h6></button>:
                        <button id='adminNavClose' className={!viewAdminNavigations ? '':'active'} onClick={handleCloseNavigations}><h6><FaTimes className='faIcons'/></h6></button>}
                        <div className={!viewAdminNavigations ? 'admpcViewNav hide' : 'admpcViewNav'}>
                            <button className={viewAdminSupplier ? 'activeNav': ''} onClick={handleViewAddSupplier}><h6>ADD SUPPLIER</h6></button>
                            <button className={viewAdminGames ? 'activeNav': ''} onClick={handleViewAddGames}><h6>ADD GAMES</h6></button>
                            <button className={viewAdminGiftCard ? 'activeNav': ''} onClick={handleViewAddGiftCards}><h6>ADD GIFTCARDS</h6></button>
                            <button className={viewAdminSeller ? 'activeNav': ''} onClick={handleViewAddSeller}><h6>ADD SELLER</h6></button>
                            <button className={viewAdminPopupAds ? 'activeNav': ''} onClick={handleViewAddPopup}><h6>POPUP ADS</h6></button>
                            <button className={viewAdminProductList ? 'activeNav': ''} onClick={handleViewProducts}><h6>PRODUCTS</h6></button>
                            <button className={viewAdminUserList ? 'activeNav': ''} onClick={handleViewUsers}><h6>USERS LIST</h6></button>
                            <button className={viewAdminTransactions ? 'activeNav': ''} onClick={handleViewTransactions}><h6>TRANSACTION HISTORY</h6></button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="adminPageContainer mid">
                <div className="admPageContent mid1">
                    <div className="admpcm1Dashboard">
                        <h4>DASHBOARD</h4>
                        <div className="admpcm1dContainer">
                            <div className="admpcm1dContent left">
                                <div>
                                    <h4>0</h4>
                                    <h6>TOTAL SUPPLIERS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>LISTED GAMES</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>LISTED GIFTCARDS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>REGISTERED USERS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>TOTAL SELLERS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>TOTAL AG ELITE</h6>
                                </div>
                            </div>
                            <div className="admpcm1dContent right">
                                <div>
                                    <h4>$ 9999999</h4>
                                    <p>TOTAL SALES</p>
                                    <span>
                                        <h6><RiArrowUpSFill className='faIcons'/> 100%</h6>
                                    </span>
                                </div>
                                <div>
                                    <h4>$ 9999999</h4>
                                    <p>TOTAL PROFIT</p>
                                    <span>
                                        <h6><RiArrowUpSFill className='faIcons'/> 100%</h6>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <h5>RECENT REGISTRATION</h5>
                        <div className="admpcm1dTransaction">
                            <table>
                                <thead>
                                    <tr>
                                        <th width='20%'><p>EMAIL</p></th>
                                        <th width='20%'><p>USERNAME</p></th>
                                        <th width='10%'><p>AG ELITE</p></th>
                                        <th width='20%'><p>DATE REGISTERED</p></th>
                                        <th width='20%'><p>REFERRAL CODE</p></th>
                                        <th width='10%'><p>TOTAL REFEREE</p></th>
                                    </tr>
                                </thead>
                            </table>
                            <table id='admpcm1dtContent'>
                                <tbody>
                                    {viewUserProfiles.map((item, i) => (
                                        <tr key={i}>
                                            <td width='20%'><p>{item.email}</p></td>
                                            <td width='20%'><p>{item.username}</p></td>
                                            <td width='10%'><p>{item.agelite ? <FaCheck className='faIcons'/>: ''}</p></td>
                                            <td width='20%'><p>{formatDateToWordedDate(item.date)}</p></td>
                                            <td width='20%'><p>{item.refcode}</p></td>
                                            <td width='10%'><p>0</p></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Admin