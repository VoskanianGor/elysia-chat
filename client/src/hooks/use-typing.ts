import { useState } from 'react'

type CallbackFunction = () => void

export const useTyping = (
	callbackOnStart: CallbackFunction,
	callbackOnEnd: CallbackFunction,
	delay: number = 2000
) => {
	const [typing, setTyping] = useState<boolean>(false)
	const [typingTimeout, setTypingTimeout] = useState<number | null>(null)

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!typing) {
			setTyping(true)
			callbackOnStart()
		}

		if (typingTimeout) {
			clearTimeout(typingTimeout)
		}

		setTypingTimeout(
			setTimeout(() => {
				setTyping(false)
				callbackOnEnd()
			}, delay)
		)
	}

	return { onInputChange }
}
