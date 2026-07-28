// Python Hub content — Stats Ch 2 (frequency distributions) and Ch 3
// (data description). Ids mirror src/data/nodes.js.
export const PY_STATS_DESCRIPTIVE = [
  {
    id: 'pct', group: 'ch2', name: 'Class %', formula: '% = (f/n) × 100',
    tags: ['frequency', 'percentage', 'descriptive'],
    overview: "Converts a class frequency into a share of the whole. The humblest formula in statistics — and the one most business dashboards are secretly made of.",
    variables: [['f', 'frequency — count in this class'], ['n', 'total number of observations'], ['%', 'the class share of the total']],
    thinking: {
      workflow: ['Counts per category in hand', 'Divide by total, scale by 100', 'Check shares sum to 100%', 'Report alongside raw counts'],
      when: ['Comparing category shares across groups of different sizes', 'Building frequency tables and pie/bar charts'],
      notWhen: ['n is tiny — 2 of 3 customers is "67%" but means almost nothing', 'The base n differs across compared groups and is hidden'],
      assumptions: ['Categories are mutually exclusive and cover all cases', 'n is the honest denominator (no silent filtering)'],
    },
    code: `import pandas as pd

# --- survey responses: favorite coffee drink -------------------------
responses = pd.Series(["latte", "espresso", "latte", "cold brew", "latte",
                       "espresso", "drip", "cold brew", "latte", "drip"])

freq = responses.value_counts()          # f per class
pct = (freq / len(responses) * 100).round(1)   # (f/n) * 100

table = pd.DataFrame({"f": freq, "percent": pct})
print(table)
print(f"check: percents sum to {pct.sum():.0f}%")

# One-liner used everywhere in practice:
print(responses.value_counts(normalize=True).mul(100).round(1))`,
    scenario: {
      title: 'Starbucks customer satisfaction breakdown',
      problem: 'A regional manager wants the share of satisfied / neutral / dissatisfied responses per store.',
      dataset: 'Post-purchase survey ratings bucketed into three classes per store.',
      why: 'Stores differ in survey volume; raw counts mislead, shares compare fairly.',
      output: 'A percentage per satisfaction class per store.',
      interpretation: '"82% satisfied at Store A vs 71% at Store B" is comparable even though A had 3× the responses.',
      pitfalls: 'Always show n next to the percentage — 90% of 10 responses is noise.',
    },
    mistakes: ['Percentages without the base n', 'Comparing shares whose denominators differ in definition', 'Letting rounding make shares sum to 99% or 101% without noting it'],
    tips: ['value_counts(normalize=True) is the idiomatic pandas form', 'Report counts and percents together', 'For small n, quote the raw fraction instead'],
  },
  {
    id: 'midpoint', group: 'ch2', name: 'Class Midpoint', formula: 'Xm = (Lower + Upper) / 2',
    tags: ['frequency', 'grouped data', 'class'],
    overview: "The representative center of a class interval. When data arrives pre-binned (income brackets, age ranges), every grouped-data statistic — mean, variance — stands on these midpoints.",
    variables: [['Lower', 'lower class boundary'], ['Upper', 'upper class boundary'], ['Xm', 'midpoint — the value that represents everyone in the class']],
    thinking: {
      workflow: ['Data arrives as intervals with counts', 'Compute each interval’s midpoint', 'Treat each observation as sitting at its midpoint', 'Feed midpoints into grouped mean/SD formulas'],
      when: ['Only binned data is available (census tables, brackets)', 'Building histograms and grouped summaries'],
      notWhen: ['Raw data is available — use it directly, midpoints lose information', 'Open-ended classes ("$200k+") — the midpoint is undefined without a judgment call'],
      assumptions: ['Values spread roughly evenly within each class', 'Class boundaries are consistent and non-overlapping'],
    },
    code: `import pandas as pd

# --- income data already grouped into brackets -----------------------
classes = pd.DataFrame({
    "lower": [0, 25, 50, 75, 100],
    "upper": [25, 50, 75, 100, 150],   # $k
    "f":     [18, 34, 27, 14, 7],
})

classes["midpoint"] = (classes["lower"] + classes["upper"]) / 2

# Midpoints let grouped data act like raw data:
n = classes["f"].sum()
grouped_mean = (classes["f"] * classes["midpoint"]).sum() / n
print(classes)
print(f"grouped mean income ~= {grouped_mean:.1f} $k  (n={n})")`,
    scenario: {
      title: 'Census income analysis',
      problem: 'An analyst has only the published bracket table, not raw incomes, and needs an average for a market-sizing model.',
      dataset: 'Income brackets with household counts.',
      why: 'Midpoints are the standard stand-in that makes grouped calculations possible at all.',
      output: 'A midpoint per bracket and a grouped mean built on them.',
      interpretation: 'The estimate is honest to within the assumption that incomes spread evenly inside brackets.',
      pitfalls: 'The top open bracket ("150+") needs an assumed ceiling — document whatever you choose.',
    },
    mistakes: ['Using class limits instead of true boundaries when they differ', 'Forgetting the open-ended top class has no defensible midpoint', 'Reporting grouped results with raw-data precision'],
    tips: ['Keep a column of midpoints in every grouped table — everything downstream uses it', 'Sensitivity-check open-bracket assumptions', 'Prefer raw data whenever you can get it'],
  },
  {
    id: 'pie_deg', group: 'ch2', name: 'Pie Degrees', formula: 'Degrees = (f/n) × 360°',
    tags: ['frequency', 'pie chart', 'visualization'],
    overview: "Converts a class share into slice angle: a category with 25% of observations owns 90° of the circle. Mostly of historical/teaching value — plotting libraries do this internally — but it makes the share-to-angle mapping explicit.",
    variables: [['f', 'class frequency'], ['n', 'total observations'], ['Degrees', 'slice angle out of the full 360°']],
    thinking: {
      workflow: ['Compute each class share f/n', 'Multiply by 360° for the slice', 'Verify angles sum to 360°', 'Draw (or let matplotlib do it)'],
      when: ['Teaching how pie charts encode proportions', 'Hand-drafting a proportional chart'],
      notWhen: ['More than ~5 categories (bar charts read better)', 'Comparing across multiple pies — humans misjudge angles'],
      assumptions: ['Shares are parts of one meaningful whole', 'Categories don’t overlap'],
    },
    code: `import pandas as pd
import matplotlib.pyplot as plt

budget = pd.Series({"Rent": 1400, "Food": 650, "Transport": 280,
                    "Savings": 470, "Other": 200})

degrees = (budget / budget.sum() * 360).round(1)
print(pd.DataFrame({"amount": budget, "degrees": degrees}))
print(f"check: {degrees.sum():.0f} degrees total")

# In practice matplotlib computes the angles for you:
fig, ax = plt.subplots()
ax.pie(budget, labels=budget.index, autopct="%1.0f%%", startangle=90)
ax.set_title("Monthly budget")
plt.savefig("budget_pie.png", dpi=120)`,
    scenario: {
      title: 'Household budget presentation',
      problem: 'A financial coach shows a client where each dollar goes.',
      dataset: 'Monthly spend per category.',
      why: 'Parts-of-a-whole with few categories is the one situation pies serve well.',
      output: 'Slice angles (and a rendered pie).',
      interpretation: 'Rent’s ~168° slice makes "almost half your budget" viscerally obvious.',
      pitfalls: 'A dozen sliver categories destroys readability — bucket small ones into "Other".',
    },
    mistakes: ['Pies for many categories or for cross-group comparison', 'Slices from overlapping categories that exceed the whole', '3-D pies distorting the very angles the formula computed'],
    tips: ['≤5 slices, largest starting at 12 o’clock', 'Label with percents, not degrees', 'When in doubt, a sorted bar chart beats a pie'],
  },
  {
    id: 'range2', group: 'ch2', name: 'Range (Ch2)', formula: 'R = Highest − Lowest',
    tags: ['spread', 'descriptive', 'quick'],
    overview: "The full span of the data in one subtraction. The fastest possible spread measure — and the most fragile, since it depends entirely on the two most extreme points.",
    variables: [['Highest', 'maximum observed value'], ['Lowest', 'minimum observed value'], ['R', 'the total span']],
    thinking: {
      workflow: ['Scan data (or describe()) for min and max', 'Subtract', 'Ask whether either extreme is an error or outlier', 'Pair with a robust spread measure (IQR/SD)'],
      when: ['Quick data-quality scans and sanity checks', 'Setting axis limits, bin widths (via class width), spec windows'],
      notWhen: ['Outlier-prone data — one bad point owns the whole number', 'Comparing spread across samples of different sizes (range grows with n)'],
      assumptions: ['Extremes are genuine observations, not entry errors'],
    },
    code: `import numpy as np

delivery_days = np.array([2, 3, 3, 4, 2, 5, 3, 4, 21, 3])  # note the 21!

r = delivery_days.max() - delivery_days.min()
print(f"range = {delivery_days.max()} - {delivery_days.min()} = {r} days")

# The range's fragility, demonstrated:
clean = np.sort(delivery_days)[:-1]          # drop the single extreme
print(f"without the one extreme: range = {clean.max() - clean.min()} days")

# Which is why it should travel with a robust companion:
q1, q3 = np.percentile(delivery_days, [25, 75])
print(f"IQR = {q3 - q1:.1f} days  (unmoved by the outlier)")`,
    scenario: {
      title: 'Manufacturing quality control spot check',
      problem: 'A line supervisor wants an instant read on how much part diameters varied this shift.',
      dataset: 'The shift’s measured diameters.',
      why: 'Range is computable at a glance and maps directly onto tolerance limits ("the span used 80% of our spec window").',
      output: 'A single span number compared against the spec width.',
      interpretation: 'Span approaching the tolerance window = the process needs attention even if the mean is centered.',
      pitfalls: 'One mis-measured part inflates the range; confirm extremes before reacting.',
    },
    mistakes: ['Treating range as a stable spread estimate', 'Comparing ranges across very different sample sizes', 'Not investigating whether extremes are data errors'],
    tips: ['Always ask "is the max/min real?" first', 'Use IQR or SD for anything decision-grade', 'Range/4 gives a quick SD guess (the Range Rule of Thumb)'],
  },
  {
    id: 'cwidth', group: 'ch2', name: 'Class Width', formula: 'Width = Range / #classes (rounded up)',
    tags: ['frequency', 'histogram', 'binning'],
    overview: "How wide each histogram bin should be: divide the data’s range by the desired number of classes and round UP so the classes cover everything. The quiet decision that determines whether a histogram reveals structure or hides it.",
    variables: [['Range', 'highest − lowest'], ['#classes', 'how many bins you want (typically 5–20)'], ['Width', 'the resulting bin width, rounded up']],
    thinking: {
      workflow: ['Choose a class count (5–20; √n is a common start)', 'Width = range / classes, rounded UP', 'Set boundaries so no observation falls on an edge ambiguously', 'Plot; adjust if the shape looks over- or under-smoothed'],
      when: ['Building frequency distributions and histograms by hand or spec', 'Standardizing bins across reports so charts stay comparable'],
      notWhen: ['Exploratory work where automatic rules (Freedman–Diaconis) do better', 'Heavily skewed data that wants unequal or log-scale bins'],
      assumptions: ['Equal-width classes suit the data’s shape', 'The chosen class count balances detail vs noise'],
    },
    code: `import numpy as np
import math

rng = np.random.default_rng(0)
scores = rng.normal(72, 12, 80).round(0)     # 80 exam scores

k = 7                                        # desired classes
width = math.ceil((scores.max() - scores.min()) / k)
print(f"range = {scores.max()-scores.min():.0f}, classes = {k}, "
      f"width = {width}")

# Build the class boundaries and count frequencies:
start = math.floor(scores.min())
edges = [start + i * width for i in range(k + 1)]
freq, _ = np.histogram(scores, bins=edges)
for lo, hi, f in zip(edges[:-1], edges[1:], freq):
    print(f"[{lo:3d}, {hi:3d})  f={f:2d}  {'#' * f}")

# For comparison — the automatic rule most tools use:
fd_width = np.diff(np.histogram_bin_edges(scores, bins="fd"))[0]
print(f"Freedman-Diaconis suggests width ~= {fd_width:.1f}")`,
    scenario: {
      title: 'Student exam score distribution',
      problem: 'A teacher wants a histogram of 80 exam scores that honestly shows the grade distribution shape.',
      dataset: 'Scores 0–100 for one exam.',
      why: 'Score bins must be round, equal, and cover the range — the class-width calculation makes them reproducible across exams.',
      output: 'Class boundaries, frequencies, and a text histogram.',
      interpretation: 'Bimodality (two humps) would suggest two distinct groups of preparation — invisible with too-wide bins.',
      pitfalls: 'Too few classes hides bimodality; too many turns the histogram into noise.',
    },
    mistakes: ['Rounding width DOWN and leaving the max uncovered', 'Boundaries that let values land exactly on two classes', 'One bin rule for every dataset regardless of shape'],
    tips: ['Round width up, always', 'Try 2–3 class counts; the story should survive the change', 'For exploration, let bins="auto"/"fd" decide and move on'],
  },
  {
    id: 'x_bar', group: 'ch3', name: 'Sample Mean', formula: 'X̄ = ΣX / n',
    tags: ['center', 'average', 'descriptive', 'mean'],
    overview: "Add everything up, divide by the count. The center of gravity of the data, the anchor of nearly every later formula (variance, z-scores, t-tests, regression) — and sensitive to every single value, outliers included.",
    variables: [['ΣX', 'sum of all observations'], ['n', 'sample size'], ['X̄', 'the sample mean — the balance point']],
    thinking: {
      workflow: ['Numeric data, roughly symmetric?', 'Compute the mean as the default center', 'Compare with the median — a big gap flags skew/outliers', 'Report with a spread measure, never alone'],
      when: ['Symmetric distributions without extreme values', 'Downstream math needs it (variance, CIs, tests)', 'Totals matter: mean × n recovers the total exactly'],
      notWhen: ['Skewed data (income!) — the median describes "typical" better', 'Ordinal ratings where distances between levels are not equal'],
      assumptions: ['Interval/ratio measurement scale', 'Observations represent the population of interest'],
    },
    code: `import numpy as np
import pandas as pd

daily_sales = pd.Series([1200, 1350, 980, 1420, 1150, 1600, 5400])
#                                          weekend spike ----^

mean = daily_sales.mean()          # same as daily_sales.sum() / len(...)
median = daily_sales.median()
print(f"mean   = {mean:8.1f}")
print(f"median = {median:8.1f}   <- gap says: something is skewing us")

# The mean's defining property: it balances the deviations to zero.
print(f"sum of deviations from mean: {(daily_sales - mean).sum():.10f}")

# And its defining USE: it recovers totals.
print(f"mean x n = {mean * len(daily_sales):.0f} "
      f"= total sales {daily_sales.sum()}")`,
    scenario: {
      title: 'Average revenue per store day',
      problem: 'Finance projects monthly revenue from a week of daily sales figures.',
      dataset: 'Seven daily sales totals including one promotional spike.',
      why: 'Projection needs the total-preserving center: mean × days = expected revenue. But the promo day inflates it — the median comparison flags this before the projection ships.',
      output: 'Mean, median, and the deviation-balance check.',
      interpretation: 'If the spike is repeatable weekly, the mean projects fine; if one-off, exclude or model it separately.',
      pitfalls: 'A single unusual day moved the mean by 35% — always look at the mean–median gap.',
    },
    mistakes: ['Mean alone on skewed data', 'Averaging averages with unequal group sizes (use the weighted mean)', 'Reporting a center without any spread'],
    tips: ['Mean–median gap is the fastest skew detector', 'Use .describe() to see mean in context', 'For totals use the mean; for "typical case" use the median'],
  },
  {
    id: 'mu', group: 'ch3', name: 'Population Mean', formula: 'μ = ΣX / N',
    tags: ['center', 'population', 'parameter'],
    overview: "The same arithmetic as the sample mean, but over the ENTIRE population — a parameter, not an estimate. In practice you rarely have all N values; μ is what X̄ estimates and what hypothesis tests make claims about.",
    variables: [['ΣX', 'sum over every member of the population'], ['N', 'population size (capital N — everyone)'], ['μ', 'the true mean — a fixed, usually unknown number']],
    thinking: {
      workflow: ['Do you truly have EVERY unit? (payroll: yes; customers-forever: no)', 'If yes: μ is computed, not estimated — no CIs needed', 'If no: compute X̄ and treat μ as the target of inference', 'Keep the notation honest — it drives which formulas apply'],
      when: ['Complete enumerations: all employees, all transactions this quarter', 'Defining the estimand in tests and intervals'],
      notWhen: ['Any sampled data — that is X̄’s job', 'The "population" is conceptually infinite (all future customers)'],
      assumptions: ['The population is fully enumerated with no missing units'],
    },
    code: `import numpy as np

# --- ALL 48 employees' salaries: a true population -------------------
rng = np.random.default_rng(1)
salaries = rng.normal(62_000, 9_000, 48).round(-2)   # every employee

mu = salaries.mean()
print(f"population mean mu = {mu:,.0f}  (a FACT, no uncertainty)")

# Contrast: a sample of 10 gives an ESTIMATE with sampling error
sample = rng.choice(salaries, size=10, replace=False)
print(f"one sample's X-bar = {sample.mean():,.0f}")
print(f"another's          = "
      f"{rng.choice(salaries, 10, replace=False).mean():,.0f}")
# X-bar varies sample to sample; mu never moves. That distinction is
# the entire reason inference (Ch 6-8) exists.`,
    scenario: {
      title: 'Company-wide salary benchmarking',
      problem: 'HR reports the average salary for the annual pay-equity filing.',
      dataset: 'The complete payroll — every employee, no sampling.',
      why: 'With the full population, μ is simply computed; confidence intervals would be meaningless decoration.',
      output: 'The exact population mean.',
      interpretation: 'Comparisons against industry survey means must remember the survey side is an estimate with error — yours is not.',
      pitfalls: 'Calling a convenience subset a "population" smuggles in sampling error you then fail to report.',
    },
    mistakes: ['Putting a confidence interval on a full-population mean', 'Treating a big sample as if bigness made it the population', 'Mixing N (population) and n (sample) in later formulas'],
    tips: ['Ask "could I list every unit?" — that decides μ vs X̄', 'Notation discipline (μ, σ, N vs X̄, s, n) prevents formula mix-ups downstream', 'Census data = describe; sample data = infer'],
  },
  {
    id: 'grp_mean', group: 'ch3', name: 'Grouped Mean', formula: 'X̄ = Σ(f · Xm) / n',
    tags: ['grouped data', 'mean', 'frequency'],
    overview: "The mean when data arrives as a frequency table: pretend everyone in a class sits at its midpoint, weight by class counts, and average. The best recoverable estimate when raw values are gone.",
    variables: [['f', 'frequency of each class'], ['Xm', 'class midpoint'], ['n', 'Σf — total observations']],
    thinking: {
      workflow: ['Frequency table with class intervals in hand', 'Compute midpoints', 'Weight each midpoint by its class count and average', 'State the grouping assumption in the write-up'],
      when: ['Only binned/published tables exist (census, survey brackets)', 'Reconstructing summaries from historical grouped reports'],
      notWhen: ['Raw data exists — grouping throws away information for nothing', 'Open-ended classes dominate the total'],
      assumptions: ['Observations spread evenly within each class (midpoint represents them)', 'Class boundaries are exact and non-overlapping'],
    },
    code: `import pandas as pd

# --- published age table for a customer base -------------------------
tbl = pd.DataFrame({
    "class": ["18-25", "26-35", "36-45", "46-55", "56-70"],
    "lower": [18, 26, 36, 46, 56],
    "upper": [25, 35, 45, 55, 70],
    "f":     [42, 88, 65, 31, 14],
})
tbl["Xm"] = (tbl["lower"] + tbl["upper"]) / 2

n = tbl["f"].sum()
grouped_mean = (tbl["f"] * tbl["Xm"]).sum() / n
print(tbl[["class", "Xm", "f"]])
print(f"n = {n},  grouped mean age = {grouped_mean:.1f}")

# How good is the approximation? Simulate raw ages consistent with the
# table and compare:
import numpy as np
rng = np.random.default_rng(0)
raw = np.concatenate([rng.uniform(lo, hi, f) for lo, hi, f
                      in tbl[["lower", "upper", "f"]].values])
print(f"raw-data mean (simulated): {raw.mean():.1f} "
      f"-> grouping cost ~{abs(raw.mean()-grouped_mean):.2f} years")`,
    scenario: {
      title: 'Market sizing from published census brackets',
      problem: 'A startup estimates the average age of its target region using only the census age-bracket table.',
      dataset: 'Published age classes with counts — raw ages unavailable by design.',
      why: 'The grouped mean is the standard, defensible estimator when privacy-protected data only ships in brackets.',
      output: 'A weighted-midpoint mean age.',
      interpretation: 'Good to a fraction of a year for planning purposes — the write-up notes the even-spread assumption.',
      pitfalls: 'Wide classes + skew inside classes bias the estimate; the top open bracket needs an assumed ceiling.',
    },
    mistakes: ['Averaging midpoints WITHOUT frequency weights', 'Using class limits instead of boundaries', 'Reporting more precision than grouping supports'],
    tips: ['It is exactly a weighted mean with weights f — one np.average(mid, weights=f) call', 'Sensitivity-check assumptions on the widest classes', 'Same skeleton powers grouped variance next'],
  },
  {
    id: 'wmean', group: 'ch3', name: 'Weighted Mean', formula: 'X̄ = ΣwX / Σw',
    tags: ['mean', 'weights', 'gpa', 'aggregation'],
    overview: "A mean where observations count unequally: each value is multiplied by its weight, and the total is divided by the total weight. GPAs, portfolio returns, blended costs, survey estimates — all weighted means.",
    variables: [['w', 'weight of each observation (credits, dollars, sampling weights)'], ['X', 'the values being averaged'], ['Σw', 'total weight — the denominator']],
    thinking: {
      workflow: ['Ask: do observations deserve equal say?', 'Identify the natural weight (size, credits, dollars, inverse sampling probability)', 'Multiply, sum, divide by total weight', 'Sanity-check against the unweighted mean — the gap tells the story'],
      when: ['Combining group means with unequal group sizes', 'Portfolio/blended metrics where dollars are the fair weight', 'Survey estimates with design weights'],
      notWhen: ['All units genuinely count equally', 'Weights are arbitrary knobs (they must be defensible)'],
      assumptions: ['Weights reflect true relative importance', 'Weights are non-negative and not all zero'],
    },
    code: `import numpy as np
import pandas as pd

# --- GPA: the canonical weighted mean --------------------------------
courses = pd.DataFrame({
    "course": ["Calculus", "Statistics", "History", "Lab"],
    "grade_points": [3.7, 4.0, 3.0, 3.3],
    "credits": [4, 3, 3, 1],
})
gpa = np.average(courses["grade_points"], weights=courses["credits"])
print(f"GPA = {gpa:.2f}  (unweighted would be "
      f"{courses['grade_points'].mean():.2f})")

# --- blended portfolio return: dollars are the weights ---------------
funds = pd.DataFrame({"return_pct": [8.2, 3.1, 12.5],
                      "invested":  [50_000, 30_000, 20_000]})
blended = np.average(funds["return_pct"], weights=funds["invested"])
print(f"portfolio return = {blended:.2f}%")

# --- combining branch averages fairly --------------------------------
branches = pd.DataFrame({"avg_ticket": [42.0, 55.0], "n_orders": [1200, 300]})
overall = np.average(branches["avg_ticket"], weights=branches["n_orders"])
print(f"true overall avg ticket = {overall:.2f} "
      f"(naive mean of means: {branches['avg_ticket'].mean():.2f})")`,
    scenario: {
      title: 'Combining store averages into a company metric',
      problem: 'HQ wants the company-wide average order value from per-store averages.',
      dataset: 'Each store’s average ticket and its order count.',
      why: 'Stores differ 4× in volume; the naive mean of means overweights small stores. Weighting by order count recovers the true overall average exactly.',
      output: 'The order-weighted company average.',
      interpretation: 'The 2-dollar gap between naive and weighted versions is pure aggregation bias — real money at scale.',
      pitfalls: 'This exact error (averaging averages) is among the most common dashboard bugs in industry.',
    },
    mistakes: ['Averaging group averages without size weights', 'Using weights that don’t sum sensibly or go negative', 'Confusing frequency weights with sampling (design) weights in surveys'],
    tips: ['np.average(x, weights=w) — one call, no manual loop', 'The grouped mean is just this with f as weights', 'When weights are dollars, you are computing a value-weighted metric — say so explicitly'],
  },
  {
    id: 'midrange', group: 'ch3', name: 'Midrange', formula: 'MR = (Lowest + Highest) / 2',
    tags: ['center', 'quick', 'rough'],
    overview: "The midpoint between the extremes. The quickest possible center estimate — computed from exactly the two least stable observations in the data, which is why it is a rough check, never a headline number.",
    variables: [['Lowest', 'minimum value'], ['Highest', 'maximum value'], ['MR', 'their midpoint']],
    thinking: {
      workflow: ['Need an instant, back-of-envelope center', 'Average min and max', 'Compare with mean/median — big disagreement = skew or outliers', 'Switch to a proper center for anything that matters'],
      when: ['Rapid field checks (temperature spans, sensor windows)', 'Teaching sensitivity to outliers by contrast'],
      notWhen: ['Any outlier-prone data', 'Formal reporting of central tendency'],
      assumptions: ['Extremes are genuine and roughly symmetric around the center'],
    },
    code: `import numpy as np

temps = np.array([61, 64, 66, 67, 69, 71, 73, 75])   # hourly °F

midrange = (temps.min() + temps.max()) / 2
print(f"midrange = ({temps.min()} + {temps.max()}) / 2 = {midrange}")
print(f"mean = {temps.mean():.1f}, median = {np.median(temps):.1f}  "
      f"-> all agree: symmetric data")

# Now inject one sensor glitch:
temps_bad = np.append(temps, 140)
print(f"with one glitch: midrange = "
      f"{(temps_bad.min() + temps_bad.max())/2:.1f}  "
      f"(mean {temps_bad.mean():.1f}, median {np.median(temps_bad):.1f})")
# The midrange moved the most - it depends ONLY on the extremes.`,
    scenario: {
      title: 'HVAC quick check on daily temperature',
      problem: 'A facilities tech wants a one-second summary of today’s temperature band midpoint.',
      dataset: 'Hourly sensor readings.',
      why: 'Min and max are on the sensor display; their midpoint is the fastest available "center of the band."',
      output: 'The midrange, cross-checked against the mean.',
      interpretation: 'On clean symmetric data it matches the mean; disagreement flags either a glitchy reading or an asymmetric day.',
      pitfalls: 'One stuck-sensor spike wrecks it — its fragility is double the range’s (both endpoints matter).',
    },
    mistakes: ['Using the midrange as a formal center', 'Not asking whether extremes are sensor errors', 'Confusing midrange (center) with range (spread)'],
    tips: ['Fine as a mental-math check, nothing more', 'Disagreement with the median is diagnostic, not decorative', 'On truly uniform data it is actually efficient — the one niche it wins'],
  },
  {
    id: 'pop_var', group: 'ch3', name: 'Population Variance', formula: 'σ² = Σ(X−μ)² / N',
    tags: ['spread', 'variance', 'population'],
    overview: "The average squared distance from the population mean. Squaring makes every deviation positive and punishes big misses disproportionately — the mathematical bedrock under SD, z-scores, ANOVA, and regression.",
    variables: [['X−μ', 'each member’s deviation from the population mean'], ['N', 'population size — divide by N, not N−1, when you have everyone'], ['σ²', 'variance, in squared units']],
    thinking: {
      workflow: ['Confirm you truly hold the whole population', 'Compute μ, then average the squared deviations (÷N)', 'Take √ for the SD to return to natural units', 'Use σ² for math, σ for communication'],
      when: ['Complete enumerations where spread itself is the parameter', 'Defining the σ² that inference formulas reference'],
      notWhen: ['Sampled data — use the n−1 sample version', 'Heavy outliers you have not vetted (squares amplify them)'],
      assumptions: ['Full population in hand', 'Interval/ratio scale'],
    },
    code: `import numpy as np

# --- all 30 machines' cycle times: the full population ---------------
rng = np.random.default_rng(2)
cycle = rng.normal(52, 4, 30).round(1)       # every machine on the floor

mu = cycle.mean()
dev = cycle - mu
var_pop = (dev ** 2).sum() / len(cycle)      # divide by N
print(f"mu = {mu:.2f}s")
print(f"population variance sigma^2 = {var_pop:.2f} s^2")
print(f"numpy ddof=0 agrees: {cycle.var(ddof=0):.2f}")
print(f"population SD sigma = {np.sqrt(var_pop):.2f} s  (natural units)")

# Why squared? big misses dominate:
print(f"largest |dev| contributes "
      f"{(dev**2).max()/ (dev**2).sum():.0%} of total variance")`,
    scenario: {
      title: 'Machine-fleet consistency audit',
      problem: 'Plant engineering quantifies cycle-time spread across ALL machines to set a consistency KPI.',
      dataset: 'One cycle-time reading per machine, whole fleet.',
      why: 'The fleet is the complete population, so σ² is the parameter itself — the KPI baseline future fleets get compared against.',
      output: 'σ² (and σ) for the fleet.',
      interpretation: 'A later fleet with higher σ² is objectively less consistent, whatever its mean.',
      pitfalls: 'ddof confusion: numpy defaults to ddof=0 (population), pandas to ddof=1 (sample) — know which you asked for.',
    },
    mistakes: ['Dividing by N−1 on a true population (or N on a sample)', 'Interpreting squared units directly ("52 seconds-squared" means nothing physical)', 'Mixing numpy/pandas ddof defaults blindly'],
    tips: ['np.var(x, ddof=0) = population, ddof=1 = sample — be explicit always', 'Report σ, keep σ² for the math', 'Variances add for independent sources; SDs do not — do the math in variance space'],
  },
  {
    id: 'samp_var', group: 'ch3', name: 'Sample Variance', formula: 's² = [n(ΣX²)−(ΣX)²] / [n(n−1)]',
    tags: ['spread', 'variance', 'sample', 'bessel'],
    overview: "Variance estimated from a sample, divided by n−1 (Bessel's correction) because deviations are measured from X̄ — which sits closer to the sample than μ does, making raw squared deviations too small on average. The computational form shown avoids two passes over the data.",
    variables: [['ΣX², (ΣX)²', 'sum of squares vs square of sum — the classic exam trap'], ['n−1', 'degrees of freedom — one spent estimating X̄'], ['s²', 'unbiased estimate of σ²']],
    thinking: {
      workflow: ['Sampled data → sample formulas, period', 'Compute s² with n−1 (software: ddof=1)', 'Take √ for s in natural units', 'Feed s into SEs, CIs, and t-tests downstream'],
      when: ['Any spread estimate from sampled data', 'Inputs to t-tests, CIs, control charts'],
      notWhen: ['A complete population (÷N applies)', 'Robust needs under outliers (IQR/MAD instead)'],
      assumptions: ['Observations independent and identically distributed', 'Interval/ratio scale'],
    },
    code: `import numpy as np

sample = np.array([12.1, 11.8, 12.5, 12.0, 12.7, 11.6, 12.3, 12.2])

# --- the computational (one-pass) form -------------------------------
n = len(sample)
sum_x, sum_x2 = sample.sum(), (sample ** 2).sum()
s2 = (n * sum_x2 - sum_x ** 2) / (n * (n - 1))
print(f"s^2 (computational form) = {s2:.4f}")
print(f"numpy ddof=1             = {sample.var(ddof=1):.4f}")
print(f"s = {np.sqrt(s2):.3f}")

# --- WHY n-1: simulation proof that /n underestimates ----------------
rng = np.random.default_rng(0)
true_var = 9.0
est_n, est_n1 = [], []
for _ in range(20_000):
    s = rng.normal(0, 3, 6)                # small samples of a var-9 pop
    est_n.append(s.var(ddof=0))
    est_n1.append(s.var(ddof=1))
print(f"avg estimate dividing by n  : {np.mean(est_n):.2f}  (biased low)")
print(f"avg estimate dividing by n-1: {np.mean(est_n1):.2f}  (~{true_var})")`,
    scenario: {
      title: 'Fill-weight consistency from a line sample',
      problem: 'QA samples 8 bottles per hour and must estimate fill-weight variability for control limits.',
      dataset: 'Hourly samples of 8 fill weights.',
      why: 'It is a sample, so σ² must be estimated without bias — n−1 does exactly that, and s feeds the control chart limits.',
      output: 's² and s per hourly sample.',
      interpretation: 'Rising s across hours = the process is loosening even if means stay centered — act before specs are breached.',
      pitfalls: 'With n=8 the ÷n version underestimates variance by ~12% — control limits set too tight, false alarms follow.',
    },
    mistakes: ['ddof=0 on samples (numpy’s silent default!)', 'Confusing ΣX² with (ΣX)² in hand calculations', 'Reporting s² (squared units) where s belongs'],
    tips: ['pandas .var()/.std() already use n−1; numpy needs ddof=1 — memorize this asymmetry', 'The computational form is for calculators; in code just use ddof=1', 'The simulation above is the fastest way to convince a skeptic about n−1'],
  },
  {
    id: 'pop_sd', group: 'ch3', name: 'Population SD', formula: 'σ = √[Σ(X−μ)²/N]',
    tags: ['spread', 'standard deviation', 'population'],
    overview: "The square root of population variance — spread expressed back in the data’s own units. The σ in z-scores, the Empirical Rule, control charts, and every 'within one standard deviation' sentence ever spoken.",
    variables: [['σ²', 'population variance (squared units)'], ['σ', 'its square root — typical distance from μ in natural units']],
    thinking: {
      workflow: ['Have the full population and its μ', 'Compute variance (÷N), then √', 'Interpret via the Empirical Rule if roughly bell-shaped', 'Use σ to standardize (z-scores) and set limits'],
      when: ['Complete data where σ anchors z-scores and process limits', 'Communicating spread in the units people think in'],
      notWhen: ['Samples (use s)', 'Skewed/outlier-ridden data where ±σ statements mislead'],
      assumptions: ['Full population', 'For the 68–95–99.7 reading: approximate normality'],
    },
    code: `import numpy as np

# --- an entire graduating class's exam scores ------------------------
rng = np.random.default_rng(3)
scores = np.clip(rng.normal(74, 9, 220), 0, 100)   # all 220 students

mu, sigma = scores.mean(), scores.std(ddof=0)      # population: ddof=0
print(f"mu = {mu:.1f}, sigma = {sigma:.1f} points")

# Empirical Rule check (valid because scores are ~bell-shaped):
for k, expect in [(1, 68), (2, 95), (3, 99.7)]:
    within = np.mean(np.abs(scores - mu) <= k * sigma) * 100
    print(f"within {k} sigma: {within:5.1f}%  (rule says ~{expect}%)")

# sigma powers standardization:
top_score = scores.max()
print(f"best score {top_score:.0f} sits "
      f"{(top_score - mu)/sigma:.2f} SDs above the mean")`,
    scenario: {
      title: 'School-wide exam consistency',
      problem: 'A principal reports both typical performance and its spread for the entire cohort.',
      dataset: 'Every student’s score — a full population.',
      why: 'σ turns "spread" into points-on-the-test language and enables the 68-95-99.7 summary parents actually understand.',
      output: 'μ ± σ with Empirical-Rule coverage checks.',
      interpretation: '"Most students (≈95%) scored between 56 and 92" — one sentence, fully quantified.',
      pitfalls: 'If the distribution were skewed, the ±σ sentence would overpromise symmetry that isn’t there.',
    },
    mistakes: ['ddof mix-ups (population vs sample yet again)', 'Empirical-Rule statements on clearly non-normal data', 'Comparing σ across variables with different units (that is CVar’s job)'],
    tips: ['σ is for people, σ² is for math', 'Verify rough normality before quoting 68–95–99.7', 'Chebyshev covers the non-normal case with weaker but universal bounds'],
  },
  {
    id: 'samp_sd', group: 'ch3', name: 'Sample SD', formula: 's = √{[n(ΣX²)−(ΣX)²]/[n(n−1)]}',
    tags: ['spread', 'standard deviation', 'sample'],
    overview: "The square root of sample variance — the workhorse spread estimate from sampled data, and the s inside t-statistics, confidence intervals, and standard errors. Same n−1 logic as s², same natural-units payoff as σ.",
    variables: [['s²', 'sample variance (n−1 denominator)'], ['s', 'its root — estimated typical deviation from X̄']],
    thinking: {
      workflow: ['Sampled numeric data', 'Compute s with ddof=1', 'Pair with X̄ in every report (center + spread)', 'Feed s/√n into standard errors for inference'],
      when: ['Any sample-based spread report', 'Building CIs and t-tests (s is the ingredient)'],
      notWhen: ['Full populations (σ applies)', 'Outlier-heavy data — consider IQR/MAD alongside'],
      assumptions: ['i.i.d. sample', 'Interval/ratio data'],
    },
    code: `import numpy as np
from scipy import stats

# --- response-time sample from a web service -------------------------
rng = np.random.default_rng(4)
latency_ms = rng.gamma(shape=9, scale=12, size=40)   # a 40-request sample

xbar, s = latency_ms.mean(), latency_ms.std(ddof=1)
print(f"X-bar = {xbar:.1f} ms,  s = {s:.1f} ms,  n = {len(latency_ms)}")

# s immediately powers the standard error and a t-interval:
sem = s / np.sqrt(len(latency_ms))
ci = stats.t.interval(0.95, df=len(latency_ms)-1, loc=xbar, scale=sem)
print(f"SE = {sem:.2f} ms -> 95% CI for mean latency: "
      f"({ci[0]:.1f}, {ci[1]:.1f}) ms")

# Robust companion when the tail is heavy (gamma is right-skewed):
q1, q3 = np.percentile(latency_ms, [25, 75])
print(f"IQR = {q3 - q1:.1f} ms   (outlier-resistant cross-check)")`,
    scenario: {
      title: 'API latency monitoring',
      problem: 'An SRE team characterizes response-time variability from a sampled window to set alerting thresholds.',
      dataset: 'A 40-request latency sample from the last hour.',
      why: 's summarizes jitter in milliseconds and directly feeds the SE/CI that separate real regressions from sampling noise.',
      output: 'X̄, s, SE, and a 95% CI for mean latency.',
      interpretation: 'A deploy that shifts the mean outside this CI band deserves a look; inside it is noise.',
      pitfalls: 'Latency is right-skewed — s understates tail pain; track p95/p99 alongside.',
    },
    mistakes: ['numpy’s ddof=0 default sneaking into sample work', 'Center-only reports (X̄ without s)', 'Using s±rules on heavily skewed metrics without comment'],
    tips: ['Report X̄ ± s, n — always the trio', 'scipy.stats.sem(x) computes s/√n directly', 'For skewed ops metrics, quote percentiles with s as a supplement'],
  },
  {
    id: 'grp_sd', group: 'ch3', name: 'Grouped SD', formula: 's = √{[n(Σf·Xm²)−(Σf·Xm)²]/[n(n−1)]}',
    tags: ['grouped data', 'spread', 'frequency'],
    overview: "Sample SD reconstructed from a frequency table: midpoints stand in for raw values, frequencies weight them, and the same computational form applies. The spread companion to the grouped mean.",
    variables: [['f', 'class frequency'], ['Xm', 'class midpoint'], ['Σf·Xm²', 'frequency-weighted sum of squared midpoints'], ['n', 'Σf']],
    thinking: {
      workflow: ['Grouped table with midpoints ready', 'Compute Σf·Xm and Σf·Xm²', 'Apply the computational form with n−1', 'Report with the grouped mean, noting the approximation'],
      when: ['Spread estimates from published/binned tables', 'Historical reports where raw data no longer exists'],
      notWhen: ['Raw data available', 'Very wide classes (within-class spread is invisible to the formula)'],
      assumptions: ['Within-class values cluster at midpoints (slightly UNDERSTATES true spread)', 'Consistent class boundaries'],
    },
    code: `import numpy as np
import pandas as pd

tbl = pd.DataFrame({
    "lower": [10, 20, 30, 40, 50],
    "upper": [20, 30, 40, 50, 60],   # minutes
    "f":     [6, 14, 22, 10, 4],
})
tbl["Xm"] = (tbl["lower"] + tbl["upper"]) / 2

n = tbl["f"].sum()
sum_fx = (tbl["f"] * tbl["Xm"]).sum()
sum_fx2 = (tbl["f"] * tbl["Xm"] ** 2).sum()

s2 = (n * sum_fx2 - sum_fx ** 2) / (n * (n - 1))
print(f"grouped mean = {sum_fx/n:.2f} min")
print(f"grouped s    = {np.sqrt(s2):.2f} min  (n = {n})")

# Equivalent modern one-liner: expand midpoints by frequency.
# .astype(int) keeps this portable — np.repeat requires a platform-native
# integer count, and a pandas int64 column raises a cast error on 32-bit
# targets (Windows, and WebAssembly runtimes like Pyodide).
expanded = np.repeat(tbl["Xm"].values, tbl["f"].values.astype(int))
print(f"check via repeat: s = {expanded.std(ddof=1):.2f}")`,
    scenario: {
      title: 'Commute-time spread from a survey table',
      problem: 'A city planner has only the published commute-time bracket table but needs spread for a congestion model.',
      dataset: 'Commute-time classes with counts.',
      why: 'The grouped formulas are the only route to mean AND spread when raw times were never released.',
      output: 'Grouped mean and SD in minutes.',
      interpretation: 'The SD calibrates how widely commutes vary around the typical — feeding capacity buffers in the model.',
      pitfalls: 'Midpoint substitution hides within-class spread, so the grouped s runs slightly low — say so.',
    },
    mistakes: ['Forgetting to weight by f in either sum', 'Squaring Σf·Xm instead of summing f·Xm²', 'Treating the result as exact rather than approximate'],
    tips: ['np.repeat(midpoints, f) then .std(ddof=1) is the least error-prone route', 'Same table drives mean and SD — compute both at once', 'Note the understatement bias in any formal write-up'],
  },
  {
    id: 'cvar', group: 'ch3', name: 'Coeff. of Variation', formula: 'CVar = (s/X̄)×100',
    tags: ['relative spread', 'comparison', 'risk'],
    overview: "Spread as a percentage of the mean — the unit-free way to compare variability across different scales. 'Is delivery time more variable than order value?' is unanswerable in raw SDs and trivial in CVar.",
    variables: [['s', 'sample SD'], ['X̄', 'sample mean'], ['CVar', 'relative spread, in %']],
    thinking: {
      workflow: ['Two+ variables (or groups) on different scales/units', 'Compute s/X̄ per variable, ×100', 'Compare CVars directly — units cancel', 'Investigate whichever process is proportionally noisiest'],
      when: ['Cross-unit comparisons (ms vs dollars vs kg)', 'Cross-scale comparisons (penny stock vs index)', 'Finance: risk per unit of expected return'],
      notWhen: ['Mean near zero (CVar explodes meaninglessly)', 'Data with negative values (ratio loses meaning)', 'Interval scales without a true zero (Celsius!)'],
      assumptions: ['Ratio-scale data with a meaningful zero', 'A mean far enough from zero to divide by honestly'],
    },
    code: `import numpy as np

rng = np.random.default_rng(5)
order_value = rng.gamma(4, 25, 500)          # dollars, mean ~100
delivery_time = rng.normal(45, 4, 500)       # minutes, mean ~45

for name, x in [("order value ($)", order_value),
                ("delivery time (min)", delivery_time)]:
    cv = x.std(ddof=1) / x.mean() * 100
    print(f"{name:20s} mean={x.mean():7.1f}  s={x.std(ddof=1):5.1f}  "
          f"CVar={cv:5.1f}%")
# Raw SDs (25 vs 4) suggest orders vary more - but relative to their
# scales, orders are ~50% CV vs ~9%: order value is BY FAR the noisier
# process, and the SD comparison alone was meaningless across units.

# Finance flavor: risk per unit return
returns = {"Fund A": (8.0, 12.0), "Fund B": (5.0, 4.0)}   # (mean%, sd%)
for f, (m, s) in returns.items():
    print(f"{f}: CVar = {s/m*100:.0f}%  (risk per unit of return)")`,
    scenario: {
      title: 'Stock vs bond fund risk comparison',
      problem: 'An advisor compares volatility of funds whose average returns differ several-fold.',
      dataset: 'Historical mean return and SD per fund.',
      why: 'Raw SD punishes the higher-return fund unfairly; CVar asks "how much risk per unit of return?" — the comparable quantity.',
      output: 'CVar per fund.',
      interpretation: 'Fund B’s 80% CVar vs A’s 150% says B delivers its (smaller) return more reliably.',
      pitfalls: 'A fund with near-zero mean return produces an absurd CVar — check the denominator first.',
    },
    mistakes: ['CVar on Celsius/pH or anything without a true zero', 'Using it when the mean hovers near zero', 'Comparing CVars computed over different time windows'],
    tips: ['scipy.stats.variation(x) computes it directly', 'Great single KPI for "process consistency" dashboards', 'In finance, its reciprocal-cousin is the Sharpe-style reward-to-risk view'],
  },
  {
    id: 'rrt', group: 'ch3', name: 'Range Rule of Thumb', formula: 's ≈ Range / 4',
    tags: ['approximation', 'quick', 'spread'],
    overview: "A pocket estimate: most bell-shaped data lives within ±2 SDs, so the range spans about 4 of them — divide by 4 and you have a rough s. For sanity checks and sizing guesses only, never analysis.",
    variables: [['Range', 'max − min'], ['4', '≈ number of SDs the range spans under bell-shaped data'], ['s (approx)', 'the eyeball estimate']],
    thinking: {
      workflow: ['Need an SD guess with only min/max known', 'Divide range by 4', 'Use it to sanity-check computed SDs or size a study roughly', 'Replace with a real s as soon as data allows'],
      when: ['Sample-size planning before any data exists (only a plausible range known)', 'Spot-checking whether a computed s is in a sane ballpark'],
      notWhen: ['The real data is sitting right there (just compute s)', 'Skewed or outlier-laden data (the ±2σ logic collapses)'],
      assumptions: ['Roughly bell-shaped distribution', 'n large enough that extremes approach ±2σ (rule degrades for small/huge n)'],
    },
    code: `import numpy as np

rng = np.random.default_rng(6)

# How good is /4 across sample sizes? (normal data)
for n in [10, 30, 100, 1000]:
    x = rng.normal(50, 8, n)                # true sigma = 8
    approx = (x.max() - x.min()) / 4
    print(f"n={n:5d}  range/4 = {approx:5.2f}   real s = "
          f"{x.std(ddof=1):5.2f}   (true sigma 8)")
# Decent near n~100; too small for tiny n, too big for huge n
# (extremes keep stretching as n grows).

# Its legitimate job - pre-study planning:
# "Scores will plausibly span 40 to 95" -> s ~ (95-40)/4 ~ 13.75
guess = (95 - 40) / 4
z, E = 1.96, 3                               # 95% CI, +/-3-point margin
n_needed = (z * guess / E) ** 2
print(f"planning guess s~{guess:.1f} -> need n ~ {np.ceil(n_needed):.0f}")`,
    scenario: {
      title: 'Sample-size planning before a survey exists',
      problem: 'A researcher must budget a survey but has no pilot data — only a plausible score range from the literature.',
      dataset: 'None yet; just an expected min and max.',
      why: 'The sample-size formula needs some σ; range/4 turns a defensible range guess into a usable one.',
      output: 'A planning-grade s and the resulting n.',
      interpretation: '"~80 respondents" is a budget number, refined after a pilot provides a real s.',
      pitfalls: 'The estimate inherits every flaw of your range guess — state it as an assumption, not a finding.',
    },
    mistakes: ['Using range/4 when data exists', 'Applying it to skewed distributions', 'Forgetting it systematically over/under-shoots at extreme n'],
    tips: ['Strictly a planning and sanity-check device', 'Pair with a pilot study as soon as possible', 'If a computed s differs wildly from range/4, investigate — someone’s wrong'],
  },
  {
    id: 'cheby', group: 'ch3', name: "Chebyshev's Theorem", formula: 'P(within k·σ) ≥ 1 − 1/k²',
    tags: ['bounds', 'any distribution', 'spread'],
    overview: "A guarantee that holds for EVERY distribution, however weird: at least 1−1/k² of data lies within k SDs of the mean. Weaker than the Empirical Rule (75% vs 95% at k=2) precisely because it assumes nothing.",
    variables: [['k', 'number of SDs from the mean (k>1)'], ['1−1/k²', 'the guaranteed minimum coverage'], ['μ±kσ', 'the interval the guarantee covers']],
    thinking: {
      workflow: ['Distribution unknown, skewed, or nasty?', 'Use Chebyshev for worst-case coverage statements', 'k=2 → ≥75%, k=3 → ≥88.9%', 'If normality checks pass, upgrade to the Empirical Rule’s tighter numbers'],
      when: ['Skewed/unknown distributions where 68-95-99.7 would lie', 'Conservative risk statements and outlier definitions', 'Auditable "at least" claims'],
      notWhen: ['Verified-normal data (Empirical Rule is far tighter)', 'k ≤ 1 (the bound is vacuous)'],
      assumptions: ['Finite mean and variance — that is literally all'],
    },
    code: `import numpy as np

rng = np.random.default_rng(7)

# Deliberately UGLY data: heavy right skew (income-like)
income = rng.lognormal(mean=10.5, sigma=0.8, size=50_000)
mu, sd = income.mean(), income.std()

print("k   Chebyshev-min   actual coverage    Empirical-Rule-would-claim")
for k in [1.5, 2, 3]:
    bound = 1 - 1 / k**2
    actual = np.mean(np.abs(income - mu) <= k * sd)
    normal_claim = {1.5: 0.866, 2: 0.954, 3: 0.997}[k]
    print(f"{k:3}   >= {bound:5.1%}       {actual:6.1%}            "
          f"{normal_claim:.1%}")
# Chebyshev's promise holds even here; the Empirical Rule's k=1.5 and
# k=2 claims would OVERSTATE coverage on this skewed data.

# The practical use - a guaranteed-coverage band:
lo, hi = mu - 2 * sd, mu + 2 * sd
print(f"[{lo:,.0f}, {hi:,.0f}] contains >= 75% of incomes, guaranteed,")
print("no normality assumption anywhere.")`,
    scenario: {
      title: 'Income-band guarantees for policy analysis',
      problem: 'An economist must state a band containing "most" household incomes without pretending income is normal (it never is).',
      dataset: 'Heavily right-skewed household incomes.',
      why: 'The Empirical Rule would overstate coverage; Chebyshev’s distribution-free floor survives peer review.',
      output: 'A μ±2σ band with a defensible ≥75% guarantee.',
      interpretation: '"At least three-quarters of households fall in this band" — weaker than 95%, but true.',
      pitfalls: 'The bound is often loose (actual coverage higher) — it is a floor, not an estimate.',
    },
    mistakes: ['Quoting Empirical-Rule numbers on skewed data', 'Using k≤1 (the bound says ≥0%, i.e., nothing)', 'Reading the floor as the expected coverage'],
    tips: ['Reach for it whenever a normality check fails', 'k=2→75%, k=3→88.9% are worth memorizing', 'Its very looseness is the price of universality — say "at least"'],
  },
  {
    id: 'zscore', group: 'ch3', name: 'z-Score', formula: 'z = (X−X̄)/s',
    tags: ['standardization', 'outliers', 'comparison'],
    overview: "How many standard deviations a value sits from the mean. The universal translator: it puts exam scores, salaries, and lab values on one scale, flags outliers (|z|>3), and underlies every normal-table lookup to come.",
    variables: [['X', 'the value being standardized'], ['X̄, s', 'the sample’s mean and SD (μ, σ for populations)'], ['z', 'signed distance from center, in SD units']],
    thinking: {
      workflow: ['Question is "how unusual?" or "which is more extreme across scales?"', 'Standardize: subtract center, divide by spread', 'Interpret sign (above/below) and magnitude (|z|>2 notable, >3 outlier-ish)', 'For normal data, convert to percentiles next'],
      when: ['Comparing across different units/scales', 'Outlier screening', 'Preprocessing for distance-based ML (KNN, k-means)'],
      notWhen: ['Tiny samples where X̄ and s are themselves shaky', 'Heavy skew — a robust z (median/MAD) screens outliers better'],
      assumptions: ['Meaningful mean and SD', 'For percentile interpretation: approximate normality'],
    },
    code: `import numpy as np
from scipy import stats

# --- who did better relative to their cohort? ------------------------
# Math exam: mean 70, sd 8. English exam: mean 82, sd 4.
math_score, eng_score = 86, 89
z_math = (math_score - 70) / 8
z_eng = (eng_score - 82) / 4
print(f"math  z = {z_math:+.2f}")
print(f"eng   z = {z_eng:+.2f}   <- higher: 89 in English is MORE unusual")

# --- vectorized standardization + outlier screen ---------------------
rng = np.random.default_rng(8)
spend = np.append(rng.normal(120, 30, 200), [890, 15])   # two oddballs
z = (spend - spend.mean()) / spend.std(ddof=1)
print(f"flagged |z|>3: {spend[np.abs(z) > 3].round(0)}")

# scipy one-liner (population ddof by default - set ddof=1 for samples):
z2 = stats.zscore(spend, ddof=1)
print(f"max |z| = {np.abs(z2).max():.1f}")`,
    scenario: {
      title: 'Cross-subject student performance',
      problem: 'A scholarship committee compares applicants’ best subjects, but every exam has a different scale and difficulty.',
      dataset: 'Each exam’s cohort mean and SD, plus the applicant’s scores.',
      why: 'z-scores are the only fair converter: "SDs above cohort mean" is comparable across any exams.',
      output: 'A z per subject per applicant.',
      interpretation: 'z=+1.75 in English beats z=+2.00? No — larger z wins; the raw 89 vs 86 comparison was the illusion.',
      pitfalls: 'If one cohort is tiny, its s is unstable and its z-scores overconfident.',
    },
    mistakes: ['Comparing raw scores across different scales', 'Population vs sample s mix-ups inside z', 'Hard |z|>3 rules on skewed data (use robust variants)'],
    tips: ['stats.zscore for arrays; remember ddof=1 for samples', '|z|>2 = worth a look, |z|>3 = investigate', 'Standardizing features is exactly this formula applied column-wise'],
  },
  {
    id: 'pctile', group: 'ch3', name: 'Percentile Rank', formula: 'PR = [(#below + 0.5)/n] × 100',
    tags: ['position', 'rank', 'percentile'],
    overview: "What percent of the data falls below a given value (the +0.5 splits ties fairly). The natural language of standardized tests, growth charts, and latency SLOs — position without any distribution assumption.",
    variables: [['#below', 'count of observations strictly below X'], ['+0.5', 'half-credit for the value itself (tie handling)'], ['PR', 'percentile rank, 0–100']],
    thinking: {
      workflow: ['Question is "where does this value stand?"', 'Count values below, add half the ties, divide by n', 'Report as "better than PR% of the group"', 'For repeated use, store the sorted data or empirical CDF'],
      when: ['Standings and report cards (tests, growth charts)', 'Skewed data where means mislead (latency, income)', 'SLOs: p95/p99 language'],
      notWhen: ['Tiny n (percentile grid is too coarse to mean much)', 'You need the value AT a percentile (that is the inverse operation)'],
      assumptions: ['Observations are comparable and independent', 'Ties handled consistently (the 0.5 convention)'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(9)
scores = rng.normal(500, 100, 2400).round(0)     # SAT-ish cohort

student = 640
below = np.sum(scores < student)
ties = np.sum(scores == student)
pr = (below + 0.5 * ties) / len(scores) * 100
print(f"score {student}: percentile rank = {pr:.1f}")

# scipy implements the conventions directly:
print(f"scipy 'mean' method: "
      f"{stats.percentileofscore(scores, student, kind='mean'):.1f}")

# The ops flavor - where does 480ms sit in a latency distribution?
latency = rng.gamma(4, 60, 10_000)
print(f"480ms is at p{stats.percentileofscore(latency, 480):.0f} "
      f"of observed latencies")`,
    scenario: {
      title: 'Standardized test reporting',
      problem: 'A testing service reports each student’s standing, not just a raw score whose difficulty varies by year.',
      dataset: 'The full cohort’s scores per administration.',
      why: 'Percentile rank self-normalizes across easier/harder years — "83rd percentile" means the same thing every year.',
      output: 'A PR per student per test date.',
      interpretation: '"Better than 83% of test-takers" — parents understand it instantly, no SDs required.',
      pitfalls: 'Percentile compression near the middle: 10 raw points can be 15 percentile points mid-pack but 2 at the tails.',
    },
    mistakes: ['Forgetting tie handling and biasing ranks at common scores', 'Comparing PRs across different reference groups silently', 'Averaging percentile ranks as if they were interval-scaled'],
    tips: ['stats.percentileofscore handles the conventions', 'State the reference group in every PR you publish', 'PRs are ordinal — medians of PRs are fine, means are dubious'],
  },
  {
    id: 'c_val', group: 'ch3', name: 'Value at Percentile', formula: 'position c = n·p/100 (then interpolate)',
    tags: ['position', 'quantile', 'percentile'],
    overview: "The inverse of percentile rank: given p, find the VALUE below which p% of data falls. Cut scores, SLO thresholds, growth-chart curves — all are values-at-percentiles, computed by locating position n·p/100 in the sorted data.",
    variables: [['p', 'target percentile (e.g., 90)'], ['c', 'position index n·p/100 in the sorted sample'], ['quantile', 'the resulting data value (after an interpolation convention)']],
    thinking: {
      workflow: ['Decide the percentile the decision needs (p90 latency, p25 income…)', 'Sort data, locate position n·p/100, interpolate per convention', 'Quote the convention if n is small (methods disagree there)', 'Automate with np.percentile/np.quantile'],
      when: ['Setting thresholds: SLOs, cut scores, bonus lines', 'Robust summaries of skewed data (median = p50, IQR = p75−p25)'],
      notWhen: ['n so small that neighboring conventions give very different answers (report ranges)', 'You actually wanted the RANK of a known value (the forward operation)'],
      assumptions: ['Data sorted and comparable', 'An interpolation convention chosen and stated'],
    },
    code: `import numpy as np

rng = np.random.default_rng(10)
latency = rng.gamma(4, 60, 10_000)          # right-skewed, like real life

# The workhorse call:
p50, p90, p99 = np.percentile(latency, [50, 90, 99])
print(f"p50={p50:.0f}ms  p90={p90:.0f}ms  p99={p99:.0f}ms")
print(f"(mean={latency.mean():.0f}ms - between p50 and p90: skew at work)")

# What the formula does under the hood, by hand:
x = np.sort(latency)
n, p = len(x), 90
c = n * p / 100                    # position
lo = int(np.floor(c)) - 1          # zero-based neighbors
frac = c - np.floor(c)
by_hand = x[lo] + frac * (x[lo + 1] - x[lo])
print(f"hand-computed p90 = {by_hand:.0f}ms")

# Convention sensitivity matters at small n:
small = np.sort(rng.gamma(4, 60, 9))
for m in ["linear", "lower", "higher", "nearest"]:
    print(f"n=9 p90 ({m:7s}) = "
          f"{np.percentile(small, 90, method=m):.0f}ms")`,
    scenario: {
      title: 'Setting a p99 latency SLO',
      problem: 'A platform team must commit to a latency number that 99% of requests will beat.',
      dataset: 'A day of request latencies.',
      why: 'The SLO IS a value-at-percentile; means are useless for tail promises on skewed latency data.',
      output: 'p50/p90/p99 values; the p99 becomes the SLO with margin.',
      interpretation: '"99% of requests complete under 610ms" — the promise customers actually experience.',
      pitfalls: 'p99 from a single calm day underestimates tail behavior — compute over representative traffic including peaks.',
    },
    mistakes: ['Quoting means where tails matter', 'Ignoring interpolation conventions at small n', 'Estimating extreme percentiles (p99.9) from too little data'],
    tips: ['np.percentile(x, [list]) computes many at once', 'You need roughly ≥100/(100−p) points for percentile p to be estimable at all', 'Track percentiles over time — tail drift is the early warning'],
  },
  {
    id: 'iqr', group: 'ch3', name: 'IQR', formula: 'IQR = Q3 − Q1',
    tags: ['robust spread', 'outliers', 'boxplot'],
    overview: "The span of the middle 50% of the data — a spread measure that outliers cannot touch, and the engine of the 1.5×IQR outlier fences and every boxplot ever drawn.",
    variables: [['Q1', '25th percentile'], ['Q3', '75th percentile'], ['IQR', 'their difference — the middle half’s width'], ['fences', 'Q1−1.5·IQR and Q3+1.5·IQR — the standard outlier bounds']],
    thinking: {
      workflow: ['Data skewed or outlier-suspect?', 'Compute Q1, Q3, IQR', 'Flag points beyond the 1.5×IQR fences', 'Report median + IQR as the robust center+spread pair'],
      when: ['Skewed data (income, latency, prices)', 'Outlier detection that outliers can’t sabotage', 'Boxplots and robust dashboards'],
      notWhen: ['Precision-critical normal-theory work (s is more efficient there)', 'n so small that quartiles are barely defined'],
      assumptions: ['Ordinal-or-better data', 'A quartile convention (methods differ slightly)'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(11)
prices = np.append(rng.normal(250, 40, 300), [950, 1200, 8])  # + oddballs

q1, q3 = np.percentile(prices, [25, 75])
iqr = q3 - q1
lo_fence, hi_fence = q1 - 1.5 * iqr, q3 + 1.5 * iqr
print(f"Q1={q1:.0f}  Q3={q3:.0f}  IQR={iqr:.0f}")
print(f"fences: [{lo_fence:.0f}, {hi_fence:.0f}]")

outliers = prices[(prices < lo_fence) | (prices > hi_fence)]
print(f"flagged outliers: {np.sort(outliers).round(0)}")

# Robustness demonstration - the outliers barely move the IQR:
clean = prices[(prices >= lo_fence) & (prices <= hi_fence)]
print(f"IQR with outliers   : {iqr:.1f}")
print(f"IQR without         : "
      f"{np.subtract(*np.percentile(clean, [75, 25])) * -1:.1f}")
print(f"SD  with vs without : {prices.std(ddof=1):.1f} vs "
      f"{clean.std(ddof=1):.1f}   <- the SD got wrecked; IQR didn't")`,
    scenario: {
      title: 'House listing price sanity screen',
      problem: 'A property portal auto-flags mispriced listings (typos, scams) before they hit search results.',
      dataset: 'Listing prices within a neighborhood segment.',
      why: 'Prices are skewed and the contaminating values are exactly what SD-based rules choke on; IQR fences flag them without being distorted by them.',
      output: 'Fence bounds and a flagged-listings queue.',
      interpretation: '"$8 listing" and "$1.2M in a $250k segment" both go to human review; the middle 50% defines normal.',
      pitfalls: 'Fences assume one roughly-unimodal segment — mixed segments (condos + mansions) need separate fences.',
    },
    mistakes: ['SD-based outlier rules on skewed/contaminated data', 'One global fence over heterogeneous segments', 'Auto-deleting flagged points instead of reviewing them'],
    tips: ['stats.iqr(x) is the direct call', 'Median + IQR is the robust twin of mean + SD', 'Boxplots visualize exactly this formula — read them fluently'],
  },
];
