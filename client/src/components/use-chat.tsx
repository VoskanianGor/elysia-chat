import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'

interface Message {
	id: number
	text: string
}

interface ChatHook {
	messages: Message[]
	inputValue: string
	isScrolled: boolean
	messagesEndRef: React.MutableRefObject<HTMLDivElement | null>
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void
	handleSubmit: (e: FormEvent) => void
}

const useChat = (): ChatHook => {
	const [messages, setMessages] = useState<Message[]>([])
	const [inputValue, setInputValue] = useState<string>('')
	const messagesEndRef = useRef<HTMLDivElement | null>(null)
	const [isScrolled, setIsScrolled] = useState(false)

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const handleSubmit = (e: FormEvent): void => {
		e.preventDefault()
		const box = messagesEndRef.current

		if (!box || !inputValue.trim()) {
			return
		}

		setMessages([...messages, { id: Date.now(), text: inputValue }])
		setInputValue('')
		setIsScrolled(box.scrollTop !== box.scrollHeight - box.offsetHeight)
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollTo({
			top: messagesEndRef.current.scrollHeight + 100,
			behavior: isScrolled ? 'auto' : 'smooth',
		})
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	return {
		messages,
		inputValue,
		isScrolled,
		messagesEndRef,
		handleChange,
		handleSubmit,
	}
}

export default useChat
