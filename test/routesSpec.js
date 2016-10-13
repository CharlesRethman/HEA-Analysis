/*
 *
 * Test for the server index.js
 */

var expect = require('chai').expect,
   index = require('../routes/index'),
   uploads = require('../routes/uploads')

describe('Routes', function() {
   describe('Index', function() {
      it('should conduct a match for code on the database lz_code field', function() {
         
         it('should conduct a match for abbreviation on the database lz_abbrev field', function() {

            it('should conduct a full text search on the database lz_name field', function() {

            });
         });
      });
   });
});
