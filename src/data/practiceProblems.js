import { nodeById } from './nodes.js';
import { CHAPTERS } from './chapters.js';

export const PRACTICE_PROBLEMS = {
  "zscore": [
    {
      "scenario": "A hospital tracks patient wait times. Today a patient waited 47 minutes. The hospital's historical mean wait is 38 min and the population SD is 6 min. The administrator wants to flag unusually long waits.",
      "identifyOptions": [
        "Z-Score (standardize a value)",
        "t-Test (compare sample mean)",
        "Chi-Square (test frequencies)",
        "IQR (describe spread)"
      ],
      "correctIndex": 0,
      "whyCorrect": "We have a known population σ and want to express one value relative to the distribution — that's exactly what z-scores do.",
      "whyWrong": "t-tests compare means; chi-square tests categories; IQR describes spread. None standardize a single observation.",
      "steps": [
        {
          "label": "Numerator: X − μ",
          "display": "47 − 38",
          "answer": 9
        },
        {
          "label": "Denominator: σ",
          "display": "σ",
          "answer": 6
        },
        {
          "label": "z = (X − μ) / σ",
          "display": "9 ÷ 6",
          "answer": 1.5
        }
      ],
      "interpretation": {
        "template": "A z-score of ___ means this wait was ___ standard deviations ___ the mean.",
        "blanks": [
          "1.50",
          "1.50",
          "above"
        ]
      }
    },
    {
      "scenario": "A standardized exam has a mean score of 500 and population SD of 100. A student scored 650. The college wants to know how this student compares to the national distribution.",
      "identifyOptions": [
        "Z-Score (standardize a value)",
        "Sample Mean (average a dataset)",
        "Pearson r (measure correlation)",
        "F-Test (compare variances)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Population parameters (μ, σ) are known; we're placing one score on a standard scale.",
      "whyWrong": "The other formulas require multiple data points or compare groups — here we have one score and known population stats.",
      "steps": [
        {
          "label": "X − μ",
          "display": "650 − 500",
          "answer": 150
        },
        {
          "label": "σ",
          "display": "σ",
          "answer": 100
        },
        {
          "label": "z = (X − μ) / σ",
          "display": "150 ÷ 100",
          "answer": 1.5
        }
      ],
      "interpretation": {
        "template": "A z-score of ___ means the student scored ___ SDs ___ the national mean.",
        "blanks": [
          "1.50",
          "1.50",
          "above"
        ]
      }
    },
    {
      "scenario": "A factory produces bolts with a mean length of 10 mm and σ = 0.2 mm. A quality inspector finds a bolt measuring 9.5 mm and needs to determine if it falls outside the acceptable ±2σ range.",
      "identifyOptions": [
        "Z-Score (standardize a value)",
        "t-Test (one sample)",
        "Regression (predict Y from X)",
        "Chi-Square GOF"
      ],
      "correctIndex": 0,
      "whyCorrect": "We know σ from the production process and need to standardize a single measurement.",
      "whyWrong": "t-test is used when σ is unknown; regression requires two variables; chi-square tests distributions.",
      "steps": [
        {
          "label": "X − μ",
          "display": "9.5 − 10",
          "answer": -0.5
        },
        {
          "label": "σ",
          "display": "σ",
          "answer": 0.2
        },
        {
          "label": "z = (X − μ) / σ",
          "display": "-0.5 ÷ 0.2",
          "answer": -2.5
        }
      ],
      "interpretation": {
        "template": "A z-score of ___ means the bolt is ___ SDs ___ the mean — it ___ the ±2σ threshold.",
        "blanks": [
          "-2.50",
          "2.50",
          "below",
          "exceeds"
        ]
      }
    },
    {
      "scenario": "Blood sodium levels are normally distributed with μ = 140 mEq/L and σ = 3 mEq/L. A patient has sodium of 134 mEq/L. A clinician wants to flag readings more than 2 SDs from normal.",
      "identifyOptions": [
        "Z-Score (standardize a value)",
        "Confidence Interval (estimate μ)",
        "ANOVA (compare group means)",
        "p-hat (sample proportion)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Known population parameters and a single reading to standardize — the z-score is the right tool.",
      "whyWrong": "CIs estimate a range for an unknown μ; ANOVA compares multiple groups; p-hat is for proportions.",
      "steps": [
        {
          "label": "X − μ",
          "display": "134 − 140",
          "answer": -6
        },
        {
          "label": "σ",
          "display": "σ",
          "answer": 3
        },
        {
          "label": "z = (X − μ) / σ",
          "display": "-6 ÷ 3",
          "answer": -2
        }
      ],
      "interpretation": {
        "template": "A z-score of ___ means sodium is ___ SDs ___ normal — this patient should be ___ for hyponatremia.",
        "blanks": [
          "-2.00",
          "2.00",
          "below",
          "flagged"
        ]
      }
    }
  ],
  "x_bar": [
    {
      "scenario": "A nutritionist records daily calorie intake for 5 patients: 1800, 2100, 1950, 2300, 2050. She needs a single summary value to compare this group to a national benchmark of 2000 kcal.",
      "identifyOptions": [
        "Sample Mean (summarize center)",
        "Standard Deviation (measure spread)",
        "z-Score (standardize a value)",
        "Median (middle value)"
      ],
      "correctIndex": 0,
      "whyCorrect": "The sample mean gives the best single-number summary of center for comparing to a benchmark.",
      "whyWrong": "SD measures spread; z-score requires σ; median isn't the right tool for comparing to a known population mean.",
      "steps": [
        {
          "label": "ΣX = sum all values",
          "display": "1800+2100+1950+2300+2050",
          "answer": 10200
        },
        {
          "label": "n = number of patients",
          "display": "count",
          "answer": 5
        },
        {
          "label": "X̄ = ΣX / n",
          "display": "10200 ÷ 5",
          "answer": 2040
        }
      ],
      "interpretation": {
        "template": "The sample mean is ___ kcal/day, which is ___ kcal ___ the national benchmark.",
        "blanks": [
          "2040",
          "40",
          "above"
        ]
      }
    },
    {
      "scenario": "Five students scored: 72, 88, 65, 91, 84 on an exam. The teacher needs the class average to report to the principal.",
      "identifyOptions": [
        "Sample Mean",
        "Median",
        "Mode",
        "Range"
      ],
      "correctIndex": 0,
      "whyCorrect": "Sample mean (arithmetic average) is the standard measure used to summarize a group's performance.",
      "whyWrong": "Median is the middle value; mode is the most frequent; range only captures spread.",
      "steps": [
        {
          "label": "ΣX",
          "display": "72+88+65+91+84",
          "answer": 400
        },
        {
          "label": "n",
          "display": "count",
          "answer": 5
        },
        {
          "label": "X̄ = ΣX / n",
          "display": "400 ÷ 5",
          "answer": 80
        }
      ],
      "interpretation": {
        "template": "The class average is ___. The highest score exceeds the mean by ___ points.",
        "blanks": [
          "80",
          "11"
        ]
      }
    }
  ],
  "samp_sd": [
    {
      "scenario": "A lab records reaction times (seconds) for 5 subjects: 0.24, 0.31, 0.28, 0.35, 0.22. The researcher needs to quantify how variable the reaction times are before running any inference test.",
      "identifyOptions": [
        "Sample SD (measure spread)",
        "Sample Mean (measure center)",
        "Pearson r (measure correlation)",
        "chi-square (compare frequencies)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Sample SD is the correct measure of spread for a small sample where the population σ is unknown.",
      "whyWrong": "Mean measures center; r measures correlation between two variables; chi-square tests categorical distributions.",
      "steps": [
        {
          "label": "X̄ first",
          "display": "(0.24+0.31+0.28+0.35+0.22)÷5",
          "answer": 0.28
        },
        {
          "label": "ΣX²",
          "display": "0.24²+0.31²+0.28²+0.35²+0.22²",
          "answer": 0.3974
        },
        {
          "label": "n(ΣX²)−(ΣX)²",
          "display": "5×0.3974 − 1.4²",
          "answer": 0.014
        },
        {
          "label": "s = √[ / n(n−1)]",
          "display": "√(0.014 ÷ 20)",
          "answer": 0.026
        }
      ],
      "interpretation": {
        "template": "s = ___ sec means reaction times typically vary ___ sec from the mean.",
        "blanks": [
          "0.026",
          "0.026"
        ]
      }
    },
    {
      "scenario": "A coffee shop records daily sales for 6 days: $320, $410, $380, $290, $450, $360. The manager needs to know if sales are consistent enough to staff predictably.",
      "identifyOptions": [
        "Sample SD",
        "Sample Mean",
        "Median",
        "z-Score"
      ],
      "correctIndex": 0,
      "whyCorrect": "SD measures day-to-day variability — high SD means unpredictable staffing needs.",
      "whyWrong": "Mean describes the center; median is the middle value; z-score requires known population parameters.",
      "steps": [
        {
          "label": "X̄",
          "display": "(320+410+380+290+450+360)÷6",
          "answer": 368.33
        },
        {
          "label": "ΣX²",
          "display": "320²+410²+380²+290²+450²+360²",
          "answer": 826900
        },
        {
          "label": "n(ΣX²)−(ΣX)²",
          "display": "6×826900 − 2210²",
          "answer": 67300
        },
        {
          "label": "s = √[…/n(n−1)]",
          "display": "√(67300÷30)",
          "answer": 47.34
        }
      ],
      "interpretation": {
        "template": "s ≈ $___ means daily sales vary about $___ from the average.",
        "blanks": [
          "47.34",
          "47.34"
        ]
      }
    }
  ],
  "t_test": [
    {
      "scenario": "A fitness app claims its 8-week program reduces resting heart rate by at least 5 bpm. A researcher tests 10 users (n=10) and finds X̄ = 6.2 bpm reduction, s = 2.8 bpm. Population SD is unknown.",
      "identifyOptions": [
        "One-sample t-test",
        "One-sample z-test",
        "Paired t-test",
        "Two-sample t-test"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ is unknown and n < 30 — the t-distribution correctly accounts for extra uncertainty from estimating σ with s.",
      "whyWrong": "z-test requires known σ; paired t-test compares before/after pairs; two-sample compares two independent groups.",
      "steps": [
        {
          "label": "X̄ − μ₀",
          "display": "6.2 − 5",
          "answer": 1.2
        },
        {
          "label": "s / √n",
          "display": "2.8 ÷ √10",
          "answer": 0.885
        },
        {
          "label": "t = (X̄ − μ₀) / (s/√n)",
          "display": "1.2 ÷ 0.885",
          "answer": 1.356
        }
      ],
      "interpretation": {
        "template": "t = ___ with df = ___. At α=0.05 (one-tailed, t* ≈ 1.833), this result is ___.",
        "blanks": [
          "1.356",
          "9",
          "not significant"
        ]
      }
    },
    {
      "scenario": "A manufacturer claims its light bulbs last 1000 hours. Quality control tests 16 bulbs and finds X̄ = 978 hours, s = 40 hours. Is the batch significantly below the claimed lifetime?",
      "identifyOptions": [
        "One-sample t-test",
        "One-sample z-test",
        "ANOVA",
        "Chi-square GOF"
      ],
      "correctIndex": 0,
      "whyCorrect": "Small sample (n=16), σ unknown, testing one mean against a known standard — one-sample t-test.",
      "whyWrong": "z-test needs known σ; ANOVA compares multiple group means; chi-square tests categorical distributions.",
      "steps": [
        {
          "label": "X̄ − μ₀",
          "display": "978 − 1000",
          "answer": -22
        },
        {
          "label": "s / √n",
          "display": "40 ÷ √16",
          "answer": 10
        },
        {
          "label": "t = (X̄ − μ₀) / (s/√n)",
          "display": "-22 ÷ 10",
          "answer": -2.2
        }
      ],
      "interpretation": {
        "template": "t = ___ with df = ___. At α=0.05 (one-tailed, t* ≈ −1.753), we ___ H₀.",
        "blanks": [
          "-2.20",
          "15",
          "reject"
        ]
      }
    }
  ],
  "z_test": [
    {
      "scenario": "A cereal company claims boxes contain 400g. A consumer group tests 50 boxes and finds X̄ = 396g. The long-run production SD is known to be σ = 10g. Is the company underfilling?",
      "identifyOptions": [
        "One-sample z-test",
        "One-sample t-test",
        "Confidence Interval",
        "Chi-square test"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ is known from production records and n=50 satisfies the CLT — the z-test is exact here.",
      "whyWrong": "t-test is for unknown σ; CI gives a range estimate rather than a test; chi-square is for categorical data.",
      "steps": [
        {
          "label": "X̄ − μ₀",
          "display": "396 − 400",
          "answer": -4
        },
        {
          "label": "σ / √n",
          "display": "10 ÷ √50",
          "answer": 1.414
        },
        {
          "label": "z = (X̄ − μ₀) / (σ/√n)",
          "display": "-4 ÷ 1.414",
          "answer": -2.83
        }
      ],
      "interpretation": {
        "template": "z = ___. At α=0.05 (one-tailed z* = −1.645), we ___ H₀ — evidence of underfilling.",
        "blanks": [
          "-2.83",
          "reject"
        ]
      }
    }
  ],
  "pearson": [
    {
      "scenario": "A real estate analyst has data on 5 homes: sizes (sq ft) and prices ($k): (1200,$180), (1500,$220), (1800,$260), (2100,$310), (2400,$350). She wants to quantify how strongly size predicts price.",
      "identifyOptions": [
        "Pearson r (linear correlation)",
        "Spearman rank correlation",
        "Chi-square independence",
        "Regression slope only"
      ],
      "correctIndex": 0,
      "whyCorrect": "Pearson r measures the strength and direction of the linear relationship between two continuous variables.",
      "whyWrong": "Spearman is for ranked/non-normal data; chi-square is for categorical; slope alone doesn't give strength.",
      "steps": [
        {
          "label": "n",
          "display": "count of pairs",
          "answer": 5
        },
        {
          "label": "ΣXY",
          "display": "1200×180+1500×220+1800×260+2100×310+2400×350",
          "answer": 1887000
        },
        {
          "label": "ΣX",
          "display": "1200+1500+1800+2100+2400",
          "answer": 9000
        },
        {
          "label": "ΣY",
          "display": "180+220+260+310+350",
          "answer": 1320
        }
      ],
      "interpretation": {
        "template": "r is very close to ___. This indicates a ___ linear relationship between size and price.",
        "blanks": [
          "1.00",
          "strong positive"
        ]
      }
    }
  ],
  "reg": [
    {
      "scenario": "Using 5 data points, an analyst finds: n=5, ΣX=25, ΣY=35, ΣXY=195, ΣX²=145. She wants the regression equation to predict Y from X.",
      "identifyOptions": [
        "Linear Regression (predict Y from X)",
        "Pearson r (measure strength only)",
        "t-test (compare means)",
        "ANOVA (compare group means)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Regression gives the prediction equation ŷ = a + bX; correlation alone doesn't predict.",
      "whyWrong": "r measures relationship strength but doesn't give a prediction equation; t-test and ANOVA compare means.",
      "steps": [
        {
          "label": "b = [nΣXY − ΣXΣY] / [nΣX² − (ΣX)²]",
          "display": "[5×195 − 25×35] / [5×145 − 25²]",
          "answer": 1.4
        },
        {
          "label": "a = (ΣY − bΣX) / n",
          "display": "(35 − 1.40×25) / 5",
          "answer": 0
        },
        {
          "label": "ŷ at X=6",
          "display": "0 + 1.40×6",
          "answer": 8.4
        }
      ],
      "interpretation": {
        "template": "The regression equation is ŷ = ___ + ___X. For X=6, predicted Y = ___.",
        "blanks": [
          "0",
          "1.40",
          "8.40"
        ]
      }
    }
  ],
  "chi_gof": [
    {
      "scenario": "A die is rolled 60 times. Results: 1→8, 2→12, 3→9, 4→11, 5→10, 6→10. A statistician wants to test if the die is fair.",
      "identifyOptions": [
        "Chi-Square GOF (test distribution fit)",
        "Chi-Square Independence (test two variables)",
        "z-test (compare mean)",
        "t-test (small sample mean)"
      ],
      "correctIndex": 0,
      "whyCorrect": "GOF tests whether observed frequencies match a theoretical distribution — perfect match for testing a fair die.",
      "whyWrong": "Independence tests two categorical variables against each other; z/t-tests compare means, not frequency distributions.",
      "steps": [
        {
          "label": "Expected per face (E = 60/6)",
          "display": "60 ÷ 6",
          "answer": 10
        },
        {
          "label": "χ² for face 1: (8−10)²/10",
          "display": "(8−10)²÷10",
          "answer": 0.4
        },
        {
          "label": "Total χ² (all 6 faces: 0.4+0.4+0.1+0.1+0+0)",
          "display": "sum",
          "answer": 1
        }
      ],
      "interpretation": {
        "template": "χ²(___)= ___. At α=0.05, critical value ≈ 11.07. We ___ H₀ — the die appears fair.",
        "blanks": [
          "5",
          "1.00",
          "fail to reject"
        ]
      }
    }
  ],
  "ci_mean_t": [
    {
      "scenario": "A researcher measures sleep duration for 9 college students: X̄ = 7.2 hours, s = 0.8 hours. She wants to estimate the true mean sleep duration for all college students with 95% confidence.",
      "identifyOptions": [
        "CI for Mean (t, unknown σ)",
        "CI for Mean (z, known σ)",
        "CI for Proportion",
        "t-Test (hypothesis test)"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ is unknown and n=9 is small — the t-distribution gives wider, more honest intervals than z.",
      "whyWrong": "z-CI needs known σ; proportion CI is for categorical outcomes; t-test tests a hypothesis rather than estimating.",
      "steps": [
        {
          "label": "s / √n (standard error)",
          "display": "0.8 ÷ √9",
          "answer": 0.267
        },
        {
          "label": "t* at df=8, 95% CI",
          "display": "from t-table",
          "answer": 2.306
        },
        {
          "label": "Margin = t* × SE",
          "display": "2.306 × 0.267",
          "answer": 0.616
        }
      ],
      "interpretation": {
        "template": "95% CI: ___ ± ___ = (___ , ___) hours.",
        "blanks": [
          "7.2",
          "0.616",
          "6.584",
          "7.816"
        ]
      }
    }
  ],
  "p_ci": [
    {
      "scenario": "In a survey of 400 voters, 220 support a new transit proposal. A pollster needs to report the margin of error for this proportion at 95% confidence.",
      "identifyOptions": [
        "CI for Proportion (p̂ ± z√(p̂q̂/n))",
        "CI for Mean (t)",
        "z-test for proportion",
        "Chi-square GOF"
      ],
      "correctIndex": 0,
      "whyCorrect": "We have a sample proportion from a large n — the normal approximation applies (np̂=220 > 5).",
      "whyWrong": "Mean CI is for continuous data; z-test tests a hypothesis; chi-square tests distributional fit.",
      "steps": [
        {
          "label": "p̂ = x/n",
          "display": "220 ÷ 400",
          "answer": 0.55
        },
        {
          "label": "p̂(1−p̂)",
          "display": "0.55 × 0.45",
          "answer": 0.2475
        },
        {
          "label": "√(p̂q̂/n)",
          "display": "√(0.2475÷400)",
          "answer": 0.0249
        },
        {
          "label": "Margin = 1.96 × SE",
          "display": "1.96 × 0.0249",
          "answer": 0.0488
        }
      ],
      "interpretation": {
        "template": "p̂ = ___, margin of error = ±___. 95% CI: (___ , ___).",
        "blanks": [
          "0.55",
          "0.049",
          "0.501",
          "0.599"
        ]
      }
    }
  ],
  "pct": [
    {
      "scenario": "A retailer surveys 200 shoppers about checkout preference: 46 say they prefer self-checkout. The manager needs this as a percentage for the weekly frequency table.",
      "identifyOptions": [
        "Class % (frequency to percentage)",
        "Empirical Probability (f/n)",
        "Pie Degrees (f/n·360°)",
        "Class Midpoint"
      ],
      "correctIndex": 0,
      "whyCorrect": "Class % converts a raw frequency into a percentage of the total for a frequency table — exactly what's being reported here.",
      "whyWrong": "Empirical P gives a decimal probability, not a report-ready percentage; Pie Degrees is for chart angles; Class Midpoint has nothing to do with frequency.",
      "steps": [
        {
          "label": "f (frequency)",
          "display": "f",
          "answer": 46
        },
        {
          "label": "n (total)",
          "display": "n",
          "answer": 200
        },
        {
          "label": "% = (f/n) × 100",
          "display": "(46 ÷ 200) × 100",
          "answer": 23
        }
      ],
      "interpretation": {
        "template": "___% of shoppers surveyed prefer self-checkout.",
        "blanks": [
          "23"
        ]
      }
    }
  ],
  "midpoint": [
    {
      "scenario": "A frequency table has a class interval of 60–69 for exam scores. Before computing the grouped mean, the instructor needs one representative value for this whole class.",
      "identifyOptions": [
        "Class Midpoint",
        "Sample Mean",
        "Midrange",
        "Class Width"
      ],
      "correctIndex": 0,
      "whyCorrect": "Class Midpoint gives the single representative value for a grouped class — required input for grouped mean and variance.",
      "whyWrong": "Sample Mean needs raw data, not a class; Midrange uses the whole dataset's extremes, not one class; Class Width is a different measurement entirely (span, not center).",
      "steps": [
        {
          "label": "Lower limit",
          "display": "Lower",
          "answer": 60
        },
        {
          "label": "Upper limit",
          "display": "Upper",
          "answer": 69
        },
        {
          "label": "Xm = (Lower + Upper) / 2",
          "display": "(60 + 69) ÷ 2",
          "answer": 64.5
        }
      ],
      "interpretation": {
        "template": "The midpoint of the 60–69 class is ___.",
        "blanks": [
          "64.5"
        ]
      }
    }
  ],
  "pie_deg": [
    {
      "scenario": "Using the same checkout survey (46 of 200 shoppers prefer self-checkout), the manager now wants to draw a pie chart slice for this group instead of a percentage table.",
      "identifyOptions": [
        "Pie Degrees (f/n·360°)",
        "Class %",
        "Percentile Rank",
        "Combination nCr"
      ],
      "correctIndex": 0,
      "whyCorrect": "Pie charts divide a full 360° circle proportionally by frequency — that's exactly what Pie Degrees computes.",
      "whyWrong": "Class % gives a percentage, not an angle; Percentile Rank locates one value in a sorted list; nCr counts selections, unrelated to charting.",
      "steps": [
        {
          "label": "f",
          "display": "f",
          "answer": 46
        },
        {
          "label": "n",
          "display": "n",
          "answer": 200
        },
        {
          "label": "Degrees = (f/n) × 360°",
          "display": "(46 ÷ 200) × 360",
          "answer": 82.8
        }
      ],
      "interpretation": {
        "template": "The self-checkout slice spans ___° of the pie chart.",
        "blanks": [
          "82.8"
        ]
      }
    }
  ],
  "range2": [
    {
      "scenario": "A researcher has ages for 10 clinic patients, from 19 (youngest) to 82 (oldest). Before building a frequency distribution, she needs the overall spread to decide how many classes to use.",
      "identifyOptions": [
        "Range (Ch2)",
        "IQR",
        "Sample SD",
        "Class Width"
      ],
      "correctIndex": 0,
      "whyCorrect": "Range = Highest − Lowest is the raw spread used to set up class intervals before any distribution is built.",
      "whyWrong": "IQR needs quartiles, not just extremes; Sample SD needs every data point, not just the range; Class Width is derived *from* the range, not the other way around.",
      "steps": [
        {
          "label": "Highest",
          "display": "Highest",
          "answer": 82
        },
        {
          "label": "Lowest",
          "display": "Lowest",
          "answer": 19
        },
        {
          "label": "R = Highest − Lowest",
          "display": "82 − 19",
          "answer": 63
        }
      ],
      "interpretation": {
        "template": "The range of patient ages is ___ years.",
        "blanks": [
          "63"
        ]
      }
    }
  ],
  "cwidth": [
    {
      "scenario": "A class interval for household income runs from a lower boundary of $49,500 to an upper boundary of $59,500. The analyst needs the class width to confirm every interval in the table is consistent.",
      "identifyOptions": [
        "Class Width",
        "Range (Ch2)",
        "IQR",
        "Midrange"
      ],
      "correctIndex": 0,
      "whyCorrect": "Class Width = Upper boundary − Lower boundary, the span of a single class interval.",
      "whyWrong": "Range spans the entire dataset, not one class; IQR uses quartiles from raw data; Midrange is a center measure, not a width.",
      "steps": [
        {
          "label": "Upper boundary",
          "display": "Upper",
          "answer": 59500
        },
        {
          "label": "Lower boundary",
          "display": "Lower",
          "answer": 49500
        },
        {
          "label": "Width = Upper − Lower",
          "display": "59500 − 49500",
          "answer": 10000
        }
      ],
      "interpretation": {
        "template": "Each class interval in this table spans $___.",
        "blanks": [
          "10000"
        ]
      }
    }
  ],
  "mu": [
    {
      "scenario": "A factory has exactly 6 production lines (the entire population, not a sample). Their uptime percentages last month were 95, 98, 92, 97, 96, 99. Plant management wants the true average across all lines.",
      "identifyOptions": [
        "Population Mean",
        "Sample Mean",
        "Weighted Mean",
        "Grouped Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "All 6 lines — the entire population — are known, so μ = ΣX/N applies directly (not an estimate from a sample).",
      "whyWrong": "Sample Mean (X̄) is for an estimate from a subset; Weighted Mean needs different weights per value; Grouped Mean needs a frequency table, not raw values.",
      "steps": [
        {
          "label": "ΣX",
          "display": "95+98+92+97+96+99",
          "answer": 577
        },
        {
          "label": "N",
          "display": "count",
          "answer": 6
        },
        {
          "label": "μ = ΣX / N",
          "display": "577 ÷ 6",
          "answer": 96.167
        }
      ],
      "interpretation": {
        "template": "The true population mean uptime is ___%.",
        "blanks": [
          "96.167"
        ]
      }
    }
  ],
  "grp_mean": [
    {
      "scenario": "An instructor only has a frequency table of quiz scores (no raw data): 5 students in the 10–19 class (midpoint 15), 8 in 20–29 (midpoint 25), 7 in 30–39 (midpoint 35). She needs the class average.",
      "identifyOptions": [
        "Grouped Mean",
        "Sample Mean",
        "Weighted Mean",
        "Midrange"
      ],
      "correctIndex": 0,
      "whyCorrect": "Only a frequency table is available (no raw scores), so the grouped mean — using class midpoints as stand-ins — is the correct tool.",
      "whyWrong": "Sample Mean needs the raw values, which aren't available; Weighted Mean uses externally-assigned weights, not frequencies; Midrange only uses the extremes.",
      "steps": [
        {
          "label": "Σ(f · Xm)",
          "display": "5×15 + 8×25 + 7×35",
          "answer": 520
        },
        {
          "label": "n = Σf",
          "display": "5+8+7",
          "answer": 20
        },
        {
          "label": "X̄ = Σ(f·Xm) / n",
          "display": "520 ÷ 20",
          "answer": 26
        }
      ],
      "interpretation": {
        "template": "The grouped mean quiz score is ___.",
        "blanks": [
          "26"
        ]
      }
    }
  ],
  "wmean": [
    {
      "scenario": "A student's semester has 4 courses with different credit hours and grade points: 3 credits at 4.0, 4 credits at 3.0, 3 credits at 3.5, 2 credits at 2.0. She wants her semester GPA, where bigger classes should count more.",
      "identifyOptions": [
        "Weighted Mean",
        "Sample Mean",
        "Grouped Mean",
        "Midrange"
      ],
      "correctIndex": 0,
      "whyCorrect": "GPA must weight each grade by its credit hours — exactly what the weighted mean does.",
      "whyWrong": "Sample Mean would treat every course equally regardless of credit load; Grouped Mean needs class-interval frequencies, not credit weights; Midrange ignores all but the extremes.",
      "steps": [
        {
          "label": "Σ(w·X)",
          "display": "3×4 + 4×3 + 3×3.5 + 2×2",
          "answer": 38.5
        },
        {
          "label": "Σw",
          "display": "3+4+3+2",
          "answer": 12
        },
        {
          "label": "X̄ = Σ(wX) / Σw",
          "display": "38.5 ÷ 12",
          "answer": 3.208
        }
      ],
      "interpretation": {
        "template": "Her weighted GPA is ___.",
        "blanks": [
          "3.208"
        ]
      }
    }
  ],
  "midrange": [
    {
      "scenario": "For the same clinic dataset (ages 19 to 82), a nurse wants a quick, rough center estimate without doing a full calculation — just from the extremes.",
      "identifyOptions": [
        "Midrange",
        "Sample Mean",
        "Class Midpoint",
        "Weighted Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "Midrange = (Lowest + Highest)/2 is a fast, rough center measure computed only from the extremes.",
      "whyWrong": "Sample Mean needs every value in the dataset; Class Midpoint applies to one grouped interval, not a whole raw dataset; Weighted Mean needs assigned weights.",
      "steps": [
        {
          "label": "Lowest",
          "display": "Lowest",
          "answer": 19
        },
        {
          "label": "Highest",
          "display": "Highest",
          "answer": 82
        },
        {
          "label": "MR = (Lowest+Highest)/2",
          "display": "(19 + 82) ÷ 2",
          "answer": 50.5
        }
      ],
      "interpretation": {
        "template": "The midrange age is ___ years — only a rough estimate since it ignores every value except the two extremes.",
        "blanks": [
          "50.5"
        ]
      }
    }
  ],
  "pop_var": [
    {
      "scenario": "A small company has exactly 5 employees (the whole population). Their years of tenure are 2, 4, 6, 8, 10. HR wants the true variance across the entire staff, not an estimate.",
      "identifyOptions": [
        "Population Variance",
        "Sample Variance",
        "Population SD",
        "Sample SD"
      ],
      "correctIndex": 0,
      "whyCorrect": "All 5 employees are known (the full population), and variance (not SD) is asked for — σ² = Σ(X−μ)²/N.",
      "whyWrong": "Sample Variance divides by (n−1) for an unbiased sample estimate, not needed when the full population is known; SD is the square root of variance, a different quantity.",
      "steps": [
        {
          "label": "μ",
          "display": "(2+4+6+8+10)÷5",
          "answer": 6
        },
        {
          "label": "Σ(X−μ)²",
          "display": "(2−6)²+(4−6)²+(6−6)²+(8−6)²+(10−6)²",
          "answer": 40
        },
        {
          "label": "σ² = Σ(X−μ)² / N",
          "display": "40 ÷ 5",
          "answer": 8
        }
      ],
      "interpretation": {
        "template": "The true population variance of tenure is ___ years².",
        "blanks": [
          "8"
        ]
      }
    }
  ],
  "samp_var": [
    {
      "scenario": "A delivery company samples 5 orders and records delivery time in minutes: 25, 30, 28, 35, 22. Before running an F-test against a competitor, the analyst needs this sample's variance.",
      "identifyOptions": [
        "Sample Variance",
        "Population Variance",
        "Sample SD",
        "Range (Ch2)"
      ],
      "correctIndex": 0,
      "whyCorrect": "This is a sample (not the full population), and an F-test needs variance directly — s² = [n(ΣX²)−(ΣX)²]/[n(n−1)].",
      "whyWrong": "Population Variance would assume these 5 orders are the entire population, which they aren't; SD is a later step (√variance); Range only uses two values.",
      "steps": [
        {
          "label": "ΣX",
          "display": "25+30+28+35+22",
          "answer": 140
        },
        {
          "label": "ΣX²",
          "display": "25²+30²+28²+35²+22²",
          "answer": 4018
        },
        {
          "label": "n(ΣX²)−(ΣX)²",
          "display": "5×4018 − 140²",
          "answer": 490
        },
        {
          "label": "s² = […] / [n(n−1)]",
          "display": "490 ÷ 20",
          "answer": 24.5
        }
      ],
      "interpretation": {
        "template": "The sample variance of delivery time is ___ minutes².",
        "blanks": [
          "24.5"
        ]
      }
    }
  ],
  "pop_sd": [
    {
      "scenario": "Using the same 5-employee company (tenure: 2, 4, 6, 8, 10 years — the whole population), HR now wants standard deviation, in the original units of years, not squared units.",
      "identifyOptions": [
        "Population SD",
        "Sample SD",
        "Population Variance",
        "Range Rule of Thumb"
      ],
      "correctIndex": 0,
      "whyCorrect": "Population SD is variance's square root, returning the spread to the original units (years) for the full population.",
      "whyWrong": "Sample SD divides by (n−1), for an estimate from a subset, not the full population; Population Variance is in squared units; RRT is only a rough approximation.",
      "steps": [
        {
          "label": "σ² (population variance)",
          "display": "computed above",
          "answer": 8
        },
        {
          "label": "σ = √σ²",
          "display": "√8",
          "answer": 2.828
        }
      ],
      "interpretation": {
        "template": "The true population SD of tenure is ___ years.",
        "blanks": [
          "2.828"
        ]
      }
    }
  ],
  "grp_sd": [
    {
      "scenario": "For the same grouped quiz-score table (5 students at midpoint 15, 8 at midpoint 25, 7 at midpoint 35), the instructor now wants a spread measure — but again, only the frequency table is available, not raw scores.",
      "identifyOptions": [
        "Grouped SD",
        "Sample SD",
        "Population SD",
        "IQR"
      ],
      "correctIndex": 0,
      "whyCorrect": "Only frequencies and midpoints exist — the grouped SD formula substitutes Σf·Xm and Σf·Xm² for the raw-data sums.",
      "whyWrong": "Sample SD and Population SD both require raw individual values, which aren't available here; IQR needs sorted raw data to find quartiles.",
      "steps": [
        {
          "label": "n = Σf",
          "display": "5+8+7",
          "answer": 20
        },
        {
          "label": "Σf·Xm",
          "display": "5×15+8×25+7×35",
          "answer": 520
        },
        {
          "label": "Σf·Xm²",
          "display": "5×15²+8×25²+7×35²",
          "answer": 14700
        },
        {
          "label": "s = √{[n(Σf·Xm²)−(Σf·Xm)²]/[n(n−1)]}",
          "display": "√(23600 ÷ 380)",
          "answer": 7.881
        }
      ],
      "interpretation": {
        "template": "The grouped-data standard deviation of quiz scores is ___.",
        "blanks": [
          "7.881"
        ]
      }
    }
  ],
  "cvar": [
    {
      "scenario": "An investor compares two funds: Fund A returns average 8% with SD 2%. Fund B returns average 20% with SD 3%. Raw SD alone is misleading since the funds have very different average returns — she needs a relative measure.",
      "identifyOptions": [
        "Coeff. of Variation",
        "Sample SD",
        "z-Score",
        "Range Rule of Thumb"
      ],
      "correctIndex": 0,
      "whyCorrect": "CVar expresses SD as a percentage of the mean, letting you compare variability fairly across differently-scaled series.",
      "whyWrong": "Raw SD can't be compared directly across different means; z-score standardizes one value, not a whole series' relative spread; RRT only approximates SD from range.",
      "steps": [
        {
          "label": "s (Fund A)",
          "display": "s",
          "answer": 2
        },
        {
          "label": "X̄ (Fund A)",
          "display": "X̄",
          "answer": 8
        },
        {
          "label": "CVar = (s/X̄) × 100",
          "display": "(2 ÷ 8) × 100",
          "answer": 25
        }
      ],
      "interpretation": {
        "template": "Fund A's coefficient of variation is ___%, meaning its risk relative to its return is ___ than a fund with the same SD but a higher average return.",
        "blanks": [
          "25",
          "higher"
        ]
      }
    }
  ],
  "rrt": [
    {
      "scenario": "Reusing the clinic age data (range = 63 years, from 19 to 82), an analyst needs a fast ballpark for the standard deviation before running a full calculation, just to sanity-check her later result.",
      "identifyOptions": [
        "Range Rule of Thumb",
        "Sample SD",
        "Chebyshev's Theorem",
        "Coeff. of Variation"
      ],
      "correctIndex": 0,
      "whyCorrect": "RRT gives a fast, rough SD estimate (Range/4) with no need for every data point — ideal for a quick sanity check.",
      "whyWrong": "Sample SD requires every raw value and real computation; Chebyshev's gives a proportion within k SDs, not an SD estimate itself; CVar needs a known SD already.",
      "steps": [
        {
          "label": "Range",
          "display": "Range",
          "answer": 63
        },
        {
          "label": "s ≈ Range / 4",
          "display": "63 ÷ 4",
          "answer": 15.75
        }
      ],
      "interpretation": {
        "template": "The rough estimated SD is about ___ years.",
        "blanks": [
          "15.75"
        ]
      }
    }
  ],
  "cheby": [
    {
      "scenario": "A dataset of factory cycle times has an unknown, possibly skewed shape — the normal distribution can't be assumed. The engineer still wants a guaranteed lower bound on how much data falls within 2 SDs of the mean.",
      "identifyOptions": [
        "Chebyshev's Theorem",
        "Empirical Rule (normal)",
        "z-Score",
        "Coeff. of Variation"
      ],
      "correctIndex": 0,
      "whyCorrect": "Chebyshev's Theorem holds for ANY distribution shape, unlike the empirical rule, which assumes normality.",
      "whyWrong": "The empirical (68-95-99.7) rule only applies to normal distributions; z-score standardizes one value, not a proportion guarantee; CVar measures relative spread, not a bound.",
      "steps": [
        {
          "label": "k",
          "display": "k",
          "answer": 2
        },
        {
          "label": "k²",
          "display": "2²",
          "answer": 4
        },
        {
          "label": "Proportion ≥ 1 − 1/k²",
          "display": "1 − 1/4",
          "answer": 0.75
        }
      ],
      "interpretation": {
        "template": "At least ___% of the data must fall within ___ standard deviations of the mean, regardless of shape.",
        "blanks": [
          "75",
          "2"
        ]
      }
    }
  ],
  "pctile": [
    {
      "scenario": "In a sorted list of 25 exam scores, exactly 18 scores fall below a particular student's score of 78. The registrar needs to report this student's percentile rank.",
      "identifyOptions": [
        "Percentile Rank",
        "Value at Percentile",
        "z-Score",
        "IQR"
      ],
      "correctIndex": 0,
      "whyCorrect": "Percentile Rank converts a value's position (how many scores are below it) into a percentage — exactly what's asked.",
      "whyWrong": "Value at Percentile works the opposite direction (percentile → position); z-score needs mean and SD, not rank; IQR only describes the middle 50% spread.",
      "steps": [
        {
          "label": "# below X",
          "display": "# below",
          "answer": 18
        },
        {
          "label": "n",
          "display": "n",
          "answer": 25
        },
        {
          "label": "Percentile = [(#below+0.5)/n]×100",
          "display": "[(18+0.5) ÷ 25] × 100",
          "answer": 74
        }
      ],
      "interpretation": {
        "template": "This student scored at the ___th percentile.",
        "blanks": [
          "74"
        ]
      }
    }
  ],
  "c_val": [
    {
      "scenario": "A dataset of 40 sorted commute times needs its first quartile (Q1 = 25th percentile) located. The analyst needs to know exactly which position in the sorted list to look at.",
      "identifyOptions": [
        "Value at Percentile",
        "Percentile Rank",
        "IQR",
        "Class Width"
      ],
      "correctIndex": 0,
      "whyCorrect": "Value at Percentile converts a target percentile into a position c in the sorted data — the first step to finding Q1, Q2, or Q3.",
      "whyWrong": "Percentile Rank works the opposite direction (value → percentile); IQR is Q3−Q1, a later step; Class Width applies to grouped data, not position-finding.",
      "steps": [
        {
          "label": "n",
          "display": "n",
          "answer": 40
        },
        {
          "label": "p",
          "display": "p",
          "answer": 25
        },
        {
          "label": "c = n·p / 100",
          "display": "40 × 25 ÷ 100",
          "answer": 10
        }
      ],
      "interpretation": {
        "template": "Q1 sits at position ___ in the sorted list of 40 commute times.",
        "blanks": [
          "10"
        ]
      }
    }
  ],
  "iqr": [
    {
      "scenario": "A dataset of household incomes has Q1 = $45k and Q3 = $72k. An analyst wants a spread measure that won't be thrown off by a few extremely wealthy outliers.",
      "identifyOptions": [
        "IQR",
        "Range (Ch2)",
        "Sample SD",
        "Chebyshev's Theorem"
      ],
      "correctIndex": 0,
      "whyCorrect": "IQR = Q3 − Q1 covers only the middle 50% of data, making it resistant to outliers — unlike Range or SD.",
      "whyWrong": "Range is entirely determined by the two most extreme (most outlier-sensitive) values; Sample SD is pulled by every outlier; Chebyshev's needs SD as an input.",
      "steps": [
        {
          "label": "Q3",
          "display": "Q3",
          "answer": 72
        },
        {
          "label": "Q1",
          "display": "Q1",
          "answer": 45
        },
        {
          "label": "IQR = Q3 − Q1",
          "display": "72 − 45",
          "answer": 27
        }
      ],
      "interpretation": {
        "template": "The middle 50% of household incomes spans $___k, resistant to a few extreme outliers.",
        "blanks": [
          "27"
        ]
      }
    }
  ],
  "class_p": [
    {
      "scenario": "A standard 52-card deck is shuffled. A magician wants the theoretical probability of drawing a face card (jack, queen, or king) — there are 12 of them — before doing a single draw.",
      "identifyOptions": [
        "Classical Probability",
        "Empirical Probability",
        "Conditional Probability",
        "Complement Rule"
      ],
      "correctIndex": 0,
      "whyCorrect": "Every card is equally likely and the outcome count is known in advance — classical probability P(E)=n(E)/n(S) applies.",
      "whyWrong": "Empirical P needs actual trial data, not a theoretical deck; Conditional P requires a 'given' event; Complement Rule needs P(E) already computed.",
      "steps": [
        {
          "label": "n(E) — face cards",
          "display": "n(E)",
          "answer": 12
        },
        {
          "label": "n(S) — total cards",
          "display": "n(S)",
          "answer": 52
        },
        {
          "label": "P(E) = n(E)/n(S)",
          "display": "12 ÷ 52",
          "answer": 0.2308
        }
      ],
      "interpretation": {
        "template": "The theoretical probability of drawing a face card is ___.",
        "blanks": [
          "0.2308"
        ]
      }
    }
  ],
  "emp_p": [
    {
      "scenario": "A quality control team actually tests 500 items and finds 14 defective. Unlike a theoretical deck of cards, this probability must come from real observed outcomes.",
      "identifyOptions": [
        "Empirical Probability",
        "Classical Probability",
        "Conditional Probability",
        "Multiplication Rule 1"
      ],
      "correctIndex": 0,
      "whyCorrect": "Empirical P(E)=f/n uses actual observed frequency from real trials — exactly the QC testing data here.",
      "whyWrong": "Classical probability needs equally-likely theoretical outcomes, not test data; Conditional P needs a 'given' condition; Mult. Rule 1 combines two separate probabilities.",
      "steps": [
        {
          "label": "f (defective found)",
          "display": "f",
          "answer": 14
        },
        {
          "label": "n (items tested)",
          "display": "n",
          "answer": 500
        },
        {
          "label": "P(E) = f/n",
          "display": "14 ÷ 500",
          "answer": 0.028
        }
      ],
      "interpretation": {
        "template": "The empirical defect rate is ___ (or ___%).",
        "blanks": [
          "0.028",
          "2.8"
        ]
      }
    }
  ],
  "add1": [
    {
      "scenario": "A single fair die is rolled once. A gambler wants the probability of rolling a 2 OR a 5 — two outcomes that obviously can't both happen on the same roll.",
      "identifyOptions": [
        "Addition Rule 1 (mutually exclusive)",
        "Addition Rule 2 (general)",
        "Multiplication Rule 1 (independent)",
        "Conditional Probability"
      ],
      "correctIndex": 0,
      "whyCorrect": "Rolling a 2 and rolling a 5 can never happen simultaneously on one roll — mutually exclusive events use the simple addition rule.",
      "whyWrong": "Addition Rule 2 is needed only when events can overlap; Multiplication Rule 1 is for 'and', not 'or'; Conditional P needs a 'given' condition, not present here.",
      "steps": [
        {
          "label": "P(2)",
          "display": "1/6",
          "answer": 0.1667
        },
        {
          "label": "P(5)",
          "display": "1/6",
          "answer": 0.1667
        },
        {
          "label": "P(A or B) = P(A) + P(B)",
          "display": "1/6 + 1/6",
          "answer": 0.3333
        }
      ],
      "interpretation": {
        "template": "P(2 or 5) = ___.",
        "blanks": [
          "0.3333"
        ]
      }
    }
  ],
  "add2": [
    {
      "scenario": "From a standard deck, a player wants the probability of drawing a king OR a heart. The king of hearts is both, so these two events overlap.",
      "identifyOptions": [
        "Addition Rule 2 (general)",
        "Addition Rule 1 (mutually exclusive)",
        "Multiplication Rule 2 (dependent)",
        "Complement Rule"
      ],
      "correctIndex": 0,
      "whyCorrect": "King and heart overlap (the king of hearts), so the general addition rule must subtract that double-counted overlap.",
      "whyWrong": "Addition Rule 1 would double-count the king of hearts since it ignores overlap; Mult. Rule 2 is for 'and' with dependence; Complement finds the 'not' probability.",
      "steps": [
        {
          "label": "P(king)",
          "display": "4/52",
          "answer": 0.0769
        },
        {
          "label": "P(heart)",
          "display": "13/52",
          "answer": 0.25
        },
        {
          "label": "P(king and heart)",
          "display": "1/52",
          "answer": 0.0192
        },
        {
          "label": "P(A or B) = P(A)+P(B)−P(A and B)",
          "display": "4/52 + 13/52 − 1/52",
          "answer": 0.3077
        }
      ],
      "interpretation": {
        "template": "P(king or heart) = ___.",
        "blanks": [
          "0.3077"
        ]
      }
    }
  ],
  "mult1": [
    {
      "scenario": "A coin is flipped twice. A statistics student wants the probability that both flips land heads — each flip has no effect on the other.",
      "identifyOptions": [
        "Multiplication Rule 1 (independent)",
        "Multiplication Rule 2 (dependent)",
        "Addition Rule 1",
        "Conditional Probability"
      ],
      "correctIndex": 0,
      "whyCorrect": "Coin flips don't influence each other — for independent events, multiply the individual probabilities directly.",
      "whyWrong": "Mult. Rule 2 needs conditional dependence (P(B|A)), which doesn't apply here; Addition Rule is for 'or', not 'and'; Conditional P needs a dependency to condition on.",
      "steps": [
        {
          "label": "P(heads, flip 1)",
          "display": "0.5",
          "answer": 0.5
        },
        {
          "label": "P(heads, flip 2)",
          "display": "0.5",
          "answer": 0.5
        },
        {
          "label": "P(A and B) = P(A)·P(B)",
          "display": "0.5 × 0.5",
          "answer": 0.25
        }
      ],
      "interpretation": {
        "template": "P(both heads) = ___.",
        "blanks": [
          "0.25"
        ]
      }
    }
  ],
  "mult2": [
    {
      "scenario": "Two cards are drawn from a deck WITHOUT replacement. A player wants the probability both are aces — the second draw's odds depend on what the first draw removed.",
      "identifyOptions": [
        "Multiplication Rule 2 (dependent)",
        "Multiplication Rule 1 (independent)",
        "Addition Rule 2",
        "Empirical Probability"
      ],
      "correctIndex": 0,
      "whyCorrect": "Removing the first ace changes the deck for the second draw — dependent events require P(A)·P(B|A).",
      "whyWrong": "Mult. Rule 1 assumes independence, which fails once a card is removed without replacement; Addition Rule handles 'or'; Empirical P needs actual trial data.",
      "steps": [
        {
          "label": "P(1st ace)",
          "display": "4/52",
          "answer": 0.0769
        },
        {
          "label": "P(2nd ace | 1st ace)",
          "display": "3/51",
          "answer": 0.0588
        },
        {
          "label": "P(A and B) = P(A)·P(B|A)",
          "display": "0.0769 × 0.0588",
          "answer": 0.00452
        }
      ],
      "interpretation": {
        "template": "P(both aces, no replacement) = ___.",
        "blanks": [
          "0.00452"
        ]
      }
    }
  ],
  "cond_p": [
    {
      "scenario": "A screening test is positive for 5% of all patients tested (P(positive)=0.05), and 2% of all patients both have the disease AND test positive. A doctor needs to know: given a positive test, what's the chance of actually having the disease?",
      "identifyOptions": [
        "Conditional Probability",
        "Multiplication Rule 1",
        "Addition Rule 2",
        "Complement Rule"
      ],
      "correctIndex": 0,
      "whyCorrect": "The question asks for P(disease GIVEN positive test) — exactly what conditional probability computes from a joint and marginal probability.",
      "whyWrong": "Mult. Rule 1 assumes independence (it isn't here); Addition Rule 2 handles 'or', not 'given'; Complement gives P(not disease), not this conditional.",
      "steps": [
        {
          "label": "P(disease and positive)",
          "display": "0.02",
          "answer": 0.02
        },
        {
          "label": "P(positive)",
          "display": "0.05",
          "answer": 0.05
        },
        {
          "label": "P(disease | positive) = P(A∩B)/P(A)",
          "display": "0.02 ÷ 0.05",
          "answer": 0.4
        }
      ],
      "interpretation": {
        "template": "Given a positive test, the chance of actually having the disease is ___ (only ___%) — a reminder that rare diseases still have many false positives.",
        "blanks": [
          "0.4",
          "40"
        ]
      }
    }
  ],
  "comp_p": [
    {
      "scenario": "Each day has a 70% chance of NO rain, independently, over a 3-day festival. The organizer wants the probability of AT LEAST ONE rainy day — directly computing this requires summing several overlapping cases.",
      "identifyOptions": [
        "Complement Rule",
        "Addition Rule 1",
        "Multiplication Rule 2",
        "Empirical Probability"
      ],
      "correctIndex": 0,
      "whyCorrect": "'At least one' problems are far easier via the complement: 1 − P(none) — avoids adding up every possible rainy-day combination.",
      "whyWrong": "Addition Rule 1 would require enumerating every combination of rainy days; Mult. Rule 2 assumes dependence, but days here are independent; Empirical P needs real trial data.",
      "steps": [
        {
          "label": "P(no rain, one day)",
          "display": "0.7",
          "answer": 0.7
        },
        {
          "label": "P(no rain, all 3 days)",
          "display": "0.7³",
          "answer": 0.343
        },
        {
          "label": "P(at least one) = 1 − P(none)",
          "display": "1 − 0.343",
          "answer": 0.657
        }
      ],
      "interpretation": {
        "template": "P(no rain all 3 days) = ___, so P(at least one rainy day) = ___.",
        "blanks": [
          "0.343",
          "0.657"
        ]
      }
    }
  ],
  "fcr": [
    {
      "scenario": "A bank PIN is exactly 4 digits, each independently chosen from 0–9. A security analyst wants the total number of possible PINs to assess brute-force risk.",
      "identifyOptions": [
        "Fundamental Counting Rule",
        "Permutation nPr",
        "Combination nCr",
        "Multiplication Rule 1 (probability)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Each digit position is an independent choice from 10 options — multiply the counts across all 4 positions.",
      "whyWrong": "Permutation nPr counts orderings *without replacement* from a fixed pool, not repeated independent choices; Combination ignores order and repeats; Mult. Rule 1 gives a probability, not a count.",
      "steps": [
        {
          "label": "Choices per digit",
          "display": "10 (0–9)",
          "answer": 10
        },
        {
          "label": "Number of digit positions",
          "display": "4",
          "answer": 4
        },
        {
          "label": "Total = k₁·k₂·k₃·k₄",
          "display": "10 × 10 × 10 × 10",
          "answer": 10000
        }
      ],
      "interpretation": {
        "template": "There are ___ possible 4-digit PINs.",
        "blanks": [
          "10000"
        ]
      }
    }
  ],
  "perm": [
    {
      "scenario": "8 runners finish a race. A committee needs to award distinct gold, silver, and bronze medals — order clearly matters (1st ≠ 2nd ≠ 3rd).",
      "identifyOptions": [
        "Permutation nPr",
        "Combination nCr",
        "Fundamental Counting Rule",
        "Permutation (identical objects)"
      ],
      "correctIndex": 0,
      "whyCorrect": "We're selecting AND ordering 3 runners out of 8 into distinct medal positions — that's exactly what nPr counts.",
      "whyWrong": "Combination nCr ignores order, which loses the gold/silver/bronze distinction; FCR would require separately reasoning about diminishing choices; Permutation-with-repeats needs identical objects, which runners aren't.",
      "steps": [
        {
          "label": "n",
          "display": "n",
          "answer": 8
        },
        {
          "label": "r",
          "display": "r",
          "answer": 3
        },
        {
          "label": "nPr = n! / (n−r)!",
          "display": "8! ÷ 5!",
          "answer": 336
        }
      ],
      "interpretation": {
        "template": "There are ___ possible ways to award gold, silver, and bronze.",
        "blanks": [
          "336"
        ]
      }
    }
  ],
  "perm2": [
    {
      "scenario": "A student wants to know how many distinct arrangements exist of the letters in the word 'LEVEL' — but the two L's and two E's are indistinguishable from each other.",
      "identifyOptions": [
        "Permutation (identical objects)",
        "Permutation nPr",
        "Combination nCr",
        "Fundamental Counting Rule"
      ],
      "correctIndex": 0,
      "whyCorrect": "Some objects (the L's, the E's) are identical, so ordinary nPr over-counts arrangements that look the same — divide by each repeated group's factorial.",
      "whyWrong": "Plain nPr would treat both L's as distinguishable, over-counting; Combination doesn't arrange anything; FCR doesn't correct for repeated-letter overcounting.",
      "steps": [
        {
          "label": "n = total letters",
          "display": "5",
          "answer": 5
        },
        {
          "label": "r₁ = repeated L's, r₂ = repeated E's",
          "display": "2! and 2!",
          "answer": 2
        },
        {
          "label": "n! / (r₁!·r₂!)",
          "display": "5! ÷ (2!×2!)",
          "answer": 30
        }
      ],
      "interpretation": {
        "template": "There are ___ distinct arrangements of the letters in LEVEL.",
        "blanks": [
          "30"
        ]
      }
    }
  ],
  "comb": [
    {
      "scenario": "A club of 10 members needs to select a 3-person committee. Unlike medal positions, every committee member has the same role — order doesn't matter.",
      "identifyOptions": [
        "Combination nCr",
        "Permutation nPr",
        "Fundamental Counting Rule",
        "Multinomial"
      ],
      "correctIndex": 0,
      "whyCorrect": "Selecting 3 people for equal-role positions (a committee) with no ordering required is exactly what nCr counts.",
      "whyWrong": "Permutation nPr would over-count by treating each ordering of the same 3 people as different; FCR doesn't account for unordered selection; Multinomial needs multiple category types, not one group.",
      "steps": [
        {
          "label": "n",
          "display": "n",
          "answer": 10
        },
        {
          "label": "r",
          "display": "r",
          "answer": 3
        },
        {
          "label": "nCr = n! / [(n−r)!·r!]",
          "display": "10! ÷ (7!×3!)",
          "answer": 120
        }
      ],
      "interpretation": {
        "template": "There are ___ possible 3-person committees.",
        "blanks": [
          "120"
        ]
      }
    }
  ],
  "disc_mu": [
    {
      "scenario": "A car dealership tracks daily sales as a probability distribution: 0 cars (10% of days), 1 car (30%), 2 cars (40%), 3 cars (20%). The manager wants the expected number of cars sold per day for revenue forecasting.",
      "identifyOptions": [
        "Distribution Mean",
        "Sample Mean",
        "Expected Value",
        "Binomial Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "This is a full discrete probability distribution over X, so μ = Σ[X·P(X)] gives its theoretical mean.",
      "whyWrong": "Sample Mean needs raw observed data, not probabilities; Expected Value is mathematically identical here but is the label used for payoffs/decisions, not describing a distribution's center; Binomial Mean only applies to a binomial setup (n, p), not an arbitrary distribution.",
      "steps": [
        {
          "label": "Σ[X·P(X)]",
          "display": "0(0.1)+1(0.3)+2(0.4)+3(0.2)",
          "answer": 1.7
        }
      ],
      "interpretation": {
        "template": "The dealership expects to sell ___ cars per day on average.",
        "blanks": [
          "1.7"
        ]
      }
    }
  ],
  "disc_var": [
    {
      "scenario": "Using the same daily-car-sales distribution (mean 1.7 cars/day), the manager now wants to know how volatile daily sales are — not just the average.",
      "identifyOptions": [
        "Distribution Variance",
        "Sample Variance",
        "Population Variance",
        "Binomial SD"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ² = Σ[X²P(X)] − μ² is the variance formula for a discrete probability distribution, using the probabilities directly.",
      "whyWrong": "Sample/Population Variance need raw observed data points, not a probability table; Binomial SD only applies to a binomial (n, p) setup, not this custom distribution.",
      "steps": [
        {
          "label": "Σ[X²·P(X)]",
          "display": "0²(0.1)+1²(0.3)+2²(0.4)+3²(0.2)",
          "answer": 3.7
        },
        {
          "label": "μ²",
          "display": "1.7²",
          "answer": 2.89
        },
        {
          "label": "σ² = Σ[X²P(X)] − μ²",
          "display": "3.7 − 2.89",
          "answer": 0.81
        }
      ],
      "interpretation": {
        "template": "The variance of daily car sales is ___ cars².",
        "blanks": [
          "0.81"
        ]
      }
    }
  ],
  "exp_val": [
    {
      "scenario": "An insurer's policy: if a customer files a claim (2% chance), the insurer nets −$500; if not (98% chance), the insurer nets +$100 in premium. Management wants the expected profit per policy to set pricing.",
      "identifyOptions": [
        "Expected Value",
        "Distribution Mean",
        "Population Mean",
        "Binomial Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "This is a business decision under uncertainty (profit/loss outcomes with probabilities) — the classic use case for Expected Value, E(X)=Σ[X·P(X)].",
      "whyWrong": "Distribution Mean is the same math but used to describe a distribution's center, not a payoff decision; Population Mean needs a known finite population, not probabilistic outcomes; Binomial Mean requires a binomial (n,p) structure, absent here.",
      "steps": [
        {
          "label": "Claim outcome × P(claim)",
          "display": "-500 × 0.02",
          "answer": -10
        },
        {
          "label": "No-claim outcome × P(no claim)",
          "display": "100 × 0.98",
          "answer": 98
        },
        {
          "label": "E(X) = Σ[X·P(X)]",
          "display": "-10 + 98",
          "answer": 88
        }
      ],
      "interpretation": {
        "template": "The insurer's expected profit per policy is $___.",
        "blanks": [
          "88"
        ]
      }
    }
  ],
  "binom": [
    {
      "scenario": "A salesperson closes 30% of cold calls. Out of 10 calls made today, what's the probability of EXACTLY 3 successful closes?",
      "identifyOptions": [
        "Binomial Formula",
        "Poisson",
        "Hypergeometric",
        "Geometric"
      ],
      "correctIndex": 0,
      "whyCorrect": "Fixed number of independent trials (10 calls), constant success probability (30%), asking for exactly X successes — the classic binomial setup.",
      "whyWrong": "Poisson is for rare events over a continuous interval, not a fixed trial count; Hypergeometric needs sampling without replacement from a finite pool; Geometric asks for the trial of the FIRST success, not a count in fixed trials.",
      "steps": [
        {
          "label": "nCx",
          "display": "10C3",
          "answer": 120
        },
        {
          "label": "pˣ",
          "display": "0.3³",
          "answer": 0.027
        },
        {
          "label": "q^(n−x)",
          "display": "0.7⁷",
          "answer": 0.0824
        },
        {
          "label": "P(X) = nCx·pˣ·q^(n−x)",
          "display": "120 × 0.027 × 0.0824",
          "answer": 0.2668
        }
      ],
      "interpretation": {
        "template": "P(exactly 3 closes out of 10 calls) = ___.",
        "blanks": [
          "0.2668"
        ]
      }
    }
  ],
  "binom_mu": [
    {
      "scenario": "A manufacturer knows 4% of units from a production line are defective. Out of a batch of 200 units, quality control wants the expected number of defects before deciding whether the normal approximation is even usable.",
      "identifyOptions": [
        "Binomial Mean",
        "Distribution Mean",
        "Expected Value",
        "Population Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "This IS a binomial setup (fixed n trials, constant p) — μ=np is the shortcut mean, also used to verify np≥5 for normal approximation.",
      "whyWrong": "Distribution Mean (Σ[X·P(X)]) works too but requires building the full probability table first — np is the direct shortcut specific to binomial; Expected Value and Population Mean don't apply to a batch-defect-count setup like this.",
      "steps": [
        {
          "label": "n",
          "display": "n",
          "answer": 200
        },
        {
          "label": "p",
          "display": "p",
          "answer": 0.04
        },
        {
          "label": "μ = n·p",
          "display": "200 × 0.04",
          "answer": 8
        }
      ],
      "interpretation": {
        "template": "The expected number of defects is ___ out of 200 units.",
        "blanks": [
          "8"
        ]
      }
    }
  ],
  "binom_sd": [
    {
      "scenario": "For the same 200-unit batch at 4% defect rate (μ=8 expected defects), QC now wants the standard deviation to build control limits for the normal approximation to the binomial.",
      "identifyOptions": [
        "Binomial SD",
        "Distribution Variance",
        "Sample SD",
        "Population SD"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ=√(npq) is the direct shortcut for a binomial setup's SD, needed for the normal approximation to the binomial distribution.",
      "whyWrong": "Distribution Variance requires building the full probability table first, unnecessary here; Sample/Population SD both need raw individual observations, not an (n,p) binomial structure.",
      "steps": [
        {
          "label": "n·p·q",
          "display": "200 × 0.04 × 0.96",
          "answer": 7.68
        },
        {
          "label": "σ = √(npq)",
          "display": "√7.68",
          "answer": 2.771
        }
      ],
      "interpretation": {
        "template": "The SD of the number of defects is ___ units.",
        "blanks": [
          "2.771"
        ]
      }
    }
  ],
  "multi": [
    {
      "scenario": "A genetics cross predicts offspring in 3 categories with probabilities 0.25, 0.50, 0.25. Out of 20 offspring, a biologist wants the probability of observing exactly 5, 10, and 5 in each category respectively.",
      "identifyOptions": [
        "Multinomial",
        "Binomial Formula",
        "Chi-Square GOF",
        "Combination nCr"
      ],
      "correctIndex": 0,
      "whyCorrect": "More than 2 outcome categories with fixed probabilities per trial — the multinomial extends the binomial beyond 2 categories.",
      "whyWrong": "Binomial only handles exactly 2 categories (success/failure); Chi-square GOF tests whether observed frequencies MATCH the expected distribution, it doesn't compute exact joint probabilities; nCr alone ignores the probability weighting.",
      "steps": [
        {
          "label": "n! / (X₁!X₂!X₃!)",
          "display": "20! / (5!×10!×5!)",
          "answer": 46558512
        },
        {
          "label": "p₁^X₁·p₂^X₂·p₃^X₃",
          "display": "0.25⁵×0.5¹⁰×0.25⁵",
          "answer": 0
        },
        {
          "label": "P = coefficient × probability part",
          "display": "46558512 × 0",
          "answer": 0.04336
        }
      ],
      "interpretation": {
        "template": "P(exactly 5, 10, 5 in the three categories) = ___.",
        "blanks": [
          "0.04336"
        ]
      }
    }
  ],
  "poisson": [
    {
      "scenario": "A call center averages λ=4 calls per minute. The shift supervisor wants the probability of receiving EXACTLY 6 calls in a given minute — a rare-event count over a fixed interval, not a fixed number of trials.",
      "identifyOptions": [
        "Poisson",
        "Binomial Formula",
        "Geometric",
        "Hypergeometric"
      ],
      "correctIndex": 0,
      "whyCorrect": "Counting events (calls) over a fixed continuous interval (one minute) at a known average rate λ is the Poisson distribution's signature use case.",
      "whyWrong": "Binomial needs a fixed number of discrete trials with a per-trial probability, not a continuous-time rate; Geometric asks for the trial of first success; Hypergeometric needs a finite population sampled without replacement.",
      "steps": [
        {
          "label": "e^(−λ)",
          "display": "e^(−4)",
          "answer": 0.01832
        },
        {
          "label": "λˣ",
          "display": "4⁶",
          "answer": 4096
        },
        {
          "label": "X!",
          "display": "6!",
          "answer": 720
        },
        {
          "label": "P(X;λ) = e^(−λ)·λˣ/X!",
          "display": "0.01832 × 4096 ÷ 720",
          "answer": 0.1042
        }
      ],
      "interpretation": {
        "template": "P(exactly 6 calls in a minute) = ___.",
        "blanks": [
          "0.1042"
        ]
      }
    }
  ],
  "hypgeo": [
    {
      "scenario": "A shipment of 20 items has 5 known defective (a=5) and 15 good (b=15). An inspector samples 4 items WITHOUT replacement. What's the probability exactly 2 of the 4 sampled are defective?",
      "identifyOptions": [
        "Hypergeometric",
        "Binomial Formula",
        "Poisson",
        "Multinomial"
      ],
      "correctIndex": 0,
      "whyCorrect": "Sampling without replacement from a small, finite population (20 items) — the binomial's constant-p assumption breaks down, so hypergeometric applies.",
      "whyWrong": "Binomial assumes sampling with replacement (constant p each draw), invalid for a small finite batch; Poisson models rate-based counts over an interval, not finite sampling; Multinomial needs more than 2 outcome categories.",
      "steps": [
        {
          "label": "aCx (defective ways)",
          "display": "5C2",
          "answer": 10
        },
        {
          "label": "bC(n−x) (good ways)",
          "display": "15C2",
          "answer": 105
        },
        {
          "label": "(a+b)Cn (total ways)",
          "display": "20C4",
          "answer": 4845
        },
        {
          "label": "P(X) = (aCx·bC(n−x)) / (a+b)Cn",
          "display": "(10×105) ÷ 4845",
          "answer": 0.2167
        }
      ],
      "interpretation": {
        "template": "P(exactly 2 of 4 sampled are defective) = ___.",
        "blanks": [
          "0.2167"
        ]
      }
    }
  ],
  "geometric": [
    {
      "scenario": "A telemarketer has a 20% success rate per call, and calls are independent. What's the probability that the FIRST sale happens on exactly the 4th call (not before, not after)?",
      "identifyOptions": [
        "Geometric",
        "Binomial Formula",
        "Poisson",
        "Hypergeometric"
      ],
      "correctIndex": 0,
      "whyCorrect": "Asking for the trial number of the FIRST success (not a count of successes in fixed trials) is exactly the geometric distribution's use case.",
      "whyWrong": "Binomial asks how many successes occur in a fixed number of trials, not which trial the first success lands on; Poisson counts events over an interval; Hypergeometric needs a finite population without replacement.",
      "steps": [
        {
          "label": "p",
          "display": "p",
          "answer": 0.2
        },
        {
          "label": "(1−p)^(n−1)",
          "display": "0.8³",
          "answer": 0.512
        },
        {
          "label": "P(n) = p·(1−p)^(n−1)",
          "display": "0.2 × 0.512",
          "answer": 0.1024
        }
      ],
      "interpretation": {
        "template": "P(first sale on exactly the 4th call) = ___.",
        "blanks": [
          "0.1024"
        ]
      }
    }
  ],
  "znorm": [
    {
      "scenario": "SAT scores are normally distributed with μ=500, σ=100. A student scored 680. An admissions officer wants to find the area (percentile) under the normal curve for this score, which first requires standardizing it.",
      "identifyOptions": [
        "z-Score (Normal)",
        "X from z",
        "Mean of X̄",
        "Std Error of Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "To use the standard normal table for a normally-distributed variable, first transform the raw score to z using known μ and σ.",
      "whyWrong": "X from z runs the opposite direction (z → raw score); Mean of X̄ concerns sampling distributions, not single normal values; SEM is a denominator for sample means, not single-score standardizing.",
      "steps": [
        {
          "label": "X − μ",
          "display": "680 − 500",
          "answer": 180
        },
        {
          "label": "σ",
          "display": "σ",
          "answer": 100
        },
        {
          "label": "z = (X − μ) / σ",
          "display": "180 ÷ 100",
          "answer": 1.8
        }
      ],
      "interpretation": {
        "template": "z = ___, meaning this score is ___ SDs above the mean, which the officer can now look up in the standard normal table.",
        "blanks": [
          "1.8",
          "1.8"
        ]
      }
    }
  ],
  "x_from_z": [
    {
      "scenario": "A university wants to admit only the top 10% of applicants on a normally-distributed entrance exam (μ=500, σ=100). The cutoff percentile corresponds to z=1.28 — the admissions office needs the actual raw score cutoff.",
      "identifyOptions": [
        "X from z",
        "z-Score (Normal)",
        "CLT z-Formula",
        "Std Error of Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "Going from a known z-value (from a percentile table) back to a raw cutoff score requires reversing the standardization formula.",
      "whyWrong": "z-Score (Normal) runs the opposite direction (raw → z); CLT z-Formula concerns sample means, not raw score cutoffs; SEM only applies to sampling distributions.",
      "steps": [
        {
          "label": "z·σ",
          "display": "1.28 × 100",
          "answer": 128
        },
        {
          "label": "X = z·σ + μ",
          "display": "128 + 500",
          "answer": 628
        }
      ],
      "interpretation": {
        "template": "The top-10% cutoff score is ___.",
        "blanks": [
          "628"
        ]
      }
    }
  ],
  "mu_xbar": [
    {
      "scenario": "A city's true average commute time is μ=35 minutes. A researcher plans to take many different random samples and compute each sample's mean X̄. Before running the study, she wants to know what the average of ALL those possible sample means would be.",
      "identifyOptions": [
        "Mean of X̄",
        "Sample Mean",
        "Std Error of Mean",
        "CLT z-Formula"
      ],
      "correctIndex": 0,
      "whyCorrect": "This is the Central Limit Theorem's foundational fact: the mean of the sampling distribution of X̄ always equals the population mean, μ_X̄ = μ.",
      "whyWrong": "Sample Mean is one single sample's average, not the theoretical mean of the whole sampling distribution; SEM measures spread, not center; CLT z-Formula standardizes one sample mean, it doesn't state the sampling distribution's center.",
      "steps": [
        {
          "label": "μ (population mean)",
          "display": "μ",
          "answer": 35
        },
        {
          "label": "μ_X̄ = μ",
          "display": "μ_X̄",
          "answer": 35
        }
      ],
      "interpretation": {
        "template": "The mean of the sampling distribution of X̄ equals ___ minutes — identical to the population mean itself, no matter the sample size.",
        "blanks": [
          "35"
        ]
      }
    }
  ],
  "sem": [
    {
      "scenario": "Population commute times have σ=15 minutes. A researcher plans to sample n=36 commuters and compute the sample mean. She needs to know how much that sample mean is expected to vary from the true population mean, before running any test.",
      "identifyOptions": [
        "Std Error of Mean",
        "Sample SD",
        "Population SD",
        "Sample Variance"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ_X̄ = σ/√n measures the spread of the SAMPLING DISTRIBUTION of X̄ — the exact denominator every z/t-test for a mean needs.",
      "whyWrong": "Sample/Population SD describe individual data spread, not sample-mean-to-sample-mean spread; Sample Variance is squared units and describes raw data, not the sampling distribution.",
      "steps": [
        {
          "label": "σ",
          "display": "σ",
          "answer": 15
        },
        {
          "label": "√n",
          "display": "√36",
          "answer": 6
        },
        {
          "label": "σ_X̄ = σ / √n",
          "display": "15 ÷ 6",
          "answer": 2.5
        }
      ],
      "interpretation": {
        "template": "The standard error of the mean is ___ minutes for samples of size 36.",
        "blanks": [
          "2.5"
        ]
      }
    }
  ],
  "clt": [
    {
      "scenario": "The population commute mean is μ=35 min, σ=15 min. A sample of n=36 commuters produces X̄=38 min. A researcher wants to know how unusual this sample mean is, standardized using the sampling distribution (not a single raw value).",
      "identifyOptions": [
        "CLT z-Formula",
        "z-Score (Normal)",
        "Std Error of Mean",
        "Mean of X̄"
      ],
      "correctIndex": 0,
      "whyCorrect": "This standardizes a SAMPLE MEAN (not a single value), so the denominator must be σ/√n — the CLT z-formula, foundational to every mean-based z-test.",
      "whyWrong": "Plain z-Score (Normal) standardizes one raw observation using σ, not a sample mean using σ/√n; SEM is only the denominator, one input to this formula; Mean of X̄ just states μ_X̄=μ, it doesn't standardize anything.",
      "steps": [
        {
          "label": "X̄ − μ",
          "display": "38 − 35",
          "answer": 3
        },
        {
          "label": "σ / √n",
          "display": "15 ÷ 6",
          "answer": 2.5
        },
        {
          "label": "z = (X̄ − μ) / (σ/√n)",
          "display": "3 ÷ 2.5",
          "answer": 1.2
        }
      ],
      "interpretation": {
        "template": "z = ___, meaning this sample mean is ___ SEMs above the population mean — moderately, not extremely, unusual.",
        "blanks": [
          "1.2",
          "1.2"
        ]
      }
    }
  ],
  "z_ci": [
    {
      "scenario": "A sample of 49 patients has a mean recovery time of 82 hours. Population σ=12 hours is known from years of hospital records. Administrators want a 95% confidence interval for the true mean recovery time.",
      "identifyOptions": [
        "z CI for Mean",
        "t CI for Mean",
        "CI for Proportion",
        "z Test (Mean)"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ is known (from historical records) and we want a range estimate (not a hypothesis test) — the z-interval applies directly.",
      "whyWrong": "t CI is for unknown σ; CI for Proportion is for categorical/success-rate data, not a continuous mean; z Test (Mean) tests a specific hypothesized value, it doesn't produce a range.",
      "steps": [
        {
          "label": "σ / √n",
          "display": "12 ÷ 7",
          "answer": 1.7143
        },
        {
          "label": "Margin = z·(σ/√n)",
          "display": "1.96 × 1.7143",
          "answer": 3.36
        },
        {
          "label": "X̄ ± margin",
          "display": "82 ± 3.36",
          "answer": 3.36
        }
      ],
      "interpretation": {
        "template": "95% CI: ___ ± ___ = (___ , ___) hours.",
        "blanks": [
          "82",
          "3.36",
          "78.64",
          "85.36"
        ]
      }
    }
  ],
  "t_ci": [
    {
      "scenario": "A small sample of 20 batteries has a mean lifespan of 45 hours, sample SD s=6 hours. Population σ is unknown. The manufacturer wants a 95% CI for the true mean lifespan.",
      "identifyOptions": [
        "t CI for Mean",
        "z CI for Mean",
        "CI for Variance",
        "t Test (Mean)"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ is unknown and estimated by s from a small sample — the t-distribution (wider than z) correctly accounts for that extra uncertainty.",
      "whyWrong": "z CI needs known σ, not available here; CI for Variance estimates σ², not the mean; t Test tests a hypothesized value, it doesn't build an interval.",
      "steps": [
        {
          "label": "s / √n",
          "display": "6 ÷ √20",
          "answer": 1.3416
        },
        {
          "label": "t* (df=19, 95%)",
          "display": "from t-table",
          "answer": 2.093
        },
        {
          "label": "Margin = t*·(s/√n)",
          "display": "2.093 × 1.3416",
          "answer": 2.808
        }
      ],
      "interpretation": {
        "template": "95% CI: ___ ± ___ = (___ , ___) hours.",
        "blanks": [
          "45",
          "2.808",
          "42.192",
          "47.808"
        ]
      }
    }
  ],
  "n_mean": [
    {
      "scenario": "A researcher wants to estimate a population mean to within E=2 units at 95% confidence, and knows from past studies that σ≈15. Before collecting any data, she needs to know how many subjects to recruit.",
      "identifyOptions": [
        "Sample Size (Mean)",
        "Sample Size (Prop.)",
        "z CI for Mean",
        "Std Error of Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "This is a study-design question BEFORE data collection — solving the margin-of-error formula for n gives the minimum required sample size.",
      "whyWrong": "Sample Size (Prop.) is for proportions/percentages, not a continuous mean; z CI for Mean requires data already in hand to build an interval; SEM needs n already known.",
      "steps": [
        {
          "label": "z·σ / E",
          "display": "1.96 × 15 ÷ 2",
          "answer": 14.7
        },
        {
          "label": "n = (z·σ/E)²",
          "display": "14.7²",
          "answer": 216.09
        },
        {
          "label": "round up to whole subjects",
          "display": "ceiling",
          "answer": 217
        }
      ],
      "interpretation": {
        "template": "She needs a minimum sample of ___ subjects (always round up).",
        "blanks": [
          "217"
        ]
      }
    }
  ],
  "p_hat": [
    {
      "scenario": "In a poll of 500 registered voters, 310 say they support a new policy. Before running any inference test or building a CI, the pollster needs the basic sample proportion.",
      "identifyOptions": [
        "Sample Proportion",
        "Sample Mean",
        "Class %",
        "Empirical Probability"
      ],
      "correctIndex": 0,
      "whyCorrect": "p̂ = X/n is the categorical equivalent of the sample mean — the foundation for every proportion-based test and CI that follows.",
      "whyWrong": "Sample Mean is for continuous numeric data, not counts of successes; Class % converts a frequency table row into a percentage, a different context; Empirical P is conceptually the same math but the term p̂ specifically feeds proportion inference formulas downstream.",
      "steps": [
        {
          "label": "X (successes)",
          "display": "X",
          "answer": 310
        },
        {
          "label": "n",
          "display": "n",
          "answer": 500
        },
        {
          "label": "p̂ = X / n",
          "display": "310 ÷ 500",
          "answer": 0.62
        }
      ],
      "interpretation": {
        "template": "The sample proportion supporting the policy is ___ (or ___%).",
        "blanks": [
          "0.62",
          "62"
        ]
      }
    }
  ],
  "n_prop": [
    {
      "scenario": "A pollster is planning a new survey and wants margin of error E=0.03 at 95% confidence. There's no prior estimate of the true proportion, so she must use the most conservative assumption (p̂=0.5) to determine sample size.",
      "identifyOptions": [
        "Sample Size (Prop.)",
        "Sample Size (Mean)",
        "CI for Proportion",
        "z Test (Proportion)"
      ],
      "correctIndex": 0,
      "whyCorrect": "This is study design for a PROPORTION before data collection — n=p̂q̂(z/E)² gives the required sample size, using p̂=0.5 (the most conservative, largest-n case) when unknown.",
      "whyWrong": "Sample Size (Mean) is for continuous data, not proportions; CI for Proportion needs data already collected; z Test (Proportion) tests a hypothesis, it doesn't plan sample size.",
      "steps": [
        {
          "label": "p̂·q̂",
          "display": "0.5 × 0.5",
          "answer": 0.25
        },
        {
          "label": "(z/E)²",
          "display": "(1.96 ÷ 0.03)²",
          "answer": 4268.44
        },
        {
          "label": "n = p̂q̂(z/E)²",
          "display": "0.25 × 4268.44",
          "answer": 1067.11
        }
      ],
      "interpretation": {
        "template": "She needs a minimum sample of ___ voters (always round up).",
        "blanks": [
          "1068"
        ]
      }
    }
  ],
  "var_ci": [
    {
      "scenario": "A machine-part sample of 15 units has s²=12.3 mm². Engineers want a 95% confidence interval for the TRUE population variance to check manufacturing tolerances — not the mean.",
      "identifyOptions": [
        "CI for Variance",
        "CI for SD",
        "CI for Mean (t)",
        "χ² Test (Variance)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Interval estimates for σ² (not σ or μ) use the chi-square distribution's two critical values, since χ² is skewed and asymmetric.",
      "whyWrong": "CI for SD is the square-root version — a related but different quantity than asked; CI for Mean estimates μ, not σ²; χ² Test (Variance) tests a specific hypothesized value, it doesn't build a range.",
      "steps": [
        {
          "label": "(n−1)s²",
          "display": "14 × 12.3",
          "answer": 172.2
        },
        {
          "label": "÷ χ²_R (upper crit, df=14)",
          "display": "172.2 ÷ 26.119",
          "answer": 6.593
        },
        {
          "label": "÷ χ²_L (lower crit, df=14)",
          "display": "172.2 ÷ 5.629",
          "answer": 30.592
        }
      ],
      "interpretation": {
        "template": "95% CI for σ²: (___ , ___) mm².",
        "blanks": [
          "6.593",
          "30.592"
        ]
      }
    }
  ],
  "sd_ci": [
    {
      "scenario": "Using the same 15-unit sample (s²=12.3 mm²), engineers now want the confidence interval reported in the original units (mm), not squared units — for a process-capability report management can actually read.",
      "identifyOptions": [
        "CI for SD",
        "CI for Variance",
        "CI for Mean (z)",
        "χ² Test (Variance)"
      ],
      "correctIndex": 0,
      "whyCorrect": "CI for SD takes the square root of each endpoint of the variance interval, returning to the original measurement units.",
      "whyWrong": "CI for Variance is in squared units, less interpretable for a tolerance report; CI for Mean (z) estimates μ, not σ; χ² Test (Variance) is a hypothesis test, not an interval.",
      "steps": [
        {
          "label": "Lower bound of σ² (from CI for Variance)",
          "display": "computed above",
          "answer": 6.593
        },
        {
          "label": "√(lower)",
          "display": "√6.593",
          "answer": 2.568
        },
        {
          "label": "√(upper)",
          "display": "√30.592",
          "answer": 5.531
        }
      ],
      "interpretation": {
        "template": "95% CI for σ: (___ , ___) mm.",
        "blanks": [
          "2.568",
          "5.531"
        ]
      }
    }
  ],
  "z_prop": [
    {
      "scenario": "A company claims 50% of customers prefer its new packaging. A survey of 150 customers finds 60% prefer it. Is this significantly different from the claimed 50%?",
      "identifyOptions": [
        "z Test (Proportion)",
        "z Test (Mean)",
        "CI for Proportion",
        "χ² GOF"
      ],
      "correctIndex": 0,
      "whyCorrect": "We're testing a hypothesized proportion p₀ against a sample proportion with large n — the z-test for proportions applies.",
      "whyWrong": "z Test (Mean) is for continuous data, not a proportion; CI for Proportion estimates a range, it doesn't test a specific claim; χ² GOF compares multiple category frequencies, not one binary proportion.",
      "steps": [
        {
          "label": "p̂ − p₀",
          "display": "0.60 − 0.5",
          "answer": 0.1
        },
        {
          "label": "√(p₀q₀/n)",
          "display": "√(0.5×0.5÷150)",
          "answer": 0.0408
        },
        {
          "label": "z = (p̂−p₀)/√(p₀q₀/n)",
          "display": "0.1 ÷ 0.0408",
          "answer": 2.449
        }
      ],
      "interpretation": {
        "template": "z = ___. At α=0.05 (two-tailed, z*=±1.96), we ___ H₀ — evidence the true preference rate differs from 50%.",
        "blanks": [
          "2.449",
          "reject"
        ]
      }
    }
  ],
  "chi_var": [
    {
      "scenario": "A beverage filler is supposed to have variance σ²=10 mL² in fill volume. A sample of 20 bottles shows s²=18 mL². Quality control wants to test if the true variance now exceeds the specification.",
      "identifyOptions": [
        "χ² Test (Variance)",
        "F Test (2 Variances)",
        "CI for Variance",
        "t Test (Mean)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Testing ONE sample variance against a hypothesized value (not comparing two variances) uses the chi-square test.",
      "whyWrong": "F Test compares TWO sample variances against each other, not one sample against a hypothesized value; CI for Variance estimates a range, it doesn't test a specific claim; t Test (Mean) tests a mean, not a variance.",
      "steps": [
        {
          "label": "n − 1",
          "display": "20 − 1",
          "answer": 19
        },
        {
          "label": "s²",
          "display": "s²",
          "answer": 18
        },
        {
          "label": "χ² = (n−1)s² / σ²",
          "display": "19 × 18 ÷ 10",
          "answer": 34.2
        }
      ],
      "interpretation": {
        "template": "χ²(df=___) = ___. This exceeds most critical values, suggesting the true variance ___ the specification.",
        "blanks": [
          "19",
          "34.2",
          "exceeds"
        ]
      }
    }
  ],
  "z2mu": [
    {
      "scenario": "Two large call centers report mean handle times: Center A (n=50) X̄=85 sec, σ known ≈10 sec; Center B (n=45) X̄=80 sec, σ known ≈12 sec. Ops wants to know if the centers differ significantly.",
      "identifyOptions": [
        "z Test (2 Means)",
        "t Test (2 Means)",
        "t Test (Dependent)",
        "F Test (2 Variances)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Both population σ's are known and both samples are large (n≥30) — the two-sample z-test applies directly.",
      "whyWrong": "t Test (2 Means) is for unknown σ's; t Test (Dependent) needs paired/matched data, but these are two independent centers; F Test compares variances, not means.",
      "steps": [
        {
          "label": "X̄₁ − X̄₂",
          "display": "85 − 80",
          "answer": 5
        },
        {
          "label": "√(σ₁²/n₁ + σ₂²/n₂)",
          "display": "√(10²/50 + 12²/45)",
          "answer": 2.2804
        },
        {
          "label": "z = (X̄₁−X̄₂) / √(σ₁²/n₁+σ₂²/n₂)",
          "display": "5 ÷ 2.2804",
          "answer": 2.193
        }
      ],
      "interpretation": {
        "template": "z = ___. At α=0.05 (two-tailed, z*=±1.96), we ___ H₀ — the centers' handle times ___ significantly.",
        "blanks": [
          "2.193",
          "reject",
          "differ"
        ]
      }
    }
  ],
  "t2mu": [
    {
      "scenario": "Two small teaching methods are compared: Method A (n=12) X̄=78, s=8; Method B (n=14) X̄=74, s=9. Population σ's are unknown, and both are small independent samples.",
      "identifyOptions": [
        "t Test (2 Means)",
        "z Test (2 Means)",
        "t Test (Dependent)",
        "ANOVA"
      ],
      "correctIndex": 0,
      "whyCorrect": "σ's are unknown and samples are small and independent — the two-sample t-test is the correct tool.",
      "whyWrong": "z Test (2 Means) needs known σ's; t Test (Dependent) is for paired data, but these are two separate independent classes; ANOVA is for 3+ groups, not exactly two.",
      "steps": [
        {
          "label": "X̄₁ − X̄₂",
          "display": "78 − 74",
          "answer": 4
        },
        {
          "label": "√(s₁²/n₁ + s₂²/n₂)",
          "display": "√(8²/12 + 9²/14)",
          "answer": 3.3345
        },
        {
          "label": "t = (X̄₁−X̄₂) / √(s₁²/n₁+s₂²/n₂)",
          "display": "4 ÷ 3.3345",
          "answer": 1.2
        }
      ],
      "interpretation": {
        "template": "t = ___. This is a ___ effect, but statistical significance also depends on degrees of freedom and the chosen α.",
        "blanks": [
          "1.2",
          "positive"
        ]
      }
    }
  ],
  "d_bar": [
    {
      "scenario": "A weight-loss program measures 6 participants before and after: differences (before−after, lbs) are 3, 5, 2, 4, 6, 1. Before running a paired t-test, the researcher needs the average difference.",
      "identifyOptions": [
        "Mean of Differences",
        "Sample Mean",
        "t Test (Dependent)",
        "SD of Differences"
      ],
      "correctIndex": 0,
      "whyCorrect": "D̄ = ΣD/n averages the paired DIFFERENCES specifically — the required first input to the paired (dependent) t-test.",
      "whyWrong": "Sample Mean would average raw before/after values, losing the pairing structure; t Test (Dependent) is the final test, not this intermediate step; SD of Differences measures spread, not center.",
      "steps": [
        {
          "label": "ΣD",
          "display": "3+5+2+4+6+1",
          "answer": 21
        },
        {
          "label": "n",
          "display": "n",
          "answer": 6
        },
        {
          "label": "D̄ = ΣD / n",
          "display": "21 ÷ 6",
          "answer": 3.5
        }
      ],
      "interpretation": {
        "template": "The mean weight loss is D̄ = ___ lbs.",
        "blanks": [
          "3.5"
        ]
      }
    }
  ],
  "sd_dep": [
    {
      "scenario": "Using the same 6 paired weight-loss differences (3, 5, 2, 4, 6, 1 lbs), the researcher now needs the variability of those differences — the denominator for the paired t-test.",
      "identifyOptions": [
        "SD of Differences",
        "Sample SD",
        "Mean of Differences",
        "Population SD"
      ],
      "correctIndex": 0,
      "whyCorrect": "sD measures spread of the paired DIFFERENCES specifically, using the same formula shape as sample SD but applied to D values.",
      "whyWrong": "Plain Sample SD would apply to raw before/after values, not to differences; Mean of Differences measures center, not spread; Population SD needs the full population, not a sample.",
      "steps": [
        {
          "label": "ΣD",
          "display": "3+5+2+4+6+1",
          "answer": 21
        },
        {
          "label": "ΣD²",
          "display": "3²+5²+2²+4²+6²+1²",
          "answer": 91
        },
        {
          "label": "n(ΣD²) − (ΣD)²",
          "display": "6×91 − 21²",
          "answer": 105
        },
        {
          "label": "sD = √{[…]/[n(n−1)]}",
          "display": "√(105 ÷ 30)",
          "answer": 1.871
        }
      ],
      "interpretation": {
        "template": "sD = ___ lbs — the paired differences vary by about this much from D̄.",
        "blanks": [
          "1.871"
        ]
      }
    }
  ],
  "t_dep": [
    {
      "scenario": "With D̄=3.5 lbs and sD≈1.87 lbs from 6 paired before/after weigh-ins, the researcher wants to test whether the program produces a real average weight loss (μD ≠ 0), not just chance variation.",
      "identifyOptions": [
        "t Test (Dependent)",
        "t Test (2 Means)",
        "z Test (Mean)",
        "t Test for r"
      ],
      "correctIndex": 0,
      "whyCorrect": "Before/after measurements on the SAME people are paired data — the dependent (paired) t-test correctly accounts for that correlation.",
      "whyWrong": "t Test (2 Means) treats the groups as independent, ignoring the pairing and understating precision; z Test (Mean) needs known σ, not available; t Test for r tests correlation, unrelated to paired means.",
      "steps": [
        {
          "label": "D̄",
          "display": "D̄",
          "answer": 3.5
        },
        {
          "label": "sD / √n",
          "display": "1.871 ÷ √6",
          "answer": 0.764
        },
        {
          "label": "t = D̄ / (sD/√n)",
          "display": "3.5 ÷ 0.764",
          "answer": 4.583
        }
      ],
      "interpretation": {
        "template": "t = ___ with df = ___. This large t suggests the weight loss is ___ than chance alone.",
        "blanks": [
          "4.583",
          "5",
          "more"
        ]
      }
    }
  ],
  "z2p": [
    {
      "scenario": "Two marketing campaigns are compared: Campaign A converts 45 of 100 leads; Campaign B converts 60 of 120 leads. The team wants to know if the true conversion RATES differ.",
      "identifyOptions": [
        "z Test (2 Proportions)",
        "z Test (Proportion)",
        "χ² Independence",
        "z Test (2 Means)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Comparing two independent sample proportions against each other (not one proportion against a fixed claim) uses the pooled two-proportion z-test.",
      "whyWrong": "z Test (Proportion) compares only ONE sample to a fixed hypothesized value, not two samples to each other; χ² Independence tests association in a full contingency table, a different (though related) approach; z Test (2 Means) is for continuous data, not conversion counts.",
      "steps": [
        {
          "label": "p̂₁ = 45/100, p̂₂ = 60/120",
          "display": "0.45, 0.50",
          "answer": -0.05
        },
        {
          "label": "p̄ (pooled)",
          "display": "(45+60)÷(100+120)",
          "answer": 0.4773
        },
        {
          "label": "√[p̄q̄(1/n₁+1/n₂)]",
          "display": "√(0.477×0.523×(1/100+1/120))",
          "answer": 0.0676
        },
        {
          "label": "z = (p̂₁−p̂₂) / √[…]",
          "display": "-0.05 ÷ 0.0676",
          "answer": -0.739
        }
      ],
      "interpretation": {
        "template": "z = ___. At α=0.05 (two-tailed, z*=±1.96), we ___ H₀ — the campaigns' conversion rates ___ significantly.",
        "blanks": [
          "-0.739",
          "fail to reject",
          "do not differ"
        ]
      }
    }
  ],
  "f_test": [
    {
      "scenario": "Before running a two-sample t-test, an analyst must check whether the two groups' variances are equal. Group 1 has s²=18.5, Group 2 has s²=7.2.",
      "identifyOptions": [
        "F Test (2 Variances)",
        "χ² Test (Variance)",
        "t Test (2 Means)",
        "ANOVA F Ratio"
      ],
      "correctIndex": 0,
      "whyCorrect": "Comparing two independent sample variances directly against each other (larger over smaller) is exactly what the F-test does.",
      "whyWrong": "χ² Test (Variance) tests ONE sample variance against a hypothesized value, not two samples against each other; t Test (2 Means) compares means, not variances; ANOVA's F ratio compares 3+ group means' variability, a different comparison structure.",
      "steps": [
        {
          "label": "Larger s² (numerator)",
          "display": "18.5",
          "answer": 18.5
        },
        {
          "label": "Smaller s² (denominator)",
          "display": "7.2",
          "answer": 7.2
        },
        {
          "label": "F = s₁² / s₂²",
          "display": "18.5 ÷ 7.2",
          "answer": 2.569
        }
      ],
      "interpretation": {
        "template": "F = ___. This ratio will be compared to a critical F-value to decide if the variances ___ significantly.",
        "blanks": [
          "2.569",
          "differ"
        ]
      }
    }
  ],
  "t_r": [
    {
      "scenario": "A sample of 15 pairs (advertising spend, sales) produces r=0.72. Before trusting this correlation for business decisions, the analyst must test whether it's statistically significant or could be a fluke of this particular sample.",
      "identifyOptions": [
        "t Test for r",
        "Pearson r",
        "t Test (2 Means)",
        "Regression Line"
      ],
      "correctIndex": 0,
      "whyCorrect": "r itself only measures strength in THIS sample; testing whether the true population correlation ρ≠0 requires the t-test for r.",
      "whyWrong": "Pearson r computes the correlation coefficient itself, not whether it's statistically significant; t Test (2 Means) compares means, not correlation; Regression Line predicts values, it doesn't test significance of the relationship.",
      "steps": [
        {
          "label": "n − 2",
          "display": "15 − 2",
          "answer": 13
        },
        {
          "label": "1 − r²",
          "display": "1 − 0.72²",
          "answer": 0.4816
        },
        {
          "label": "t = r·√[(n−2)/(1−r²)]",
          "display": "0.72 × √(13 ÷ 0.4816)",
          "answer": 3.741
        }
      ],
      "interpretation": {
        "template": "t = ___ with df = ___. This far exceeds typical critical values, so the correlation is ___ significant.",
        "blanks": [
          "3.741",
          "13",
          "statistically"
        ]
      }
    }
  ],
  "r2": [
    {
      "scenario": "A regression of sales on advertising spend has r=0.72. The marketing director wants a single number expressing what PERCENTAGE of sales variation is actually explained by advertising, for a board presentation.",
      "identifyOptions": [
        "Coeff. of Determination",
        "Pearson r",
        "Std Error of Estimate",
        "t Test for r"
      ],
      "correctIndex": 0,
      "whyCorrect": "r² translates correlation strength directly into '% of variation explained' — the number boards actually want, unlike r itself.",
      "whyWrong": "Pearson r is on a −1 to 1 scale describing direction and strength, not a percentage of variance explained; Std Error of Estimate measures average prediction error in original units, not % explained; t Test for r tests significance, not magnitude.",
      "steps": [
        {
          "label": "r",
          "display": "r",
          "answer": 0.72
        },
        {
          "label": "r² = explained/total variation",
          "display": "0.72²",
          "answer": 0.5184
        }
      ],
      "interpretation": {
        "template": "r² = ___, meaning advertising spend explains ___% of the variation in sales.",
        "blanks": [
          "0.5184",
          "51.84"
        ]
      }
    }
  ],
  "se_est": [
    {
      "scenario": "A regression predicts exam score from hours studied across 10 students. The fitted line has residual sum of squares Σ(y−y')² = 13.62. The instructor wants to know, on average, how far off a single prediction typically is.",
      "identifyOptions": [
        "Std Error of Estimate",
        "Sample SD",
        "Std Error of Mean",
        "Coeff. of Determination"
      ],
      "correctIndex": 0,
      "whyCorrect": "sₑ measures the typical size of prediction ERRORS (residuals) around the regression line — the regression-specific analog of SD.",
      "whyWrong": "Sample SD measures spread of raw Y values around their mean, not prediction error around a fitted line; SEM concerns sample-mean variability, unrelated to regression residuals; r² is a percentage, not an error measured in original units.",
      "steps": [
        {
          "label": "Σ(y−y')²",
          "display": "Σ(y−y')²",
          "answer": 13.624
        },
        {
          "label": "n − 2",
          "display": "10 − 2",
          "answer": 8
        },
        {
          "label": "sₑ = √[Σ(y−y')² / (n−2)]",
          "display": "√(13.624 ÷ 8)",
          "answer": 1.305
        }
      ],
      "interpretation": {
        "template": "sₑ = ___ points — a typical prediction is off by about this much.",
        "blanks": [
          "1.305"
        ]
      }
    }
  ],
  "pred_int": [
    {
      "scenario": "Using the same study-hours-vs-score regression (sₑ≈1.31, n=10, X̄=11), the instructor wants to predict ONE specific new student's score at x=22 study hours, with a margin of uncertainty — not just the average trend.",
      "identifyOptions": [
        "Prediction Interval",
        "CI for Mean (t)",
        "Std Error of Estimate",
        "Coeff. of Determination"
      ],
      "correctIndex": 0,
      "whyCorrect": "Predicting a SINGLE future observation (not the average) needs the wider prediction interval, which adds a '+1' term for individual variability beyond the regression line's own uncertainty.",
      "whyWrong": "CI for Mean (t) is for a population mean of X, unrelated to regression prediction; Std Error of Estimate is only one input to this formula, not the final interval; Coeff. of Determination measures fit quality, not a prediction range.",
      "steps": [
        {
          "label": "sₑ",
          "display": "sₑ",
          "answer": 1.305
        },
        {
          "label": "t* (df=8, 95%)",
          "display": "from t-table",
          "answer": 2.306
        },
        {
          "label": "√[1 + 1/n + n(x−X̄)²/(nΣx²−(Σx)²)]",
          "display": "√(1 + 1/n + …)",
          "answer": 1.2111
        },
        {
          "label": "margin = t*·sₑ·√[…]",
          "display": "2.306 × 1.305 × 1.2111",
          "answer": 3.644
        }
      ],
      "interpretation": {
        "template": "For x=22, ŷ=___. 95% prediction interval: ___ ± ___ = (___ , ___).",
        "blanks": [
          "100.13",
          "100.13",
          "3.64",
          "96.49",
          "103.78"
        ]
      }
    }
  ],
  "exp_cell": [
    {
      "scenario": "A 2×2 contingency table cross-tabs smoking status against disease outcome. Row 'Smoker' totals 50, column 'Disease' totals 80, grand total is 200. Before any chi-square test, the researcher needs the EXPECTED count for the Smoker/Disease cell if smoking and disease were unrelated.",
      "identifyOptions": [
        "Expected Cell",
        "χ² Independence",
        "χ² Goodness of Fit",
        "Classical Probability"
      ],
      "correctIndex": 0,
      "whyCorrect": "Every chi-square test on a contingency table first needs Expected Cell counts (row total × column total ÷ grand total) as the baseline for 'no association'.",
      "whyWrong": "χ² Independence is the full test that USES this expected cell value as an input, it doesn't compute it directly; χ² GOF compares against a hypothesized distribution, not row/column margins; Classical Probability needs equally-likely theoretical outcomes, not table margins.",
      "steps": [
        {
          "label": "Row total (Smoker)",
          "display": "50",
          "answer": 50
        },
        {
          "label": "Column total (Disease)",
          "display": "80",
          "answer": 80
        },
        {
          "label": "Grand total",
          "display": "200",
          "answer": 200
        },
        {
          "label": "E = (Row × Col) / Total",
          "display": "50 × 80 ÷ 200",
          "answer": 20
        }
      ],
      "interpretation": {
        "template": "The expected count for Smoker/Disease, if independent, is ___.",
        "blanks": [
          "20"
        ]
      }
    }
  ],
  "chi_ind": [
    {
      "scenario": "In the smoking/disease contingency table, observed counts are 30, 20, 20, 130 (across the 4 cells) versus expected counts of 20, 30, 30, 120 if the two variables were unrelated. The researcher wants to test whether smoking and disease are actually associated.",
      "identifyOptions": [
        "χ² Independence",
        "χ² Goodness of Fit",
        "Expected Cell",
        "z Test (2 Proportions)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Testing whether TWO categorical variables (smoking, disease) are associated with each other, using a full contingency table, is exactly χ² Independence.",
      "whyWrong": "χ² GOF tests ONE variable's distribution against a hypothesized shape, not association between two variables; Expected Cell is just one input to this test, not the test itself; z Test (2 Proportions) only handles a single binary outcome across two groups, not a full multi-cell table.",
      "steps": [
        {
          "label": "(O−E)²/E, cell 1",
          "display": "(30−20)²÷20",
          "answer": 5
        },
        {
          "label": "(O−E)²/E, cell 2",
          "display": "(20−30)²÷30",
          "answer": 3.333
        },
        {
          "label": "(O−E)²/E, cell 3",
          "display": "(20−30)²÷30",
          "answer": 3.333
        },
        {
          "label": "(O−E)²/E, cell 4",
          "display": "(130−120)²÷120",
          "answer": 0.833
        },
        {
          "label": "χ² = Σ(O−E)²/E",
          "display": "sum of all 4 cells",
          "answer": 12.5
        }
      ],
      "interpretation": {
        "template": "χ²(df=___) = ___. At α=0.05, critical value ≈ 3.841. We ___ H₀ — smoking and disease ___ associated.",
        "blanks": [
          "1",
          "12.5",
          "reject",
          "are"
        ]
      }
    }
  ],
  "grand_mn": [
    {
      "scenario": "A researcher compares plant growth (cm) under 3 fertilizers: Fertilizer A [22,25,24,27], B [30,28,32,31], C [18,20,19,21]. Before computing between-group variance for ANOVA, she needs the grand mean across all 12 plants combined.",
      "identifyOptions": [
        "Grand Mean",
        "Sample Mean",
        "Weighted Mean",
        "Between-Group Var"
      ],
      "correctIndex": 0,
      "whyCorrect": "Grand Mean pools every observation across ALL groups into one overall average — the reference point ANOVA's between-group variance measures deviations from.",
      "whyWrong": "Sample Mean typically refers to one group's average, not the pooled overall value; Weighted Mean needs externally assigned weights, not group membership; Between-Group Var is a later step that USES the grand mean, not a substitute for it.",
      "steps": [
        {
          "label": "ΣX (all 12 values)",
          "display": "22+25+24+27+30+28+32+31+18+20+19+21",
          "answer": 297
        },
        {
          "label": "N (total observations)",
          "display": "N",
          "answer": 12
        },
        {
          "label": "X̄_GM = ΣX / N",
          "display": "297 ÷ 12",
          "answer": 24.75
        }
      ],
      "interpretation": {
        "template": "The grand mean growth across all 3 fertilizers is ___ cm.",
        "blanks": [
          "24.75"
        ]
      }
    }
  ],
  "s2_b": [
    {
      "scenario": "Using the fertilizer study (group means ≈24.5, 30.25, 19.5 cm; grand mean ≈24.75 cm), the researcher needs a single number capturing how much the GROUP means differ from each other — the numerator of the ANOVA F ratio.",
      "identifyOptions": [
        "Between-Group Var",
        "Within-Group Var",
        "Grand Mean",
        "Sample Variance"
      ],
      "correctIndex": 0,
      "whyCorrect": "s²_Between measures how spread out the GROUP MEANS are around the grand mean — large values suggest the treatments (fertilizers) really differ.",
      "whyWrong": "Within-Group Var measures spread INSIDE each group instead, the opposite comparison; Grand Mean is only an input to this formula, not the variance itself; Sample Variance describes one flat dataset, ignoring group structure entirely.",
      "steps": [
        {
          "label": "n₁(X̄₁−X̄GM)²",
          "display": "4×(24.5−24.75)²",
          "answer": 0.25
        },
        {
          "label": "n₂(X̄₂−X̄GM)²",
          "display": "4×(30.25−24.75)²",
          "answer": 121
        },
        {
          "label": "n₃(X̄₃−X̄GM)²",
          "display": "4×(19.5−24.75)²",
          "answer": 110.25
        },
        {
          "label": "s²B = Σnᵢ(X̄ᵢ−X̄GM)² / (k−1)",
          "display": "sum ÷ 2",
          "answer": 115.75
        }
      ],
      "interpretation": {
        "template": "Between-group variance = ___ — the fertilizer groups' means are ___ spread apart.",
        "blanks": [
          "115.75",
          "widely"
        ]
      }
    }
  ],
  "s2_w": [
    {
      "scenario": "Still in the fertilizer study, the researcher now needs a measure of ordinary plant-to-plant variability WITHIN each fertilizer group (noise unrelated to treatment) — the denominator of the F ratio.",
      "identifyOptions": [
        "Within-Group Var",
        "Between-Group Var",
        "Grand Mean",
        "Population Variance"
      ],
      "correctIndex": 0,
      "whyCorrect": "s²_Within pools the variance INSIDE each group (natural plant-to-plant noise, unrelated to treatment) — the denominator every F ratio is compared against.",
      "whyWrong": "Between-Group Var measures differences ACROSS groups instead, the opposite quantity; Grand Mean is a center measure, not a variance; Population Variance ignores group structure and treats all 12 plants as one flat dataset.",
      "steps": [
        {
          "label": "(n₁−1)s₁²",
          "display": "3×4.333",
          "answer": 13
        },
        {
          "label": "(n₂−1)s₂²",
          "display": "3×2.917",
          "answer": 8.75
        },
        {
          "label": "(n₃−1)s₃²",
          "display": "3×1.667",
          "answer": 5
        },
        {
          "label": "s²W = Σ(nᵢ−1)sᵢ² / Σ(nᵢ−1)",
          "display": "sum ÷ 9",
          "answer": 2.972
        }
      ],
      "interpretation": {
        "template": "Within-group variance = ___ — this is the baseline 'noise' variance unrelated to which fertilizer was used.",
        "blanks": [
          "2.972"
        ]
      }
    }
  ],
  "anova_f": [
    {
      "scenario": "With s²_Between≈115.75 and s²_Within≈2.97 from the 3-fertilizer study, the researcher is finally ready to test whether the fertilizers produce genuinely different average growth.",
      "identifyOptions": [
        "F Ratio (ANOVA)",
        "F Test (2 Variances)",
        "t Test (2 Means)",
        "χ² Independence"
      ],
      "correctIndex": 0,
      "whyCorrect": "Comparing between-group to within-group variance for 3+ group means is exactly ANOVA's F ratio — if between-group variance dominates, the groups likely differ.",
      "whyWrong": "F Test (2 Variances) compares two RAW sample variances directly, not between/within variance from grouped means; t Test (2 Means) only handles exactly 2 groups, not 3; χ² Independence tests categorical association, not continuous means across groups.",
      "steps": [
        {
          "label": "s²_Between",
          "display": "s²B",
          "answer": 115.75
        },
        {
          "label": "s²_Within",
          "display": "s²W",
          "answer": 2.972
        },
        {
          "label": "F = s²Between / s²Within",
          "display": "115.75 ÷ 2.972",
          "answer": 38.944
        }
      ],
      "interpretation": {
        "template": "F = ___ with df=(2, 9). This large F strongly suggests at least one fertilizer's mean growth ___ from the others.",
        "blanks": [
          "38.944",
          "differs"
        ]
      }
    }
  ],
  "scheffe": [
    {
      "scenario": "The ANOVA F-test came back significant (fertilizers genuinely differ). Now the researcher wants to know specifically WHICH pair differs — comparing Fertilizer B (mean≈30.25) against Fertilizer C (mean≈19.5), where group sizes could be unequal.",
      "identifyOptions": [
        "Scheffé Test",
        "Tukey Test",
        "F Ratio (ANOVA)",
        "t Test (2 Means)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Scheffé is the post-hoc test for pairwise comparisons AFTER a significant ANOVA, and it's valid even when group sizes are unequal.",
      "whyWrong": "Tukey Test is more powerful but requires EQUAL sample sizes across groups; the F Ratio is the overall test that told us SOMETHING differs, not which pair; t Test (2 Means) run repeatedly without correction would inflate the false-positive rate.",
      "steps": [
        {
          "label": "(X̄ᵢ − X̄ⱼ)²",
          "display": "(30.25 − 19.5)²",
          "answer": 115.563
        },
        {
          "label": "s²W(1/nᵢ + 1/nⱼ)",
          "display": "2.972 × (1/4 + 1/4)",
          "answer": 1.486
        },
        {
          "label": "Fs = (X̄ᵢ−X̄ⱼ)² / [s²W(1/nᵢ+1/nⱼ)]",
          "display": "115.563 ÷ 1.486",
          "answer": 77.762
        }
      ],
      "interpretation": {
        "template": "Fs = ___ for the B-vs-C comparison. Compared against a Scheffé critical value, this pair ___ significantly.",
        "blanks": [
          "77.762",
          "differs"
        ]
      }
    }
  ],
  "tukey": [
    {
      "scenario": "Same significant ANOVA, same B-vs-C comparison (means ≈30.25 vs ≈19.5) — but this time all 3 fertilizer groups happen to have the SAME sample size (n=4 each), so a more powerful post-hoc test is available.",
      "identifyOptions": [
        "Tukey Test",
        "Scheffé Test",
        "F Ratio (ANOVA)",
        "t Test (Dependent)"
      ],
      "correctIndex": 0,
      "whyCorrect": "With equal group sizes, Tukey's test is more powerful (narrower critical range) than Scheffé for pairwise post-hoc comparisons.",
      "whyWrong": "Scheffé works too, but is unnecessarily conservative when n is equal across groups; F Ratio only tells us SOMETHING differs overall, not which specific pair; t Test (Dependent) is for paired data, not independent fertilizer groups.",
      "steps": [
        {
          "label": "X̄ᵢ − X̄ⱼ",
          "display": "30.25 − 19.5",
          "answer": 10.75
        },
        {
          "label": "√(s²W/n)",
          "display": "√(2.972 ÷ 4)",
          "answer": 0.862
        },
        {
          "label": "q = (X̄ᵢ−X̄ⱼ) / √(s²W/n)",
          "display": "10.75 ÷ 0.862",
          "answer": 12.471
        }
      ],
      "interpretation": {
        "template": "q = ___ for the B-vs-C comparison — compared against the studentized range critical value to decide significance.",
        "blanks": [
          "12.471"
        ]
      }
    }
  ],
  "anova2": [
    {
      "scenario": "A factory tests 2 machines (Factor A) and 2 shifts (Factor B), with 2 output readings per combination: Machine1/Shift1=[20,22], Machine1/Shift2=[25,27], Machine2/Shift1=[30,28], Machine2/Shift2=[24,26]. The engineer wants to know if machine matters, if shift matters, AND if their combination has its own special effect.",
      "identifyOptions": [
        "Two-Way ANOVA",
        "One-way ANOVA (F Ratio)",
        "Kruskal-Wallis",
        "F Test (2 Variances)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Testing two factors AND their interaction simultaneously (not just one grouping variable) is exactly what two-way ANOVA is built for.",
      "whyWrong": "One-way ANOVA only handles a single grouping factor, unable to test an interaction effect; Kruskal-Wallis is the nonparametric one-way alternative, same limitation; F Test (2 Variances) compares only two variances directly, not multi-factor mean structure.",
      "steps": [
        {
          "label": "MSA = SSA/dfA (machine effect)",
          "display": "SSA ÷ 1",
          "answer": 24.5
        },
        {
          "label": "MSB = SSB/dfB (shift effect)",
          "display": "SSB ÷ 1",
          "answer": 0.5
        },
        {
          "label": "MSW = SSW/dfW (error)",
          "display": "SSW ÷ 4",
          "answer": 2
        },
        {
          "label": "FA = MSA / MSW",
          "display": "24.5 ÷ 2",
          "answer": 12.25
        }
      ],
      "interpretation": {
        "template": "FA (machine) = ___, FB (shift) = ___. The larger F-ratio points to ___ as the stronger effect on output.",
        "blanks": [
          "12.25",
          "0.25",
          "machine"
        ]
      }
    }
  ],
  "sign_z": [
    {
      "scenario": "A company claims the median commute time is 30 minutes. In a sample of 30 commuters (no ties at exactly 30), 20 commute LONGER than 30 min (a '+' sign) and 10 commute shorter. Data isn't normal, so the analyst uses signs instead of a t-test.",
      "identifyOptions": [
        "Sign Test (z)",
        "t Test (Mean)",
        "Wilcoxon Signed-Rank",
        "z Test (Mean)"
      ],
      "correctIndex": 0,
      "whyCorrect": "The Sign Test only needs the DIRECTION of each deviation from the hypothesized median (+ or −), making no assumption about the shape of the distribution — ideal when normality fails.",
      "whyWrong": "t Test (Mean) and z Test (Mean) both assume a roughly normal distribution of the underlying data; Wilcoxon Signed-Rank uses the MAGNITUDE of differences too, more data than a simple median claim requires here.",
      "steps": [
        {
          "label": "X (# of + signs)",
          "display": "X",
          "answer": 20
        },
        {
          "label": "n",
          "display": "n",
          "answer": 30
        },
        {
          "label": "√n / 2",
          "display": "√30 ÷ 2",
          "answer": 2.7386
        },
        {
          "label": "z = [(X+0.5)−0.5n] / (√n/2)",
          "display": "(20+0.5 − 15) ÷ 2.7386",
          "answer": 2.008
        }
      ],
      "interpretation": {
        "template": "z = ___. At α=0.05 (two-tailed, z*=±1.96), we ___ H₀ — the median commute ___ 30 minutes.",
        "blanks": [
          "2.008",
          "reject",
          "differs from"
        ]
      }
    }
  ],
  "wrs": [
    {
      "scenario": "Two independent teaching methods are compared using RANKS instead of raw scores (data isn't normal). Group 1 (n=8) has a rank-sum of W=52 when all 18 students are ranked together; Group 2 has n=10.",
      "identifyOptions": [
        "Wilcoxon Rank Sum",
        "t Test (2 Means)",
        "Wilcoxon Signed-Rank",
        "Kruskal-Wallis"
      ],
      "correctIndex": 0,
      "whyCorrect": "Two independent groups, ranked data instead of raw scores, normality violated — the nonparametric alternative to the independent t-test.",
      "whyWrong": "t Test (2 Means) requires roughly normal data, ruled out here; Wilcoxon Signed-Rank is for PAIRED data, not two independent groups; Kruskal-Wallis is for 3+ groups, not exactly two.",
      "steps": [
        {
          "label": "μW = n₁(n₁+n₂+1)/2",
          "display": "8×19 ÷ 2",
          "answer": 76
        },
        {
          "label": "σW = √[n₁n₂(n₁+n₂+1)/12]",
          "display": "√(8×10×19 ÷ 12)",
          "answer": 11.255
        },
        {
          "label": "z = (W − μW) / σW",
          "display": "(52 − 76) ÷ 11.255",
          "answer": -2.132
        }
      ],
      "interpretation": {
        "template": "z = ___. At α=0.05 (two-tailed, z*=±1.96), we ___ H₀.",
        "blanks": [
          "-2.132",
          "reject"
        ]
      }
    }
  ],
  "wsrt": [
    {
      "scenario": "A before/after weight-training study has 8 paired differences: 3, −1, 5, −2, 6, −4, 7, −8 lbs. Data isn't normal, so instead of a paired t-test, the researcher ranks the ABSOLUTE differences and tracks their signs.",
      "identifyOptions": [
        "Wilcoxon Signed-Rank",
        "Sign Test (z)",
        "Wilcoxon Rank Sum",
        "t Test (Dependent)"
      ],
      "correctIndex": 0,
      "whyCorrect": "Paired data, non-normal, and — unlike the Sign Test — we use the MAGNITUDE of each difference (via ranks), not just its direction, giving more statistical power.",
      "whyWrong": "Sign Test only uses +/− direction, discarding magnitude information the ranks capture; Wilcoxon Rank Sum is for two INDEPENDENT groups, not paired data; t Test (Dependent) assumes the differences are roughly normal, which fails here.",
      "steps": [
        {
          "label": "T+ (sum of ranks of positive D's)",
          "display": "sum of + ranks",
          "answer": 21
        },
        {
          "label": "T− (sum of ranks of negative D's)",
          "display": "sum of − ranks",
          "answer": 15
        },
        {
          "label": "T = min(T+, T−)",
          "display": "min(21, 15)",
          "answer": 15
        }
      ],
      "interpretation": {
        "template": "T = ___. This test statistic is compared against a Wilcoxon critical value table using n=___.",
        "blanks": [
          "15",
          "8"
        ]
      }
    }
  ],
  "kw": [
    {
      "scenario": "Three teaching methods (4 students each, N=12 total) are compared by ranking ALL 12 students together on a skill test. Method A's ranks sum to R=20, Method B's to R=30, Method C's to R=28. Data isn't normal, ruling out one-way ANOVA.",
      "identifyOptions": [
        "Kruskal-Wallis",
        "One-way ANOVA (F Ratio)",
        "Wilcoxon Rank Sum",
        "χ² Independence"
      ],
      "correctIndex": 0,
      "whyCorrect": "3+ groups, ranked instead of raw data, normality violated — Kruskal-Wallis is the nonparametric extension of ANOVA to ranks.",
      "whyWrong": "ANOVA's F Ratio assumes roughly normal, equal-variance data within each group; Wilcoxon Rank Sum only handles exactly two groups; χ² Independence tests categorical association, not ranked continuous scores.",
      "steps": [
        {
          "label": "R₁²/n₁",
          "display": "20² ÷ 4",
          "answer": 100
        },
        {
          "label": "R₂²/n₂",
          "display": "30² ÷ 4",
          "answer": 225
        },
        {
          "label": "R₃²/n₃",
          "display": "28² ÷ 4",
          "answer": 196
        },
        {
          "label": "H = [12/(N(N+1))]·ΣR²/n − 3(N+1)",
          "display": "[12/156]×(sum) − 39",
          "answer": 1.077
        }
      ],
      "interpretation": {
        "template": "H = ___ with df = k−1 = ___. Compared against a χ² critical value at that df to decide significance.",
        "blanks": [
          "1.077",
          "2"
        ]
      }
    }
  ],
  "spear": [
    {
      "scenario": "Two judges rank 6 contestants in a competition. The rank differences (Judge1 rank − Judge2 rank) per contestant are: 1, −1, 2, 0, −2, 0. The organizer wants to know how well the judges' rankings agree, without assuming the underlying scores are normal or even numeric.",
      "identifyOptions": [
        "Spearman rₛ",
        "Pearson r",
        "t Test for r",
        "Kruskal-Wallis"
      ],
      "correctIndex": 0,
      "whyCorrect": "The data are RANKS (ordinal), not raw continuous measurements — Spearman's rank correlation is built exactly for this.",
      "whyWrong": "Pearson r assumes continuous, roughly linear, normally-distributed data, not ranks; t Test for r tests significance of a Pearson r, the wrong correlation type here; Kruskal-Wallis compares group medians, not agreement between two rankings.",
      "steps": [
        {
          "label": "ΣD²",
          "display": "1²+-1²+2²+0²+-2²+0²",
          "answer": 10
        },
        {
          "label": "n(n²−1)",
          "display": "6×35",
          "answer": 210
        },
        {
          "label": "rₛ = 1 − 6ΣD² / [n(n²−1)]",
          "display": "1 − (6×10) ÷ 210",
          "answer": 0.7143
        }
      ],
      "interpretation": {
        "template": "rₛ = ___, indicating ___ agreement between the two judges' rankings.",
        "blanks": [
          "0.7143",
          "strong positive"
        ]
      }
    }
  ],
  "runs": [
    {
      "scenario": "A quality inspector records 20 consecutive parts as Pass (12 total) or Fail (8 total) and counts G=9 'runs' (unbroken streaks of the same result). She wants to test whether pass/fail order is random, or whether some non-random pattern (like a drifting machine) is at play.",
      "identifyOptions": [
        "Runs Test",
        "Sign Test (z)",
        "Wilcoxon Rank Sum",
        "χ² Goodness of Fit"
      ],
      "correctIndex": 0,
      "whyCorrect": "Testing whether a SEQUENCE is randomly ordered (not testing a median or comparing groups) is exactly what the runs test evaluates via streak counts.",
      "whyWrong": "Sign Test compares values to a hypothesized median, unrelated to sequence order; Wilcoxon Rank Sum compares two independent groups' distributions, not ordering; χ² GOF tests category proportions, not sequential pattern.",
      "steps": [
        {
          "label": "μG = 2n₁n₂/(n₁+n₂) + 1",
          "display": "2×12×8÷20 + 1",
          "answer": 10.6
        },
        {
          "label": "σG = √[2n₁n₂(2n₁n₂−n₁−n₂) / ((n₁+n₂)²(n₁+n₂−1))]",
          "display": "√[192×172 ÷ (400×19)]",
          "answer": 2.0845
        },
        {
          "label": "z = (G − μG) / σG",
          "display": "(9 − 10.6) ÷ 2.0845",
          "answer": -0.768
        }
      ],
      "interpretation": {
        "template": "z = ___. At α=0.05 (two-tailed, z*=±1.96), we ___ H₀ — the pass/fail sequence appears ___.",
        "blanks": [
          "-0.768",
          "fail to reject",
          "random"
        ]
      }
    }
  ],
  "sim_mean": [
    {
      "scenario": "A Monte Carlo simulation of a loaded die produces 8 trial outcomes: 3, 5, 2, 6, 4, 3, 5, 4. Before comparing to the theoretical E(X), the analyst needs the empirical mean from these simulated trials.",
      "identifyOptions": [
        "Simulation Mean",
        "Sample Mean",
        "Expected Value",
        "Distribution Mean"
      ],
      "correctIndex": 0,
      "whyCorrect": "This value comes from actual random SIMULATION trials, not a formula-derived theoretical distribution — Simulation Mean is the empirical average used to verify E(X) matches theory.",
      "whyWrong": "Sample Mean is the same arithmetic but the label used for real observed data collection, not simulated trials; Expected Value and Distribution Mean are THEORETICAL values computed from a probability table, not from actual simulated outcomes.",
      "steps": [
        {
          "label": "ΣX (sum of trial outcomes)",
          "display": "3+5+2+6+4+3+5+4",
          "answer": 32
        },
        {
          "label": "n (number of trials)",
          "display": "n",
          "answer": 8
        },
        {
          "label": "X̄ = ΣX / n",
          "display": "32 ÷ 8",
          "answer": 4
        }
      ],
      "interpretation": {
        "template": "The simulation mean is ___, which can now be compared to the theoretical E(X) to check the simulation's accuracy.",
        "blanks": [
          "4"
        ]
      }
    }
  ],
  "mc_prob": [
    {
      "scenario": "A Monte Carlo simulation of customer conversion runs 50 random trials; the 'converts' event occurs in 17 of them. Rather than deriving a formula, the analyst estimates the probability directly from the simulation's results.",
      "identifyOptions": [
        "Monte Carlo P(E)",
        "Empirical Probability",
        "Classical Probability",
        "Expected Value"
      ],
      "correctIndex": 0,
      "whyCorrect": "P(E)≈f/n from simulated random trials is Monte Carlo's core output — approximating a probability too complex to derive analytically.",
      "whyWrong": "Empirical Probability is the same math but the label used for REAL-WORLD observed data, not simulated trials; Classical Probability needs known theoretical equally-likely outcomes, not simulation; Expected Value computes an average payoff, not an event probability.",
      "steps": [
        {
          "label": "f (times event occurred)",
          "display": "f",
          "answer": 17
        },
        {
          "label": "n (total trials)",
          "display": "n",
          "answer": 50
        },
        {
          "label": "P(E) ≈ f / n",
          "display": "17 ÷ 50",
          "answer": 0.34
        }
      ],
      "interpretation": {
        "template": "The Monte Carlo estimate is P(E) ≈ ___.",
        "blanks": [
          "0.34"
        ]
      }
    }
  ],
  "mc_steps": [
    {
      "scenario": "An analyst wants to simulate customer purchases where P(buy)=0.30, using 2-digit random numbers 00–99. She needs to work through the full 5-step Monte Carlo procedure, then run 4 trial digits: 47, 12, 85, 30.",
      "identifyOptions": [
        "Monte Carlo Steps",
        "Monte Carlo P(E)",
        "Expected Value",
        "Binomial Formula"
      ],
      "correctIndex": 0,
      "whyCorrect": "Setting up a brand-new simulation from scratch (listing outcomes, assigning probabilities, mapping digit ranges, sampling, and computing results) is exactly the 5-step Monte Carlo procedure.",
      "whyWrong": "Monte Carlo P(E) only computes the FINAL probability from trials already run, skipping setup; Expected Value needs a payoff structure, not a digit-mapping procedure; Binomial Formula computes an exact probability directly, bypassing simulation entirely.",
      "steps": [
        {
          "label": "Step 1: # of possible outcomes (buy / no buy)",
          "display": "outcomes",
          "answer": 2
        },
        {
          "label": "Step 3: digits assigned to 'buy' (00–29)",
          "display": "range size for P=0.30",
          "answer": 30
        },
        {
          "label": "Step 3: digits assigned to 'no buy' (30–99)",
          "display": "range size for P=0.70",
          "answer": 70
        },
        {
          "label": "Step 4: of digits 47,12,85,30 — how many fall in 00–29?",
          "display": "count in buy range",
          "answer": 1
        }
      ],
      "interpretation": {
        "template": "Step 5 — Compute: with ___ 'buy' results out of 4 trials, this run's empirical estimate is P(buy) ≈ ___.",
        "blanks": [
          "1",
          "0.25"
        ]
      }
    }
  ]
};

export function getPracProblems(nodeId) {
  if (PRACTICE_PROBLEMS[nodeId]) return PRACTICE_PROBLEMS[nodeId];
  const node = nodeById[nodeId];
  if (!node) return [];
  const ch = CHAPTERS.find((c) => c.id === node.ch);
  return [
    {
      scenario: `[Scenario for ${node.name} — to be expanded] A researcher needs to apply ${node.name} (${node.short}) to a dataset. The formula is: ${node.formula}.`,
      identifyOptions: [node.name, 'Sample Mean', 'Standard Deviation', 'z-Score'],
      correctIndex: 0,
      whyCorrect: `${node.name} is the right tool for this type of problem.`,
      whyWrong: 'The other formulas serve different purposes.',
      steps: [{ label: 'Apply formula', display: node.formula, answer: 1 }],
      interpretation: { template: `This problem uses ${node.name}. Chapter: ${ch?.name || '—'}.`, blanks: [] },
    },
  ];
}
