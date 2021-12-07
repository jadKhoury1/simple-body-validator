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
            let messages = validator.errors();
            assert.equal(messages.value, 'The value must be an array.');
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
        let messages = validator.errors();
        assert.equal(messages.value, 'The value must only contain letters.');
    });
    it('Validation should succeed in case value contain only alphabetic characters', function() {
        validator.setData({ value: 'test' });
        assert.ok(validator.validate());
    });
  });
});