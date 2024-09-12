import { errors } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import edge from 'edge.js'
import fs from 'node:fs/promises'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'

export default class DocsService {
  async render(segments: string[]) {
    const content = await this.markdown(segments)
    return edge.render('pages/docs', {
      content,
    })
  }

  async markdown(segments: string[]) {
    const content = await this.content(segments)
    const file = await unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter, ['yaml'])
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content)

    return String(file)
  }

  async content(segments: string[]) {
    const path = segments.join('/')
    const index = app.makePath('resources', 'docs', path, 'index.md')
    const page = app.makePath('resources', 'docs', `${path}.md`)

    const content = (await this.readFile(index)) || (await this.readFile(page)) || false

    if (!content) {
      throw new errors.E_ROUTE_NOT_FOUND(['get', path])
    }

    return edge.renderRaw(content)
  }

  async readFile(path: string): Promise<string | false> {
    try {
      const content = await fs.readFile(path)
      return content.toString('utf8')
    } catch (e) {
      return false
    }
  }
}
