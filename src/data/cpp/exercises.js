// "Write it in C++" exercises (V5.1 §6 baseline: downloadable .cpp files,
// tested reference solutions, local g++/clang++ instructions).
//
// The browser cannot compile C++, so these are done on the learner's own
// computer: download the starter, fill in the function, compile, run. The
// file ends with its own tests, which print PASS/FAIL per case. In CI,
// scripts/verify-cpp.mjs compiles every reference solution (it must pass
// every test) and every starter (it must compile and fail at least one).
//
// Exercise fields:
//   id, lesson, competency, title, file   (file: the download's name)
//   prompt      MathText shown on the page
//   type        the function's return type: 'int' | 'long long' | 'double' | 'bool' | 'std::string'
//   starter     the learner's starting point — compiles, but is wrong
//   solution    a reference implementation
//   tests       [{ name, call, expect }] — `call` is a C++ expression, `expect` a C++ literal

export const CPP_EXERCISES = [
  {
    id: 'cpp.count-below',
    lesson: 'cpp-loops-trace',
    competency: 'cpp.basics',
    title: 'Count the slow hours',
    file: 'count_below.cpp',
    prompt: 'Write `countBelow(v, limit)`: the number of values in `v` that are strictly below `limit`. The bakery log `{12, 30, 41, 28, 15, 9, 4}` with limit 10 should give 2.',
    type: 'int',
    starter: `#include <vector>

// Return how many values in v are strictly less than limit.
int countBelow(const std::vector<int>& v, int limit) {
    int count = 0;
    // TODO: loop over v and add 1 to count for each value below limit.
    (void)v;
    (void)limit;
    return count;
}`,
    solution: `#include <vector>

// Return how many values in v are strictly less than limit.
int countBelow(const std::vector<int>& v, int limit) {
    int count = 0;
    for (int x : v) {
        if (x < limit) ++count;
    }
    return count;
}`,
    tests: [
      { name: 'the bakery log', call: 'countBelow({12, 30, 41, 28, 15, 9, 4}, 10)', expect: '2' },
      { name: 'an empty log', call: 'countBelow({}, 10)', expect: '0' },
      { name: 'a value equal to the limit is not below it', call: 'countBelow({10, 10, 9}, 10)', expect: '1' },
      { name: 'negative readings', call: 'countBelow({-3, 0, 5}, 0)', expect: '1' },
    ],
  },
];

export const cppExerciseById = Object.fromEntries(CPP_EXERCISES.map((e) => [e.id, e]));
export const cppExercisesFor = (lessonId) => CPP_EXERCISES.filter((e) => e.lesson === lessonId);

/** The tests appended to every download: one PASS/FAIL line per case, exit 1 on any failure. */
export function harness(ex) {
  const cmp = ex.type === 'double' ? 'std::fabs(got - want) <= 1e-9 * (1 + std::fabs(want))' : 'got == want';
  return `
// ---------------------------------------------------------------------------
// Tests — do not edit below this line. Compile and run:
//   g++ -std=c++17 -Wall -Wextra -o ${ex.file.replace(/\.cpp$/, '')} ${ex.file}
//   ./${ex.file.replace(/\.cpp$/, '')}
// ---------------------------------------------------------------------------
#include <cmath>
#include <iostream>
#include <string>

template <typename T>
static bool check(const char* name, const T& got, const T& want) {
    const bool ok = ${cmp};
    std::cout << (ok ? "PASS " : "FAIL ") << name;
    if (!ok) std::cout << ": got " << got << ", expected " << want;
    std::cout << "\\n";
    return ok;
}

int main() {
    int failed = 0;
${ex.tests.map((t) => `    if (!check<${ex.type}>(${JSON.stringify(t.name)}, ${t.call}, ${ex.type === 'std::string' ? `std::string(${t.expect})` : t.expect})) ++failed;`).join('\n')}
    if (failed > 0) {
        std::cout << failed << " test(s) failed\\n";
        return 1;
    }
    std::cout << "all tests passed\\n";
    return 0;
}
`;
}

/** The complete file: the starter or the reference, followed by the tests. */
export function exerciseSource(ex, which = 'starter') {
  return `${ex[which]}\n${harness(ex)}`;
}
