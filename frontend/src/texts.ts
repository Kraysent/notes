import texts from './texts.json'

type TextKey = string

function getText(key: TextKey): string {
  const keys = key.split('.')
  let value: any = texts
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Text key not found: ${key}`)
      return key
    }
  }
  
  if (typeof value === 'string') {
    return value
  }
  
  console.warn(`Text key "${key}" does not point to a string value`)
  return key
}

export { getText }

