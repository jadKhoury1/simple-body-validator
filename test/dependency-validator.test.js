const assert = require('assert');
const { make } = require('../lib/index');

const validator = make();


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