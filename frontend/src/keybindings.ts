import keybindings from './keybindings.json'

type KeyBinding = string[]

function getKeybinding(key: string): KeyBinding | null {
  const keys = key.split('.')
  let value: any = keybindings
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      console.warn(`Keybinding key not found: ${key}`)
      return null
    }
  }
  
  if (Array.isArray(value)) {
    return value
  }
  
  console.warn(`Keybinding key "${key}" does not point to an array value`)
  return null
}

function matchesKeybinding(event: globalThis.KeyboardEvent, binding: KeyBinding): boolean {
  const pressedKeys = new Set<string>()
  
  if (event.shiftKey) pressedKeys.add('Shift')
  if (event.ctrlKey) pressedKeys.add('Control')
  if (event.altKey) pressedKeys.add('Alt')
  if (event.metaKey) pressedKeys.add('Meta')
  
  const mainKey = event.key
  if (mainKey && mainKey !== 'Shift' && mainKey !== 'Control' && mainKey !== 'Alt' && mainKey !== 'Meta') {
    pressedKeys.add(mainKey)
  }
  
  const bindingSet = new Set(binding)
  
  if (pressedKeys.size !== bindingSet.size) {
    return false
  }
  
  for (const key of pressedKeys) {
    if (!bindingSet.has(key)) {
      return false
    }
  }
  
  return true
}

export { getKeybinding, matchesKeybinding }

