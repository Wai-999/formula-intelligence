import { bl, blSame } from '../../lib/mlContent.js';

// Learning Design System retrofit (docs/research/ML-Mode-Pedagogy-Research.md
// §4.1) for Module 3's Model Relationship Map. Kept as its own lookup,
// keyed by ML_MODELS' node id, rather than interleaved into models.js —
// that file is already 550 lines and this adds a comparable amount of new
// content per node; a separate file is lower-risk to build up incrementally
// and keeps models.js's existing catalog untouched.
//
// mechanism.kind is 'live-link' for any model with a real, already-working
// interactive counterpart elsewhere in ML mode (send the learner there
// instead of building a redundant toy) or 'widget' for a small, genuine,
// model-specific MechanismWidget otherwise — see BUILD_LOG.md's Phase 1
// note for why this split exists. Nine ladders used to link to the Gold,
// Macro and Micro labs; when those were retired (Master Prompt V3.1 §4) each
// got an in-place widget computing the formula its own Formalism layer gives.
export const MODEL_DEPTH_LADDER = {
  linreg: {
    spark: {
      analogy: bl(
        "Like drawing one straight ruler-line through a scatter of dots on graph paper, positioned so it's as close as possible to all of them at once — not perfectly through any single dot, but fair to every dot.",
        'A single straight-line hypothesis fit by minimizing total squared distance to every observed point simultaneously.'
      ),
      predict: {
        question: blSame(
          'If every dot lay exactly on a perfect line already, would linear regression\'s fitted line pass through all of them?'
        ),
        options: [blSame('Yes'), blSame('No, it would still average around them')],
        correctIndex: 0,
      },
    },
    mechanism: { kind: 'live-link', module: 'pipeline', lesson: 'bias-variance', label: blSame('Bias–variance lesson — Polynomial Regression at degree 1') },
    formalism: {
      worked: bl(
        'Three points (1,2), (2,4), (3,7): OLS finds the slope and intercept minimizing total squared vertical distance — here roughly ŷ = -0.83 + 2.5x, predicting ŷ≈6.67 at x=4.',
        'β₁ = Σ(xᵢ-x̄)(yᵢ-ȳ)/Σ(xᵢ-x̄)² ; for (1,2),(2,4),(3,7): x̄=2, ȳ=4.33, giving β₁=2.5, β₀=-0.67.'
      ),
      faded: bl(
        'For points (0,1) and (2,5): what slope β₁ connects them? Step 1 — change in y: _____. Step 2 — change in x: _____. Step 3 — β₁ = _____.',
        'For points (0,1) and (2,5): what slope β₁ connects them? Step 1 — change in y: _____. Step 2 — change in x: _____. Step 3 — β₁ = _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The ruler analogy breaks down with more than one input: with two or more predictors, it's a flat plane (or hyperplane) through a cloud of points in higher dimensions, not a single visualizable line."
      ),
      caveat: blSame(
        'A real caveat: OLS is very sensitive to outliers — one wild data point can swing the whole fitted line noticeably, since squared error punishes large misses heavily.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does OLS use squared error rather than just absolute distance?'),
        answer: blSame(
          'Squaring makes the math tractable (a closed-form solution exists) and penalizes large errors disproportionately more than small ones — a design choice with real consequences (outlier sensitivity), not an arbitrary default.'
        ),
      },
    },
  },

  ridge_lasso_en: {
    spark: {
      analogy: bl(
        "Like a strict editor who forces a writer to cut unnecessary words — Ridge/Lasso force a model's coefficients to stay small or disappear entirely, keeping only what earns its place.",
        "A penalty term added to OLS's loss function shrinks coefficients toward zero, trading a little bias for a lot less variance."
      ),
      predict: {
        question: blSame(
          "As you increase the penalty strength, do the model's coefficients grow larger or shrink smaller?"
        ),
        options: [blSame('Grow larger'), blSame('Shrink smaller (toward zero)')],
        correctIndex: 1,
      },
    },
    mechanism: {
      // Soft-thresholding: with orthonormal features, minimizing
      // Σ(y−ŷ)² + λΣ|β| moves an OLS coefficient b to sign(b)·max(|b| − λ/2, 0).
      kind: 'widget',
      predict: { question: blSame('OLS gives β = 10. As the Lasso penalty λ keeps growing, does the coefficient level off just above 0, or land exactly on 0?'), options: [blSame('Levels off just above 0'), blSame('Lands exactly on 0 and stays there')], correctIndex: 1 },
      paramLabel: blSame('Lasso penalty λ (orthonormal features, OLS β = 10)'),
      paramMin: 0, paramMax: 30, paramDefault: 2, paramStep: 1, paramDecimals: 0,
      compute: (lam) => Math.max(10 - lam / 2, 0),
      outputLabel: blSame('Lasso coefficient'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'OLS gives β=10 for a noisy feature. Add a Lasso penalty λ=2: the coefficient shrinks toward zero, and if the feature is weak enough, Lasso can push it to exactly 0 — dropping it from the model entirely, unlike Ridge which only shrinks toward (but never exactly to) zero.',
        'Lasso minimizes Σ(y-ŷ)² + λΣ|βⱼ| (L1); Ridge minimizes Σ(y-ŷ)² + λΣβⱼ² (L2). L1\'s corner-shaped constraint region is why it can produce exact zeros; L2\'s round region cannot.'
      ),
      faded: bl(
        'A Ridge model with λ=0 is equivalent to what simpler model? Step 1 — recall what λ=0 does to the penalty term. Step 2 — conclusion: _____.',
        'A Ridge model with λ=0 is equivalent to what simpler model? Step 1 — recall what λ=0 does to the penalty term. Step 2 — conclusion: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The strict editor breaks down in one way: an editor decides which words to cut using judgment. Lasso decides using pure math (the L1 penalty geometry) — it has no sense of which feature is "actually" important, only which one the optimization finds cheapest to zero out.'
      ),
      caveat: blSame(
        'A real caveat: with strongly correlated features, Lasso tends to arbitrarily keep one and zero out the other, even if both are equally meaningful — Elastic Net (blending L1+L2) exists specifically to fix this.'
      ),
      retrieval: {
        question: blSame('Without looking back: why can Lasso perform automatic feature selection but Ridge cannot?'),
        answer: blSame(
          "Lasso's L1 penalty geometry has corners that intersect the loss function exactly at zero for weak coefficients; Ridge's L2 penalty is smooth and round, so it only ever shrinks coefficients close to zero, never landing exactly on it."
        ),
      },
    },
  },

  logreg: {
    spark: {
      analogy: bl(
        "Like a dimmer switch that only ever settles between fully off and fully on — logistic regression squeezes any input into a smooth probability between 0 and 1, never below or above.",
        'A linear combination of inputs passed through the sigmoid function, converting an unbounded score into a valid probability.'
      ),
      predict: {
        question: blSame(
          'As the raw linear score (before the sigmoid) goes to a very large positive number, what does the output probability approach?'
        ),
        options: [blSame('1'), blSame('0'), blSame('It keeps growing past 1')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you drag the raw score higher, does the output probability rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 0 },
      paramLabel: blSame('Raw linear score (before sigmoid)'),
      paramMin: -6, paramMax: 6, paramDefault: 0, paramStep: 0.5, paramDecimals: 1,
      compute: (v) => 1 / (1 + Math.exp(-v)),
      outputLabel: blSame('Output probability'),
      outputDecimals: 3,
    },
    formalism: {
      worked: bl(
        'A raw score of 0 gives σ(0) = 1/(1+e⁰) = 0.5 exactly — 50/50, the natural "undecided" point. A raw score of 2 gives σ(2) = 1/(1+e⁻²) ≈ 0.88 — fairly confident.',
        'σ(z) = 1/(1+e⁻ᶻ); σ(0)=0.5 exactly by symmetry; σ(2)≈0.881, σ(-2)≈0.119.'
      ),
      faded: bl(
        'What raw score gives exactly σ(z)=0.5? Step 1 — recall the symmetry point of the sigmoid. Step 2 — answer: _____.',
        'What raw score gives exactly σ(z)=0.5? Step 1 — recall the symmetry point of the sigmoid. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The dimmer-switch analogy breaks down on the shape: a physical dimmer is usually linear (twist it twice as far, get twice the brightness). The sigmoid is emphatically not — it's steepest near the middle and flattens out hard near 0 and 1, so equal nudges to the raw score matter far less once you're already confident."
      ),
      caveat: blSame(
        'A real caveat: logistic regression\'s decision boundary is linear in the original feature space unless features are explicitly transformed (e.g. squared terms added) — it cannot natively learn a curved boundary the way a tree or SVM with a kernel can.'
      ),
      retrieval: {
        question: blSame('Without looking back: why is the sigmoid\'s output always strictly between 0 and 1, never equal to either?'),
        answer: blSame(
          "e⁻ᶻ is strictly positive for any finite z (it can get extremely small or large but never reach exactly 0), so 1/(1+e⁻ᶻ) can get arbitrarily close to 0 or 1 but never actually touch either endpoint."
        ),
      },
    },
  },

  knn: {
    spark: {
      analogy: bl(
        "Like asking your five closest neighbors what they think before making a decision, then going with the majority — KNN predicts a new point by literally looking up the most similar past examples and averaging their answers.",
        'A non-parametric method predicting a new point from the k most similar stored training examples, with no fitted formula at all.'
      ),
      predict: {
        question: blSame(
          'As k (the number of neighbors consulted) grows very large, does the prediction get smoother/more stable, or noisier?'
        ),
        options: [blSame('Smoother/more stable'), blSame('Noisier')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase k, does the prediction swing around more or settle down?'), options: [blSame('Swings around more'), blSame('Settles down')], correctIndex: 1 },
      paramLabel: blSame('k (number of neighbors)'),
      paramMin: 1, paramMax: 25, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.max(0.5, 8 / Math.sqrt(v)),
      outputLabel: blSame('Toy prediction variance (illustrative)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Predicting demand at a new price with k=3: the three historical price points closest to the query are $14, $15, $16 with demands 520, 480, 470. The k=3 prediction is their average: (520+480+470)/3 ≈ 490.',
        'ŷ(x) = (1/k)Σᵢ∈Nₖ(x) yᵢ where Nₖ(x) is the set of k training points closest to x under a chosen distance metric.'
      ),
      faded: bl(
        'With k=1 instead of k=3 at the same query point, which single historical value would the prediction equal? Step 1 — find the single closest point. Step 2 — answer: _____.',
        'With k=1 instead of k=3 at the same query point, which single historical value would the prediction equal? Step 1 — find the single closest point. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'dataStorage',
      analogyBreakdown: blSame(
        'The neighbor-asking analogy is unusually faithful here — this is one of the few models where the analogy barely breaks down, because KNN really does just look things up rather than compress them into learned parameters. If anything, the analogy undersells how literally this happens.'
      ),
      caveat: blSame(
        'A real caveat: KNN needs feature scaling — if one feature ranges 0-1 and another ranges 0-10000, distance calculations get dominated by the large-scale feature entirely, even if it\'s not actually more important.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does KNN specifically get slower as the training dataset grows, unlike most other models here?'),
        answer: blSame(
          "Every other model here compresses the training data into a fixed set of parameters once, at training time — prediction afterward is fast regardless of dataset size. KNN never compresses anything; every single prediction has to search through the entire stored dataset again, so more stored data directly means more work per prediction."
        ),
      },
    },
  },

  naive_bayes: {
    spark: {
      analogy: bl(
        "Like guessing someone's profession from a few overheard words, assuming each word is an independent clue rather than checking if the words make sense together — fast, often right, but occasionally missing an obvious combination.",
        "Applies Bayes' theorem with a simplifying (and often false) independence assumption between features, trading some accuracy for speed and simplicity."
      ),
      predict: {
        question: blSame(
          "If two features are actually strongly correlated (e.g. \"mentions war\" and \"mentions sanctions\"), does Naive Bayes' independence assumption hurt or help its accuracy on that pair?"
        ),
        options: [blSame('Hurts it'), blSame('Helps it')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As a word becomes more typical of "positive news" in training data, does its contribution to a positive prediction rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 0 },
      paramLabel: blSame('P(word | positive news) — how typical the word is'),
      paramMin: 0.05, paramMax: 0.95, paramDefault: 0.5, paramStep: 0.05, paramDecimals: 2,
      compute: (v) => v / (v + (1 - v)) * 100,
      outputLabel: blSame('Toy contribution to "positive" score (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Classifying a headline as positive/negative news: P(positive)=0.5 prior. Word "cut" appears in 70% of positive headlines, 20% of negative ones. Posterior odds shift toward positive by a factor of 0.7/0.2=3.5, multiplied in for every independent word in the headline.',
        'P(y|x)∝P(y)∏ᵢP(xᵢ|y); each word contributes a multiplicative factor P(word|y) independently, so log P(y|x) = log P(y) + Σᵢ log P(xᵢ|y) — a simple sum once in log-space.'
      ),
      faded: bl(
        'If a word appears equally often (50/50) in positive and negative headlines, what factor does it multiply the odds by? Step 1 — compute P(word|positive)/P(word|negative). Step 2 — answer: _____ (does this word carry any signal?)',
        'If a word appears equally often (50/50) in positive and negative headlines, what factor does it multiply the odds by? Step 1 — compute P(word|positive)/P(word|negative). Step 2 — answer: _____ (does this word carry any signal?)'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The overheard-words analogy breaks down on scale: a human listener would naturally notice when two clues are clearly related and adjust. Naive Bayes has no such adjustment mechanism built in at all — the independence assumption isn't a rough approximation it can self-correct, it's baked permanently into the math."
      ),
      caveat: blSame(
        'A real caveat: despite the "naive" independence assumption being frequently technically false, Naive Bayes still performs surprisingly well in practice on many text classification tasks — the assumption being wrong doesn\'t always mean the predictions are wrong.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does Naive Bayes need "little data" compared to models like deep networks?'),
        answer: blSame(
          "Because it estimates each feature's probability independently and separately (one small table per feature) rather than jointly learning complex interactions between all features at once — independent estimates need far fewer examples to become reliable than joint ones do."
        ),
      },
    },
  },

  dtree: {
    spark: {
      analogy: bl(
        "Like a game of 20 questions — each yes/no question narrows down the possibilities, and after enough questions you land on an answer, following one specific path down a flowchart.",
        'Repeatedly splits the data by the single feature/threshold that best separates outcomes, building a flowchart of decisions.'
      ),
      predict: {
        question: blSame(
          'Does a decision tree ever produce a smoothly curved prediction boundary, or only sharp, blocky steps?'
        ),
        options: [blSame('Smoothly curved'), blSame('Sharp, blocky steps only')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'pipeline', lesson: 'bias-variance', label: blSame('Bias–variance lesson — Decision Tree') },
    formalism: {
      worked: bl(
        'Splitting 10 gold-forecast examples by "real yields > 0?": 6 examples with yields>0 have average outcome "price falls" (say -50), 4 with yields≤0 average "price rises" (+40). This single split already separates the two groups cleanly — a good candidate first split.',
        'At each node, the algorithm picks (feature, threshold) maximizing information gain: IG = impurity(parent) − Σ(nᵢ/n)·impurity(childᵢ), using Gini or entropy as the impurity measure.'
      ),
      faded: bl(
        'If a split perfectly separates two classes (impurity=0 on both sides), what is the information gain relative to a useless split (impurity unchanged)? Step 1 — recall the IG formula. Step 2 — answer: _____.',
        'If a split perfectly separates two classes (impurity=0 on both sides), what is the information gain relative to a useless split (impurity unchanged)? Step 1 — recall the IG formula. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The 20-questions analogy breaks down on flexibility: a clever human player can change strategy mid-game based on unexpected answers. A trained tree's questions and their order are completely fixed after training — every input follows a rigid, pre-determined path with no room for improvisation."
      ),
      caveat: blSame(
        'A real caveat: a single decision tree is notoriously unstable — a tiny change in the training data can produce a completely different tree structure from the top down, which is exactly the instability Random Forest and Gradient Boosting exist to fix by averaging many trees.'
      ),
      retrieval: {
        question: blSame('Without looking back: why is a single decision tree usually less accurate than an ensemble like Random Forest, even though it\'s more interpretable?'),
        answer: blSame(
          "A single tree's structure depends heavily on the exact training sample it saw — it overfits to noise as well as real patterns. Averaging many independently-grown trees cancels out each one's individual noise-driven mistakes while keeping the real pattern they all share."
        ),
      },
    },
  },

  rf: {
    spark: {
      analogy: bl(
        "Like polling hundreds of independent forecasters who each saw a slightly different slice of the evidence, then averaging their guesses — no single forecaster's blind spot dominates the final answer.",
        'An ensemble of many decision trees, each trained on a bootstrap resample with a random feature subset per split, combined by averaging.'
      ),
      predict: {
        question: blSame('Does adding more trees to a Random Forest ever make it systematically MORE biased (not just slower)?'),
        options: [blSame('Yes'), blSame('No, it mostly reduces variance without changing bias much')],
        correctIndex: 1,
      },
    },
    mechanism: {
      // Var(ŷ) = ρσ² + (1−ρ)σ²/B, shown as a share of one tree's σ².
      kind: 'widget',
      predict: { question: blSame('These trees are correlated (ρ = 0.3). If you keep adding trees forever, what happens to the forest\'s variance?'), options: [blSame('It falls toward zero'), blSame('It levels off at 30% of one tree\'s')], correctIndex: 1 },
      paramLabel: blSame('Number of trees B (inter-tree correlation ρ = 0.3)'),
      paramMin: 1, paramMax: 200, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (b) => 100 * (0.3 + 0.7 / b),
      outputLabel: blSame('Forest variance, as a share of one tree\'s'),
      outputDecimals: 1, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Three trees predict tomorrow\'s gold move as +$30, -$10, +$50 respectively (each saw a different bootstrap sample). Random Forest\'s prediction is their average: (30-10+50)/3 ≈ $23 — smoothing away each tree\'s individual noise.',
        'ŷ(x) = (1/B)Σᵦ Tᵦ(x) over B bootstrap-trained trees; Var(ŷ) = ρσ² + (1-ρ)σ²/B, where ρ is inter-tree correlation — decorrelating trees via random feature subsets is what makes averaging actually help.'
      ),
      faded: bl(
        'If all trees in the forest were identical (ρ=1, perfectly correlated), what would averaging them actually accomplish for variance? Step 1 — plug ρ=1 into Var(ŷ)=ρσ²+(1-ρ)σ²/B. Step 2 — answer: _____.',
        'If all trees in the forest were identical (ρ=1, perfectly correlated), what would averaging them actually accomplish for variance? Step 1 — plug ρ=1 into Var(ŷ)=ρσ²+(1-ρ)σ²/B. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The polling-forecasters analogy breaks down on independence: real human forecasters often read each other's opinions and converge. Random Forest actively engineers its trees to stay independent (random feature subsets per split specifically prevent them from converging on the same reasoning) — the decorrelation is deliberate, not assumed."
      ),
      caveat: blSame(
        'A real caveat: Random Forest\'s feature-importance rankings can be misleading when features are correlated — importance gets split arbitrarily between correlated features, making any single one look less important than it really is.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does Random Forest use both bootstrap resampling AND random feature subsets, rather than just one of the two?'),
        answer: blSame(
          "Bootstrap resampling alone still lets trees end up very similar if one feature is overwhelmingly predictive — every tree would split on it first regardless of resample. Random feature subsets force genuine diversity by sometimes hiding even the strongest feature from a given split, which is what actually drives the decorrelation averaging depends on."
        ),
      },
    },
  },

  gbm: {
    spark: {
      analogy: bl(
        "Like a series of tutors, each one specifically studying and correcting the mistakes the previous tutor's student made — every new tree exists only to patch what came before, not to solve the whole problem from scratch.",
        'Sequentially fits weak learners to the residual errors of the current ensemble, additively combining them.'
      ),
      predict: {
        question: blSame('If the first tree in a boosted ensemble already predicts perfectly (zero residual error), does the second tree learn anything useful?'),
        options: [blSame('Yes, always finds more to learn'), blSame('No — nothing left to correct, so it contributes ~nothing')],
        correctIndex: 1,
      },
    },
    mechanism: {
      // Fₘ = Fₘ₋₁ + ν·hₘ with each hₘ fitting the current residual exactly,
      // so the residual after M rounds is r₀(1 − ν)ᴹ.
      kind: 'widget',
      predict: { question: blSame('With learning rate ν = 0.1, each round removes 10% of what is still left. After 10 rounds, roughly how much of a $15 residual remains?'), options: [blSame('About $1.50'), blSame('About $5.23'), blSame('$0 — it is fully fixed')], correctIndex: 1 },
      paramLabel: blSame('Boosting rounds M (learning rate ν = 0.1, starting residual $15)'),
      paramMin: 0, paramMax: 60, paramDefault: 0, paramStep: 1, paramDecimals: 0,
      compute: (m) => 15 * 0.9 ** m,
      outputLabel: blSame('Residual still unexplained, in dollars'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Tree 1 predicts gold moves +$40 when actual was +$55 — residual error +$15. Tree 2 is fit specifically to predict that leftover +$15, learning to add a correction where Tree 1 undershot. Combined prediction: $40+$15=$55.',
        'Fₘ(x) = Fₘ₋₁(x) + ν·hₘ(x), where hₘ is fit to −∂L/∂F evaluated at Fₘ₋₁ (the negative gradient, i.e. the residual for squared-error loss) and ν is a learning rate shrinking each step\'s contribution.'
      ),
      faded: bl(
        'If the learning rate ν is set very close to 0, how many trees would roughly be needed to reach the same total correction as ν=1 in one tree? Step 1 — think about how much each tree contributes at small ν. Step 2 — answer: _____ (more or fewer trees?)',
        'If the learning rate ν is set very close to 0, how many trees would roughly be needed to reach the same total correction as ν=1 in one tree? Step 1 — think about how much each tree contributes at small ν. Step 2 — answer: _____ (more or fewer trees?)'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The tutor-chain analogy breaks down on independence: each real human tutor could, in principle, teach the whole subject from scratch if asked. Each tree in gradient boosting genuinely cannot — it's fit only to a residual, and would be a useless predictor of the original target entirely on its own."
      ),
      caveat: blSame(
        'A real caveat: because each tree corrects the specific residual left by all previous trees, gradient boosting is inherently sequential — unlike Random Forest\'s trees, which can all be grown in parallel, boosting can\'t be sped up simply by throwing more computers at it.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does gradient boosting typically need more careful tuning than Random Forest to avoid overfitting?'),
        answer: blSame(
          "Because each new tree keeps chasing whatever residual error remains, it will eventually start fitting noise once it has captured every real pattern — there's no built-in stopping point the way averaging naturally stabilizes Random Forest. Too many boosting rounds, or too high a learning rate, means literally fitting to noise on purpose."
        ),
      },
    },
  },

  xgboost: {
    spark: {
      analogy: bl(
        'Same "chain of correcting tutors" idea as gradient boosting, but with extra automatic safety rails built in — like a tutor-chain program with a built-in coach who slaps the brakes the moment any tutor starts overcorrecting.',
        'Gradient boosting with L1/L2 regularization on leaf weights and second-order gradient information, adding overfitting guardrails on top of the base algorithm.'
      ),
      predict: {
        question: blSame('Compared to plain gradient boosting on the same data, is XGBoost typically more or less prone to overfitting, thanks to its built-in regularization?'),
        options: [blSame('More prone'), blSame('Less prone')],
        correctIndex: 1,
      },
    },
    mechanism: {
      // Closed-form optimal leaf weight w* = −G/(H + λ). Squared-error loss:
      // each sample has gradient ŷ − y and Hessian 1, so 10 samples whose
      // residuals sum to 20 give G = −20, H = 10.
      kind: 'widget',
      predict: { question: blSame('A leaf holds 10 samples whose residuals average 2.0. What does raising λ from 0 to 10 do to its weight?'), options: [blSame('Nothing — λ only counts leaves'), blSame('Halves it, from 2.0 to 1.0'), blSame('Sets it to exactly 0')], correctIndex: 1 },
      paramLabel: blSame('L2 penalty λ on leaf weights (10 samples, residuals sum to 20)'),
      paramMin: 0, paramMax: 40, paramDefault: 0, paramStep: 1, paramDecimals: 0,
      compute: (lam) => 20 / (10 + lam),
      outputLabel: blSame('Optimal leaf weight w* = −G / (H + λ)'),
      outputDecimals: 3,
    },
    formalism: {
      worked: bl(
        'XGBoost\'s objective adds Ω(f)=γT+½λΣwⱼ² to the loss, where T is the number of leaves and wⱼ their weights. A tree with 20 tiny, barely-useful leaves gets penalized more than one with 5 substantial ones — this is the "automatic guardrail" in concrete math form.',
        'Obj = Σᵢl(yᵢ,ŷᵢ) + Σₖ Ω(fₖ), Ω(f)=γT+½λ‖w‖²; the second-order Taylor expansion of the loss (using both gradient and Hessian) lets XGBoost find optimal leaf weights in closed form per iteration, faster than plain gradient descent.'
      ),
      faded: bl(
        'If λ (the L2 penalty on leaf weights) is set to a very large number, what happens to the leaf weights, and therefore to how much any single tree can influence the final prediction? Step 1 — recall what a large penalty does to weights. Step 2 — answer: _____.',
        'If λ (the L2 penalty on leaf weights) is set to a very large number, what happens to the leaf weights, and therefore to how much any single tree can influence the final prediction? Step 1 — recall what a large penalty does to weights. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The built-in-coach analogy is fairly faithful, but understates one thing: XGBoost's guardrails don't just apply brakes, they also use second-order information (curvature, not just direction) to take smarter, faster steps in the first place — closer to a coach who both prevents overcorrection AND plans a more efficient training route from the start."
      ),
      caveat: blSame(
        'A real caveat: XGBoost still has many hyperparameters (learning rate, tree depth, λ, γ, subsample rate) that all interact — the built-in regularization reduces overfitting risk, it doesn\'t eliminate the need for careful tuning entirely, especially on small datasets.'
      ),
      retrieval: {
        question: blSame('Without looking back: what does XGBoost specifically add on top of plain gradient boosting that makes it a "strong enterprise default"?'),
        answer: blSame(
          "Built-in L1/L2 regularization on leaf weights (guarding against overfitting automatically), second-order (Newton) gradient approximation (faster, more precise optimization steps), and native handling of sparse/missing data — three concrete engineering additions, not just a rebranding of the same algorithm."
        ),
      },
    },
  },

  lightgbm: {
    spark: {
      analogy: bl(
        "Like sorting a giant pile of receipts into rough price buckets before adding them up, instead of adding every exact number one by one — you lose a little precision but gain enormous speed.",
        'Groups continuous feature values into histogram buckets before searching for splits, and grows trees leaf-wise rather than level-wise, trading a little accuracy risk for large speed gains.'
      ),
      predict: {
        question: blSame('On a very large dataset, would you expect LightGBM to train faster or slower than a standard level-wise gradient booster?'),
        options: [blSame('Faster'), blSame('Slower')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase the number of histogram buckets, does training speed rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 1 },
      paramLabel: blSame('Histogram buckets (fewer = coarser, faster)'),
      paramMin: 8, paramMax: 256, paramDefault: 32, paramStep: 8, paramDecimals: 0,
      compute: (v) => Math.max(2, 900 / v),
      outputLabel: blSame('Toy training time (relative units)'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'A continuous feature ranging $8-$22 gets binned into, say, 16 buckets of $0.875 each instead of testing all possible split points across every unique value — with 10,000 rows, that\'s 16 candidate splits to evaluate instead of potentially thousands.',
        'Split-finding cost drops from O(n) per feature (testing every unique value) to O(bins) — a large constant-factor speedup, especially pronounced on continuous features with many unique values.'
      ),
      faded: bl(
        'If you increased the bucket count from 16 to 256, would split-finding get more precise, faster, both, or neither? Step 1 — think about what more/finer buckets trade off against speed. Step 2 — answer: _____.',
        'If you increased the bucket count from 16 to 256, would split-finding get more precise, faster, both, or neither? Step 1 — think about what more/finer buckets trade off against speed. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The receipt-bucketing analogy breaks down on the second trick: leaf-wise growth isn\'t about bucketing at all — it\'s about which leaf to split next (the most-promising one, wherever it is in the tree) rather than expanding every leaf at the current depth uniformly, which is a separate speed/accuracy tradeoff from histogram binning.'
      ),
      caveat: blSame(
        'A real caveat: leaf-wise growth can produce deeper, more unbalanced trees than level-wise growth, which increases overfitting risk on small datasets — LightGBM typically needs a max-depth limit to compensate.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does LightGBM\'s speed advantage matter most specifically on large datasets rather than small ones?'),
        answer: blSame(
          "Histogram binning's win is turning O(n) split-search into O(bins) — the bigger n (rows/unique values) is, the bigger that gap becomes. On a small dataset, testing every unique value directly was never slow to begin with, so there's little speed advantage left to gain."
        ),
      },
    },
  },

  catboost: {
    spark: {
      analogy: bl(
        "Like a form that understands \"country: Japan\" and \"country: Brazil\" are just different labels without needing you to first translate them into numbers — CatBoost handles categories natively instead of forcing them into a numeric costume first.",
        'A gradient boosting variant with native, leakage-resistant handling of categorical features via ordered target statistics.'
      ),
      predict: {
        question: blSame('Would naively converting "country" into a single number (e.g. alphabetical rank) risk implying a false ordering (like "Japan < Kenya") that CatBoost specifically avoids?'),
        options: [blSame('Yes, it risks a false ordering'), blSame('No, numbers never imply ordering')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As the number of distinct categories (like countries) in a feature grows, does naive one-hot encoding\'s column count rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 0 },
      paramLabel: blSame('Distinct categories (e.g. countries)'),
      paramMin: 2, paramMax: 200, paramDefault: 20, paramStep: 2, paramDecimals: 0,
      compute: (v) => v,
      outputLabel: blSame('One-hot columns needed (CatBoost avoids this)'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'One-hot encoding "regime type" (democracy/autocracy/hybrid/monarchy) creates 4 separate 0/1 columns. CatBoost instead replaces each category with an ordered target-statistic (roughly, the average outcome for that category using only prior-seen examples) — one column, no artificial ordering, and no peeking at the current row\'s own answer.',
        "Ordered target statistic: for row i, categoryⱼ's encoded value uses only rows before i in a random permutation, avoiding the target leakage naive mean-encoding introduces by using the full dataset including the row itself."
      ),
      faded: bl(
        'If a naive mean-encoding used the FULL dataset (including the current row\'s own outcome) to compute a category\'s average, what problem would that create when evaluating the model on that same row? Step 1 — think about what the model would effectively "know" already. Step 2 — answer: _____.',
        'If a naive mean-encoding used the FULL dataset (including the current row\'s own outcome) to compute a category\'s average, what problem would that create when evaluating the model on that same row? Step 1 — think about what the model would effectively "know" already. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The "understanding form" analogy breaks down technically: CatBoost doesn\'t actually "understand" categories semantically (it has no idea Japan is a country) — it\'s still converting categories to numbers internally, just via a leakage-resistant statistical procedure instead of an arbitrary or naive one.'
      ),
      caveat: blSame(
        "A real caveat: ordered boosting's leakage-avoidance comes at a real computational cost — it's typically slower to train than LightGBM, a direct tradeoff the doc's own comparative tables note."
      ),
      retrieval: {
        question: blSame('Without looking back: why does one-hot encoding become impractical for a feature with hundreds of categories, in a way CatBoost\'s approach avoids?'),
        answer: blSame(
          "One-hot encoding creates one new column per distinct category, so hundreds of categories mean hundreds of new, mostly-empty (sparse) columns — bloating the dataset's width and diluting each column's signal. CatBoost's ordered target statistic stays a single column regardless of how many categories exist."
        ),
      },
    },
  },

  bagging: {
    spark: {
      analogy: bl(
        'Like averaging many separate weather forecasts made from slightly different starting readings — no single reading\'s quirks dominate, so the average is steadier than any one forecast alone.',
        'The general "bootstrap + average" recipe: train B independent copies of a model on resampled data, then average their outputs to reduce variance.'
      ),
      predict: {
        question: blSame('Does bagging a systematically biased base model (one that\'s consistently wrong in the same direction) fix that bias?'),
        options: [blSame('Yes'), blSame('No — averaging biased models still gives a biased average')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase B (the number of bagged models), does the ensemble\'s variance rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 1 },
      paramLabel: blSame('B (number of bagged models)'),
      paramMin: 1, paramMax: 100, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => 10 / Math.sqrt(v),
      outputLabel: blSame('Toy ensemble variance (illustrative)'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'Five bootstrap-trained models predict +$20, +$45, -$5, +$30, +$15 for the same query. Bagged prediction: their mean, (20+45-5+30+15)/5=$21 — closer to the "true" pattern than any single noisy model.',
        'For B independent, unbiased base learners each with variance σ², Var(average) = σ²/B — variance shrinks proportionally to 1/B as more independent models are added.'
      ),
      faded: bl(
        'If B goes from 4 to 16 (quadrupling), by roughly what factor does variance shrink, per Var=σ²/B? Step 1 — compute σ²/4 vs σ²/16 as a ratio. Step 2 — answer: _____.',
        'If B goes from 4 to 16 (quadrupling), by roughly what factor does variance shrink, per Var=σ²/B? Step 1 — compute σ²/4 vs σ²/16 as a ratio. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The weather-forecasts analogy breaks down on independence: real weather stations often share regional biases (a whole region's thermometers reading slightly hot, say). Bagging's Var=σ²/B formula assumes truly independent errors — correlated base-model errors don't shrink nearly as much, which is exactly why Random Forest adds random feature subsets on top of plain bagging."
      ),
      caveat: blSame(
        'A real caveat: bagging works best on high-variance, low-bias base learners (like deep, unpruned trees) — bagging a stable, low-variance model like linear regression barely helps, since there\'s little variance left to reduce.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does bagging reduce variance but NOT bias?'),
        answer: blSame(
          "Averaging cancels out random, independent fluctuations around the true pattern (that's variance) — but if every base model shares the same systematic blind spot (that's bias), averaging identically-blind models just produces an equally blind average."
        ),
      },
    },
  },

  boosting: {
    spark: {
      analogy: bl(
        'The umbrella idea behind gradient boosting: chain many weak, simple models together so each one patches the specific blind spots of everything before it — a relay race of specialists rather than one generalist.',
        'General framework for additive, sequential ensembling minimizing bias by re-weighting or re-fitting to residuals at each stage.'
      ),
      predict: {
        question: blSame('Compared to bagging, is boosting generally better at fixing bias or at fixing variance?'),
        options: [blSame('Bias'), blSame('Variance')],
        correctIndex: 0,
      },
    },
    mechanism: {
      // AdaBoost's vote weight for a learner with weighted error ε:
      // α = ½·ln((1 − ε)/ε).
      kind: 'widget',
      predict: { question: blSame('A weak learner that is right exactly half the time (error 0.5) gets how much say in the final vote?'), options: [blSame('None (α = 0)'), blSame('Half (α = 0.5)'), blSame('Full (α = 1)')], correctIndex: 0 },
      paramLabel: blSame('Weak learner\'s weighted error ε'),
      paramMin: 0.01, paramMax: 0.5, paramDefault: 0.4, paramStep: 0.01, paramDecimals: 2,
      compute: (e) => 0.5 * Math.log((1 - e) / e),
      outputLabel: blSame('Vote weight α = ½ ln((1 − ε) / ε)'),
      outputDecimals: 3,
    },
    formalism: {
      worked: bl(
        'A weak learner alone gets 60% accuracy. Boosting chains 50 weak learners, each fixing the specific errors of the ensemble so far — the combined ensemble can reach 95%+ accuracy on the same problem, far beyond what any single weak learner could.',
        'Additive model FM(x) = Σₘ αₘhₘ(x); each hₘ is fit to minimize error on a re-weighted (AdaBoost) or residual-targeted (gradient boosting) version of the training set, with αₘ typically reflecting that learner\'s accuracy.'
      ),
      faded: bl(
        'If one weak learner in the chain is much more accurate than the others, should AdaBoost give it more or less weight (α) in the final vote? Step 1 — think about what α is meant to reflect. Step 2 — answer: _____.',
        'If one weak learner in the chain is much more accurate than the others, should AdaBoost give it more or less weight (α) in the final vote? Step 1 — think about what α is meant to reflect. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The relay-race analogy breaks down on visibility: relay runners hand off a baton but don't see each other's mistakes in detail. Each learner in boosting sees exactly, numerically, what the ensemble got wrong so far — the correction is precise and targeted, not a general \"try your best from here.\""
      ),
      caveat: blSame(
        "A real caveat: boosting's bias-reduction focus means it will keep chasing residual error even when that residual is just noise, which is why it's more prone to overfitting than bagging if the number of rounds isn't controlled."
      ),
      retrieval: {
        question: blSame('Without looking back: why is boosting typically slower to train than bagging?'),
        answer: blSame(
          "Bagging's base models are trained independently, so they can be built in parallel all at once. Boosting's learners are inherently sequential — each one needs to know the previous ones' combined errors before it can be fit, so they must be trained one after another."
        ),
      },
    },
  },

  stacking: {
    spark: {
      analogy: bl(
        'Like a panel of specialist doctors each giving their own diagnosis, then one senior physician who has learned, from experience, exactly how much weight to give each specialist\'s opinion in different situations.',
        'Trains diverse base learners, then fits a meta-learner on their out-of-fold predictions to learn an optimal combination.'
      ),
      predict: {
        question: blSame('Would stacking ARIMA + XGBoost + LSTM together ever perform WORSE than the single best of the three alone?'),
        options: [blSame('Never — stacking is always at least as good'), blSame('Yes, if the meta-learner is poorly fit or overfits on limited data')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you add more diverse base models to a stack, does the potential accuracy ceiling rise or fall (ignoring overfitting risk)?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 0 },
      paramLabel: blSame('Number of diverse base models in the stack'),
      paramMin: 1, paramMax: 8, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => 60 + 30 * (1 - Math.exp(-0.5 * (v - 1))),
      outputLabel: blSame('Toy accuracy ceiling (%, diminishing returns)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'ARIMA predicts $4,150, XGBoost predicts $4,220, LSTM predicts $4,190 for the same query. The meta-learner, trained on many past instances of these three predictions vs. actual outcomes, might learn weights like 0.2/0.5/0.3 — giving XGBoost the most trust here: 0.2(4150)+0.5(4220)+0.3(4190)=$4,197.',
        'Meta-learner g fit on {(h₁(x),h₂(x),h₃(x)), y} pairs from out-of-fold predictions (never the same data the base learners trained on, to avoid leakage) — final prediction ŷ=g(h₁(x),h₂(x),h₃(x)), often itself a simple linear or logistic model.'
      ),
      faded: bl(
        'If the meta-learner were fit on the SAME data the base learners were trained on (not held-out out-of-fold data), what problem would likely result? Step 1 — think about what the base learners already "know" about that data. Step 2 — answer: _____.',
        'If the meta-learner were fit on the SAME data the base learners were trained on (not held-out out-of-fold data), what problem would likely result? Step 1 — think about what the base learners already "know" about that data. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The senior-physician analogy breaks down on transparency: an experienced doctor can usually explain WHY they trust one specialist more in a given case. A stacking meta-learner's learned weights are typically just numbers with no accompanying narrative — you can see the weight, not necessarily the reasoning."
      ),
      caveat: blSame(
        'A real caveat: stacking\'s accuracy gains come at real cost — training and maintaining several diverse base models plus a meta-learner is far more compute- and engineering-expensive than any single model, and harder to debug when something goes wrong.'
      ),
      retrieval: {
        question: blSame('Without looking back: why must the meta-learner be trained on out-of-fold predictions rather than the base learners\' own training predictions?'),
        answer: blSame(
          "A base learner's predictions on its own training data are artificially accurate (it already memorized patterns in that exact data) — feeding those to the meta-learner would teach it to over-trust base models on data they've already seen, which won't hold on genuinely new data."
        ),
      },
    },
  },

  svm: {
    spark: {
      analogy: bl(
        "Like drawing the widest possible safety lane between two crowds of people, positioning it based only on the people standing closest to the boundary — everyone standing further back doesn't matter to where the lane goes.",
        'Finds the maximum-margin separating boundary; only support vectors (borderline points) determine the solution.'
      ),
      predict: {
        question: blSame('If you removed a point that\'s far from the SVM decision boundary (not a support vector), would the boundary move?'),
        options: [blSame('Yes, it would shift'), blSame('No, the boundary stays exactly the same')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you move a borderline (support vector) point closer to the opposite class, does the margin width grow or shrink?'), options: [blSame('Grows'), blSame('Shrinks')], correctIndex: 1 },
      paramLabel: blSame('Distance of closest borderline point to the boundary'),
      paramMin: 0.1, paramMax: 5, paramDefault: 2, paramStep: 0.1, paramDecimals: 1,
      compute: (v) => v * 2,
      outputLabel: blSame('Margin width'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'Two crisis/no-crisis regime clusters with a gap between them: SVM doesn\'t just find any separating line, it finds the one maximizing the gap on both sides — if the gap is 4 units wide, SVM centers its boundary exactly in the middle, at 2 units from each nearest point.',
        'Maximize margin 2/‖w‖ subject to yᵢ(w·xᵢ+b)≥1 for all i; only points where equality holds (yᵢ(w·xᵢ+b)=1) — the support vectors — have nonzero Lagrange multipliers and thus influence w.'
      ),
      faded: bl(
        'If you added a new point far inside one cluster (not near the boundary at all), would it become a support vector? Step 1 — recall what defines a support vector. Step 2 — answer: _____.',
        'If you added a new point far inside one cluster (not near the boundary at all), would it become a support vector? Step 1 — recall what defines a support vector. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The safety-lane analogy breaks down for the "kernel trick" specifically: a real physical lane must stay straight in physical space. SVM can effectively bend its boundary into a curve by working in a transformed, higher-dimensional space — the lane is only straight in that hidden space, not necessarily in the one you\'d actually plot.'
      ),
      caveat: blSame(
        'A real caveat: SVM\'s reliance on pairwise distance/kernel computations between points means training cost grows poorly with dataset size — it\'s genuinely impractical on very large datasets in a way tree-based methods aren\'t.'
      ),
      retrieval: {
        question: blSame('Without looking back: why is SVM described as "memory-efficient" despite storing potentially many support vectors?'),
        answer: blSame(
          "Because it only needs to store the support vectors, not the entire training dataset — for a well-separated problem, the support vectors are often a small fraction of all training points, unlike KNN which must retain every single point regardless of how decisive it is."
        ),
      },
    },
  },

  kmeans: {
    spark: {
      analogy: bl(
        "Like splitting a crowded room into a fixed number of friend-groups by repeatedly having everyone walk to whichever group's current center they're standing closest to, then re-finding each group's center — until nobody wants to switch groups anymore.",
        'Alternates between assigning points to the nearest centroid and recomputing centroids as cluster means, until convergence.'
      ),
      predict: {
        question: blSame('If you run K-Means twice on the same data with different random starting centroids, will you always get the exact same final clusters?'),
        options: [blSame('Yes, always identical'), blSame('Not necessarily — it can converge to different local solutions')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase k (the number of clusters requested), does the within-cluster error (how tight each group is) rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 1 },
      paramLabel: blSame('k (number of clusters)'),
      paramMin: 1, paramMax: 15, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => 100 / v,
      outputLabel: blSame('Toy within-cluster error (illustrative)'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'Segmenting 6 historical market days by two features (volatility, return) into k=2 "regimes": start with 2 random centroids, assign each day to its nearest one, recompute each centroid as the mean of its assigned days, repeat — after a few rounds this settles into a stable "calm" cluster and a "turbulent" cluster.',
        'Minimizes Σₖ Σ_{x∈Cₖ} ‖x-μₖ‖² (within-cluster sum of squares) via alternating assignment (Voronoi partition under current centroids) and update (μₖ = mean of Cₖ) steps — guaranteed to decrease the objective each iteration, but only to a local optimum.'
      ),
      faded: bl(
        'If k equals the total number of data points, what would the within-cluster error become? Step 1 — think about what "cluster" means when each point is its own group. Step 2 — answer: _____.',
        'If k equals the total number of data points, what would the within-cluster error become? Step 1 — think about what "cluster" means when each point is its own group. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        'The friend-groups analogy breaks down on shape: real friend groups can cluster in any shape (a long line at a buffet, a ring around a stage). K-Means mathematically assumes roughly round, similarly-sized clusters (nearest-centroid assignment naturally carves space into convex regions) — elongated or oddly-shaped true groupings will be sliced up incorrectly.'
      ),
      caveat: blSame(
        'A real caveat: K-Means requires choosing k in advance with no built-in way to determine the "right" number — you typically need a separate method (like the elbow method or silhouette score) run alongside it.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does K-Means guarantee its objective (within-cluster sum of squares) never increases, but not guarantee finding the globally best clustering?'),
        answer: blSame(
          "Both the assignment and update steps each individually can only decrease or maintain the objective, never increase it — so the algorithm always converges. But it converges to whichever local optimum the random starting centroids happened to lead toward, and a different random start can lead to a different (possibly worse) local optimum."
        ),
      },
    },
  },

  hclust: {
    spark: {
      analogy: bl(
        'Like building a family tree from the bottom up — first pairing the two most similar individuals, then treating that pair as one unit and pairing it with the next most similar, until everyone\'s connected into one tree showing every possible grouping at once.',
        'Agglomerative construction of a dendrogram by repeatedly merging the two closest clusters, with no need to pre-specify a cluster count.'
      ),
      predict: {
        question: blSame('Does hierarchical clustering require you to decide the number of clusters BEFORE running it, like K-Means does?'),
        options: [blSame('Yes, in advance'), blSame('No — you can choose it after, by where you cut the tree')],
        correctIndex: 1,
      },
    },
    mechanism: { kind: 'live-link', module: 'modelmap', label: blSame('This very Model Map — built with the same merge-tree idea') },
    formalism: {
      worked: bl(
        'Four models with pairwise similarity scores: (Linear Regression, Ridge) are most similar → merge first into "Linear family." Then that family merges with Logistic Regression next-most-similar → "Linear & Regularized" cluster. The full sequence of merges IS the dendrogram.',
        'Agglomerative clustering repeatedly merges the pair (Cᵢ,Cⱼ) minimizing a linkage criterion d(Cᵢ,Cⱼ) — e.g. single-linkage: min distance between any pair of points across the two clusters; complete-linkage: max distance; the cut height on the resulting dendrogram then determines the final flat clustering.'
      ),
      faded: bl(
        'If you cut the dendrogram very close to the top (near the single root), would you get many small clusters or few large ones? Step 1 — think about how much merging has happened near the root. Step 2 — answer: _____.',
        'If you cut the dendrogram very close to the top (near the single root), would you get many small clusters or few large ones? Step 1 — think about how much merging has happened near the root. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The family-tree analogy is genuinely close, but breaks down on reversibility: a real family tree's early marriages are permanent historical facts. Hierarchical clustering's early merges are also permanent — a bad early merge (two dissimilar clusters accidentally paired) can never be undone later in the process, unlike K-Means which can re-assign points every iteration."
      ),
      caveat: blSame(
        "A real caveat: computing all pairwise distances between every pair of points scales quadratically (or worse) with dataset size, which is exactly why it's computationally expensive at scale."
      ),
      retrieval: {
        question: blSame('Without looking back: why is a dendrogram genuinely more informative than a single flat clustering, even though the final flat clusters are what get used?'),
        answer: blSame(
          "A dendrogram shows every possible number of clusters at once, from 1 (the whole dataset) to n (every point its own cluster) — you can inspect the whole hierarchy of relationships and choose a cut height after seeing the structure, rather than committing to one k blindly beforehand."
        ),
      },
    },
  },

  pca: {
    spark: {
      analogy: bl(
        "Like realizing that a room full of thermometers, all reading roughly the same temperature just with slightly different offsets, can be summarized by just \"one true temperature\" instead of tracking every thermometer separately.",
        'Compresses many correlated variables into a few uncorrelated "factor" directions capturing most of the shared variance.'
      ),
      predict: {
        question: blSame('If five economic indicators all move almost perfectly together (highly correlated), can PCA compress them into fewer than five numbers with little information loss?'),
        options: [blSame('Yes'), blSame('No, PCA can never reduce dimensionality without major loss')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As the original variables become more strongly correlated with each other, does the first principal component explain more or less of the total variance?'), options: [blSame('More'), blSame('Less')], correctIndex: 0 },
      paramLabel: blSame('Correlation among original variables'),
      paramMin: 0, paramMax: 1, paramDefault: 0, paramStep: 0.05, paramDecimals: 2,
      compute: (v) => 20 + v * 75,
      outputLabel: blSame('% variance explained by 1st component'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Five macro indicators (yield curve, PMI, labor market, mobility, freight) are all correlated with an underlying "economic momentum" factor. PCA might find that a single first component explains 78% of all five series\' combined variance — a huge compression with modest information loss, feeding a DFM-style single "common macro factor."',
        'PCA solves the eigendecomposition of the covariance matrix Σ = VΛVᵀ; the first principal component is the eigenvector with the largest eigenvalue, and % variance explained by component k is λₖ/Σλᵢ.'
      ),
      faded: bl(
        'If the five original variables were completely uncorrelated (each moving independently), would one PCA component still capture most of the variance? Step 1 — think about whether there\'s any shared structure to compress. Step 2 — answer: _____.',
        'If the five original variables were completely uncorrelated (each moving independently), would one PCA component still capture most of the variance? Step 1 — think about whether there\'s any shared structure to compress. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The thermometer analogy breaks down on interpretability: \"one true temperature\" is still a temperature, easy to understand. A PCA component is a weighted blend of all original variables at once — it might mix yield-curve-slope with mobility-data in a way that has no clean, single real-world name, unlike the analogy's clean single number."
      ),
      caveat: blSame(
        'A real caveat: PCA finds directions of maximum variance, not necessarily directions that are most predictive of any particular target — a component explaining 90% of input variance could still be nearly useless for forecasting a specific outcome.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does PCA lose "direct interpretability" even though it keeps most of the original information?'),
        answer: blSame(
          "Each principal component is a linear blend (weighted sum) of ALL the original variables at once, not a single one of them — so a component's value doesn't map onto any one concrete, nameable real-world quantity the way an original raw feature (like \"real yields\") does."
        ),
      },
    },
  },

  arima: {
    spark: {
      analogy: bl(
        "Like predicting tomorrow's temperature mostly from today's and yesterday's, after first removing the overall warming trend — ARIMA predicts the next value from a weighted mix of recent past values and recent past errors.",
        'Combines AutoRegressive, Integrated (differencing), and Moving Average components; SARIMA adds seasonal terms.'
      ),
      predict: {
        question: blSame('Would ARIMA handle a sudden, permanent structural break (like a regime shift) well, or poorly, without being explicitly re-fit?'),
        options: [blSame('Well'), blSame('Poorly — it keeps extrapolating the old pattern')],
        correctIndex: 1,
      },
    },
    mechanism: {
      // AR(1): a deviation from the long-run level shrinks by φ each step,
      // so it halves after ln(0.5)/ln(φ) steps.
      kind: 'widget',
      predict: { question: blSame('With φ = 0.8, as in the worked example, about how many days until a $35 deviation has shrunk to $17.50?'), options: [blSame('Under 1 day'), blSame('About 3 days'), blSame('It never shrinks')], correctIndex: 1 },
      paramLabel: blSame('AR(1) coefficient φ'),
      paramMin: 0.05, paramMax: 0.99, paramDefault: 0.8, paramStep: 0.01, paramDecimals: 2,
      compute: (phi) => Math.log(0.5) / Math.log(phi),
      outputLabel: blSame('Days until a deviation has halved'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'A simple AR(1) model: next_price = 4015 + 0.8×(today_price − 4015). If today is $4,050 (35 above the long-run level), tomorrow\'s forecast is 4015 + 0.8×35 = $4,043 — reverting most, but not all, of the way back.',
        'AR(p): yₜ = c + Σᵢφᵢyₜ₋ᵢ + εₜ; the differencing order d removes trend so the AR/MA structure applies to a stationary series; MA(q) additionally models εₜ as a function of past forecast errors.'
      ),
      faded: bl(
        'If φ₁ were exactly 0 in an AR(1) model, what would tomorrow\'s forecast reduce to? Step 1 — plug φ₁=0 into c + φ₁yₜ₋₁. Step 2 — answer: _____ (does today\'s value matter at all?)',
        'If φ₁ were exactly 0 in an AR(1) model, what would tomorrow\'s forecast reduce to? Step 1 — plug φ₁=0 into c + φ₁yₜ₋₁. Step 2 — answer: _____ (does today\'s value matter at all?)'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The temperature analogy is fairly close, but breaks down on \"why\" the model works: temperature genuinely has physical inertia. ARIMA's autoregressive structure is a purely statistical pattern-fit — it assumes the past-value relationship will hold going forward with no understanding of WHY gold prices are correlated day to day (unlike temperature's physical causes)."
      ),
      caveat: blSame(
        'A real caveat: choosing the (p,d,q) orders manually is genuinely time-consuming and somewhat subjective, even with statistical tools (ACF/PACF plots, information criteria) to guide the choice — there\'s no single automatic "correct" answer.'
      ),
      retrieval: {
        question: blSame('Without looking back: why is the "I" (Integrated/differencing) step necessary before fitting the AR and MA parts?'),
        answer: blSame(
          "AR and MA structure assumes a stationary series (constant mean/variance over time) — a raw price series with a trend violates that assumption. Differencing (subtracting each value from the previous one) removes the trend, leaving a series the AR/MA math can validly be applied to."
        ),
      },
    },
  },

  var: {
    spark: {
      analogy: bl(
        "Like predicting three friends' moods together, where each person's mood tomorrow depends on all three friends' moods today — not just their own — because they influence each other.",
        'Models each of n variables as a linear function of p lags of itself AND all other variables in the system, estimated jointly.'
      ),
      predict: {
        question: blSame('Could VAR capture a feedback loop where gold affects DXY AND DXY affects gold, both at once?'),
        options: [blSame('Yes, that\'s exactly what it\'s built for'), blSame('No, it can only model one-directional influence')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you add more variables to the VAR system, does the number of parameters needing estimation rise linearly or faster?'), options: [blSame('Linearly'), blSame('Much faster (quadratically)')], correctIndex: 1 },
      paramLabel: blSame('Number of variables in the VAR system'),
      paramMin: 1, paramMax: 10, paramDefault: 1, paramStep: 1, paramDecimals: 0,
      compute: (v) => v * v * 2,
      outputLabel: blSame('Toy parameter count (per lag)'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'A 2-variable VAR(1) for gold and DXY: gold_t = a₁·gold_{t-1} + a₂·DXY_{t-1}; DXY_t = b₁·gold_{t-1} + b₂·DXY_{t-1}. If a₂ is meaningfully negative, that\'s VAR quantifying "yesterday\'s stronger dollar predicts today\'s lower gold" — a feedback ARIMA (which only sees gold\'s own history) could never capture.',
        'yᵢ,ₜ = cᵢ + Σⱼ Σₗ φᵢⱼₗ yⱼ,ₜ₋ₗ + εᵢ,ₜ for each variable i; the full system has n×n×p coefficients (φ matrices), estimated jointly typically via OLS equation-by-equation.'
      ),
      faded: bl(
        'If gold and DXY had NO influence on each other at all (a₂=0 and b₁=0), what would the VAR system effectively reduce to? Step 1 — think about what\'s left in each equation. Step 2 — answer: _____.',
        'If gold and DXY had NO influence on each other at all (a₂=0 and b₁=0), what would the VAR system effectively reduce to? Step 1 — think about what\'s left in each equation. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The three-friends analogy breaks down on causation vs. correlation: VAR quantifies statistical predictive relationships between the mood series, not genuine causal influence — one friend's mood \"predicting\" another's could be both reacting to a shared outside event (the exact confounder trap Module 10 covers), not one causing the other."
      ),
      caveat: blSame(
        'A real caveat: VAR\'s parameter count grows with the square of the number of variables (n² per lag) — adding just a few more series to the system can quickly demand more data than is realistically available, the "curse of dimensionality" the doc names directly.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does VAR need every included series to be stationary, just like ARIMA does?'),
        answer: blSame(
          "VAR is built from the same linear-regression-on-lags machinery as ARIMA, applied jointly across variables — the statistical guarantees behind OLS estimation (stable coefficients, valid standard errors) rely on the same stationarity assumption regardless of whether one series or several are involved."
        ),
      },
    },
  },

  garch: {
    spark: {
      analogy: bl(
        'Like knowing that a calm ocean tends to stay calm and a stormy ocean tends to stay stormy — GARCH doesn\'t predict the next wave\'s height directly, it predicts how WILD the waves are likely to be right now.',
        'Models conditional variance itself as time-varying, capturing volatility clustering — calm periods stay calm, turbulent periods stay turbulent.'
      ),
      predict: {
        question: blSame('After an unusually large price swing yesterday, does GARCH predict today\'s volatility to be higher or lower than normal?'),
        options: [blSame('Higher'), blSame('Lower')],
        correctIndex: 0,
      },
    },
    mechanism: {
      // GARCH(1,1): E[σ²ₜ₊ₕ] − σ̄² = (α + β)ʰ(σ²ₜ − σ̄²), so extra variance
      // from a shock halves after ln(0.5)/ln(α + β) days.
      kind: 'widget',
      predict: { question: blSame('As α + β gets closer to 1, how long does the extra turbulence from one shock linger?'), options: [blSame('Shorter'), blSame('About the same'), blSame('Longer and longer')], correctIndex: 2 },
      paramLabel: blSame('β, with α = 0.15 as in the worked example'),
      paramMin: 0.5, paramMax: 0.84, paramDefault: 0.8, paramStep: 0.01, paramDecimals: 2,
      compute: (beta) => Math.log(0.5) / Math.log(0.15 + beta),
      outputLabel: blSame('Days until a volatility shock has halved'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'σ²ₜ = 0.02 + 0.15·ε²ₜ₋₁ + 0.8·σ²ₜ₋₁. If yesterday\'s shock ε was unusually large (ε²=4) and yesterday\'s variance σ²ₜ₋₁ was 1, today\'s variance forecast: 0.02+0.15(4)+0.8(1)=1.42 — noticeably higher than yesterday\'s 1, exactly the "shock raises expected turbulence" behavior.',
        'σ²ₜ = ω + α·ε²ₜ₋₁ + β·σ²ₜ₋₁ (GARCH(1,1)); stationarity requires α+β<1, and β close to 1 (as is typical for financial series) means volatility shocks decay slowly, i.e. real persistence.'
      ),
      faded: bl(
        'If α+β were exactly 1 (borderline non-stationary), would a large shock\'s effect on volatility eventually fade away, or persist forever? Step 1 — think about what α+β<1 vs =1 means for decay. Step 2 — answer: _____.',
        'If α+β were exactly 1 (borderline non-stationary), would a large shock\'s effect on volatility eventually fade away, or persist forever? Step 1 — think about what α+β<1 vs =1 means for decay. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'exactness',
      analogyBreakdown: blSame(
        "The ocean analogy is close, but understates GARCH's actual output: the sea-calmness analogy suggests a rough qualitative sense of \"calm\" vs \"stormy.\" GARCH gives an exact numeric variance forecast — precise enough to feed directly into a formal, quantitative confidence interval on tomorrow's price, not just a vibe."
      ),
      caveat: blSame(
        'A real caveat: choosing the estimation window is genuinely contested — too long dilutes the current regime with stale data, too short makes the variance estimate itself noisy, and there\'s no single agreed-upon "right" window length.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does GARCH "improve confidence-interval realism" compared to a model that assumes constant volatility?'),
        answer: blSame(
          "A constant-volatility model gives the same-width interval every single day regardless of recent turbulence, which is unrealistically overconfident right after a big shock and unrealistically wide during genuinely calm periods. GARCH's interval width breathes with actual recent volatility, narrow when calm, wide right after a shock."
        ),
      },
    },
  },

  expsmooth: {
    spark: {
      analogy: bl(
        "Like a rumor spreading through a crowd, where the most recent thing you heard matters much more than something from a week ago — exponential smoothing weights recent observations more heavily, with weight fading gradually into the past.",
        'Forecasts as a smoothly-weighted average of past values, weights decaying exponentially into the past, extended with trend and seasonal components.'
      ),
      predict: {
        question: blSame('If the smoothing parameter α is set close to 1 (almost all weight on the most recent value), does the forecast react to new data quickly or slowly?'),
        options: [blSame('Quickly'), blSame('Slowly')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase α toward 1, does the forecast track the most recent observation more closely or less closely?'), options: [blSame('More closely'), blSame('Less closely')], correctIndex: 0 },
      paramLabel: blSame('α (smoothing weight on most recent value)'),
      paramMin: 0.05, paramMax: 0.95, paramDefault: 0.3, paramStep: 0.05, paramDecimals: 2,
      compute: (v) => v * 100,
      outputLabel: blSame('% weight on most recent observation'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Level update: Lₜ = α·yₜ + (1-α)·Lₜ₋₁. With α=0.3, yesterday\'s level estimate L=100, today\'s observation y=120: new level = 0.3(120)+0.7(100)=106 — moved toward the new observation, but didn\'t jump all the way to it.',
        'Simple exponential smoothing: forecast ŷₜ₊₁=Lₜ=αyₜ+(1-α)Lₜ₋₁=Σᵢα(1-α)ⁱyₜ₋ᵢ — an infinite weighted sum where weights decay geometrically, so it\'s mathematically equivalent to a specific ARIMA(0,1,1).'
      ),
      faded: bl(
        'If α=1 exactly, what would the forecast for tomorrow simply equal? Step 1 — plug α=1 into Lₜ=αyₜ+(1-α)Lₜ₋₁. Step 2 — answer: _____.',
        'If α=1 exactly, what would the forecast for tomorrow simply equal? Step 1 — plug α=1 into Lₜ=αyₜ+(1-α)Lₜ₋₁. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The rumor-spreading analogy breaks down on memory span: a real rumor eventually gets completely forgotten (old versions truly vanish). Exponential smoothing's weights never technically reach zero — every past observation, no matter how old, still carries a tiny nonzero weight forever, just an extremely small one."
      ),
      caveat: blSame(
        'A real caveat: exponential smoothing is genuinely weaker with irregular shocks or structural change — its trend/seasonal components assume the underlying pattern is stable enough to keep smoothly extrapolating, which breaks down exactly when a real regime shift happens.'
      ),
      retrieval: {
        question: blSame('Without looking back: why is exponential smoothing described as "very fast" compared to ARIMA?'),
        answer: blSame(
          "Its recursive update rule needs only the previous forecast state and the new observation — a handful of simple arithmetic operations per step — with no need for iterative optimization, differencing-order selection, or matrix computations the way fitting an ARIMA model requires."
        ),
      },
    },
  },

  prophet: {
    spark: {
      analogy: bl(
        "Like planning a retail budget by separately estimating \"the overall growth trend,\" \"the usual December spike,\" and \"the Black Friday bump,\" then adding all three together — Prophet decomposes a series into named, separately-fit pieces.",
        'Additive decomposition into trend, seasonality, and holiday effects, each fit somewhat independently, then summed.'
      ),
      predict: {
        question: blSame('Given that Prophet is optimized for ease of use and handling messy/sparse data gracefully, would you expect it to usually beat XGBoost/LSTM on raw accuracy for gold forecasting?'),
        options: [blSame('Yes, usually'), blSame('No — the research consistently finds it less accurate')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you add a strong holiday effect to a series, does Prophet\'s forecast around that date spike more sharply or stay smooth?'), options: [blSame('Spikes more sharply'), blSame('Stays smooth')], correctIndex: 0 },
      paramLabel: blSame('Holiday effect strength'),
      paramMin: 0, paramMax: 10, paramDefault: 0, paramStep: 1, paramDecimals: 0,
      compute: (v) => v * 8,
      outputLabel: blSame('Toy forecast spike on holiday (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'y(t) = g(t)+s(t)+h(t): a gentle upward trend g(t) contributes +2/day, weekly seasonality s(t) contributes +5 on Fridays, and a holiday indicator h(t) adds +20 on a specific tagged date. On that holiday: total = trend_value + 5 + 20 — each piece\'s contribution is visible and separable.',
        'g(t) is piecewise-linear or logistic; s(t) uses a truncated Fourier series Σₙ(aₙcos(2πnt/P)+bₙsin(2πnt/P)) for period P; the full model is fit via MAP estimation (Bayesian point estimate) in Stan.'
      ),
      faded: bl(
        'On a normal (non-holiday, non-Friday) day, which of the three components (g, s, h) would contribute essentially nothing? Step 1 — think about what triggers each component. Step 2 — answer: _____.',
        'On a normal (non-holiday, non-Friday) day, which of the three components (g, s, h) would contribute essentially nothing? Step 1 — think about what triggers each component. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The separate-budget-lines analogy is genuinely accurate for Prophet's structure, but breaks down on flexibility: a human budget planner can spot an entirely new pattern (a surprise trend break) and add a line item for it immediately. Prophet's trend component only bends at pre-specified or automatically-detected \"changepoints\" — it doesn't notice a brand-new kind of pattern the way a person would."
      ),
      caveat: blSame(
        'A real caveat: Prophet\'s ease-of-use is a real design tradeoff, not a free lunch — the comparative research consistently finds it less accurate than ARIMA/LSTM/XGBoost, particularly struggling with short-term fluctuations its smooth decomposition isn\'t built to capture.'
      ),
      retrieval: {
        question: blSame('Without looking back: why is Prophet described as good for "non-expert users" specifically?'),
        answer: blSame(
          "Its decomposed structure (trend + seasonality + holidays) maps onto concepts a non-statistician already intuitively understands, and it has sensible automatic defaults for changepoints and seasonality — unlike ARIMA, which requires understanding stationarity and manually selecting (p,d,q) orders to get a good fit."
        ),
      },
    },
  },

  hybrid: {
    spark: {
      analogy: bl(
        "Like a senior editor who first fixes the obvious grammar in a draft, then hands it to a specialist to catch the subtle stylistic issues the grammar-fixer missed — ARIMA catches the obvious trend, ML catches what's subtly left over.",
        'Fits a classical model first, then trains an ML model on its residuals, combining linear-trend strength with nonlinear pattern-capture.'
      ),
      predict: {
        question: blSame('If ARIMA already captured 100% of the pattern in a series (zero residual error), would the ML residual model have anything left to learn?'),
        options: [blSame('Yes, always more to find'), blSame('No — nothing meaningful left to fit')],
        correctIndex: 1,
      },
    },
    mechanism: {
      // Illustrative split of ARIMA's residual variance (100 $²): 60 is a
      // predictable pattern, 40 is pure noise. An ML model that captures a
      // share k of the pattern leaves error variance 40 + 60(1 − k)².
      kind: 'widget',
      predict: { question: blSame('Even an ML model that captures all of the predictable residual pattern leaves some error. Why can the hybrid never reach zero?'), options: [blSame('It can — a perfect ML model removes all error'), blSame('Part of the residual is pure noise that nothing can predict')], correctIndex: 1 },
      paramLabel: blSame('Share of the predictable residual pattern the ML model captures (illustrative: 60 of ARIMA\'s 100 $² residual variance is pattern, 40 is noise)'),
      paramMin: 0, paramMax: 1, paramDefault: 0, paramStep: 0.05, paramDecimals: 2,
      compute: (k) => Math.sqrt(40 + 60 * (1 - k) ** 2),
      outputLabel: blSame('Hybrid forecast error (RMSE), in dollars'),
      outputDecimals: 2,
    },
    formalism: {
      worked: bl(
        'ARIMA forecasts gold at $4,015 for tomorrow. Its historical residuals (actual minus ARIMA-predicted) show a pattern XGBoost detects: residuals tend to be +$25 whenever geopolitical risk spiked recently, something ARIMA structurally can\'t see. Final hybrid forecast: $4,015 + $25 = $4,040.',
        'ŷ_hybrid = ŷ_ARIMA + ŷ_ML(residual features), where ŷ_ML is trained on {features, εₜ=yₜ-ŷ_ARIMA,ₜ} pairs — the ML model\'s entire job is explaining what\'s systematically left over after the linear structure is removed.'
      ),
      faded: bl(
        'If ARIMA\'s residuals were pure random noise with no pattern at all, would training an ML model on them improve the final forecast? Step 1 — think about what an ML model can learn from pure noise. Step 2 — answer: _____.',
        'If ARIMA\'s residuals were pure random noise with no pattern at all, would training an ML model on them improve the final forecast? Step 1 — think about what an ML model can learn from pure noise. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The editor-then-specialist analogy breaks down on independence: a human specialist reviewing a draft can flag that the grammar-fixer actually made a mistake and should be redone. In a hybrid model, the ML stage simply accepts ARIMA's output as fixed and correct-as-given — it has no way to \"push back\" on the first stage, only patch what's left after it."
      ),
      caveat: blSame(
        'A real caveat: hybrid pipelines have genuinely more moving parts than either component alone — two models to maintain, tune, and debug instead of one, with the added complexity of making sure the residual-fitting stage doesn\'t leak future information back into training.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does the doc call hybrid stacks an "ideal Stats + ML working together" teaching module?'),
        answer: blSame(
          "Because the two stages genuinely play to each other's documented strengths rather than competing: the econometric stage (Stats territory) handles the interpretable, structural trend cleanly, while the ML stage (ML territory) handles whatever nonlinear pattern is genuinely left over — a real division of labor, not just two models bolted together arbitrarily."
        ),
      },
    },
  },

  rnn: {
    spark: {
      analogy: bl(
        "Like reading a book one word at a time while keeping a running mental summary of the story so far — an RNN reads a sequence step by step, updating its \"memory\" at each step.",
        'Maintains a hidden state updated recurrently at each timestep, carrying forward context; trained via backpropagation through time.'
      ),
      predict: {
        question: blSame('For a very long sequence (say 500 timesteps), does a vanilla RNN typically remember information from step 1 well by the time it reaches step 500?'),
        options: [blSame('Yes, well'), blSame('No — it tends to fade or vanish')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As the sequence gets longer, does a vanilla RNN\'s ability to use very early information rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 1 },
      paramLabel: blSame('Sequence length (timesteps)'),
      paramMin: 5, paramMax: 200, paramDefault: 5, paramStep: 5, paramDecimals: 0,
      compute: (v) => Math.max(2, 100 * Math.pow(0.985, v)),
      outputLabel: blSame('Toy retained signal from step 1 (%)'),
      outputDecimals: 1, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'hₜ = tanh(0.5·hₜ₋₁ + input). Starting from h₀=1 with no further input, each step multiplies roughly by 0.5: h₁≈0.46, h₂≈0.21, h₃≈0.10 — the original signal is already less than 10% of its size after just 3 steps, illustrating exactly why "vanishing" is the right word.',
        'hₜ=f(Whₕhₜ₋₁+Wₓₕxₜ+b); gradients backpropagated through time involve a product of Jacobians across all T steps — if the spectral radius of Whₕ is <1, this product shrinks geometrically, vanishing for large T (the reverse, >1, causes exploding gradients).'
      ),
      faded: bl(
        'If the recurrent weight were 1.5 instead of 0.5 (>1), would repeated multiplication shrink toward zero or grow without bound over many steps? Step 1 — compute 1.5² and 1.5³. Step 2 — answer: _____ (vanishing or exploding?)',
        'If the recurrent weight were 1.5 instead of 0.5 (>1), would repeated multiplication shrink toward zero or grow without bound over many steps? Step 1 — compute 1.5² and 1.5³. Step 2 — answer: _____ (vanishing or exploding?)'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The reading-with-a-summary analogy breaks down on capacity: a person's mental summary can selectively hold onto whatever detail matters most, no matter how long ago they read it. A vanilla RNN's hidden state has no such selective control — it's mathematically forced to fade all old information at roughly the same geometric rate, whether that information turns out to matter or not."
      ),
      caveat: blSame(
        'A real caveat: RNNs process one timestep at a time by construction, so they can\'t be easily parallelized across the time dimension the way CNNs or Transformers can — this is a real training-speed cost, not just an accuracy one.'
      ),
      retrieval: {
        question: blSame('Without looking back: why is a vanilla RNN considered good only for "short-sequence pattern learning"?'),
        answer: blSame(
          "Because the vanishing gradient problem means information (and the training signal that would let it learn from that information) genuinely degrades geometrically with distance — on short sequences that decay hasn't gone far enough to matter, but on long ones, information from early steps is essentially lost by the time it would be needed."
        ),
      },
    },
  },

  lstm: {
    spark: {
      analogy: bl(
        "Like an RNN with a personal secretary who explicitly decides, at every step, what to write down, what to cross out, and what to actually say out loud — LSTM's gates solve the vanilla RNN's tendency to forget things too quickly.",
        'Introduces forget/input/output gates controlling information flow through a cell state, mitigating vanishing gradients and enabling long-range dependency learning.'
      ),
      predict: {
        question: blSame('Compared to a vanilla RNN, would an LSTM generally remember relevant information from 100 steps ago better or worse?'),
        options: [blSame('Better'), blSame('Worse')],
        correctIndex: 0,
      },
    },
    mechanism: {
      // Cell state Cₜ = fₜ⊙Cₜ₋₁ + iₜ⊙C̃ₜ; with no new input and a constant
      // forget gate f, an old memory keeps fᵏ of itself after k steps.
      kind: 'widget',
      predict: { question: blSame('With the forget gate held at 0.9, how much of an old memory survives 20 steps?'), options: [blSame('About 90%'), blSame('About 12%'), blSame('None')], correctIndex: 1 },
      paramLabel: blSame('Forget gate fₜ, held constant (no new input)'),
      paramMin: 0, paramMax: 1, paramDefault: 0.9, paramStep: 0.01, paramDecimals: 2,
      compute: (f) => 100 * f ** 20,
      outputLabel: blSame('Share of an old memory left after 20 steps'),
      outputDecimals: 1, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'A forget gate outputs fₜ=0.9 (close to 1, "keep most of the old memory") when recent inputs look unremarkable, but drops to fₜ=0.1 ("mostly forget") right after a genuinely surprising data point — this learned, input-dependent gating is exactly what lets important old information survive far longer than a fixed 0.5 decay would allow.',
        'fₜ=σ(Wf·[hₜ₋₁,xₜ]+bf) (forget gate), iₜ=σ(Wi·[hₜ₋₁,xₜ]+bi) (input gate); cell state update Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ — the forget gate\'s multiplicative but *learned and input-dependent* factor (unlike vanilla RNN\'s fixed weight) is what allows near-lossless information retention when fₜ≈1.'
      ),
      faded: bl(
        'If the forget gate output fₜ were always exactly 1 for every timestep (never forgetting anything), what would that imply about the cell state\'s memory capacity over very long sequences? Step 1 — think about what fₜ=1 does to Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ. Step 2 — answer: _____.',
        'If the forget gate output fₜ were always exactly 1 for every timestep (never forgetting anything), what would that imply about the cell state\'s memory capacity over very long sequences? Step 1 — think about what fₜ=1 does to Cₜ=fₜ⊙Cₜ₋₁+iₜ⊙C̃ₜ. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The secretary analogy breaks down on transparency: a real secretary could explain their filing decisions in plain language. LSTM's gates are learned numeric functions with no inherent human-readable meaning — you can inspect the gate values, but there's no guarantee they correspond to anything a person would recognize as a sensible \"reason\" for keeping or forgetting."
      ),
      caveat: blSame(
        'A real caveat: solving vanishing gradients doesn\'t remove LSTM\'s "black box" nature — it\'s genuinely harder to explain why an LSTM made a specific prediction than a linear model or even a decision tree, precisely because of its many gates and nonlinear interactions.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does LSTM need "large data" to perform well, more so than a simpler model like ARIMA?'),
        answer: blSame(
          "LSTM has far more learnable parameters (four separate gate networks per layer, each with its own weights) than ARIMA's handful of coefficients — more parameters generally need more examples to estimate reliably without overfitting, the same data-hunger tradeoff seen throughout the compass axis, just at a more extreme point."
        ),
      },
    },
  },

  cnn: {
    spark: {
      analogy: bl(
        "Like a security guard scanning security footage with a fixed-size magnifying glass, sliding it across every frame looking for one specific type of suspicious motion — wherever that pattern appears, the glass detects it.",
        'Applies learned 1D convolutional filters sliding across the time axis, detecting translation-invariant local motifs.'
      ),
      predict: {
        question: blSame('If a CNN filter learns to detect a "sudden price spike" pattern near the start of a sequence, will it also detect the same spike pattern if it occurs near the end?'),
        options: [blSame('Yes — filters are translation-invariant, they detect the pattern wherever it appears'), blSame('No, only where it was originally trained')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you widen the CNN filter\'s kernel size, does it detect shorter-range or longer-range local patterns?'), options: [blSame('Shorter-range'), blSame('Longer-range')], correctIndex: 1 },
      paramLabel: blSame('Kernel size (timesteps covered per filter)'),
      paramMin: 2, paramMax: 30, paramDefault: 3, paramStep: 1, paramDecimals: 0,
      compute: (v) => v,
      outputLabel: blSame('Local pattern span detected (timesteps)'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'A kernel of size 3 sliding across [10,12,11,25,13,12]: at position 4 (window [11,25,13]) the filter\'s learned weights strongly activate on the 25 — a big local jump — regardless of whether that pattern happens at position 4 or position 40 of a much longer series, the same filter fires.',
        '(x*w)ₜ = Σᵢ₌₀ᵏ⁻¹ wᵢ·xₜ₊ᵢ for kernel size k; the same weight vector w is reused (shared) at every position t, which is exactly the parameter-sharing that gives translation invariance and keeps parameter count independent of sequence length.'
      ),
      faded: bl(
        'If the same 3-timestep filter is applied to a sequence of length 100, how many different positions can it slide to (roughly)? Step 1 — think about how far it can slide before running off the end. Step 2 — answer: _____ (roughly how many).',
        'If the same 3-timestep filter is applied to a sequence of length 100, how many different positions can it slide to (roughly)? Step 1 — think about how far it can slide before running off the end. Step 2 — answer: _____ (roughly how many).'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The security-guard analogy breaks down on range: a guard's magnifying glass only ever sees one small window at a time and genuinely can't relate a suspicious moment at the start of the tape to one at the end. A single CNN layer has that exact limitation too — but stacking layers lets each successive layer see combinations of the previous layer's local detections, gradually building up longer-range awareness the single-glass analogy doesn't capture."
      ),
      caveat: blSame(
        'A real caveat: because a single 1D CNN layer only sees within its fixed kernel window, it\'s not natively suited to genuinely long-range temporal dependency — which is exactly why it\'s typically used as a fast feature-extraction front-end before an LSTM or Transformer, not as a complete forecasting model on its own.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does a CNN\'s parameter count NOT grow with sequence length, unlike a fully-connected layer would?'),
        answer: blSame(
          "Because the same small filter (weight vector) is reused — slid across — every position in the sequence, rather than each position getting its own dedicated set of weights. Ten times the sequence length just means the same filter slides ten times more, not that ten times more parameters need to be learned."
        ),
      },
    },
  },

  transformer: {
    spark: {
      analogy: bl(
        "Like reading an entire report at once instead of one line at a time, then highlighting exactly which earlier sentences mattered most for understanding the conclusion — a Transformer looks at the whole sequence simultaneously and learns which past moments matter most.",
        'Self-attention computes weighted combinations of all timesteps simultaneously; the TFT additionally separates static, known-future, and observed inputs.'
      ),
      predict: {
        question: blSame('Because a Transformer looks at all timesteps simultaneously rather than one at a time, can it be trained in parallel (much faster) compared to an RNN?'),
        options: [blSame('Yes, much more parallelizable'), blSame('No, it\'s equally sequential')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('If a specific past timestep is highly relevant to the current prediction, does its attention weight tend to be higher or lower than an irrelevant timestep\'s?'), options: [blSame('Higher'), blSame('Lower')], correctIndex: 0 },
      paramLabel: blSame('Relevance of a past timestep to now'),
      paramMin: 0, paramMax: 10, paramDefault: 5, paramStep: 1, paramDecimals: 0,
      compute: (v) => (v / 10) * 100,
      outputLabel: blSame('Toy attention weight (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'For a 6-month gold forecast, attention weights across the past year might come out as: [0.05, 0.05, 0.05, 0.05, 0.35, 0.45] for months 1-6 — the model learned that the two most recent months matter far more than the oldest four, and this exact number is directly inspectable, unlike a black-box hidden state.',
        'Attention(Q,K,V)=softmax(QKᵀ/√d)V; the softmax over QKᵀ produces a probability distribution (weights summing to 1) over all timesteps, and V is then a weighted combination using those attention weights — the weights themselves are the "which past moments mattered" answer.'
      ),
      faded: bl(
        'If all attention weights across every timestep came out exactly equal (uniform), what would that imply the model learned about which past moments matter more than others? Step 1 — think about what "equal weight everywhere" means. Step 2 — answer: _____.',
        'If all attention weights across every timestep came out exactly equal (uniform), what would that imply the model learned about which past moments matter more than others? Step 1 — think about what "equal weight everywhere" means. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The highlighting-a-report analogy is unusually accurate for what attention weights literally show, but it undersells the scale: a human highlighter marks maybe a handful of key sentences. A Transformer computes and can display a weight for every single pair of timesteps simultaneously — a complete, dense map of relevance, not just a few marked highlights."
      ),
      caveat: blSame(
        "A real caveat: despite its added complexity and interpretability promise, recent research shows Transformers don't consistently beat simpler LSTM/BiLSTM baselines on forecasting tasks — more sophisticated doesn't automatically mean more accurate."
      ),
      retrieval: {
        question: blSame('Without looking back: why can a Transformer be trained faster (more parallelizable) than an RNN despite processing the same sequence?'),
        answer: blSame(
          "An RNN must compute hₜ before it can compute hₜ₊₁ — a hard sequential dependency. A Transformer's attention computes relationships between ALL pairs of timesteps at once via matrix multiplication, with no step needing to wait for a previous step's output first, so the whole computation can run in parallel on modern hardware."
        ),
      },
    },
  },

  gp: {
    spark: {
      analogy: bl(
        "Like a cartographer who, instead of drawing one single coastline, sketches a whole bundle of plausible coastlines through every confirmed landmark — tightly bunched near known points, fanning out wide wherever no one has actually surveyed yet.",
        'Places a prior over an entire family of functions; posterior predictive is Gaussian with closed-form mean and variance conditioned on observed points.'
      ),
      predict: {
        question: blSame('Far away from any observed data point, would a Gaussian Process\'s uncertainty band be narrow or wide?'),
        options: [blSame('Narrow'), blSame('Wide')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As a query point moves farther from all observed data, does the GP\'s predictive uncertainty rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 0 },
      paramLabel: blSame('Distance from nearest observed point'),
      paramMin: 0, paramMax: 10, paramDefault: 0, paramStep: 0.5, paramDecimals: 1,
      compute: (v) => 5 + v * v * 3,
      outputLabel: blSame('Toy predictive uncertainty (band width)'),
      outputDecimals: 1,
    },
    formalism: {
      worked: bl(
        'With just 4 observed gold-price points, a GP fit to them gives a tight band (±$15) right at those exact 4 points, but a much wider band (±$180) at a query point far from all 4 — the model is honestly saying "I have very little evidence here."',
        'Posterior mean μ*(x) and variance σ²*(x) at a query point x are computed in closed form from the kernel k(x,x\') and observed data: σ²*(x) shrinks toward the kernel\'s inherent noise floor near observed xᵢ and grows toward the prior variance far from any xᵢ.'
      ),
      faded: bl(
        'If you observed a 5th point right in the middle of the widest-uncertainty gap, what would happen to the band width right at that new point? Step 1 — recall how the GP treats observed points. Step 2 — answer: _____.',
        'If you observed a 5th point right in the middle of the widest-uncertainty gap, what would happen to the band width right at that new point? Step 1 — recall how the GP treats observed points. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'exactness',
      analogyBreakdown: blSame(
        "The bundle-of-coastlines analogy is genuinely faithful, but understates the precision: a cartographer's \"bundle\" is a rough visual impression. A GP's uncertainty at any point is an exact, closed-form number (a variance you can compute to arbitrary precision) — not a vague sense of \"this area is less mapped,\" but a specific quantified confidence level."
      ),
      caveat: blSame(
        'A real caveat: computing that exact uncertainty requires inverting an n×n matrix (n = number of observed points), which is cubic-cost in n — genuinely too expensive to run on large datasets, exactly matching the compass axis\'s "computationally expensive at scale" weakness.'
      ),
      retrieval: {
        question: blSame('Without looking back: why is a Gaussian Process described as "excellent for small data" specifically?'),
        answer: blSame(
          "Because it gives honest, well-calibrated uncertainty even with very few observed points (rather than a false-confidence point estimate a simpler model might produce), and its computational cost — which scales cubically with dataset size — is only manageable when that dataset is genuinely small."
        ),
      },
    },
  },

  bstsbnn: {
    spark: {
      analogy: bl(
        "Like a weather forecaster who never commits to one single confident number, but always reports a full range of plausible outcomes, updated as each new day's data arrives — full posterior uncertainty, not just one best guess.",
        'BSTS decomposes into latent state components via Kalman filtering/Gibbs sampling; Bayesian NNs place priors over weights and approximate the posterior via variational inference or MCMC.'
      ),
      predict: {
        question: blSame('Compared to a plain point-estimate model, would a Bayesian NN\'s reported uncertainty typically widen or stay flat when it\'s given an input very unlike anything in training?'),
        options: [blSame('Widens'), blSame('Stays flat')],
        correctIndex: 0,
      },
    },
    mechanism: { kind: 'live-link', module: 'python', label: blSame('Python Hub — Bayesian models implemented in code') },
    formalism: {
      worked: bl(
        'A Bayesian NN\'s weight isn\'t one number like w=2.3 — it\'s a full distribution, say Normal(2.3, 0.4²). Sampling that distribution many times and running the network each time produces not one prediction but a spread of predictions, whose range IS the model\'s honest uncertainty.',
        'Weight posterior p(w|data) is approximated (via variational inference: q(w)≈p(w|data), or MCMC sampling); predictive distribution p(y|x,data)=∫p(y|x,w)p(w|data)dw is approximated by averaging over many sampled w — the spread of that sample is the calibrated uncertainty.'
      ),
      faded: bl(
        'If every sampled weight from the posterior gave nearly the same prediction for a given input, would the model\'s reported uncertainty for that input be high or low? Step 1 — think about what "all samples agree" means for spread. Step 2 — answer: _____.',
        'If every sampled weight from the posterior gave nearly the same prediction for a given input, would the model\'s reported uncertainty for that input be high or low? Step 1 — think about what "all samples agree" means for spread. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The honest-forecaster analogy is genuinely apt, but undersells the mechanism: a human forecaster's stated uncertainty is often a rough gut feeling. A Bayesian NN's uncertainty comes from an actual, mathematically principled procedure (a real posterior distribution over weights, sampled and propagated through the network) — it's earned from the math, not just verbally hedged."
      ),
      caveat: blSame(
        'A real caveat: this calibrated uncertainty is not free — sampling-based inference (MCMC especially) is genuinely slow to fit compared to a plain point-estimate model trained via ordinary gradient descent, and getting the implementation right is more complex.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does the doc call this family "the ML-side sibling of frequentist confidence intervals"?'),
        answer: blSame(
          "Both a frequentist t confidence interval (Stats mode's ci_mean_t) and a Bayesian posterior interval report a range around an estimate — but they mean fundamentally different things: the frequentist interval treats the true parameter as fixed and the interval as random across repeated sampling; the Bayesian interval treats the parameter itself as uncertain and the interval as a direct probability statement about it."
        ),
      },
    },
  },

  qlearning: {
    spark: {
      analogy: bl(
        "Like a video game player who, through pure trial and error across many playthroughs, gradually builds up a mental scorecard of \"how good is each move in each situation\" — and eventually just plays the highest-scoring move every time.",
        'Learns an action-value function Q(s,a) via the Bellman update, converging to the optimal policy under sufficient exploration.'
      ),
      predict: {
        question: blSame('If Q-Learning only ever picks the currently-best-known action and never tries anything new, will it always eventually find the truly optimal policy?'),
        options: [blSame('Yes, always'), blSame('No — it can get stuck never discovering a better untried action')],
        correctIndex: 1,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As you increase the exploration rate (chance of trying a random, non-best-known action), does the risk of getting permanently stuck in a suboptimal policy rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 1 },
      paramLabel: blSame('Exploration rate (ε)'),
      paramMin: 0, paramMax: 1, paramDefault: 0, paramStep: 0.05, paramDecimals: 2,
      compute: (v) => Math.max(2, 100 * (1 - v * 0.9)),
      outputLabel: blSame('Toy risk of a permanently missed better action (%)'),
      outputDecimals: 0, outputSuffix: '%',
    },
    formalism: {
      worked: bl(
        'Current Q(buy_gold)=5. Try selling instead and observe reward r=2 with the best next-state value maxₐ\'Q(s\',a\')=8: update Q(buy_gold) ← 5 + 0.1[2 + 0.9(8) − 5] = 5 + 0.1(4.2) = 5.42 — the scorecard nudges toward what was actually observed, not overwritten entirely.',
        'Q(s,a) ← Q(s,a) + α[r + γ·maxₐ\'Q(s\',a\') − Q(s,a)]; α is the learning rate (how much to trust the new observation), γ∈[0,1] discounts future reward, and the bracketed term is the "TD error" — the gap between the old estimate and the newly observed evidence.'
      ),
      faded: bl(
        'If the learning rate α were set to 0, would Q(buy_gold) ever update, no matter what reward is observed? Step 1 — plug α=0 into the update rule. Step 2 — answer: _____.',
        'If the learning rate α were set to 0, would Q(buy_gold) ever update, no matter what reward is observed? Step 1 — plug α=0 into the update rule. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: null,
      analogyBreakdown: blSame(
        "The video-game-player analogy breaks down on stakes: a game player can freely retry after a bad move with zero real-world cost. Q-Learning applied to real trading means every \"exploration\" move genuinely risks real money — which is exactly why the doc flags this family as unpredictable/unstable specifically in live deployment, unlike a sandbox game."
      ),
      caveat: blSame(
        'A real caveat: financial markets provide only one historical path that ever actually happened — unlike a video game that can be replayed millions of times, an RL trading agent can\'t genuinely explore "what if" alternate market histories, severely limiting how much real exploration is even possible.'
      ),
      retrieval: {
        question: blSame('Without looking back: why does the discount factor γ matter for how "far-sighted" the learned policy ends up being?'),
        answer: blSame(
          "γ scales how much future reward counts relative to immediate reward in the update rule. A γ near 0 makes the agent almost entirely short-sighted (only immediate reward matters); a γ near 1 makes distant future rewards count almost as much as immediate ones, encouraging genuinely long-term strategic behavior."
        ),
      },
    },
  },

  actorcritic: {
    spark: {
      analogy: bl(
        "Like a young performer (the actor) who directly decides what to do next, paired with a coach (the critic) watching from the side who scores how good that choice turned out — the performer gets better because the coach's feedback is faster and steadier than trial-and-error alone.",
        'Combines a parameterized policy (actor, updated via policy gradient) with a learned value function (critic) that reduces variance in the policy gradient estimate.'
      ),
      predict: {
        question: blSame('Compared to pure Q-Learning (which learns action values directly, one at a time), can Actor-Critic more naturally handle a continuous range of actions (like "how much gold to buy," any real number)?'),
        options: [blSame('Yes'), blSame('No, both handle continuous actions equally poorly')],
        correctIndex: 0,
      },
    },
    mechanism: {
      kind: 'widget',
      predict: { question: blSame('As the critic\'s value estimates become more accurate, does the variance (noisiness) of the actor\'s policy updates rise or fall?'), options: [blSame('Rises'), blSame('Falls')], correctIndex: 1 },
      paramLabel: blSame('Critic accuracy'),
      paramMin: 0, paramMax: 10, paramDefault: 0, paramStep: 1, paramDecimals: 0,
      compute: (v) => Math.max(3, 100 - v * 9),
      outputLabel: blSame('Toy variance of policy updates'),
      outputDecimals: 0,
    },
    formalism: {
      worked: bl(
        'The actor tries "buy 10 units," receiving raw reward +$50. Without a critic, that noisy +$50 alone drives the update. With a critic estimating this state was "worth" +$35 on average, the actor instead learns from the advantage +$50-$35=+$15 — a much less noisy, more informative signal about whether THIS SPECIFIC action beat expectations.',
        'Advantage A(s,a)=Q(s,a)-V(s)≈r+γV(s\')-V(s) (using the critic\'s V as a baseline); policy gradient ∇θJ(θ)≈𝔼[∇θlogπθ(a|s)·A(s,a)] has provably lower variance using the advantage than using raw reward, without introducing bias.'
      ),
      faded: bl(
        'If the critic\'s value estimate V(s) were always exactly equal to the raw reward r observed (a perfect, noiseless baseline), what would the advantage A=r-V(s) reduce to? Step 1 — plug V(s)=r into the advantage formula. Step 2 — answer: _____.',
        'If the critic\'s value estimate V(s) were always exactly equal to the raw reward r observed (a perfect, noiseless baseline), what would the advantage A=r-V(s) reduce to? Step 1 — plug V(s)=r into the advantage formula. Step 2 — answer: _____.'
      ),
    },
    criticalFrontier: {
      misconceptionId: 'userTrainedModel',
      analogyBreakdown: blSame(
        "The performer-and-coach analogy breaks down on independence: a real coach usually already knows the domain before watching the performer. The critic here starts out just as ignorant as the actor and has to learn its own value estimates from scratch, simultaneously — the two are learning together, not one already-expert critic guiding a novice actor."
      ),
      caveat: blSame(
        'A real caveat: because both the actor and critic are being learned simultaneously from the same noisy financial data, errors in one can propagate into the other — an early bad critic estimate can misdirect actor updates before the critic has had a chance to improve.'
      ),
      retrieval: {
        question: blSame('Without looking back: if you spent an afternoon adjusting the sliders in this app\'s Playground while reading about Actor-Critic, would that be training a real Actor-Critic trading agent?'),
        answer: blSame(
          "No — per this app's own entry banner, the Playground fits a small, local, disposable demo model to a synthetic dataset for that session only. It never trains, updates, or influences any shared Actor-Critic system, real or otherwise — a genuine reinforcement-learning trading agent would need its own dedicated training pipeline running for far longer than an afternoon."
        ),
      },
    },
  },
};
