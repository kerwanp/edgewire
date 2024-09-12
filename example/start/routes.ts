/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import edgewire from 'edgewire/services/edgewire'

const DocsController = () => import('#controllers/docs_controller')

router.on('/').render('pages/home')
router.on('/demo').render('pages/demo')

router
  .group(() => {
    router.get('/', [DocsController, 'index'])
    router.get('/*', [DocsController, 'index'])
  })
  .prefix('/docs')

router.post('/edgewire/update', (ctx) => edgewire.handleUpdate(ctx))
