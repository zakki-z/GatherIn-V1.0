const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Simple wrapper for fetch with error handling
export const apiFetch = async <T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> => {
    if (!API_BASE_URL) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables.');
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorText || response.statusText}`);
        }

        // Handle 204 No Content
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null as T;
        }

        return response.json() as Promise<T>;
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        // Re-throw a standardized error for client components to catch
        throw new Error(`Failed to fetch data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
