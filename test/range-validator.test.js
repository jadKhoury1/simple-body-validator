const assert = require('assert');
const { make } = require('../lib/cjs/index');

const validator = make();


describe('Between', function() {
    it('The field under validation can only be a number, string, array, or object.', function() {
        validator.setData({ value: () => '' }).setRules({ value: 'between:1,2' });
        assert.throws(() => validator.validate());
    });
    it('Validation rule between requires at least 2 parameters', function() {
        validator.setData({ value: '1' }).setRules({ value: 'between:1' });
        assert.throws(() => validator.validate());
    });
    it('Validation rule between requires both parameters to be numbers', function () {
        validator.setRules({ value: 'between:test,[]'});
        assert.throws(() => validator.validate());
    });
    describe('The field under validation must be between two numbers', function() {
        it('Validation should fail if number is not between the two numbers', function() {
            validator.setData({ value: 3 }).setRules({ value: 'between:4,13' });
            assert.equal(validator.validate(), false);
        });
        it('The Numeric error message should be sent to the user', function() {
            assert.equal(validator.errors().first(), 'The value must be between 4 and 13.');
        });
        it('The value will be evaluated as a string in case the number was sent as a string', function() {
            validator.setData({ value: '5' });
            assert.equal(validator.validate(), false);
        });
        it('The String error message should be sent to the user', function() {
            assert.equal(validator.errors().first(), 'The value must be between 4 and 13 characters.')
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
            assert.equal(validator.errors().first(), 'The value must be between 5 and 10 characters.');
        });
        it('Validation should succeed if the string contains the correct number of characters', function() {
            validator.setData({ value: 'test1234'});
            assert.ok(validator.validate());
        });
    });
    describe('The length of the array must match the specified range', function() {
        it('Validation rule between requires that the first parameter to be greater than the second one', function() {
            validator.setRules({ value: 'between:6,5'});
            assert.throws(() => validator.validate());
        }); 
        it('Validation should fail if array length does not match the specified range', function() {
            validator.setData({ value: [1] }).setRules({ value: 'between:2,5'});
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have between 2 and 5 items.');
        });
        it('Validation should succeed if array length matches the specified range', function() {
            validator.setData({ value: [1,2] });
            assert.ok(validator.validate());
        });
    });
    describe('The length of the object must match the specified range', function() {
        it('Validation should fail if object length does not match the specified range', function() {
            validator.setData({ value: { name: 'jad' }}).setRules({ value: 'between:2,3'});
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have between 2 and 3 items.');
        });
        it('Validation should succeed if object length matches the specified range', function() {
            validator.setData({ value: { first: 'jad', last: 'khoury' }});
            assert.ok(validator.validate());
        });
    });
});

describe('Greater Than', function() {
    it('Validation rule gt requires at least 1 parameter', function() {
        validator.setData({ value: '1' }).setRules({ value: 'gt' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation can only be a number, string, array or object', function() {
        validator.setData({ value: () => '' }).setRules({ value: 'gt:2' });
        assert.throws(() => validator.validate());
    });
    it('In case the parameter is not a number, and the type of the value does not match the type of the parameter, then the validation should fail', function() {
        validator.setData({ value: [1,2,3], other_value: {fname: 'john', lname: 'doe'} }).setRules({ value: 'gt:other_value' });
        assert.throws(() => validator.validate());

        validator.setData({ value: 'jad', other_value: [1,2] });
        assert.throws(() => validator.validate());
    });
    describe('If the paramter is a number, then the size of the value should be compared with the parameter', function() {
        it('If value is an array, then the length of the array should be compared with the parameter', function() {
            validator.setData({ value: [1, 2, 3] }).setRules({ value: 'gt:2' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'gt:3' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is an object, then the length of the object should be compared with the parameter', function() {
            validator.setData({ value: {fname: 'test', lname: 'test' }}).setRules({ value: 'gt:1' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'gt:2' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a string, the length of the string should be compared with the parameter', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'gt:3' });
            assert.ok(validator.validate());

            validator.setData({ value: '0001' }).setRules({ value: 'gt:3' });
            assert.ok(validator.validate());
            
            validator.setRules({ value: 'gt:4' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a number in a string, and has the numeric rule, then it will be compared as a number and not a string', function() {
            validator.setData({ value: '13' }).setRules({ value: 'numeric|gt:10'});
            assert.ok(validator.validate());

            validator.setData({ value: '09' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a number, then it should be compared with the other number', function() {
            validator.setData({ value: 12.5 }).setRules({ value: 'gt:10' });
            assert.ok(validator.validate());

            validator.setData({ value: 9.99 });
            assert.equal(validator.validate(), false);
        });
    });
    describe('The length of the array must be greater than the length of the other array', function() {
        it('Validation should fail if array length is not greater than the other array length', function() {
            validator.setData({ value: [1, 2], other_value: [1,2] }).setRules({ value: 'gt:other_value'});
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have more than 2 items.');
        });
        it('Validation should succeed if array length is greater than the other array length', function() {
            validator.setData({ value: [1,2,3], other_value: [1,2] });
            assert.ok(validator.validate());
        });
    });
    describe('The length of the object must be greater than the length of the other object', function() {
        it('Validation should fail if object length is not greater than the other object length', function() {
            validator.setData({ 
                value: {fname: 'john', lname: 'doe'}, 
                other_value: {fname: 'jane', lname: 'doe'} 
            }).setRules({ value: 'gt:other_value'});

            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have more than 2 items.');
        });
        it('Validation should succeed if object length is greater than the other object length', function() {
            validator.setData({ 
                value: {fname: 'john', lname: 'doe'}, 
                other_value: {fname: 'jane'} 
            })
            assert.ok(validator.validate());
        });
    });
    describe('The string under validation must have a length greater than the other string', function() {
        it('Validation should fail if string length is not greater than the other string length', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'gt:john' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: 'test', other_value: 'john' }).setRules({ value: 'gt:other_value' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be greater than 4 characters.');
        });
        it('Validation should succeed if string length is greater than the other string length', function() {
            validator.setData({ value: 'test1234', other_value: 'test'});
            assert.ok(validator.validate());
        });
    });
    describe('The number under validation must be greater than the other number', function() {
        it('Validation should fail if the number is not greater than the other number', function() {
            validator.setData({ value: 4, other_value: 4 }).setRules({ value: 'gt:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '010', other_value: '11' }).setRules({ value: 'numeric|gt:other_value' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be greater than 11.');
        });
        it('Validation should succeed if the number is greater than the other number', function() {
            validator.setData({ value: 12, other_value: 10 });
            assert.ok(validator.validate());

            validator.setData({ value: '12', other_value: '11' }).setRules({ value: 'numeric|gt:other_value' });
            assert.ok(validator.validate());
        });
    });
});

describe('Greater Than or equal', function() {
    it('Validation rule gte requires at least 1 parameter', function() {
        validator.setData({ value: '1' }).setRules({ value: 'gte' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation can only be a number, string, array or object', function() {
        validator.setData({ value: () => '' }).setRules({ value: 'gte:2' });
        assert.throws(() => validator.validate());
    });
    it('In case the parameter is not a number, and the type of the value does not match the type of the parameter, then the validation should fail', function() {
        validator.setData({ value: [1,2,3], other_value: {fname: 'john', lname: 'doe'} }).setRules({ value: 'gte:other_value' });
        assert.throws(() => validator.validate());

        validator.setData({ value: 'jad', other_value: [1,2] });
        assert.throws(() => validator.validate());
    });
    describe('If the paramter is a number, then the size of the value should be compared with the parameter', function() {
        it('If value is an array, then the length of the array should be compared with the parameter', function() {
            validator.setData({ value: [1, 2] }).setRules({ value: 'gte:2' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'gte:3' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is an object, then the length of the object should be compared with the parameter', function() {
            validator.setData({ value: {fname: 'test', lname: 'test' }}).setRules({ value: 'gte:2' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'gte:3' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a string, the length of the string should be compared with the parameter', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'gte:4' });
            assert.ok(validator.validate());

            validator.setData({ value: '0001' }).setRules({ value: 'gte:4' });
            assert.ok(validator.validate());
            
            validator.setRules({ value: 'gte:5' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a number in a string, and has the numeric rule, then it will be compared as a number and not a string', function() {
            validator.setData({ value: '10' }).setRules({ value: 'numeric|gte:10'});
            assert.ok(validator.validate());

            validator.setData({ value: '09' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a number, then it should be compared with the other number', function() {
            validator.setData({ value: 12.5 }).setRules({ value: 'gte:10' });
            assert.ok(validator.validate());

            validator.setData({ value: 9.99 });
            assert.equal(validator.validate(), false);
        });
    });
    describe('The length of the array must be greater or equal to the length of the other array', function() {
        it('Validation should fail if array length is not greater than or equal to the other array length', function() {
            validator.setData({ value: [1], other_value: [1,2] }).setRules({ value: 'gte:other_value'});
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have 2 items or more.');
        });
        it('Validation should succeed if array length is greater than or equal to the other array length', function() {
            validator.setData({ value: [1,2], other_value: [1,2] });
            assert.ok(validator.validate());
        });
    });
    describe('The length of the object must be greater than or equal to the length of the other object', function() {
        it('Validation should fail if object length is not greater than or equal to the other object length', function() {
            validator.setData({ 
                value: {fname: 'john'}, 
                other_value: {fname: 'jane', lname: 'doe'} 
            }).setRules({ value: 'gte:other_value'});

            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have 2 items or more.');
        });
        it('Validation should succeed if object length is greater than or equal to the other object length', function() {
            validator.setData({ 
                value: {fname: 'john', lname: 'doe'}, 
                other_value: {fname: 'jane', lname: 'doe'} 
            })
            assert.ok(validator.validate());
        });
    });
    describe('The string under validation must have a length greater than or equal to the other string', function() {
        it('Validation should fail if string length is not greater than or equal to the other string length', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'gte:test1' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: 'test', other_value: 'test1' }).setRules({ value: 'gte:other_value' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be greater than or equal 5 characters.');
        });
        it('Validation should succeed if string length is greater than or equal to the other string length', function() {
            validator.setData({ value: 'test', other_value: 'test'});
            assert.ok(validator.validate());
        });
    });
    describe('The number under validation must be greater than or equal to the other number', function() {
        it('Validation should fail if the number is not greater than or equal to the other number', function() {
            validator.setData({ value: 4, other_value: 5 }).setRules({ value: 'gte:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '010', other_value: '11' }).setRules({ value: 'numeric|gte:other_value' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be greater than or equal 11.');
        });
        it('Validation should succeed if the number is greater than or equal to the other number', function() {
            validator.setData({ value: 10, other_value: 10 });
            assert.ok(validator.validate());

            validator.setData({ value: '11', other_value: '11' }).setRules({ value: 'numeric|gte:other_value' });
            assert.ok(validator.validate());
        });
    });
});

describe('Less Than', function() {
    it('Validation rule lt requires at least 1 parameter', function() {
        validator.setData({ value: '1' }).setRules({ value: 'lt' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation can only be a number, string, array or object', function() {
        validator.setData({ value: () => '' }).setRules({ value: 'lt:2' });
        assert.throws(() => validator.validate());
    });
    it('In case the parameter is not a number, and the type of the value does not match the type of the parameter, then the validation should fail', function() {
        validator.setData({ value: [1], other_value: {fname: 'john', lname: 'doe'} }).setRules({ value: 'lt:other_value' });
        assert.throws(() => validator.validate());

        validator.setData({ value: 'jad', other_value: [1,2,3] });
        assert.throws(() => validator.validate());
    });
    describe('If the paramter is a number, then the size of the value should be compared with the parameter', function() {
        it('If value is an array, then the length of the array should be compared with the parameter', function() {
            validator.setData({ value: [1, 2] }).setRules({ value: 'lt:3' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'lt:1' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is an object, the length of the object should be compared with the parameter', function() {
            validator.setData({ value: {fname: 'test', lname: 'test' }}).setRules({ value: 'lt:3' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'lt:2' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a string, the length of the string should be compared with the parameter', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'lt:5' });
            assert.ok(validator.validate());

            validator.setData({ value: '0001' }).setRules({ value: 'lt:5' });
            assert.ok(validator.validate());
            
            validator.setRules({ value: 'lt:4' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a number in a string, and has the numeric rule, then it will be compared as a number and not a string', function() {
            validator.setData({ value: '13' }).setRules({ value: 'numeric|lt:15'});
            assert.ok(validator.validate());

            validator.setData({ value: '20' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a number, then it should be compared with the other number', function() {
            validator.setData({ value: 12.5 }).setRules({ value: 'lt:15' });
            assert.ok(validator.validate());

            validator.setData({ value: 15.3 });
            assert.equal(validator.validate(), false);
        });
    });
    describe('The length of the array must be lesser than the length of the other array', function() {
        it('Validation should fail if array length is not less than the other array length', function() {
            validator.setData({ value: [1, 2], other_value: [1,2] }).setRules({ value: 'lt:other_value'});
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have less than 2 items.');
        });
        it('Validation should succeed if array length is less than the other array length', function() {
            validator.setData({ value: [1,2], other_value: [1,2,3] });
            assert.ok(validator.validate());
        });
    });
    describe('The length of the object must be less than the length of the other object', function() {
        it('Validation should fail if object length is not less than the other object length', function() {
            validator.setData({ 
                value: {fname: 'john', lname: 'doe'}, 
                other_value: {fname: 'jane', lname: 'doe'} 
            }).setRules({ value: 'lt:other_value'});

            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have less than 2 items.');
        });
        it('Validation should succeed if object length is less than the other object length', function() {
            validator.setData({ 
                value: {fname: 'john'}, 
                other_value: {fname: 'jane', lname: 'doe'} 
            })
            assert.ok(validator.validate());
        });
    });
    describe('The string under validation must have a length less than the other string', function() {
        it('Validation should fail if string length is not less than the other string length', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'lt:john' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: 'test', other_value: 'john' }).setRules({ value: 'lt:other_value' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be less than 4 characters.');
        });
        it('Validation should succeed if string length is less than the other string length', function() {
            validator.setData({ value: 'test', other_value: 'test1234'});
            assert.ok(validator.validate());
        });
    });
    describe('The number under validation must be less than the other number', function() {
        it('Validation should fail if the number is not less than the other number', function() {
            validator.setData({ value: 4, other_value: 4 }).setRules({ value: 'lt:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '11', other_value: '010' }).setRules({ value: 'numeric|lt:other_value' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be less than 10.');
        });
        it('Validation should succeed if the number is less than the other number', function() {
            validator.setData({ value: 10, other_value: 12 });
            assert.ok(validator.validate());

            validator.setData({ value: '11', other_value: '12' }).setRules({ value: 'numeric|lt:other_value' });
            assert.ok(validator.validate());
        });
    });
});

describe('Less Than or equal', function() {
    it('Validation rule lte requires at least 1 parameter', function() {
        validator.setData({ value: '1' }).setRules({ value: 'lte' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation can only be a number, string, array or object', function() {
        validator.setData({ value: () => '' }).setRules({ value: 'lte:2' });
        assert.throws(() => validator.validate());
    });
    it('In case the parameter is not a number, and the type of the value does not match the type of the parameter, then the validation should fail', function() {
        validator.setData({ value: [1,2], other_value: {fname: 'john', lname: 'doe'} }).setRules({ value: 'lte:other_value' });
        assert.throws(() => validator.validate());

        validator.setData({ value: 'jad', other_value: [1,2] });
        assert.throws(() => validator.validate());
    });
    describe('If the paramter is a number, then the size of the value should be compared with the parameter', function() {
        it('If value is an array, then the length of the array should be compared with the parameter', function() {
            validator.setData({ value: [1, 2] }).setRules({ value: 'lte:2' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'lte:1' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is an object, then the length of the object should be compared with the parameter', function() {
            validator.setData({ value: {fname: 'test', lname: 'test' }}).setRules({ value: 'lte:4' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'lte:1' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a string, the length of the string should be compared with the parameter', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'lte:4' });
            assert.ok(validator.validate());

            validator.setData({ value: '0001' }).setRules({ value: 'lte:4' });
            assert.ok(validator.validate());
            
            validator.setRules({ value: 'lte:3' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a number in a string, and has the numeric rule, then it will be compared as a number and not a string', function() {
            validator.setData({ value: '10' }).setRules({ value: 'numeric|lte:10'});
            assert.ok(validator.validate());

            validator.setData({ value: '11' });
            assert.equal(validator.validate(), false);
        });
        it('If the value is a number, then it should be compared with the other number', function() {
            validator.setData({ value: 12.5 }).setRules({ value: 'lte:15' });
            assert.ok(validator.validate());

            validator.setData({ value: 16 });
            assert.equal(validator.validate(), false);
        });
    });
    describe('The length of the array must be less than or equal to the length of the other array', function() {
        it('Validation should fail if array length is not less than or equal to the other array length', function() {
            validator.setData({ value: [1,2,3], other_value: [1,2] }).setRules({ value: 'lte:other_value'});
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have 2 items or less.');
        });
        it('Validation should succeed if array length is less than or equal to the other array length', function() {
            validator.setData({ value: [1,2], other_value: [1,2] });
            assert.ok(validator.validate());
        });
    });
    describe('The length of the object must be less than or equal to the length of the other object', function() {
        it('Validation should fail if object length is not less than or equal to the other object length', function() {
            validator.setData({ 
                value: {fname: 'john', lname: 'doe', address: 'test'}, 
                other_value: {fname: 'jane', lname: 'doe'} 
            }).setRules({ value: 'lte:other_value'});

            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have 2 items or less.');
        });
        it('Validation should succeed if object length is less than or equal to the other object length', function() {
            validator.setData({ 
                value: {fname: 'john', lname: 'doe'}, 
                other_value: {fname: 'jane', lname: 'doe'} 
            })
            assert.ok(validator.validate());
        });
    });
    describe('The string under validation must have a length less than or equal to the other string', function() {
        it('Validation should fail if string length is not less than or equal to the other string length', function() {
            validator.setData({ value: 'test1' }).setRules({ value: 'lte:test' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: 'test1', other_value: 'test' }).setRules({ value: 'lte:other_value' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be less than or equal 4 characters.');
        });
        it('Validation should succeed if string length is less than or equal to the other string length', function() {
            validator.setData({ value: 'test', other_value: 'test'});
            assert.ok(validator.validate());
        });
    });
    describe('The number under validation must be less than or equal to the other number', function() {
        it('Validation should fail if the number is not less than or equal to the other number', function() {
            validator.setData({ value: 5, other_value: 4 }).setRules({ value: 'lte:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '11', other_value: '010' }).setRules({ value: 'numeric|lte:other_value' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be less than or equal 10.');
        });
        it('Validation should succeed if the number is less than or equal to the other number', function() {
            validator.setData({ value: 10, other_value: 10 });
            assert.ok(validator.validate());

            validator.setData({ value: '11', other_value: '11' }).setRules({ value: 'numeric|lte:other_value' });
            assert.ok(validator.validate());
        });
    });
});


describe('Min', function() {
    it('Validation rule min requires at least 1 parameter', function() {
        validator.setData({ value: '1' }).setRules({ value: 'min' });
        assert.throws(() => validator.validate());
    });
    it('The parameter must be a number', function() {
        validator.setRules({ value: 'min:jad' });
        assert.throws(() => validator.validate());
    });
    describe('The length of the array must have a min value', function() {
        it('Validation should fail if the length of the array does not match the min value', function() {
            validator.setData({ value: [1, 2] }).setRules({ value: 'min:3' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have at least 3 items.');
        });
        it('Validation should succeed if the length of the array matches the min value', function() {
            validator.setRules({ value: 'min:1' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'min:2' });
            assert.ok(validator.validate());
        });
    });
    describe('The length of the object must have a min value', function() {
        it('Validation should fail if the length of the object does not match the min value', function() {
            validator.setData({ value: { first: 'Jad', last: 'Khoury' }}).setRules({ value: 'min:3' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must have at least 3 items.');
        });
        it('Validation should succeed if the length of the object matches the min value', function() {
            validator.setRules({ value: 'min:1' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'min:2' });
            assert.ok(validator.validate());
        });

    });
    describe('The length of the string should have a min value', function() {
        it('Validation should fail if the length of the string does not match the min value', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'min:5' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be at least 5 characters.');
        });
        it('Validation should succeed if the length of the string matches the min value', function() {
            validator.setRules({ value: 'min:3' });
            assert.ok(validator.validate());

            validator.setData({ value: '0001' }).setRules({ value: 'min:4' });
            assert.ok(validator.validate());
        });
    });
    describe('If the value is a number in a string, and has the numeric rule, then it will be compared as a number and not a string', function() {
        it('Validation should fail if the number is not greater then or equal to the min value', function() {
            validator.setData({ value: '00002' }).setRules({ value: 'numeric|min:3' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '10' }).setRules({ value: 'numeric|min:11' });
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
           assert.equal(validator.errors().first(), 'The value must be at least 11.');
        });
        it('Validation should succeed if number is greater then or equal to the min value', function() {
            validator.setData({ value: '00002' }).setRules({ value: 'numeric|min:2' });
            assert.ok(validator.validate());

            validator.setData({ value: '11' }).setRules({ value: 'numeric|min:10' });
            assert.ok(validator.validate());
        });
    });
    describe('The number under validation must be greater than or equal to min specified value', function() {
        it('Validation should fail if the number is not greater then or equal to the min value', function() {
            validator.setData({ value: 2 }).setRules({ value: 'min:3' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be at least 3.');
        });
        it('Validation should succeed if number is greater then or equal to the min value', function() {
            validator.setData({ value: 3 }).setRules({ value: 'min:2' });
            assert.ok(validator.validate());

            validator.setData({ value: 2 });
            assert.ok(validator.validate());
        });
    });
});

describe('Max', function() {
    it('Validation rule max requires at least 1 parameter', function() {
        validator.setData({ value: '1' }).setRules({ value: 'max' });
        assert.throws(() => validator.validate());
    });
    it('The parameter must be a number', function() {
        validator.setRules({ value: 'max:jad' });
        assert.throws(() => validator.validate());
    });
    describe('The length of the array must have a max value', function() {
        it('Validation should fail if the length of the array does not match the max value', function() {
            validator.setData({ value: [1, 2, 3] }).setRules({ value: 'max:2' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must not have more than 2 items.');
        });
        it('Validation should succeed if the length of the array matches the max value', function() {
            validator.setRules({ value: 'max:4' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'max:3' });
            assert.ok(validator.validate());
        });
    });
    describe('The length of the object must have a max value', function() {
        it('Validation should fail if the length of the object does not match the max value', function() {
            validator.setData({ value: { first: 'Jad', last: 'Khoury' }}).setRules({ value: 'max:1' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must not have more than 1 items.');
        });
        it('Validation should succeed if the length of the object matches the max value', function() {
            validator.setRules({ value: 'max:3' });
            assert.ok(validator.validate());

            validator.setRules({ value: 'max:2' });
            assert.ok(validator.validate());
        });

    });
    describe('The length of the string should have a max value', function() {
        it('Validation should fail if the length of the string does not match the max value', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'max:3' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must not be greater than 3 characters.');
        });
        it('Validation should succeed if the length of the string matches the max value', function() {
            validator.setRules({ value: 'max:5' });
            assert.ok(validator.validate());

            validator.setData({ value: '0001' }).setRules({ value: 'max:4' });
            assert.ok(validator.validate());
        });
    });
    describe('If the value is a number in a string, and has the numeric rule, then it will be compared as a number and not a string', function() {
        it('Validation should fail if the number is not less then or equal to the max value', function() {
            validator.setData({ value: '00002' }).setRules({ value: 'numeric|max:1' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '11' }).setRules({ value: 'numeric|max:10' });
            assert.equal(validator.validate(), false);
        }); 
        it('An error should be returned in case of failure', function() {
           assert.equal(validator.errors().first(), 'The value must not be greater than 10.');
        });
        it('Validation should succeed if number is less then or equal to the max value', function() {
            validator.setData({ value: '00002' }).setRules({ value: 'numeric|max:2' });
            assert.ok(validator.validate());

            validator.setData({ value: '10' }).setRules({ value: 'numeric|max:11' });
            assert.ok(validator.validate());
        });
    });
    describe('The number under validation must be less than or equal to max specified value', function() {
        it('Validation should fail if the number is not less then or equal to the max value', function() {
            validator.setData({ value: 4 }).setRules({ value: 'max:3' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must not be greater than 3.');
        });
        it('Validation should succeed if number is less then or equal to the max value', function() {
            validator.setData({ value: 2 }).setRules({ value: 'max:3' });
            assert.ok(validator.validate());

            validator.setData({ value: 3 });
            assert.ok(validator.validate());
        });
    });
});