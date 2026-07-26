// Python Hub content — Stats Ch 6 (normal distribution), Ch 7 (confidence
// intervals), Ch 8 (hypothesis testing).
export const PY_STATS_INFERENCE = [
  {
    id: 'znorm', group: 'ch6', name: 'z-Score (Normal)', formula: 'z = (X−μ)/σ',
    tags: ['normal', 'standardization', 'probability lookup'],
    overview: "Standardization applied to a normal distribution: converting X to z turns ANY normal curve into the standard normal, where one table (or scipy call) answers every area question. The gateway between raw measurements and probabilities.",
    variables: [['X', 'a raw value from a Normal(μ, σ) population'], ['z', 'the equivalent point on the standard normal N(0,1)'], ['Φ(z)', 'cumulative area left of z — the probability lookup']],
    thinking: {
      workflow: ['Confirm approximate normality (histogram/QQ)', 'Standardize the question’s X to z', 'Convert to area with the normal cdf', 'Translate the area back into the business question'],
      when: ['Probability questions about normal measurements (weights, scores, times)', 'Setting spec limits and percentile cutoffs on normal processes'],
      notWhen: ['Clearly skewed/heavy-tailed data (areas will be wrong)', 'Tiny samples where normality can’t be assessed'],
      assumptions: ['X genuinely ~ Normal(μ, σ)', 'μ and σ known (or well-estimated)'],
    },
    code: `import numpy as np
from scipy import stats

# --- bottled drinks: fill ~ N(502, 3) ml, label promises 500 ---------
mu, sigma = 502, 3

# What fraction of bottles are under the labeled 500 ml?
z = (500 - mu) / sigma
p_under = stats.norm.cdf(z)
print(f"z = {z:.2f} -> P(fill < 500) = {p_under:.3f}  ({p_under:.1%})")

# Between 500 and 505?
p_between = stats.norm.cdf((505-mu)/sigma) - stats.norm.cdf((500-mu)/sigma)
print(f"P(500 < fill < 505) = {p_between:.3f}")

# scipy skips manual z if you pass loc/scale directly:
print(f"same, direct: {stats.norm(mu, sigma).cdf(505) - stats.norm(mu, sigma).cdf(500):.3f}")

# Simulation sanity check:
rng = np.random.default_rng(0)
fills = rng.normal(mu, sigma, 1_000_000)
print(f"simulated P(<500) = {(fills < 500).mean():.3f}")`,
    scenario: {
      title: 'Fill-level compliance for bottling',
      problem: 'Regulatory rules limit how often bottles may fall below the labeled volume; QA must quantify the current shortfall rate.',
      dataset: 'Process mean and SD from the fill-line control chart.',
      why: 'Fill volumes are near-normal, so one standardization converts the legal threshold into an exact probability.',
      output: 'P(under-fill) ≈ 25% — visible immediately in z-space.',
      interpretation: 'Either raise the mean fill or cut σ; the same formula quantifies exactly how much of either fixes compliance.',
      pitfalls: 'A drifting process mean invalidates the μ used — pull fresh control-chart values.',
    },
    mistakes: ['Using normal areas on non-normal data', 'Sign errors (P(X<x) vs P(X>x)) — draw the curve', 'Confusing σ with σ/√n (individual vs sample-mean questions)'],
    tips: ['stats.norm(mu, sigma).cdf/sf/ppf covers every direction of lookup', 'Sketch the curve and shade the area before computing — sign errors die there', 'ppf is the inverse: from probability back to the cutoff value'],
  },
  {
    id: 'x_from_z', group: 'ch6', name: 'X from z', formula: 'X = z·σ + μ',
    tags: ['normal', 'inverse', 'cutoff', 'percentile'],
    overview: "The standardization formula run backwards: given a z (usually from a target percentile), recover the raw value. This is how cutoffs are set — the score for the top 10%, the weight limit for the heaviest 1%, the guarantee period covering 95% of failures.",
    variables: [['z', 'the standard-normal point for the target percentile'], ['X', 'the raw-scale cutoff being solved for'], ['μ, σ', 'the distribution being mapped back into']],
    thinking: {
      workflow: ['State the percentile requirement ("top 8%", "middle 90%")', 'Find the matching z via the inverse cdf (ppf)', 'Map back: X = zσ + μ', 'Verify by plugging X forward through the cdf'],
      when: ['Setting cutoffs, spec limits, guarantees, and thresholds on normal data', 'Designing "middle X%" acceptance bands'],
      notWhen: ['Non-normal data (use empirical percentiles instead)', 'The percentile refers to sample means (then σ/√n is the scale)'],
      assumptions: ['Normality; known/estimated μ and σ'],
    },
    code: `import numpy as np
from scipy import stats

# --- scholarship cutoff: top 8% of a N(1050, 190) exam ---------------
mu, sigma = 1050, 190
z_cut = stats.norm.ppf(1 - 0.08)         # z for the 92nd percentile
x_cut = z_cut * sigma + mu
print(f"z = {z_cut:.3f} -> cutoff score = {x_cut:.0f}")
print(f"check: P(X > {x_cut:.0f}) = {stats.norm(mu, sigma).sf(x_cut):.3f}")

# Middle 90% acceptance band for a machined part ~ N(25.00, 0.02) mm:
lo, hi = stats.norm(25.00, 0.02).ppf([0.05, 0.95])
print(f"middle-90% band: {lo:.3f} to {hi:.3f} mm")

# Warranty design: cover no more than 4% of units, life ~ N(62, 8) months
warranty = stats.norm(62, 8).ppf(0.04)
print(f"set warranty at {warranty:.0f} months "
      f"-> {stats.norm(62,8).cdf(warranty):.1%} claim rate")`,
    scenario: {
      title: 'Warranty length design',
      problem: 'Product management wants the longest warranty that keeps expected claims under 4% of units.',
      dataset: 'Product lifetime mean and SD from reliability testing.',
      why: 'The question is a percentile in reverse: find the lifetime that only 4% of units fail before — exactly z→X.',
      output: 'A 48-month warranty at the 4% claim level.',
      interpretation: 'Marketing gets the biggest defensible number; finance gets a claim rate they signed off on.',
      pitfalls: 'Lifetimes are often right-skewed (Weibull territory) — verify normality before betting the warranty budget on it.',
    },
    mistakes: ['Looking up the wrong tail (ppf(0.08) vs ppf(0.92))', 'Using sample-mean σ/√n when the question is about individuals', 'Skipping the forward-check of the recovered cutoff'],
    tips: ['ppf is the inverse cdf — the direct route from percent to value', 'Always round cutoffs in the SAFE direction for the business', 'For skewed lifetimes, scipy’s weibull_min replaces the normal here'],
  },
  {
    id: 'mu_xbar', group: 'ch6', name: 'Mean of X̄', formula: 'μ_X̄ = μ',
    tags: ['sampling distribution', 'unbiased', 'clt'],
    overview: "The average of all possible sample means equals the population mean: X̄ is an UNBIASED estimator. Individual samples miss high or low, but they miss symmetrically — there is no systematic drift to correct for.",
    variables: [['μ_X̄', 'mean of the sampling distribution of X̄'], ['μ', 'the population mean it equals'], ['unbiasedness', 'the property this equation states']],
    thinking: {
      workflow: ['Understand X̄ as a random variable (it varies sample to sample)', 'Its distribution centers exactly on μ — no correction needed', 'What DOES change with n is the spread (see SEM), not the center', 'Lean on this when explaining why averaging many samples works'],
      when: ['Justifying sample means as estimates', 'Teaching/explaining sampling distributions before CIs'],
      notWhen: ['Biased sampling (nonresponse, convenience) — unbiasedness of the FORMULA can’t fix a biased sampling PROCESS'],
      assumptions: ['Random sampling from the population — the entire ballgame'],
    },
    code: `import numpy as np

rng = np.random.default_rng(1)

# A skewed population (incomes) with known mean:
population = rng.lognormal(10.5, 0.6, 1_000_000)
mu = population.mean()
print(f"population mean mu = {mu:,.0f}")

# Draw 20,000 samples of n=40; average all the sample means:
sample_means = np.array([rng.choice(population, 40).mean()
                         for _ in range(20_000)])
print(f"mean of sample means = {sample_means.mean():,.0f}  (~= mu)")
print(f"individual samples ranged {sample_means.min():,.0f} "
      f"to {sample_means.max():,.0f}")
# Any ONE sample can miss badly; ON AVERAGE they center exactly on mu.

# Contrast: a BIASED sampling process (only high-income responders):
biased_means = np.array([
    rng.choice(population[population > np.percentile(population, 30)],
               40).mean()
    for _ in range(5_000)])
print(f"biased-process mean of means = {biased_means.mean():,.0f} "
      f"<- formula can't rescue a biased process")`,
    scenario: {
      title: 'Defending survey methodology',
      problem: 'A stakeholder distrusts a survey because "your 40 people can’t represent 100,000 customers."',
      dataset: 'The survey design plus the simulated demonstration.',
      why: 'μ_X̄ = μ is the precise answer: the estimate has no systematic tilt; its only sin is sampling noise, which is quantifiable (SEM) and shrinkable (larger n).',
      output: 'A demonstration that sample means center on the truth.',
      interpretation: '"Unbiased but noisy" reframes the debate from "wrong" to "how precise?" — which the CI then answers.',
      pitfalls: 'Unbiasedness holds for random samples only; a skewed panel breaks it and no formula repairs it.',
    },
    mistakes: ['Claiming unbiasedness for non-random samples', 'Confusing "unbiased" (center is right) with "accurate" (each sample is close)', 'Ignoring that the property says nothing about spread'],
    tips: ['This plus the SEM together justify every CI to come', 'The simulation above is the most convincing 10 lines you can show a skeptic', 'Bias is a property of the process, not the formula'],
  },
  {
    id: 'sem', group: 'ch6', name: 'Std Error of Mean', formula: 'σ_X̄ = σ/√n',
    tags: ['standard error', 'precision', 'sampling distribution'],
    overview: "How much sample means wobble around μ: the population SD shrunk by √n. The √n law is the economics of data — quadruple the sample to halve the noise — and the scale unit of every CI and z/t test that follows.",
    variables: [['σ', 'population SD (s in practice)'], ['n', 'sample size'], ['σ_X̄', 'SD of the sample-mean distribution — the precision of X̄']],
    thinking: {
      workflow: ['Distinguish the two spreads: individuals (σ) vs sample means (σ/√n)', 'Compute SEM for the n at hand', 'Use it to set expectations for estimate stability', 'Invert it for sample-size planning (how big an n for target precision?)'],
      when: ['Quantifying estimate precision, sizing studies', 'Any inference formula — it is the denominator everywhere'],
      notWhen: ['Describing individual variability (that is σ’s job — a classic mix-up)', 'Correlated observations (effective n is smaller; SEM understates noise)'],
      assumptions: ['Independent observations', 'σ known or decently estimated by s'],
    },
    code: `import numpy as np

rng = np.random.default_rng(2)
sigma = 12                                 # population SD of scores

# The sqrt(n) law, empirically:
print("n      predicted SEM    observed SD of sample means")
for n in [10, 40, 160, 640]:
    means = [rng.normal(75, sigma, n).mean() for _ in range(10_000)]
    print(f"{n:4d}   {sigma/np.sqrt(n):8.2f}        {np.std(means):8.2f}")
# Each 4x in n buys exactly a halving of the noise.

# Planning inversion: n for a target precision
target_sem = 1.0
n_needed = (sigma / target_sem) ** 2
print(f"for SEM <= {target_sem}: n >= {n_needed:.0f}")

# The two-spreads distinction in one report line:
sample = rng.normal(75, sigma, 100)
print(f"individuals spread: s = {sample.std(ddof=1):.1f}")
print(f"estimate precision: SEM = "
      f"{sample.std(ddof=1)/np.sqrt(len(sample)):.1f}")`,
    scenario: {
      title: 'How precise is our NPS estimate?',
      problem: 'Leadership asks whether the quarterly NPS moved or just wobbled; the answer depends on the estimate’s precision.',
      dataset: 'Survey n and the response SD.',
      why: 'SEM converts "we asked 400 people" into "the score is good to about ±1.2" — the yardstick that separates movement from noise.',
      output: 'The SEM and the implied stability band.',
      interpretation: 'A 2-point quarter-over-quarter change against a 1.2 SEM is within wobble range; a 5-point change is not.',
      pitfalls: 'Responses clustered by account/team are not independent — the true SEM is larger than σ/√n.',
    },
    mistakes: ['Quoting σ where SEM belongs (or vice versa)', 'Believing doubling n halves noise (it takes quadrupling)', 'Ignoring clustering/correlation that shrinks effective n'],
    tips: ['scipy.stats.sem(x) computes s/√n directly', 'Precision costs quadratically — budget studies with the inverted formula', 'Error bars on charts: state whether they show s or SEM, always'],
  },
  {
    id: 'clt', group: 'ch6', name: 'CLT z-Formula', formula: 'z = (X̄−μ)/(σ/√n)',
    tags: ['central limit theorem', 'sampling', 'normality'],
    overview: "The Central Limit Theorem in working form: for decent n, sample means are approximately normal AROUND μ WITH SD σ/√n — regardless of the population's shape. This one theorem is why z and t methods apply to skewed real-world data at all.",
    variables: [['X̄', 'the observed sample mean'], ['σ/√n', 'the SEM — the correct yardstick for means'], ['z', 'how many SEMs the sample mean sits from μ']],
    thinking: {
      workflow: ['Question about a SAMPLE MEAN (not an individual)?', 'Check n: ≥30 rule of thumb, more for heavy skew', 'Standardize with σ/√n, not σ', 'Convert to probability; interpret'],
      when: ['Probability statements about averages: batch means, daily averages, plan totals', 'Justifying normal-theory inference on non-normal data'],
      notWhen: ['Individual-value questions (use σ)', 'Small n from heavily skewed/heavy-tailed populations', 'Distributions without finite variance (rare but real)'],
      assumptions: ['Independent draws', 'n large enough for the population’s skew', 'Finite variance'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(3)

# --- CLT in action on a WILDLY non-normal population -----------------
population = rng.exponential(10, 1_000_000)     # heavy right skew
mu, sigma = population.mean(), population.std()
print(f"population: mean {mu:.1f}, sd {sigma:.1f}, skewed hard")

for n in [2, 10, 40]:
    means = np.array([rng.choice(population, n).mean()
                      for _ in range(20_000)])
    # How normal do the means look? Compare tail prob vs normal claim:
    z90 = mu + 1.2816 * sigma / np.sqrt(n)
    actual = (means > z90).mean()
    print(f"n={n:3d}: P(mean > 90th-pct-claim) = {actual:.3f} "
          f"(normal theory says 0.100)")
# By n=40 the normal approximation is already close - on exponential data.

# --- the formula's typical job ---------------------------------------
# Elevator: capacity 2500kg for 15 riders; weights mean 78, sd 15.
n, cap = 15, 2500
z = (cap/n - 78) / (15 / np.sqrt(n))
print(f"P(average rider weight exceeds {cap/n:.1f}kg) = "
      f"{stats.norm.sf(z):.4f}")`,
    scenario: {
      title: 'Elevator load safety analysis',
      problem: 'An engineer certifies the probability that 15 random riders exceed a 2,500 kg capacity.',
      dataset: 'Population weight mean and SD.',
      why: 'The question is about an AVERAGE of 15 people — the CLT makes that average normal with SD σ/√15 even though individual weights are right-skewed.',
      output: 'P(overload) from one z computation.',
      interpretation: 'A 1-in-10,000 exceedance either passes the safety threshold or triggers a capacity re-rating — the number is now defensible.',
      pitfalls: 'Riders arriving in correlated groups (a sports team) breaks the random-sample premise and the calculation with it.',
    },
    mistakes: ['Using σ instead of σ/√n (THE classic CLT error)', 'Applying n≥30 as magic on extremely skewed data', 'Reading the CLT as making the DATA normal (only the means become normal)'],
    tips: ['Ask "individual or average?" before every normal calculation', 'The n it takes depends on skew — simulate when in doubt', 'The CLT is why the next two chapters (CI, tests) work at all'],
  },
  {
    id: 'z_ci', group: 'ch7', name: 'z CI for Mean', formula: 'X̄ ± z_{α/2}·(σ/√n)',
    tags: ['confidence interval', 'mean', 'known sigma'],
    overview: "A range that captures μ with chosen confidence, built when σ is KNOWN: sample mean ± z-multiplied SEM. The known-σ premise is rare in practice (calibrated instruments, long-standing processes) but it is the cleanest CI to learn the logic on.",
    variables: [['z_{α/2}', 'critical value: 1.645 (90%), 1.96 (95%), 2.576 (99%)'], ['σ/√n', 'the SEM'], ['margin of error', 'the ± half-width — precision in one number']],
    thinking: {
      workflow: ['Is σ truly known (spec/history), not estimated from this sample?', 'Pick confidence level from decision stakes', 'Compute X̄ ± z·σ/√n', 'Interpret as a statement about the METHOD’s long-run capture rate'],
      when: ['Instrument/process with established σ (metrology, mature production)', 'Teaching CI logic before t complicates it'],
      notWhen: ['σ estimated from the sample in hand (use t)', 'Non-random samples (no interval fixes selection bias)'],
      assumptions: ['Known σ; random sample; normal population or CLT-adequate n'],
    },
    code: `import numpy as np
from scipy import stats

# --- calibration lab: instrument sigma certified at 0.8 units --------
sigma = 0.8                     # KNOWN from certification, not estimated
rng = np.random.default_rng(4)
measurements = rng.normal(50.3, sigma, 12)
xbar, n = measurements.mean(), len(measurements)

for conf in [0.90, 0.95, 0.99]:
    z = stats.norm.ppf(1 - (1 - conf) / 2)
    moe = z * sigma / np.sqrt(n)
    print(f"{conf:.0%} CI: {xbar:.2f} +/- {moe:.2f} "
          f"= ({xbar-moe:.2f}, {xbar+moe:.2f})")

# What '95% confidence' actually means - a coverage simulation:
true_mu = 50.0
covered = 0
for _ in range(10_000):
    m = rng.normal(true_mu, sigma, 12).mean()
    moe = 1.96 * sigma / np.sqrt(12)
    covered += (m - moe <= true_mu <= m + moe)
print(f"10,000 repeated intervals: {covered/10_000:.1%} captured mu")
# The METHOD captures mu 95% of the time - that is the guarantee.`,
    scenario: {
      title: 'Instrument calibration verification',
      problem: 'A metrology lab checks whether a sensor still reads true, using its certified σ from the manufacturer.',
      dataset: '12 readings of a reference standard with certified σ=0.8.',
      why: 'σ comes from certification, not this sample — the z interval is exactly right, and the interval either brackets the reference value or flags drift.',
      output: 'A 95% CI for the sensor’s true reading level.',
      interpretation: 'Reference value outside the interval → schedule recalibration; inside → the drift claim has no evidence.',
      pitfalls: 'Using the sample’s own s here would silently demand the t interval instead.',
    },
    mistakes: ['Using z with σ estimated from the sample (t territory)', '"95% chance μ is in THIS interval" phrasing (the randomness is in the interval, not μ)', 'Chasing 99% confidence without noticing the width cost'],
    tips: ['Memorize 1.645/1.96/2.576 — they never change', 'The coverage simulation is the correct-interpretation teacher', 'Width scales as 1/√n: precision budgeting is quadratic, always'],
  },
  {
    id: 't_ci', group: 'ch7', name: 't CI for Mean', formula: 'X̄ ± t_{α/2}·(s/√n)',
    tags: ['confidence interval', 'mean', 't distribution', 'small sample'],
    overview: "The real-world CI for a mean: σ is unknown, s estimates it, and the t distribution's fatter tails pay for that extra uncertainty. As n grows, t converges to z — the small-sample honesty tax fades.",
    variables: [['s', 'sample SD — the estimated σ'], ['t_{α/2}', 'critical value from t with df = n−1 (bigger than z, especially for small n)'], ['df', 'degrees of freedom, n−1']],
    thinking: {
      workflow: ['σ unknown (the normal case) → t, full stop', 'Check rough normality for small n (boxplot/QQ)', 'X̄ ± t·s/√n with df=n−1', 'Report interval + n + how s was computed'],
      when: ['Almost every real mean CI (σ is almost never known)', 'Small pilot studies where the t-vs-z gap genuinely matters'],
      notWhen: ['Heavy skew with tiny n (bootstrap or transform first)', 'Proportions/counts (their own intervals apply)'],
      assumptions: ['Random sample; approximately normal population (or n large enough)'],
    },
    code: `import numpy as np
from scipy import stats

# --- pilot study: recovery days for 14 patients ----------------------
rng = np.random.default_rng(5)
recovery = rng.normal(11.2, 2.8, 14).round(1)
n, xbar, s = len(recovery), recovery.mean(), recovery.std(ddof=1)

t_crit = stats.t.ppf(0.975, df=n-1)
moe = t_crit * s / np.sqrt(n)
print(f"n={n}, X-bar={xbar:.2f}, s={s:.2f}")
print(f"t crit (df={n-1}) = {t_crit:.3f}  vs z 1.960 "
      f"-> {t_crit/1.96-1:.0%} wider, the honesty tax")
print(f"95% CI: ({xbar-moe:.2f}, {xbar+moe:.2f}) days")

# The one-liner used daily:
lo, hi = stats.t.interval(0.95, df=n-1, loc=xbar,
                          scale=stats.sem(recovery))
print(f"scipy: ({lo:.2f}, {hi:.2f})")

# The t->z convergence:
for df in [4, 9, 29, 99, 999]:
    print(f"df={df:4d}: t_crit = {stats.t.ppf(0.975, df):.3f}")`,
    scenario: {
      title: 'Hospital recovery time reporting',
      problem: 'A surgical team reports average recovery time for a new procedure after 14 cases, for the ethics-board review.',
      dataset: '14 recovery durations — all the data that exists yet.',
      why: 'σ is unknown and n is small: only the t interval charges the correct premium for estimating spread from 14 points.',
      output: 'A 95% t-interval for mean recovery.',
      interpretation: '"10.1–12.9 days" gives the board an honest range; the z interval would have claimed false precision.',
      pitfalls: 'One outlier complication in 14 cases swings both X̄ and s hard — show the raw points alongside.',
    },
    mistakes: ['Using z out of habit when s came from the sample', 'Wrong df (n, not n−1)', 'Ignoring visible skew at n=14 and trusting the normal theory anyway'],
    tips: ['Default to t for every mean CI; it self-converges to z at large n', 'stats.t.interval + stats.sem is the two-call idiom', 'For skewed small samples, a bootstrap CI is the honest fallback'],
  },
  {
    id: 'ci_mean_t', group: 'ch7', name: 't CI (Mean, full form)', formula: 'X̄−t·s/√n < μ < X̄+t·s/√n',
    tags: ['confidence interval', 'mean', 'inequality form'],
    overview: "The same t interval written as the double inequality that textbooks report: an explicit lower and upper bound trapping μ. Identical math to the ± form — the value is in reading and reporting bounds correctly.",
    variables: [['lower bound', 'X̄ − t·s/√n'], ['upper bound', 'X̄ + t·s/√n'], ['μ', 'the fixed unknown the bounds aim to trap']],
    thinking: {
      workflow: ['Compute the t interval as usual', 'Report explicit bounds (lower, upper) with units', 'Read decisions off the bounds: is a threshold inside, above, below?', 'Track bound movement across studies rather than point estimates alone'],
      when: ['Formal reporting where explicit bounds are required (submissions, specs)', 'Decisions phrased against thresholds ("is μ credibly above 10?")'],
      notWhen: ['Anything the ± form doesn’t already cover — this is presentation, not new math'],
      assumptions: ['Same as the t CI: random sample, rough normality or adequate n'],
    },
    code: `import numpy as np
from scipy import stats

# --- SLA check: is true mean resolution time credibly under 24h? -----
rng = np.random.default_rng(6)
hours = rng.normal(21.5, 5.0, 35).round(1)
n = len(hours)
xbar, sem = hours.mean(), stats.sem(hours)
t_crit = stats.t.ppf(0.975, df=n-1)

lower = xbar - t_crit * sem
upper = xbar + t_crit * sem
print(f"{lower:.1f}h < mu < {upper:.1f}h   (95% confidence)")

# Threshold reading - the practical payoff of explicit bounds:
SLA = 24
if upper < SLA:
    print(f"upper bound {upper:.1f} < {SLA}: mean SLA compliance "
          "is supported at 95% confidence")
elif lower > SLA:
    print("even the lower bound exceeds the SLA: non-compliance")
else:
    print(f"{SLA} lies inside the interval: data can't settle it yet")

# One-sided version when only one direction matters:
upper_1side = xbar + stats.t.ppf(0.95, n-1) * sem
print(f"one-sided 95%: mu < {upper_1side:.1f}h")`,
    scenario: {
      title: 'SLA compliance evidence',
      problem: 'A support vendor must demonstrate mean ticket-resolution time is under the contractual 24 hours.',
      dataset: '35 sampled resolution times.',
      why: 'The contract question is about a bound: is the UPPER limit of the plausible-μ range below 24? The inequality form answers it directly.',
      output: 'Explicit lower/upper bounds and the threshold verdict.',
      interpretation: 'Upper bound 23.2h < 24h: compliance supported; had 24 fallen inside, the honest answer is "insufficient data," not "we passed."',
      pitfalls: 'Choosing one-sided vs two-sided AFTER seeing the data games the confidence level.',
    },
    mistakes: ['Point-estimate-only compliance claims', 'Post-hoc switching to one-sided bounds', 'Reading "μ is random inside the interval" (μ is fixed; the interval varies)'],
    tips: ['Decisions against thresholds = read the relevant bound, not the center', 'Pre-register one-sided vs two-sided with the contract language', 'Plot intervals across periods — trend of bounds beats trend of means'],
  },
  {
    id: 'n_mean', group: 'ch7', name: 'Sample Size (Mean)', formula: 'n = (z_{α/2}·σ/E)²',
    tags: ['sample size', 'planning', 'margin of error'],
    overview: "The CI width formula inverted: how many observations buy a target margin of error E at a chosen confidence. The pre-study budgeting formula — precision is purchased quadratically.",
    variables: [['E', 'desired margin of error (the ± you can live with)'], ['σ', 'anticipated SD (pilot, history, or range/4)'], ['n', 'required sample size — always round UP']],
    thinking: {
      workflow: ['Fix E from the decision ("we need the mean within ±2 units")', 'Choose confidence; get z', 'Source a defensible σ guess (pilot ≫ literature ≫ range/4)', 'Compute, round up, add attrition buffer'],
      when: ['Study/survey/experiment budgeting before collection', 'Justifying sample sizes to review boards and finance'],
      notWhen: ['Data already collected (the precision is what it is)', 'No credible σ guess exists (run a pilot first — that IS the answer)'],
      assumptions: ['The σ guess is in the right ballpark (the answer scales with its square!)', 'Simple random sampling'],
    },
    code: `import numpy as np
from scipy import stats

# --- plan: estimate mean daily screen time within +/-10 min ----------
sigma_guess = 55          # from a small pilot, minutes
E = 10
z = stats.norm.ppf(0.975)

n = (z * sigma_guess / E) ** 2
print(f"n = ({z:.2f} x {sigma_guess} / {E})^2 = {n:.1f} "
      f"-> recruit {int(np.ceil(n))}")

# The quadratic cost of precision, tabulated:
print("target E   required n")
for e in [15, 10, 5, 2.5]:
    print(f"   {e:5.1f}   {np.ceil((z*sigma_guess/e)**2):8.0f}")
# Halving E quadruples n, every time.

# Sensitivity to the sigma guess - why the pilot matters:
for sg in [45, 55, 70]:
    print(f"if sigma={sg}: n = {np.ceil((z*sg/E)**2):.0f}")

# Attrition-adjusted recruitment:
attrition = 0.15
print(f"with {attrition:.0%} dropout: recruit "
      f"{np.ceil(n/(1-attrition)):.0f}")`,
    scenario: {
      title: 'Budgeting a user-research study',
      problem: 'A UX team must tell finance how many paid participants a screen-time study needs before funding is approved.',
      dataset: 'A 12-person pilot providing the σ guess.',
      why: 'The formula converts a precision requirement into a headcount — the only defensible basis for the study budget.',
      output: 'n=117, padded to ~137 for dropout.',
      interpretation: 'If finance balks, the E-vs-n table shows exactly what precision each budget level buys — the negotiation happens on facts.',
      pitfalls: 'A σ guess 25% low makes the delivered CI ~25% wider than promised; flag the sensitivity.',
    },
    mistakes: ['Rounding n down', 'Using an optimistic σ to flatter the budget', 'Forgetting dropout/attrition inflation', 'Promising E without stating the confidence level attached'],
    tips: ['Always show the E-vs-n table — it turns arguments into choices', 'Pilot-based σ beats literature σ beats range/4, in that order', 'For proportions, the sibling formula n = p̂q̂(z/E)² applies'],
  },
  {
    id: 'p_hat', group: 'ch7', name: 'Sample Proportion', formula: 'p̂ = X/n',
    tags: ['proportion', 'estimate', 'rates'],
    overview: "The sample estimate of a population proportion: successes over trials. Conversion rates, approval ratings, defect rates — the single most-reported statistic in business, and the input to every proportion CI and test.",
    variables: [['X', 'number of successes in the sample'], ['n', 'sample size'], ['p̂', 'the sample proportion — an estimate of true p'], ['q̂', '1−p̂, its complement']],
    thinking: {
      workflow: ['Define success unambiguously (what counts, what window, what base)', 'Count X out of n from a random sample', 'Compute p̂; immediately ask "with what precision?" (→ CI next)', 'Check np̂ and nq̂ ≥ 5 before normal-based follow-ups'],
      when: ['Estimating any rate: clicks, defects, approvals, churn', 'Setting up proportion CIs and tests'],
      notWhen: ['Events per continuous exposure (that is a rate, → Poisson)', 'The denominator is fuzzy (sessions vs users changes everything)'],
      assumptions: ['Random sample; independent trials; fixed definition of success'],
    },
    code: `import numpy as np
from statsmodels.stats.proportion import proportion_confint

# --- poll: 273 of 640 likely voters support the measure --------------
X, n = 273, 640
p_hat = X / n
q_hat = 1 - p_hat
print(f"p-hat = {X}/{n} = {p_hat:.3f}  ({p_hat:.1%})")

# The reflexive next step - precision:
lo, hi = proportion_confint(X, n, alpha=0.05, method="wilson")
print(f"95% CI: ({lo:.1%}, {hi:.1%})")

# Normal-approximation validity gate for later formulas:
print(f"n*p-hat = {n*p_hat:.0f}, n*q-hat = {n*q_hat:.0f} "
      f"(both >= 5: normal methods OK)")

# Denominator discipline - same clicks, different stories:
clicks, users, sessions = 730, 9_000, 21_500
print(f"per-user rate    : {clicks/users:.2%}")
print(f"per-session rate : {clicks/sessions:.2%} "
      f"<- same activity, different denominator, different number")`,
    scenario: {
      title: 'Election polling topline',
      problem: 'A pollster reports candidate support from a 640-person likely-voter sample.',
      dataset: 'Responses coded to a support/not-support definition.',
      why: 'p̂ is the estimate the headline quotes; the immediate CI (±3.8 points) is what separates journalism from noise-reading.',
      output: '42.7% support, CI (38.9%, 46.5%).',
      interpretation: 'A 2-point week-over-week "shift" inside a ±3.8 band is not news; crossing the band is.',
      pitfalls: 'The sampling frame (likely voters) IS the definition — change it and p̂ is a different quantity.',
    },
    mistakes: ['Headline p̂ without n or CI', 'Sloppy denominators (users vs sessions vs impressions)', 'Comparing p̂’s computed under different success definitions'],
    tips: ['Report p̂, n, and the CI as one unit — always', 'Wilson CIs behave well at extreme p̂ where the naive formula breaks', 'Pin the denominator in writing before anyone computes anything'],
  },
  {
    id: 'p_ci', group: 'ch7', name: 'CI for Proportion', formula: 'p̂ ± z_{α/2}·√(p̂q̂/n)',
    tags: ['confidence interval', 'proportion', 'margin of error'],
    overview: "The interval around a sample proportion: p̂ plus-or-minus z times its standard error √(p̂q̂/n). This is the ±3% 'margin of error' in every poll headline — and the formula behind it.",
    variables: [['√(p̂q̂/n)', 'standard error of the proportion'], ['z_{α/2}', '1.96 at 95%'], ['margin of error', 'the ± that headlines quote']],
    thinking: {
      workflow: ['Compute p̂, verify np̂, nq̂ ≥ 5', 'SE = √(p̂q̂/n); MOE = z·SE', 'Prefer the Wilson interval in software (better small-n behavior)', 'Interpret overlap questions carefully (two-sample questions need two-sample methods)'],
      when: ['Any reported rate needing honest precision: polls, conversions, defects', 'Deciding if a rate credibly clears a threshold'],
      notWhen: ['Tiny n or extreme p̂ (the naive formula misbehaves — Wilson/exact instead)', 'Comparing two rates (use the two-proportion machinery)'],
      assumptions: ['Random sample, independence, np̂ and nq̂ both ≥ 5 for the normal form'],
    },
    code: `import numpy as np
from scipy import stats
from statsmodels.stats.proportion import proportion_confint

# --- A/B test arm: 87 conversions from 1,450 visitors ----------------
X, n = 87, 1450
p_hat = X / n
se = np.sqrt(p_hat * (1 - p_hat) / n)
z = stats.norm.ppf(0.975)
print(f"p-hat = {p_hat:.3%}, SE = {se:.4f}")
print(f"naive 95% CI: ({p_hat - z*se:.3%}, {p_hat + z*se:.3%})")

# Production-grade alternatives:
for method in ["normal", "wilson", "beta"]:      # beta = Clopper-Pearson
    lo, hi = proportion_confint(X, n, method=method)
    print(f"{method:8s}: ({lo:.3%}, {hi:.3%})")

# Where the naive formula embarrasses itself - small n, small p:
X2, n2 = 1, 40
lo_n, hi_n = proportion_confint(X2, n2, method="normal")
lo_w, hi_w = proportion_confint(X2, n2, method="wilson")
print(f"1/40 events: naive ({lo_n:.1%}, {hi_n:.1%})  "
      f"wilson ({lo_w:.1%}, {hi_w:.1%})")
# The naive lower bound goes negative - an impossible probability.`,
    scenario: {
      title: 'Conversion-rate reporting for an A/B arm',
      problem: 'A PM reports the new checkout’s conversion rate with enough honesty to stop premature celebration.',
      dataset: '87 conversions from 1,450 visitors in the test arm.',
      why: 'The CI translates 6.0% into "somewhere between 4.9% and 7.3%" — the range that decides whether more traffic is needed before a rollout call.',
      output: 'p̂ with Wilson interval.',
      interpretation: 'If the old rate (5.5%) sits inside the interval, the test hasn’t settled anything yet — keep collecting.',
      pitfalls: 'Peeking repeatedly and stopping when the CI looks good inflates false positives — fix the horizon in advance.',
    },
    mistakes: ['Naive interval at small n/extreme p̂ (negative bounds!)', 'Reading one-arm CI overlap as a two-arm test', 'Stopping rules driven by watching the CI'],
    tips: ['Default to Wilson in code; save the naive form for teaching', 'MOE ≈ 1/√n at p̂≈0.5 — the pollster’s instant approximation', 'For arm comparisons, jump to the two-proportion z-test, not CI overlap'],
  },
  {
    id: 'n_prop', group: 'ch7', name: 'Sample Size (Proportion)', formula: 'n = p̂q̂·(z_{α/2}/E)²',
    tags: ['sample size', 'proportion', 'planning', 'polling'],
    overview: "How many respondents buy a target margin of error on a rate. With no prior guess, p̂=0.5 maximizes p̂q̂ and gives the safe worst-case n — the source of 'about 1,067 people for ±3%' in national polling.",
    variables: [['p̂q̂', 'variance term — worst case 0.25 at p̂=0.5'], ['E', 'target margin of error'], ['n', 'required respondents (round up)']],
    thinking: {
      workflow: ['Set E from the decision (±3 points? ±1?)', 'Prior p̂ available? Use it; else 0.5 for the conservative n', 'Compute, round up, inflate for expected response rate', 'Re-check achieved MOE after fielding'],
      when: ['Survey and poll budgeting', 'A/B test sizing for a single-rate estimate'],
      notWhen: ['Detecting a DIFFERENCE between two rates (power analysis, different formula)', 'Cluster/stratified designs (design effects inflate n)'],
      assumptions: ['Simple random sampling', 'The prior p̂ guess is roughly right if used'],
    },
    code: `import numpy as np
from scipy import stats

z = stats.norm.ppf(0.975)

# --- the famous polling number ---------------------------------------
E = 0.03
n_worst = 0.5 * 0.5 * (z / E) ** 2
print(f"+/-3% at 95%, no prior: n = {np.ceil(n_worst):.0f}")

# With a prior guess (defect rate ~4%):
p_guess = 0.04
n_prior = p_guess * (1-p_guess) * (z / 0.01) ** 2
print(f"+/-1% around ~4%: n = {np.ceil(n_prior):.0f} "
      f"(vs worst-case {np.ceil(0.25*(z/0.01)**2):.0f})")
# A good prior guess cut the required n by 6x.

# The E-vs-n menu for the budget meeting:
print("MOE     worst-case n")
for e in [0.05, 0.03, 0.02, 0.01]:
    print(f"+/-{e:.0%}   {np.ceil(0.25*(z/e)**2):10.0f}")

# Response-rate inflation:
rr = 0.22
print(f"need {np.ceil(n_worst):.0f} responses at {rr:.0%} response "
      f"rate -> send {np.ceil(n_worst/rr):.0f} invitations")`,
    scenario: {
      title: 'National poll design',
      problem: 'A news organization budgets a poll promising ±3 points at 95% confidence.',
      dataset: 'None yet — this is the design step.',
      why: 'The worst-case formula yields the industry-standard ~1,067 completes, independent of population size (a fact that surprises everyone).',
      output: 'Required completes and the invitation count after response-rate inflation.',
      interpretation: 'The population being 300M is irrelevant to n — precision buys the same at any population scale.',
      pitfalls: 'Nonresponse bias is not fixed by a bigger n — who answers matters more than how many.',
    },
    mistakes: ['Scaling n to population size (finite-population correction is negligible for big populations)', 'Skipping response-rate inflation', 'Using this formula to size a two-group comparison'],
    tips: ['0.5 is the safe default; any honest prior only reduces n', '±1% costs 9× the sample of ±3% — the quadratic law again', 'Design effects (clustering) multiply n — budget for them in field surveys'],
  },
  {
    id: 'var_ci', group: 'ch7', name: 'CI for Variance', formula: '(n−1)s²/χ²_R < σ² < (n−1)s²/χ²_L',
    tags: ['confidence interval', 'variance', 'chi-square'],
    overview: "An interval for the population VARIANCE, built on the chi-square distribution of (n−1)s²/σ². Asymmetric — because variance can’t go below zero — and notoriously sensitive to the normality assumption.",
    variables: [['χ²_R, χ²_L', 'right/left chi-square critical values at df=n−1'], ['(n−1)s²', 'the pivot quantity'], ['asymmetry', 'the interval is NOT centered on s² — expected and correct']],
    thinking: {
      workflow: ['Question is about consistency/spread itself, not the mean', 'Check normality seriously (this interval is fragile to it)', 'Compute the chi-square bounds at df=n−1', 'Report in SD units too (root the ends) for readability'],
      when: ['Precision/consistency claims: process spread, instrument variability', 'Qualifying equipment where σ tolerance is specified'],
      notWhen: ['Non-normal data (coverage degrades badly — bootstrap instead)', 'The mean was the actual question'],
      assumptions: ['Normal population — strictly, not approximately', 'Random sample'],
    },
    code: `import numpy as np
from scipy import stats

# --- machine qualification: spec requires sigma <= 0.5 mm ------------
rng = np.random.default_rng(7)
parts = rng.normal(120.0, 0.42, 25)
n, s2 = len(parts), parts.var(ddof=1)
df = n - 1

chi_L = stats.chi2.ppf(0.025, df)      # left critical value
chi_R = stats.chi2.ppf(0.975, df)      # right critical value

lo_var = df * s2 / chi_R
hi_var = df * s2 / chi_L
print(f"s^2 = {s2:.4f}")
print(f"95% CI for sigma^2: ({lo_var:.4f}, {hi_var:.4f})")
print(f"95% CI for sigma  : ({np.sqrt(lo_var):.3f}, "
      f"{np.sqrt(hi_var):.3f}) mm")

# Spec verdict:
spec = 0.5
if np.sqrt(hi_var) < spec:
    print(f"upper bound < {spec}: machine QUALIFIES at 95% confidence")
else:
    print(f"upper bound >= {spec}: cannot certify; need more data "
          "or a better machine")

# Note the asymmetry around s^2 - chi-square is skewed:
print(f"interval center {np.sqrt((lo_var+hi_var)/2):.3f} != s "
      f"{np.sqrt(s2):.3f}")`,
    scenario: {
      title: 'Machine qualification against a spread spec',
      problem: 'A buyer accepts a new CNC machine only if its part-to-part σ is credibly at most 0.5 mm.',
      dataset: '25 sample parts machined during acceptance testing.',
      why: 'The contract is written on σ, so the CI must be on σ — the chi-square interval is the standard instrument for exactly this clause.',
      output: 'A CI for σ and a pass/fail against the spec.',
      interpretation: 'Upper bound 0.55 > 0.5: the machine may be fine, but 25 parts cannot prove it — run more parts before signing.',
      pitfalls: 'A single measurement-error outlier inflates s² quadratically and can fail a good machine.',
    },
    mistakes: ['Mixing up which chi-square value divides which bound (small χ² → big bound)', 'Using it on visibly non-normal data', 'Reporting σ² bounds where the audience thinks in σ'],
    tips: ['Root the ends for an SD interval — same confidence, readable units', 'QQ-plot before trusting it; bootstrap when normality is doubtful', 'The pivot (n−1)s²/σ² ~ χ² is also the engine of the variance TEST'],
  },
  {
    id: 'sd_ci', group: 'ch7', name: 'CI for SD', formula: '√[(n−1)s²/χ²_R] < σ < √[(n−1)s²/χ²_L]',
    tags: ['confidence interval', 'standard deviation', 'chi-square'],
    overview: "The variance interval with square roots applied to both ends: a confidence interval for σ in the data’s own units. Same chi-square machinery, same normality fragility — but the version people can actually read.",
    variables: [['√ of each bound', 'converts variance limits to SD limits'], ['σ', 'the population SD being trapped'], ['df', 'n−1, as ever']],
    thinking: {
      workflow: ['Build the variance CI first', 'Square-root both ends (order preserved — root is monotone)', 'Report in natural units with n', 'Judge specs and comparisons on the bounds'],
      when: ['Any audience-facing spread interval (σ, not σ²)', 'Consistency guarantees: lab precision, process capability inputs'],
      notWhen: ['Non-normal data (same fragility as the variance CI)', 'Comparing two SDs (that is the F-test’s job)'],
      assumptions: ['Normal population; random sample'],
    },
    code: `import numpy as np
from scipy import stats

# --- lab assay precision claim ---------------------------------------
rng = np.random.default_rng(8)
assay = rng.normal(5.20, 0.11, 20)      # replicate measurements
n, s = len(assay), assay.std(ddof=1)
df = n - 1

lo_sd = np.sqrt(df * s**2 / stats.chi2.ppf(0.975, df))
hi_sd = np.sqrt(df * s**2 / stats.chi2.ppf(0.025, df))
print(f"s = {s:.3f} units, n = {n}")
print(f"95% CI for sigma: ({lo_sd:.3f}, {hi_sd:.3f})")

# Marketing wants to claim 'precision better than 0.15 units':
claim = 0.15
verdict = "SUPPORTED" if hi_sd < claim else "NOT provable with n=20"
print(f"claim sigma < {claim}: {verdict}")

# How n tightens the sigma interval (planning view):
for nn in [10, 20, 50, 200]:
    dfn = nn - 1
    ratio_hi = np.sqrt(dfn / stats.chi2.ppf(0.025, dfn))
    print(f"n={nn:4d}: upper bound ~= {ratio_hi:.2f} x s")
# sigma intervals tighten SLOWLY - precision about precision is expensive.`,
    scenario: {
      title: 'Analytical lab precision certification',
      problem: 'A lab wants to advertise assay precision "σ below 0.15 units" and needs the claim to survive an audit.',
      dataset: '20 replicate measurements of a control sample.',
      why: 'The advertising claim is one-directional about σ — only the CI’s upper bound can support it defensibly.',
      output: 'A σ interval and a claim verdict.',
      interpretation: 'Upper bound 0.16 > 0.15: the lab is probably fine but cannot yet prove it — more replicates or a softer claim.',
      pitfalls: 'SD intervals shrink slowly with n; certifying tight precision claims takes far more data than teams expect.',
    },
    mistakes: ['Claiming precision from s alone without the interval', 'Normality taken on faith for instrument data with occasional gross errors', 'Averaging SD bounds across runs instead of pooling properly'],
    tips: ['The upper bound is the honest number for "better than" claims', 'Doubling n does NOT halve the σ interval — plan with the table above', 'Pool replicates across days properly (variance components) when days differ'],
  },
  {
    id: 'z_test', group: 'ch8', name: 'z Test (Mean)', formula: 'z = (X̄−μ₀)/(σ/√n)',
    tags: ['hypothesis test', 'mean', 'known sigma'],
    overview: "The hypothesis test for a mean when σ is known: how many standard errors does the sample mean sit from the claimed μ₀? Beyond ±1.96 (at α=0.05) the claim and the data are in statistically significant conflict.",
    variables: [['μ₀', 'the claimed/hypothesized mean under H₀'], ['z', 'standardized distance of the evidence from the claim'], ['p-value', 'probability of evidence this extreme if H₀ were true']],
    thinking: {
      workflow: ['State H₀ (μ=μ₀) and H₁ (≠, <, or >) BEFORE seeing results', 'Verify σ is genuinely known; else t-test', 'Compute z and the tail probability matching H₁', 'Report p-value AND effect size — significance is not importance'],
      when: ['Testing against specs/claims with established process σ', 'Regulated QC where σ is documented'],
      notWhen: ['σ estimated from this sample (t-test)', 'Multiple peeks/tests without correction'],
      assumptions: ['Known σ; random sample; normal population or CLT-adequate n'],
    },
    code: `import numpy as np
from scipy import stats

# --- filling line: claims mu = 500ml, sigma known = 4ml --------------
sigma, mu0 = 4.0, 500.0
rng = np.random.default_rng(9)
sample = rng.normal(498.6, sigma, 36)     # today's 36 bottles
xbar, n = sample.mean(), len(sample)

z = (xbar - mu0) / (sigma / np.sqrt(n))
p_two = 2 * stats.norm.sf(abs(z))
print(f"X-bar = {xbar:.2f}, z = {z:.2f}, two-sided p = {p_two:.4f}")

alpha = 0.05
print("reject H0" if p_two < alpha else "fail to reject H0",
      f"at alpha={alpha}")

# Effect size in real units - the number the operator needs:
print(f"estimated shift: {xbar - mu0:+.2f} ml "
      f"({(xbar-mu0)/sigma:+.2f} sigma units)")

# Power thinking: what shifts would this n reliably catch?
shift = 1.5
power = stats.norm.sf(1.96 - shift/(sigma/np.sqrt(n))) \\
        + stats.norm.cdf(-1.96 - shift/(sigma/np.sqrt(n)))
print(f"power to detect a {shift}ml shift with n={n}: {power:.2f}")`,
    scenario: {
      title: 'Fill-line drift detection',
      problem: 'QC checks each shift whether the line still fills at the labeled 500 ml, with σ known from years of control charts.',
      dataset: '36 bottles sampled this shift; σ=4 documented.',
      why: 'Known σ makes z exact; the test formalizes "is a 1.4 ml shortfall real or noise?" with a controlled false-alarm rate.',
      output: 'z, p-value, estimated shift, and detection power.',
      interpretation: 'p=0.035: the shortfall is likely real — recalibrate. The −1.4 ml effect size tells engineering how much.',
      pitfalls: 'Statistically significant ≠ practically important: with n=3,600, a 0.1 ml shift also "rejects" — the effect size keeps it honest.',
    },
    mistakes: ['Choosing the tail AFTER seeing the data', 'Reporting p without the effect size', '"Fail to reject" read as "H₀ proven true"', 'Using z when σ came from the sample'],
    tips: ['Fix α, tails, and n before touching the data', 'Always translate z back into units the decision-maker uses', 'Power analysis belongs in the design, not the post-mortem'],
  },
  {
    id: 't_test', group: 'ch8', name: 't Test (Mean)', formula: 't = (X̄−μ₀)/(s/√n)',
    tags: ['hypothesis test', 'mean', 't distribution', 'one sample'],
    overview: "The real-world one-sample mean test: σ unknown, s stands in, the t distribution (df=n−1) prices the substitution. THE test for 'does our mean differ from the claimed/target value?'",
    variables: [['s/√n', 'estimated standard error'], ['t', 'the test statistic'], ['df', 'n−1 degrees of freedom'], ["Cohen's d", '(X̄−μ₀)/s — the standardized effect size to report alongside']],
    thinking: {
      workflow: ['State hypotheses and α up front', 'Check rough normality for small n (or lean on CLT for larger n)', 'scipy.stats.ttest_1samp; match the alternative to H₁', 'Report t, df, p, AND the effect in real units'],
      when: ['Any mean-vs-target question with sample-estimated spread (the usual case)', 'Before/after single-group checks against a benchmark'],
      notWhen: ['Comparing two groups (two-sample tests)', 'Heavy skew + small n (Wilcoxon or bootstrap)'],
      assumptions: ['Random sample; approximate normality or adequate n'],
    },
    code: `import numpy as np
from scipy import stats

# --- energy bars claim 20g protein; the lab measures 12 bars ---------
rng = np.random.default_rng(10)
protein = rng.normal(19.1, 1.1, 12).round(2)
mu0 = 20.0

t_stat, p_two = stats.ttest_1samp(protein, mu0)
print(f"X-bar = {protein.mean():.2f}g, s = {protein.std(ddof=1):.2f}")
print(f"t({len(protein)-1}) = {t_stat:.2f}, two-sided p = {p_two:.4f}")

# The consumer question is one-sided (are they under-delivering?):
t1, p_less = stats.ttest_1samp(protein, mu0, alternative="less")
print(f"one-sided (mu < 20): p = {p_less:.4f}")

# Effect size and CI - the full reporting package:
d = (protein.mean() - mu0) / protein.std(ddof=1)
lo, hi = stats.t.interval(0.95, len(protein)-1,
                          loc=protein.mean(), scale=stats.sem(protein))
print(f"Cohen's d = {d:.2f}; 95% CI for mu: ({lo:.2f}, {hi:.2f})")
print(f"shortfall estimate: {protein.mean()-mu0:+.2f}g per bar")`,
    scenario: {
      title: 'Label-claim verification',
      problem: 'A consumer lab tests whether protein bars deliver the labeled 20 g of protein.',
      dataset: '12 bars assayed for protein content.',
      why: 'σ is unknown and n is small — the t-test is the standard, and the one-sided alternative matches the consumer-protection question exactly.',
      output: 't, p, Cohen’s d, and a CI for the true mean content.',
      interpretation: 'p=0.008 one-sided with a −0.9 g estimated shortfall: the label claim fails; the CI (18.4–19.8) quantifies by how much.',
      pitfalls: 'Non-random bar selection (one factory lot) limits the claim to that lot, whatever the p-value says.',
    },
    mistakes: ['Two-sided p reported when the pre-registered question was one-sided (or vice versa)', 'p-value without effect size or CI', 'Normality panic at large n (CLT has your back) or normality neglect at n=6'],
    tips: ['ttest_1samp(alternative=...) covers all three H₁ forms', 'CI and test agree by construction: μ₀ outside the 95% CI ⟺ p<0.05 two-sided', 'Lead the write-up with the effect and CI; p supports, not stars'],
  },
  {
    id: 'z_prop', group: 'ch8', name: 'z Test (Proportion)', formula: 'z = (p̂−p₀)/√(p₀q₀/n)',
    tags: ['hypothesis test', 'proportion', 'rates'],
    overview: "Tests whether a sample proportion is consistent with a claimed rate p₀ — with the standard error computed FROM p₀ (under H₀), not from p̂. The test behind 'did our conversion rate really beat the historical 5%?'",
    variables: [['p₀, q₀', 'the claimed rate and its complement — used in the SE'], ['p̂', 'observed proportion'], ['z', 'standardized gap between observed and claimed']],
    thinking: {
      workflow: ['State p₀ and the direction of H₁ before looking', 'Check np₀ and nq₀ ≥ 5', 'SE uses p₀q₀ (the H₀ world), not p̂q̂', 'Report p-value plus the rate difference in points'],
      when: ['Rate-vs-benchmark questions: conversion vs historical, defect vs contract', 'Compliance testing against stated percentages'],
      notWhen: ['Comparing two observed rates (two-proportion z-test)', 'Tiny expected counts (exact binomial test instead)'],
      assumptions: ['Random sample; independence; np₀, nq₀ ≥ 5'],
    },
    code: `import numpy as np
from scipy import stats
from statsmodels.stats.proportion import proportions_ztest

# --- did the new landing page beat the historical 5.0% rate? ---------
p0 = 0.05
conversions, n = 96, 1600
p_hat = conversions / n

# By hand - note the SE uses p0, the null world:
se0 = np.sqrt(p0 * (1 - p0) / n)
z = (p_hat - p0) / se0
p_one = stats.norm.sf(z)                    # H1: p > p0
print(f"p-hat = {p_hat:.3%}, z = {z:.2f}, one-sided p = {p_one:.4f}")

# statsmodels equivalent:
z2, p2 = proportions_ztest(conversions, n, value=p0,
                           alternative="larger", prop_var=p0)
print(f"statsmodels: z = {z2:.2f}, p = {p2:.4f}")

# Exact binomial - the safety net for small counts:
print(f"exact binomial p = "
      f"{stats.binomtest(conversions, n, p0, alternative='greater').pvalue:.4f}")

# Effect in business units:
print(f"lift: {p_hat-p0:+.2%} points -> "
      f"{(p_hat-p0)*100_000:.0f} extra conversions per 100k visitors")`,
    scenario: {
      title: 'Landing-page conversion vs benchmark',
      problem: 'Marketing claims the redesigned page beats the long-run 5% conversion benchmark; analytics must adjudicate.',
      dataset: '96 conversions in 1,600 visits to the new page.',
      why: 'The benchmark is an established rate — a one-sample proportion test against p₀=5% is the exact fit, one-sided per the claim.',
      output: 'z, p, and the lift in points and monthly conversions.',
      interpretation: 'p=0.033: the 6% observed rate likely beats the benchmark; the +1 point lift translates to ~1,000 conversions per 100k visits.',
      pitfalls: 'Novelty effects fade — the significant week-one lift may not persist; retest after the newness wears off.',
    },
    mistakes: ['SE built from p̂ instead of p₀ (a real numerical difference)', 'Normal approximation with expected counts under 5', 'Celebrating significance without the lift size'],
    tips: ['binomtest is exact and never embarrasses you — use it when counts are modest', 'prop_var=p0 in statsmodels enforces the correct null SE', 'Convert every result into "extra conversions per period" for the meeting'],
  },
  {
    id: 'chi_var', group: 'ch8', name: 'χ² Test (Variance)', formula: 'χ² = (n−1)s²/σ₀²',
    tags: ['hypothesis test', 'variance', 'chi-square', 'consistency'],
    overview: "Tests whether a population variance equals a claimed σ₀²: the ratio (n−1)s²/σ₀² follows chi-square under H₀. The test for consistency claims — 'our process spread is within spec' — and, like its CI sibling, fragile to non-normality.",
    variables: [['σ₀²', 'the claimed/spec variance under H₀'], ['(n−1)s²/σ₀²', 'the chi-square statistic'], ['df', 'n−1']],
    thinking: {
      workflow: ['Confirm the question is about SPREAD vs a spec value', 'Check normality carefully (QQ plot at minimum)', 'Compute the statistic; compare to χ² critical values per H₁ direction', 'Convert the verdict into process language (capability, consistency)'],
      when: ['Spec compliance on variability: filling, machining, assay precision', 'Detecting variance increases that precede mean drifts'],
      notWhen: ['Non-normal data (levene/bootstrap alternatives)', 'Comparing two variances (F-test)'],
      assumptions: ['Normal population — strictly; random sample'],
    },
    code: `import numpy as np
from scipy import stats

# --- spec: fill-volume sigma must be <= 2.0 ml (sigma0^2 = 4.0) ------
sigma0_sq = 4.0
rng = np.random.default_rng(11)
fills = rng.normal(500, 2.6, 30)          # process has drifted noisier
n, s2 = len(fills), fills.var(ddof=1)
df = n - 1

chi2 = df * s2 / sigma0_sq
# H1: sigma^2 > sigma0^2 (we fear MORE spread) - right-tail test
p_val = stats.chi2.sf(chi2, df)
print(f"s^2 = {s2:.2f} vs spec {sigma0_sq}")
print(f"chi2({df}) = {chi2:.1f}, right-tail p = {p_val:.4f}")

alpha = 0.05
crit = stats.chi2.ppf(1 - alpha, df)
print(f"critical value = {crit:.1f} -> "
      f"{'REJECT: spread exceeds spec' if chi2 > crit else 'within spec'}")

# Normality fragility check - always run before trusting this test:
_, p_norm = stats.shapiro(fills)
print(f"Shapiro normality p = {p_norm:.3f} "
      f"({'ok to proceed' if p_norm > 0.05 else 'use bootstrap/levene'})")`,
    scenario: {
      title: 'Fill-line variance compliance',
      problem: 'The bottling contract caps fill-volume σ at 2.0 ml; QA tests whether the current line still complies.',
      dataset: '30 fill volumes from the current run.',
      why: 'The contract clause is written on variance, and the chi-square test is the standard referee for one-sample variance claims.',
      output: 'χ², p-value, and a compliance verdict.',
      interpretation: 'p=0.003: spread has credibly exceeded spec — schedule maintenance before the customer’s incoming inspection finds it.',
      pitfalls: 'A single clogged-nozzle outlier can fail the test alone — investigate flagged runs before condemning the process.',
    },
    mistakes: ['Skipping the normality check the test critically depends on', 'Wrong tail for the business fear (excess spread = right tail)', 'Confusing σ and σ² when plugging in the spec'],
    tips: ['Shapiro/QQ first, chi-square second — every time', 'Variance often deteriorates before the mean drifts: test spread proactively', 'For two machines/lines, the F-test is the comparison tool'],
  },
];
