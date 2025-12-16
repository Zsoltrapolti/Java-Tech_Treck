import { useNavigate } from "react-router-dom";

import {
    UnauthorizedContainer,
    UnauthorizedCard,
    UnauthorizedTitle,
    UnauthorizedText,
    UnauthorizedButton,
} from "../../ui/UnauthorizedPage.styles";

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <UnauthorizedContainer>
            <UnauthorizedCard>
                <UnauthorizedTitle>
                    Access Denied
                </UnauthorizedTitle>

                <UnauthorizedText>
                    You don’t have permission to access this page.
                </UnauthorizedText>

                <UnauthorizedButton
                    variant="contained"
                    onClick={() => navigate("/products")}
                >
                    Go to Products
                </UnauthorizedButton>
            </UnauthorizedCard>
        </UnauthorizedContainer>
    );
}
