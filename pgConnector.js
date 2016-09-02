#!/usr/bin/env node

/*
 * @file_name: pg_connector.js
 *
 */


var pg = require('pg');
const fs = require('fs');

PgConnector = function(db) {
   this.db = db
};

/*
 * Connects to the DB and selects which analysis (month, year) the user wants load into it.
 *
 * @param pgClient {Object}. Required. Postgres client object with connection string credentials in
 * it must be passed.
 *
 */
PgConnector.prototype.connectDB = function(pgClient) {
   // Connect the client to the database
   pgClient.connect(function(err) {
      if(err) {
         return console.error('could not connect to postgres:\n', err);
      }
      // Query the database to find out how many analyses have been done before
      pgClient.query('SELECT ofa_month, ofa_year, count(*) AS result FROM zaf.tbl_ofa_analysis GROUP BY ofa_year, ofa_month ORDER BY ofa_year, ofa_month;', function(err, result) {
         if(err) {
            return console.error('error retrieving analyses', err);
         }
         // Success
         // Array to hold the names of months: name = months[n -1], where n is the month number (0-12)
         var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
         // print out the table headers
         console.log('\nYour existing analysis are:');
         console.log('OFA Month     | OFA Year |   results\n--------------+----------+-----------');
         // print out the results, nicely formatted with padding to line up the columns
         for (i = 0; i < result.rowCount; i++) {
            // padding on first column
            var pad_month = '';
            // padding on second column
            var pad_result = '';
            // first (month) column: subtract the length of the month name from 8 + the length of the month number (1:1 to 10 or 2:10 to 12) and add that number of spaces to the pad
            for (j = 0; j < 8 + (result.rows[i].ofa_month < 10 ? 1 : 0 ) - (months[result.rows[i].ofa_month - 1]).length; j++) pad_month+= ' ';
            // third (results) column: subtract the length og the number from 10 and add that number of spaces to the pad
            for (j = 0; j < 10 - (' ' + result.rows[i].result).length; j++) pad_result += ' ';
            // print out the results
            console.log(result.rows[i].ofa_month + ' (' + months[result.rows[i].ofa_month - 1] + ')' + pad_month + ' |     ' + result.rows[i].ofa_year + ' | ' + pad_result + result.rows[i].result);
         }
         // print out the footer
         console.log('--------------+----------+-----------');
         // Get the month and year of the analysis
         ask('Which month and year of analysis do you want to assign to these spreadsheets?\nType it in as numbers representing M-YYYY (e.g. 9-2013 or 11-2015) ', /\d{1,2}-\d{4}/, function(cancel, analysisMonth) {
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
                  ask('This analysis already exists. Delete only (yes - just delete / no - delete and\nreinsert data)?', /.+/, function(cancel, justDel) {
                     if (!cancel) {
                        if (justDel.toUpperCase() == 'Y' || justDel.toUpperCase() == 'YES') deleteOnly = true
                        ask('Are you REALLY sure you want to delete all your previous data for ' + months[ofa[0] - 1] + ' ' + ofa[1] + '\n(yes - proceed / no - quit before affecting anything)?', /.+/, function(cancel, confirm) {
                           if (!cancel) {
                              if (confirm.toUpperCase() == 'Y' || confirm.toUpperCase() == 'YES') {
                                 // Call the loadTable function
                                 loadTable(pgClient, ofa, deleteOnly);
                              } else {
                                 pgClient.end();
                                 process.exit();
                              }
                           }
                        });
                     }
                  });
               } else {
                  loadTable(pgClient, ofa, false);
               }
            }
         });
      });
   });
};


/*
 * Deletes previous record for the same analysis date and uploads the current analysis results
 * collected from the spreadsheets.
 *
 * @param pgClient {Object}. Required. Postgres client connection object must be passed.
 * @param ofa {Array} Required. Two elements with numbers representing month ofa[0] ('1' = January)
 * and year ofa[1].
 * @param deleteOnly {Boolean}. Optional. TRUE when data for analysis are deleted but not reinserted.
 * Default FALSE.
 *
 */
PgConnector.prototype.loadTable = function(pgClient, ofa, deleteOnly) {
   // Query to first delete existing data in zaf.tbl_ofa_analysis for the desired month and year
   pgClient.query('DELETE FROM zaf.tbl_ofa_analysis WHERE ofa_year = ' + ofa[1] + ' AND ofa_month = ' + ofa[0] + ';', function(err, result) {
      if(err) {
         return console.error('error running DELETE query', err);
      }
      // Success. Output is something like DELETE: 1168 rows affected
      console.log(result.command + ': ' + result.rowCount + ' rows affected');
      // Query to insert the new data using the SQL string above
      if (!deleteOnly) {
         // Create the INSERT SQL String
         var sqlString = 'INSERT INTO zaf.tbl_ofa_analysis (ofa_year, ofa_month, lz_code, wg_code, ' + 'lz_affected, wg_affected, threshold, deficit) VALUES \n';
         // Read the config files containing info on analysis spreadsheets and deficits.
         // Read the config file for the spreadsheet structure
         fs.readFile("./config_spreadsheets.json", function(err, sSheetData) {
            if (err) {
                  console.log("LZ and spreadsheet config file missing or corrupt.");
                  return;
            }
            // Success. Read the config file for thresholds
            fs.readFile("./config_deficits.json", function(err, deficitsData) {
               if (err) {
                  console.log("Deficits config file missing or corrupt.");
                  return
               }
               // Success. Parse the files and pass (sic!) them on to the readSpreadSheets function
               sqlString = readSpreadSheets(sqlString, JSON.parse(sSheetData.toString()), JSON.parse(deficitsData.toString()), ofa);
               pgClient.query(sqlString, function(err, result) {
                  if(err) {
                     return console.error('error running INSERT query', err);
                  }
                  // Success. Output is something like INSERT: 1168 rows affected
                  console.log(result.command + ': ' + result.rowCount + ' rows affected');
                  getDbTime(pgClient);
               });
            });
         });
      } else {
         getDbTime(pgClient);
      }
   });
};


/*
 * Get the database time. Simple routine to throw out the time on the Database when the update
 * (INSERT or DELETE) is finished.
 *
 * @param pgClient {Object}. Required. Postgres client connection object must be passed.
 *
 */
PgConnector.prototype.getDbTime = function(pgClient) {
  // Query to get a time stamp from the DB(!) for the succesful completion of the work
  pgClient.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    // Success. Output is something like Tue Jun 21 2016 10:12:47 GMT+0200 (SAST)
    console.log(result.rows[0].theTime);
    // end client session*/
    pgClient.end();
    process.exit();
    });

};

PgConnector.prototype.client = function(connString) {
   return new pg.Client(connString);
};



exports.PgConnector = PgConnector;
