/*
 *
 * Test for the spreadhseet scraper
 */

var chai = require('chai'), expect = chai.expect;
//var chai.use = require('chai-as-promised');
var webdriver = require('selenium-webdriver');


describe('Index', function() {
   it('should work', function() {
      this.timeout(10000);
      var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
      driver.get('http://localhost:3000', function() {
         expect(this.getTitle()).to.equal('Spreadsheet Analyser');
         var pathBox = this.findElement(webdriver.By.name('path'));
         pathBox.sendKeys(process.env.PWD + '/data/spreadsheets/');
         pathBox.getAttribute('value').then(function(value) {
            expect(value).to.equal(process.env.PWD + '/data/spreadsheets');
         });
      });

//      driver.quit();
   });
});
