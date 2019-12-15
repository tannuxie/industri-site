import React from 'react';
import Helmet from '~components/helmet/helmet';

const NotFoundPage = () => (
    <>
        <Helmet childTitle="Sidan hittades inte" />
        <h1>Sidan finns inte här!</h1>
        <p>Det verkar som om att du kom fel nånstans på vägen...</p>
    </>
);

export default NotFoundPage;
