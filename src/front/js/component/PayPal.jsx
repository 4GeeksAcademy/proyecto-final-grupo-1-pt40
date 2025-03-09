import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';


const PayPalButton = () => {
  const initialOptions = {
    "client-id": process.env.PAYPAL_CLIENT_ID,
    "buyer-country": "US",
    currency: "USD",
    components: "buttons",
  };

  const [message, setMessage] = useState("");
  const [order, setOrder] = useState('')
  const backendUrl = process.env.BACKEND_URL

  const createOrder = async () => {
    try {
      const response = await fetch(`${backendUrl}api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: [
            {
              id: "ALPUNTO25",
              quantity: "1",
            },
          ],
        }),
      });

      const orderData = await response.json();

      if (orderData.order_id) {
        setOrder(orderData.order_id)
        return orderData.token;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout...${error}`);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await fetch(`${backendUrl}api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({'orderID':order})
      });

      const orderData = await response.json();
      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        return actions.restart();
      } else if (errorDetail) {
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        const transaction = orderData;
        setMessage('PAGO EXITOSO')
        console.log("Capture result",JSON.stringify(orderData, null, 2));
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  return (
    <div className="paypal-button-container">
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
      <div>{message}</div>
    </div>
  );
};

export default PayPalButton;
