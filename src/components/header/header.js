import React from 'react';
import '~style/style.scss';
import Navbar from '../navbar/navbar';

const Header = ({ siteTitle }) => (
		<section className="hero gradientBg">
			<div className="hero-body">
				<div className="container center">
					<article className="media">
						<div className="media-content">
							<div className="content">
								<h3 className="is-size-2 has-text-white">
									Sävsjö kommuns
								</h3>
								<h1 className="subtitle has-text-white is-size-1">
									Industrihistoria

								</h1>
							</div>
						</div>
					</article>
				</div>
			</div>
			<Navbar />
		</section>
);

export default Header;
