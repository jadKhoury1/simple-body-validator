const assert = require('assert');
const { make } = require('../lib/cjs/index');

const validator = make();

describe('Accepted', function() {
  describe('The field under validation be yes, on, 1 or true', function() {
    it('Validation should fail in case value does not match any of the above values', function() {
      validator.setData({ value: 'off' }).setRules({ value: 'accepted' });
      assert.equal(validator.validate(), false);
    });
    it('An error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be accepted.');
    });
    it('Validation should succeed if value is accepted', function() {
      validator.setData({ value: ['on', 'yes', '1', 1, true, 'true'] })
        .setRules({ 'value.*': 'accepted' });

      assert.ok(validator.validate());
    });
  });
});

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
            assert.equal(validator.errors().first(), 'The value must be an array.');
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
        assert.equal(validator.errors().first(), 'The value must only contain letters.');
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
        assert.equal(validator.errors().first(), 'The value must only contain letters, numbers, dashes and underscores.');
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
        assert.equal(validator.errors().first(), 'The value must only contain letters and numbers.');
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
       assert.equal(validator.errors().first(), 'The value field must be true or false.');
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

describe('Declined', function() {
  describe('The field under validation be no, off, 0 or false', function() {
    it('Validation should fail in case value does not match any of the above values', function() {
      validator.setData({ value: 'on' }).setRules({ value: 'declined' });
      assert.equal(validator.validate(), false);
    });
    it('An error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be declined.');
    });
    it('Validation should succeed if value is accepted', function() {
      validator.setData({ value: ['off', 'no', '0', 0, false, 'false'] })
        .setRules({ 'value.*': 'declined' });

      assert.ok(validator.validate());
    });
  });
});

describe('Digits', function() {
  it('Validation rule digits requires 1 parameter', function() {
    validator.setData({ value: 'test' }).setRules({ value: 'digits' });
    assert.throws(() => validator.validate());
  });
  it('Validation rule digits requires the parameter to be an integer', function() {
    validator.setRules({ value: 'digits:1.3'});
    assert.throws(() => validator.validate());
  });
  it('Validation rule digits requires the parameter to be an integer greater than 0', function() {
    validator.setRules({ value: 'digits:-1'});
    assert.throws(() => validator.validate());
  });
  describe('The field under validation must be numeric and must have an exact length of value.', function () {
    it('Validation should fail if field under validation is not a number', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'digits:4' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: { name: 'test' }});
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if field under validation is decimal', function() {
      validator.setData({ value: 12.3 });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if number does not match the number of digits', function() {
      validator.setData({ value: 123 });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 0123 });
      assert.equal(validator.validate(), false);

      validator.setData({ value: '012' });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be 4 digits.');
    });
    it('Validation should succeed in case the number matches the specified the number of digits', function() {
      validator.setData({ value: 1234 });
      assert.ok(validator.validate());

      validator.setData({ value: '0123' });
      assert.ok(validator.validate());
    });
  });
});

describe('Digits Between', function() {
  it('Validation rule digits_between requires 2 parameters', function() {
    validator.setRules({ value: 'digits_between' });
    assert.throws(() => validator.validate());
  });
  it('Validation rule digits_between requires the min and max parameters to be integers', function() {
    validator.setRules({ value: 'digits_between:1.3,jads'});
    assert.throws(() => validator.validate());
  });
  it('Validation rule digits_between requires the parameters to be an integer greater than 0', function() {
    validator.setRules({ value: 'digits_between:-1,3'});
    assert.throws(() => validator.validate());
  });
  it('Validation rule digits_between requires the max param to be greater than the min param', function() {
     validator.setRules({ value: 'digits_between:3,2'});
     assert.throws(() => validator.validate());
  });

  describe('The field under validation must have a length between the given min and max', function() {
    it('Validation should fail if field under validation is not a number', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'digits_between:4,5' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: { name: 'test' }});
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if field under validation is decimal', function() {
      validator.setData({ value: 12.3 });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if number does not match the specifided digits range', function() {
      validator.setData({ value: 123 });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 0123 });
      assert.equal(validator.validate(), false);

      validator.setData({ value: '012456' });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be between 4 and 5 digits.');
    });
    it('Validation should succeed in case the number matches the specified digits range', function() {
      validator.setData({ value: 1234 });
      assert.ok(validator.validate());

      validator.setData({ value: '01230' });
      assert.ok(validator.validate());
    });
  });
});

describe('Email', function() {
  describe('The field under validation must be formatted as an e-mail address.', function() {
    it('Validation should fail if field under validation is not an email', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'email' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 'test@test.o' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 'test@te$%st.o' });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be a valid email address.');
    });
    it('Validation should succeed if field under validation is an email', function() {
      validator.setData({ value: 'test@gtest.com' });
      assert.ok(validator.validate());

      validator.setData({ value: 'tEst@gtEst.cOm' });
      assert.ok(validator.validate());
      
      validator.setData({ value: 'test@test.online' });
      assert.ok(validator.validate());
    });
  })
});

describe('Ends With', function() {
  it('Validation rule ends_with requires at least 1 parameter', function() {
    validator.setData({ value: 'test' }).setRules({ value: 'ends_with' });
    assert.throws(() => validator.validate());
  });
  it('Validation should fail if value is not a string', function() {
    validator.setData({ value: [] }).setRules({ value: 'ends_with:test' });
    assert.throws(() => validator.validate());
  });
  describe('The field under validation must end with one of the given values.', function() {
    it('Validation should fail if field under validation does not end with one of the given values', function() {
        validator.setData({ value: 'test' }).setRules({ value: 'ends_with:john,doe' });
        assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must end with one of the following: john, doe.');
    });
    it('Validation should succeed if field under validation ends with one of the given values', function() {
        validator.setData({ value: 'john' });
        assert.ok(validator.validate());

        validator.setData({ value: 'john doe' });
        assert.ok(validator.validate());
    });
  });
});

describe('Json', function() {
  describe('The field under validation must be a valid JSON string', function() {
    it('Validation should fail in case value is not a valid JSON string', function() {
      validator.setData({ value: 'Jad Khoury' }).setRules({ value: 'json' });
      assert.equal(validator.validate(), false);
    });
    it('An error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be a valid JSON string');
    });
    it('Validation should succeed in case value is a valid JSON string', function() {
      validator.setData({ value: '{"first": "jad", "last": "khoury"}'});
      assert.ok(validator.validate());
    });
  });
})

describe('Object', function() {
  describe('The field under validation must be an object', function() {
    it('Validation should fail in case value is not an object', function() {
      validator.setData({ value: [1,2]}).setRules({ value: 'object' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 2 });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 'test' });
      assert.equal(validator.validate(), false);

    });
    it('An Error Message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be an object.');
    });
    it('Validation should succeed in case value is an object', function() {
          validator.setData({ value: {} });
          assert.ok(validator.validate());
    });
  });
});

describe('Starts With', function() {
  it('Validation rule starts_with requires at least 1 parameter', function() {
    validator.setData({ value: 'test' }).setRules({ value: 'starts_with' });
    assert.throws(() => validator.validate());
  });
  it('Validation should fail if value is not a string', function() {
    validator.setData({ value: [] }).setRules({ value: 'starts_with:test' });
    assert.throws(() => validator.validate());
  });
  describe('The field under validation must start with one of the given values.', function() {
    it('Validation should fail if field under validation does not start with one of the given values', function() {
        validator.setData({ value: 'test' }).setRules({ value: 'starts_with:john,doe' });
        assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
        assert.equal(validator.errors().first(), 'The value must start with one of the following: john, doe.');
    });
    it('Validation should succeed if field under validation starts with one of the given values', function() {
        validator.setData({ value: 'john test' });
        assert.ok(validator.validate());
    });
  });

});