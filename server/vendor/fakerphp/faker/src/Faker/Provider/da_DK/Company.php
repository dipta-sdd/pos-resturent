<?php

namespace Faker\Provider\da_DK;

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
    protected static $companySuffix = ['ApS', 'A/S', 'I/S', 'K/S'];

    /**
     * @see http://cvr.dk/Site/Forms/CMS/DisplayPage.aspx?pageid=60
     *
     * @var string CVR number format.
     */
    protected static $cvrFormat = '%#######';

    /**
     * @see http://cvr.dk/Site/Forms/CMS/DisplayPage.aspx?pageid=60
     *
     * @var string P number (production number) format.
     */
    protected static $pFormat = '%#########';

    /**
     * Generates a CVR number (8 digits).
     *
     * @return string
     */
    public static function cvr()
    {
        return static::numerify(static::$cvrFormat);
    }

    /**
     * Generates a P entity number (10 digits).
     *
     * @return string
     */
    public static function p()
    {
        return static::numerify(static::$pFormat);
    }
}
