import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import {
    ErrorToastWrapper,
    SuccessToastWrapper
} from "../../ui/Toast.styles";
import {
    registerErrorToast,
    registerSuccessToast
} from "../../utils/toast";

type ToastState = {
    message: string;
    type: "error" | "success";
} | null;

export default function ErrorToast() {
    const [toast, setToast] = useState<ToastState>(null);

    useEffect(() => {
        registerErrorToast((msg) => {
            setToast({ message: msg, type: "error" });
            setTimeout(() => setToast(null), 5000);
        });

        registerSuccessToast((msg) => {
            setToast({ message: msg, type: "success" });
            setTimeout(() => setToast(null), 3000);
        });
    }, []);

    if (!toast) return null;

    const Wrapper =
        toast.type === "error"
            ? ErrorToastWrapper
            : SuccessToastWrapper;

    return (
        <Wrapper>
            <Typography fontWeight={600}>
                {toast.message}
            </Typography>
        </Wrapper>
    );
}
