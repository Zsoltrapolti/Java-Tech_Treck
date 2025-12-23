import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps } from "react-router-dom";
import { Button,type ButtonProps } from "@mui/material";

type LinkButtonProps = ButtonProps & LinkProps;

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
    function LinkButton(props, ref) {
        return <Button ref={ref} component={RouterLink} {...props} />;
    }
);
