// gatsby-ssr.js
const React = require('react');
const GlobalContextProvider = require('./src/common/context/GlobalContextProvider').default;

exports.wrapRootElement = ({ element }) => {
    return <GlobalContextProvider>{element}</GlobalContextProvider>;
};