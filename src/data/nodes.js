export const nodes = [
  {
    "id": "pct",
    "ch": 2,
    "name": "Class %",
    "short": "f/n·100",
    "formula": "% = (f/n) × 100",
    "desc": "Converts class frequency to percentage.",
    "use": "Frequency tables, pie graphs",
    "tags": [
      "frequency",
      "percentage"
    ]
  },
  {
    "id": "midpoint",
    "ch": 2,
    "name": "Class Midpoint",
    "short": "(LB+UB)/2",
    "formula": "Xm = (Lower + Upper) / 2",
    "desc": "Representative value of each class.",
    "use": "Computing grouped mean and variance",
    "tags": [
      "class",
      "midpoint"
    ]
  },
  {
    "id": "pie_deg",
    "ch": 2,
    "name": "Pie Degrees",
    "short": "f/n·360°",
    "formula": "Degrees = (f/n) × 360°",
    "desc": "Converts frequency to degrees for pie chart.",
    "use": "Pie charts, data visualization",
    "tags": [
      "pie",
      "frequency"
    ]
  },
  {
    "id": "range2",
    "ch": 2,
    "name": "Range (Ch2)",
    "short": "Max−Min",
    "formula": "R = Highest − Lowest",
    "desc": "Spread to set up class intervals.",
    "use": "Setting class width",
    "tags": [
      "range",
      "spread"
    ]
  },
  {
    "id": "cwidth",
    "ch": 2,
    "name": "Class Width",
    "short": "UB−LB",
    "formula": "Class Width = Upper − Lower Boundary",
    "desc": "Width of each class interval.",
    "use": "Constructing frequency distributions",
    "tags": [
      "class width"
    ]
  },
  {
    "id": "x_bar",
    "ch": 3,
    "name": "Sample Mean",
    "short": "X̄=ΣX/n",
    "formula": "X̄ = ΣX / n",
    "desc": "Average of a sample. The most important measure of central tendency.",
    "use": "Baseline for nearly all inferential statistics",
    "tags": [
      "mean",
      "central tendency",
      "average"
    ]
  },
  {
    "id": "mu",
    "ch": 3,
    "name": "Population Mean",
    "short": "μ=ΣX/N",
    "formula": "μ = ΣX / N",
    "desc": "True average of the entire population.",
    "use": "Hypothesis testing (H₀: μ = k)",
    "tags": [
      "mean",
      "population"
    ]
  },
  {
    "id": "grp_mean",
    "ch": 3,
    "name": "Grouped Mean",
    "short": "Σf·Xm/n",
    "formula": "X̄ = Σ(f · Xm) / n",
    "desc": "Mean from a frequency distribution.",
    "use": "When only frequency table available",
    "tags": [
      "grouped",
      "mean"
    ]
  },
  {
    "id": "wmean",
    "ch": 3,
    "name": "Weighted Mean",
    "short": "ΣwX/Σw",
    "formula": "X̄ = ΣwX / Σw",
    "desc": "Mean where each value has a different weight.",
    "use": "GPA calculation, portfolio returns",
    "tags": [
      "weighted",
      "mean"
    ]
  },
  {
    "id": "midrange",
    "ch": 3,
    "name": "Midrange",
    "short": "(L+H)/2",
    "formula": "MR = (Lowest + Highest) / 2",
    "desc": "Simple measure of center; sensitive to outliers.",
    "use": "Quick estimation",
    "tags": [
      "midrange"
    ]
  },
  {
    "id": "pop_var",
    "ch": 3,
    "name": "Population Variance",
    "short": "σ²=Σ(X−μ)²/N",
    "formula": "σ² = Σ(X−μ)² / N",
    "desc": "Average squared deviation from population mean.",
    "use": "Theoretical distributions, chi-square setup",
    "tags": [
      "variance",
      "population"
    ]
  },
  {
    "id": "samp_var",
    "ch": 3,
    "name": "Sample Variance",
    "short": "s²=[nΣX²−(ΣX)²]/[n(n−1)]",
    "formula": "s² = [n(ΣX²)−(ΣX)²] / [n(n−1)]",
    "desc": "Unbiased estimator of population variance.",
    "use": "Confidence intervals, F-test, chi-square",
    "tags": [
      "variance",
      "sample"
    ]
  },
  {
    "id": "pop_sd",
    "ch": 3,
    "name": "Population SD",
    "short": "σ=√[Σ(X−μ)²/N]",
    "formula": "σ = √[Σ(X−μ)²/N]",
    "desc": "Population standard deviation.",
    "use": "z-score formula, normal distribution",
    "tags": [
      "standard deviation",
      "population"
    ]
  },
  {
    "id": "samp_sd",
    "ch": 3,
    "name": "Sample SD",
    "short": "s=√[...]",
    "formula": "s = √{[n(ΣX²)−(ΣX)²]/[n(n−1)]}",
    "desc": "Sample standard deviation. Most common spread measure.",
    "use": "t-tests, confidence intervals, CV",
    "tags": [
      "standard deviation",
      "sample"
    ]
  },
  {
    "id": "grp_sd",
    "ch": 3,
    "name": "Grouped SD",
    "short": "s (grouped)",
    "formula": "s = √{[n(Σf·Xm²)−(Σf·Xm)²]/[n(n−1)]}",
    "desc": "Standard deviation from a frequency distribution.",
    "use": "When only frequency table is available",
    "tags": [
      "grouped",
      "standard deviation"
    ]
  },
  {
    "id": "cvar",
    "ch": 3,
    "name": "Coeff. of Variation",
    "short": "CVar=s/X̄·100",
    "formula": "CVar = (s/X̄)×100",
    "desc": "Relative variability as a percentage.",
    "use": "Comparing variability across different units",
    "tags": [
      "coefficient of variation"
    ]
  },
  {
    "id": "rrt",
    "ch": 3,
    "name": "Range Rule of Thumb",
    "short": "s≈Range/4",
    "formula": "s ≈ Range / 4",
    "desc": "Quick approximation of standard deviation.",
    "use": "Quick checks, initial estimates",
    "tags": [
      "estimation",
      "range"
    ]
  },
  {
    "id": "cheby",
    "ch": 3,
    "name": "Chebyshev's Theorem",
    "short": "1−1/k²",
    "formula": "Proportion ≥ 1−1/k²  (k>1)",
    "desc": "Works for ANY distribution.",
    "use": "When distribution shape is unknown",
    "tags": [
      "Chebyshev",
      "spread"
    ]
  },
  {
    "id": "zscore",
    "ch": 3,
    "name": "z-Score",
    "short": "z=(X−X̄)/s",
    "formula": "z = (X−X̄)/s  or  (X−μ)/σ",
    "desc": "Standardizes any value to units of standard deviations.",
    "use": "Normal distribution areas, comparing scores",
    "tags": [
      "z-score",
      "standardize",
      "normal"
    ]
  },
  {
    "id": "pctile",
    "ch": 3,
    "name": "Percentile Rank",
    "short": "(#below+0.5)/n·100",
    "formula": "Percentile = [(#below X + 0.5)/n] × 100",
    "desc": "Percentage of values falling below a given value.",
    "use": "Test scores, growth charts, rankings",
    "tags": [
      "percentile",
      "rank"
    ]
  },
  {
    "id": "c_val",
    "ch": 3,
    "name": "Value at Percentile",
    "short": "c=n·p/100",
    "formula": "c = n · p / 100",
    "desc": "Position of a given percentile in sorted dataset.",
    "use": "Finding Q1, Q2, Q3, boxplots",
    "tags": [
      "percentile",
      "quartile"
    ]
  },
  {
    "id": "iqr",
    "ch": 3,
    "name": "IQR",
    "short": "Q3−Q1",
    "formula": "IQR = Q3 − Q1",
    "desc": "Middle 50% spread. Resistant to outliers.",
    "use": "Boxplots, outlier detection",
    "tags": [
      "IQR",
      "quartile",
      "outlier"
    ]
  },
  {
    "id": "class_p",
    "ch": 4,
    "name": "Classical P",
    "short": "n(E)/n(S)",
    "formula": "P(E) = n(E)/n(S)",
    "desc": "Theoretical probability when all outcomes equally likely.",
    "use": "Dice, cards, coins",
    "tags": [
      "probability",
      "classical"
    ]
  },
  {
    "id": "emp_p",
    "ch": 4,
    "name": "Empirical P",
    "short": "f/n",
    "formula": "P(E) = f/n",
    "desc": "Observed probability from actual data.",
    "use": "Experimental results, Monte Carlo",
    "tags": [
      "probability",
      "empirical"
    ]
  },
  {
    "id": "add1",
    "ch": 4,
    "name": "Addition Rule 1",
    "short": "P(A∪B)=P(A)+P(B)",
    "formula": "P(A or B) = P(A)+P(B)  [mutually exclusive]",
    "desc": "For events that cannot occur simultaneously.",
    "use": "OR probabilities with no overlap",
    "tags": [
      "addition rule",
      "mutually exclusive"
    ]
  },
  {
    "id": "add2",
    "ch": 4,
    "name": "Addition Rule 2",
    "short": "P(A∪B)=P(A)+P(B)−P(A∩B)",
    "formula": "P(A or B) = P(A)+P(B)−P(A and B)",
    "desc": "General addition rule. Subtracts overlap.",
    "use": "'At least one' problems",
    "tags": [
      "addition rule",
      "overlap"
    ]
  },
  {
    "id": "mult1",
    "ch": 4,
    "name": "Mult. Rule 1",
    "short": "P(A∩B)=P(A)·P(B)",
    "formula": "P(A and B) = P(A)·P(B)  [independent]",
    "desc": "For independent events, multiply probabilities.",
    "use": "Coin flips in series, binomial setup",
    "tags": [
      "multiplication",
      "independent"
    ]
  },
  {
    "id": "mult2",
    "ch": 4,
    "name": "Mult. Rule 2",
    "short": "P(A∩B)=P(A)·P(B|A)",
    "formula": "P(A and B) = P(A)·P(B|A)  [dependent]",
    "desc": "For dependent events, use conditional probability.",
    "use": "Drawing without replacement",
    "tags": [
      "multiplication",
      "dependent"
    ]
  },
  {
    "id": "cond_p",
    "ch": 4,
    "name": "Conditional P",
    "short": "P(B|A)=P(A∩B)/P(A)",
    "formula": "P(B|A) = P(A and B)/P(A)",
    "desc": "Probability of B given A has occurred.",
    "use": "Medical screening, Bayes' theorem",
    "tags": [
      "conditional",
      "Bayes"
    ]
  },
  {
    "id": "comp_p",
    "ch": 4,
    "name": "Complement Rule",
    "short": "P(Ē)=1−P(E)",
    "formula": "P(Ē) = 1−P(E)",
    "desc": "Probability of event NOT occurring.",
    "use": "'At least one' → 1−P(none)",
    "tags": [
      "complement",
      "probability"
    ]
  },
  {
    "id": "fcr",
    "ch": 4,
    "name": "Fundamental Counting",
    "short": "k₁·k₂·…",
    "formula": "Total = k₁·k₂·k₃···kₙ",
    "desc": "For a sequence of events, multiply the counts.",
    "use": "Passwords, menus, sample space size",
    "tags": [
      "counting",
      "combinatorics"
    ]
  },
  {
    "id": "perm",
    "ch": 4,
    "name": "Permutation nPr",
    "short": "n!/(n−r)!",
    "formula": "nPr = n!/(n−r)!",
    "desc": "Ordered selections of r items from n.",
    "use": "Ranking, scheduling, codes",
    "tags": [
      "permutation",
      "factorial"
    ]
  },
  {
    "id": "perm2",
    "ch": 4,
    "name": "Permutation (identical)",
    "short": "n!/(r₁!r₂!…)",
    "formula": "n!/(r₁!·r₂!···rₚ!)",
    "desc": "Permutations when some objects are identical.",
    "use": "Arranging letters with repeats",
    "tags": [
      "permutation",
      "identical"
    ]
  },
  {
    "id": "comb",
    "ch": 4,
    "name": "Combination nCr",
    "short": "n!/[(n−r)!r!]",
    "formula": "nCr = n!/[(n−r)!·r!]",
    "desc": "Unordered selections of r items from n.",
    "use": "Lottery, committees, binomial coefficient",
    "tags": [
      "combination",
      "binomial coefficient"
    ]
  },
  {
    "id": "disc_mu",
    "ch": 5,
    "name": "Distribution Mean",
    "short": "μ=ΣX·P(X)",
    "formula": "μ = Σ[X·P(X)]",
    "desc": "Expected value of a discrete probability distribution.",
    "use": "Long-run average in decision-making",
    "tags": [
      "mean",
      "discrete",
      "expected value"
    ]
  },
  {
    "id": "disc_var",
    "ch": 5,
    "name": "Distribution Variance",
    "short": "σ²=Σ[X²P(X)]−μ²",
    "formula": "σ² = Σ[X²·P(X)]−μ²",
    "desc": "Variance of a discrete probability distribution.",
    "use": "Measuring spread of outcomes",
    "tags": [
      "variance",
      "discrete"
    ]
  },
  {
    "id": "exp_val",
    "ch": 5,
    "name": "Expected Value",
    "short": "E(X)=ΣX·P(X)",
    "formula": "E(X) = Σ[X·P(X)]",
    "desc": "Central to simulation (Ch14).",
    "use": "Insurance, gambling, business decisions",
    "tags": [
      "expected value",
      "simulation"
    ]
  },
  {
    "id": "binom",
    "ch": 5,
    "name": "Binomial Formula",
    "short": "P(X)=nCx·pˣ·qⁿ⁻ˣ",
    "formula": "P(X) = nCₓ·pˣ·q^(n−X)",
    "desc": "Probability of exactly X successes in n trials.",
    "use": "Quality control, surveys, medical testing",
    "tags": [
      "binomial",
      "probability"
    ]
  },
  {
    "id": "binom_mu",
    "ch": 5,
    "name": "Binomial Mean",
    "short": "μ=np",
    "formula": "μ = n·p",
    "desc": "Expected number of successes in n trials.",
    "use": "Normal approximation, verify np≥5",
    "tags": [
      "binomial",
      "mean"
    ]
  },
  {
    "id": "binom_sd",
    "ch": 5,
    "name": "Binomial SD",
    "short": "σ=√(npq)",
    "formula": "σ = √(n·p·q)  where q=1−p",
    "desc": "Standard deviation of a binomial distribution.",
    "use": "Normal approximation to binomial",
    "tags": [
      "binomial",
      "standard deviation"
    ]
  },
  {
    "id": "multi",
    "ch": 5,
    "name": "Multinomial",
    "short": "n!/(X₁!X₂!…)",
    "formula": "P = [n!/(X₁!X₂!···Xₖ!)]·p₁^X₁···pₖ^Xₖ",
    "desc": "Extension of binomial to more than 2 categories.",
    "use": "Genetics, multiple-category surveys",
    "tags": [
      "multinomial"
    ]
  },
  {
    "id": "poisson",
    "ch": 5,
    "name": "Poisson",
    "short": "P(X;λ)=e⁻λλˣ/X!",
    "formula": "P(X;λ) = e^(−λ)·λˣ/X!",
    "desc": "Probability of X events in fixed interval at rate λ.",
    "use": "Defects per unit, calls per hour",
    "tags": [
      "Poisson",
      "rate"
    ]
  },
  {
    "id": "hypgeo",
    "ch": 5,
    "name": "Hypergeometric",
    "short": "P(X)=(aCx·bCn−x)/N_Cn",
    "formula": "P(X) = (aCₓ·bCₙ₋ₓ)/(a+bCₙ)",
    "desc": "Probability of X successes without replacement.",
    "use": "Acceptance sampling, finite populations",
    "tags": [
      "hypergeometric"
    ]
  },
  {
    "id": "geometric",
    "ch": 5,
    "name": "Geometric",
    "short": "P(n)=p(1−p)^(n−1)",
    "formula": "P(n) = p·(1−p)^(n−1)",
    "desc": "Probability first success occurs on trial n.",
    "use": "First defect, first sale scenarios",
    "tags": [
      "geometric",
      "first success"
    ]
  },
  {
    "id": "znorm",
    "ch": 6,
    "name": "z-Score (Normal)",
    "short": "z=(X−μ)/σ",
    "formula": "z = (X−μ)/σ",
    "desc": "Transforms normal variable to standard normal.",
    "use": "Finding areas under normal curve",
    "tags": [
      "z-score",
      "normal"
    ]
  },
  {
    "id": "x_from_z",
    "ch": 6,
    "name": "X from z",
    "short": "X=zσ+μ",
    "formula": "X = z·σ+μ",
    "desc": "Reverses z-score to find raw value.",
    "use": "Finding cutoff scores, CI boundary",
    "tags": [
      "z-score",
      "inverse"
    ]
  },
  {
    "id": "mu_xbar",
    "ch": 6,
    "name": "Mean of X̄",
    "short": "μ_X̄=μ",
    "formula": "μ_X̄ = μ",
    "desc": "Mean of all possible sample means equals pop. mean.",
    "use": "Central Limit Theorem setup",
    "tags": [
      "sampling distribution",
      "mean"
    ]
  },
  {
    "id": "sem",
    "ch": 6,
    "name": "Std Error of Mean",
    "short": "σ_X̄=σ/√n",
    "formula": "σ_X̄ = σ/√n",
    "desc": "Standard deviation of sampling distribution of X̄.",
    "use": "CLT, CI denominator, z/t test denominators",
    "tags": [
      "standard error",
      "sampling",
      "CLT"
    ]
  },
  {
    "id": "clt",
    "ch": 6,
    "name": "CLT z-Formula",
    "short": "z=(X̄−μ)/(σ/√n)",
    "formula": "z = (X̄−μ)/(σ/√n)",
    "desc": "Central Limit Theorem: X̄ is normally distributed.",
    "use": "z-test for means, confidence intervals",
    "tags": [
      "CLT",
      "z-score",
      "sampling"
    ]
  },
  {
    "id": "z_ci",
    "ch": 7,
    "name": "z CI for Mean",
    "short": "X̄±z·σ/√n",
    "formula": "X̄ ± z_{α/2}·(σ/√n)",
    "desc": "Confidence interval for mean when σ is known.",
    "use": "Estimating population mean with known σ",
    "tags": [
      "confidence interval",
      "z",
      "mean"
    ]
  },
  {
    "id": "t_ci",
    "ch": 7,
    "name": "t CI for Mean",
    "short": "X̄±t·s/√n",
    "formula": "X̄ ± t_{α/2}·(s/√n)  df=n−1",
    "desc": "CI for mean when σ is unknown. Uses t-distribution.",
    "use": "Most real-world CI for means",
    "tags": [
      "confidence interval",
      "t",
      "mean"
    ]
  },
  {
    "id": "ci_mean_t",
    "ch": 7,
    "name": "t CI (Mean)",
    "short": "X̄±t·s/√n",
    "formula": "X̄ − t_{α/2}·(s/√n) < μ < X̄ + t_{α/2}·(s/√n)",
    "desc": "Full interval expression for t CI.",
    "use": "Reporting confidence intervals",
    "tags": [
      "confidence interval",
      "t-interval"
    ]
  },
  {
    "id": "n_mean",
    "ch": 7,
    "name": "Sample Size (Mean)",
    "short": "n=(z·σ/E)²",
    "formula": "n = (z_{α/2}·σ/E)²",
    "desc": "Minimum n to achieve desired margin of error E.",
    "use": "Study design, survey planning",
    "tags": [
      "sample size",
      "margin of error"
    ]
  },
  {
    "id": "p_hat",
    "ch": 7,
    "name": "Sample Proportion",
    "short": "p̂=X/n",
    "formula": "p̂ = X/n",
    "desc": "Sample proportion — number of successes divided by total sample size. The categorical equivalent of X̄.",
    "use": "Foundation for all proportion-based inference tests and CIs",
    "tags": [
      "proportion",
      "sample",
      "p-hat"
    ]
  },
  {
    "id": "p_ci",
    "ch": 7,
    "name": "CI for Proportion",
    "short": "p̂±z√(p̂q̂/n)",
    "formula": "p̂ ± z_{α/2}·√(p̂q̂/n)",
    "desc": "Confidence interval for a population proportion.",
    "use": "Election polls, surveys",
    "tags": [
      "confidence interval",
      "proportion"
    ]
  },
  {
    "id": "n_prop",
    "ch": 7,
    "name": "Sample Size (Prop.)",
    "short": "n=p̂q̂(z/E)²",
    "formula": "n = p̂·q̂·(z_{α/2}/E)²",
    "desc": "Sample size for estimating a proportion.",
    "use": "Survey planning (use p̂=0.5 if unknown)",
    "tags": [
      "sample size",
      "proportion"
    ]
  },
  {
    "id": "var_ci",
    "ch": 7,
    "name": "CI for Variance",
    "short": "(n−1)s²/χ²",
    "formula": "(n−1)s²/χ²_R < σ² < (n−1)s²/χ²_L",
    "desc": "CI for population variance using chi-square.",
    "use": "Manufacturing tolerances",
    "tags": [
      "confidence interval",
      "variance"
    ]
  },
  {
    "id": "sd_ci",
    "ch": 7,
    "name": "CI for SD",
    "short": "√[(n−1)s²/χ²]",
    "formula": "√[(n−1)s²/χ²_R] < σ < √[(n−1)s²/χ²_L]",
    "desc": "CI for population standard deviation.",
    "use": "Process capability, quality standards",
    "tags": [
      "confidence interval",
      "standard deviation"
    ]
  },
  {
    "id": "z_test",
    "ch": 8,
    "name": "z Test (Mean)",
    "short": "z=(X̄−μ)/(σ/√n)",
    "formula": "z = (X̄−μ₀)/(σ/√n)",
    "desc": "Tests whether pop. mean equals μ₀ (σ known or n≥30).",
    "use": "Large-sample mean tests",
    "tags": [
      "hypothesis test",
      "z-test",
      "mean"
    ]
  },
  {
    "id": "t_test",
    "ch": 8,
    "name": "t Test (Mean)",
    "short": "t=(X̄−μ)/(s/√n)",
    "formula": "t = (X̄−μ₀)/(s/√n)  df=n−1",
    "desc": "Tests population mean when σ is unknown.",
    "use": "Most common mean test in practice",
    "tags": [
      "hypothesis test",
      "t-test",
      "mean"
    ]
  },
  {
    "id": "z_prop",
    "ch": 8,
    "name": "z Test (Proportion)",
    "short": "z=(p̂−p)/√(pq/n)",
    "formula": "z = (p̂−p₀)/√(p₀q₀/n)",
    "desc": "Tests whether population proportion equals p₀.",
    "use": "Testing claims about survey proportions",
    "tags": [
      "hypothesis test",
      "proportion"
    ]
  },
  {
    "id": "chi_var",
    "ch": 8,
    "name": "χ² Test (Variance)",
    "short": "χ²=(n−1)s²/σ²",
    "formula": "χ² = (n−1)s²/σ²  df=n−1",
    "desc": "Tests whether pop. variance equals hypothesized value.",
    "use": "Process quality tests",
    "tags": [
      "chi-square",
      "variance"
    ]
  },
  {
    "id": "z2mu",
    "ch": 9,
    "name": "z Test (2 Means)",
    "short": "z=(X̄₁−X̄₂)/√(σ²/n)",
    "formula": "z = [(X̄₁−X̄₂)]/√(σ₁²/n₁+σ₂²/n₂)",
    "desc": "Compares two independent means when σ known.",
    "use": "Large-sample two-group comparisons",
    "tags": [
      "two means",
      "z-test"
    ]
  },
  {
    "id": "t2mu",
    "ch": 9,
    "name": "t Test (2 Means)",
    "short": "t=(X̄₁−X̄₂)/√(s²/n)",
    "formula": "t = [(X̄₁−X̄₂)]/√(s₁²/n₁+s₂²/n₂)",
    "desc": "Compares two independent means, σ unknown.",
    "use": "Comparing two groups in experiments",
    "tags": [
      "two means",
      "t-test"
    ]
  },
  {
    "id": "t_dep",
    "ch": 9,
    "name": "t Test (Dependent)",
    "short": "t=D̄/(sD/√n)",
    "formula": "t = (D̄−μD)/(sD/√n)  df=n−1",
    "desc": "Paired-sample t-test for before/after designs.",
    "use": "Pre/post studies, matched pairs",
    "tags": [
      "paired",
      "dependent",
      "t-test"
    ]
  },
  {
    "id": "d_bar",
    "ch": 9,
    "name": "Mean of Differences",
    "short": "D̄=ΣD/n",
    "formula": "D̄ = ΣD/n",
    "desc": "Average of paired differences.",
    "use": "Paired t-test computation",
    "tags": [
      "paired",
      "differences"
    ]
  },
  {
    "id": "sd_dep",
    "ch": 9,
    "name": "SD of Differences",
    "short": "sD=√[...]",
    "formula": "sD = √{[nΣD²−(ΣD)²]/[n(n−1)]}",
    "desc": "Standard deviation of paired differences.",
    "use": "Paired t-test denominator",
    "tags": [
      "paired",
      "differences",
      "SD"
    ]
  },
  {
    "id": "z2p",
    "ch": 9,
    "name": "z Test (2 Proportions)",
    "short": "z=(p̂₁−p̂₂)/√(p̄q̄…)",
    "formula": "z = (p̂₁−p̂₂)/√[p̄q̄(1/n₁+1/n₂)]",
    "desc": "Tests equality of two proportions using pooled p̄.",
    "use": "Comparing success rates across two groups",
    "tags": [
      "two proportions",
      "z-test"
    ]
  },
  {
    "id": "f_test",
    "ch": 9,
    "name": "F Test (2 Variances)",
    "short": "F=s₁²/s₂²",
    "formula": "F = s₁²/s₂²  (larger s² in numerator)",
    "desc": "Tests equality of two population variances.",
    "use": "Prerequisite for equal/unequal variance t-test",
    "tags": [
      "F-test",
      "variance"
    ]
  },
  {
    "id": "pearson",
    "ch": 10,
    "name": "Pearson r",
    "short": "r=[nΣxy−(Σx)(Σy)]/√[...]",
    "formula": "r = [nΣxy−(Σx)(Σy)]/√{[nΣx²−(Σx)²][nΣy²−(Σy)²]}",
    "desc": "Measures strength and direction of linear relationship.",
    "use": "Correlation analysis, predicting regression usefulness",
    "tags": [
      "correlation",
      "Pearson"
    ]
  },
  {
    "id": "t_r",
    "ch": 10,
    "name": "t Test for r",
    "short": "t=r√[(n−2)/(1−r²)]",
    "formula": "t = r·√[(n−2)/(1−r²)]  df=n−2",
    "desc": "Tests whether population correlation ρ ≠ 0.",
    "use": "Determining if correlation is statistically significant",
    "tags": [
      "t-test",
      "correlation"
    ]
  },
  {
    "id": "reg",
    "ch": 10,
    "name": "Regression Line",
    "short": "y'=a+bx",
    "formula": "y'=a+bx  b=[nΣxy−(Σx)(Σy)]/[nΣx²−(Σx)²]",
    "desc": "Line of best fit minimizing squared residuals.",
    "use": "Prediction, forecasting, trend analysis",
    "tags": [
      "regression",
      "prediction",
      "slope"
    ]
  },
  {
    "id": "r2",
    "ch": 10,
    "name": "Coeff. of Determination",
    "short": "r²",
    "formula": "r² = explained variation / total variation",
    "desc": "Percentage of variation in y explained by x.",
    "use": "Model evaluation, comparing regression models",
    "tags": [
      "r-squared",
      "model fit"
    ]
  },
  {
    "id": "se_est",
    "ch": 10,
    "name": "Std Error of Estimate",
    "short": "sₑ=√[Σ(y−y')²/(n−2)]",
    "formula": "sₑ = √[Σ(y−y')²/(n−2)]",
    "desc": "Measures average prediction error of regression.",
    "use": "Prediction intervals, judging accuracy",
    "tags": [
      "standard error",
      "regression"
    ]
  },
  {
    "id": "pred_int",
    "ch": 10,
    "name": "Prediction Interval",
    "short": "y'±t·sₑ·√[...]",
    "formula": "y'±t_{α/2}·sₑ·√[1+1/n+n(x−X̄)²/(nΣx²−(Σx)²)]",
    "desc": "Interval for a SINGLE future y value.",
    "use": "Individual prediction with uncertainty",
    "tags": [
      "prediction interval",
      "regression"
    ]
  },
  {
    "id": "chi_gof",
    "ch": 11,
    "name": "χ² Goodness of Fit",
    "short": "χ²=Σ(O−E)²/E",
    "formula": "χ² = Σ(O−E)²/E  df=k−1",
    "desc": "Tests whether observed frequencies match hypothesized distribution.",
    "use": "Testing if data follow a given distribution",
    "tags": [
      "chi-square",
      "goodness of fit"
    ]
  },
  {
    "id": "chi_ind",
    "ch": 11,
    "name": "χ² Independence",
    "short": "χ²=Σ(O−E)²/E",
    "formula": "χ² = Σ(O−E)²/E  df=(r−1)(c−1)",
    "desc": "Tests independence of two categorical variables.",
    "use": "Association studies, contingency tables",
    "tags": [
      "chi-square",
      "independence"
    ]
  },
  {
    "id": "exp_cell",
    "ch": 11,
    "name": "Expected Cell",
    "short": "E=(row·col)/n",
    "formula": "E = (Row Sum × Column Sum)/Grand Total",
    "desc": "Expected frequency if variables were independent.",
    "use": "Required for all chi-square tests",
    "tags": [
      "expected frequency",
      "chi-square"
    ]
  },
  {
    "id": "grand_mn",
    "ch": 12,
    "name": "Grand Mean",
    "short": "X̄GM=ΣX/N",
    "formula": "X̄_GM = ΣX/N",
    "desc": "Overall mean across all groups.",
    "use": "ANOVA between-group variance computation",
    "tags": [
      "grand mean",
      "ANOVA"
    ]
  },
  {
    "id": "anova_f",
    "ch": 12,
    "name": "F Ratio (ANOVA)",
    "short": "F=s²B/s²W",
    "formula": "F = s²_Between/s²_Within",
    "desc": "Ratio of between-group to within-group variance.",
    "use": "One-way ANOVA, comparing 3+ group means",
    "tags": [
      "F-ratio",
      "ANOVA"
    ]
  },
  {
    "id": "s2_b",
    "ch": 12,
    "name": "Between-Group Var",
    "short": "s²B=Σnᵢ(X̄ᵢ−X̄GM)²/(k−1)",
    "formula": "s²_B = Σnᵢ(X̄ᵢ−X̄_GM)²/(k−1)",
    "desc": "Mean square between groups.",
    "use": "Numerator of F ratio",
    "tags": [
      "between groups",
      "ANOVA"
    ]
  },
  {
    "id": "s2_w",
    "ch": 12,
    "name": "Within-Group Var",
    "short": "s²W=Σ(nᵢ−1)sᵢ²/…",
    "formula": "s²_W = Σ(nᵢ−1)sᵢ²/Σ(nᵢ−1)",
    "desc": "Mean square within groups (pooled variance).",
    "use": "Denominator of F ratio",
    "tags": [
      "within groups",
      "ANOVA"
    ]
  },
  {
    "id": "scheffe",
    "ch": 12,
    "name": "Scheffé Test",
    "short": "Fs=(X̄ᵢ−X̄ⱼ)²/s²W(…)",
    "formula": "Fs=(X̄ᵢ−X̄ⱼ)²/[s²_W(1/nᵢ+1/nⱼ)]",
    "desc": "Post-hoc test for pairwise comparisons (unequal n).",
    "use": "After significant ANOVA, unequal n",
    "tags": [
      "post-hoc",
      "Scheffé"
    ]
  },
  {
    "id": "tukey",
    "ch": 12,
    "name": "Tukey Test",
    "short": "q=(X̄ᵢ−X̄ⱼ)/√(s²W/n)",
    "formula": "q = (X̄ᵢ−X̄ⱼ)/√(s²_W/n)",
    "desc": "Post-hoc test, more powerful for equal n.",
    "use": "After significant ANOVA, equal n",
    "tags": [
      "post-hoc",
      "Tukey"
    ]
  },
  {
    "id": "anova2",
    "ch": 12,
    "name": "Two-Way ANOVA",
    "short": "FA=MSA/MSW",
    "formula": "FA=MSA/MSW  FB=MSB/MSW  FA×B=MSA×B/MSW",
    "desc": "Tests effects of two factors and their interaction.",
    "use": "Factorial experiments",
    "tags": [
      "two-way ANOVA",
      "interaction"
    ]
  },
  {
    "id": "sign_z",
    "ch": 13,
    "name": "Sign Test (z)",
    "short": "z=[(X+0.5)−0.5n]/(√n/2)",
    "formula": "z = [(X+0.5)−0.5n]/(√n/2)  (n≥26)",
    "desc": "Nonparametric test for median using signs.",
    "use": "Alternative to t-test for non-normal data",
    "tags": [
      "sign test",
      "nonparametric"
    ]
  },
  {
    "id": "wrs",
    "ch": 13,
    "name": "Wilcoxon Rank Sum",
    "short": "z=(W−μW)/σW",
    "formula": "z=(W−μ_W)/σ_W  μ_W=n₁(n₁+n₂+1)/2",
    "desc": "Nonparametric alternative to independent t-test.",
    "use": "Two independent groups, normality fails",
    "tags": [
      "Wilcoxon",
      "rank sum",
      "nonparametric"
    ]
  },
  {
    "id": "wsrt",
    "ch": 13,
    "name": "Wilcoxon Signed-Rank",
    "short": "ws (signed ranks)",
    "formula": "Compute ws = sum of signed ranks; use T statistic",
    "desc": "Nonparametric alternative to paired t-test.",
    "use": "Paired data, normality fails",
    "tags": [
      "Wilcoxon",
      "signed-rank",
      "nonparametric"
    ]
  },
  {
    "id": "kw",
    "ch": 13,
    "name": "Kruskal-Wallis",
    "short": "H=[12/N(N+1)]ΣR²/n−3(N+1)",
    "formula": "H=[12/(N(N+1))]·Σ(Rᵢ²/nᵢ)−3(N+1)",
    "desc": "Nonparametric alternative to one-way ANOVA.",
    "use": "3+ groups, normality fails",
    "tags": [
      "Kruskal-Wallis",
      "nonparametric"
    ]
  },
  {
    "id": "spear",
    "ch": 13,
    "name": "Spearman rₛ",
    "short": "rs=1−6ΣD²/[n(n²−1)]",
    "formula": "rₛ = 1−[6ΣD²]/[n(n²−1)]",
    "desc": "Nonparametric correlation using ranks.",
    "use": "Ordinal data, non-linear monotonic relationships",
    "tags": [
      "Spearman",
      "rank correlation",
      "nonparametric"
    ]
  },
  {
    "id": "runs",
    "ch": 13,
    "name": "Runs Test",
    "short": "z=(G−μG)/σG",
    "formula": "z=(G−μ_G)/σ_G  μ_G=2n₁n₂/(n₁+n₂)+1",
    "desc": "Tests randomness of a sequence.",
    "use": "Detecting patterns, testing random order",
    "tags": [
      "runs test",
      "randomness",
      "nonparametric"
    ]
  },
  {
    "id": "sim_mean",
    "ch": 14,
    "name": "Simulation Mean",
    "short": "X̄=ΣX/n",
    "formula": "X̄ = ΣX/n  (from simulation trials)",
    "desc": "Empirical mean after Monte Carlo simulation.",
    "use": "Monte Carlo output, verifying E(X)",
    "tags": [
      "Monte Carlo",
      "simulation",
      "mean"
    ]
  },
  {
    "id": "mc_prob",
    "ch": 14,
    "name": "Monte Carlo P(E)",
    "short": "P(E)≈f/n",
    "formula": "P(E) ≈ f/n  (f=times event occurred, n=trials)",
    "desc": "Empirical probability from random simulation.",
    "use": "Approximating complex probabilities",
    "tags": [
      "Monte Carlo",
      "simulation"
    ]
  },
  {
    "id": "mc_steps",
    "ch": 14,
    "name": "Monte Carlo Steps",
    "short": "5-Step Procedure",
    "formula": "(1)List→(2)Assign P→(3)Map digits→(4)Sample→(5)Compute",
    "desc": "The complete 5-step Monte Carlo procedure.",
    "use": "Simulating any probabilistic experiment",
    "tags": [
      "Monte Carlo",
      "procedure"
    ]
  }
];

export const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));
