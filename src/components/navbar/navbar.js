import React from 'react';
import '~style/style.scss';
import { css } from "@emotion/core"
import { Link } from 'gatsby'

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
				<div 
					className="navbar-item" 
				>
					<div
						css={css`
							box-shadow: 0 0 6px 0px rgba(0, 0, 0, 0.1);
						`}
					>
						<input 
							type="text" 
							name="searchComp" 
							placeholder="Sök här..." 
							css={css`
								border: 1px solid rgba(0, 0, 0, 0.1);
								background: #fff;
								padding: 5px 7px;
								font-size: inherit;
								border-radius: 3px;
								font-weight: normal;
								outline: none;
							`}
						/>
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
