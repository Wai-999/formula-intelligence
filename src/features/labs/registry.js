// The visual labs (§7 "Required visual labs"). Each is its own lazily loaded
// chunk, mounted by a lesson (src/features/labs/LabHost.jsx). `lessons`
// lists where each lab is taught; docs/CURRICULUM_MAP.md mirrors this table.

export const LABS = {
  ratio: { title: 'Unit rates on double number lines', required: null, load: () => import('./RatioLab.jsx') },
  'equation-balance': { title: 'Equation balance', required: 'equation balance', load: () => import('./EquationBalanceLab.jsx') },
  'function-transformations': { title: 'Function transformations', required: 'function transformations', load: () => import('./TransformLab.jsx') },
  slope: { title: 'Slope and derivative', required: 'slope/derivative', load: () => import('./SlopeLab.jsx') },
  riemann: { title: 'Riemann sums', required: 'Riemann sums', load: () => import('./RiemannLab.jsx') },
  taylor: { title: 'Taylor approximation', required: 'Taylor approximation', load: () => import('./TaylorLab.jsx') },
  'vectors-dot': { title: 'Vector addition, dot product and projection', required: 'vector addition/dot product', load: () => import('./VectorLab.jsx') },
  'matrix-transform': { title: 'Matrix transformations', required: 'matrix transformations', load: () => import('./MatrixLab.jsx') },
  'gaussian-elimination': { title: 'Gaussian elimination', required: 'Gaussian elimination', load: () => import('./EliminationLab.jsx') },
  eigenvectors: { title: 'Eigenvectors', required: 'eigenvectors', load: () => import('./EigenLab.jsx') },
  'svd-pca': { title: 'SVD and PCA', required: 'SVD/PCA', load: () => import('./PcaLab.jsx') },
  'gradient-hessian': { title: 'Gradient and Hessian', required: 'gradient/Hessian', load: () => import('./GradientLab.jsx') },
  'gradient-descent': { title: 'Gradient descent', required: 'gradient descent', load: () => import('./DescentLab.jsx') },
  'least-squares': { title: 'Least-squares fitting', required: 'least-squares fitting', load: () => import('./LeastSquaresLab.jsx') },
  sampling: { title: 'Sampling distributions', required: 'sampling distributions', load: () => import('./SamplingLab.jsx') },
  bayes: { title: 'Bayes updating', required: 'Bayes updating', load: () => import('./BayesLab.jsx') },
  'bias-variance': { title: 'Bias–variance', required: 'bias–variance', load: () => import('../ml/playground/PlaygroundPage.jsx') },
  'decision-boundary': { title: 'Classification decision boundaries', required: 'classification decision boundaries', load: () => import('./BoundaryLab.jsx') },
  'cross-validation': { title: 'Cross-validation and leakage', required: null, load: () => import('./CrossValidationLab.jsx') },
  calibration: { title: 'Calibration and group error rates', required: null, load: () => import('./CalibrationLab.jsx') },
};
