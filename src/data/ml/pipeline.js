import { bl, blSame } from '../../lib/mlContent.js';

// Module 2 Learning Design System retrofit (docs/research/ML-Mode-Pedagogy-Research.md
// §4.1) — one Depth Ladder per stage, appended to PIPELINE_STAGES below.
// `stageName` translates the stage label itself (found still hardcoded
// English during this retrofit — a pre-existing Module-11-style gap, fixed
// here rather than left for a future sweep). Mechanism widgets use a small,
// stage-specific compute() rather than a generic filler animation.

// Module 11 audit (see gold.js's identical note in domains/).
export const PIPELINE_TITLE = blSame('The ML Pipeline: From Data to Decision');
export const PIPELINE_INTRO = blSame(
  'Every ML system moves through the same seven stages — click any stage to see what happens there, worked through with gold price forecasting as a running example (previewing Module 6).'
);
export const PIPELINE_WHAT_LBL = blSame('What happens');
export const PIPELINE_GOLD_LBL = blSame('Gold worked example');

// Source: docs/research/ML-Research-Reference.md §1. The Gold worked example
// threads through every stage so this module previews Module 6 (research
// doc's own design note §7.3: "Gold is the strongest flagship domain").
export const PIPELINE_STAGES = [
  {
    id: 'framing',
    n: 1,
    stage: 'Problem framing',
    stageName: blSame('Problem framing'),
    spark: {
      analogy: bl(
        'Before a doctor orders a single test, they first decide what kind of question they\'re even answering — "is this a number to track" (blood pressure) or "is this a category to diagnose" (infected / not infected)? Get that wrong and every test afterward is aimed at the wrong target.',
        'Problem framing is choosing the output type before choosing anything else: a continuous number (regression), a category (classification), or a sequence over time (forecasting) — this single choice constrains every model in Module 3 to a compatible subset.'
      ),
      predict: {
        question: bl(
          'A learner wants to predict "will tomorrow\'s gold price be higher or lower than today\'s?" — a yes/no answer, not a dollar figure. What kind of ML problem is this?',
          'A learner wants to predict "will tomorrow\'s gold price be higher or lower than today\'s?" — a yes/no answer, not a dollar figure. What kind of ML problem is this?'
        ),
        options: [
          bl('Regression', 'Regression'),
          bl('Classification', 'Classification'),
          bl('Forecasting', 'Forecasting'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag toward "changes constantly," will the best framing move toward forecasting or toward a rare-event classifier?'),
        options: [blSame('Toward forecasting'), blSame('Toward rare-event classification')],
        correctIndex: 0,
      },
      paramLabel: blSame('How often does the target value change?'),
      paramMin: 0, paramMax: 10, paramDefault: 5, paramStep: 1, paramDecimals: 0,
      compute: (v) => (v <= 2 ? 0 : v <= 7 ? 1 : 2),
      outputLabel: blSame('Best framing (0=rare event, 5=daily, 10=continuous tick)'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'Worked example: is "gold spot price" regression, classification, or forecasting? Step 1 — what does the output look like? A number like $4,015.20, not a label. Step 2 — is it time-indexed (does yesterday\'s value help predict today\'s)? Yes, prices are serially correlated. Step 3 — conclusion: it\'s framed as time-series regression (forecasting), which is why Module 6 uses ARIMA/LSTM/XGBoost/GARCH — all regression-capable, time-aware models — and not a plain classifier.',
        'Formally: target y_t ∈ ℝ (continuous), indexed by t (time), with autocorrelation Cov(y_t, y_{t-1}) ≠ 0. This rules out unordered classification (no meaningful "categories" for a continuous price) and argues for models that either explicitly model time (ARIMA, LSTM) or at minimum respect chronological train/test splits (Module 5\'s walk-forward validation).'
      ),
      faded: bl(
        'Now you try: is "will the Fed cut rates at the next meeting — yes or no?" regression, classification, or forecasting? Step 1 — the output is one of two labels. Step 2 — _____. Step 3 — conclusion: _____.',
        'Now you try: is "will the Fed cut rates at the next meeting — yes or no?" regression, classification, or forecasting? Output is binary. Fill in: is there a meaningful "amount" being predicted, or just a category? Conclusion: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The doctor analogy breaks down here: a doctor can sometimes order both a number-test and a category-test for the same patient. In ML, one target usually gets one framing — you don't half-frame a problem, because the model families available downstream genuinely differ by framing."
      ),
      caveat: blSame(
        'A real caveat: some problems are legitimately reframable — "will gold rise more than 2%" can be built as either a regression (predict the % change, then threshold it) or a classification (predict yes/no directly). Which is better is itself a design decision, not a fixed fact about the problem.'
      ),
      retrieval: {
        question: blSame(
          'Without looking back: why does "gold price is a number that changes daily" rule out treating it as a classification problem?'
        ),
        answer: blSame(
          "Classification needs discrete, unordered (or at least finite) categories to sort into. A continuous, ever-changing price has no natural finite category set — you'd have to artificially bucket it, throwing away precision the regression framing keeps."
        ),
      },
    },
    question: bl(
      'What kind of answer am I even trying to produce?',
      'What kind of answer am I trying to produce — regression, classification, or forecasting?'
    ),
    what: bl(
      'Decide up front what shape the output needs: a number (regression), a category (classification), or a sequence of future values (forecasting).',
      'Decide regression (continuous number), classification (category), or forecasting (sequential, time-indexed) before touching data — this choice determines every downstream step, including which models in Module 3 are even candidates.'
    ),
    goldExample: bl(
      'Gold price is a number that changes every day → this is a regression/forecasting problem, not classification.',
      'Gold spot price is a continuous, time-indexed target → framed as a time-series regression (forecasting) problem, ruling out classification-only models like plain Naive Bayes.'
    ),
  },
  {
    id: 'collection',
    n: 2,
    stage: 'Data collection',
    stageName: blSame('Data collection'),
    spark: {
      analogy: bl(
        'A restaurant\'s menu is only as good as its supply chain — someone has to decide which farms to buy from, negotiate contracts, and physically get ingredients to the kitchen before any cooking can start. A model is the same: someone has to decide which data sources to trust and build the pipeline that pulls them in, before any "learning" can happen.',
        'Data collection is the engineering step that determines the evidence ceiling for every stage after it — an engineer designs and builds the specific pipeline (API calls, database queries, scraped sources) that will feed the model, source by source.'
      ),
      predict: {
        question: bl(
          'A gold-forecasting model needs central-bank gold-purchase data. Where does that data come from?',
          'A gold-forecasting model needs central-bank gold-purchase data. Where does that data come from?'
        ),
        options: [
          blSame('The model detects it needs this data and fetches it itself'),
          blSame('An engineer specifically chose the World Gold Council as a source and built a pipeline to pull its reports'),
          blSame('It comes bundled automatically with any ML library'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag missing/messy data upward, does the quality ceiling on every later stage go up or down?'),
        options: [blSame('Goes up'), blSame('Goes down')],
        correctIndex: 1,
      },
      paramLabel: blSame('% of raw data with missing/messy values'),
      paramMin: 0, paramMax: 60, paramDefault: 10, paramStep: 5, paramDecimals: 0,
      compute: (v) => Math.max(20, 100 - v * 1.3),
      outputLabel: blSame('Ceiling on every later stage\'s quality (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Worked example: Module 6\'s five Gold drivers each needed their own source decided by hand. Step 1 — real yields: TIPS market data (a specific bond-market feed). Step 2 — DXY: a currency-index provider. Step 3 — central-bank demand: the World Gold Council\'s quarterly reports specifically, not a generic "gold data" API. Step 4 — geopolitical risk: news/event feeds. Every one of these was a deliberate choice, not something the model discovered on its own.',
        'Five source types for five drivers, each chosen for a documented reason: real yields (TIPS) for the single most-cited driver, DXY for dollar-pricing exposure, Fed statements for policy path, WGC reports specifically because they\'re the authoritative central-bank purchase source, geopolitical/news feeds for the risk index. None of this routing exists without a human decision behind it.'
      ),
      faded: bl(
        'Now you try: an election-forecasting model needs polling data and news sentiment. Step 1 — polls: which kind of organization would you specifically choose as a source, and why that one over a random blog? Step 2 — news sentiment: _____. Step 3 — conclusion about who decided this routing: _____.',
        'Now you try: name a specific, credible source type for election polling data and one for news sentiment, then state explicitly who made that choice (hint: it wasn\'t the model).'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'autonomousDataAcquisition',
      analogyBreakdown: blSame(
        "The supply-chain analogy breaks down in one place: a restaurant's supply chain can adapt week to week as a chef notices a new need. An ML data pipeline is far more rigid — adding a new source means an engineer has to go build a new connector, not just \"decide\" to use it."
      ),
      caveat: blSame(
        "A real caveat: some modern systems do include automated data-refresh schedulers that re-pull from already-configured sources on a timer. That's still not the model \"deciding\" anything — it's a human-built cron job hitting human-chosen endpoints, indistinguishable in kind from a person manually re-running the same pull."
      ),
      retrieval: {
        question: blSame(
          'Without looking back: if a model "notices" its accuracy is dropping because a new economic indicator became available, what actually has to happen for that indicator to be added to the pipeline?'
        ),
        answer: blSame(
          "A human has to notice the accuracy drop (probably via Module 5's monitoring stage), investigate why, decide the new indicator is worth adding, and then engineer a new data connector for it. The model itself has no mechanism to request, discover, or pull in new sources on its own."
        ),
      },
    },
    question: bl(
      'What evidence do I actually have?',
      'What evidence do I have, and from which sources?'
    ),
    what: bl(
      'Pull raw numbers from wherever they live: government statistics agencies, market data feeds, polling aggregators, news archives.',
      'Pull from APIs, databases, scraped sources, statistical agencies (FRED, IMF, World Gold Council, polling aggregators) — the quality ceiling of every later stage is set here.'
    ),
    goldExample: bl(
      'Pull real yields and DXY from market data, central-bank gold purchase reports from the World Gold Council, and geopolitical event feeds.',
      'Real yields (TIPS), DXY, Fed policy statements, World Gold Council central-bank purchase reports, geopolitical event/news feeds — five distinct source types for five drivers (Module 6).'
    ),
  },
  {
    id: 'preparation',
    n: 3,
    stage: 'Data preparation',
    stageName: blSame('Data preparation'),
    spark: {
      analogy: bl(
        'Imagine trying to compare two runners\' speeds when one\'s time was recorded in minutes and the other\'s in seconds — you\'d get a nonsense answer unless you converted both to the same unit first. Raw data from different sources is exactly this messy before preparation: different frequencies, different scales, gaps where a reading was missed.',
        'Data preparation aligns frequencies, fills or flags gaps, and rescales inputs so a model sees comparable numbers, not artifacts of how each source happened to record its data.'
      ),
      predict: {
        question: bl(
          "Gold trades every business day; central-bank purchase data arrives once a quarter. Feeding both into a model unaligned — what happens?",
          "Gold trades every business day; central-bank purchase data arrives once a quarter. Feeding both into a model unaligned — what happens?"
        ),
        options: [
          blSame('Nothing — models automatically handle any mismatched frequency'),
          blSame('The model breaks, or silently learns a distorted, mostly-missing-data version of the quarterly driver'),
          blSame('The quarterly data automatically becomes daily on its own'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag the frequency mismatch wider, does the % of usable joined rows rise or fall?'),
        options: [blSame('Rises'), blSame('Falls')],
        correctIndex: 1,
      },
      paramLabel: blSame('Frequency mismatch left unaligned (days between readings)'),
      paramMin: 1, paramMax: 90, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.max(5, 100 - v * 1.1),
      outputLabel: blSame('% of rows a naive join keeps usable'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Worked example: aligning daily gold price with quarterly central-bank demand. Step 1 — pick an alignment rule: forward-fill (repeat the last known quarterly value for every day until the next report). Step 2 — apply it: Q1\'s reported 16-ton figure gets attached to every daily gold-price row from Jan through March. Step 3 — result: one row per trading day, every row now has both a price and a (repeated but legitimate) demand figure — ready for a model.',
        'Forward-fill is one valid alignment strategy among several (interpolation, aggregation-to-lower-frequency are others); the choice matters because forward-filling assumes the quarterly value stays informative for the whole quarter, which is reasonable for a slow-moving structural driver like central-bank demand but would be a poor choice for a fast-moving one.'
      ),
      faded: bl(
        'Now you try: a GDP nowcasting model has to align daily market signals with quarterly GDP. Step 1 — which alignment direction makes more sense here — forward-filling the slow quarterly GDP across days, or aggregating the fast daily signals down to quarterly? Step 2 — why: _____. Step 3 — what\'s lost either way: _____.',
        'Now you try: for nowcasting specifically (estimating the current quarter before it\'s reported), which alignment direction better serves the actual goal, and why?'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The unit-conversion analogy is almost too clean: converting minutes to seconds is lossless and has one obviously correct answer. Aligning mismatched-frequency data is lossy — forward-filling genuinely discards information (you don't actually know demand changed smoothly through the quarter), it's just the least-bad option available."
      ),
      caveat: blSame(
        "A real caveat: there's no universally correct alignment choice — it depends on which driver moves faster and which questions the model needs to answer. Getting this wrong is a common, silent source of leaked-future-information bugs that are much harder to spot than an outright crash."
      ),
      retrieval: {
        question: blSame(
          "Without looking back: why is forward-filling a slow quarterly figure across many days a reasonable choice, but forward-filling a fast-moving daily figure across a whole quarter wouldn't be?"
        ),
        answer: blSame(
          "Forward-filling assumes the value stays roughly informative for the whole gap. That's a reasonable assumption for a driver that genuinely moves slowly (central-bank demand doesn't swing day to day). It's a bad assumption for a fast-moving driver — you'd be pretending a stale snapshot is still accurate long after it's gone out of date."
        ),
      },
    },
    question: bl(
      'Is the evidence actually usable yet?',
      'Is the evidence usable — cleaned, aligned, and scaled?'
    ),
    what: bl(
      'Clean up gaps and weird outliers, and line up data that arrives on different schedules — daily prices next to quarterly GDP, for example.',
      'Clean missing values/outliers, align frequencies (daily price vs. quarterly GDP), normalize/scale — mismatched frequency is the single most common silent bug in a nowcasting pipeline (Module 7).'
    ),
    goldExample: bl(
      'Gold trades daily but central-bank purchase data only arrives quarterly — these need to be aligned before they can sit in the same model.',
      'Daily gold price vs. quarterly WGC central-bank demand figures — a frequency mismatch resolved by forward-filling or aggregating, exactly the kind of alignment problem Module 7\'s nowcasting "information gap" generalizes.'
    ),
  },
  {
    id: 'features',
    n: 4,
    stage: 'Feature engineering',
    stageName: blSame('Feature engineering'),
    spark: {
      analogy: bl(
        "A weather forecaster doesn't just look at today's temperature — they look at how fast it's been dropping, the pressure trend, the gap between coastal and inland readings. Those derived signals, not the raw thermometer reading alone, are what actually predicts tomorrow. Feature engineering is building those derived signals for a model.",
        'Feature engineering builds new columns — lags, rolling averages, spreads, sentiment scores — that make an existing pattern easier for a model to detect than the raw data alone would.'
      ),
      predict: {
        question: bl(
          "You add a \"real-yield 30-day moving average\" feature to a model that already has raw daily real yields. Does this always improve the model?",
          "You add a \"real-yield 30-day moving average\" feature to a model that already has raw daily real yields. Does this always improve the model?"
        ),
        options: [
          blSame('Yes, always — more features are always better'),
          blSame('Not necessarily — it can help if the trend matters more than the daily noise, but can also add redundant noise if the model already captures that trend another way'),
          blSame('No, adding any feature always hurts accuracy'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('Starting from a 1-day window and dragging toward 30 days, does the toy correlation shown rise or fall at first?'),
        options: [blSame('Rises toward 30 days, then falls past it'), blSame('Only ever falls')],
        correctIndex: 0,
      },
      paramLabel: blSame('Rolling-average window (days)'),
      paramMin: 1, paramMax: 90, paramDefault: 30, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.max(0.1, 0.85 - Math.abs(v - 30) * 0.012),
      outputLabel: blSame('Toy correlation with the target (illustrative)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Worked example: turning raw daily real-yield readings into a usable feature. Step 1 — raw signal: real_yield_t (noisy day to day). Step 2 — engineer: real_yield_MA30_t = average of real_yield over the last 30 days, smoothing out day-to-day noise while keeping the trend. Step 3 — result: the model sees a feature that tracks the same underlying driver more cleanly, which is exactly the smoothed slider input this stage\'s Mechanism widget lets you feel directly.',
        'The general pattern: raw_t → f(raw_{t-k}, ..., raw_t) for some window k and function f (mean, sum, delta, z-score). Choosing k is itself a hyperparameter — too short and you keep the noise you were trying to smooth away, too long and you blur real regime changes into invisibility.'
      ),
      faded: bl(
        'Now you try: a retail demand model could add a "price 7-day change" feature to help predict demand. Step 1 — raw signal: price_t. Step 2 — engineer: price_delta7_t = _____. Step 3 — why this specific feature might help capture demand: _____.',
        'Now you try: define a "7-day price change" feature formally, then explain why a demand model might specifically benefit from a *change* feature rather than just the raw price level.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The forecaster analogy breaks down on scale: a human forecaster can invent a clever new derived signal on the spot, mid-thought. A model can only ever see the features an engineer explicitly built beforehand — it can't reach back and engineer a new one for itself, no matter how useful one would be."
      ),
      caveat: blSame(
        "A real caveat: some modern deep-learning models (like the LSTM/Transformer family in Module 3) do automatically learn internal representations that function somewhat like engineered features — but this happens inside the model during estimation, from data an engineer still had to collect and prepare first. It's not the same as autonomous feature invention from nothing."
      ),
      retrieval: {
        question: blSame(
          "Without looking back: why can a longer smoothing window blur away a real regime change, and not just noise?"
        ),
        answer: blSame(
          "A moving average can't distinguish 'temporary noisy blip' from 'the value genuinely and permanently shifted' — it treats every point in its window equally. A long window keeps averaging in pre-shift values long after a real regime change, delaying and understating how much things actually moved."
        ),
      },
    },
    question: bl(
      'What signals might actually explain the target?',
      'What signals might explain the target — lags, rolling averages, spreads, sentiment?'
    ),
    what: bl(
      'Build new columns from the raw data that make patterns easier for a model to see: yesterday\'s value, a 30-day average, the gap between two related rates.',
      'Build lags, rolling averages, technical indicators, macro spreads, sentiment scores. For time series specifically, this stage also requires no shuffling — splits must respect chronological order (walk-forward backtesting, Module 5).'
    ),
    goldExample: bl(
      'Build the real-yield 30-day moving average, the month-over-month change in DXY, and a rolling geopolitical-risk score.',
      'Real-yield MA(30), DXY month-over-month delta, lagged central-bank purchase volume, rolling geopolitical-risk index — the geopolitical-risk feature alone contributed a measured ~19% accuracy improvement in one cited study.'
    ),
  },
  {
    id: 'estimation',
    n: 5,
    stage: 'Estimation (training/fitting)',
    stageName: blSame('Estimation (training/fitting)'),
    spark: {
      analogy: bl(
        "A tailor doesn't cut a suit from a fixed formula — they take your specific measurements and adjust the pattern until it fits you. Estimation is that fitting process for a model: the model's shape (linear? tree-based?) is chosen ahead of time, but its exact numbers get tailored to the specific historical data it's shown.",
        "Estimation is the process by which a model's internal parameters get set from historical data — via OLS, maximum likelihood, gradient descent, or Bayesian posterior sampling depending on the model family."
      ),
      predict: {
        question: bl(
          "Someone claims: \"a data scientist writes out the exact rule the gold-price model will use, line by line, before it ever sees data.\" Is this how estimation actually works?",
          "Someone claims: \"a data scientist writes out the exact rule the gold-price model will use, line by line, before it ever sees data.\" Is this how estimation actually works?"
        ),
        options: [
          blSame('Yes — every coefficient is hand-typed by a person'),
          blSame('No — a person chooses the model shape, but the algorithm searches for the specific numbers from data'),
          blSame('No model ever has any fixed structure at all'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag more years of training data in, does parameter stability rise or fall?'),
        options: [blSame('Rises'), blSame('Falls')],
        correctIndex: 0,
      },
      paramLabel: blSame('Years of historical training data'),
      paramMin: 1, paramMax: 15, paramDefault: 3, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.min(0.97, 1 - 1.4 / (v + 1.5)),
      outputLabel: blSame('Toy parameter stability (1.0 = fully settled)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Worked example: fitting a simple linear relationship between real yields and gold price on 3 illustrative data points: (yield=-1, price=4100), (yield=0, price=4015), (yield=1, price=3920). Step 1 — OLS finds the line minimizing squared error: price ≈ 4015 − 90×yield. Step 2 — that "−90" is the estimated coefficient — nobody typed −90, the algorithm found it by minimizing prediction error across exactly these three points. Step 3 — this is the literal number Module 6\'s trace panel would show as this driver\'s contribution.',
        'OLS minimizes Σ(y_i − ŷ_i)² over choices of β₀, β₁ in ŷ = β₀ + β₁x. For the three points above, the closed-form solution gives β₁ = Σ(x_i−x̄)(y_i−ȳ)/Σ(x_i−x̄)² = −90 exactly — a deterministic, derivable number, not a guess or a human-set constant.'
      ),
      faded: bl(
        'Now you try: with data points (x=0, y=10) and (x=2, y=18), what slope β₁ does OLS find for y = β₀ + β₁x? Step 1 — the change in y is _____. Step 2 — the change in x is _____. Step 3 — β₁ = change in y ÷ change in x = _____.',
        'Now you try: with just two points, OLS reduces to the simple slope formula. Compute β₁ for (0,10) and (2,18), and state what β₀ must be for the line to pass through both points exactly.'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'programmedBehavior',
      analogyBreakdown: blSame(
        "The tailor analogy breaks down at scale and speed: a human tailor adjusts maybe a dozen measurements by hand. Estimation for a model like XGBoost is searching over thousands of possible split-points across hundreds of trees — a scale of \"fitting\" no human could do by hand, which is precisely why an algorithm does it instead of a person."
      ),
      caveat: blSame(
        'A real caveat: a person still makes important structural choices before estimation begins (model family, regularization strength, how many trees) — these are genuine human decisions. The point isn\'t "no human judgment anywhere," it\'s "the specific numbers inside the chosen shape are found, not typed."'
      ),
      retrieval: {
        question: blSame(
          'Without looking back: if you gave the exact same model code to two data scientists but different historical data, would they end up with the same fitted parameters?'
        ),
        answer: blSame(
          "No — different data produces different estimated parameters even with identical code, because the parameters are found from the data, not written into the code. This is the clearest possible demonstration that the numbers come from the data, not a programmer's fingers."
        ),
      },
    },
    question: bl(
      'What did the data actually teach the model?',
      'What did the data teach the model\'s internal parameters?'
    ),
    what: bl(
      'The model\'s internal numbers get tuned against historical data — this is the "learning" part, and it\'s exactly what Stats mode calls estimation.',
      'The model\'s internal parameters are estimated from historical data — OLS, MLE, gradient descent, or Bayesian posterior sampling, depending on the model family. This is the literal hinge to Stats mode (Module 10) and Module 2\'s own headline concept below.'
    ),
    goldExample: bl(
      'Feed 10 years of gold price + the 5 driver features into an XGBoost model; the training process finds the internal split-points that best fit the historical relationship.',
      'Fit XGBoost/LSTM/ARIMA on 2015–2025 gold + drivers; each family estimates differently (gradient-boosted splits, backprop through time, MLE on ARMA coefficients) but all are "estimation" in the pipeline sense.'
    ),
  },
  {
    id: 'prediction',
    n: 6,
    stage: 'Prediction (inference)',
    stageName: blSame('Prediction (inference)'),
    spark: {
      analogy: bl(
        "A tailor's fitted pattern works great for people whose measurements resemble the ones it was tailored around — but hand it to someone twice as tall, and the fit gets shaky fast. Prediction is running a fitted model on new inputs, and it's most trustworthy near the range of data it actually learned from.",
        'Prediction (inference) applies an already-fitted model to new, unseen inputs to generate an output — a point forecast plus, ideally, an uncertainty interval — without re-estimating any parameters.'
      ),
      predict: {
        question: bl(
          'A gold model trained on real-yield values between -2 and +2 is asked to predict at real-yield = +8 (far outside anything it ever saw). What happens to its confidence?',
          'A gold model trained on real-yield values between -2 and +2 is asked to predict at real-yield = +8 (far outside anything it ever saw). What happens to its confidence?'
        ),
        options: [
          blSame('It should get less confident — this is extrapolation far outside the training range'),
          blSame('It stays exactly as confident as it is near the training range'),
          blSame('It becomes more confident, since 8 is a bigger, more decisive number'),
        ],
        correctIndex: 0,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag the input further outside the training range, does the interval width shown grow or shrink?'),
        options: [blSame('Grows'), blSame('Shrinks')],
        correctIndex: 0,
      },
      paramLabel: blSame('Input distance beyond the training range (SDs)'),
      paramMin: 0, paramMax: 6, paramDefault: 0, paramStep: 0.5, paramDecimals: 1,
      compute: (v) => 90 + v * v * 12,
      outputLabel: blSame('Toy prediction interval width ($)'),
      outputDecimals: 0, outputSuffix: '',
    },
    formalism: {
      worked: bl(
        'Worked example: the fitted line from the Estimation stage was price ≈ 4015 − 90×yield. Step 1 — plug in a new, in-range input: yield = 0.5 → price ≈ 4015 − 45 = 3970. Step 2 — this is inference: no re-fitting happened, we just evaluated the existing formula at a new point. Step 3 — attach an interval reflecting historical residual spread, e.g. ±90 → "gold: ~$3,970 ± $90" — a prediction, not a re-estimated coefficient.',
        'ŷ_new = β̂₀ + β̂₁x_new is a pure function evaluation using already-estimated β̂s. The interval width should widen with distance from x̄ (the training mean) — this is the formal version of what the Mechanism widget\'s slider demonstrates directly: leverage/extrapolation increases variance.'
      ),
      faded: bl(
        'Now you try: using the same fitted line price ≈ 4015 − 90×yield, what point prediction does it give for yield = -1? Step 1 — plug in: price ≈ 4015 − 90×(_____) = _____. Step 2 — is yield = -1 inside or outside the original training range (-2 to +2)? _____. Step 3 — should the interval here be wide or narrow relative to yield=0.5\'s? _____.',
        'Now you try: compute the point prediction at yield=-1, then argue whether its interval should be wider or narrower than the yield=0.5 prediction\'s, using distance-from-training-center reasoning.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The tailor analogy is fairly faithful here, but has one gap: a tailor can visually tell a garment doesn't fit and say so. A model doesn't automatically know it's extrapolating unless someone explicitly builds that check in — left alone, it will confidently output a number even far outside anything it ever learned from, with no built-in warning."
      ),
      caveat: blSame(
        "A real caveat: not every model widens its interval with extrapolation automatically — this behavior depends on the model family (Bayesian/GP models do this natively; a plain point-estimate tree model needs an explicit add-on like conformal prediction to get any interval at all)."
      ),
      retrieval: {
        question: blSame(
          'Without looking back: why does a prediction far outside the training range deserve less confidence than one near the center of the training data?'
        ),
        answer: blSame(
          "The model has never actually observed what happens out there — it's extrapolating the same shape it fit near the data it saw, with no evidence that shape still holds. Near the training center, the fitted relationship was directly tested against real examples; far outside it, that's an assumption, not a checked fact."
        ),
      },
    },
    question: bl(
      'What does the trained model say will happen next?',
      'What does the fitted model say will happen for new, unseen inputs?'
    ),
    what: bl(
      'The trained model is pointed at fresh inputs it has never seen and produces a guess — a point forecast plus (ideally) a range of uncertainty around it.',
      'The fitted model is applied to new/unseen inputs to generate an output: a point forecast + prediction interval. This is the pipeline\'s other hinge to Stats mode — Module 2\'s Estimation vs. Prediction panel below makes the contrast explicit.'
    ),
    goldExample: bl(
      'Feed next month\'s expected real-yield/DXY/inflation values into the fitted model → it outputs "gold: $4,180 ± $150".',
      'Feed next-period driver forecasts into the fitted ensemble → point forecast + interval, e.g. "$4,180 ± $150 (95%)" — an inference step, not a re-estimation of parameters.'
    ),
  },
  {
    id: 'evaluation',
    n: 7,
    stage: 'Evaluation → Deployment → Monitoring',
    stageName: blSame('Evaluation → Deployment → Monitoring'),
    spark: {
      analogy: bl(
        "A ship's compass can drift out of true calibration over months at sea without ever breaking outright — it just quietly starts pointing a few degrees wrong, and the crew only finds out by comparing it against the stars. A deployed model is the same: nothing crashes, it just quietly gets less right, and only monitoring catches it.",
        'Evaluation scores accuracy honestly (Module 5\'s metrics), deployment ships the model, and monitoring watches for concept drift over time — because a model frozen at training time doesn\'t know the world kept moving.'
      ),
      predict: {
        question: bl(
          "A gold model has been running unchanged since 2023. In 2026, central-bank buying patterns shift sharply. Without retraining, what happens to the model's accuracy?",
          "A gold model has been running unchanged since 2023. In 2026, central-bank buying patterns shift sharply. Without retraining, what happens to the model's accuracy?"
        ),
        options: [
          blSame('It stays exactly as accurate — models don\'t degrade if the code doesn\'t change'),
          blSame("It quietly degrades — the model keeps applying the old (now-stale) pattern to a changed world"),
          blSame('It automatically retrains itself the moment it detects the shift'),
        ],
        correctIndex: 1,
      },
    },
    mechanism: {
      predict: {
        question: blSame('As you drag past month 14 (the illustrative regime shift), does the error rate stay flat or jump?'),
        options: [blSame('Stays flat'), blSame('Jumps up')],
        correctIndex: 1,
      },
      paramLabel: blSame('Months since deployment (no retraining)'),
      paramMin: 0, paramMax: 36, paramDefault: 0, paramStep: 1, paramDecimals: 0,
      compute: (v) => (v < 14 ? 1.2 : 1.2 + (v - 14) * 0.35),
      outputLabel: blSame('Toy error rate (illustrative, regime shift ~month 14)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Worked example: monitoring a deployed model\'s RMSE month by month. Step 1 — establish a training-time baseline RMSE, say 90 (this is the "normal" error to compare against). Step 2 — track live RMSE each month; through most of 2025 it hovers near 90-100, consistent with baseline. Step 3 — in Q1 2026, live RMSE jumps to 180+ as central-bank buying patterns shift sharply (net purchases fell to 16 tons after averaging ~225/quarter) — this crossing a threshold is exactly the "drift detected — retrain?" flag Module 5 builds live.',
        'Formally: track RMSE_t vs. RMSE_baseline over time; flag drift when RMSE_t > k × RMSE_baseline for some threshold k (Module 5 uses a concrete numeric threshold you can inspect directly). The statistical logic is identical to a control chart in manufacturing quality monitoring — a well-established idea borrowed wholesale, not invented for ML.'
      ),
      faded: bl(
        'Now you try: a politics-forecasting model has baseline RMSE (or error) of 5 points. Its live error this month is 11 points. Step 1 — compute the ratio: 11 ÷ 5 = _____. Step 2 — if the drift threshold is "ratio > 1.5", has drift been detected? _____. Step 3 — what should happen next: _____.',
        'Now you try: apply the same ratio-to-threshold logic to a hypothetical politics-model drift scenario, and state the correct action once drift crosses the threshold.'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'continuousLearning',
      analogyBreakdown: blSame(
        "The compass analogy is fairly accurate, but has one difference: a physical compass drifts because of gradual mechanical wear — a genuinely continuous, internal process. A model's \"drift\" isn't the model itself changing at all; it's the world outside changing while the frozen model stays exactly the same. The drift is entirely external."
      ),
      caveat: blSame(
        "A real caveat: some production systems do automate the *retraining* trigger (a scheduled or drift-triggered pipeline that re-runs estimation on fresh data) — but this is still a human-designed system executing a human-set policy, not the model itself deciding to learn more."
      ),
      retrieval: {
        question: blSame(
          'Without looking back: why does a model getting steadily less accurate over time NOT mean the model is "unlearning" or getting worse at what it originally learned?'
        ),
        answer: blSame(
          "The model's parameters haven't changed at all since training — it's applying the exact same fitted relationship it always did. What changed is the real-world relationship it's being asked to describe. It's not getting worse at yesterday's world; yesterday's world stopped existing."
        ),
      },
    },
    question: bl(
      'Is it still right, and for how much longer?',
      'Is it still right, and for how long — how do we know when to retrain?'
    ),
    what: bl(
      'Score the model\'s accuracy honestly, ship it, then keep watching — because the real world keeps changing underneath it, and a model that was right last year can quietly go wrong.',
      'Score accuracy (MAE/RMSE/MAPE/R²/AIC/BIC), ship the model, watch for concept drift, retrain on a schedule or trigger. See Module 5 for the full evaluation/explainability/drift toolkit this stage uses.'
    ),
    goldExample: bl(
      'Track the model\'s error month by month; when central banks suddenly changed their buying pattern in 2026, the old model\'s errors grew — a sign it needs retraining.',
      'RMSE tracked monthly against a training-time baseline; the 2021–2025 central-bank buying regime shift (net purchases fell to 16 tons in Q1 2026 after averaging ~225 tons/quarter) is exactly the kind of regime change that trips a drift alarm (Module 5).'
    ),
  },
];
