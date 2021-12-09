const assert = require('assert');
const SimpleValidator = require('../lib/index').default;

const validator = SimpleValidator.make();


describe('Between', function() {
    describe('The field under validation must be between two numbers', function() {
        it('Validation should fail if number is not between the two numbers', function() {
            validator.setData({ value: 3 }).setRules({ value: 'between:4,13' });
            assert.equal(validator.validate(), false);
        });
        it('The Numeric error message should be sent to the user', function() {
            assert.equal(validator.firstError(), 'The value must be between 4 and 13.');
        });
        it('The value will be evaluated as a string in case the number was sent as a string', function() {
            validator.setData({ value: '5' });
            assert.equal(validator.validate(), false);
        });
        it('The String error message should be sent to the user', function() {
            assert.equal(validator.firstError(), 'The value must be between 4 and 13 characters.')
        });
        it('For the string to be evaluated as a number, the numeric rule should be added to the rules', function() {
            validator.setRules({ value: 'numeric|between:4,13'});
            assert.ok(validator.validate());
        });
    });
    describe('The string under validation must be between the specified number of characters', function() {
        it('Validation should fail if string is not between the specified number of characters', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'between:5,10' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.firstError(), 'The value must be between 5 and 10 characters.');
        });
        it('Validation should succeed if the string contains the correct number of characters', function() {
            validator.setData({ value: 'test1234'});
            assert.ok(validator.validate());
        });
    });
    describe('The length of the array must match the specified range', function() {
        it('Validation should fail if array length does not match the specified range', function() {
            validator.setData({ value: [1] }).setRules({ value: 'between:2,5'});
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.firstError(), 'The value must have between 2 and 5 items.');
        });
        it('Validation should succeed if array length matches the specified range', function() {
            validator.setData({ value: [1,2] });
            assert.ok(validator.validate());
        });
    });
   it('The field under validation can only be a number, string or array', function() {
        validator.setData({ value: { name: 'test' } }).setRules({ value: 'between:1,2' });
        
        try {
            validator.validate();
        } catch (e) {
            assert.equal(e, 'Validation rule between requires the field under validation to be a number, string or array.');
        }
    });
    it('Validation rule between requires at least 2 parameters', function() {
        validator.setData({ value: '1' }).setRules({ value: 'between:1' });

        try {
            validator.validate();
        } catch (e) {
            assert.equal(e, 'Validation rule between requires at least 2 parameters.');
        }
    });
    it('Validation rule between requires both parameters to be numbers', function () {
        validator.setRules({ value: 'between:test,[]'});

        try {
            validator.validate();
        } catch (e) {
            assert.equal(e, 'Validation rule between requires both parameters to be numbers.');
        }
    });

    it('Validation rule between requires that the first parameter to be greater than the second one', function() {
        validator.setRules({ value: 'between:6,5'});

        try {
            validator.validate();
        } catch (e) {
            assert.equal(e, 'Validation rule between requires that the first parameter be greater than the second one.');
        }
    }); 
});