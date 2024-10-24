import {  useRef  } from 'react'



export default function useOptimistic() {
    const timeoutId = useRef<NodeJS.Timeout | null>(null)

    const debounceFn = (toDebounceFn: () => void, delay:number) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current)
        }
        timeoutId.current = setTimeout(() => {
            toDebounceFn()
        }, delay)
    }

    return {
        debounceFn
    }
}