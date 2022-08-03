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
        
    }
};