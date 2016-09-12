/*
 *
 * Test for the spreadhseet scraper
 */


var expect = require('chai').expect;
var webdriver = require('selenium-WebDriver'), By = webdriver.By, until = webdriver.until;


describe('Index', function() {
   it('should start the http server and load a box with a label and a browse button', function(){
      this.timeout(3000);
      var driver = new webdriver.Builder().forBrowser('firefox').buid();
      driver.get('http://localhost:3000');

      console.log(driver.findElement(By.name('lblLoad')));
      driver.findElement(By.name('lblLoad'), function(err, text) {
         expect(text).to.equal('Choose your spreadsheet or folder of spreadsheets')
      });
      driver.quit();
   });
});
