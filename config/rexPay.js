const axios = require('axios');

const username = process.env.REXPAY_USERNAME; // Your email
const password = process.env.REXPAY_PASSWORD; // Your secret key

async function createPayment(paymentDetails) {
  const url = process.env.REXPAY_TEST_API_URL + '/api/pgs/payment/v2/createPayment';

  // Encoding the username and password as Base64
  const authString = Buffer.from(`${username}:${password}`).toString('base64');

  console.log('Username:', username);  // Debugging
  console.log('Password:', password);  // Debugging
  console.log(`Authorization: Basic ${authString}`); // Debugging

  try {
    const response = await axios.post(url, paymentDetails, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`, // Adding the Authorization header
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { createPayment };
