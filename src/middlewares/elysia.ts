
import { Elysia } from 'elysia'
import { idempotent } from '../core'

const withIdempotency = (app: Elysia) => {
  app.onBeforeHandle(({ request, response }) => {
    // return idempotent({});
  })
}
export { withIdempotency }