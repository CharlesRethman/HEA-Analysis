#!/usr/bin/env node

/*
 * @file_name: index.js
 *
 */

// require local modules: connect to db, spreadsheet scraper
var PG = require('./pgConnector'), Scraper = require('./scraper');


// call module for connecting to db

/*
 * Callers for getting user inputs for connecting to the database. Upon entry of credentials, the
 * `connectDB` function is called with the a client object for connecting to the database. No
 * authentication/authorisation at this stage.
 *
 */
// Get the DB user name
pg = new PG.PgConnector;
pg.ask('\nYou may need account credentials to connect to Postgres. However, if this is not\nthe case, you can ignore the login role or the password below by just pressing\nENTER on each.\n\nPostgres user name', /.+|\s/, function(cancel, user_name) {
   if (!cancel) {
      // Get the DB password
      pg.getPassword('Postgres password', function(cancel, password) {
         // pass the user name and password as a connection string onto Postgres in the main data
         // processing function
         if (!cancel) {
            var client = pg.client('postgres://' + user_name + ':' + password + '@localhost:5432/albers_ea');
            // Go through to slecting the month and year of analysis
            pg.connectDB(client);
         }
      });
   }
});
