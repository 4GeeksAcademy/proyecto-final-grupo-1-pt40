import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';


const PayPal = () => {
  const initialOptions = {
    "client-id": process.env.PAYPAL_CLIENT_ID,
    "buyer-country": "US",
    currency: "USD",
    components: "buttons",
  };

  const { store, actions } = useContext(Context);
  const [plan, setPlan] = useState(false)

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
      setMessage(`Fallo inicio de orden`);
    }
  };

  const onApprove = async (data, task) => {
    try {
      const response = await fetch(`${backendUrl}api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 'orderID': order })
      });

      const orderData = await response.json();
      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        return task.restart();
      } else if (errorDetail) {
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        const transaction = orderData;
        setMessage('Pago exitoso')
        setPlan(true)
        const payment = await actions.premiumPlan()
        if (payment) {
          const response = await actions.getRestaurantDetails()
        }
      }
    } catch (error) {
      console.error(error);
      setMessage(`Tu pago no pudo ser completado`);
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
          onApprove={onApprove} disabled={plan}
        />
      </PayPalScriptProvider>
      <div>{message}</div>
    </div>
  );
};

export default PayPal;
