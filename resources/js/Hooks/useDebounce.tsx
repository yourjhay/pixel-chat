import React, { useEffect, useCallback } from "react";

/**
 * This hooks is use to delay certain effects.
 *  Like the traditional useEffect of react but with additional delay parameter
 *
 * @param effect
 * @param dependencies
 * @param delay
 */
const useDebounce = (
    effect: () => void,
    dependencies: any[],
    delay: number
) => {
    const callback = useCallback(effect, dependencies);

    useEffect(() => {
        const timeout = setTimeout(callback, delay);
        return () => clearTimeout(timeout);
    }, [callback, delay]);
};

export default useDebounce;
