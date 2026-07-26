// Python Hub content — Stats Ch 4 (probability) and Ch 5 (discrete
// distributions). Ids mirror src/data/nodes.js.
export const PY_STATS_PROBABILITY = [
  {
    id: 'class_p', group: 'ch4', name: 'Classical Probability', formula: 'P(E) = n(E)/n(S)',
    tags: ['probability', 'equally likely', 'theoretical'],
    overview: "Probability when all outcomes are equally likely: favorable outcomes over total outcomes. Dice, cards, lotteries, random assignment — anywhere symmetry justifies 'equally likely', this is exact with zero data required.",
    variables: [['n(E)', 'number of outcomes in the event'], ['n(S)', 'size of the sample space'], ['P(E)', 'the event’s probability, 0 to 1']],
    thinking: {
      workflow: ['Can every elementary outcome honestly be called equally likely?', 'Count the sample space (counting rules help)', 'Count favorable outcomes', 'Divide — and sanity-check with a quick simulation'],
      when: ['Games of chance, random draws, randomized assignment', 'Baseline "if it were pure chance" calculations'],
      notWhen: ['Outcomes aren’t symmetric (real-world events, loaded processes)', 'Probabilities must come from data (that is empirical probability)'],
      assumptions: ['Equally likely outcomes — the entire load-bearing assumption', 'A completely enumerated sample space'],
    },
    code: `from math import comb
import numpy as np

# --- P(exactly one pair in a 5-card poker hand)? ---------------------
total_hands = comb(52, 5)                    # n(S)
pair_hands = (comb(13, 1) * comb(4, 2)       # choose rank + 2 suits
              * comb(12, 3) * 4 ** 3)        # 3 other ranks, any suits
p_pair = pair_hands / total_hands
print(f"P(one pair) = {pair_hands:,} / {total_hands:,} = {p_pair:.4f}")

# Sanity-check by simulation - classical answers should match:
rng = np.random.default_rng(0)
deck = np.arange(52)
hits = 0
trials = 200_000
for _ in range(trials):
    hand = rng.choice(deck, 5, replace=False) % 13     # ranks only
    counts = np.bincount(hand, minlength=13)
    if sorted(counts[counts > 0], reverse=True)[:2] == [2, 1]:
        hits += 1
print(f"simulated    = {hits/trials:.4f}   (theory {p_pair:.4f})")`,
    scenario: {
      title: 'Auditing a prize-draw promotion',
      problem: 'Legal must verify the advertised odds of a "pick 3 winners from 500 entrants" promotion before publication.',
      dataset: 'None needed — the mechanism defines the probabilities.',
      why: 'A fair random draw is exactly the equally-likely regime; counting gives exact, defensible odds.',
      output: 'Exact win probabilities per entrant.',
      interpretation: '3/500 = 0.6% per entrant — printed on the terms, provable in court.',
      pitfalls: 'If the draw mechanism is biased (early entries favored), the classical model is void.',
    },
    mistakes: ['Assuming equal likelihood where it doesn’t hold', 'Miscounting the sample space (order vs no order)', 'Confusing outcomes with events'],
    tips: ['math.comb/perm make counting exact', 'A 20-line simulation catches most counting errors', 'If symmetry is debatable, switch to empirical probability'],
  },
  {
    id: 'emp_p', group: 'ch4', name: 'Empirical Probability', formula: 'P(E) = f/n',
    tags: ['probability', 'frequency', 'data-driven'],
    overview: "Probability estimated from observed frequency: how often the event actually happened over how many chances it had. The Law of Large Numbers guarantees it converges to the truth as n grows — this is where probability meets data.",
    variables: [['f', 'times the event occurred'], ['n', 'number of trials/opportunities'], ['P(E)', 'the estimated probability']],
    thinking: {
      workflow: ['No symmetry to lean on? Count outcomes from data', 'Divide occurrences by opportunities', 'Attach uncertainty (a proportion CI) for small n', 'More data → tighter estimate (LLN)'],
      when: ['Real-world rates: defects, churn, click-through, conversions', 'Any probability the mechanism can’t supply theoretically'],
      notWhen: ['The past process differs from the future one (drift breaks it)', 'n is tiny — the estimate is noise without an interval'],
      assumptions: ['Trials are comparable (same process) and roughly independent', 'The process is stable over the estimation window'],
    },
    code: `import numpy as np

rng = np.random.default_rng(1)

# --- true (unknown) conversion rate is 3.2% --------------------------
TRUE_P = 0.032
visits = rng.uniform(size=100_000) < TRUE_P

# Empirical probability sharpens as n grows (Law of Large Numbers):
for n in [100, 1_000, 10_000, 100_000]:
    f = visits[:n].sum()
    print(f"n={n:6d}: f={f:5d}  P-hat = {f/n:.4f}")

# Small-n honesty: attach a confidence interval
from statsmodels.stats.proportion import proportion_confint
f, n = visits[:1000].sum(), 1000
lo, hi = proportion_confint(f, n, method="wilson")
print(f"n=1000 estimate {f/n:.3f}, 95% CI ({lo:.3f}, {hi:.3f})")
# The CI shows how little a small sample really pins down.`,
    scenario: {
      title: 'Marketing conversion rate estimation',
      problem: 'A growth team estimates the probability a visitor converts, to feed revenue projections.',
      dataset: 'Site logs: conversions f out of visits n.',
      why: 'No theory dictates conversion odds — only observed frequency can, and the LLN says enough traffic makes it accurate.',
      output: 'P̂ with a Wilson interval.',
      interpretation: '"3.1% [2.8%, 3.4%]" — projections should be run at all three numbers, not just the center.',
      pitfalls: 'Last week’s rate assumes next week’s visitors behave the same — campaigns and seasonality break that quietly.',
    },
    mistakes: ['Reporting small-n rates without intervals', 'Pooling trials from different regimes (mobile+desktop, pre+post campaign)', 'Treating the estimate as the true fixed probability'],
    tips: ['Wilson intervals behave well even at small n / extreme p', 'Plot the running estimate — convergence (or drift) becomes visible', 'Segment before you pool; Simpson’s paradox lives here'],
  },
  {
    id: 'add1', group: 'ch4', name: 'Addition Rule 1', formula: 'P(A or B) = P(A) + P(B)',
    tags: ['probability', 'mutually exclusive', 'union'],
    overview: "For events that CANNOT co-occur, the probability that either happens is just the sum. The 'or' rule in its clean special case — valid only when the overlap is exactly zero.",
    variables: [['A, B', 'mutually exclusive events (no shared outcomes)'], ['P(A or B)', 'probability at least one occurs']],
    thinking: {
      workflow: ['Check exclusivity FIRST: can A and B both happen?', 'If truly impossible together → add', 'If any overlap exists → use Rule 2 (subtract the overlap)', 'Sanity: the sum must not exceed 1'],
      when: ['Categories of one outcome variable (a die shows 2 OR 5)', 'Disjoint customer states (churned OR upgraded, if defined exclusively)'],
      notWhen: ['Events that can co-occur (rain OR wind) — overlap must be subtracted', 'Events on different trials (that is multiplication territory)'],
      assumptions: ['A ∩ B = ∅, verified from definitions rather than hoped'],
    },
    code: `import numpy as np

# --- one order's payment method: exclusive by construction ------------
p = {"card": 0.61, "cash": 0.22, "wallet": 0.13, "bank": 0.04}
print(f"P(cash or wallet) = {p['cash'] + p['wallet']:.2f}")
print(f"all categories sum to {sum(p.values()):.2f}  (a partition)")

# --- simulation contrast: exclusive vs overlapping -------------------
rng = np.random.default_rng(2)
n = 200_000
method = rng.choice(list(p), p=list(p.values()), size=n)
sim = np.mean((method == "cash") | (method == "wallet"))
print(f"simulated exclusive 'or' = {sim:.3f}  (plain sum works)")

# Now two NON-exclusive events - plain addition overcounts:
a = rng.uniform(size=n) < 0.30           # customer uses the app
b = rng.uniform(size=n) < 0.40           # customer visits a store
both_possible = np.mean(a | b)
print(f"overlapping: true P(A or B) = {both_possible:.3f} "
      f"vs naive sum {0.30 + 0.40:.2f}  <- overcounted the overlap")`,
    scenario: {
      title: 'Support ticket routing categories',
      problem: 'Ops reports the share of tickets that are either billing or shipping issues.',
      dataset: 'Ticket counts by single-assigned category.',
      why: 'One category per ticket makes the events exclusive by design, so the shares simply add.',
      output: 'P(billing or shipping) as a clean sum.',
      interpretation: '"35% of volume is billing-or-shipping" sizes the specialist team directly.',
      pitfalls: 'If tickets can carry two tags, the design broke exclusivity and Rule 2 applies.',
    },
    mistakes: ['Adding probabilities of events that can co-occur', 'Sums exceeding 1 and going unnoticed', 'Confusing exclusivity (same trial) with independence (a different concept entirely)'],
    tips: ['Ask "can both happen at once?" — the only gate that matters', 'Exclusive-and-exhaustive categories sum to exactly 1: a free audit', 'When unsure, use Rule 2 — it degrades gracefully to Rule 1 when overlap is 0'],
  },
  {
    id: 'add2', group: 'ch4', name: 'Addition Rule 2', formula: 'P(A or B) = P(A)+P(B)−P(A and B)',
    tags: ['probability', 'union', 'overlap', 'inclusion-exclusion'],
    overview: "The general 'or' rule: add the two probabilities, then subtract the overlap you double-counted. Inclusion–exclusion in its two-event form — the version that works whether or not events can co-occur.",
    variables: [['P(A and B)', 'probability both happen — the double-counted piece'], ['P(A or B)', 'probability of at least one']],
    thinking: {
      workflow: ['Compute or estimate P(A), P(B), and the joint P(A and B)', 'Add the marginals, subtract the joint', 'Cross-check with a contingency table (cells make overlap obvious)', 'Sanity: result between max(P(A),P(B)) and min(1, P(A)+P(B))'],
      when: ['Any union of possibly-overlapping events', 'Campaign reach questions ("saw ad A or ad B")'],
      notWhen: ['You lack the joint probability and can’t estimate it (independence is an assumption, not a default)'],
      assumptions: ['The joint probability is measured or correctly modeled — the rule itself is assumption-free'],
    },
    code: `import numpy as np
import pandas as pd

# --- campaign reach: email opens vs social impressions ---------------
rng = np.random.default_rng(3)
n = 50_000
email = rng.uniform(size=n) < 0.42
# social overlaps with email (engaged users do both):
social = rng.uniform(size=n) < np.where(email, 0.55, 0.25)

pA, pB = email.mean(), social.mean()
pAB = (email & social).mean()
reach = pA + pB - pAB
print(f"P(email)={pA:.3f}  P(social)={pB:.3f}  P(both)={pAB:.3f}")
print(f"reach = {pA:.3f}+{pB:.3f}-{pAB:.3f} = {reach:.3f}")
print(f"direct check: {np.mean(email | social):.3f}")

# The contingency table view - overlap sits in one visible cell:
tbl = pd.crosstab(email, social, normalize=True).round(3)
print(tbl)
# Naive addition would claim {:.3f} - overcounting engaged users once.
print(f"naive sum would say {pA + pB:.3f} (impossible if > 1!)")`,
    scenario: {
      title: 'Marketing campaign reach measurement',
      problem: 'The CMO asks what fraction of customers saw AT LEAST ONE of two campaigns.',
      dataset: 'Exposure logs per customer for email and social.',
      why: 'Engaged customers see both — naive addition counts them twice; subtracting the measured overlap fixes it exactly.',
      output: 'Deduplicated reach with the overlap made explicit.',
      interpretation: '"58% reach, of which 19 points saw both" also quantifies channel redundancy for budget talks.',
      pitfalls: 'Estimating the overlap by assuming independence (P(A)·P(B)) understates it when channels target the same segment.',
    },
    mistakes: ['Forgetting to subtract the joint', 'Assuming independence to fabricate the joint term', 'Reach figures above 100% shipped to slides'],
    tips: ['Build the 2×2 table first; the formula reads off it', 'For 3+ events, inclusion–exclusion alternates signs — or just simulate', 'Overlap itself is a KPI (channel cannibalization)'],
  },
  {
    id: 'mult1', group: 'ch4', name: 'Multiplication Rule 1', formula: 'P(A and B) = P(A)·P(B)',
    tags: ['probability', 'independence', 'joint'],
    overview: "For INDEPENDENT events, the probability both happen is the product. The rule behind '0.9⁵ uptime', combined defect rates, and parlay odds — and the most abused rule in statistics, because independence is assumed far more often than it holds.",
    variables: [['A, B', 'events where one occurring tells you nothing about the other'], ['P(A and B)', 'joint probability under independence']],
    thinking: {
      workflow: ['Interrogate independence: does knowing A change the odds of B?', 'If genuinely unrelated mechanisms → multiply', 'If related (shared cause, same person, same system) → Rule 2 with conditionals', 'Stress-test: what correlation would change the answer materially?'],
      when: ['Physically separate mechanisms (independent servers, separate lots)', 'Designed independence (random draws with replacement)'],
      notWhen: ['Events sharing causes: weather, users, market regimes, common components', 'Repeated events on the SAME unit (a person’s repeat purchases correlate)'],
      assumptions: ['True independence — the entire result rides on it'],
    },
    code: `import numpy as np

rng = np.random.default_rng(4)
n = 1_000_000

# --- independent: two servers failing (separate hardware) ------------
p_fail = 0.02
a = rng.uniform(size=n) < p_fail
b = rng.uniform(size=n) < p_fail            # unrelated mechanism
print(f"P(both fail) theory = {p_fail**2:.6f}")
print(f"P(both fail) sim    = {(a & b).mean():.6f}   <- product works")

# --- DEPENDENT: same power supply (shared cause) ---------------------
outage = rng.uniform(size=n) < 0.01                  # shared event
a2 = outage | (rng.uniform(size=n) < 0.0101)          # ~0.02 each
b2 = outage | (rng.uniform(size=n) < 0.0101)
print(f"marginals still ~{a2.mean():.3f} each, but:")
print(f"P(both) sim = {(a2 & b2).mean():.5f} "
      f"vs naive product {a2.mean()*b2.mean():.5f}")
# 25x the naive answer: the shared cause correlates the 'independent'
# failures. This is how redundancy calculations go fatally wrong.`,
    scenario: {
      title: 'System reliability with redundancy',
      problem: 'An architect claims two redundant servers give 99.96% availability from 98% each — is that real?',
      dataset: 'Component failure rates plus an honest map of shared dependencies.',
      why: 'The product rule gives 0.02²=0.0004 joint failure ONLY if failures are independent; a shared power feed or deploy pipeline destroys that.',
      output: 'Joint failure probability under independence vs under a shared-cause model.',
      interpretation: 'True availability with a shared cause was 25× worse than the slide claimed — the architecture review question is "what do they share?"',
      pitfalls: 'Most real-world "independent" failures share causes: power, network, software versions, weather.',
    },
    mistakes: ['Multiplying probabilities of correlated events', 'Assuming independence because dependence is inconvenient', 'Compounding the error across many events (errors multiply too)'],
    tips: ['Interrogate the causal story, not just the data', 'Simulate a plausible shared-cause scenario as a stress test', 'When in doubt, measure P(B|A) and use Rule 2'],
  },
  {
    id: 'mult2', group: 'ch4', name: 'Multiplication Rule 2', formula: 'P(A and B) = P(A)·P(B|A)',
    tags: ['probability', 'dependent', 'conditional', 'chain rule'],
    overview: "The general 'and' rule: probability of A, times probability of B GIVEN A already happened. Always true, no independence needed — it is the chain rule that sequential probabilities (draws without replacement, funnels) are built from.",
    variables: [['P(A)', 'first event’s probability'], ['P(B|A)', 'second event’s probability once A is known'], ['P(A and B)', 'the joint probability']],
    thinking: {
      workflow: ['Order the events naturally (what happens/is-known first?)', 'Find P(A), then the updated P(B|A)', 'Multiply; chain further events the same way', 'For funnels: multiply stage-to-stage conversion rates'],
      when: ['Sampling without replacement (cards, audits, quality draws)', 'Funnels and pipelines: each stage conditional on the last', 'Any correlated pair where P(B|A) is measurable'],
      notWhen: ['You have neither P(B|A) nor data to estimate it', 'Events lack a coherent joint experiment'],
      assumptions: ['The conditional probability reflects the actual updated state (counts adjusted, funnel measured per stage)'],
    },
    code: `import numpy as np
from math import comb

# --- audit sampling without replacement ------------------------------
# A batch of 40 invoices contains 6 with errors. Draw 2 at random:
# P(both flawed)?
p_first = 6 / 40
p_second_given_first = 5 / 39          # one flawed invoice removed
p_both = p_first * p_second_given_first
print(f"P(both flawed) = 6/40 * 5/39 = {p_both:.4f}")
print(f"hypergeometric check: {comb(6,2)*comb(34,0)/comb(40,2):.4f}")

# vs the WRONG independent version:
print(f"naive (6/40)^2 = {(6/40)**2:.4f}  <- overstates, ignores removal")

# --- funnel: chained conditionals ------------------------------------
p_visit_to_signup = 0.11
p_signup_to_paid = 0.24                # GIVEN they signed up
p_paid_given_visit = p_visit_to_signup * p_signup_to_paid
print(f"P(visitor becomes paid) = 0.11 * 0.24 = {p_paid_given_visit:.4f}")

# Simulation of the draw problem:
rng = np.random.default_rng(5)
batch = np.array([1]*6 + [0]*34)
hits = sum(rng.choice(batch, 2, replace=False).sum() == 2
           for _ in range(100_000))
print(f"simulated: {hits/100_000:.4f}")`,
    scenario: {
      title: 'Signup funnel economics',
      problem: 'Finance needs the probability a fresh visitor eventually pays, to compute allowable acquisition cost.',
      dataset: 'Stage conversion rates: visit→signup, signup→paid.',
      why: 'Funnel stages are inherently conditional — each rate is measured among survivors of the last stage; the chain rule multiplies them correctly.',
      output: 'End-to-end conversion probability.',
      interpretation: '2.6% × average revenue = the ceiling on cost-per-visitor for profitable acquisition.',
      pitfalls: 'Mixing a stage rate computed over ALL visitors with one computed over survivors silently breaks the chain.',
    },
    mistakes: ['Using unconditional rates mid-chain', 'Forgetting to update counts when sampling without replacement', 'Chain direction confusion: P(B|A) is not P(A|B) (Bayes handles the reversal)'],
    tips: ['Write the chain left to right in time order — errors become visible', 'Tree diagrams are this rule drawn as a picture', 'The hypergeometric distribution packages the without-replacement case'],
  },
  {
    id: 'cond_p', group: 'ch4', name: 'Conditional Probability & Bayes', formula: 'P(B|A) = P(A and B)/P(A)',
    tags: ['probability', 'conditional', 'bayes', 'updating'],
    overview: "Probability updated by information: among the cases where A happened, how often did B? Rearranged, it yields Bayes' theorem — P(B|A) = P(A|B)P(B)/P(A) — the machinery for reversing conditionals correctly (test accuracy vs disease probability, the confusion everyone gets wrong).",
    variables: [['P(B|A)', 'probability of B within the world where A occurred'], ['P(A and B)', 'joint probability of both'], ['Bayes form', 'P(B|A) = P(A|B)·P(B) / P(A) — reverses the conditioning'], ['P(B)', 'the prior — base rate before evidence']],
    thinking: {
      workflow: ['State exactly what is known (the condition) and what is asked', 'Restrict attention to the conditioning event’s slice of the world', 'Divide joint by marginal — or use Bayes when the known conditional points the wrong way', 'Sanity-check with natural frequencies (counts out of 10,000)'],
      when: ['Any probability that updates on evidence: diagnostics, fraud flags, spam', 'Reversing conditionals: from P(test+|disease) to P(disease|test+)'],
      notWhen: ['Conditioning event has ~zero probability (division blows up)', 'The condition is not actually information about the target'],
      assumptions: ['Joint and marginal probabilities refer to the same population', 'The base rate (prior) is the right one for the case at hand'],
    },
    code: `import numpy as np

# --- the classic: disease testing, done with Bayes AND with counts ---
prevalence = 0.01            # P(disease): 1% base rate
sensitivity = 0.95           # P(test+ | disease)
specificity = 0.90           # P(test- | healthy)

# Bayes' theorem:
p_pos = sensitivity * prevalence + (1 - specificity) * (1 - prevalence)
p_disease_given_pos = sensitivity * prevalence / p_pos
print(f"P(test+) = {p_pos:.4f}")
print(f"P(disease | test+) = {p_disease_given_pos:.3f}   <- only ~9%!")

# Natural-frequency version (how to explain it to anyone):
n = 10_000
sick = n * prevalence                    # 100 people
true_pos = sick * sensitivity            # 95 flagged
false_pos = (n - sick) * (1 - specificity)   # 990 flagged (!)
print(f"of {n:,}: {true_pos:.0f} true positives, "
      f"{false_pos:.0f} FALSE positives")
print(f"flagged who are sick: {true_pos/(true_pos+false_pos):.3f}")
# The base rate did the damage: 99x more healthy people means even a
# 10% false-positive rate swamps the true positives.

# Simulation confirms:
rng = np.random.default_rng(6)
disease = rng.uniform(size=1_000_000) < prevalence
test_pos = np.where(disease, rng.uniform(size=disease.size) < sensitivity,
                    rng.uniform(size=disease.size) < 1 - specificity)
print(f"simulated P(disease|+) = {disease[test_pos].mean():.3f}")`,
    scenario: {
      title: 'Interpreting a positive medical screening',
      problem: 'A patient tests positive on a 95%-sensitive screen and assumes they almost surely have the disease. Do they?',
      dataset: 'Test sensitivity, specificity, and the population base rate.',
      why: 'The question P(disease|+) points the OPPOSITE way from the quoted accuracy P(+|disease); only Bayes reverses it correctly — and the 1% base rate drags the answer to ~9%.',
      output: 'The post-test probability and the natural-frequency explanation.',
      interpretation: '"Of 1,085 people who test positive, only 95 are sick" — the sentence that changes clinical follow-up policy.',
      pitfalls: 'Base-rate neglect: ignoring the prior is the single most consequential probability error in medicine, law, and fraud detection.',
    },
    mistakes: ['Confusing P(A|B) with P(B|A) (the prosecutor’s fallacy)', 'Ignoring the base rate entirely', 'Using a population prior for a patient with symptoms (their prior is higher)'],
    tips: ['Translate to natural frequencies — errors become impossible to hide', 'Always ask: conditional on WHAT, and which way does it point?', 'A second independent test re-runs Bayes with the ~9% as the new prior'],
  },
  {
    id: 'comp_p', group: 'ch4', name: 'Complement Rule', formula: 'P(Ē) = 1 − P(E)',
    tags: ['probability', 'complement', 'at least one'],
    overview: "The probability something does NOT happen is one minus the probability it does. Trivial-looking, yet it powers the single most useful trick in applied probability: P(at least one) = 1 − P(none).",
    variables: [['E', 'the event'], ['Ē', 'its complement — E not happening'], ['P(at least one)', '1 − P(zero occurrences), the trick’s payoff']],
    thinking: {
      workflow: ['"At least one" question spotted?', 'Flip to the complement: probability of NONE', 'P(none) is usually a clean product of independents', 'Subtract from 1'],
      when: ['"At least one" over many trials (failures, wins, collisions, matches)', 'Any event whose complement is easier to compute'],
      notWhen: ['Trial probabilities are heterogeneous AND dependent (model the joint directly)'],
      assumptions: ['For the product form of P(none): independent trials'],
    },
    code: `import numpy as np

# --- "at least one server failure this year?" ------------------------
p_daily_fail = 0.001
days = 365
p_none = (1 - p_daily_fail) ** days
p_at_least_one = 1 - p_none
print(f"P(no failures in a year)      = {p_none:.3f}")
print(f"P(at least one failure)       = {p_at_least_one:.3f}   <- 30%!")
# A '0.1% daily' risk quietly becomes a 30% annual risk.

# --- the birthday problem: same trick, famous answer -----------------
def p_shared_birthday(k):
    p_all_distinct = 1.0
    for i in range(k):
        p_all_distinct *= (365 - i) / 365
    return 1 - p_all_distinct

for k in [10, 23, 50]:
    print(f"{k:2d} people: P(shared birthday) = {p_shared_birthday(k):.3f}")

# Simulation check for 23:
rng = np.random.default_rng(7)
hits = sum(len(np.unique(rng.integers(0, 365, 23))) < 23
           for _ in range(50_000))
print(f"simulated (23): {hits/50_000:.3f}")`,
    scenario: {
      title: 'Annualizing a small daily risk',
      problem: 'Leadership dismisses a 0.1% daily outage risk as negligible; SRE must show the yearly picture.',
      dataset: 'The per-day failure probability and independence across days.',
      why: 'Direct computation of "at least one outage in 365 days" is a mess of cases; the complement collapses it to one line — and reveals a 30% annual probability.',
      output: 'P(at least one outage per year).',
      interpretation: '"Roughly one year in three will see an outage" reframes the priority discussion instantly.',
      pitfalls: 'Correlated bad days (storm seasons, deploy trains) make the independent product optimistic.',
    },
    mistakes: ['Computing "at least one" by summing cases instead of flipping', 'Multiplying small risks across trials that aren’t independent', 'Forgetting P(E)+P(Ē)=1 as a running sanity check'],
    tips: ['See "at least one" → think 1 − P(none), reflexively', 'Small per-trial risks compound fast: 1−(1−p)ⁿ ≈ np for tiny p', 'The birthday problem is the canonical interview version of this rule'],
  },
  {
    id: 'fcr', group: 'ch4', name: 'Fundamental Counting Rule', formula: 'Total = k₁·k₂·⋯·kₙ',
    tags: ['counting', 'multiplication principle', 'combinatorics'],
    overview: "If a process has stages with k₁, k₂, … choices each, the total number of distinct outcomes is the product. The bedrock under permutations, combinations, password math, and every sample-space count in classical probability.",
    variables: [['kᵢ', 'number of options at stage i'], ['Total', 'product over all stages — the size of the possibility space']],
    thinking: {
      workflow: ['Break the task into ordered stages', 'Count the options at each stage (watch for constraints reducing later stages)', 'Multiply', 'Use the total as n(S) in classical probability'],
      when: ['Multi-stage constructions: menus, PINs, configurations, routes', 'Sample-space sizes for classical probability'],
      notWhen: ['Stage counts depend on earlier choices in messy ways (enumerate or recurse instead)', 'Order doesn’t matter (divide out or use combinations)'],
      assumptions: ['Choices at each stage are independent in COUNT (not necessarily in nature)'],
    },
    code: `from math import prod

# --- how big is the menu space? --------------------------------------
stages = {"appetizer": 4, "main": 7, "side": 5, "dessert": 3}
total_meals = prod(stages.values())
print(f"distinct meals = 4*7*5*3 = {total_meals}")

# --- password policy strength ----------------------------------------
# 8 characters, each from 26+26+10+12 = 74 symbols:
n_pw = 74 ** 8
print(f"8-char passwords: {n_pw:.2e}")
guesses_per_sec = 1e10                      # offline GPU attack
print(f"exhaust in {n_pw/guesses_per_sec/3600/24/365:.1f} years -> "
      "vs 12 chars:")
print(f"12-char: {74**12/guesses_per_sec/3600/24/365:.2e} years")

# --- constrained stages: first char can't be a digit -----------------
constrained = 64 * 74 ** 7                  # 74-10 options first
print(f"with constraint: {constrained:.2e} "
      f"({constrained/n_pw:.0%} of unconstrained)")`,
    scenario: {
      title: 'Password policy security review',
      problem: 'Security quantifies how much an extra 4 characters of minimum length actually buys.',
      dataset: 'The permitted character set and length rules.',
      why: 'Attack cost is proportional to the possibility-space size, which is exactly the counting-rule product.',
      output: 'Total spaces for 8 vs 12 characters and time-to-exhaust at attack speed.',
      interpretation: 'Length beats complexity: each added character multiplies the space by 74 — four more characters is a 30-million-fold increase.',
      pitfalls: 'Humans don’t choose uniformly — real entropy is far below the counting-rule ceiling.',
    },
    mistakes: ['Adding stage counts instead of multiplying', 'Missing constraints that shrink later stages', 'Equating theoretical space with practical entropy'],
    tips: ['math.prod for the product', 'Draw stages as slots — the picture prevents most errors', 'This rule with "no repeats" IS the permutation formula next'],
  },
  {
    id: 'perm', group: 'ch4', name: 'Permutation nPr', formula: 'nPr = n!/(n−r)!',
    tags: ['counting', 'arrangement', 'order matters'],
    overview: "Ways to arrange r items out of n when ORDER MATTERS: n choices, then n−1, then n−2… for r slots. Rankings, schedules, passwords without repeats, podium finishes.",
    variables: [['n', 'items available'], ['r', 'slots to fill in order'], ['nPr', 'ordered arrangements — always ≥ the combination count']],
    thinking: {
      workflow: ['Does swapping two selected items give a DIFFERENT outcome?', 'Yes → permutations; no → combinations', 'Apply n!/(n−r)! (or the slot product)', 'Divide by nPr in classical probability as needed'],
      when: ['Rankings, orderings, sequences, seatings, tournament podiums', 'Assignments where position/role differs'],
      notWhen: ['Selection only, order irrelevant (committees) → combinations', 'Repetition allowed → plain counting rule kⁿ'],
      assumptions: ['Items distinct; no repetition once used'],
    },
    code: `from math import perm, comb
import numpy as np

# --- race podium: 12 runners, gold/silver/bronze ---------------------
podiums = perm(12, 3)
print(f"12P3 = 12*11*10 = {podiums} distinct podiums")
print(f"vs combinations 12C3 = {comb(12, 3)} "
      f"(order ignored: {podiums//comb(12,3)}x fewer = 3!)")

# Classical probability payoff: all podium orders equally likely,
# what's P(the three favorites sweep in ANY order)?
p_sweep = comb(3, 3) * perm(3, 3) / podiums     # 3! favorable orders
print(f"P(favorites sweep) = 6/{podiums} = {p_sweep:.4f}")

# Simulation:
rng = np.random.default_rng(8)
hits = sum(set(rng.permutation(12)[:3]) == {0, 1, 2}
           for _ in range(100_000))
print(f"simulated: {hits/100_000:.4f}")`,
    scenario: {
      title: 'Race podium possibilities',
      problem: 'A sportsbook enumerates possible gold-silver-bronze outcomes to structure exotic bets.',
      dataset: 'The entrant list.',
      why: 'Silver vs gold is a different payout — order matters, so permutations count the outcome space.',
      output: '1,320 distinct podiums for 12 runners.',
      interpretation: 'Fair odds on an exact podium (under an equal-ability model) start from 1/1320 before skill adjustments.',
      pitfalls: 'Runners are NOT equally likely to win — the count sizes the space, real odds need a skill model.',
    },
    mistakes: ['Using permutations for order-free selections (overcounts by r!)', 'Allowing repeats where the formula forbids them', 'Factorial overflow in manual computation (use math.perm)'],
    tips: ['math.perm(n, r) — exact integer arithmetic, no overflow', 'nPr = nCr × r! — the bridge between the two formulas', '"Does order create a new outcome?" is the only question to ask'],
  },
  {
    id: 'perm2', group: 'ch4', name: 'Permutation (identical items)', formula: 'n! / (r₁!·r₂!⋯rₚ!)',
    tags: ['counting', 'arrangement', 'duplicates', 'multiset'],
    overview: "Arrangements of n items when some are indistinguishable: divide n! by the factorial of each duplicate group, since shuffling identical items among themselves creates nothing new. 'MISSISSIPPI' math.",
    variables: [['n', 'total items'], ['rᵢ', 'size of each identical group'], ['result', 'distinct visible arrangements']],
    thinking: {
      workflow: ['Count total items and each group of identical ones', 'Start from n! as if all were distinct', 'Divide by rᵢ! per identical group', 'Check: identical groups gone → reduces to plain n!'],
      when: ['Letters with repeats, colored balls, batch schedules with identical jobs', 'Multinomial coefficient needs (it IS this formula)'],
      notWhen: ['All items distinct (plain factorial)', 'Selecting rather than arranging (combinations)'],
      assumptions: ['Items within a group are truly interchangeable'],
    },
    code: `from math import factorial
from collections import Counter

def multiset_perms(word):
    counts = Counter(word)
    result = factorial(len(word))
    for r in counts.values():
        result //= factorial(r)
    return result

word = "MISSISSIPPI"
print(f"letters: {dict(Counter(word))}")
print(f"distinct arrangements = 11!/(1!4!4!2!) = "
      f"{multiset_perms(word):,}")
print(f"naive 11! would claim {factorial(11):,} "
      f"({factorial(11)//multiset_perms(word)}x overcount)")

# Production-schedule flavor: 8 slots, jobs AAABBCCC
print(f"schedules for AAABBCCC: {multiset_perms('AAABBCCC'):,}")

# Brute-force verification on a small case:
from itertools import permutations
small = "AABB"
print(f"AABB: formula {multiset_perms(small)}, "
      f"brute force {len(set(permutations(small)))}")`,
    scenario: {
      title: 'Production run sequencing',
      problem: 'A plant schedules 8 daily slots across three products (3 of A, 2 of B, 3 of C) and wants the size of the sequencing space.',
      dataset: 'The product mix — identical units within each product.',
      why: 'Swapping two identical units of A changes nothing physically; the duplicate-division counts only operationally distinct schedules.',
      output: '560 distinct sequences instead of a meaningless 40,320.',
      interpretation: 'A 560-option space is small enough to search exhaustively for the changeover-minimizing sequence.',
      pitfalls: 'If "identical" units actually differ (different due dates), the division was illegal.',
    },
    mistakes: ['Forgetting one of the duplicate groups in the denominator', 'Dividing for items that are only superficially identical', 'Floating-point factorials (keep it integer)'],
    tips: ['Counter + integer division keeps it exact', 'This is the multinomial coefficient — the multinomial distribution reuses it', 'Brute-force-verify on a 4-letter case when unsure'],
  },
  {
    id: 'comb', group: 'ch4', name: 'Combination nCr', formula: 'nCr = n!/[(n−r)!·r!]',
    tags: ['counting', 'selection', 'order ignored', 'binomial coefficient'],
    overview: "Ways to CHOOSE r items from n when order is irrelevant: permutations divided by the r! orderings of each selection. Committees, lottery tickets, poker hands — and the binomial coefficient inside the binomial distribution.",
    variables: [['n', 'items available'], ['r', 'items chosen'], ['nCr', 'distinct selections — "n choose r"']],
    thinking: {
      workflow: ['Confirm order truly doesn’t matter', 'Apply nCr (math.comb)', 'For probabilities: favorable selections / total selections', 'Symmetry check: nCr = nC(n−r)'],
      when: ['Team/committee selection, sampling designs, lottery odds', 'Counting favorable hands/subsets in classical probability'],
      notWhen: ['Order or role matters (permutations)', 'Repetition allowed (stars-and-bars variant)'],
      assumptions: ['Distinct items, unordered selection, no repeats'],
    },
    code: `from math import comb

# --- lottery odds: choose 6 numbers from 49 --------------------------
total = comb(49, 6)
print(f"49C6 = {total:,} tickets -> P(jackpot) = 1/{total:,}")

# P(exactly 4 matches): choose 4 winners AND 2 losers
p4 = comb(6, 4) * comb(43, 2) / total
print(f"P(match exactly 4) = {p4:.6f}  (~1 in {1/p4:,.0f})")

# --- committee with a constraint -------------------------------------
# 5-person committee from 8 engineers + 6 designers, needing >=2 designers:
ways = sum(comb(6, d) * comb(8, 5 - d) for d in range(2, 6))
print(f"committees with >=2 designers: {ways:,} of {comb(14,5):,} "
      f"({ways/comb(14,5):.1%})")

# The Pascal's-triangle identity as a sanity check:
n, r = 10, 4
assert comb(n, r) == comb(n-1, r-1) + comb(n-1, r)
print("Pascal identity holds - counting is consistent")`,
    scenario: {
      title: 'Lottery odds disclosure',
      problem: 'A regulator verifies a lottery’s published odds table across all prize tiers.',
      dataset: 'The game design: 6 numbers from 49.',
      why: 'Every tier’s odds is a ratio of combination counts — exact integers, no simulation or data needed.',
      output: 'Exact probability per match count.',
      interpretation: 'The published "1 in 13,983,816" jackpot odds is 49C6 — verifiable by anyone with a calculator.',
      pitfalls: 'Tiers with bonus balls need careful favorable-count decomposition (choose matches AND non-matches).',
    },
    mistakes: ['Using permutations and overcounting by r!', 'Forgetting the "unfavorable" factor (choosing the losers too)', 'Rounding odds so much the disclosure misleads'],
    tips: ['math.comb is exact — never compute factorials manually', 'Favorable counts usually factor as (choose winners)×(choose losers)', 'nC r peaks at r=n/2 — a quick reasonableness check'],
  },
  {
    id: 'disc_mu', group: 'ch5', name: 'Distribution Mean', formula: 'μ = Σ[X·P(X)]',
    tags: ['discrete distribution', 'expected value', 'mean'],
    overview: "The mean of a discrete random variable: each possible value weighted by its probability. The long-run average outcome if the experiment repeated forever — computed before any data exists, straight from the distribution.",
    variables: [['X', 'each possible value'], ['P(X)', 'its probability'], ['μ', 'the probability-weighted average']],
    thinking: {
      workflow: ['List every possible value and its probability (must sum to 1)', 'Multiply value × probability, sum', 'Interpret as the long-run per-trial average', 'Pair with the distribution variance for spread'],
      when: ['Any discrete outcome model: units sold, claims filed, goals scored', 'Foundations for expected value decisions'],
      notWhen: ['Probabilities unknown (estimate them first — empirically)', 'The "average" outcome is impossible and will be misread (μ=2.3 children)'],
      assumptions: ['A complete, exhaustive probability model summing to 1'],
    },
    code: `import numpy as np

# --- daily unit sales model from historical frequencies --------------
x = np.array([0, 1, 2, 3, 4, 5])
p = np.array([0.05, 0.15, 0.30, 0.28, 0.15, 0.07])
assert np.isclose(p.sum(), 1.0)

mu = (x * p).sum()
print(f"mu = sum(x*P) = {mu:.2f} units/day")

# The long-run interpretation, verified by simulation:
rng = np.random.default_rng(0)
sim = rng.choice(x, p=p, size=100_000)
print(f"100k simulated days average: {sim.mean():.2f}")

# Business payoff: annual expectation
print(f"expected annual units = {mu:.2f} * 365 = {mu*365:.0f}")`,
    scenario: {
      title: 'Daily demand planning for a bakery',
      problem: 'A bakery models how many custom cakes are ordered daily to plan ingredients and staffing.',
      dataset: 'A year of daily order counts converted to a probability table.',
      why: 'The distribution mean turns the whole table into one planning number — the long-run daily average — while keeping the full distribution for stockout analysis.',
      output: 'μ = 2.54 cakes/day and the annual expectation.',
      interpretation: 'Ingredient contracts sized to ~2.5/day break even on average; the full distribution then sets safety buffers.',
      pitfalls: 'μ=2.54 does not mean "expect 2.54 cakes tomorrow" — no single day produces a fractional cake.',
    },
    mistakes: ['Probabilities not summing to 1 (broken model in, broken μ out)', 'Reading μ as a typical single-day outcome', 'Using μ alone for capacity decisions that tail days drive'],
    tips: ['np.average(x, weights=p) computes it directly', 'Always verify Σp=1 first — cheap and catches everything', 'μ anchors the variance formula next: σ² = Σ[X²P] − μ²'],
  },
  {
    id: 'disc_var', group: 'ch5', name: 'Distribution Variance', formula: 'σ² = Σ[X²·P(X)] − μ²',
    tags: ['discrete distribution', 'variance', 'spread'],
    overview: "Spread of a discrete random variable, via the computational shortcut: expected square minus squared expectation. Quantifies outcome unpredictability before any data is collected.",
    variables: [['Σ[X²·P(X)]', 'E[X²] — probability-weighted average of squared values'], ['μ²', 'square of the distribution mean'], ['σ²', 'the variance; √σ² = σ in natural units']],
    thinking: {
      workflow: ['Compute μ first', 'Compute E[X²] with the same weighting', 'Subtract μ²; root for σ', 'Compare risk across alternatives with equal means'],
      when: ['Risk comparison between discrete prospects (ventures, bets, SKUs)', 'Feeding σ into planning buffers and simulations'],
      notWhen: ['Distributions with rare huge outcomes where variance understates felt risk (look at quantiles too)'],
      assumptions: ['A complete probability model; finite second moment'],
    },
    code: `import numpy as np

x = np.array([0, 1, 2, 3, 4, 5])
p = np.array([0.05, 0.15, 0.30, 0.28, 0.15, 0.07])

mu = (x * p).sum()
e_x2 = (x**2 * p).sum()
var = e_x2 - mu**2
print(f"mu = {mu:.2f},  E[X^2] = {e_x2:.2f}")
print(f"sigma^2 = {var:.3f},  sigma = {np.sqrt(var):.2f} units")

# Risk comparison: two products, SAME mean, different spread
xa, pa = np.array([2, 3]), np.array([0.5, 0.5])            # steady
xb, pb = np.array([0, 5]), np.array([0.5, 0.5])            # feast/famine
for name, xx, pp in [("steady", xa, pa), ("volatile", xb, pb)]:
    m = (xx*pp).sum(); v = (xx**2*pp).sum() - m**2
    print(f"{name:9s} mean={m:.1f}  sigma={np.sqrt(v):.2f}")
# Same expected sales; wildly different inventory implications.`,
    scenario: {
      title: 'Choosing between two product lines',
      problem: 'Two products promise the same average daily sales; operations must pick the one easier to stock for.',
      dataset: 'Each product’s outcome-probability table.',
      why: 'Equal means hide the decision: σ quantifies the day-to-day unpredictability that drives safety stock and waste.',
      output: 'σ per product (0.5 vs 2.5 units here).',
      interpretation: 'The volatile product needs 5× the buffer for the same average revenue — a real cost the mean never showed.',
      pitfalls: 'Variance treats up- and down-side symmetrically; for one-sided pain (stockouts), also examine the distribution directly.',
    },
    mistakes: ['Computing E[X²] as (E[X])² — the exact error the formula guards', 'Comparing variances across different units/scales without CVar', 'Stopping at σ² and never rooting to interpretable σ'],
    tips: ['The shortcut form needs one pass — handy in spreadsheets too', 'Same-mean-different-variance is the canonical risk lesson; keep the example', 'For simulations, σ validates that your random draws match the model'],
  },
  {
    id: 'exp_val', group: 'ch5', name: 'Expected Value', formula: 'E(X) = Σ[X·P(X)]',
    tags: ['expected value', 'decision', 'gambling', 'insurance'],
    overview: "The distribution mean applied to payoffs: the long-run average gain or loss per play. The unit of account for decisions under uncertainty — insurance pricing, gamble evaluation, project selection all reduce to comparing expected values (and then asking about risk).",
    variables: [['X', 'each possible payoff (signed: losses negative)'], ['P(X)', 'its probability'], ['E(X)', 'long-run average payoff per play']],
    thinking: {
      workflow: ['Enumerate outcomes as SIGNED payoffs including all costs', 'Weight by probabilities, sum', 'Positive E = favorable long-run; negative = you pay for the privilege', 'Then ask: can we survive the variance on the way to the long run?'],
      when: ['Pricing insurance, warranties, and games', 'Comparing projects/bets with quantifiable outcomes', 'Any repeated decision where long-run average is the objective'],
      notWhen: ['One-shot decisions with ruinous downside (expected value ignores ruin)', 'Payoffs in utility, not money (a $1M loss hurts more than $1M gain helps)'],
      assumptions: ['Probabilities and payoffs correctly specified', 'The decision genuinely repeats enough for long-run logic to bite'],
    },
    code: `import numpy as np

# --- pricing an extended warranty ------------------------------------
# Failure probabilities and repair costs within warranty period:
outcomes = {          # cost to insurer
    "no claim":     (0.88, 0),
    "minor repair": (0.09, 120),
    "major repair": (0.025, 600),
    "replacement":  (0.005, 1400),
}
p = np.array([v[0] for v in outcomes.values()])
cost = np.array([v[1] for v in outcomes.values()])
assert np.isclose(p.sum(), 1)

expected_cost = (p * cost).sum()
print(f"expected claim cost = {expected_cost:.2f} per warranty")
price = expected_cost * 1.35 + 5          # +35% margin, +$5 admin
print(f"warranty price -> {price:.2f}")

# --- the casino side: roulette single-number bet ---------------------
# Bet $1 on one of 38 slots, win pays $35:
ev = (1/38) * 35 + (37/38) * (-1)
print(f"roulette EV per $1 = {ev:.4f}  (house edge {-ev:.1%})")

# Long-run verification:
rng = np.random.default_rng(1)
plays = np.where(rng.integers(0, 38, 1_000_000) == 0, 35, -1)
print(f"1M plays average: {plays.mean():.4f}")`,
    scenario: {
      title: 'Extended warranty pricing',
      problem: 'A retailer prices a 2-year warranty so it is profitable across thousands of units without gouging.',
      dataset: 'Historical failure rates and repair costs by severity.',
      why: 'Across many warranties the LLN makes average cost converge to E(cost); price = E(cost) + margin is the whole business model.',
      output: 'Expected claim cost ($28.30) and a defensible price.',
      interpretation: 'Selling below E(cost) loses money with certainty at scale; the margin covers variance and admin.',
      pitfalls: 'Correlated failures (a bad manufacturing batch) break the independence the LLN pricing rests on.',
    },
    mistakes: ['Omitting the cost of playing from payoffs', 'Using EV alone for unrepeatable, ruin-risk decisions', 'Believing a negative-EV game can be beaten by a staking system (it cannot)'],
    tips: ['Write losses as negative numbers and let the sum handle it', 'Report EV alongside σ — the risk-per-play companion', 'For one-shots, think in utility or scenario terms, not EV alone'],
  },
  {
    id: 'binom', group: 'ch5', name: 'Binomial Formula', formula: 'P(X) = nCₓ·pˣ·qⁿ⁻ˣ',
    tags: ['binomial', 'discrete distribution', 'success counts'],
    overview: "The probability of exactly X successes in n independent yes/no trials with constant success rate p: count the arrangements (nCₓ), weight by the probability of each (pˣqⁿ⁻ˣ). The model for defect counts, conversion counts, free-throw makes — anything counted out of n tries.",
    variables: [['n', 'number of trials'], ['X', 'number of successes asked about'], ['p, q', 'success and failure probabilities (q = 1−p)'], ['nCₓ', 'ways to place the X successes among n trials']],
    thinking: {
      workflow: ['Check BINS: Binary outcome, Independent trials, fixed N, constant Success p', 'Identify n, p, and the question (exactly / at most / at least)', 'Use pmf for exact, cdf for cumulative', 'For decision thresholds, examine the whole distribution'],
      when: ['Fixed number of independent binary trials: audits, A/B counts, QC samples', 'Anything phrased "out of n, how many…"'],
      notWhen: ['p drifts across trials or trials influence each other', 'Sampling without replacement from a small population (hypergeometric)', 'Counting events in continuous time (Poisson)'],
      assumptions: ['Binary, independent, fixed n, constant p — all four, checked'],
    },
    code: `import numpy as np
from scipy import stats
from math import comb

# --- QC: 20-unit sample, 4% true defect rate -------------------------
n, p = 20, 0.04
X = stats.binom(n, p)

# By hand for X=2, then scipy for everything:
by_hand = comb(20, 2) * 0.04**2 * 0.96**18
print(f"P(exactly 2 defects) hand = {by_hand:.4f}, "
      f"scipy = {X.pmf(2):.4f}")

for k in range(5):
    print(f"P(X={k}) = {X.pmf(k):.4f}")
print(f"P(X >= 2) = {1 - X.cdf(1):.4f}   <- the 'reject batch?' number")

# Decision rule design: if we reject batches at >=2 defects in 20,
# how often do we WRONGLY reject a good (4%) batch?
print(f"false-reject rate of the rule: {1 - X.cdf(1):.3f}")

# And how often do we CATCH a truly bad (15%) batch?
bad = stats.binom(n, 0.15)
print(f"catch rate on a 15% batch     : {1 - bad.cdf(1):.3f}")`,
    scenario: {
      title: 'Acceptance sampling in manufacturing',
      problem: 'A factory decides whether to accept incoming component batches by testing 20 units and rejecting on 2+ defects.',
      dataset: 'The sampling plan and the supplier’s claimed defect rate.',
      why: 'Fixed n, binary outcome, near-constant p: the binomial computes both error rates of the rule — false rejections of good batches and missed bad batches.',
      output: 'The rule’s operating characteristics at 4% and 15% defect rates.',
      interpretation: '19% false-reject vs 82% catch-rate quantifies the trade — adjust n or the threshold until both are acceptable.',
      pitfalls: 'Sampling 20 from a batch of 50 without replacement violates independence — switch to the hypergeometric.',
    },
    mistakes: ['Applying it when p varies or trials interact', '"At least" computed by summing pmf terms up the wrong tail', 'Using binomial for small-population sampling without replacement'],
    tips: ['stats.binom gives pmf/cdf/rvs — never hand-sum tails', 'sf(k) = 1−cdf(k) is the numerically stable "at least" form', 'Check n·p and n·q ≥ 5 before any normal approximation'],
  },
  {
    id: 'binom_mu', group: 'ch5', name: 'Binomial Mean', formula: 'μ = n·p',
    tags: ['binomial', 'mean', 'expected successes'],
    overview: "The expected number of successes in n trials: just n times p. The shortcut that skips the whole Σ[X·P(X)] computation because the binomial’s structure hands it to you.",
    variables: [['n', 'trials'], ['p', 'per-trial success probability'], ['μ', 'expected success count']],
    thinking: {
      workflow: ['Confirm the binomial setting holds', 'Multiply n·p — done', 'Use as the center of planning (staffing, stock, capacity)', 'Add σ = √(npq) for the buffer around it'],
      when: ['Instant expected-count answers: expected conversions, defects, no-shows', 'Sanity-checking simulation output'],
      notWhen: ['The binomial assumptions fail (then μ=np is fiction)', 'Tail risk is the question — the mean says nothing about it'],
      assumptions: ['Valid binomial model underneath'],
    },
    code: `import numpy as np
from scipy import stats

# --- overbooking: 270 tickets sold, 92% show-up rate -----------------
n, p = 270, 0.92
mu = n * p
print(f"expected passengers = {n} x {p} = {mu:.0f}")

# The mean alone says 248.4 - but the plane holds 256. Are we safe?
X = stats.binom(n, p)
print(f"sigma = sqrt(npq) = {X.std():.1f}")
print(f"P(more than 256 show up) = {X.sf(256):.4f}")
# The mean said 'plenty of room'; the distribution says ~3%% of flights
# bump passengers. Decisions live in the tail, not the mean.

# Simulation agreement:
rng = np.random.default_rng(2)
shows = rng.binomial(n, p, 100_000)
print(f"simulated mean {shows.mean():.1f}, "
      f"P(>256) = {(shows > 256).mean():.4f}")`,
    scenario: {
      title: 'Airline overbooking policy',
      problem: 'Revenue management sells more tickets than seats, betting on no-shows — how many is safe?',
      dataset: 'Historical show-up rate and seats available.',
      why: 'μ=np instantly gives expected passengers per flight; the binomial around it prices the bumping risk that actually constrains the policy.',
      output: 'Expected load 248 vs 256 seats, and P(oversold).',
      interpretation: 'Selling 270 keeps expected load under capacity with a ~3% bump rate — tune tickets sold until bump cost balances empty-seat cost.',
      pitfalls: 'Group bookings correlate show-ups, breaking independence and fattening the bad tail.',
    },
    mistakes: ['Planning on μ while the decision depends on the tail', 'Using np when p varies by customer segment (model segments separately)', 'Rounding μ and calling it "the" outcome'],
    tips: ['μ=np is the anchor; √(npq) is the buffer — use them together', 'The binomial mean derivation is the fastest expected-value proof there is', 'Segment-level np sums to the total expectation — linearity is your friend'],
  },
  {
    id: 'binom_sd', group: 'ch5', name: 'Binomial SD', formula: 'σ = √(n·p·q)',
    tags: ['binomial', 'spread', 'standard deviation'],
    overview: "The spread of a binomial count around np. Maximized at p=0.5, shrinking toward the certain extremes — and, relative to n, it shrinks like 1/√n: the mathematical reason bigger samples give steadier rates.",
    variables: [['n·p·q', 'variance of the count'], ['σ', 'typical deviation of successes from np'], ['q', '1−p']],
    thinking: {
      workflow: ['Compute μ=np and σ=√(npq) together', 'Use μ±2σ as the "usual range" of counts', 'Flag observed counts outside it', 'For rates, divide by n: σ of p̂ is √(pq/n)'],
      when: ['Setting control limits on counts (defects, calls, conversions)', 'Judging whether an observed count is surprising', 'Understanding why rate estimates stabilize with n'],
      notWhen: ['Non-binomial counts (overdispersed data has σ² > npq — common!)'],
      assumptions: ['Valid binomial model; watch for overdispersion in real data'],
    },
    code: `import numpy as np
from scipy import stats

# --- daily defect counts: n=500 units, p=0.02 ------------------------
n, p = 500, 0.02
mu, sigma = n * p, np.sqrt(n * p * (1 - p))
print(f"mu = {mu:.1f} defects, sigma = {sigma:.2f}")
print(f"usual range (mu +/- 2sigma): "
      f"{mu - 2*sigma:.1f} to {mu + 2*sigma:.1f}")

# Yesterday saw 19 defects. Alarm?
print(f"19 is {(19 - mu)/sigma:.1f} sigma above -> "
      f"P(X >= 19) = {stats.binom(n, p).sf(18):.4f}  <- investigate")

# The 1/sqrt(n) law for RATES - why bigger samples steady the estimate:
for nn in [100, 400, 1600, 6400]:
    rate_sd = np.sqrt(p * (1 - p) / nn)
    print(f"n={nn:5d}: sd of observed rate = {rate_sd:.4f}")
# Quadruple the sample, halve the noise - every time.`,
    scenario: {
      title: 'Defect-count control chart',
      problem: 'A line monitor needs limits that separate normal defect variation from a process shift worth stopping the line for.',
      dataset: 'Daily production count and baseline defect rate.',
      why: 'np ± 2√(npq) is the natural control band; days outside it are statistically surprising under the stable process.',
      output: 'Control limits and the tail probability of yesterday’s 19.',
      interpretation: 'P(X≥19)≈1% under the baseline rate — pull the andon cord and inspect, don’t wait for a trend.',
      pitfalls: 'Real defect data often clusters (overdispersion): npq understates spread, limits fire falsely — check historical variance first.',
    },
    mistakes: ['Ignoring overdispersion in real count data', 'Forgetting the q (using √np)', 'Applying count-σ logic to rates without dividing by n'],
    tips: ['σ peaks at p=0.5 for fixed n — extreme p means tight counts', 'Historical var vs npq is the one-line overdispersion check', 'The √n rate law is the intuition behind every sample-size formula later'],
  },
  {
    id: 'multi', group: 'ch5', name: 'Multinomial', formula: 'P = [n!/(X₁!⋯Xₖ!)]·p₁^X₁⋯pₖ^Xₖ',
    tags: ['multinomial', 'categories', 'discrete distribution'],
    overview: "The binomial generalized to k categories: the probability of a specific split of n trials across outcomes, counting the arrangements (multiset permutation) and weighting by category probabilities. Market shares, survey splits, die rolls.",
    variables: [['Xᵢ', 'count landing in category i (ΣXᵢ = n)'], ['pᵢ', 'category probabilities (Σpᵢ = 1)'], ['n!/(ΠXᵢ!)', 'arrangements of that split']],
    thinking: {
      workflow: ['k mutually exclusive outcomes with fixed probabilities?', 'Ask about a specific split → multinomial pmf', 'Ask about one category alone → collapses to binomial', 'For "is observed split consistent with claimed p’s?" → chi-square GOF is the test'],
      when: ['Exact probabilities of categorical splits (poll outcomes, share scenarios)', 'Simulating categorical data honestly'],
      notWhen: ['Category probabilities drift across trials', 'You only care about one category (binomial suffices)'],
      assumptions: ['Independent trials, constant category probabilities, exclusive-exhaustive categories'],
    },
    code: `import numpy as np
from scipy import stats

# --- brand choice: 4 brands, known shares ----------------------------
shares = [0.40, 0.30, 0.20, 0.10]
n = 20                                   # next 20 customers

# P(exactly 8 / 6 / 4 / 2)?
m = stats.multinomial(n, shares)
split = [8, 6, 4, 2]
print(f"P{tuple(split)} = {m.pmf(split):.4f}")

# Marginal check: one category alone is binomial
print(f"P(brand A gets exactly 8) multinomial-marginal = "
      f"{stats.binom(n, 0.40).pmf(8):.4f}")

# Expected split and simulation:
print(f"expected counts: {[n*s for s in shares]}")
rng = np.random.default_rng(3)
sim = rng.multinomial(n, shares, size=100_000)
print(f"simulated P{tuple(split)} = "
      f"{np.mean(np.all(sim == split, axis=1)):.4f}")
print(f"simulated mean counts: {sim.mean(axis=0).round(2)}")`,
    scenario: {
      title: 'Market-share scenario probabilities',
      problem: 'A brand manager asks how likely specific share splits are among the next 20 customers, given current market shares.',
      dataset: 'Established share percentages per brand.',
      why: 'Each customer is one categorical trial; the multinomial gives exact probabilities for any full split scenario.',
      output: 'Probabilities of scenario splits plus expected counts.',
      interpretation: 'Any single exact split is rare (~1%) — scenario planning should use ranges and the marginal binomials.',
      pitfalls: 'Customers influenced by each other (promotions, herding) violate the independent-trials assumption.',
    },
    mistakes: ['Probabilities not summing to 1 or counts not summing to n', 'Expecting any exact split to be likely (the space is huge)', 'Using it to TEST observed vs expected (that is chi-square GOF)'],
    tips: ['stats.multinomial + rng.multinomial cover pmf and simulation', 'Marginals are binomials — use them for single-category questions', 'This pmf’s coefficient is the identical-items permutation formula reused'],
  },
  {
    id: 'poisson', group: 'ch5', name: 'Poisson', formula: 'P(X;λ) = e^(−λ)·λˣ/X!',
    tags: ['poisson', 'rare events', 'counts', 'rate'],
    overview: "The distribution of event counts in a fixed window when events occur independently at a constant average rate λ: arrivals, defects per roll, typos per page, goals per match. One parameter, and mean = variance = λ — its signature and its diagnostic.",
    variables: [['λ', 'average events per window (the only parameter)'], ['X', 'count asked about'], ['e^(−λ)', 'probability of zero events, the no-arrival anchor']],
    thinking: {
      workflow: ['Counts in fixed time/space, no natural upper n?', 'Estimate λ from historical average', 'Check mean ≈ variance (overdispersion breaks Poisson)', 'pmf/cdf for staffing, capacity, and anomaly questions'],
      when: ['Arrivals per hour, defects per unit area, incidents per month', 'Rare-event counts approximating binomial with large n, small p'],
      notWhen: ['Clustered/contagious events (mean < variance: negative binomial)', 'Rate varies systematically within the window (model λ(t))'],
      assumptions: ['Constant rate within window, independent events, no simultaneous occurrences'],
    },
    code: `import numpy as np
from scipy import stats

# --- ER arrivals: historical average 4.2 per hour --------------------
lam = 4.2
X = stats.poisson(lam)

for k in [0, 2, 4, 6, 8]:
    print(f"P(X={k}) = {X.pmf(k):.4f}")
print(f"P(X > 7) = {X.sf(7):.4f}   <- overload probability per hour")

# Staffing: capacity that handles 95% of hours
print(f"95th percentile of arrivals: {X.ppf(0.95):.0f} per hour")

# The signature check on real data - mean should ~equal variance:
rng = np.random.default_rng(4)
counts = rng.poisson(lam, 5000)
print(f"simulated mean {counts.mean():.2f}, var {counts.var():.2f} "
      f"(Poisson: equal)")

# Overdispersed contrast (clustered arrivals - ambulance batches):
clustered = rng.poisson(rng.gamma(2, 2.1, 5000))
print(f"clustered  mean {clustered.mean():.2f}, "
      f"var {clustered.var():.2f}  <- var >> mean: NOT Poisson")`,
    scenario: {
      title: 'Hospital ER staffing',
      problem: 'An ER schedules nurses per hour and must cover arrival surges without chronic overstaffing.',
      dataset: 'A year of hourly arrival counts averaging 4.2.',
      why: 'Independent patient arrivals at a stable hourly rate are the textbook Poisson process; the 95th percentile of the distribution IS the staffing rule.',
      output: 'P(overload) at current capacity and the 95%-coverage arrival level.',
      interpretation: 'Staffing for 8 arrivals covers 95% of hours; the remaining 5% defines the on-call protocol.',
      pitfalls: 'Flu season shifts λ — a single year-round λ blends regimes; fit λ by season/hour-of-day.',
    },
    mistakes: ['Using Poisson on clustered data (variance ≫ mean)', 'One global λ across obviously different regimes', 'Confusing the rate window (per hour vs per shift) mid-calculation'],
    tips: ['Mean≈variance is the two-second validity check', 'λ scales linearly: per-hour 4.2 → per-shift (8h) 33.6', 'For binomial with n>100, p<0.01, Poisson(np) is an excellent shortcut'],
  },
  {
    id: 'hypgeo', group: 'ch5', name: 'Hypergeometric', formula: 'P(X) = (aCₓ·bCₙ₋ₓ)/(a+bCₙ)',
    tags: ['hypergeometric', 'without replacement', 'sampling', 'audit'],
    overview: "Success counts when sampling WITHOUT replacement from a finite pool of a successes and b failures: each draw changes the remaining odds, which the combination counts handle exactly. Audits, card hands, lottery matches, acceptance sampling from small lots.",
    variables: [['a', 'successes in the population'], ['b', 'failures in the population'], ['n', 'draws taken'], ['X', 'successes among the draws']],
    thinking: {
      workflow: ['Finite pool, draws not replaced? Hypergeometric, not binomial', 'Identify a, b, n and the question', 'Use scipy’s parameterization carefully (M=a+b, n=a, N=draws)', 'If the pool dwarfs the sample (>20×), binomial approximates fine'],
      when: ['Audit sampling from a finite batch', 'Card/lottery exact-match probabilities', 'Quality acceptance from small lots'],
      notWhen: ['Sampling with replacement or huge populations (binomial is simpler and fine)'],
      assumptions: ['Random draws, fixed finite population, two classes'],
    },
    code: `import numpy as np
from scipy import stats
from math import comb

# --- audit: 12 flawed invoices hidden among 100; auditor pulls 15 ----
a, b, n = 12, 88, 15                     # successes, failures, draws
# scipy: hypergeom(M=total, n=successes_in_pop, N=draws)
H = stats.hypergeom(M=a + b, n=a, N=n)

by_hand = comb(a, 2) * comb(b, 13) / comb(a + b, 15)
print(f"P(exactly 2 flawed found) hand={by_hand:.4f} "
      f"scipy={H.pmf(2):.4f}")
print(f"P(find NONE)   = {H.pmf(0):.4f}")
print(f"P(find >= 1)   = {1 - H.pmf(0):.4f}  <- detection power")
print(f"expected found = {H.mean():.2f}")

# Binomial approximation quality (pool only ~7x sample - borderline):
B = stats.binom(n, a / (a + b))
print(f"binomial approx P(0): {B.pmf(0):.4f} vs exact {H.pmf(0):.4f}")

# Design question: sample size needed for 95% detection?
for nn in [15, 20, 25, 30]:
    p_detect = 1 - stats.hypergeom(100, 12, nn).pmf(0)
    print(f"n={nn}: P(detect >=1 flaw) = {p_detect:.3f}")`,
    scenario: {
      title: 'Invoice audit sample sizing',
      problem: 'An auditor must choose how many of 100 invoices to inspect so that a 12%-contamination batch is caught with 95% probability.',
      dataset: 'Batch size and the contamination level the audit must detect.',
      why: 'Draws are without replacement from a small finite pool — the hypergeometric is exact where the binomial only approximates, and here the difference matters.',
      output: 'Detection probability per sample size; the minimal n hitting 95%.',
      interpretation: 'n=20 gives ~95% detection: the audit workload is now a justified number, not a guess.',
      pitfalls: 'If the auditor’s selection is not truly random (newest invoices first), the model’s guarantee evaporates.',
    },
    mistakes: ['Using binomial when the sample is a big fraction of the pool', 'Mixing up scipy’s (M, n, N) parameter order — verify with a hand case', 'Forgetting the population composition must be known or hypothesized'],
    tips: ['Always verify scipy parameterization against one comb() hand-check', 'Rule of thumb: pool >20× sample → binomial approximation is fine', 'Detection-power tables like the loop above justify audit budgets'],
  },
  {
    id: 'geometric', group: 'ch5', name: 'Geometric', formula: 'P(n) = p·(1−p)^(n−1)',
    tags: ['geometric', 'first success', 'waiting time'],
    overview: "The distribution of WHICH trial brings the first success: n−1 failures then a success. Memoryless — past failures don't improve future odds — with mean 1/p: at a 2% close rate, the average first sale takes 50 calls.",
    variables: [['p', 'per-trial success probability'], ['n', 'trial number of the first success'], ['1/p', 'expected trials to first success — the headline number']],
    thinking: {
      workflow: ['"How long until the first success?" spotted', 'Verify constant p and independence', 'Mean 1/p for planning; cdf 1−(1−p)ⁿ for "within n tries"', 'Remember memorylessness when tempted by gambler’s logic'],
      when: ['Sales calls to first close, attempts to first defect, retries to first connect', 'Any waiting-for-first-event count'],
      notWhen: ['p improves with learning or fatigue (non-constant)', 'Waiting for the k-th success (negative binomial)'],
      assumptions: ['Independent trials, constant p'],
    },
    code: `import numpy as np
from scipy import stats

# --- cold calls: 6% conversion per call ------------------------------
p = 0.06
# scipy's geom counts the trial of first success (support 1, 2, ...):
G = stats.geom(p)

print(f"expected calls to first sale: 1/p = {1/p:.1f}")
print(f"P(first sale on call 1)  = {G.pmf(1):.3f}")
print(f"P(first sale on call 10) = {G.pmf(10):.4f}")
print(f"P(sale within 20 calls)  = {G.cdf(20):.3f}")
print(f"P(NO sale in 30 calls)   = {G.sf(30):.3f}")

# Memorylessness - 20 failures don't make call 21 special:
p_next_given_20_fails = G.pmf(21) / G.sf(20)
print(f"P(success on next | 20 failures) = "
      f"{p_next_given_20_fails:.3f}  (= p = {p})")

# Simulation of a rep's day:
rng = np.random.default_rng(5)
first_sale = rng.geometric(p, 100_000)
print(f"simulated mean {first_sale.mean():.1f}, "
      f"median {np.median(first_sale):.0f} "
      f"<- median < mean: right-skewed waiting")`,
    scenario: {
      title: 'Sales call planning',
      problem: 'A sales manager sets daily call quotas and expectations for how long a new rep waits for a first close.',
      dataset: 'The team’s per-call conversion rate.',
      why: 'Calls are near-independent trials at a stable rate; the geometric answers "expected calls to first sale" (17) and "probability of a saleless 30-call day" (16%).',
      output: 'Mean, within-n probabilities, and the long-drought risk.',
      interpretation: 'A rep with 25 straight failures is NOT "due" — memorylessness says the next call is still 6%; quotas should absorb droughts by design.',
      pitfalls: 'Reps improve (or burn out): a constant p is a modeling choice to revisit with tenure.',
    },
    mistakes: ['Gambler’s fallacy — treating a drought as raising the next-trial odds', 'Off-by-one between "trials to success" and "failures before success" conventions', 'Planning on the mean while the median (12 calls) describes the typical wait'],
    tips: ['Memorylessness is the interview-famous property — know the one-line proof', 'The right-skew means mean > median: quote both to set expectations', 'Waiting for k-th success → negative binomial, the natural extension'],
  },
];
