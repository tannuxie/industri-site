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
            <Header />
            <section id="main-section" className="section">
                <div id="main-container" className="container">
                    {children}
                </div>
            </section>
            <Footer />
        </ContextProviderComponent>
);
