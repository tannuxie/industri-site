import React from 'react';
import '~style/style.scss';
import { css } from "@emotion/core"
import { Link } from 'gatsby'
import Searchfield from '~components/searchfield/searchfield'

const Navbar = () => (
	<div className="hero-foot is-hidden-mobile">
		<nav className="navbar has-text-centered"
		css={css`
			justify-content: center;
		`}
		>
		<div className="navbar-brand">
			<span className="navbar-item">
				
			</span>

			<a className="navbar-burger burger">
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>

		<div id="navbaren" className="navbar-menu" 
			css={css`
				flex-grow: 0;
			`}
		>
			<div className="navbar-start">
				<Link className="navbar-item"
					to="/"
				>
					Hem
				</Link>
				<Link className="navbar-item"
					to="/savsjo"
				>
					Sävsjö
				</Link>
				<Link className="navbar-item"
					to="/vrigstad"
				>
					Vrigstad
				</Link>
				<Link className="navbar-item"
					to="/stockaryd"
				>
					Stockaryd
				</Link>
				<Link className="navbar-item"
					to="/rorvik"
				>
					Rörvik
				</Link>
				<Link className="navbar-item"
					to="/hylletofta"
				>
					Hylletofta
				</Link>

				<div className="navbar-item has-dropdown is-hoverable">
					<a className="navbar-link">
					Om oss
					</a>

					<div className="navbar-dropdown">
						<a className="navbar-item">
							Vem är vi
						</a>
						<a className="navbar-item">
							Vårt uppdrag
						</a>
						<a className="navbar-item">
							Kontakt
						</a>
					</div>
				</div>
			</div>

			<div className="navbar-end">

			</div>
		</div>
		
		</nav>
	</div>
);

export default Navbar;
