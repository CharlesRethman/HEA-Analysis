#!/usr/bin/env node

/**
 * @file_name: scraper.js
 * @dependency xlsx v 0.8.x. Library for reading Excel spreadsheets synchronously (and
 * asynchronously?). Available from NPM
 * @dependency fs . Library for reading files synchronously or asynchronously (async used here).
 * Built into Node.JS 4.2.x
 *
 */


const XLSX = require('xlsx')
const fs = require('fs');



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
function loadTable(pgClient, ofa, deleteOnly) {
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
         fs.readFile("./config_blines.json", function(err, blinesData) {
            if (err) {
                  console.log("LZ and spreadsheet config file missing or corrupt.");
                  return;
            }
            // Success. Read the config file for thresholds
            fs.readFile("./config_pspecs.json", function(err, pSpecsData) {
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
}


/*
 * Read all the spreadsheet values and load them into an object, as well as creating an SQL INSERT
 * values query string for loading the spreadsheet outputs into a Postgres table.
 *
 * @param sqlString {string} Required. First part of SQL string to which the results from the
 * spreadsheet reads are appended in correct syntax and returned.
 * @param ofa {Array} Required. Two elements with numbers representing month ofa[0] ('1' = January)
 * and year ofa[1].
 *
 */
function readSpreadSheets(sqlString, lzAbbrevs, deficits, ofa) {
   console.log('Reading spreadsheets...');
         // Object with the LZ affectedness groupings.
         var lzAffected = {
            normal : {
               code : 0,
               ext : "_0"
            },
            drought : {
               code: 1,
               ext : "_1"
            }
         };
      // Object with the wealth group affectedness groupings.
      var wgAffected = {
         grants : "",
         noGrants : "_nogrants"
      }

      // Variable for storing outcomes
      var outcome = {};
      //'name' is the LZ abbrev name in the spreadsheet file name, 'code' is the LZ code (for the DB table), 'wgs' array contains objects with worksheet numbers (in the spreadsheet) and WG IDs from tbl_wgs in each LZ analysis.
      for (var i = 0; i < lzAbbrevs.length; i++) {
         for (var subLz in lzAffected) {
            for (var subWG in wgAffected) {
               // Get the workbook
               var workbook = XLSX.readFile('./spreadsheets/' + lzAbbrevs[i].name + lzAffected[subLz].ext + wgAffected[subWG] + '.xlsx');
               process.stdout.write('./spreadsheets/' + lzAbbrevs[i].name + lzAffected[subLz].ext +
               wgAffected[subWG] + '.xlsx\n');
               // Get the worksheet and assign it to a variable
               for (var j = 0; j < lzAbbrevs[i].wgs.length; j++) {
                  var sheet_name = workbook.SheetNames[lzAbbrevs[i].wgs[j].sheet];
                  var worksheet = workbook.Sheets[sheet_name];
                  //reset the outcome object
                  outcome = {};
                  // Find desired cell
                  for (var thres in deficits) {
                     var desired_cell = worksheet[deficits[thres].cell];
                     // Get the value
                     var desired_value = desired_cell.v;
                     if (thres === 'food') {
                        outcome[thres] = Math.round(desired_value * 100, 0) + '%';
                     } else {
                        outcome[thres] = Math.round(desired_value, 0);
                     };

                     sqlString += '(' + ofa[1] + ', ' + ofa[0] + ', ' + lzAbbrevs[i].code + ', ' + (lzAbbrevs[i].wgs[j].wg) + ', \u0027' + subLz + '\u0027, \u0027' + subWG + '\u0027, \u0027' + deficits[thres].descr + '\u0027, ' + desired_value + '),\n';
                  }
               }
            }
         }
      }
      // Query SQL string for inserting data into zaf.tbl_ofa_analysis postgres table
      sqlString = sqlString.substring(0, sqlString.length - 2) + '\n;';
      return sqlString
}
