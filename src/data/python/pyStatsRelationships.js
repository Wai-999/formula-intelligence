// Python Hub content — Stats Ch 9 (two-sample tests), Ch 10 (correlation &
// regression), Ch 11 (chi-square tests).
export const PY_STATS_RELATIONSHIPS = [
  {
    id: 'z2mu', group: 'ch9', name: 'z Test (2 Means)', formula: 'z = (X̄₁−X̄₂)/√(σ₁²/n₁+σ₂²/n₂)',
    tags: ['two sample', 'means', 'comparison', 'known sigma'],
    overview: "Compares two group means when both σ's are known: the gap between sample means, standardized by the combined standard error. The known-σ premise limits it to mature, characterized processes — but the SE-combination logic underneath powers every A/B comparison to come.",
    variables: [['X̄₁−X̄₂', 'the observed gap between group means'], ['σ₁²/n₁+σ₂²/n₂', 'variances of each mean, ADDED (independent groups)'], ['z', 'gap in combined-SE units']],
    thinking: {
      workflow: ['Two INDEPENDENT groups, both σ’s documented?', 'H₀: μ₁=μ₂; pick the alternative before looking', 'Combine SEs by adding variances, then root', 'Standardize the gap; convert to p; report the gap in real units'],
      when: ['Comparing lines/plants/instruments with long-established σ’s', 'Teaching the SE-of-a-difference concept cleanly'],
      notWhen: ['σ’s estimated from these samples (two-sample t)', 'Paired/matched data (the pairing changes everything)'],
      assumptions: ['Independent groups; known σ’s; normality or adequate n per group'],
    },
    code: `import numpy as np
from scipy import stats

# --- two filling lines, sigmas known from years of SPC ---------------
sigma1, sigma2 = 3.0, 3.5
rng = np.random.default_rng(0)
line1 = rng.normal(501.2, sigma1, 40)
line2 = rng.normal(499.8, sigma2, 45)

gap = line1.mean() - line2.mean()
se = np.sqrt(sigma1**2/len(line1) + sigma2**2/len(line2))
z = gap / se
p = 2 * stats.norm.sf(abs(z))
print(f"gap = {gap:.2f} ml, SE = {se:.2f}, z = {z:.2f}, p = {p:.4f}")

# The key idea made visible - variances ADD for a difference:
print(f"SE of line1 mean: {sigma1/np.sqrt(40):.2f}")
print(f"SE of line2 mean: {sigma2/np.sqrt(45):.2f}")
print(f"SE of the GAP   : {se:.2f}  (root of summed squares)")

# Practical translation:
print(f"lines differ by {gap:.1f} ml "
      f"({'significant' if p < 0.05 else 'not significant'} at 5%)")`,
    scenario: {
      title: 'Two production lines drifting apart',
      problem: 'Plant QA suspects Line A now fills heavier than Line B; both lines have documented σ’s from years of control charting.',
      dataset: '40 and 45 bottles sampled from the two lines this shift.',
      why: 'Known σ’s make z exact, and the added-variances SE correctly prices the noise in a DIFFERENCE of two means.',
      output: 'The gap, its SE, z, and p.',
      interpretation: 'A significant 1.4 ml gap means one line needs recalibration — the gap size says which adjustment magnitude.',
      pitfalls: 'Same-shift sampling can share a cause (same batch of syrup) — independence between groups deserves a hard look.',
    },
    mistakes: ['Averaging SEs instead of adding variances', 'Treating paired data as independent groups', 'Using this when σ’s are sample-estimated'],
    tips: ['SE of a difference: always √(SE₁²+SE₂²) for independent groups', 'The z version is rare in practice — but its SE logic is universal', 'Report the gap with units first; the p-value second'],
  },
  {
    id: 't2mu', group: 'ch9', name: 't Test (2 Means)', formula: 't = (X̄₁−X̄₂)/√(s₁²/n₁+s₂²/n₂)',
    tags: ['two sample', 't test', 'welch', 'ab test'],
    overview: "The workhorse two-group comparison: gap between means over the estimated SE of that gap, with Welch's df adjustment handling unequal variances. This is the statistical engine behind most A/B tests on continuous metrics.",
    variables: [['s₁², s₂²', 'each group’s sample variance'], ['Welch df', 'adjusted degrees of freedom (not n₁+n₂−2 unless variances are equal)'], ['t', 'the gap in estimated-SE units']],
    thinking: {
      workflow: ['Two independent groups, continuous metric', 'Default to Welch (equal_var=False) — it costs nothing, protects always', 'Run the test; match tails to the pre-stated hypothesis', 'Report gap, CI of the gap, and Cohen’s d — not just p'],
      when: ['A/B tests on revenue, time-on-task, scores', 'Treatment vs control comparisons of any continuous outcome'],
      notWhen: ['Paired/matched designs (paired t is far more powerful)', 'Tiny samples of heavily skewed data (Mann-Whitney/bootstrap)'],
      assumptions: ['Independence between and within groups; approximate normality or decent n per group'],
    },
    code: `import numpy as np
from scipy import stats

# --- A/B: new onboarding flow vs old, time-to-first-value (min) ------
rng = np.random.default_rng(1)
control = rng.normal(38.0, 12.0, 220)
treatment = rng.normal(34.5, 9.0, 210)     # faster AND less variable

# Welch's t-test - the correct default:
t_stat, p = stats.ttest_ind(treatment, control, equal_var=False)
gap = treatment.mean() - control.mean()
print(f"gap = {gap:+.1f} min, t = {t_stat:.2f}, p = {p:.4f}")

# CI for the difference - the number the decision actually needs:
se = np.sqrt(treatment.var(ddof=1)/len(treatment)
             + control.var(ddof=1)/len(control))
# Welch df:
v1, v2 = treatment.var(ddof=1)/len(treatment), control.var(ddof=1)/len(control)
df = (v1+v2)**2 / (v1**2/(len(treatment)-1) + v2**2/(len(control)-1))
t_crit = stats.t.ppf(0.975, df)
print(f"95% CI for the gap: ({gap - t_crit*se:.1f}, {gap + t_crit*se:.1f}) min")

# Standardized effect size:
sp = np.sqrt((control.var(ddof=1) + treatment.var(ddof=1)) / 2)
print(f"Cohen's d = {gap/sp:.2f}  (0.2 small / 0.5 medium / 0.8 large)")`,
    scenario: {
      title: 'Onboarding flow A/B test',
      problem: 'Product tests whether a redesigned onboarding reduces time-to-first-value versus the current flow.',
      dataset: '~200 randomized users per arm with their completion times.',
      why: 'Independent randomized groups with a continuous metric is exactly the Welch t setting; the CI on the gap sizes the win in minutes.',
      output: 'Gap, CI, p, and Cohen’s d.',
      interpretation: '−3.5 minutes (CI −5.5 to −1.5): ship it — and quote the CI, since the true win could be as small as 1.5 min.',
      pitfalls: 'Time metrics are right-skewed; with these n’s the CLT covers it, but medians/log-transform are worth a robustness check.',
    },
    mistakes: ['Student’s t with equal_var=True by default (Welch dominates)', 'Ignoring skew at small n', 'p<0.05 shipped without the CI of the gap', 'Peeking repeatedly without correction'],
    tips: ['equal_var=False always — there is no practical downside', 'The CI of the difference is the deliverable; p is the gatekeeper', 'Run Mann-Whitney as a robustness footnote for skewed metrics'],
  },
  {
    id: 't_dep', group: 'ch9', name: 't Test (Dependent)', formula: 't = (D̄−μD)/(sD/√n)',
    tags: ['paired', 'before after', 'repeated measures'],
    overview: "The paired-samples test: reduce each pair to its difference, then run a one-sample t on those differences. Pairing removes between-subject variability from the noise — routinely turning undetectable effects into obvious ones.",
    variables: [['D', 'per-pair difference (after − before)'], ['D̄', 'mean difference'], ['sD', 'SD of the differences — the ONLY spread that matters'], ['μD', 'hypothesized mean difference, usually 0']],
    thinking: {
      workflow: ['Confirm true pairing (same subject/unit measured twice, or matched pairs)', 'Compute differences; test them as one sample', 'Check differences (not raw scores) for rough normality', 'Report D̄ with its CI — the effect in natural units'],
      when: ['Before/after on the same subjects (training, treatment, redesign)', 'Matched-pair designs (twin stores, split plots)'],
      notWhen: ['Independent groups (pairing structure absent)', 'Pairs contaminated by carryover effects (learning, fatigue) without design controls'],
      assumptions: ['Differences approximately normal; pairs independent of each other'],
    },
    code: `import numpy as np
from scipy import stats

# --- same 15 stores, sales before and after a layout change ----------
rng = np.random.default_rng(2)
store_level = rng.normal(200, 60, 15)          # stores differ a LOT
before = store_level + rng.normal(0, 8, 15)
after = store_level + 6 + rng.normal(0, 8, 15) # true +6 effect

# WRONG: independent t drowned by between-store variance
t_bad, p_bad = stats.ttest_ind(after, before)
# RIGHT: paired t sees through it
t_good, p_good = stats.ttest_rel(after, before)
print(f"independent t: p = {p_bad:.3f}   <- misses the effect")
print(f"paired t     : p = {p_good:.4f}  <- finds it")

D = after - before
print(f"mean difference D-bar = {D.mean():+.1f}, sD = {D.std(ddof=1):.1f}")
lo, hi = stats.t.interval(0.95, len(D)-1, loc=D.mean(),
                          scale=stats.sem(D))
print(f"95% CI for the effect: ({lo:+.1f}, {hi:+.1f}) per store")
# Pairing subtracted away the store-to-store noise (sigma=60), leaving
# only the within-store noise (sigma~11) to fight.`,
    scenario: {
      title: 'Store layout change evaluation',
      problem: 'A retailer pilots a new layout in 15 stores and compares each store’s sales before vs after.',
      dataset: 'Weekly sales per store, pre and post change.',
      why: 'Stores differ enormously from each other; pairing each store with itself removes that variability, exposing a +6 effect the independent test cannot see.',
      output: 'Mean per-store lift with CI; the paired-vs-independent contrast.',
      interpretation: '+6.2 per store (CI +1.8 to +10.5): roll out — and note the independent test would have wrongly said "no effect."',
      pitfalls: 'Seasonality between the before and after windows is confounded with the change — control periods or matched calendar weeks help.',
    },
    mistakes: ['Running independent t on paired data (throws away the design’s power)', 'Checking normality of raw scores instead of differences', 'Ignoring time confounds between measurement occasions'],
    tips: ['ttest_rel, or equivalently ttest_1samp(differences, 0)', 'Pairing is a power strategy — design for it when units vary widely', 'Always plot the per-pair differences; one weird pair can drive everything'],
  },
  {
    id: 'd_bar', group: 'ch9', name: 'Mean of Differences', formula: 'D̄ = ΣD/n',
    tags: ['paired', 'differences', 'effect size'],
    overview: "The average of per-pair differences — the effect-size numerator of the paired t-test and the single number that answers 'how much did it change, per unit?' Its sign convention (after−before vs before−after) decides what + means.",
    variables: [['D', 'each pair’s difference, with a fixed sign convention'], ['n', 'number of pairs'], ['D̄', 'the average change per pair']],
    thinking: {
      workflow: ['Fix the sign convention FIRST and write it down', 'Compute per-pair differences; inspect them (plot!)', 'Average → D̄, the headline effect', 'Send D̄ with sD into the paired test/CI'],
      when: ['Summarizing any paired change: per-store lift, per-patient improvement', 'Communicating effects in natural per-unit language'],
      notWhen: ['Unpaired data (no meaningful per-unit difference exists)', 'Ratios are the natural scale (log-differences may serve better)'],
      assumptions: ['True pairing; consistent sign convention throughout'],
    },
    code: `import numpy as np
import pandas as pd

# --- blood pressure: 10 patients, before/after medication ------------
df = pd.DataFrame({
    "patient": range(1, 11),
    "before": [152, 148, 161, 145, 158, 150, 166, 149, 155, 147],
    "after":  [141, 143, 150, 146, 145, 144, 152, 147, 143, 140],
})
# Sign convention: D = after - before -> negative = improvement
df["D"] = df["after"] - df["before"]
print(df)

d_bar = df["D"].mean()
print(f"D-bar = {d_bar:+.1f} mmHg per patient "
      f"({'improvement' if d_bar < 0 else 'worsening'})")

# The distribution of D matters as much as its mean:
print(f"sD = {df['D'].std(ddof=1):.1f}, "
      f"improved: {(df['D'] < 0).sum()}/10 patients")
print(f"range of responses: {df['D'].min()} to {df['D'].max()}")
# One patient got worse (+1) - D-bar summarizes, the list informs.`,
    scenario: {
      title: 'Medication effect per patient',
      problem: 'A clinician summarizes how much a medication changed blood pressure across 10 monitored patients.',
      dataset: 'Before/after readings per patient.',
      why: 'D̄ is the per-patient average change — the clinically communicable effect ("about 8 mmHg reduction") that the paired test then certifies.',
      output: 'D̄ = −8.3 mmHg, with the per-patient response list.',
      interpretation: '9 of 10 improved, average −8.3; the one non-responder is a clinical follow-up, not a statistical embarrassment.',
      pitfalls: 'Flipping the sign convention mid-analysis silently reverses every conclusion — fix it in the column name.',
    },
    mistakes: ['Inconsistent sign conventions across the analysis', 'Reporting D̄ without the response distribution', 'Averaging percentage changes when absolute changes were the question (or vice versa)'],
    tips: ['Name the column "after_minus_before" — self-documenting', 'Always show the per-pair list or plot with D̄', 'D̄ and sD are the complete input set for the paired t'],
  },
  {
    id: 'sd_dep', group: 'ch9', name: 'SD of Differences', formula: 'sD = √{[nΣD²−(ΣD)²]/[n(n−1)]}',
    tags: ['paired', 'spread', 'differences'],
    overview: "The sample SD applied to per-pair differences: how consistently the change showed up across pairs. Small sD = uniform effect; large sD = heterogeneous response — a finding in itself, beyond the average.",
    variables: [['ΣD, ΣD²', 'sums over per-pair differences'], ['sD', 'spread of the changes'], ['sD/√n', 'the paired test’s SE — where sD earns its keep']],
    thinking: {
      workflow: ['Compute differences with the fixed convention', 'sD via ddof=1 (it is a sample SD of D’s)', 'Read it two ways: SE ingredient AND effect-consistency measure', 'Large sD → look for responder/non-responder structure'],
      when: ['Any paired analysis (it is half the test)', 'Assessing whether an intervention works uniformly or selectively'],
      notWhen: ['Unpaired designs', 'When pairs are correlated with each other (clustered pairs need multilevel treatment)'],
      assumptions: ['Independent pairs; differences roughly normal for the downstream t'],
    },
    code: `import numpy as np
from scipy import stats

# --- two training programs, same average lift, different consistency -
rng = np.random.default_rng(3)
n = 24
# Program A: uniform +5 effect. Program B: +5 average but hit-or-miss.
d_A = rng.normal(5, 2, n)
d_B = np.where(rng.uniform(size=n) < 0.5,
               rng.normal(11, 2, n), rng.normal(-1, 2, n))

for name, d in [("A (uniform)", d_A), ("B (hit-or-miss)", d_B)]:
    sD = d.std(ddof=1)
    t, p = stats.ttest_1samp(d, 0)
    print(f"{name:16s} D-bar={d.mean():+.1f}  sD={sD:4.1f}  "
          f"t={t:5.2f}  p={p:.4f}")
# Same average effect; B's huge sD costs it statistical certainty AND
# reveals that B helps only half the trainees.

# The computational form, verified once:
d = d_A
sD_hand = np.sqrt((n*(d**2).sum() - d.sum()**2) / (n*(n-1)))
print(f"computational form check: {sD_hand:.3f} "
      f"vs ddof=1: {d.std(ddof=1):.3f}")`,
    scenario: {
      title: 'Training program consistency',
      problem: 'HR compares two training programs whose average score lifts look identical — but are they equally reliable?',
      dataset: 'Per-employee before/after score differences under each program.',
      why: 'sD is where the difference lives: Program A lifts everyone ~5 points; Program B averages +5 by mixing +11 responders with −1 non-responders.',
      output: 'sD per program, with the paired-t consequences.',
      interpretation: 'Choose A for dependable outcomes — or investigate what separates B’s responders, which may be the bigger prize.',
      pitfalls: 'Averages conceal bimodal responses; sD (and a histogram of D) is the detector.',
    },
    mistakes: ['ddof=0 on the differences', 'Treating a large sD as mere noise instead of possible subgroup structure', 'Comparing sD across programs measured on different scales'],
    tips: ['Histogram the D’s whenever sD looks large relative to D̄', 'sD/√n is the paired SE — small sD is why pairing wins', 'Bimodal D distributions are findings; chase them'],
  },
  {
    id: 'z2p', group: 'ch9', name: 'z Test (2 Proportions)', formula: 'z = (p̂₁−p̂₂)/√[p̄q̄(1/n₁+1/n₂)]',
    tags: ['two proportions', 'ab test', 'rates', 'pooled'],
    overview: "Compares two observed rates using a POOLED proportion in the standard error (legitimate under H₀: the rates are equal). This is THE A/B conversion test — the referee for 'did variant B really convert better?'",
    variables: [['p̂₁, p̂₂', 'the two observed rates'], ['p̄', 'pooled rate: all successes over all trials'], ['p̄q̄(1/n₁+1/n₂)', 'the pooled SE² of the rate difference']],
    thinking: {
      workflow: ['Randomized assignment verified? (else it is an observational comparison)', 'Pool the rate for the SE; compute z and p per the pre-stated tail', 'Report the lift with a CI (unpooled SE for the CI)', 'Check expected counts ≥ 5 in all four cells'],
      when: ['A/B conversion tests, defect-rate comparisons across lines', 'Any two-group rate comparison with decent counts'],
      notWhen: ['Small cells (Fisher’s exact instead)', 'More than two groups (chi-square first)', 'Repeated peeking without sequential correction'],
      assumptions: ['Independent samples; np ≥ 5-ish per cell; stable rates within the window'],
    },
    code: `import numpy as np
from scipy import stats
from statsmodels.stats.proportion import proportions_ztest, confint_proportions_2indep

# --- checkout A/B: control vs new flow -------------------------------
conv = np.array([412, 471])         # conversions
n = np.array([8_050, 8_112])        # visitors
p1, p2 = conv / n
print(f"control {p1:.3%}  vs  variant {p2:.3%}  "
      f"(lift {p2-p1:+.3%} points)")

# Pooled z-test (H1: variant better -> one-sided):
z, p_val = proportions_ztest(conv, n, alternative="smaller")
print(f"z = {z:.2f}, one-sided p = {p_val:.4f}")

# By hand, to see the pooling:
p_pool = conv.sum() / n.sum()
se = np.sqrt(p_pool * (1-p_pool) * (1/n[0] + 1/n[1]))
print(f"pooled p = {p_pool:.4f}, SE = {se:.5f}, "
      f"z = {(p1-p2)/se:.2f}")

# CI for the lift (unpooled - correct for estimation):
lo, hi = confint_proportions_2indep(conv[1], n[1], conv[0], n[0],
                                    method="wald")
print(f"95% CI for lift: ({lo:+.3%}, {hi:+.3%})")
print(f"business: {12_000_000*(p2-p1):,.0f} extra conversions "
      f"per 12M annual visitors (point estimate)")`,
    scenario: {
      title: 'Checkout flow A/B test',
      problem: 'E-commerce tests a streamlined checkout against the current one on conversion rate.',
      dataset: '~8k randomized visitors per arm with conversion outcomes.',
      why: 'Two independent randomized rates: the pooled z-test is the standard referee, and the lift CI converts the verdict into annual revenue.',
      output: 'z, p, lift with CI, and the annualized conversion impact.',
      interpretation: '+0.7 points (CI +0.1 to +1.3): real but possibly small — the CI’s lower end should drive the conservative revenue case.',
      pitfalls: 'Stopping the test the first day p dips under 0.05 inflates false positives badly — fix the sample size in advance.',
    },
    mistakes: ['Pooled SE reused for the CI (pooling is a test-only move)', 'Peeking and early stopping without correction', 'Ignoring segment mix shifts between arms (randomization check)'],
    tips: ['Pre-register n, tail, and α; then don’t touch the dials', 'Report lift CI in points AND business units', 'For tiny cells, Fisher’s exact (stats.fisher_exact) is the fallback'],
  },
  {
    id: 'f_test', group: 'ch9', name: 'F Test (2 Variances)', formula: 'F = s₁²/s₂²',
    tags: ['variance comparison', 'f distribution', 'spread'],
    overview: "Compares two variances by their ratio: near 1 means similar spread, far from 1 means different. Notoriously sensitive to non-normality — modern practice often prefers Levene's test — but the F-ratio concept is the foundation ANOVA is built on.",
    variables: [['s₁², s₂²', 'the two sample variances (larger conventionally on top)'], ['F', 'their ratio'], ['df₁, df₂', 'numerator and denominator degrees of freedom']],
    thinking: {
      workflow: ['Question is about SPREAD equality between two groups', 'Check normality first — this test is fragile to it', 'Compute F with df’s; or run Levene for robustness', 'Interpret in process terms: which source is noisier, and by how much'],
      when: ['Comparing consistency of two machines/labs/methods', 'Classical pre-check before pooled-variance procedures (though Welch made that obsolete)'],
      notWhen: ['Non-normal data (Levene/Brown-Forsythe instead)', 'More than two groups (Bartlett/Levene generalize)'],
      assumptions: ['Both populations normal (strictly!); independent samples'],
    },
    code: `import numpy as np
from scipy import stats

# --- two suppliers' part-diameter consistency ------------------------
rng = np.random.default_rng(4)
supplier_A = rng.normal(10.00, 0.030, 30)
supplier_B = rng.normal(10.00, 0.055, 30)   # same mean, noisier

s2_A, s2_B = supplier_A.var(ddof=1), supplier_B.var(ddof=1)
F = max(s2_A, s2_B) / min(s2_A, s2_B)       # larger on top
df1 = df2 = 30 - 1
p = 2 * stats.f.sf(F, df1, df2)             # two-sided
print(f"s_A = {np.sqrt(s2_A):.4f}, s_B = {np.sqrt(s2_B):.4f}")
print(f"F({df1},{df2}) = {F:.2f}, two-sided p = {p:.4f}")

# The robust modern alternative - use this in reports:
stat, p_lev = stats.levene(supplier_A, supplier_B)
print(f"Levene: p = {p_lev:.4f}  (robust to non-normality)")

# Practical readout:
print(f"B's SD is {np.sqrt(s2_B/s2_A):.1f}x A's -> "
      "B needs wider tolerances or a process fix")`,
    scenario: {
      title: 'Supplier consistency comparison',
      problem: 'Procurement compares two suppliers whose parts have identical average diameters but possibly different consistency.',
      dataset: '30 measured parts per supplier.',
      why: 'The purchasing decision rides on spread, not means; the F-ratio (with Levene as the robustness check) quantifies the consistency gap.',
      output: 'F, p, Levene’s p, and the SD ratio.',
      interpretation: 'Supplier B’s SD is ~1.8× A’s: at the same price, A wins; B’s parts consume more of the assembly tolerance budget.',
      pitfalls: 'One outlier part inflates a variance quadratically — screen measurement errors before comparing.',
    },
    mistakes: ['Trusting F under visible non-normality', 'Forgetting the convention (larger variance on top) and halving/doubling p wrongly', 'Using F-then-pool for t-tests (Welch made that workflow obsolete)'],
    tips: ['Levene’s test is the safer default in real reports', 'Report the SD RATIO — audiences grasp "1.8× noisier" instantly', 'This ratio-of-variances idea IS the F in ANOVA next chapter'],
  },
  {
    id: 'pearson', group: 'ch10', name: 'Pearson r', formula: 'r = [nΣxy−(Σx)(Σy)]/√{[nΣx²−(Σx)²][nΣy²−(Σy)²]}',
    tags: ['correlation', 'linear', 'association'],
    overview: "The strength and direction of LINEAR association between two variables, scaled to [−1, +1]. The most-quoted statistic in exploratory analysis — and the most misread: it sees only lines, and it never, ever says 'causes'.",
    variables: [['r', '−1 (perfect negative) through 0 (no linear link) to +1'], ['r²', 'share of variance linearly shared (preview of R²)'], ['n', 'pairs — small n makes r wildly unstable']],
    thinking: {
      workflow: ['SCATTER PLOT FIRST — always', 'Compute r only if the relationship looks linear', 'Test significance (t on r) and interval it for small n', 'Say "associated," never "causes," without a design that earns it'],
      when: ['Screening candidate drivers for linear relationships', 'Quantifying co-movement (assets, metrics, sensors)'],
      notWhen: ['Curved relationships (r misses them entirely — Spearman or transforms)', 'Data with influential outliers (one point can manufacture r=0.9)', 'Trended time series (spurious correlation heaven)'],
      assumptions: ['Linearity; bivariate-normal-ish for inference; independent pairs'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(5)

# --- marketing spend vs sales across 40 regions ----------------------
spend = rng.uniform(10, 100, 40)
sales = 50 + 2.1 * spend + rng.normal(0, 25, 40)
r, p = stats.pearsonr(spend, sales)
print(f"r = {r:.3f}, p = {p:.2e}, r^2 = {r*r:.2f}")

# --- the cautionary quartet ------------------------------------------
# 1. Nonlinear: strong relationship, r near ZERO
x = np.linspace(-3, 3, 100)
y_curve = x**2 + rng.normal(0, 0.5, 100)
print(f"perfect curve: r = {stats.pearsonr(x, y_curve)[0]:.3f} "
      "<- r is blind to curves")

# 2. One outlier manufacturing correlation from nothing:
x0 = rng.normal(0, 1, 30); y0 = rng.normal(0, 1, 30)
x1, y1 = np.append(x0, 10), np.append(y0, 10)
print(f"no relationship + 1 outlier: r = "
      f"{stats.pearsonr(x1, y1)[0]:.3f} <- one point did that")

# 3. Two trended series, causally unrelated:
t = np.arange(60)
a = 10 + 0.5*t + rng.normal(0, 2, 60)
b = 3 + 0.8*t + rng.normal(0, 3, 60)
print(f"two unrelated trends: r = {stats.pearsonr(a, b)[0]:.3f} "
      "<- time did that")`,
    scenario: {
      title: 'Screening drivers of regional sales',
      problem: 'A CMO asks which of a dozen candidate factors track regional sales performance.',
      dataset: 'Per-region spend, footfall, demographics, and sales.',
      why: 'r ranks linear associations quickly and comparably — the triage step before any modeling.',
      output: 'A correlation ranking with scatter plots attached.',
      interpretation: 'Spend correlates at r=0.84 (r²≈0.7 of variance shared) — a modeling candidate, NOT a proven cause; regions may spend more BECAUSE they sell more.',
      pitfalls: 'Reverse causation and confounders (region size drives both) — correlation triage is hypothesis generation, nothing more.',
    },
    mistakes: ['Correlation read as causation (the classic)', 'Computing r without plotting first', 'Correlating trended time series raw (difference or detrend first)', 'r on ordinal data (Spearman exists for that)'],
    tips: ['Scatter plot first is a RULE, not a suggestion', 'Report r with n and CI — r=0.8 at n=10 is a shrug', 'Differencing kills most spurious time-series correlations', 'df.corr() for the matrix; heatmap for the triage view'],
  },
  {
    id: 't_r', group: 'ch10', name: 't Test for r', formula: 't = r·√[(n−2)/(1−r²)]',
    tags: ['correlation', 'significance', 'hypothesis test'],
    overview: "Tests whether a sample correlation is distinguishable from zero: r scaled by sample size against its own noise. The formula that answers 'is r=0.4 from 25 points real, or shuffle-luck?' — small n demands big r.",
    variables: [['r', 'the sample correlation'], ['n−2', 'degrees of freedom (two means estimated)'], ['t', 'the statistic locating r against the no-correlation world']],
    thinking: {
      workflow: ['Compute r; ask what n backs it', 'Test H₀: ρ=0 via the t (scipy does it inside pearsonr)', 'For small n, add a permutation check — assumption-light and convincing', 'Significant ≠ strong: r=0.1 is "real but trivial" at n=10,000'],
      when: ['Any correlation claim headed into a report', 'Screening many correlations (with multiple-testing correction!)'],
      notWhen: ['Data failing pearson’s own assumptions (curves, outliers)', 'Testing against a nonzero ρ (Fisher z-transform territory)'],
      assumptions: ['Bivariate normality (approximately); independent pairs'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(6)

# --- r = 0.42 from n = 25: real or luck? -----------------------------
n = 25
x = rng.normal(0, 1, n)
y = 0.45 * x + rng.normal(0, 1, n)
r, p = stats.pearsonr(x, y)

t_hand = r * np.sqrt((n - 2) / (1 - r**2))
print(f"r = {r:.3f}, t({n-2}) = {t_hand:.2f}, p = {p:.4f}")

# Permutation version - no normality assumption, same question:
perm = np.array([stats.pearsonr(x, rng.permutation(y))[0]
                 for _ in range(5_000)])
p_perm = np.mean(np.abs(perm) >= abs(r))
print(f"permutation p = {p_perm:.4f}  "
      f"(shuffled-r spread: +/-{perm.std():.2f})")

# How much r it takes to 'clear' at various n (alpha=0.05):
print("n      r needed for p<0.05")
for nn in [10, 25, 50, 100, 1000]:
    t_crit = stats.t.ppf(0.975, nn-2)
    r_crit = t_crit / np.sqrt(nn - 2 + t_crit**2)
    print(f"{nn:5d}  {r_crit:.2f}")
# r=0.63 needed at n=10; r=0.06 suffices at n=1000. Context is n.`,
    scenario: {
      title: 'Validating a screening correlation',
      problem: 'An analyst found r=0.42 between engagement score and renewal in 25 accounts; leadership wants to act on it.',
      dataset: 'The 25 paired observations.',
      why: 'Before any action, the t-test (and a permutation check) asks whether 25 shuffled points could produce r=0.42 by luck — the answer calibrates the confidence.',
      output: 't, p, and permutation p.',
      interpretation: 'p≈0.04: probably real but borderline — collect more accounts before building the playbook on it.',
      pitfalls: 'This was one of a dozen screened correlations: without correction, one in twenty clears at random.',
    },
    mistakes: ['Ignoring multiple testing across screened pairs', 'Reading significance as strength', 'Skipping the scatter plot that would reveal an outlier-made r'],
    tips: ['pearsonr returns the p from this exact formula — free', 'Permutation tests convince skeptics without normality debates', 'The r-needed-by-n table is worth pinning above your desk'],
  },
  {
    id: 'reg', group: 'ch10', name: 'Regression Line', formula: "y' = a + bx",
    tags: ['regression', 'least squares', 'prediction', 'slope'],
    overview: "The least-squares line through the scatter: slope b (change in y per unit x) and intercept a. Turns correlation's 'they move together' into an actual prediction equation with interpretable units — the simplest model that earns its keep.",
    variables: [['b', 'slope: Δy per unit Δx — the number decisions quote'], ['a', 'intercept: predicted y at x=0 (meaningful only if x=0 is)'], ["y'", 'the fitted/predicted value at a given x']],
    thinking: {
      workflow: ['Scatter plot: linear enough? outliers?', 'Fit least squares; read slope in real units', 'Check residuals (curve? funnel? = model problems)', 'Predict ONLY within the observed x range'],
      when: ['One-driver prediction with interpretable slope (price→demand, hours→score)', 'Quantifying a linear trend’s magnitude'],
      notWhen: ['Extrapolating beyond observed x', 'Multiple drivers matter (multiple regression)', 'The relationship is visibly curved'],
      assumptions: ['Linearity; independent errors; constant variance; normal errors for inference'],
    },
    code: `import numpy as np
from scipy import stats

# --- study hours vs exam score ---------------------------------------
rng = np.random.default_rng(7)
hours = rng.uniform(1, 12, 50)
score = 48 + 3.6 * hours + rng.normal(0, 6, 50)

res = stats.linregress(hours, score)
print(f"y' = {res.intercept:.1f} + {res.slope:.2f}x")
print(f"slope 95% CI: {res.slope - 1.96*res.stderr:.2f} "
      f"to {res.slope + 1.96*res.stderr:.2f}")
print(f"r^2 = {res.rvalue**2:.2f}, slope p = {res.pvalue:.2e}")

# Prediction (inside the observed range only!):
for h in [4, 8, 11]:
    print(f"predicted score at {h}h study: "
          f"{res.intercept + res.slope*h:.0f}")

# Residual sanity check - the habit that catches bad models:
fitted = res.intercept + res.slope * hours
resid = score - fitted
print(f"residual mean {resid.mean():.2f} (=0 by construction), "
      f"sd {resid.std(ddof=2):.1f}")
corr_resid = stats.pearsonr(fitted, resid)[0]
print(f"corr(fitted, residuals) = {corr_resid:.3f} (~0 = no pattern)")`,
    scenario: {
      title: 'Study time and exam performance',
      problem: 'An academic advisor wants a concrete answer to "how much does an extra hour of study buy?"',
      dataset: '50 students’ weekly study hours and exam scores.',
      why: 'The slope IS the answer — +3.6 points per hour, with a CI — in units both students and faculty use daily.',
      output: 'The fitted line, slope CI, and predictions across the observed range.',
      interpretation: '"Each extra hour associates with ~3.6 more points" — associates, since motivated students both study more AND differ in other ways.',
      pitfalls: 'Predicting a 40-hour студент’s score is extrapolation fantasy; the data ends at 12 hours.',
    },
    mistakes: ['Extrapolating past the observed x range', 'Causal slope language from observational data', 'Ignoring the residual plot', 'Quoting the intercept when x=0 is meaningless'],
    tips: ['stats.linregress for one x; statsmodels OLS for the full inference table', 'Always state the slope’s units — that is the deliverable', 'Residual plots catch what r² hides'],
  },
  {
    id: 'r2', group: 'ch10', name: 'Coeff. of Determination', formula: 'r² = explained variation / total variation',
    tags: ['regression', 'fit', 'variance explained'],
    overview: "The share of outcome variance the regression accounts for: 0 (line explains nothing) to 1 (points on the line). The most quoted — and most gamed — model statistic: it measures fit, not correctness, and never validates predictions by itself.",
    variables: [['explained variation', 'Σ(ŷ−ȳ)² — what the line captures'], ['total variation', 'Σ(y−ȳ)² — all variance in y'], ['1−r²', 'the unexplained share — worth stating aloud']],
    thinking: {
      workflow: ['Fit the model; compute r² AND the residual SD', 'Judge r² against the domain (0.3 can be gold in social science, dismal in physics)', 'Check residuals — high r² with patterned residuals is still a wrong model', 'For model comparison, use adjusted r²/out-of-sample error'],
      when: ['Communicating how much of the outcome the drivers capture', 'Comparing nested models (with adjustment)'],
      notWhen: ['Judging predictive quality alone (out-of-sample metrics rule)', 'Comparing models across different y transformations'],
      assumptions: ['Inherits everything from the underlying regression'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(8)

# --- same slope, different noise: r-squared reads the noise ----------
x = rng.uniform(0, 10, 80)
for noise, label in [(2, "tight"), (8, "noisy")]:
    y = 5 + 2 * x + rng.normal(0, noise, 80)
    r = stats.pearsonr(x, y)[0]
    print(f"{label:6s}: r^2 = {r*r:.2f} "
          f"(same true slope 2.0 in both)")

# --- computing it from first principles ------------------------------
y = 5 + 2 * x + rng.normal(0, 4, 80)
res = stats.linregress(x, y)
y_hat = res.intercept + res.slope * x
ss_total = ((y - y.mean())**2).sum()
ss_resid = ((y - y_hat)**2).sum()
r2 = 1 - ss_resid / ss_total
print(f"r^2 = 1 - SSres/SStot = {r2:.3f} "
      f"(linregress: {res.rvalue**2:.3f})")

# The warning: high r^2, wrong model
y_curve = (x - 5)**2 + rng.normal(0, 1, 80)
res_c = stats.linregress(x, y_curve)
print(f"parabola fit with a line: r^2 = {res_c.rvalue**2:.3f} "
      "<- low, fine. But quadratic trends can score HIGH r^2 on a")
print("line while residuals scream curve - r^2 alone never certifies.")`,
    scenario: {
      title: 'Explaining a sales-model’s coverage',
      problem: 'Leadership asks how much of store-to-store sales variation the new driver model actually explains.',
      dataset: 'The fitted regression across stores.',
      why: 'r²=0.68 answers precisely that: two-thirds of variation tracks the drivers; one-third is other factors — the honest framing for expectations.',
      output: 'r², plus residual SD in dollars.',
      interpretation: '"The model explains 68%; typical store deviates ±$14k from prediction" — both numbers, always.',
      pitfalls: 'Adding ANY variable raises r² — adjusted r² or holdout error must referee model growth.',
    },
    mistakes: ['Chasing r² by stuffing in variables', 'r² as proof of causation or correctness', 'Comparing r² across different transformations of y', 'High-r²-therefore-good-predictions leaps'],
    tips: ['Report r² with residual SD in natural units', 'Out-of-sample R² is the grown-up version for prediction claims', '1−r² deserves a sentence in every write-up'],
  },
  {
    id: 'se_est', group: 'ch10', name: 'Std Error of Estimate', formula: "sₑ = √[Σ(y−y')²/(n−2)]",
    tags: ['regression', 'residuals', 'prediction accuracy'],
    overview: "The typical size of a regression's prediction miss, in y's own units: the SD of residuals with n−2 degrees of freedom. Where r² speaks in percentages, sₑ speaks in dollars/points/minutes — the number the user of the predictions actually feels.",
    variables: [["y−y'", 'each residual — actual minus predicted'], ['n−2', 'df: slope and intercept each cost one'], ['sₑ', 'the typical miss, natural units']],
    thinking: {
      workflow: ['Fit; compute residuals', 'sₑ = residual RMS with n−2', 'Rough reading: ~95% of actuals within ±2sₑ of predictions (if errors normal)', 'Judge sₑ against the decision’s tolerance, not against zero'],
      when: ['Translating model quality into operational language', 'Feeding prediction intervals (sₑ is their backbone)'],
      notWhen: ['Heteroscedastic errors (one sₑ misleads across the range)', 'Out-of-sample honesty needed (use holdout RMSE)'],
      assumptions: ['Constant error variance; independent, roughly normal errors'],
    },
    code: `import numpy as np
from scipy import stats

# --- appraisal model: sqft -> price ----------------------------------
rng = np.random.default_rng(9)
sqft = rng.uniform(800, 3000, 60)
price = 40 + 0.115 * sqft + rng.normal(0, 24, 60)   # $k

res = stats.linregress(sqft, price)
pred = res.intercept + res.slope * sqft
resid = price - pred

n = len(price)
se_est = np.sqrt((resid**2).sum() / (n - 2))
print(f"s_e = {se_est:.1f} $k   <- typical prediction miss")
print(f"~95% of prices within +/- {2*se_est:.0f} $k of the line")

# Verify the 95% claim on this data:
within = np.mean(np.abs(resid) <= 2 * se_est)
print(f"actually within +/-2 s_e: {within:.0%}")

# The contrast with r^2 - both matter, they say different things:
print(f"r^2 = {res.rvalue**2:.2f} (share of variance) vs "
      f"s_e = {se_est:.0f}$k (size of miss)")
# A high-r^2 model can still miss by more than your tolerance if y
# varies hugely; s_e is the tolerance-comparable number.`,
    scenario: {
      title: 'Automated home appraisal accuracy',
      problem: 'A lender asks not "how good is the model" but "how far off are its appraisals, in dollars?"',
      dataset: 'The fitted sqft-price regression over comparable sales.',
      why: 'sₑ answers in the lender’s currency: typical miss ±$24k, 95% within ±$48k — directly comparable to their risk tolerance per loan.',
      output: 'sₑ and the ±2sₑ coverage check.',
      interpretation: 'If underwriting tolerates ±$60k, the model clears; at ±$30k it does not — same model, decision depends on sₑ vs tolerance.',
      pitfalls: 'Expensive homes often miss bigger (heteroscedasticity): one global sₑ flatters the high end.',
    },
    mistakes: ['Quoting r² when the question was dollars of error', 'Using n instead of n−2', 'One sₑ across a fan-shaped residual plot', 'In-sample sₑ sold as out-of-sample accuracy'],
    tips: ['sₑ is the bridge from fit statistics to business tolerance', 'Plot residuals vs fitted before trusting one global sₑ', 'Holdout RMSE is sₑ’s honest out-of-sample cousin'],
  },
  {
    id: 'pred_int', group: 'ch10', name: 'Prediction Interval', formula: "y'±t·sₑ·√[1+1/n+n(x−X̄)²/(nΣx²−(Σx)²)]",
    tags: ['regression', 'prediction interval', 'uncertainty'],
    overview: "The interval for a single NEW observation's y at a given x: wider than the confidence-of-the-mean band because it adds the irreducible individual scatter (the '1+' term), and widening further away from X̄ where the line itself is least anchored.",
    variables: [['1+ term', 'individual scatter — the piece the mean-CI lacks'], ['(x−X̄)² term', 'extrapolation penalty growing away from the data center'], ["y'", 'the point prediction being intervalled']],
    thinking: {
      workflow: ['Decide: mean-at-x (CI) or single-new-case (PI)? They differ hugely', 'Compute the PI with the full three-term variance', 'Note how it flares at the edges of observed x', 'Quote the interval, not the point, in any commitment'],
      when: ['Committing to a single future case: this house’s price, this patient’s response', 'Setting realistic promised ranges on model outputs'],
      notWhen: ['Statements about the AVERAGE at x (narrower CI applies)', 'Outside observed x (the formula widens but the model itself is unvalidated there)'],
      assumptions: ['The regression’s full set: linearity, normal, constant-variance errors'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(10)
sqft = rng.uniform(800, 3000, 60)
price = 40 + 0.115 * sqft + rng.normal(0, 24, 60)

res = stats.linregress(sqft, price)
n = len(sqft)
resid = price - (res.intercept + res.slope * sqft)
se = np.sqrt((resid**2).sum() / (n - 2))
t_crit = stats.t.ppf(0.975, n - 2)
sxx = ((sqft - sqft.mean())**2).sum()

def intervals(x0):
    y0 = res.intercept + res.slope * x0
    core = 1/n + (x0 - sqft.mean())**2 / sxx
    ci = t_crit * se * np.sqrt(core)          # mean at x0
    pi = t_crit * se * np.sqrt(1 + core)      # ONE new house at x0
    return y0, ci, pi

print("sqft   pred    CI(mean)+/-   PI(single)+/-")
for x0 in [1000, 1900, 2900]:
    y0, ci, pi = intervals(x0)
    print(f"{x0:5d}  {y0:6.0f}   {ci:8.1f}      {pi:8.1f}")
# The PI dwarfs the CI (individual scatter dominates), and both widen
# at the edges of the observed sqft range.`,
    scenario: {
      title: 'Quoting a price range for one specific house',
      problem: 'An agent must give a seller a realistic range for THEIR 1,900 sqft house — not for the average of all such houses.',
      dataset: 'The comparable-sales regression.',
      why: 'The seller’s house is one draw including individual scatter: the PI (±$49k) is the honest quote; the mean-CI (±$7k) would be a false promise.',
      output: 'Point prediction with PI at the house’s sqft.',
      interpretation: '"$245k–$343k, most likely near $294k" survives the actual sale; a ±$7k promise would not.',
      pitfalls: 'Confusing CI and PI is the most consequential regression error in client-facing work.',
    },
    mistakes: ['Quoting the mean-CI for an individual case', 'Prediction at x far outside the data with a straight face', 'Ignoring heteroscedasticity that makes one sₑ wrong across x'],
    tips: ['One question decides CI vs PI: average, or one case?', 'statsmodels get_prediction(...).summary_frame() outputs both', 'Show clients the fan-shaped band — it explains itself'],
  },
  {
    id: 'chi_gof', group: 'ch11', name: 'χ² Goodness of Fit', formula: 'χ² = Σ(O−E)²/E',
    tags: ['chi-square', 'goodness of fit', 'categorical'],
    overview: "Tests whether observed category counts match a claimed distribution: sum the squared observed-minus-expected gaps, each scaled by its expected count. Die fairness, market-share claims, Benford's law audits — one formula.",
    variables: [['O', 'observed count per category'], ['E', 'expected count under the claimed distribution'], ['df', 'k−1 categories (minus extra estimated parameters)']],
    thinking: {
      workflow: ['State the claimed distribution BEFORE counting', 'Expected counts = n × claimed proportions; check all E ≥ 5', 'Compute χ², compare at df=k−1', 'If rejected: inspect per-category contributions to see WHERE it failed'],
      when: ['Testing counts vs a theoretical/claimed distribution', 'Fairness checks, share-claim audits, digit-distribution forensics'],
      notWhen: ['Small expected counts (combine categories or exact tests)', 'Continuous data (bin honestly first, df adjusted for estimated parameters)'],
      assumptions: ['Independent observations; expected counts ≥ 5 per cell; fixed claimed distribution'],
    },
    code: `import numpy as np
from scipy import stats

# --- is this die fair? 120 rolls -------------------------------------
observed = np.array([25, 17, 15, 23, 24, 16])
expected = np.full(6, 120 / 6)

chi2, p = stats.chisquare(observed, expected)
print(f"chi2({len(observed)-1}) = {chi2:.2f}, p = {p:.3f}")
print("verdict:", "suspicious" if p < 0.05 else
      "no evidence of unfairness")

# Where does the discrepancy live? per-cell contributions:
contrib = (observed - expected)**2 / expected
for face, (o, c) in enumerate(zip(observed, contrib), 1):
    print(f"face {face}: O={o:2d} E=20  contributes {c:.2f}")

# --- Benford's law fraud screen on invoice first digits --------------
rng = np.random.default_rng(11)
benford_p = np.log10(1 + 1/np.arange(1, 10))
# fabricated invoices: too-uniform first digits
fake_digits = rng.choice(np.arange(1, 10), 500,
                         p=np.full(9, 1/9))
obs = np.bincount(fake_digits, minlength=10)[1:]
chi2_b, p_b = stats.chisquare(obs, 500 * benford_p)
print(f"Benford test on fabricated data: chi2 = {chi2_b:.0f}, "
      f"p = {p_b:.2e}  <- flagged")`,
    scenario: {
      title: 'Expense-report fraud screening',
      problem: 'Internal audit screens an expense ledger for fabrication using first-digit (Benford) analysis.',
      dataset: '500 invoice amounts’ leading digits vs Benford’s expected distribution.',
      why: 'Real financial data follows Benford; humans inventing numbers spread digits too evenly — the GOF test quantifies the mismatch.',
      output: 'χ², p, and per-digit contributions.',
      interpretation: 'A flagged ledger is not proof of fraud — it is a defensible reason to pull the receipts behind the over-represented digits.',
      pitfalls: 'Benford only applies to data spanning orders of magnitude — capped or assigned numbers (prices ending .99) break the premise.',
    },
    mistakes: ['Expected counts under 5 left uncombined', 'Choosing the claimed distribution after peeking at the data', 'Reading rejection as proof of the specific alternative you had in mind'],
    tips: ['Per-cell contributions localize the failure — always print them', 'stats.chisquare wants counts, not proportions', 'For distributions with estimated parameters, subtract them from df'],
  },
  {
    id: 'chi_ind', group: 'ch11', name: 'χ² Independence', formula: 'χ² = Σ(O−E)²/E, df=(r−1)(c−1)',
    tags: ['chi-square', 'independence', 'contingency table'],
    overview: "Tests whether two categorical variables are related: build the contingency table, compute what the cells would hold if the variables were independent, and measure the mismatch. The default answer to 'does segment relate to outcome?'",
    variables: [['contingency table', 'r×c cross-counts of the two variables'], ['E per cell', 'row total × column total / grand total'], ['df', '(r−1)(c−1)'], ["Cramér's V", 'effect size 0–1 to report with the p']],
    thinking: {
      workflow: ['Cross-tabulate the two categoricals', 'chi2_contingency computes E, χ², p in one call', 'Check all E ≥ 5 (Fisher’s exact if not)', 'Report Cramér’s V and inspect residuals for WHICH cells drive it'],
      when: ['Segment-vs-outcome questions: churn by plan, response by region', 'Any two-categorical association screen'],
      notWhen: ['Ordered categories where trend tests are more powerful', 'Paired categorical data (McNemar instead)', 'Tiny tables with small counts (Fisher)'],
      assumptions: ['Independent observations; each unit in exactly one cell; E ≥ 5 per cell mostly'],
    },
    code: `import numpy as np
import pandas as pd
from scipy import stats

# --- churn by subscription plan --------------------------------------
table = pd.DataFrame(
    [[642, 158],       # basic:   stayed, churned
     [811, 89],        # standard
     [473, 27]],       # premium
    index=["basic", "standard", "premium"],
    columns=["stayed", "churned"])
print(table)

chi2, p, df, expected = stats.chi2_contingency(table)
print(f"chi2({df}) = {chi2:.1f}, p = {p:.2e}")

# Effect size - always report with the p:
n = table.values.sum()
cramers_v = np.sqrt(chi2 / (n * (min(table.shape) - 1)))
print(f"Cramer's V = {cramers_v:.2f}  (0.1 small / 0.3 medium / 0.5 large)")

# WHICH cells drive it - standardized residuals:
resid = (table.values - expected) / np.sqrt(expected)
print(pd.DataFrame(resid.round(1), index=table.index,
                   columns=table.columns))
# |resid| > 2: basic churns far more than independence predicts,
# premium far less. The plan-churn link is real and localized.

# churn rates for the business summary:
print((table["churned"] / table.sum(axis=1)).round(3))`,
    scenario: {
      title: 'Churn differs by plan?',
      problem: 'Customer success asks whether churn genuinely varies across subscription tiers or just looks that way.',
      dataset: 'A season of customers cross-tabulated by plan and churn status.',
      why: 'Two categoricals, association question: the independence test plus standardized residuals both confirms the link and points at WHICH tier bleeds.',
      output: 'χ², p, Cramér’s V, and the residual map.',
      interpretation: 'Basic churns at 20% vs premium’s 5% (V=0.17): real but moderate — the retention play targets basic-tier onboarding.',
      pitfalls: 'Association is not causation: basic-plan users may differ in ways (price sensitivity) the plan itself didn’t cause.',
    },
    mistakes: ['Percentages fed to the test instead of raw counts', 'p-value without effect size on huge samples (everything "significant")', 'Ignoring which cells drive the result', 'Using it on matched/paired designs'],
    tips: ['pd.crosstab → chi2_contingency is the standard two-line pipeline', 'Standardized residuals are the "so what" of a significant result', 'Cramér’s V keeps big-n significance honest'],
  },
  {
    id: 'exp_cell', group: 'ch11', name: 'Expected Cell', formula: 'E = (Row Sum × Column Sum)/Grand Total',
    tags: ['chi-square', 'expected counts', 'contingency'],
    overview: "What each contingency-table cell would hold if the two variables were perfectly independent: the row share times the column share times the total. The reference world every chi-square independence test measures reality against.",
    variables: [['Row/Column Sum', 'the marginal totals'], ['Grand Total', 'n, all observations'], ['E', 'the independence-world cell count']],
    thinking: {
      workflow: ['Compute marginals from the observed table', 'E per cell = row × column / grand', 'Verify E’s: all ≥ 5 (the test’s validity gate)', 'Compare O vs E per cell — the story lives in the gaps'],
      when: ['Inside every chi-square independence test (automatically)', 'Explaining WHAT independence would look like to stakeholders'],
      notWhen: ['Standalone use beyond the test/diagnostics context'],
      assumptions: ['The independence model as the reference; fixed margins'],
    },
    code: `import numpy as np
import pandas as pd
from scipy import stats

observed = pd.DataFrame(
    [[30, 70], [45, 55], [15, 85]],
    index=["north", "central", "south"],
    columns=["bought", "browsed"])
print("observed:"); print(observed)

# Expected under independence, by hand:
row_sums = observed.sum(axis=1).values[:, None]
col_sums = observed.sum(axis=0).values[None, :]
grand = observed.values.sum()
E = row_sums * col_sums / grand
print("expected if region and buying were unrelated:")
print(pd.DataFrame(E.round(1), index=observed.index,
                   columns=observed.columns))

# scipy computes the same table inside the test:
chi2, p, df, E_scipy = stats.chi2_contingency(observed)
assert np.allclose(E, E_scipy)
print(f"validity gate: min E = {E.min():.1f} "
      f"({'ok' if E.min() >= 5 else 'combine categories!'})")
print(f"chi2 = {chi2:.1f}, p = {p:.4f}")

# The narrative table - O minus E:
print("O - E (where reality beats independence):")
print((observed - E.round(1)))`,
    scenario: {
      title: 'Explaining a regional-sales association',
      problem: 'A regional manager disputes that the north "underbuys" — the raw counts, she says, just reflect region sizes.',
      dataset: 'Region × purchase-status counts.',
      why: 'The expected table answers her exactly: it already accounts for region size and overall buy rate; only genuine association remains in O−E.',
      output: 'The E table and the O−E gaps.',
      interpretation: 'North observed 30 vs 30.0 expected — she is right, no association; central’s 45 vs 36 is where the real deviation lives.',
      pitfalls: 'Comparing raw counts across differently-sized groups is the fallacy the E table exists to kill.',
    },
    mistakes: ['Judging cells by raw counts instead of O−E', 'Overlooking the E ≥ 5 validity gate', 'Recomputing marginals after excluding rows (E’s silently wrong)'],
    tips: ['Show the E table in presentations — it defuses size-based objections', 'chi2_contingency returns E for free; use it', 'O−E per cell IS the finding; χ² just certifies it'],
  },
];
