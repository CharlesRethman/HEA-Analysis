/*
 *
 * Test for the server index.js
 */

var expect = require('chai').expect,
   webdriver = require('selenium-webdriver'),
   test = require('selenium-webdriver/testing');


test.describe('Index', function() {
   this.timeout(15000);
   var driver,
      txtBox,
      path = '/Users/Charles/Documents/hea_analysis/south_africa/2016.04/spreadsheets/za2xx_1.xlsx'

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

   test.it('should have a single-line text input box, size 60, with \'/enter/the/path/to/your/file.xlsx\' shown in it', function() {
      txtBox = driver.findElement(webdriver.By.id('txtPathFile'));
      txtBox.getAttribute('placeholder').then(function(text) {
         expect(text).to.contain('/enter/the/path/to/your/file.xlsx');
      });
      txtBox.getAttribute('size').then(function(value) {
         expect(value).to.equal("60");
      });
//      txtBox.sendKeys(path);
   });

   test.it('should have a \'Choose file\' button', function() {
      chooseFile = driver.findElement(webdriver.By.id('btnChooseFile'));
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

   test.it('should have an \'Upload\' button named \'submit\'.', function() {
      var uploadFile = driver.findElement(webdriver.By.id('btnUploadFile'))
      uploadFile.getAttribute('value').then(function(text) {
         expect(text).to.equal('Upload');
      });
      uploadFile.getAttribute('name').then(function(text) {
         expect(text).to.equal('submit');
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
