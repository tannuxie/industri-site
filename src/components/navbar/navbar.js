import React from 'react';
import '~style/style.scss';
import { css } from "@emotion/core"

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
			<a className="navbar-item">
				Hem
			</a>
			<a className="navbar-item">
				Sävsjö
			</a>
			<a className="navbar-item">
				Vrigstad
			</a>
			<a className="navbar-item">
				Stockaryd
			</a>
			<a className="navbar-item">
				Rörvik
			</a>
			<a className="navbar-item">
				Hylletofta
			</a>

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
