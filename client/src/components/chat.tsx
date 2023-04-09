import { exhaustive } from 'exhaustive'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, memo, useEffect, useRef, useState } from 'react'
import useSWRSubscription from 'swr/subscription'

import { Chat, Message, useApi } from '../App'
import { useAutoScroll } from '../hooks/use-auto-scroll'
import useConstant from '../hooks/use-constant'
import useInput from '../hooks/use-input'
import { useTyping } from '../hooks/use-typing'
import './chat.css'
import { Input } from './input'

const useChatSubscription = (room: string, username: string) => {
	const api = useApi()
	const [chatInstance, setChatInstance] = useState<Chat>()
	const [messages, setMessages] = useState<Message[]>([])
	const [whoIsTyping, setWhoIsTyping] = useState<string[]>([])

	useSWRSubscription(room, () => {
		const chat = api.chat.subscribe({
			$query: {
				room,
				username,
			},
		})

		setChatInstance(chat)

		chat.on('open', m => {
			console.log('open', m)
		})

		chat.on('message', m => {
			exhaustive.tag(m.data, 'event', {
				typing_start: ({ username }) =>
					setWhoIsTyping(old => [...old, username]),
				typing_stop: ({ username }) =>
					setWhoIsTyping(old => old.filter(x => x !== username)),
				new_message: data => setMessages(messages => [...messages, data]),
				user_joined: data => setMessages(messages => [...messages, data]),
				user_left: data => setMessages(messages => [...messages, data]),
			})
		})

		return () => chat.close()
	})

	return {
		chat: chatInstance,
		messages,
		whoIsTyping,
	}
}

interface ChatComponentProps {
	room: string
	username: string
}

const ChatComponent: React.FC<ChatComponentProps> = ({ room, username }) => {
	const { chat, messages, whoIsTyping } = useChatSubscription(room, username)

	const handleSubmit = (message: string) => {
		chat?.send({ event: 'new_message', message, username })
	}

	return (
		<div className="chat-container">
			<ChatHeader
				whoIsTyping={whoIsTyping.filter(x => x !== username)[0]}
				authUsername={username}
			/>
			<MessageDisplay messages={messages} authUsername={username} />
			<ChatForm
				onSubmit={handleSubmit}
				onTypingStart={() => {
					chat?.send({ event: 'typing_start', username })
				}}
				onTypingEnd={() => {
					chat?.send({ event: 'typing_stop', username })
				}}
			/>
		</div>
	)
}

interface MessageDisplayProps {
	messages: Message[]
	authUsername: string
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
	messages,
	authUsername,
}) => {
	const boxRef = useRef<HTMLDivElement>(null)
	useAutoScroll(boxRef, [messages])

	return (
		<div className="message-display" ref={boxRef}>
			{messages?.map((message, indx) => (
				<Fragment key={indx}>{printMessage(message, authUsername)}</Fragment>
			))}
		</div>
	)
}

interface ChatFormProps {
	onSubmit: (message: string) => void
	onTypingStart: () => void
	onTypingEnd: () => void
}

const ChatForm: React.FC<ChatFormProps> = ({
	onSubmit,
	onTypingStart,
	onTypingEnd,
}) => {
	const message = useInput('')

	const { onInputChange } = useTyping(onTypingStart, onTypingEnd)

	const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
		message.onChange(e)
		onInputChange(e)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!message.value.trim()) return

		onSubmit?.(message.value)
		onTypingEnd()

		message.reset()
	}

	return (
		<form className="message-form" onSubmit={handleSubmit}>
			<Input autofocus value={message.value} onChange={handleTyping} />
			<button type="submit">Send</button>
		</form>
	)
}

const SystemMessage = memo(({ message }: { message: string }) => {
	return <div className="system-message">{message}</div>
})

interface ChatHeaderProps {
	whoIsTyping?: string
	authUsername: string
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	whoIsTyping,
	authUsername,
}) => {
	return (
		<div className="chat-header">
			<AnimatePresence initial={false}>
				{whoIsTyping && !itsMe(whoIsTyping, authUsername) && (
					<motion.p
						key={whoIsTyping}
						className="typing"
						initial={{ y: -10 }}
						animate={{ y: 0 }}
						exit={{ y: -100 }}
					>
						{whoIsTyping} is typing...
					</motion.p>
				)}
			</AnimatePresence>
		</div>
	)
}

interface MessageItemProps {
	message: string
	username: string
	authUsername: string
}

const MessageItem: React.FC<MessageItemProps> = memo(
	({ message, username, authUsername }) => {
		const cn = 'message' + (itsMe(username, authUsername) ? '' : ' incoming')

		return (
			<div className={cn}>
				<p>{message}</p>
			</div>
		)
	}
)

const itsMe = (username: string, authUsername: string) =>
	username === authUsername

const printMessage = (message: Message, authUsername: string) => {
	return exhaustive.tag(message, 'event', {
		new_message: ({ message, username: msgUsername }) => (
			<MessageItem
				message={message}
				username={msgUsername}
				authUsername={authUsername}
			/>
		),
		user_joined: ({ message }) => <SystemMessage message={message} />,
		user_left: ({ message }) => <SystemMessage message={message} />,
		typing_start: () => null,
		typing_stop: () => null,
	})
}

export default ChatComponent
