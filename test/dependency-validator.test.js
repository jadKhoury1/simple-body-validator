const assert = require('assert');
const { make } = require('../lib/cjs/index');

const validator = make();


describe('Accepted If', function() {
    describe ('The field under validation must be yes, on, 1 or true if another field under validation is equal to a specified value', function() {
        it ('Validation should fail if the field is missing and the other field is equal to any of the specified values', function() {
            validator.setData({ value: 'foo' }).setRules({ terms: 'accepted_if:value,foo,test' });
            assert.equal(validator.validate(), false);
        });
        it ('Validation should fail if the field is not accepted and the other fieled is equal to any of the specified values', function() {
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
        it('Validation should succeed if the field is accepted and the othe field is esqual to any of the specified values', function() {
            validator.setData({ value: 'test', terms: ['on', 'yes', '1', 1, true, 'true']})
                .setRules({ 'terms.*': 'accepted_if:value,test,foo' });

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
            assert.ok(validator.validate);
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
        it('Validation should succeed if the field is declined and the othe field is equal to any of the specified values', function() {
            validator.setData({ value: 'test', terms: ['off', 'no', '0', 0, false, 'false']})
                .setRules({ 'terms.*': 'declined_if:value,test,foo' });

            assert.ok(validator.validate());
        });
    });
});