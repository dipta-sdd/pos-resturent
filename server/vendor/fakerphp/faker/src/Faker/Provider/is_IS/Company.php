<?php

namespace Faker\Provider\is_IS;

class Company extends \Faker\Provider\Company
{
    /**
     * @var array Danish company name formats.
     */
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} {{companySuffix}}',
        '{{firstname}} {{last_name}} {{companySuffix}}',
        '{{middleName}} {{companySuffix}}',
        '{{middleName}} {{companySuffix}}',
        '{{middleName}} {{companySuffix}}',
        '{{firstname}} {{middleName}} {{companySuffix}}',
        '{{last_name}} & {{last_name}} {{companySuffix}}',
        '{{last_name}} og {{last_name}} {{companySuffix}}',
        '{{last_name}} & {{last_name}} {{companySuffix}}',
        '{{last_name}} og {{last_name}} {{companySuffix}}',
        '{{middleName}} & {{middleName}} {{companySuffix}}',
        '{{middleName}} og {{middleName}} {{companySuffix}}',
        '{{middleName}} & {{last_name}}',
        '{{middleName}} og {{last_name}}',
    ];

    /**
     * @var array Company suffixes.
     */
    protected static $companySuffix = ['ehf.', 'hf.', 'sf.'];

    /**
     * @see http://www.rsk.is/atvinnurekstur/virdisaukaskattur/
     *
     * @var string VSK number format.
     */
    protected static $vskFormat = '%####';

    /**
     * Generates a VSK number (5 digits).
     *
     * @return string
     */
    public static function vsk()
    {
        return static::numerify(static::$vskFormat);
    }
}
