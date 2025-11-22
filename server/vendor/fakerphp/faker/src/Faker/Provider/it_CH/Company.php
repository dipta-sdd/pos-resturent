<?php

namespace Faker\Provider\it_CH;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} {{last_name}} {{companySuffix}}',
        '{{last_name}}',
        '{{last_name}}',
    ];

    protected static $companySuffix = ['SA', 'Sarl'];
}
