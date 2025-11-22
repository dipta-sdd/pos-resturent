<?php

namespace Faker\Provider\sl_SI;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{first_name}} {{last_name}} s.p.',
        '{{last_name}} {{companySuffix}}',
        '{{last_name}}, {{last_name}} in {{last_name}} {{companySuffix}}',
    ];

    protected static $companySuffix = ['d.o.o.', 'd.d.', 'k.d.', 'k.d.d.', 'd.n.o.', 'so.p.'];
}
