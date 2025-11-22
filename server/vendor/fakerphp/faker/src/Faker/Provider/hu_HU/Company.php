<?php

namespace Faker\Provider\hu_HU;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}}',
    ];

    protected static $companySuffix = ['Kft.', 'és Tsa', 'Kht', 'Zrt.', 'Nyrt.', 'Bt.'];
}
