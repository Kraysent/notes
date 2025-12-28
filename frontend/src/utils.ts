export function generateId(obj: unknown): string {
  const jsonStr = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `checkbox-${Math.abs(hash).toString(36)}`;
}

