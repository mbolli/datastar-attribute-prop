// Datastar Attribute Plugin: data-prop
// Custom attribute binding to sync element properties with signals

import type { 
    AttributePlugin,
    Effect
} from 'datastar/library/src/engine/types'

export default function propPlugin(effect: (fn: () => void) => Effect): AttributePlugin<{ value: 'must' }, true> {
    return {
        name: 'prop',
        requirement: {
            value: 'must',
        },
        returnsValue: true,
        apply({ el, key, rx }) {
            const update = key
                ? () => { // Single property
                    observer.disconnect()
                    const val = rx!()
                    ;(el as any)[key] = val
                    observer.observe(el, { attributeFilter: [key] })
                }
                : () => { // Multiple properties
                    observer.disconnect()
                    const obj = rx!() as Record<string, any>
                    const attributeFilter = Object.keys(obj)
                    for (const key of attributeFilter) {
                        ;(el as any)[key] = obj[key]
                    }
                    observer.observe(el, { attributeFilter })
                }
            const observer = new MutationObserver(update)
            const cleanup = effect(update)

            return () => {
                observer.disconnect()
                cleanup()
            }
        }
    }
}
