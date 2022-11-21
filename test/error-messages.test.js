const assert = require('assert');
const { make, setTranslationPath, setDefaultLang, setFallbackLang, Password, Rule, register } = require('../lib/cjs/index');

setTranslationPath(__dirname + '/lang');

describe('Translation', function() {
    it ('By default if no default lang was specified the en language should be used', function() {
        const validator = make({ name: 12 }, { name: 'string' });
        validator.validate();

        assert.equal(validator.errors().first(), 'The name must be a string.');
    });
    it ('If path was defined, the default message should be fetched from path if available', function() {
        setDefaultLang('te');
        const validator = make({}, { name: 'required' });

        validator.validate();

        assert.equal(validator.errors().first(), 'The name field is required for test.');
    });
    it ('Default lang can be changed', function() {
        setDefaultLang('fr');
        const validator = make({}, { name: 'required' });
        validator.validate();

        assert.equal(validator.errors().first(), 'Le champ name est requis test.');
    });
    it ('The language can be changed for a specific validation.', function() {
        const validator = make({}, { name: 'required' }).setLang('en');
        validator.validate();

        assert.equal(validator.errors().first(), 'The name field is required.');        

    });
    it('If the used language was not found the fallback lang will be used', function() {
        setFallbackLang('fr');
        const validator = make({}, { name: 'required' }).setLang('be');
        validator.validate();

        assert.equal(validator.errors().first(), 'Le champ name est requis test.');
    });
    it('If rule does not exist in the specified fallback lang en will be used as final fallback', function() {
        const validator = make({ name: 12 }, { name: 'string' });
        validator.validate();

        assert.equal(validator.errors().first(), 'The name must be a string.');
    });
});

describe('Format Attributes', function() {
    describe('Attributes should be formatted by default', function() {
        const validator = make({});
        it('By default if no custom attribute is specified the library itself will format the attribute', function() {
            setDefaultLang('en');
    
            validator.setRules({ first_name: 'required' }).validate();
            assert.equal(validator.errors().first(), 'The first name field is required.');
    
            validator.setRules({ lastName: 'required' }).validate();
            assert.equal(validator.errors().first(), 'The last name field is required.');
    
        });
        it('Nested rules should be also be formatted by default if no custom attributes were specified', function() {
            validator.setRules({ 'user.first_name': 'required' }).validate();
            assert.equal(validator.errors().first(), 'The first name field is required.');
        });
        it('Wild card rules should also be formatted by default if no custom attributes were specified', function() {
            validator.setData({ user: {info: [1, 2]}}).setRules({ 'user.primary_info.*': 'object'}).validate();
            let errors = validator.errors().all(false);
            
            for (key in errors) {
                assert.equal(errors[key], 'The primary info must be an object.');
            }

            validator.setData({
                user: { info: [ {}, {}]}
            }).setRules({ 'user.info.*.emailAddress': 'required' })
              .validate();

            errors = validator.errors().all(false);

            for (key in errors) {
                assert.equal(errors[key], 'The email address field is required.')
            }
        });
        it('Depent rules should also be formatted by default if no custom attribute was specified', function() {
            validator.setData({
                user: {
                    first_name: 'test'
                }
             }).setRules({
                 'user.last_name': 'required_with:user.first_name'
             }).validate();

             assert.equal(validator.errors().first(), 'The last name field is required when first name is present.');
        });
    });
    describe('Specify attribute format in trsanlation file', function() {
        it('If the attribute has a translation in the translation file, the message should be returned from the file', function() {
            let validator = make({}, { translated_email: 'required'});
            validator.validate();
            assert.equal(validator.errors().first(), 'The email address field is required.');

            validator = make({}, {'user.translated_email': 'required'});
            validator.validate();
            assert.equal(validator.errors().first(), 'The email address field is required.');
        });
        it('Nested attributes can also be specified and fetched from the translation file', function() {
            let validator = make({}, {'user.translated_first_name': 'required'});
            validator.validate();
            assert.equal(validator.errors().first(), 'The user first name field is required.');

            validator = make({}, {'user.translated_last_name': 'required'});
            validator.validate();
            assert.equal(validator.errors().first(), 'The user last name field is required.');
        });
        it('Attributes with wild card nested rules can also be specified and fetched from the translation file', function() {
            let validator = make({user: { translated_numbers: ['test'] }}, {'user.translated_numbers.*': 'integer'});
            validator.validate();
            assert.equal(validator.errors().first(), 'The user course must be an integer.');

            validator.setData({ user: { translated_numbers: [1, 'test'] } }).validate();
            assert.equal(validator.errors().first(), 'The user second course must be an integer.');

            validator.setData({ user: { primaryInfo: [{}, {}]}})
                .setRules({ 'user.primaryInfo.*.translated_address': 'required' }).validate();
            
            const errors = validator.errors().all(false);

            for (key in errors) {
                assert.equal(errors[key], 'The user address field is required.');
            }
        });
    });
    describe('Specify attribute format in the obect', function() {
        const validator = make({});
        it('If the attribute was specified in the object, the attribute format should be returned from the object', function() {
            validator.setRules({ email: 'required' })
                .setCustomAttributes({ email: 'email address'}).validate();
            assert.equal(validator.errors().first(), 'The email address field is required.');

            validator.setRules({ 'user.email': 'required' }).validate();
            assert.equal(validator.errors().first(), 'The email address field is required.');
        });
        it('Nested attributes can also be specified and fetched from the object', function() {
            validator.setRules({ user: { first_name: 'required' }})
                .setCustomAttributes({ 'user.first_name': 'user first name' }).validate();
            assert.equal(validator.errors().first(), 'The user first name field is required.');

            validator.setRules({ 'user.last_name': 'required' })
                .setCustomAttributes({ user: { last_name: 'user last name' }}).validate();
            assert.equal(validator.errors().first(), 'The user last name field is required.');
        });
        it('Attributes with wild card nested rules can also be specified and fetched from the object', function() {
            validator.setData({ user: { numbers: ['test'] }})
                .setRules({'user.numbers.*': 'integer'})
                .setCustomAttributes({
                    'user.numbers.*': 'user number'
                })
                .validate();
           
            assert.equal(validator.errors().first(), 'The user number must be an integer.');

            validator.setData({ user: { numbers: [1, 'test'] } })
                .setCustomAttributes({
                    'user.numbers.*': 'user number',
                    'user.numbers.1': 'user second number'
                })
                .validate();

            assert.equal(validator.errors().first(), 'The user second number must be an integer.');

            validator.setData({ user: { primaryInfo: [{}, {}]}})
                .setRules({ 'user.primaryInfo.*.address': 'required' })
                .setCustomAttributes({
                    user: {
                        'primaryInfo.*': {
                            address: 'user address'
                        }
                    }
                })
                .validate();
            
            const errors = validator.errors().all(false);

            for (key in errors) {
                assert.equal(errors[key], 'The user address field is required.');
            }

        });
    });
    describe('Attributes formatting priority', function() {
        const validator = make({});
        it('Custom attributes specified in the object should always take priority on the ones that are specified in the translation file', function() {
            validator.setRules({ translated_email: 'required', 'translated_phone': 'required' })
                .setCustomAttributes({
                    translated_email: 'custom email address'
                })
                .validate();

            assert.equal(validator.errors().first('translated_email'), 'The custom email address field is required.');
            assert.equal(validator.errors().first('translated_phone'), 'The phone number field is required.');
        });
        it('If the attribute inside the translation file has a more specific path, it will take priority on the one specified in the object', function() {
            validator
            .setData({
                user: {
                    primaryInfo: [
                        {}, {}
                    ]
                }
            })
            .setRules({ 
                user: { 
                    translated_first_name: 'required',
                    translated_last_name: 'required',
                    'primaryInfo.*.translated_address' : 'required',
                }
            })
            .setCustomAttributes({
                translated_first_name: 'first name',
                user: {
                    translated_last_name: 'last name',
                    'primaryInfo.1.translated_address': 'address'
                }
            }).validate();

            assert.equal(validator.errors().first('user.translated_first_name'), 'The user first name field is required.');
            assert.equal(validator.errors().first('user.translated_last_name'), 'The last name field is required.');
            assert.equal(validator.errors().first('user.primaryInfo.0.translated_address'), 'The user address field is required.');
            assert.equal(validator.errors().first('user.primaryInfo.1.translated_address'), 'The address field is required.');
        });
    });
    describe('Attributes for custom validation can also be formatted', function() {
        it('Sepcify custom attributes for password validation', function() {
            const validator = make({ password: 'test', user: { translated_password: 'test' }}, {
                password: [ 'required', Password.create().numbers()],
                user: {
                    translated_password: ['required', Password.create().numbers()]
                }
            }, {}, {
                password: 'user password'
            }).setLang('te');
    
            validator.validate();
            
            let errors = validator.errors().get('password');
            assert.equal(errors[0], 'The user password must be at least 8 characters.');
            assert.equal(errors[1], 'The user password must contain at least one number.');

            errors = validator.errors().get('user.translated_password');
            assert.equal(errors[0], 'The user translated password must be at least 8 characters.')
            assert.equal(errors[1], 'The user translated password must contain at least one number.');
        });
        it('Specify cutom attributes for custom class rule', function() {
            class UpperCase extends Rule {
                passes(value) {
                    return value.toUpperCase() === value;
                }

                getMessage() {
                    return 'The :attribute must be uppercase.';
                }
            }

            const validator = make({ 
                name: 'jad', user: { translated_first_name: 'john'} 
            }, { 
                name: new UpperCase,
                user: {
                    translated_first_name: new UpperCase
                }
            });
            validator.setCustomAttributes({ name: 'first name' }).validate();

            assert.equal(validator.errors().first('name'), 'The first name must be uppercase.');
            assert.equal(validator.errors().first('user.translated_first_name'), 'The user first name must be uppercase.');
        });
        it('Specify custom attributes for registered rule', function() {
            register('telephone', function(value) {
                return value.match(/^\d{3}-\d{3}-\d{4}$/);
            });

            const validator = make({ cell: '1223' }).setRules({ cell: 'telephone' });
            validator.setCustomAttributes({ cell: 'mobile' }).validate();

            assert.equal(validator.errors().first(), 'The mobile phone number is not in the format XXX-XXX-XXXX.');
        });
        it('Specify custom attributes for closure validation', function() {
            const validator = make({ value: 'test' }).setRules({
                value: (value, fail) => {
                    if (value === 'test') {
                        fail(`The :attribute is invalid`);
                    }
                }
            });

            validator.setCustomAttributes({ value: 'test value' }).validate();
            assert.equal(validator.errors().first(), 'The test value is invalid');
        });
    });
});

describe('Custom Messages', function() {
    describe('Specify custom messages in translation file', function() {
        const validator = make({});
        it('If the rules has a custom message in the translation file, the message should be returned from the file', function() {
            validator.setRules({ custom_email: 'required' }).validate();
            assert.equal(validator.errors().first(), 'The email must be present.');

            validator.setRules({ 'user.custom_email': 'required' }).validate();
            assert.equal(validator.errors().first(), 'The email must be present.');
        });
        it('We can also specify custom messages for nested rules', function() {
            validator.setRules({ 'user.custom_first_name': 'required'}).validate();
            assert.equal(validator.errors().first(), 'The user first name must be present.');

            validator.setRules({ 'user.custom_last_name': 'required' }).validate();
            assert.equal(validator.errors().first(), 'The user last name must be present.');
        });
        it('Custom messages for wildcard rules can also be specified and fetched form the translation file', function() {
            validator.setData({ user: { custom_numbers: ['test'] }})
                .setRules({ 'user.custom_numbers.*': 'integer' })
                .validate();
            assert.equal(validator.errors().first(), 'The user number must be an integer.');

            validator.setData({ user: { custom_numbers: [1, 'test'] }}).validate();
            assert.equal(validator.errors().first(), 'The user second number must be an integer.');

            validator.setData({ user: { primaryInfo: [{}, {} ]}})
                .setRules({ 'user.primaryInfo.*.custom_address': 'required' })
                .validate();

            const errors = validator.errors().all(false);

            for (key in errors) {
                assert.equal(errors[key], 'The user primary info requires the address to be present.');
            }
        });
    });
    describe('Specify custom messages in the object', function() {
        const validator = make({});
        it('If the custom message was specified in the object, the message should be returned from the object', function() {
            validator.setRules({ email: 'required' })
                .setCustomMessages({ 'email.required': 'The :attribute must be present.' })
                .validate();
            assert.equal(validator.errors().first(), 'The email must be present.');

            validator.setRules({ 'user.email': 'required' }).validate();
            assert.equal(validator.errors().first(), 'The email must be present.');
        });
        it('Custom messages for nested rules can also be specified in the object', function() {
            validator.setRules({ user: { first_name: 'required' }})
                .setCustomMessages({ 'user.first_name.required': 'The user :attribute must be present.' })
                .validate();
            assert.equal(validator.errors().first(), 'The user first name must be present.');

            validator.setRules({ 'user.last_name': 'required' })
                .setCustomMessages({ user: { last_name: { required: 'The user :attribute must be present.' }}})
                .validate();
            assert.equal(validator.errors().first(), 'The user last name must be present.');
        });
        it('Custom messages for wild card rules can also be specified in the object', function() {
            validator.setData({ user: { numbers: ['test'] }})
                .setRules({ 'user.numbers.*': 'integer'})
                .setCustomMessages({
                    'user.numbers.*.integer': 'The user number must be valid.'
                })
                .validate();
            assert.equal(validator.errors().first(), 'The user number must be valid.');

            validator.setData({ user: { numbers: [1, 'test'] }})
                .setCustomMessages({
                    'user.numbers.*.integer': 'The user number must be valid.',
                    'user.numbers.1.integer': 'The user second number must be valid.'
                })
                .validate();
            assert.equal(validator.errors().first(), 'The user second number must be valid.');
            
            validator.setData({ user: { primaryInfo: [{}, {}]}})
                .setRules({ 'user.primaryInfo.*.address': 'required' })
                .setCustomMessages({
                    user: {
                        primaryInfo: {
                            '*': {
                                address: {
                                    required: 'The user address is required in the primaty info.'
                                }
                            }
                        }
                    }
                })
                .validate();

            const errors = validator.errors().all(false);

            for (key in errors) {
                assert.equal(errors[key], 'The user address is required in the primaty info.')
            }

        });
    });
    describe('Custom messages priority', function() {
        const validator = make({});
        it('Custom messages specified in the object should always take priority on the ones that are specified in the translation file', function() {
            validator.setRules({ custom_email: 'required', custom_phone: 'required' })
                .setCustomMessages({
                    custom_email: {
                        required: 'The custom email must be present.'
                    }
                })
                .validate();
            assert.equal(validator.errors().first('custom_email'), 'The custom email must be present.');
            assert.equal(validator.errors().first('custom_phone'), 'The phone number must be present.');
        });
        it('If the custom message inside the translation file has a more specific rule path than the one in the object', function() {
            validator.setData({
                user: {
                    primaryInfo: [
                        {}, {}
                    ]
                }
            })
            .setRules({
                user: {
                    custom_first_name: 'required',
                    custom_last_name: 'required',
                    'primaryInfo.*.custom_postal_address': 'required'
                }
            })
            .setCustomMessages({
                'custom_first_name.required': 'The first name must be present.',
                user: {
                    'custom_last_name.required': 'The last name must be present.',
                    'primaryInfo.*.custom_postal_address.required': 'The primary postal address must be present.'
                }
            })
            .validate();


            assert.equal(validator.errors().first('user.custom_first_name'), 'The user first name must be present.')
            assert.equal(validator.errors().first('user.custom_last_name'), 'The last name must be present.');
            assert.equal(validator.errors().first('user.primaryInfo.0.custom_postal_address'), 'The primary postal address must be present.');
            assert.equal(validator.errors().first('user.primaryInfo.1.custom_postal_address'), 'The user primary info requires the second postal address to be present.');
        });
    });
    describe('Custom messages can also be specified for custom rules', function() {
        it('Specify custom messages for registred rule', function() {
            register('telephone', function(value) {
                return value.match(/^\d{3}-\d{3}-\d{4}$/);
            });
            const validator = make({ cell: '123' }).setRules({ cell: 'telephone' });
            validator.setCustomMessages({
                'cell.telephone': 'The phone number must be in a valid format.'
            }).validate();

            assert.equal(validator.errors().first(), 'The phone number must be in a valid format.');
        });
    });
});