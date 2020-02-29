import React from 'react';
import { Grommet, Box } from 'grommet';
import Store from '../components/State/Store'

export default (props) => {
    let theme = {
        global: {
            font: {
                family: 'Roboto',
            },
        },
    };

    return (
        <Store>
            <Grommet theme={theme} themeMode="dark">
                <Box fill {...props}>
                </Box >
            </Grommet >
        </Store>)
}