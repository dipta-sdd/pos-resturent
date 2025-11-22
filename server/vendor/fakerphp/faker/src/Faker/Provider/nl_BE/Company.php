<?php

namespace Faker\Provider\nl_BE;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}}',
    ];

    protected static $companySuffix = ['VZW', 'Comm.V', 'VOF', 'BVBA', 'EBVBA', 'ESV', 'NV', 'Comm.VA', 'CVOA', 'CVBA', '& Zonen', '& Zn'];
}
