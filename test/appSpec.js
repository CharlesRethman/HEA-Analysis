/*
 *
 * Test for the server, www and app.js
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
   test.it('should open the browser, retrieve the title, heading and initial display', function() {
      driver.get('http://localhost:3000');
      driver.getTitle().then(function(title) {
         expect(title).to.contain('Load Spreadsheet')
      });
   });

   // Test 2
   test.it('should have an image that takes up the whole window, containing the heading and other information', function() {
      driver.findElement({ id : 'wrapper'}).getCssValue('background-image').then(function(text) {
         expect(text).to.contain('images/grain.png');
      });
      driver.findElement({ css : 'h1' }).getText().then(function(text) {
         expect(text).to.equal('HEA Analysis Spreadsheet Loader');
      });
      driver.findElement({ id : 'scrollDown' }).getAttribute('src').then(function(text) {
         expect(text).to.contain('images/arrowhead-down-256.png');
      });
   });

   // Test 3
   test.it('start with a (visible) form with inputs for identifying the assessment', function() {
      driver.findElement(webdriver.By.id('assess')).isDisplayed().then(function(value) {
         expect(value).to.equal(true);
      });
      formAssess = driver.findElement(webdriver.By.id('assessLz'))
      formAssess.getAttribute('method').then(function(text) {
         expect(text).to.equal('post');
      });
      formAssess.getAttribute('action').then(function(text) {
         expect(text).to.contain('http://localhost:3000/assessment');
      });
   });

   // Test 4
   test.it('start with a (hidden) form with inputs for identifying the livelihood zone', function() {
      driver.findElement(webdriver.By.id('identify')).isDisplayed().then(function(value) {
         expect(value).to.equal(false);
      });
      formIdentify = driver.findElement(webdriver.By.id('identifyLz'))
      formIdentify.getAttribute('method').then(function(text) {
         expect(text).to.equal('get');
      });
      formIdentify.getAttribute('action').then(function(text) {
         expect(text).to.contain('http://localhost:3000/search');
      });
   });

   // Test 5
   test.it('start with a (hidden) form with inputs for confirming the livelihood zone', function() {
      driver.findElement(webdriver.By.id('confirm')).isDisplayed().then(function(value) {
         expect(value).to.equal(false);
      });
      formConfirm = driver.findElement(webdriver.By.id('confirmLz'))
      formConfirm.getAttribute('method').then(function(text) {
         expect(text).to.equal('post');
      });
      formConfirm.getAttribute('action').then(function(text) {
         expect(text).to.equal('http://localhost:3000/uploads');
      });
   });

   // Test 6
   test.it('should have a drop-down saying \'Select your country...\'', function() {
      driver.findElement(webdriver.By.id('countries')).getText().then(function(text) {
         expect(text).to.contain('Select your country...');
      });
   });

   // Test 7
   test.it('should have a text box for entering the geographic hazard and a text box for entering the selective hazard', function() {
      driver.findElement({ id : 'hazardGeospatial' }).getAttribute('placeholder').then(function(text) {
         expect(text).to.contain('Floods, drought, etc.');
      });
      driver.findElement({ id : 'hazardScenario' }).getAttribute('placeholder').then(function(text) {
         expect(text).to.contain('Prices, social grants, etc.');
      });
   });

   // Test 8
   test.it('should have a button with the value \'Continue\', which should hide itself and unhide the search section when clicked', function() {
      var cont = driver.findElement({ id : 'continue' })
      cont.isDisplayed().then(function(value) {
         expect(value).to.equal(true);
      });
      cont.getAttribute('value').then(function(text) {
         expect(text).to.equal('Continue...');
      });
      cont.click();
      driver.wait(function() {
         driver.findElement({ id : 'continue' }).isDisplayed().then(function(value) {
            expect(value).to.equal(false);
         });
         return driver.findElement({ id : 'search' }).isDisplayed().then(function(value) {
            return expect(value).to.equal(true);
         });
      }, 3000);
   });

   // Test 7
   test.it('should have a single-line search input box, size 70, with \'Type the name, abbreviation or code of your livelihood zone here\' shown in it', function() {
      searchBox = driver.findElement(webdriver.By.id('searchBox'));
      searchBox.getAttribute('placeholder').then(function(text) {
         expect(text).to.contain('Type the name, abbreviation or code of your livelihood zone here');
      });
      searchBox.getAttribute('size').then(function(value) {
         expect(value).to.equal('70');
      });
   });

   // Test 8
   test.it('should have a button with the value \'Search\', which should hide itself and unhide the confirm section when clicked', function() {
      var search = driver.findElement({ id : 'search' })
      search.isDisplayed().then(function(value) {
         expect(value).to.equal(true);
      });
      search.getAttribute('value').then(function(text) {
         expect(text).to.equal('Search');
      });
      search.click();
      driver.wait(function() {
         driver.findElement(webdriver.By.id('search')).isDisplayed().then(function(value) {
            expect(value).to.equal(false);
         });
         return driver.findElement(webdriver.By.id('confirm')).isDisplayed().then(function(value) {
            return expect(value).to.equal(true);
         });
      }, 3000);
   });

   //Test 9
   test.it('should now be on the route \'/search?\'', function() {
      driver.getCurrentUrl().then(function(text) {
         expect(text).to.equal('http://localhost:3000/search?');
      })
   });

   // Test 10
   test.it('should have livelihood zone identifiying input boxes, which should be displayed', function() {
      driver.findElement(webdriver.By.id('lzCode')).isDisplayed().then(function(value) {
         expect(value).to.equal(true);
      });
      driver.findElement(webdriver.By.id('lzAbbrev')).isDisplayed().then(function(value) {
         expect(value).to.equal(true);
      });
      driver.findElement(webdriver.By.id('lzName')).isDisplayed().then(function(value) {
         expect(value).to.equal(true);
      });
   })


   // Test 11
   test.it('should have a button with the value \'Confirm\', which should load the uploads form when clicked', function() {
      var use = driver.findElement(webdriver.By.id('use'))
      use.isDisplayed().then(function(value) {
         expect(value).to.equal(true);
      });
      use.getAttribute('value').then(function(text) {
         expect(text).to.equal('Confirm');
      });
      use.click();
      driver.wait(function() {
         return driver.getCurrentUrl().then(function(text) {
            return expect(text).to.equal('http://localhost:3000/uploads');
         });
      }, 3000);
   });

   // Test 12
   test.it('should have a form with the action \'uploads/upload\' in it', function() {
      driver.findElement(webdriver.By.id('fileUploadLz')).getAttribute('action').then(function(text) {
         expect(text).to.equal('http://localhost:3000/uploads/upload');
      });
   });

   // Test 13
   test.it('should have a label saying \'Browse for the folder or spreadsheet file\'', function() {
      driver.findElement(webdriver.By.id('labelChooseFile')).getText().then(function(text) {
         expect(text).to.contain('Browse for the folder or spreadsheet file');
      });
   });

   // Test 14
   test.it('should have a \'Choose files\' button', function() {
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

   // Test 15
   test.it('should have a button with the value \'Upload\', that uploads the spreadsheet when clicked', function() {
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
