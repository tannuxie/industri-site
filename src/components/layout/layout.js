import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import '~style/style.scss';
import Helmet from '~components/helmet/helmet';
import Header from '~components/header/header';
import Footer from '~components/footer/footer';
import { ContextProviderComponent } from '../../context/context';

const Layout = ({ children }) => {
    return (
        <ContextProviderComponent>
            <Header />
            <section className="section">
                <div className="container">
                    {children}
                </div>
            </section>
            <Footer />
        </ContextProviderComponent>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
