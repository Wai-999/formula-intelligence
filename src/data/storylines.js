export const STORYLINES = [
  {
    "id": "health",
    "icon": "🏥",
    "title": "Public Health Analyst",
    "sub": "WHO Air Quality & Lung Disease Study",
    "intro": "You work for the World Health Organization. A new dataset links PM2.5 air pollution to lung disease rates across 45 cities. Build the full statistical case from raw data to policy recommendation.",
    "steps": [
      {
        "title": "The Data Arrives",
        "chapter": 2,
        "narrative": "Your dataset has PM2.5 readings (µg/m³) and lung disease rates for 45 cities. Before any analysis, organize the raw numbers.",
        "nodeIds": [
          "pct",
          "cwidth"
        ],
        "realData": {
          "n": 45,
          "PM2.5 range": "2-89 µg/m³",
          "shape": "right-skewed",
          "outliers": "3 cities above 80"
        },
        "interpretation": "Clustering around 40-50 µg/m³. Right skew means the mean will be pulled high by extreme cities.",
        "question": "PM2.5 ranges from 2 to 89 µg/m³. Best first step?",
        "choices": [
          "Start a t-test immediately",
          "Build a frequency distribution with class intervals",
          "Compute a confidence interval",
          "Run a chi-square test"
        ],
        "correct": 1,
        "hint": "What do you need to understand about the SHAPE and OUTLIERS in your data before running any test?",
        "explanation": "Without organizing data first, any test is premature. A frequency distribution reveals shape and spread — you cannot see a distribution you have not measured.",
        "outcome": "Your frequency table shows clustering around 40-50 µg/m³ with right skew. Three cities are extreme outliers. Now you need summary statistics.",
        "analystNote": "Before I touch any inferential statistics, I need to understand the DATA. Garbage in, garbage out. I have seen studies fail because researchers jumped straight to tests without looking at their data first."
      },
      {
        "title": "Describing the Distribution",
        "chapter": 3,
        "narrative": "Your supervisor asks: \"Give me two numbers summarizing PM2.5 exposure.\" You need a center and spread for your sample of 45 cities.",
        "nodeIds": [
          "x_bar",
          "samp_sd"
        ],
        "realData": {
          "n": 45,
          "X̄": "44.2 µg/m³",
          "s": "18.7 µg/m³",
          "WHO safe limit": "5 µg/m³"
        },
        "interpretation": "Sample mean is 8.8 times above WHO guidelines. High SD signals extreme variability across cities.",
        "question": "You have n=45 cities and σ is unknown. Which pair of statistics applies?",
        "choices": [
          "μ and σ (population parameters)",
          "X̄ and s (sample statistics)",
          "μ and s (mixed)",
          "X̄ and σ (mixed)"
        ],
        "correct": 1,
        "hint": "These 45 cities are selected from all cities in the world. Are they ALL the cities that exist?",
        "explanation": "These 45 cities are a SAMPLE from all cities worldwide. You use X̄ and s — sample statistics. Using μ and σ would falsely claim you measured the entire population.",
        "outcome": "X̄ = 44.2 µg/m³, s = 18.7. WHO guidelines say below 5. Now standardize an extreme outlier city.",
        "analystNote": "Always ask: sample or population? In almost every real study it is a sample. Using population formulas is a statistical error that overstates your certainty — and in policy work, certainty claims have real consequences."
      },
      {
        "title": "The Delhi Problem",
        "chapter": 3,
        "narrative": "Delhi shows PM2.5 = 156 µg/m³. Your team argues about excluding it. You need an objective measure to place this number in context.",
        "nodeIds": [
          "zscore"
        ],
        "realData": {
          "X (Delhi)": "156 µg/m³",
          "X̄": "44.2",
          "s": "18.7",
          "z": "5.98"
        },
        "interpretation": "z = 5.98 means Delhi is nearly 6 standard deviations above the mean. In a normal distribution, fewer than 1 in a billion values fall this far out.",
        "question": "z = (156 − 44.2)/18.7 = 5.98. What does this mean?",
        "choices": [
          "Delhi is 5.98 units above average",
          "Delhi is 5.98 standard deviations above the mean",
          "Delhi has 5.98× more pollution",
          "5.98% of cities are worse"
        ],
        "correct": 1,
        "hint": "A z-score measures distance from the mean — but in what UNITS?",
        "explanation": "z-scores measure distance in standard deviation units — a universal language. z = 5.98 is catastrophically extreme; in a normal distribution fewer than 1 in a billion values fall this far out.",
        "outcome": "Delhi confirmed as outlier (|z| > 3). You analyze with and without it. Now connect exposure to disease rates.",
        "analystNote": "This is exactly why z-scores exist. \"156 µg/m³\" alone means nothing to a policymaker. \"5.98 standard deviations above average\" communicates severity immediately — in a language any educated person can grasp."
      },
      {
        "title": "Building the Bridge",
        "chapter": 10,
        "narrative": "Do cities with higher PM2.5 have higher lung disease rates? Before regression, quantify the linear relationship.",
        "nodeIds": [
          "pearson"
        ],
        "realData": {
          "r": "0.74",
          "n": 45,
          "p": "<0.001",
          "r²": "0.55"
        },
        "interpretation": "Strong positive correlation: about 55% of disease rate variability is associated with PM2.5 levels.",
        "question": "r = 0.74 between PM2.5 and disease rate. What can you conclude?",
        "choices": [
          "PM2.5 causes lung disease (proven)",
          "Strong positive association — higher pollution correlates with higher disease",
          "Cities with high PM2.5 must also be richer",
          "0.74 is too low to matter"
        ],
        "correct": 1,
        "hint": "Correlation shows two things move together. What else could cause BOTH PM2.5 and disease rates to be high?",
        "explanation": "Correlation r = 0.74 shows a strong positive relationship but NOT causation. A confounding variable (income, healthcare) could explain this. Regression lets you predict; causation requires experimental evidence.",
        "outcome": "r = 0.74, p < 0.001. Significant. Now build a predictive model for policymakers.",
        "analystNote": "Every analyst must say this before publishing: correlation is not causation. r = 0.74 is compelling evidence of association — and completely insufficient to recommend pollution-reduction policy without ruling out confounders."
      },
      {
        "title": "The Prediction Model",
        "chapter": 10,
        "narrative": "WHO wants to predict lung disease rate from PM2.5. Build a regression model and evaluate how much variability it explains.",
        "nodeIds": [
          "reg",
          "r2"
        ],
        "realData": {
          "equation": "Rate = 0.8 + 0.043 × PM2.5",
          "r²": "0.55",
          "unexplained": "45%"
        },
        "interpretation": "For every 10 µg/m³ increase in PM2.5, disease rate rises by 0.43 units on average.",
        "question": "r² = 0.55. What does this tell policymakers?",
        "choices": [
          "55% of cities have disease rates explained by pollution",
          "PM2.5 explains 55% of the variance in disease rates",
          "The model is 55% accurate",
          "55% of disease is caused by PM2.5"
        ],
        "correct": 1,
        "hint": "r² = r × r. Think about what fraction of Y-variability is accounted for by X — and what fraction is NOT.",
        "explanation": "r² is the coefficient of determination: 55% of variability in disease rates is statistically explained by PM2.5 differences. The remaining 45% is other factors — healthcare quality, smoking rates, demographics.",
        "outcome": "Disease Rate = 0.8 + 0.043 × PM2.5. Need to formally test significance before publishing.",
        "analystNote": "Responsible reporting means quantifying what you do NOT explain. r² = 0.55 means 45% is other factors. I name those factors explicitly rather than letting readers assume PM2.5 explains everything."
      },
      {
        "title": "The Hypothesis Test",
        "chapter": 8,
        "narrative": "Before publishing, test whether mean PM2.5 significantly exceeds WHO guidelines.",
        "nodeIds": [
          "z_test",
          "t_test"
        ],
        "realData": {
          "X̄": "44.2 µg/m³",
          "s": "18.7",
          "n": 45,
          "H₀: μ₀": "5 µg/m³ (WHO limit)",
          "result": "t = 18.6, p < 0.0001"
        },
        "interpretation": "Mean PM2.5 is catastrophically above guidelines regardless of which test is chosen.",
        "question": "Your sample has n=45, σ unknown. Which test for the mean?",
        "choices": [
          "z-test (σ known or large n)",
          "t-test (σ unknown, n−1 df)",
          "Chi-square test",
          "F-test"
        ],
        "correct": 1,
        "hint": "Was σ measured directly from historical records of all cities, or was it estimated from this sample of 45?",
        "explanation": "σ is estimated by s in this study. Even though n=45 is large (t and z converge for large n), the technically correct choice is the t-test with n−1=44 degrees of freedom.",
        "outcome": "t = 18.6, p < 0.0001. Mean PM2.5 is catastrophically above guidelines. Now compare high vs low income cities.",
        "analystNote": "Even with n=45 where t and z give nearly identical results, I use t when σ is estimated. It is not about precision — it is about intellectual honesty. Using z when you estimated σ overstates certainty."
      },
      {
        "title": "Rich vs. Poor Cities",
        "chapter": 9,
        "narrative": "Split 45 cities into two income groups and compare mean PM2.5.",
        "nodeIds": [
          "t2mu",
          "f_test"
        ],
        "realData": {
          "n1": 22,
          "n2": 23,
          "groups": "low-income vs high-income",
          "F": "1.8",
          "F p-value": "0.12"
        },
        "interpretation": "F-test non-significant: equal variances confirmed. Pooled t-test is appropriate.",
        "question": "Before the two-sample t-test, what must you check?",
        "choices": [
          "That both n > 30",
          "That both populations have equal (or verified unequal) variances — use the F-test first",
          "That samples are from the same country",
          "That the means are normally distributed"
        ],
        "correct": 1,
        "hint": "The two-sample t-test exists in two forms. Which form you use depends on what you test first.",
        "explanation": "The two-sample t-test has two forms: pooled (equal variance) and Welch (unequal variance). You test equality first with the F-test. If F is not significant, use pooled; otherwise use Welch.",
        "outcome": "F not significant → pooled t-test. t = 4.2, p < 0.001. Low-income cities have significantly higher PM2.5.",
        "analystNote": "The F-test before a two-sample t-test is the check I never skip. Using the wrong variance assumption can give the right direction but wrong p-value — and in regulatory work, wrong p-values can destroy the entire evidence base."
      },
      {
        "title": "The Policy Report",
        "chapter": 7,
        "narrative": "Present a confidence interval for the mean difference between income groups.",
        "nodeIds": [
          "t_ci",
          "ci_mean_t"
        ],
        "realData": {
          "95% CI for difference": "(8.2, 24.6) µg/m³",
          "interpretation": "excludes zero"
        },
        "interpretation": "The interval excludes zero: a statistically significant income-pollution gap is confirmed.",
        "question": "Your 95% CI for mean difference is (8.2, 24.6) µg/m³. How do you interpret this?",
        "choices": [
          "\"95% of cities fall in this range\"",
          "\"We are 95% confident the true mean difference between income groups is between 8.2 and 24.6 µg/m³\"",
          "\"There is a 95% chance the true mean is in this range\"",
          "\"The test was 95% accurate\""
        ],
        "correct": 1,
        "hint": "If you repeated this study 100 times, how many of the resulting CIs would contain the true parameter?",
        "explanation": "A CI is about the METHOD: if we repeated this sampling process 100 times, ~95% of the resulting intervals would contain the true parameter. The 95% refers to the procedure, not this specific interval.",
        "outcome": "Report complete. Your analysis gives WHO quantified, defensible evidence linking income, air quality, and health outcomes. 🌍",
        "analystNote": "The CI misinterpretation is the most common mistake in policy reports. \"95% probability the true mean is in this range\" is WRONG — the true mean is a fixed constant, not a random variable. Always phrase it: \"we are 95% confident,\" never \"95% probable.\""
      }
    ]
  },
  {
    "id": "business",
    "icon": "📊",
    "title": "Business Intelligence Analyst",
    "sub": "E-Commerce Sales Drop Investigation",
    "intro": "Your company's online sales dropped 12% last quarter. The board wants answers in 48 hours. Use statistics to diagnose why.",
    "steps": [
      {
        "title": "Quantifying the Drop",
        "chapter": 3,
        "narrative": "You pull 52 weeks of sales data. Before blaming anything, you need to know: is this drop real or just normal variation?",
        "nodeIds": [
          "x_bar",
          "samp_sd"
        ],
        "realData": {
          "weeks": 52,
          "X̄": "$2.1M",
          "s": "$180K",
          "drop": "$252K (~1.4 SDs)"
        },
        "interpretation": "The 2-sigma heuristic suggests borderline significance. A formal test is required to assign a precise probability.",
        "question": "X̄=$2.1M, s=$180K. The drop was $252K (~1.4s). Is this significant?",
        "choices": [
          "Yes — it is within 2 standard deviations, so it is normal",
          "No — use a formal hypothesis test, not a rough rule",
          "Yes — 12% is always trivial",
          "No — any drop is always significant in business"
        ],
        "correct": 1,
        "hint": "The 2-sigma rule is a heuristic. What gives you a precise probability for observing this drop by chance?",
        "explanation": "The 2-sigma rule is a heuristic, not a test. Proper inference requires H₀: μ = previous mean. Only then can you assign a precise probability to observing this drop by chance.",
        "outcome": "X̄=$2.1M, s=$180K. Preliminary: drop is possibly significant. Need a formal test and root cause analysis.",
        "analystNote": "In a board presentation, informal rules do not survive cross-examination. I need to frame every conclusion in terms of probability and confidence intervals — not intuition — or the CFO will dismantle the argument in 30 seconds."
      },
      {
        "title": "Before vs. After",
        "chapter": 9,
        "narrative": "Compare the same weeks pre-drop (weeks 1-39) vs post-drop (weeks 40-52). Same stores, same customer base — a natural paired design.",
        "nodeIds": [
          "t_dep",
          "d_bar",
          "sd_dep"
        ],
        "realData": {
          "D̄": "−$248K",
          "s_D": "$183K",
          "n": 13,
          "t": "−3.8",
          "p": "0.002"
        },
        "interpretation": "The drop is statistically real. It is systematic across stores, not random noise.",
        "question": "Why use a PAIRED t-test rather than a regular two-sample t-test?",
        "choices": [
          "Because n < 30 in both groups",
          "Because the same weeks/stores are measured twice — pairing controls for between-store differences",
          "Because the data is ordinal",
          "Because σ is known"
        ],
        "correct": 1,
        "hint": "What structural difference does pairing eliminate — something a two-sample test cannot remove?",
        "explanation": "Pairing controls for between-store variability. If Store A always sells 3× more than Store B, that structural difference disappears when you compute differences. The paired t-test tests only the CHANGE.",
        "outcome": "D̄ = −$248K, t = −3.8, p = 0.002. The drop is statistically real. Now find the cause.",
        "analystNote": "Pairing is a design decision, not just a statistical choice. By measuring the same stores before and after, I eliminate noise from \"Store A is always bigger than Store B.\" The only signal remaining is the actual change — exactly what I need to diagnose."
      },
      {
        "title": "The Marketing Hypothesis",
        "chapter": 10,
        "narrative": "Marketing cut ad spend 35% in week 38. Does ad spend correlate with weekly sales?",
        "nodeIds": [
          "pearson",
          "t_r"
        ],
        "realData": {
          "r": "0.82",
          "n": 52,
          "t": "10.1",
          "p": "<0.001",
          "r²": "0.67"
        },
        "interpretation": "Ad spend explains 67% of weekly sales variability — a strong, significant predictive relationship.",
        "question": "r = 0.82 between ad spend and sales (n=52). Is this significant?",
        "choices": [
          "Yes — r > 0.8 is always significant",
          "Use the t-test for r: t = r√(n−2)/(1−r²). Calculate p-value.",
          "No — n=52 is too small for correlation",
          "Yes — any r above 0.5 is significant"
        ],
        "correct": 1,
        "hint": "With n=5 and r=0.82, p would be 0.09 — not significant. Does the strength of r alone determine significance?",
        "explanation": "The strength of a correlation is not its statistical significance. You test H₀: ρ=0 using t = r√(n−2)/(1−r²). With n=52, t=10.1, p<0.001 — highly significant.",
        "outcome": "r=0.82, p<0.001. Strong evidence ad spend drives sales. Now quantify with regression.",
        "analystNote": "Analysts make this mistake constantly: they see r=0.82 and declare it strong without testing significance. Always test r. And note: significance depends on BOTH the size of r AND the sample size."
      },
      {
        "title": "The Forecasting Model",
        "chapter": 10,
        "narrative": "Build a regression model to predict what sales will recover to if ad spend is restored.",
        "nodeIds": [
          "reg",
          "se_est",
          "pred_int"
        ],
        "realData": {
          "a": "$1.2M",
          "b": "1.1 per $1 ad spend",
          "x": "$800K",
          "predicted": "$2.08M",
          "PI": "[$1.74M - $2.42M]"
        },
        "interpretation": "Prediction interval is wide — individual weeks are highly variable around the regression line.",
        "question": "To predict sales for ONE SPECIFIC future week, which interval?",
        "choices": [
          "Confidence interval for mean response",
          "Prediction interval (wider — accounts for individual week variability)",
          "Both are identical",
          "Standard error of estimate alone"
        ],
        "correct": 1,
        "hint": "Are you estimating the AVERAGE of many future weeks, or the sales for ONE specific upcoming week?",
        "explanation": "A CI for mean response estimates the average of many future weeks. A prediction interval estimates ONE specific week — which must account for individual-week variability on top of regression uncertainty. Always wider.",
        "outcome": "y' = $1.2M + 1.1×ad_spend. Predicted recovery: $2.08M [PI: $1.74M-$2.42M]. Wide range warns against false precision.",
        "analystNote": "If I present the CI as the predicted range for next week, I am understating uncertainty. The PI is always wider and always the honest choice for individual predictions. A narrow-looking CI on a board slide creates false confidence."
      },
      {
        "title": "Regional Breakdown",
        "chapter": 12,
        "narrative": "Test whether the sales drop is equal across all 5 regional stores.",
        "nodeIds": [
          "anova_f",
          "s2_b",
          "s2_w"
        ],
        "realData": {
          "k": 5,
          "F": "8.3",
          "df": "4 and 45",
          "p": "0.003"
        },
        "interpretation": "At least one region is performing significantly differently. ANOVA identified the signal; post-hoc tests will find the source.",
        "question": "Why use ANOVA instead of 10 separate t-tests comparing the 5 regions?",
        "choices": [
          "ANOVA is easier to compute",
          "Multiple t-tests inflate Type I error. ANOVA tests all groups simultaneously at one α",
          "ANOVA only works when n > 30",
          "ANOVA is always more powerful than t-tests"
        ],
        "correct": 1,
        "hint": "With α=0.05 and 10 tests, family-wise error = 1 − 0.95^10. What does that equal?",
        "explanation": "If you run 10 separate t-tests at α=0.05, family-wise error ≈ 1−(0.95)^10 = 40%. You would have a 40% chance of a false alarm. ANOVA controls the error rate across ALL comparisons simultaneously.",
        "outcome": "F=8.3, p=0.003. Significant regional differences exist. But WHICH regions differ?",
        "analystNote": "The multiple comparisons problem is why ANOVA exists. With 5 regions I could run 10 pairwise t-tests. At α=0.05, I would expect 0.5 false positives just by chance alone. ANOVA keeps the experiment-wise error rate at exactly α."
      },
      {
        "title": "Post-Hoc: Finding the Culprit",
        "chapter": 12,
        "narrative": "ANOVA confirmed at least one region differs. Use a post-hoc test to identify which pairs differ while controlling family-wise error.",
        "nodeIds": [
          "tukey",
          "scheffe"
        ],
        "realData": {
          "groups": 5,
          "pairs": 10,
          "alpha (family-wise)": "0.05",
          "finding": "Region 4 (North) significantly lower"
        },
        "interpretation": "Region 4 underperforms Regions 1, 2, and 3. A competitor opened nearby in week 38.",
        "question": "All 5 regions have equal sample sizes. Which post-hoc test is most appropriate?",
        "choices": [
          "Scheffé (more conservative, for unequal n)",
          "Tukey HSD (more powerful when n is equal across groups)",
          "Another ANOVA",
          "Simple t-test between each pair"
        ],
        "correct": 1,
        "hint": "Scheffé works for any comparison type and unequal n. What was Tukey specifically designed for?",
        "explanation": "Tukey's HSD is optimal for equal group sizes — it maximizes power while controlling family-wise error. Scheffé is better for unequal sizes or complex contrasts beyond pairwise comparisons.",
        "outcome": "Tukey: Region 4 (North) significantly underperforms. Investigation reveals a competitor opened in week 38. Case solved.",
        "analystNote": "Scheffé is the Swiss Army knife — works for any comparison, equal or unequal n. But that generality costs power. When I need simple pairwise comparisons with equal n, Tukey is the sharper tool and I always reach for it first."
      },
      {
        "title": "Complaint Pattern Check",
        "chapter": 11,
        "narrative": "Customer complaints rose 20%. Test whether complaint categories (Shipping/Product/Service) are independent of region.",
        "nodeIds": [
          "chi_ind",
          "exp_cell"
        ],
        "realData": {
          "table": "3 types × 5 regions",
          "n": 247,
          "result (merged)": "χ²=12.4, df=8, p=0.13"
        },
        "interpretation": "No significant regional pattern. The complaint increase was uniform — consistent with the competitor disruption explanation.",
        "question": "Your 3×5 contingency table has some expected cells E < 5. What should you do?",
        "choices": [
          "Proceed with chi-square as normal",
          "Merge small categories or use Fishers exact test — chi-square requires E ≥ 5",
          "Increase α to 0.10",
          "Use a t-test instead"
        ],
        "correct": 1,
        "hint": "Chi-square uses an approximation that requires a minimum expected cell count. What is that minimum?",
        "explanation": "Chi-square relies on an approximation that requires expected frequencies ≥ 5 per cell. With smaller cells the approximation breaks down. Solutions: combine thin categories, use Fisher's exact test, or collect more data.",
        "outcome": "After merging: χ²=12.4, df=8, p=0.13. No significant regional pattern. Complaint increase was uniform. 📋",
        "analystNote": "This is the check that separates careful analysts from reckless ones. I always compute expected frequencies before running chi-square. Small cells make the test anti-conservative — it finds patterns that do not exist in the population."
      },
      {
        "title": "Board Presentation",
        "chapter": 7,
        "narrative": "Present three key confidence intervals to the board: current mean sales, effect of ad spend, and expected recovery.",
        "nodeIds": [
          "t_ci",
          "ci_mean_t"
        ],
        "realData": {
          "CI (current mean sales)": "[$1.87M, $2.33M]",
          "CI (projected recovery)": "[$1.95M, $2.21M]"
        },
        "interpretation": "The recovery CI overlaps with current CI — improvement is plausible but not guaranteed by the numbers.",
        "question": "The board asks: \"Are you 95% SURE the true mean is in this interval?\" Your answer:",
        "choices": [
          "\"Yes, I am 95% certain.\"",
          "\"The method captures the true mean 95% of the time. I cannot say this specific interval contains it — only that the method works 95% of the time.\"",
          "\"There is a 95% probability the true mean is in this range.\"",
          "\"Yes, if the sample is representative.\""
        ],
        "correct": 1,
        "hint": "The true mean is a fixed constant. Can probability apply to something that is fixed (not random)?",
        "explanation": "Frequentist CIs are about the PROCEDURE, not the specific interval. The true mean is either in this interval or not — probability does not apply to fixed values. The 95% refers to the long-run frequency of the method.",
        "outcome": "Board accepts the analysis. Decision: restore ad spend in all regions except Region 4. 🏆",
        "analystNote": "This is where I push back on clients who want more certainty than the data gives. \"95% confident\" is a specific technical claim — the method works 95% of the time. Overselling certainty gets analysts fired when reality does not match the promise."
      }
    ]
  },
  {
    "id": "social",
    "icon": "🎓",
    "title": "Social Science Researcher",
    "sub": "Social Media Use & Student GPA Study",
    "intro": "You are studying whether daily social media use affects university student GPA. Dataset: 120 students, self-reported daily screen time (hours), and cumulative GPA.",
    "steps": [
      {
        "title": "Measuring the Unmeasurable",
        "chapter": 3,
        "narrative": "GPA and screen time have very different scales. Before comparing them, you need a common language.",
        "nodeIds": [
          "zscore",
          "pctile"
        ],
        "realData": {
          "GPA": "3.7 (class mean 3.1, s=0.4)",
          "screen time": "2 hrs/day (class mean 5, s=1.8)",
          "z_GPA": "+1.5",
          "z_screen": "−1.67"
        },
        "interpretation": "Screen time is more extreme: z = −1.67 vs z = +1.5. This student is unusually low on screen time AND unusually high on GPA.",
        "question": "Student GPA=3.7 (mean 3.1, s=0.4). Screen=2 hrs (mean 5, s=1.8). Who stands out more?",
        "choices": [
          "The GPA student — 3.7 is a high absolute number",
          "Compute z-scores: z_GPA=+1.5; z_screen=−1.67. Screen time is more extreme.",
          "They are equally unusual",
          "Cannot compare — different units"
        ],
        "correct": 1,
        "hint": "z-scores remove units. What do they replace units with?",
        "explanation": "z-scores solve the unit problem by converting to standard deviations from the mean. GPA z=+1.5 (above average), Screen time z=−1.67 (well below average screen time). Now you can compare positions across any distribution.",
        "outcome": "Standardized data in hand. Now test the core hypothesis: is there a linear relationship between screen time and GPA?",
        "analystNote": "Comparing GPA and screen time is like comparing kilograms to kilometers — different units, different scales. z-scores give both variables the same currency: standard deviations from center. Now I can ask a meaningful question: which is more unusual?"
      },
      {
        "title": "Correlation or Coincidence?",
        "chapter": 10,
        "narrative": "You compute the correlation but notice GPA has mild skewness from students on academic probation.",
        "nodeIds": [
          "pearson",
          "spear"
        ],
        "realData": {
          "n": 120,
          "Spearman rs": "−0.41",
          "Pearson r": "−0.38",
          "note": "Spearman preferred due to skewness and outliers"
        },
        "interpretation": "Negative correlation: more daily screen time is associated with lower GPA. Direction consistent across both methods.",
        "question": "Data has mild skewness and outliers. Which correlation is more appropriate?",
        "choices": [
          "Pearson r — the gold standard",
          "Spearman rₛ — uses ranks, more robust to outliers and non-normality",
          "Both are always equally appropriate",
          "Neither — use ANOVA instead"
        ],
        "correct": 1,
        "hint": "Pearson r is sensitive to extreme values. What does Spearman do to data before computing correlation?",
        "explanation": "Pearson r assumes bivariate normality and is sensitive to outliers. Spearman rₛ converts values to ranks first — an outlier only shifts one rank instead of pulling the entire correlation. With skewed data and outliers, Spearman is the safer choice.",
        "outcome": "Spearman rₛ = −0.41. Negative correlation: more social media → lower GPA. But is this statistically significant?",
        "analystNote": "Spearman rs is my go-to when data has outliers or skewness. By converting to ranks, one extreme outlier shifts only one rank rather than distorting the entire correlation. It is not the weak test — it is the appropriate one when assumptions are violated."
      },
      {
        "title": "Testing the Correlation",
        "chapter": 10,
        "narrative": "rₛ = −0.41 with n=120. This could be chance. Formally test H₀: ρ=0.",
        "nodeIds": [
          "t_r"
        ],
        "realData": {
          "rs": "−0.41",
          "n": 120,
          "t": "−4.9",
          "df": 118,
          "p": "<0.0001"
        },
        "interpretation": "Highly significant. If true ρ=0, observing this correlation would occur fewer than 1 in 10,000 times.",
        "question": "t = rₛ√(n−2)/(1−rₛ²) = −4.9. What does this mean?",
        "choices": [
          "t=−4.9 means there is a 4.9% chance the correlation is real",
          "t=−4.9 corresponds to p<0.0001 with df=118 — highly significant",
          "Only z-tests are appropriate for correlation",
          "t < 0 means the test failed"
        ],
        "correct": 1,
        "hint": "A negative t-statistic just reflects the direction of the correlation. What does |t| = 4.9 tell you about the p-value?",
        "explanation": "With df=n−2=118, t=−4.9 has p<0.0001. If the true ρ were 0, observing rₛ=−0.41 would happen fewer than 1 in 10,000 times. The negative correlation is real — not a sample artifact.",
        "outcome": "p<0.0001. The relationship is solid. Now quantify it with a prediction equation.",
        "analystNote": "With n=10, r=−0.41 has p=0.24 — not significant. With n=120, the same r has p<0.0001. Statistical significance depends on BOTH the effect size and the sample size. Always test — never just report r."
      },
      {
        "title": "The Prediction Equation",
        "chapter": 10,
        "narrative": "Build a linear regression model and honestly assess how much screen time explains GPA variability.",
        "nodeIds": [
          "reg",
          "r2",
          "se_est"
        ],
        "realData": {
          "equation": "GPA = 3.68 − 0.11×(hours/day)",
          "r²": "0.17",
          "se_est": "0.37",
          "slope": "−0.11 per extra hour/day"
        },
        "interpretation": "Each additional hour per day of screen time predicts a 0.11 GPA decline.",
        "question": "r²=0.17. What does this mean for your claims?",
        "choices": [
          "The model is 17% accurate — it is useless",
          "Social media explains 17% of GPA variance. 83% is explained by other factors.",
          "17% of students follow the regression line",
          "17% probability the relationship is real"
        ],
        "correct": 1,
        "hint": "What fraction of GPA variability is NOT explained by screen time? Is 83% unexplained a problem?",
        "explanation": "r²=0.17 means social media accounts for 17% of GPA variability. The other 83% is study habits, prior preparation, course difficulty, health, etc. This is NOT a useless result — it means social media is ONE real factor among many.",
        "outcome": "GPA = 3.68 − 0.11×(screen hours). Each extra hour per day predicts a 0.11 GPA drop.",
        "analystNote": "In social science, r² = 0.17 is meaningful. Human behavior has hundreds of causes. Social media explaining 17% of GPA variability is a real, policy-relevant finding. The discipline to report honest effect sizes — even small ones — is what distinguishes rigorous researchers from advocates."
      },
      {
        "title": "Two Groups: Heavy vs Light Users",
        "chapter": 8,
        "narrative": "Categorize: heavy users (≥6 hrs/day, n=38) vs light users (<3 hrs/day, n=35). Compare the proportion achieving GPA ≥ 3.5.",
        "nodeIds": [
          "z_prop",
          "z2p"
        ],
        "realData": {
          "p̂₁ (heavy, n=38)": "0.24",
          "p̂₂ (light, n=35)": "0.54",
          "z": "−2.89",
          "p": "0.004"
        },
        "interpretation": "Heavy users are 30 percentage points less likely to achieve GPA ≥ 3.5.",
        "question": "p̂₁=0.24 (heavy) vs p̂₂=0.54 (light). Which test compares these proportions?",
        "choices": [
          "t-test for means",
          "Two-proportion z-test: z=(p̂₁−p̂₂)/√[p̄q̄(1/n₁+1/n₂)]",
          "Chi-square goodness of fit",
          "ANOVA F-test"
        ],
        "correct": 1,
        "hint": "You are comparing proportions of students achieving a threshold — not comparing mean GPA scores.",
        "explanation": "When comparing two proportions from independent samples, the two-proportion z-test is correct. The pooled proportion p̄ estimates the common proportion under H₀. The t-test is for means, not proportions.",
        "outcome": "z=−2.89, p=0.004. Heavy users are significantly less likely to achieve GPA ≥ 3.5.",
        "analystNote": "The pooled proportion p̄ under H₀ assumes both groups share the same true proportion. This is the null hypothesis made concrete: I am computing exactly what the world looks like IF screen time has no effect on high-GPA rates."
      },
      {
        "title": "Type of Use Matters",
        "chapter": 11,
        "narrative": "Survey heavy users: 25 use entertainment apps, 13 use educational apps. Test whether GPA distributions differ by usage type.",
        "nodeIds": [
          "chi_ind",
          "exp_cell"
        ],
        "realData": {
          "rows": "2 usage types",
          "cols": "3 GPA categories",
          "df": 2,
          "χ²": "8.4",
          "p": "0.015"
        },
        "interpretation": "Educational vs entertainment use predicts significantly different GPA distributions.",
        "question": "Your 2×3 contingency table (usage type × GPA category). Degrees of freedom?",
        "choices": [
          "df=n−1=37",
          "df=(rows−1)(cols−1)=(2−1)(3−1)=2",
          "df=rows+cols=5",
          "df=n−2=36"
        ],
        "correct": 1,
        "hint": "For a contingency table: df = (rows − 1) × (cols − 1). Count your rows and columns carefully.",
        "explanation": "For chi-square independence in an r×c table: df=(r−1)(c−1). With 2 usage types and 3 GPA categories: df=(2−1)(3−1)=2. This represents how much the data can vary from expected while keeping row/column totals fixed.",
        "outcome": "χ²=8.4, df=2, p=0.015. Educational vs entertainment use predicts different GPA distributions.",
        "analystNote": "Degrees of freedom in a contingency table are the cells that can vary freely once row and column totals are fixed. Understanding WHY the formula is (r−1)(c−1) makes it impossible to forget — it is not a magic formula, it is a logical constraint."
      },
      {
        "title": "When Normality Fails",
        "chapter": 13,
        "narrative": "A reviewer notes GPA distributions within subgroups are not normally distributed. They ask for a nonparametric alternative.",
        "nodeIds": [
          "wrs",
          "wsrt"
        ],
        "realData": {
          "n1": 38,
          "n2": 35,
          "test": "Wilcoxon Rank-Sum (Mann-Whitney U)",
          "z": "−3.1",
          "p": "0.002"
        },
        "interpretation": "Even without normality: heavy users rank significantly lower in GPA. The finding is robust to distributional assumptions.",
        "question": "Compare GPA between heavy and light users WITHOUT assuming normality. Which test?",
        "choices": [
          "z-test (requires normal data)",
          "Wilcoxon Rank-Sum test — nonparametric, compares rank distributions of two independent groups",
          "Paired t-test",
          "Chi-square test"
        ],
        "correct": 1,
        "hint": "You have two INDEPENDENT groups and data that violates normality. Which nonparametric test corresponds to the independent-samples t-test?",
        "explanation": "The Wilcoxon Rank-Sum test (Mann-Whitney U) compares two INDEPENDENT groups when normality fails. It converts all values to combined ranks and tests whether one group tends to have higher ranks.",
        "outcome": "Wilcoxon: z=−3.1, p=0.002. Even without normality assumption, heavy users have significantly lower GPA ranks.",
        "analystNote": "Nonparametric tests get dismissed as weaker, but that is misleading. When your data violates normality, the parametric test gives wrong p-values. Wilcoxon rank-sum is the honest choice — and for large n, it is nearly as powerful as the t-test anyway."
      },
      {
        "title": "The Final Report",
        "chapter": 7,
        "narrative": "Your paper needs a CI for the true population correlation. A journalist asks: Social media CAUSES lower GPA — right?",
        "nodeIds": [
          "t_ci",
          "n_mean"
        ],
        "realData": {
          "95% CI for ρ": "[−0.55, −0.26]",
          "effect size": "r = −0.41 (medium, Cohen)",
          "n for 90% power": "196"
        },
        "interpretation": "Medium effect confirmed. Association is real and robust. Causation requires experimental design.",
        "question": "How do you respond to the journalist?",
        "choices": [
          "\"Yes, our correlation proves it.\"",
          "\"Our observational data shows a significant negative association. To establish causation, a randomized controlled trial is needed.\"",
          "\"Social media use and GPA are related — one causes the other.\"",
          "\"We cannot say anything without a larger sample.\""
        ],
        "correct": 1,
        "hint": "What study design allows you to establish causation? Does an observational study qualify?",
        "explanation": "Correlation does not equal causation — ever. Confounders (motivation, family support, workload) could cause both high screen time AND low GPA. Only a randomized experiment could establish causality. Observational data establishes association, effect size, and significance.",
        "outcome": "Paper submitted with correct framing: \"significant negative association\" not \"proven cause.\" A complete, honest statistical argument. 🎓",
        "analystNote": "The journalist wants a simple story: social media is bad. My job is to give an accurate story: significantly associated with lower GPA in this sample. Those are very different claims. The second is defensible. The first could mislead education policy and ruin careers if wrong."
      }
    ]
  },
  {
    "id": "sports",
    "icon": "🏀",
    "title": "Performance Analyst",
    "sub": "Basketball Free-Throw Training Study",
    "intro": "You're the analytics lead for a college basketball team. The coaching staff wants proof — not a hunch — that a new shooting-form training program actually improves free-throw performance, and wants to know which starting lineup to trust in the playoffs.",
    "steps": [
      {
        "title": "Reading the Roster",
        "chapter": 3,
        "narrative": "You pull free-throw percentages for all 12 rostered players across the season. Before judging any single player, you need a team baseline — a center and a spread.",
        "nodeIds": [
          "x_bar",
          "samp_sd"
        ],
        "realData": {
          "n": 12,
          "X̄": "74.3%",
          "s": "8.6%",
          "range": "58%–91%"
        },
        "interpretation": "A typical player shoots around 74%, but with real spread — some players are far more consistent than others.",
        "question": "You have 12 players, not the full population of college basketball players. Which statistics summarize them?",
        "choices": [
          "μ and σ, since the roster is fixed for the season",
          "X̄ and s, because these 12 players are a sample of this player's shooting ability over time",
          "Only the range, since percentages are already standardized",
          "It doesn't matter — μ and X̄ are interchangeable"
        ],
        "correct": 1,
        "hint": "Even a \"fixed roster\" is a sample of each player's underlying shooting SKILL — a random process, not a fixed population of outcomes.",
        "explanation": "The roster is fixed, but each player's season percentage is itself a sample of makes from their true, unobservable shooting ability. You always use X̄ and s when treating observed data as a sample of an underlying process.",
        "outcome": "Team baseline: X̄ = 74.3%, s = 8.6%. Now you can judge any individual player against this distribution.",
        "analystNote": "Coaches love to point at one hot streak. My job is to first establish what \"normal\" looks like for this team, so a single game doesn't get mistaken for a trend."
      },
      {
        "title": "The Standout",
        "chapter": 3,
        "narrative": "One senior guard is shooting 91% this season, well above the team. The coach wants to know exactly how exceptional that is.",
        "nodeIds": [
          "zscore"
        ],
        "realData": {
          "X (player)": "91%",
          "X̄": "74.3%",
          "s": "8.6%",
          "z": "1.94"
        },
        "interpretation": "z ≈ 1.94 places this player just under two standard deviations above the team mean — clearly elite, not just lucky.",
        "question": "z = (91 − 74.3) / 8.6 = 1.94. How should you describe this to the coach?",
        "choices": [
          "She is 1.94% better than average",
          "She is 91% better than her teammates",
          "She shoots about 1.94 standard deviations above the team average",
          "She has a 1.94% chance of missing"
        ],
        "correct": 2,
        "hint": "A z-score is always expressed in standard-deviation units, never in percent or probability directly.",
        "explanation": "z converts her raw percentage into standard-deviation units relative to the team. z ≈ 1.94 means she is nearly two full standard deviations above the mean — rare, but not astronomically so.",
        "outcome": "Confirmed elite, not a statistical fluke. Now test whether the new training program moves the whole team, not just outliers.",
        "analystNote": "A single z-score tells you how unusual one player is relative to her own team — it says nothing yet about whether a program works. That is a different question, and it needs a different test."
      },
      {
        "title": "Before and After",
        "chapter": 9,
        "narrative": "All 12 players complete an 8-week shooting-form program. You compare each player's free-throw percentage before and after — same players, measured twice.",
        "nodeIds": [
          "t_dep",
          "d_bar",
          "sd_dep"
        ],
        "realData": {
          "Before X̄": "71.0%",
          "After X̄": "76.4%",
          "D̄": "5.4%",
          "sD": "6.1%",
          "n": 12,
          "t": "3.07",
          "df": 11,
          "p": "0.011"
        },
        "interpretation": "The average improvement is real and unlikely to be chance — the program appears to work at the team level.",
        "question": "Same 12 players measured twice. Which test fits?",
        "choices": [
          "Independent two-sample t-test",
          "Paired (dependent) t-test on the before/after differences",
          "Chi-square test of independence",
          "One-way ANOVA"
        ],
        "correct": 1,
        "hint": "Are these two independent groups of players, or the exact same players measured twice?",
        "explanation": "When the same subjects are measured before and after an intervention, you test the paired differences directly — this removes player-to-player variability entirely, leaving only the effect of training.",
        "outcome": "D̄ = 5.4%, t = 3.07, p = 0.011. The training program produced a real, statistically significant improvement.",
        "analystNote": "A paired design is the strongest tool I have for a small roster. By differencing each player against themselves, I cancel out the fact that some players were simply better shooters to begin with."
      },
      {
        "title": "Does Practice Predict Points?",
        "chapter": 10,
        "narrative": "An assistant coach claims practice-hour logs predict in-game scoring. You check whether weekly practice hours actually correlate with points per game.",
        "nodeIds": [
          "pearson",
          "t_r"
        ],
        "realData": {
          "r": "0.58",
          "n": 12,
          "t": "2.25",
          "df": 10,
          "p": "0.048"
        },
        "interpretation": "A moderate positive correlation that is just barely statistically significant — worth watching, not yet worth over-claiming.",
        "question": "r = 0.58 with n = 12. Is this relationship statistically significant?",
        "choices": [
          "Yes, automatically, since r is positive and above 0.5",
          "You must test it: t = r√(n−2)/√(1−r²) ≈ 2.25, df=10, p ≈ 0.048 — barely significant",
          "No, r must exceed 0.9 to mean anything in sports data",
          "Significance cannot be tested with n < 30"
        ],
        "correct": 1,
        "hint": "A \"moderate\" correlation with a small sample needs a real hypothesis test — do not eyeball r alone.",
        "explanation": "With only 12 players, even a real relationship produces a noisy estimate of r. The t-test for r confirms this one clears the p < 0.05 bar, but barely — a larger roster would give a much more confident answer.",
        "outcome": "p ≈ 0.048. Practice hours and scoring are related, but the evidence is thin. Build a model anyway, cautiously.",
        "analystNote": "A p-value of 0.048 and a p-value of 0.002 are technically both \"significant,\" but I treat them very differently in a report. Borderline results deserve a caveat, not a headline."
      },
      {
        "title": "Building the Prediction",
        "chapter": 10,
        "narrative": "You fit a regression line to translate practice hours into an expected scoring bump, and check how much of the variation in scoring it actually explains.",
        "nodeIds": [
          "reg",
          "r2"
        ],
        "realData": {
          "equation": "y' = 8.2 + 1.4 × (practice hrs/week)",
          "r²": "0.34",
          "unexplained": "66%"
        },
        "interpretation": "Practice hours explain about a third of scoring variation — a real factor, but far from the whole picture.",
        "question": "r² = 0.34. What is the honest way to present this to the coaching staff?",
        "choices": [
          "Practice hours explain 34% of scoring — the rest is talent, matchups, and game-flow factors",
          "The model is 34% accurate at predicting exact scores",
          "34% of players benefit from practice",
          "r² does not apply to sports data"
        ],
        "correct": 0,
        "hint": "r² is the share of Y-variability statistically explained by X — always ask what the remaining share represents.",
        "explanation": "r² = 0.34 means about a third of the variation in points-per-game tracks with logged practice hours. The other 66% — opponent strength, in-game minutes, shot selection — is real too, and should not be ignored just because you have a number.",
        "outcome": "y' = 8.2 + 1.4×hours. A useful planning tool, not a guarantee. Now settle the lineup argument with ANOVA.",
        "analystNote": "Coaches want a single number that predicts wins. My job is to hand them r² right next to the prediction, so they know exactly how much to trust it."
      },
      {
        "title": "Which Lineup Wins?",
        "chapter": 12,
        "narrative": "The coach has three candidate starting lineups. Rather than eyeballing small sample averages, you test whether their scoring outputs genuinely differ.",
        "nodeIds": [
          "anova_f",
          "tukey"
        ],
        "realData": {
          "k": 3,
          "F": "4.62",
          "df": "2, 33",
          "p": "0.017",
          "posthoc": "Tukey: Lineup C > Lineup A"
        },
        "interpretation": "At least one lineup scores differently from the others — and the post-hoc test pinpoints exactly which.",
        "question": "Why not just run three separate two-sample t-tests between the lineup pairs?",
        "choices": [
          "t-tests are more powerful for this case",
          "Multiple t-tests inflate the overall Type I error rate — ANOVA tests all three at once, controlling error properly",
          "t-tests cannot be used with scoring data",
          "ANOVA and repeated t-tests always give identical p-values"
        ],
        "correct": 1,
        "hint": "Running three separate tests at α = 0.05 each raises your true chance of at least one false alarm well above 5%.",
        "explanation": "Each additional pairwise t-test adds more opportunity for a false positive. ANOVA tests all three lineups simultaneously at a single, controlled error rate, and Tukey's test then safely identifies which specific pairs differ.",
        "outcome": "F = 4.62, p = 0.017. Lineup C significantly outscores Lineup A. Coach starts Lineup C in the playoffs. 🏆",
        "analystNote": "\"Just eyeball the averages\" is how teams talk themselves into small-sample noise. ANOVA plus a proper post-hoc test is the difference between a defensible playoff decision and a hunch with a spreadsheet attached."
      }
    ]
  },
  {
    "id": "environment",
    "icon": "🌊",
    "title": "Conservation Scientist",
    "sub": "River Restoration Water Quality Study",
    "intro": "A river restoration project removed an old dam two years ago. Your agency needs a rigorous before/after and site-by-site case for whether the restoration actually improved water quality and fish habitat — not just a feel-good press release.",
    "steps": [
      {
        "title": "Thirty Sites, One Picture",
        "chapter": 2,
        "narrative": "Field teams collected dissolved oxygen (DO) readings at 30 monitoring sites along the river. Before drawing any conclusion, you organize the raw numbers into a frequency distribution.",
        "nodeIds": [
          "pct",
          "cwidth"
        ],
        "realData": {
          "n": 30,
          "DO range": "2.1–10.8 mg/L",
          "shape": "bimodal — a low cluster and a high cluster"
        },
        "interpretation": "A bimodal shape usually signals two distinct populations of sites — here, likely upstream vs. downstream of the former dam.",
        "question": "Your histogram shows two separate humps rather than one bell shape. What should you do next?",
        "choices": [
          "Ignore it and compute one overall mean",
          "Investigate whether a grouping variable — like upstream vs. downstream — explains the two clusters",
          "Delete the lower cluster as measurement error",
          "Switch immediately to a chi-square test"
        ],
        "correct": 1,
        "hint": "A bimodal distribution is a clue, not noise — it usually means your data secretly contains two different groups.",
        "explanation": "Bimodal shapes almost always mean you are looking at two populations lumped together. Here, it points straight at a natural comparison: sites upstream vs. downstream of the restoration.",
        "outcome": "Two-cluster structure confirmed. Next, quantify each cluster with real summary numbers.",
        "analystNote": "The histogram is the cheapest, most-skipped step in environmental analysis. It just cost us nothing and already reframed the whole investigation around upstream vs. downstream."
      },
      {
        "title": "Below the Line",
        "chapter": 3,
        "narrative": "State agencies generally treat 5.0 mg/L dissolved oxygen as the minimum needed to sustain healthy aquatic life. You compute the average DO level with its spread to see how the river compares.",
        "nodeIds": [
          "x_bar",
          "samp_sd"
        ],
        "realData": {
          "n": 30,
          "X̄": "6.8 mg/L",
          "s": "2.3 mg/L",
          "threshold": "5.0 mg/L (state aquatic-life standard)"
        },
        "interpretation": "The river clears the minimum standard on average — but with real variability, meaning some individual sites likely still fall short.",
        "question": "X̄ = 6.8 mg/L clears the 5.0 mg/L threshold. Does that mean every site is safe for fish?",
        "choices": [
          "Yes — the mean is what regulators check",
          "No — s = 2.3 mg/L means individual sites vary widely; some are still likely below 5.0",
          "Yes, because DO is always normally distributed",
          "No data can ever be summarized by a single mean"
        ],
        "correct": 1,
        "hint": "A mean above a threshold says nothing about the sites sitting well below it — that is what the spread tells you.",
        "explanation": "A healthy average can hide a meaningful number of failing sites. With s = 2.3 mg/L, sites more than about one SD below the mean (roughly under 4.5 mg/L) are common enough to matter — that is exactly what you check next.",
        "outcome": "Team average passes, but individual-site risk remains. Quantify what fraction of sites truly meet standard.",
        "analystNote": "Regulators love a single passing average because it is easy to report. My job is to keep pointing back at s, because the fish do not experience the mean — they experience whatever site they are actually in."
      },
      {
        "title": "What Fraction Actually Passes?",
        "chapter": 7,
        "narrative": "You classify each site as pass/fail against the 5.0 mg/L standard and build a confidence interval for the true proportion of the river meeting it.",
        "nodeIds": [
          "p_hat",
          "p_ci"
        ],
        "realData": {
          "p̂": "0.80 (24 of 30 sites)",
          "95% CI": "(0.65, 0.95)"
        },
        "interpretation": "Roughly 65%–95% of the river likely meets standard — a wide interval, reflecting real uncertainty from a modest sample of sites.",
        "question": "p̂ = 0.80 with 95% CI (0.65, 0.95). How do you report this to the agency director?",
        "choices": [
          "\"Exactly 80% of the river meets standard\"",
          "\"We estimate 65%–95% of monitored river length meets standard, with 95% confidence in that estimating procedure\"",
          "\"There is an 80% chance any given site meets standard\"",
          "\"The interval is too wide to mean anything, so ignore it\""
        ],
        "correct": 1,
        "hint": "p̂ is a point estimate from a sample of sites — the CI is what tells you the honest range of plausible true values.",
        "explanation": "p̂ = 0.80 is your best single estimate, but with only 30 sites the CI is genuinely wide. The correct claim describes confidence in the estimation method, not certainty about the true proportion itself.",
        "outcome": "CI reported as (0.65, 0.95). Wide, but a real improvement over the pre-restoration baseline of 45%. Now compare zones directly.",
        "analystNote": "A wide confidence interval is not a failure — it is honesty about a 30-site sample. I would rather show the agency a wide, correct interval than a falsely precise single number."
      },
      {
        "title": "Upstream vs. Downstream",
        "chapter": 9,
        "narrative": "You directly compare pollutant concentration (mg/L nitrates) between the 14 upstream sites and 16 downstream sites — but first must check whether their variances are even comparable.",
        "nodeIds": [
          "t2mu",
          "f_test"
        ],
        "realData": {
          "Upstream X̄": "1.8 mg/L",
          "Downstream X̄": "3.4 mg/L",
          "F": "1.6",
          "F p-value": "0.22",
          "t": "−4.1",
          "p": "<0.001"
        },
        "interpretation": "Downstream nitrate levels are significantly higher — consistent with continued agricultural runoff entering below the old dam site.",
        "question": "Before running the two-sample t-test, why compute the F-test first?",
        "choices": [
          "To check for outliers",
          "To test whether the two groups' variances are equal, which determines the correct form of the t-test",
          "To confirm both groups have equal sample sizes",
          "The F-test is optional and rarely used in practice"
        ],
        "correct": 1,
        "hint": "The two-sample t-test comes in two forms — pooled and Welch — and the choice depends on a variance assumption you should test first, not assume.",
        "explanation": "The F-test compares variances first. Here F is not significant (p = 0.22), so variances are effectively equal and the standard pooled t-test applies safely, giving t = −4.1, p < 0.001.",
        "outcome": "Downstream nitrates are significantly higher than upstream. Restoration helped oxygen levels, but runoff is still a live problem.",
        "analystNote": "Skipping the F-test is one of the most common shortcuts I see in environmental reports — and one of the easiest fixes. It takes one extra line of analysis to know which t-test is actually valid."
      },
      {
        "title": "Rain and Runoff",
        "chapter": 10,
        "narrative": "A watershed engineer suspects heavier rainfall is flushing more agricultural nitrate into the river. You test whether monthly rainfall correlates with downstream nitrate spikes.",
        "nodeIds": [
          "pearson"
        ],
        "realData": {
          "r": "0.71",
          "n": 24,
          "p": "<0.001"
        },
        "interpretation": "A strong, significant positive relationship — heavier rain months reliably coincide with higher nitrate readings downstream.",
        "question": "r = 0.71 between rainfall and nitrate levels. What is the most responsible conclusion?",
        "choices": [
          "Rainfall causes nitrate spikes, full stop — build a rain-triggered alert system",
          "Rainfall and nitrate are strongly associated; likely explanation is storm-driven agricultural runoff, but confirm mechanism before regulatory action",
          "Correlation this high always proves causation in environmental science",
          "r = 0.71 is too weak to act on"
        ],
        "correct": 1,
        "hint": "A strong, plausible mechanism (runoff) makes causation likely — but correlation alone is still not proof.",
        "explanation": "r = 0.71 is a strong, statistically significant relationship, and there is a physically sensible mechanism (storm runoff carrying fertilizer). That combination is compelling — but confirming it usually still requires a designed sampling study, not correlation alone.",
        "outcome": "Strong rain-nitrate link confirmed. Recommend storm-triggered monitoring, pending a mechanism-confirming follow-up study.",
        "analystNote": "A strong r with a believable mechanism is about as close to \"act on it\" as observational data gets — but I still label it an association in the report. Regulators need to know the difference when they write policy."
      },
      {
        "title": "Has the Fish Community Recovered?",
        "chapter": 11,
        "narrative": "You compare the current species-abundance breakdown at monitoring sites against the historical pre-dam baseline to see if fish community structure has genuinely returned to normal.",
        "nodeIds": [
          "chi_gof"
        ],
        "realData": {
          "species": 5,
          "χ²": "6.1",
          "df": 4,
          "p": "0.19"
        },
        "interpretation": "No statistically significant difference from the historical baseline — the fish community distribution looks consistent with pre-dam conditions.",
        "question": "χ² = 6.1, df = 4, p = 0.19. What does this tell the agency about restoration success?",
        "choices": [
          "The species distribution significantly differs from history — restoration failed",
          "No significant difference from the historical baseline was detected — consistent with recovery, though absence of evidence is not proof of full recovery",
          "χ² cannot be used for species-count data",
          "p = 0.19 means the test was inconclusive and should be discarded"
        ],
        "correct": 1,
        "hint": "A non-significant chi-square goodness-of-fit result means the observed pattern is statistically consistent with the expected one.",
        "explanation": "Failing to reject H₀ means the current species mix is statistically consistent with the historical baseline — a genuinely encouraging sign, though it does not by itself prove full ecological recovery on every dimension.",
        "outcome": "χ² = 6.1, p = 0.19. Species distribution consistent with historical baseline. Restoration case supported by five independent lines of evidence. 🌊",
        "analystNote": "\"Not significantly different from history\" is actually the best possible outcome in a recovery study — it means the ecosystem looks statistically ordinary again. I am always careful to explain that to non-statisticians, since \"not significant\" sounds like failure but here it is the win."
      }
    ]
  },
  {
    "id": "manufacturing",
    "icon": "⚙️",
    "title": "Process Engineer",
    "sub": "Factory Defect Rate Investigation",
    "intro": "Your production line's defect rate has crept up, and quality complaints are rising. The plant manager wants root cause and proof that a proposed machine recalibration actually fixes it — with numbers that will survive an audit.",
    "steps": [
      {
        "title": "How Many Defects Should We Expect?",
        "chapter": 5,
        "narrative": "Each unit off the line has a known 4% chance of a minor defect based on historical baseline. You need to know the expected defect count for a batch of 50 units before deciding if today's batch looks abnormal.",
        "nodeIds": [
          "binom",
          "binom_mu"
        ],
        "realData": {
          "n": 50,
          "p": "0.04",
          "μ (expected defects)": "2.0",
          "today's observed": "7"
        },
        "interpretation": "Seven defects against an expected two is a large gap — worth formally testing, not dismissing as normal variation.",
        "question": "Expected defects μ = np = 50 × 0.04 = 2.0. Today's batch had 7. Is this batch definitely broken?",
        "choices": [
          "Yes, any deviation from the expected value means the process is broken",
          "Not automatically — but 7 vs. an expected 2 is a large enough gap to warrant a formal hypothesis test",
          "No, binomial models cannot detect process problems",
          "The expected value guarantees exactly 2 defects every batch"
        ],
        "correct": 1,
        "hint": "The binomial mean is a long-run average — real batches will vary. The question is whether this particular deviation is too large to be chance.",
        "explanation": "μ = np gives the long-run expected count, not a guarantee for any single batch. Seven observed against an expected two is a meaningful gap, but \"meaningful\" needs a formal test — which is exactly the next step.",
        "outcome": "Expected 2, observed 7. Flagged for formal testing rather than an immediate line shutdown.",
        "analystNote": "Shutting down a production line on a single unusual batch is expensive and often wrong. The binomial mean tells me what to expect; a proper hypothesis test tells me whether today is actually different."
      },
      {
        "title": "Setting the Tolerance",
        "chapter": 7,
        "narrative": "Beyond defect counts, engineering also cares about consistency: a part dimension must stay within tight variance limits. You build a confidence interval for the true process variance from a sample of 25 parts.",
        "nodeIds": [
          "var_ci",
          "chi_var"
        ],
        "realData": {
          "n": 25,
          "sample variance": "0.018 mm²",
          "95% CI for σ²": "(0.011, 0.032) mm²",
          "spec limit": "0.025 mm²"
        },
        "interpretation": "The upper bound of the CI exceeds the spec limit — the process may not reliably stay within tolerance even though today's sample looks fine.",
        "question": "The CI for σ² is (0.011, 0.032), and spec requires σ² ≤ 0.025. What is the concern?",
        "choices": [
          "None — the sample variance 0.018 is below spec, so we are safe",
          "The CI's upper bound (0.032) exceeds spec — the TRUE variance could plausibly be out of tolerance even though this sample looks fine",
          "CIs for variance are never used in manufacturing",
          "A wider CI always means the process is better"
        ],
        "correct": 1,
        "hint": "A single sample statistic can look fine while the plausible range of the true parameter still crosses the spec limit.",
        "explanation": "Judging the process only by the sample variance (0.018) hides real risk — the CI shows the true variance could plausibly be as high as 0.032, which would violate spec. This is why engineers report the interval, not just the point estimate.",
        "outcome": "Variance CI crosses the spec boundary. Process flagged as marginally capable — recalibration recommended.",
        "analystNote": "A point estimate that \"passes\" can still hide a process running dangerously close to spec. The confidence interval is what actually protects the plant from shipping out-of-tolerance parts."
      },
      {
        "title": "Testing the Defect Claim",
        "chapter": 8,
        "narrative": "Quality control's internal standard requires the true defect rate to stay at or below 5%. You test this season's data of 400 units directly against that standard.",
        "nodeIds": [
          "z_prop"
        ],
        "realData": {
          "n": 400,
          "p̂": "0.068",
          "p₀": "0.05",
          "z": "2.61",
          "p": "0.0045"
        },
        "interpretation": "The observed defect rate is significantly above the 5% standard — this is not normal noise, it is a real shift.",
        "question": "z = (0.068 − 0.05)/√(0.05×0.95/400) = 2.61, p = 0.0045. What is the correct conclusion at α = 0.05?",
        "choices": [
          "Fail to reject H₀ — the defect rate is still acceptable",
          "Reject H₀ — the true defect rate is significantly above the 5% standard",
          "The test is invalid because n is too large",
          "p = 0.0045 means there is a 0.45% chance the process is broken"
        ],
        "correct": 1,
        "hint": "Compare the p-value directly to α. p = 0.0045 is far smaller than 0.05.",
        "explanation": "p = 0.0045 is well below α = 0.05, so you reject H₀. The evidence strongly supports that the true defect rate has risen above the 5% specification — this justifies the recalibration investment.",
        "outcome": "z = 2.61, p = 0.0045. Defect rate confirmed significantly elevated. Plant manager approves recalibration.",
        "analystNote": "This is the number that got budget approved. \"It feels like more defects lately\" does not move a plant manager. z = 2.61 with p = 0.0045 does."
      },
      {
        "title": "Did the Fix Work?",
        "chapter": 9,
        "narrative": "After recalibration, you compare defect rates before and after across two large independent batches to confirm the fix actually worked, not just anecdotally.",
        "nodeIds": [
          "z2p"
        ],
        "realData": {
          "Before p̂": "0.068 (n=400)",
          "After p̂": "0.041 (n=380)",
          "z": "2.89",
          "p": "0.0038"
        },
        "interpretation": "Defect rate dropped significantly after recalibration — the fix is statistically confirmed, not just a lucky week.",
        "question": "Before/after are two independent batches (different units, not the same units remeasured). Which test applies?",
        "choices": [
          "Paired t-test",
          "Two-proportion z-test comparing independent before/after batches",
          "Chi-square goodness of fit",
          "One-sample z-test for proportion"
        ],
        "correct": 1,
        "hint": "\"Before\" and \"after\" here are two different sets of manufactured units — independent groups, not the same units measured twice.",
        "explanation": "Because the before and after batches are different physical units, this is an independent two-proportion comparison, not a paired test. z = 2.89, p = 0.0038 confirms a real drop in defect rate.",
        "outcome": "Defect rate fell from 6.8% to 4.1%, a statistically confirmed improvement. Recalibration validated for rollout to all lines.",
        "analystNote": "Six Sigma programs live and die on this exact comparison. World-class manufacturing targets under 3.4 defects per million; most factories without a formal program run in the tens of thousands per million. Every recalibration has to prove itself with a test like this one, not a manager's impression."
      },
      {
        "title": "Random Noise or a Pattern?",
        "chapter": 13,
        "narrative": "A technician suspects defects cluster around shift changes rather than occurring randomly throughout the day. You test the sequence of pass/fail outcomes for non-random patterning.",
        "nodeIds": [
          "runs"
        ],
        "realData": {
          "n1": "32 pass streak-starts",
          "n2": "18 fail streak-starts",
          "runs": "21",
          "z": "−2.14",
          "p": "0.032"
        },
        "interpretation": "The pattern is significantly less random than expected — defects are clustering, not scattering evenly through the day.",
        "question": "The runs test returns z = −2.14, p = 0.032. What does a significant result mean here?",
        "choices": [
          "The defect rate itself is too high",
          "The sequence of pass/fail outcomes is not random — defects are clustering at certain points rather than scattering evenly",
          "The sample size is too small to trust",
          "Runs tests only apply to coin-flip data, not manufacturing"
        ],
        "correct": 1,
        "hint": "The runs test checks RANDOMNESS OF ORDER, not the overall rate — it is a completely different question from \"how many defects.\"",
        "explanation": "A significant runs test says nothing about the overall defect rate — it says the ORDER is not random. Combined with the technician's hunch, this points investigators toward shift-change conditions as a specific, testable cause.",
        "outcome": "Non-random clustering confirmed. Investigation redirected to shift-change procedures specifically.",
        "analystNote": "This is the test people forget exists. Knowing your defect RATE is one problem; knowing whether defects cluster in TIME is a completely different, and sometimes more actionable, one."
      },
      {
        "title": "Is It the Shift or the Machine?",
        "chapter": 11,
        "narrative": "You cross-tabulate defect type against production shift to test whether certain defect types are independent of which shift produced them.",
        "nodeIds": [
          "chi_ind",
          "exp_cell"
        ],
        "realData": {
          "table": "3 defect types × 3 shifts",
          "n": 180,
          "χ²": "14.2",
          "df": 4,
          "p": "0.007"
        },
        "interpretation": "Defect type is significantly associated with shift — this is not one uniform process problem, it is shift-specific.",
        "question": "χ² = 14.2, df = 4, p = 0.007 for defect type × shift. What is the actionable conclusion?",
        "choices": [
          "Defect type and shift are independent — no shift-specific action needed",
          "Defect type and shift are significantly associated — investigate shift-specific causes (training, fatigue, handoff procedure) rather than treating this as one uniform machine problem",
          "The test is invalid because defect type is categorical",
          "χ² only works with exactly two categories per variable"
        ],
        "correct": 1,
        "hint": "A significant chi-square test of independence means the two categorical variables are related — here, defect type depends on which shift produced it.",
        "explanation": "Significant association means defect type is not evenly spread across shifts — some shifts produce disproportionately more of a specific defect type. That reframes the fix from \"recalibrate the machine\" to \"investigate shift-specific practices.\"",
        "outcome": "χ² = 14.2, p = 0.007. Night shift shows a disproportionate share of alignment defects. Root cause traced to a handoff procedure gap. ⚙️",
        "analystNote": "The recalibration fixed the machine-level rate. This test caught something recalibration could never fix — a human-process problem hiding inside what looked like a pure equipment issue."
      }
    ]
  },
  {
    "id": "finance",
    "icon": "📈",
    "title": "Investment Analyst",
    "sub": "Portfolio Risk and Strategy Evaluation",
    "intro": "A client wants to know if a new algorithmic trading strategy actually beats a simple market-index benchmark, and whether their portfolio's risk is properly diversified. Every recommendation has to be backed by a defensible number, not a chart that looks nice.",
    "steps": [
      {
        "title": "The Real Expected Return",
        "chapter": 3,
        "narrative": "The client's portfolio holds five assets in very different dollar amounts. A simple average of the five returns would badly misrepresent the portfolio's actual expected return.",
        "nodeIds": [
          "wmean"
        ],
        "realData": {
          "assets": 5,
          "weights": "$50k, $30k, $10k, $5k, $5k",
          "simple avg return": "7.4%",
          "weighted avg return": "6.1%"
        },
        "interpretation": "The weighted return is notably lower than the naive average — the largest position happens to be the weakest performer.",
        "question": "Why does the weighted mean (6.1%) differ so much from the simple average (7.4%)?",
        "choices": [
          "A calculation error somewhere",
          "The largest position ($50k) has a below-average return, and weighting by dollar size correctly gives it more influence",
          "Weighted means are never used in finance",
          "The simple average is always more accurate"
        ],
        "correct": 1,
        "hint": "A simple average treats a $5k position and a $50k position as equally important. Is that realistic for portfolio return?",
        "explanation": "The simple average treats every asset as equally important regardless of size — clearly wrong for a portfolio, where a $50k position dominates outcomes far more than a $5k one. The weighted mean is the only honest measure of actual portfolio return.",
        "outcome": "True portfolio return: 6.1%, not the flattering 7.4% simple average. Now assess risk, not just return.",
        "analystNote": "Clients often see the simple average on a summary sheet and assume that is their return. It almost never is. The weighted mean is the number that actually matches what happened to their money."
      },
      {
        "title": "Risk on Different Scales",
        "chapter": 3,
        "narrative": "The client is deciding between two stocks: one trades around $40 with $6 swings, the other around $220 with $18 swings. Raw standard deviation makes the second look far riskier — but does it?",
        "nodeIds": [
          "cvar"
        ],
        "realData": {
          "Stock A": "mean $40, s $6",
          "Stock B": "mean $220, s $18",
          "CV A": "15.0%",
          "CV B": "8.2%"
        },
        "interpretation": "On a relative basis, Stock A is actually the more volatile investment, despite its smaller raw dollar swings.",
        "question": "Stock B has a larger raw SD ($18 vs $6). Which stock is actually riskier relative to its price?",
        "choices": [
          "Stock B — larger SD always means more risk",
          "Stock A — its coefficient of variation (15.0%) is nearly double Stock B's (8.2%), meaning bigger swings relative to its own price",
          "They carry identical risk since both are stocks",
          "CV cannot be used to compare different stocks"
        ],
        "correct": 1,
        "hint": "Raw SD in dollars is not comparable across two very differently priced stocks — you need spread relative to the mean.",
        "explanation": "Comparing raw SD across a $40 stock and a $220 stock is comparing apples to oranges. CV rescales spread as a percentage of price, and by that fairer measure, Stock A is actually the more volatile holding.",
        "outcome": "Stock A carries proportionally more risk despite smaller dollar swings. Client's risk tolerance drives the final call.",
        "analystNote": "\"Which number is bigger\" is the rookie mistake in risk comparison. CV is the tool that stops a client from misjudging risk just because one stock happens to trade at a higher price."
      },
      {
        "title": "Is the New Strategy Worth the Risk?",
        "chapter": 5,
        "narrative": "The algorithmic strategy has three possible quarterly outcomes with known historical probabilities. Before recommending it, you compute its expected value and how much that value could swing.",
        "nodeIds": [
          "exp_val",
          "disc_var"
        ],
        "realData": {
          "outcomes": "+12% (p=0.3), +2% (p=0.5), −15% (p=0.2)",
          "E(X)": "+0.6%",
          "σ²": "80.64",
          "σ": "8.98%"
        },
        "interpretation": "A barely-positive expected return with substantial swing — this strategy is not obviously better than a plain index fund.",
        "question": "E(X) = +0.6% per quarter, with σ ≈ 9%. What should you tell the client?",
        "choices": [
          "The expected value is positive, so recommend it without reservation",
          "The expected value is only marginally positive relative to its risk (σ ≈ 9%) — compare carefully against a lower-risk benchmark before recommending",
          "A positive expected value always means it beats any benchmark",
          "Expected value cannot be computed for trading strategies"
        ],
        "correct": 1,
        "hint": "A small positive expected value paired with a large standard deviation is a classic high-risk, marginal-reward profile — worth flagging explicitly.",
        "explanation": "E(X) = +0.6% looks fine in isolation, but a swing of nearly 9 percentage points around that number is enormous relative to the reward. The expected value alone, without its variance, is a misleading pitch.",
        "outcome": "Expected value barely positive relative to its risk. Recommend head-to-head comparison against the benchmark before committing capital.",
        "analystNote": "Expected value without variance is half a sentence. I never report E(X) alone in a client memo — the risk number has to sit right next to it, every time."
      },
      {
        "title": "How Confident Are We in the Return?",
        "chapter": 7,
        "narrative": "You have 60 days of the strategy's live daily returns. Rather than trust a single average, you build a confidence interval for its true average daily return.",
        "nodeIds": [
          "t_ci"
        ],
        "realData": {
          "n": 60,
          "X̄": "0.04%",
          "s": "0.51%",
          "95% CI": "(−0.09%, 0.17%)"
        },
        "interpretation": "The interval comfortably straddles zero — you cannot yet confidently claim the strategy has a positive true average return.",
        "question": "The 95% CI for daily return is (−0.09%, 0.17%). What does this tell the client?",
        "choices": [
          "The strategy definitely loses money on average",
          "The interval includes zero, so you cannot confidently claim the true average daily return is positive — more data is needed",
          "The strategy is definitely profitable since the point estimate (0.04%) is positive",
          "CIs cannot be built for daily trading returns"
        ],
        "correct": 1,
        "hint": "When a confidence interval for a difference or a mean includes zero, you cannot rule out \"no real effect\" as a possibility.",
        "explanation": "Because the interval spans from slightly negative to slightly positive, zero remains a plausible value for the true average return. The positive point estimate (0.04%) is not enough on its own — the interval is what tells the honest story.",
        "outcome": "CI includes zero. Verdict: inconclusive after 60 days — recommend extending the observation window before allocating client capital.",
        "analystNote": "A CI that straddles zero is one of the most useful \"don't act yet\" signals in finance. It is far more responsible than cherry-picking the positive point estimate and calling it a win."
      },
      {
        "title": "Market Sensitivity",
        "chapter": 10,
        "narrative": "You run a market-model regression of the strategy's daily returns against the overall market index return, the standard approach for measuring a strategy's market sensitivity (beta) and explanatory power.",
        "nodeIds": [
          "pearson",
          "reg",
          "r2"
        ],
        "realData": {
          "equation": "strategy return = 0.01% + 0.65 × market return",
          "beta": "0.65",
          "r²": "0.42"
        },
        "interpretation": "The strategy moves with the market but less aggressively (beta < 1), and 42% of its return variation is explained by overall market movement.",
        "question": "Beta = 0.65 and r² = 0.42. How do you explain this to the client?",
        "choices": [
          "The strategy is 65% invested in the market",
          "For every 1% market move, the strategy tends to move about 0.65%, and market movement explains 42% of the strategy's return variation — the rest comes from the algorithm's own decisions",
          "r² and beta measure the same thing",
          "The strategy has no relationship to the broader market"
        ],
        "correct": 1,
        "hint": "Beta describes sensitivity (the slope); r² describes how much of the total variation that relationship actually explains.",
        "explanation": "Beta of 0.65 means the strategy is less volatile than the market itself on a like-for-like basis. r² = 0.42 means 42% of its return swings track the market — the remaining 58% reflects the strategy's own independent bets, for better or worse.",
        "outcome": "Strategy shown to be lower-beta than the market with meaningful independent behavior. Useful diversification profile.",
        "analystNote": "Clients often confuse beta and r². Beta tells you the direction and intensity of market sensitivity; r² tells you how reliable that relationship is. A strategy needs both explained separately or the pitch is incomplete."
      },
      {
        "title": "Strategy vs. Benchmark, Head to Head",
        "chapter": 9,
        "narrative": "With more data now in hand, you directly compare the strategy's average return against a simple index-fund benchmark over the same 60-day window.",
        "nodeIds": [
          "t2mu"
        ],
        "realData": {
          "Strategy X̄": "0.04%",
          "Benchmark X̄": "0.03%",
          "t": "0.18",
          "df": 118,
          "p": "0.86"
        },
        "interpretation": "No statistically significant difference between the strategy and the plain benchmark — the extra complexity is not paying off yet.",
        "question": "t = 0.18, p = 0.86 comparing strategy vs. benchmark returns. What is the recommendation?",
        "choices": [
          "Recommend the strategy immediately since its average return is nominally higher",
          "No significant difference detected (p = 0.86) — do not recommend paying extra fees for the algorithmic strategy over the simple benchmark based on current evidence",
          "p = 0.86 means the strategy is 86% better",
          "Rerun the test with a smaller sample to get a clearer answer"
        ],
        "correct": 1,
        "hint": "A large p-value (0.86) is strong evidence of no detectable difference — a nominally higher average is not the same as a proven one.",
        "explanation": "p = 0.86 is about as clear an \"indistinguishable from the benchmark\" result as you can get. Recommending an actively managed strategy — usually with higher fees — requires real evidence of outperformance, which this data does not provide.",
        "outcome": "No significant edge over the benchmark. Recommendation: hold off, keep monitoring, do not pay active-management fees yet. 📊",
        "analystNote": "Telling a client \"no, don't pay for the fancy strategy\" is a harder conversation than selling them on it — but it is the conversation the data supports. That is the whole job."
      }
    ]
  },
  {
    "id": "psychology",
    "icon": "🧠",
    "title": "Behavioral Researcher",
    "sub": "Mindfulness Intervention Randomized Trial",
    "intro": "You're running a randomized controlled trial testing whether an 8-week mindfulness program reduces anxiety scores in university students. Unlike an observational survey, you control assignment to groups — which changes what your statistics can actually claim.",
    "steps": [
      {
        "title": "Did Randomization Work?",
        "chapter": 9,
        "narrative": "Before testing the intervention, you must verify that random assignment actually produced comparable groups — if baseline anxiety already differs, any later result is suspect.",
        "nodeIds": [
          "t2mu"
        ],
        "realData": {
          "Treatment baseline X̄": "14.2 (GAD-7 scale)",
          "Control baseline X̄": "13.8",
          "t": "0.61",
          "df": 78,
          "p": "0.54"
        },
        "interpretation": "No significant baseline difference — randomization successfully produced comparable groups before the intervention began.",
        "question": "Why test baseline anxiety BEFORE looking at the outcome at all?",
        "choices": [
          "It is not necessary if the sample was randomized — skip straight to the outcome",
          "To confirm randomization actually balanced the groups; if baseline already differs, any later difference could be a pre-existing gap, not a treatment effect",
          "Baseline testing is only needed in observational studies",
          "t-tests cannot be used on baseline data"
        ],
        "correct": 1,
        "hint": "Randomization usually balances groups, but does not guarantee it in a specific sample — checking is standard RCT practice.",
        "explanation": "Randomization tends to balance groups on average, but any single trial can still get unlucky. Confirming p = 0.54 at baseline means the groups started statistically equivalent, so any later difference can be credibly attributed to the intervention.",
        "outcome": "Baseline groups confirmed comparable (p = 0.54). Randomization succeeded — proceed to test the intervention itself.",
        "analystNote": "Skipping the baseline check is a classic reviewer's objection waiting to happen. I always run it first, even when I am confident randomization worked, because a referee will ask."
      },
      {
        "title": "Before and After the Program",
        "chapter": 9,
        "narrative": "Within the treatment group only, you compare each student's anxiety score before and after the 8-week mindfulness program.",
        "nodeIds": [
          "t_dep",
          "d_bar"
        ],
        "realData": {
          "n": 40,
          "Before X̄": "14.2",
          "After X̄": "10.6",
          "D̄": "3.6",
          "t": "4.85",
          "df": 39,
          "p": "<0.001"
        },
        "interpretation": "A large, highly significant drop in anxiety within the treatment group over the 8 weeks.",
        "question": "Why use a paired t-test here instead of comparing treatment-after to control-after directly?",
        "choices": [
          "Paired tests are always preferred, regardless of design",
          "This step isolates the WITHIN-person change for the treatment group specifically, controlling for each student's own starting point",
          "Paired tests do not require a control group at all, so this replaces the control comparison",
          "There is no meaningful difference between the two approaches"
        ],
        "correct": 1,
        "hint": "This step asks \"how much did each treated student change,\" a different (and complementary) question from \"how do the two groups compare at the end.\"",
        "explanation": "The paired test measures each student's own change, controlling for their individual starting anxiety level. It is a genuinely different, complementary question from the between-groups comparison you will still need to run.",
        "outcome": "D̄ = 3.6 points, t = 4.85, p < 0.001. Large within-group improvement. Still need the control-group comparison to rule out simple time effects.",
        "analystNote": "A within-group pre/post drop alone can never prove the program worked — students might improve anyway just from time passing or exam stress ending. That is exactly why the control group exists, and why I do not stop here."
      },
      {
        "title": "How Big Is the Effect, Really?",
        "chapter": 7,
        "narrative": "You build a confidence interval for the treatment effect — comparing the improvement in the treatment group against the change observed in the untreated control group.",
        "nodeIds": [
          "t_ci"
        ],
        "realData": {
          "Treatment change": "−3.6 points",
          "Control change": "−0.8 points",
          "net effect": "−2.8 points",
          "95% CI": "(−4.1, −1.5)",
          "Cohen's d": "0.67 (medium-large)"
        },
        "interpretation": "A clinically meaningful reduction that clears zero comfortably — consistent with published medium-to-large effect sizes for in-person mindfulness programs.",
        "question": "The 95% CI for the net treatment effect is (−4.1, −1.5) points, entirely below zero. What does this support?",
        "choices": [
          "Nothing — CIs cannot be built for treatment effects",
          "A real, non-trivial reduction in anxiety attributable to the program, since the entire interval excludes zero",
          "The effect is exactly −2.8 points in every future study",
          "This proves the effect will replicate at every university"
        ],
        "correct": 1,
        "hint": "When an entire confidence interval for an effect lies on one side of zero, that is strong evidence the effect is real, not just noise.",
        "explanation": "Because the whole interval (−4.1 to −1.5) stays below zero, chance alone is an unlikely explanation. A Cohen's d of 0.67 places this in the medium-to-large range, consistent with published in-person MBSR trials, which typically report d in the 0.55–0.97 range among program completers.",
        "outcome": "Net effect: −2.8 points, 95% CI (−4.1, −1.5), d = 0.67. A credible, clinically meaningful reduction in anxiety.",
        "analystNote": "Effect size is the number I lead with in the actual paper, not the p-value. p < 0.001 tells a reader \"probably real\"; d = 0.67 tells them \"probably worth doing.\" Both matter, but they answer different questions."
      },
      {
        "title": "Does It Hold Without the Normality Assumption?",
        "chapter": 13,
        "narrative": "A reviewer questions whether the GAD-7 anxiety scale is truly interval-scaled enough for a t-test. You rerun the within-group comparison using a rank-based nonparametric test as a robustness check.",
        "nodeIds": [
          "wsrt"
        ],
        "realData": {
          "n": 40,
          "test": "Wilcoxon Signed-Rank",
          "W": "612",
          "z": "−4.31",
          "p": "<0.001"
        },
        "interpretation": "The nonparametric test agrees with the t-test — the result is not an artifact of a normality assumption.",
        "question": "The Wilcoxon signed-rank test confirms the t-test result (both p < 0.001). Why report both?",
        "choices": [
          "It is redundant — never report both tests",
          "Reporting both shows the conclusion is robust regardless of whether the strict normality assumption behind the t-test actually holds",
          "The Wilcoxon test replaces the need for a control group",
          "Only the nonparametric result should ever be published"
        ],
        "correct": 1,
        "hint": "Robustness checks exist to show a result does not depend on a single, possibly-violated assumption.",
        "explanation": "Reviewers who doubt the scale properties of an anxiety questionnaire will accept a Wilcoxon signed-rank confirmation as evidence the finding is not an artifact of assuming normality. Agreement between both tests strengthens the paper considerably.",
        "outcome": "Nonparametric test confirms the t-test finding. Reviewer objection pre-empted before submission.",
        "analystNote": "I run the robustness check before a reviewer asks for it, not after. It costs me ten minutes now and saves a full revision cycle later."
      },
      {
        "title": "Does Dose Matter?",
        "chapter": 12,
        "narrative": "A follow-up cohort tests three program intensities — weekly, twice-weekly, and daily practice — to see whether more frequent practice produces a larger anxiety reduction.",
        "nodeIds": [
          "anova_f"
        ],
        "realData": {
          "k": 3,
          "F": "5.94",
          "df": "2, 87",
          "p": "0.004"
        },
        "interpretation": "Practice intensity significantly affects outcome — at least one dosage level differs meaningfully from the others.",
        "question": "F = 5.94, p = 0.004 across three practice intensities. What is the appropriate next step?",
        "choices": [
          "Stop here — ANOVA already tells you which specific intensity works best",
          "Run a post-hoc test (like Tukey) to identify which specific intensity levels differ from each other",
          "Rerun as three separate independent t-tests instead",
          "The result is uninterpretable without a fourth group"
        ],
        "correct": 1,
        "hint": "ANOVA tells you a difference exists SOMEWHERE among the three groups — it does not by itself say which pair.",
        "explanation": "A significant F only establishes that not all three group means are equal. A post-hoc test is required to responsibly identify which specific intensity levels differ before recommending a specific practice schedule to students.",
        "outcome": "F = 5.94, p = 0.004. Dose-response effect confirmed; post-hoc analysis planned to define the recommended practice frequency.",
        "analystNote": "\"Dose matters\" is a much more useful clinical finding than \"the program works\" — it tells a program director exactly what to prescribe, not just whether to offer it at all."
      },
      {
        "title": "Who Drops Out?",
        "chapter": 11,
        "narrative": "Before finalizing results, you check whether dropout was random across groups — if the treatment group's dropouts were systematically different, your remaining sample could be biased.",
        "nodeIds": [
          "chi_ind"
        ],
        "realData": {
          "table": "2 groups × 2 outcomes (completed/dropped)",
          "n": 90,
          "χ²": "1.14",
          "df": 1,
          "p": "0.29"
        },
        "interpretation": "Dropout appears independent of group assignment — no evidence of differential attrition biasing the results.",
        "question": "χ² = 1.14, p = 0.29 for dropout × group. Why does this matter for the trial's validity?",
        "choices": [
          "It does not matter — dropout is always ignorable in RCTs",
          "A non-significant result here means dropout was not systematically different between groups, supporting that the remaining sample is still a fair comparison",
          "A p-value of 0.29 proves nobody dropped out",
          "This test replaces the need to report the actual dropout rate"
        ],
        "correct": 1,
        "hint": "If treatment-group dropouts differ systematically from control-group dropouts (e.g., the most anxious treatment students quit), the final comparison becomes biased — this test rules that specific threat out.",
        "explanation": "A non-significant chi-square here is reassuring: it means whoever dropped out did so at similar rates and patterns in both groups, so differential attrition is not silently biasing the final treatment-effect estimate.",
        "outcome": "χ² = 1.14, p = 0.29. No evidence of differential dropout. Trial results reported as internally valid. 🧠",
        "analystNote": "Attrition bias is one of the quiet killers of RCT credibility — if only your most-anxious treatment students quit, your \"success\" is partly just selection. This check is short, boring, and essential."
      }
    ]
  },
  {
    "id": "product",
    "icon": "💻",
    "title": "Product Data Scientist",
    "sub": "Checkout Flow Conversion Experiment",
    "intro": "Your e-commerce team wants to redesign the checkout flow. Before shipping it to all users, you need a properly powered experiment — sized correctly, tested correctly, and honest about what it can and cannot prove.",
    "steps": [
      {
        "title": "How Many Users Do We Actually Need?",
        "chapter": 7,
        "narrative": "Before launching the test, you calculate the minimum sample size needed to reliably detect a meaningful lift in conversion rate — running an underpowered test wastes weeks and still answers nothing.",
        "nodeIds": [
          "n_prop"
        ],
        "realData": {
          "baseline conversion": "3.2%",
          "minimum detectable effect": "0.5 percentage points",
          "α": "0.05",
          "power": "0.80",
          "required n per variant": "≈ 14,700"
        },
        "interpretation": "Detecting a modest half-point lift at standard significance and power requires a substantial sample — smaller tests risk missing a real effect entirely.",
        "question": "The calculation says you need about 14,700 users per variant. Marketing wants to launch after just 2,000. What is the risk?",
        "choices": [
          "No risk — more data is only ever a bonus, never a requirement",
          "An underpowered test is likely to miss a real effect (false negative) or produce an unstable, unreliable estimate — the sample size calculation exists precisely to prevent this",
          "Sample size calculations are only theoretical and do not apply to web experiments",
          "2,000 users is always enough for any conversion test"
        ],
        "correct": 1,
        "hint": "Standard A/B testing practice sets significance at 0.05 and power at 0.80 specifically so a real effect of the target size will actually be detected — skipping the sample size math undermines that guarantee.",
        "explanation": "Industry standard practice targets 95% confidence and 80% power when planning a test. Stopping at 2,000 users when the calculation calls for ~14,700 means the test is statistically underpowered — likely to miss a real 0.5-point lift even if it truly exists.",
        "outcome": "Required sample size confirmed at ~14,700 per variant. Test scheduled to run roughly three weeks to reach that volume.",
        "analystNote": "\"We do not have time to wait for enough users\" is the most common way A/B tests get sabotaged before they even start. My job is to make the cost of an underpowered test — a wasted three weeks that still teaches nothing — as concrete as possible before launch."
      },
      {
        "title": "Control vs. Variant",
        "chapter": 9,
        "narrative": "With the trial fully powered and complete, you compare conversion rates between the original checkout flow and the redesigned one.",
        "nodeIds": [
          "z2p"
        ],
        "realData": {
          "Control": "3.2% (471/14,700)",
          "Variant": "3.7% (546/14,760)",
          "z": "2.31",
          "p": "0.021"
        },
        "interpretation": "A statistically significant lift — the redesigned checkout flow converts better than the original.",
        "question": "z = 2.31, p = 0.021. At the standard α = 0.05, what is the decision?",
        "choices": [
          "Fail to reject H₀ — no real difference detected",
          "Reject H₀ — the variant's conversion rate is significantly higher than control's",
          "The test is inconclusive and must be rerun",
          "p = 0.021 means a 2.1% absolute lift"
        ],
        "correct": 1,
        "hint": "Compare p directly against your pre-registered α = 0.05 threshold.",
        "explanation": "p = 0.021 is below the α = 0.05 threshold set before the test began, so you reject H₀. The redesigned flow shows a statistically significant improvement in conversion rate.",
        "outcome": "z = 2.31, p = 0.021. Significant lift confirmed. Now quantify the size of that lift with a confidence interval.",
        "analystNote": "The properly-sized sample from the last step is exactly what makes this p-value trustworthy. An underpowered version of this same test could easily have produced a false negative on a real effect this size."
      },
      {
        "title": "How Big Is the Lift, Really?",
        "chapter": 7,
        "narrative": "A significant p-value tells you a difference exists — it does not tell the product team how large a lift to expect if they roll this out company-wide. You build a confidence interval for that.",
        "nodeIds": [
          "p_ci"
        ],
        "realData": {
          "observed lift": "+0.5 percentage points",
          "95% CI for lift": "(0.08, 0.92) percentage points"
        },
        "interpretation": "The true lift is likely modest — somewhere between a small and a moderate improvement, not the dramatic win a single point estimate might suggest.",
        "question": "The CI for the lift is (0.08, 0.92) percentage points. How should the product team read this?",
        "choices": [
          "The lift is exactly 0.5 points, guaranteed",
          "The true lift plausibly ranges from barely noticeable to meaningfully significant — plan revenue projections around the full range, not just the midpoint",
          "Since the interval doesn't include a \"nice round number,\" the result should be discarded",
          "A wide CI here means the test failed"
        ],
        "correct": 1,
        "hint": "A confidence interval for an effect size is meant to bound your business planning, not just decorate the point estimate.",
        "explanation": "The CI (0.08, 0.92) means the true lift could be nearly negligible or could be nearly double the observed estimate. Responsible revenue forecasting uses this full range, not just the flattering point estimate of 0.5 points.",
        "outcome": "Lift confirmed real but with real uncertainty in magnitude. Rollout approved with a conservative revenue estimate based on the CI's lower bound.",
        "analystNote": "Executives want one number for a slide. I give them the interval anyway, because planning off the point estimate alone is how a modest, real win gets oversold into a target nobody hits."
      },
      {
        "title": "Did Support Volume Change?",
        "chapter": 5,
        "narrative": "After rollout, the support team asks whether the new checkout flow generated more confused-customer tickets. You model daily ticket counts as a Poisson process to compare rates before and after.",
        "nodeIds": [
          "poisson"
        ],
        "realData": {
          "before rate": "λ = 4.1 tickets/day",
          "after rate": "λ = 4.6 tickets/day",
          "observed after (30 days)": "138 tickets",
          "expected under old rate": "123"
        },
        "interpretation": "A modest, plausible increase in support volume — worth monitoring but not alarming given typical day-to-day count variability.",
        "question": "Why is the Poisson distribution the right model for daily support-ticket counts?",
        "choices": [
          "Because ticket counts are always normally distributed",
          "Because tickets are discrete, relatively rare events occurring independently over a fixed time period (a day) at a roughly constant average rate — the classic Poisson setup",
          "Because the sample size is too small for a t-test",
          "Poisson only applies to manufacturing defect data"
        ],
        "correct": 1,
        "hint": "Poisson fits counts of independent, relatively rare events over a fixed interval — calls per hour, defects per unit, or tickets per day are the textbook cases.",
        "explanation": "Daily support tickets are discrete counts of relatively infrequent, roughly independent events — exactly the situation the Poisson distribution was built for, the same logic used for call-center or defect-rate modeling.",
        "outcome": "Support volume rose modestly (4.1 to 4.6/day) — flagged for monitoring, not treated as a rollout-blocking problem.",
        "analystNote": "A raw jump from 123 expected to 138 observed tickets sounds alarming in a Slack message. Modeled properly as a Poisson process, it is a small, plausible fluctuation — framing matters as much as the number itself."
      },
      {
        "title": "What Is a Converted Customer Worth?",
        "chapter": 10,
        "narrative": "Finance wants a dollar figure for the redesign. You build a regression model predicting 90-day customer lifetime value (LTV) from checkout-flow engagement signals, and produce a prediction interval for one new customer's expected value.",
        "nodeIds": [
          "reg",
          "pred_int"
        ],
        "realData": {
          "equation": "LTV = $18 + $34 × (engagement score)",
          "for one new customer": "predicted LTV = $86",
          "95% prediction interval": "($41, $131)"
        },
        "interpretation": "A useful point prediction for planning, but individual customers vary enormously — the interval is wide by design.",
        "question": "Why use a PREDICTION interval ($41–$131) instead of a confidence interval for this specific new customer?",
        "choices": [
          "They are interchangeable — either works fine",
          "A prediction interval is required for a single future individual because it must account for that customer's own variability on top of the regression line's uncertainty — always wider than a CI for the mean",
          "Prediction intervals are only used in manufacturing",
          "The CI would give a narrower, more useful answer for this exact purpose"
        ],
        "correct": 1,
        "hint": "A confidence interval bounds the AVERAGE LTV of many similar customers; a prediction interval bounds ONE specific customer's LTV, which is inherently less certain.",
        "explanation": "Because finance is asking about one individual customer, not the average of many, the prediction interval is the only honest choice — it is always wider than a confidence interval for the same regression because it adds individual-level noise on top of estimation uncertainty.",
        "outcome": "Predicted LTV $86, 95% PI ($41, $131). Finance builds rollout ROI model around the interval, not just the point estimate.",
        "analystNote": "Reporting only \"$86\" to finance invites them to multiply it by user count and call it a forecast. The prediction interval is what stops that overconfident math from happening."
      },
      {
        "title": "Time on Task, Without Assuming Normality",
        "chapter": 13,
        "narrative": "A UX researcher wants to compare how long users spend on the new checkout page versus the old one. Task-completion times are famously right-skewed, so a t-test is risky here.",
        "nodeIds": [
          "wrs"
        ],
        "realData": {
          "old flow median": "52 sec",
          "new flow median": "38 sec",
          "test": "Wilcoxon Rank-Sum",
          "z": "−3.42",
          "p": "<0.001"
        },
        "interpretation": "A significant reduction in time-on-task — the new flow is genuinely faster to complete, not just less error-prone.",
        "question": "Why choose the Wilcoxon Rank-Sum test over an independent two-sample t-test for time-on-task data?",
        "choices": [
          "The Wilcoxon test requires fewer users",
          "Task-completion times are typically right-skewed with occasional extreme outliers (a confused user taking 5 minutes) — the rank-based test is more robust to that violation of normality than the t-test",
          "Wilcoxon and t-test always give identical results",
          "The t-test cannot be computed on time data at all"
        ],
        "correct": 1,
        "hint": "Right-skewed data with occasional extreme values is the classic case where converting to ranks protects your conclusion from a handful of outliers.",
        "explanation": "Time-on-task data almost always has a long right tail — most users finish quickly, a few get stuck and take far longer. The Wilcoxon Rank-Sum test compares the two groups by rank, which keeps a handful of extreme, confused-user sessions from distorting the whole comparison.",
        "outcome": "New checkout flow significantly faster to complete (z = −3.42, p < 0.001). Combined with the conversion lift, redesign fully validated. 💻",
        "analystNote": "Every metric in this investigation — conversion, support load, revenue, task time — asked a slightly different statistical question and needed a different tool. That is the real skill: not memorizing formulas, but recognizing which question you are actually being asked."
      }
    ]
  },
  {
    "id": "ecology",
    "icon": "🌲",
    "title": "Field Ecologist",
    "sub": "Cataloging a Newly Discovered Forest Reserve",
    "intro": "A biodiversity survey team has three weeks to catalog every tree, estimate population parameters, and calculate species encounter probabilities in a newly discovered forest reserve before a logging-permit decision.",
    "steps": [
      {
        "title": "Grouping the First Samples",
        "chapter": 2,
        "narrative": "Your team has measured trunk diameters for 340 trees across 12 plots. Too many raw numbers to present to the permit board — you need a frequency table, and every class needs one representative value and a share of the whole.",
        "nodeIds": [
          "midpoint",
          "pie_deg",
          "range2"
        ],
        "realData": {
          "n": 340,
          "diameter range": "4–112 cm",
          "classes": "8 classes of 14 cm width",
          "largest class": "31% of trees"
        },
        "interpretation": "Grouping collapses 340 raw measurements into 8 readable classes, each represented by its midpoint for every later calculation.",
        "question": "Diameters range from 4 to 112 cm across 8 classes. To later compute a grouped mean, what represents each class?",
        "choices": [
          "The class width alone",
          "The class midpoint — the average of each class's lower and upper boundary",
          "The largest value in the class",
          "The class label only"
        ],
        "correct": 1,
        "hint": "Once data is binned into a class, the individual raw values are gone. What single number best stands in for everyone in that class?",
        "explanation": "The midpoint — (lower + upper)/2 — is the standard working approximation for every value inside a class, since the raw measurements are no longer individually available once binned.",
        "outcome": "8 classes, each anchored to a midpoint. The species-composition pie chart converts each species' share into degrees: (f/n) × 360°. Range confirms an initial spread of 108 cm before any deeper analysis.",
        "analystNote": "Grouping loses information — that's the tradeoff for readability. I always report class width alongside any grouped statistic, so a reviewer knows how coarse the approximation is."
      },
      {
        "title": "Population or Sample?",
        "chapter": 3,
        "narrative": "The reserve has exactly 340 trees — a fixed, fully counted population, not a sample from a larger forest. But your 12 plots' worth of undergrowth density readings are a sample of a much larger, ongoing ecological process.",
        "nodeIds": [
          "mu",
          "grp_mean",
          "midrange"
        ],
        "realData": {
          "tree count (full census)": 340,
          "population mean μ": "38.4 cm",
          "undergrowth sample midrange": "(2.1 + 14.6)/2 = 8.35"
        },
        "interpretation": "Because every tree in the reserve was measured, its mean is a true population parameter μ — not an estimate.",
        "question": "You measured every single tree in the reserve — all 340. What kind of average is this?",
        "choices": [
          "A sample mean X̄, since fieldwork always involves sampling",
          "A population mean μ, because you captured the entire finite population",
          "Neither — averages only apply to samples",
          "A weighted mean, since some trees are older"
        ],
        "correct": 1,
        "hint": "Sample vs. population is not about fieldwork difficulty — it is about whether you measured everyone or a subset.",
        "explanation": "When every member of a finite, well-defined population is measured — here, literally every tree in the reserve — the result is a population parameter, μ, not an estimate. The undergrowth density readings, by contrast, are a sample (grp_mean/midrange apply as quick estimates), since new growth is an ongoing process you can't fully census.",
        "outcome": "μ = 38.4 cm for the tree census — a defensible, exact figure for the permit board. Undergrowth midrange gives a fast rough estimate: 8.35 before the full analysis is ready.",
        "analystNote": "Regulators love hearing \"population parameter\" — it means no sampling error at all for that number. I make the population/sample distinction explicit in every report, because conflating the two overstates or understates our certainty."
      },
      {
        "title": "How Much Do Trees Vary?",
        "chapter": 3,
        "narrative": "The permit board wants to know: is this a uniform young forest, or a wildly varied old-growth mix? Center alone cannot answer that — you need spread, computed the right way for a census versus a sample.",
        "nodeIds": [
          "pop_var",
          "samp_var",
          "pop_sd",
          "grp_sd"
        ],
        "realData": {
          "population variance σ²": "287.4 cm²",
          "population SD σ": "16.9 cm",
          "grouped-data SD (undergrowth)": "3.1"
        },
        "interpretation": "A population SD of 16.9 cm on a mean of 38.4 cm signals real structural diversity — consistent with old-growth forest, not a plantation.",
        "question": "Since you have the full tree census (not a sample), which denominator is correct for computing the variance?",
        "choices": [
          "n − 1, always, to avoid bias",
          "N, because dividing by the true population size introduces no bias when you have the whole population",
          "n, but only for even sample sizes",
          "It does not matter which denominator you use"
        ],
        "correct": 1,
        "hint": "The n−1 correction exists specifically to fix a bias that appears when ESTIMATING from a sample. Does that bias exist when you have the full population?",
        "explanation": "Population variance divides by N because there is no estimation bias to correct — you have every value. Sample variance divides by n−1 specifically because dividing by n would systematically underestimate the true population variance when working from a subset.",
        "outcome": "σ² = 287.4 cm², σ = 16.9 cm confirms real size diversity — strong evidence for the \"old-growth, protect it\" argument. The grouped-data SD formula backs up the undergrowth sample findings.",
        "analystNote": "Getting N vs n−1 wrong is the single most common statistics error I catch in junior reports. It is a small formula difference with a real consequence: it changes whether your spread estimate is honest or biased low."
      },
      {
        "title": "A Sanity Check and a Guarantee",
        "chapter": 3,
        "narrative": "Before submitting σ = 16.9 cm, your supervisor wants two things: a two-second gut check that the number is plausible, and a guarantee that holds no matter how oddly shaped the diameter distribution turns out to be.",
        "nodeIds": [
          "rrt",
          "cheby"
        ],
        "realData": {
          "range": "108 cm",
          "range/4 estimate": "27 cm",
          "actual σ": "16.9 cm",
          "Chebyshev k=2": "at least 75% of trees within 2σ"
        },
        "interpretation": "The rough Range Rule estimate (27 cm) is in the right ballpark of the true σ (16.9 cm) — no red flag, though the true value is more precise.",
        "question": "You are not sure the diameters follow a bell curve. What tool guarantees a minimum proportion of trees within k standard deviations, for ANY distribution shape?",
        "choices": [
          "The Range Rule of Thumb",
          "Chebyshev's Theorem — 1 − 1/k² applies regardless of distribution shape",
          "The z-score formula",
          "The normal distribution table"
        ],
        "correct": 1,
        "hint": "One of these two tools is a fast estimate assuming near-normal data. The other makes no assumption about shape at all.",
        "explanation": "Chebyshev's Theorem holds for any distribution — skewed, bimodal, anything — guaranteeing at least 1−1/k² of values fall within k standard deviations. The Range Rule of Thumb is only a quick, rough approximation that assumes a roughly bell-shaped spread.",
        "outcome": "Range/4 ≈ 27 cm roughly matches the computed σ = 16.9 cm as a sanity check. Chebyshev confirms at least 75% of all trees fall within 2σ of the mean — a defensible guarantee for the report regardless of the true distribution shape.",
        "analystNote": "I use the Range Rule as a five-second arithmetic-error detector, never as a real estimate. Chebyshev is the opposite: slow to compute by hand, but it is the only guarantee I can defend under cross-examination when I am not sure the data is normal."
      },
      {
        "title": "Finding the Old-Growth Quartile",
        "chapter": 3,
        "narrative": "The board specifically wants to know about the largest 25% of trees — the old-growth core most worth protecting. You need to locate that boundary in your sorted diameter list, and summarize its spread.",
        "nodeIds": [
          "c_val",
          "iqr"
        ],
        "realData": {
          "n": 340,
          "Q3 position": "c = 340 × 75/100 = 255",
          "Q3 value": "52 cm",
          "Q1 value": "24 cm",
          "IQR": "28 cm"
        },
        "interpretation": "The middle 50% of trees span a 28 cm range — the IQR is the standard, outlier-resistant way to describe that spread.",
        "question": "You need to find the value at the 75th percentile (Q3) in your sorted list of 340 diameters. What position do you look at?",
        "choices": [
          "Position 75",
          "c = n × (p/100) = 340 × 0.75 = position 255",
          "Position 340 − 75 = 265",
          "The 75th largest value only if n = 100"
        ],
        "correct": 1,
        "hint": "The percentile formula scales the desired percentile by your actual sample size — it is not a fixed position number.",
        "explanation": "c = n·p/100 locates the position in the sorted dataset for any percentile p. For Q3 (75th percentile) with n=340: c = 340 × 0.75 = 255th position.",
        "outcome": "Q3 = 52 cm, Q1 = 24 cm, IQR = 28 cm. The board gets a boxplot showing the old-growth core, resistant to the handful of unusually small or large outlier trees.",
        "analystNote": "IQR is what I reach for whenever a stakeholder might over-focus on one dramatic outlier tree. It describes the \"typical middle\" honestly without letting one 4 cm sapling or one 112 cm giant distort the story."
      },
      {
        "title": "The Odds of a Rare Sighting",
        "chapter": 4,
        "narrative": "A volunteer spots a red-listed salamander — the first record for this reserve. Before celebrating, you need to separate what theory predicts from what you actually observed, and know how to rule it out entirely.",
        "nodeIds": [
          "class_p",
          "emp_p",
          "comp_p"
        ],
        "realData": {
          "theoretical habitat coverage": "1 species per 40 known niches",
          "observed sightings": "3 in 200 plot-visits",
          "empirical P": "3/200 = 0.015"
        },
        "interpretation": "The empirical sighting rate (1.5%) is what actually happened in the field — it does not need to match any theoretical assumption.",
        "question": "You want the probability of NOT sighting the salamander on any given plot visit, given P(sighting) = 0.015. What do you compute?",
        "choices": [
          "0.015 × 0.015",
          "1 − 0.015 = 0.985, the complement rule",
          "0.015 / 200",
          "You cannot compute this without more data"
        ],
        "correct": 1,
        "hint": "An event and \"not that event\" together must account for 100% of possibilities.",
        "explanation": "The complement rule states P(not E) = 1 − P(E). Since P(sighting) = 0.015, P(no sighting on a visit) = 1 − 0.015 = 0.985 — directly, with no new data needed.",
        "outcome": "Empirical sighting probability: 1.5% per visit. 98.5% of visits will show nothing — which is exactly why the first confirmed sighting matters so much for the report.",
        "analystNote": "Classical probability assumes a known, symmetric process — like a fair die. Wildlife sightings almost never work that way, so I lean on empirical, observed frequencies whenever real field data is available instead of theoretical assumptions."
      },
      {
        "title": "Two Rare Species in One Season",
        "chapter": 4,
        "narrative": "A second team, working an adjacent grid, is independently tracking a rare owl. The board asks: what is the chance BOTH rare species get confirmed sightings this season, and how does catching one change the odds for the other on the same day?",
        "nodeIds": [
          "add1",
          "add2",
          "mult1",
          "mult2",
          "cond_p"
        ],
        "realData": {
          "P(salamander season)": "0.35",
          "P(owl season)": "0.20",
          "P(both, independent)": "0.35 × 0.20 = 0.07",
          "P(owl | salamander seen same day)": "0.42 (habitat overlap)"
        },
        "interpretation": "Because the two species use overlapping habitat, seeing one on a given day RAISES the conditional probability of seeing the other that same day — they are not independent within a single day's survey.",
        "question": "Across the whole season the two sighting events are independent (0.35 × 0.20 = 0.07). But on any SINGLE day, spotting the salamander raises P(owl) to 0.42. What does this tell you?",
        "choices": [
          "The formulas contradict each other — one must be wrong",
          "Independence can hold at the season level while the same events are dependent at the single-day level, due to shared daily habitat conditions",
          "Conditional probability only applies to card games",
          "You should always use the multiplication rule for independent events, never conditional probability"
        ],
        "correct": 1,
        "hint": "Independence is a property of a SPECIFIC pair of events under SPECIFIC conditions — not a universal fact about two species.",
        "explanation": "These are two different questions at two different scales: season-long sighting counts happen to multiply out independently, but day-to-day, both species respond to the same weather and habitat conditions, creating real same-day dependence — exactly what conditional probability, P(B|A) = P(A∩B)/P(A), is built to capture.",
        "outcome": "Season-long joint probability: 7%. Same-day conditional probability once one is spotted: 42% — a genuinely useful number for scheduling future survey days.",
        "analystNote": "The addition and multiplication rules are simple, but real ecological data breaks the \"independent events\" assumption constantly. I always test for conditional dependence before reporting a joint probability as if the events were unrelated."
      },
      {
        "title": "How Many Ways to Tag a Grid?",
        "chapter": 4,
        "narrative": "Camera traps need to be assigned to survey plots. The board wants to know how many possible camera layouts exist, and how many distinct 4-camera teams can be pulled from your 10 available units.",
        "nodeIds": [
          "fcr",
          "perm",
          "perm2",
          "comb"
        ],
        "realData": {
          "camera models": "3",
          "plot types": "4",
          "orientations": "2",
          "total layout combos (FCR)": "3×4×2 = 24",
          "ways to pick 4 of 10 cameras (order matters)": "nPr = 5,040",
          "ways to pick 4 of 10 cameras (order irrelevant)": "nCr = 210"
        },
        "interpretation": "Whether order matters changes the count by a factor of 4! (24×) — a critical distinction when the board asks \"how many ways\" without specifying which they mean.",
        "question": "You need to select 4 cameras from 10 available units to deploy — the cameras are functionally identical, so which specific 4 get chosen is all that matters, not an assigned order. Which formula applies?",
        "choices": [
          "nPr = 10!/(10−4)! = 5,040, since order always matters in fieldwork",
          "nCr = 10!/[(10−4)!×4!] = 210, because you only care WHICH 4 are selected, not an order",
          "The Fundamental Counting Rule alone",
          "10 × 4 = 40"
        ],
        "correct": 1,
        "hint": "Would relabeling \"camera A, then B, then C, then D\" as \"camera D, then C, then B, then A\" change the actual field deployment?",
        "explanation": "Since the 4 selected cameras are simply deployed as a set — no ranking or sequence assigned — order does not matter, making this a combination: nCr = 210 possible 4-camera teams. If you needed to also assign each of the 4 to a SPECIFIC plot in a specific order, you would use nPr = 5,040 instead.",
        "outcome": "24 possible individual camera layout configurations (Fundamental Counting Rule). 210 distinct 4-camera teams available (combination) if a strict deployment order were required instead, that number would jump to 5,040 (permutation).",
        "analystNote": "The permutation-vs-combination question sounds academic until a field coordinator asks \"how many crews can I build\" and you give them a number 24 times too large because you forgot order didn't matter. I always ask \"does swapping the order change the real-world outcome?\" before picking a formula."
      },
      {
        "title": "Modeling the Species Count",
        "chapter": 5,
        "narrative": "Final task: build a predictive model. How many salamanders should you expect to find if you set 50 traps? What is the spread around that expectation? And if you catch-and-release without replacement from a known local cluster, how does that change the odds?",
        "nodeIds": [
          "disc_mu",
          "binom_sd",
          "multi",
          "hypgeo",
          "geometric"
        ],
        "realData": {
          "traps set": 50,
          "per-trap success rate": "0.08",
          "expected catches (μ)": "4.0",
          "binomial SD": "1.92",
          "genetic ratio test (multinomial)": "4 morphs observed vs 9:3:3:1 expected",
          "cluster of 15 with 6 tagged, draw 5 (hypergeometric)": "no replacement",
          "first catch on trial (geometric)": "expected trial ≈ 12.5"
        },
        "interpretation": "Expected catches (μ=4.0) with SD=1.92 means catching anywhere from 2 to 6 salamanders would be unsurprising — useful for setting realistic field expectations before the season starts.",
        "question": "You are sampling 5 salamanders from a known local cluster of 15, where 6 are already tagged, WITHOUT putting any back after each catch. Which distribution models the number of tagged individuals you recatch?",
        "choices": [
          "Binomial, since each catch is a yes/no trial",
          "Hypergeometric, because sampling without replacement from a finite population changes the odds after each draw",
          "Poisson, because catches happen over time",
          "Geometric, because you are waiting for the first tagged catch"
        ],
        "correct": 1,
        "hint": "Binomial assumes each trial has the same, unchanging probability. Does removing an animal from a finite population of 15 without replacing it change the odds for the next draw?",
        "explanation": "Once an animal is caught and NOT released back into the pool of 15, the probability of catching a tagged one on the next draw changes — that dependency across draws is exactly what the hypergeometric distribution is built to model, unlike the binomial's fixed-probability assumption.",
        "outcome": "Expected total catches: μ = 4.0 salamanders, SD = 1.92. The multinomial test on 4 color morphs will check against the classic 9:3:3:1 genetic ratio. Hypergeometric modeling of the tag-recapture cluster, and geometric modeling of \"trials until first catch,\" round out the season's statistical toolkit for the final report.",
        "analystNote": "Picking the wrong discrete distribution is an easy mistake with real consequences — using binomial instead of hypergeometric for a small, finite, no-replacement population will understate how much the odds shift as you sample. I always ask: is the population effectively infinite (binomial is fine), or small and shrinking as I sample (hypergeometric required)?"
      }
    ]
  },
  {
    "id": "aerospace",
    "icon": "🚀",
    "title": "Aerospace Reliability Engineer",
    "sub": "Certifying a New Rocket Component Before Launch",
    "intro": "A propulsion valve must be certified reliable before a scheduled launch. You have six weeks, a batch of test units, and a simulation budget — and zero tolerance for a wrong statistical call.",
    "steps": [
      {
        "title": "Standardizing the Tolerance Spec",
        "chapter": 6,
        "narrative": "The valve's seal pressure must fall within a certified range. Engineering gives you the population mean and SD from thousands of historical units — you need to convert today's test reading onto that standard scale, and reverse it to find the exact cutoff pressure for rejection.",
        "nodeIds": [
          "znorm",
          "x_from_z"
        ],
        "realData": {
          "population μ": "412 kPa",
          "population σ": "9 kPa",
          "today's test unit": "429 kPa",
          "z": "(429−412)/9 = 1.89",
          "reject cutoff (z = −3)": "X = −3(9)+412 = 385 kPa"
        },
        "interpretation": "z = 1.89 means today's unit is within the normal operating envelope — notable but not yet a rejection-level outlier.",
        "question": "Engineering sets a hard reject threshold at z = −3.0. What is the actual seal pressure, in kPa, that corresponds to that cutoff?",
        "choices": [
          "385 kPa, using X = zσ + μ = −3(9) + 412",
          "403 kPa",
          "9 kPa",
          "You cannot convert a z-score back to raw units"
        ],
        "correct": 0,
        "hint": "You have z, σ, and μ. Which formula solves for X directly, reversing the standardization?",
        "explanation": "X = zσ + μ is the algebraic reverse of z = (X−μ)/σ. Plugging in z=−3, σ=9, μ=412 gives X = −27 + 412 = 385 kPa — any unit reading below this is auto-rejected.",
        "outcome": "Today's unit (429 kPa, z=1.89) passes comfortably. The hard reject line is now documented at exactly 385 kPa for the whole test floor to use without recomputing.",
        "analystNote": "Converting the abstract z cutoff back into an actual kPa number the floor technicians can read off a gauge is what makes a statistical spec USABLE. A z-score is precise for me; a kPa number is what actually gets used correctly at 2am during a test run."
      },
      {
        "title": "How Precise Is the Batch Average?",
        "chapter": 6,
        "narrative": "You test 36 valves from the new production batch. Individual units vary, but what matters for certification is how precisely the SAMPLE MEAN estimates the true batch performance — and whether you can even assume that sample mean behaves normally.",
        "nodeIds": [
          "mu_xbar",
          "sem",
          "clt"
        ],
        "realData": {
          "n": 36,
          "sample X̄": "411.2 kPa",
          "population σ": "9 kPa",
          "SEM": "9/√36 = 1.5 kPa",
          "individual unit distribution": "mildly skewed"
        },
        "interpretation": "Even though individual valve pressures are mildly skewed, the Central Limit Theorem guarantees the sampling distribution of X̄ (n=36) is approximately normal — unlocking every z-based test that follows.",
        "question": "Individual valve readings are mildly skewed, not perfectly normal. With n = 36, can you still treat the sampling distribution of X̄ as approximately normal?",
        "choices": [
          "No — any skew in the raw data invalidates all further z-based analysis",
          "Yes — the Central Limit Theorem guarantees X̄ approaches a normal distribution as n grows, even from a skewed population",
          "Only if you first prove the raw data is perfectly normal",
          "The CLT only applies to proportions, not measurements"
        ],
        "correct": 1,
        "hint": "What is the entire point of the Central Limit Theorem — what does it let you assume about X̄ regardless of the shape of the original population?",
        "explanation": "The CLT states that the sampling distribution of X̄ approaches normality as n increases, REGARDLESS of the shape of the underlying population — this is what makes X̄ = 411.2 usable in z-based certification tests even though individual valves are skewed.",
        "outcome": "μ_X̄ = μ = 412 kPa (unbiased). SEM = 1.5 kPa — tight enough for a confident engineering call. The CLT justifies treating this batch's sample mean as normally distributed for every test that follows.",
        "analystNote": "The CLT is the quiet workhorse behind nearly every certification test I run. I don't need the raw valve-pressure distribution to be normal — I need the SAMPLE MEAN's distribution to be normal, and with n=36 the CLT delivers that almost regardless of the raw shape."
      },
      {
        "title": "A Second Confidence Interval, Two Ways",
        "chapter": 7,
        "narrative": "Engineering wants the batch's true mean pressure bracketed with 95% confidence — and separately, a defensible range for the batch's true variability, not just its center.",
        "nodeIds": [
          "z_ci",
          "sd_ci"
        ],
        "realData": {
          "z 95% CI for μ": "411.2 ± 1.96(1.5) = [408.3, 414.1] kPa",
          "n": 36,
          "sample SD s": "8.7 kPa",
          "95% CI for σ": "[7.1, 11.3] kPa"
        },
        "interpretation": "Both intervals are tight enough to support certification: the true mean is almost certainly between 408 and 414 kPa, and true variability is bounded well within spec.",
        "question": "Why use the z confidence interval for the mean here, given population σ = 9 kPa is already known from thousands of historical units, rather than the t-interval?",
        "choices": [
          "The t-interval is always more accurate, so it should always be preferred",
          "The z-interval is appropriate specifically because σ is known from extensive historical data — the t-interval exists for when σ must be estimated from the sample itself",
          "z and t intervals are interchangeable in every situation",
          "Because n=36 is too large for a t-interval"
        ],
        "correct": 1,
        "hint": "What specific piece of information does the t-distribution exist to compensate for not having?",
        "explanation": "The t-interval's wider critical values exist specifically to account for the EXTRA uncertainty of estimating σ from a sample. When σ is genuinely known — as here, from a massive historical population — the z-interval is the more precise, appropriate choice.",
        "outcome": "95% CI for μ: [408.3, 414.1] kPa — comfortably within spec. 95% CI for σ: [7.1, 11.3] kPa, confirming batch consistency is also within acceptable engineering tolerance.",
        "analystNote": "Certification reports live or die on defensible intervals, not point estimates. A single \"411.2 kPa\" invites the question \"how sure are you?\" — the confidence interval answers it directly, for both the center AND the spread."
      },
      {
        "title": "Comparing Two Production Lines",
        "chapter": 9,
        "narrative": "Two separate manufacturing lines produced valves for this launch. Both have long, well-documented historical σ values. The question: do the two lines produce meaningfully different average seal pressures?",
        "nodeIds": [
          "z2mu"
        ],
        "realData": {
          "Line A: n₁=40, X̄₁": "412.1 kPa, σ₁=9",
          "Line B: n₂=35, X̄₂": "408.6 kPa, σ₂=8.5",
          "z": "2.34",
          "p": "0.019"
        },
        "interpretation": "z=2.34, p=0.019 — the two lines are significantly different at α=0.05, which changes how the certification team weights units from each line.",
        "question": "Both lines have long-established, known population σ values from historical manufacturing records. Which test compares their means?",
        "choices": [
          "Paired t-test, since both lines make the same part",
          "Two-sample z-test for means, since both σ₁ and σ₂ are known from extensive history",
          "Chi-square test of independence",
          "One-sample t-test on the pooled data"
        ],
        "correct": 1,
        "hint": "This is comparing two INDEPENDENT groups, and the key detail is that variability for both is already well established, not estimated from this test's sample alone.",
        "explanation": "When both population standard deviations are known — a realistic situation for a mature production line with a long calibration history — the two-sample z-test for means is the correct, most powerful tool, rather than estimating spread from the current samples via a t-test.",
        "outcome": "z = 2.34, p = 0.019 — Line A and Line B are statistically significantly different. Certification proceeds, but the report now flags Line B for a process review before the next batch.",
        "analystNote": "Finding a significant difference between two \"identical\" production lines is exactly the kind of quiet, undramatic result that prevents a bigger problem later. Nobody sees a rocket not fail — that is the whole point of a reliability program."
      },
      {
        "title": "Three Batches, One Question",
        "chapter": 12,
        "narrative": "A third supplier now provides valves too. Before mixing three sources into one launch inventory, mission assurance needs to know: does the true average seal pressure differ across ALL three, considering two design factors (supplier AND temperature-treatment method) at once?",
        "nodeIds": [
          "grand_mn",
          "anova2"
        ],
        "realData": {
          "grand mean (all 3 suppliers)": "410.8 kPa",
          "suppliers": 3,
          "treatment methods": 2,
          "F(supplier)": "4.1, p=0.02",
          "F(treatment)": "1.3, p=0.28",
          "F(interaction)": "3.9, p=0.03"
        },
        "interpretation": "A significant interaction effect (p=0.03) means the effect of treatment method actually DEPENDS on which supplier made the valve — a one-factor ANOVA would have completely missed this.",
        "question": "The F-test for the supplier×treatment INTERACTION is significant (p=0.03), separate from the individual supplier and treatment effects. What does a significant interaction mean here?",
        "choices": [
          "It is a computational error and should be ignored",
          "The effect of the treatment method is not the same across all suppliers — it depends on which supplier made the part",
          "It means neither factor matters at all",
          "Interaction effects only apply to medical studies"
        ],
        "correct": 1,
        "hint": "An interaction effect means the two factors do not act independently — the size (or direction) of one factor's effect changes depending on the level of the other factor.",
        "explanation": "A significant two-way ANOVA interaction (F=3.9, p=0.03) means the treatment method's effect on seal pressure is NOT consistent across suppliers — perhaps Supplier A benefits from the heat treatment while Supplier C does not. This is exactly the kind of finding a simpler one-factor test would miss entirely.",
        "outcome": "Grand mean across all 3 suppliers: 410.8 kPa. Significant supplier effect AND a significant interaction — mission assurance now requires supplier-specific treatment protocols rather than one uniform process.",
        "analystNote": "The interaction term is the reason I almost always push for a two-way design over two separate one-way tests when there is any chance the factors might not act independently. Missing an interaction effect here could mean shipping valves treated the wrong way for their specific supplier."
      },
      {
        "title": "When You Cannot Trust the Bell Curve",
        "chapter": 13,
        "narrative": "A last-minute batch of 9 valves shows a suspicious pattern under X-ray inspection — possibly non-normal, too small a sample to check properly. You need a test that does not assume a bell curve, and a way to check whether a whole SET of pass/fail results is even plausible under the certified defect rate.",
        "nodeIds": [
          "sign_z",
          "kw"
        ],
        "realData": {
          "sign test n": 9,
          "above/below spec median": "7 above, 2 below",
          "p-value (sign test)": "0.09",
          "Kruskal-Wallis across 3 suppliers (ranks)": "H=6.8, df=2, p=0.033"
        },
        "interpretation": "With only 9 units and no normality guarantee, the sign test is deliberately conservative — it only uses the DIRECTION of each deviation from spec, discarding magnitude information for robustness.",
        "question": "With just 9 units and visible irregularity under X-ray, why choose the sign test over a standard t-test here?",
        "choices": [
          "The sign test is always more powerful than the t-test",
          "The sign test makes no assumption about the distribution's shape — it only uses whether each value is above or below the target, which is safer with a small, possibly non-normal sample",
          "The t-test cannot be used on sample sizes below 30 under any circumstances",
          "Sign tests are only for medical data"
        ],
        "correct": 1,
        "hint": "What does the t-test assume about the underlying population that a sign test does not need to assume at all?",
        "explanation": "The sign test only requires knowing whether each observation is above or below a target value — no assumption about the distribution's shape. With n=9 and visible irregularity, that robustness is worth more than the extra power a t-test would offer IF its normality assumption held.",
        "outcome": "Sign test: 7 of 9 above spec median, p=0.09 — inconclusive, triggering a manual inspection hold rather than an automatic pass. Kruskal-Wallis confirms a significant rank-based difference across the three suppliers (p=0.033), reinforcing the earlier ANOVA finding without assuming normality.",
        "analystNote": "When a sample is small AND visibly irregular, reaching for the \"safe\" nonparametric test is not overcaution — it is the only defensible choice. A t-test's extra power is worthless if its core assumption is false."
      },
      {
        "title": "Simulating the Launch-Day Odds",
        "chapter": 14,
        "narrative": "The final report needs one number the mission director actually wants: the probability that ALL 6 valves on the vehicle perform within spec simultaneously on launch day. The interactions between valves are too complex to solve with a closed-form formula — so you simulate it.",
        "nodeIds": [
          "sim_mean",
          "mc_prob",
          "mc_steps"
        ],
        "realData": {
          "trials": 100000,
          "valves per vehicle": 6,
          "simulated all-pass rate": "94.2%",
          "simulation mean pressure": "410.9 kPa (close to theoretical μ=412)"
        },
        "interpretation": "Across 100,000 simulated launches, all 6 valves perform within spec 94.2% of the time — a single defensible number built from the individually-certified distributions, not a guess.",
        "question": "You need P(all 6 valves pass simultaneously), accounting for correlated environmental effects between valves that make a closed-form probability formula impractical. What is the correct approach?",
        "choices": [
          "Multiply each valve's individual pass probability together, assuming independence",
          "Run a Monte Carlo simulation: repeatedly sample all 6 valves' correlated pressures from their fitted distributions and record how often all 6 land in spec",
          "Just use the single lowest individual valve pass rate",
          "This cannot be estimated statistically"
        ],
        "correct": 1,
        "hint": "The valves are NOT independent — shared environmental conditions on launch day affect all 6 together. Which method handles that correlation without requiring a closed-form formula?",
        "explanation": "Monte Carlo simulation is precisely the tool for exactly this situation: correlated, complex systems where a clean formula does not exist. By repeatedly sampling all 6 valves together (respecting their correlation) and tallying the \"all pass\" outcome across thousands of trials, you get an empirical probability that a simple independence-assuming multiplication would get wrong.",
        "outcome": "Simulated all-6-pass probability: 94.2% across 100,000 trials, using the 5-step Monte Carlo procedure (define outcomes → assign probabilities → map to random digits → sample → compute). The mission director gets one clear, defensible number for the go/no-go briefing.",
        "analystNote": "Every simulation-based number I hand to a mission director gets the trial count attached — \"94.2% across 100,000 trials\" is a very different claim than \"94.2% across 100.\" The trial count IS the credibility of the estimate, and I never let that get lost on the way to a summary slide."
      }
    ]
  }
];
