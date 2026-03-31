export function generateSubscriptionId(name: string) {
  const prefix = name.replace(/\s+/g, "").slice(0, 2).toUpperCase();

  const numbers = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");

  return `${prefix}${numbers}`;
}
