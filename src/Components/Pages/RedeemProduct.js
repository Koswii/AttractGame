import React, { useState, useEffect } from 'react'
import "../CSS/redeemProduct.css";




const RedeemProduct = () => {
  return (
    <div className='mainContainer redeemProduct'>
        <section className="redeemPageContainer top">
            <div className="redeemPageContent top1">
                <h5>REDEEEM A CODE</h5>
                <p>Insert product code here.</p>
                <input type="text" placeholder='*************'/>
                <div className='rpct1Img'>
                    <div className="rpct1ImgShadow"></div>
                    <img src={require('../assets/imgs/GameBanners/DefaultNoBanner.png')} alt="" />
                    <button>REDEEM</button>
                </div>
                <p id='rpcr1Disclaimer'>Disclaimer:<br /> Once redeemed, Product cannot be sold to AG Marketplace</p>
            </div>
        </section>
    </div>
  )
}

export default RedeemProduct