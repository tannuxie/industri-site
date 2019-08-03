import React from 'react';

import '~style/style.scss';
import Helmet from '~components/helmet/helmet';
import Header from '~components/header/header';
import Midsection from '~components/midsection/midsection';
import Footer from '~components/footer/footer';

const Layout = ({ children }) => (
	<div>
		<Helmet />
		<Header />
		<Midsection />
		<Footer />
	</div>
);

export default Layout;
