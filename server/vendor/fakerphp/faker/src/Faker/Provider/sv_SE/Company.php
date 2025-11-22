<?php

namespace Faker\Provider\sv_SE;

class Company extends \Faker\Provider\Company
{
    protected static $formats = [
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} {{companySuffix}}',
        '{{last_name}} {{companySuffix}}',
        '{{first_name}} {{last_name}} {{companySuffix}}',
        '{{last_name}} & {{last_name}} {{companySuffix}}',
        '{{last_name}} & {{last_name}}',
        '{{last_name}} och {{last_name}}',
        '{{last_name}} och {{last_name}} {{companySuffix}}',
    ];

    protected static $companySuffix = ['AB', 'HB'];

    protected static $jobTitles = ['Automationsingenjör', 'Bagare', 'Digital Designer', 'Ekonom', 'Ekonomichef', 'Elektronikingenjör', 'Försäljare', 'Försäljningschef', 'Innovationsdirektör', 'Investeringsdirektör', 'Journalist', 'Kock', 'Kulturstrateg', 'Läkare', 'Lokförare', 'Mäklare', 'Programmerare', 'Projektledare', 'Sjuksköterska', 'Utvecklare', 'UX Designer', 'Webbutvecklare'];

    public function jobTitle()
    {
        return static::randomElement(static::$jobTitles);
    }
}
