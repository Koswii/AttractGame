import React, { useState, useEffect } from 'react'
import "../CSS/admin.css";
import { 
    FaBars,
    FaTimes,
    FaCheck 
} from 'react-icons/fa';
import { 
    RiArrowUpSFill,
    RiArrowDownSFill,
    RiAddBoxFill   
} from "react-icons/ri";
import axios from 'axios';
import {getGameReviews} from 'unofficial-metacritic';


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
    const [activeView, setActiveView] = useState('default');

    useEffect(() => {
        const savedView = localStorage.getItem('activeView');
        if (savedView) {
        setActiveView(savedView);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('activeView', activeView);
    }, [activeView]);
    const handleViewNavigations = () => {
        setActiveView('default');
        setFormResponse('');
    };
    const handleViewAddSupplier = () => {
        setActiveView('supplier');
        setFormResponse('');
    };
    const handleViewAddGames = () => {
        setActiveView('games');
        setFormResponse('');
    };
    const handleViewAddGiftCards = () => {
        setActiveView('giftCards');
        setFormResponse('');
    };
    const handleViewAddGameCredit = () => {
        setActiveView('gameCredit');
        setFormResponse('');
    };
    const handleViewAddSeller = () => {
        setActiveView('seller');
        setFormResponse('');
    };
    const handleViewProducts = () => {
        setActiveView('productList');
        setFormResponse('');
    };
    const handleViewUsers = () => {
        setActiveView('userList');
        setFormResponse('');
    };
    const handleViewAddPopup = () => {
        setActiveView('popupAds');
        setFormResponse('');
    };
    const handleViewTransactions = () => {
        setActiveView('transactions');
    };

    
    const AGUserProfileListAPI = process.env.REACT_APP_AG_USERS_PROFILE_API;
    const AGAddSupplieAPI = process.env.REACT_APP_AG_ADD_SUPPLIER_API;
    const AGSupplieListAPI = process.env.REACT_APP_AG_SUPPLIER_LIST_API;
    const [viewUserProfiles, setViewUserProfiles] = useState([]);
    const [viewTotalAGElite, setViewTotalAGElite] = useState('');
    const [viewSupplierProfiles, setViewSupplierProfiles] = useState([]);
    const [viewActiveSupplier, setViewActiveSupplie] = useState('');
    const [viewGameTotal, setViewGameTotal] = useState([]);
    const [agSetCompany, setAGSetCompany] = useState('');
    const [agSetContact, setAGSetContact] = useState('');
    const [agSetEmail, setAGSetEmail] = useState('');
    const [agSetWebsite, setAGSetWebsite] = useState('');
    const [agSetStatus, setAGSetStatus] = useState('');
    const [agSetNotes, setAGSetNotes] = useState('');
    const [formResponse, setFormResponse] = useState('');

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


        const fetchDataGames = () => {
            axios.get(AGGamesListAPI)
            .then((response) => {
                const gameData = response.data;
                setViewGameTotal(gameData);
            })
            .catch(error => {
                console.log(error)
            })
        }
        fetchDataGames();

    }, []);
    const handleAddSupplier = async (e) => {
        e.preventDefault();
  
        const formAddSupplier = {
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
    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setAGSetGameCover(file.name);
        }
    };

    const AGAddGamesAPI = process.env.REACT_APP_AG_ADD_GAMES_API;
    const AGAddGameCoverAPI = process.env.REACT_APP_AG_ADD_GAME_COVER_API;
    const AGGamesListAPI = process.env.REACT_APP_AG_GAMES_LIST_API;
    const [agSetGameCover, setAGSetGameCover] = useState('');
    const [agSetGameTitle, setAGSetGameTitle] = useState('');
    const [agSetGameEdition, setAGSetGameEdition] = useState('');
    const [agSetGameCountry, setAGSetGameCountry] = useState('');
    const [agSetGameDeveloper, setAGSetGameDeveloper] = useState('');
    const [agSetGameRelease, setAGSetGameRelease] = useState('');
    const [agSetGameCategory, setAGSetGameCategory] = useState('');
    const [agSetGamePlatform, setAGSetGamePlatform] = useState('');
    const [agSetGameTrailer, setAGSetGameTrailer] = useState('');
    const [agSetGameDescription, setAGSetGameDescription] = useState('');
    const [agSetGameHighlight1, setAGSetGameHighlight1] = useState('');
    const [agSetGameSupplier, setAGSetGameSupplier] = useState('');
    const [agSetGameSeller, setAGSetGameSeller] = useState('');
    const [agSetGameAvailable, setAGSetGameAvailable] = useState('');
    const [agSetGameRestricted, setAGSetGameRestricted] = useState('');
    const agSetGameCode1 = agSetGameTitle.replace(/\s/g, '');
    const agSetGameCode2 = agSetGamePlatform.replace(/\s/g, '');
    const agSetGameCode3 = agSetGameEdition.replace(/\s/g, '');
    const agFullSetGameCode = `AG_${agSetGameCode1}_${agSetGameCode2}`;
    const agGameCanonical = `${agSetGameCode1}${agSetGamePlatform}_${agSetGameCode3}`;
    const MAX_PAYLOAD_SIZE = 5 * 1024 * 1024;

    const handleAddGame = async (e) => {
        e.preventDefault();
  
        const formAddGameDetails = {
            agGameCode: agFullSetGameCode,
            agGameCover: agSetGameCover,
            agGameTitle: agSetGameTitle,
            agGameCanonical: agGameCanonical,
            agGameEdition: agSetGameEdition,
            agGameCountry: agSetGameCountry,
            agGameDeveloper: agSetGameDeveloper,
            agGameRelease: agSetGameRelease,
            agGameCategory: agSetGameCategory,
            agGamePlatform: agSetGamePlatform,
            agGameTrailer: agSetGameTrailer,
            agGameHighlight1: agSetGameHighlight1,
            agGameSupplier: agSetGameSupplier,
            agGameSeller: agSetGameSeller,
            agGameAvailable: agSetGameAvailable,
            agGameRestricted: agSetGameRestricted,
        }

        const formImageData = new FormData();
        formImageData.append('agGameCover', image);

        const jsonAddGames = JSON.stringify(formAddGameDetails);
        axios.post(AGAddGamesAPI, jsonAddGames)
        .then(response => {
            const responseMessage = response.data;
            if (responseMessage.success === false) {
                setFormResponse(responseMessage.message);
                console.log(responseMessage.message);
            }
            if (responseMessage.success === true) {
                setFormResponse(responseMessage.message);
                console.log(responseMessage.message);
                setImage(null);
                setAGSetGameCover('');
                setAGSetGameTitle('');
                setAGSetGameEdition('');
                setAGSetGameCountry('');
                setAGSetGameDeveloper('');
                setAGSetGameRelease('');
                setAGSetGameCategory('');
                setAGSetGamePlatform('');
                setAGSetGameTrailer('');
                setAGSetGameHighlight1('');
                setAGSetGameSupplier('');
                setAGSetGameSeller('');
                setAGSetGameAvailable('');
                setAGSetGameRestricted('');
            }
        }) 
        .catch (error =>{
          console.log(error);
        });


        try {
            const response = await axios.post(AGAddGameCoverAPI, formImageData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            // console.log(response.data);
        } catch (error) {
            console.error(error);
        }

    };


    const [agAddGameEdition, setAGAddGameEdition] = useState(false)
    const handleViewAddGameEdition = (e) => {
        e.preventDefault();
        setAGAddGameEdition(true)
    }
    const handleHideAddGameEdition = (e) => {
        e.preventDefault();
        setAGAddGameEdition(false)
    }



    return (
        <div className='mainContainer admin'>
            <section className="adminPageContainer top">
                <div className="admPageContent top">
                    <div className="admpc top">
                        <div className='admpcViewNav'>
                            <button className={activeView === 'default' ? 'activeNav': ''} onClick={handleViewNavigations}><h6>DASHBOARD</h6></button>
                            <button className={activeView === 'supplier' ? 'activeNav': ''} onClick={handleViewAddSupplier}><h6>ADD SUPPLIER</h6></button>
                            <button className={activeView === 'games' ? 'activeNav': ''} onClick={handleViewAddGames}><h6>ADD GAMES</h6></button>
                            <button className={activeView === 'giftCards' ? 'activeNav': ''} onClick={handleViewAddGiftCards}><h6>ADD GIFTCARDS</h6></button>
                            <button className={activeView === 'gameCredit' ? 'activeNav': ''} onClick={handleViewAddGameCredit}><h6>ADD GAME CREDIT</h6></button>
                            <button className={activeView === 'seller' ? 'activeNav': ''} onClick={handleViewAddSeller}><h6>ADD SELLER</h6></button>
                            <button className={activeView === 'productList' ? 'activeNav': ''} onClick={handleViewProducts}><h6>PRODUCTS</h6></button>
                            <button className={activeView === 'userList' ? 'activeNav': ''} onClick={handleViewUsers}><h6>USERS LIST</h6></button>
                            <button className={activeView === 'popupAds' ? 'activeNav': ''} onClick={handleViewAddPopup}><h6>OTHERS</h6></button>
                            <button className={activeView === 'transactions' ? 'activeNav': ''} onClick={handleViewTransactions}><h6>TRANSACTION HISTORY</h6></button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="adminPageContainer mid">
                <div className="admPageContent mid1">
                    {activeView === 'default' &&<div className="admpcm1Dashboard">
                        <h4>DASHBOARD</h4>
                        <div className="admpcm1dContainer">
                            <div className="admpcm1dContent left">
                                <div>
                                    <h4>{viewSupplierProfiles.length}</h4>
                                    <h6>TOTAL SUPPLIERS</h6>
                                </div>
                                <div>
                                    <h4>{viewUserProfiles.length}</h4>
                                    <h6>REGISTERED USERS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>TOTAL REGISTERED SELLERS</h6>
                                </div>
                                <div>
                                    <h4>{viewGameTotal.length}</h4>
                                    <h6>LISTED GAMES</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>LISTED GIFTCARDS</h6>
                                </div>
                                <div>
                                    <h4>0</h4>
                                    <h6>LISTED GAME CREDITS</h6>
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
                                        <th width='10%'><p>REFEREE</p></th>
                                    </tr>
                                </thead>
                            </table>
                            <table id='admpcm1dtContent'>
                                <tbody>
                                    {viewUserProfiles.slice(0,10).map((item, i) => (
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
                    {activeView === 'supplier' &&<div className="admpcm1Supplier">
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
                                <form id='addSupplierFormContainer' onSubmit={handleAddSupplier}>
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
                                            <textarea name="" id="" maxLength={1000} placeholder='Type notes/comment here...' value={agSetNotes} onChange={(e) => setAGSetNotes(e.target.value)}></textarea>
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
                    {activeView === 'games' &&<div className="admpcm1Games">
                        <div className="admpcm1AddGameContainer">
                            <div className="admpcm1AGameContent left">
                                <h4>WELCOME ADMIN!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new games, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="admpcm1AGamesCAll">
                                    <div>
                                        <h4>{viewGameTotal.length} Games</h4>
                                        <p>Total Listed Games</p>
                                    </div>
                                    <div>
                                        <h4>0 Stocks</h4>
                                        <p>Total Game Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="admpcm1AGameContent right">
                                <form id='addGamesFormContainer' onSubmit={handleAddGame}>
                                    <h5>ADD GAMES FORM</h5>
                                    <div className='admpcm1agcForm'>
                                        <div className="admpcm1agcf left">
                                            <div className='admpc1agcfImage'>
                                                {image && (
                                                    <img src={URL.createObjectURL(image)} alt="No image Selected" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputChange}/>
                                            </div>
                                        </div>
                                        <div className="admpcm1agcf right">
                                            <span>
                                                <label htmlFor=""><p>Game Title</p></label>
                                                <input type="text" placeholder='ex. Tetris' value={agSetGameTitle} onChange={(e) => setAGSetGameTitle(e.target.value)} required/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Game Edition</p></label>
                                                {!agAddGameEdition ? <select name="" id="" value={agSetGameEdition} onChange={(e) => setAGSetGameEdition(e.target.value)}>
                                                    <option value="">Select Game Edition</option>
                                                    <option value="Standard Edition">Standard Edition</option>
                                                    <option value="Deluxe Edition">Deluxe Edition</option>
                                                    <option value="Ultimate Edition">Ultimate Edition</option>
                                                    <option value="Limited Edition">Limited Edition</option>
                                                    <option value="Special Edition">Special Edition</option>
                                                    <option value="Silver Edition">Silver Edition</option>
                                                    <option value="Gold Edition">Gold Edition</option>
                                                    <option value="Platinum Edition">Platinum Edition</option>
                                                    <option value="Diamond Edition">Diamond Edition</option>
                                                    <option value="Other Edition">Other Edition</option>
                                                </select>
                                                :<input type="text" value={agSetGameEdition} onChange={(e) => setAGSetGameEdition(e.target.value)} placeholder='Add Custom Edition'/>}
                                                <button onClick={!agAddGameEdition ? handleViewAddGameEdition : handleHideAddGameEdition}>{!agAddGameEdition ? <RiAddBoxFill className='faIcons'/>:<FaTimes className='faIcons'/>}</button>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Country</p></label>
                                                <input type="text" placeholder='ex. Global/US/EU' value={agSetGameCountry} onChange={(e) => setAGSetGameCountry(e.target.value)} required/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Game Developer</p></label>
                                                <input type="text" placeholder='ex. NAMCO LTD.' value={agSetGameDeveloper} onChange={(e) => setAGSetGameDeveloper(e.target.value)} required/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Date Released</p></label>
                                                <input type="date" value={agSetGameRelease} onChange={(e) => setAGSetGameRelease(e.target.value)} required/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Highlight (Optional)</p></label>
                                                <select name="" id="" value={agSetGameHighlight1} onChange={(e) => setAGSetGameHighlight1(e.target.value)}>
                                                    <option value="">Select Highlight</option>
                                                    <option value="Featured">Featured Games</option>
                                                    <option value="Sale">On Sale Games</option>
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Supplier</p></label>
                                                <select name="" id="" value={agSetGameSupplier} onChange={(e) => setAGSetGameSupplier(e.target.value)}>
                                                    <option value="">Select Supplier</option>
                                                    {viewSupplierProfiles.slice(0,8).map((item, i) => (
                                                        <option key={i} value={item.company}>{item.company}</option>
                                                    ))}
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Seller</p></label>
                                                <select name="" id="" value={agSetGameSeller} onChange={(e) => setAGSetGameSeller(e.target.value)} required>
                                                    <option value="">Select Seller</option>
                                                    <option value="Attract Game">Attract Game Stocks</option>
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Category</p></label>
                                                <select name="" id="" value={agSetGameCategory} onChange={(e) => setAGSetGameCategory(e.target.value)} required>
                                                    <option value="">Select Category</option>
                                                    <option value="Trending">Trending Games</option>
                                                    <option value="Hot">Hot Games</option>
                                                    <option value="Classic">Classic Games</option>
                                                    <option value="Preorder">Pre-Order Games</option>
                                                </select>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Platform</p></label>
                                                <select name="" id="" value={agSetGamePlatform} onChange={(e) => setAGSetGamePlatform(e.target.value)} required>
                                                    <option value="">Select Platform</option>
                                                    <option value="MobileApp">Mobile Games</option>
                                                    <option value="PC">PC Games</option>
                                                    <option value="NintendoSwitch">Nintendo Switch Games</option>
                                                    <option value="XboxXS">Xbox X/S Games</option>
                                                    <option value="XboxOne">Xbox One Games</option>
                                                    <option value="PlayStation4">PS4 Games</option>
                                                    <option value="PlayStation5">PS5 Games</option>
                                                </select>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="admpc1agcfOthers">
                                        <div className="admpc1agcfo left">
                                            <span>
                                                <label htmlFor=""><p>Available Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameAvailable} onChange={(e) => setAGSetGameAvailable(e.target.value)} placeholder='Type Countries here..' required></textarea>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Restricted Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameRestricted} onChange={(e) => setAGSetGameRestricted(e.target.value)} placeholder='Type Countries here..' required></textarea>
                                            </span>
                                        </div>
                                        <div className="admpc1agcfo right">
                                            <span>
                                                <label htmlFor=""><p>Game Trailer (YouTube Link)</p></label>
                                                <input type="text" placeholder='ex. https://www.youtube.com/watch?v=Mr8fVT_Ds4Q' value={agSetGameTrailer} onChange={(e) => setAGSetGameTrailer(e.target.value)} required/>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='gameSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="admpc1agcfSubmit">
                                        <button type='submit' name='addGames'>Add Games</button>
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