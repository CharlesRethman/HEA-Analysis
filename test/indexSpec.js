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

   test.before(function() {
      driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
   });

   test.it('should work', function() {
      driver.get('http://localhost:8000');
//      driver.wait(function() {
//      }, 3000);
   });

   test.it('should retrieve the heading', function() {
      driver.findElement(webdriver.By.tagName('h1')).getText().then(function(text) {
//         console.log('Text is:', text);
         expect(text).to.equal('It worked!');
      });
   });

   test.after(function() {
      driver.quit();
   });
});
