"use client"
import { ApiResponseObject } from '@/types/client/types';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

type ApiResponse<T> = {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    revalidate: () => void;
};

type ApiArgs<T> = {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: any;
    params?: any;
    timeout?: number;
    responseType?: 'json' | 'text';
    cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache';
    mapFn?: (data: T) => ApiResponseObject<T>;
    fetchOnInit?: boolean;
};

/**
 * A custom hook that provides a convenient way to make API requests and manage the response data.
 *
 * @template T - The type of the response data.
 * @param {ApiArgs<T>} options - The options object containing the API request details.
 * @param {string} options.url - The URL of the API endpoint.
 * @param {string} [options.method='GET'] - The HTTP method to use for the request.
 * @param {any} [options.body] - The request body.
 * @param {any} [options.headers] - The request headers.
 * @param {any} [options.params] - The request query parameters.
 * @param {number} [options.timeout] - The request timeout in milliseconds.
 * @param {string} [options.responseType] - The expected response type.
 * @param {string} [options.cache] - The cache mode for the request.
 * @param {(data: T) => ApiResponseObject<T>} [options.mapFn] - A function to map the response data.
 * @param {boolean} [options.fetchOnInit=true] - Whether to fetch data on component initialization.
 * @return {ApiResponse<T>} - An object containing the response data, loading state, error state, and error message.
 */
function useApi<T>({url, method = 'GET', body, headers, params, timeout, responseType, cache, mapFn, fetchOnInit=true}: ApiArgs<T>): ApiResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const controller = new AbortController();
            const signal = controller.signal;
            
            // cleanup function
            const cleanup = () => controller.abort();
            // call cleanup on component unmount
            useEffect(() => cleanup, 
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []);

    const fetchData = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal,
            })
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            let result: ApiResponseObject<T> = await response.json();
            if (mapFn && result.response.data) {
                    result = mapFn(result.response.data);
            }
            toast.success(result.response.message);
            setData(data);
            setData(result.response.data);
            setError(error as Error);
            setIsError(true);
            toast.error((error as Error).message);
        } catch {
            toast.error((error as Error).message);
            setError(error as Error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (fetchOnInit) {
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    const revalidate = () => {
        fetchData();
    };

    return { data, isLoading, isError, error, revalidate };
}

export default useApi;

