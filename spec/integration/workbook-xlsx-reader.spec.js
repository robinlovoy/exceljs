'use strict';

var verquire = require('../utils/verquire');
var testutils = require('../utils/index');
var fs = require('fs');
var expect = require('chai').expect;

var Excel = verquire('excel');

var TEST_FILE_NAME = './spec/out/wb.test.xlsx';

// need some architectural changes to make stream read work properly
// because of: shared strings, sheet names, etc are not read in guaranteed order
describe('WorkbookReader', function() {
  describe('Serialise', function() {
    it('xlsx file', function() {
      this.timeout(10000);
      var wb = testutils.createTestBook(new Excel.Workbook(), 'xlsx');

      return wb.xlsx.writeFile(TEST_FILE_NAME)
        .then(function() {
          return testutils.checkTestBookReader(TEST_FILE_NAME);
        });
    });
  });

  describe('#readFile', function() {
    describe('Row limit', function() {
      it('should bail out if the file contains more rows than the limit', function() {
        var workbook = new Excel.Workbook();
        // The Fibonacci sheet has 19 rows
        return workbook.xlsx.readFile('./spec/integration/data/fibonacci.xlsx', {maxRows: 10})
          .then(function() {
            throw new Error('Promise unexpectedly fulfilled');
          }, function(err) {
            expect(err.message).to.equal('Max row count exceeded');
          });
      });

      it('should parse fine if the limit is not exceeded', function() {
        var workbook = new Excel.Workbook();
        return workbook.xlsx.readFile('./spec/integration/data/fibonacci.xlsx', {maxRows: 20});
      });
    });
  });

  describe('#read', function() {
    describe('Row limit', function() {
      it('should bail out if the file contains more rows than the limit', function() {
        var workbook = new Excel.Workbook();
        // The Fibonacci sheet has 19 rows
        return workbook.xlsx.read(fs.createReadStream('./spec/integration/data/fibonacci.xlsx'), {maxRows: 10})
          .then(function() {
            throw new Error('Promise unexpectedly fulfilled');
          }, function(err) {
            expect(err.message).to.equal('Max row count exceeded');
          });
      });

      it('should parse fine if the limit is not exceeded', function() {
        var workbook = new Excel.Workbook();
        return workbook.xlsx.read(fs.createReadStream('./spec/integration/data/fibonacci.xlsx'), {maxRows: 20});
      });
    });
  });
});
