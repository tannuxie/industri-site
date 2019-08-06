import React from 'react';

import '~style/style.scss';
import Helmet from '~components/helmet/helmet';
import Header from '~components/header/header';
import Footer from '~components/footer/footer';

const Layout = ({ children }) => (
	<div>
		<Helmet />
		<Header />
		<section className="section">
			{children}
		</section>
		<Footer />
	</div>
);

export default Layout;
