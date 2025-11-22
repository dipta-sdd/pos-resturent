<?php

namespace Faker\Provider\de_CH;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} {{last_name}} {{companySuffix}}',
        '{{last_name}}',
        '{{last_name}}',
    ];

    protected static $companySuffix = ['AG', 'GmbH'];
}
