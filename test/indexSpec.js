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
      driver.get('http://localhost:3000');

   });

   test.after(function() {
      driver.quit();
   });
});
