const axios = require('axios');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const apiKey = '';
  axios.defaults.headers.post['Authorization'] = 'Bearer ' + apiKey;
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  var message = {
    personalizations: [{ to: [{ email: 'contactskaremano@gmail.com' }] }],
    from: { email: 'matmarcoux@gmail.com' },
    subject: 'Azure news',
    content: [
      {
        type: 'text/plain',
        value: 'testx',
      },
    ],
  };

  const sendGridUrl = 'https://api.sendgrid.com/v3/mail/send';

  try {
    const { data } = await axios.post(sendGridUrl, message);

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: 'Success',
    };
  } catch (err) {
    context.log(err);
    context.res = {
      status: 400,
      body: 'Please pass a name on the query string or in the request body',
    };
  }
};
