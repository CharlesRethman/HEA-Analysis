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
               pg.queryAnalyses(pgClient);
               // Get the month and year of the analysis
               std.ask('Which month and year of analysis do you want to assign to these spreadsheets?\nType it in as numbers representing M-YYYY (e.g. 9-2013 or 11-2015) ', /\d{1,2}-\d{4}/, function(cancel, analysisMonth) {
                  if (!cancel) {
                     var d = new Date(), check = false, deleteOnly = false;
                     var ofa = analysisMonth.split('-');
                     // Force to current month and year if supplied values are out of range
                     if (ofa[0] * 1 > 12) ofa[0]= 12;
                     if (ofa[0] * 1 < 1) ofa[0] = 1;
                     if (new Date(ofa[1], ofa[0]-1, 1) > d || ofa[1] * 1 < 1980 ) {
                        ofa[0] = d.getMonth() + 1;
                        ofa[1] = d.getFullYear();
                        console.log('Analysis reset to ' + ofa[0] + '-' + ofa[1] + '; it cannot be ahead of time or before 1980.');
                     }
                     for (i = 0; i < result.rowCount; i++) {
                        if (ofa[0] == result.rows[i].ofa_month && ofa[1] == result.rows[i].ofa_year) {
                           var check = true;
                           break;
                        }
                     }
                     if (check) {
                        std.ask('This analysis already exists. Delete only (yes - just delete / no - delete and\nreinsert data)?', /.+/, function(cancel, justDel) {
                           if (!cancel) {
                              if (justDel.toUpperCase() == 'Y' || justDel.toUpperCase() == 'YES') deleteOnly = true
                              std.ask('Are you REALLY sure you want to delete all your previous data for ' + months[ofa[0] - 1] + ' ' + ofa[1] + '\n(yes - proceed / no - quit before affecting anything)?', /.+/, function(cancel, confirm) {
                                 if (!cancel) {
                                    if (confirm.toUpperCase() == 'Y' || confirm.toUpperCase() == 'YES') {
                                       // Call the loadTable function
                                       pg.loadTable(pgClient, ofa, deleteOnly);
                                    } else {
                                       pg.pgClient.end();
                                       process.exit();
                                    }
                                 }
                              });
                           }
                        });
                     } else {
                        pg.loadTable(pgClient, ofa, false);
                     }
                  }
               });
            });
         };
      });
   }
});
