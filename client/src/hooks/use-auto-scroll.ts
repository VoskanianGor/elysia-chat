import { RefObject, useEffect } from 'react'

export const useAutoScroll = (
	ref: RefObject<HTMLDivElement>,
	dependencies: any[]
) => {
	useEffect(() => {
		if (!ref.current) return

		ref.current.scrollTo({
			top: ref.current.scrollHeight + 500,
			behavior: 'smooth',
		})
	}, dependencies)
}
