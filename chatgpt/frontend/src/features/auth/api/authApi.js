const API_URL = import.meta.env.VITE_API_URL;

const parseResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
};


const authRequest = async (url, method = 'GET', body) => {
    const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    return parseResponse(response);
};

export const registerApi = (payload) =>
    authRequest(`${API_URL}/api/auth/register`, 'POST', payload);

export const loginApi = (payload) =>
    authRequest(`${API_URL}/api/auth/login`, 'POST', payload);

export const meApi = () =>
    authRequest(`${API_URL}/api/auth/me`);

export const logoutApi = () =>
    authRequest(`${API_URL}/api/auth/logout`, 'POST');