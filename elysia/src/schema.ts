import { t } from 'elysia'

export const Event = {
	typing: 'typing',
	new_message: 'new_message',
	user_joined: 'user_joined',
	user_left: 'user_left',
	typing_start: 'typing_start',
	typing_stop: 'typing_stop',
} as const

const TypingStartEvent = t.Object({
	event: t.Literal(Event.typing_start),
	username: t.String(),
})

const TypingStopEvent = t.Object({
	event: t.Literal(Event.typing_stop),
	username: t.String(),
})

const NewMessageEvent = t.Object({
	event: t.Literal(Event.new_message),
	message: t.String(),
	username: t.String(),
})

const UserJoinedEvent = t.Object({
	event: t.Literal(Event.user_joined),
	username: t.String(),
	message: t.String(),
})

const UserLeftEvent = t.Object({
	event: t.Literal(Event.user_left),
	username: t.String(),
	message: t.String(),
})

const MessageSchema = t.Union([
	TypingStartEvent,
	TypingStopEvent,
	NewMessageEvent,
	UserJoinedEvent,
	UserLeftEvent,
])

const TypingStartResponse = t.Object({
	event: t.Literal(Event.typing_start),
	username: t.String(),
})

const TypingStopResponse = t.Object({
	event: t.Literal(Event.typing_stop),
	username: t.String(),
})

const NewMessageResponse = t.Object({
	event: t.Literal(Event.new_message),
	message: t.String(),
	username: t.String(),
	id: t.String(),
	date: t.Date(),
})

const UserJoinedResponse = t.Object({
	event: t.Literal(Event.user_joined),
	username: t.String(),
	message: t.String(),
})

const UserLeftResponse = t.Object({
	event: t.Literal(Event.user_left),
	username: t.String(),
	message: t.String(),
})

const ResponseSchema = t.Union([
	TypingStartResponse,
	TypingStopResponse,
	NewMessageResponse,
	UserJoinedResponse,
	UserLeftResponse,
])

const QuerySchema = t.Object({
	room: t.String(),
	username: t.String(),
})

export const ChatSchema = {
	body: MessageSchema,
	query: QuerySchema,
	response: ResponseSchema,
}
