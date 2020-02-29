import React from 'react';
import Store from './src/common/components/State/Store'

export const wrapRootElement = ({ element }) => {
    return <Store>{element}</Store>
}