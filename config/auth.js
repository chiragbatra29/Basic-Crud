module.exports = {
  "facebookAuth": {
    "clientID": '300074660408203',
    "clientSecret": 'a982a58917b6efc236853f752bc0b251',
    "callbackURL": 'http://localhost:3000/api/auth/facebook/callback',
    "profileFields": ['id', 'displayName', 'emails']
  },
  "twitterAuth": {
    "consumerKey": 'wJ8BwF2BQoe6SnEv2aR7um2ql',
    "consumerSecret": 'FlGXszYaGcLGKTaY2c2rENDsa6RQpxW4GUN7J8kKXGT8eay9GU',
    "callbackURL": "http://127.0.0.1:3000/api/auth/twitter/callback",
    "profileFields": ['id', 'displayName', 'emails']
  },
  "googleAuth": {
    "clientID": '707783440126-ks0ue1emjhp24bpnqsautog2ndumj20k.apps.googleusercontent.com',
    "clientSecret": 'gFd0_pCwfr7P0a0WkS6nc3ZH',
    "callbackURL": "http://localhost:3000/api/auth/google/callback",
    "profileFields": ['id', 'displayName', 'emails']
  }
}
