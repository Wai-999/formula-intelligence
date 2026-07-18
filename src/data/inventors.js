// Historical attribution for each formula — who first published or formalized
// it, and when. Many basic descriptive-statistics conventions (class width,
// midpoint, percentages) were never "invented" by one named person; those are
// labeled honestly as conventions rather than assigned a fabricated inventor.
export const INVENTORS = {
  // Ch 2 — Frequency Distributions
  pct: { name: 'Mathematical convention', year: '', note: 'Percentage notation dates to medieval Italian commerce; no single credited inventor.' },
  midpoint: { name: 'Mathematical convention', year: '', note: 'A standard grouped-data bookkeeping device, not attributed to one person.' },
  pie_deg: { name: 'William Playfair', year: '1801', note: 'Playfair introduced the pie chart itself in Statistical Breviary; the degree conversion is straightforward arithmetic on top of it.' },
  range2: { name: 'Mathematical convention', year: '', note: 'The simplest possible spread measure — used since data tables have existed.' },
  cwidth: { name: 'Mathematical convention', year: '', note: 'A histogram-building convention, not a named discovery.' },

  // Ch 3 — Data Description
  x_bar: { name: 'Classical antiquity', year: '', note: 'The arithmetic mean was used by Babylonian and Greek astronomers over two millennia ago; no single inventor.' },
  mu: { name: 'Classical antiquity', year: '', note: 'Same ancient origin as the sample mean, formalized as a population parameter in 19th-century statistics.' },
  grp_mean: { name: 'Mathematical convention', year: '', note: 'A direct extension of the arithmetic mean to frequency-table data.' },
  wmean: { name: 'Mathematical convention', year: '', note: 'Weighted averaging is ancient — used in commerce and astronomy long before formal statistics existed.' },
  midrange: { name: 'Mathematical convention', year: '', note: 'A simple midpoint-of-extremes measure with no single credited origin.' },
  pop_var: { name: 'Ronald Fisher', year: '1918', note: 'Fisher coined the term "variance" in his paper on Mendelian inheritance, founding the modern theory of variance decomposition.' },
  samp_var: { name: 'Ronald Fisher', year: '1918', note: 'Same paper that introduced "variance" as a formal statistical concept.' },
  pop_sd: { name: 'Karl Pearson', year: '1893', note: 'Pearson coined the term "standard deviation," replacing the older phrase "root mean square error."' },
  samp_sd: { name: 'Karl Pearson', year: '1893', note: 'Pearson coined the term; the sample (n−1) correction was refined later by Gosset and Fisher.' },
  grp_sd: { name: 'Karl Pearson', year: '1893', note: 'Extension of Pearson’s standard deviation to grouped/frequency-table data.' },
  cvar: { name: 'Karl Pearson', year: '1896', note: 'Pearson introduced the coefficient of variation to compare variability across different scales.' },
  rrt: { name: 'Statistical folklore', year: '', note: 'A teaching heuristic passed down through statistics textbooks, not a formal discovery.' },
  cheby: { name: 'Pafnuty Chebyshev', year: '1867', note: 'Chebyshev gave the general inequality; Irénée-Jules Bienaymé proved a less general version 14 years earlier, in 1853.' },
  zscore: { name: 'Karl Pearson (standardization framework)', year: 'c. 1890s', note: 'Grew out of Pearson’s work standardizing measurements against the normal curve first described by de Moivre and Gauss.' },
  pctile: { name: 'Francis Galton', year: '1880s', note: 'Galton popularized percentiles and quartiles while developing rank-based statistical methods.' },
  c_val: { name: 'Francis Galton', year: '1880s', note: 'Part of the same percentile/quartile framework Galton popularized.' },
  iqr: { name: 'Francis Galton / John Tukey', year: '1880s / 1970', note: 'Galton popularized quartiles; Tukey built the IQR into his box plot and 1.5×IQR outlier rule a century later.' },

  // Ch 4 — Probability
  class_p: { name: 'Pierre-Simon Laplace', year: '1812', note: 'Laplace formalized the classical (equally-likely-outcomes) definition of probability in Théorie analytique des probabilités.' },
  emp_p: { name: 'Richard von Mises', year: 'early 1900s', note: 'Von Mises developed the frequentist (empirical) definition of probability as a long-run relative frequency.' },
  add1: { name: 'Blaise Pascal & Pierre de Fermat', year: '1654', note: 'Their correspondence on gambling problems laid the foundation of probability theory, including the addition rule.' },
  add2: { name: 'Blaise Pascal & Pierre de Fermat', year: '1654', note: 'The general addition rule extends their original correspondence to overlapping events.' },
  mult1: { name: 'Blaise Pascal & Pierre de Fermat', year: '1654', note: 'The same 1654 correspondence established the multiplication rule for independent events.' },
  mult2: { name: 'Blaise Pascal & Pierre de Fermat', year: '1654', note: 'Extended by later probabilists to dependent events via conditional probability.' },
  cond_p: { name: 'Thomas Bayes', year: '1763', note: 'Bayes’ posthumously published essay formalized reasoning about conditional probability.' },
  comp_p: { name: 'Mathematical convention', year: '', note: 'A direct consequence of basic set theory (event and its complement sum to 1).' },
  fcr: { name: 'Classical combinatorics', year: '', note: 'Roots trace to ancient Indian and Islamic mathematics; formalized within probability by Pascal and Fermat.' },
  perm: { name: 'Classical combinatorics', year: '', note: 'Early permutation counting appears in the work of the 12th-century Indian mathematician Bhāskara II.' },
  perm2: { name: 'Classical combinatorics', year: '', note: 'A refinement of permutation counting for repeated elements, developed alongside combinatorics generally.' },
  comb: { name: 'Blaise Pascal', year: '1653', note: 'Pascal’s triangle (1653) directly encodes combination counts, though the concept is older still.' },

  // Ch 5 — Discrete Distributions
  disc_mu: { name: 'Christiaan Huygens', year: '1657', note: 'Huygens formalized expected value in the first published probability treatise, building on Pascal and Fermat.' },
  disc_var: { name: 'Ronald Fisher', year: '1918', note: 'Variance for discrete distributions follows Fisher’s general definition of the term.' },
  exp_val: { name: 'Christiaan Huygens', year: '1657', note: 'Introduced in De Ratiociniis in Ludo Aleae, the first formal probability text.' },
  binom: { name: 'Jacob Bernoulli', year: '1713', note: 'Published posthumously in Ars Conjectandi, which named and derived the binomial distribution.' },
  binom_mu: { name: 'Jacob Bernoulli', year: '1713', note: 'A direct consequence of Bernoulli’s binomial distribution.' },
  binom_sd: { name: 'Jacob Bernoulli', year: '1713', note: 'Same origin as the binomial mean, within Ars Conjectandi.' },
  multi: { name: 'Classical probability theory', year: '', note: 'A natural multi-category extension of Bernoulli’s binomial framework; no single named inventor.' },
  poisson: { name: 'Siméon Denis Poisson', year: '1837', note: 'Derived in Recherches sur la probabilité des jugements as a limiting case of the binomial distribution.' },
  hypgeo: { name: 'Classical probability theory', year: '', note: 'Developed within 18th–19th century combinatorial probability; no single credited inventor.' },
  geometric: { name: 'Classical probability theory', year: '', note: 'A natural extension of Bernoulli trials to "waiting time" problems; no single named inventor.' },

  // Ch 6 — Normal Distribution
  znorm: { name: 'Abraham de Moivre / Carl Friedrich Gauss', year: '1733 / 1809', note: 'De Moivre first derived the normal curve; Gauss formalized the distribution that now bears his name.' },
  x_from_z: { name: 'Abraham de Moivre / Carl Friedrich Gauss', year: '1733 / 1809', note: 'The inverse of the same standardization formula.' },
  mu_xbar: { name: 'Sampling theory (19th–20th c.)', year: '', note: 'A foundational sampling-distribution fact with no single credited discoverer.' },
  sem: { name: 'Karl Pearson school', year: 'early 1900s', note: 'The "standard error" terminology and concept emerged from the Pearson/Gosset/Fisher generation of statisticians.' },
  clt: { name: 'Abraham de Moivre / Pierre-Simon Laplace', year: '1733 / 1810', note: 'De Moivre proved a special case for coin flips; Laplace generalized it. Aleksandr Lyapunov gave a rigorous proof in 1901.' },

  // Ch 7 — Confidence Intervals
  z_ci: { name: 'Jerzy Neyman', year: '1937', note: 'Neyman formalized confidence-interval theory, building on earlier 1934 work.' },
  t_ci: { name: 'William Sealy Gosset ("Student") / Jerzy Neyman', year: '1908 / 1937', note: 'Gosset’s t-distribution supplies the critical values; Neyman supplied the confidence-interval framework around them.' },
  ci_mean_t: { name: 'William Sealy Gosset ("Student") / Jerzy Neyman', year: '1908 / 1937', note: 'Same combination as the t confidence interval, in explicit interval form.' },
  n_mean: { name: 'Sample-size theory (20th c.)', year: '', note: 'Derived directly from Neyman’s confidence-interval margin of error; no single named inventor.' },
  p_hat: { name: 'Mathematical convention', year: '', note: 'The natural categorical counterpart to the sample mean.' },
  p_ci: { name: 'Jerzy Neyman', year: '1937', note: 'Neyman’s confidence-interval framework applied to proportions.' },
  n_prop: { name: 'Sample-size theory (20th c.)', year: '', note: 'Derived from Neyman’s framework; no single named inventor.' },
  var_ci: { name: 'Friedrich Robert Helmert / Jerzy Neyman', year: '1876 / 1937', note: 'Helmert first derived the chi-square distribution used here; Neyman supplied the confidence-interval logic.' },
  sd_ci: { name: 'Friedrich Robert Helmert / Jerzy Neyman', year: '1876 / 1937', note: 'The square-root form of the variance confidence interval.' },

  // Ch 8 — Hypothesis Testing
  z_test: { name: 'Jerzy Neyman & Egon Pearson', year: '1928–1933', note: 'The Neyman–Pearson framework formalized modern hypothesis testing, including the z-test.' },
  t_test: { name: 'William Sealy Gosset ("Student")', year: '1908', note: 'Published under the pseudonym "Student" in Biometrika while working as a chemist for Guinness.' },
  z_prop: { name: 'Jerzy Neyman & Egon Pearson', year: '1928–1933', note: 'An application of the Neyman–Pearson hypothesis-testing framework to proportions.' },
  chi_var: { name: 'Karl Pearson', year: '1900', note: 'An application of Pearson’s chi-square framework to test a variance against a specification.' },

  // Ch 9 — Two-Sample Tests
  z2mu: { name: 'Neyman–Pearson framework', year: '1928–1933', note: 'A two-sample extension of the Neyman–Pearson hypothesis-testing framework.' },
  t2mu: { name: 'William Sealy Gosset ("Student") / Ronald Fisher', year: '1908 / 1925', note: 'Gosset’s t-distribution extended to two independent samples, formalized in Fisher’s Statistical Methods for Research Workers.' },
  t_dep: { name: 'William Sealy Gosset ("Student")', year: '1908', note: 'The paired form of Gosset’s t-test, reducing the problem to a one-sample test on differences.' },
  d_bar: { name: 'Mathematical convention', year: '', note: 'A direct application of the mean to paired differences.' },
  sd_dep: { name: 'Karl Pearson', year: '1893', note: 'Pearson’s standard deviation applied to paired differences.' },
  z2p: { name: 'Neyman–Pearson framework', year: '1928–1933', note: 'A two-proportion extension of the Neyman–Pearson hypothesis-testing framework.' },
  f_test: { name: 'Ronald Fisher / George Snedecor', year: '1924 / 1934', note: 'Fisher derived the underlying distribution; Snedecor named it the "F" distribution in Fisher’s honor and popularized the F-test.' },

  // Ch 10 — Correlation/Regression
  pearson: { name: 'Karl Pearson', year: '1896', note: 'Built directly on Francis Galton’s (1888) and Auguste Bravais’s (1844) earlier correlation work.' },
  t_r: { name: 'Ronald Fisher', year: '1920s', note: 'Fisher formalized significance testing for the correlation coefficient.' },
  reg: { name: 'Adrien-Marie Legendre / Carl Friedrich Gauss / Francis Galton', year: '1805 / 1809 / 1886', note: 'Legendre published least squares first; Gauss claimed prior use; Galton coined "regression" studying heredity.' },
  r2: { name: 'Karl Pearson school', year: 'early 1900s', note: 'A direct derivative of Pearson’s correlation coefficient (r² = r × r).' },
  se_est: { name: 'Regression theory (19th–20th c.)', year: '', note: 'A natural extension of Gauss/Legendre least-squares theory; no single separate inventor.' },
  pred_int: { name: 'Regression theory (20th c.)', year: '', note: 'Combines Neyman’s confidence-interval logic with regression theory; no single named inventor.' },

  // Ch 11 — Chi-Square Tests
  chi_gof: { name: 'Karl Pearson', year: '1900', note: 'From "On the criterion that a given system of deviations..." — the paper that founded modern statistical inference.' },
  chi_ind: { name: 'Karl Pearson', year: '1900', note: 'The independence-testing application of Pearson’s original chi-square paper.' },
  exp_cell: { name: 'Karl Pearson', year: '1900', note: 'The null-hypothesis baseline at the core of Pearson’s chi-square framework.' },

  // Ch 12 — ANOVA
  grand_mn: { name: 'Mathematical convention', year: '', note: 'A simple overall average; formalized as part of Fisher’s ANOVA.' },
  anova_f: { name: 'Ronald Fisher', year: '1925', note: 'Introduced in Statistical Methods for Research Workers, developed from Fisher’s crop-experiment analysis at Rothamsted.' },
  s2_b: { name: 'Ronald Fisher', year: '1925', note: 'Part of Fisher’s original analysis-of-variance decomposition.' },
  s2_w: { name: 'Ronald Fisher', year: '1925', note: 'The pooled within-group variance from Fisher’s ANOVA framework.' },
  scheffe: { name: 'Henry Scheffé', year: '1953', note: 'Scheffé published his general-purpose post-hoc contrast method in 1953.' },
  tukey: { name: 'John Tukey', year: '1949', note: 'Introduced in "Comparing Individual Means in the Analysis of Variance."' },
  anova2: { name: 'Ronald Fisher', year: '1925', note: 'An extension of Fisher’s original ANOVA to two factors and their interaction.' },

  // Ch 13 — Nonparametric
  sign_z: { name: 'John Arbuthnot', year: '1710', note: 'Widely credited as the earliest recorded nonparametric test, used to analyze human birth-sex ratios.' },
  wrs: { name: 'Frank Wilcoxon / Henry Mann & Donald Whitney', year: '1945 / 1947', note: 'Wilcoxon proposed the rank-sum test; Mann and Whitney independently developed the equivalent U statistic two years later.' },
  wsrt: { name: 'Frank Wilcoxon', year: '1945', note: 'Introduced in the same 1945 paper as the rank-sum test, "Individual Comparisons by Ranking Methods."' },
  kw: { name: 'William Kruskal & W. Allen Wallis', year: '1952', note: 'Extended the Mann–Whitney rank-sum idea from two groups to any number of groups.' },
  spear: { name: 'Charles Spearman', year: '1904', note: 'Spearman, a psychologist, developed rank correlation as a nonparametric alternative to Pearson’s r.' },
  runs: { name: 'Abraham Wald & Jacob Wolfowitz', year: '1940', note: 'Published in "On a Test Whether Two Samples Are from the Same Population."' },

  // Ch 14 — Monte Carlo
  sim_mean: { name: 'Stanislaw Ulam & John von Neumann', year: '1946', note: 'Ulam conceived the method while considering solitaire odds; developed computationally with von Neumann.' },
  mc_prob: { name: 'Stanislaw Ulam & John von Neumann', year: '1946', note: 'Same Manhattan Project-era origin as the Monte Carlo mean.' },
  mc_steps: { name: 'Stanislaw Ulam, John von Neumann & Nicholas Metropolis', year: '1946–1949', note: 'Metropolis coined the "Monte Carlo" name; the trio published the first paper on the method in 1949.' },
};
