import { createContext, useState, useEffect } from "react";

const ResponsiveContext = createContext();
const MOBILE_BEARKPOINT = 768;

export const ResponsiveProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            const isMobileByWidth = window.innerWidth <= MOBILE_BEARKPOINT;
            const isMobileByUA =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                );
            console.log(`isMobileByWidth: ${isMobileByWidth}\nisMobileByUA: ${isMobileByUA}`);
            return isMobileByWidth || isMobileByUA;
        };

        const handleResize = debounce(() => setIsMobile(checkIsMobile()), 200);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <ResponsiveContext.Provider value={isMobile}>
            {children}
        </ResponsiveContext.Provider>
    );
};

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

export default ResponsiveContext;
