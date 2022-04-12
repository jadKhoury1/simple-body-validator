const assert = require('assert');
const SimpleValidator = require('../lib/index').default;

SimpleValidator.setTranslationPath(__dirname + '/lang');

describe('Translation', function() {
    it ('By default if no default lang was specified the en language should be used', function() {
        const validator = SimpleValidator.make({ name: 12 }, { name: 'string' });
        validator.validate();

        assert.equal(validator.firstError(), 'The name must be a string.');
    });
    it ('If path was defined, the default message should be fetched from path if available', function() {
        const validator = SimpleValidator.make({}, { name: 'required' });
        validator.validate();

        assert.equal(validator.firstError(), 'The name field is required for test.');
    });
    it ('Default lang can be changed', function() {
        SimpleValidator.setDefaultLang('fr');
        const validator = SimpleValidator.make({}, { name: 'required' });
        validator.validate();

        assert.equal(validator.firstError(), 'Le champ name est requis test.');
    });
    it ('The language can be changed for a specific validation.', function() {
        const validator = SimpleValidator.make({}, { name: 'required' }).setLang('en');
        validator.validate();

        assert.equal(validator.firstError(), 'The name field is required for test.');        

    });
    it('If the used language was not found the default lang will be used', function() {
        const validator = SimpleValidator.make({}, { name: 'required' }).setLang('te');
        validator.validate();

        assert.equal(validator.firstError(), 'Le champ name est requis test.');
    });
    it('If rule does not exist in the specified default lang en will be used as final fallback', function() {
        const validator = SimpleValidator.make({ name: 12 }, { name: 'string' });
        validator.validate();

        assert.equal(validator.firstError(), 'The name must be a string.');
    });
});