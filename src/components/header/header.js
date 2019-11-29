import React, { Component } from 'react';
// import '~style/style.scss';
import Navbar from '../navbar/navbar';

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.headerContainer = React.createRef();
	}

	getElem() {
		return this.headerContainer;
	}

	render() {
		return (
			<section id="headerContainer" ref={this.headerContainer} className="hero gradientBg">
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
				<Navbar getParentElem={this.getElem} />
			</section>
		);
	}
}

export default Header;
