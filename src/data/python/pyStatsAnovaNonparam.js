// Python Hub content — Stats Ch 12 (ANOVA), Ch 13 (nonparametric),
// Ch 14 (Monte Carlo).
export const PY_STATS_ANOVA_NONPARAM = [
  {
    id: 'grand_mn', group: 'ch12', name: 'Grand Mean', formula: 'X̄_GM = ΣX/N',
    tags: ['anova', 'grand mean', 'baseline'],
    overview: "The mean of ALL observations pooled across groups — ANOVA's reference point. Every group's distance from the grand mean feeds the between-group variance; every observation's distance from its own group mean feeds the within.",
    variables: [['ΣX', 'sum over every observation in every group'], ['N', 'total observations across groups'], ['X̄_GM', 'the pooled center all groups are measured against']],
    thinking: {
      workflow: ['Pool all groups; compute the overall mean', 'Note: with unequal group sizes it is NOT the average of group means', 'Use it as the anchor for between-group deviations', 'Report it as the "overall baseline" figure in ANOVA summaries'],
      when: ['Setting up any one-way ANOVA by hand or in explanation', 'Reporting the overall level alongside per-group means'],
      notWhen: ['Groups should be weighted equally regardless of size (then average the group means, and say so)'],
      assumptions: ['All observations belong to the analysis population'],
    },
    code: `import numpy as np
import pandas as pd

# --- three store formats, unequal group sizes ------------------------
groups = {
    "kiosk":   np.array([12, 15, 11, 14]),
    "standard": np.array([18, 21, 19, 22, 20, 17]),
    "flagship": np.array([28, 31, 27]),
}
all_x = np.concatenate(list(groups.values()))
grand_mean = all_x.mean()
print(f"grand mean = {all_x.sum():.0f}/{len(all_x)} = {grand_mean:.2f}")

# NOT the same as averaging the group means (unequal sizes!):
mean_of_means = np.mean([g.mean() for g in groups.values()])
print(f"mean of group means = {mean_of_means:.2f}  <- different!")

# The role it plays in ANOVA - anchoring between-group deviations:
for name, g in groups.items():
    print(f"{name:9s} mean {g.mean():5.2f}  "
          f"deviation from grand: {g.mean()-grand_mean:+.2f} "
          f"(n={len(g)})")`,
    scenario: {
      title: 'Setting the company baseline across store formats',
      problem: 'Before comparing store formats, ops needs the overall per-store sales baseline the comparison is anchored to.',
      dataset: 'Daily sales from kiosks, standard stores, and flagships — very different group counts.',
      why: 'ANOVA measures each format against the pooled grand mean; using the unweighted mean-of-means would let the 3 flagships count as much as 6 standard stores.',
      output: 'The grand mean and each format’s deviation from it.',
      interpretation: 'Flagships run +9.6 above baseline, kiosks −6.4 — the spread ANOVA will test for significance.',
      pitfalls: 'Quoting mean-of-means as "the average" silently reweights groups — a real dashboard bug.',
    },
    mistakes: ['Confusing grand mean with mean of group means under unequal n', 'Excluding a group but reusing the old grand mean', 'Weighting debates left implicit instead of stated'],
    tips: ['np.concatenate(...).mean() — pool first, average second', 'State the weighting choice explicitly in any summary', 'The grand mean is also ANOVA’s prediction under "no group effects"'],
  },
  {
    id: 'anova_f', group: 'ch12', name: 'F Ratio (ANOVA)', formula: 'F = s²_Between/s²_Within',
    tags: ['anova', 'f test', 'group comparison'],
    overview: "One-way ANOVA's referee: the variance BETWEEN group means over the variance WITHIN groups. F near 1 = group differences look like noise; F far above 1 = at least one group genuinely differs. The multi-group question answered without t-test inflation.",
    variables: [['s²_Between', 'variance among group means (signal)'], ['s²_Within', 'pooled variance inside groups (noise)'], ['F', 'signal-to-noise ratio, df (k−1, N−k)']],
    thinking: {
      workflow: ['3+ group means to compare? ANOVA, not repeated t-tests', 'Check: roughly normal within groups, similar spreads (Levene)', 'Run f_oneway; a significant F says "some difference exists"', 'Follow up with Tukey to find WHICH pairs differ; report η² effect size'],
      when: ['Comparing 3+ treatments/regions/versions on one continuous outcome', 'Guarding the false-positive rate that pairwise t-testing destroys'],
      notWhen: ['Two groups only (t-test is the same thing, simpler)', 'Wildly unequal variances (Welch ANOVA) or skewed data (Kruskal-Wallis)'],
      assumptions: ['Independent groups; normal-ish residuals; homogeneous variances'],
    },
    code: `import numpy as np
from scipy import stats

# --- three ad creatives, engagement scores ---------------------------
rng = np.random.default_rng(0)
a = rng.normal(52, 9, 40)
b = rng.normal(55, 9, 40)
c = rng.normal(60, 9, 40)

F, p = stats.f_oneway(a, b, c)
print(f"F = {F:.2f}, p = {p:.4f}")

# The ratio built by hand - the concept made visible:
groups = [a, b, c]
gm = np.concatenate(groups).mean()
k, N = len(groups), sum(len(g) for g in groups)
ss_between = sum(len(g) * (g.mean() - gm)**2 for g in groups)
ss_within = sum(((g - g.mean())**2).sum() for g in groups)
ms_b, ms_w = ss_between/(k-1), ss_within/(N-k)
print(f"MS_between = {ms_b:.1f}, MS_within = {ms_w:.1f}, "
      f"F = {ms_b/ms_w:.2f}")

# Effect size - how much variance do groups explain?
eta_sq = ss_between / (ss_between + ss_within)
print(f"eta^2 = {eta_sq:.2f} of engagement variance is creative-driven")

# Why not 3 t-tests? familywise error demolition:
print(f"3 pairwise tests at alpha=.05: "
      f"P(any false positive) = {1 - 0.95**3:.2f}")`,
    scenario: {
      title: 'Three ad creatives, one budget',
      problem: 'Marketing must decide whether engagement genuinely differs across three creatives before concentrating the budget.',
      dataset: '40 randomized impressions’ engagement scores per creative.',
      why: 'Three groups means three pairwise comparisons — ANOVA asks the single gatekeeping question at a controlled α before any pair is examined.',
      output: 'F, p, η², and the hand-built decomposition.',
      interpretation: 'F=8.6, p<0.001: differences are real; Tukey next names the winning creative before money moves.',
      pitfalls: 'A significant F never says WHICH creative wins — skipping the post-hoc step and eyeballing means invites the very error ANOVA prevented.',
    },
    mistakes: ['Running pairwise t-tests instead (α inflation)', 'Stopping at "significant" without post-hoc localization', 'Ignoring variance homogeneity when groups differ 3×+ in spread', 'No effect size with a huge-n significant F'],
    tips: ['f_oneway for the gate; Tukey HSD for the verdicts', 'η² (or ω²) turns F into a "how much does it matter" number', 'Boxplots per group beside the table — always'],
  },
  {
    id: 's2_b', group: 'ch12', name: 'Between-Group Variance', formula: 's²_B = Σnᵢ(X̄ᵢ−X̄_GM)²/(k−1)',
    tags: ['anova', 'between groups', 'signal'],
    overview: "The numerator of ANOVA's F: how far group means scatter around the grand mean, weighted by group sizes, per degree of freedom. This is the 'signal' — real group effects push it up; under no effects it estimates the same σ² the within-variance does.",
    variables: [['nᵢ', 'size of group i — bigger groups anchor their deviations harder'], ['X̄ᵢ−X̄_GM', 'group mean’s deviation from the grand mean'], ['k−1', 'degrees of freedom among k group means']],
    thinking: {
      workflow: ['Compute group means and the grand mean', 'Weight squared deviations by group sizes; divide by k−1', 'Compare with s²_W: the ratio is F', 'Large s²_B alone means nothing — only relative to within-noise'],
      when: ['Explaining/auditing an ANOVA table (its MS-between row)', 'Teaching where F actually comes from'],
      notWhen: ['As a standalone spread measure — it only exists relative to s²_W'],
      assumptions: ['Same as ANOVA overall'],
    },
    code: `import numpy as np

rng = np.random.default_rng(1)
groups = {
    "A": rng.normal(50, 8, 35),
    "B": rng.normal(54, 8, 42),
    "C": rng.normal(59, 8, 28),
}
all_x = np.concatenate(list(groups.values()))
gm, k = all_x.mean(), len(groups)

s2_B = sum(len(g) * (g.mean() - gm)**2
           for g in groups.values()) / (k - 1)
print(f"grand mean {gm:.1f}")
for name, g in groups.items():
    print(f"  {name}: n={len(g):2d}, mean={g.mean():.1f}, "
          f"weighted sq-dev = {len(g)*(g.mean()-gm)**2:7.1f}")
print(f"s2_between = {s2_B:.1f}")

# Under NO real effects, s2_B estimates plain sigma^2 (~64 here):
null_groups = [rng.normal(50, 8, n) for n in (35, 42, 28)]
null_all = np.concatenate(null_groups)
s2_B_null = sum(len(g)*(g.mean()-null_all.mean())**2
                for g in null_groups) / (k-1)
print(f"same computation, NO true differences: s2_B = {s2_B_null:.1f} "
      f"(~sigma^2 = 64)")
# Real group effects inflate s2_B above sigma^2 - that inflation is
# exactly what the F ratio detects.`,
    scenario: {
      title: 'Reading the ANOVA table’s signal row',
      problem: 'A stakeholder asks what "MS between = 812" in the report actually measures.',
      dataset: 'The three-group experiment behind the table.',
      why: 'It is the size-weighted scatter of group means around the grand mean per df — the quantity that group effects inflate and chance does not (beyond σ²).',
      output: 'The decomposed contributions per group.',
      interpretation: 'Group C’s big deviation contributes most of the signal; if C were removed, F would collapse — worth knowing before acting.',
      pitfalls: 'One aberrant group can carry the entire between-variance; the decomposition shows it, the single F number hides it.',
    },
    mistakes: ['Forgetting the nᵢ weights with unequal groups', 'Reading raw s²_B as meaningful without s²_W beside it', 'df slip: k−1, not k'],
    tips: ['Print per-group contributions — instant explanation of any significant F', 'The null-case simulation is the cleanest ANOVA teaching demo', 'MS_between in software output = exactly this quantity'],
  },
  {
    id: 's2_w', group: 'ch12', name: 'Within-Group Variance', formula: 's²_W = Σ(nᵢ−1)sᵢ²/Σ(nᵢ−1)',
    tags: ['anova', 'within groups', 'noise', 'pooled variance'],
    overview: "ANOVA's denominator: the pooled variance inside groups — natural, group-membership-free noise. It weights each group's variance by its degrees of freedom, generalizing the two-sample pooled variance to k groups.",
    variables: [['sᵢ²', 'each group’s own sample variance'], ['nᵢ−1', 'its degrees of freedom — the pooling weights'], ['s²_W', 'the pooled noise estimate (MS within)']],
    thinking: {
      workflow: ['Compute each group’s variance', 'Pool weighted by df; total df = N−k', 'This is the yardstick group differences must beat', 'Also reused by post-hoc tests (Tukey/Scheffé) as THE error term'],
      when: ['Every ANOVA (it is the error term)', 'Any pooled-noise estimate across homogeneous groups'],
      notWhen: ['Group variances differ wildly (pooling then averages incomparables — Welch instead)'],
      assumptions: ['Homogeneous variances across groups — the assumption pooling encodes'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(2)
groups = [rng.normal(50, 8, 35), rng.normal(54, 8, 42),
          rng.normal(59, 8, 28)]

# Pool: df-weighted average of group variances
dfs = np.array([len(g) - 1 for g in groups])
vars_ = np.array([g.var(ddof=1) for g in groups])
s2_W = (dfs * vars_).sum() / dfs.sum()
print("group variances:", vars_.round(1), " dfs:", dfs)
print(f"pooled s2_within = {s2_W:.1f}  (true sigma^2 = 64)")

# Homogeneity gate before trusting the pooling:
stat, p_lev = stats.levene(*groups)
print(f"Levene p = {p_lev:.3f} "
      f"({'pooling OK' if p_lev > 0.05 else 'variances differ - Welch!'})")

# The full F assembled from both pieces:
all_x = np.concatenate(groups)
gm, k = all_x.mean(), len(groups)
s2_B = sum(len(g)*(g.mean()-gm)**2 for g in groups) / (k-1)
F = s2_B / s2_W
print(f"F = {s2_B:.1f}/{s2_W:.1f} = {F:.2f}  "
      f"(f_oneway: {stats.f_oneway(*groups)[0]:.2f})")`,
    scenario: {
      title: 'Establishing the noise floor for a treatment comparison',
      problem: 'Before crediting fertilizer treatments for yield differences, an agronomist quantifies natural plot-to-plot variation.',
      dataset: 'Yields from plots within each treatment group.',
      why: 's²_W is precisely that noise floor — variation among identically-treated plots — the honest yardstick treatment effects must exceed.',
      output: 'The pooled within-variance and Levene’s homogeneity check.',
      interpretation: 'Treatment mean gaps of 3 units against within-noise σ≈8 need decent n to clear F — the noise floor sets the evidentiary bar.',
      pitfalls: 'One treatment applied on a windier field has inflated variance; pooling it in quietly corrupts the yardstick.',
    },
    mistakes: ['Pooling visibly unequal variances', 'Equal-weight averaging of group variances (df weights matter with unequal n)', 'Recomputing noise from the pooled data INCLUDING group differences'],
    tips: ['Levene first, pool second', 'Same formula at k=2 is the classic pooled t-test variance', 'Post-hoc tests reuse s²_W — one noise estimate, consistently'],
  },
  {
    id: 'scheffe', group: 'ch12', name: 'Scheffé Test', formula: 'Fs = (X̄ᵢ−X̄ⱼ)²/[s²_W(1/nᵢ+1/nⱼ)]',
    tags: ['anova', 'post hoc', 'contrasts', 'conservative'],
    overview: "The most conservative post-hoc: compares any pair (or ANY contrast — averages of groups vs other averages) against the critical value (k−1)·F_crit, protecting the error rate over ALL possible contrasts simultaneously. The price of that freedom is power.",
    variables: [['Fs', 'the pairwise/contrast statistic using pooled s²_W'], ['(k−1)F_crit', 'Scheffé’s inflated critical value — the protection premium'], ['contrast', 'any weighted combination of group means summing to zero']],
    thinking: {
      workflow: ['Significant omnibus F first', 'Planned pairs only? → Tukey (more power). Exploring arbitrary contrasts? → Scheffé', 'Compute Fs per comparison against (k−1)F_crit', 'Report which contrasts clear the conservative bar'],
      when: ['Post-hoc exploration of complex contrasts ("A vs the average of B and C")', 'Unequal group sizes with unplanned comparisons', 'Audit-grade protection against any-data-dredging accusations'],
      notWhen: ['Simple all-pairs comparisons (Tukey wins on power)', 'Pre-registered specific contrasts (planned contrasts, no correction inflation)'],
      assumptions: ['ANOVA’s assumptions; the pooled s²_W as error term'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(3)
groups = {"control": rng.normal(50, 8, 30),
          "drug_A": rng.normal(56, 8, 26),
          "drug_B": rng.normal(57, 8, 28)}
names = list(groups)
k = len(groups)
N = sum(len(g) for g in groups.values())

# Pooled within-variance (the shared error term):
s2_W = sum((len(g)-1)*g.var(ddof=1) for g in groups.values()) \\
       / (N - k)
F_crit = stats.f.ppf(0.95, k-1, N-k)
scheffe_crit = (k - 1) * F_crit
print(f"s2_W = {s2_W:.1f}, Scheffe critical = {scheffe_crit:.2f}")

# All pairwise comparisons:
for i in range(k):
    for j in range(i+1, k):
        gi, gj = groups[names[i]], groups[names[j]]
        Fs = (gi.mean()-gj.mean())**2 / (s2_W*(1/len(gi)+1/len(gj)))
        sig = "SIG" if Fs > scheffe_crit else "ns"
        print(f"{names[i]:8s} vs {names[j]:8s}: Fs = {Fs:5.2f}  {sig}")

# Scheffe's real superpower - an arbitrary complex contrast:
# control vs the AVERAGE of the two drugs:
c = groups["control"]; A = groups["drug_A"]; B = groups["drug_B"]
est = c.mean() - (A.mean() + B.mean())/2
se2 = s2_W * (1/len(c) + 0.25/len(A) + 0.25/len(B))
Fs_contrast = est**2 / se2
print(f"control vs mean(drugs): est {est:+.1f}, Fs = {Fs_contrast:.2f} "
      f"{'SIG' if Fs_contrast > scheffe_crit else 'ns'}")`,
    scenario: {
      title: 'Drug trial with an unplanned pooled contrast',
      problem: 'After a significant ANOVA, reviewers ask a question nobody pre-registered: does the control differ from the two drugs POOLED?',
      dataset: 'Three trial arms with unequal sizes.',
      why: 'An unplanned, complex contrast is Scheffé’s exact jurisdiction — its blanket protection covers post-hoc creativity that would invalidate Tukey’s guarantees.',
      output: 'Pairwise and pooled-contrast verdicts at the Scheffé bar.',
      interpretation: '"Control vs pooled drugs" clears even the conservative bar: the drug-effect claim survives the strictest referee available.',
      pitfalls: 'Using Scheffé when only simple pairs were ever of interest throws away power for protection nobody needed.',
    },
    mistakes: ['Scheffé for routine pairwise work (Tukey dominates there)', 'Skipping the omnibus F and diving into contrasts', 'Contrast weights not summing to zero'],
    tips: ['Rule: Tukey for pairs, Scheffé for anything fancier post-hoc', 'If a contrast matters in advance — pre-register it and skip the premium', 'Its conservatism is a feature in adversarial/audit settings'],
  },
  {
    id: 'tukey', group: 'ch12', name: 'Tukey Test', formula: 'q = (X̄ᵢ−X̄ⱼ)/√(s²_W/n)',
    tags: ['anova', 'post hoc', 'pairwise', 'hsd'],
    overview: "The standard follow-up to a significant ANOVA: every pairwise comparison tested via the studentized-range distribution, holding the familywise error at α across ALL pairs. Answers the question F leaves open — WHICH groups differ.",
    variables: [['q', 'studentized range statistic per pair'], ['s²_W/n', 'the pooled error scaled per group'], ['HSD', '"honestly significant difference" — the minimum gap that clears']],
    thinking: {
      workflow: ['Run ANOVA; proceed only on a significant F', 'Tukey HSD across all pairs (statsmodels/scipy)', 'Read the simultaneous CIs per pair — not just reject flags', 'Report the ranking with which gaps are certified'],
      when: ['All-pairs comparison after one-way ANOVA (the standard workflow)', 'Producing defensible "A beats B and C; B≈C" statements'],
      notWhen: ['Complex contrasts (Scheffé)', 'Only comparisons against a single control (Dunnett is more powerful)'],
      assumptions: ['ANOVA’s assumptions; balanced-ish groups (Tukey-Kramer handles unequal n)'],
    },
    code: `import numpy as np
from scipy import stats
from statsmodels.stats.multicomp import pairwise_tukeyhsd

rng = np.random.default_rng(4)
data = np.concatenate([
    rng.normal(52, 9, 40),     # creative A
    rng.normal(55, 9, 40),     # creative B
    rng.normal(61, 9, 40),     # creative C
])
labels = np.repeat(["A", "B", "C"], 40)

F, p = stats.f_oneway(data[labels=="A"], data[labels=="B"],
                      data[labels=="C"])
print(f"omnibus: F = {F:.2f}, p = {p:.4f}")

tuk = pairwise_tukeyhsd(data, labels, alpha=0.05)
print(tuk)
# The table gives, per pair: mean diff, simultaneous CI, reject flag.

# scipy's direct interface (1.11+):
res = stats.tukey_hsd(data[labels=="A"], data[labels=="B"],
                      data[labels=="C"])
print("p-values:"); print(np.round(res.pvalue, 4))`,
    scenario: {
      title: 'Naming the winning ad creative',
      problem: 'ANOVA says the three creatives differ; the budget meeting needs to know exactly which beat which.',
      dataset: 'The same engagement scores, now compared pairwise.',
      why: 'Three uncorrected t-tests would inflate false positives to ~14%; Tukey certifies the pairwise verdicts at a true 5% familywise rate.',
      output: 'Pairwise mean gaps with simultaneous CIs and reject flags.',
      interpretation: 'C beats A (+9, CI +4 to +14) and B (+6, CI +1 to +11); A vs B unresolved — budget goes to C, A/B fight continues.',
      pitfalls: 'The A-vs-B "ns" is not "equal" — the CI (−2 to +8) says the data cannot yet tell.',
    },
    mistakes: ['Uncorrected pairwise t-tests after ANOVA', 'Reading "fail to reject" as "equivalent"', 'Ignoring the simultaneous CIs that carry the actual information'],
    tips: ['pairwise_tukeyhsd prints a decision-ready table', 'Lead with the CIs; the flags are just their summaries', 'Comparing all against one control? Dunnett buys power'],
  },
  {
    id: 'anova2', group: 'ch12', name: 'Two-Way ANOVA', formula: 'F_A=MS_A/MS_W, F_B, F_{A×B}',
    tags: ['anova', 'two factors', 'interaction', 'factorial'],
    overview: "ANOVA with two factors at once: separate F-tests for each main effect AND for their interaction — whether factor A's effect depends on the level of B. The interaction test is the whole point: it detects effects that one-factor-at-a-time analysis structurally cannot see.",
    variables: [['MS_A, MS_B', 'main-effect mean squares'], ['MS_{A×B}', 'interaction mean square — effect-modification signal'], ['MS_W', 'the shared within-cell error term']],
    thinking: {
      workflow: ['Factorial design (every A-level × every B-level observed)?', 'Fit with statsmodels ols + anova_lm', 'READ THE INTERACTION FIRST — if significant, main effects need conditional interpretation', 'Plot the interaction (lines per level); report simple effects as needed'],
      when: ['Two crossed factors: promotion × region, dose × sex, method × material', 'Efficiency: one design answers three questions'],
      notWhen: ['Unbalanced messy designs without care (Type II/III sums matter)', 'Repeated measures on the same units (that is a different ANOVA)'],
      assumptions: ['Independence; normal-ish residuals; homogeneous cell variances'],
    },
    code: `import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.formula.api import ols

# --- promo type x store format, with a REAL interaction --------------
rng = np.random.default_rng(5)
rows = []
effect = {("discount", "urban"): 8, ("discount", "suburban"): 2,
          ("bundle", "urban"): 1, ("bundle", "suburban"): 7}
for promo in ["discount", "bundle"]:
    for fmt in ["urban", "suburban"]:
        for _ in range(25):
            rows.append({"promo": promo, "format": fmt,
                         "sales": 100 + effect[(promo, fmt)]
                                  + rng.normal(0, 4)})
df = pd.DataFrame(rows)

model = ols("sales ~ C(promo) * C(format)", data=df).fit()
print(sm.stats.anova_lm(model, typ=2).round(4))

# The story is in the cell means - plot these in practice:
print(df.groupby(["promo", "format"])["sales"].mean().round(1))
# Discounts win in urban, bundles win in suburban: NEITHER promo is
# 'better' unconditionally. A one-way analysis of promo alone would
# have averaged this away to 'no difference' - the interaction test
# is what catches it.`,
    scenario: {
      title: 'Promotion strategy by store format',
      problem: 'Marketing tests two promo types across urban and suburban stores — and the initial one-way analysis says promos "don’t differ."',
      dataset: 'Sales under each promo×format cell, 25 stores per cell.',
      why: 'The effects genuinely cross: discounts win urban, bundles win suburban. Only the two-way interaction term can detect and certify that crossing.',
      output: 'The ANOVA table with a dominant interaction F, plus cell means.',
      interpretation: 'Deploy discounts in urban and bundles in suburban — worth ~7 units per store over any one-size-fits-all policy.',
      pitfalls: 'Reporting main effects when the interaction is significant averages over opposite effects — the classic factorial misread.',
    },
    mistakes: ['Interpreting main effects across a significant interaction', 'Unbalanced cells with default Type I sums (order-dependent nonsense)', 'Skipping the interaction plot that makes the finding legible'],
    tips: ['anova_lm(typ=2) is the sane default for mild imbalance', 'Interaction plot first — it IS the finding when significant', 'Simple-effects follow-ups (promo within each format) complete the story'],
  },
  {
    id: 'sign_z', group: 'ch13', name: 'Sign Test (z)', formula: 'z = [(X+0.5)−0.5n]/(√n/2)',
    tags: ['nonparametric', 'median', 'sign test'],
    overview: "The most assumption-free test there is: count how many observations fall above vs below the hypothesized median — under H₀ that's a fair coin. The normal approximation (with continuity correction) handles larger n. Weak but nearly unbreakable.",
    variables: [['X', 'count of one sign (e.g., above the claimed median)'], ['0.5n', 'expected count under the fair-coin null'], ['±0.5', 'continuity correction bridging discrete to normal']],
    thinking: {
      workflow: ['Question about a MEDIAN, data ugly (skewed/ordinal/censored-ish)?', 'Count above/below (drop exact ties)', 'Small n: exact binomial; larger: the z with correction', 'If data is symmetric enough, Wilcoxon signed-rank buys more power'],
      when: ['Skewed/ordinal data against a claimed median', 'Paired data with only direction (better/worse) reliably measured', 'Minimal-assumption audit answers'],
      notWhen: ['Interval data with symmetric differences (Wilcoxon > sign test in power)', 'Means genuinely the question'],
      assumptions: ['Independent observations; that is essentially all'],
    },
    code: `import numpy as np
from scipy import stats

# --- claim: median support-resolution time is 24h --------------------
rng = np.random.default_rng(6)
times = rng.lognormal(3.3, 0.5, 40)     # heavily right-skewed hours
claimed_median = 24

above = int((times > claimed_median).sum())
below = int((times < claimed_median).sum())
n = above + below                        # ties dropped
print(f"above: {above}, below: {below} (n = {n})")

# Exact binomial test - the gold standard at any n:
p_exact = stats.binomtest(above, n, 0.5).pvalue
print(f"exact binomial p = {p_exact:.4f}")

# Normal approximation with continuity correction (the formula):
X = max(above, below)
z = (X - 0.5 - 0.5*n) / (np.sqrt(n)/2)
p_z = 2 * stats.norm.sf(z)
print(f"z = {z:.2f}, approx p = {p_z:.4f}")

print(f"sample median = {np.median(times):.1f}h vs claimed 24h")
# The MEAN ({:.1f}) would be dragged high by the skew - exactly why
# the median question and the sign test fit this data.
print(f"(mean = {times.mean():.1f}h - see the skew at work)")`,
    scenario: {
      title: 'SLA on median resolution time',
      problem: 'A vendor’s contract quotes MEDIAN ticket resolution under 24h; the client audits with heavily skewed duration data.',
      dataset: '40 resolution times, log-normal-ish as always.',
      why: 'The contract term is the median and the data is skewed — the sign test asks precisely the contractual question with almost no assumptions to attack.',
      output: 'Above/below counts, exact p, and the z approximation.',
      interpretation: '28 of 40 tickets over 24h (p=0.017): the median-under-24 claim fails at the audit standard.',
      pitfalls: 'Dropping ties is correct but must be disclosed; many ties shrink effective n and power.',
    },
    mistakes: ['Testing the mean when the contract says median', 'Forgetting the continuity correction in the hand formula', 'Counting ties into n'],
    tips: ['binomtest IS the sign test — exact, no approximation needed', 'The z form matters for understanding, not computation', 'More power available? Wilcoxon signed-rank, if symmetry is plausible'],
  },
  {
    id: 'wrs', group: 'ch13', name: 'Wilcoxon Rank Sum', formula: 'z = (W−μ_W)/σ_W',
    tags: ['nonparametric', 'two groups', 'mann-whitney', 'ranks'],
    overview: "The nonparametric two-group comparison (equivalent to Mann-Whitney U): pool everything, rank it, and ask whether one group's ranks sum higher than chance would allow. Outlier-proof by construction — a billionaire in the sample is just one high rank.",
    variables: [['W', 'sum of ranks in the smaller group'], ['μ_W', 'n₁(n₁+n₂+1)/2 — expected rank sum under H₀'], ['σ_W', '√(n₁n₂(n₁+n₂+1)/12)']],
    thinking: {
      workflow: ['Two independent groups, skewed/ordinal/outlier-prone outcome', 'Rank-based test (scipy mannwhitneyu — same test)', 'Report the rank-biserial effect size or P(X>Y)', 'State the hypothesis honestly: distributional shift, not means'],
      when: ['Skewed outcomes: salaries, durations, damage amounts', 'Ordinal scales (satisfaction 1–5) between groups', 'Small samples where normality is unverifiable'],
      notWhen: ['Verified-normal data (t-test slightly stronger)', 'Paired data (signed-rank version)', 'When specifically the MEANS must be compared (this tests stochastic dominance)'],
      assumptions: ['Independent groups; for a "median shift" reading, similar distribution shapes'],
    },
    code: `import numpy as np
from scipy import stats

# --- settlement amounts: two negotiation strategies ------------------
rng = np.random.default_rng(7)
strat_A = rng.lognormal(10.0, 0.8, 30)          # skewed, as money is
strat_B = rng.lognormal(10.45, 0.8, 28)          # genuinely higher

U, p = stats.mannwhitneyu(strat_B, strat_A, alternative="greater")
print(f"medians: A={np.median(strat_A):,.0f}  B={np.median(strat_B):,.0f}")
print(f"Mann-Whitney U = {U:.0f}, one-sided p = {p:.4f}")

# Interpretable effect size - P(random B case > random A case):
p_superiority = U / (len(strat_A) * len(strat_B))
print(f"P(B > A) = {p_superiority:.2f}")

# Why not the t-test? add one mega-settlement to A:
strat_A_out = np.append(strat_A, 2_000_000)
t_p = stats.ttest_ind(strat_B, strat_A_out, equal_var=False)[1]
u_p = stats.mannwhitneyu(strat_B, strat_A_out,
                         alternative="greater")[1]
print(f"with one outlier in A: t-test p = {t_p:.3f} (flipped!), "
      f"rank test p = {u_p:.4f} (stable)")`,
    scenario: {
      title: 'Comparing legal settlement strategies',
      problem: 'A firm compares settlement amounts under two negotiation strategies — money data with the occasional enormous case.',
      dataset: '~30 settled cases per strategy.',
      why: 'One mega-settlement would drive a t-test single-handedly; ranks cap its influence at "highest rank" and test whether B systematically settles higher.',
      output: 'U, p, and P(B>A) as the effect size.',
      interpretation: 'P(B>A)=0.68: in a random pair of cases, strategy B wins two-thirds of the time — the firm-wide rollout number.',
      pitfalls: 'If the two distributions differ in shape (not just location), "B’s median is higher" oversimplifies what the test detected.',
    },
    mistakes: ['Claiming a difference of MEANS from a rank test', 'Using it on paired data', 'Ignoring the shapes when narrating a "median shift"'],
    tips: ['mannwhitneyu = rank-sum; U/(n₁n₂) is the instantly-interpretable effect', 'Report medians per group alongside', 'It is only ~5% less efficient than t on truly normal data — cheap insurance'],
  },
  {
    id: 'wsrt', group: 'ch13', name: 'Wilcoxon Signed-Rank', formula: 'T = smaller signed-rank sum',
    tags: ['nonparametric', 'paired', 'ranks'],
    overview: "The nonparametric paired test: rank the absolute differences, then compare the positive-signed rank sum to the negative. Uses magnitude ordering (unlike the sign test) without assuming normality (unlike the paired t) — the robust middle path.",
    variables: [['D', 'per-pair differences (zeros dropped)'], ['signed ranks', 'ranks of |D| carrying D’s sign'], ['T', 'the smaller of the two signed-rank sums — the statistic']],
    thinking: {
      workflow: ['Paired differences; check rough SYMMETRY of D (its one assumption)', 'wilcoxon() in scipy; exact for small n, normal approx beyond', 'Report the median difference with the p', 'If even symmetry is doubtful, drop to the sign test'],
      when: ['Paired data with skewed/outlier-prone differences', 'Ordinal-ish paired ratings', 'Small paired samples where t’s normality is a leap'],
      notWhen: ['Clearly normal differences (paired t is a bit stronger)', 'Asymmetric differences (violates its assumption — sign test instead)'],
      assumptions: ['Symmetric distribution of differences around the median; independent pairs'],
    },
    code: `import numpy as np
from scipy import stats

# --- website redesign: same 20 users' task times ---------------------
rng = np.random.default_rng(8)
before = rng.lognormal(3.6, 0.4, 20)
after = before * rng.lognormal(-0.15, 0.25, 20)   # ~14% faster, skewed

D = after - before
print(f"median difference: {np.median(D):+.1f}s, "
      f"improved: {(D < 0).sum()}/20 users")

# Wilcoxon signed-rank:
T, p = stats.wilcoxon(after, before)
print(f"T = {T:.0f}, two-sided p = {p:.4f}")

# The three-way sensitivity picture on the same data:
_, p_t = stats.ttest_rel(after, before)
above = int((D > 0).sum())
p_sign = stats.binomtest(above, len(D), 0.5).pvalue
print(f"paired t: p = {p_t:.4f}  |  signed-rank: p = {p:.4f}  |  "
      f"sign: p = {p_sign:.4f}")
# Signed-rank typically sits between: more power than sign (uses
# magnitudes), more robustness than t (uses ranks of them).`,
    scenario: {
      title: 'Task-time improvement from a redesign',
      problem: 'UX measures the same 20 users on the old and new checkout; time data is right-skewed with a couple of laggards.',
      dataset: 'Paired task durations, before and after.',
      why: 'Paired, skewed differences with small n: the signed-rank test uses the size ordering of improvements without betting on normality.',
      output: 'T, p, and the median per-user improvement.',
      interpretation: 'Median −8.4s, p=0.006, 16/20 improved: the redesign ships with a robust evidentiary basis.',
      pitfalls: 'Zero differences are dropped (users unaffected) — report how many, since they temper the practical story.',
    },
    mistakes: ['Using it when differences are grossly asymmetric', 'Forgetting zero-difference handling', 'Reporting mean differences with a rank-based p (mismatched summaries)'],
    tips: ['scipy.stats.wilcoxon handles exact vs approximation automatically', 'Pair it with the median difference and improvement count', 'The t / signed-rank / sign trio is a built-in robustness analysis — run all three'],
  },
  {
    id: 'kw', group: 'ch13', name: 'Kruskal-Wallis', formula: 'H = [12/(N(N+1))]·Σ(Rᵢ²/nᵢ)−3(N+1)',
    tags: ['nonparametric', 'multiple groups', 'ranks', 'anova alternative'],
    overview: "One-way ANOVA's rank-based cousin: pool and rank all observations, then test whether the groups' average ranks differ more than chance allows. The 3+ group comparison for skewed, ordinal, or outlier-laden data.",
    variables: [['Rᵢ', 'sum of ranks in group i'], ['N', 'total observations'], ['H', 'the statistic, ~χ² with k−1 df under H₀']],
    thinking: {
      workflow: ['3+ groups, outcome unfit for ANOVA’s assumptions', 'kruskal() for the omnibus; H≈χ²(k−1)', 'Post-hoc: pairwise Mann-Whitney with Bonferroni/Holm (or Dunn’s test)', 'Report per-group medians and the epsilon²/eta² analog'],
      when: ['Skewed outcomes across several groups (salaries by department)', 'Ordinal ratings across 3+ conditions', 'Small unequal groups where normality is unverifiable'],
      notWhen: ['Clean normal data (ANOVA has more power)', 'Paired/repeated designs (Friedman test instead)'],
      assumptions: ['Independent groups; similar shapes for a location-shift reading'],
    },
    code: `import numpy as np
from scipy import stats

# --- salary distributions across four departments --------------------
rng = np.random.default_rng(9)
eng = rng.lognormal(11.35, 0.30, 45)
sales = rng.lognormal(11.20, 0.45, 38)    # long commission tail
ops = rng.lognormal(11.05, 0.25, 41)
support = rng.lognormal(11.00, 0.25, 33)

groups = {"eng": eng, "sales": sales, "ops": ops, "support": support}
for name, g in groups.items():
    print(f"{name:8s} median = {np.median(g):9,.0f}  n = {len(g)}")

H, p = stats.kruskal(*groups.values())
print(f"H = {H:.1f}, p = {p:.2e}")

# Post-hoc pairwise with Holm correction:
from itertools import combinations
names = list(groups)
raw = [(a, b, stats.mannwhitneyu(groups[a], groups[b])[1])
       for a, b in combinations(names, 2)]
raw.sort(key=lambda t: t[2])
m = len(raw)
print("pairwise (Holm-adjusted):")
for rank, (a, b, praw) in enumerate(raw):
    p_adj = min(1.0, praw * (m - rank))
    print(f"  {a:8s} vs {b:8s}: p_adj = {p_adj:.4f} "
          f"{'SIG' if p_adj < 0.05 else ''}")`,
    scenario: {
      title: 'Pay-equity screening across departments',
      problem: 'HR screens whether salary distributions differ across four departments, in data full of long commission tails.',
      dataset: 'Salaries per employee per department.',
      why: 'Salary is the canonical skewed variable; rank-based comparison respects the data while asking the multi-group question at a controlled error rate.',
      output: 'H, p, medians, and Holm-corrected pairwise verdicts.',
      interpretation: 'Eng and sales sit above ops/support (certified pairs listed) — the follow-up is a within-level compensation review, not a headline.',
      pitfalls: 'Departments differ in seniority mix — a significant H flags a difference, not discrimination; stratify before concluding.',
    },
    mistakes: ['ANOVA on flagrantly skewed data because "n is big"', 'Uncorrected post-hoc pairwise sweeps', 'Reading H as comparing means'],
    tips: ['kruskal + Dunn/Holm pairwise is the standard pipeline', 'Medians per group are the summaries that match the test', 'Friedman is the repeated-measures analog when groups are the same units'],
  },
  {
    id: 'spear', group: 'ch13', name: 'Spearman rₛ', formula: 'rₛ = 1−[6ΣD²]/[n(n²−1)]',
    tags: ['correlation', 'ranks', 'monotonic', 'nonparametric'],
    overview: "Correlation on RANKS: converts both variables to ranks and Pearson-correlates them (the formula is the shortcut when ranks are untied). Captures any MONOTONIC relationship — curved or straight — and shrugs at outliers.",
    variables: [['D', 'per-pair difference between the two ranks'], ['rₛ', 'rank correlation: −1 to +1'], ['monotonic', 'the property it measures — always-increasing(-decreasing), not necessarily linear']],
    thinking: {
      workflow: ['Scatter plot (still!) — monotonic but curved? ordinal scales? outliers?', 'Spearman instead of (or alongside) Pearson', 'Compare the two: rₛ ≫ r hints curvature; r ≫ rₛ hints outlier-driven linearity', 'Test/CI via scipy; report with n'],
      when: ['Ordinal variables (ratings, ranks, grades)', 'Curved-but-monotonic relationships (saturation, diminishing returns)', 'Outlier-contaminated continuous data'],
      notWhen: ['Non-monotonic relationships (U-shapes defeat both r and rₛ)', 'When the linear slope itself is the quantity of interest'],
      assumptions: ['Ordinal-or-better data; independent pairs — that is about it'],
    },
    code: `import numpy as np
from scipy import stats

rng = np.random.default_rng(10)

# --- saturating relationship: ad spend vs awareness ------------------
spend = rng.uniform(1, 100, 60)
awareness = 90 * spend / (spend + 15) + rng.normal(0, 4, 60)  # saturates

r_pearson = stats.pearsonr(spend, awareness)[0]
r_spearman, p_s = stats.spearmanr(spend, awareness)
print(f"Pearson r  = {r_pearson:.3f}   (understates - curve!)")
print(f"Spearman r = {r_spearman:.3f}  (captures the monotone link)")

# Ordinal use case: two judges ranking 10 proposals
judge1 = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
judge2 = np.array([2, 1, 4, 3, 6, 5, 8, 7, 10, 9])
D = judge1 - judge2
n = len(D)
rs_hand = 1 - 6 * (D**2).sum() / (n * (n**2 - 1))
print(f"judge agreement: hand formula rs = {rs_hand:.3f}, "
      f"scipy = {stats.spearmanr(judge1, judge2)[0]:.3f}")

# Outlier robustness side-by-side:
x = np.append(rng.normal(0, 1, 30), 12)
y = np.append(rng.normal(0, 1, 30), 12)
print(f"one outlier: Pearson = {stats.pearsonr(x, y)[0]:.2f}, "
      f"Spearman = {stats.spearmanr(x, y)[0]:.2f}")`,
    scenario: {
      title: 'Ad spend vs brand awareness (saturating)',
      problem: 'Marketing sees "only r=0.72" between spend and awareness and doubts the channel — but the relationship saturates, it doesn’t weaken.',
      dataset: 'Regional spend and surveyed awareness.',
      why: 'The link is strong but curved; Spearman’s 0.95 captures the monotone reality Pearson’s linear lens blurs — changing the narrative from "weak-ish" to "strong with diminishing returns".',
      output: 'Both correlations, with the curve identified.',
      interpretation: 'Spend reliably raises awareness with diminishing returns — the budget conversation becomes "where is the knee?", not "does it work?"',
      pitfalls: 'Neither correlation locates the saturation point — a curve fit does that next.',
    },
    mistakes: ['Defaulting to Pearson on ordinal scales', 'Interpreting rₛ as a linear slope', 'Using the shortcut formula with many ties (scipy handles ties correctly)'],
    tips: ['A large Pearson-Spearman gap is itself a diagnostic — investigate it', 'Kendall’s τ is the alternative with nicer small-sample properties', 'Report which correlation you used, always — they answer different questions'],
  },
  {
    id: 'runs', group: 'ch13', name: 'Runs Test', formula: 'z = (G−μ_G)/σ_G',
    tags: ['randomness', 'sequence', 'nonparametric'],
    overview: "Tests whether a sequence of two symbols is RANDOM in order: count the runs (maximal same-symbol streaks) and compare to what shuffling would produce. Too few runs = clustering/trend; too many = alternation. The order-forensics tool.",
    variables: [['G', 'observed number of runs'], ['μ_G', '2n₁n₂/(n₁+n₂)+1 — expected runs under randomness'], ['σ_G', 'its standard deviation'], ['n₁, n₂', 'counts of the two symbols']],
    thinking: {
      workflow: ['Encode the sequence as two symbols (above/below median, +/−, W/L)', 'Count runs; compute μ_G, σ_G from the symbol counts', 'Two-sided z-test: both too-few and too-many runs are non-random', 'Diagnose direction: clustering (few) vs alternation (many)'],
      when: ['Residual randomness checks in time order', 'Process control: are defects clustering in time?', 'Auditing sequences claimed to be random (draws, assignments)'],
      notWhen: ['n₁ or n₂ tiny (exact tables, not the z)', 'Magnitude matters, not just order (other tools see more)'],
      assumptions: ['A meaningful binary encoding; exchangeability under H₀'],
    },
    code: `import numpy as np
from scipy import stats

def runs_test(binary):
    binary = np.asarray(binary, dtype=int)
    n1, n2 = int(binary.sum()), int(len(binary) - binary.sum())
    G = 1 + int((np.diff(binary) != 0).sum())      # count runs
    mu = 2*n1*n2/(n1+n2) + 1
    sigma = np.sqrt(2*n1*n2*(2*n1*n2-n1-n2) /
                    ((n1+n2)**2 * (n1+n2-1)))
    z = (G - mu) / sigma
    return G, mu, z, 2*stats.norm.sf(abs(z))

rng = np.random.default_rng(11)

# 1. Genuinely random sequence:
random_seq = rng.integers(0, 2, 60)
G, mu, z, p = runs_test(random_seq)
print(f"random   : runs={G} (exp {mu:.1f}), z={z:+.2f}, p={p:.3f}")

# 2. CLUSTERED (machine drifts: defects bunch together):
clustered = np.repeat(rng.integers(0, 2, 12), 5)
G, mu, z, p = runs_test(clustered)
print(f"clustered: runs={G} (exp {mu:.1f}), z={z:+.2f}, p={p:.4f}")

# 3. ALTERNATING (human faking 'randomness' over-alternates):
alt = np.array([0, 1] * 30)
G, mu, z, p = runs_test(alt)
print(f"alternate: runs={G} (exp {mu:.1f}), z={z:+.2f}, p={p:.2e}")

# Classic use: residuals-in-time-order after a regression
resid_drift = np.sin(np.linspace(0, 3, 50)) + rng.normal(0, 0.3, 50)
G, mu, z, p = runs_test(resid_drift > np.median(resid_drift))
print(f"trending residuals: runs={G} (exp {mu:.1f}), p={p:.4f} "
      "<- missed structure")`,
    scenario: {
      title: 'Detecting drift in production defects',
      problem: 'A line produces the usual number of defects, but QA suspects they now come in bunches — a symptom of intermittent machine drift.',
      dataset: 'The pass/fail sequence in production order.',
      why: 'Overall rate looks fine; only ORDER carries the signal. Too few runs certifies the clustering that eyeballing suspected.',
      output: 'Run count vs expectation with z and p.',
      interpretation: 'p=0.002 with runs far below expected: defects cluster — schedule intermittent-fault diagnosis, not operator retraining.',
      pitfalls: 'The binary encoding choice (above/below median vs pass/fail) frames what "random" means — pick it to match the failure mode.',
    },
    mistakes: ['Using the normal approximation with very few of one symbol', 'One-sided tests when both directions of non-randomness matter', 'Forgetting that the test sees order ONLY, never magnitude'],
    tips: ['Great cheap check on regression residuals in time order', 'Humans faking coin flips over-alternate — a fun audit application', 'statsmodels runstest_1samp offers a packaged version'],
  },
  {
    id: 'sim_mean', group: 'ch14', name: 'Simulation Mean', formula: 'X̄ = ΣX/n (over simulated trials)',
    tags: ['monte carlo', 'simulation', 'estimation'],
    overview: "The sample mean applied to simulated outcomes: run the random process thousands of times, average the results, and the LLN guarantees convergence to the true expected value. The workhorse output of every Monte Carlo study — with a standard error you control by choosing n.",
    variables: [['X', 'the outcome of one simulated trial'], ['n', 'number of simulated trials (you choose it!)'], ['s/√n', 'the Monte Carlo standard error — precision on demand']],
    thinking: {
      workflow: ['Define one trial cleanly (function returning one outcome)', 'Run n trials with a SEEDED generator', 'Report mean ± MC standard error', 'Increase n until the MCSE is small enough for the decision'],
      when: ['Expected values with no closed form (complex payoffs, queues, pipelines)', 'Verifying analytic answers independently', 'Pricing/planning under compound uncertainty'],
      notWhen: ['A clean closed-form exists (just compute it — then maybe simulate to verify)', 'Rare-event tails dominate (naive means need variance-reduction tricks there)'],
      assumptions: ['The simulation faithfully encodes the process; trials independent'],
    },
    code: `import numpy as np

rng = np.random.default_rng(0)

# --- project cost: three uncertain phases, correlated overruns -------
def one_project():
    design = rng.triangular(40, 55, 90)          # $k
    overrun = rng.uniform(0.9, 1.4)              # shared climate
    build = rng.triangular(120, 150, 260) * overrun
    integrate = rng.triangular(30, 45, 100) * overrun
    return design + build + integrate

n = 100_000
costs = np.array([one_project() for _ in range(n)])

mean = costs.mean()
mcse = costs.std(ddof=1) / np.sqrt(n)
print(f"expected total cost = {mean:.1f} +/- {mcse:.2f} $k (MC SE)")
print(f"P(cost > 300k) = {(costs > 300).mean():.3f}")
print(f"p90 cost       = {np.percentile(costs, 90):.0f} $k")

# Convergence in action - the LLN visible:
for nn in [100, 1_000, 10_000, 100_000]:
    print(f"n={nn:6d}: running mean = {costs[:nn].mean():.1f} "
          f"(+/- {costs[:nn].std(ddof=1)/np.sqrt(nn):.2f})")`,
    scenario: {
      title: 'Project cost estimation under compound uncertainty',
      problem: 'A PMO must budget a project whose three phases each carry uncertainty — and share a common overrun driver.',
      dataset: 'Phase-level estimates (min/likely/max) from engineering.',
      why: 'The correlated, triangular, summed structure has no tidy closed form; simulating 100k projects gives the expected cost, tail risk, and p90 in one run.',
      output: 'Expected cost ± MCSE, overrun probability, and p90.',
      interpretation: 'Budget at the p90 ($318k), not the mean ($262k) — the distribution, not the average, is what commitments should be made on.',
      pitfalls: 'Ignoring the shared overrun correlation would understate the tail badly — independence assumptions hide compound risk.',
    },
    mistakes: ['No seed → irreproducible analyses', 'Reporting the mean without the MC standard error', 'Modeling correlated uncertainties as independent', 'Too few trials for tail statements'],
    tips: ['default_rng(seed) at the top of every simulation, no exceptions', 'MCSE = s/√n tells you exactly when to stop simulating', 'Vectorize trials with numpy where possible — 100× speedups are routine'],
  },
  {
    id: 'mc_prob', group: 'ch14', name: 'Monte Carlo P(E)', formula: 'P(E) ≈ f/n (over simulated trials)',
    tags: ['monte carlo', 'probability', 'simulation'],
    overview: "Empirical probability where the data is simulated: run the process n times, count how often the event occurred, divide. Any probability you can DESCRIBE as a process, you can estimate — no combinatorics degree required. Precision: √(p̂q̂/n), so rare events need many trials.",
    variables: [['f', 'simulated trials where the event occurred'], ['n', 'total simulated trials'], ['√(p̂q̂/n)', 'the MC standard error of the estimate']],
    thinking: {
      workflow: ['Encode one trial and the event predicate', 'Simulate n trials, count hits', 'Report p̂ with its MC standard error', 'Rare event? Scale n (need ~100/p trials for decent relative error) or use importance tricks'],
      when: ['Probabilities too tangled for closed forms (queues, sequences of dependencies)', 'Checking analytic derivations empirically', 'Communicating probability to non-statisticians (the simulation IS the explanation)'],
      notWhen: ['Trivial closed forms exist and no verification is needed', 'Extremely rare events without variance-reduction methods'],
      assumptions: ['Faithful process encoding; independent trials; enough n for the target precision'],
    },
    code: `import numpy as np

rng = np.random.default_rng(1)

# --- overbooking, revisited by pure simulation -----------------------
# 270 tickets, each shows independently with p=0.92; seats = 256.
n = 500_000
shows = rng.binomial(270, 0.92, n)
p_bump = (shows > 256).mean()
se = np.sqrt(p_bump * (1 - p_bump) / n)
print(f"P(bumping) = {p_bump:.4f} +/- {se:.4f}")

# --- a question with NO tidy formula: streaks ------------------------
# P(a fair coin shows a run of 7+ heads somewhere in 100 flips)?
def has_streak(flips, k=7):
    run = best = 0
    for f in flips:
        run = run + 1 if f else 0
        best = max(best, run)
    return best >= k

trials = 40_000
hits = sum(has_streak(rng.integers(0, 2, 100)) for _ in range(trials))
p_streak = hits / trials
print(f"P(7+ head streak in 100 flips) = {p_streak:.3f} "
      f"+/- {np.sqrt(p_streak*(1-p_streak)/trials):.3f}")
# ~32% - far higher than most intuitions; a two-minute simulation
# answers what a closed-form derivation makes painful.

# Rare-event planning rule: need roughly 100/p trials
print(f"to estimate a p~0.001 event decently: n ~ {int(100/0.001):,}")`,
    scenario: {
      title: 'Streak questions in fraud monitoring',
      problem: 'A risk team must judge whether 7 consecutive high-risk flags from one merchant is remarkable or expected noise.',
      dataset: 'The per-transaction flag rate and volume — the process description.',
      why: 'Streak probabilities have painful closed forms; a simulation encodes the reality (including volume) directly and answers in minutes.',
      output: 'P(such a streak somewhere in the window) with MC error.',
      interpretation: 'At 32%, the streak is unremarkable — alerting on it would page someone weekly for noise; thresholds should be set where simulated P drops below the tolerable false-alarm rate.',
      pitfalls: 'The simulation answers exactly the question you encode — "streak of 7 in THIS window" differs from "streak of 7 ever."',
    },
    mistakes: ['Too few trials for small probabilities (garbage relative error)', 'Encoding a subtly different event than the question asked', 'No standard error on the estimate', 'Reusing one simulation to answer post-hoc many questions without care'],
    tips: ['State the event predicate in code review — it IS the analysis', '~100 occurrences of the event is a decent precision floor', 'Simulations double as explanations: show the code, win the argument'],
  },
  {
    id: 'mc_steps', group: 'ch14', name: 'Monte Carlo Steps', formula: 'List → Assign P → Map digits → Sample → Compute',
    tags: ['monte carlo', 'methodology', 'workflow'],
    overview: "The five-step recipe for any Monte Carlo study: enumerate outcomes, assign probabilities, map random numbers to outcomes, generate trials, compute the summary. The textbook 'random digits' framing generalizes directly to modern rng-based simulation design.",
    variables: [['List', 'enumerate the possible outcomes of one trial'], ['Assign P', 'attach probabilities (data, theory, or judgment — documented)'], ['Map', 'connect random draws to outcomes (the digit table of old, rng today)'], ['Sample & Compute', 'run trials, summarize with mean/probability/percentiles']],
    thinking: {
      workflow: ['Write the five steps as literal comments before any code', 'Validate the mapping: simulated marginal frequencies must match assigned P', 'Seed, run, summarize with MC error', 'Sensitivity-test the assigned probabilities — they are the weakest link'],
      when: ['Designing any simulation study from scratch', 'Teaching/communicating how a simulation earns its numbers', 'Auditing someone else’s simulation (check each step)'],
      notWhen: ['The process is already well-encoded in a library distribution call (steps collapse naturally)'],
      assumptions: ['Assigned probabilities are defensible; mapping is exact; trials independent'],
    },
    code: `import numpy as np

rng = np.random.default_rng(2)

# ================= THE FIVE STEPS, MADE LITERAL =================
# STEP 1 - LIST the outcomes of one trial (a service call):
outcomes = ["resolved_first_call", "escalated", "callback", "dropped"]

# STEP 2 - ASSIGN probabilities (from last quarter's ticket data):
probs = [0.55, 0.25, 0.15, 0.05]
assert abs(sum(probs) - 1.0) < 1e-9

# STEP 3 - MAP random numbers to outcomes.
#   1970s textbook: digits 00-54 -> resolved, 55-79 -> escalated...
#   today: rng.choice does the same mapping, exactly:
def one_call():
    return rng.choice(outcomes, p=probs)

# STEP 4 - SAMPLE many trials:
n = 100_000
calls = rng.choice(outcomes, p=probs, size=n)

# validate the mapping (step-3 audit):
observed = {o: np.mean(calls == o) for o in outcomes}
print("assigned vs simulated:")
for o, p in zip(outcomes, probs):
    print(f"  {o:20s} {p:.2f} vs {observed[o]:.3f}")

# STEP 5 - COMPUTE the target quantity:
# cost model: escalation $18, callback $7, dropped $40 (churn risk)
cost_map = {"resolved_first_call": 0.0, "escalated": 18.0,
            "callback": 7.0, "dropped": 40.0}
costs = np.vectorize(cost_map.get)(calls)
print(f"expected cost/call = {costs.mean():.2f} "
      f"+/- {costs.std(ddof=1)/np.sqrt(n):.3f}")
print(f"P(cost > 0) = {(costs > 0).mean():.3f}")`,
    scenario: {
      title: 'Costing a support-call process',
      problem: 'Ops wants the expected downstream cost per incoming call, with outcome probabilities pulled from ticket history.',
      dataset: 'Last quarter’s outcome frequencies and the per-outcome cost model.',
      why: 'The five-step recipe structures the study so every choice (outcomes, probabilities, mapping, size, summary) is explicit, auditable, and sensitivity-testable.',
      output: 'Cost per call with MC error, plus the step-3 mapping audit.',
      interpretation: '$7.61/call expected cost, dominated by the rare-but-costly drops — the improvement lever is the 5% drop rate, visibly.',
      pitfalls: 'Step 2 is where simulations silently lie: last quarter’s probabilities projected onto a changed process.',
    },
    mistakes: ['Undocumented probability sources in step 2', 'Skipping the mapping validation (step 3 bugs are silent)', 'Sample size chosen by impatience rather than target precision', 'Answer reported without the MC error'],
    tips: ['Write the five steps as comments FIRST — the code then writes itself', 'The digit-table story explains modern rng.choice perfectly to any audience', 'Sensitivity analysis on step-2 probabilities belongs in every write-up'],
  },
];
