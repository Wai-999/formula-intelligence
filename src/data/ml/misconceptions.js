import { blSame } from '../../lib/mlContent.js';

// Source: docs/research/ML-Mode-Pedagogy-Research.md §3. One entry per named
// misconception, authored once and referenced by id from wherever a module
// needs to refute it (MisconceptionCallout component), so the six+one
// refutations read as one consistent voice rather than being independently
// drafted per module. Tone is collegial per the mission's own guardrail
// (Section I) — a genuine correction, not a "gotcha."
export const MISCONCEPTIONS = {
  programmedBehavior: {
    id: 'programmedBehavior',
    belief: blSame(
      'A machine learning model is really just a big set of hand-written if/else rules — like ordinary software, someone typed in every case.'
    ),
    truth: blSame(
      'Nobody writes the individual rule. What a person designs is the *shape* — a straight line, a tree of yes/no splits, a network of weighted connections — and then an algorithm searches for the specific numbers (coefficients, split thresholds, weights) that shape should have, using the training data as evidence. Change the data, and the same code produces a completely different model, with no line of code touched.'
    ),
  },
  exactness: {
    id: 'exactness',
    belief: blSame(
      "A model's output is a precise, certain fact — if it says gold will be $4,180, that's the answer."
    ),
    truth: blSame(
      "Every model output is an estimate built from limited, noisy historical data, and estimates always carry uncertainty. A responsible forecast is a range (a prediction interval or a probability), not a single number — the single number is just the range's midpoint, and treating it as certain throws away the most important part of what the model is telling you: how confident it is."
    ),
  },
  dataStorage: {
    id: 'dataStorage',
    belief: blSame(
      'The model remembers every example it was trained on and looks them up later, like a lookup table or a search engine.'
    ),
    truth: blSame(
      "Most models never keep the training data around after fitting — they compress whatever pattern was in the data into a small number of parameters (a handful of coefficients, a tree's split thresholds) and discard the original examples entirely. A fitted linear regression can't tell you what its 500th training row was; it only remembers the slope and intercept it learned from all of them combined. K-Nearest Neighbors is the genuine exception on this map — it really does keep every training point and looks up the closest ones at prediction time, which is exactly why it's slow on large datasets and every other model here isn't."
    ),
  },
  continuousLearning: {
    id: 'continuousLearning',
    belief: blSame(
      'Once a model is deployed, it keeps learning and improving automatically as it is used, like a person gaining experience.'
    ),
    truth: blSame(
      "A deployed model is frozen. Its parameters stop changing the moment training ends, and using it — even thousands of times a day — doesn't teach it anything new. If the world it was trained on changes (a market regime shifts, a relationship breaks down), the model doesn't notice and doesn't adapt; it just keeps confidently applying the old pattern to a world that's moved on. That's concept drift, and it's why production systems need someone to deliberately retrain the model on fresh data — the model will never do this for itself."
    ),
  },
  userTrainedModel: {
    id: 'userTrainedModel',
    belief: blSame(
      "Moving the sliders in this app's demos — the Model Playground, the lesson labs, the Model Map widgets — is training 'the' AI model, like teaching a real system."
    ),
    truth: blSame(
      "Everything here runs in your browser, and nothing it computes leaves this device. The Model Playground (in the ML pipeline's bias–variance lesson) fits a small, disposable model to a synthetic dataset generated for that session; the lesson labs and Model Map widgets compute a formula from the numbers you set; the Python lab runs only the code you write. None of it trains or updates any shared, persistent or production model — these are sandboxes for building intuition, not control panels for a real system."
    ),
  },
  autonomousDataAcquisition: {
    id: 'autonomousDataAcquisition',
    belief: blSame(
      'The model automatically goes out and finds or fetches whatever new data it needs on its own.'
    ),
    truth: blSame(
      "Data collection is a deliberate, human-designed engineering step that happens before a model exists at all — someone decides which APIs to call, which databases to query, which sources to trust, and builds the pipeline that pulls it all together. A model has no agency to go looking for anything; it only ever sees the data someone specifically routed to it."
    ),
  },
  lessBiasedThanHumans: {
    id: 'lessBiasedThanHumans',
    belief: blSame(
      'A model trained on data is more objective and less biased than a human judgment would be.'
    ),
    truth: blSame(
      "A model can only be as unbiased as the data and labels it was trained on — and that data was collected, selected, and labeled by people, with all of the same human choices about what counts, whose voices are represented, and what the 'right answer' looked like historically baked in. A geopolitical risk score built from whichever news sources and historical conflict records were chosen to train it doesn't remove human judgment from the process — it just makes that judgment harder to see, because it's now embedded in numbers instead of stated as an opinion."
    ),
  },
};
