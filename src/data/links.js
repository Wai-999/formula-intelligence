export const links = [
  {
    "s": "midpoint",
    "t": "grp_mean",
    "type": "prereq"
  },
  {
    "s": "midpoint",
    "t": "grp_sd",
    "type": "prereq"
  },
  {
    "s": "range2",
    "t": "rrt",
    "type": "applies"
  },
  {
    "s": "cwidth",
    "t": "midpoint",
    "type": "prereq"
  },
  {
    "s": "pct",
    "t": "emp_p",
    "type": "extends"
  },
  {
    "s": "x_bar",
    "t": "samp_var",
    "type": "prereq"
  },
  {
    "s": "x_bar",
    "t": "zscore",
    "type": "prereq"
  },
  {
    "s": "x_bar",
    "t": "cvar",
    "type": "prereq"
  },
  {
    "s": "samp_var",
    "t": "samp_sd",
    "type": "extends"
  },
  {
    "s": "pop_var",
    "t": "pop_sd",
    "type": "extends"
  },
  {
    "s": "samp_sd",
    "t": "zscore",
    "type": "prereq"
  },
  {
    "s": "samp_sd",
    "t": "cvar",
    "type": "prereq"
  },
  {
    "s": "samp_sd",
    "t": "rrt",
    "type": "family"
  },
  {
    "s": "pop_sd",
    "t": "zscore",
    "type": "prereq"
  },
  {
    "s": "zscore",
    "t": "pctile",
    "type": "applies"
  },
  {
    "s": "c_val",
    "t": "iqr",
    "type": "prereq"
  },
  {
    "s": "grp_mean",
    "t": "grp_sd",
    "type": "prereq"
  },
  {
    "s": "cheby",
    "t": "zscore",
    "type": "family"
  },
  {
    "s": "emp_p",
    "t": "class_p",
    "type": "family"
  },
  {
    "s": "class_p",
    "t": "comp_p",
    "type": "extends"
  },
  {
    "s": "emp_p",
    "t": "comp_p",
    "type": "extends"
  },
  {
    "s": "add1",
    "t": "add2",
    "type": "extends"
  },
  {
    "s": "mult1",
    "t": "mult2",
    "type": "extends"
  },
  {
    "s": "mult2",
    "t": "cond_p",
    "type": "prereq"
  },
  {
    "s": "fcr",
    "t": "perm",
    "type": "prereq"
  },
  {
    "s": "fcr",
    "t": "comb",
    "type": "prereq"
  },
  {
    "s": "perm",
    "t": "perm2",
    "type": "extends"
  },
  {
    "s": "perm",
    "t": "comb",
    "type": "family"
  },
  {
    "s": "comb",
    "t": "binom",
    "type": "prereq"
  },
  {
    "s": "mult1",
    "t": "binom",
    "type": "prereq"
  },
  {
    "s": "comp_p",
    "t": "binom",
    "type": "applies"
  },
  {
    "s": "class_p",
    "t": "disc_mu",
    "type": "prereq"
  },
  {
    "s": "disc_mu",
    "t": "disc_var",
    "type": "prereq"
  },
  {
    "s": "disc_mu",
    "t": "exp_val",
    "type": "family"
  },
  {
    "s": "binom",
    "t": "binom_mu",
    "type": "prereq"
  },
  {
    "s": "binom",
    "t": "binom_sd",
    "type": "prereq"
  },
  {
    "s": "binom_mu",
    "t": "binom_sd",
    "type": "prereq"
  },
  {
    "s": "mult1",
    "t": "poisson",
    "type": "extends"
  },
  {
    "s": "comb",
    "t": "hypgeo",
    "type": "prereq"
  },
  {
    "s": "mult2",
    "t": "hypgeo",
    "type": "prereq"
  },
  {
    "s": "binom_mu",
    "t": "znorm",
    "type": "applies"
  },
  {
    "s": "binom_sd",
    "t": "znorm",
    "type": "applies"
  },
  {
    "s": "zscore",
    "t": "znorm",
    "type": "extends"
  },
  {
    "s": "znorm",
    "t": "x_from_z",
    "type": "family"
  },
  {
    "s": "znorm",
    "t": "clt",
    "type": "prereq"
  },
  {
    "s": "sem",
    "t": "clt",
    "type": "prereq"
  },
  {
    "s": "mu_xbar",
    "t": "clt",
    "type": "prereq"
  },
  {
    "s": "samp_sd",
    "t": "sem",
    "type": "prereq"
  },
  {
    "s": "x_bar",
    "t": "mu_xbar",
    "type": "prereq"
  },
  {
    "s": "clt",
    "t": "z_ci",
    "type": "prereq"
  },
  {
    "s": "sem",
    "t": "z_ci",
    "type": "prereq"
  },
  {
    "s": "samp_sd",
    "t": "t_ci",
    "type": "prereq"
  },
  {
    "s": "z_ci",
    "t": "t_ci",
    "type": "family"
  },
  {
    "s": "z_ci",
    "t": "n_mean",
    "type": "family"
  },
  {
    "s": "pct",
    "t": "p_hat",
    "type": "prereq"
  },
  {
    "s": "p_hat",
    "t": "p_ci",
    "type": "prereq"
  },
  {
    "s": "p_hat",
    "t": "z_prop",
    "type": "prereq"
  },
  {
    "s": "p_ci",
    "t": "n_prop",
    "type": "family"
  },
  {
    "s": "samp_var",
    "t": "var_ci",
    "type": "prereq"
  },
  {
    "s": "var_ci",
    "t": "sd_ci",
    "type": "extends"
  },
  {
    "s": "chi_var",
    "t": "var_ci",
    "type": "family"
  },
  {
    "s": "z_ci",
    "t": "z_test",
    "type": "family"
  },
  {
    "s": "t_ci",
    "t": "t_test",
    "type": "family"
  },
  {
    "s": "p_ci",
    "t": "z_prop",
    "type": "family"
  },
  {
    "s": "var_ci",
    "t": "chi_var",
    "type": "family"
  },
  {
    "s": "clt",
    "t": "z_test",
    "type": "prereq"
  },
  {
    "s": "z_test",
    "t": "t_test",
    "type": "extends"
  },
  {
    "s": "z_prop",
    "t": "z2p",
    "type": "extends"
  },
  {
    "s": "t_test",
    "t": "t_dep",
    "type": "extends"
  },
  {
    "s": "z_test",
    "t": "z2mu",
    "type": "extends"
  },
  {
    "s": "t_test",
    "t": "t2mu",
    "type": "extends"
  },
  {
    "s": "f_test",
    "t": "t2mu",
    "type": "prereq"
  },
  {
    "s": "d_bar",
    "t": "t_dep",
    "type": "prereq"
  },
  {
    "s": "sd_dep",
    "t": "t_dep",
    "type": "prereq"
  },
  {
    "s": "z2mu",
    "t": "t2mu",
    "type": "extends"
  },
  {
    "s": "samp_sd",
    "t": "pearson",
    "type": "prereq"
  },
  {
    "s": "x_bar",
    "t": "pearson",
    "type": "prereq"
  },
  {
    "s": "pearson",
    "t": "t_r",
    "type": "prereq"
  },
  {
    "s": "pearson",
    "t": "reg",
    "type": "prereq"
  },
  {
    "s": "pearson",
    "t": "r2",
    "type": "prereq"
  },
  {
    "s": "reg",
    "t": "se_est",
    "type": "prereq"
  },
  {
    "s": "se_est",
    "t": "pred_int",
    "type": "prereq"
  },
  {
    "s": "t_ci",
    "t": "pred_int",
    "type": "family"
  },
  {
    "s": "emp_p",
    "t": "chi_gof",
    "type": "prereq"
  },
  {
    "s": "class_p",
    "t": "chi_gof",
    "type": "prereq"
  },
  {
    "s": "chi_gof",
    "t": "chi_ind",
    "type": "family"
  },
  {
    "s": "exp_cell",
    "t": "chi_ind",
    "type": "prereq"
  },
  {
    "s": "chi_var",
    "t": "chi_gof",
    "type": "family"
  },
  {
    "s": "t2mu",
    "t": "anova_f",
    "type": "extends"
  },
  {
    "s": "f_test",
    "t": "anova_f",
    "type": "family"
  },
  {
    "s": "grand_mn",
    "t": "s2_b",
    "type": "prereq"
  },
  {
    "s": "x_bar",
    "t": "grand_mn",
    "type": "prereq"
  },
  {
    "s": "s2_b",
    "t": "anova_f",
    "type": "prereq"
  },
  {
    "s": "s2_w",
    "t": "anova_f",
    "type": "prereq"
  },
  {
    "s": "samp_var",
    "t": "s2_w",
    "type": "prereq"
  },
  {
    "s": "anova_f",
    "t": "scheffe",
    "type": "prereq"
  },
  {
    "s": "anova_f",
    "t": "tukey",
    "type": "prereq"
  },
  {
    "s": "s2_w",
    "t": "scheffe",
    "type": "prereq"
  },
  {
    "s": "s2_w",
    "t": "tukey",
    "type": "prereq"
  },
  {
    "s": "anova_f",
    "t": "anova2",
    "type": "extends"
  },
  {
    "s": "t_test",
    "t": "sign_z",
    "type": "nonparam"
  },
  {
    "s": "t2mu",
    "t": "wrs",
    "type": "nonparam"
  },
  {
    "s": "t_dep",
    "t": "wsrt",
    "type": "nonparam"
  },
  {
    "s": "anova_f",
    "t": "kw",
    "type": "nonparam"
  },
  {
    "s": "pearson",
    "t": "spear",
    "type": "nonparam"
  },
  {
    "s": "zscore",
    "t": "sign_z",
    "type": "prereq"
  },
  {
    "s": "zscore",
    "t": "wrs",
    "type": "prereq"
  },
  {
    "s": "zscore",
    "t": "runs",
    "type": "prereq"
  },
  {
    "s": "emp_p",
    "t": "mc_prob",
    "type": "extends"
  },
  {
    "s": "disc_mu",
    "t": "sim_mean",
    "type": "prereq"
  },
  {
    "s": "exp_val",
    "t": "mc_prob",
    "type": "applies"
  },
  {
    "s": "exp_val",
    "t": "sim_mean",
    "type": "prereq"
  },
  {
    "s": "class_p",
    "t": "mc_steps",
    "type": "prereq"
  },
  {
    "s": "mult1",
    "t": "mc_steps",
    "type": "prereq"
  },
  {
    "s": "mc_steps",
    "t": "mc_prob",
    "type": "prereq"
  },
  {
    "s": "mc_prob",
    "t": "sim_mean",
    "type": "prereq"
  },
  {
    "s": "x_bar",
    "t": "sim_mean",
    "type": "family"
  }
];
