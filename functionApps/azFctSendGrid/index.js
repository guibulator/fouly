const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');
const axios = require('axios');

const vaultName = 'fouly-dev-kv';
const secretName = 'sendGridApiKey';

module.exports = async function(context, req) {
  context.log('Start azure function.');

  const receivedMsg = context.req.body;
  context.log('receivedMsg : ' + JSON.stringify(receivedMsg));

  const credential = new DefaultAzureCredential();
  const url = `https://${vaultName}.vault.azure.net`;

  const client = new SecretClient(url, credential);
  const secret = await client.getSecret(secretName);
  context.log('Got azure secret.');

  axios.defaults.headers.post['Authorization'] = 'Bearer ' + secret.value;
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  var message = {
    personalizations: [{ to: [{ email: 'contactskaremano@gmail.com' }] }],
    from: { email: 'contactskaremano@gmail.com' },
    subject: receivedMsg.subject,
    content: [
      {
        type: 'text/plain',
        value: receivedMsg.detail
      }
    ]
  };
  const sendGridUrl = 'https://api.sendgrid.com/v3/mail/send';
  try {
    await axios.post(sendGridUrl, message);
    context.res = {
      body: 'Success'
    };
  } catch (err) {
    context.log(err);
    context.res = {
      status: 400,
      body: 'Error'
    };
  }
};
