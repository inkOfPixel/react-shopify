function greeter(person: string) {
  return `Hello ${person}`;
}

interface Person {
  name?: {
    first: string;
    last: string;
  };
}

console.log(greeter("Macs"));

let person: Person = {};

export const answer = 42;

export { greeter };
