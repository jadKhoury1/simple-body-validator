const assert = require('assert');
const SimpleValidator = require('../lib/index').default;

const validator = SimpleValidator.make();

describe('Array', function() {
    describe('The field under validation must be an array', function() {
      it('Validation should fail in case value is not an array', function() {
          
        validator.setData({ value: 'test' }).setRules({ value: 'array' });
        assert.equal(validator.validate(), false);

        validator.setData({ value: 2 });
        assert.equal(validator.validate(), false);

        validator.setData({ value: { name: 'test' }});
        assert.equal(validator.validate(), false);

      });
      it('An Error Message should be returned in case of failure', function() {
            assert.equal(validator.firstError(), 'The value must be an array.');
      });
      it('Validation should succeed in case value is an array', function() {
            validator.setData({ value: [] });
            assert.ok(validator.validate());
      });
    });
});

describe('Alpha', function() {
  describe('The field under validation must be entirely alphabetic characters', function() {
    it('Validation should fail in case value does not only contain alphabetic characters', function () {

      validator.setData({ value: 'test1234'}).setRules({ value: 'alpha' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: '$^(' });
      assert.equal(validator.validate(), false);

    });
    it('An Error Message should be returned in case of failure', function() {
        assert.equal(validator.firstError(), 'The value must only contain letters.');
    });
    it('Validation should succeed in case value contain only alphabetic characters', function() {
        validator.setData({ value: 'test' });
        assert.ok(validator.validate());
    });
  });
});

describe('AlphaDash', function() {
  describe('The field under validation may have alpha-numeric characters, as well as dashes and underscores', function() {
    it('Validation should fail in case value does not only contain alpha-numeric characters, dashes and underscores', function () {

      validator.setData({ value: 'test_$2'}).setRules({ value: 'alpha_dash' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: '$^(' });
      assert.equal(validator.validate(), false);

    });
    it('An Error Message should be returned in case of failure', function() {
        assert.equal(validator.firstError(), 'The value must only contain letters, numbers, dashes and underscores.');
    });
    it('Validation should succeed in case value contain only alphabetic characters', function() {
        validator.setData({ value: 'test_test-test12' });
        assert.ok(validator.validate());
    });
  });
});

describe('AlphaNum', function() {
  describe('The field under validation must be entirely alpha-numeric characters.', function() {
    it('Validation should fail in case value does not only contain alpha-numeric characters', function () {

      validator.setData({ value: 'test_$2'}).setRules({ value: 'alpha_num' });
      assert.equal(validator.validate(), false);

    });
    it('An Error Message should be returned in case of failure', function() {
        assert.equal(validator.firstError(), 'The value must only contain letters and numbers.');
    });
    it('Validation should succeed in case value contain only alphabetic characters', function() {
        validator.setData({ value: 'test123' });
        assert.ok(validator.validate());
    });
  });
});

describe('Boolean', function() {
  describe('The field under validation must be a boolean', function() {
    it('Validation should fail in case value is not boolean', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'boolean' });
      assert.equal(validator.validate(), false);
    });
    it('An Error Message should be returned in case of failure', function() {
       assert.equal(validator.firstError(), 'The value field must be true or false.');
    });
    it('Validation should succeed in case value is a boolean', function() {
      const validValues = [true, false, '0', '1', 0, 1];
      validValues.forEach(value => {
        validator.setData({ value });
        assert.ok(validator.validate());
      });
    });
  });
  describe('In case strict rule is used value should be either true or false', function() {
      it('Validation should fail in case 0 or 1 are used', function() {
         const values = [0, 1, '0', '1'];
         validator.setRules({ value: 'strict|boolean' });
         values.forEach(value => {
            validator.setData({ value });
            assert.equal(validator.validate(), false);
         });
      });
      it('Validation should succeed in case true or false are used', function() {
          validator.setData({ value: true });
          assert.ok(validator.validate());

          validator.setData({ value: false });
          assert.ok(validator.validate());
      });
  });
});