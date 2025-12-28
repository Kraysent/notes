import texts from "./texts.json";

type TextKey = string;

function getText(key: TextKey): string {
  const keys = key.split(".");
  let value: unknown = texts;

  for (const k of keys) {
    if (value && typeof value === "object" && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Text key not found: ${key}`);
      return key;
    }
  }

  if (typeof value === "string") {
    return value;
  }

  console.warn(`Text key "${key}" does not point to a string value`);
  return key;
}

export { getText };
