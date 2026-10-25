# Course research — what to learn from established resources

Comparative design research, not a ranking: no effectiveness figures are claimed for any course. Every characteristic and licence below was read from the resource's own page on **2026-10-24** (fetched or opened in a browser); where a page did not state something, that is said.

| Resource | Verified on its page | What Formula Intelligence adopts | What it does not copy |
|---|---|---|---|
| **MIT OCW 18.06SC Linear Algebra** (Strang, Fall 2011) — ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011 | Lecture videos, summary notes with readings, recitation **problem-solving videos**, problem sets **with solutions**, exams with solutions; three units (Ax = b and the four subspaces; least squares, determinants, eigenvalues; positive definite matrices and applications) | Every lesson pairs explanation with genuinely worked problems and checkable answers; units are few and ordered | A university-scale catalogue on every screen |
| **MIT OCW 18.065 Matrix Methods in Data Analysis, Signal Processing and ML** (Strang, Spring 2018) | Description: reviews linear algebra "with applications to probability and statistics and optimization", explains deep learning; resources include problem sets and a final project | Explicit bridges from linear algebra to data (the matrix-scoring lesson; PCA; least squares) | Advanced material before its prerequisites |
| **Google Machine Learning Crash Course** — developers.google.com/machine-learning/crash-course | Modules ML Models → Data → Advanced → Real-world ML; "interactive visualizations, and hands-on practice exercises"; exercises page: "check your understanding" questions, interactive exercises, final quizzes, **programming exercises in Colab** | Short steps with an immediate check; programming exercises that need no setup; a quiz at the end of each topic | A large module menu; infrastructure before essentials |
| **Khan Academy** — khanacademy.org/math | Ordered pathways (e.g. Algebra 1: "182 skills"); skill levels **Mastered / Proficient / Familiar / Attempted / Not started**; quizzes, unit tests, a course challenge; "Not feeling ready for this? Check out Get ready for Algebra 1" | Small prerequisite steps; mastery shown per skill; a "not ready? start earlier" route from placement | Points, badges and streak pressure |
| **3Blue1Brown** — 3blue1brown.com, Linear Algebra and Calculus topics | Linear algebra: 16 lessons ("An introduction to visualizing what matrices are really doing"); Calculus: 17 lessons ("Visual introductions to the core ideas…"), e.g. *Linear transformations and matrices*, *The paradox of the derivative* | One focused visual per lesson, when it clarifies (the "See it" step) | Animation as decoration |
| **fast.ai Practical Deep Learning for Coders** — course.fast.ai | Free; "designed for people … with some coding experience"; top-down: start with working models on real problems, explain how they work later; "We always teach through examples"; 9 lessons of ~90 minutes; Jupyter/Kaggle notebooks | Work backward from a meaningful task: every V4 exemplar lesson opens with a decision, and projects lead with the question | Deep learning as the first module for beginners |
| **OpenStax** — openstax.org/subjects/math | Free textbooks: Prealgebra 2e, Elementary/Intermediate Algebra 2e, Algebra 1, College Algebra 2e, Algebra and Trigonometry 2e, Precalculus 2e, Calculus Vol. 1–3, Introductory Statistics 2e, **Principles of Data Science** | Coverage check for definitions and examples; linked as further reading | Copying pages |

## Licences — what this means for reuse

| Resource | Licence as stated (2026-10-24) | Our use |
|---|---|---|
| MIT OCW 18.06SC, 18.065 | Page links "Creative Commons License" → **CC BY-NC-SA 4.0** | Link only. Nothing copied; no adaptation planned (ShareAlike would bind our content). |
| Google MLCC | Content **CC BY 4.0**; code samples **Apache 2.0** (exercises page) | Link only; reuse would be permitted with attribution, not needed. |
| Khan Academy | Terms of service: "Licensed Educational Content" for personal, non-commercial use unless an alternate licence is expressly indicated | Link only. |
| 3Blue1Brown | "© 2026 Grant Sanderson"; no reuse licence on the topic pages | Link only. |
| fast.ai course page | No licence statement on the page | Link only. |
| OpenStax (Prealgebra 2e checked) | "licensed under Creative Commons Attribution-NonCommercial-ShareAlike License v4.0" — **not CC BY**, contrary to a common assumption | Link only (already the case: lessons cite OpenStax sections as further reading; no text copied). |

## Datasets for the applied projects (verified at source, 2026-10-24)

| Dataset | Licence / terms | Facts checked in the downloaded file |
|---|---|---|
| Palmer Penguins (Gorman, Williams & Fraser 2014; Palmer Station LTER) — github.com/allisonhorst/palmerpenguins | "Data are available by CC-0 license" | 344 rows, 8 columns; missing: 2 in each measurement column, 11 in `sex`; Adelie 152, Gentoo 124, Chinstrap 68 |
| Met Office Hadley Centre Central England Temperature (HadCET), monthly means | "freely available for use under Open Government License"; acknowledge the source | 1659–2026; °C; Oct–Dec 2026 coded `-99.9` (not yet recorded) |
| Breast Cancer Wisconsin (Diagnostic), UCI ML Repository, DOI 10.24432/C5DW2B (Wolberg, Mangasarian, Street & Street 1993) | **CC BY 4.0** | 569 rows, 30 features; 357 benign, 212 malignant |

## Design principles taken forward

1. **Start from a problem** (fast.ai, MLCC): a lesson opens with a decision, not a definition.
2. **One visual, when it earns its place** (3Blue1Brown).
3. **Check immediately, then transfer** (MLCC checks; Khan mastery; MIT problem sets with solutions).
4. **Small ordered steps with a way back** (Khan "get ready" routes → our "start earlier" choice).
5. **Theory at the point of need** (fast.ai): derivations sit behind "Go deeper", never in the way.
6. **Bridges to data** (MIT 18.065): each mathematical idea ends in a real use with real or clearly labelled synthetic data.
