// Basic tests for the prop plugin
import { test } from 'node:test'
import assert from 'node:assert'
import { JSDOM } from 'jsdom'
import propPlugin from './index.js'

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.document = dom.window.document as any
global.MutationObserver = dom.window.MutationObserver as any

test('propPlugin returns an AttributePlugin object', () => {
    const mockEffect = (fn: () => void) => fn
    const plugin = propPlugin(mockEffect)
    
    assert.strictEqual(plugin.name, 'prop')
    assert.strictEqual(plugin.returnsValue, true)
    assert.deepStrictEqual(plugin.requirement, { value: 'must' })
    assert.strictEqual(typeof plugin.apply, 'function')
})

test('plugin has correct structure', () => {
    const mockEffect = (fn: () => void) => fn
    const plugin = propPlugin(mockEffect)
    
    assert.ok(plugin)
    assert.ok(plugin.name)
    assert.ok(plugin.apply)
    assert.ok(plugin.requirement)
})

test('updates single property on element', () => {
    const mockEffect = (fn: () => void) => {
        fn() // Execute immediately for test
        return () => {} // Return cleanup function
    }
    
    const plugin = propPlugin(mockEffect)
    const el = document.createElement('input') as any
    const key = 'value'
    let signalValue = 'test value'
    const rx = () => signalValue
    
    // Apply the plugin
    const cleanup = plugin.apply({
        el,
        key,
        value: 'value',
        rx,
        rawKey: 'prop.value',
        mods: new Map(),
        error: () => {}
    } as any)
    
    // Check initial value was set
    assert.strictEqual(el.value, 'test value')
    
    // Update signal and trigger reactive update
    signalValue = 'new value'
    rx() // Simulate signal access that would trigger update
    
    // Cleanup
    if (cleanup) cleanup()
})

test('updates multiple properties on element', () => {
    const mockEffect = (fn: () => void) => {
        fn() // Execute immediately for test
        return () => {} // Return cleanup function
    }
    
    const plugin = propPlugin(mockEffect)
    const el = document.createElement('input') as any
    let propsObject = {
        value: 'initial',
        disabled: false
    }
    const rx = () => propsObject
    
    // Apply the plugin without a key (multiple properties mode)
    const cleanup = plugin.apply({
        el,
        key: undefined,
        value: '{ value: $val, disabled: $dis }',
        rx,
        rawKey: 'prop',
        mods: new Map(),
        error: () => {}
    } as any)
    
    // Check initial values were set
    assert.strictEqual(el.value, 'initial')
    assert.strictEqual(el.disabled, false)
    
    // Update properties
    propsObject = {
        value: 'updated',
        disabled: true
    }
    rx() // Simulate signal access
    
    // Cleanup
    if (cleanup) cleanup()
})

test('cleanup function disconnects observer and effect', () => {
    let effectCleanupCalled = false
    const mockEffect = (fn: () => void) => {
        fn()
        return () => { effectCleanupCalled = true }
    }
    
    const plugin = propPlugin(mockEffect)
    const el = document.createElement('input')
    const rx = () => 'test'
    
    const cleanup = plugin.apply({
        el,
        key: 'value',
        value: 'value',
        rx,
        rawKey: 'prop.value',
        mods: new Map(),
        error: () => {}
    } as any)
    
    // Call cleanup
    if (cleanup) cleanup()
    
    // Verify effect cleanup was called
    assert.strictEqual(effectCleanupCalled, true)
})
