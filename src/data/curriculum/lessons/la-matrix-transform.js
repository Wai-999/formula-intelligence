import { item, num, choice, multi } from '../lessonKit.js';

export default {
  intuition: {
    question: 'A photo app “shears” an image so vertical lines lean: every pixel at $(x, y)$ moves to $(x + 0.5y,\\ y)$. How can four numbers describe what happens to every point of the picture — and say how much areas change?',
    body: [
      'Write the move as a **matrix** acting on a vector: $\\begin{bmatrix}1 & 0.5\\\\ 0 & 1\\end{bmatrix}\\begin{bmatrix}x\\\\ y\\end{bmatrix}$. The first column is where $(1, 0)$ goes; the second is where $(0, 1)$ goes. Because the map is **linear**, those two destinations decide everything else.',
      'Matrices are how data science moves data around: rotating features, mixing them into new ones, compressing them. Reading a matrix as “where the basis arrows land” makes all of that visual.',
    ],
  },

  glossary: [
    { term: '$A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$', meaning: 'A 2×2 matrix: rows across, columns down.' },
    { term: '$A\\mathbf x$', meaning: 'The matrix applied to the vector $\\mathbf x$; each entry is a row of $A$ dotted with $\\mathbf x$.' },
    { term: '$\\mathbf e_1 = (1, 0),\\ \\mathbf e_2 = (0, 1)$', meaning: 'The standard basis; $A\\mathbf e_1$ and $A\\mathbf e_2$ are the columns of $A$.' },
    { term: '$\\det A = ad - bc$', meaning: 'The factor by which $A$ multiplies areas; negative if it flips orientation.' },
    { term: 'linear', meaning: '$A(\\mathbf u + \\mathbf v) = A\\mathbf u + A\\mathbf v$ and $A(c\\mathbf u) = cA\\mathbf u$.' },
  ],

  priorCheck: [
    item({ id: 'la-mat.pre1', competency: 'la.dot-product', difficulty: 1, prompt: 'Compute $(2, 1)\\cdot(3, 4)$.', answer: num(10), compute: () => 6 + 4, solution: '$6 + 4 = 10$.', remedy: 'la-dot-product' }),
    item({ id: 'la-mat.pre2', competency: 'la.vector-ops', difficulty: 1, prompt: 'Compute $3(1, 0) + 2(0, 1)$.', answer: multi([3, 2], ['first component', 'second component']), solution: '$(3, 0) + (0, 2) = (3, 2)$.', remedy: 'la-dot-product' }),
  ],

  visualization: {
    lab: 'matrix-transform',
    intro: 'Start with the shear, then try each example. Predict where the unit square goes before you click. “Flatten” is the one to remember.',
    textAlternative: 'The lab draws the transformed grid, the image of the unit square, where the basis vectors land, and a chosen vector x with Ax. A sentence states the matrix, both columns, Ax and det A with what it means; the table lists the images of e₁, e₂, (1, 1) and x.',
    more: [{ lab: 'eigenvectors', intro: 'Most vectors are knocked off their line by a matrix. A few special directions are only stretched: $A\\mathbf v = \\lambda\\mathbf v$. Hunt for them by turning v; the Eigenvalues unit builds on this.' }],
  },

  derivation: {
    intro: 'Three facts, each from linearity and the dot product.',
    steps: [
      { say: 'Any $\\mathbf x = (x_1, x_2)$ is $x_1\\mathbf e_1 + x_2\\mathbf e_2$. Linearity then forces', math: 'A\\mathbf x = x_1\\,A\\mathbf e_1 + x_2\\,A\\mathbf e_2 = x_1\\begin{bmatrix} a\\\\ c\\end{bmatrix} + x_2\\begin{bmatrix} b\\\\ d\\end{bmatrix} = \\begin{bmatrix} a x_1 + b x_2\\\\ c x_1 + d x_2\\end{bmatrix}' },
      { say: 'Doing $A$ and then $B$ is one linear map, $B(A\\mathbf x)$. Its columns are $B$ applied to the columns of $A$, which makes each entry of the product a dot product of a row of $B$ with a column of $A$:', math: '(BA)_{ij} = (\\text{row } i \\text{ of } B)\\cdot(\\text{column } j \\text{ of } A)' },
      { say: 'The unit square lands on the parallelogram spanned by $(a, c)$ and $(b, d)$. For positive entries, subtract the corner triangles and rectangles from the bounding box of size $(a + b)\\times(c + d)$:', math: '(a + b)(c + d) - ac - bd - 2bc = ad - bc = \\det A' },
      { say: 'Every region is made of tiny squares, and each is scaled the same way, so all areas are multiplied by $|\\det A|$. When $\\det A = 0$ the plane is squashed onto a line or a point, information is lost, and $A$ cannot be undone.' },
    ],
    assumptions: ['Vectors are columns and the matrix acts on the left: $A\\mathbf x$.', 'The 2×2 pictures generalize: the same rules hold for $n\\times n$ matrices, with determinant measuring $n$-dimensional volume.'],
    domain: ['A product $BA$ needs as many columns in $B$ as rows in $A$.', '$A$ has an inverse exactly when $\\det A \\ne 0$.'],
  },

  examples: [
    {
      title: 'The shear',
      problem: 'Apply $S = \\begin{bmatrix}1 & 0.5\\\\ 0 & 1\\end{bmatrix}$ to $(2, 4)$ and find $\\det S$.',
      steps: ['First entry: $(1, 0.5)\\cdot(2, 4) = 2 + 2 = 4$.', 'Second entry: $(0, 1)\\cdot(2, 4) = 4$.', '$\\det S = 1\\cdot 1 - 0.5\\cdot 0 = 1$.'],
      answer: '$S(2, 4) = (4, 4)$; areas are unchanged ($\\det = 1$): a shear slants without stretching.',
      check: { value: 4, compute: () => 1 * 2 + 0.5 * 4 },
    },
    {
      title: 'Order matters',
      problem: 'Rotate by 90° with $R = \\begin{bmatrix}0 & -1\\\\ 1 & 0\\end{bmatrix}$, then scale with $D = \\begin{bmatrix}2 & 0\\\\ 0 & 3\\end{bmatrix}$. Apply both to $(1, 1)$ in each order.',
      steps: ['$R(1, 1) = (-1, 1)$, then $D(-1, 1) = (-2, 3)$. As one matrix, $DR = \\begin{bmatrix}0 & -2\\\\ 3 & 0\\end{bmatrix}$.', 'Scale first: $D(1, 1) = (2, 3)$, then $R(2, 3) = (-3, 2)$. Here $RD = \\begin{bmatrix}0 & -3\\\\ 2 & 0\\end{bmatrix}$.'],
      answer: '$(-2, 3)$ versus $(-3, 2)$: $DR \\ne RD$.',
      check: { value: -2, compute: () => 2 * -1 },
    },
  ],

  counterexample: {
    title: 'Maps that are not matrices',
    body: [
      'Shifting every point right by 1, $(x, y) \\mapsto (x + 1, y)$, moves the origin to $(1, 0)$. But $A\\mathbf 0 = \\mathbf 0$ for every matrix, so no 2×2 matrix does this. (Graphics software handles shifts with a 3×3 trick called homogeneous coordinates.)',
      'And matrix multiplication is not commutative: $AB$ and $BA$ are usually different, as the worked example shows. Algebra habits from numbers ($ab = ba$) do not carry over.',
    ],
  },

  predict: {
    prompt: '$A = \\begin{bmatrix}2 & 1\\\\ 4 & 2\\end{bmatrix}$ has fairly large entries. What does it do to the area of the unit square?',
    choices: ['Doubles it', 'Multiplies it by 4', 'Squashes it to zero', 'Multiplies it by 8'],
    answer: 2,
    reveal: '$\\det A = 2\\cdot 2 - 1\\cdot 4 = 0$. Both columns, $(2, 4)$ and $(1, 2)$, point along the same line, so the square collapses onto that line. Try “Flatten” in the lab.',
    misconception: {
      belief: 'Big entries mean a big stretch.',
      correction: 'Area depends on how the columns point relative to each other, measured by $ad - bc$, not on the size of the entries. Parallel columns give zero area however long they are.',
    },
  },

  practice: [
    item({ id: 'la-mat.p1', competency: 'la.matrix-mult', difficulty: 1, level: 'scaffolded', prompt: 'Compute $\\begin{bmatrix}1 & 2\\\\ 3 & 4\\end{bmatrix}\\begin{bmatrix}1\\\\ 1\\end{bmatrix}$. Each entry is a row dotted with $(1, 1)$.', answer: multi([3, 7], ['first entry', 'second entry']), solution: '$(1 + 2, 3 + 4) = (3, 7)$.' }),
    item({ id: 'la-mat.p2', competency: 'la.matrix-mult', difficulty: 1, level: 'scaffolded', prompt: 'Compute $\\det\\begin{bmatrix}3 & 1\\\\ 2 & 4\\end{bmatrix}$ using $ad - bc$.', answer: num(10), compute: () => 3 * 4 - 1 * 2, solution: '$12 - 2 = 10$.' }),
    item({ id: 'la-mat.p3', competency: 'la.matrix-mult', difficulty: 2, level: 'independent', prompt: 'Compute $\\begin{bmatrix}1 & 2\\\\ 0 & 1\\end{bmatrix}\\begin{bmatrix}2 & 0\\\\ 1 & 3\\end{bmatrix}$. Enter the entries row by row.', answer: multi([4, 6, 1, 3], ['row 1, col 1', 'row 1, col 2', 'row 2, col 1', 'row 2, col 2']), hints: ['Entry (1,1) is $(1, 2)\\cdot(2, 1)$.'], solution: '$\\begin{bmatrix}4 & 6\\\\ 1 & 3\\end{bmatrix}$.' }),
    item({ id: 'la-mat.p4', competency: 'la.matrix-mult', difficulty: 2, level: 'independent', prompt: 'Which matrix rotates the plane 90° counter-clockwise?', answer: choice(['$\\begin{bmatrix}0 & -1\\\\ 1 & 0\\end{bmatrix}$', '$\\begin{bmatrix}0 & 1\\\\ -1 & 0\\end{bmatrix}$', '$\\begin{bmatrix}-1 & 0\\\\ 0 & -1\\end{bmatrix}$', '$\\begin{bmatrix}1 & 0\\\\ 0 & -1\\end{bmatrix}$'], 0), feedback: { 1: 'This sends $\\mathbf e_1$ to $(0, -1)$: clockwise.', 2: 'This is a half-turn (180°).', 3: 'This reflects in the x-axis.' }, solution: 'Counter-clockwise sends $\\mathbf e_1 = (1, 0)$ to $(0, 1)$ and $\\mathbf e_2$ to $(-1, 0)$; those are the columns.' }),
    item({ id: 'la-mat.p5', competency: 'la.matrix-mult', difficulty: 2, level: 'independent', prompt: 'What is the determinant of the reflection $\\begin{bmatrix}1 & 0\\\\ 0 & -1\\end{bmatrix}$?', answer: num(-1), compute: () => 1 * -1 - 0, solution: '$-1$: areas are kept, orientation is flipped.' }),
    item({ id: 'la-mat.p6', competency: 'la.matrix-mult', difficulty: 3, level: 'transfer', prompt: 'A region of an image with area 12 cm² is transformed by $\\begin{bmatrix}3 & 1\\\\ 1 & 2\\end{bmatrix}$. What is its new area, in cm²?', answer: num(60), compute: () => 12 * (3 * 2 - 1 * 1), solution: '$\\det = 6 - 1 = 5$, so the area becomes $12 \\times 5 = 60$ cm².' }),
    item({ id: 'la-mat.p7', competency: 'la.matrix-mult', difficulty: 3, level: 'transfer', prompt: 'Which of these cannot be done by any 2×2 matrix?', answer: choice(['Rotate by 30°', 'Reflect in the line y = x', 'Shift everything 1 unit to the right', 'Stretch x by a factor of 3'], 2), feedback: { 1: 'That reflection swaps coordinates: $\\begin{bmatrix}0 & 1\\\\ 1 & 0\\end{bmatrix}$.' }, solution: 'A shift moves the origin; every matrix keeps $\\mathbf 0$ fixed.' }),
  ],

  checkpoint: [
    item({ id: 'la-mat.c1', competency: 'la.matrix-mult', difficulty: 1, prompt: 'Compute $\\begin{bmatrix}2 & 0\\\\ 1 & 1\\end{bmatrix}\\begin{bmatrix}3\\\\ -1\\end{bmatrix}$.', answer: multi([6, 2], ['first entry', 'second entry']), solution: '$(2\\cdot 3 + 0,\\ 3 - 1) = (6, 2)$.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Dot each row with $(3, -1)$.' }),
    item({ id: 'la-mat.c2', competency: 'la.matrix-mult', difficulty: 2, prompt: 'Compute $\\det\\begin{bmatrix}1 & 4\\\\ 2 & 3\\end{bmatrix}$.', answer: num(-5), compute: () => 3 - 8, solution: '$3 - 8 = -5$: areas ×5, orientation flipped.', feedbackCorrect: 'Right — negative is meaningful.', feedbackIncorrect: '$ad - bc$ with $a = 1, b = 4, c = 2, d = 3$.' }),
    item({ id: 'la-mat.c3', competency: 'la.matrix-mult', difficulty: 3, prompt: 'For $A = \\begin{bmatrix}1 & 1\\\\ 0 & 1\\end{bmatrix}$ and $B = \\begin{bmatrix}1 & 0\\\\ 1 & 1\\end{bmatrix}$, is $AB = BA$?', answer: choice(['Yes — both are shears', 'No: $AB = \\begin{bmatrix}2 & 1\\\\ 1 & 1\\end{bmatrix}$ but $BA = \\begin{bmatrix}1 & 1\\\\ 1 & 2\\end{bmatrix}$', 'Only when applied to (1, 1)', 'The products are not defined'], 1), solution: 'Compute both products entry by entry: they differ.', feedbackCorrect: 'Right.', feedbackIncorrect: 'Compute both products entry by entry.' }),
  ],

  python: {
    intro: 'NumPy uses `@` for matrix products, and `np.linalg.det` for determinants (computed in floating point, so test closeness, never equality).',
    code: `import numpy as np

S = np.array([[1.0, 0.5], [0.0, 1.0]])   # shear
print(S @ np.array([2.0, 4.0]))
print(np.linalg.det(S))

R = np.array([[0, -1], [1, 0]])           # rotate 90 degrees
D = np.array([[2, 0], [0, 3]])            # scale
print(D @ R)
print((D @ R) @ np.array([1, 1]), (R @ D) @ np.array([1, 1]))
print(abs(np.linalg.det(np.array([[2.0, 1.0], [4.0, 2.0]]))) < 1e-12)`,
    output: '[4. 4.]\n1.0\n[[ 0 -2]\n [ 3  0]]\n[-2  3] [-3  2]\nTrue',
    explain: 'The last line is the “Flatten” matrix: its determinant is zero up to rounding.',
  },

  reading: [
    { title: 'Matrices and Matrix Operations (§7.5)', source: 'OpenStax, College Algebra 2e', url: 'https://openstax.org/books/college-algebra-2e/pages/7-5-matrices-and-matrix-operations', note: 'Matrix arithmetic and multiplication practice.' },
    { title: 'Lecture 30: Linear transformations and their matrices', source: 'MIT OpenCourseWare 18.06, Gilbert Strang', url: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-30-linear-transformations-and-their-matrices/', note: 'The “columns are where the basis goes” view, in general.' },
  ],
};
