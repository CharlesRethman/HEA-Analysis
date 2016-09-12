/*
 *
 * Test for the spreadhseet scraper
 */

var chai = require('chai'), expect = chai.expect;
//var chai.use = require('chai-as-promised');
var webdriver = require('selenium-webdriver');

function enterBox(driver) {
   var pathBox = driver.findElement(webdriver.By.name('path'));
   pathBox.sendKeys(process.env.PWD + '/data/spreadsheets/');
   return pathBox.getAttribute('value');
}


describe('Index', function() {
   it('should work', function() {
      this.timeout(10000);
      var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
      driver.get('http://localhost:3000');
      expect(driver.getTitle()).to.equal('Spreadsheet Analyser');
      expect(driver.findElement(webdriver.By.name('btn')).getAttribute('text')).to.equal('Browse...')
      expect(enterBox(driver)).to.equal(process.env.PWD + '/data/spreadsheets');

//      driver.quit();
   });
});
