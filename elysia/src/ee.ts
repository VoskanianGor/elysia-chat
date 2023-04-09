/**
 * EventEmitter class with a generic type for EventMap.
 */
export class EventEmitter<EM> {
	private events: { [K in keyof EM]?: Array<(args: EM[K]) => void> }

	constructor() {
		this.events = {}
	}

	/**
	 * Adds a listener for the specified event.
	 * @param {T} eventName - The name of the event.
	 * @param {(args: EM[T]) => void} listener - The listener function.
	 */
	on<T extends keyof EM>(eventName: T, listener: (args: EM[T]) => void): void {
		if (!this.events[eventName]) {
			this.events[eventName] = []
		}
		;(this.events[eventName] as Array<(args: EM[T]) => void>).push(listener)
	}

	/**
	 * Emits the specified event with the provided payload.
	 * @param {T} eventName - The name of the event.
	 * @param {EM[T]} payload - The payload for the event.
	 */
	emit<T extends keyof EM>(eventName: T, payload: EM[T]): void {
		if (this.events[eventName]) {
			this.events[eventName]?.forEach(listener => listener.call(this, payload))
		}
	}

	/**
	 * Removes the specified listener for the specified event.
	 * @param {T} eventName - The name of the event.
	 * @param {(args: EM[T]) => void} listener - The listener function.
	 */
	off<T extends keyof EM>(eventName: T, listener: (args: EM[T]) => void): void {
		if (this.events[eventName]) {
			this.events[eventName] = (
				this.events[eventName] as Array<(args: EM[T]) => void>
			).filter(l => l !== listener)
		}
	}
}

/**
 * EventMap type definition.
 */
// export type EventMap = {
// 	exampleEvent: string
// 	anotherEvent: { message: string; count: number }
// 	new_message: { text: string; usernames: string }
// }

// const ee = new EventEmitter<EventMap>()

// ee.on('new_message', ({ text, usernames }) => {
// 	console.log(text, usernames)
// })
