/*
 *
 * Test for the server index.js
 */

var expect = require('chai').expect,
   webdriver = require('selenium-webdriver'),
   test = require('selenium-webdriver/testing');


test.describe('Tests made on www, app.js and uploadFiles.jade files', function() {

   this.timeout(15000);
   var driver,
      txtBox,
      path = '/Users/Charles/Documents/hea_analysis/south_africa/2016.04/spreadsheets/za2xx_1.xlsx'

   // Set up webdriver (using Chrome) and start the browser
   test.before(() => {
      driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
   });

   // Test 1
   test.it('should open the browser and retrieve the title and heading', function() {
      driver.get('http://localhost:3000');
      driver.getTitle().then(function(title) {
         expect(title).to.contain('Load Spreadsheet')
      });
      driver.findElement(webdriver.By.tagName('h1')).getText().then(function(text) {
         expect(text).to.contain('HEA Analysis Spreadsheet Loader');
      });
   });

   // Test 2
   test.it('should navigate to the upload files URL and load elements', function() {
      driver.get('http://localhost:3000/uploads');
      driver.getTitle().then(function(title) {
         expect(title).to.contain('Load Spreadsheet')
      });
      driver.findElement(webdriver.By.tagName('h1')).getText().then(function(text) {
         expect(text).to.contain('HEA Analysis Spreadsheet Loader');
      });
   });

   // Test 3
   test.it('should have a drop-down saying \'Country for your analysis...\'', function() {
      driver.findElement(webdriver.By.id('chooseCountry')).getAttribute('placeholder').then(function(text) {
         expect(text).to.contain('Country for your analysis');
      });
   });

   // Test 4
   test.it('should have a label saying \'Browse for the folder or spreadsheet file\'', function() {
      driver.findElement(webdriver.By.id('labelChooseFile')).getText().then(function(text) {
         expect(text).to.contain('Browse for the folder or spreadsheet file');
      });
   });

   // Test 5
   test.it('should have a \'Choose file\' button', function() {
      chooseFile = driver.findElement(webdriver.By.id('buttonChooseFile'));
      chooseFile.getAttribute('accept').then(function(text) {
         var arr = text.split(',');
         arr = arr.sort();
         expect(arr).to.deep.equal(['.xls','.xlsx']);
      });
      chooseFile.sendKeys(path).then(function() {
         chooseFile.getAttribute('value').then(function(text) {
            text = text.slice(text.lastIndexOf('\\') + 1);
            var file = path.slice(path.lastIndexOf('/') + 1);
            expect(text).to.equal(file);
         });
      });
//      expect(txtBox.getAttribute('value')).to.equal(text);
   });

   // Test 6
   test.it('should have a single-line text input box, size 60, with \'/enter/the/path/to/your/folder/or/file.xlsx\' shown in it', function() {
      txtBox = driver.findElement(webdriver.By.id('txtPathFile'));
      txtBox.getAttribute('placeholder').then(function(text) {
         expect(text).to.contain('/enter/the/path/to/your/folder/or/file.xlsx');
      });
      txtBox.getAttribute('size').then(function(value) {
         expect(value).to.equal("60");
      });
//      txtBox.sendKeys(path);
   });

   // Test 7
   test.it('should have a button with the value \'Upload\'', function() {
      var uploadFile = driver.findElement(webdriver.By.id('submit'))
      uploadFile.getAttribute('value').then(function(text) {
         expect(text).to.equal('Upload');
      });
      uploadFile.click();
      driver.wait(function() {
         return driver.getPageSource().then(function(text) {
            return expect(text).to.contain('File uploaded successfully, processing spreadsheet');
         });
      }, 3000);
   });

   // Shut down the browser
   test.after(function() {
      driver.quit();
   });
});
