// Datastar Attribute Plugin: data-prop
// Custom attribute binding to sync element properties with signals

import type { 
    AttributePlugin,
    Effect
} from 'datastar/library/src/engine/types'

// Auto-register with datastar if available from importmap
if (typeof window !== 'undefined') {
    // Try to import datastar dynamically if it's available via importmap
    (async () => {
        try {
            // @ts-ignore - datastar may be available via importmap at runtime
            const datastar = await import('datastar')
            if (datastar?.attribute && datastar?.effect) {
                datastar.attribute(propPlugin(datastar.effect))
                console.log('✅ Datastar prop plugin auto-registered')
            }
        } catch (e) {
            // Datastar not available via importmap, plugin needs manual registration
        }
    })()
}

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
                    const val = rx!()
                    ;(el as any)[key] = val
                }
                : () => { // Multiple properties
                    const obj = rx!() as Record<string, any>
                    for (const key of Object.keys(obj)) {
                        ;(el as any)[key] = obj[key]
                    }
                }
            
            const cleanup = effect(update)

            return cleanup
        }
    }
}
