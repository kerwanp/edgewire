import DocsService from '#services/docs_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class DocsController {
  constructor(public readonly docs: DocsService) {}

  index({ params }: HttpContext) {
    const segments = params['*'] ?? []
    return this.docs.render(segments)
  }
}
