<?php

namespace Faker\Provider\fr_BE;

class Company extends \Faker\Provider\fr_FR\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}}',
    ];

    protected static $companySuffix = ['ASBL', 'SCS', 'SNC', 'SPRL', 'Associations', 'Entreprise individuelle', 'GEIE', 'GIE', 'SA', 'SCA', 'SCRI', 'SCRL'];
}
