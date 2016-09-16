/*
 *
 * Test for the server index.js
 */

var expect = require('chai').expect,
   webdriver = require('selenium-webdriver'),
   test = require('selenium-webdriver/testing'),
   path = '/Users/Charles/Documents/hea_analysis/south_africa/2016.04/spreadsheets/za2xx_1.xlsx'


test.describe('Index', function() {
   this.timeout(15000);
   var driver;

   test.before(() => {
      driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
   });

   test.it('should open the browser', function() {
      driver.get('http://localhost:3000');
      driver.getTitle().then(function(title) {
         expect(title).to.contain('Load spreadsheet')
      })
   });

   test.it('should retrieve the heading', function() {
      driver.findElement(webdriver.By.tagName('h1')).getText().then(function(text) {
         expect(text).to.contain('HEA Analysis Spreadsheet loader');
      });
   });

   test.it('should have a label saying \'Enter the path and file name of your spreadsheet here\'', function() {
      driver.findElement(webdriver.By.id('lblInputBox')).getText().then(function(text) {
         expect(text).to.contain('Enter the path and file name of your spreadsheet here');
      });
   });

   test.it('should have a single-line text input box, size 60, with \'path/to/file/\' shown in it', function() {
      var element = driver.findElement(webdriver.By.id('txtPathToFile'));
      element.getAttribute('placeholder').then(function(text) {
         expect(text).to.contain('/path/to/file/');
      });
      element.getAttribute('size').then(function(value) {
         expect(value).to.equal("60");
      });
//      element.sendKeys(path);
   });

   test.it('should have a \'Choose file\' button', function() {
      element = driver.findElement(webdriver.By.id('btnChooseFile'));
      element.getAttribute('accept').then(function(text) {
         var arr = text.split(',');
         arr = arr.sort();
         expect(arr).to.deep.equal(['.xls','.xlsx']);
      });
      element.sendKeys(path).then(function() {
         element.getAttribute('value').then(function(text) {
            text = text.slice(text.lastIndexOf('\\') + 1);
            var file = path.slice(path.lastIndexOf('/') + 1);
            expect(text).to.equal(file);
         });
      });
   });

   test.it('should a have an \'Upload\' button', function() {
      driver.findElement(webdriver.By.id('btnUploadFile')).getAttribute('value').then(function(text) {
         expect(text).to.contain('Upload');
      });
   });


/*   test.it('The path should be set by the choose button', function() {
      element = driver.findElement(webdriver.By.id('btnChooseFile'))

//      driver.wait(function() {
         element.getAttribute('value').then(function(text) {
            text = 'za2xx_1.xlsx'
            console.log(text);
         });
//      }, 3000);

      driver.findElement(webdriver.By.id('txtPathToFile')).getAttribute('value').then(function(text) {
         console.log(text);
      });

   });

/*   test.it('should a have a submit button', function() {
      driver.findElement(webdriver.By.name('loadFile').click().then(function()) {

      }
   })*/

   test.after(function() {
      driver.quit();
   });
});
