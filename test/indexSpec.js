/*
 *
 * Test for the spreadhseet scraper
 */

var expect = require('chai').expect,
   webdriver = require('selenium-webdriver'),
   test = require('selenium-webdriver/testing')


test.describe('Index', function() {
   this.timeout(15000);
   var driver;

   test.before(() => {
      driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
   });

   test.it('should open the browser', function() {
      driver.get('http://localhost:3000');
//      driver.wait(function() {
//      }, 3000);
   });

   test.it('should retrieve the heading', function() {
      driver.findElement(webdriver.By.tagName('h1')).getText().then(function(text) {
//         console.log('Text is:', text);
         expect(text).to.equal('HEA Analysis Spreadsheet loader');
      });
   });

   test.it('should have a single-line text input box', function() {
      driver.findElement(webdriver.By.name('pathToFile').sendKeys('/Users/Charles/Documents/hea_analysis/south_africa/2016.04/spreadsheets/za2xx_0.xlsx');
   })

   test.it('should a have a submit button', function() {
      driver.findElement(webdriver.By.name('loadFile').)
   })

   test.after(function() {
      driver.quit();
   });
});
