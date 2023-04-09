import { useEffect, useRef } from 'react'

interface InputProps {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	autofocus?: boolean
}

export const Input: React.FC<InputProps> = ({
	value,
	onChange,
	autofocus = false,
}) => {
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (autofocus) {
			inputRef.current?.focus()
		}
	}, [autofocus])

	return <input ref={inputRef} type="text" value={value} onChange={onChange} />
}
