// Calculator page definitions. Regenerate with: node tools/generate-pages.mjs
// All figures are client-side estimates with disclaimers — no advice given.

const inputCss = `width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:1rem;box-sizing:border-box;font-family:inherit;`;
const labelCss = `display:block;font-size:.85rem;font-weight:600;color:var(--navy);margin-bottom:6px;`;

const field = (id, label, attrs) =>
  `<div><label for="${id}" style="${labelCss}">${label}</label><input id="${id}" style="${inputCss}" ${attrs}></div>`;
const selectField = (id, label, options) =>
  `<div><label for="${id}" style="${labelCss}">${label}</label><select id="${id}" style="${inputCss}">${options}</select></div>`;

export const CALCULATORS = [
  {
    slug: "affordability",
    title: "Home Affordability Calculator (East Bay Edition)",
    short: "How much house can I afford?",
    metaDescription:
      "Free home affordability calculator tuned for East Bay buyers. Estimate your maximum purchase price from income, debts, down payment, and today's rates.",
    intro: [
      "How much house can you actually afford in the East Bay? Lenders qualify you on debt-to-income (DTI) ratios — this calculator applies the same 28/36 framework (with a stretch scenario up to 43% back-end DTI) to translate your income into a realistic price range.",
      "In markets like San Ramon and Dublin where medians run well past $1.5M, knowing your true ceiling before you tour homes saves weeks of wasted searching — and prevents heartbreak offers.",
    ],
    formHtml: `
      ${field("aff-income", "Gross Annual Household Income", 'type="text" inputmode="numeric" placeholder="$250,000"')}
      ${field("aff-debts", "Monthly Debt Payments (cars, loans, cards)", 'type="text" inputmode="numeric" placeholder="$800"')}
      ${field("aff-down", "Down Payment Available", 'type="text" inputmode="numeric" placeholder="$300,000"')}
      ${field("aff-rate", "Interest Rate (%)", 'type="number" step="0.01" value="6.5"')}
      ${selectField("aff-term", "Loan Term", '<option value="30">30-Year Fixed</option><option value="15">15-Year Fixed</option>')}`,
    resultsHtml: `
      <div class="calc-result-row"><span>Conservative (28/36 DTI)</span><strong id="aff-conservative">—</strong></div>
      <div class="calc-result-row"><span>Stretch (up to 43% DTI)</span><strong id="aff-stretch">—</strong></div>
      <div class="calc-result-row"><span>Est. monthly payment at conservative price</span><strong id="aff-payment">—</strong></div>`,
    js: `
      function calc() {
        var income = num('aff-income'), debts = num('aff-debts'), down = num('aff-down');
        var rate = parseFloat(document.getElementById('aff-rate').value) || 6.5;
        var term = parseInt(document.getElementById('aff-term').value, 10);
        if (!income) return;
        var mIncome = income / 12;
        var taxInsRate = 0.0145 / 12; // ~1.1% tax + ~0.35% insurance annually
        function maxPrice(dtiCap) {
          // 28% front-end cap applies to the conservative scenario only;
          // the stretch scenario is governed by the back-end cap alone.
          var budget = dtiCap > 0.36
            ? Math.max(0, mIncome * dtiCap - debts)
            : Math.max(0, Math.min(mIncome * 0.28, mIncome * dtiCap - debts));
          var r = rate / 100 / 12, n = term * 12;
          var pmtPerDollar = r > 0 ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 1 / n;
          // budget covers P&I on (price - down) plus tax+ins on price
          var price = (budget + down * pmtPerDollar) / (pmtPerDollar + taxInsRate);
          return Math.max(0, price);
        }
        var cons = maxPrice(0.36), stretch = maxPrice(0.43);
        var r = rate / 100 / 12, n = term * 12;
        var pmtPerDollar = r > 0 ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 1 / n;
        var pay = Math.max(0, cons - down) * pmtPerDollar + cons * taxInsRate;
        set('aff-conservative', fmt(cons));
        set('aff-stretch', fmt(stretch));
        set('aff-payment', fmt(pay) + '/mo (PITI est.)');
        show();
      }`,
    methodology:
      "Conservative scenario caps housing costs at 28% of gross monthly income and total debts at 36%; the stretch scenario allows up to 43% back-end DTI (common for strong files). Payment estimates include principal, interest, ~1.1% property tax, and ~0.35% insurance. Actual qualification depends on credit, reserves, loan program, and lender overlays — get pre-approved for a real number.",
    faq: [
      { q: "What income do I need for a $1.5M house in the East Bay?", a: "As a rough rule with 20% down and mid-6% rates, plan on roughly $280K–$330K of household income under conservative DTI guidelines — less if you carry no debts or put more down. Run your own numbers above, then verify with a pre-approval." },
      { q: "What DTI do lenders actually allow?", a: "Conventional loans commonly allow up to ~43–50% back-end DTI with strong compensating factors, but qualifying at the maximum leaves no margin. I encourage clients to shop at their comfortable payment, not their maximum approval." },
      { q: "Does this calculator include HOA or Mello-Roos?", a: "No — those vary per property. In communities like East Dublin, Tracy Hills, or Mountain House, add HOA dues and CFD assessments to the payment estimate. I model exact carrying costs on any home you're considering." },
    ],
  },
  {
    slug: "buy-vs-rent",
    title: "Buy vs Rent Calculator for the East Bay",
    short: "Should I buy or keep renting?",
    metaDescription:
      "Buy vs rent calculator built for Bay Area price-to-rent ratios. Compare the true 5–10 year cost of owning vs renting in San Ramon, Dublin, Tracy and beyond.",
    intro: [
      "East Bay price-to-rent ratios typically run 25–35x annual rent — among the highest in the country — which means renting is often cheaper month to month, while buying builds equity and locks in your housing cost. The right answer depends almost entirely on how long you'll stay.",
      "This calculator compares the full cost of each path over your time horizon: rent growth on one side; mortgage interest, taxes, maintenance, selling costs, and price appreciation on the other.",
    ],
    formHtml: `
      ${field("bvr-rent", "Current / Comparable Monthly Rent", 'type="text" inputmode="numeric" placeholder="$4,200"')}
      ${field("bvr-price", "Home Purchase Price", 'type="text" inputmode="numeric" placeholder="$1,200,000"')}
      ${field("bvr-down", "Down Payment (%)", 'type="number" value="20" min="0" max="100"')}
      ${field("bvr-rate", "Interest Rate (%)", 'type="number" step="0.01" value="6.5"')}
      ${field("bvr-years", "Years You Plan to Stay", 'type="number" value="7" min="1" max="30"')}
      ${field("bvr-appr", "Annual Home Appreciation (%)", 'type="number" step="0.1" value="4"')}
      ${field("bvr-rentgrowth", "Annual Rent Increase (%)", 'type="number" step="0.1" value="3"')}`,
    resultsHtml: `
      <div class="calc-result-row"><span>Total cost of renting</span><strong id="bvr-rentcost">—</strong></div>
      <div class="calc-result-row"><span>Net cost of owning (after equity & sale)</span><strong id="bvr-owncost">—</strong></div>
      <div class="calc-result-row"><span>Verdict</span><strong id="bvr-verdict">—</strong></div>`,
    js: `
      function calc() {
        var rent = num('bvr-rent'), price = num('bvr-price');
        var downPct = (parseFloat(document.getElementById('bvr-down').value) || 20) / 100;
        var rate = (parseFloat(document.getElementById('bvr-rate').value) || 6.5) / 100;
        var years = parseInt(document.getElementById('bvr-years').value, 10) || 7;
        var appr = (parseFloat(document.getElementById('bvr-appr').value) || 4) / 100;
        var rg = (parseFloat(document.getElementById('bvr-rentgrowth').value) || 3) / 100;
        if (!rent || !price) return;
        var rentTotal = 0, m = rent;
        for (var y = 0; y < years; y++) { rentTotal += m * 12; m *= 1 + rg; }
        var down = price * downPct, loan = price - down;
        var r = rate / 12, n = 360;
        var pmt = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        var bal = loan;
        var interestPaid = 0;
        for (var i = 0; i < years * 12; i++) {
          var int = bal * r; interestPaid += int; bal -= (pmt - int);
        }
        var taxIns = price * 0.0145 * years;
        var maint = price * 0.01 * years;
        var futureValue = price * Math.pow(1 + appr, years);
        var sellingCosts = futureValue * 0.06;
        var equity = futureValue - bal - sellingCosts;
        var ownNet = (down + pmt * years * 12 + taxIns + maint) - equity;
        set('bvr-rentcost', fmt(rentTotal));
        set('bvr-owncost', fmt(ownNet));
        var diff = rentTotal - ownNet;
        set('bvr-verdict', diff > 0
          ? 'Buying comes out ahead by ~' + fmt(diff)
          : 'Renting comes out ahead by ~' + fmt(-diff));
        show();
      }`,
    methodology:
      "Owning costs include down payment, principal & interest (30-yr), ~1.1% property tax + ~0.35% insurance, and 1%/yr maintenance; the projected sale nets out remaining loan balance and 6% selling costs at your appreciation assumption. Renting compounds your rent at the growth rate you set. Simplifications: tax deductions, investment opportunity cost on the down payment, and PMI are excluded. Treat it as a framing tool, not a forecast.",
    faq: [
      { q: "How long do I need to stay for buying to win in the Bay Area?", a: "With typical East Bay price-to-rent ratios, buying usually needs a 5+ year horizon to overcome transaction costs — longer when appreciation is slow, shorter when rents are rising quickly. Run your own scenario above." },
      { q: "Why does the calculator ask about appreciation?", a: "Because it dominates the outcome. East Bay cities have historically appreciated strongly, but no rate is guaranteed — try conservative (2–3%) and historical (5–8%) scenarios to see the range." },
      { q: "Does renting ever make more sense?", a: "Absolutely — short time horizons, career uncertainty, or a market you may leave all favor renting. My job is honest math, not pushing a purchase." },
    ],
  },
  {
    slug: "closing-costs",
    title: "California Closing Cost Calculator (Buyer)",
    short: "What will I pay at closing?",
    metaDescription:
      "Estimate buyer closing costs in Alameda, Contra Costa, and San Joaquin counties: escrow, title, lender fees, and prepaids for East Bay home purchases.",
    intro: [
      "On top of your down payment, plan for closing costs of roughly 1.5%–2.5% of the purchase price for a financed East Bay purchase. This estimator itemizes the big categories — escrow, title insurance, lender fees, and prepaid taxes/insurance — using typical Northern California figures.",
      "Good news for buyers: in Alameda, Contra Costa, and San Joaquin counties, the county transfer tax ($1.10 per $1,000) is customarily paid by the seller. City transfer taxes are rare in the cities I serve.",
    ],
    formHtml: `
      ${field("cc-price", "Purchase Price", 'type="text" inputmode="numeric" placeholder="$1,200,000"')}
      ${field("cc-down", "Down Payment (%)", 'type="number" value="20" min="0" max="100"')}
      ${selectField("cc-financed", "Financing", '<option value="loan">Financed (mortgage)</option><option value="cash">All cash</option>')}`,
    resultsHtml: `
      <div class="calc-result-row"><span>Escrow & settlement fees</span><strong id="cc-escrow">—</strong></div>
      <div class="calc-result-row"><span>Title insurance (owner's + lender's)</span><strong id="cc-title">—</strong></div>
      <div class="calc-result-row"><span>Lender fees, appraisal & credit</span><strong id="cc-lender">—</strong></div>
      <div class="calc-result-row"><span>Prepaids (taxes, insurance, interest)</span><strong id="cc-prepaid">—</strong></div>
      <div class="calc-result-row"><span>Recording & misc</span><strong id="cc-misc">—</strong></div>
      <div class="calc-result-row calc-result-total"><span>Estimated total closing costs</span><strong id="cc-total">—</strong></div>`,
    js: `
      function calc() {
        var price = num('cc-price');
        var downPct = (parseFloat(document.getElementById('cc-down').value) || 20) / 100;
        var financed = document.getElementById('cc-financed').value === 'loan';
        if (!price) return;
        var loan = financed ? price * (1 - downPct) : 0;
        var escrow = 1500 + price * 0.001;
        var title = price * 0.0028 + (financed ? 450 : 0);
        var lender = financed ? 2200 + 750 : 0;
        var prepaidTax = price * 0.011 / 2;             // ~6 months impound
        var prepaidIns = price * 0.0035;                // year 1 premium
        var prepaidInt = financed ? loan * 0.065 / 365 * 15 : 0;
        var prepaid = prepaidTax + prepaidIns + prepaidInt;
        var misc = 350;
        var total = escrow + title + lender + prepaid + misc;
        set('cc-escrow', fmt(escrow)); set('cc-title', fmt(title));
        set('cc-lender', financed ? fmt(lender) : '$0 (cash)');
        set('cc-prepaid', fmt(prepaid)); set('cc-misc', fmt(misc));
        set('cc-total', fmt(total) + '  (~' + (total / price * 100).toFixed(1) + '% of price)');
        show();
      }`,
    methodology:
      "Estimates use typical Northern California pricing: escrow ≈ $1,500 base + $1/1,000; combined owner's + lender's title ≈ 0.28% of price; lender/appraisal/credit ≈ $2,950 on financed deals; prepaids assume ~6 months of property tax impounds, first-year insurance, and 15 days of interest. Actual fees vary by escrow/title company, lender, and closing date — your Loan Estimate and estimated settlement statement are the authoritative numbers.",
    faq: [
      { q: "Who pays transfer tax in Alameda and Contra Costa counties?", a: "By local custom the seller pays the $1.10/$1,000 county documentary transfer tax in Alameda, Contra Costa, and San Joaquin counties. It's negotiable in the contract, but seller-paid is the default expectation." },
      { q: "Can closing costs be rolled into my loan?", a: "On a purchase, generally no — but seller credits negotiated in the offer can cover some or all closing costs, and lender credits can trade a slightly higher rate for lower cash-to-close. Both are strategies I use regularly." },
      { q: "Why are prepaids so large?", a: "California semiannual property taxes plus a year of insurance get collected up front (especially with an impound account). It's not a fee — it's your own future expenses funded at closing." },
    ],
  },
  {
    slug: "property-tax",
    title: "California Property Tax Estimator (East Bay & Tracy)",
    short: "What will my property taxes be?",
    metaDescription:
      "Estimate property taxes for San Ramon, Dublin, Pleasanton, Tracy, Mountain House and more — including Mello-Roos/CFD assessments and the supplemental tax bill.",
    intro: [
      "California's Prop 13 caps the base property tax at 1% of assessed value plus local voter-approved bonds — typically landing between 1.1% and 1.3% in the cities I serve. The catch: newer communities often add Mello-Roos/CFD assessments on top, which can push effective rates toward 1.6%–2% in places like Mountain House, Tracy Hills, and parts of East Dublin.",
      "Buyers coming from older housing stock are often surprised by the difference. Estimate below, and remember the supplemental tax bill (explained under the calculator) that arrives in your first year.",
    ],
    formHtml: `
      ${field("pt-price", "Purchase Price", 'type="text" inputmode="numeric" placeholder="$1,200,000"')}
      ${selectField("pt-city", "City / Community", `
        <option value="1.14">San Ramon (established areas)</option>
        <option value="1.32">San Ramon — Dougherty Valley (with CFD)</option>
        <option value="1.13">Pleasanton</option>
        <option value="1.11">Danville</option>
        <option value="1.14">Dublin — West (established)</option>
        <option value="1.45">Dublin — East (newer, with CFD)</option>
        <option value="1.14">Livermore</option>
        <option value="1.16">Fremont</option>
        <option value="1.15">Tracy (established areas)</option>
        <option value="1.75">Tracy Hills (with CFD)</option>
        <option value="1.85">Mountain House (with CFD)</option>`)}`,
    resultsHtml: `
      <div class="calc-result-row"><span>Estimated effective rate</span><strong id="pt-rate">—</strong></div>
      <div class="calc-result-row"><span>Estimated annual property tax</span><strong id="pt-annual">—</strong></div>
      <div class="calc-result-row calc-result-total"><span>Monthly (for payment budgeting)</span><strong id="pt-monthly">—</strong></div>`,
    js: `
      function calc() {
        var price = num('pt-price');
        var rate = parseFloat(document.getElementById('pt-city').value) / 100;
        if (!price) return;
        var annual = price * rate;
        set('pt-rate', (rate * 100).toFixed(2) + '% of purchase price');
        set('pt-annual', fmt(annual));
        set('pt-monthly', fmt(annual / 12));
        show();
      }`,
    methodology:
      "Rates shown are typical effective rates (1% Prop 13 base + local bonds, plus representative CFD/Mello-Roos where noted) and vary parcel by parcel — two streets in the same city can differ meaningfully. Before you write an offer, I pull the actual tax bill and any special assessments for the specific parcel. Also budget for the one-time supplemental tax bill: the county reassesses at your purchase price and bills you for the difference from the seller's old assessed value, prorated for your first year — it arrives months after closing and is NOT paid by your impound account by default.",
    faq: [
      { q: "What is Mello-Roos and do I have to pay it?", a: "Mello-Roos (CFD) assessments fund infrastructure and schools in newer communities and are added to the regular tax bill, typically for 25–40 years. They're disclosed during escrow — and they're a key part of comparing a new home in Mountain House against an older one in Tracy." },
      { q: "What is the supplemental tax bill?", a: "After you buy, the county reassesses the home at your purchase price and sends a one-time catch-up bill for the difference from the seller's assessed value, prorated to your purchase date. First-year buyers should set aside funds for it." },
      { q: "Does Prop 19 affect me?", a: "Prop 19 mainly affects transfers between family members and lets eligible homeowners 55+ carry their low assessed value to a new California home. If either applies to you, talk to a tax professional — the savings can be substantial." },
    ],
  },
  {
    slug: "down-payment",
    title: "Down Payment Planner",
    short: "How long until I can buy?",
    metaDescription:
      "Plan your down payment for an East Bay home: savings timeline, closing-cost cushion, and PMI trade-offs for buying with less than 20% down.",
    intro: [
      "The down payment is the biggest hurdle for most East Bay buyers — but 20% is a benchmark, not a rule. Conventional loans start at 3–5% down, and buying with PMI sooner is sometimes cheaper than renting while you save toward a rising target.",
      "This planner turns your target home price and monthly savings into a concrete timeline, including the closing-cost cushion buyers often forget.",
    ],
    formHtml: `
      ${field("dp-price", "Target Home Price", 'type="text" inputmode="numeric" placeholder="$1,000,000"')}
      ${field("dp-pct", "Target Down Payment (%)", 'type="number" value="20" min="3" max="100"')}
      ${field("dp-saved", "Current Savings for the Purchase", 'type="text" inputmode="numeric" placeholder="$120,000"')}
      ${field("dp-monthly", "Monthly Savings Going Forward", 'type="text" inputmode="numeric" placeholder="$4,000"')}`,
    resultsHtml: `
      <div class="calc-result-row"><span>Down payment needed</span><strong id="dp-need">—</strong></div>
      <div class="calc-result-row"><span>+ Closing cost cushion (~2%)</span><strong id="dp-cc">—</strong></div>
      <div class="calc-result-row"><span>Remaining to save</span><strong id="dp-gap">—</strong></div>
      <div class="calc-result-row calc-result-total"><span>Time to goal</span><strong id="dp-time">—</strong></div>`,
    js: `
      function calc() {
        var price = num('dp-price'), saved = num('dp-saved'), monthly = num('dp-monthly');
        var pct = (parseFloat(document.getElementById('dp-pct').value) || 20) / 100;
        if (!price) return;
        var need = price * pct, cushion = price * 0.02;
        var gap = Math.max(0, need + cushion - saved);
        set('dp-need', fmt(need) + ' (' + (pct * 100).toFixed(0) + '%)');
        set('dp-cc', fmt(cushion));
        set('dp-gap', fmt(gap));
        if (gap === 0) { set('dp-time', 'You\\u2019re ready now \\u2014 let\\u2019s talk strategy'); }
        else if (!monthly) { set('dp-time', 'Enter monthly savings to see a timeline'); }
        else {
          var months = Math.ceil(gap / monthly);
          var yrs = Math.floor(months / 12), mos = months % 12;
          set('dp-time', (yrs ? yrs + ' yr ' : '') + mos + ' mo of saving');
        }
        show();
      }`,
    methodology:
      "The plan targets your chosen down payment plus a ~2% closing-cost cushion. It doesn't model home-price appreciation working against you while you save, investment returns on your savings, or PMI trade-offs of buying sooner with less down — all three are worth a real conversation, because in appreciating markets waiting to reach 20% can cost more than PMI would.",
    faq: [
      { q: "Do I really need 20% down in the Bay Area?", a: "No. Conventional loans allow as little as 3–5% down (with PMI), and strong buyers win offers at 10% down regularly. 20% avoids PMI and strengthens offers, but waiting years to reach it in an appreciating market has its own cost." },
      { q: "What about jumbo loans?", a: "Most Tri-Valley purchases exceed conforming limits and use jumbo financing, which typically wants 10–20% down and stronger reserves. Tracy and Mountain House often fit within conforming/high-balance limits — one reason first-time buyers start there." },
      { q: "Can I use gift funds or RSUs?", a: "Gift funds from family are broadly allowed with documentation, and lenders increasingly count vested RSU income for tech buyers. Both need to be papered correctly — connect with a lender early (I can introduce you)." },
    ],
  },
];
