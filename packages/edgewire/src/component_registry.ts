// TODO: Add ability to register component without name (infer name from class)
import string from '@adonisjs/core/helpers/string'

export class ComponentRegistry {
  #aliases = new Map()

  public component(name: string, component: any) {
    this.#aliases.set(name, component)
  }

  public new(name: string, id?: string) {
    const Component = this.getClass(name)
    const component = new Component(name, id ?? string.random(20))
    return component
  }

  private getClass(name: string) {
    return this.#aliases.get(name)
  }
}
