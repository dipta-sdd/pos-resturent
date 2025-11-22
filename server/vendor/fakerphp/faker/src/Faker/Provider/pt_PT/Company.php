<?php

namespace Faker\Provider\pt_PT;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} {{last_name}}',
        '{{last_name}} e {{last_name}}',
        '{{last_name}} {{last_name}} {{companySuffix}}',
        'Grupo {{last_name}} {{companySuffix}}',
    ];

    protected static $companySuffix = ['e Filhos', 'e Associados', 'Lda.', 'S.A.'];
}
