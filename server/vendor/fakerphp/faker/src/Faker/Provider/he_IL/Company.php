<?php

namespace Faker\Provider\he_IL;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} את {{last_name}} {{companySuffix}}',
        '{{last_name}} ו{{last_name}}',
    ];

    protected static $companySuffix = ['בע"מ', 'ובניו', 'סוכנויות', 'משווקים'];
}
