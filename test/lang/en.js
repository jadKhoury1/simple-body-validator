module.exports = {
    telephone: 'The :attribute phone number is not in the format XXX-XXX-XXXX.',
    complex_telephone: 'The :attribute phone number is not in the format +:code XXX-XXX-XXXX.',
    required_if_type: 'The :attribute is required when :target is of type :type.',
    attributes: {
        translated_email: 'email address',
        translated_phone: 'phone number',
        user: {
            translated_first_name: 'user first name',
            'translated_numbers.*': 'user course',
            'translated_numbers.1': 'user second course',
            'primaryInfo.*.translated_address': 'user address',
        },
        'user.translated_last_name': 'user last name',
    },
    custom: {
        custom_email: {
            required: 'The email must be present.'
        },
        custom_phone: {
            required: 'The phone number must be present.'
        },
        user: {
            custom_first_name: {
                required: 'The user first name must be present.'
            },
            'primaryInfo': {
                '*': {
                    custom_address: {
                        required: 'The user primary info requires the address to be present.'
                    }
                },
                '1': {
                    custom_postal_address: {
                        required: 'The user primary info requires the second postal address to be present.'
                    }
                }
            },
            'custom_numbers': {
                '*.integer': 'The user number must be an integer.',
                '1.integer': 'The user second number must be an integer.'
            },
            'custom_last_name.required': 'The user last name must be present.'
        }
    }   
};