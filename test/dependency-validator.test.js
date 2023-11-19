const assert = require('assert');
const { make, requiredIf } = require('../lib/cjs/index');

const validator = make();


describe('Accepted If', function() {
    describe ('The field under validation must be yes, on, 1 or true if another field under validation is equal to a specified value', function() {
        it ('Validation should fail if the field is missing and the other field is equal to any of the specified values', function() {
            validator.setData({ value: 'foo' }).setRules({ terms: 'accepted_if:value,foo,test' });
            assert.equal(validator.validate(), false);
        });
        it ('Validation should fail if the field is not accepted and the other field is equal to any of the specified values', function() {
            validator.setData({ value: 'test', terms: 0 });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The terms must be accepted when value is test.');
        });
        it('Validation should succeed if the field is missing or not accepted and the other field is not equal to any of the specified values', function() {     
            validator.setData({ value: 'any' });
            assert.ok(validator.validate());

            validator.setData({ value: 'any', terms: 0 });
            assert.ok(validator.validate());
        });
        it('Validation should succeed if the other field is missing', function() {
            validator.setData({ terms: 0});
            assert.ok(validator.validate());

            validator.setData({ terms: 1 });
            assert.ok(validator.validate());
        });
        it('Validation should succeed if the field is accepted and the othe field is esqual to any of the specified values', function() {
            validator.setData({ value: 'test', terms: ['on', 'yes', '1', 1, true, 'true']})
                .setRules({ 'terms.*': 'accepted_if:value,test,foo' });

            assert.ok(validator.validate());
        });
    });
});

describe('Confirmed', function() {
    describe('The field under validation must have a matching field if {field}_confirmation.', function() {
        it('Validation shoulf fail if the {field}_confirmation is not available.', function() {
            validator.setData({ password: 'test' }).setRules({ password: 'confirmed'});
            assert.equal(validator.validate(), false);
        });
        it ('Validation should fail if the {field}_confirmation value does not match the field value.', function() {
            validator.setData({ password: 'test', password_confirmation: '1234'});
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The password confirmation does not match.');
        });
        it('Validation should succeed if the {field}_confirmation value matches the field value.', function() {
            validator.setData({ password: 'test', password_confirmation: 'test'});
            assert.ok(validator.validate());
        });
    });
});

describe('Declined If', function() {
    describe ('The field under validation must be no, off, 0 or false if another field under validation is equal to a specified value', function() {
        it ('Validation should fail if the field is missing and the other field is equal to any of the specified values', function() {
            validator.setData({ value: 'foo' }).setRules({ terms: 'declined_if:value,foo,test' });
            assert.equal(validator.validate(), false);
        });
        it ('Validation should fail if the field is not declined and the other fieled is equal to any of the specified values', function() {
            validator.setData({ value: 'test', terms: 1 });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The terms must be declined when value is test.');
        });
        it('Validation should succeed if the field is missing or not declined and the other field is not equal to any of the specified values', function() {
            validator.setData({ value: 'any' });
            assert.ok(validator.validate());

            validator.setData({ value: 'any', terms: 1 });
            assert.ok(validator.validate());
        });
        it('Validation should succeed if the other field is missing', function() {
            validator.setData({ terms: 0});
            assert.ok(validator.validate());

            validator.setData({ terms: 1 });
            assert.ok(validator.validate());
        });
        it('Validation should succeed if the field is declined and the othe field is equal to any of the specified values', function() {
            validator.setData({ value: 'test', terms: ['off', 'no', '0', 0, false, 'false']})
                .setRules({ 'terms.*': 'declined_if:value,test,foo' });

            assert.ok(validator.validate());
        });
    });
});

describe('Different', function() {
    describe('The field under validation must be different from the other field', function() {
        it('Validation should fail if both fields have the same value', function() {
            validator.setData({ value: 'test', other: 'test' }).setRules({ value: 'different:other'});
            assert.equal(validator.validate(), false);

        });
        it('Validation should fail if fields are deeply equal', function() {
            validator.setData({ value: ['1', '2'], other: ['1', '2']});
            assert.equal(validator.validate(), false);

            validator.setData({ value: {first: 'jad', any: [1, 2]}, other: {first: 'jad', any: [1, 2]}});
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value and other must be different.');
        });
        it('Validation should succeed if the other field does not exist', function() {
            validator.setData({ value: 'test' });
            assert.ok(validator.validate());
        });
        it('Validation should succeed if fields have different types', function() {
            validator.setData({ value: 1, other: '1'});
            assert.ok(validator.validate());

            validator.setData({ value: {'0': 1}, other: [1]});
            assert.ok(validator.validate());

            validator.setData({ value: null, other: {}});
            assert.ok(validator.validate());
        });
        it('Validation should succeed if both fields are different', function() {
            validator.setData({ value: {first: 'jad', any: [1, 2]}, other: {first: 'john', any: [1, 3]}});
            assert.ok(validator.validate());

            validator.setData({ value: [1, {}], other: [1, []]});
            assert.ok(validator.validate());

            validator.setData({ value: [1, {'0': 1}], other: [1, [1]]});
            assert.ok(validator.validate());

            validator.setData({ value: 'jad', other: 'john'});
            assert.ok(validator.validate());
        });
    });
});

describe('Required With', function() {
    describe ('The field under validation must be present and not empty only if any of the other specified fields are present and not empty.', function() {
        it ('Validation should fail if the field is not present when of the other fields are present', function() {
            validator.setData({ name: 'Jad' }).setRules({ last: 'required_with:name,age'});
            assert.equal(validator.validate(), false);
        });
        it ('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The last field is required when name, age is present.');
        });
        it ('Validation should succeed when field is present and any of the other specified fields are present', function() {
            validator.setData({ name: 'Jad', last: 'Khoury' });
            assert.ok(validator.validate());
        });
        it ('Validation should succeed when field is not present and all the other specified fields are not present', function() {
            validator.setData({ value: 'test' });
            assert.ok(validator.validate());
        });
    });
});

describe('Required With All', function() {
    describe('The field under validation must be present and not empty only if all of the other specified fields are present and not empty.', function() {
        it ('Validation should fail if the field is not present when all the other fields are present', function() {
            validator.setData({ name: 'Jad', age: 28 }).setRules({ last: 'required_with_all:name,age'});
            assert.equal(validator.validate(), false);
        });
        it ('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The last field is required when name, age are present.');
        });
        it ('Validation should succeed when field is present and all of the other specified fields are present', function() {
            validator.setData({ name: 'Jad', age: 28, last: 'khoury' });
            assert.ok(validator.validate());
        });
        it ('Validation should succeed when field is not present and any of the other fields are not present', function() {
            validator.setData({ name: 'Jad'});
            assert.ok(validator.validate());
        })
    });
});

describe('Required Without', function() {
    describe('The field under validation must be present and not empty only when any of the other specified fields are empty or not present.', function() {
        it ('Validation should fail if field is not present when any of the other specified fields is not present', function() {
            validator.setData({ age: 28, last: 'khoury' }).setRules({ name: 'required_without:middle,last' });
            assert.equal(validator.validate(), false);
        });
        it ('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The name field is required when middle, last is not present.');
        });
        it ('Validation should succeed when field is present and any of the other fields is not present', function() {
            validator.setData({ age: 28, name: 'Jad', last: 'Khoury'});
            assert.ok(validator.validate());
        });
        it ('Validation should succeed when field is not present and all the other fields are present', function() {
            validator.setData({ age: 28, last: 'Khoury', middle: 'Jad' });
            assert.ok(validator.validate());
        });
    });
});

describe('Required Without All', function() {
    describe('The field under validation must be present and not empty only when all of the other specified fields are empty or not present.', function() {
        it ('Validation should fail if the field is not present when all the other specified fields are not present', function() {
            validator.setData({ age: 28 }).setRules({ name: 'required_without_all:middle,last' });
            assert.equal(validator.validate(), false);
        });
        it ('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The name field is required when none of middle, last are present.');
        });
        it ('Validation should succeed when field is present and all of the other fields are not present', function() {
            validator.setData({ age: 28, name: 'Jad' });
            assert.ok(validator.validate());
        });
        it ('Validation should succeed when field is not present and any of the other fields are present', function() {
            validator.setData({ age: 28, last: 'Khoury' });
            assert.ok(validator.validate());
        });

    });
});

describe('Same', function() {
    describe('The field under validation must be same as the other field', function() {
        it('Validation should fail if both fields have different values', function() {
            validator.setData({ value: 'test', other: 'test1' }).setRules({ value: 'same:other'});
            assert.equal(validator.validate(), false);
        });
        it('Validation should fail if feilds are not deeply equal', function() {
            validator.setData({ value: ['1', '2'], other: ['1', '3']});
            assert.equal(validator.validate(), false);

            validator.setData({ value: {first: 'jad', any: [1, 2]}, other: {first: 'jad', any: [1, 3]}});
            assert.equal(validator.validate(), false);
        });
        it('Validation should fail if fields have different types', function() {
            validator.setData({ value: 1, other: '1'});
            assert.equal(validator.validate(), false);

            validator.setData({ value: {'0': 1}, other: [1]});
            assert.equal(validator.validate(), false);
        });
        it('Validation should fail if the other field does not exist', function() {
            validator.setData({ value: 'test' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value and other must match.');
        });
        it('Validation should succeed if both feilds are the same', function() {
            validator.setData({ value: {first: 'jad', any: [1, 2]}, other: {first: 'jad', any: [1, 2]}});
            assert.ok(validator.validate());

            validator.setData({ value: 'jad', other: 'jad'});
            assert.ok(validator.validate());

            validator.setData({ value: 2, other: 2});
            assert.ok(validator.validate());

            validator.setData({ value: null, other: null});
            assert.ok(validator.validate());
        });
    });
});

describe('Required If', function() {
    describe('The field under validation must be present and not empty only when the other field matches any of the specified values', function() {
        it('Validation should fail when the field is not present while the other field matches any of the specified values', function() {            
            validator.setData({ first: 'john' }).setRules({ last: 'required_if:first,jad,john'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: 'john', last: '' });
            assert.equal(validator.validate(), false);

            validator.setData({ first: 'true' }).setRules({ last: 'required_if:first,true'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: 'false' }).setRules({ last: 'required_if:first,false'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: 'null' }).setRules({ last: 'required_if:first,null'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: '0' }).setRules({ last: 'required_if:first,0,2'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: '1' }).setRules({ last: 'required_if:first,1,2'});
            assert.equal(validator.validate(), false);
        });
        it('Validation should fail when the field is not present while the other field matches any of the specified numeric values', function() {
            validator.setData({ first: 0 }).setRules({ last: 'required_if:first,0,2'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: 1 }).setRules({ last: 'required_if:first,1,2'});
            assert.equal(validator.validate(), false);
        });
        it('Validation should fail when the field is not present while the other field matches any of the specified boolean values', function() {
            validator.setData({ first: true }).setRules({ last: 'required_if:first,true'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: false }).setRules({ last: 'required_if:first,false'});
            assert.equal(validator.validate(), false);

        });
        it('Validation should fail when the field is not present while the other field matches any of the specified null values', function() {
            validator.setData({ first: null }).setRules({ last: 'required_if:first,null'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: null }).setRules({ last: 'required_if:first,Null'});
            assert.equal(validator.validate(), false);

            validator.setData({ first: null }).setRules({ last: 'required_if:first,NULL'});
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The last field is required when first is null.');
        });
        it('Validation should succeed when the field is not present and the other field does match any of the specified values', function() {
            validator.setData({ first: 'test' }).setRules({ last: 'required_if:first,john'});
            assert.ok(validator.validate());
        });
        it('Validation should succeed when the field is present and not empty', function() {
            validator.setData({ first: 'john', last: 'doe'});
            assert.ok(validator.validate());
        });
        it('Validation should succeed when the field is not present and ther other field is also not present', function() {
            validator.setData({});
            assert.ok(validator.validate());
        });
    });
});

describe('Required If Method', function() {
    describe('The field under validation must be present and not empty only when a condition is met', function() {
        it('Validation should fail when the field is not present while the requiredIf condition is met', function() {
            validator.setData({}).setRules({ name: requiredIf(true)});
            assert.equal(validator.validate(), false);

            validator.setData({ name: '' });
            assert.equal(validator.validate(), false);
        });
        it('Validation should fail when the field is not present while the function passed to the requiredIf returns true', function() {
            validator.setRules({ name: requiredIf(() => true)});
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The name field is required.');
        });
        it('Validation should succeed when the field is not present and the requiredId condition is not met', function() {
            validator.setRules({ name: requiredIf(false) });
            assert.ok(validator.validate());
        });
        it('Validation should succeed when the field is not present and the function passed to the requiredIf returns false', function() {
            validator.setRules({ name: requiredIf(() => false) });
            assert.ok(validator.validate());
        });
        it('Validation should succeed when the field is present', function() {
            validator.setData({ name: 'jad' }).setRules({ name: requiredIf(true)});
            assert.ok(validator.validate());
        });
    });
});

describe('Required Unless', function() {
    describe('The field under validation must be present and not empty unless the other field matches any of the specified values', function() {
        it('Validation should fail if the field under validation is not present while the other field does not match any of the specified values', function() {        
            validator.setData({ first: 'john' }).setRules({last: 'required_unless:first,test,jad'});
            assert.equal(validator.validate(), false);
        });
        it('Validation should fail if the field under validation is present but empty while the other field does not match any of specified values', function() {
            validator.setData({ first: 'john', last: ''});
            assert.equal(validator.validate(), false);
        });
        it('Validation should fail if both fields are not present and null is not one of the specied values', function() {
            validator.setData({});
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned to the user in case of failure', function() {
            assert.equal(validator.errors().first(), 'The last field is required unless first is in test, jad.');
        });
        it('Validation should succeed if the field under validation is present and not empty while the other field does not match any of the specified values', function() {
            validator.setData({ first: 'john', last: 'doe' }).setRules({last: 'required_unless:first,test,jad'});
            assert.ok(validator.validate());
        });
        it('Validation should succeed if the field under validation is not present while the other field matches any of the specified values', function() {
            validator.setData({ first: 'jad' }).setRules({last: 'required_unless:first,test,jad'});
            assert.ok(validator.validate());
        });
        it('Validation should succeed if the field under validation is not present while the other field matches any of the specified numeric values', function() {
            validator.setData({ first: 0 }).setRules({last: 'required_unless:first,0,2'});
            assert.ok(validator.validate());

            validator.setData({ first: 1 }).setRules({last: 'required_unless:first,1,2'});
            assert.ok(validator.validate());
        });
        it('Validation should succeed if the field under validation is not present while the other field matches any of the specified boolean values', function() {
            validator.setData({ first: true }).setRules({last: 'required_unless:first,true'});
            assert.ok(validator.validate());

            validator.setData({ first: false }).setRules({last: 'required_unless:first,false'});
            assert.ok(validator.validate());
        });
        it('Validation should succeed if the field under validation is not present while the other field matches any of the specified null values', function() {
            validator.setData({ first: null }).setRules({last: 'required_unless:first,null'});
            assert.ok(validator.validate());

            validator.setData({ first: null }).setRules({last: 'required_unless:first,Null'});
            assert.ok(validator.validate());

            validator.setData({ first: null }).setRules({last: 'required_unless:first,NULL'});
            assert.ok(validator.validate());
        });
        it('Validation should fail if both fields are not present and null is one of the specied values', function() {
            validator.setData({}).setRules({last: 'required_unless:first,NULL'});
            assert.ok(validator.validate());
        });
    });
});