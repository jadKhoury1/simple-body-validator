const assert = require('assert');
const SimpleValidator = require('../lib/index').default;

const validator = SimpleValidator.make();

describe('Before', function() {
    it('Validation rule before requires at least 1 parameter1', function() {
        validator.setData({ value: '2020' }).setRules({ value: 'before' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation must be a date', function() {
        validator.setData({ value: 'test' }).setRules({ value: 'before:2020' });
        assert.throws(() => validator.validate());
    });
    it('Validation rule before requires the parameter to be a date', function () {
        validator.setData({ value: '2020' }).setRules({ value: 'before:test'});
        assert.throws(() => validator.validate());
      

        validator.setData({ value: '2020', other_value: 'test' }).setRules({ value: 'before:other_value'});
        assert.throws(() => validator.validate());
    });
    describe('The field under validation must be a value preceeding the given date', function() {
        it('Validation should fail if date does not preceed the given date', function() {
            validator.setData({ value: '2021' }).setRules({ value: 'before:2020' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 13:15' }).setRules({ value: 'before:2021-12-11 08:14'});
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:30' }).setRules({ value: 'before:2021-12-11 08:30:30'});
            assert.equal(validator.validate(), false);

        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.firstError(), 'The value must be a date before 2021-12-11 08:30:30.')
        });
        it('Validation should succeed if the value is a date preceeding the given date', function() {
            validator.setData({ value: '2021-12-11 08:29:30' });
            assert.ok(validator.validate());
        });
    });

    describe('The field under validation must a value preceeding another field\'s date', function() {
        it('Validation should fail if date does not preceed the other field\'s date', function() {
            validator.setData({ value: '2021', other_value: '2020' }).setRules({ value: 'before:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 13:15', other_value: '2021-12-11 08:14' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:30', other_value: '2021-12-11 08:30:30' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.firstError(), 'The value must be a date before other value.')
        });
        it('Validation should succeed if the value is a date preceeding the given date', function() {
            validator.setData({ value: '2020', other_value: '2021' });
            assert.ok(validator.validate());
        });
    });
});