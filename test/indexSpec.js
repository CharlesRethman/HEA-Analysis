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

   test.it('should open the browser', () => {
      driver.get('http://localhost:3000');
//      driver.wait(function() {
//      }, 3000);
   });

   test.it('should retrieve the heading', () => {
      driver.findElement(webdriver.By.tagName('h1')).getText().then(function(text) {
//         console.log('Text is:', text);
         expect(text).to.equal('It worked!');
      });
   });

   test.after(() => {
      driver.quit();
   });
});
