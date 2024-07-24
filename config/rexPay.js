
const axios = require('axios');

const username = process.env.REXPAY_USERNAME;
const password = process.env.REXPAY_PASSWORD;

async function createPayment(paymentDetails) {
  const url = process.env.REXPAY_TEST_API_URL + '/api/pgs/payment/v2/createPayment';


  try {
    const response = await axios.post(url, paymentDetails, {
      auth: {
        username: username,
        password: password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { createPayment };