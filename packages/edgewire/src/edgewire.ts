import { inject } from '@adonisjs/core'
import { ComponentRegistry } from './component_registry.js'
import { HandleComponents } from './handle_components.js'
import { HandleRequests } from './handle_requests.js'
import { HttpContext } from '@adonisjs/core/http'
import { ComponentCall, ComponentSnapshot, ComponentUpdates } from './types.js'
import { View } from './view.js'

@inject()
export class Edgewire {
  #componentRegistry: ComponentRegistry
  #handleComponents: HandleComponents
  #handleRequests: HandleRequests

  constructor(
    componentRegistry: ComponentRegistry,
    handleComponents: HandleComponents,
    handleRequests: HandleRequests
  ) {
    this.#componentRegistry = componentRegistry
    this.#handleComponents = handleComponents
    this.#handleRequests = handleRequests
  }

  component(name: string, component: any) {
    this.#componentRegistry.component(name, component)
  }

  new(name: string) {
    return this.#componentRegistry.new(name)
  }

  mount(name: string) {
    return this.#handleComponents.mount(name)
  }

  handleUpdate(ctx: HttpContext) {
    return this.#handleRequests.handleUpdate(ctx)
  }

  update(snapshot: ComponentSnapshot, updates: ComponentUpdates, calls: ComponentCall[]) {
    return this.#handleComponents.update(snapshot, updates, calls)
  }

  view(templatePath: string, state: Record<string, any> = {}) {
    return View.template(templatePath, state)
  }
}
