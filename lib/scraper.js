#!/usr/bin/env node

/**
 * @file_name: scraper.js
 * @dependency xlsx v 0.8.x. Library for reading Excel spreadsheets synchronously (and
 * asynchronously?). Available from NPM
 * @dependency fs . Library for reading files synchronously or asynchronously (async used here).
 * Built into Node.JS 4.2.x
 *
 */


const XLSX = require('xlsx');
const fs = require('fs');

Scrape = function(){
};

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
Scrape.prototype.readSpreadSheets = function (sqlString, lzAbbrevs, deficits, ofa) {
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
};

//Exports
exports.Scrape = Scrape;
