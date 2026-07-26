// Python Hub content — ML families 8–10 (deep learning, Bayesian ML,
// reinforcement learning).
export const PY_ML_DEEP_BAYES_RL = [
  {
    id: 'rnn', group: 'fam8', name: 'RNN (vanilla)', formula: 'hₜ = tanh(W·xₜ + U·hₜ₋₁)',
    tags: ['deep learning', 'sequences', 'recurrent', 'neural network'],
    overview: "A neural network with a loop: each timestep's input updates a hidden state that carries memory forward. Conceptually the foundation of sequence deep learning — and practically superseded by LSTM/GRU because its gradients vanish over long sequences.",
    variables: [
      ['xₜ', 'input at timestep t'],
      ['hₜ', 'hidden state — the network’s running memory'],
      ['W, U', 'weights applied to current input and previous state'],
      ['vanishing gradient', 'why plain RNNs forget: repeated multiplication shrinks signals'],
    ],
    thinking: {
      workflow: [
        'Business problem: outcomes depend on the ORDER of events',
        'Reality check: do you have thousands+ of sequences? Deep nets are data-hungry',
        'Start with the simplest recurrent layer to establish the concept',
        'Observe: performance degrades as needed memory lengthens',
        'Decision: in practice jump to LSTM/GRU; vanilla RNN is the teaching step',
      ],
      when: [
        'Short sequences (≲20 steps) with ordering signal',
        'Learning/teaching how recurrence works before gated variants',
        'Tight parameter budgets on simple sequence tasks',
      ],
      notWhen: [
        'Long-range dependencies (vanishing gradients kill them)',
        'Small datasets — classical TS models will beat it',
        'Production sequence tasks (LSTM/GRU/Transformer dominate)',
      ],
      assumptions: [
        'Sequential dependence captured by a fixed-size hidden state',
        'Enough sequences to fit thousands of weights',
        'Stationary sequence dynamics between train and serving',
      ],
    },
    code: `# pip install torch
import torch
import torch.nn as nn
import numpy as np

# --- task: predict next value of a noisy sine from the last 12 steps -
rng = np.random.default_rng(0)
t = np.arange(3000)
series = np.sin(2 * np.pi * t / 50) + 0.1 * rng.standard_normal(len(t))

def make_windows(x, w):
    X = np.stack([x[i:i+w] for i in range(len(x) - w)])
    y = x[w:]
    return (torch.tensor(X, dtype=torch.float32).unsqueeze(-1),
            torch.tensor(y, dtype=torch.float32))

X, y = make_windows(series, w=12)
X_tr, y_tr, X_te, y_te = X[:2500], y[:2500], X[2500:], y[2500:]

class VanillaRNN(nn.Module):
    def __init__(self, hidden=32):
        super().__init__()
        self.rnn = nn.RNN(input_size=1, hidden_size=hidden, batch_first=True)
        self.head = nn.Linear(hidden, 1)
    def forward(self, x):
        out, _ = self.rnn(x)          # out: (batch, time, hidden)
        return self.head(out[:, -1]).squeeze(-1)   # last state -> prediction

model = VanillaRNN()
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

for epoch in range(30):
    opt.zero_grad()
    loss = loss_fn(model(X_tr), y_tr)
    loss.backward()
    # Gradient clipping: the standard defense against exploding gradients.
    nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step()

with torch.no_grad():
    test_mse = loss_fn(model(X_te), y_te).item()
print(f"test MSE: {test_mse:.4f}  (naive last-value MSE: "
      f"{np.mean((series[2512:] - series[2511:-1])**2):.4f})")`,
    scenario: {
      title: 'Clickstream next-action prediction (prototype)',
      problem: 'A product team prototypes whether the ORDER of a user’s last dozen actions predicts the next one better than a bag-of-actions model.',
      dataset: 'Millions of short session sequences of user events.',
      why: 'Short windows, huge sequence count, and an explicit "does order matter?" question — the vanilla RNN is the cleanest first test of that hypothesis.',
      output: 'Next-action accuracy vs an order-blind baseline.',
      interpretation: 'If recurrence beats the bag-of-actions baseline, order carries signal — justifying investment in LSTM/Transformer versions.',
      pitfalls: 'If sessions need long memory (30+ events), the vanilla RNN understates the potential — do not kill the idea on its result alone.',
    },
    mistakes: [
      'Using vanilla RNNs for long sequences and concluding "deep learning doesn’t work"',
      'No gradient clipping (exploding gradients ruin training silently)',
      'Skipping the naive last-value/majority baseline comparison',
      'Feeding unscaled inputs to a tanh-based network',
    ],
    tips: [
      'Treat it as the concept model; ship LSTM/GRU instead',
      'Always clip gradients on recurrent nets',
      'Batch sequences with similar lengths (or pad + mask) for efficiency',
      'A classical baseline (ARIMA / last-value) is mandatory context for any sequence net',
    ],
  },
  {
    id: 'lstm', group: 'fam8', name: 'LSTM / GRU', formula: 'gated memory: forget/input/output gates',
    tags: ['deep learning', 'sequences', 'memory', 'forecasting'],
    overview: "Recurrent networks with learned gates deciding what to remember, forget, and expose at each step — solving the vanishing-gradient problem that cripples vanilla RNNs. The default deep-learning choice for medium-length sequences: sensor streams, demand, text before Transformers.",
    variables: [
      ['forget gate', 'what fraction of old memory to keep'],
      ['input gate', 'how much of the new candidate to write'],
      ['output gate', 'what part of memory to expose as hₜ'],
      ['cell state', 'the protected long-term memory highway'],
    ],
    thinking: {
      workflow: [
        'Sequence problem with dependencies tens-to-hundreds of steps long',
        'Data audit: thousands of sequences (or one long series windowed)',
        'Baseline with classical TS (ETS/ARIMA) — the bar to beat',
        'Fit a 1–2 layer LSTM with early stopping; scale inputs',
        'Decision: keep only if it beats classical baselines out-of-sample',
      ],
      when: [
        'Multivariate sequences with nonlinear, longer-range structure',
        'Plenty of training sequences and a real accuracy premium',
        'Irregular patterns classical models cannot encode',
      ],
      notWhen: [
        'Short univariate series — SARIMA/ETS usually win with 1% of the effort',
        'Very long contexts (thousands of steps) — Transformers handle those better',
        'Interpretability requirements (gates are not explanations)',
      ],
      assumptions: [
        'Enough data to fit tens of thousands of weights honestly',
        'Sequence dynamics stationary enough to transfer to the future',
        'Inputs scaled; targets stationarized (difference/detrend) for best results',
      ],
    },
    code: `# pip install torch
import torch
import torch.nn as nn
import numpy as np

# --- multivariate energy-demand style series -------------------------
rng = np.random.default_rng(1)
n = 5000
t = np.arange(n)
temp = 15 + 10 * np.sin(2 * np.pi * t / 365) + rng.normal(0, 2, n)
dow = t % 7
demand = (100 + 0.5 * np.abs(temp - 18) ** 1.5      # nonlinear temp effect
          + 12 * (dow < 5) + rng.normal(0, 4, n))

feats = np.column_stack([demand, temp, (dow < 5).astype(float)])
mu, sd = feats.mean(0), feats.std(0)
feats = (feats - mu) / sd                       # scale everything

W = 28                                          # four weeks of context
X = np.stack([feats[i:i+W] for i in range(n - W)])
y = feats[W:, 0]                                # next-day demand (scaled)
X = torch.tensor(X, dtype=torch.float32)
y = torch.tensor(y, dtype=torch.float32)
split = int(0.85 * len(X))

class LSTMForecaster(nn.Module):
    def __init__(self, n_feats=3, hidden=64):
        super().__init__()
        self.lstm = nn.LSTM(n_feats, hidden, num_layers=2,
                            batch_first=True, dropout=0.2)
        self.head = nn.Linear(hidden, 1)
    def forward(self, x):
        out, _ = self.lstm(x)
        return self.head(out[:, -1]).squeeze(-1)

model = LSTMForecaster()
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()
best, patience = float("inf"), 0
for epoch in range(60):
    model.train(); opt.zero_grad()
    loss_fn(model(X[:split]), y[:split]).backward()
    nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step()
    model.eval()
    with torch.no_grad():
        val = loss_fn(model(X[split:]), y[split:]).item()
    if val < best - 1e-4: best, patience = val, 0   # early stopping
    else:
        patience += 1
        if patience >= 6: break
print(f"stopped epoch {epoch}, val MSE (scaled): {best:.4f}")
# Un-scale for business units:
print(f"approx MAE in units: {np.sqrt(best) * sd[0]:.1f}")`,
    scenario: {
      title: 'Electricity demand forecasting',
      problem: 'A utility forecasts next-day hourly demand where temperature effects are nonlinear (heating AND cooling) and interact with calendar patterns.',
      dataset: 'Years of hourly demand, temperature, humidity, and calendar features.',
      why: 'The |temp − 18|^1.5-style nonlinearity and multivariate interactions defeat linear SARIMA; LSTMs learn them directly from windows of raw features.',
      output: 'Next-day demand curve; MAE in MW versus the SARIMA baseline.',
      interpretation: 'Every MW of MAE saved reduces both spot-market purchases and spinning-reserve costs — the business case for the added complexity.',
      pitfalls: 'A mild-weather training year fails on an extreme summer — check performance on temperature extremes explicitly.',
    },
    mistakes: [
      'Skipping the classical baseline (LSTMs lose to SARIMA embarrassingly often)',
      'Forgetting to scale inputs (gates saturate, training stalls)',
      'Random shuffled splits on time data',
      'Judging by training loss — early-stop on validation, always',
    ],
    tips: [
      'GRU ≈ LSTM accuracy with fewer parameters — try both',
      '1–2 layers and 32–128 hidden units solve most business problems',
      'Predict CHANGES (differenced targets) when series trend strongly',
      'Dropout between layers + early stopping = the standard regularization pair',
    ],
  },
  {
    id: 'cnn', group: 'fam8', name: 'CNN (1D, for sequences)', formula: 'sliding learned filters + pooling',
    tags: ['deep learning', 'convolution', 'patterns', 'sequences'],
    overview: "Convolutional filters slide along a sequence detecting local motifs (spikes, ramps, oscillations) regardless of where they occur; stacked layers compose motifs into higher-level patterns. Fast to train (fully parallel, no recurrence) and excellent when signatures are local.",
    variables: [
      ['filter/kernel', 'a small learned template slid along the sequence'],
      ['kernel_size', 'how many timesteps one filter sees'],
      ['channels', 'number of distinct motif detectors per layer'],
      ['pooling', 'downsampling that grants position tolerance'],
    ],
    thinking: {
      workflow: [
        'Ask: is the signal in LOCAL shapes (a spike pattern, a waveform)?',
        'If yes, 1D-CNN; if long-range order matters more, RNN/Transformer',
        'Stack 2–4 conv layers with pooling; keep kernels small (3–7)',
        'Global pooling → classifier head; early stop on validation',
        'Inspect learned filters/activations for sanity',
      ],
      when: [
        'Waveform-like data: ECG, vibration, audio, network traffic',
        'Pattern location varies but shape is consistent',
        'Training speed matters (CNNs parallelize; recurrence does not)',
      ],
      notWhen: [
        'Dependencies span the whole sequence (attention/recurrence)',
        'Tabular data without local ordering (features have no neighborhood)',
        'Tiny datasets — classical features + GBM often win',
      ],
      assumptions: [
        'Translation invariance: the same motif means the same thing anywhere',
        'Signal decomposes into local patterns composable across layers',
      ],
    },
    code: `# pip install torch
import torch
import torch.nn as nn
import numpy as np

# --- ECG-style task: detect an abnormal spike motif anywhere ---------
rng = np.random.default_rng(3)
n, L = 4000, 128
X = 0.4 * rng.standard_normal((n, L))
y = rng.integers(0, 2, n)
motif = np.array([0, 1.5, 3.0, -2.0, -3.0, 1.0, 0.5])   # the "arrhythmia"
for i in np.where(y == 1)[0]:
    pos = rng.integers(0, L - len(motif))    # anywhere in the window
    X[i, pos:pos+len(motif)] += motif

X = torch.tensor(X, dtype=torch.float32).unsqueeze(1)   # (n, 1, L)
y = torch.tensor(y, dtype=torch.float32)
split = int(0.8 * n)

class Conv1DNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv1d(1, 16, kernel_size=7, padding=3), nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Conv1d(16, 32, kernel_size=5, padding=2), nn.ReLU(),
            nn.AdaptiveAvgPool1d(1),        # global pool: position-agnostic
        )
        self.head = nn.Linear(32, 1)
    def forward(self, x):
        return self.head(self.net(x).squeeze(-1)).squeeze(-1)

model = Conv1DNet()
opt = torch.optim.Adam(model.parameters(), lr=2e-3)
loss_fn = nn.BCEWithLogitsLoss()
for epoch in range(25):
    opt.zero_grad()
    loss_fn(model(X[:split]), y[:split]).backward()
    opt.step()

model.eval()
with torch.no_grad():
    acc = ((model(X[split:]) > 0) == y[split:].bool()).float().mean()
print(f"test accuracy: {acc:.3f}")
# The global pooling is why position never mattered: the filter fires
# wherever the motif occurs, pooling keeps only "did it fire".`,
    scenario: {
      title: 'ECG arrhythmia screening',
      problem: 'A wearable-health company screens heartbeat windows for arrhythmic patterns that can occur anywhere within a reading.',
      dataset: 'Hundreds of thousands of labeled fixed-length ECG segments.',
      why: 'The diagnostic signature is a local waveform shape at unpredictable positions — precisely the translation-invariant pattern matching convolutions provide.',
      output: 'Per-window abnormality probability streamed to review queues.',
      interpretation: 'Sensitivity/specificity trade-offs set the alert threshold; activations localize WHERE the trigger occurred for cardiologist review.',
      pitfalls: 'Training on one device’s sensor and deploying on another shifts the signal distribution — recalibrate per hardware.',
    },
    mistakes: [
      'Using 1D CNNs on unordered tabular columns',
      'Huge kernels (learn small motifs, compose depth-wise instead)',
      'Skipping global pooling and hard-coding position sensitivity',
      'No augmentation (shifts, noise) when data is modest',
    ],
    tips: [
      'Kernel size 3–7 with increasing channels is the standard recipe',
      'Dilated convolutions extend receptive fields cheaply (WaveNet-style)',
      'Grad-CAM-style activation maps localize what fired — free interpretability',
      'CNN + GRU hybrids capture local shape + longer context',
    ],
  },
  {
    id: 'transformer', group: 'fam8', name: 'Transformer / TFT', formula: 'attention(Q,K,V) over all timesteps',
    tags: ['deep learning', 'attention', 'sequences', 'foundation'],
    overview: "Replaces recurrence with attention: every position looks directly at every other and learns what to attend to, capturing arbitrary-range dependencies in parallel. The architecture behind modern AI; in forecasting, variants like the Temporal Fusion Transformer add interpretable attention over history and covariates.",
    variables: [
      ['Q, K, V', 'query/key/value projections — attention’s lookup machinery'],
      ['attention weight', 'how much position i draws from position j'],
      ['multi-head', 'several attention patterns learned in parallel'],
      ['positional encoding', 'injects order (attention itself is order-blind)'],
    ],
    thinking: {
      workflow: [
        'Long-range or multi-horizon sequence problem with LOTS of data',
        'Honestly benchmark: LSTM and classical baselines first',
        'Start small: 2 encoder layers, 4 heads — transformers overfit small data',
        'Use attention maps as the interpretability dividend',
        'Decision: at scale (many series, long context) they earn their cost',
      ],
      when: [
        'Long contexts where RNNs forget (hundreds+ of steps)',
        'Many related series to learn jointly (global forecasting)',
        'Attention-based explanations ("which past days drove this forecast?") are valuable',
      ],
      notWhen: [
        'Small datasets — the architecture’s capacity works against you',
        'Single short series (SARIMA/ETS remain the right tool)',
        'Hard latency/compute budgets at the edge',
      ],
      assumptions: [
        'Enough data to fit attention’s quadratic appetite',
        'Order information supplied via positional encodings',
        'Dependencies are learnable from co-occurrence in the training window',
      ],
    },
    code: `# pip install torch
import torch
import torch.nn as nn
import numpy as np

# --- toy multi-horizon forecasting with a small encoder --------------
rng = np.random.default_rng(5)
n, L, H = 3000, 60, 7           # 60-step history -> 7-step forecast
t = np.arange(n + L + H)
base = np.sin(2 * np.pi * t / 30) + 0.5 * np.sin(2 * np.pi * t / 7)
series = base + 0.15 * rng.standard_normal(len(t))

X = np.stack([series[i:i+L] for i in range(n)])
Y = np.stack([series[i+L:i+L+H] for i in range(n)])
X = torch.tensor(X, dtype=torch.float32).unsqueeze(-1)
Y = torch.tensor(Y, dtype=torch.float32)
split = int(0.85 * n)

class TinyTransformer(nn.Module):
    def __init__(self, d=32, heads=4, layers=2, horizon=H):
        super().__init__()
        self.embed = nn.Linear(1, d)
        self.pos = nn.Parameter(torch.randn(1, L, d) * 0.02)  # positions!
        enc = nn.TransformerEncoderLayer(d_model=d, nhead=heads,
                                         dim_feedforward=64,
                                         batch_first=True, dropout=0.1)
        self.encoder = nn.TransformerEncoder(enc, num_layers=layers)
        self.head = nn.Linear(d, horizon)
    def forward(self, x):
        z = self.encoder(self.embed(x) + self.pos)
        return self.head(z[:, -1])          # last token summarizes history

model = TinyTransformer()
opt = torch.optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()
for epoch in range(40):
    opt.zero_grad()
    loss_fn(model(X[:split]), Y[:split]).backward()
    opt.step()

model.eval()
with torch.no_grad():
    val = loss_fn(model(X[split:]), Y[split:]).item()
naive = float(((Y[split:] - X[split:, -1]) ** 2).mean())
print(f"7-step MSE: {val:.4f}   naive persist: {naive:.4f}")
# For production forecasting see pytorch-forecasting's Temporal Fusion
# Transformer: adds gating, static covariates, quantile outputs, and
# interpretable attention out of the box.`,
    scenario: {
      title: 'Retail demand: thousands of SKUs, one global model',
      problem: 'A retailer forecasts 8-week demand for 20,000 SKUs, wanting one model that transfers patterns across products and explains its focus.',
      dataset: 'Multi-year daily sales per SKU with prices, promos, holidays, and static product attributes.',
      why: 'Global training across related series is where transformers (TFT) shine; attention maps show which past weeks and covariates drove each forecast — interpretability SARIMA-per-SKU cannot give at this scale.',
      output: 'Quantile forecasts per SKU-week plus attention-based importance summaries.',
      interpretation: 'P10/P50/P90 quantiles feed safety-stock optimization directly; attention summaries justify forecasts in S&OP reviews.',
      pitfalls: 'New SKUs with no history need cold-start handling via static attributes — verify that path explicitly.',
    },
    mistakes: [
      'Throwing a transformer at one small series',
      'Forgetting positional encodings (attention is order-blind without them)',
      'Skipping LSTM/classical baselines — transformers do not always win in TS',
      'Training instability from too-high learning rates (warmup helps)',
    ],
    tips: [
      'pytorch-forecasting’s TFT is the practical route for tabular TS',
      'Small models first: 2 layers, 4 heads is plenty to prove value',
      'Quantile loss outputs are more useful to ops than point forecasts',
      'Cache attention weights — they are the explanation artifact reviewers want',
    ],
  },
  {
    id: 'gp', group: 'fam9', name: 'Gaussian Processes', formula: 'f ~ GP(m(x), k(x,x′))',
    tags: ['bayesian', 'uncertainty', 'kernel', 'nonparametric'],
    overview: "Instead of fitting one function, place a probability distribution over ALL plausible functions consistent with the data — defined by a kernel encoding smoothness beliefs. Predictions come with exact, honest uncertainty: tight near data, wide in unexplored regions. The engine of Bayesian optimization.",
    variables: [
      ['m(x)', 'prior mean function (often zero)'],
      ['k(x,x′)', 'kernel — how correlated outputs are for nearby inputs'],
      ['length scale', 'kernel knob: how far influence extends'],
      ['posterior variance', 'the honest per-point uncertainty band'],
    ],
    thinking: {
      workflow: [
        'Small, expensive data? Uncertainty needed per prediction? GP territory',
        'Encode beliefs in the kernel: smooth (RBF), periodic, trends, sums',
        'Fit hyperparameters by maximizing marginal likelihood',
        'Read BOTH outputs: mean prediction AND variance band',
        'Use variance to decide where to sample next (active learning / BayesOpt)',
      ],
      when: [
        'Few, costly observations (experiments, simulations, drilling)',
        'Uncertainty must drive decisions — where to explore next',
        'Smoothness assumptions are defensible',
      ],
      notWhen: [
        'Large n (exact GPs scale O(n³); ~10k points is the practical wall)',
        'High-dimensional inputs (>~20 dims strains standard kernels)',
        'Discontinuous, jumpy functions that violate smoothness priors',
      ],
      assumptions: [
        'Function draws are jointly Gaussian under the chosen kernel',
        'The kernel family matches reality (smoothness/periodicity)',
        'Noise level either known or learned as a hyperparameter',
      ],
    },
    code: `import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, WhiteKernel, ConstantKernel

# --- 8 expensive experiments; where should experiment 9 go? ----------
rng = np.random.default_rng(7)
def true_yield(temp):                      # unknown in real life
    return 60 + 25 * np.exp(-0.5 * ((temp - 78) / 6) ** 2)

X_obs = np.array([[55.], [62.], [68.], [72.], [85.], [90.], [96.], [100.]])
y_obs = true_yield(X_obs.ravel()) + rng.normal(0, 0.8, len(X_obs))

kernel = (ConstantKernel(10.0) * RBF(length_scale=8.0)
          + WhiteKernel(noise_level=0.5))
gp = GaussianProcessRegressor(kernel=kernel, normalize_y=True,
                              n_restarts_optimizer=8, random_state=0)
gp.fit(X_obs, y_obs)
print("learned kernel:", gp.kernel_)

# Posterior mean AND uncertainty across the design space:
X_grid = np.linspace(50, 105, 200)[:, None]
mu, sd = gp.predict(X_grid, return_std=True)

# Bayesian-optimization move: Upper Confidence Bound acquisition —
# balance promising mean vs unexplored uncertainty.
ucb = mu + 1.5 * sd
next_temp = X_grid[np.argmax(ucb), 0]
print(f"predicted optimum so far: {X_grid[np.argmax(mu),0]:.1f}C "
      f"(mean {mu.max():.1f})")
print(f"next experiment (UCB)   : {next_temp:.1f}C "
      f"(sd there {sd[np.argmax(ucb)]:.2f})")
# Note the gap 72-85C: sparse data -> wide band -> UCB explores it.`,
    scenario: {
      title: 'Chemical process yield optimization',
      problem: 'Each pilot-plant run costs $30k; the team must find the yield-maximizing temperature in as few runs as possible.',
      dataset: 'Eight (temperature, yield) pairs so far.',
      why: 'With data this scarce and expensive, the uncertainty estimate is as valuable as the prediction — the GP’s posterior variance tells you exactly where another $30k buys the most information.',
      output: 'Yield curve with credible band; UCB-selected next experiment.',
      interpretation: '"Best known setting 78°C, but the 74–84°C gap is underexplored — run 9 goes there" is a defensible, quantified decision.',
      pitfalls: 'A poorly-chosen kernel bakes in wrong smoothness beliefs; check the learned length scale is physically plausible.',
    },
    mistakes: [
      'Using exact GPs on 100k points (use sparse/inducing-point approximations)',
      'Ignoring the variance output — it is half the model',
      'Forgetting the WhiteKernel noise term on noisy measurements',
      'Trusting a single kernel-fit restart (multi-restart the optimizer)',
    ],
    tips: [
      'Kernel composition is modeling: RBF + Periodic + Linear for seasonal-plus-trend',
      'normalize_y=True saves mean-function headaches',
      'This is the engine of Bayesian optimization (hyperparameter tuning included)',
      'Report predictions as bands, not lines — that is the product',
    ],
  },
  {
    id: 'bstsbnn', group: 'fam9', name: 'Bayesian Structural TS / Bayesian NNs', formula: 'posterior over states / weights',
    tags: ['bayesian', 'uncertainty', 'state space', 'time series'],
    overview: "Two flavors of the same philosophy: never commit to one parameter value, maintain a posterior distribution updated by data. BSTS decomposes a series into interpretable latent states (trend, seasonality, regressors) with uncertainty on each; Bayesian NNs put distributions over network weights so predictions carry calibrated error bars.",
    variables: [
      ['prior', 'beliefs before data (e.g., how fast trend can drift)'],
      ['latent state', 'BSTS: unobserved trend/seasonal components inferred over time'],
      ['posterior', 'updated distribution after seeing data'],
      ['credible interval', '"95% probability the value lies here" — the Bayesian statement'],
    ],
    thinking: {
      workflow: [
        'Does the decision need "how sure are we?" as much as the estimate?',
        'Structured series → BSTS (interpretable components + spike-slab regression)',
        'Deep model + uncertainty → BNN approximations (MC dropout as the entry point)',
        'Validate calibration: do 90% intervals cover ~90% of outcomes?',
        'Decision: report distributions, not points, to downstream consumers',
      ],
      when: [
        'Uncertainty drives the decision (inventory buffers, causal impact, risk)',
        'Small/medium data where priors add stability',
        'Causal-impact style questions ("what would sales have been without the campaign?")',
      ],
      notWhen: [
        'Huge datasets where the posterior collapses to the MLE anyway',
        'Latency-critical scoring (sampling costs multiply inference)',
        'Teams that will ignore the intervals regardless',
      ],
      assumptions: [
        'Priors are honestly chosen (and sensitivity-checked)',
        'The structural decomposition (BSTS) matches the series',
        'Approximate inference (VI/MC dropout) is close enough to the true posterior',
      ],
    },
    code: `import numpy as np
import torch
import torch.nn as nn

# --- Bayesian uncertainty via MC Dropout: the practical BNN entry ----
# Dropout kept ON at inference approximates sampling network weights
# from a posterior (Gal & Ghahramani 2016).
rng = np.random.default_rng(0)
X = np.sort(rng.uniform(-3, 3, 120))[:, None]
y = np.sin(X.ravel()) + 0.1 * rng.standard_normal(len(X))
Xt = torch.tensor(X, dtype=torch.float32)
yt = torch.tensor(y, dtype=torch.float32)

net = nn.Sequential(
    nn.Linear(1, 64), nn.ReLU(), nn.Dropout(0.1),
    nn.Linear(64, 64), nn.ReLU(), nn.Dropout(0.1),
    nn.Linear(64, 1),
)
opt = torch.optim.Adam(net.parameters(), lr=1e-2)
for epoch in range(400):
    opt.zero_grad()
    nn.functional.mse_loss(net(Xt).squeeze(-1), yt).backward()
    opt.step()

# Inference: keep dropout active, sample many stochastic forward passes.
net.train()                       # <- deliberately NOT eval()
X_test = torch.linspace(-4.5, 4.5, 7)[:, None]
with torch.no_grad():
    samples = torch.stack([net(X_test).squeeze(-1) for _ in range(300)])
mu, sd = samples.mean(0), samples.std(0)
for x, m, s in zip(X_test.ravel(), mu, sd):
    band = "INSIDE data" if abs(x) <= 3 else "EXTRAPOLATING"
    print(f"x={x:5.1f}  pred={m:6.2f} +/- {1.96*s:4.2f}   ({band})")
# The +/- widens sharply beyond |x|=3 — the network admits ignorance
# outside its training range. A point-estimate net would not.

# For BSTS-style decomposable Bayesian time series in Python, see
# orbit-ml (Uber) or PyMC state-space models: trend/seasonal posteriors
# plus spike-and-slab regressor selection, per-component intervals.`,
    scenario: {
      title: 'Marketing causal impact with honest error bars',
      problem: 'Did a 6-week TV campaign lift sales, and by how much — with uncertainty the CFO can act on?',
      dataset: 'Weekly sales pre/post campaign plus control-market regressors.',
      why: 'BSTS builds the counterfactual ("sales without the campaign") as a posterior, so the lift estimate arrives as a distribution: "lift $1.2M, 95% credible interval [$0.4M, $2.0M]".',
      output: 'Counterfactual band vs actuals; posterior of cumulative lift.',
      interpretation: 'If the interval excludes zero, the campaign worked; its width tells you whether to trust the point estimate enough to double the budget.',
      pitfalls: 'Control markets contaminated by the campaign invalidate the counterfactual — verify no spillover.',
    },
    mistakes: [
      'Reporting the posterior mean and hiding the interval',
      'Using eval() mode with MC dropout (kills the sampling)',
      'Never checking interval calibration against realized outcomes',
      'Priors chosen to flatter the desired conclusion',
    ],
    tips: [
      'MC dropout is the one-day path to uncertainty on an existing network',
      'orbit-ml / PyMC give BSTS with readable component posteriors',
      'Calibration plot (nominal vs empirical coverage) is the acceptance test',
      'Bayesian methods shine most exactly where data is scarce and stakes are high',
    ],
  },
  {
    id: 'qlearning', group: 'fam10', name: 'Q-Learning', formula: 'Q(s,a) ← Q + α[r + γ·maxQ(s′) − Q]',
    tags: ['reinforcement learning', 'value-based', 'sequential decisions'],
    overview: "Learns the long-term value of taking each action in each state by trial, error, and bootstrapped updates — no model of the environment needed. Converges to optimal policies for small state spaces; conceptually the foundation under DQN and modern value-based RL.",
    variables: [
      ['Q(s,a)', 'expected discounted future reward of action a in state s'],
      ['α', 'learning rate of the update'],
      ['γ', 'discount factor — how much the future matters'],
      ['ε-greedy', 'exploration: act randomly with probability ε'],
    ],
    thinking: {
      workflow: [
        'Is the problem SEQUENTIAL — actions change future states, reward is delayed?',
        'Define states, actions, rewards honestly (reward design is the hard part)',
        'Small discrete spaces → tabular Q-learning; else function approximation',
        'Train with decaying exploration; evaluate the GREEDY policy separately',
        'Decision: simulate-first; deploy carefully behind guardrails',
      ],
      when: [
        'Sequential decisions with delayed consequences (inventory, bidding, routing)',
        'A simulator or safe sandbox exists for trial-and-error',
        'State/action spaces are modest or discretizable',
      ],
      notWhen: [
        'One-shot predictions (supervised learning, not RL)',
        'No simulator and real-world mistakes are expensive',
        'Enormous continuous spaces without deep function approximation',
      ],
      assumptions: [
        'Markov property: state summarizes what matters for the future',
        'Enough exploration to visit relevant state-actions',
        'Stationary environment dynamics during learning',
      ],
    },
    code: `import numpy as np

# --- inventory control as a tiny MDP --------------------------------
# State: units on hand (0..10). Action: order 0..5 units.
# Demand ~ Poisson(3). Reward: sales revenue - order cost - holding cost.
rng = np.random.default_rng(0)
N_S, N_A = 11, 6
PRICE, COST, HOLD = 10, 6, 0.5

def step(stock, order):
    stock = min(stock + order, N_S - 1)
    demand = rng.poisson(3)
    sold = min(stock, demand)
    new_stock = stock - sold
    reward = PRICE * sold - COST * order - HOLD * new_stock
    return new_stock, reward

Q = np.zeros((N_S, N_A))
alpha, gamma = 0.1, 0.95
eps = 1.0
state = 5
for t in range(200_000):
    # epsilon-greedy exploration, decayed over time:
    if rng.uniform() < eps:
        action = rng.integers(N_A)
    else:
        action = int(np.argmax(Q[state]))
    nxt, r = step(state, action)
    # The Q-learning update: bootstrap toward reward + best future value.
    Q[state, action] += alpha * (r + gamma * Q[nxt].max() - Q[state, action])
    state = nxt
    eps = max(0.02, eps * 0.99997)

policy = Q.argmax(axis=1)
print("stock level :", list(range(N_S)))
print("order (units):", policy.tolist())
# Expect a base-stock pattern: order more when low, nothing when full.

# Evaluate the learned policy greedily:
total, state = 0.0, 5
for t in range(10_000):
    state, r = step(state, int(policy[state]))
    total += r
print(f"avg reward/step under learned policy: {total/10_000:.2f}")`,
    scenario: {
      title: 'Inventory reorder policy',
      problem: 'A warehouse must decide daily how much to reorder, balancing stockout losses against holding and order costs under random demand.',
      dataset: 'A demand simulator calibrated to historical order data.',
      why: 'The decision is sequential (today’s order shapes tomorrow’s stock) with delayed rewards — supervised learning cannot represent it; Q-learning learns the reorder policy directly.',
      output: 'An order-quantity policy per stock level, evaluated in simulation.',
      interpretation: 'The learned base-stock pattern is auditable: compare it to the (s, S) policies ops already understands.',
      pitfalls: 'A simulator that understates demand variance produces a policy that stocks out in reality — validate the simulator first.',
    },
    mistakes: [
      'Reward functions that reward the wrong thing (the classic RL failure)',
      'No exploration decay (never converges) or none at all (never discovers)',
      'Evaluating with exploration ON — judge the greedy policy',
      'Deploying a sim-trained policy without off-policy sanity checks',
    ],
    tips: [
      'Start tabular on a simplified problem; scale to DQN only if state space forces it',
      'Log Q-value convergence and policy stability, not just reward',
      'Compare the learned policy to the ops team’s heuristic — it should make sense',
      'Reward design deserves more review time than the algorithm',
    ],
  },
  {
    id: 'actorcritic', group: 'fam10', name: 'Actor-Critic', formula: 'actor πθ(a|s) + critic V(s)',
    tags: ['reinforcement learning', 'policy gradient', 'continuous actions'],
    overview: "Two networks learning together: the actor proposes a policy (which action to take), the critic estimates state values and tells the actor how much better-than-expected each outcome was (the advantage). Lower variance than pure policy gradients, handles continuous actions natively — the backbone of PPO/A2C used in practice.",
    variables: [
      ['πθ(a|s)', 'actor — a parameterized (often stochastic) policy'],
      ['V(s)', 'critic — expected return from state s'],
      ['advantage', 'r + γV(s′) − V(s): how much better than expected this turned out'],
      ['entropy bonus', 'keeps the policy exploratory during training'],
    ],
    thinking: {
      workflow: [
        'Sequential control with CONTINUOUS or large action spaces?',
        'Wrap the environment in a Gym-style interface',
        'Reach for PPO (the robust industrial actor-critic) before hand-rolling',
        'Track: episode reward, value loss, entropy — instability shows there first',
        'Validate in simulation extensively; deploy with fallback controllers',
      ],
      when: [
        'Continuous action problems: pricing levels, energy dispatch, robotics',
        'Long horizons where value bootstrapping stabilizes learning',
        'You can afford millions of simulated interactions',
      ],
      notWhen: [
        'Tiny discrete problems (tabular Q-learning is simpler and exact)',
        'No reliable simulator (on-policy methods are data-hungry)',
        'Hard safety constraints without a constrained-RL framework',
      ],
      assumptions: [
        'Markov states, well-shaped rewards',
        'Simulator fidelity — the policy is only as good as the world it trained in',
        'Careful hyperparameters (RL is notoriously seed-sensitive)',
      ],
    },
    code: `# pip install torch gymnasium
import torch
import torch.nn as nn
import numpy as np
import gymnasium as gym

# --- minimal A2C on CartPole (the concept, compact) ------------------
env = gym.make("CartPole-v1")
obs_dim = env.observation_space.shape[0]
n_act = env.action_space.n

class ActorCritic(nn.Module):
    def __init__(self, hidden=128):
        super().__init__()
        self.body = nn.Sequential(nn.Linear(obs_dim, hidden), nn.Tanh())
        self.actor = nn.Linear(hidden, n_act)     # policy logits
        self.critic = nn.Linear(hidden, 1)        # state value
    def forward(self, x):
        z = self.body(x)
        return self.actor(z), self.critic(z).squeeze(-1)

model = ActorCritic()
opt = torch.optim.Adam(model.parameters(), lr=3e-3)
gamma = 0.99

for episode in range(400):
    obs, _ = env.reset(seed=episode)
    log_probs, values, rewards = [], [], []
    done = False
    while not done:
        x = torch.tensor(obs, dtype=torch.float32)
        logits, v = model(x)
        dist = torch.distributions.Categorical(logits=logits)
        a = dist.sample()
        obs, r, term, trunc, _ = env.step(int(a))
        done = term or trunc
        log_probs.append(dist.log_prob(a)); values.append(v); rewards.append(r)

    # Discounted returns, then ADVANTAGE = return - critic's estimate:
    R, returns = 0.0, []
    for r in reversed(rewards):
        R = r + gamma * R
        returns.insert(0, R)
    returns = torch.tensor(returns)
    values = torch.stack(values)
    adv = returns - values.detach()

    actor_loss = -(torch.stack(log_probs) * adv).mean()
    critic_loss = nn.functional.mse_loss(values, returns)
    loss = actor_loss + 0.5 * critic_loss
    opt.zero_grad(); loss.backward(); opt.step()

    if episode % 100 == 99:
        print(f"episode {episode+1}: return = {sum(rewards):.0f}")
# Production note: use Stable-Baselines3 PPO — same idea, battle-tested:
#   from stable_baselines3 import PPO; PPO("MlpPolicy", env).learn(100_000)`,
    scenario: {
      title: 'Dynamic pricing agent',
      problem: 'A ride-hailing platform adjusts a continuous surge multiplier to balance rider demand, driver supply, and long-run retention — decisions whose effects unfold over hours.',
      dataset: 'A calibrated marketplace simulator; states = supply/demand/time features, action = price multiplier, reward = completed-trip margin minus churn penalty.',
      why: 'Continuous action, delayed consequences (aggressive surge earns now, churns later): actor-critic optimizes the long-run objective where myopic rules and bandits cannot.',
      output: 'A pricing policy validated against historical heuristics in simulation.',
      interpretation: 'Simulated uplift vs the rule-based pricer, plus stress tests in extreme supply shocks, gate the staged rollout.',
      pitfalls: 'The policy exploits any simulator bug ruthlessly — red-team the simulator before trusting the agent.',
    },
    mistakes: [
      'Hand-rolling PPO for production instead of using Stable-Baselines3',
      'Ignoring seed variance — report across ≥5 seeds',
      'Letting entropy collapse early (premature deterministic policies)',
      'Deploying without guardrails/fallback to the previous controller',
    ],
    tips: [
      'Stable-Baselines3 PPO is the sane default for real projects',
      'Normalize observations and rewards — RL stability doubles',
      'Monitor entropy: falling too fast predicts converging to a bad rut',
      'Invest in simulator fidelity before algorithm sophistication',
    ],
  },
];
