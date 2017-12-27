import axios from 'axios';

export {CurrencyConverter};

class CurrencyConverter {
    constructor() {
        this.STORAGE_KEY = "jeff-currency-rate";

        // 所有国家
        this.currencies = {
            "AED": "United Arab Emirates Dirham",
            "AFN": "Afghan Afghani",
            "ALL": "Albanian Lek",
            "AMD": "Armenian Dram",
            "ANG": "Netherlands Antillean Guilder",
            "AOA": "Angolan Kwanza",
            "ARS": "Argentine Peso",
            "AUD": "Australian Dollar",
            "AWG": "Aruban Florin",
            "AZN": "Azerbaijani Manat",
            "BAM": "Bosnia-Herzegovina Convertible Mark",
            "BBD": "Barbadian Dollar",
            "BDT": "Bangladeshi Taka",
            "BGN": "Bulgarian Lev",
            "BHD": "Bahraini Dinar",
            "BIF": "Burundian Franc",
            "BMD": "Bermudan Dollar",
            "BND": "Brunei Dollar",
            "BOB": "Bolivian Boliviano",
            "BRL": "Brazilian Real",
            "BSD": "Bahamian Dollar",
            "BTC": "Bitcoin",
            "BTN": "Bhutanese Ngultrum",
            "BWP": "Botswanan Pula",
            "BYN": "New Belarusian Ruble",
            "BYR": "Belarusian Ruble",
            "BZD": "Belize Dollar",
            "CAD": "Canadian Dollar",
            "CDF": "Congolese Franc",
            "CHF": "Swiss Franc",
            "CLF": "Chilean Unit of Account (UF)",
            "CLP": "Chilean Peso",
            "CNY": "Chinese Yuan",
            "COP": "Colombian Peso",
            "CRC": "Costa Rican Colón",
            "CUC": "Cuban Convertible Peso",
            "CUP": "Cuban Peso",
            "CVE": "Cape Verdean Escudo",
            "CZK": "Czech Republic Koruna",
            "DJF": "Djiboutian Franc",
            "DKK": "Danish Krone",
            "DOP": "Dominican Peso",
            "DZD": "Algerian Dinar",
            "EGP": "Egyptian Pound",
            "ERN": "Eritrean Nakfa",
            "ETB": "Ethiopian Birr",
            "EUR": "Euro",
            "FJD": "Fijian Dollar",
            "FKP": "Falkland Islands Pound",
            "GBP": "British Pound Sterling",
            "GEL": "Georgian Lari",
            "GGP": "Guernsey Pound",
            "GHS": "Ghanaian Cedi",
            "GIP": "Gibraltar Pound",
            "GMD": "Gambian Dalasi",
            "GNF": "Guinean Franc",
            "GTQ": "Guatemalan Quetzal",
            "GYD": "Guyanaese Dollar",
            "HKD": "Hong Kong Dollar",
            "HNL": "Honduran Lempira",
            "HRK": "Croatian Kuna",
            "HTG": "Haitian Gourde",
            "HUF": "Hungarian Forint",
            "IDR": "Indonesian Rupiah",
            "ILS": "Israeli New Sheqel",
            "IMP": "Manx pound",
            "INR": "Indian Rupee",
            "IQD": "Iraqi Dinar",
            "IRR": "Iranian Rial",
            "ISK": "Icelandic Króna",
            "JEP": "Jersey Pound",
            "JMD": "Jamaican Dollar",
            "JOD": "Jordanian Dinar",
            "JPY": "Japanese Yen",
            "KES": "Kenyan Shilling",
            "KGS": "Kyrgystani Som",
            "KHR": "Cambodian Riel",
            "KMF": "Comorian Franc",
            "KPW": "North Korean Won",
            "KRW": "South Korean Won",
            "KWD": "Kuwaiti Dinar",
            "KYD": "Cayman Islands Dollar",
            "KZT": "Kazakhstani Tenge",
            "LAK": "Laotian Kip",
            "LBP": "Lebanese Pound",
            "LKR": "Sri Lankan Rupee",
            "LRD": "Liberian Dollar",
            "LSL": "Lesotho Loti",
            "LTL": "Lithuanian Litas",
            "LVL": "Latvian Lats",
            "LYD": "Libyan Dinar",
            "MAD": "Moroccan Dirham",
            "MDL": "Moldovan Leu",
            "MGA": "Malagasy Ariary",
            "MKD": "Macedonian Denar",
            "MMK": "Myanma Kyat",
            "MNT": "Mongolian Tugrik",
            "MOP": "Macanese Pataca",
            "MRO": "Mauritanian Ouguiya",
            "MUR": "Mauritian Rupee",
            "MVR": "Maldivian Rufiyaa",
            "MWK": "Malawian Kwacha",
            "MXN": "Mexican Peso",
            "MYR": "Malaysian Ringgit",
            "MZN": "Mozambican Metical",
            "NAD": "Namibian Dollar",
            "NGN": "Nigerian Naira",
            "NIO": "Nicaraguan Córdoba",
            "NOK": "Norwegian Krone",
            "NPR": "Nepalese Rupee",
            "NZD": "New Zealand Dollar",
            "OMR": "Omani Rial",
            "PAB": "Panamanian Balboa",
            "PEN": "Peruvian Nuevo Sol",
            "PGK": "Papua New Guinean Kina",
            "PHP": "Philippine Peso",
            "PKR": "Pakistani Rupee",
            "PLN": "Polish Zloty",
            "PYG": "Paraguayan Guarani",
            "QAR": "Qatari Rial",
            "RON": "Romanian Leu",
            "RSD": "Serbian Dinar",
            "RUB": "Russian Ruble",
            "RWF": "Rwandan Franc",
            "SAR": "Saudi Riyal",
            "SBD": "Solomon Islands Dollar",
            "SCR": "Seychellois Rupee",
            "SDG": "Sudanese Pound",
            "SEK": "Swedish Krona",
            "SGD": "Singapore Dollar",
            "SHP": "Saint Helena Pound",
            "SLL": "Sierra Leonean Leone",
            "SOS": "Somali Shilling",
            "SRD": "Surinamese Dollar",
            "STD": "São Tomé and Príncipe Dobra",
            "SVC": "Salvadoran Colón",
            "SYP": "Syrian Pound",
            "SZL": "Swazi Lilangeni",
            "THB": "Thai Baht",
            "TJS": "Tajikistani Somoni",
            "TMT": "Turkmenistani Manat",
            "TND": "Tunisian Dinar",
            "TOP": "Tongan Paʻanga",
            "TRY": "Turkish Lira",
            "TTD": "Trinidad and Tobago Dollar",
            "TWD": "New Taiwan Dollar",
            "TZS": "Tanzanian Shilling",
            "UAH": "Ukrainian Hryvnia",
            "UGX": "Ugandan Shilling",
            "USD": "United States Dollar",
            "UYU": "Uruguayan Peso",
            "UZS": "Uzbekistan Som",
            "VEF": "Venezuelan Bolívar Fuerte",
            "VND": "Vietnamese Dong",
            "VUV": "Vanuatu Vatu",
            "WST": "Samoan Tala",
            "XAF": "CFA Franc BEAC",
            "XAG": "Silver (troy ounce)",
            "XAU": "Gold (troy ounce)",
            "XCD": "East Caribbean Dollar",
            "XDR": "Special Drawing Rights",
            "XOF": "CFA Franc BCEAO",
            "XPF": "CFP Franc",
            "YER": "Yemeni Rial",
            "ZAR": "South African Rand",
            "ZMK": "Zambian Kwacha (pre-2013)",
            "ZMW": "Zambian Kwacha",
            "ZWL": "Zimbabwean Dollar"
        };

        // 从网络或者本地缓存获取汇率
        // 其中的rate为相对美元的汇率
        // 即 rate = 1美元对应该币种数量
        // this.table = {
        //     'USD': {
        //         imgNation: "",
        //         nameNation: 'U.S.A',
        //         abbrNation: 'USD',
        //         moneyUnit: "dollar",
        //         rate: 1.0
        //     },
        //     'CNY': {
        //         imgNation: "",
        //         nameNation: 'China',
        //         abbrNation: 'CNY',
        //         moneyUnit: "元",
        //         rate: 6.5
        //     },
        //     'CCC': {
        //         imgNation: "",
        //         nameNation: 'CCC',
        //         abbrNation: 'CCC',
        //         moneyUnit: "R",
        //         rate: 0.8
        //     }
        // };
        this.table = JSON.parse("{\"USD\":{\"imgNation\":\"\",\"nameNation\":\"United States Dollar\",\"abbrNation\":\"USD\",\"moneyUnit\":\".\",\"rate\":1},\"AED\":{\"imgNation\":\"\",\"nameNation\":\"United Arab Emirates Dirham\",\"abbrNation\":\"AED\",\"moneyUnit\":\".\",\"rate\":3.672104},\"AFN\":{\"imgNation\":\"\",\"nameNation\":\"Afghan Afghani\",\"abbrNation\":\"AFN\",\"moneyUnit\":\".\",\"rate\":69.250327},\"ALL\":{\"imgNation\":\"\",\"nameNation\":\"Albanian Lek\",\"abbrNation\":\"ALL\",\"moneyUnit\":\".\",\"rate\":111.300003},\"AMD\":{\"imgNation\":\"\",\"nameNation\":\"Armenian Dram\",\"abbrNation\":\"AMD\",\"moneyUnit\":\".\",\"rate\":481.470001},\"ANG\":{\"imgNation\":\"\",\"nameNation\":\"Netherlands Antillean Guilder\",\"abbrNation\":\"ANG\",\"moneyUnit\":\".\",\"rate\":1.779671},\"AOA\":{\"imgNation\":\"\",\"nameNation\":\"Angolan Kwanza\",\"abbrNation\":\"AOA\",\"moneyUnit\":\".\",\"rate\":165.098007},\"ARS\":{\"imgNation\":\"\",\"nameNation\":\"Argentine Peso\",\"abbrNation\":\"ARS\",\"moneyUnit\":\".\",\"rate\":18.309999},\"AUD\":{\"imgNation\":\"\",\"nameNation\":\"Australian Dollar\",\"abbrNation\":\"AUD\",\"moneyUnit\":\".\",\"rate\":1.292095},\"AWG\":{\"imgNation\":\"\",\"nameNation\":\"Aruban Florin\",\"abbrNation\":\"AWG\",\"moneyUnit\":\".\",\"rate\":1.78},\"AZN\":{\"imgNation\":\"\",\"nameNation\":\"Azerbaijani Manat\",\"abbrNation\":\"AZN\",\"moneyUnit\":\".\",\"rate\":1.699598},\"BAM\":{\"imgNation\":\"\",\"nameNation\":\"Bosnia-Herzegovina Convertible Mark\",\"abbrNation\":\"BAM\",\"moneyUnit\":\".\",\"rate\":1.651041},\"BBD\":{\"imgNation\":\"\",\"nameNation\":\"Barbadian Dollar\",\"abbrNation\":\"BBD\",\"moneyUnit\":\".\",\"rate\":2},\"BDT\":{\"imgNation\":\"\",\"nameNation\":\"Bangladeshi Taka\",\"abbrNation\":\"BDT\",\"moneyUnit\":\".\",\"rate\":82.919998},\"BGN\":{\"imgNation\":\"\",\"nameNation\":\"Bulgarian Lev\",\"abbrNation\":\"BGN\",\"moneyUnit\":\".\",\"rate\":1.650098},\"BHD\":{\"imgNation\":\"\",\"nameNation\":\"Bahraini Dinar\",\"abbrNation\":\"BHD\",\"moneyUnit\":\".\",\"rate\":0.377197},\"BIF\":{\"imgNation\":\"\",\"nameNation\":\"Burundian Franc\",\"abbrNation\":\"BIF\",\"moneyUnit\":\".\",\"rate\":1750.97998},\"BMD\":{\"imgNation\":\"\",\"nameNation\":\"Bermudan Dollar\",\"abbrNation\":\"BMD\",\"moneyUnit\":\".\",\"rate\":1},\"BND\":{\"imgNation\":\"\",\"nameNation\":\"Brunei Dollar\",\"abbrNation\":\"BND\",\"moneyUnit\":\".\",\"rate\":1.341903},\"BOB\":{\"imgNation\":\"\",\"nameNation\":\"Bolivian Boliviano\",\"abbrNation\":\"BOB\",\"moneyUnit\":\".\",\"rate\":6.859631},\"BRL\":{\"imgNation\":\"\",\"nameNation\":\"Brazilian Real\",\"abbrNation\":\"BRL\",\"moneyUnit\":\".\",\"rate\":3.310796},\"BSD\":{\"imgNation\":\"\",\"nameNation\":\"Bahamian Dollar\",\"abbrNation\":\"BSD\",\"moneyUnit\":\".\",\"rate\":1},\"BTC\":{\"imgNation\":\"\",\"nameNation\":\"Bitcoin\",\"abbrNation\":\"BTC\",\"moneyUnit\":\".\",\"rate\":0.000063},\"BTN\":{\"imgNation\":\"\",\"nameNation\":\"Bhutanese Ngultrum\",\"abbrNation\":\"BTN\",\"moneyUnit\":\".\",\"rate\":64.000094},\"BWP\":{\"imgNation\":\"\",\"nameNation\":\"Botswanan Pula\",\"abbrNation\":\"BWP\",\"moneyUnit\":\".\",\"rate\":10.014974},\"BYN\":{\"imgNation\":\"\",\"nameNation\":\"New Belarusian Ruble\",\"abbrNation\":\"BYN\",\"moneyUnit\":\".\",\"rate\":2.019852},\"BYR\":{\"imgNation\":\"\",\"nameNation\":\"Belarusian Ruble\",\"abbrNation\":\"BYR\",\"moneyUnit\":\".\",\"rate\":19600},\"BZD\":{\"imgNation\":\"\",\"nameNation\":\"Belize Dollar\",\"abbrNation\":\"BZD\",\"moneyUnit\":\".\",\"rate\":1.997801},\"CAD\":{\"imgNation\":\"\",\"nameNation\":\"Canadian Dollar\",\"abbrNation\":\"CAD\",\"moneyUnit\":\".\",\"rate\":1.26877},\"CDF\":{\"imgNation\":\"\",\"nameNation\":\"Congolese Franc\",\"abbrNation\":\"CDF\",\"moneyUnit\":\".\",\"rate\":1565.50349},\"CHF\":{\"imgNation\":\"\",\"nameNation\":\"Swiss Franc\",\"abbrNation\":\"CHF\",\"moneyUnit\":\".\",\"rate\":0.98924},\"CLF\":{\"imgNation\":\"\",\"nameNation\":\"Chilean Unit of Account (UF)\",\"abbrNation\":\"CLF\",\"moneyUnit\":\".\",\"rate\":0.02285},\"CLP\":{\"imgNation\":\"\",\"nameNation\":\"Chilean Peso\",\"abbrNation\":\"CLP\",\"moneyUnit\":\".\",\"rate\":618.719971},\"CNY\":{\"imgNation\":\"\",\"nameNation\":\"Chinese Yuan\",\"abbrNation\":\"CNY\",\"moneyUnit\":\".\",\"rate\":6.555398},\"COP\":{\"imgNation\":\"\",\"nameNation\":\"Colombian Peso\",\"abbrNation\":\"COP\",\"moneyUnit\":\".\",\"rate\":2957.399902},\"CRC\":{\"imgNation\":\"\",\"nameNation\":\"Costa Rican Colón\",\"abbrNation\":\"CRC\",\"moneyUnit\":\".\",\"rate\":561.999978},\"CUC\":{\"imgNation\":\"\",\"nameNation\":\"Cuban Convertible Peso\",\"abbrNation\":\"CUC\",\"moneyUnit\":\".\",\"rate\":1},\"CUP\":{\"imgNation\":\"\",\"nameNation\":\"Cuban Peso\",\"abbrNation\":\"CUP\",\"moneyUnit\":\".\",\"rate\":26.5},\"CVE\":{\"imgNation\":\"\",\"nameNation\":\"Cape Verdean Escudo\",\"abbrNation\":\"CVE\",\"moneyUnit\":\".\",\"rate\":92.949997},\"CZK\":{\"imgNation\":\"\",\"nameNation\":\"Czech Republic Koruna\",\"abbrNation\":\"CZK\",\"moneyUnit\":\".\",\"rate\":21.736974},\"DJF\":{\"imgNation\":\"\",\"nameNation\":\"Djiboutian Franc\",\"abbrNation\":\"DJF\",\"moneyUnit\":\".\",\"rate\":176.830002},\"DKK\":{\"imgNation\":\"\",\"nameNation\":\"Danish Krone\",\"abbrNation\":\"DKK\",\"moneyUnit\":\".\",\"rate\":6.27468},\"DOP\":{\"imgNation\":\"\",\"nameNation\":\"Dominican Peso\",\"abbrNation\":\"DOP\",\"moneyUnit\":\".\",\"rate\":48.389999},\"DZD\":{\"imgNation\":\"\",\"nameNation\":\"Algerian Dinar\",\"abbrNation\":\"DZD\",\"moneyUnit\":\".\",\"rate\":114.737999},\"EGP\":{\"imgNation\":\"\",\"nameNation\":\"Egyptian Pound\",\"abbrNation\":\"EGP\",\"moneyUnit\":\".\",\"rate\":17.770063},\"ERN\":{\"imgNation\":\"\",\"nameNation\":\"Eritrean Nakfa\",\"abbrNation\":\"ERN\",\"moneyUnit\":\".\",\"rate\":14.989888},\"ETB\":{\"imgNation\":\"\",\"nameNation\":\"Ethiopian Birr\",\"abbrNation\":\"ETB\",\"moneyUnit\":\".\",\"rate\":27.200001},\"EUR\":{\"imgNation\":\"\",\"nameNation\":\"Euro\",\"abbrNation\":\"EUR\",\"moneyUnit\":\".\",\"rate\":0.842598},\"FJD\":{\"imgNation\":\"\",\"nameNation\":\"Fijian Dollar\",\"abbrNation\":\"FJD\",\"moneyUnit\":\".\",\"rate\":2.076498},\"FKP\":{\"imgNation\":\"\",\"nameNation\":\"Falkland Islands Pound\",\"abbrNation\":\"FKP\",\"moneyUnit\":\".\",\"rate\":0.746945},\"GBP\":{\"imgNation\":\"\",\"nameNation\":\"British Pound Sterling\",\"abbrNation\":\"GBP\",\"moneyUnit\":\".\",\"rate\":0.74771},\"GEL\":{\"imgNation\":\"\",\"nameNation\":\"Georgian Lari\",\"abbrNation\":\"GEL\",\"moneyUnit\":\".\",\"rate\":2.565095},\"GGP\":{\"imgNation\":\"\",\"nameNation\":\"Guernsey Pound\",\"abbrNation\":\"GGP\",\"moneyUnit\":\".\",\"rate\":0.747734},\"GHS\":{\"imgNation\":\"\",\"nameNation\":\"Ghanaian Cedi\",\"abbrNation\":\"GHS\",\"moneyUnit\":\".\",\"rate\":4.508497},\"GIP\":{\"imgNation\":\"\",\"nameNation\":\"Gibraltar Pound\",\"abbrNation\":\"GIP\",\"moneyUnit\":\".\",\"rate\":0.747298},\"GMD\":{\"imgNation\":\"\",\"nameNation\":\"Gambian Dalasi\",\"abbrNation\":\"GMD\",\"moneyUnit\":\".\",\"rate\":47.150002},\"GNF\":{\"imgNation\":\"\",\"nameNation\":\"Guinean Franc\",\"abbrNation\":\"GNF\",\"moneyUnit\":\".\",\"rate\":9002.999881},\"GTQ\":{\"imgNation\":\"\",\"nameNation\":\"Guatemalan Quetzal\",\"abbrNation\":\"GTQ\",\"moneyUnit\":\".\",\"rate\":7.335975},\"GYD\":{\"imgNation\":\"\",\"nameNation\":\"Guyanaese Dollar\",\"abbrNation\":\"GYD\",\"moneyUnit\":\".\",\"rate\":202.250268},\"HKD\":{\"imgNation\":\"\",\"nameNation\":\"Hong Kong Dollar\",\"abbrNation\":\"HKD\",\"moneyUnit\":\".\",\"rate\":7.81153},\"HNL\":{\"imgNation\":\"\",\"nameNation\":\"Honduran Lempira\",\"abbrNation\":\"HNL\",\"moneyUnit\":\".\",\"rate\":23.474982},\"HRK\":{\"imgNation\":\"\",\"nameNation\":\"Croatian Kuna\",\"abbrNation\":\"HRK\",\"moneyUnit\":\".\",\"rate\":6.365902},\"HTG\":{\"imgNation\":\"\",\"nameNation\":\"Haitian Gourde\",\"abbrNation\":\"HTG\",\"moneyUnit\":\".\",\"rate\":62.630001},\"HUF\":{\"imgNation\":\"\",\"nameNation\":\"Hungarian Forint\",\"abbrNation\":\"HUF\",\"moneyUnit\":\".\",\"rate\":262.579987},\"IDR\":{\"imgNation\":\"\",\"nameNation\":\"Indonesian Rupiah\",\"abbrNation\":\"IDR\",\"moneyUnit\":\".\",\"rate\":13559},\"ILS\":{\"imgNation\":\"\",\"nameNation\":\"Israeli New Sheqel\",\"abbrNation\":\"ILS\",\"moneyUnit\":\".\",\"rate\":3.481297},\"IMP\":{\"imgNation\":\"\",\"nameNation\":\"Manx pound\",\"abbrNation\":\"IMP\",\"moneyUnit\":\".\",\"rate\":0.747734},\"INR\":{\"imgNation\":\"\",\"nameNation\":\"Indian Rupee\",\"abbrNation\":\"INR\",\"moneyUnit\":\".\",\"rate\":64.141296},\"IQD\":{\"imgNation\":\"\",\"nameNation\":\"Iraqi Dinar\",\"abbrNation\":\"IQD\",\"moneyUnit\":\".\",\"rate\":1184},\"IRR\":{\"imgNation\":\"\",\"nameNation\":\"Iranian Rial\",\"abbrNation\":\"IRR\",\"moneyUnit\":\".\",\"rate\":35997.99978},\"ISK\":{\"imgNation\":\"\",\"nameNation\":\"Icelandic Króna\",\"abbrNation\":\"ISK\",\"moneyUnit\":\".\",\"rate\":105.750143},\"JEP\":{\"imgNation\":\"\",\"nameNation\":\"Jersey Pound\",\"abbrNation\":\"JEP\",\"moneyUnit\":\".\",\"rate\":0.747734},\"JMD\":{\"imgNation\":\"\",\"nameNation\":\"Jamaican Dollar\",\"abbrNation\":\"JMD\",\"moneyUnit\":\".\",\"rate\":123.860001},\"JOD\":{\"imgNation\":\"\",\"nameNation\":\"Jordanian Dinar\",\"abbrNation\":\"JOD\",\"moneyUnit\":\".\",\"rate\":0.707498},\"JPY\":{\"imgNation\":\"\",\"nameNation\":\"Japanese Yen\",\"abbrNation\":\"JPY\",\"moneyUnit\":\".\",\"rate\":113.253998},\"KES\":{\"imgNation\":\"\",\"nameNation\":\"Kenyan Shilling\",\"abbrNation\":\"KES\",\"moneyUnit\":\".\",\"rate\":102.750021},\"KGS\":{\"imgNation\":\"\",\"nameNation\":\"Kyrgystani Som\",\"abbrNation\":\"KGS\",\"moneyUnit\":\".\",\"rate\":69.363998},\"KHR\":{\"imgNation\":\"\",\"nameNation\":\"Cambodian Riel\",\"abbrNation\":\"KHR\",\"moneyUnit\":\".\",\"rate\":4030.899902},\"KMF\":{\"imgNation\":\"\",\"nameNation\":\"Comorian Franc\",\"abbrNation\":\"KMF\",\"moneyUnit\":\".\",\"rate\":411.019989},\"KPW\":{\"imgNation\":\"\",\"nameNation\":\"North Korean Won\",\"abbrNation\":\"KPW\",\"moneyUnit\":\".\",\"rate\":900.000471},\"KRW\":{\"imgNation\":\"\",\"nameNation\":\"South Korean Won\",\"abbrNation\":\"KRW\",\"moneyUnit\":\".\",\"rate\":1074.439941},\"KWD\":{\"imgNation\":\"\",\"nameNation\":\"Kuwaiti Dinar\",\"abbrNation\":\"KWD\",\"moneyUnit\":\".\",\"rate\":0.301898},\"KYD\":{\"imgNation\":\"\",\"nameNation\":\"Cayman Islands Dollar\",\"abbrNation\":\"KYD\",\"moneyUnit\":\".\",\"rate\":0.820018},\"KZT\":{\"imgNation\":\"\",\"nameNation\":\"Kazakhstani Tenge\",\"abbrNation\":\"KZT\",\"moneyUnit\":\".\",\"rate\":331.970001},\"LAK\":{\"imgNation\":\"\",\"nameNation\":\"Laotian Kip\",\"abbrNation\":\"LAK\",\"moneyUnit\":\".\",\"rate\":8291.000192},\"LBP\":{\"imgNation\":\"\",\"nameNation\":\"Lebanese Pound\",\"abbrNation\":\"LBP\",\"moneyUnit\":\".\",\"rate\":1510.999653},\"LKR\":{\"imgNation\":\"\",\"nameNation\":\"Sri Lankan Rupee\",\"abbrNation\":\"LKR\",\"moneyUnit\":\".\",\"rate\":152.600006},\"LRD\":{\"imgNation\":\"\",\"nameNation\":\"Liberian Dollar\",\"abbrNation\":\"LRD\",\"moneyUnit\":\".\",\"rate\":125.160004},\"LSL\":{\"imgNation\":\"\",\"nameNation\":\"Lesotho Loti\",\"abbrNation\":\"LSL\",\"moneyUnit\":\".\",\"rate\":12.510104},\"LTL\":{\"imgNation\":\"\",\"nameNation\":\"Lithuanian Litas\",\"abbrNation\":\"LTL\",\"moneyUnit\":\".\",\"rate\":3.048704},\"LVL\":{\"imgNation\":\"\",\"nameNation\":\"Latvian Lats\",\"abbrNation\":\"LVL\",\"moneyUnit\":\".\",\"rate\":0.62055},\"LYD\":{\"imgNation\":\"\",\"nameNation\":\"Libyan Dinar\",\"abbrNation\":\"LYD\",\"moneyUnit\":\".\",\"rate\":1.360202},\"MAD\":{\"imgNation\":\"\",\"nameNation\":\"Moroccan Dirham\",\"abbrNation\":\"MAD\",\"moneyUnit\":\".\",\"rate\":9.405197},\"MDL\":{\"imgNation\":\"\",\"nameNation\":\"Moldovan Leu\",\"abbrNation\":\"MDL\",\"moneyUnit\":\".\",\"rate\":17.083995},\"MGA\":{\"imgNation\":\"\",\"nameNation\":\"Malagasy Ariary\",\"abbrNation\":\"MGA\",\"moneyUnit\":\".\",\"rate\":3214.999852},\"MKD\":{\"imgNation\":\"\",\"nameNation\":\"Macedonian Denar\",\"abbrNation\":\"MKD\",\"moneyUnit\":\".\",\"rate\":51.669998},\"MMK\":{\"imgNation\":\"\",\"nameNation\":\"Myanma Kyat\",\"abbrNation\":\"MMK\",\"moneyUnit\":\".\",\"rate\":1361.000124},\"MNT\":{\"imgNation\":\"\",\"nameNation\":\"Mongolian Tugrik\",\"abbrNation\":\"MNT\",\"moneyUnit\":\".\",\"rate\":2420.999382},\"MOP\":{\"imgNation\":\"\",\"nameNation\":\"Macanese Pataca\",\"abbrNation\":\"MOP\",\"moneyUnit\":\".\",\"rate\":8.0459},\"MRO\":{\"imgNation\":\"\",\"nameNation\":\"Mauritanian Ouguiya\",\"abbrNation\":\"MRO\",\"moneyUnit\":\".\",\"rate\":351.600006},\"MUR\":{\"imgNation\":\"\",\"nameNation\":\"Mauritian Rupee\",\"abbrNation\":\"MUR\",\"moneyUnit\":\".\",\"rate\":33.029999},\"MVR\":{\"imgNation\":\"\",\"nameNation\":\"Maldivian Rufiyaa\",\"abbrNation\":\"MVR\",\"moneyUnit\":\".\",\"rate\":15.570293},\"MWK\":{\"imgNation\":\"\",\"nameNation\":\"Malawian Kwacha\",\"abbrNation\":\"MWK\",\"moneyUnit\":\".\",\"rate\":713.450012},\"MXN\":{\"imgNation\":\"\",\"nameNation\":\"Mexican Peso\",\"abbrNation\":\"MXN\",\"moneyUnit\":\".\",\"rate\":19.861903},\"MYR\":{\"imgNation\":\"\",\"nameNation\":\"Malaysian Ringgit\",\"abbrNation\":\"MYR\",\"moneyUnit\":\".\",\"rate\":4.082995},\"MZN\":{\"imgNation\":\"\",\"nameNation\":\"Mozambican Metical\",\"abbrNation\":\"MZN\",\"moneyUnit\":\".\",\"rate\":58.540001},\"NAD\":{\"imgNation\":\"\",\"nameNation\":\"Namibian Dollar\",\"abbrNation\":\"NAD\",\"moneyUnit\":\".\",\"rate\":12.502019},\"NGN\":{\"imgNation\":\"\",\"nameNation\":\"Nigerian Naira\",\"abbrNation\":\"NGN\",\"moneyUnit\":\".\",\"rate\":354.999765},\"NIO\":{\"imgNation\":\"\",\"nameNation\":\"Nicaraguan Córdoba\",\"abbrNation\":\"NIO\",\"moneyUnit\":\".\",\"rate\":30.669755},\"NOK\":{\"imgNation\":\"\",\"nameNation\":\"Norwegian Krone\",\"abbrNation\":\"NOK\",\"moneyUnit\":\".\",\"rate\":8.306201},\"NPR\":{\"imgNation\":\"\",\"nameNation\":\"Nepalese Rupee\",\"abbrNation\":\"NPR\",\"moneyUnit\":\".\",\"rate\":102.568001},\"NZD\":{\"imgNation\":\"\",\"nameNation\":\"New Zealand Dollar\",\"abbrNation\":\"NZD\",\"moneyUnit\":\".\",\"rate\":1.418974},\"OMR\":{\"imgNation\":\"\",\"nameNation\":\"Omani Rial\",\"abbrNation\":\"OMR\",\"moneyUnit\":\".\",\"rate\":0.384498},\"PAB\":{\"imgNation\":\"\",\"nameNation\":\"Panamanian Balboa\",\"abbrNation\":\"PAB\",\"moneyUnit\":\".\",\"rate\":1},\"PEN\":{\"imgNation\":\"\",\"nameNation\":\"Peruvian Nuevo Sol\",\"abbrNation\":\"PEN\",\"moneyUnit\":\".\",\"rate\":3.235978},\"PGK\":{\"imgNation\":\"\",\"nameNation\":\"Papua New Guinean Kina\",\"abbrNation\":\"PGK\",\"moneyUnit\":\".\",\"rate\":3.2233},\"PHP\":{\"imgNation\":\"\",\"nameNation\":\"Philippine Peso\",\"abbrNation\":\"PHP\",\"moneyUnit\":\".\",\"rate\":49.959999},\"PKR\":{\"imgNation\":\"\",\"nameNation\":\"Pakistani Rupee\",\"abbrNation\":\"PKR\",\"moneyUnit\":\".\",\"rate\":110.199997},\"PLN\":{\"imgNation\":\"\",\"nameNation\":\"Polish Zloty\",\"abbrNation\":\"PLN\",\"moneyUnit\":\".\",\"rate\":3.5368},\"PYG\":{\"imgNation\":\"\",\"nameNation\":\"Paraguayan Guarani\",\"abbrNation\":\"PYG\",\"moneyUnit\":\".\",\"rate\":5614.000109},\"QAR\":{\"imgNation\":\"\",\"nameNation\":\"Qatari Rial\",\"abbrNation\":\"QAR\",\"moneyUnit\":\".\",\"rate\":3.639801},\"RON\":{\"imgNation\":\"\",\"nameNation\":\"Romanian Leu\",\"abbrNation\":\"RON\",\"moneyUnit\":\".\",\"rate\":3.906602},\"RSD\":{\"imgNation\":\"\",\"nameNation\":\"Serbian Dinar\",\"abbrNation\":\"RSD\",\"moneyUnit\":\".\",\"rate\":99.505096},\"RUB\":{\"imgNation\":\"\",\"nameNation\":\"Russian Ruble\",\"abbrNation\":\"RUB\",\"moneyUnit\":\".\",\"rate\":57.665979},\"RWF\":{\"imgNation\":\"\",\"nameNation\":\"Rwandan Franc\",\"abbrNation\":\"RWF\",\"moneyUnit\":\".\",\"rate\":835.75},\"SAR\":{\"imgNation\":\"\",\"nameNation\":\"Saudi Riyal\",\"abbrNation\":\"SAR\",\"moneyUnit\":\".\",\"rate\":3.750244},\"SBD\":{\"imgNation\":\"\",\"nameNation\":\"Solomon Islands Dollar\",\"abbrNation\":\"SBD\",\"moneyUnit\":\".\",\"rate\":7.734398},\"SCR\":{\"imgNation\":\"\",\"nameNation\":\"Seychellois Rupee\",\"abbrNation\":\"SCR\",\"moneyUnit\":\".\",\"rate\":13.35022},\"SDG\":{\"imgNation\":\"\",\"nameNation\":\"Sudanese Pound\",\"abbrNation\":\"SDG\",\"moneyUnit\":\".\",\"rate\":6.997197},\"SEK\":{\"imgNation\":\"\",\"nameNation\":\"Swedish Krona\",\"abbrNation\":\"SEK\",\"moneyUnit\":\".\",\"rate\":8.34868},\"SGD\":{\"imgNation\":\"\",\"nameNation\":\"Singapore Dollar\",\"abbrNation\":\"SGD\",\"moneyUnit\":\".\",\"rate\":1.34267},\"SHP\":{\"imgNation\":\"\",\"nameNation\":\"Saint Helena Pound\",\"abbrNation\":\"SHP\",\"moneyUnit\":\".\",\"rate\":0.747299},\"SLL\":{\"imgNation\":\"\",\"nameNation\":\"Sierra Leonean Leone\",\"abbrNation\":\"SLL\",\"moneyUnit\":\".\",\"rate\":7630.000292},\"SOS\":{\"imgNation\":\"\",\"nameNation\":\"Somali Shilling\",\"abbrNation\":\"SOS\",\"moneyUnit\":\".\",\"rate\":559.00018},\"SRD\":{\"imgNation\":\"\",\"nameNation\":\"Surinamese Dollar\",\"abbrNation\":\"SRD\",\"moneyUnit\":\".\",\"rate\":7.409553},\"STD\":{\"imgNation\":\"\",\"nameNation\":\"São Tomé and Príncipe Dobra\",\"abbrNation\":\"STD\",\"moneyUnit\":\".\",\"rate\":20654.099609},\"SVC\":{\"imgNation\":\"\",\"nameNation\":\"Salvadoran Colón\",\"abbrNation\":\"SVC\",\"moneyUnit\":\".\",\"rate\":8.750398},\"SYP\":{\"imgNation\":\"\",\"nameNation\":\"Syrian Pound\",\"abbrNation\":\"SYP\",\"moneyUnit\":\".\",\"rate\":514.97998},\"SZL\":{\"imgNation\":\"\",\"nameNation\":\"Swazi Lilangeni\",\"abbrNation\":\"SZL\",\"moneyUnit\":\".\",\"rate\":12.499106},\"THB\":{\"imgNation\":\"\",\"nameNation\":\"Thai Baht\",\"abbrNation\":\"THB\",\"moneyUnit\":\".\",\"rate\":32.810001},\"TJS\":{\"imgNation\":\"\",\"nameNation\":\"Tajikistani Somoni\",\"abbrNation\":\"TJS\",\"moneyUnit\":\".\",\"rate\":8.823798},\"TMT\":{\"imgNation\":\"\",\"nameNation\":\"Turkmenistani Manat\",\"abbrNation\":\"TMT\",\"moneyUnit\":\".\",\"rate\":3.41},\"TND\":{\"imgNation\":\"\",\"nameNation\":\"Tunisian Dinar\",\"abbrNation\":\"TND\",\"moneyUnit\":\".\",\"rate\":2.477404},\"TOP\":{\"imgNation\":\"\",\"nameNation\":\"Tongan Paʻanga\",\"abbrNation\":\"TOP\",\"moneyUnit\":\".\",\"rate\":2.292099},\"TRY\":{\"imgNation\":\"\",\"nameNation\":\"Turkish Lira\",\"abbrNation\":\"TRY\",\"moneyUnit\":\".\",\"rate\":3.807701},\"TTD\":{\"imgNation\":\"\",\"nameNation\":\"Trinidad and Tobago Dollar\",\"abbrNation\":\"TTD\",\"moneyUnit\":\".\",\"rate\":6.629503},\"TWD\":{\"imgNation\":\"\",\"nameNation\":\"New Taiwan Dollar\",\"abbrNation\":\"TWD\",\"moneyUnit\":\".\",\"rate\":29.892989},\"TZS\":{\"imgNation\":\"\",\"nameNation\":\"Tanzanian Shilling\",\"abbrNation\":\"TZS\",\"moneyUnit\":\".\",\"rate\":2229.999783},\"UAH\":{\"imgNation\":\"\",\"nameNation\":\"Ukrainian Hryvnia\",\"abbrNation\":\"UAH\",\"moneyUnit\":\".\",\"rate\":27.809999},\"UGX\":{\"imgNation\":\"\",\"nameNation\":\"Ugandan Shilling\",\"abbrNation\":\"UGX\",\"moneyUnit\":\".\",\"rate\":3604.999786},\"UYU\":{\"imgNation\":\"\",\"nameNation\":\"Uruguayan Peso\",\"abbrNation\":\"UYU\",\"moneyUnit\":\".\",\"rate\":28.749947},\"UZS\":{\"imgNation\":\"\",\"nameNation\":\"Uzbekistan Som\",\"abbrNation\":\"UZS\",\"moneyUnit\":\".\",\"rate\":8090.000429},\"VEF\":{\"imgNation\":\"\",\"nameNation\":\"Venezuelan Bolívar Fuerte\",\"abbrNation\":\"VEF\",\"moneyUnit\":\".\",\"rate\":9.975011},\"VND\":{\"imgNation\":\"\",\"nameNation\":\"Vietnamese Dong\",\"abbrNation\":\"VND\",\"moneyUnit\":\".\",\"rate\":22709},\"VUV\":{\"imgNation\":\"\",\"nameNation\":\"Vanuatu Vatu\",\"abbrNation\":\"VUV\",\"moneyUnit\":\".\",\"rate\":105.179956},\"WST\":{\"imgNation\":\"\",\"nameNation\":\"Samoan Tala\",\"abbrNation\":\"WST\",\"moneyUnit\":\".\",\"rate\":2.5623},\"XAF\":{\"imgNation\":\"\",\"nameNation\":\"CFA Franc BEAC\",\"abbrNation\":\"XAF\",\"moneyUnit\":\".\",\"rate\":552.450012},\"XAG\":{\"imgNation\":\"\",\"nameNation\":\"Silver (troy ounce)\",\"abbrNation\":\"XAG\",\"moneyUnit\":\".\",\"rate\":0.060579},\"XAU\":{\"imgNation\":\"\",\"nameNation\":\"Gold (troy ounce)\",\"abbrNation\":\"XAU\",\"moneyUnit\":\".\",\"rate\":0.00078},\"XCD\":{\"imgNation\":\"\",\"nameNation\":\"East Caribbean Dollar\",\"abbrNation\":\"XCD\",\"moneyUnit\":\".\",\"rate\":2.700199},\"XDR\":{\"imgNation\":\"\",\"nameNation\":\"Special Drawing Rights\",\"abbrNation\":\"XDR\",\"moneyUnit\":\".\",\"rate\":0.705664},\"XOF\":{\"imgNation\":\"\",\"nameNation\":\"CFA Franc BCEAO\",\"abbrNation\":\"XOF\",\"moneyUnit\":\".\",\"rate\":562.960022},\"XPF\":{\"imgNation\":\"\",\"nameNation\":\"CFP Franc\",\"abbrNation\":\"XPF\",\"moneyUnit\":\".\",\"rate\":100.5202},\"YER\":{\"imgNation\":\"\",\"nameNation\":\"Yemeni Rial\",\"abbrNation\":\"YER\",\"moneyUnit\":\".\",\"rate\":249.850006},\"ZAR\":{\"imgNation\":\"\",\"nameNation\":\"South African Rand\",\"abbrNation\":\"ZAR\",\"moneyUnit\":\".\",\"rate\":12.501895},\"ZMK\":{\"imgNation\":\"\",\"nameNation\":\"Zambian Kwacha (pre-2013)\",\"abbrNation\":\"ZMK\",\"moneyUnit\":\".\",\"rate\":9001.205638},\"ZMW\":{\"imgNation\":\"\",\"nameNation\":\"Zambian Kwacha\",\"abbrNation\":\"ZMW\",\"moneyUnit\":\".\",\"rate\":9.710271},\"ZWL\":{\"imgNation\":\"\",\"nameNation\":\"Zimbabwean Dollar\",\"abbrNation\":\"ZWL\",\"moneyUnit\":\".\",\"rate\":322.355011}}");
        this.timestamp = null;
    }

    convert(from, amount, to) {
        if (this.table === null || !((from in this.table) && (to in this.table))) {
            throw "Bad input" + from + " -> " + to;
        }

        if (from === to) {
            return amount;
        }

        // 一律先转成美元，再转成目标
        let rateFrom2USD = 1 / this.table[from]["rate"];
        let rateUSD2To = this.table[to]["rate"];

        return amount * rateFrom2USD * rateUSD2To;
    }

    loadFromAPI() {
        const accessKey = '28c3838ae4ee996dc7df28181ff3c7d3';
        const URL_API = 'http://apilayer.net/api/live?access_key=' + accessKey;

        let that = this;
        axios.get(URL_API).then(function (response) {
            let data = response["data"];

            that.timestamp = data.timestamp;
            data = data["quotes"];
            that.table["USD"] = {
                imgNation: "",
                nameNation: that.currencies["USD"],
                abbrNation: 'USD',
                moneyUnit: "dollar",
                rate: 1.0
            };

            for (let each in data) {
                const abbr = each.substring(3);
                that.table[abbr] = {
                    imgNation: "",
                    nameNation: that.currencies[abbr],
                    abbrNation: abbr,
                    moneyUnit: ".",
                    rate: data[each]
                };
            }
        });
    }

    isLocalStorageOutdate() {
        // todo
        return false;
    }

    load() {
        return;
        // beforeMount 时调用
        let storage = localStorage.getItem(this.STORAGE_KEY);

        if (storage === null) {
            // 本地储存没有，则从云端获取
            this.loadFromAPI();
            return;
        }

        // 本地储存非空，则读取进来
        try {
            storage = JSON.parse(storage);
            this.table = storage.data;
            this.timestamp = storage.timestamp;
        } catch (e) {
            // 本地储存格式不对，重新获取
            console.log("Bad local storage for convert rate, using default");
            this.loadFromAPI();
            return;
        }

        // 本地储存太旧，更新
        if (this.isLocalStorageOutdate()) {
            this.loadFromAPI();
        }
    }

    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            data: this.table,
            timestamp: this.timestamp
        }));
    }
}