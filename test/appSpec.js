/*
 *
 * Test for the server index.js
 */

var expect = require('chai').expect,
   webdriver = require('selenium-webdriver'),
   test = require('selenium-webdriver/testing');


test.describe('Tests made on www, app.js and its associated files', function() {

   this.timeout(15000);
   var driver,
      txtBox,
      path = '/Users/Charles/Documents/hea_analysis/south_africa/2016.04/spreadsheets/zakhc_1.xlsx'

   // Set up webdriver (using Chrome) and start the browser
   test.before(() => {
      driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
   });

   // Test 1
   test.it('should open the browser, retrieve the title, heading and first form', function() {
      driver.get('http://localhost:3000');
      driver.getTitle().then(function(title) {
         expect(title).to.contain('Load Spreadsheet')
      });
      driver.findElement(webdriver.By.css('h1')).getText().then(function(text) {
         expect(text).to.contain('HEA Analysis Spreadsheet Loader');
      });
      driver.findElement(webdriver.By.id('identifyLz')).getAttribute('action').then(function(text) {
         expect(text).to.contain('http://localhost:3000/search_lzs/search_lz');
      });
   });

   // Test 2
   test.it('should have a drop-down saying \'Select your country...\'', function() {
      driver.findElement(webdriver.By.id('countries')).getText().then(function(text) {
         expect(text).to.contain('Select your country...');
      });
   });

   // Test 3
   test.it('should have a single-line search input box, size 60, with \'Type the name, abbreviation or code of your livelihood zone here\' shown in it', function() {
      searchLz = driver.findElement(webdriver.By.id('searchLz'));
      searchLz.getAttribute('placeholder').then(function(text) {
         expect(text).to.contain('Type the name, abbreviation or code of your livelihood zone here');
      });
      searchLz.getAttribute('size').then(function(value) {
         expect(value).to.equal("60");
      });
   });

   // Test 4
   test.it('should hide the livelihood zone identifiers text boxes and the file upload controls, which should be in divisions that get switched on sequentially', function() {
      driver.findElements(webdriver.By.css('div')).then(function(arr) {
         var count = 0;
         arr.forEach(function(elem) {
            elem.getAttribute('hidden').then(function(value) {
               console.log(count + ': ' + value);
               expect(value).to.equal('true');
            });
         });
      });
   })

   // Test 5
   test.it('should navigate to the upload files URL and load elements', function() {
      driver.get('http://localhost:3000/uploads');
      driver.getTitle().then(function(title) {
         expect(title).to.contain('Load Spreadsheet')
      });
      driver.findElement(webdriver.By.tagName('h1')).getText().then(function(text) {
         expect(text).to.contain('HEA Analysis Spreadsheet Loader');
      });
      driver.findElement(webdriver.By.id('fileUpload')).getAttribute('action').then(function(text) {
         expect(text).to.equal('http://localhost:3000/uploads/upload')
      });
   });

   // Test 6
   test.it('should unhide on the lzDetails division, making the lzName, lzCode and lzAbbrev text boxes visible', function() {
      driver.findElement(webdriver.By.id('searchLz')).sendKeys('Okhahlamba open access intense crops and livestock').then(function() {
         driver.findElement(webdriver.By.id('lzDetails')).getAttribute('hidden').then(function(value) {
            expect(value).to.equal('false');
         })
      })
   });

   // Test 7
   test.it('should have a label saying \'Browse for the folder or spreadsheet file\'', function() {
      driver.findElement(webdriver.By.id('labelChooseFile')).getText().then(function(text) {
         expect(text).to.contain('Browse for the folder or spreadsheet file');
      });
   });

   // Test 8
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

   // Test 9
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
