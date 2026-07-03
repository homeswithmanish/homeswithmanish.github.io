// City page content. Regenerate pages with: node tools/generate-pages.mjs
// Price bands intentionally match the ranges already published on the
// homepage FAQ; exact figures come from the live Zillow ZHVI feed at runtime.

export const CITIES = [
  {
    slug: "san-ramon",
    name: "San Ramon",
    emoji: "🌉",
    tagline: "Top schools, master-planned living, and Bishop Ranch careers",
    priceBand: "$1.5M–$1.8M",
    metaDescription:
      "Living in San Ramon, CA: home prices, San Ramon Valley Unified schools, Dougherty Valley neighborhoods, commute times, and buying tips from a local East Bay Realtor.",
    intro: [
      "San Ramon is the East Bay's flagship family market: a master-planned city anchored by the San Ramon Valley Unified School District, the Bishop Ranch business park, and City Center Bishop Ranch. Median single-family prices typically run in the $1.5M–$1.8M range, with newer Dougherty Valley homes commanding a premium.",
      "Buyers here are usually competing for two things — school boundaries and floor plans. Homes zoned for the most sought-after schools routinely draw multiple offers, so preparation and pricing strategy matter more in San Ramon than almost anywhere else in the Tri-Valley.",
    ],
    highlights: [
      { title: "Schools", text: "San Ramon Valley Unified consistently ranks among the top districts in California — the single biggest driver of demand." },
      { title: "Bishop Ranch", text: "One of Northern California's largest business parks, with City Center's dining and retail next door." },
      { title: "Master-planned", text: "Dougherty Valley, Windemere, and Gale Ranch offer newer construction, parks, and community amenities." },
      { title: "Commute", text: "I-680 corridor access, express buses to BART, and a central position between San Francisco and San Jose." },
    ],
    schools: {
      district: "San Ramon Valley Unified School District (SRVUSD)",
      blurb: "SRVUSD serves San Ramon, Danville, and Alamo and is consistently ranked among California's top public school districts. School boundaries can differ street by street — always verify a specific address before writing an offer.",
      notable: ["Dougherty Valley High School", "California High School", "Gale Ranch Middle School", "Windemere Ranch Middle School"],
    },
    commute: {
      blurb: "San Ramon sits on the I-680 corridor with no BART station of its own — most commuters drive to Dublin/Pleasanton or West Dublin BART, use express buses, or work locally at Bishop Ranch.",
      points: [
        "Dublin/Pleasanton BART: ~15 min drive, then ~40 min to downtown SF",
        "San Jose / Silicon Valley: ~45–60 min via I-680 South",
        "Oakland: ~35–45 min via I-680/CA-24",
        "Bishop Ranch: in-town employer with 30,000+ jobs",
      ],
    },
    neighborhoods: [
      { name: "Dougherty Valley / Windemere", blurb: "Newer master-planned homes (2000s+), top school access, HOA communities with parks and trails." },
      { name: "Gale Ranch", blurb: "Shapell-built neighborhoods popular with families targeting Gale Ranch Middle and Dougherty Valley High." },
      { name: "Twin Creeks & Old Ranch", blurb: "Established west-side neighborhoods with larger lots and quicker I-680 access." },
    ],
    investor: "San Ramon is an appreciation play, not a cash-flow play: gross yields are modest, but school-driven demand has kept long-term value growth among the strongest in the East Bay.",
    faq: [
      { q: "How much does a house cost in San Ramon?", a: "Median single-family home values typically range from $1.5M to $1.8M, with newer Dougherty Valley homes often higher. See the live market table on my homepage for the current Zillow ZHVI figure, updated monthly." },
      { q: "Are San Ramon schools really that good?", a: "San Ramon Valley Unified consistently ranks among California's top districts, and schools like Dougherty Valley High are a primary reason families relocate here. Boundaries vary by address, so verify zoning for any specific home." },
      { q: "Is San Ramon a good investment?", a: "For appreciation, yes — school demand supports long-term growth. For rental cash flow, gross yields are lower than Tracy or Livermore. The right choice depends on your strategy; I run the numbers on every deal." },
      { q: "How is the commute from San Ramon to San Francisco?", a: "Most commuters drive ~15 minutes to Dublin/Pleasanton BART and ride ~40 minutes to downtown SF, or take express buses. Door to door, plan on roughly an hour." },
    ],
    related: [
      { href: "/blog/san-ramon-home-prices-2026.html", label: "San Ramon Home Prices in 2026" },
      { href: "/blog/first-time-home-buyer-san-ramon.html", label: "First-Time Buyer Guide: San Ramon" },
      { href: "/blog/dublin-vs-san-ramon-for-families.html", label: "Dublin vs San Ramon for Families" },
    ],
  },
  {
    slug: "pleasanton",
    name: "Pleasanton",
    emoji: "🍇",
    tagline: "Historic downtown charm with top-5% schools",
    priceBand: "$1.6M–$2.1M",
    metaDescription:
      "Living in Pleasanton, CA: home prices, Pleasanton Unified schools, Ruby Hill and Vintage Hills neighborhoods, ACE train commute, and local buying advice.",
    intro: [
      "Pleasanton blends a genuinely walkable historic downtown with one of California's strongest school districts. Median single-family values often approach or exceed $2M, reflecting sustained demand from families and relocating tech professionals.",
      "Unlike newer master-planned neighbors, much of Pleasanton's housing stock is established — mature trees, larger lots, and neighborhoods with real character. Homes near downtown and in top school zones move fastest.",
    ],
    highlights: [
      { title: "Downtown", text: "Main Street's restaurants, farmers' market, and events give Pleasanton a small-town core few Bay Area suburbs can match." },
      { title: "Schools", text: "Pleasanton Unified performs in the top tier statewide, with Amador Valley and Foothill High both highly regarded." },
      { title: "Employers", text: "Hacienda Business Park hosts major employers; Workday and 10x Genomics are headquartered in town." },
      { title: "Transit", text: "Two nearby BART stations plus the ACE train make Pleasanton one of the best-connected Tri-Valley cities." },
    ],
    schools: {
      district: "Pleasanton Unified School District (PUSD)",
      blurb: "PUSD is consistently among the state's strongest districts, with excellent test scores across elementary through high school. The Amador Valley vs Foothill boundary is a common factor in home searches.",
      notable: ["Amador Valley High School", "Foothill High School", "Harvest Park Middle School", "Hart Middle School"],
    },
    commute: {
      blurb: "Pleasanton commuters have real options: BART from Dublin/Pleasanton or West Dublin stations, the ACE train from downtown to Silicon Valley, and the I-580/I-680 interchange.",
      points: [
        "Dublin/Pleasanton BART: ~40 min to downtown SF",
        "ACE train from downtown Pleasanton to San Jose (Silicon Valley)",
        "San Jose: ~40–55 min via I-680 South",
        "Hacienda Business Park: in-town employment center",
      ],
    },
    neighborhoods: [
      { name: "Ruby Hill", blurb: "Gated golf-course estates on the Livermore border — Pleasanton's luxury tier." },
      { name: "Vintage Hills & Kottinger Ranch", blurb: "Established east-side neighborhoods with larger lots, close to downtown." },
      { name: "Birdland & Val Vista", blurb: "Popular mid-range family neighborhoods with strong school access and park proximity." },
    ],
    investor: "Pleasanton behaves like San Ramon for investors: modest gross yields but durable, school-driven appreciation and deep buyer demand on resale.",
    faq: [
      { q: "How much does a house cost in Pleasanton?", a: "Median single-family values often approach or exceed $2M, among the highest in the Tri-Valley. The live market table on my homepage shows the current Zillow ZHVI figure." },
      { q: "Amador Valley or Foothill — does it matter for home values?", a: "Both are excellent high schools, and both zones command premiums. Specific boundaries matter more to individual buyers than to values overall — verify zoning per address." },
      { q: "Is Pleasanton walkable?", a: "Downtown Pleasanton is one of the most walkable town centers in the East Bay. Most residential neighborhoods are suburban in layout, but downtown-adjacent streets carry a premium for that walkability." },
      { q: "How does Pleasanton compare to San Ramon?", a: "Pleasanton offers a historic downtown and established neighborhoods; San Ramon offers newer master-planned housing stock. Schools are top-tier in both. Many of my clients tour both before deciding." },
    ],
    related: [
      { href: "/blog/best-neighborhoods-pleasanton.html", label: "Best Neighborhoods in Pleasanton" },
      { href: "/blog/how-to-buy-a-home-in-california.html", label: "How to Buy a Home in California" },
    ],
  },
  {
    slug: "danville",
    name: "Danville",
    emoji: "🏡",
    tagline: "The Tri-Valley's premier luxury market",
    priceBand: "$2M+",
    metaDescription:
      "Living in Danville, CA: luxury home prices, San Ramon Valley Unified schools, Blackhawk and Westside neighborhoods, and expert guidance for East Bay buyers.",
    intro: [
      "Danville is the Tri-Valley's luxury anchor: median single-family values typically exceed $2M, and estates in Blackhawk and on the Westside range well beyond. The draw is a combination of top-ranked SRVUSD schools, a charming walkable downtown, and larger lots than almost any neighboring city.",
      "Danville transactions often involve unique properties — view lots, custom builds, gated communities — where comps require real judgment. Pricing discipline matters on both sides of the deal here.",
    ],
    highlights: [
      { title: "Luxury stock", text: "Blackhawk's gated golf communities and Westside custom estates define East Bay luxury." },
      { title: "Downtown", text: "Hartz Avenue's boutiques and restaurants, plus year-round community events." },
      { title: "Schools", text: "Served by the same top-ranked SRVUSD district as San Ramon — Monte Vista and San Ramon Valley High are both standouts." },
      { title: "Outdoors", text: "Mount Diablo trailheads, Las Trampas ridgelines, and the Iron Horse Trail through town." },
    ],
    schools: {
      district: "San Ramon Valley Unified School District (SRVUSD)",
      blurb: "Danville shares SRVUSD with San Ramon and Alamo. Monte Vista High and San Ramon Valley High anchor two strong feeder patterns.",
      notable: ["Monte Vista High School", "San Ramon Valley High School", "Charlotte Wood Middle School", "Los Cerros Middle School"],
    },
    commute: {
      blurb: "Danville is an I-680 commute town — there's no BART station, and that relative seclusion is part of the appeal.",
      points: [
        "Walnut Creek BART: ~15–20 min drive north",
        "San Francisco: ~50–70 min door to door in commute hours",
        "San Jose: ~50–60 min via I-680 South",
        "Bishop Ranch (San Ramon): ~10 min",
      ],
    },
    neighborhoods: [
      { name: "Blackhawk", blurb: "Gated golf-course estates east of town — the East Bay's best-known luxury enclave." },
      { name: "Westside Danville", blurb: "Custom homes on larger lots near downtown and Las Trampas; top-dollar per square foot." },
      { name: "Sycamore / Greenbrook", blurb: "Established family neighborhoods with strong schools and HOA pools and greenbelts." },
    ],
    investor: "Danville is rarely a yield play. It suits buyers seeking long-term wealth preservation in a supply-constrained luxury market with enduring school-driven demand.",
    faq: [
      { q: "How much does a house cost in Danville?", a: "Median single-family values often exceed $2M, with Blackhawk and Westside estates ranging significantly higher. Live figures are on my homepage market table." },
      { q: "Is Blackhawk a good buy?", a: "Blackhawk offers gated golf-course living at prices that, per square foot, can compare favorably to smaller homes elsewhere in Danville. HOA costs and property specifics matter — I analyze each case individually." },
      { q: "What schools serve Danville?", a: "San Ramon Valley Unified — Monte Vista High and San Ramon Valley High are the two main high schools, both highly ranked statewide." },
      { q: "How is Danville's commute?", a: "It's an I-680 drive commute; Walnut Creek BART is about 15–20 minutes away. Many Danville buyers work hybrid schedules or at Bishop Ranch nearby." },
    ],
    related: [
      { href: "/blog/dublin-vs-san-ramon-for-families.html", label: "Dublin vs San Ramon for Families" },
      { href: "/blog/how-to-buy-a-home-in-california.html", label: "How to Buy a Home in California" },
    ],
  },
  {
    slug: "dublin",
    name: "Dublin",
    emoji: "☘️",
    tagline: "New construction, BART access, and rising schools",
    priceBand: "$1.4M–$1.7M",
    metaDescription:
      "Living in Dublin, CA: home prices, Dublin Unified schools, East Dublin new construction, BART commute times, and buying strategy from a local Realtor.",
    intro: [
      "Dublin is the Tri-Valley's growth story: two BART stations, the newest housing stock in the region, and a school district that has invested heavily alongside the city's expansion. Median single-family values typically run $1.5M–$1.8M, generally a step below San Ramon and Pleasanton.",
      "East Dublin communities like Jordan Ranch, Wallis Ranch, and Boulevard offer 2010s-and-newer homes that are hard to find elsewhere in the East Bay — a major draw for buyers who want modern floor plans without a renovation project.",
    ],
    highlights: [
      { title: "BART", text: "Dublin/Pleasanton and West Dublin stations make this the Tri-Valley's best transit-connected city." },
      { title: "New homes", text: "East Dublin's master-planned communities have the region's newest construction and amenities." },
      { title: "Schools", text: "Dublin Unified performs well and opened Emerald High — the district's second comprehensive high school — to serve growth." },
      { title: "Value", text: "Typically more attainable than San Ramon or Pleasanton while sharing the same job and lifestyle corridor." },
    ],
    schools: {
      district: "Dublin Unified School District (DUSD)",
      blurb: "DUSD has grown with the city, adding campuses including Emerald High School. Schools perform well, and East Dublin's newer campuses are a key draw for relocating families.",
      notable: ["Dublin High School", "Emerald High School", "Fallon Middle School", "Cottonwood Creek K-8"],
    },
    commute: {
      blurb: "Dublin sits at the I-580/I-680 interchange with two BART stations — the strongest commute profile in the Tri-Valley.",
      points: [
        "Dublin/Pleasanton BART: ~40 min to downtown SF",
        "West Dublin/Pleasanton BART: second in-town station",
        "Silicon Valley: ~45–60 min via I-680 South",
        "Livermore Lab / Hacienda: 10–20 min",
      ],
    },
    neighborhoods: [
      { name: "Jordan Ranch & Fallon Village", blurb: "Newer East Dublin communities near Fallon Sports Park and new school campuses." },
      { name: "Wallis Ranch & Boulevard", blurb: "The newest master-planned neighborhoods with modern amenities and community centers." },
      { name: "West Dublin", blurb: "Established 1960s–80s neighborhoods with larger lots and quick BART access." },
    ],
    investor: "Dublin balances appreciation and rentability better than most Tri-Valley cities: newer stock rents easily to tech tenants, and BART access supports long-term demand.",
    faq: [
      { q: "How much does a house cost in Dublin?", a: "Median single-family values typically range $1.5M–$1.8M — East Dublin new construction trends higher, West Dublin established homes lower. Live ZHVI figures are on my homepage." },
      { q: "Dublin or San Ramon — which is better for families?", a: "San Ramon's SRVUSD has the longer track record; Dublin offers newer homes, BART, and strong (and improving) schools at a somewhat lower price point. I wrote a full comparison — see the related articles below." },
      { q: "Is East Dublin or West Dublin better?", a: "East Dublin: newer homes, new schools, HOA amenities. West Dublin: larger lots, no/low HOA, faster BART access. It depends on what you're optimizing for." },
      { q: "Do Dublin homes have Mello-Roos?", a: "Many newer East Dublin communities carry community facilities district (CFD) assessments that raise the effective tax rate. I review the exact tax bill on every home my clients consider — try my property tax calculator for estimates." },
    ],
    related: [
      { href: "/blog/best-schools-in-dublin.html", label: "Best Schools in Dublin" },
      { href: "/blog/dublin-vs-san-ramon-for-families.html", label: "Dublin vs San Ramon for Families" },
    ],
  },
  {
    slug: "livermore",
    name: "Livermore",
    emoji: "🍷",
    tagline: "Wine country value on the Tri-Valley's east edge",
    priceBand: "$1.2M–$1.5M",
    metaDescription:
      "Living in Livermore, CA: home prices, Livermore Valley schools, wine country lifestyle, ACE train commute, and investment potential in the East Bay.",
    intro: [
      "Livermore delivers the Tri-Valley lifestyle at a meaningful discount: median single-family values typically run $1.2M–$1.5M, and buyers get a revitalized downtown, 50+ wineries, and a genuine sense of community.",
      "It's also a two-sided market — families upgrading within the Tri-Valley on one side, and investors chasing the area's better rental yields on the other. South Livermore near the vineyards commands the premium.",
    ],
    highlights: [
      { title: "Value", text: "Meaningfully more attainable than Pleasanton or San Ramon while staying inside the Tri-Valley." },
      { title: "Wine country", text: "50+ wineries in the Livermore Valley AVA, plus a lively renovated downtown." },
      { title: "Employers", text: "Lawrence Livermore and Sandia national labs anchor thousands of stable, high-paying jobs." },
      { title: "Yields", text: "Among the better gross rental yields in the Tri-Valley — a frequent pick for my investor clients." },
    ],
    schools: {
      district: "Livermore Valley Joint Unified School District (LVJUSD)",
      blurb: "LVJUSD performs solidly, with Granada and Livermore High anchoring two feeder patterns. School quality is strong relative to the price discount versus neighboring districts.",
      notable: ["Granada High School", "Livermore High School", "East Avenue Middle School", "Mendenhall Middle School"],
    },
    commute: {
      blurb: "Livermore is the eastern end of the Tri-Valley commute: ACE train service, I-580 access, and a short drive to BART.",
      points: [
        "ACE train from Vasco Rd / downtown to Silicon Valley",
        "Dublin/Pleasanton BART: ~20 min drive",
        "Lawrence Livermore & Sandia labs: in-town employers",
        "San Francisco: ~60–80 min door to door in commute hours",
      ],
    },
    neighborhoods: [
      { name: "South Livermore", blurb: "Vineyard-adjacent neighborhoods and newer homes — the city's premium tier." },
      { name: "Downtown / Old Livermore", blurb: "Walkable streets near the revitalized First Street core; character homes." },
      { name: "Springtown", blurb: "North-side value neighborhoods popular with first-time buyers and investors." },
    ],
    investor: "Livermore pairs Tri-Valley appreciation with gross yields that often beat San Ramon and Pleasanton — a practical middle path between cash flow and growth.",
    faq: [
      { q: "How much does a house cost in Livermore?", a: "Median single-family values typically range $1.2M–$1.5M — check my homepage market table for the live Zillow ZHVI figure." },
      { q: "Is Livermore a good place to invest?", a: "It offers some of the better gross yields in the Tri-Valley plus solid appreciation. Tracy yields more cash flow; San Ramon appreciates faster; Livermore sits usefully between." },
      { q: "How are Livermore schools?", a: "Livermore Valley Joint Unified performs solidly — not as high-ranked as SRVUSD or Pleasanton, but strong relative to the home-price discount, which is exactly the trade many families choose." },
      { q: "What's the Livermore commute like?", a: "ACE train to Silicon Valley, ~20 minutes to BART, and I-580 access. It's the longest Tri-Valley commute to SF, which is priced into homes here." },
    ],
    related: [
      { href: "/blog/how-to-buy-a-home-in-california.html", label: "How to Buy a Home in California" },
    ],
  },
  {
    slug: "fremont",
    name: "Fremont",
    emoji: "🌁",
    tagline: "Silicon Valley access with legendary Mission schools",
    priceBand: "$1.4M–$2M+",
    metaDescription:
      "Living in Fremont, CA: home prices by neighborhood, Mission San Jose schools, Tesla and Silicon Valley commutes, and expert buying guidance.",
    intro: [
      "Fremont is the East Bay's direct line to Silicon Valley: Tesla's factory, Warm Springs BART, and bridges to the Peninsula make it the shortest big-tech commute on this side of the Bay. Median values vary more by neighborhood than any other city I serve — Mission San Jose commands a large premium over the citywide range.",
      "For many buyers the decision is school-driven: Mission San Jose High's reputation pulls families from across the Bay Area, and homes in its boundary are priced accordingly.",
    ],
    highlights: [
      { title: "Mission schools", text: "Mission San Jose High is among the highest-performing public high schools in California." },
      { title: "Tech proximity", text: "Tesla in town; Google, Apple, and Meta reachable via I-880, Dumbarton, or BART." },
      { title: "BART", text: "Fremont and Warm Springs stations connect to the entire Bay Area network." },
      { title: "Diversity", text: "One of the most culturally diverse large cities in America, with food and festivals to match." },
    ],
    schools: {
      district: "Fremont Unified School District (FUSD)",
      blurb: "FUSD is large and varies by attendance area. The Mission San Jose feeder pattern is nationally known; American, Irvington, and Washington serve other strong neighborhoods.",
      notable: ["Mission San Jose High School", "American High School", "Irvington High School", "Hopkins Junior High"],
    },
    commute: {
      blurb: "Fremont has the South Bay's best East Bay commute: two BART stations, I-880, and the Dumbarton Bridge to the Peninsula.",
      points: [
        "Warm Springs / Fremont BART: network-wide access",
        "Tesla factory: in-town",
        "Google/Meta (Peninsula): ~30–50 min via Dumbarton",
        "San Jose: ~20–35 min via I-880",
      ],
    },
    neighborhoods: [
      { name: "Mission San Jose", blurb: "The school-premium district — median values here often exceed $2M." },
      { name: "Ardenwood", blurb: "Northwest Fremont, popular with Peninsula commuters using the Dumbarton Bridge." },
      { name: "Warm Springs", blurb: "Newer development around the BART station and innovation district." },
      { name: "Niles & Irvington", blurb: "Historic districts with character homes and walkable pockets." },
    ],
    investor: "Fremont rents strongly to tech tenants and appreciates on Silicon Valley's coattails. Yields are moderate; school-zone properties hold value best in downturns.",
    faq: [
      { q: "How much does a house cost in Fremont?", a: "Citywide medians typically run $1.4M–$1.6M, but Mission San Jose neighborhoods often exceed $2M. My homepage market table shows the live citywide ZHVI figure." },
      { q: "Why is Mission San Jose so expensive?", a: "The Mission San Jose school feeder pattern — anchored by one of California's top-performing high schools — draws sustained demand from families across the Bay Area." },
      { q: "Is Fremont better for Peninsula or South Bay commutes?", a: "Both work: Dumbarton Bridge serves Menlo Park/Palo Alto, I-880 serves San Jose, and BART covers the East Bay and SF. Ardenwood suits Peninsula commuters; Warm Springs suits South Bay." },
      { q: "Is Fremont in the Tri-Valley?", a: "No — Fremont is in southern Alameda County along I-880. I serve it alongside the Tri-Valley because many of my clients compare both when optimizing for schools and commutes." },
    ],
    related: [
      { href: "/blog/how-to-buy-a-home-in-california.html", label: "How to Buy a Home in California" },
    ],
  },
  {
    slug: "tracy",
    name: "Tracy",
    emoji: "🌾",
    tagline: "The East Bay corridor's most attainable homes",
    priceBand: "$650K–$750K",
    metaDescription:
      "Living in Tracy, CA: affordable home prices, new construction at Tracy Hills, ACE train commute, rental yields, and first-time buyer guidance.",
    intro: [
      "Tracy is where Bay Area homeownership math still works: median single-family values around $650K–$750K buy a house that would cost double or triple over the Altamont. That affordability makes Tracy the region's strongest first-time-buyer and cash-flow market.",
      "The trade is the commute — but the ACE train, growing local employment, and hybrid work have steadily shifted that equation in Tracy's favor.",
    ],
    highlights: [
      { title: "Affordability", text: "The most attainable single-family prices in the corridor — often half the Tri-Valley equivalent." },
      { title: "New construction", text: "Tracy Hills and Ellis are delivering new homes at prices impossible closer in." },
      { title: "Yields", text: "The highest gross rental yields among my 8 cities — the go-to market for cash-flow investors." },
      { title: "ACE train", text: "Direct rail from downtown Tracy toward the Tri-Valley and Silicon Valley." },
    ],
    schools: {
      district: "Tracy Unified School District (plus Jefferson School District in south Tracy)",
      blurb: "Tracy schools are improving alongside the city's growth; south Tracy's Jefferson district and newer campuses near Tracy Hills are popular with arriving families.",
      notable: ["Kimball High School", "West High School", "Jefferson School District (south Tracy)"],
    },
    commute: {
      blurb: "Tracy is a commuter city by design: ACE rail, I-205/I-580, and a fast-growing local logistics employment base.",
      points: [
        "ACE train from downtown Tracy to Pleasanton/Santa Clara",
        "Dublin/Pleasanton BART: ~35–45 min drive over the Altamont",
        "Local employment: distribution and logistics hubs in town",
        "San Jose: ~60–75 min in commute hours",
      ],
    },
    neighborhoods: [
      { name: "Tracy Hills", blurb: "The flagship new master-planned community in south Tracy — new construction with community amenities." },
      { name: "Ellis", blurb: "Newer south-side community with a small-town design ethos." },
      { name: "Central Tracy", blurb: "Established neighborhoods at the most accessible price points in the region." },
    ],
    investor: "Tracy is my highest-yield market: gross yields typically lead all 8 cities, tenant demand is steady, and entry prices allow diversification across multiple doors.",
    faq: [
      { q: "How much does a house cost in Tracy?", a: "Median single-family values typically run $650K–$750K — the most affordable entry point among the cities I serve. Live figures are on my homepage market table." },
      { q: "Is Tracy a good place for first-time buyers?", a: "It's the strongest first-time-buyer market in the corridor: attainable prices, new construction options, and FHA/conventional loan limits that actually cover the median home." },
      { q: "What rental yield can I expect in Tracy?", a: "Tracy typically posts the highest gross yields of my 8 cities — see the live rental yield table on my homepage, and I'll model any specific property's cash flow." },
      { q: "How bad is the Tracy commute really?", a: "Driving the Altamont at peak is tough — that's the honest trade. The ACE train, hybrid schedules, and growing local jobs are why many buyers make it work." },
    ],
    related: [
      { href: "/blog/first-time-home-buyer-san-ramon.html", label: "First-Time Buyer Guide (Tri-Valley)" },
      { href: "/blog/how-to-buy-a-home-in-california.html", label: "How to Buy a Home in California" },
    ],
  },
  {
    slug: "mountain-house",
    name: "Mountain House",
    emoji: "🏔️",
    tagline: "A brand-new city built for Bay Area families",
    priceBand: "$800K–$1M",
    metaDescription:
      "Living in Mountain House, CA: new-community home prices, Lammersville Unified schools, commute options, and why Bay Area families are moving here.",
    intro: [
      "Mountain House is the Bay Area corridor's newest city — a fully master-planned community that incorporated in 2024, where nearly every home, school, and park was built this century. Typical single-family prices sit under $1M, buying new construction that would cost far more anywhere in the Tri-Valley.",
      "The community was designed village by village, each with its own K-8 school at its center — a structure that has made Mountain House disproportionately popular with young families leaving denser Bay Area cities.",
    ],
    highlights: [
      { title: "Newest city", text: "Incorporated in 2024; virtually all housing stock built since the early 2000s." },
      { title: "Village schools", text: "Lammersville Unified puts a K-8 school at the heart of each village, plus Mountain House High." },
      { title: "New-home value", text: "Modern floor plans and energy-efficient construction under $1M." },
      { title: "Community", text: "Master-planned parks, trails, and a tight-knit, family-heavy demographic." },
    ],
    schools: {
      district: "Lammersville Joint Unified School District",
      blurb: "Each Mountain House village is anchored by its own K-8 campus, feeding Mountain House High School. The district's structure and performance are central to the community's appeal.",
      notable: ["Mountain House High School", "Village K-8 schools (one per village)"],
    },
    commute: {
      blurb: "Mountain House sits just west of Tracy with quicker access to I-580 and the Altamont than most of Tracy itself.",
      points: [
        "ACE train from nearby Tracy toward the Tri-Valley and Silicon Valley",
        "Dublin/Pleasanton BART: ~30–40 min drive",
        "I-580/I-205 junction: minutes away",
        "Tri-Valley employers: ~30–45 min",
      ],
    },
    neighborhoods: [
      { name: "The Villages", blurb: "Wicklund, Bethany, Altamont, Questa, Hansen, Cordes and newer villages — each with its own K-8 school and park network." },
      { name: "New releases", blurb: "Active builder communities continue releasing phases; buyer representation on new construction costs you nothing and protects you in negotiations." },
    ],
    investor: "Mountain House rents briskly to Bay Area commuter families, and CFD (Mello-Roos) assessments are the key underwriting detail — model the full tax load before committing.",
    faq: [
      { q: "How much does a house cost in Mountain House?", a: "Typical single-family prices run in the $800K–$1M range depending on village, size, and builder phase — new construction that would cost significantly more in the Tri-Valley." },
      { q: "Does Mountain House have Mello-Roos?", a: "Yes — community facilities district assessments raise the effective property tax rate meaningfully. Use my property tax calculator for an estimate and I'll pull the exact tax bill for any specific home." },
      { q: "How are Mountain House schools?", a: "Lammersville Unified anchors a K-8 school in each village and performs well; Mountain House High serves the whole community. Schools are the #1 reason families choose it." },
      { q: "Mountain House or Tracy?", a: "Mountain House: newer, master-planned, village schools, higher taxes (CFD). Tracy: lower entry prices, more housing variety, established downtown. I help buyers compare total monthly cost side by side." },
    ],
    related: [
      { href: "/blog/first-time-home-buyer-san-ramon.html", label: "First-Time Buyer Guide (Tri-Valley)" },
      { href: "/blog/how-to-buy-a-home-in-california.html", label: "How to Buy a Home in California" },
    ],
  },
];
