import React, { useState, useEffect } from 'react'
import "../CSS/sellerPanel.css";
import axios from 'axios';
import { 
    RiArrowUpSFill,
    RiArrowDownSFill,
    RiAddBoxFill   
} from "react-icons/ri";
import { 
    FaBars,
    FaTimes,
    FaSortAlphaDown,
    FaSortAlphaUp,
    FaCheck,
    FaSearch,
    FaFilter,
    FaExternalLinkAlt  
} from 'react-icons/fa';
import { UserProfileData } from './UserProfileContext';



const SellerPanel = () => {
    const [activeView, setActiveView] = useState('default');
    const { userLoggedData } = UserProfileData();

    const AGAddGamesAPI = process.env.REACT_APP_AG_ADD_GAMES_API;
    const AGAddGameCoverAPI = process.env.REACT_APP_AG_ADD_GAME_COVER_API;
    const AGAddGiftcardsAPI = process.env.REACT_APP_AG_ADD_GIFTCARD_API;
    const AGAddGameCreditsAPI = process.env.REACT_APP_AG_ADD_GAMECREDIT_API;


    
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
    };
    const handleViewAddGames = () => {
        setActiveView('games');
    };
    const handleViewAddGiftcards = () => {
        setActiveView('giftcards');
    };
    const handleViewAddGamecredits = () => {
        setActiveView('gamecredits');
    };
    const handleViewAddCodes = () => {
        setActiveView('codes');
    };
    const handleViewInventory = () => {
        setActiveView('inventory');
    };
    const handleViewTickets = () => {
        setActiveView('tickets');
    };

    const [formResponse, setFormResponse] = useState('');


    // Seller Add Game Setup
    const [agSetGameCover, setAGSetGameCover] = useState('');
    const [agSetGameTitle, setAGSetGameTitle] = useState('');
    const [agSetGameEdition, setAGSetGameEdition] = useState('');
    const [agSetGameCountry, setAGSetGameCountry] = useState('');
    const [agSetGameDeveloper, setAGSetGameDeveloper] = useState('');
    const [agSetGameRelease, setAGSetGameRelease] = useState('');
    const [agSetGameCategory, setAGSetGameCategory] = useState('');
    const [agSetGamePlatform, setAGSetGamePlatform] = useState('');
    const [agSetGameTrailer, setAGSetGameTrailer] = useState('');
    const [agSetGameHighlight1, setAGSetGameHighlight1] = useState('');
    const [agSetGameAvailable, setAGSetGameAvailable] = useState('');
    const [agSetGameRestricted, setAGSetGameRestricted] = useState('');
    const agSetGameCode1 = agSetGameTitle.replace(/\s/g, '');
    const agSetGameCode2 = agSetGamePlatform.replace(/\s/g, '');
    const agSetGameCode3 = agSetGameEdition.replace(/\s/g, '');
    const agFullSetGameCode = `${userLoggedData.userid}_${agSetGameCode1}_${agSetGameCode2}`;
    const agGameCanonical = `${agSetGameCode1}${agSetGamePlatform}_${agSetGameCode3}_${userLoggedData.userid}`;
    const [image, setImage] = useState(null);
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            setImage(file);
            setAGSetGameCover(file.name);
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
    const handleAddGame = async (e) => {
        e.preventDefault();
    
        const formAddGameDetailsSeller = {
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
            agGameSupplier: '',
            agGameSeller: userLoggedData.userid,
            agGameAvailable: agSetGameAvailable,
            agGameRestricted: agSetGameRestricted,
        };

        // const test = JSON.stringify(formAddGameDetailsSeller)
        // console.log(test);
    
        const formImageDataSeller = new FormData();
        formImageDataSeller.append('agGameCover', image);

    
        try {
            // Sending game details
            const addGameResponse = await axios.post(AGAddGamesAPI, formAddGameDetailsSeller);
            const responseMessage = addGameResponse.data;
    
            setFormResponse(responseMessage.message);
            console.log(responseMessage.message);
    
            if (responseMessage.success) {
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
                setAGSetGameAvailable('');
                setAGSetGameRestricted('');
            }
            // Sending game cover image
            const response = await axios.post(AGAddGameCoverAPI, formImageDataSeller, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    // Seller Add Giftcards Setup
    const [agSetGiftCardTitle, setAGSetGiftCardTitle] = useState('');
    const [agSetGiftCardCover, setAGSetGiftCardCover] = useState('');
    const [agSetGiftCardDenomination, setAGSetGiftCardDenomination] = useState('');
    const [agSetGiftCardCategory, setAGSetGiftCardCategory] = useState('');
    const [agSetGiftCardDescription, setAGSetGiftCardDescription] = useState('');
    const agSetGiftCardCode1 = agSetGiftCardTitle.replace(/\s/g, '');
    const agSetGiftCardCode2 = agSetGiftCardDenomination.replace(/\s/g, '');
    const agSetGiftCardCode3 = agSetGiftCardTitle.replace(/ /g, '_');
    const agSetGiftCardCanonical = `${agSetGiftCardCode3}_${userLoggedData.userid}`;
    const agFullSetGiftCardCode = `${userLoggedData.userid}_${agSetGiftCardCode1}_${agSetGiftCardCode2}`;
    const [imageGCV, setImageGCV] = useState(null);
    const handleFileInputGCVChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageGCV(file);
            setAGSetGiftCardCover(file.name);
        }
    };
    const handleAddGiftcard = async (e) => {
        e.preventDefault();
    
        const formAddGiftcardsDetailsSeller = {
            agGiftcardCode: agFullSetGiftCardCode,
            agGiftcardCover: agSetGiftCardCover,
            agGiftcardTitle: agSetGiftCardTitle,
            agGiftcardCanonical : agSetGiftCardCanonical,
            agGiftcardDenomination: agSetGiftCardDenomination,
            agGiftcardSupplier: '',
            agGiftcardSeller: userLoggedData.userid,
            agGiftcardCategory: agSetGiftCardCategory,
            agGiftcardDescription: agSetGiftCardDescription,
        };

        
        // const test = JSON.stringify(formAddGiftcardsDetailsSeller)
        // console.log(test);
    
        const formImageGCVData = new FormData();
        formImageGCVData.append('agGiftcardCover', imageGCV);

        try {
            // Sending gift card details
            const addGiftcardsResponse = await axios.post(AGAddGiftcardsAPI, formAddGiftcardsDetailsSeller);
            const responseMessage = addGiftcardsResponse.data;
    
            setFormResponse(responseMessage.message);
            console.log(responseMessage.message);
    
            if (responseMessage.success) {
                setImageGCV(null);
                setAGSetGiftCardTitle('');
                setAGSetGiftCardDenomination('');
                setAGSetGiftCardCategory('');
                setAGSetGiftCardDescription('');
            }
    
            // Sending gift card cover image
            // await axios.post(AGAddGiftcardCoverAPI, formImageGCVData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });
    
        } catch (error) {
            console.error(error);
        }
    };


    // Seller Add Gamecredits Setup
    const [agSetGameCreditTitle, setAGSetGameCreditTitle] = useState('');
    const [agSetGameCreditCover, setAGSetGameCreditCover] = useState('');
    const [agSetGameCreditDenomination, setAGSetGameCreditDenomination] = useState('');
    const [agSetGameCreditNumber, setAGSetGameCreditNumber] = useState('');
    const [agSetGameCreditType, setAGSetGameCreditType] = useState('');
    const [agSetGameCreditCategory, setAGSetGameCreditCategory] = useState('');
    const [agSetGameCreditDescription, setAGSetGameCreditDescription] = useState('');
    const agSetGameCreditCode1 = agSetGameCreditTitle.replace(/\s/g, '');
    const agSetGameCreditCode2 = agSetGameCreditDenomination.replace(/\s/g, '');
    const agSetGameCreditCode3 = agSetGameCreditTitle.replace(/[(){}\-.,]/g, '');
    const agSetGameCreditCode4 = agSetGameCreditCode3.replace(/\s/g, '');
    const agSetGameCreditCode5 = `${agSetGameCreditCode3.replace(/ /g, '_') + '_Game_Credit'}`;
    const agSetGameCreditCanonical = `${agSetGameCreditCode5}_${userLoggedData.userid}`;
    const agFullSetGameCreditCode = `${userLoggedData.userid}_${agSetGameCreditCode4}GameCredit_${agSetGameCreditCode2}`;
    const [imageGCR, setImageGCR] = useState(null);
    const handleFileInputGCRChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageGCR(file);
            setAGSetGameCreditCover(file.name);
        }
    };
    const handleAddGamecredit = async (e) => {
        e.preventDefault();
    
        const formAddGamecreditsDetailsSeller = {
            agGamecreditCode: agFullSetGameCreditCode,
            agGamecreditCover: agSetGameCreditCover,
            agGamecreditTitle: agSetGameCreditTitle,
            agGamecreditNumber : agSetGameCreditNumber,
            agGamecreditType: agSetGameCreditType,
            agGamecreditCanonical : agSetGameCreditCanonical,
            agGamecreditDenomination: agSetGameCreditDenomination,
            agGamecreditSupplier: '',
            agGamecreditSeller: userLoggedData.userid,
            agGamecreditCategory: agSetGameCreditCategory,
            agGamecreditDescription: agSetGameCreditDescription,
        };

        
        const test = JSON.stringify(formAddGamecreditsDetailsSeller)
        console.log(test);
    
        const formImageGCRData = new FormData();
        formImageGCRData.append('agGiftcardCover', imageGCR);
    
        try {
            // Sending game credit details
            const addGameCreditsResponse = await axios.post(AGAddGameCreditsAPI, formAddGamecreditsDetailsSeller);
            const responseMessage = addGameCreditsResponse.data;
    
            setFormResponse(responseMessage.message);
            console.log(responseMessage.message);
    
            if (responseMessage.success) {
                setImageGCR(null);
                setAGSetGameCreditTitle('');
                setAGSetGameCreditDenomination('');
                setAGSetGameCreditNumber('');
                setAGSetGameCreditType('');
                setAGSetGameCreditCategory('');
                setAGSetGameCreditDescription('');
            }
    
            // Sending game credit cover image
            // await axios.post(AGAddGameCreditCoverAPI, formImageGCRData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // });
    
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div className='mainContainer sellerPanel'>
            <section className="spPageContainer top">
                <div className="spPageContent top">
                    <div className="sppc top">
                        <div className="sppctViewNav">
                            <button className={activeView === 'default' ? 'activeNav': ''} onClick={handleViewNavigations}><h6>DASHBOARD</h6></button>
                            <button className={activeView === 'games' ? 'activeNav': ''} onClick={handleViewAddGames}><h6>ADD GAMES</h6></button>
                            <button className={activeView === 'giftcards' ? 'activeNav': ''} onClick={handleViewAddGiftcards}><h6>ADD GIFTCARDS</h6></button>
                            <button className={activeView === 'gamecredits' ? 'activeNav': ''} onClick={handleViewAddGamecredits}><h6>ADD GAME CREDITS</h6></button>
                            <button className={activeView === 'codes' ? 'activeNav': ''} onClick={handleViewAddCodes}><h6>ADD PRODUCT CODES</h6></button>
                            <button className={activeView === 'inventory' ? 'activeNav': ''} onClick={handleViewInventory}><h6>INVENTORY</h6></button>
                            <button className={activeView === 'tickets' ? 'activeNav': ''} onClick={handleViewTickets}><h6>TICKETS</h6></button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="spPageContainer mid">
                <div className="spPageContent mid1">
                    {activeView === 'default' && <div className="sppcm1Dashboard">
                        <h4>SELLER DASHBOARD</h4>
                        <div className="sppcm1dContainer">
                            <div className="sppcm1dContent left">
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
                                    <h6>LISTED GAME CREDITS</h6>
                                </div>
                            </div>
                            <div className="sppcm1dContent right">
                                <div>
                                    <h4>$ 0</h4>
                                    <span>
                                        <h6><RiArrowUpSFill className='faIcons'/> NA</h6>
                                        <p>TOTAL SALES</p>
                                    </span>
                                </div>
                                <div>
                                    <h4>$ 0</h4>
                                    <span>
                                        <h6><RiArrowUpSFill className='faIcons'/> NA</h6>
                                        <p>TOTAL PROFIT</p>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'games' && <div className="sppcm1AddGames">
                        <div className="sppcm1AddGameContainer">
                            <div className="sppcm1AGameContent left">
                                <h4>WELCOME SELLER!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new games, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="sppcm1AGamesCAll">
                                    <div>
                                        <h4>0 Games</h4>
                                        <p>Total Listed Games</p>
                                    </div>
                                    <div>
                                        <h4>0 Stocks</h4>
                                        <p>Total Game Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="sppcm1AGameContent right">
                                <form id='addGamesFormContainer' onSubmit={handleAddGame}>
                                    <h5>ADD GAMES FORM</h5>
                                    <div className='sppcm1agcForm'>
                                        <div className="sppcm1agcf left">
                                            <div className='sppc1agcfImage'>
                                                {image ? (
                                                    <img src={URL.createObjectURL(image)} alt="Selected Image" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputChange}/>
                                            </div>
                                        </div>
                                        <div className="sppcm1agcf right">
                                            <span>
                                                <label htmlFor=""><p>Game Title</p></label>
                                                <input type="text" placeholder='ex. Tetris' value={agSetGameTitle} onChange={(e) => setAGSetGameTitle(e.target.value)}  required/>
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
                                                :<input type="text" placeholder='Add Custom Edition' value={agSetGameEdition} onChange={(e) => setAGSetGameEdition(e.target.value)} />}
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
                                                <label htmlFor=""><p>Category</p></label>
                                                <select name="" id="" value={agSetGameCategory} onChange={(e) => setAGSetGameCategory(e.target.value)} required>
                                                    <option value="">Select Category</option>
                                                    <option value="New">New Release</option>
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
                                            <span>
                                                <label htmlFor=""><p>Available Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameAvailable} onChange={(e) => setAGSetGameAvailable(e.target.value)} placeholder='(Ex. JP, EG, VE)' required></textarea>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Restricted Country</p></label>
                                                <textarea name="" id="" maxLength={1000} value={agSetGameRestricted} onChange={(e) => setAGSetGameRestricted(e.target.value)} placeholder='(Ex. JP, EG, VE)' required></textarea>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="sppc1agcfOthers">
                                        <div className="sppc1agcfo right">
                                            <span>
                                                <label htmlFor=""><p>Game Trailer (YouTube Link)</p></label>
                                                <input type="text" placeholder='ex. https://www.youtube.com/watch?v=Mr8fVT_Ds4Q' value={agSetGameTrailer} onChange={(e) => setAGSetGameTrailer(e.target.value)} required/>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='gameSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="sppc1agcfSubmit">
                                        <button type='submit' name='addGames'>Add Game</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'giftcards' && <div className="admpcm1GiftCards">
                        <div className="admpcm1AddGiftCardContainer">
                            <div className="admpcm1AGiftCardContent left">
                                <h4>WELCOME SELLER!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new giftcards and vouchers, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="admpcm1AGiftcardsCAll">
                                    <div>
                                        <h4>0 Giftcards</h4>
                                        <p>Total Listed Giftcards</p>
                                    </div>
                                    <div>
                                        <h4>0 Stocks</h4>
                                        <p>Total Giftcards Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="admpcm1AGiftCardContent right">
                                <form id='addGiftCardFormContainer' onSubmit={handleAddGiftcard}>
                                    <h5>ADD GIFTCARDS/VOUCHER FORM</h5>
                                    <div className="admpcm1agcvForm">
                                        <div className="admpcm1agcvf left">
                                            <div className="admpc1agcvfImage">
                                                {imageGCV ? (
                                                    <img src={URL.createObjectURL(imageGCV)} alt="No image Selected" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputGCVChange}/>
                                            </div>
                                        </div>
                                        <div className="admpcm1agcvf right">
                                            <span>
                                                <label htmlFor=""><p>GiftCard/Voucher Name</p></label>
                                                <input type="text" placeholder='ex. AG Giftcard' required  value={agSetGiftCardTitle} onChange={(e) => setAGSetGiftCardTitle(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Valuation/Denomination ($)</p></label>
                                                <input type="number" placeholder='ex. 100' required value={agSetGiftCardDenomination} onChange={(e) => setAGSetGiftCardDenomination(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Category</p></label>
                                                <select name="" id="" value={agSetGiftCardCategory} onChange={(e) => setAGSetGiftCardCategory(e.target.value)}>
                                                    <option value="">Select Category</option>
                                                    <option value="Gaming">Gaming</option>
                                                    <option value="Utilities">Utilities</option>
                                                    <option value="Shopping">Shopping</option>
                                                    <option value="Cosmetics">Cosmetics</option>
                                                    <option value="Subscription">Subscription</option>
                                                    <option value="Foods and Groceries">Foods and Groceries</option>
                                                    <option value="Online Payment">Online Payment</option>
                                                    <option value="Crypto">Crypto</option>
                                                </select>
                                            </span>
                                            <span id='admpcm1agcvfDes'>
                                                <label htmlFor=""><p>Giftcard/Voucher Description</p></label>
                                                <textarea name="" id="" placeholder='Add Giftcard/Voucher Description here' value={agSetGiftCardDescription} onChange={(e) => setAGSetGiftCardDescription(e.target.value)}></textarea>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='giftcardSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="admpc1agcvfSubmit">
                                        <button type='submit' name='addGames'>Add Giftcards/Voucher</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>}
                    {activeView === 'gamecredits' && <div className="admpcm1GameCredits">
                        <div className="admpcm1AddGameCreditsContainer">
                            <div className="admpcm1AGameCreditsContent left">
                                <h4>WELCOME SELLER!</h4><br />
                                <p>
                                    Within this interface, you possess the capability to seamlessly add new game credits, 
                                    each detail meticulously recorded and securely stored within our database, ensuring 
                                    comprehensive management and accessibility.
                                </p>
                                <div className="admpcm1AGameCreditsCAll">
                                    <div>
                                        <h4>0 GCredits</h4>
                                        <p>Total Listed Game Credits</p>
                                    </div>
                                    <div>
                                        <h4>0 Stocks</h4>
                                        <p>Total Game Credits Stocks</p>
                                    </div>
                                </div>
                            </div>
                            <div className="admpcm1AGameCreditsContent right">
                                <form id='addGiftCardFormContainer' onSubmit={handleAddGamecredit}>
                                    <h5>ADD GAME CREDITS FORM</h5>
                                    <div className="admpcm1agcrForm">
                                        <div className="admpcm1agcrf left">
                                            <div className="admpc1agcrfImage">
                                                {imageGCR ? (
                                                    <img src={URL.createObjectURL(imageGCR)} alt="No image Selected" />
                                                ) : (
                                                    <img src={require('../assets/imgs/GameBanners/AddProductImageBanner.png')} alt="Default Image" />
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileInputGCRChange}/>
                                            </div>
                                        </div>
                                        <div className="admpcm1agcrf right">
                                            <span>
                                                <label htmlFor=""><p>Game Name</p></label>
                                                <input type="text" placeholder='ex. Roblox' required  value={agSetGameCreditTitle} onChange={(e) => setAGSetGameCreditTitle(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Valuation/Denomination ($)</p></label>
                                                <input type="number" placeholder='ex. 100' required value={agSetGameCreditDenomination} onChange={(e) => setAGSetGameCreditDenomination(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Number of Credits</p></label>
                                                <input type="number" placeholder='ex. 100'  value={agSetGameCreditNumber} onChange={(e) => setAGSetGameCreditNumber(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Type of Credit</p></label>
                                                <input type="text" placeholder='ex. Robux' required value={agSetGameCreditType} onChange={(e) => setAGSetGameCreditType(e.target.value)}/>
                                            </span>
                                            <span>
                                                <label htmlFor=""><p>Category</p></label>
                                                <select name="" id="" value={agSetGameCreditCategory} onChange={(e) => setAGSetGameCreditCategory(e.target.value)} required>
                                                    <option value="">Select Category</option>
                                                    <option value="Gaming">Gaming</option>
                                                    <option value="Utilities">Utilities</option>
                                                    <option value="Shopping">Shopping</option>
                                                    <option value="Crypto">Crypto</option>
                                                </select>
                                            </span>
                                            <span id='admpcm1agcrfDes'>
                                                <label htmlFor=""><p>Game Credit Description</p></label>
                                                <textarea name="" id="" placeholder='Add Game Credit Description here' value={agSetGameCreditDescription} onChange={(e) => setAGSetGameCreditDescription(e.target.value)}></textarea>
                                            </span>
                                        </div>
                                    </div>
                                    <span className='gamecreditSubmitStatus'>
                                        <p>{formResponse}</p>
                                    </span>
                                    <div className="admpc1agcrfSubmit">
                                        <button type='submit' name='addGames'>Add Game Credit</button>
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

export default SellerPanel