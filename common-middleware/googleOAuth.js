const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  "588273200979-d1e9fqubp0ncbh5ltg84igidvqastg8t.apps.googleusercontent.com",
  "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",
  /**
   * To get access_token and refresh_token in server side,
   * the data for redirect_uri should be postmessage.
   * postmessage is magic value for redirect_uri to get credentials without actual redirect uri.
   */
  'postmessage'
);

exports.getProfileInfo = async (code) => {
  const r = await client.getToken(code);
  const idToken = r.tokens.id_token;

  const ticket = await client.verifyIdToken({
    idToken,
    audience: "588273200979-d1e9fqubp0ncbh5ltg84igidvqastg8t.apps.googleusercontent.com",
  });

  const payload = ticket.getPayload();

  return payload;
};


