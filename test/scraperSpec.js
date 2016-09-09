/*
 *
 * Test for the spreadhseet scraper
 */


var expect = require('chai').expect;
var tags = require('../lib/scaper.js');

describe('Scraper', function() {
   describe('#sheets', function() {
      it('should get a list of all the sheets', function() {
         var args = [
            '../data/spreadsheets/za_fw_0.xlsx',
            '../data/spreadsheets/za_fw_0_nogrants.xlsx',
            '../data/spreadsheets/za_fw_1.xlsx',
            '../data/spreadsheets/za_fw_1_nogrants.xlsx',
            '../data/spreadsheets/za_up_0.xlsx',
            '../data/spreadsheets/za_up_0_nogrants.xlsx',
            '../data/spreadsheets/za_up_1.xlsx',
            '../data/spreadsheets/za_up_1_nogrants.xlsx',
            '../data/spreadsheets/za1xx_0.xlsx',
            '../data/spreadsheets/za1xx_0_nogrants.xlsx',
            '../data/spreadsheets/za1xx_1.xlsx',
            '../data/spreadsheets/za1xx_1_nogrants.xlsx',
            '../data/spreadsheets/za2xx_0.xlsx',
            '../data/spreadsheets/za2xx_0_nogrants.xlsx',
            '../data/spreadsheets/za2xx_1.xlsx',
            '../data/spreadsheets/za2xx_1_nogrants.xlsx',
            '../data/spreadsheets/za3xx_0.xlsx',
            '../data/spreadsheets/za3xx_0_nogrants.xlsx',
            '../data/spreadsheets/za3xx_1.xlsx',
            '../data/spreadsheets/za3xx_1_nogrants.xlsx'
         ]

      });
   });
});
