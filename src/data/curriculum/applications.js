// The Data Science Career / Application map (§3 "Maps"). Applications are
// kinds of real work; careers are roles that do that work. Both link to the
// concepts they lean on most. These are illustrative orientation, not a
// hiring guide or a claim about any employer's requirements.

export const APPLICATIONS = [
  { id: 'app.ab-testing', title: 'A/B testing and experiments', summary: 'Deciding whether a change really helped, and by how much.', concepts: ['c.sampling', 'c.clt', 'c.inference', 'c.causal'] },
  { id: 'app.forecasting', title: 'Forecasting', summary: 'Predicting demand, traffic or prices, and saying how uncertain the prediction is.', concepts: ['c.line-fit', 'c.regression-inference', 'c.validation', 'c.leakage'] },
  { id: 'app.recommenders', title: 'Recommender systems', summary: 'Suggesting items from patterns in what similar people chose.', concepts: ['c.dot-product', 'c.matrices', 'c.svd'] },
  { id: 'app.search-embeddings', title: 'Search and embeddings', summary: 'Representing text, images or users as vectors and ranking by similarity.', concepts: ['c.dot-product', 'c.norms', 'c.projection'] },
  { id: 'app.computer-vision', title: 'Computer vision', summary: 'Recognising objects in images with networks trained by gradient descent.', concepts: ['c.matrices', 'c.linear-transformations', 'c.backprop', 'c.gradient-descent'] },
  { id: 'app.credit-risk', title: 'Credit and risk scoring', summary: 'Estimating the probability of default — calibrated, and checked for unequal errors.', concepts: ['c.logistic-regression', 'c.calibration', 'c.fairness', 'c.roc-pr'] },
  { id: 'app.medical-screening', title: 'Medical screening', summary: 'Flagging patients for follow-up while weighing misses against false alarms.', concepts: ['c.bayes', 'c.confusion-matrix', 'c.roc-pr'] },
  { id: 'app.dimensionality', title: 'Compression and visualization', summary: 'Reducing many measurements to a few informative ones.', concepts: ['c.pca', 'c.svd'] },
  { id: 'app.model-training', title: 'Training machine-learning models', summary: 'Fitting millions of parameters by following gradients.', concepts: ['c.gradient-descent', 'c.backprop', 'c.hessian', 'c.regularization'] },
  { id: 'app.quality-control', title: 'Quality control', summary: 'Detecting when a process drifts away from its target.', concepts: ['c.sampling', 'c.clt', 'c.inference'] },
];

export const CAREERS = [
  { id: 'career.analyst', title: 'Data analyst', summary: 'Answers business questions with data: cleaning, summarizing, testing and communicating.', applications: ['app.ab-testing', 'app.forecasting', 'app.quality-control'], concepts: ['c.descriptive', 'c.inference', 'c.line-fit'] },
  { id: 'career.data-scientist', title: 'Data scientist', summary: 'Builds and evaluates predictive models and experiments end to end.', applications: ['app.forecasting', 'app.credit-risk', 'app.ab-testing', 'app.medical-screening'], concepts: ['c.validation', 'c.confusion-matrix', 'c.bayes', 'c.regularization'] },
  { id: 'career.ml-engineer', title: 'Machine-learning engineer', summary: 'Trains, ships and monitors models in production systems.', applications: ['app.model-training', 'app.recommenders', 'app.search-embeddings', 'app.computer-vision'], concepts: ['c.gradient-descent', 'c.matrices', 'c.leakage'] },
  { id: 'career.research-scientist', title: 'ML research scientist', summary: 'Develops new methods; reads and writes the mathematics directly.', applications: ['app.model-training', 'app.computer-vision', 'app.dimensionality'], concepts: ['c.svd', 'c.hessian', 'c.backprop', 'c.taylor'] },
];
