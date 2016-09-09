/*
 *
 * Test for the spreadhseet scraper
 */


var expect = require('chai').expect;
var scraper = require('../lib/scaper.js');

describe('Scraper', function() {
   describe('#check', function() {
      it('should get a list of all the sheets', function() {
         this.timeout(3000);
         var sheets = [
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
         ];
         scaper.check(sheets, function(err, sheetlist) {
            
         });

         expect(results).to.have.a.property()

      });
   });
});
