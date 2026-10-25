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
    annotations: [
      'A for-loop checks its condition before every pass — including the last check, which fails and ends the loop.',
      'A variable declared in the for-statement (like h) stops existing when the loop ends.',
    ],
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

  'fee-copy-vs-ref': {
    title: 'A copy versus a reference',
    file: 'fees.cpp',
    code: `#include <iostream>
#include <vector>

void addFee(std::vector<int> prices) {
    for (int& p : prices) p += 2;
}

void addFeeRef(std::vector<int>& prices) {
    for (int& p : prices) p += 2;
}

int main() {
    std::vector<int> cart = {5, 8};
    addFee(cart);
    std::cout << cart[0] << " " << cart[1] << "\\n";
    addFeeRef(cart);
    std::cout << cart[0] << " " << cart[1] << "\\n";
}`,
    output: '5 8\n7 10',
    notes: {
      13: 'main’s cart holds two prices.',
      4: 'The call copies cart into a brand-new vector named prices.',
      5: 'The loop adds the fee to the copy only.',
      14: 'addFee has returned and its copy is gone: cart is unchanged.',
      8: 'This time prices is another name for cart itself — nothing is copied.',
      9: 'Adding the fee through the reference changes cart.',
    },
    annotations: [
      'A parameter declared as std::vector<int> receives a copy; std::vector<int>& receives the caller’s own vector.',
      'Use const std::vector<int>& to avoid the copy when the function only reads the data.',
    ],
    trace: [
      'L13 main.cart={5,8}',
      'L4 main.cart={5,8} prices={5,8}',
      'L5 main.cart={5,8} prices={7,10}',
      'L14 main.cart={5,8}',
      'L15 main.cart={5,8} | 5 8',
      'L8 main.cart={5,8} prices(alias)={5,8}',
      'L9 main.cart={7,10} prices(alias)={7,10}',
      'L16 main.cart={7,10}',
      'L17 main.cart={7,10} | 7 10',
    ],
    instrumented: `#include <iostream>
#include <string>
#include <vector>

static std::string list(const std::vector<int>& v) {
    std::string s = "{";
    for (std::size_t i = 0; i < v.size(); ++i) s += (i ? "," : "") + std::to_string(v[i]);
    return s + "}";
}

static const std::vector<int>* cartPtr = nullptr;

void addFee(std::vector<int> prices) {
    std::cout << "@L4 main.cart=" << list(*cartPtr) << " prices=" << list(prices) << "\\n";
    for (int& p : prices) p += 2;
    std::cout << "@L5 main.cart=" << list(*cartPtr) << " prices=" << list(prices) << "\\n";
}

void addFeeRef(std::vector<int>& prices) {
    std::cout << "@L8 main.cart=" << list(*cartPtr) << " prices(alias)=" << list(prices) << "\\n";
    for (int& p : prices) p += 2;
    std::cout << "@L9 main.cart=" << list(*cartPtr) << " prices(alias)=" << list(prices) << "\\n";
}

int main() {
    std::vector<int> cart = {5, 8};
    cartPtr = &cart;
    std::cout << "@L13 main.cart=" << list(cart) << "\\n";
    addFee(cart);
    std::cout << "@L14 main.cart=" << list(cart) << "\\n";
    std::cout << cart[0] << " " << cart[1] << "\\n";
    std::cout << "@L15 main.cart=" << list(cart) << "\\n";
    addFeeRef(cart);
    std::cout << "@L16 main.cart=" << list(cart) << "\\n";
    std::cout << cart[0] << " " << cart[1] << "\\n";
    std::cout << "@L17 main.cart=" << list(cart) << "\\n";
}`,
  },

  'oven-lifetime': {
    title: 'When constructors and destructors run',
    file: 'ovens.cpp',
    code: `#include <iostream>
#include <string>
#include <utility>

class Oven {
public:
    explicit Oven(std::string name) : name_(std::move(name)) {
        std::cout << "heat " << name_ << "\\n";
    }
    ~Oven() {
        std::cout << "cool " << name_ << "\\n";
    }
private:
    std::string name_;
};

int main() {
    Oven a("A");
    {
        Oven b("B");
        std::cout << "baking\\n";
    }
    std::cout << "closing\\n";
}`,
    output: 'heat A\nheat B\nbaking\ncool B\nclosing\ncool A',
    notes: {
      8: 'A constructor runs when an object is created (here, for the line in main that declares it).',
      21: 'Both ovens exist while the inner block runs.',
      11: 'A destructor runs automatically when an object goes out of scope.',
      23: 'Only A is still alive: B died at the inner block’s closing brace.',
    },
    annotations: [
      'Objects are destroyed in the reverse order of their creation, automatically, when their scope ends.',
      'This is RAII: tie a resource (an oven, a file, memory) to an object, and the destructor releases it on every path out of the scope.',
    ],
    trace: [
      'L8 alive={A} | heat A',
      'L8 alive={A,B} | heat B',
      'L21 alive={A,B} | baking',
      'L11 alive={A} | cool B',
      'L23 alive={A} | closing',
      'L11 alive={} | cool A',
    ],
    instrumented: `#include <algorithm>
#include <iostream>
#include <string>
#include <utility>
#include <vector>

static std::vector<std::string> alive;

static std::string names() {
    std::string s = "{";
    for (std::size_t i = 0; i < alive.size(); ++i) s += (i ? "," : "") + alive[i];
    return s + "}";
}

class Oven {
public:
    explicit Oven(std::string name) : name_(std::move(name)) {
        alive.push_back(name_);
        std::cout << "heat " << name_ << "\\n";
        std::cout << "@L8 alive=" << names() << "\\n";
    }
    ~Oven() {
        std::cout << "cool " << name_ << "\\n";
        alive.erase(std::find(alive.begin(), alive.end(), name_));
        std::cout << "@L11 alive=" << names() << "\\n";
    }
private:
    std::string name_;
};

int main() {
    Oven a("A");
    {
        Oven b("B");
        std::cout << "baking\\n";
        std::cout << "@L21 alive=" << names() << "\\n";
    }
    std::cout << "closing\\n";
    std::cout << "@L23 alive=" << names() << "\\n";
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
