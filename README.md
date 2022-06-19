# Simple Body Validator
Simple Body Validator is an open source validation library inspired by the [Laravel](https://laravel.com/docs/validation) validation mechanism. The library's goal is to make data validation as easy as possible for Javascript developers on both client and server side.

The validation mechanism can be used with any popular framework like [Angular](https://angular.io/), [React](https://reactjs.org/), and [Vue](https://vuejs.org/).

You can learn more about simple body validator by reading the full documentation in our [docs](https://simple-body-validator.com)

## Installing Simple Body Validator

```bash
npm i simple-body-validator
```

### Install with Yarn

```bash
yarn add simple-body-validator
```

## Advantages

### Simple 

The main purpose of Simple Body Validator is to make the life of Javascript developers easier when it comes to validating simple and complex data. The methods are very declarative and can be understood easily by developers.

### Built in Translation Mechanism

Simple Body Validator comes with a built-in translation mechanism that makes it convenient to retrieve error messages in multiple languages, thus allowing you to support multiple languages for your validation without the need of external libraries. You can follow the [documentation](https://simple-body-validator.com/error-messages/translating-error-messages) to know more on how to implement translation for your error messages.

### No Dependencies 

The whole validation mechanism does not depend on any external package. There is no need to download several packages each time you want to use Simple Body Validator or to be linked to any third party library.

### Flexible

Simple Body Validator is built in a way that gives the developer max flexibility. Rules can be registered easily, thus giving the developers the ability to register as many custom rules as needed. While at the same time taking advantage of the built-in localization mechanism.


## Validation Quick Start

The easiest way to continue validation quick start, is to follow the [validation quick start](https://simple-body-validator.com/validation-quickstart) section in our docs.

To learn more about Simple Body Validator's validation feature, let's look at a complete example of validating a data object and displaying the error messages back to the user.

By reading the following examples, you will be able to gain a good understanding of the main validation features.

### Create a new validation instance

To create a new validation instance you need to import the <code>make</code> method.


```js
    import { make } from 'simple-body-validator';
```

```js
    const { make } = require('simple-body-validator');
```

The first argument passed to the <code> make</code> method is the data under validation. The second argument is an object of the validation rules that should be applied to the data.

```js
    const data = {
        name: 'John',
        email: 'John@gmail.com',
        age: 28
    };

    const rules = {
        name: 'required|string|min:3',
        email: 'required|email',
        age: 'min:18'
    };

    const validator = make(data, rules);
```

As you can see the validation rules are passed as the second argument to the <code>make</code> method. All available validation rules are documented [here](https://simple-body-validator.com/available-validation-rules).

Alternatively, validation rules may be specified as arrays of rules instead of a single <code>|</code> delimited string.

```js
    const rules = {
        name: ['required', 'string', 'min:3'],
        email: ['required', 'email'],
        age: ['min:18']
    };
```

If you want a more expressive way to set your data and rules, you can chain the methods as shown below.

```js
    const validator = make().setSata(data).setRules(rules);
```


### Run Validation

To run the validation against the defined rules you need to invoke the <code>validate</code> method, which will return <code>false</code> in case of failure and <code>true</code> in case of success.

In case of validation failure, an error object will be returned based on the failed rules. You can find out more about [validation errors](https://simple-body-validator.com/error-messages/working-with-error-messages)

```js
    if (! validator.validate()) {
        console.log('Errors: ', validator.errors().all());
    }
```

### Stopping On First Validation Failure

The <code>stopOnFirstFailure</code> method will inform the validator that it should stop validating all attributes once a single validation failure has occurred


```js
    if (! validator.stopOnFirstFailure().validate()) {
        console.log('Error: ', validor.errors().first());
    }
```

Sometimes you may wish to stop running validation rules on an attribute after the first validation failure. To do so, assign the <code>bail</code> rule to the attribute.

```js
    validator.setRules({
        name: 'bail|required|string|min:3',
        email: 'bail|required|email',
        age: 'min:18'
    });
```

While the <code>bail</code> rule only stops a specific field when it encounters a validation failure, the <code>stopOnFirstFailure</code> method will inform the validator that it should stop validating all attributes once a single validation failure has occurred.

### A Note On Nested Attributes

If the upcoming HTTP request contains "nested" field data, you may specify these fields in your validation rule using the "dot" syntax.

```js
     validator.setRules({
        title: 'required|max:255',
        'author.name': 'required',
        'author.description': 'required',
    });
```

You can learn more on nested and wildcard validations using this [link](https://simple-body-validator.com/nested-and-wildcard-rules)
