import config from "@/config";
import { ApiResponseObject } from "@/types/client/types";
import toast from "react-hot-toast";


/**
 * Fetches data from a specified URL and returns the parsed response object.
 * 
 * @template T - The type of the data in the response.
 * @param url - The URL to fetch data from.
 * @param options - (Optional) The options to pass to the fetch request.
 * @param retryOptions - (Optional) Options to control retry logic.
 * @returns A Promise that resolves to a ResponseObject of type T.
 * @throws If an error occurs and retry logic is not successful, it will be thrown.
 */
export const fetchInsideTryCatch = async <T>(
    url: string,
    options?: RequestInit,
    retryOptions: {
        maxRetries?: number,
        retryDelay?: number,
    } = {}
): Promise<ApiResponseObject<T> | void> => {
    const { maxRetries = 1, retryDelay = 1000 } = retryOptions;
    let retries = 0;

    let response: Response | null = null;
    let data: ApiResponseObject<T>;
    let error: Error | null = null;

    while (retries < maxRetries) {
        try {
            let URL = 
            // `http://127.0.0.1:3000/${url}`
            `${config.domainName}${url}`
            response = await fetch(URL, {...options, cache: 'no-store'});
            data = await response.json();

            if (!response.ok) {
                throw new Error(data.response.message);
            }

            // toast.success(data.response.message);
            return data;
        } catch (err) {
            error = err as Error;
            // toast.error((error as Error).message);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            retries++;
        }
    }
    // TODO -> Report the error to analytics
    // toast.error("Unexpected error occurred");
};


export const NETWORK_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
} as const