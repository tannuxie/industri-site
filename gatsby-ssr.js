const React = require('react');
const GlobalContextProvider = require('./src/context/GlobalContextProvider');

exports.wrapRootElement = ({ element }) => (
        <GlobalContextProvider>
            {element}
        </GlobalContextProvider>
);
