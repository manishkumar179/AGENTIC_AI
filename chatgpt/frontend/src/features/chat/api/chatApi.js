
const API_URL = import.meta.env.VITE_API_URL;


const parseErrorResponse = async (response) => {
    try {
        const data = await response.json();
        return data?.message || 'Failed to send message';
    } catch {
        return 'Failed to send message';
    }
};

const parseJsonResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || 'Request failed');
    }

    return data;
};

const readSseChunk = (chunk) => {
    const lines = chunk.split('\n');
    const dataLines = [];

    for (const line of lines) {
        if (!line.startsWith('data:')) {
            continue;
        }

        // Server writes "data: ${text}", so remove only the protocol prefix and one separator space.
        let value = line.slice(5);
        if (value.startsWith(' ')) {
            value = value.slice(1);
        }

        dataLines.push(value);
    }

    return dataLines.join('\n');
};


export const sendMessageApi = async ({ message, conversationId, onToken }) => {
    const response = await fetch(`${API_URL}/api/conversation`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, conversationId }),
    });

    if (!response.ok) {
        throw new Error(await parseErrorResponse(response));
    }

    const nextConversationId =
        response.headers.get('x-conversation-id') ||
        conversationId ||
        null;

    const conversationTitle =
        response.headers.get('x-conversation-title') || null;

    if (!response.body) {
        return {
            conversationId: nextConversationId,
            conversationTitle,
            reply: '',
        };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let fullReply = '';

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            buffer += decoder.decode();
            break;
        }

        buffer += decoder.decode(value, { stream: true });

        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() || '';

        for (const chunk of chunks) {
            const token = readSseChunk(chunk);

            if (!token) {
                continue;
            }

            if (token.startsWith('[ERROR]')) {
                const streamError = token.replace('[ERROR]', '').trim();
                throw new Error(streamError || 'Streaming error occurred');
            }

            fullReply += token;
            onToken?.(token, fullReply);
        }
    }

    if (buffer) {
        const token = readSseChunk(buffer);

        if (token) {
            if (token.startsWith('[ERROR]')) {
                const streamError = token.replace('[ERROR]', '').trim();
                throw new Error(streamError || 'Streaming error occurred');
            }

            fullReply += token;
            onToken?.(token, fullReply);
        }
    }

    return {
        conversationId: nextConversationId,
        conversationTitle,
        reply: fullReply,
    };
};


export const fetchConversationsApi = async () => {
    const response = await fetch(`${API_URL}/api/conversation`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return parseJsonResponse(response);
};
