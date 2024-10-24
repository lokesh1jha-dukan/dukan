'use client'
import { useState, useEffect } from 'react';

export function useDevice(): {isMobile: boolean} {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        if(typeof window !== undefined) {
            const handleResize = () => {
                setIsMobile(window.innerWidth < 768);
            };
    
    
            window.addEventListener('resize', handleResize);
    
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    return {isMobile};
}

