import React from 'react';
import PropTypes from 'prop-types';
import '~style/style.scss';
// import Helmet from '~components/helmet/helmet';
import { Helmet } from 'react-helmet';
import Header from '../header/header';
import Footer from '../footer/footer';
import ContextConsumer, { ContextProviderComponent } from '../../context/context';

export default ({ children }) => (
        <ContextProviderComponent>
            <ContextConsumer>
                {({ store }) => (
                    <Helmet>
                        <body className={store.fixMenu ? 'has-navbar-fixed-top' : ''} />
                    </Helmet>
                )}
            </ContextConsumer>
            <Header />
            <section className="section">
                <div className="container">
                    {children}
                </div>
            </section>
            <Footer />
        </ContextProviderComponent>
);
