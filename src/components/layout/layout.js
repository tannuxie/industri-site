import React from 'react';

import '~style/style.scss';
import Helmet from '~components/helmet/helmet';
import Header from '~components/header/header';
import Footer from '~components/footer/footer';
import typography, { rhythm, scale } from '~style/typography'

const Layout = ({ children, childTitle }) => {
	console.log('typography');	
	console.log(typography);
	console.log('rhythm');
	console.log(rhythm);
	console.log('scale');
	console.log(scale);

	let thisTitle = 
	childTitle !== undefined 
		? childTitle + ' — Sävsjö Industrihistoria'
		: `Sävsjö Industrihistoria`;

	return (
		<div>
			<Helmet childTitle={thisTitle} />
			<Header />
			<section className="section">
				<div className="container">
					{children}
				</div>
			</section>
			<Footer />
		</div>
	);
};

export default Layout;
