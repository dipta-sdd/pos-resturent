<?php

namespace Faker\Provider\bn_BD;

class Person extends \Faker\Provider\Person
{
    protected static $maleNameFormats = [
        '{{firstNameMale}} {{last_name}}',
        '{{firstNameMale}} {{last_name}}',
        '{{firstNameMale}} {{last_name}}',
        '{{titleMale}} {{firstNameMale}} {{last_name}}',
    ];

    protected static $femaleNameFormats = [
        '{{firstNameFemale}} {{last_name}}',
        '{{firstNameFemale}} {{last_name}}',
        '{{firstNameFemale}} {{last_name}}',
        '{{titleFemale}} {{firstNameFemale}} {{last_name}}',
    ];

    protected static $firstNameMale = [
        'অনন্ত', 'আব্দুল্লাহ', 'আহসান',  'ইমরুল', 'করিম', 'জলিল', 'বরকত', 'মাসনুন', 'রহিম',  'রিফাত', 'হাসনাত', 'হাসান',
    ];

    protected static $firstNameFemale = [
        'জারিন', 'জেরিন', 'ফারহানা', 'ফাহমেদা', 'মাহজাবিন', 'মেহনাজ', 'রহিমা', 'লাবনী', 'সাবরিন', 'সাবরিনা', 'হাসিন', 'রহমত',
    ];

    protected static $last_name = [
        'খান', 'শেখ', 'শিকদার', 'আলী', 'তাসনীম', 'তাবাসসুম',
    ];

    protected static $titleMale = ['মি.'];

    protected static $titleFemale = ['মিসেস.', 'মিস.'];
}
