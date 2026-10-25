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
  {
    id: 'cpp.average-valid',
    lesson: 'cpp-functions-vectors',
    competency: 'cpp.functions',
    title: 'Average only the valid readings',
    file: 'average_valid.cpp',
    prompt: 'A sensor writes −1 when it fails. Write `averageValid(v)`: the mean of the readings that are not negative, or 0.0 when there are none. Take `v` by `const` reference — the function only reads it.',
    type: 'double',
    starter: `#include <vector>

// Mean of the non-negative readings in v; 0.0 if there are none.
double averageValid(const std::vector<double>& v) {
    double sum = 0.0;
    int n = 0;
    // TODO: add up the non-negative readings and count them.
    (void)v;
    (void)sum;
    (void)n;
    return 0.0;
}`,
    solution: `#include <vector>

// Mean of the non-negative readings in v; 0.0 if there are none.
double averageValid(const std::vector<double>& v) {
    double sum = 0.0;
    int n = 0;
    for (double x : v) {
        if (x >= 0.0) {
            sum += x;
            ++n;
        }
    }
    return n == 0 ? 0.0 : sum / n;
}`,
    tests: [
      { name: 'skips a failed reading', call: 'averageValid({2.0, 4.0, -1.0})', expect: '3.0' },
      { name: 'no readings at all', call: 'averageValid({})', expect: '0.0' },
      { name: 'only failed readings', call: 'averageValid({-1.0, -1.0})', expect: '0.0' },
      { name: 'zero is a valid reading', call: 'averageValid({0.0, 10.0})', expect: '5.0' },
      { name: 'a single reading', call: 'averageValid({1.5})', expect: '1.5' },
    ],
  },
  {
    id: 'cpp.inventory-invariant',
    lesson: 'cpp-classes-invariants',
    competency: 'cpp.oop',
    title: 'An inventory that can never go negative',
    file: 'inventory.cpp',
    prompt: 'Finish the `Inventory` class so its count can never be negative: the constructor and `add` throw `std::invalid_argument` for negative numbers, and `remove(n)` returns `false` and changes nothing when `n` is negative or more than the stock.',
    type: 'int',
    starter: `#include <stdexcept>

// Stock of one product. Invariant (to enforce): count_ is never negative.
class Inventory {
public:
    explicit Inventory(int start) : count_(start) {
        // TODO: throw std::invalid_argument if start is negative.
    }
    bool remove(int n) {
        // TODO: refuse (return false) when n is negative or larger than count_.
        count_ -= n;
        return true;
    }
    void add(int n) {
        // TODO: throw std::invalid_argument if n is negative.
        count_ += n;
    }
    int count() const { return count_; }

private:
    int count_;
};`,
    solution: `#include <stdexcept>

// Stock of one product. Invariant: count_ is never negative.
class Inventory {
public:
    explicit Inventory(int start) : count_(start) {
        if (start < 0) throw std::invalid_argument("negative starting stock");
    }
    bool remove(int n) {
        if (n < 0 || n > count_) return false;
        count_ -= n;
        return true;
    }
    void add(int n) {
        if (n < 0) throw std::invalid_argument("negative delivery");
        count_ += n;
    }
    int count() const { return count_; }

private:
    int count_;
};`,
    tests: [
      { name: 'remove within the stock', call: '[] { Inventory s(10); s.remove(3); return s.count(); }()', expect: '7' },
      { name: 'removing more than the stock is refused', call: '[] { Inventory s(5); bool ok = s.remove(8); return ok ? -1 : s.count(); }()', expect: '5' },
      { name: 'removing a negative amount is refused', call: '[] { Inventory s(5); bool ok = s.remove(-2); return ok ? -1 : s.count(); }()', expect: '5' },
      { name: 'add, then remove everything', call: '[] { Inventory s(0); s.add(4); s.remove(4); return s.count(); }()', expect: '0' },
      { name: 'a negative starting stock throws', call: '[] { try { Inventory s(-2); return s.count(); } catch (const std::invalid_argument&) { return -1; } }()', expect: '-1' },
      { name: 'a negative delivery throws and changes nothing', call: '[] { Inventory s(2); try { s.add(-3); } catch (const std::invalid_argument&) { return s.count(); } return -1; }()', expect: '2' },
    ],
  },
  {
    id: 'cpp.longest-wait',
    lesson: 'ds-stacks-queues',
    competency: 'ds.linear',
    title: 'The longest wait in a queue',
    file: 'longest_wait.cpp',
    prompt: 'Patients are seen first come, first served by one doctor; each visit takes `serviceMinutes`. Given the arrival times in order, return the longest time anyone waits before being seen. Arrivals `{0, 2, 3, 10}` with 5-minute visits give 7.',
    type: 'int',
    starter: `#include <algorithm>
#include <vector>

// Longest wait (in minutes) before being seen, first come first served,
// one server, each visit serviceMinutes long. arrivals is in time order.
int longestWait(const std::vector<int>& arrivals, int serviceMinutes) {
    int nextFree = 0;  // when the doctor is next free
    int worst = 0;
    // TODO: for each arrival, start = later of (arrival, nextFree);
    //       update worst and nextFree.
    (void)arrivals;
    (void)serviceMinutes;
    (void)nextFree;
    return worst;
}`,
    solution: `#include <algorithm>
#include <vector>

// Longest wait (in minutes) before being seen, first come first served,
// one server, each visit serviceMinutes long. arrivals is in time order.
int longestWait(const std::vector<int>& arrivals, int serviceMinutes) {
    int nextFree = 0;  // when the doctor is next free
    int worst = 0;
    for (int a : arrivals) {
        int start = std::max(a, nextFree);
        worst = std::max(worst, start - a);
        nextFree = start + serviceMinutes;
    }
    return worst;
}`,
    tests: [
      { name: 'the clinic morning', call: 'longestWait({0, 2, 3, 10}, 5)', expect: '7' },
      { name: 'nobody arrives', call: 'longestWait({}, 5)', expect: '0' },
      { name: 'one patient never waits', call: 'longestWait({4}, 5)', expect: '0' },
      { name: 'three arrive together', call: 'longestWait({0, 0, 0}, 4)', expect: '8' },
      { name: 'arrivals spaced out', call: 'longestWait({0, 10, 20}, 5)', expect: '0' },
    ],
  },
  {
    id: 'cpp.sensor-mean',
    project: 'proj.sensor-log',
    competency: 'cpp.functions',
    title: 'Validate sensor readings in C++',
    file: 'sensor_mean.cpp',
    prompt: 'Write `meanValid(values)`: the mean of the readings that parse completely as numbers and lie between −40 and 60 °C, or 0.0 if none do. Empty strings, text such as `"ERR"`, trailing junk such as `"21.5abc"`, and out-of-range values are skipped.',
    type: 'double',
    starter: `#include <cstdlib>
#include <string>
#include <vector>

// Mean of the valid readings (numbers from -40 to 60); 0.0 if none are valid.
double meanValid(const std::vector<std::string>& values) {
    // TODO: skip values that are empty, not numbers, or outside -40..60.
    // This naive version averages everything atof can read.
    double sum = 0.0;
    for (const std::string& v : values) sum += std::atof(v.c_str());
    return values.empty() ? 0.0 : sum / static_cast<double>(values.size());
}`,
    solution: `#include <cstddef>
#include <stdexcept>
#include <string>
#include <vector>

// Mean of the valid readings (numbers from -40 to 60); 0.0 if none are valid.
double meanValid(const std::vector<std::string>& values) {
    double sum = 0.0;
    int n = 0;
    for (const std::string& v : values) {
        double x = 0.0;
        std::size_t used = 0;
        try {
            x = std::stod(v, &used);
        } catch (const std::invalid_argument&) {
            continue;  // empty or not a number
        } catch (const std::out_of_range&) {
            continue;  // too large for a double
        }
        if (used != v.size()) continue;  // trailing junk such as "21.5abc"
        if (x < -40.0 || x > 60.0) continue;
        sum += x;
        ++n;
    }
    return n == 0 ? 0.0 : sum / n;
}`,
    tests: [
      { name: 'the greenhouse morning', call: 'meanValid({"18.2", "18.9", "", "19.6", "ERR", "21.4", "-999", "23.1", "85.0", "24.8", "25.3", "26.0", "26.4"})', expect: '203.7 / 9' },
      { name: 'nothing valid', call: 'meanValid({"", "ERR", "-999"})', expect: '0.0' },
      { name: 'trailing junk is rejected', call: 'meanValid({"21.5", "21.5abc"})', expect: '21.5' },
      { name: 'the range limits are valid', call: 'meanValid({"-40", "60"})', expect: '10.0' },
      { name: 'no readings at all', call: 'meanValid({})', expect: '0.0' },
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
