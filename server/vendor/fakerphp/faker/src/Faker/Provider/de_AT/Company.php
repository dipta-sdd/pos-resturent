<?php

namespace Faker\Provider\de_AT;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}}',
    ];

    protected static $companySuffix = ['AG', 'EWIV', 'Ges.m.b.H.', 'GmbH', 'KEG', 'KG', 'OEG', 'OG', 'OHG', 'SE'];
}
