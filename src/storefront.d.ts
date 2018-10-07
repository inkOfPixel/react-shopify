// tslint:disable
// graphql typescript definitions

declare namespace Storefront {
  interface IGraphQLResponseRoot {
    data?: IQueryRoot | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  /**
   * The schema’s entry-point for queries. This acts as the public, top-level API from which all queries must start.
   */
  interface IQueryRoot {
    __typename: 'QueryRoot';
    customer: ICustomer | null;
    node: Node | null;
    nodes: Array<Node>;
    shop: IShop;
  }

  interface ICustomerOnQueryRootArguments {
    /**
     * The customer access token
     */
    customerAccessToken: string;
  }

  interface INodeOnQueryRootArguments {
    /**
     * The ID of the Node to return.
     */
    id: string;
  }

  interface INodesOnQueryRootArguments {
    /**
     * The IDs of the Nodes to return.
     */
    ids: Array<string>;
  }

  /**
   * A customer represents a customer account with the shop. Customer accounts store contact information for the customer, saving logged-in customers the trouble of having to provide it at every checkout.
   */
  interface ICustomer {
    __typename: 'Customer';

    /**
     * Indicates whether the customer has consented to be sent marketing material via email.
     */
    acceptsMarketing: boolean;

    /**
     * A list of addresses for the customer.
     */
    addresses: IMailingAddressConnection;

    /**
     * The date and time when the customer was created.
     */
    createdAt: any;

    /**
     * The customer’s default address.
     */
    defaultAddress: IMailingAddress | null;

    /**
     * The customer’s name, email or phone number.
     */
    displayName: string;

    /**
     * The customer’s email address.
     */
    email: string | null;

    /**
     * The customer’s first name.
     */
    firstName: string | null;

    /**
     * A unique identifier for the customer.
     */
    id: string;

    /**
     * The customer’s last name.
     */
    lastName: string | null;

    /**
     * The orders associated with the customer.
     */
    orders: IOrderConnection;

    /**
     * The customer’s phone number.
     */
    phone: string | null;

    /**
     * The date and time when the customer information was updated.
     */
    updatedAt: any;
  }

  interface IAddressesOnCustomerArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;
  }

  interface IOrdersOnCustomerArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;

    /**
     * Sort the underlying list by the given key.
     * @default "ID"
     */
    sortKey?: OrderSortKeys | null;

    /**
     * Supported filter parameters:
     *  - `processed_at`
     */
    query?: string | null;
  }

  interface IMailingAddressConnection {
    __typename: 'MailingAddressConnection';

    /**
     * A list of edges.
     */
    edges: Array<IMailingAddressEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IMailingAddressEdge {
    __typename: 'MailingAddressEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of MailingAddressEdge.
     */
    node: IMailingAddress;
  }

  /**
   * Represents a mailing address for customers and shipping.
   */
  interface IMailingAddress {
    __typename: 'MailingAddress';

    /**
     * The first line of the address. Typically the street address or PO Box number.
     *
     */
    address1: string | null;

    /**
     * The second line of the address. Typically the number of the apartment, suite, or unit.
     *
     */
    address2: string | null;

    /**
     * The name of the city, district, village, or town.
     *
     */
    city: string | null;

    /**
     * The name of the customer's company or organization.
     *
     */
    company: string | null;

    /**
     * The name of the country.
     *
     */
    country: string | null;

    /**
     * The two-letter code for the country of the address.
     *
     * For example, US.
     *
     * @deprecated "Use `countryCodeV2` instead"
     */
    countryCode: string | null;

    /**
     * The two-letter code for the country of the address.
     *
     * For example, US.
     *
     */
    countryCodeV2: CountryCode | null;

    /**
     * The first name of the customer.
     */
    firstName: string | null;

    /**
     * A formatted version of the address, customized by the provided arguments.
     */
    formatted: Array<string>;

    /**
     * A comma-separated list of the values for city, province, and country.
     */
    formattedArea: string | null;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * The last name of the customer.
     */
    lastName: string | null;

    /**
     * The latitude coordinate of the customer address.
     */
    latitude: number | null;

    /**
     * The longitude coordinate of the customer address.
     */
    longitude: number | null;

    /**
     * The full name of the customer, based on firstName and lastName.
     *
     */
    name: string | null;

    /**
     * A unique phone number for the customer.
     *
     * Formatted using E.164 standard. For example, _+16135551111_.
     *
     */
    phone: string | null;

    /**
     * The region of the address, such as the province, state, or district.
     */
    province: string | null;

    /**
     * The two-letter code for the region.
     *
     * For example, ON.
     *
     */
    provinceCode: string | null;

    /**
     * The zip or postal code of the address.
     */
    zip: string | null;
  }

  interface IFormattedOnMailingAddressArguments {
    /**
     * Whether to include the customer's name in the formatted address.
     * @default false
     */
    withName?: boolean | null;

    /**
     * Whether to include the customer's company in the formatted address.
     * @default true
     */
    withCompany?: boolean | null;
  }

  /**
   * An object with an ID to support global identification.
   */
  type Node =
    | IMailingAddress
    | IOrder
    | IProductVariant
    | IProduct
    | ICollection
    | IProductOption
    | IArticle
    | IBlog
    | IComment
    | IShopPolicy
    | ICheckout
    | IAppliedGiftCard
    | ICheckoutLineItem
    | IPayment;

  /**
   * An object with an ID to support global identification.
   */
  interface INode {
    __typename: 'Node';

    /**
     * Globally unique identifier.
     */
    id: string;
  }

  /**
   * ISO 3166-1 alpha-2 country codes with some differences.
   */
  const enum CountryCode {
    /**
     * Afghanistan
     */
    AF = 'AF',

    /**
     * Aland Islands
     */
    AX = 'AX',

    /**
     * Albania
     */
    AL = 'AL',

    /**
     * Algeria
     */
    DZ = 'DZ',

    /**
     * Andorra
     */
    AD = 'AD',

    /**
     * Angola
     */
    AO = 'AO',

    /**
     * Anguilla
     */
    AI = 'AI',

    /**
     * Antigua And Barbuda
     */
    AG = 'AG',

    /**
     * Argentina
     */
    AR = 'AR',

    /**
     * Armenia
     */
    AM = 'AM',

    /**
     * Aruba
     */
    AW = 'AW',

    /**
     * Australia
     */
    AU = 'AU',

    /**
     * Austria
     */
    AT = 'AT',

    /**
     * Azerbaijan
     */
    AZ = 'AZ',

    /**
     * Bahamas
     */
    BS = 'BS',

    /**
     * Bahrain
     */
    BH = 'BH',

    /**
     * Bangladesh
     */
    BD = 'BD',

    /**
     * Barbados
     */
    BB = 'BB',

    /**
     * Belarus
     */
    BY = 'BY',

    /**
     * Belgium
     */
    BE = 'BE',

    /**
     * Belize
     */
    BZ = 'BZ',

    /**
     * Benin
     */
    BJ = 'BJ',

    /**
     * Bermuda
     */
    BM = 'BM',

    /**
     * Bhutan
     */
    BT = 'BT',

    /**
     * Bolivia
     */
    BO = 'BO',

    /**
     * Bonaire, Sint Eustatius and Saba
     */
    BQ = 'BQ',

    /**
     * Bosnia And Herzegovina
     */
    BA = 'BA',

    /**
     * Botswana
     */
    BW = 'BW',

    /**
     * Bouvet Island
     */
    BV = 'BV',

    /**
     * Brazil
     */
    BR = 'BR',

    /**
     * British Indian Ocean Territory
     */
    IO = 'IO',

    /**
     * Brunei
     */
    BN = 'BN',

    /**
     * Bulgaria
     */
    BG = 'BG',

    /**
     * Burkina Faso
     */
    BF = 'BF',

    /**
     * Burundi
     */
    BI = 'BI',

    /**
     * Cambodia
     */
    KH = 'KH',

    /**
     * Canada
     */
    CA = 'CA',

    /**
     * Cape Verde
     */
    CV = 'CV',

    /**
     * Cayman Islands
     */
    KY = 'KY',

    /**
     * Central African Republic
     */
    CF = 'CF',

    /**
     * Chad
     */
    TD = 'TD',

    /**
     * Chile
     */
    CL = 'CL',

    /**
     * China
     */
    CN = 'CN',

    /**
     * Christmas Island
     */
    CX = 'CX',

    /**
     * Cocos (Keeling) Islands
     */
    CC = 'CC',

    /**
     * Colombia
     */
    CO = 'CO',

    /**
     * Comoros
     */
    KM = 'KM',

    /**
     * Congo
     */
    CG = 'CG',

    /**
     * Congo, The Democratic Republic Of The
     */
    CD = 'CD',

    /**
     * Cook Islands
     */
    CK = 'CK',

    /**
     * Costa Rica
     */
    CR = 'CR',

    /**
     * Croatia
     */
    HR = 'HR',

    /**
     * Cuba
     */
    CU = 'CU',

    /**
     * Curaçao
     */
    CW = 'CW',

    /**
     * Cyprus
     */
    CY = 'CY',

    /**
     * Czech Republic
     */
    CZ = 'CZ',

    /**
     * Côte d'Ivoire
     */
    CI = 'CI',

    /**
     * Denmark
     */
    DK = 'DK',

    /**
     * Djibouti
     */
    DJ = 'DJ',

    /**
     * Dominica
     */
    DM = 'DM',

    /**
     * Dominican Republic
     */
    DO = 'DO',

    /**
     * Ecuador
     */
    EC = 'EC',

    /**
     * Egypt
     */
    EG = 'EG',

    /**
     * El Salvador
     */
    SV = 'SV',

    /**
     * Equatorial Guinea
     */
    GQ = 'GQ',

    /**
     * Eritrea
     */
    ER = 'ER',

    /**
     * Estonia
     */
    EE = 'EE',

    /**
     * Ethiopia
     */
    ET = 'ET',

    /**
     * Falkland Islands (Malvinas)
     */
    FK = 'FK',

    /**
     * Faroe Islands
     */
    FO = 'FO',

    /**
     * Fiji
     */
    FJ = 'FJ',

    /**
     * Finland
     */
    FI = 'FI',

    /**
     * France
     */
    FR = 'FR',

    /**
     * French Guiana
     */
    GF = 'GF',

    /**
     * French Polynesia
     */
    PF = 'PF',

    /**
     * French Southern Territories
     */
    TF = 'TF',

    /**
     * Gabon
     */
    GA = 'GA',

    /**
     * Gambia
     */
    GM = 'GM',

    /**
     * Georgia
     */
    GE = 'GE',

    /**
     * Germany
     */
    DE = 'DE',

    /**
     * Ghana
     */
    GH = 'GH',

    /**
     * Gibraltar
     */
    GI = 'GI',

    /**
     * Greece
     */
    GR = 'GR',

    /**
     * Greenland
     */
    GL = 'GL',

    /**
     * Grenada
     */
    GD = 'GD',

    /**
     * Guadeloupe
     */
    GP = 'GP',

    /**
     * Guatemala
     */
    GT = 'GT',

    /**
     * Guernsey
     */
    GG = 'GG',

    /**
     * Guinea
     */
    GN = 'GN',

    /**
     * Guinea Bissau
     */
    GW = 'GW',

    /**
     * Guyana
     */
    GY = 'GY',

    /**
     * Haiti
     */
    HT = 'HT',

    /**
     * Heard Island And Mcdonald Islands
     */
    HM = 'HM',

    /**
     * Holy See (Vatican City State)
     */
    VA = 'VA',

    /**
     * Honduras
     */
    HN = 'HN',

    /**
     * Hong Kong
     */
    HK = 'HK',

    /**
     * Hungary
     */
    HU = 'HU',

    /**
     * Iceland
     */
    IS = 'IS',

    /**
     * India
     */
    IN = 'IN',

    /**
     * Indonesia
     */
    ID = 'ID',

    /**
     * Iran, Islamic Republic Of
     */
    IR = 'IR',

    /**
     * Iraq
     */
    IQ = 'IQ',

    /**
     * Ireland
     */
    IE = 'IE',

    /**
     * Isle Of Man
     */
    IM = 'IM',

    /**
     * Israel
     */
    IL = 'IL',

    /**
     * Italy
     */
    IT = 'IT',

    /**
     * Jamaica
     */
    JM = 'JM',

    /**
     * Japan
     */
    JP = 'JP',

    /**
     * Jersey
     */
    JE = 'JE',

    /**
     * Jordan
     */
    JO = 'JO',

    /**
     * Kazakhstan
     */
    KZ = 'KZ',

    /**
     * Kenya
     */
    KE = 'KE',

    /**
     * Kiribati
     */
    KI = 'KI',

    /**
     * Korea, Democratic People's Republic Of
     */
    KP = 'KP',

    /**
     * Kosovo
     */
    XK = 'XK',

    /**
     * Kuwait
     */
    KW = 'KW',

    /**
     * Kyrgyzstan
     */
    KG = 'KG',

    /**
     * Lao People's Democratic Republic
     */
    LA = 'LA',

    /**
     * Latvia
     */
    LV = 'LV',

    /**
     * Lebanon
     */
    LB = 'LB',

    /**
     * Lesotho
     */
    LS = 'LS',

    /**
     * Liberia
     */
    LR = 'LR',

    /**
     * Libyan Arab Jamahiriya
     */
    LY = 'LY',

    /**
     * Liechtenstein
     */
    LI = 'LI',

    /**
     * Lithuania
     */
    LT = 'LT',

    /**
     * Luxembourg
     */
    LU = 'LU',

    /**
     * Macao
     */
    MO = 'MO',

    /**
     * Macedonia, Republic Of
     */
    MK = 'MK',

    /**
     * Madagascar
     */
    MG = 'MG',

    /**
     * Malawi
     */
    MW = 'MW',

    /**
     * Malaysia
     */
    MY = 'MY',

    /**
     * Maldives
     */
    MV = 'MV',

    /**
     * Mali
     */
    ML = 'ML',

    /**
     * Malta
     */
    MT = 'MT',

    /**
     * Martinique
     */
    MQ = 'MQ',

    /**
     * Mauritania
     */
    MR = 'MR',

    /**
     * Mauritius
     */
    MU = 'MU',

    /**
     * Mayotte
     */
    YT = 'YT',

    /**
     * Mexico
     */
    MX = 'MX',

    /**
     * Moldova, Republic of
     */
    MD = 'MD',

    /**
     * Monaco
     */
    MC = 'MC',

    /**
     * Mongolia
     */
    MN = 'MN',

    /**
     * Montenegro
     */
    ME = 'ME',

    /**
     * Montserrat
     */
    MS = 'MS',

    /**
     * Morocco
     */
    MA = 'MA',

    /**
     * Mozambique
     */
    MZ = 'MZ',

    /**
     * Myanmar
     */
    MM = 'MM',

    /**
     * Namibia
     */
    NA = 'NA',

    /**
     * Nauru
     */
    NR = 'NR',

    /**
     * Nepal
     */
    NP = 'NP',

    /**
     * Netherlands
     */
    NL = 'NL',

    /**
     * Netherlands Antilles
     */
    AN = 'AN',

    /**
     * New Caledonia
     */
    NC = 'NC',

    /**
     * New Zealand
     */
    NZ = 'NZ',

    /**
     * Nicaragua
     */
    NI = 'NI',

    /**
     * Niger
     */
    NE = 'NE',

    /**
     * Nigeria
     */
    NG = 'NG',

    /**
     * Niue
     */
    NU = 'NU',

    /**
     * Norfolk Island
     */
    NF = 'NF',

    /**
     * Norway
     */
    NO = 'NO',

    /**
     * Oman
     */
    OM = 'OM',

    /**
     * Pakistan
     */
    PK = 'PK',

    /**
     * Palestinian Territory, Occupied
     */
    PS = 'PS',

    /**
     * Panama
     */
    PA = 'PA',

    /**
     * Papua New Guinea
     */
    PG = 'PG',

    /**
     * Paraguay
     */
    PY = 'PY',

    /**
     * Peru
     */
    PE = 'PE',

    /**
     * Philippines
     */
    PH = 'PH',

    /**
     * Pitcairn
     */
    PN = 'PN',

    /**
     * Poland
     */
    PL = 'PL',

    /**
     * Portugal
     */
    PT = 'PT',

    /**
     * Qatar
     */
    QA = 'QA',

    /**
     * Republic of Cameroon
     */
    CM = 'CM',

    /**
     * Reunion
     */
    RE = 'RE',

    /**
     * Romania
     */
    RO = 'RO',

    /**
     * Russia
     */
    RU = 'RU',

    /**
     * Rwanda
     */
    RW = 'RW',

    /**
     * Saint Barthélemy
     */
    BL = 'BL',

    /**
     * Saint Helena
     */
    SH = 'SH',

    /**
     * Saint Kitts And Nevis
     */
    KN = 'KN',

    /**
     * Saint Lucia
     */
    LC = 'LC',

    /**
     * Saint Martin
     */
    MF = 'MF',

    /**
     * Saint Pierre And Miquelon
     */
    PM = 'PM',

    /**
     * Samoa
     */
    WS = 'WS',

    /**
     * San Marino
     */
    SM = 'SM',

    /**
     * Sao Tome And Principe
     */
    ST = 'ST',

    /**
     * Saudi Arabia
     */
    SA = 'SA',

    /**
     * Senegal
     */
    SN = 'SN',

    /**
     * Serbia
     */
    RS = 'RS',

    /**
     * Seychelles
     */
    SC = 'SC',

    /**
     * Sierra Leone
     */
    SL = 'SL',

    /**
     * Singapore
     */
    SG = 'SG',

    /**
     * Sint Maarten
     */
    SX = 'SX',

    /**
     * Slovakia
     */
    SK = 'SK',

    /**
     * Slovenia
     */
    SI = 'SI',

    /**
     * Solomon Islands
     */
    SB = 'SB',

    /**
     * Somalia
     */
    SO = 'SO',

    /**
     * South Africa
     */
    ZA = 'ZA',

    /**
     * South Georgia And The South Sandwich Islands
     */
    GS = 'GS',

    /**
     * South Korea
     */
    KR = 'KR',

    /**
     * South Sudan
     */
    SS = 'SS',

    /**
     * Spain
     */
    ES = 'ES',

    /**
     * Sri Lanka
     */
    LK = 'LK',

    /**
     * St. Vincent
     */
    VC = 'VC',

    /**
     * Sudan
     */
    SD = 'SD',

    /**
     * Suriname
     */
    SR = 'SR',

    /**
     * Svalbard And Jan Mayen
     */
    SJ = 'SJ',

    /**
     * Swaziland
     */
    SZ = 'SZ',

    /**
     * Sweden
     */
    SE = 'SE',

    /**
     * Switzerland
     */
    CH = 'CH',

    /**
     * Syria
     */
    SY = 'SY',

    /**
     * Taiwan
     */
    TW = 'TW',

    /**
     * Tajikistan
     */
    TJ = 'TJ',

    /**
     * Tanzania, United Republic Of
     */
    TZ = 'TZ',

    /**
     * Thailand
     */
    TH = 'TH',

    /**
     * Timor Leste
     */
    TL = 'TL',

    /**
     * Togo
     */
    TG = 'TG',

    /**
     * Tokelau
     */
    TK = 'TK',

    /**
     * Tonga
     */
    TO = 'TO',

    /**
     * Trinidad and Tobago
     */
    TT = 'TT',

    /**
     * Tunisia
     */
    TN = 'TN',

    /**
     * Turkey
     */
    TR = 'TR',

    /**
     * Turkmenistan
     */
    TM = 'TM',

    /**
     * Turks and Caicos Islands
     */
    TC = 'TC',

    /**
     * Tuvalu
     */
    TV = 'TV',

    /**
     * Uganda
     */
    UG = 'UG',

    /**
     * Ukraine
     */
    UA = 'UA',

    /**
     * United Arab Emirates
     */
    AE = 'AE',

    /**
     * United Kingdom
     */
    GB = 'GB',

    /**
     * United States
     */
    US = 'US',

    /**
     * United States Minor Outlying Islands
     */
    UM = 'UM',

    /**
     * Uruguay
     */
    UY = 'UY',

    /**
     * Uzbekistan
     */
    UZ = 'UZ',

    /**
     * Vanuatu
     */
    VU = 'VU',

    /**
     * Venezuela
     */
    VE = 'VE',

    /**
     * Vietnam
     */
    VN = 'VN',

    /**
     * Virgin Islands, British
     */
    VG = 'VG',

    /**
     * Wallis And Futuna
     */
    WF = 'WF',

    /**
     * Western Sahara
     */
    EH = 'EH',

    /**
     * Yemen
     */
    YE = 'YE',

    /**
     * Zambia
     */
    ZM = 'ZM',

    /**
     * Zimbabwe
     */
    ZW = 'ZW'
  }

  /**
   * Information about pagination in a connection.
   */
  interface IPageInfo {
    __typename: 'PageInfo';

    /**
     * Indicates if there are more pages to fetch.
     */
    hasNextPage: boolean;

    /**
     * Indicates if there are any pages prior to the current page.
     */
    hasPreviousPage: boolean;
  }

  /**
   * The set of valid sort keys for the orders query.
   */
  const enum OrderSortKeys {
    PROCESSED_AT = 'PROCESSED_AT',
    TOTAL_PRICE = 'TOTAL_PRICE',
    ID = 'ID',

    /**
     * During a search (i.e. when the `query` parameter has been specified on the connection) this sorts the
     * results by relevance to the search term(s). When no search query is specified, this sort key is not
     * deterministic and should not be used.
     *
     */
    RELEVANCE = 'RELEVANCE'
  }

  interface IOrderConnection {
    __typename: 'OrderConnection';

    /**
     * A list of edges.
     */
    edges: Array<IOrderEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IOrderEdge {
    __typename: 'OrderEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of OrderEdge.
     */
    node: IOrder;
  }

  /**
   * An order is a customer’s completed request to purchase one or more products from a shop. An order is created when a customer completes the checkout process, during which time they provides an email address, billing address and payment information.
   */
  interface IOrder {
    __typename: 'Order';

    /**
     * The code of the currency used for the payment.
     */
    currencyCode: CurrencyCode;

    /**
     * The locale code in which this specific order happened.
     */
    customerLocale: string | null;

    /**
     * The unique URL that the customer can use to access the order.
     */
    customerUrl: any | null;

    /**
     * The customer's email address.
     */
    email: string | null;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * List of the order’s line items.
     */
    lineItems: IOrderLineItemConnection;

    /**
     * A unique numeric identifier for the order for use by shop owner and customer.
     */
    orderNumber: number;

    /**
     * The customer's phone number.
     */
    phone: string | null;

    /**
     * The date and time when the order was imported.
     * This value can be set to dates in the past when importing from other systems.
     * If no value is provided, it will be auto-generated based on current date and time.
     *
     */
    processedAt: any;

    /**
     * The address to where the order will be shipped.
     */
    shippingAddress: IMailingAddress | null;

    /**
     * The unique URL for the order's status page.
     */
    statusUrl: any;

    /**
     * Price of the order before shipping and taxes.
     */
    subtotalPrice: any | null;

    /**
     * List of the order’s successful fulfillments.
     */
    successfulFulfillments: Array<IFulfillment>;

    /**
     * The sum of all the prices of all the items in the order, taxes and discounts included (must be positive).
     */
    totalPrice: any;

    /**
     * The total amount that has been refunded.
     */
    totalRefunded: any;

    /**
     * The total cost of shipping.
     */
    totalShippingPrice: any;

    /**
     * The total cost of taxes.
     */
    totalTax: any | null;
  }

  interface ILineItemsOnOrderArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;
  }

  interface ISuccessfulFulfillmentsOnOrderArguments {
    /**
     * Truncate the array result to this size.
     */
    first?: number | null;
  }

  /**
   * Currency codes
   */
  const enum CurrencyCode {
    /**
     * United States Dollars (USD)
     */
    USD = 'USD',

    /**
     * Euro (EUR)
     */
    EUR = 'EUR',

    /**
     * United Kingdom Pounds (GBP)
     */
    GBP = 'GBP',

    /**
     * Canadian Dollars (CAD)
     */
    CAD = 'CAD',

    /**
     * Afghan Afghani (AFN)
     */
    AFN = 'AFN',

    /**
     * Albanian Lek (ALL)
     */
    ALL = 'ALL',

    /**
     * Algerian Dinar (DZD)
     */
    DZD = 'DZD',

    /**
     * Angolan Kwanza (AOA)
     */
    AOA = 'AOA',

    /**
     * Argentine Pesos (ARS)
     */
    ARS = 'ARS',

    /**
     * Armenian Dram (AMD)
     */
    AMD = 'AMD',

    /**
     * Aruban Florin (AWG)
     */
    AWG = 'AWG',

    /**
     * Australian Dollars (AUD)
     */
    AUD = 'AUD',

    /**
     * Barbadian Dollar (BBD)
     */
    BBD = 'BBD',

    /**
     * Azerbaijani Manat (AZN)
     */
    AZN = 'AZN',

    /**
     * Bangladesh Taka (BDT)
     */
    BDT = 'BDT',

    /**
     * Bahamian Dollar (BSD)
     */
    BSD = 'BSD',

    /**
     * Bahraini Dinar (BHD)
     */
    BHD = 'BHD',

    /**
     * Burundian Franc (BIF)
     */
    BIF = 'BIF',

    /**
     * Belarusian Ruble (BYR)
     */
    BYR = 'BYR',

    /**
     * Belize Dollar (BZD)
     */
    BZD = 'BZD',

    /**
     * Bhutanese Ngultrum (BTN)
     */
    BTN = 'BTN',

    /**
     * Bosnia and Herzegovina Convertible Mark (BAM)
     */
    BAM = 'BAM',

    /**
     * Brazilian Real (BRL)
     */
    BRL = 'BRL',

    /**
     * Bolivian Boliviano (BOB)
     */
    BOB = 'BOB',

    /**
     * Botswana Pula (BWP)
     */
    BWP = 'BWP',

    /**
     * Brunei Dollar (BND)
     */
    BND = 'BND',

    /**
     * Bulgarian Lev (BGN)
     */
    BGN = 'BGN',

    /**
     * Burmese Kyat (MMK)
     */
    MMK = 'MMK',

    /**
     * Cambodian Riel
     */
    KHR = 'KHR',

    /**
     * Cape Verdean escudo (CVE)
     */
    CVE = 'CVE',

    /**
     * Cayman Dollars (KYD)
     */
    KYD = 'KYD',

    /**
     * Central African CFA Franc (XAF)
     */
    XAF = 'XAF',

    /**
     * Chilean Peso (CLP)
     */
    CLP = 'CLP',

    /**
     * Chinese Yuan Renminbi (CNY)
     */
    CNY = 'CNY',

    /**
     * Colombian Peso (COP)
     */
    COP = 'COP',

    /**
     * Comorian Franc (KMF)
     */
    KMF = 'KMF',

    /**
     * Congolese franc (CDF)
     */
    CDF = 'CDF',

    /**
     * Costa Rican Colones (CRC)
     */
    CRC = 'CRC',

    /**
     * Croatian Kuna (HRK)
     */
    HRK = 'HRK',

    /**
     * Czech Koruny (CZK)
     */
    CZK = 'CZK',

    /**
     * Danish Kroner (DKK)
     */
    DKK = 'DKK',

    /**
     * Dominican Peso (DOP)
     */
    DOP = 'DOP',

    /**
     * East Caribbean Dollar (XCD)
     */
    XCD = 'XCD',

    /**
     * Egyptian Pound (EGP)
     */
    EGP = 'EGP',

    /**
     * Ethiopian Birr (ETB)
     */
    ETB = 'ETB',

    /**
     * CFP Franc (XPF)
     */
    XPF = 'XPF',

    /**
     * Fijian Dollars (FJD)
     */
    FJD = 'FJD',

    /**
     * Gambian Dalasi (GMD)
     */
    GMD = 'GMD',

    /**
     * Ghanaian Cedi (GHS)
     */
    GHS = 'GHS',

    /**
     * Guatemalan Quetzal (GTQ)
     */
    GTQ = 'GTQ',

    /**
     * Guyanese Dollar (GYD)
     */
    GYD = 'GYD',

    /**
     * Georgian Lari (GEL)
     */
    GEL = 'GEL',

    /**
     * Haitian Gourde (HTG)
     */
    HTG = 'HTG',

    /**
     * Honduran Lempira (HNL)
     */
    HNL = 'HNL',

    /**
     * Hong Kong Dollars (HKD)
     */
    HKD = 'HKD',

    /**
     * Hungarian Forint (HUF)
     */
    HUF = 'HUF',

    /**
     * Icelandic Kronur (ISK)
     */
    ISK = 'ISK',

    /**
     * Indian Rupees (INR)
     */
    INR = 'INR',

    /**
     * Indonesian Rupiah (IDR)
     */
    IDR = 'IDR',

    /**
     * Israeli New Shekel (NIS)
     */
    ILS = 'ILS',

    /**
     * Iraqi Dinar (IQD)
     */
    IQD = 'IQD',

    /**
     * Jamaican Dollars (JMD)
     */
    JMD = 'JMD',

    /**
     * Japanese Yen (JPY)
     */
    JPY = 'JPY',

    /**
     * Jersey Pound
     */
    JEP = 'JEP',

    /**
     * Jordanian Dinar (JOD)
     */
    JOD = 'JOD',

    /**
     * Kazakhstani Tenge (KZT)
     */
    KZT = 'KZT',

    /**
     * Kenyan Shilling (KES)
     */
    KES = 'KES',

    /**
     * Kuwaiti Dinar (KWD)
     */
    KWD = 'KWD',

    /**
     * Kyrgyzstani Som (KGS)
     */
    KGS = 'KGS',

    /**
     * Laotian Kip (LAK)
     */
    LAK = 'LAK',

    /**
     * Latvian Lati (LVL)
     */
    LVL = 'LVL',

    /**
     * Lebanese Pounds (LBP)
     */
    LBP = 'LBP',

    /**
     * Lesotho Loti (LSL)
     */
    LSL = 'LSL',

    /**
     * Liberian Dollar (LRD)
     */
    LRD = 'LRD',

    /**
     * Lithuanian Litai (LTL)
     */
    LTL = 'LTL',

    /**
     * Malagasy Ariary (MGA)
     */
    MGA = 'MGA',

    /**
     * Macedonia Denar (MKD)
     */
    MKD = 'MKD',

    /**
     * Macanese Pataca (MOP)
     */
    MOP = 'MOP',

    /**
     * Malawian Kwacha (MWK)
     */
    MWK = 'MWK',

    /**
     * Maldivian Rufiyaa (MVR)
     */
    MVR = 'MVR',

    /**
     * Mexican Pesos (MXN)
     */
    MXN = 'MXN',

    /**
     * Malaysian Ringgits (MYR)
     */
    MYR = 'MYR',

    /**
     * Mauritian Rupee (MUR)
     */
    MUR = 'MUR',

    /**
     * Moldovan Leu (MDL)
     */
    MDL = 'MDL',

    /**
     * Moroccan Dirham
     */
    MAD = 'MAD',

    /**
     * Mongolian Tugrik
     */
    MNT = 'MNT',

    /**
     * Mozambican Metical
     */
    MZN = 'MZN',

    /**
     * Namibian Dollar
     */
    NAD = 'NAD',

    /**
     * Nepalese Rupee (NPR)
     */
    NPR = 'NPR',

    /**
     * Netherlands Antillean Guilder
     */
    ANG = 'ANG',

    /**
     * New Zealand Dollars (NZD)
     */
    NZD = 'NZD',

    /**
     * Nicaraguan Córdoba (NIO)
     */
    NIO = 'NIO',

    /**
     * Nigerian Naira (NGN)
     */
    NGN = 'NGN',

    /**
     * Norwegian Kroner (NOK)
     */
    NOK = 'NOK',

    /**
     * Omani Rial (OMR)
     */
    OMR = 'OMR',

    /**
     * Pakistani Rupee (PKR)
     */
    PKR = 'PKR',

    /**
     * Papua New Guinean Kina (PGK)
     */
    PGK = 'PGK',

    /**
     * Paraguayan Guarani (PYG)
     */
    PYG = 'PYG',

    /**
     * Peruvian Nuevo Sol (PEN)
     */
    PEN = 'PEN',

    /**
     * Philippine Peso (PHP)
     */
    PHP = 'PHP',

    /**
     * Polish Zlotych (PLN)
     */
    PLN = 'PLN',

    /**
     * Qatari Rial (QAR)
     */
    QAR = 'QAR',

    /**
     * Romanian Lei (RON)
     */
    RON = 'RON',

    /**
     * Russian Rubles (RUB)
     */
    RUB = 'RUB',

    /**
     * Rwandan Franc (RWF)
     */
    RWF = 'RWF',

    /**
     * Samoan Tala (WST)
     */
    WST = 'WST',

    /**
     * Saudi Riyal (SAR)
     */
    SAR = 'SAR',

    /**
     * Sao Tome And Principe Dobra (STD)
     */
    STD = 'STD',

    /**
     * Serbian dinar (RSD)
     */
    RSD = 'RSD',

    /**
     * Seychellois Rupee (SCR)
     */
    SCR = 'SCR',

    /**
     * Singapore Dollars (SGD)
     */
    SGD = 'SGD',

    /**
     * Sudanese Pound (SDG)
     */
    SDG = 'SDG',

    /**
     * Syrian Pound (SYP)
     */
    SYP = 'SYP',

    /**
     * South African Rand (ZAR)
     */
    ZAR = 'ZAR',

    /**
     * South Korean Won (KRW)
     */
    KRW = 'KRW',

    /**
     * South Sudanese Pound (SSP)
     */
    SSP = 'SSP',

    /**
     * Solomon Islands Dollar (SBD)
     */
    SBD = 'SBD',

    /**
     * Sri Lankan Rupees (LKR)
     */
    LKR = 'LKR',

    /**
     * Surinamese Dollar (SRD)
     */
    SRD = 'SRD',

    /**
     * Swazi Lilangeni (SZL)
     */
    SZL = 'SZL',

    /**
     * Swedish Kronor (SEK)
     */
    SEK = 'SEK',

    /**
     * Swiss Francs (CHF)
     */
    CHF = 'CHF',

    /**
     * Taiwan Dollars (TWD)
     */
    TWD = 'TWD',

    /**
     * Thai baht (THB)
     */
    THB = 'THB',

    /**
     * Tanzanian Shilling (TZS)
     */
    TZS = 'TZS',

    /**
     * Trinidad and Tobago Dollars (TTD)
     */
    TTD = 'TTD',

    /**
     * Tunisian Dinar (TND)
     */
    TND = 'TND',

    /**
     * Turkish Lira (TRY)
     */
    TRY = 'TRY',

    /**
     * Turkmenistani Manat (TMT)
     */
    TMT = 'TMT',

    /**
     * Ugandan Shilling (UGX)
     */
    UGX = 'UGX',

    /**
     * Ukrainian Hryvnia (UAH)
     */
    UAH = 'UAH',

    /**
     * United Arab Emirates Dirham (AED)
     */
    AED = 'AED',

    /**
     * Uruguayan Pesos (UYU)
     */
    UYU = 'UYU',

    /**
     * Uzbekistan som (UZS)
     */
    UZS = 'UZS',

    /**
     * Vanuatu Vatu (VUV)
     */
    VUV = 'VUV',

    /**
     * Venezuelan Bolivares (VEF)
     */
    VEF = 'VEF',

    /**
     * Vietnamese đồng (VND)
     */
    VND = 'VND',

    /**
     * West African CFA franc (XOF)
     */
    XOF = 'XOF',

    /**
     * Yemeni Rial (YER)
     */
    YER = 'YER',

    /**
     * Zambian Kwacha (ZMW)
     */
    ZMW = 'ZMW'
  }

  interface IOrderLineItemConnection {
    __typename: 'OrderLineItemConnection';

    /**
     * A list of edges.
     */
    edges: Array<IOrderLineItemEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IOrderLineItemEdge {
    __typename: 'OrderLineItemEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of OrderLineItemEdge.
     */
    node: IOrderLineItem;
  }

  /**
   * Represents a single line in an order. There is one line item for each distinct product variant.
   */
  interface IOrderLineItem {
    __typename: 'OrderLineItem';

    /**
     * List of custom attributes associated to the line item.
     */
    customAttributes: Array<IAttribute>;

    /**
     * The number of products variants associated to the line item.
     */
    quantity: number;

    /**
     * The title of the product combined with title of the variant.
     */
    title: string;

    /**
     * The product variant object associated to the line item.
     */
    variant: IProductVariant | null;
  }

  /**
   * Represents a generic custom attribute.
   */
  interface IAttribute {
    __typename: 'Attribute';

    /**
     * Key or name of the attribute.
     */
    key: string;

    /**
     * Value of the attribute.
     */
    value: string | null;
  }

  /**
   * A product variant represents a different version of a product, such as differing sizes or differing colors.
   */
  interface IProductVariant {
    __typename: 'ProductVariant';

    /**
     * Indicates if the product variant is in stock.
     * @deprecated "Use `availableForSale` instead"
     */
    available: boolean | null;

    /**
     * Indicates if the product variant is available for sale.
     */
    availableForSale: boolean;

    /**
     * The compare at price of the variant. This can be used to mark a variant as on sale, when `compareAtPrice` is higher than `price`.
     */
    compareAtPrice: any | null;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * Image associated with the product variant. This field falls back to the product image if no image is available.
     */
    image: IImage | null;

    /**
     * The product variant’s price.
     */
    price: any;

    /**
     * The product object that the product variant belongs to.
     */
    product: IProduct;

    /**
     * List of product options applied to the variant.
     */
    selectedOptions: Array<ISelectedOption>;

    /**
     * The SKU (Stock Keeping Unit) associated with the variant.
     */
    sku: string | null;

    /**
     * The product variant’s title.
     */
    title: string;

    /**
     * The weight of the product variant in the unit system specified with `weight_unit`.
     */
    weight: number | null;

    /**
     * Unit of measurement for weight.
     */
    weightUnit: WeightUnit;
  }

  interface IImageOnProductVariantArguments {
    /**
     * Image width in pixels between 1 and 2048. This argument is deprecated: Use `maxWidth` on `Image.transformedSrc` instead.
     */
    maxWidth?: number | null;

    /**
     * Image height in pixels between 1 and 2048. This argument is deprecated: Use `maxHeight` on `Image.transformedSrc` instead.
     */
    maxHeight?: number | null;

    /**
     * Crops the image according to the specified region. This argument is deprecated: Use `crop` on `Image.transformedSrc` instead.
     */
    crop?: CropRegion | null;

    /**
     * Image size multiplier for high-resolution retina displays. Must be between 1 and 3. This argument is deprecated: Use `scale` on `Image.transformedSrc` instead.
     * @default 1
     */
    scale?: number | null;
  }

  /**
   * The part of the image that should remain after cropping.
   */
  const enum CropRegion {
    /**
     * Keep the center of the image
     */
    CENTER = 'CENTER',

    /**
     * Keep the top of the image
     */
    TOP = 'TOP',

    /**
     * Keep the bottom of the image
     */
    BOTTOM = 'BOTTOM',

    /**
     * Keep the left of the image
     */
    LEFT = 'LEFT',

    /**
     * Keep the right of the image
     */
    RIGHT = 'RIGHT'
  }

  /**
   * Represents an image resource.
   */
  interface IImage {
    __typename: 'Image';

    /**
     * A word or phrase to share the nature or contents of an image.
     */
    altText: string | null;

    /**
     * A unique identifier for the image.
     */
    id: string | null;

    /**
     * The location of the original (untransformed) image as a URL.
     */
    originalSrc: any;

    /**
 * The location of the image as a URL.
 * @deprecated "Previously an image had a single `src` field. This could either return the original image
location or a URL that contained transformations such as sizing or scale.

These transformations were specified by arguments on the parent field.

Now an image has two distinct URL fields: `originalSrc` and `transformedSrc`.

* `originalSrc` - the original, untransformed image URL
* `transformedSrc` - the image URL with transformations included

To migrate to the new fields, image transformations should be moved from the parent field to `transformedSrc`.

Before:
```graphql
{
  shop {
    productImages(maxWidth: 200, scale: 2) {
      edges {
        node {
          src
        }
      }
    }
  }
}
```

After:
```graphql
{
  shop {
    productImages {
      edges {
        node {
          transformedSrc(maxWidth: 200, scale: 2)
        }
      }
    }
  }
}
```
"
 */
    src: any;

    /**
     * The location of the transformed image as a URL.
     *
     * All transformation arguments are considered "best-effort". If they can be applied to an image, they will be.
     * Otherwise any transformations which an image type does not support will be ignored.
     *
     */
    transformedSrc: any;
  }

  interface ITransformedSrcOnImageArguments {
    /**
     * Image width in pixels between 1 and 5760.
     */
    maxWidth?: number | null;

    /**
     * Image height in pixels between 1 and 5760.
     */
    maxHeight?: number | null;

    /**
     * Crops the image according to the specified region.
     */
    crop?: CropRegion | null;

    /**
     * Image size multiplier for high-resolution retina displays. Must be between 1 and 3.
     * @default 1
     */
    scale?: number | null;

    /**
     * Best effort conversion of image into content type (SVG -> PNG, Anything -> JGP, Anything -> WEBP are supported).
     */
    preferredContentType?: ImageContentType | null;
  }

  /**
   * List of supported image content types.
   */
  const enum ImageContentType {
    PNG = 'PNG',
    JPG = 'JPG',
    WEBP = 'WEBP'
  }

  /**
   * A product represents an individual item for sale in a Shopify store. Products are often physical, but they don't have to be.
   * For example, a digital download (such as a movie, music or ebook file) also qualifies as a product, as do services (such as equipment rental, work for hire, customization of another product or an extended warranty).
   */
  interface IProduct {
    __typename: 'Product';

    /**
     * Indicates if at least one product variant is available for sale.
     */
    availableForSale: boolean;

    /**
     * List of collections a product belongs to.
     */
    collections: ICollectionConnection;

    /**
     * The date and time when the product was created.
     */
    createdAt: any;

    /**
     * Stripped description of the product, single line with HTML tags removed.
     */
    description: string;

    /**
     * The description of the product, complete with HTML formatting.
     */
    descriptionHtml: any;

    /**
     * A human-friendly unique string for the Product automatically generated from its title.
     * They are used by the Liquid templating language to refer to objects.
     *
     */
    handle: string;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * List of images associated with the product.
     */
    images: IImageConnection;

    /**
     * The online store URL for the product.
     * A value of `null` indicates that the product is not published to the Online Store sales channel.
     *
     */
    onlineStoreUrl: any | null;

    /**
     * List of custom product options (maximum of 3 per product).
     */
    options: Array<IProductOption>;

    /**
     * The price range.
     */
    priceRange: IProductPriceRange;

    /**
     * A categorization that a product can be tagged with, commonly used for filtering and searching.
     */
    productType: string;

    /**
     * The date and time when the product was published to the channel.
     */
    publishedAt: any;

    /**
     * A categorization that a product can be tagged with, commonly used for filtering and searching.
     * Each comma-separated tag has a character limit of 255.
     *
     */
    tags: Array<string>;

    /**
     * The product’s title.
     */
    title: string;

    /**
     * The date and time when the product was last modified.
     */
    updatedAt: any;

    /**
     * Find a product’s variant based on its selected options.
     * This is useful for converting a user’s selection of product options into a single matching variant.
     * If there is not a variant for the selected options, `null` will be returned.
     *
     */
    variantBySelectedOptions: IProductVariant | null;

    /**
     * List of the product’s variants.
     */
    variants: IProductVariantConnection;

    /**
     * The product’s vendor name.
     */
    vendor: string;
  }

  interface ICollectionsOnProductArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;
  }

  interface IDescriptionOnProductArguments {
    /**
     * Truncates string after the given length.
     */
    truncateAt?: number | null;
  }

  interface IImagesOnProductArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;

    /**
     * Sort the underlying list by the given key.
     * @default "POSITION"
     */
    sortKey?: ProductImageSortKeys | null;

    /**
     * Image width in pixels between 1 and 2048. This argument is deprecated: Use `maxWidth` on `Image.transformedSrc` instead.
     */
    maxWidth?: number | null;

    /**
     * Image height in pixels between 1 and 2048. This argument is deprecated: Use `maxHeight` on `Image.transformedSrc` instead.
     */
    maxHeight?: number | null;

    /**
     * Crops the image according to the specified region. This argument is deprecated: Use `crop` on `Image.transformedSrc` instead.
     */
    crop?: CropRegion | null;

    /**
     * Image size multiplier for high-resolution retina displays. Must be between 1 and 3. This argument is deprecated: Use `scale` on `Image.transformedSrc` instead.
     * @default 1
     */
    scale?: number | null;
  }

  interface IOptionsOnProductArguments {
    /**
     * Truncate the array result to this size.
     */
    first?: number | null;
  }

  interface IVariantBySelectedOptionsOnProductArguments {
    selectedOptions: Array<ISelectedOptionInput>;
  }

  interface IVariantsOnProductArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;

    /**
     * Sort the underlying list by the given key.
     * @default "POSITION"
     */
    sortKey?: ProductVariantSortKeys | null;
  }

  interface ICollectionConnection {
    __typename: 'CollectionConnection';

    /**
     * A list of edges.
     */
    edges: Array<ICollectionEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface ICollectionEdge {
    __typename: 'CollectionEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of CollectionEdge.
     */
    node: ICollection;
  }

  /**
   * A collection represents a grouping of products that a shop owner can create to organize them or make their shops easier to browse.
   */
  interface ICollection {
    __typename: 'Collection';

    /**
     * Stripped description of the collection, single line with HTML tags removed.
     */
    description: string;

    /**
     * The description of the collection, complete with HTML formatting.
     */
    descriptionHtml: any;

    /**
     * A human-friendly unique string for the collection automatically generated from its title.
     * Limit of 255 characters.
     *
     */
    handle: string;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * Image associated with the collection.
     */
    image: IImage | null;

    /**
     * List of products in the collection.
     */
    products: IProductConnection;

    /**
     * The collection’s name. Limit of 255 characters.
     */
    title: string;

    /**
     * The date and time when the collection was last modified.
     */
    updatedAt: any;
  }

  interface IDescriptionOnCollectionArguments {
    /**
     * Truncates string after the given length.
     */
    truncateAt?: number | null;
  }

  interface IImageOnCollectionArguments {
    /**
     * Image width in pixels between 1 and 2048. This argument is deprecated: Use `maxWidth` on `Image.transformedSrc` instead.
     */
    maxWidth?: number | null;

    /**
     * Image height in pixels between 1 and 2048. This argument is deprecated: Use `maxHeight` on `Image.transformedSrc` instead.
     */
    maxHeight?: number | null;

    /**
     * Crops the image according to the specified region. This argument is deprecated: Use `crop` on `Image.transformedSrc` instead.
     */
    crop?: CropRegion | null;

    /**
     * Image size multiplier for high-resolution retina displays. Must be between 1 and 3. This argument is deprecated: Use `scale` on `Image.transformedSrc` instead.
     * @default 1
     */
    scale?: number | null;
  }

  interface IProductsOnCollectionArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;

    /**
     * Sort the underlying list by the given key.
     * @default "COLLECTION_DEFAULT"
     */
    sortKey?: ProductCollectionSortKeys | null;
  }

  /**
   * The set of valid sort keys for the products query.
   */
  const enum ProductCollectionSortKeys {
    MANUAL = 'MANUAL',
    BEST_SELLING = 'BEST_SELLING',
    TITLE = 'TITLE',
    PRICE = 'PRICE',
    CREATED = 'CREATED',
    COLLECTION_DEFAULT = 'COLLECTION_DEFAULT',
    ID = 'ID',

    /**
     * During a search (i.e. when the `query` parameter has been specified on the connection) this sorts the
     * results by relevance to the search term(s). When no search query is specified, this sort key is not
     * deterministic and should not be used.
     *
     */
    RELEVANCE = 'RELEVANCE'
  }

  interface IProductConnection {
    __typename: 'ProductConnection';

    /**
     * A list of edges.
     */
    edges: Array<IProductEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IProductEdge {
    __typename: 'ProductEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of ProductEdge.
     */
    node: IProduct;
  }

  /**
   * The set of valid sort keys for the images query.
   */
  const enum ProductImageSortKeys {
    CREATED_AT = 'CREATED_AT',
    POSITION = 'POSITION',
    ID = 'ID',

    /**
     * During a search (i.e. when the `query` parameter has been specified on the connection) this sorts the
     * results by relevance to the search term(s). When no search query is specified, this sort key is not
     * deterministic and should not be used.
     *
     */
    RELEVANCE = 'RELEVANCE'
  }

  interface IImageConnection {
    __typename: 'ImageConnection';

    /**
     * A list of edges.
     */
    edges: Array<IImageEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IImageEdge {
    __typename: 'ImageEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of ImageEdge.
     */
    node: IImage;
  }

  /**
   * Custom product property names like "Size", "Color", and "Material".
   * Products are based on permutations of these options.
   * A product may have a maximum of 3 options.
   * 255 characters limit each.
   *
   */
  interface IProductOption {
    __typename: 'ProductOption';

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * The product option’s name.
     */
    name: string;

    /**
     * The corresponding value to the product option name.
     */
    values: Array<string>;
  }

  /**
   * The price range of the product.
   */
  interface IProductPriceRange {
    __typename: 'ProductPriceRange';

    /**
     * The highest variant's price.
     */
    maxVariantPrice: IMoneyV2;

    /**
     * The lowest variant's price.
     */
    minVariantPrice: IMoneyV2;
  }

  /**
   * A monetary value with currency.
   *
   * To format currencies, combine this type's amount and currencyCode fields with your client's locale.
   *
   * For example, in JavaScript you could use Intl.NumberFormat:
   *
   * ```js
   * new Intl.NumberFormat(locale, {
   *   style: 'currency',
   *   currency: currencyCode
   * }).format(amount);
   * ```
   *
   * Other formatting libraries include:
   *
   * * iOS - [NumberFormatter](https://developer.apple.com/documentation/foundation/numberformatter)
   * * Android - [NumberFormat](https://developer.android.com/reference/java/text/NumberFormat.html)
   * * PHP - [NumberFormatter](http://php.net/manual/en/class.numberformatter.php)
   *
   * For a more general solution, the [Unicode CLDR number formatting database] is available with many implementations
   * (such as [TwitterCldr](https://github.com/twitter/twitter-cldr-rb)).
   *
   */
  interface IMoneyV2 {
    __typename: 'MoneyV2';

    /**
     * Decimal money amount.
     */
    amount: any;

    /**
     * Currency of the money.
     */
    currencyCode: CurrencyCode;
  }

  /**
   * Specifies the input fields required for a selected option.
   */
  interface ISelectedOptionInput {
    /**
     * The product option’s name.
     */
    name: string;

    /**
     * The product option’s value.
     */
    value: string;
  }

  /**
   * The set of valid sort keys for the variants query.
   */
  const enum ProductVariantSortKeys {
    TITLE = 'TITLE',
    SKU = 'SKU',
    POSITION = 'POSITION',
    ID = 'ID',

    /**
     * During a search (i.e. when the `query` parameter has been specified on the connection) this sorts the
     * results by relevance to the search term(s). When no search query is specified, this sort key is not
     * deterministic and should not be used.
     *
     */
    RELEVANCE = 'RELEVANCE'
  }

  interface IProductVariantConnection {
    __typename: 'ProductVariantConnection';

    /**
     * A list of edges.
     */
    edges: Array<IProductVariantEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IProductVariantEdge {
    __typename: 'ProductVariantEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of ProductVariantEdge.
     */
    node: IProductVariant;
  }

  /**
   * Custom properties that a shop owner can use to define product variants.
   * Multiple options can exist. Options are represented as: option1, option2, option3, etc.
   *
   */
  interface ISelectedOption {
    __typename: 'SelectedOption';

    /**
     * The product option’s name.
     */
    name: string;

    /**
     * The product option’s value.
     */
    value: string;
  }

  /**
   * Units of measurement for weight.
   */
  const enum WeightUnit {
    /**
     * 1 kilogram equals 1000 grams
     */
    KILOGRAMS = 'KILOGRAMS',

    /**
     * Metric system unit of mass
     */
    GRAMS = 'GRAMS',

    /**
     * 1 pound equals 16 ounces
     */
    POUNDS = 'POUNDS',

    /**
     * Imperial system unit of mass
     */
    OUNCES = 'OUNCES'
  }

  /**
   * Represents a single fulfillment in an order.
   */
  interface IFulfillment {
    __typename: 'Fulfillment';

    /**
     * List of the fulfillment's line items.
     */
    fulfillmentLineItems: IFulfillmentLineItemConnection;

    /**
     * The name of the tracking company.
     */
    trackingCompany: string | null;

    /**
     * Tracking information associated with the fulfillment,
     * such as the tracking number and tracking URL.
     *
     */
    trackingInfo: Array<IFulfillmentTrackingInfo>;
  }

  interface IFulfillmentLineItemsOnFulfillmentArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;
  }

  interface ITrackingInfoOnFulfillmentArguments {
    /**
     * Truncate the array result to this size.
     */
    first?: number | null;
  }

  interface IFulfillmentLineItemConnection {
    __typename: 'FulfillmentLineItemConnection';

    /**
     * A list of edges.
     */
    edges: Array<IFulfillmentLineItemEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IFulfillmentLineItemEdge {
    __typename: 'FulfillmentLineItemEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of FulfillmentLineItemEdge.
     */
    node: IFulfillmentLineItem;
  }

  /**
   * Represents a single line item in a fulfillment. There is at most one fulfillment line item for each order line item.
   */
  interface IFulfillmentLineItem {
    __typename: 'FulfillmentLineItem';

    /**
     * The associated order's line item.
     */
    lineItem: IOrderLineItem;

    /**
     * The amount fulfilled in this fulfillment.
     */
    quantity: number;
  }

  /**
   * Tracking information associated with the fulfillment.
   */
  interface IFulfillmentTrackingInfo {
    __typename: 'FulfillmentTrackingInfo';

    /**
     * The tracking number of the fulfillment.
     */
    number: string | null;

    /**
     * The URL to track the fulfillment.
     */
    url: any | null;
  }

  /**
   * Shop represents a collection of the general settings and information about the shop.
   */
  interface IShop {
    __typename: 'Shop';

    /**
     * List of the shop' articles.
     */
    articles: IArticleConnection;

    /**
     * List of the shop' blogs.
     */
    blogs: IBlogConnection;

    /**
     * The url pointing to the endpoint to vault credit cards.
     * @deprecated "Use `paymentSettings` instead"
     */
    cardVaultUrl: any;

    /**
     * Find a collection by its handle.
     */
    collectionByHandle: ICollection | null;

    /**
     * List of the shop’s collections.
     */
    collections: ICollectionConnection;

    /**
     * The three-letter code for the currency that the shop accepts.
     * @deprecated "Use `paymentSettings` instead"
     */
    currencyCode: CurrencyCode;

    /**
     * A description of the shop.
     */
    description: string | null;

    /**
     * A string representing the way currency is formatted when the currency isn’t specified.
     */
    moneyFormat: string;

    /**
     * The shop’s name.
     */
    name: string;

    /**
     * Settings related to payments.
     */
    paymentSettings: IPaymentSettings;

    /**
     * The shop’s primary domain.
     */
    primaryDomain: IDomain;

    /**
     * The shop’s privacy policy.
     */
    privacyPolicy: IShopPolicy | null;

    /**
     * Find a product by its handle.
     */
    productByHandle: IProduct | null;

    /**
     * List of the shop’s product types.
     */
    productTypes: IStringConnection;

    /**
     * List of the shop’s products.
     */
    products: IProductConnection;

    /**
     * The shop’s refund policy.
     */
    refundPolicy: IShopPolicy | null;

    /**
     * Countries that the shop ships to.
     */
    shipsToCountries: Array<CountryCode>;

    /**
     * The shop’s Shopify Payments account id.
     * @deprecated "Use `paymentSettings` instead"
     */
    shopifyPaymentsAccountId: string | null;

    /**
     * The shop’s terms of service.
     */
    termsOfService: IShopPolicy | null;
  }

  interface IArticlesOnShopArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;

    /**
     * Sort the underlying list by the given key.
     * @default "ID"
     */
    sortKey?: ArticleSortKeys | null;

    /**
     * Supported filter parameters:
     *  - `author`
     *  - `updated_at`
     *  - `created_at`
     *  - `blog_title`
     *  - `tag`
     */
    query?: string | null;
  }

  interface IBlogsOnShopArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;

    /**
     * Sort the underlying list by the given key.
     * @default "ID"
     */
    sortKey?: BlogSortKeys | null;

    /**
     * Supported filter parameters:
     *  - `handle`
     *  - `title`
     *  - `updated_at`
     *  - `created_at`
     */
    query?: string | null;
  }

  interface ICollectionByHandleOnShopArguments {
    handle: string;
  }

  interface ICollectionsOnShopArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;

    /**
     * Sort the underlying list by the given key.
     * @default "ID"
     */
    sortKey?: CollectionSortKeys | null;

    /**
     * Supported filter parameters:
     *  - `title`
     *  - `collection_type`
     *  - `updated_at`
     */
    query?: string | null;
  }

  interface IProductByHandleOnShopArguments {
    handle: string;
  }

  interface IProductTypesOnShopArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first: number;
  }

  interface IProductsOnShopArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;

    /**
     * Sort the underlying list by the given key.
     * @default "ID"
     */
    sortKey?: ProductSortKeys | null;

    /**
     * Supported filter parameters:
     *  - `title`
     *  - `product_type`
     *  - `vendor`
     *  - `created_at`
     *  - `updated_at`
     *  - `tag`
     */
    query?: string | null;
  }

  /**
   * The set of valid sort keys for the articles query.
   */
  const enum ArticleSortKeys {
    TITLE = 'TITLE',
    BLOG_TITLE = 'BLOG_TITLE',
    AUTHOR = 'AUTHOR',
    UPDATED_AT = 'UPDATED_AT',
    ID = 'ID',

    /**
     * During a search (i.e. when the `query` parameter has been specified on the connection) this sorts the
     * results by relevance to the search term(s). When no search query is specified, this sort key is not
     * deterministic and should not be used.
     *
     */
    RELEVANCE = 'RELEVANCE'
  }

  interface IArticleConnection {
    __typename: 'ArticleConnection';

    /**
     * A list of edges.
     */
    edges: Array<IArticleEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IArticleEdge {
    __typename: 'ArticleEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of ArticleEdge.
     */
    node: IArticle;
  }

  interface IArticle {
    __typename: 'Article';

    /**
     * The article's author.
     */
    author: IArticleAuthor;

    /**
     * The blog that the article belongs to.
     */
    blog: IBlog;

    /**
     * List of comments posted on the article.
     */
    comments: ICommentConnection;

    /**
     * Stripped content of the article, single line with HTML tags removed.
     */
    content: string;

    /**
     * The content of the article, complete with HTML formatting.
     */
    contentHtml: any;

    /**
     * Stripped excerpt of the article, single line with HTML tags removed.
     */
    excerpt: string | null;

    /**
     * The excerpt of the article, complete with HTML formatting.
     */
    excerptHtml: any | null;

    /**
     * A human-friendly unique string for the Article automatically generated from its title.
     *
     */
    handle: string;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * The image associated with the article.
     */
    image: IImage | null;

    /**
     * The date and time when the article was published.
     */
    publishedAt: any;

    /**
     * A categorization that a article can be tagged with.
     */
    tags: Array<string>;

    /**
     * The article’s name.
     */
    title: string;

    /**
     * The url pointing to the article accessible from the web.
     */
    url: any;
  }

  interface ICommentsOnArticleArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;
  }

  interface IContentOnArticleArguments {
    /**
     * Truncates string after the given length.
     */
    truncateAt?: number | null;
  }

  interface IExcerptOnArticleArguments {
    /**
     * Truncates string after the given length.
     */
    truncateAt?: number | null;
  }

  interface IImageOnArticleArguments {
    /**
     * Image width in pixels between 1 and 2048. This argument is deprecated: Use `maxWidth` on `Image.transformedSrc` instead.
     */
    maxWidth?: number | null;

    /**
     * Image height in pixels between 1 and 2048. This argument is deprecated: Use `maxHeight` on `Image.transformedSrc` instead.
     */
    maxHeight?: number | null;

    /**
     * Crops the image according to the specified region. This argument is deprecated: Use `crop` on `Image.transformedSrc` instead.
     */
    crop?: CropRegion | null;

    /**
     * Image size multiplier for high-resolution retina displays. Must be between 1 and 3. This argument is deprecated: Use `scale` on `Image.transformedSrc` instead.
     * @default 1
     */
    scale?: number | null;
  }

  interface IArticleAuthor {
    __typename: 'ArticleAuthor';

    /**
     * The author's bio.
     */
    bio: string | null;

    /**
     * The author’s email.
     */
    email: string;

    /**
     * The author's first name.
     */
    firstName: string;

    /**
     * The author's last name.
     */
    lastName: string;

    /**
     * The author's full name
     */
    name: string;
  }

  interface IBlog {
    __typename: 'Blog';

    /**
     * List of the blog's articles.
     */
    articles: IArticleConnection;

    /**
     * A human-friendly unique string for the Blog automatically generated from its title.
     *
     */
    handle: string;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * The blogs’s title.
     */
    title: string;

    /**
     * The url pointing to the blog accessible from the web.
     */
    url: any;
  }

  interface IArticlesOnBlogArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;
  }

  interface ICommentConnection {
    __typename: 'CommentConnection';

    /**
     * A list of edges.
     */
    edges: Array<ICommentEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface ICommentEdge {
    __typename: 'CommentEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of CommentEdge.
     */
    node: IComment;
  }

  interface IComment {
    __typename: 'Comment';

    /**
     * The comment’s author.
     */
    author: ICommentAuthor;

    /**
     * Stripped content of the comment, single line with HTML tags removed.
     */
    content: string;

    /**
     * The content of the comment, complete with HTML formatting.
     */
    contentHtml: any;

    /**
     * Globally unique identifier.
     */
    id: string;
  }

  interface IContentOnCommentArguments {
    /**
     * Truncates string after the given length.
     */
    truncateAt?: number | null;
  }

  interface ICommentAuthor {
    __typename: 'CommentAuthor';

    /**
     * The author's email.
     */
    email: string;

    /**
     * The author’s name.
     */
    name: string;
  }

  /**
   * The set of valid sort keys for the blogs query.
   */
  const enum BlogSortKeys {
    HANDLE = 'HANDLE',
    TITLE = 'TITLE',
    ID = 'ID',

    /**
     * During a search (i.e. when the `query` parameter has been specified on the connection) this sorts the
     * results by relevance to the search term(s). When no search query is specified, this sort key is not
     * deterministic and should not be used.
     *
     */
    RELEVANCE = 'RELEVANCE'
  }

  interface IBlogConnection {
    __typename: 'BlogConnection';

    /**
     * A list of edges.
     */
    edges: Array<IBlogEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IBlogEdge {
    __typename: 'BlogEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of BlogEdge.
     */
    node: IBlog;
  }

  /**
   * The set of valid sort keys for the collections query.
   */
  const enum CollectionSortKeys {
    TITLE = 'TITLE',
    UPDATED_AT = 'UPDATED_AT',
    ID = 'ID',

    /**
     * During a search (i.e. when the `query` parameter has been specified on the connection) this sorts the
     * results by relevance to the search term(s). When no search query is specified, this sort key is not
     * deterministic and should not be used.
     *
     */
    RELEVANCE = 'RELEVANCE'
  }

  /**
   * Settings related to payments.
   */
  interface IPaymentSettings {
    __typename: 'PaymentSettings';

    /**
     * List of the card brands which the shop accepts.
     */
    acceptedCardBrands: Array<CardBrand>;

    /**
     * The url pointing to the endpoint to vault credit cards.
     */
    cardVaultUrl: any;

    /**
     * The country where the shop is located.
     */
    countryCode: CountryCode;

    /**
     * The three-letter code for the currency that the shop accepts.
     */
    currencyCode: CurrencyCode;

    /**
     * The shop’s Shopify Payments account id.
     */
    shopifyPaymentsAccountId: string | null;

    /**
     * List of the digital wallets which the shop supports.
     */
    supportedDigitalWallets: Array<DigitalWallet>;
  }

  /**
   * Card brand, such as Visa or Mastercard, which can be used for payments.
   */
  const enum CardBrand {
    /**
     * Visa
     */
    VISA = 'VISA',

    /**
     * Mastercard
     */
    MASTERCARD = 'MASTERCARD',

    /**
     * Discover
     */
    DISCOVER = 'DISCOVER',

    /**
     * American Express
     */
    AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',

    /**
     * Diners Club
     */
    DINERS_CLUB = 'DINERS_CLUB',

    /**
     * JCB
     */
    JCB = 'JCB'
  }

  /**
   * Digital wallet, such as Apple Pay, which can be used for accelerated checkouts.
   */
  const enum DigitalWallet {
    /**
     * Apple Pay
     */
    APPLE_PAY = 'APPLE_PAY',

    /**
     * Android Pay
     */
    ANDROID_PAY = 'ANDROID_PAY',

    /**
     * Google Pay
     */
    GOOGLE_PAY = 'GOOGLE_PAY',

    /**
     * Shopify Pay
     */
    SHOPIFY_PAY = 'SHOPIFY_PAY'
  }

  /**
   * Represents a web address.
   */
  interface IDomain {
    __typename: 'Domain';

    /**
     * The host name of the domain (eg: `example.com`).
     */
    host: string;

    /**
     * Whether SSL is enabled or not.
     */
    sslEnabled: boolean;

    /**
     * The URL of the domain (eg: `https://example.com`).
     */
    url: any;
  }

  /**
   * Policy that a merchant has configured for their store, such as their refund or privacy policy.
   */
  interface IShopPolicy {
    __typename: 'ShopPolicy';

    /**
     * Policy text, maximum size of 64kb.
     */
    body: string;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * Policy’s title.
     */
    title: string;

    /**
     * Public URL to the policy.
     */
    url: any;
  }

  interface IStringConnection {
    __typename: 'StringConnection';

    /**
     * A list of edges.
     */
    edges: Array<IStringEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface IStringEdge {
    __typename: 'StringEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of StringEdge.
     */
    node: string;
  }

  /**
   * The set of valid sort keys for the products query.
   */
  const enum ProductSortKeys {
    TITLE = 'TITLE',
    PRODUCT_TYPE = 'PRODUCT_TYPE',
    VENDOR = 'VENDOR',
    UPDATED_AT = 'UPDATED_AT',
    CREATED_AT = 'CREATED_AT',
    ID = 'ID',

    /**
     * During a search (i.e. when the `query` parameter has been specified on the connection) this sorts the
     * results by relevance to the search term(s). When no search query is specified, this sort key is not
     * deterministic and should not be used.
     *
     */
    RELEVANCE = 'RELEVANCE'
  }

  /**
   * The schema’s entry-point for mutations. This acts as the public, top-level API from which all mutation queries must start.
   */
  interface IMutation {
    __typename: 'Mutation';

    /**
     * Updates the attributes of a checkout.
     */
    checkoutAttributesUpdate: ICheckoutAttributesUpdatePayload | null;
    checkoutCompleteFree: ICheckoutCompleteFreePayload | null;

    /**
     * Completes a checkout using a credit card token from Shopify's Vault.
     */
    checkoutCompleteWithCreditCard: ICheckoutCompleteWithCreditCardPayload | null;

    /**
     * Completes a checkout with a tokenized payment.
     */
    checkoutCompleteWithTokenizedPayment: ICheckoutCompleteWithTokenizedPaymentPayload | null;

    /**
     * Creates a new checkout.
     */
    checkoutCreate: ICheckoutCreatePayload | null;

    /**
     * Associates a customer to the checkout.
     */
    checkoutCustomerAssociate: ICheckoutCustomerAssociatePayload | null;

    /**
     * Disassociates the current checkout customer from the checkout.
     */
    checkoutCustomerDisassociate: ICheckoutCustomerDisassociatePayload | null;

    /**
     * Applies a discount to an existing checkout using a discount code.
     */
    checkoutDiscountCodeApply: ICheckoutDiscountCodeApplyPayload | null;

    /**
     * Removes the applied discount from an existing checkout.
     */
    checkoutDiscountCodeRemove: ICheckoutDiscountCodeRemovePayload | null;

    /**
     * Updates the email on an existing checkout.
     */
    checkoutEmailUpdate: ICheckoutEmailUpdatePayload | null;

    /**
     * Applies a gift card to an existing checkout using a gift card code. This will replace all currently applied gift cards.
     * @deprecated "Use `checkoutGiftCardsAppend` instead"
     */
    checkoutGiftCardApply: ICheckoutGiftCardApplyPayload | null;

    /**
     * Removes an applied gift card from the checkout.
     */
    checkoutGiftCardRemove: ICheckoutGiftCardRemovePayload | null;

    /**
     * Appends gift cards to an existing checkout.
     */
    checkoutGiftCardsAppend: ICheckoutGiftCardsAppendPayload | null;

    /**
     * Adds a list of line items to a checkout.
     */
    checkoutLineItemsAdd: ICheckoutLineItemsAddPayload | null;

    /**
     * Removes line items from an existing checkout
     */
    checkoutLineItemsRemove: ICheckoutLineItemsRemovePayload | null;

    /**
     * Updates line items on a checkout.
     */
    checkoutLineItemsUpdate: ICheckoutLineItemsUpdatePayload | null;

    /**
     * Updates the shipping address of an existing checkout.
     */
    checkoutShippingAddressUpdate: ICheckoutShippingAddressUpdatePayload | null;

    /**
     * Updates the shipping lines on an existing checkout.
     */
    checkoutShippingLineUpdate: ICheckoutShippingLineUpdatePayload | null;

    /**
     * Creates a customer access token.
     * The customer access token is required to modify the customer object in any way.
     *
     */
    customerAccessTokenCreate: ICustomerAccessTokenCreatePayload | null;

    /**
     * Permanently destroys a customer access token.
     */
    customerAccessTokenDelete: ICustomerAccessTokenDeletePayload | null;

    /**
     * Renews a customer access token.
     *
     * Access token renewal must happen *before* a token expires.
     * If a token has already expired, a new one should be created instead via `customerAccessTokenCreate`.
     *
     */
    customerAccessTokenRenew: ICustomerAccessTokenRenewPayload | null;

    /**
     * Activates a customer.
     */
    customerActivate: ICustomerActivatePayload | null;

    /**
     * Creates a new address for a customer.
     */
    customerAddressCreate: ICustomerAddressCreatePayload | null;

    /**
     * Permanently deletes the address of an existing customer.
     */
    customerAddressDelete: ICustomerAddressDeletePayload | null;

    /**
     * Updates the address of an existing customer.
     */
    customerAddressUpdate: ICustomerAddressUpdatePayload | null;

    /**
     * Creates a new customer.
     */
    customerCreate: ICustomerCreatePayload | null;

    /**
     * Updates the default address of an existing customer.
     */
    customerDefaultAddressUpdate: ICustomerDefaultAddressUpdatePayload | null;

    /**
     * Sends a reset password email to the customer, as the first step in the reset password process.
     */
    customerRecover: ICustomerRecoverPayload | null;

    /**
     * Resets a customer’s password with a token received from `CustomerRecover`.
     */
    customerReset: ICustomerResetPayload | null;

    /**
     * Resets a customer’s password with the reset password url received from `CustomerRecover`.
     */
    customerResetByUrl: ICustomerResetByUrlPayload | null;

    /**
     * Updates an existing customer.
     */
    customerUpdate: ICustomerUpdatePayload | null;
  }

  interface ICheckoutAttributesUpdateOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;
    input: ICheckoutAttributesUpdateInput;
  }

  interface ICheckoutCompleteFreeOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutCompleteWithCreditCardOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;
    payment: ICreditCardPaymentInput;
  }

  interface ICheckoutCompleteWithTokenizedPaymentOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;
    payment: ITokenizedPaymentInput;
  }

  interface ICheckoutCreateOnMutationArguments {
    input: ICheckoutCreateInput;
  }

  interface ICheckoutCustomerAssociateOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;

    /**
     * The customer access token of the customer to associate.
     */
    customerAccessToken: string;
  }

  interface ICheckoutCustomerDisassociateOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutDiscountCodeApplyOnMutationArguments {
    /**
     * The discount code to apply to the checkout.
     */
    discountCode: string;

    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutDiscountCodeRemoveOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutEmailUpdateOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;

    /**
     * The email to update the checkout with.
     */
    email: string;
  }

  interface ICheckoutGiftCardApplyOnMutationArguments {
    /**
     * The code of the gift card to apply on the checkout.
     */
    giftCardCode: string;

    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutGiftCardRemoveOnMutationArguments {
    /**
     * The ID of the Applied Gift Card to remove from the Checkout
     */
    appliedGiftCardId: string;

    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutGiftCardsAppendOnMutationArguments {
    /**
     * A list of gift card codes to append to the checkout.
     */
    giftCardCodes: Array<string>;

    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutLineItemsAddOnMutationArguments {
    /**
     * A list of line item objects to add to the checkout.
     */
    lineItems: Array<ICheckoutLineItemInput>;

    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutLineItemsRemoveOnMutationArguments {
    /**
     * the checkout on which to remove line items
     */
    checkoutId: string;

    /**
     * line item ids to remove
     */
    lineItemIds: Array<string>;
  }

  interface ICheckoutLineItemsUpdateOnMutationArguments {
    /**
     * the checkout on which to update line items.
     */
    checkoutId: string;

    /**
     * line items to update.
     */
    lineItems: Array<ICheckoutLineItemUpdateInput>;
  }

  interface ICheckoutShippingAddressUpdateOnMutationArguments {
    /**
     * The shipping address to where the line items will be shipped.
     */
    shippingAddress: IMailingAddressInput;

    /**
     * The ID of the checkout.
     */
    checkoutId: string;
  }

  interface ICheckoutShippingLineUpdateOnMutationArguments {
    /**
     * The ID of the checkout.
     */
    checkoutId: string;

    /**
     * A concatenation of a Checkout’s shipping provider, price, and title, enabling the customer to select the availableShippingRates.
     */
    shippingRateHandle: string;
  }

  interface ICustomerAccessTokenCreateOnMutationArguments {
    input: ICustomerAccessTokenCreateInput;
  }

  interface ICustomerAccessTokenDeleteOnMutationArguments {
    /**
     * The access token used to identify the customer.
     */
    customerAccessToken: string;
  }

  interface ICustomerAccessTokenRenewOnMutationArguments {
    /**
     * The access token used to identify the customer.
     */
    customerAccessToken: string;
  }

  interface ICustomerActivateOnMutationArguments {
    /**
     * Specifies the customer to activate.
     */
    id: string;
    input: ICustomerActivateInput;
  }

  interface ICustomerAddressCreateOnMutationArguments {
    /**
     * The access token used to identify the customer.
     */
    customerAccessToken: string;

    /**
     * The customer mailing address to create.
     */
    address: IMailingAddressInput;
  }

  interface ICustomerAddressDeleteOnMutationArguments {
    /**
     * Specifies the address to delete.
     */
    id: string;

    /**
     * The access token used to identify the customer.
     */
    customerAccessToken: string;
  }

  interface ICustomerAddressUpdateOnMutationArguments {
    /**
     * The access token used to identify the customer.
     */
    customerAccessToken: string;

    /**
     * Specifies the customer address to update.
     */
    id: string;

    /**
     * The customer’s mailing address.
     */
    address: IMailingAddressInput;
  }

  interface ICustomerCreateOnMutationArguments {
    input: ICustomerCreateInput;
  }

  interface ICustomerDefaultAddressUpdateOnMutationArguments {
    /**
     * The access token used to identify the customer.
     */
    customerAccessToken: string;

    /**
     * ID of the address to set as the new default for the customer.
     */
    addressId: string;
  }

  interface ICustomerRecoverOnMutationArguments {
    /**
     * The email address of the customer to recover.
     */
    email: string;
  }

  interface ICustomerResetOnMutationArguments {
    /**
     * Specifies the customer to reset.
     */
    id: string;
    input: ICustomerResetInput;
  }

  interface ICustomerResetByUrlOnMutationArguments {
    /**
     * The customer's reset password url.
     */
    resetUrl: any;

    /**
     * New password that will be set as part of the reset password process.
     */
    password: string;
  }

  interface ICustomerUpdateOnMutationArguments {
    /**
     * The access token used to identify the customer.
     */
    customerAccessToken: string;

    /**
     * The customer object input.
     */
    customer: ICustomerUpdateInput;
  }

  /**
   * Specifies the fields required to update a checkout's attributes.
   */
  interface ICheckoutAttributesUpdateInput {
    /**
     * The text of an optional note that a shop owner can attach to the checkout.
     */
    note?: string | null;

    /**
     * A list of extra information that is added to the checkout.
     */
    customAttributes: Array<IAttributeInput>;

    /**
     * Allows setting partial addresses on a Checkout, skipping the full validation of attributes.
     * The required attributes are city, province, and country.
     * Full validation of the addresses is still done at complete time.
     *
     * @default false
     */
    allowPartialAddresses?: boolean | null;
  }

  /**
   * Specifies the input fields required for an attribute.
   */
  interface IAttributeInput {
    /**
     * Key or name of the attribute.
     */
    key: string;

    /**
     * Value of the attribute.
     */
    value: string;
  }

  interface ICheckoutAttributesUpdatePayload {
    __typename: 'CheckoutAttributesUpdatePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * A container for all the information required to checkout items and pay.
   */
  interface ICheckout {
    __typename: 'Checkout';
    appliedGiftCards: Array<IAppliedGiftCard>;

    /**
     * The available shipping rates for this Checkout.
     * Should only be used when checkout `requiresShipping` is `true` and
     * the shipping address is valid.
     *
     */
    availableShippingRates: IAvailableShippingRates | null;

    /**
     * The date and time when the checkout was completed.
     */
    completedAt: any | null;

    /**
     * The date and time when the checkout was created.
     */
    createdAt: any;

    /**
     * The currency code for the Checkout.
     */
    currencyCode: CurrencyCode;

    /**
     * A list of extra information that is added to the checkout.
     */
    customAttributes: Array<IAttribute>;

    /**
     * The customer associated with the checkout.
     * @deprecated "This field will always return null. If you have an authentication token for the customer, you can use the `customer` field on the query root to retrieve it."
     */
    customer: ICustomer | null;

    /**
     * The email attached to this checkout.
     */
    email: string | null;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * A list of line item objects, each one containing information about an item in the checkout.
     */
    lineItems: ICheckoutLineItemConnection;
    note: string | null;

    /**
     * The resulting order from a paid checkout.
     */
    order: IOrder | null;

    /**
     * The Order Status Page for this Checkout, null when checkout is not completed.
     */
    orderStatusUrl: any | null;

    /**
     * The amount left to be paid. This is equal to the cost of the line items, taxes and shipping minus discounts and gift cards.
     */
    paymentDue: any;

    /**
     * Whether or not the Checkout is ready and can be completed. Checkouts may have asynchronous operations that can take time to finish. If you want to complete a checkout or ensure all the fields are populated and up to date, polling is required until the value is true.
     */
    ready: boolean;

    /**
     * States whether or not the fulfillment requires shipping.
     */
    requiresShipping: boolean;

    /**
     * The shipping address to where the line items will be shipped.
     */
    shippingAddress: IMailingAddress | null;

    /**
     * Once a shipping rate is selected by the customer it is transitioned to a `shipping_line` object.
     */
    shippingLine: IShippingRate | null;

    /**
     * Price of the checkout before shipping, taxes, and discounts.
     */
    subtotalPrice: any;

    /**
     * Specifies if the Checkout is tax exempt.
     */
    taxExempt: boolean;

    /**
     * Specifies if taxes are included in the line item and shipping line prices.
     */
    taxesIncluded: boolean;

    /**
     * The sum of all the prices of all the items in the checkout, taxes and discounts included.
     */
    totalPrice: any;

    /**
     * The sum of all the taxes applied to the line items and shipping lines in the checkout.
     */
    totalTax: any;

    /**
     * The date and time when the checkout was last updated.
     */
    updatedAt: any;

    /**
     * The url pointing to the checkout accessible from the web.
     */
    webUrl: any;
  }

  interface ILineItemsOnCheckoutArguments {
    /**
     * Returns up to the first `n` elements from the list.
     */
    first?: number | null;

    /**
     * Returns the elements that come after the specified cursor.
     */
    after?: string | null;

    /**
     * Returns up to the last `n` elements from the list.
     */
    last?: number | null;

    /**
     * Returns the elements that come before the specified cursor.
     */
    before?: string | null;

    /**
     * Reverse the order of the underlying list.
     * @default false
     */
    reverse?: boolean | null;
  }

  /**
   * Details about the gift card used on the checkout.
   */
  interface IAppliedGiftCard {
    __typename: 'AppliedGiftCard';

    /**
     * The amount that was used taken from the Gift Card by applying it.
     */
    amountUsed: any;

    /**
     * The amount left on the Gift Card.
     */
    balance: any;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * The last characters of the Gift Card code
     */
    lastCharacters: string;
  }

  /**
   * A collection of available shipping rates for a checkout.
   */
  interface IAvailableShippingRates {
    __typename: 'AvailableShippingRates';

    /**
     * Whether or not the shipping rates are ready.
     * The `shippingRates` field is `null` when this value is `false`.
     * This field should be polled until its value becomes `true`.
     *
     */
    ready: boolean;

    /**
     * The fetched shipping rates. `null` until the `ready` field is `true`.
     */
    shippingRates: Array<IShippingRate>;
  }

  /**
   * A shipping rate to be applied to a checkout.
   */
  interface IShippingRate {
    __typename: 'ShippingRate';

    /**
     * Human-readable unique identifier for this shipping rate.
     */
    handle: string;

    /**
     * Price of this shipping rate.
     */
    price: any;

    /**
     * Title of this shipping rate.
     */
    title: string;
  }

  interface ICheckoutLineItemConnection {
    __typename: 'CheckoutLineItemConnection';

    /**
     * A list of edges.
     */
    edges: Array<ICheckoutLineItemEdge>;

    /**
     * Information to aid in pagination.
     */
    pageInfo: IPageInfo;
  }

  interface ICheckoutLineItemEdge {
    __typename: 'CheckoutLineItemEdge';

    /**
     * A cursor for use in pagination.
     */
    cursor: string;

    /**
     * The item at the end of CheckoutLineItemEdge.
     */
    node: ICheckoutLineItem;
  }

  /**
   * A single line item in the checkout, grouped by variant and attributes.
   */
  interface ICheckoutLineItem {
    __typename: 'CheckoutLineItem';

    /**
     * Extra information in the form of an array of Key-Value pairs about the line item.
     */
    customAttributes: Array<IAttribute>;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * The quantity of the line item.
     */
    quantity: number;

    /**
     * Title of the line item. Defaults to the product's title.
     */
    title: string;

    /**
     * Product variant of the line item.
     */
    variant: IProductVariant | null;
  }

  /**
   * Represents an error in the input of a mutation.
   */
  interface IUserError {
    __typename: 'UserError';

    /**
     * Path to the input field which caused the error.
     */
    field: Array<string>;

    /**
     * The error message.
     */
    message: string;
  }

  /**
   * Represents an error in the input of a mutation.
   */
  type DisplayableError = IUserError | ICustomerUserError;

  /**
   * Represents an error in the input of a mutation.
   */
  interface IDisplayableError {
    __typename: 'DisplayableError';

    /**
     * Path to the input field which caused the error.
     */
    field: Array<string>;

    /**
     * The error message.
     */
    message: string;
  }

  interface ICheckoutCompleteFreePayload {
    __typename: 'CheckoutCompleteFreePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * Specifies the fields required to complete a checkout with
   * a Shopify vaulted credit card payment.
   *
   */
  interface ICreditCardPaymentInput {
    /**
     * The amount of the payment.
     */
    amount: any;

    /**
     * A unique client generated key used to avoid duplicate charges. When a duplicate payment is found, the original is returned instead of creating a new one.
     */
    idempotencyKey: string;

    /**
     * The billing address for the payment.
     */
    billingAddress: IMailingAddressInput;

    /**
     * The ID returned by Shopify's Card Vault.
     */
    vaultId: string;

    /**
     * Executes the payment in test mode if possible. Defaults to `false`.
     * @default false
     */
    test?: boolean | null;
  }

  /**
   * Specifies the fields accepted to create or update a mailing address.
   */
  interface IMailingAddressInput {
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    company?: string | null;
    country?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    province?: string | null;
    zip?: string | null;
  }

  interface ICheckoutCompleteWithCreditCardPayload {
    __typename: 'CheckoutCompleteWithCreditCardPayload';

    /**
     * The checkout on which the payment was applied.
     */
    checkout: ICheckout;

    /**
     * A representation of the attempted payment.
     */
    payment: IPayment | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * A payment applied to a checkout.
   */
  interface IPayment {
    __typename: 'Payment';

    /**
     * The amount of the payment.
     */
    amount: any;

    /**
     * The billing address for the payment.
     */
    billingAddress: IMailingAddress | null;

    /**
     * The checkout to which the payment belongs.
     */
    checkout: ICheckout;

    /**
     * The credit card used for the payment in the case of direct payments.
     */
    creditCard: ICreditCard | null;

    /**
     * An message describing a processing error during asynchronous processing.
     */
    errorMessage: string | null;

    /**
     * Globally unique identifier.
     */
    id: string;

    /**
     * A client-side generated token to identify a payment and perform idempotent operations.
     */
    idempotencyKey: string | null;

    /**
     * Whether or not the payment is still processing asynchronously.
     */
    ready: boolean;

    /**
     * A flag to indicate if the payment is to be done in test mode for gateways that support it.
     */
    test: boolean;

    /**
     * The actual transaction recorded by Shopify after having processed the payment with the gateway.
     */
    transaction: ITransaction | null;
  }

  /**
   * Credit card information used for a payment.
   */
  interface ICreditCard {
    __typename: 'CreditCard';
    brand: string | null;
    expiryMonth: number | null;
    expiryYear: number | null;
    firstDigits: string | null;
    firstName: string | null;
    lastDigits: string | null;
    lastName: string | null;

    /**
     * Masked credit card number with only the last 4 digits displayed
     */
    maskedNumber: string | null;
  }

  /**
   * An object representing exchange of money for a product or service.
   */
  interface ITransaction {
    __typename: 'Transaction';

    /**
     * The amount of money that the transaction was for.
     */
    amount: any;

    /**
     * The kind of the transaction.
     */
    kind: TransactionKind;

    /**
     * The status of the transaction
     */
    status: TransactionStatus;

    /**
     * Whether the transaction was done in test mode or not
     */
    test: boolean;
  }

  const enum TransactionKind {
    SALE = 'SALE',
    CAPTURE = 'CAPTURE',
    AUTHORIZATION = 'AUTHORIZATION',
    EMV_AUTHORIZATION = 'EMV_AUTHORIZATION',
    CHANGE = 'CHANGE'
  }

  const enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    ERROR = 'ERROR'
  }

  /**
   * Specifies the fields required to complete a checkout with
   * a tokenized payment.
   *
   */
  interface ITokenizedPaymentInput {
    /**
     * The amount of the payment.
     */
    amount: any;

    /**
     * A unique client generated key used to avoid duplicate charges. When a duplicate payment is found, the original is returned instead of creating a new one.
     */
    idempotencyKey: string;

    /**
     * The billing address for the payment.
     */
    billingAddress: IMailingAddressInput;

    /**
     * The type of payment token.
     */
    type: string;

    /**
     * A simple string or JSON containing the required payment data for the tokenized payment.
     */
    paymentData: string;

    /**
     * Executes the payment in test mode if possible. Defaults to `false`.
     * @default false
     */
    test?: boolean | null;

    /**
     * Public Hash Key used for AndroidPay payments only.
     */
    identifier?: string | null;
  }

  interface ICheckoutCompleteWithTokenizedPaymentPayload {
    __typename: 'CheckoutCompleteWithTokenizedPaymentPayload';

    /**
     * The checkout on which the payment was applied.
     */
    checkout: ICheckout;

    /**
     * A representation of the attempted payment.
     */
    payment: IPayment | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * Specifies the fields required to create a checkout.
   */
  interface ICheckoutCreateInput {
    /**
     * The email with which the customer wants to checkout.
     */
    email?: string | null;

    /**
     * A list of line item objects, each one containing information about an item in the checkout.
     */
    lineItems: Array<ICheckoutLineItemInput>;

    /**
     * The shipping address to where the line items will be shipped.
     */
    shippingAddress?: IMailingAddressInput | null;

    /**
     * The text of an optional note that a shop owner can attach to the checkout.
     */
    note?: string | null;

    /**
     * A list of extra information that is added to the checkout.
     */
    customAttributes: Array<IAttributeInput>;

    /**
     * Allows setting partial addresses on a Checkout, skipping the full validation of attributes.
     * The required attributes are city, province, and country.
     * Full validation of addresses is still done at complete time.
     *
     */
    allowPartialAddresses?: boolean | null;
  }

  /**
   * Specifies the input fields to create a line item on a checkout.
   */
  interface ICheckoutLineItemInput {
    /**
     * Extra information in the form of an array of Key-Value pairs about the line item.
     */
    customAttributes: Array<IAttributeInput>;

    /**
     * The quantity of the line item.
     */
    quantity: number;

    /**
     * The identifier of the product variant for the line item.
     */
    variantId: string;
  }

  interface ICheckoutCreatePayload {
    __typename: 'CheckoutCreatePayload';

    /**
     * The new checkout object.
     */
    checkout: ICheckout | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutCustomerAssociatePayload {
    __typename: 'CheckoutCustomerAssociatePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout;

    /**
     * The associated customer object.
     */
    customer: ICustomer | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutCustomerDisassociatePayload {
    __typename: 'CheckoutCustomerDisassociatePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutDiscountCodeApplyPayload {
    __typename: 'CheckoutDiscountCodeApplyPayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutDiscountCodeRemovePayload {
    __typename: 'CheckoutDiscountCodeRemovePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutEmailUpdatePayload {
    __typename: 'CheckoutEmailUpdatePayload';

    /**
     * The checkout object with the updated email.
     */
    checkout: ICheckout;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutGiftCardApplyPayload {
    __typename: 'CheckoutGiftCardApplyPayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutGiftCardRemovePayload {
    __typename: 'CheckoutGiftCardRemovePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutGiftCardsAppendPayload {
    __typename: 'CheckoutGiftCardsAppendPayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutLineItemsAddPayload {
    __typename: 'CheckoutLineItemsAddPayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutLineItemsRemovePayload {
    __typename: 'CheckoutLineItemsRemovePayload';
    checkout: ICheckout | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * Specifies the input fields to update a line item on the checkout.
   */
  interface ICheckoutLineItemUpdateInput {
    id?: string | null;

    /**
     * The variant identifier of the line item.
     */
    variantId?: string | null;

    /**
     * The quantity of the line item.
     */
    quantity?: number | null;

    /**
     * Extra information in the form of an array of Key-Value pairs about the line item.
     */
    customAttributes: Array<IAttributeInput>;
  }

  interface ICheckoutLineItemsUpdatePayload {
    __typename: 'CheckoutLineItemsUpdatePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutShippingAddressUpdatePayload {
    __typename: 'CheckoutShippingAddressUpdatePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICheckoutShippingLineUpdatePayload {
    __typename: 'CheckoutShippingLineUpdatePayload';

    /**
     * The updated checkout object.
     */
    checkout: ICheckout | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * Specifies the input fields required to create a customer access token.
   */
  interface ICustomerAccessTokenCreateInput {
    /**
     * The email associated to the customer.
     */
    email: string;

    /**
     * The login password to be used by the customer.
     */
    password: string;
  }

  interface ICustomerAccessTokenCreatePayload {
    __typename: 'CustomerAccessTokenCreatePayload';

    /**
     * The newly created customer access token object.
     */
    customerAccessToken: ICustomerAccessToken | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    customerUserErrors: Array<ICustomerUserError>;

    /**
     * List of errors that occurred executing the mutation.
     * @deprecated "Use `customerUserErrors` instead"
     */
    userErrors: Array<IUserError>;
  }

  /**
   * A CustomerAccessToken represents the unique token required to make modifications to the customer object.
   */
  interface ICustomerAccessToken {
    __typename: 'CustomerAccessToken';

    /**
     * The customer’s access token.
     */
    accessToken: string;

    /**
     * The date and time when the customer access token expires.
     */
    expiresAt: any;
  }

  /**
   * Represents an error that happens during execution of a customer mutation.
   */
  interface ICustomerUserError {
    __typename: 'CustomerUserError';

    /**
     * Error code to uniquely identify the error.
     */
    code: CustomerErrorCode | null;

    /**
     * Path to the input field which caused the error.
     */
    field: Array<string>;

    /**
     * The error message.
     */
    message: string;
  }

  /**
   * Possible error codes that could be returned by a customer mutation.
   */
  const enum CustomerErrorCode {
    /**
     * Customer is unidentified.
     */
    UNIDENTIFIED_CUSTOMER = 'UNIDENTIFIED_CUSTOMER'
  }

  interface ICustomerAccessTokenDeletePayload {
    __typename: 'CustomerAccessTokenDeletePayload';

    /**
     * The destroyed access token.
     */
    deletedAccessToken: string | null;

    /**
     * ID of the destroyed customer access token.
     */
    deletedCustomerAccessTokenId: string | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICustomerAccessTokenRenewPayload {
    __typename: 'CustomerAccessTokenRenewPayload';

    /**
     * The renewed customer access token object.
     */
    customerAccessToken: ICustomerAccessToken | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * Specifies the input fields required to activate a customer.
   */
  interface ICustomerActivateInput {
    /**
     * The activation token required to activate the customer.
     */
    activationToken: string;

    /**
     * New password that will be set during activation.
     */
    password: string;
  }

  interface ICustomerActivatePayload {
    __typename: 'CustomerActivatePayload';

    /**
     * The customer object.
     */
    customer: ICustomer | null;

    /**
     * A newly created customer access token object for the customer.
     */
    customerAccessToken: ICustomerAccessToken | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICustomerAddressCreatePayload {
    __typename: 'CustomerAddressCreatePayload';

    /**
     * The new customer address object.
     */
    customerAddress: IMailingAddress | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICustomerAddressDeletePayload {
    __typename: 'CustomerAddressDeletePayload';

    /**
     * ID of the deleted customer address.
     */
    deletedCustomerAddressId: string | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICustomerAddressUpdatePayload {
    __typename: 'CustomerAddressUpdatePayload';

    /**
     * The customer’s updated mailing address.
     */
    customerAddress: IMailingAddress | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * Specifies the fields required to create a new Customer.
   */
  interface ICustomerCreateInput {
    /**
     * The customer’s first name.
     */
    firstName?: string | null;

    /**
     * The customer’s last name.
     */
    lastName?: string | null;

    /**
     * The customer’s email.
     */
    email: string;

    /**
     * The customer’s phone number.
     */
    phone?: string | null;

    /**
     * The login password used by the customer.
     */
    password: string;

    /**
     * Indicates whether the customer has consented to be sent marketing material via email.
     */
    acceptsMarketing?: boolean | null;
  }

  interface ICustomerCreatePayload {
    __typename: 'CustomerCreatePayload';

    /**
     * The created customer object.
     */
    customer: ICustomer | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICustomerDefaultAddressUpdatePayload {
    __typename: 'CustomerDefaultAddressUpdatePayload';

    /**
     * The updated customer object.
     */
    customer: ICustomer | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICustomerRecoverPayload {
    __typename: 'CustomerRecoverPayload';

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * Specifies the fields required to reset a Customer’s password.
   */
  interface ICustomerResetInput {
    /**
     * The reset token required to reset the customer’s password.
     */
    resetToken: string;

    /**
     * New password that will be set as part of the reset password process.
     */
    password: string;
  }

  interface ICustomerResetPayload {
    __typename: 'CustomerResetPayload';

    /**
     * The customer object which was reset.
     */
    customer: ICustomer | null;

    /**
     * A newly created customer access token object for the customer.
     */
    customerAccessToken: ICustomerAccessToken | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  interface ICustomerResetByUrlPayload {
    __typename: 'CustomerResetByUrlPayload';

    /**
     * The customer object which was reset.
     */
    customer: ICustomer | null;

    /**
     * A newly created customer access token object for the customer.
     */
    customerAccessToken: ICustomerAccessToken | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }

  /**
   * Specifies the fields required to update the Customer information.
   */
  interface ICustomerUpdateInput {
    /**
     * The customer’s first name.
     */
    firstName?: string | null;

    /**
     * The customer’s last name.
     */
    lastName?: string | null;

    /**
     * The customer’s email.
     */
    email?: string | null;

    /**
     * The customer’s phone number.
     */
    phone?: string | null;

    /**
     * The login password used by the customer.
     */
    password?: string | null;

    /**
     * Indicates whether the customer has consented to be sent marketing material via email.
     */
    acceptsMarketing?: boolean | null;
  }

  interface ICustomerUpdatePayload {
    __typename: 'CustomerUpdatePayload';

    /**
     * The updated customer object.
     */
    customer: ICustomer | null;

    /**
     * The newly created customer access token. If the customer's password is updated, all previous access tokens
     * (including the one used to perform this mutation) become invalid, and a new token is generated.
     *
     */
    customerAccessToken: ICustomerAccessToken | null;

    /**
     * List of errors that occurred executing the mutation.
     */
    userErrors: Array<IUserError>;
  }
}

// tslint:enable
