const assert = require('assert');
const { make, ruleIn, ruleNotIn } = require('../lib/cjs/index');

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

describe('Array Unique', function() {
  describe('The field under validation must be an array and must have unique values', function() {
    it('Validation should fail if value is not an array', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'array_unique' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 2 });
      assert.equal(validator.validate(), false);

      validator.setData({ value: { name: 'test' }});
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value is an array without unique values', function() {
      validator.setData({ value: ['test', 'test'] });
      assert.equal(validator.validate(), false);
    });
    it('An Error Message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be an array with unique values.');
    });
    it('Validation should succeed if value is an array with unique arrays', function() {
      validator.setData({ value: [1, 2, 3] });
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
    it('Validation should fail in case the value is neither of type string or number', function() {
        validator.setData({ value: []}).setRules({value: 'alpha_dash'});
        assert.equal(validator.validate(), false);
    });
    it('Validation should fail in case value does not contain at least one alpha numeric character', function() {
        validator.setData({ value: '_'});
        assert.equal(validator.validate(), false);
    });
    it('Validation should fail in case value does not only contain alpha-numeric characters, dashes and underscores', function () {
      validator.setData({ value: 'test_$2'}).setRules({ value: 'alpha_dash' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: '$^(' });
      assert.equal(validator.validate(), false);

    });
    it('An Error Message should be returned in case of failure', function() {
        assert.equal(validator.errors().first(), 'The value must only contain at least one letter or one number, and optionally dashes and underscores.');
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
    it('Validation should fail in case value is neither a string or a number', function() {
      validator.setData({ value: [] });
      assert.equal(validator.validate(), false);
    });
    it('An Error Message should be returned in case of failure', function() {
        assert.equal(validator.errors().first(), 'The value must only contain letters and numbers.');
    });
    it('Validation should succeed in case value contain only alphabetic characters', function() {
        validator.setData({ value: 'test123' });
        assert.ok(validator.validate());

        validator.setData({ value: 123 });
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
    it('Validation should succeed in case the number matches the specified number of digits', function() {
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

      validator.setData({ value: 1 });
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

describe('Integer', function() {
  describe('The field under validation must be an integer', function() {
    it('Validation should fail in case value is not an ineteger', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'integer' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail in case value is null', function() {
      validator.setData({ value: null });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail in case value is a decimal', function() {
      validator.setData({ value: 1.3 });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail in case value is not of type number when strict rule is added', function() {
      validator.setData({ value: '1' }).setRules({ value: 'integer|strict' });
      assert.equal(validator.validate(), false);
    });
    it('An error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be an integer.');
    });
    it('Validation should succeed when value is an integer', function() {
      validator.setData({ value: '1' }).setRules({ value: 'integer'});
      assert.ok(validator.validate());

      validator.setData({ value: 0 });
      assert.ok(validator.validate());
    });
    it('Validation should succeed when value is negative', function() {
      validator.setData({ value: -23 });
      assert.ok(validator.validate());

      validator.setData({ value: '-23' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed when value is of type number and strict rule is added', function() {
      validator.setData({ valu: 2 }).setRules({ value: 'integer|strict'});
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
    it('Validation should fail in case value is null', function() {
      validator.setData({ value: null });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail in case value is not of type string', function() {
      validator.setData({ value: {name: 'test' }});
      assert.equal(validator.validate(), false);

      validator.setData({ value: 12 });
      assert.equal(validator.validate(), false);
    });
    it('An error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be a valid JSON string.');
    });
    it('Validation should succeed in case value is a valid JSON string', function() {
      validator.setData({ value: '{"first": "jad", "last": "khoury"}'});
      assert.ok(validator.validate());
    });
  });
});

describe('Numeric', function() {
  describe('The field under validation must be numeric', function() {
    it('Validation should fail in case value is not numeric', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'numeric' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail in case value is null', function() {
      validator.setData({ value: null });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail in case value is not of type number when strict rule is added', function() {
      validator.setData({ value: '1' }).setRules({ value: 'numeric|strict' });
      assert.equal(validator.validate(), false);
    });
    it('An error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be a number.');
    });
    it('Validation should succeed when value is numeric', function() {
      validator.setData({ value: '1' }).setRules({ value: 'numeric'});
      assert.ok(validator.validate());

      validator.setData({ value: 0 });
      assert.ok(validator.validate());
    });
    it('Validation should succeed when value is a decimal', function() {
      validator.setData({ value: 2.3 });
      assert.ok(validator.validate());

      validator.setData({ value: '2.3' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed when value is negative', function() {
      validator.setData({ value: -23 });
      assert.ok(validator.validate());

      validator.setData({ value: '-23' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed when value is of type number and strict rule is added', function() {
      validator.setData({ valu: -2.3 }).setRules({ value: 'numeric|strict'});
      assert.ok(validator.validate());
    });
  });
});

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

describe('Size', function() {
  describe('Validation should validate the size of the string', function() {
    it('Validation should fail if the provided size does not match the length of the string', function() {
      validator.setData({ value: 'jad' }).setRules({ value: 'size:4' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: '4' });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be 4 characters.');
    });
    it('Validation should succeed if the provided size does match the length of the string', function() {
      validator.setData({ value: 'john' });
      assert.ok(validator.validate());

      validator.setData({ value: '1234' });
      assert.ok(validator.validate());
    });
  });
  describe('Validation should validate that the provided size matches the number', function() {
    it('Validation should fail if the provided size does not match the number value', function() {
      validator.setData({ value: 12 }).setRules({ value: 'size:20' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if the provided size does not match the number in a string with numeric rule', function() {
      validator.setData({ value: '12'}).setRules({ value: 'size:2|numeric'});
      assert.equal(validator.validate(), false);

      validator.setData({ value: '12'}).setRules({ value: 'size:2|integer'});
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be 2.');
    });
    it('Validation should succeed if the provided size matches the number value', function() {
      validator.setData({ value: 20 }).setRules({ value: 'size:20' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if the provided size matches a number in a string that has numeric rule', function() {
      validator.setData({ value: '20' }).setRules({ value: 'size:20|numeric' });
      assert.ok(validator.validate());

      validator.setData({ value: '20' }).setRules({ value: 'size:20|integer' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if the provided size matches a decimal', function() {
      validator.setData({ value: 1.2 }).setRules({ value: 'size:1.2' });
      assert.ok(validator.validate());

      validator.setData({ value: '1.2' }).setRules({ value: 'size:1.2|numeric'});
      assert.ok(validator.validate());
    });
    it('Validation should succeed if the provided size matches a negative number', function() {
      validator.setData({ value: -2 }).setRules({ value: 'size:-2'});
      assert.ok(validator.validate());

      validator.setData({ value: '-2.4' }).setRules({ value: 'size:-2.4|numeric'});
      assert.ok(validator.validate());

      validator.setData({ value: '-2' }).setRules({ value: 'size:-2|integer'});
      assert.ok(validator.validate());
    });
  });
  describe('Validation should validate that the provided size matches the length of the array', function() {
    it('Validation should fail if the provided size does not match the length of the array', function() {
      validator.setData({ value: [1,2] }).setRules({ value: 'size:4'});
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must contain 4 items.');
    });
    it('Validation should succeed if the provided size does match the length of the array', function() {
      validator.setData({ value: [1,2,3,4] });
      assert.ok(validator.validate());
    });
  });
  describe('Validation should validate that the provided size matches the length of the object', function() {
    it('Validation should fail if the provided size does not match the length of the object', function() {
      validator.setData({ value: {first: 'jad'} }).setRules({ value: 'size:2'});
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must contain 2 items.');
    });
    it('Validation should succeed if the provided size does match the length of the object', function() {
      validator.setData({ value: { first: 'john', last: 'doe' }});
      assert.ok(validator.validate());
    });
  });
});

describe('Sometimes', function() {
  it('Validation should succeed if the field is not present', function() {
    validator.setData({ first: 'jad' }).setRules({ first: 'required', last: 'sometimes|required|string'});
    assert.ok(validator.validate());

  });
  it('Validation should succeed if the field is present and matches the rules', function() {
      validator.setData({ first: 'john',  last: 'doe'});
      assert.ok(validator.validate());
  });
  it('Validation should fail if the field is present but does not match the specified rules', function() {
      validator.setData({ first: 'john', last: '' });
      assert.equal(validator.validate(), false);
  });
});

describe('Required', function() {
  describe('The field under validation must be present and not empty', function() {
    it('Validation should fail if value is not present', function() {
      validator.setData({}).setRules({ name: 'required' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value is null', function() {
      validator.setData({ name: null });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value is undefined', function() {
      validator.setData({ name: undefined });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value is en empty string', function() {
      validator.setData({ name: '' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value is an empty array', function() {
      validator.setData({ name: [] });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value is an empty object', function() {
      validator.setData({ name: {} });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The name field is required.');
    });
    it('Validation should succeed if value is present and not empty', function() {
      validator.setData({ name: 'jad' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if value is false boolean', function() {
      validator.setData({ name: false});
      assert.ok(validator.validate());
    });
    it('Validation should succeed if value is equal to 0', function() {
      validator.setData({ name: 0 });
      assert.ok(validator.validate());
    });
  });
});

describe('Present', function() {
  describe('Field under validation must be present', function() {
    it('Validation should fail if value is not present', function() {
        validator.setData({}).setRules({ value: 'present'});
        assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value field must be present.');
    });
    it('Validation should succeed if value is present', function() {
        validator.setData({ value: 'test' });
        assert.ok(validator.validate());

        validator.setData({ value: 0 });
        assert.ok(validator.validate());
    });
    it('Validation should succeed if value is present but empty', function() {
      validator.setData({ value: '' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if value is present but equal to null', function() {
      validator.setData({ value: null });
      assert.ok(validator.validate());
    });
  });
});

describe('In', function() {
  describe('Field under validation must be included in the given list of values', function() {
    it('Validation should fail if the field under validation is not included in the list of values', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'in:john,any,true,4'});
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value is null', function() {
      validator.setData({ value: null });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if the field under validation is neither a string or a number', function() {
      validator.setData({ value: {name: 'jad'} });
      assert.equal(validator.validate(), false);

      validator.setData({ value: true });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be one of the following john, any, true, 4.');
    });
    it('Validation should succeed if the field under validation is included in the list of values', function() {
        validator.setData({ value: 'john' });
        assert.ok(validator.validate());

        validator.setData({ value: '4' });
        assert.ok(validator.validate());
    });
    it('Validation should succeed if the field under validation is equal to a number that is included in the list of values', function() {
        validator.setData({ value: 4 });
        assert.ok(validator.validate());
    });
  });
  describe('All fields under validation must be included in the list of values', function() {
    it('Validation should fail if any of the fields under validation is not included in the list of values', function() {
      validator.setData({ value: ['jad', 'john'] });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if any of the fields is null', function() {
      validator.setData({ value: ['john', null ]});
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if any of field under validation is neither a string or number', function() {
      validator.setData({ value: ['john', true] });
      assert.equal(validator.validate(), false);

      validator.setData({ value: ['john', []] });
      assert.equal(validator.validate(), false);

      validator.setData({ value: ['john', {}] });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be one of the following john, any, true, 4.');
    });
    it('Validation should succeed if all the fields under validation are in included in the list of values', function() {
      validator.setData({ value: ['john', 4, 'true' ] });
      assert.ok(validator.validate());

      validator.setData({ value: ['john', 4, 'true' ] }).setRules({ 'value.*': 'in:john,any,true,4' });
      assert.ok(validator.validate());
    });
  });
});

describe('ruleIn Function', function() {
  describe('Field under validation must be included in the given list of values', function() {
    it('Validation should fail if the field under validation is not included in the list of values', function() {
      validator.setData({ value: 'jad' }).setRules({ value: ruleIn(['john', 'any', 'true' ,'4']) });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must be one of the following john, any, true, 4.');
    });
    it('All the values in the value list will be transformed to a string', function() {
      validator.setData({ value: true }).setRules({ value: ruleIn([ true ])});
      assert.equal(validator.validate(), false);

      validator.setData({ value: 'true' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if the field under validation is included in the list of values', function() {
      validator.setData({ value: 'john' }).setRules({ value: ruleIn(['john', 'any', 'true' ,'4']) });
      assert.ok(validator.validate());

      validator.setData({ value: '4' });
      assert.ok(validator.validate());

      validator.setData({ value: 4 });
      assert.ok(validator.validate());
    });
  });
});

describe('Nullable', function() {
  describe('The field under validation may be null', function() {
    it('Validation should fail if the field under validation is null and the nullable rule is not present', function() {
      validator.setData({ value: null }).setRules({ value: 'string' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should succeed if the field under validation is null and the nullable field is present', function() {
      validator.setData({ value: null }).setRules({ value: 'string|nullable' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if the field under validation is not empty and the nullable field is present', function() {
      validator.setData({ value: 'jad' }).setRules({ value: 'string|nullable' });
      assert.ok(validator.validate());
    });
  });
});

describe('Not In', function() {
  describe('Field under validation must not be included in the given list of values', function() {
    it('Validation should fail if the field under validation is included in the list of values', function() {
      validator.setData({ value: 'john' }).setRules({ value: 'not_in:john,any,true,4'});
      assert.equal(validator.validate(), false);

      validator.setData({ value: 4 });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The selected value is invalid.');
    });
    it('Validation should succeed if the field under validation is not included in the list of values', function() {
        validator.setData({ value: 'jad' });
        assert.ok(validator.validate());

        validator.setData({ value: '3' });
        assert.ok(validator.validate());
    });
    it('Validation should succeed if the field under validation is equal to a number that is not included in the list of values', function() {
        validator.setData({ value: 3 });
        assert.ok(validator.validate());
    });
    it('Validation should succceed if value is null', function() {
      validator.setData({ value: null });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if the field under validation is neither a string or a number', function() {
      validator.setData({ value: {name: 'jad'} });
      assert.ok(validator.validate());

      validator.setData({ value: true });
      assert.ok(validator.validate());
    });
  });
  describe('All fields under validation must not be included in the list of values', function() {
    it('Validation should fail if any of the fields under validation is included in the list of values', function() {
      validator.setData({ value: ['jad', 'john'] }).setRules({ value: 'not_in:john,any,true,4'});
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The selected value is invalid.');
    });
    it('Validation should succeed if any of the fields is null, and the other fields are not included in the list of values', function() {
      validator.setData({ value: [ null ]});
      assert.ok(validator.validate());

      validator.setData({ value: [ 'test', null ]});
      assert.ok(validator.validate(), false);
    });
    it('Validation should succeed if any of the fields under validation is neither a string or number, and the other fields are not included in the list of values', function() {
      validator.setData({ value: ['test', true] });
      assert.ok(validator.validate());

      validator.setData({ value: [false] });
      assert.ok(validator.validate());

      validator.setData({ value: ['test', []] });
      assert.ok(validator.validate());

      validator.setData({ value: [{}] });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if all the fields under validation are not in included in the list of values', function() {
      validator.setData({ value: ['test', 3 ] });
      assert.ok(validator.validate());

      validator.setData({ value: ['test', 3 ] }).setRules({ 'value.*': 'not_in:john,any,true,4' });
      assert.ok(validator.validate());
    });
  });
});

describe('ruleNotIn Function', function() {
  describe('Field under validation must not be included in the given list of values', function() {
    it('Validation should fail if the field under validation is included in the list of values', function() {
      validator.setData({ value: 'john' }).setRules({ value: ruleNotIn(['john', 'any', 'true' ,'4']) });
      assert.equal(validator.validate(), false);

      validator.setData({ value: '4' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 4 });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The selected value is invalid.');
    });
    it('All the values in the value list will be transformed to a string', function() {
      validator.setData({ value: true }).setRules({ value: ruleNotIn([ true ])});
      assert.ok(validator.validate());

      validator.setData({ value: 'true' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should succeed if the field under validation is not included in the list of values', function() {
      validator.setData({ value: 'test' }).setRules({ value: ruleNotIn(['john', 'any', 'true' ,'4']) });
      assert.ok(validator.validate());
    });
  });
});

describe('URL', function() {
  describe('Field under validation must be a valid url', function() {
    it('Validation should fail if value does not have a valid url format', function() {
      validator.setData({ value: 'test' }).setRules({ value: 'url' });
      assert.equal(validator.validate(), false);

      validator.setData({ value: 'eee.t'});
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value has an ivalid protocol', function() {
      validator.setData({ value: 'hbtp://test.com'});
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value has an invalid ip format', function() {
      validator.setData({ value:  '2752.275.275.275' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value has an invalid port format', function() {
      validator.setData({ value: '255.255.255.255:jad'});
      assert.equal(validator.validate(), false);

      validator.setData({ value: 'test.com:jad'});
      assert.equal(validator.validate(), false);
    })
    it('Validation should fail if value has invalid path paramters format', function() {
      validator.setData({ value: 'test.com/$%'});
      assert.equal(validator.validate(), false);
    });
    it('Validation shoulf fail if value has invalid query paramters format', function() {
      validator.setData({ value: 'test.com?$%'});
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value has an invalid fragment locator format', function() {
      validator.setData({ value: 'test.com#$&' });
      assert.equal(validator.validate(), false);
    });
    it('Validation should fail if value is not of type string', function() {
      validator.setData({ value: 12 });
      assert.equal(validator.validate(), false);
    });
    it('An Error message should be returned in case of failure', function() {
      assert.equal(validator.errors().first(), 'The value must have a valid URL format.');
    });
    it('Validation should succeed if value has a valid url format', function() {
      validator.setData({ url: 'test.com'});
      assert.ok(validator.validate());

      validator.setData({ url: 'www.test.com'});
      assert.ok(validator.validate());
    });
    it('Validation should succeed if value has a valid protocol', function() {
      validator.setData({ url: 'http://test.com'});
      assert.ok(validator.validate());

      validator.setData({ url: 'https://www.test.com'});
      assert.ok(validator.validate());
    });
    it('Validation should succeed if value has a valid IP format', function() {
      validator.setData({ url: '255.255.255.255'});
      assert.ok(validator.validate());
    });
    it('Validation should succeed if value has a valid port format', function() {
      validator.setData({ value: '255.255.255.255:8080'});
      assert.ok(validator.validate());

      validator.setData({ value: 'test.com:8080'});
      assert.ok(validator.validate());
    })
    it('Validation should succeed if value has a valid path paramters format', function() {
      validator.setData({ value: 'test.com/users'});
      assert.ok(validator.validate());
    });
    it('Validation shoulf succeed if value has a valid query paramters format', function() {
      validator.setData({ value: 'test.com?id=1'});
      assert.ok(validator.validate());
    });
    it('Validation should succeed if value has a valid fragment locator format', function() {
      validator.setData({ value: 'test.com#home' });
      assert.ok(validator.validate());
    });
    it('Validation should succeed if the value has combination with valid format', function() {
      validator.setData({ value: 'https://test.com:443/user?id=1#home' });
      assert.ok(validator.validate());
    });
  });
});