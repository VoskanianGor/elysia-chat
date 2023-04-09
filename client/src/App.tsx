import './App.css'

import { edenTreaty } from '@elysiajs/eden'
import { SCHEMA } from 'elysia'
import { exhaustive } from 'exhaustive'
import { createContext, memo, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { App } from '../../elysia/types'
import ChatComponent from './components/chat'

const api = edenTreaty<App>('https://elysia-server-production.up.railway.app/')

const ApiContext = createContext(api)
export const useApi = () => useContext(ApiContext)
export type Chat = ReturnType<typeof api['chat']['subscribe']>
export type Message =
	App['meta'][typeof SCHEMA]['/chat']['subscribe']['response']

function Index() {
	const [credentials, setCredentials] = useState(
		JSON.parse(localStorage.getItem('auth-data')) || {
			room: '',
			username: '',
		}
	)
	const isAuth = !!credentials.room && !!credentials.username

	return (
		<ApiContext.Provider value={api}>
			<div className="Index">
				{isAuth ? (
					<ChatComponent
						room={credentials.room}
						username={credentials.username}
					/>
				) : (
					<AuthForm
						onSubmit={(room, username) => setCredentials({ room, username })}
					/>
				)}
			</div>
		</ApiContext.Provider>
	)
}

export default Index

type FormValues = {
	room: string
	username: string
}

interface AuthFormProps {
	onSubmit: (room: string, username: string) => void
}

const AuthForm: React.FC<AuthFormProps> = memo(({ onSubmit }) => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm()

	const onOnSubmit = ({ room, username }: FormValues) => {
		onSubmit(room, username)

		console.log({ room, username })

		localStorage.setItem('auth-data', JSON.stringify({ room, username }))
	}

	return (
		<div className="chat-container">
			<form className="auth-form" onSubmit={handleSubmit(onOnSubmit)}>
				<label htmlFor="room">Room</label>
				<input type="text" id="room" {...register('room')} />

				<label htmlFor="username">Username</label>
				<input type="text" id="username" {...register('username')} />

				<button type="submit">Join</button>
			</form>
		</div>
	)
})
