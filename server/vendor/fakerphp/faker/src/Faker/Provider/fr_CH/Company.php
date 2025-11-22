<?php

namespace Faker\Provider\fr_CH;

class Company extends \Faker\Provider\fr_FR\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} {{last_name}} {{companySuffix}}',
        '{{last_name}}',
        '{{last_name}}',
    ];

    protected static $companySuffix = ['AG', 'Sàrl', 'SA', 'GmbH'];
}
