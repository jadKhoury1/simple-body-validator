const assert = require('assert');
const { make } = require('../lib/cjs/index');

const validator = make();

describe('Nested Objects', function() {

    let data = {
        name: 'Jad',
        address: 'Test',
        bio: {
          age: 28,
          education: {
            primary: 'Elementary School',
            secondary: 'Secondary School',
            college: ''
          }
        }
    };

 
    it('Validation should fail on nested object if object rules does not match the given data', function() {
        validator.setData({
        name: 2,
        bio: {
            age: 'test',
            education: {
                primary: 'Elementary School',
                secondary: 2
            }
        }
        }).setRules({
            name: 'required|string',
            address: 'required|string',
            bio: {
                age: 'required|integer',
                education: {
                    primary: ['required' ,'string'],
                    secondary: ['required', 'string']
                }
            }
        });

        assert.equal(validator.validate(), false);
    });
    it('Error keys should be returned for all the failed validations', function() {
        const errors = validator.errors().all();
        assert.ok(errors.hasOwnProperty('name'));
        assert.ok(errors.hasOwnProperty('address'));
        assert.ok(errors.hasOwnProperty('bio.age'));
        assert.ok(errors.hasOwnProperty('bio.education.secondary'));
    });
    it('Error messages should be returned for all the failed validations', function() {
        const errors = validator.errors().all(false);
        assert.equal(errors.name, 'The name must be a string.');
        assert.equal(errors.address, 'The address field is required.');
        assert.equal(errors['bio.age'], 'The age must be an integer.');
        assert.equal(errors['bio.education.secondary'], 'The secondary must be a string.');
    });
    it('Validation should succeed if nested object rules matches the given data', function() {
        validator.setData(data);
        assert.ok(validator.validate());
    });
    it('Run validation on rules that require dependencies', function() {
        validator.setData(data);
        validator.setRules({
            bio: {
                age: 'required|integer',
                education: {
                    college: 'required_with:bio.age'
                }
            }
        });

        assert.equal(validator.validate(), false);

        data.bio.education.college = 'any';
        assert.ok(validator.validate());
    });
});

describe('Nested objects with flattened rules', function() {
    let data = {
        name: 'Jad',
        address: 'Test',
        bio: {
          age: 28,
          education: {
            primary: 'Elementary School',
            secondary: 'Secondary School',
            college: ''
          }
        }
    };

    it('Validation should fail on nested object if object rules does not match the given data', function() {
        validator.setData({
            name: 2,
            bio: {
                age: 'test',
                education: {
                primary: 'Elementary School',
                secondary: 2
                }
            }
            }).setRules({
                name: 'required|string',
                address: 'required|string',
                'bio.age': 'required|integer',
                'bio.education': 'required|object',
                'bio.education.primary': ['required', 'string'],
                'bio.education.secondary': ['required', 'string'],
            });

            assert.equal(validator.validate(), false);
    });
    it('Error keys should be returned for all the failed validations', function() {
        const errors = validator.errors().all();
        assert.ok(errors.hasOwnProperty('name'));
        assert.ok(errors.hasOwnProperty('address'));
        assert.ok(errors.hasOwnProperty('bio.age'));
        assert.ok(errors.hasOwnProperty('bio.education.secondary'));
    });
    it('Error messages should be returned for all the failed validations', function() {
        const errors = validator.errors().all(false);
        assert.equal(errors.name, 'The name must be a string.');
        assert.equal(errors.address, 'The address field is required.');
        assert.equal(errors['bio.age'], 'The age must be an integer.');
        assert.equal(errors['bio.education.secondary'], 'The secondary must be a string.');
    });
    it('Validation should succeed if nested object rules matches the given data', function() {
        validator.setData(data);
        assert.ok(validator.validate());
    });
    it('Run validation on rules that require dependencies', function() {
        validator.setData(data);
        validator.setRules({
            bio: {
                age: 'required|integer',
                education: {
                    college: 'required_without:bio.height'
                }
            }
        });

        assert.equal(validator.validate(), false);

        data.bio.height = 'any';
        assert.ok(validator.validate());
    });
});


describe('Wildcard rules', function() {
    let rules = {
        'users.*.name': 'required|string',
        'users.*.bio.age': ['required', 'integer', 'min:18'],
        'users.*.bio.education.*.level': 'string',
        'users.*.bio.education.*.institute': 'required_with:users.*.bio.education.*.level|string'
    };

    it('Validation should fail on array of objects if wildcard rules does not match the given data', function() {
        validator.setData({
            users: [
                {
                    name: 'Jad',
                    bio: {
                        age: 12,
                        education: [
                            {
                                level: 'primary',
                                inistitute: 'any'
                            },
                            {
                                level: 'secondary'
                            }
                        ]
                        
                    }
                },
                {
                    name: 12,
                    bio: {
                        age: 18,
                        education: [
                            {
                                address: 'test'
                            }
                        ]
                    }
                }
            ]
        }).setRules(rules);
        assert.equal(validator.validate(), false);
    });
    it('Error keys should be returned for all the failed validations', function() {
        const errors = validator.errors().all();
        assert.ok(errors.hasOwnProperty('users.1.name'));
        assert.ok(errors.hasOwnProperty('users.0.bio.age'));
        assert.ok(errors.hasOwnProperty('users.0.bio.education.1.institute'));
    });
    it('Error messages should be returned for all the failed validations', function() {
        const errors = validator.errors().all(false);
        assert.equal(errors['users.1.name'], 'The name must be a string.');
        assert.equal(errors['users.0.bio.age'], 'The age must be at least 18.');
        assert.equal(errors['users.0.bio.education.1.institute'], 'The institute field is required when level is present.');
    });
    it('Validation should suceed if wildcard rules matches data', function() {
        validator.setData({
            users: [
                {
                    name: 'Jad',
                    bio: {
                        age: 22,
                        education: [
                            {
                                level: 'primary',
                                institute: 'any'
                            },
                            {
                                level: 'secondary',
                                institute: 'any'
                            }
                        ]
                        
                    }
                }
            ]
        });

        assert.ok(validator.validate());
    });
});

describe('Wildcard validation on array elements', function() {
    it ('Validation should fail if any of the array elements does not match the wildcard rule', function() {
        validator.setData({ value: [1, 'Jad', 2, 'Khoury']}).setRules({ 'value.*': 'numeric' });
        assert.equal(validator.validate(), false);
    });
    it ('Error messages should be returned for all the failed validations', function() {
        const errors = validator.errors().all(false);
        assert.equal(errors['value.1'], 'The value must be a number.');
        assert.equal(errors['value.3'], 'The value must be a number.');
    });
    it('Validation should succeed when all array elements match the wildcard rule', function() {
        validator.setData({ value: [1,2,3] });
        assert.ok(validator.validate());
    });
});


describe('Wildcard validation on object values', function() {
    it('Validation should fail if any of the object values does not match the wildcard rule', function() {
        validator.setData({ value: { first: 'Jad', last: 'Khoury', address: 2, education: 1 }}).setRules({ 'value.*': 'string' });
        assert.equal(validator.validate(), false);
    });
    it('Error messages should be returned for all the failed validations', function() {
        const errors = validator.errors().all(false);
        assert.equal(errors['value.address'], 'The address must be a string.');
        assert.equal(errors['value.education'], 'The education must be a string.');
    });
    it('Validation should succeed when all the obejct values match the wildcard rule', function() {
        validator.setData({ first: 'Jad', last: 'Khoury', education: 'college' });
        assert.ok(validator.validate());
    });
});