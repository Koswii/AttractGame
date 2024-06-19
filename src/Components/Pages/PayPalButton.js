import React from 'react';
import { PayPalScriptProvider, PayPalButtons, PayPalNameField, PayPalCardFieldsForm } from '@paypal/react-paypal-js';


const PayPalButton = ({totalprice}) => {
  const paypalOptions = {
    'client-id': 'ARy8eFogQ46HyArkMEtHNv-IzveFDuW-SbRBHPyyIrDavCkGPR2YzhrWVLnoVfGmf-h0HtjjW_kK4Iif', // Replace with your own PayPal client ID
    currency: 'USD',
    intent: "capture",
    'disable-funding': 'card' 
  };

  console.log(totalprice);
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalprice.toFixed(2) // Sample amount
          }
        }
      ]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function(details) {
      alert('Transaction completed by ' + details.payer.name.given_name);
      // Call your backend to save the transaction
    });
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtons 
        createOrder={createOrder} 
        onApprove={onApprove}
        includeVenmo={true}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
