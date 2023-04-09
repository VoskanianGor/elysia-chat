import { log } from 'console'
import { Elysia, ws } from 'elysia'
import { exhaustive } from 'exhaustive'
import { nanoid } from 'nanoid'

import { ChatSchema } from './schema'

const selfReturn = <T>(data: T): T => data

export const app = new Elysia()
	.use(ws())
	.get('/', () => 'Hello Elysia')
	.ws('/chat', {
		open(ws) {
			const { room, username } = ws.data.query

			ws.subscribe(room).publish(room, {
				event: 'user_joined',
				message: `${username} has joined the room`,
				username,
			})
		},
		message(ws, message) {
			const { room } = ws.data.query

			const publishData = exhaustive.tag(message, 'event', {
				new_message: msg => ({ ...msg, id: nanoid(), date: new Date() }),
				user_joined: selfReturn,
				user_left: selfReturn,
				typing_start: selfReturn,
				typing_stop: selfReturn,
			})

			ws.publish(room, publishData)
		},
		close(ws) {
			const { room, username } = ws.data.query

			ws.unsubscribe(room).publish(room, {
				event: 'user_left',
				message: `${username} has left the room`,
				username,
			})
		},
		schema: ChatSchema,
	})
	.listen(3000)

log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
