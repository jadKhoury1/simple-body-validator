const assert = require('assert');
const {make, Rule, register} =  require('../lib/cjs/index');

const fetchData = response => new Promise(resolve => setTimeout(() => resolve(response), 1));

describe('Register asyncronous custom rule', function() {
    register('fetch_data', value => fetchData(value));
    const rules = {
        test: ['required', 'fetch_data', 'string'],
        any: ['string']
    };
    const validator = make().setRules(rules).setCustomMessages({fetch_data: 'The fetched data is invalid'});

    it('Validation should succeed whith registered rule', async function() {
        assert.ok(await validator.setData({test: 'OK'}).validateAsync());
    });
    it('Validation should fail with registered rule', async function() {
        assert.equal(await validator.setData({test: false, any: 12}).validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().get('test').length, 2);
    });
    it('Field validation should stop when bail rule is specified', async function() {
        assert.equal(await validator.setRules({...rules, test: [...rules.test, 'bail']}).validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().get('test').length, 1);
        assert.equal(validator.errors().keys().length, 2);
    });
    it('Field validation should stop on first failure', async function() {
        assert.equal(await validator.stopOnFirstFailure().validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().keys().length, 1);
    });
    it('Run single validation should succeed with asynchronous registered rule', async function() {
        assert.ok(await validator.validateAsync('test', 'OK'));
        assert.ok(await validator.validateAsync('test'));
        assert.equal(validator.errors().has('test'), false);
    });
    it('Run single validation should fail with asynchronous registered rule', async function() {
        assert.equal(await validator.validateAsync('test', 0), false);
        assert.equal(await validator.validateAsync('test'), false);
        assert.equal(validator.errors().first('test'), 'The fetched data is invalid');
    });
});

describe('Register asyncronous custom class rule', function() {
    class FetchData extends Rule {
        passes(value) {
            return fetchData(value);
        }

        getMessage() {
            return 'The fetched data is invalid';
        }
    };

    const rules = {
        test: ['required', new FetchData, 'string'],
        any: ['string']
    };

    const validator = make().setRules(rules);

    it('Validation should succeed whith custom class rule', async function() {
        assert.ok(await validator.setData({test: 'OK'}).validateAsync());
    });
    it('Validation should fail with custom class rule', async function() {
        assert.equal(await validator.setData({test: false, any: 12}).validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().get('test').length, 2);
    });
    it('Field validation should stop when bail rule is specified', async function() {
        assert.equal(await validator.setRules({...rules, test: [...rules.test, 'bail']}).validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().get('test').length, 1);
        assert.equal(validator.errors().keys().length, 2);
    });
    it('Field validation should stop on first failure', async function() {
        assert.equal(await validator.stopOnFirstFailure().validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().keys().length, 1);
    });
    it('Run single validation should succeed with asynchronous custom class rule', async function() {
        assert.ok(await validator.validateAsync('test', 'OK'));
        assert.ok(await validator.validateAsync('test'));
        assert.equal(validator.errors().has('test'), false);
    });
    it('Run single validation should fail with asynchronous custom class rule', async function() {
        assert.equal(await validator.validateAsync('test', 0), false);
        assert.equal(await validator.validateAsync('test'), false);
        assert.equal(validator.errors().first('test'), 'The fetched data is invalid');
    });
});

describe('Defining an asyncronous custom closure rule', function() {
    const rules = {
        test: ['required', async function(value, fail) {
            if (!await fetchData(value)) {
                fail('The fetched data is invalid');
            }
        }, 'string'],
        any: ['string']
    };

    const validator = make().setRules(rules);

    it('Validation should succeed whith custom class rule', async function() {
        assert.ok(await validator.setData({test: 'OK'}).validateAsync());
    });
    it('Validation should fail with custom class rule', async function() {
        assert.equal(await validator.setData({test: false, any: 12}).validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().get('test').length, 2);
    });
    it('Field validation should stop when bail rule is specified', async function() {
        assert.equal(await validator.setRules({...rules, test: [...rules.test, 'bail']}).validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().get('test').length, 1);
        assert.equal(validator.errors().keys().length, 2);
    });
    it('Field validation should stop on first failure', async function() {
        assert.equal(await validator.stopOnFirstFailure().validateAsync(), false);
        assert.equal(validator.errors().first(), 'The fetched data is invalid');
        assert.equal(validator.errors().keys().length, 1);
    });
    it('Run single validation should succeed with asynchronous custom class rule', async function() {
        assert.ok(await validator.validateAsync('test', 'OK'));
        assert.ok(await validator.validateAsync('test'));
        assert.equal(validator.errors().has('test'), false);
    });
    it('Run single validation should fail with asynchronous custom class rule', async function() {
        assert.equal(await validator.validateAsync('test', 0), false);
        assert.equal(await validator.validateAsync('test'), false);
        assert.equal(validator.errors().first('test'), 'The fetched data is invalid');
    });
});