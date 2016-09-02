#!/usr/bin/env node

/*
 * @file_name: index.js
 *
 */

// require local modules: connect to db, spreadsheet scraper
var Pg = require('./pgConnector'), Std = require('./stdInOut');


// call module for connecting to db

/*
 * Callers for getting user inputs for connecting to the database. Upon entry of credentials, the
 * `connectDB` function is called with the a client object for connecting to the database. No
 * authentication/authorisation at this stage.
 *
 */
// Get the DB user name
pg = new Pg.PgConnector;
std = new Std.StdInOut;
std.ask('\nYou may need account credentials and to connect to Postgres. However, if this is not\nthe case, you can ignore the login role or the password below by just pressing\nENTER on each. The default database is \'postgres\'.\n\nPostgres user name', /.+|\s/, function(cancel, user_name) {
   if (!cancel) {
      // Get the DB password
      std.getPassword('Password', function(cancel, password) {
         // pass the user name and password as a connection string onto Postgres in the main data
         // processing function
         if (!cancel) {
            std.ask('Database', /.+|\s/, function(cancel, db_name) {
               var client = pg.client('postgres://' + user_name + ':' + password + '@localhost:5432/' + (db_name === '' ? 'postgres' : db_name));
               // Go through to slecting the month and year of analysis
               pg.connectDB(client);
            });
         };
      });
   }
});
