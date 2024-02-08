import cors from '@koa/cors'
import formatTime from './utils/formatTime.cjs'
import history from 'koa-connect-history-api-fallback'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import compose from 'koa-compose'
import morgan from 'koa-morgan'
import websockify from 'koa-websocket'
import InitManager from './core/init.cjs'
import catchError from './middlewares/exception.cjs'

const app = websockify(new Koa())
global.app = app
morgan.token('timestamp', () => {
  return formatTime(Date.now())
})
const logFormat = ':timestamp :method :url :status :response-time ms'
const middlewares = compose([
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
  morgan(logFormat),
  catchError,
  bodyParser(),
  history(),
  koaStatic('./dist'),
])
app.ws.use((ctx, next) => {
  const type = ctx.request.url.split('?')[1].split('=')[1]
  global.wsArr = []
  global.wsArr.push({ type, ws: ctx.websocket })
  ctx.state.ws = ctx.websocket
  return next(ctx)
})
app.use(middlewares)

InitManager.initCore(app)

app.listen(7777, () => {
  console.log('客户端7777启动！')
})
