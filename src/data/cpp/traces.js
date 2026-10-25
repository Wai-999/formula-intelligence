// C++ programs the trace lab steps through (src/features/labs/TraceLab.jsx).
//
// Each program has three parts:
//   code          what the learner reads — a complete, compilable C++17 file
//   output        what it prints, exactly
//   trace         one string per step: "L<line> name=value … | printed": the
//                 values of every variable in scope AFTER that line runs,
//                 then (after " | ") whatever that line printed; several
//                 printed lines are joined with "⏎"
//   instrumented  the same program with print statements that emit the
//                 trace, each snapshot prefixed with "@" and printed AFTER
//                 the line it describes (so the program's own output first)
//
// Nothing here is typed in by hand and trusted: scripts/verify-cpp.mjs
// compiles `code` and checks its output, then compiles `instrumented` and
// checks that it prints exactly `trace` (and the same output). A trace that
// drifts from the real program fails CI.

export const TRACES = {
  'cafe-total': {
    title: 'Adding up hourly sales',
    file: 'cafe_total.cpp',
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> cups = {14, 9, 21};
    int total = 0;
    for (int h = 0; h < 3; ++h) {
        total += cups[h];
    }
    std::cout << total << "\\n";
}`,
    output: '44',
    notes: {
      5: 'The vector holds three hourly sales.',
      6: 'The running total starts at 0.',
      7: 'The loop checks h < 3. While it is true, the body runs.',
      8: 'The body adds this hour to the total.',
      10: 'The loop has ended (h reached 3); the total is printed.',
    },
    trace: [
      'L5 cups={14,9,21}',
      'L6 cups={14,9,21} total=0',
      'L7 cups={14,9,21} total=0 h=0',
      'L8 cups={14,9,21} total=14 h=0',
      'L7 cups={14,9,21} total=14 h=1',
      'L8 cups={14,9,21} total=23 h=1',
      'L7 cups={14,9,21} total=23 h=2',
      'L8 cups={14,9,21} total=44 h=2',
      'L7 cups={14,9,21} total=44 h=3',
      'L10 cups={14,9,21} total=44 | 44',
    ],
    instrumented: `#include <iostream>
#include <string>
#include <vector>

static std::string list(const std::vector<int>& v) {
    std::string s = "{";
    for (std::size_t i = 0; i < v.size(); ++i) s += (i ? "," : "") + std::to_string(v[i]);
    return s + "}";
}

int main() {
    std::vector<int> cups = {14, 9, 21};
    std::cout << "@L5 cups=" << list(cups) << "\\n";
    int total = 0;
    std::cout << "@L6 cups=" << list(cups) << " total=" << total << "\\n";
    for (int h = 0; (std::cout << "@L7 cups=" << list(cups) << " total=" << total << " h=" << h << "\\n", h < 3); ++h) {
        total += cups[h];
        std::cout << "@L8 cups=" << list(cups) << " total=" << total << " h=" << h << "\\n";
    }
    std::cout << total << "\\n";
    std::cout << "@L10 cups=" << list(cups) << " total=" << total << "\\n";
}`,
  },
};

/**
 * "L8 total=14 h=0" → { line: 8, vars: [['total', '14'], ['h', '0']], prints: [] };
 * "L10 total=44 | 44" → { …, prints: ['44'] }.
 */
export function parseStep(s) {
  const bar = s.indexOf(' | ');
  const state = bar === -1 ? s : s.slice(0, bar);
  const prints = bar === -1 ? [] : s.slice(bar + 3).split('⏎');
  const [head, ...pairs] = state.split(' ');
  return { line: Number(head.slice(1)), vars: pairs.map((p) => [p.slice(0, p.indexOf('=')), p.slice(p.indexOf('=') + 1)]), prints };
}
