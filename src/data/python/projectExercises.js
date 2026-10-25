// Graded steps of the six V4 applied projects (src/data/projects/index.js,
// docs/v4/APPLIED_PROJECTS.md). Same contract as exercises.js: tests compare
// numbers with tolerances; scripts/verify-python.mjs runs every reference
// solution against its tests and every starter must fail them. Each also has
// a `noCode` path (CodeExercise.jsx): the reference solution's printed result
// and a question about what it means — for a learner not coding yet.
//
// The data come from the generated modules in src/data/projects/data/, so the
// numbers here are exactly the published (or stated synthetic) values.

import { SOUP_DEMAND } from '../projects/data/restaurant.js';
import { WEEK_PRICE, WEEK_UNITS } from '../projects/data/price_demand.js';
import { CET_MONTHLY } from '../projects/data/cet.js';
import { PENGUINS_CSV } from '../projects/data/penguins.js';
import { WDBC_RADIUS, WDBC_MALIGNANT } from '../projects/data/wdbc.js';

const list = (xs) => JSON.stringify(xs);

const BUDGET = `MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
# One invented household, dollars per month (synthetic).
income    = [3200, 3200, 3350, 3200, 3200, 3500, 3200, 3200, 3200, 3400, 3200, 4100]
rent      = [1250] * 12
food      = [520, 480, 510, 495, 530, 560, 610, 590, 505, 515, 540, 680]
transport = [180, 175, 190, 160, 170, 210, 260, 240, 185, 180, 175, 200]
utilities = [210, 195, 170, 140, 120, 110, 115, 120, 130, 160, 190, 230]
other     = [600, 450, 520, 480, 700, 900, 1100, 950, 500, 550, 620, 1300]`;
const BUDGET_NET = 'net = [income[i] - (rent[i] + food[i] + transport[i] + utilities[i] + other[i]) for i in range(12)]\nsaved = sum(net)';

const SOUP = `import numpy as np
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
# Soup portions demanded: 8 weeks (rows) x 7 days (columns), synthetic.
demand = np.array(${list(SOUP_DEMAND)})`;

const CET = `import numpy as np
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
# Met Office HadCET monthly mean temperature (deg C), one row per year from 1991.
# -99.9 marks a month not yet recorded. Open Government Licence v3.0.
temps = np.array(${list(CET_MONTHLY)})`;

const PENGUINS = `import io
import pandas as pd
# Palmer Penguins (Gorman, Williams & Fraser 2014), CC0. "NA" marks a missing value.
df = pd.read_csv(io.StringIO("""${PENGUINS_CSV}"""))
MEASURES = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]`;

const PRICE = `import numpy as np
# 40 weeks, synthetic: prices set at random (like a pricing experiment).
price = np.array(${list(WEEK_PRICE)})
units = np.array(${list(WEEK_UNITS)})`;

const WDBC = `import numpy as np
# Breast Cancer Wisconsin (Diagnostic), UCI, CC BY 4.0: mean nucleus radius
# and diagnosis (1 = malignant, 0 = benign) for 569 samples.
radius = np.array(${list(WDBC_RADIUS)})
malignant = np.array(${list(WDBC_MALIGNANT)})`;

const ask = (prompt, choices, correct, explain) => ({ prompt, choices, correct, explain });

export const PROJECT_EXERCISES = [
  {
    id: 'py.budget-net', type: 'analyze', title: 'Budget: net cash flow', competency: 'py.collections', project: 'proj.budget',
    prompt: 'Compute `net`, a list of the 12 monthly net cash flows (income minus all five spending categories), and `saved`, their total for the year.',
    setup: BUDGET,
    starter: 'net = []\nsaved = 0\n',
    solution: `${BUDGET_NET}\n`,
    tests: [
      { name: 'twelve months', code: 'assert len(net) == 12, f"net should have 12 values, one per month; it has {len(net)}"' },
      { name: 'January nets $440', code: 'assert abs(net[0] - 440) < 1e-9, f"January: 3200 - (1250 + 520 + 180 + 210 + 600) = 440, got {net[0]}"' },
      { name: 'July is negative', code: 'assert net[6] < 0, "July spent more than it earned"' },
      { name: 'the year saves $5,530', code: 'assert abs(saved - 5530) < 1e-9, f"saved should be the sum of net; got {saved}"' },
    ],
    hints: ['For month `i`, add the five spending lists at position `i` and subtract from `income[i]`.', '`sum(net)` gives the year.'],
    packages: [],
    noCode: {
      show: 'print(net)\nprint(saved, round(saved / sum(income), 3))',
      output: '[440, 650, 710, 675, 430, 470, -135, 50, 630, 745, 425, 440]\n5530 0.138',
      question: ask('The household saved \\$5,530, 13.8% of its income. Which month spent more than it earned, and what drove it?', ['July — “other” spending (\\$1,100) was about twice its usual level', 'December — rent rose', 'January — income fell', 'No month did'], 0, 'July’s net is −\\$135. Rent and income were normal; “other” was \\$1,100 against roughly \\$500 most months.'),
    },
  },
  {
    id: 'py.budget-goal', type: 'analyze', title: 'Budget: the 15% goal', competency: 'py.collections', project: 'proj.budget',
    prompt: 'Compute `rate` (savings ÷ total income), `target` (15% of total income) and `cut_per_month`: the yearly shortfall spread over 12 months (0 if the goal is already met).',
    setup: `${BUDGET}\n${BUDGET_NET}`,
    starter: 'rate = None\ntarget = None\ncut_per_month = None\n',
    solution: 'rate = saved / sum(income)\ntarget = 0.15 * sum(income)\ncut_per_month = max(0, target - saved) / 12\n',
    tests: [
      { name: 'savings rate is about 13.8%', code: 'import math\nassert rate is not None and math.isclose(rate, 5530 / 39950), f"rate should be saved / sum(income); got {rate}"' },
      { name: 'target is $5,992.50', code: 'assert target is not None and math.isclose(target, 5992.5), f"target should be 0.15 * sum(income); got {target}"' },
      { name: 'about $38.54 a month less spending', code: 'assert cut_per_month is not None and math.isclose(cut_per_month, (5992.5 - 5530) / 12), f"got {cut_per_month}"' },
    ],
    hints: ['Total income is `sum(income)` = 39,950.', 'The shortfall is `target - saved`.'],
    packages: [],
    noCode: {
      show: 'print(round(rate, 3), target, round(cut_per_month, 2))',
      output: '0.138 5992.5 38.54',
      question: ask('The gap to 15% is about \\$39 a month. Which plan reaches the goal most reliably?', ['Cut a regular expense — food or transport — by about \\$40 a month', 'Hope next December’s bonus is bigger', 'Skip one month’s rent', 'Nothing: 13.8% rounds to 15%'], 0, 'A small, steady cut to a regular cost is predictable; a bonus is not, and 13.8% is not 15%.'),
    },
  },
  {
    id: 'py.soup-avg', type: 'analyze', title: 'Kitchen: demand by weekday', competency: 'py.numpy', project: 'proj.restaurant',
    prompt: '`demand` is an 8 × 7 array: 8 weeks (rows), Monday to Sunday (columns). Compute `avg`, the mean demand for each weekday (7 numbers), and `busiest`, the index of the busiest day (0 = Monday).',
    setup: SOUP,
    starter: 'avg = None\nbusiest = None\n',
    solution: 'avg = demand.mean(axis=0)\nbusiest = int(np.argmax(avg))\n',
    tests: [
      { name: 'seven weekday means', code: 'assert avg is not None and np.shape(avg) == (7,), "avg should have 7 values — average down the rows (axis=0)"' },
      { name: 'the means are right', code: 'assert np.allclose(avg, demand.mean(axis=0)), "each value is the mean of one column"' },
      { name: 'Saturday is busiest', code: 'assert busiest == 5, f"busiest should be 5 (Saturday); got {busiest}"' },
    ],
    hints: ['`axis=0` averages down the rows, giving one value per column.', '`np.argmax` gives the index of the largest value.'],
    packages: ['numpy'],
    noCode: {
      show: 'print([round(float(a), 1) for a in avg])\nprint(DAYS[busiest])',
      output: '[42.9, 45.1, 46.1, 52.5, 76.5, 88.0, 58.2]\nSat',
      question: ask('Saturday averages 88 portions and Monday 43. What should a prep plan do with that?', ['Prepare a different amount for each weekday', 'Prepare the weekly average (about 58) every day', 'Prepare Saturday’s amount every day, to be safe', 'Nothing — daily demand is random'], 0, 'Demand follows the week. One number for every day wastes food on Mondays and runs out on Saturdays.'),
    },
  },
  {
    id: 'py.soup-plan', type: 'analyze', title: 'Kitchen: cost two prep plans', competency: 'py.numpy', project: 'proj.restaurant',
    prompt: 'Compare two plans over the 8 weeks. `plan_mean`: each weekday’s mean, rounded. `plan_safe`: each weekday’s mean plus one standard deviation (`ddof=1`), rounded. For each plan, total the portions wasted (prepared but not sold) and the sales missed. A wasted portion costs \\$1.50 and a missed sale \\$4.50. Store the totals as `cost_mean` and `cost_safe`.',
    setup: `${SOUP}\navg = demand.mean(axis=0)`,
    starter: 'cost_mean = None\ncost_safe = None\n',
    solution: `def cost(plan):
    waste = np.clip(plan - demand, 0, None).sum()
    missed = np.clip(demand - plan, 0, None).sum()
    return 1.5 * waste + 4.5 * missed

plan_mean = np.round(avg)
plan_safe = np.round(avg + demand.std(axis=0, ddof=1))
cost_mean = cost(plan_mean)
cost_safe = cost(plan_safe)
`,
    tests: [
      { name: 'mean plan costs $691.50', code: 'import math\nassert cost_mean is not None and math.isclose(cost_mean, 691.5), f"got {cost_mean}"' },
      { name: 'safer plan costs $541.50', code: 'assert cost_safe is not None and math.isclose(cost_safe, 541.5), f"got {cost_safe} — did you use ddof=1 and round the plan?"' },
    ],
    hints: ['`plan - demand` broadcasts the 7 plan values across all 8 weeks.', '`np.clip(x, 0, None)` keeps only the positive part.'],
    packages: ['numpy'],
    noCode: {
      show: 'print(cost_mean, cost_safe)',
      output: '691.5 541.5',
      question: ask('The safer plan wastes more food but costs \\$150 less. Why?', ['A missed sale costs three times as much as a wasted portion, so preparing a little extra pays', 'Waste costs nothing', 'The safer plan sells fewer portions', 'It is a rounding effect'], 0, 'With \\$4.50 lost per missed sale against \\$1.50 per wasted portion, it pays to prepare above the average — up to the point where extra waste outweighs the sales saved.'),
    },
  },
  {
    id: 'py.cet-clim', type: 'analyze', title: 'Weather: monthly normals', competency: 'py.numpy', project: 'proj.weather',
    prompt: '`temps` holds monthly mean temperatures (°C) from 1991, one row per year (row 0 = 1991). Compute `clim`: the average of each month over 1991–2020 — the first 30 rows. These are the “normals”.',
    setup: CET,
    starter: 'clim = None\n',
    solution: 'clim = temps[:30].mean(axis=0)\n',
    tests: [
      { name: 'twelve normals', code: 'assert clim is not None and np.shape(clim) == (12,), "clim should have 12 values"' },
      { name: 'from 1991–2020 only', code: 'assert np.allclose(clim, temps[:30].mean(axis=0)), "use the first 30 rows (1991–2020)"' },
      { name: 'July is warmest', code: 'assert int(np.argmax(clim)) == 6, "July should have the highest normal"' },
    ],
    hints: ['`temps[:30]` is 1991–2020.', 'Average down the rows: `axis=0`.'],
    packages: ['numpy'],
    noCode: {
      show: 'print([round(float(c), 1) for c in clim])',
      output: '[4.7, 5.0, 6.8, 9.1, 11.9, 14.7, 16.8, 16.6, 14.2, 10.8, 7.3, 4.9]',
      question: ask('July’s normal is about 12 °C above January’s. Is a warm July an anomaly?', ['Not by itself — that is the seasonal cycle; an anomaly compares a July with other Julys', 'Yes — any month above the yearly average is an anomaly', 'Yes, if it is above 15 °C', 'Only in a leap year'], 0, 'Anomalies remove the seasons: each month is compared with the normal for that same month.'),
    },
  },
  {
    id: 'py.cet-anom', type: 'analyze', title: 'Weather: 2025 anomalies', competency: 'py.numpy', project: 'proj.weather',
    prompt: 'Compute `anom`, the 2025 anomalies (row 34 minus `clim`), and `warmest`, the name of the 2025 month furthest above normal (use `MONTHS`). Then count `recorded_2026`: how many 2026 months (row 35) have a real value — the file uses −99.9 for months not yet recorded.',
    setup: `${CET}\nclim = temps[:30].mean(axis=0)`,
    starter: 'anom = None\nwarmest = None\nrecorded_2026 = None\n',
    solution: 'anom = temps[34] - clim\nwarmest = MONTHS[int(np.argmax(anom))]\nrecorded_2026 = int((temps[35] > -99).sum())\n',
    tests: [
      { name: 'twelve anomalies', code: 'assert anom is not None and np.allclose(anom, temps[34] - clim), "anom = 2025 row minus the normals"' },
      { name: 'June was furthest above normal', code: 'assert warmest == "Jun", f"got {warmest!r}"' },
      { name: 'nine 2026 months recorded', code: 'assert recorded_2026 == 9, f"count the values that are not -99.9; got {recorded_2026}"' },
    ],
    hints: ['Row 34 is 2025 (1991 + 34).', '`temps[35] > -99` is True where a value exists.'],
    packages: ['numpy'],
    noCode: {
      show: 'print([round(float(a), 1) for a in anom])\nprint(warmest, recorded_2026)',
      output: '[-1.3, 0.3, 1.1, 1.8, 1.3, 2.3, 1.6, 1.1, -0.1, 0.5, 1.1, 1.8]\nJun 9',
      question: ask('Ten of the twelve 2025 months were above normal, June by 2.3 °C. What can one year tell you about climate change?', ['On its own, little: climate is about long-run averages, so look at decades of anomalies', 'That the climate warmed by 2.3 °C', 'Nothing — temperature records cannot show trends', 'That next June will be warmer'], 0, 'One year is weather. A trend needs many years of anomalies — the same file goes back to 1659.'),
    },
  },
  {
    id: 'py.penguins-missing', type: 'analyze', title: 'Penguins: missing values', competency: 'py.data', project: 'proj.penguins',
    prompt: '`df` is the Palmer Penguins table (pandas). Compute `missing`, a dict mapping each column name to its number of missing values, and `clean`: `df` without the rows missing any of the four measurements in `MEASURES` — but keep rows that are only missing `sex`.',
    setup: PENGUINS,
    starter: 'missing = {}\nclean = df\n',
    solution: 'missing = df.isna().sum().to_dict()\nclean = df.dropna(subset=MEASURES)\n',
    tests: [
      { name: 'eleven penguins have no recorded sex', code: "assert missing.get('sex') == 11, f\"missing['sex'] should be 11; got {missing.get('sex')}\"" },
      { name: 'two are missing each measurement', code: 'assert all(missing.get(m) == 2 for m in MEASURES), f"got {[missing.get(m) for m in MEASURES]}"' },
      { name: '342 rows kept', code: 'assert len(clean) == 342, f"drop only rows missing a measurement: expected 342 rows, got {len(clean)}"' },
    ],
    hints: ['`df.isna().sum()` counts missing values per column.', '`df.dropna(subset=MEASURES)` drops a row only when one of those columns is missing.'],
    packages: ['pandas'],
    noCode: {
      show: 'print({k: v for k, v in missing.items() if v})\nprint(len(df), len(clean))',
      output: "{'bill_length_mm': 2, 'bill_depth_mm': 2, 'flipper_length_mm': 2, 'body_mass_g': 2, 'sex': 11}\n344 342",
      question: ask('Dropping every row with any missing value would also remove the 9 penguins that have all four measurements but no recorded sex. When does that matter?', ['When the question does not need sex — you would throw away good measurements', 'Never — an incomplete row is always untrustworthy', 'Only when more than half the rows are missing', 'Only for large files'], 0, 'Drop what the question needs, not everything. For body mass by species, sex is not needed.'),
    },
  },
  {
    id: 'py.penguins-mass', type: 'analyze', title: 'Penguins: body mass by species', competency: 'py.data', project: 'proj.penguins',
    prompt: 'Using `clean`, compute `mass`, the mean body mass (g) of each species (a dict or a pandas Series indexed by species), and `heaviest`, the name of the heaviest species.',
    setup: `${PENGUINS}\nclean = df.dropna(subset=MEASURES)`,
    starter: 'mass = {}\nheaviest = None\n',
    solution: 'mass = clean.groupby("species")["body_mass_g"].mean()\nheaviest = mass.idxmax()\n',
    tests: [
      { name: 'three species', code: 'm = dict(mass)\nassert set(m) == {"Adelie", "Chinstrap", "Gentoo"}, f"got {sorted(m)}"' },
      { name: 'means match the data', code: 'expected = clean.groupby("species")["body_mass_g"].mean()\nassert all(abs(m[k] - expected[k]) < 1e-6 for k in expected.index), "use clean, grouped by species"' },
      { name: 'Gentoo is heaviest', code: 'assert heaviest == "Gentoo", f"got {heaviest!r}"' },
    ],
    hints: ['`clean.groupby("species")["body_mass_g"].mean()`', '`.idxmax()` gives the label of the largest value.'],
    packages: ['pandas'],
    noCode: {
      show: 'print({k: round(v) for k, v in dict(mass).items()})\nprint(heaviest)',
      output: "{'Adelie': 3701, 'Chinstrap': 3733, 'Gentoo': 5076}\nGentoo",
      question: ask('Gentoo penguins average about 1.35 kg more than the others. Which chart tells that story most honestly?', ['A box plot or strip plot of body mass by species, with axis labels and units', 'A pie chart of how many penguins of each species there are', 'A table of all 342 rows', 'A line chart of body mass in row order'], 0, 'Showing each species’ spread — not only its mean — lets the reader see how much the groups overlap.'),
    },
  },
  {
    id: 'py.price-fit', type: 'analyze', title: 'Pricing: fit on training weeks', competency: 'py.numpy', project: 'proj.pricing',
    prompt: 'Fit a straight line `units ≈ slope · price + intercept` to the **first 30 weeks only** (the training set). Store `slope` and `intercept`.',
    setup: PRICE,
    starter: 'slope = None\nintercept = None\n',
    solution: 'slope, intercept = np.polyfit(price[:30], units[:30], 1)\n',
    tests: [
      { name: 'fitted on the first 30 weeks', code: 'm, b = np.polyfit(price[:30], units[:30], 1)\nassert slope is not None and abs(slope - m) < 1e-6 and abs(intercept - b) < 1e-4, f"got slope {slope}, intercept {intercept} — use price[:30] and units[:30]"' },
      { name: 'demand falls with price', code: 'assert slope < 0, "the slope should be negative"' },
    ],
    hints: ['`np.polyfit(x, y, 1)` returns slope then intercept.', '`price[:30]` is the first 30 weeks.'],
    packages: ['numpy'],
    noCode: {
      show: 'print(round(float(slope), 1), round(float(intercept), 1))',
      output: '-45.6 523.6',
      question: ask('The fitted slope is −45.6. What does it say?', ['Each \\$1 higher price goes with about 46 fewer units a week', 'The price fell by \\$45.60', 'Every week sells 45.6 units', 'Raising the price by \\$1 always loses exactly 45.6 sales in any shop'], 0, 'A slope is a rate: units per dollar. Here prices were randomized, so it estimates the effect of price — but only for this product and price range.'),
    },
  },
  {
    id: 'py.price-test', type: 'analyze', title: 'Pricing: test on unseen weeks', competency: 'py.numpy', project: 'proj.pricing',
    prompt: 'On the **last 10 weeks** (the test set), compute `mae_model`, the mean absolute error of the line’s predictions, and `mae_baseline`, the error of always predicting the average units of the training weeks.',
    setup: `${PRICE}\nslope, intercept = np.polyfit(price[:30], units[:30], 1)`,
    starter: 'mae_model = None\nmae_baseline = None\n',
    solution: 'pred = slope * price[30:] + intercept\nmae_model = np.abs(pred - units[30:]).mean()\nmae_baseline = np.abs(units[:30].mean() - units[30:]).mean()\n',
    tests: [
      { name: 'model error on test weeks', code: 'import math\nexp = np.abs(slope * price[30:] + intercept - units[30:]).mean()\nassert mae_model is not None and math.isclose(mae_model, exp), f"got {mae_model}"' },
      { name: 'baseline uses the training average', code: 'exp = np.abs(units[:30].mean() - units[30:]).mean()\nassert mae_baseline is not None and math.isclose(mae_baseline, exp), f"got {mae_baseline} — predict units[:30].mean() for every test week"' },
      { name: 'the line beats the baseline', code: 'assert mae_model < mae_baseline' },
    ],
    hints: ['Test weeks are `price[30:]` and `units[30:]`.', 'Mean absolute error: `np.abs(pred - actual).mean()`.'],
    packages: ['numpy'],
    noCode: {
      show: 'print(round(float(mae_model), 1), round(float(mae_baseline), 1))',
      output: '15.5 57.3',
      question: ask('Why judge the line on weeks it was not fitted to?', ['Error on the training weeks is optimistic; unseen weeks show how it will do on new data', 'The test weeks have no noise', 'A line can only be fitted to exactly 30 points', 'The baseline only works on test data'], 0, 'A model always looks better on the data it was fitted to. The test set is a stand-in for next month.'),
    },
  },
  {
    id: 'py.wdbc-confusion', type: 'analyze', title: 'Classification: confusion matrix', competency: 'py.numpy', project: 'proj.diagnosis',
    prompt: 'Call a sample malignant when its mean nucleus `radius` is at least 15. Against `malignant` (1 = malignant), compute `tp`, `fp`, `fn` and `tn`, then `precision` and `recall`.',
    setup: WDBC,
    starter: 'tp = fp = fn = tn = 0\nprecision = recall = None\n',
    solution: 'pred = radius >= 15\nactual = malignant == 1\ntp = int((pred & actual).sum())\nfp = int((pred & ~actual).sum())\nfn = int((~pred & actual).sum())\ntn = int((~pred & ~actual).sum())\nprecision = tp / (tp + fp)\nrecall = tp / (tp + fn)\n',
    tests: [
      { name: 'counts add up to 569', code: 'assert tp + fp + fn + tn == 569, f"the four counts should cover all 569 samples; got {tp + fp + fn + tn}"' },
      { name: 'counts at radius 15', code: 'assert (tp, fp, fn, tn) == (161, 13, 51, 344), f"got {(tp, fp, fn, tn)}"' },
      { name: 'precision and recall', code: 'import math\nassert precision is not None and math.isclose(precision, 161 / 174) and math.isclose(recall, 161 / 212), f"got {precision}, {recall}"' },
    ],
    hints: ['`pred = radius >= 15` is a True/False array.', 'Combine with `&` and `~`, then `.sum()` counts the Trues.'],
    packages: ['numpy'],
    noCode: {
      show: 'print(tp, fp, fn, tn)\nprint(round(precision, 3), round(recall, 3))',
      output: '161 13 51 344\n0.925 0.759',
      question: ask('Recall is 0.76 at this threshold. What does that mean here?', ['About 1 in 4 malignant samples would be called benign — missed', '76% of all samples are malignant', '76% of the “malignant” calls are right', 'The rule is 76% accurate overall'], 0, 'Recall = found ÷ all malignant = 161/212. The 51 missed are the false negatives; precision (0.93) is the share of positive calls that are right.'),
    },
  },
  {
    id: 'py.wdbc-cost', type: 'analyze', title: 'Classification: threshold by cost', competency: 'py.numpy', project: 'proj.diagnosis',
    prompt: 'Suppose a missed malignant sample (false negative) is judged 10 times as costly as an unnecessary follow-up (false positive). For thresholds 10.0, 10.5, …, 20.0, compute the cost `10 * fn + fp`. Store `best_threshold` and `best_cost` (the smallest cost).',
    setup: WDBC,
    starter: 'best_threshold = None\nbest_cost = None\n',
    solution: `actual = malignant == 1
best_threshold, best_cost = None, None
for t in np.arange(10, 20.01, 0.5):
    pred = radius >= t
    cost = 10 * int((~pred & actual).sum()) + int((pred & ~actual).sum())
    if best_cost is None or cost < best_cost:
        best_threshold, best_cost = float(t), cost
`,
    tests: [
      { name: 'the cheapest threshold is 13.0', code: 'assert best_threshold is not None and abs(best_threshold - 13.0) < 1e-9, f"got {best_threshold}"' },
      { name: 'its cost is 233', code: 'assert best_cost == 233, f"got {best_cost}"' },
    ],
    hints: ['`np.arange(10, 20.01, 0.5)` gives the thresholds.', 'Keep the threshold whose cost is lowest so far.'],
    packages: ['numpy'],
    noCode: {
      show: 'print(best_threshold, best_cost)',
      output: '13.0 233',
      question: ask('With misses judged 10 times as costly, the best threshold drops from 15 to 13. Why?', ['A lower threshold flags more samples: fewer costly misses, more cheap false alarms', 'Lower thresholds are always better', 'The data changed', 'Precision rises when the threshold falls'], 0, 'At 13 only 12 malignant samples are missed (cost 120), at the price of 113 false alarms (cost 113). The ratio is a value judgement — change it and the best threshold moves.'),
    },
  },
];
