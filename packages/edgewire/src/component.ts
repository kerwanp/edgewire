import { View } from './view.js'

export abstract class Component {
  #id: string
  #name: string

  constructor(name: string, id: string) {
    this.#id = id
    this.#name = name
  }

  render?(): Promise<string | View>

  public get id() {
    return this.#id
  }

  public get name() {
    return this.#name
  }
}
