const assert = require('assert');
const { make, setTranslationPath, setDefaultLang } = require('../lib/index');

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
    it('If the used language was not found the default lang will be used', function() {
        const validator = make({}, { name: 'required' }).setLang('be');
        validator.validate();

        assert.equal(validator.errors().first(), 'Le champ name est requis test.');
    });
    it('If rule does not exist in the specified default lang en will be used as final fallback', function() {
        const validator = make({ name: 12 }, { name: 'string' });
        validator.validate();

        assert.equal(validator.errors().first(), 'The name must be a string.');
    });
});