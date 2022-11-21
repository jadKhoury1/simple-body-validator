const assert = require('assert');
const { make } = require('../lib/cjs/index');

const validator = make();


describe('After', function() {
    it('Validation rule after requires at least 1 parameter', function() {
        validator.setData({ value: '2020' }).setRules({ value: 'after' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation must be a date', function() {
        validator.setData({ value: 'test' }).setRules({ value: 'after:2020' });
        assert.throws(() => validator.validate());
    });
    it('Validation rule after requires the parameter to be a date', function () {
        validator.setData({ value: '2020' }).setRules({ value: 'after:test'});
        assert.throws(() => validator.validate());
      

        validator.setData({ value: '2020', other_value: 'test' }).setRules({ value: 'after:other_value'});
        assert.throws(() => validator.validate());
    });
    describe('The field under validation must be a value after a given date', function() {
        it('Validation should fail if date does not come after the given date', function() {
            validator.setData({ value: '2019' }).setRules({ value: 'after:2020' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 07:15' }).setRules({ value: 'after:2021-12-11 08:14'});
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:30' }).setRules({ value: 'after:2021-12-11 08:30:30'});
            assert.equal(validator.validate(), false);

        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date after 2021-12-11 08:30:30.')
        });
        it('Validation should succeed if the value is a date that comes after the given date', function() {
            validator.setData({ value: '2021-12-11 08:30:31' });
            assert.ok(validator.validate());
        });
    });

    describe('The field under validation must be a value greater than the other field\'s date', function() {
        it('Validation should fail if date is not greater than the other field\'s date', function() {
            validator.setData({ value: '2019', other_value: '2020' }).setRules({ value: 'after:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 07:15', other_value: '2021-12-11 08:14' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:30', other_value: '2021-12-11 08:30:30' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date after other value.')
        });
        it('Validation should succeed if the value is a date greater than the given date', function() {
            validator.setData({ value: '2022', other_value: '2021' });
            assert.ok(validator.validate());
        });
    });
});


describe('After or Equal', function() {
    it('Validation rule after_or_equal requires at least 1 parameter', function() {
        validator.setData({ value: '2020' }).setRules({ value: 'after_or_equal' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation must be a date', function() {
        validator.setData({ value: 'test' }).setRules({ value: 'after_or_equal:2020' });
        assert.throws(() => validator.validate());
    });
    it('Validation rule after_or_equal requires the parameter to be a date', function () {
        validator.setData({ value: '2020' }).setRules({ value: 'after_or_equal:test'});
        assert.throws(() => validator.validate());
      

        validator.setData({ value: '2020', other_value: 'test' }).setRules({ value: 'after_or_equal:other_value'});
        assert.throws(() => validator.validate());
    });
    describe('The field under validation must be a value after or equal a given date', function() {
        it('Validation should fail if date does not come after or equal to the given date', function() {
            validator.setData({ value: '2019' }).setRules({ value: 'after_or_equal:2020' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 07:15' }).setRules({ value: 'after_or_equal:2021-12-11 08:14'});
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:29' }).setRules({ value: 'after_or_equal:2021-12-11 08:30:30'});
            assert.equal(validator.validate(), false);

        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date after or equal to 2021-12-11 08:30:30.')
        });
        it('Validation should succeed if the value is a date that comes after or equal the given date', function() {
            validator.setData({ value: '2021-12-11 08:30:30' });
            assert.ok(validator.validate());
        });
    });

    describe('The field under validation must be a value greater than or equal to the other field\'s date', function() {
        it('Validation should fail if date is not greater than or equal to the other field\'s date', function() {
            validator.setData({ value: '2019', other_value: '2020' }).setRules({ value: 'after_or_equal:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 07:15', other_value: '2021-12-11 08:14' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:29', other_value: '2021-12-11 08:30:30' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date after or equal to other value.')
        });
        it('Validation should succeed if the value is a date greater than or equal the given date', function() {
            validator.setData({ value: '2021', other_value: '2021' });
            assert.ok(validator.validate());
        });
    });
});

describe('Before', function() {
    it('Validation rule before requires at least 1 parameter', function() {
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
    describe('The field under validation must be a value preceding the given date', function() {
        it('Validation should fail if date does not precede the given date', function() {
            validator.setData({ value: '2021' }).setRules({ value: 'before:2020' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 13:15' }).setRules({ value: 'before:2021-12-11 08:14'});
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:30' }).setRules({ value: 'before:2021-12-11 08:30:30'});
            assert.equal(validator.validate(), false);

        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date before 2021-12-11 08:30:30.')
        });
        it('Validation should succeed if the value is a date preceding the given date', function() {
            validator.setData({ value: '2021-12-11 08:29:30' });
            assert.ok(validator.validate());
        });
    });

    describe('The field under validation must be a value preceding another field\'s date', function() {
        it('Validation should fail if date does not precede the other field\'s date', function() {
            validator.setData({ value: '2021', other_value: '2020' }).setRules({ value: 'before:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 13:15', other_value: '2021-12-11 08:14' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:30', other_value: '2021-12-11 08:30:30' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date before other value.')
        });
        it('Validation should succeed if the value is a date preceding the given date', function() {
            validator.setData({ value: '2020', other_value: '2021' });
            assert.ok(validator.validate());
        });
    });
});


describe('Before or Equal', function() {
    it('Validation rule before_or_equal requires at least 1 parameter', function() {
        validator.setData({ value: '2020' }).setRules({ value: 'before_or_equal' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation must be a date', function() {
        validator.setData({ value: 'test' }).setRules({ value: 'before_or_equal:2020' });
        assert.throws(() => validator.validate());
    });
    it('Validation rule before_or_equal requires the parameter to be a date', function () {
        validator.setData({ value: '2020' }).setRules({ value: 'before_or_equal:test'});
        assert.throws(() => validator.validate());
      

        validator.setData({ value: '2020', other_value: 'test' }).setRules({ value: 'before_or_equal:other_value'});
        assert.throws(() => validator.validate());
    });
    describe('The field under validation must be a value preceeing or equal to the given date', function() {
        it('Validation should fail if date does not precede or is equal the given date', function() {
            validator.setData({ value: '2021' }).setRules({ value: 'before_or_equal:2020' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 13:15' }).setRules({ value: 'before_or_equal:2021-12-11 08:14'});
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:31' }).setRules({ value: 'before_or_equal:2021-12-11 08:30:30'});
            assert.equal(validator.validate(), false);

        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date before or equal to 2021-12-11 08:30:30.')
        });
        it('Validation should succeed if the value is a date preceding or equal the given date', function() {
            validator.setData({ value: '2021-12-11 08:30:30' });
            assert.ok(validator.validate());
        });
    });

    describe('The field under validation must be a value preceding or equal another field\'s date', function() {
        it('Validation should fail if date does not precede or is euqal to the other field\'s date', function() {
            validator.setData({ value: '2021', other_value: '2020' }).setRules({ value: 'before_or_equal:other_value' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 13:15', other_value: '2021-12-11 08:14' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:31', other_value: '2021-12-11 08:30:30' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date before or equal to other value.')
        });
        it('Validation should succeed if the value is a date preceding or equal to the given date', function() {
            validator.setData({ value: '2020', other_value: '2021' });
            assert.ok(validator.validate());
        });
    });
});


describe('Date', function() {
    describe('The field under validation must be a valid date', function() {
        it('Validation should fail in case the value is not a date', function() {
            validator.setData({ value: 'test' }).setRules({ value: 'date' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2020-13-12' });
            assert.equal(validator.validate(), false);
        });
        it('An error message should be retuerned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value is not a valid date.');
        });
        it('Validation should succeed in case value is a valid date', function() {
            validator.setData({ value: '2021-12-12 12:30:30' });
            assert.ok(validator.validate());

            validator.setData({ value: 'Mon Dec 20 2021' });
            assert.ok(validator.validate());
        });
    })
});

describe('Date Equals', function() {
    it('Validation rule date_equals requires at least 1 parameter', function() {
        validator.setData({ value: '2020' }).setRules({ value: 'date_equals' });
        assert.throws(() => validator.validate());
    });
    it('The field under validation must be a date', function() {
        validator.setData({ value: 'test' }).setRules({ value: 'date_equals:2020' });
        assert.throws(() => validator.validate());
    });
    it('Validation rule date_equals requires the parameter to be a date', function () {
        validator.setData({ value: '2020' }).setRules({ value: 'date_equals:test'});
        assert.throws(() => validator.validate());
      
        validator.setData({ value: '2020', other_value: 'test' }).setRules({ value: 'date_equals:other_value'});
        assert.throws(() => validator.validate());
    });
    describe('The field under validation must be equal to the given date', function() {
        it('Validation should fail if value is not equal to given date', function() {
            validator.setData({ value: '2021' }).setRules({ value: 'date_equals:2020' });
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 13:15' }).setRules({ value: 'date_equals:2021-12-11 08:14'});
            assert.equal(validator.validate(), false);

            validator.setData({ value: '2021-12-11 08:30:31' }).setRules({ value: 'date_equals:2021-12-11 08:30:30'});
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date equal to 2021-12-11 08:30:30.')
        });
        it('Validation should succeed if the value is a equal to the given date', function() {
            validator.setData({ value: '2021-12-11 08:30:30'});
            assert.ok(validator.validate());
        });
    });
    describe('The field under validation must be equal to another field\'s date', function() {
        it('Validation should fail if value is not equal to the other field\'s date', function() {
            validator.setData({ value: '2021', other_value: '2020' }).setRules({ value: 'date_equals:other_value' });
            assert.equal(validator.validate(), false);
    
            validator.setData({ value: '2021-12-11 13:15', other_value: '2021-12-11 08:14' });
            assert.equal(validator.validate(), false);
    
            validator.setData({ value: '2021-12-11 08:30:31', other_value: '2021-12-11 08:30:30' });
            assert.equal(validator.validate(), false);
        });
        it('An error should be returned in case of failure', function() {
            assert.equal(validator.errors().first(), 'The value must be a date equal to other value.')
        });
        it('Validation should succeed if the value is a equal to the given date', function() {
            validator.setData({ value: '2021', other_value: '2021' });
            assert.ok(validator.validate());
        });
    });
});