var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const cookieSession = require("cookie-session");

FIND_USER_ID_BY_GOOGLE_ID = `
  SELECT id
  FROM public."User"
  WHERE google_id = $1;
`

FIND_USER_BY_ID = `
  SELECT id, name
  FROM public."User"
  WHERE id = $1;
`

CREATE_GOOGLE_USER = `
  INSERT INTO public."User"
  (google_id, name)
  VALUES ($1, $2);
`

function setupAuthentication(app, client) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
      const googleId = profile.id
      const displayName = profile.displayName

      const userQueryResult = await client.query(FIND_USER_ID_BY_GOOGLE_ID, [googleId])
      let user = null
      if (userQueryResult.rows.length > 0) {
        userId = userQueryResult.rows[0].id
      }
      else {
        const createUserResult = await client.query(CREATE_GOOGLE_USER, [googleId, displayName])
        userId = createUserResult.rows[0].id
      }
      done(null, userId)
    }
  ));

  app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys:[process.env.COOKIE_KEY]
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(userId, done) {
    console.log('Serializing userId: ', userId)
    done(null, userId);
  });

  passport.deserializeUser(async function(userId, done) {
    console.log('Deserializing userId: ', userId)
    const userQueryResult = await client.query(FIND_USER_BY_ID, [userId])
    if (userQueryResult.rows.length < 0) {
      done(null, false, {message: 'Unknown user'})
    }

    user = userQueryResult.rows[0]
    done(null, user);
  });

  app.get('/auth/google',
    passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    }
  );
}

module.exports = {
  setupAuthentication
}
