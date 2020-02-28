import React from 'react';
import { Grommet, Box } from 'grommet';

export default (props) => {
    let theme = {
        global: {
            font: {
                family: 'Roboto',
            },
        },
    };

    return (
        <Grommet theme={theme} themeMode="dark">
            <Box fill {...props}>
            </Box >
        </Grommet >)
}