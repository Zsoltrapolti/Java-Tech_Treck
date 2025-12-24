let handler: ((msg: string) => void) | null = null;

export function registerErrorToast(fn: (msg: string) => void) {
    handler = fn;
}

export function triggerErrorToast(message: string) {
    handler?.(message);
}

function formatErrorMessage(message: string): string {
    if (message.startsWith("{")) {
        try {
            const parsed = JSON.parse(message);
            if (parsed.error) return parsed.error;
            if (parsed.message) return parsed.message;
        } catch {}
    }

    return message
        .split(",")
        .map(m => `• ${m.trim()}`)
        .join("\n");
}

export function showError(error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
        message = formatErrorMessage(error.message);
    } else if (typeof error === "string") {
        message = error;
    }

    triggerErrorToast(message);
}
