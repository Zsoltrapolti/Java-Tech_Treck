import {useEffect, useState} from 'react';
import {fetchAppInformation} from "../api/backend.ts";
import type {AppInfoType} from "../types/AppInfo.ts";
import {Typography} from "@mui/material";

import {
    InformationCard,
    InformationLayout,
    InformationTitle,
    InformationVersion
} from "../styles/AppInformation.styles.ts";

export default function AppInformation() {
    const [information, setInformation] = useState<AppInfoType | null>(null);

    useEffect(() => {
        fetchAppInformation().then(setInformation);
    }, [])

    if (!information) {
        return <Typography> Loading application information</Typography>;
    }

    return (
        <InformationCard>
            <InformationLayout>
                <div>
                    <InformationTitle>
                        {information.name}
                    </InformationTitle>
                    <InformationVersion>
                        Version: {information.version}
                    </InformationVersion>
                </div>
            </InformationLayout>
        </InformationCard>
    );
}