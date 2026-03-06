export function formatCamelName(name: string) {
  return (
    name
      // Add space between camelCase / PascalCase words
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      // Replace underscores with spaces
      .replace(/_/g, " ")
      // Normalize casing, then capitalize each word
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}
