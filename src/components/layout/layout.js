import React from 'react';
import PropTypes from 'prop-types';
import '~style/style.scss';
import { css } from '@emotion/core';
import Header from '../header/header';
import Footer from '../footer/footer';
import { ContextProviderComponent } from '../../context/context';

export default ({ children }) => (
        <ContextProviderComponent>
            <div
                css={css`
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;

                `}
            >
                <Header />
                <div
                    id="main-container"
                    className="container"
                    css={css`
                        align-self: center;
                        width: 100%;
                        margin: 0 auto 1rem;
                        @media (min-width: 1024px) {
                            margin: 0 auto 2rem;
                        }
                    `}
                >
                    {children}
                </div>
                <Footer />
            </div>
        </ContextProviderComponent>
);
