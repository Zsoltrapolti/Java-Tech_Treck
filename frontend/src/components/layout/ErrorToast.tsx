import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import {ErrorToastWrapper} from "../../ui/Toast.styles.ts";
import { registerErrorToast } from "../../utils/toast.ts";

export default function ErrorToast() {
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        registerErrorToast((msg) => {
            setMessage(msg);
            setTimeout(() => setMessage(null), 5000);
        });
    }, []);

    if (!message) return null;

    return (
        <ErrorToastWrapper>
            <Typography fontWeight={600}>
                {message}
            </Typography>
        </ErrorToastWrapper>
    );
}
