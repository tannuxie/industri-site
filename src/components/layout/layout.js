import React, { useContext } from 'react';
import '~style/style.scss';
import Helmet from '~components/helmet/helmet';
import Header from '~components/header/header';
import Footer from '~components/footer/footer';
import GlobalContextProvider, { GlobalStateContext } from '../../context/GlobalContextProvider';

const Layout = ({ children, childTitle }) => {
    const state = useContext(GlobalStateContext);

    const thisTitle = childTitle !== undefined
        ? `${childTitle} — Sävsjö Industrihistoria`
        : 'Sävsjö Industrihistoria';

    return (
		<div>
			<Helmet childTitle={thisTitle}>
                <body className={state.size === 'big' ? 'sizeUp' : ''} />
            </Helmet>
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
