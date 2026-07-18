import { links } from './links.js';

export const PREREQ_CHAINS = {
  "t_test": {
    "chain": [
      "x_bar",
      "samp_sd",
      "zscore",
      "sem",
      "t_test"
    ],
    "scenario": "Clinical trial comparing a new drug vs placebo (n=22, σ unknown)",
    "why": {
      "x_bar": "Without the sample mean, you have no center point to compare. It is the foundation of every test statistic.",
      "samp_sd": "Without measuring spread, you cannot know if a 5-point difference is meaningful noise or a real signal.",
      "zscore": "z-Score standardizes your data to a common scale — the conceptual template for all test statistics.",
      "sem": "Standard Error shows how much the sample mean varies across repeated samples — it is the denominator of your test.",
      "t_test": "Now you can test whether the observed difference exceeds what random sampling alone would produce."
    }
  },
  "z_test": {
    "chain": [
      "x_bar",
      "pop_sd",
      "zscore",
      "sem",
      "z_test"
    ],
    "scenario": "Quality control on a production line where historical σ is known from years of data",
    "why": {
      "x_bar": "The sample mean is the observed value you will compare against the hypothesized population mean.",
      "pop_sd": "Known population SD lets you compute exact z-probabilities — a stronger statement than estimating σ.",
      "zscore": "z-Score provides the universal scale: how many standard deviations is your result from the null hypothesis?",
      "sem": "Standard Error σ/√n scales uncertainty to your specific sample size.",
      "z_test": "The z-test converts your result into a precise probability under H₀."
    }
  },
  "reg": {
    "chain": [
      "x_bar",
      "samp_sd",
      "pearson",
      "reg"
    ],
    "scenario": "Predicting monthly revenue from advertising spend for a marketing team",
    "why": {
      "x_bar": "The regression line passes through (X̄, Ȳ) — you must know the mean to anchor the line.",
      "samp_sd": "SD measures variability in both predictor and outcome, scaling the slope coefficient.",
      "pearson": "Pearson r measures the linear relationship strength. If r ≈ 0, regression is meaningless.",
      "reg": "Regression converts r into an actionable equation: for every $1 more in ads, revenue rises by $b."
    }
  },
  "chi_ind": {
    "chain": [
      "pct",
      "exp_cell",
      "chi_ind"
    ],
    "scenario": "Testing whether customer complaint rates differ across store locations",
    "why": {
      "pct": "Proportions establish baseline rates — what the table would look like if complaints were independent of location.",
      "exp_cell": "Expected cell frequencies define the null hypothesis baseline: what counts if rows and columns are truly independent.",
      "chi_ind": "Chi-square compares observed vs expected across all cells, measuring total departure from independence."
    }
  },
  "chi_gof": {
    "chain": [
      "pct",
      "exp_cell",
      "chi_gof"
    ],
    "scenario": "Testing whether a suspected loaded die follows a uniform distribution",
    "why": {
      "pct": "Theoretical proportions define what \"fitting the distribution\" means numerically.",
      "exp_cell": "Expected frequencies come from the hypothesized proportions times total n — the null model.",
      "chi_gof": "Goodness-of-fit sums standardized squared deviations to test overall distributional fit."
    }
  },
  "anova_f": {
    "chain": [
      "x_bar",
      "samp_var",
      "f_test",
      "anova_f"
    ],
    "scenario": "Comparing employee productivity across three management styles",
    "why": {
      "x_bar": "Group means are compared against the grand mean to compute between-group variance.",
      "samp_var": "Within-group (pooled) variance forms the denominator of the F ratio.",
      "f_test": "The F distribution models variance ratios — ANOVA's F follows this under H₀.",
      "anova_f": "ANOVA combines all group variances into one F ratio testing whether any group means differ."
    }
  },
  "ci_mean_t": {
    "chain": [
      "x_bar",
      "samp_sd",
      "t_test",
      "ci_mean_t"
    ],
    "scenario": "Estimating average patient recovery time from a hospital sample (σ unknown)",
    "why": {
      "x_bar": "The CI is centered on the sample mean — our best single point estimate.",
      "samp_sd": "Sample SD estimates individual variability, determining interval width.",
      "t_test": "The t-distribution accounts for estimating σ from small samples — gives wider intervals than z.",
      "ci_mean_t": "The t-CI provides a plausible range for the true population mean at your chosen confidence level."
    }
  },
  "pearson": {
    "chain": [
      "x_bar",
      "samp_sd",
      "zscore",
      "pearson"
    ],
    "scenario": "Analyzing whether daily study hours predict exam scores",
    "why": {
      "x_bar": "Pearson r computes deviations from the mean — X̄ and Ȳ anchor the calculation.",
      "samp_sd": "Standard deviations normalize deviations so r is always on a −1 to +1 scale.",
      "zscore": "Pearson r is essentially the average product of z-scores for both variables.",
      "pearson": "r captures strength and direction of linear relationship in one interpretable number."
    }
  },
  "t_dep": {
    "chain": [
      "d_bar",
      "sd_dep",
      "t_test",
      "t_dep"
    ],
    "scenario": "Pre/post blood pressure measurement for the same 18 patients",
    "why": {
      "d_bar": "Mean difference D̄ is the key outcome — how much change occurred on average?",
      "sd_dep": "SD of differences measures how consistently the treatment worked across individuals.",
      "t_test": "The paired t-test is structurally identical to a one-sample t-test applied to difference scores.",
      "t_dep": "Pairing controls for between-subject variability — the most sensitive design for pre/post data."
    }
  },
  "z_prop": {
    "chain": [
      "pct",
      "p_hat"
    ],
    "scenario": "Comparing two political polls: do support rates differ between age groups?",
    "why": {
      "pct": "Proportions establish baseline rates before you can compare them across groups.",
      "p_hat": "The sample proportion is the estimate you will test or use to build a CI."
    }
  },
  "t_r": {
    "chain": [
      "pearson"
    ],
    "scenario": "Testing whether study hours and exam scores are significantly correlated",
    "why": {
      "pearson": "You must compute r before you can test whether it is significantly different from zero."
    }
  },
  "pred_int": {
    "chain": [
      "reg",
      "se_est"
    ],
    "scenario": "Predicting one specific future customer order value from browsing time",
    "why": {
      "reg": "The regression equation gives the predicted center value.",
      "se_est": "The prediction interval adds the SE of estimate to account for individual-case variability above the regression line."
    }
  },
  "r2": {
    "chain": [
      "pearson",
      "reg"
    ],
    "scenario": "Reporting how much of disease-rate variability is explained by PM2.5 levels",
    "why": {
      "pearson": "r is the raw correlation. r² = r×r, so you must know r first.",
      "reg": "Regression and r² are always reported together — r² is the regression's explanatory power."
    }
  }
};

export function getPrereqChain(nodeId) {
  if (PREREQ_CHAINS[nodeId]) return PREREQ_CHAINS[nodeId].chain;
  return links.filter((l) => l.t === nodeId && l.type === 'prereq').map((l) => l.s);
}
