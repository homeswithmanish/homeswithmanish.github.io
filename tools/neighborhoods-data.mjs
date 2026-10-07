// Neighborhood guide content. Rendered by tools/generate-pages.mjs to
// /cities/<city>/<slug>/index.html.
//
// Rules for this file:
// - Every factual claim should trace to an entry in `sources` or to data
//   already published elsewhere on the site (true-cost presets, city pages).
// - School assignments change. Always point readers to the district locator.
// - No dollar figures for prices here; prices live on the city pages and the
//   live market table so they stay current in one place.
// - House style: no em dashes in body copy.

export const NEIGHBORHOODS = [
  {
    slug: "dougherty-valley",
    city: "san-ramon",
    cityName: "San Ramon",
    name: "Dougherty Valley",
    zip: "94582",
    county: "Contra Costa County",
    seoTitle: "Dougherty Valley, San Ramon: Homes, Schools & HOA Guide",
    metaDescription:
      "A local realtor's guide to Dougherty Valley in San Ramon: Windemere and Gale Ranch, SRVUSD schools, HOA and Mello-Roos costs, and commute trade-offs.",
    tagline: "San Ramon's master-planned east side: newer homes, its own high school, and costs worth understanding before you offer.",
    updated: "2026-10-07",
    intro: [
      "Dougherty Valley is the master-planned eastern half of San Ramon, built mostly since the early 2000s on land that was ranched for more than a century. Shapell Industries and Windemere Ranch Partners acquired roughly 6,000 acres here, and the plan calls for about 9,000 to 11,000 homes along with parks, schools and a community center.",
      "For buyers, the appeal is straightforward: newer construction, walkable parks and trails, and access to San Ramon Valley Unified schools, including Dougherty Valley High, which opened in 2007 inside the Windemere development. The trade-offs are just as clear. Most homes carry HOA dues and special taxes, lots are smaller than on San Ramon's west side, and peak-hour traffic to I-680 is real.",
    ],
    facts: [
      { label: "City", value: "San Ramon, CA 94582" },
      { label: "County", value: "Contra Costa" },
      { label: "Main sub-areas", value: "Windemere, Gale Ranch" },
      { label: "School district", value: "San Ramon Valley Unified (SRVUSD)" },
      { label: "Built", value: "Early 2000s onward, in phases" },
      { label: "Typical extras", value: "HOA dues and Mello-Roos/CFD special taxes" },
    ],
    sections: [
      {
        heading: "Windemere and Gale Ranch",
        paragraphs: [
          "Windemere was developed first and is essentially built out. It is home to Dougherty Valley High and Windemere Ranch Middle, and its streets sit closest to the Dougherty Station Community Center and library.",
          "Gale Ranch, developed by Shapell, came later and was annexed into San Ramon in stages under a 1994 agreement between the city, Danville, Contra Costa County and the two developers. Gale Ranch Middle and Quail Run Elementary serve parts of this area.",
          "Within both, you'll find a mix of single-family homes, townhomes and condos from several builders. Floor plan, lot orientation and exact school assignment vary block by block, which is why two homes a few streets apart can price very differently.",
        ],
      },
      {
        heading: "What a home here really costs",
        paragraphs: [
          "The listing price is only part of the monthly picture in Dougherty Valley. Most parcels carry special taxes from community facilities districts that funded the area's infrastructure, plus master and sub-association HOA dues. Contra Costa County does not publish these centrally, so the amounts have to be read off each parcel's tax bill and HOA disclosures.",
          "Use the True Monthly Cost Calculator on the homepage, which has Windemere and Gale Ranch presets, to see how these line items change your payment and buying power. Before you write an offer, I pull the actual tax bill and HOA documents for that specific address.",
        ],
        links: [
          { href: "/#true-cost", label: "True Monthly Cost Calculator" },
          { href: "/calculators/property-tax/", label: "Property tax and Mello-Roos calculator" },
        ],
      },
      {
        heading: "Commute and daily life",
        paragraphs: [
          "Bollinger Canyon Road and Crow Canyon Road are the main links west to I-680 and Bishop Ranch. Off-peak, the drive is quick; at school and commute peaks, plan for backups on both. Dublin/Pleasanton BART is a short drive south via Dougherty Road.",
          "Day to day, residents rely on neighborhood parks and trails, the Dougherty Station Community Center and library, and the shopping at City Center Bishop Ranch and along Bollinger Canyon.",
        ],
      },
    ],
    schools: {
      district: "San Ramon Valley Unified School District",
      list: [
        "Dougherty Valley High School (opened 2007)",
        "Windemere Ranch Middle School and Gale Ranch Middle School",
        "Elementary schools including Coyote Creek, Hidden Hills, Live Oak and Quail Run",
      ],
      note: "Dougherty Valley High's enrollment has grown well past its original design capacity, and attendance boundaries in this part of SRVUSD have changed over time. Confirm the assignment for any specific address with SRVUSD before you rely on it.",
      locatorUrl: "https://www.srvusd.net/",
    },
    fit: [
      "Families who want newer construction and SRVUSD schools",
      "Buyers who prefer HOA-maintained parks and common areas",
      "Relocating professionals working at Bishop Ranch or along I-680",
    ],
    lessIdeal: [
      "Buyers who want large lots or older custom homes (look at San Ramon's west side or Danville)",
      "Anyone who needs the lowest possible monthly carrying cost",
    ],
    faq: [
      {
        q: "Is Dougherty Valley part of San Ramon?",
        a: "Yes. Dougherty Valley is within the City of San Ramon. Some sections were annexed into the city in stages under a 1994 agreement as their final subdivision maps were filed, so you may see older documents that refer to unincorporated Contra Costa County.",
      },
      {
        q: "Do Dougherty Valley homes have Mello-Roos?",
        a: "Most do. Many parcels carry special taxes from community facilities districts, and most homes also pay HOA dues. The amount varies by tract and is shown on each parcel's Contra Costa County tax bill, so check the specific address rather than relying on a neighborhood average.",
      },
      {
        q: "What high school serves Dougherty Valley?",
        a: "Much of Dougherty Valley is served by Dougherty Valley High School in SRVUSD, which opened in 2007. Boundaries can change, so verify the assignment for a specific address with the district.",
      },
      {
        q: "What is the difference between Windemere and Gale Ranch?",
        a: "Both are master-planned areas within Dougherty Valley. Windemere was built first and is home to Dougherty Valley High and Windemere Ranch Middle. Gale Ranch was developed later by Shapell and includes Gale Ranch Middle. HOA structures and special taxes differ between them, so compare the actual figures for each home.",
      },
    ],
    sources: [
      { label: "Contra Costa County Historical Society: James Witt Dougherty and the Dougherty Valley", url: "https://www.cocohistory.org/essays/james-witt-dougherty-and-the-dougherty-valley" },
      { label: "Dougherty Valley High School (Wikipedia)", url: "https://en.wikipedia.org/wiki/Dougherty_Valley_High_School" },
      { label: "San Ramon Patch: Homes, School Annexed Into San Ramon (2011)", url: "https://patch.com/california/sanramon/homes-school-annexed-into-san-ramon" },
    ],
  },

  {
    slug: "dublin-ranch",
    city: "dublin",
    cityName: "Dublin",
    name: "Dublin Ranch",
    zip: "94568",
    county: "Alameda County",
    seoTitle: "Dublin Ranch, Dublin CA: Homes, Schools & Costs Guide",
    metaDescription:
      "A local realtor's guide to Dublin Ranch in East Dublin: home types, DUSD schools including Emerald High, Mello-Roos facts, golf, parks and BART access.",
    tagline: "East Dublin's largest master-planned community, with newer homes, top-rated schools and a cost structure that differs from Dublin's newest tracts.",
    updated: "2026-10-07",
    intro: [
      "Dublin Ranch is the large master-planned community in East Dublin, north of I-580 and stretching up toward the Diablo Range foothills. Construction began in the early 2000s on former pasture land, and most homes date from the early 2000s through the 2010s.",
      "It offers a wide range of housing: single-family homes, townhomes and condos, many in a Mediterranean style. That variety makes it one of the few Tri-Valley neighborhoods where a first-time buyer and a move-up family might both find the right fit within a mile of each other.",
    ],
    facts: [
      { label: "City", value: "Dublin, CA 94568" },
      { label: "County", value: "Alameda" },
      { label: "School district", value: "Dublin Unified (DUSD)" },
      { label: "Built", value: "Early 2000s through the 2010s" },
      { label: "Home types", value: "Single-family, townhomes, condos" },
      { label: "City of Dublin CFD", value: "None (school CFD possible on some tracts)" },
    ],
    sections: [
      {
        heading: "Why Dublin Ranch costs less to carry than newer East Dublin",
        paragraphs: [
          "One of the most useful facts about Dublin Ranch is what it does not have. Based on the City of Dublin's published CFD administration reports, Dublin Ranch is not inside any City of Dublin community facilities district. Newer communities such as Boulevard and East Ranch are, and those special taxes can add several thousand dollars a year.",
          "Some Dublin Ranch tracts may still carry a Dublin Unified school facilities tax, and HOA dues apply to most homes. Always confirm with the Alameda County tax bill for the specific parcel. The True Monthly Cost Calculator on the homepage includes a Dublin Ranch preset for side-by-side comparisons.",
        ],
        links: [
          { href: "/#true-cost", label: "True Monthly Cost Calculator" },
          { href: "/calculators/property-tax/", label: "Property tax and Mello-Roos calculator" },
        ],
      },
      {
        heading: "Amenities and daily life",
        paragraphs: [
          "Dublin Ranch Golf Course, a public course, runs through the neighborhood. Fallon Sports Park, a 61-acre complex, is the hub for youth sports, and smaller parks are spread throughout the community.",
          "Shopping along Dublin Boulevard and Tassajara Road covers most daily needs, and the San Francisco Premium Outlets are a few minutes east off I-580.",
        ],
      },
      {
        heading: "Commute",
        paragraphs: [
          "I-580 runs along the southern edge, with I-680 a short drive west. The Dublin/Pleasanton BART station is roughly four miles away, which makes San Francisco and Oakland commutes realistic without driving the whole way.",
        ],
      },
    ],
    schools: {
      district: "Dublin Unified School District",
      list: [
        "Elementary schools serving the area include Harold William Kolb, John Green and J.M. Amador",
        "Eleanor Murray Fallon Middle School",
        "Emerald High School (opened 2023, on its own Central Parkway campus since August 2024) and Dublin High School",
      ],
      note: "DUSD has opened several new schools in East Dublin and adjusted boundaries as it grew. High school assignment between Dublin High and Emerald High depends on the address. Confirm with DUSD.",
      locatorUrl: "https://www.dublinusd.org/",
    },
    fit: [
      "Buyers who want newer construction without the largest CFD bills",
      "First-time buyers looking at townhomes and condos in a top school district",
      "BART commuters who still want a suburban, master-planned feel",
    ],
    lessIdeal: [
      "Buyers who want large lots (West Dublin's older neighborhoods offer more land)",
      "Anyone who wants to avoid HOAs entirely",
    ],
    faq: [
      {
        q: "Does Dublin Ranch have Mello-Roos?",
        a: "Dublin Ranch is not in a City of Dublin community facilities district, unlike newer communities such as Boulevard and East Ranch. Some tracts may carry a Dublin Unified school facilities tax, and most homes pay HOA dues. Check the specific parcel's Alameda County tax bill.",
      },
      {
        q: "What high school serves Dublin Ranch?",
        a: "Depending on the address, Dublin Ranch homes may be assigned to Dublin High School or Emerald High School, which opened in 2023 and moved to its Central Parkway campus in 2024. Verify with Dublin Unified.",
      },
      {
        q: "How far is Dublin Ranch from BART?",
        a: "The Dublin/Pleasanton BART station is about four miles from Dublin Ranch, typically a short drive or bus ride.",
      },
      {
        q: "What types of homes are in Dublin Ranch?",
        a: "Dublin Ranch includes single-family homes, townhomes and condos, mostly built from the early 2000s through the 2010s, many in a Mediterranean style.",
      },
    ],
    sources: [
      { label: "City of Dublin CFD administration reports (FY 2024-25)", url: "https://dublin.ca.gov/2682" },
      { label: "Emerald High School (Wikipedia)", url: "https://en.wikipedia.org/wiki/Emerald_High_School" },
      { label: "Dublin Unified School District (Wikipedia)", url: "https://en.wikipedia.org/wiki/Dublin_Unified_School_District" },
      { label: "Homes.com: Dublin Ranch neighborhood guide", url: "https://www.homes.com/local-guide/dublin-ca/dublin-ranch-neighborhood/" },
    ],
  },

  {
    slug: "ruby-hill",
    city: "pleasanton",
    cityName: "Pleasanton",
    name: "Ruby Hill",
    zip: "94566",
    county: "Alameda County",
    seoTitle: "Ruby Hill, Pleasanton: Gated Golf Community Home Guide",
    metaDescription:
      "A local realtor's guide to Ruby Hill in Pleasanton: the guarded gate, Jack Nicklaus golf club, wine-country setting, schools and HOA basics for buyers.",
    tagline: "Pleasanton's guarded, golf-course community in the Livermore Valley wine country.",
    updated: "2026-10-07",
    intro: [
      "Ruby Hill is a gated community on Pleasanton's eastern edge, off Vineyard Avenue, where the city meets the Livermore Valley wine region. Developed by Signature Properties beginning in 1992, it has roughly 850 home sites behind a 24-hour guarded entrance.",
      "The name comes from the historic Ruby Hill Winery. John Crellin planted vineyards here in 1885 on a knoll of red clay soil and completed the winery in 1887. Today the community wraps around a private golf course designed by Jack Nicklaus, and vineyards and tasting rooms are a few minutes away.",
    ],
    facts: [
      { label: "City", value: "Pleasanton, CA" },
      { label: "County", value: "Alameda" },
      { label: "Developer", value: "Signature Properties (from 1992)" },
      { label: "Size", value: "About 850 home sites" },
      { label: "Access", value: "24-hour guarded gate" },
      { label: "Golf", value: "The Club at Ruby Hill (private, Jack Nicklaus design)" },
    ],
    sections: [
      {
        heading: "HOA versus club membership",
        paragraphs: [
          "Buyers sometimes assume a Ruby Hill home includes golf. It does not. The Ruby Hill homeowners association covers the gate, common areas and community amenities such as the community center, tennis courts, sports fields and trails. Membership in The Club at Ruby Hill is separate, with its own initiation and monthly dues.",
          "When we evaluate a home here, I get both the current HOA budget and, if you are interested, the club's current membership terms, so the full cost is clear before you commit.",
        ],
      },
      {
        heading: "Homes and setting",
        paragraphs: [
          "Most homes are large, semi-custom and custom single-family residences, many with golf course or vineyard views. Because the community was built out over many years by different builders and owners, age, style and condition vary widely, and pricing reflects lot position as much as square footage.",
          "Downtown Pleasanton's Main Street is a short drive west, and the Livermore Valley wineries along Vineyard Avenue are practically next door.",
        ],
      },
    ],
    schools: {
      district: "Pleasanton Unified School District (most of the community)",
      list: [
        "Most of Ruby Hill is within Pleasanton Unified",
        "Elementary students have commonly attended Vintage Hills and Valley View",
        "The far eastern section lies within the Livermore school district boundary",
      ],
      note: "Ruby Hill straddles a district line, and past arrangements have let students in the Livermore-district section attend Pleasanton schools. Confirm the current arrangement and assignment for a specific address with Pleasanton Unified and Livermore Valley Joint Unified.",
      locatorUrl: "https://www.pleasantonusd.net/",
    },
    fit: [
      "Buyers who want guarded-gate privacy and security",
      "Golfers and anyone who wants wine country at their doorstep",
      "Move-up buyers looking for larger custom homes in Pleasanton",
    ],
    lessIdeal: [
      "Buyers who want a walkable downtown lifestyle (look at downtown Pleasanton)",
      "BART commuters who need the shortest possible drive to the station",
    ],
    faq: [
      {
        q: "Is Ruby Hill a gated community?",
        a: "Yes. Ruby Hill in Pleasanton has a 24-hour privately guarded gated entrance.",
      },
      {
        q: "Does buying in Ruby Hill include a golf membership?",
        a: "No. HOA dues cover the gate, common areas and community amenities. Membership in The Club at Ruby Hill, the private Jack Nicklaus-designed golf club, is separate and has its own costs.",
      },
      {
        q: "What school district is Ruby Hill in?",
        a: "Most of Ruby Hill is in Pleasanton Unified. The far eastern section is within the Livermore district boundary, and past arrangements have allowed those students to attend Pleasanton schools. Verify current assignment with both districts.",
      },
      {
        q: "Where does the name Ruby Hill come from?",
        a: "From the historic Ruby Hill Winery. John Crellin planted vineyards on a knoll of red clay soil in 1885 and completed the winery in 1887.",
      },
    ],
    sources: [
      { label: "Pleasanton Weekly: Ruby Hill neighborhood profile (2007)", url: "https://www.pleasantonweekly.com/real-estate/2007/08/24/ruby-hill/" },
      { label: "Ruby Hill Winery: Our Story", url: "https://rubyhillwinery.net/Our-Story" },
    ],
  },

  {
    slug: "blackhawk",
    city: "danville",
    cityName: "Danville",
    name: "Blackhawk",
    zip: "94506",
    county: "Contra Costa County",
    seoTitle: "Blackhawk, Danville CA: Gated Community Home Guide",
    metaDescription:
      "A local realtor's guide to Blackhawk near Danville: gated golf community history, SRVUSD schools, HOA and country club basics, and who it fits best.",
    tagline: "The East Bay's best-known gated golf community, set against Mount Diablo.",
    updated: "2026-10-07",
    intro: [
      "Blackhawk is an unincorporated, gated planned community east of Danville in Contra Costa County, with a 2020 census population of 9,637. It sits in the foothills of Mount Diablo and carries a Danville mailing address, ZIP 94506.",
      "The land was Blackhawk Ranch, established in 1917. Developer Ken Behring bought it in 1975, the plan was scaled back to about 2,400 homes, and the first phase opened in 1979. More than 2,000 acres were set aside as open space, including land added to Mount Diablo State Park, which is a big part of why the setting still feels open today.",
    ],
    facts: [
      { label: "Mailing address", value: "Danville, CA 94506" },
      { label: "Status", value: "Unincorporated Contra Costa County (census-designated place)" },
      { label: "Population (2020)", value: "9,637" },
      { label: "Homes planned", value: "About 2,400" },
      { label: "Golf", value: "Two 18-hole courses at the private country club" },
      { label: "School district", value: "San Ramon Valley Unified (SRVUSD)" },
    ],
    sections: [
      {
        heading: "Unincorporated, gated and HOA-governed",
        paragraphs: [
          "Blackhawk is not part of the Town of Danville. County agencies provide municipal services, and the homeowners association plays a much larger role than in a typical neighborhood, governing architecture, landscaping and access. Before you buy, read the CC&Rs and HOA rules closely, especially if you plan to remodel.",
          "Like Ruby Hill, HOA dues and country club membership are separate. The country club, with its two 18-hole courses and clubhouses, has its own membership structure and costs.",
        ],
      },
      {
        heading: "Homes and daily life",
        paragraphs: [
          "Most homes are large single-family residences on generous lots, many on the golf courses or with Mount Diablo views, along with some townhomes and villas. Blackhawk Plaza, an outdoor center that opened in 1989, is home to the Blackhawk Museum and a movie theater, and downtown Danville's Hartz Avenue is about 15 minutes away.",
        ],
      },
    ],
    schools: {
      district: "San Ramon Valley Unified School District",
      list: [
        "Most students attend Tassajara Hills Elementary",
        "Diablo Vista Middle School",
        "Monte Vista High School",
      ],
      note: "Confirm the assignment for any specific address with SRVUSD.",
      locatorUrl: "https://www.srvusd.net/",
    },
    fit: [
      "Buyers who want gated privacy, open space and golf",
      "Move-up and luxury buyers who want SRVUSD schools",
    ],
    lessIdeal: [
      "Buyers who want to walk to shops and restaurants",
      "Anyone who wants fewer HOA rules on exterior changes",
    ],
    faq: [
      {
        q: "Is Blackhawk part of Danville?",
        a: "No. Blackhawk uses a Danville mailing address (ZIP 94506), but it is an unincorporated community in Contra Costa County, not part of the Town of Danville.",
      },
      {
        q: "What schools serve Blackhawk?",
        a: "Blackhawk is in San Ramon Valley Unified. Most students attend Tassajara Hills Elementary, Diablo Vista Middle and Monte Vista High. Verify for a specific address with SRVUSD.",
      },
      {
        q: "Is Blackhawk a gated community?",
        a: "Yes. Blackhawk is a gated planned community with a strong homeowners association. The private country club, with two 18-hole golf courses, has separate membership.",
      },
      {
        q: "When was Blackhawk built?",
        a: "Ken Behring bought Blackhawk Ranch in 1975, and the first phase of homes opened in 1979. The plan was scaled back to about 2,400 homes, with more than 2,000 acres preserved as open space.",
      },
    ],
    sources: [
      { label: "Blackhawk, California (Wikipedia)", url: "https://en.wikipedia.org/wiki/Blackhawk,_California" },
      { label: "Web4Homes: Blackhawk community profile", url: "https://www.web4homes.com/blackhawk" },
    ],
  },

  {
    slug: "mission-san-jose",
    city: "fremont",
    cityName: "Fremont",
    name: "Mission San Jose",
    zip: "94539",
    county: "Alameda County",
    seoTitle: "Mission San Jose, Fremont: Homes & Schools Guide",
    metaDescription:
      "A local realtor's guide to Mission San Jose in Fremont: history, Mission San Jose High and Hopkins schools, home styles, commutes and buying tips.",
    tagline: "Fremont's historic, school-driven district at the foot of Mission Peak.",
    updated: "2026-10-07",
    intro: [
      "Mission San Jose is one of the five original towns that merged in 1956 to form the City of Fremont. Its center is the historic Mission San José, founded in 1797 by Father Fermín de Lasuén on the site of the Ohlone village of Oroysom, and its eastern edge climbs toward Mission Peak.",
      "Today, most buyers come here for one reason: schools. Mission San Jose High School ranked 13th in California in the 2024 U.S. News rankings, and Hopkins Junior High is a California Distinguished School. That demand shows up in prices, which often run well above Fremont's citywide median.",
    ],
    facts: [
      { label: "City", value: "Fremont, CA 94539" },
      { label: "County", value: "Alameda" },
      { label: "Founded", value: "Mission established 1797; part of Fremont since 1956" },
      { label: "School district", value: "Fremont Unified (FUSD)" },
      { label: "Landmarks", value: "Mission San José, Mission Peak, Ohlone College" },
    ],
    sections: [
      {
        heading: "Homes and streets",
        paragraphs: [
          "Housing is mostly single-family: mid-century ranch homes on the flatter streets, plus larger hillside homes toward Mission Peak. Many original homes have been remodeled or rebuilt, so condition and finish level vary widely on the same block.",
          "Because school assignment drives so much of the value, the exact boundary matters. A home just outside the Mission San Jose High attendance area can sell for meaningfully less than a similar home inside it.",
        ],
      },
      {
        heading: "Commute and daily life",
        paragraphs: [
          "I-680 runs along the district, giving direct access south to San Jose and Silicon Valley employers. Fremont BART and the Warm Springs/South Fremont BART station are both a short drive away.",
          "The Mission San José church and museum anchor the historic core, Ohlone College sits a block away, and Mission Peak Regional Preserve offers some of the Bay Area's best-known hiking right from the neighborhood.",
        ],
      },
    ],
    schools: {
      district: "Fremont Unified School District",
      list: [
        "Mission San Jose High School (ranked 13th in California, U.S. News 2024)",
        "William Hopkins Junior High (2019 California Distinguished School)",
        "Several FUSD elementary schools feed this area; assignment depends on address",
      ],
      note: "FUSD attendance areas are address-specific and can change. Confirm the assignment with Fremont Unified before you write an offer.",
      locatorUrl: "https://www.fremontunified.org/",
    },
    fit: [
      "Families prioritizing Mission San Jose High and Hopkins",
      "Silicon Valley commuters who want an East Bay base",
      "Buyers who like established neighborhoods and hillside views",
    ],
    lessIdeal: [
      "Buyers looking for new construction (Warm Springs has more of it)",
      "Budget-focused buyers, since the school premium is significant",
    ],
    faq: [
      {
        q: "Is Mission San Jose its own city?",
        a: "No. Mission San Jose is a district of Fremont. It was one of five towns, along with Centerville, Niles, Irvington and Warm Springs, that merged to form Fremont in 1956.",
      },
      {
        q: "Why are Mission San Jose homes so expensive?",
        a: "Mostly schools. Mission San Jose High ranked 13th in California in the 2024 U.S. News rankings, and Hopkins Junior High is a California Distinguished School. Homes inside the attendance area command a premium.",
      },
      {
        q: "What ZIP code is Mission San Jose in?",
        a: "Mission San Jose is in Fremont's 94539 ZIP code, which also covers other parts of eastern Fremont.",
      },
      {
        q: "How do I confirm a home is in the Mission San Jose High boundary?",
        a: "Check the specific address with Fremont Unified's school locator, and ask for written confirmation if the decision depends on it. I verify this for every client before an offer.",
      },
    ],
    sources: [
      { label: "Fremont, California (Wikipedia)", url: "https://en.wikipedia.org/wiki/Fremont,_California" },
    ],
  },
];
