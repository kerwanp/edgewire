import { Component, view } from 'edgewire'

export default class ButtonComponent extends Component {
  likes = 0

  like() {
    this.likes++
  }

  async render() {
    return view('edgewire/button')
  }
}
