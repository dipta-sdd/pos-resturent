<?php

namespace Faker\Provider\es_VE;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{companyPrefix}} {{last_name}} {{companySuffix}}',
        '{{companyPrefix}} {{last_name}}',
        '{{companyPrefix}} {{last_name}} y {{last_name}}',
        '{{last_name}} y {{last_name}} {{companySuffix}}',
        '{{last_name}} de {{last_name}} {{companySuffix}}',
        '{{last_name}} y {{last_name}}',
        '{{last_name}} de {{last_name}}',
    ];

    protected static $companyPrefix = [
        'Asociación', 'Centro', 'Corporación', 'Cooperativa', 'Empresa', 'Gestora', 'Global', 'Grupo', 'Viajes',
        'Inversiones', 'Lic.', 'Dr.',
    ];
    protected static $companySuffix = ['S.R.L.', 'C.A.', 'S.A.', 'R.L.', 'etc'];

    /**
     * @example 'Grupo'
     */
    public static function companyPrefix()
    {
        return static::randomElement(static::$companyPrefix);
    }

    /**
     * Generate random Taxpayer Identification Number (RIF in Venezuela). Ex J-123456789-1
     *
     * @param string $separator
     *
     * @return string
     */
    public function taxpayerIdentificationNumber($separator = '')
    {
        return static::randomElement(['J', 'G', 'V', 'E', 'P', 'C']) . $separator . static::numerify('########') . $separator . static::numerify('#');
    }
}
