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
        setViewAdminDefault(true)
        setViewAdminNavigations(false)
        setViewAdminSupplier(false)
        setViewAdminGames(false)
        setViewAdminGiftCards(false)
        setViewAdminSeller(false)
        setViewAdminProductList(false)
        setViewAdminUserList(false)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(false)
    }
    const handleViewAddSupplier = () => {
        setViewAdminDefault(false)
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
        setViewAdminDefault(false)
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
        setViewAdminDefault(false)
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
        setViewAdminDefault(false)
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
        setViewAdminDefault(false)
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
        setViewAdminDefault(false)
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
        setViewAdminDefault(false)
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
        setViewAdminDefault(false)
        setViewAdminSupplier(false)
        setViewAdminGames(false)
        setViewAdminGiftCards(false)
        setViewAdminSeller(false)
        setViewAdminProductList(false)
        setViewAdminUserList(false)
        setViewAdminPopupAds(false)
        setViewAdminTransactions(true)
    }

    
    const AGUserProfileListAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGAddSupplieAPI = process.env.REACT_APP_AG_ADD_SUPPLIER_API;
    const AGSupplieListAPI = process.env.REACT_APP_AG_SUPPLIER_LIST_API;
    const [viewUserProfiles, setViewUserProfiles] = useState([])
    const [viewTotalAGElite, setViewTotalAGElite] = useState('')
    const [viewSupplierProfiles, setViewSupplierProfiles] = useState([])
    const [viewActiveSupplier, setViewActiveSupplie] = useState('')
    const [agSetCompany, setAGSetCompany] = useState('')
    const [agSetContact, setAGSetContact] = useState('')
    const [agSetEmail, setAGSetEmail] = useState('')
    const [agSetWebsite, setAGSetWebsite] = useState('')
    const [agSetStatus, setAGSetStatus] = useState('')
    const [agSetNotes, setAGSetNotes] = useState('')

    const [formResponse, setFormResponse] = useState('')

    useEffect(() => {
        const fetchDataUser = () => {
            axios.get(AGUserProfileListAPI)
            .then((response) => {
                const userData = response.data.sort((a, b) => b.id - a.id);
                const userAGEliteData = response.data.filter(user => user.agelite == 'Yes');
                setViewUserProfiles(userData);
                setViewTotalAGElite(userAGEliteData);

            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataUser();

        const fetchDataSupplier = () => {
            axios.get(AGSupplieListAPI)
            .then((response) => {
                const supplierData = response.data;
                const userAGActiveSupplier = response.data.filter(supplier => supplier.status == 'Active');
                setViewSupplierProfiles(supplierData);
                setViewActiveSupplie(userAGActiveSupplier);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataSupplier();

        
    }, []);
    const handleAddSupplier = async (e) => {
        e.preventDefault();
  
        const formAddSupplier ={
            agSupplierCompany: agSetCompany,
            agSupplierContact: agSetContact,
            agSupplierEmail: agSetEmail,
            agSupplierWebsite: agSetWebsite,
            agSupplierStatus: agSetStatus,
            agSupplierNotes: agSetNotes,
        }
  
        const jsonAddSupplier = JSON.stringify(formAddSupplier);
        axios.post(AGAddSupplieAPI, jsonAddSupplier)
        .then(response => {
            const responseMessage = response.data;
            if (responseMessage.success === false) {
                setFormResponse(responseMessage.message);
            }
            if (responseMessage.success === true) {
                setFormResponse(responseMessage.message);
                setAGSetCompany('')
                setAGSetContact('')
                setAGSetEmail('')
                setAGSetWebsite('')
                setAGSetNotes('')
            }
        }) 
        .catch (error =>{
          // Handle errors
          console.log(error);
        });
    };






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
                    {viewAdminDefault &&<div className="admpcm1Dashboard">
                        <h4>DASHBOARD</h4>
                        <div className="admpcm1dContainer">
                            <div className="admpcm1dContent left">
                                <div>
                                    <h4>{viewSupplierProfiles.length}</h4>
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
                                    <h4>{viewUserProfiles.length}</h4>
                                    <h6>REGISTERED USERS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>TOTAL SELLERS</h6>
                                </div>
                                <div>
                                    <h4>{viewTotalAGElite.length}</h4>
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
                                    {viewUserProfiles.slice(0,8).map((item, i) => (
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
                    </div>}
                    {viewAdminSupplier &&<div className="admpcm1Supplier">
                        <div className="admpcm1AddSuppContainer">
                            <div className="admpcm1ASuppContent left">
                                <h4>WELCOME ADMIN!</h4><br />
                                <p>
                                    Here, you have the authority to seamlessly add suppliers for both games 
                                    and gift cards. Every detail you input will be meticulously recorded 
                                    and stored within our database, ensuring comprehensive management and 
                                    accessibility.
                                </p>
                                <div className="admpcm1ASuppCAll">
                                    <div>
                                        <h4>{viewSupplierProfiles.length}</h4>
                                        <p>Listed Suppliers</p>
                                    </div>
                                    <div>
                                        <h4>{viewActiveSupplier.length}</h4>
                                        <p>Active Suppliers</p>
                                    </div>
                                </div>
                                <div className="admpcm1ASuppCView">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th width='30%'><p>COMPANY</p></th>
                                                <th width='30%'><p>CONTACT PERSON</p></th>
                                                <th width='40%'><p>EMAIL</p></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <table>
                                        <tbody>
                                            {viewSupplierProfiles.slice(0,8).map((item, i) => (
                                                <tr key={i}>
                                                    <td width='30%'><p>{item.company}</p></td>
                                                    <td width='30%'><p>{item.contact}</p></td>
                                                    <td width='40%'><p>{item.email}</p></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="admpcm1ASuppContent right">
                                <form onSubmit={handleAddSupplier}>
                                    <h5>ADD SUPPLIER FORM</h5>
                                    <div className='admpcm1ASuppContentForm'>
                                        <span>
                                            <label htmlFor=""><p>Company</p></label>
                                            <input type="text" placeholder='ex. ABC Company' value={agSetCompany} onChange={(e) => setAGSetCompany(e.target.value)} required/>
                                        </span>
                                        <span>
                                            <label htmlFor=""><p>Contact Person</p></label>
                                            <input type="text" placeholder='ex. John Doe' value={agSetContact} onChange={(e) => setAGSetContact(e.target.value)} required/>
                                        </span>
                                        <span>
                                            <label htmlFor=""><p>Email</p></label>
                                            <input type="email" placeholder='ex. johndoe@abccompany.com' value={agSetEmail} onChange={(e) => setAGSetEmail(e.target.value)} required/>
                                        </span>
                                        <span>
                                            <label htmlFor=""><p>Website</p></label>
                                            <input type="text" placeholder='abccompany.com' value={agSetWebsite} onChange={(e) => setAGSetWebsite(e.target.value)} required/>
                                        </span>
                                        <span>
                                            <label htmlFor=""><p>Notes (Optional)</p></label>
                                            <textarea name="" id="" placeholder='Type notes/comment here...' value={agSetNotes} onChange={(e) => setAGSetNotes(e.target.value)}></textarea>
                                        </span>
                                        <span className='supplierSubmitStatus'>
                                            <p>{formResponse}</p>
                                        </span>
                                        <span className='supplierSubmit'>
                                            <button type='submit'>Add Supplier</button>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                </div>
            </section>
        </div>
    )
}

export default Admin