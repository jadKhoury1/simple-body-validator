const assert = require('assert');
const { make, Password, Rule, setTranslationPath } = require('../lib/cjs/index');

setTranslationPath(__dirname + '/lang');

const validator = make();

describe('Password Validation', function() {
    it('The Default validation requires the password to be a string', function() {
        validator.setData({ password: 1 }).setRules({ password: Password.default() });
        assert.equal(validator.validate(), false);
    });
    it('The default password validation requires the password to have at least 8 characters', function() {
        validator.setData({ password: 'test' });
        assert.equal(validator.validate(), false);
    });
    it('The default validation should succeed if the password matches the default rules', function() {
        validator.setData({ password: 'password' });
        assert.ok(validator.validate());
    });
    describe('Customize password complexity', function() {
        describe('Change the minimum required characters rule', function() {
            it('Validation should fail if password do not match the min required charachters', function() {
                validator.setData({ password: 'password' }).setRules({ password: Password.create().min(9)});
                assert.equal(validator.validate(), false);
            });
            it('An Error message should be returned on failure', function() {
                assert.equal(validator.errors().first(), 'The password must be at least 9 characters.');
            });
            it('Validation should succeed if password matches the min amount of charachters', function() {
                validator.setData({ password: 'passwords' });
                assert.ok(validator.validate());
            })
        });

        describe('Change the min amount of mixed case required in the password', function() {
            describe('The default mixed case method should require at least one Uppercase and one Lowercase letter', function() {
                it('Validation should fail if the password do not contain at least one uppercase and lowercase letter', function() {
                    validator.setData({ password: '12345678' }).setRules({ password: Password.create().mixedCase() });
                    assert.equal(validator.validate(), false);
                });
                it('Error messages should be returned on failure', function() {
                    const messages = validator.errors().get('password');
                    assert.equal(messages[0], 'The password must contain at least one lowercase letter.');
                    assert.equal(messages[1], 'The password must contain at least one uppercase letter.');
                });
                it('Validation should succeed if password contains at least one uppercase and one lowercase letter', function() {
                    validator.setData({ password: '12345P67a' });
                    assert.ok(validator.validate());
                });
            });
            describe('The min amount of lower and upper case letters can be specified manually', function() {
                it('Validation should fail if the password does not contain the min amount of upper and lower case letters', function() {
                    validator.setData({ password: '12345P67a' })
                             .setRules({ password: Password.create().mixedCase(2, 2) });
                    assert.equal(validator.validate(), false);
                });
                it('Error messages should be returned on failure', function() {
                    const messages = validator.errors().get('password');
                    assert.equal(messages[0], 'The password must contain at least 2 lowercase letters.');
                    assert.equal(messages[1], 'The password must contain at least 2 uppercase letters.');
                });
                it('Validation should succeed if the password contains the min amount of specified upper and lower case letters', function() {
                    validator.setData({ password: '1J2345P6n7a' });
                    assert.ok(validator.validate());
                });
            });
        });

        describe('Change the min amount of letters required in the password', function() {
            describe('The default min letters rule should require at least one letter', function() {
                it('Validation should fail if password does not contain at least one letter', function() {
                    validator.setData({ password: '1234567890' }).setRules({ password: Password.create().letters() });
                    assert.equal(validator.validate(), false);
                });
                it('An error message should be returned on failure', function() {
                    assert.equal(validator.errors().first(), 'The password must contain at least one letter.'); 
                });
                it('Validation should succeed if the password contains at least one letter', function() {
                    validator.setData({ password: '1234I567933' });
                    assert.ok(validator.validate());
                });
            });
            describe('The min amount of letters can be specified manually', function() {
                it('Validation should fail if the password does not contain the min amount of letters', function() {
                    validator.setData({ password: '1234I567933' }).setRules({ password: Password.create().letters(3) });
                    assert.equal(validator.validate(), false)
                });
                it('An error message should be returned on failure', function() {
                    assert.equal(validator.errors().first(), 'The password must contain at least 3 letters.');
                });
                it('Validation should succeed if the password contains the min amount of letters', function() {
                    validator.setData({ password: '1234I567k933B' });
                    assert.ok(validator.validate());
                });
            });
        });

        describe('Change the min amount of numbers required in the password', function() {
            describe('The default min numbers rule should require at least one number', function() {
                it('Validation should fail if password does not contain at least one number', function() {
                    validator.setData({ password: 'djskdhnsdkasd#' }).setRules({ password: Password.create().numbers() });
                    assert.equal(validator.validate(), false);
                });
                it('An error message should be returned on failure', function() {
                    assert.equal(validator.errors().first(), 'The password must contain at least one number.')
                });
                it('Validation should succeed if password contains at least one number', function() {
                    validator.setData({ password: 'djskjh3sdhj' });
                    assert.ok(validator.validate());
                });
            });
            describe('The min amount of numbers can be specified manually', function() {
                it('Validation should fail if the password does not contain the min amount of numbers', function() {
                    validator.setData({ password: 'djskjh3sdhj' }).setRules({ password: Password.create().numbers(2) });
                    assert.equal(validator.validate(), false);
                });
                it('An error message should be returned on failure', function() {
                    assert.equal(validator.errors().first(), 'The password must contain at least 2 numbers.');
                });
                it('Validation should succeed if password contains the min amount of numbers', function() {
                    validator.setData({ password: 'djskjh3sdhj5' });
                    assert.ok(validator.validate());
                });
            });
        });

        describe('Change the min amount of symbols required in the password', function() {
            describe('The default min symbols rule should require at least one symbol', function() {
                it('Validation should fail if password does not contain at least one symbol', function() {
                    validator.setData({ password: 'djs23ddhJsd7' }).setRules({ password: Password.create().symbols() });
                    assert.equal(validator.validate(), false);
                });
                it('An error message should be returned on failure', function() {
                    assert.equal(validator.errors().first(), 'The password must contain at least one symbol.');
                });
                it('Validation should succeed if password contains at least one symbol', function() {
                    validator.setData({ password: 'sdhjj*Jdsdh3'});
                    assert.ok(validator.validate());
                });
            });
            describe('The min amount of symbols can be defined manually', function() {
                it('Validation should fail if the password does not contain the min amount of symbols', function() {
                    validator.setData({ password: 'sdhjj*Jdsdh3'}).setRules({ password: Password.create().symbols(3)});
                    assert.equal(validator.validate(), false);
                });
                it('An error message should be returned on failure', function() {
                    assert.equal(validator.errors().first(), 'The password must contain at least 3 symbols.');  
                });
                it('Validation should succeed if password contains the min amount of symbols', function() {
                    validator.setData({ password: 'sdhjj*Jds dh3#'});
                    assert.ok(validator.validate());
                });
            });
        });

        describe('Mixed rules can be combined together', function() {
            it('Validation should fail if password does not match the specified password rules', function() {
                validator.setData({ password: 'password' })
                         .setRules({ 
                             password: Password.create()
                                .min(12)
                                .letters(6)
                                .mixedCase(3, 3)
                                .numbers(3)
                                .symbols(3)
                          });
                assert.equal(validator.validate(), false);
            });
            it('Validation should succeed if password matches all the specified rules', function() {
                validator.setData({ password: 'aA!1bB@2cC#3' });
                assert.ok(validator.validate());
            });
        });
    });
    describe('The default validation rules can be specified once', function() {
        describe('The default rules can be specified as an instance of the Password class', function() {
            it('Validation should fail if password does not match the default specified rules', function() {
                Password.setDefault(
                    Password.create()
                        .min(12)
                        .letters(6)
                        .mixedCase(3, 3)
                        .numbers(3)
                        .symbols(3)
                );
                validator.setData({ password: 'password' }).setRules({ password: Password.default() });
                assert.equal(validator.validate(), false);
            });
            it('Validation should succeed if password patches the specified default rules', function() {
                validator.setData({ password: 'aA!1bB@2cC#3' });
                assert.ok(validator.validate());
            });
        });
        describe('The dfault rule can be specified as a function', function() {
            it('Validation should fail if password does not match the default specified rules', function() {
                Password.setDefault(() => {
                    return Password.create()
                    .min(12)
                    .letters(6)
                    .mixedCase(3, 3)
                    .numbers(3)
                    .symbols(3)
                });
                validator.setData({ password: 'password' }).setRules({ password: Password.default() });
                assert.equal(validator.validate(), false);
            });
            it('Validation should succeed if password patches the specified default rules', function() {
                validator.setData({ password: 'aA!1bB@2cC#3' });
                assert.ok(validator.validate());
            });
        });
    });

    describe('Custom rules can be passed to the password validation', function() {
        class CustomSymbol extends Rule {
            passes(value) {
                return /\*/.test(value);
            }

            getMessage() {
                return 'The :attribute must contain a star';
            }
        }
        it('Validation should fail if password does not match custom rules', function() {
            validator.setData({ password: 'password123' }).setRules({ 
                password: Password.create().numbers().rules(['max:10', new CustomSymbol ])
            });
            assert.equal(validator.validate(), false);
        });
        it('Validation should succeed if password matches the custom rules', function() {
            validator.setData({ password: 'password1*' });
            assert.ok(validator.validate());
        });
        it('Custom messages can be added for the custom rules', function() {
            validator.setData({ password: 'password12*' }).setCustomMessages({
                'password.max': 'The :attribute should not contain more than :max characters'
            }).validate();

            assert.equal(validator.errors().first(), 'The password should not contain more than 10 characters');
        
        });
    });
    
    describe('Translations can be  added for the password rules', function() {
        const newValidator = make();

        newValidator.setData({ password: '122e3434' })
            .setRules({ password: Password.create().letters(3) })
            .setLang('te')
            .validate();

        assert.equal(newValidator.errors().first(), 'The password must have at least 3 characters.')
    });
});