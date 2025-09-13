### Answers to Questions

**1) What is the difference between var, let, and const?**
- `var` is function-scoped, can be redeclared and updated, and is hoisted. `let` is block-scoped, can be updated but not redeclared in the same scope. `const` is block-scoped and cannot be updated or redeclared; its value is constant after assignment.

**2) What is the difference between map(), forEach(), and filter()?**
- `map()` returns a new array with the results of calling a function on every element. `forEach()` executes a function for each element but returns undefined. `filter()` returns a new array with elements that pass a test provided by a function.

**3) What are arrow functions in ES6?**
- Arrow functions are a concise way to write functions using the `=>` syntax. They do not have their own `this`, `arguments`, or `super` and are best for non-method functions.

**4) How does destructuring assignment work in ES6?**
- Destructuring allows unpacking values from arrays or properties from objects into distinct variables, e.g. `const [a, b] = arr;` or `const {x, y} = obj;`.

**5) Explain template literals in ES6. How are they different from string concatenation?**
- Template literals use backticks (`` ` ``) and allow embedded expressions with `${}`. They support multi-line strings and are more readable than string concatenation using `+`.
