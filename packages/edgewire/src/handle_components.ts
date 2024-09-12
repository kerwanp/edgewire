import { inject } from '@adonisjs/core'
import { Component } from './component.js'
import { ComponentRegistry } from './component_registry.js'
import { insertAttributesIntoHtmlRoot } from './utils.js'
import { ComponentSnapshot, ComponentCall, ComponentUpdates, EdgewireConfig } from './types.js'
import { ComponentContext } from './component_context.js'
import { E_INVALID_CHECKSUM } from './errors.js'
import { generateChecksum, verifyChecksum } from './utils/checksum.js'
import { Config } from '@adonisjs/core/config'
import { View } from './view.js'
import string from '@adonisjs/core/helpers/string'
import { getPublicProperties } from './utils/object.js'

@inject()
export class HandleComponents {
  #componentsRegistry: ComponentRegistry
  #config: EdgewireConfig

  constructor(edgewire: ComponentRegistry, config: Config) {
    this.#componentsRegistry = edgewire
    this.#config = config.get('edgewire')
  }

  async mount(name: string) {
    const component = this.#componentsRegistry.new(name)

    let html = await this.#render(component)

    html = insertAttributesIntoHtmlRoot(html, {
      'wire:effects': [],
      'wire:snapshot': this.#snapshot(component),
    })

    return html
  }

  async update(snapshot: ComponentSnapshot, updates: ComponentUpdates, calls: ComponentCall[]) {
    const { component, context } = this.#fromSnapshot(snapshot)
    const { data, memo } = snapshot

    this.#updateProperties(component, updates, data, context)
    this.#callMethods(component, calls, context)

    const newSnapshot = this.#snapshot(component, context)

    let html = await this.#render(component)
    html = insertAttributesIntoHtmlRoot(html, {
      'wire:effects': [],
      'wire:snapshot': this.#snapshot(component),
    })

    context.addEffect('html', html)

    return { snapshot: newSnapshot, effects: context.effects }
  }

  async #getView(component: Component) {
    let view: View
    const properties = getPublicProperties(component)
    if (component.render) {
      const output = await component.render()
      if (typeof output === 'string') {
        view = View.raw(output, properties)
      } else {
        view = output.with(properties)
      }
    } else {
      const name = string.create(component.name).removeSuffix('component').dashCase().toString()
      view = View.template(`${this.#config.viewPath}/${name}`, properties)
    }

    return { view, properties }
  }

  async #render(component: Component, _default?: string): Promise<string> {
    const { view, properties } = await this.#getView(component)

    let html = await view.render()
    html = insertAttributesIntoHtmlRoot(html, {
      'wire:id': component.id,
    })

    return html
  }

  #snapshot(component: Component, context?: ComponentContext): ComponentSnapshot {
    const data = this.#dehydrateProperties(component, context)

    const snapshot: Omit<ComponentSnapshot, 'checksum'> = {
      data,
      memo: {
        id: component.id,
        name: component.name,
        children: [],
      },
    }

    return {
      ...snapshot,
      checksum: generateChecksum(JSON.stringify(snapshot)),
    }
  }

  #fromSnapshot(snapshot: ComponentSnapshot) {
    const { checksum, ..._snapshot } = snapshot

    if (!verifyChecksum(JSON.stringify(_snapshot), checksum)) {
      throw new E_INVALID_CHECKSUM([snapshot.memo.name])
    }

    const component = this.#componentsRegistry.new(snapshot.memo.name, snapshot.memo.id)
    const context = new ComponentContext(component)

    this.#hydrateProperties(component, snapshot.data, context)

    return { component, context }
  }

  #dehydrateProperties(component: Component, context?: ComponentContext) {
    const data: any = {}

    for (const propertyName of Object.getOwnPropertyNames(component)) {
      // @ts-ignore
      data[propertyName] = component[propertyName]
    }

    return data
  }

  #hydrateProperties(
    component: Component,
    data: ComponentSnapshot['data'],
    context: ComponentContext
  ) {
    for (const [key, value] of Object.entries(data)) {
      // TODO: Check if property exists

      // @ts-ignore
      component[key] = value
    }
  }

  #updateProperties(
    component: Component,
    updates: ComponentUpdates,
    data: ComponentSnapshot['data'],
    context: ComponentContext
  ) {
    for (const [path, value] of Object.entries(updates)) {
      this.#updateProperty(component, path, value, context)
    }
  }

  #updateProperty(component: Component, path: string, value: string, context: ComponentContext) {
    // TODO: Handle path segments
    // @ts-ignore
    component[path] = value
  }

  #callMethods(component: Component, calls: ComponentCall[], context: ComponentContext) {
    const returns = []
    for (const call of calls) {
      const { method, params } = call

      // @ts-ignore
      component[method](...params)
    }

    // TODO: Add context effect
  }
}
