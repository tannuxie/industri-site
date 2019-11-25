import React from 'react';
import '~style/style.scss';
import { css } from "@emotion/core"
import { Link } from 'gatsby'
import { StaticQuery, graphql } from 'gatsby'

const Navbar = ({ children }) => (
	<StaticQuery
		query={graphql`
			query SiteTitleQuery {
		  		site {
					siteMetadata {
			  			title
              			menuLinks {
                			name
                			link
              			}
					}
		  		}
			}
	  	`}
		render={data => (
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
					{data.site.siteMetadata.menuLinks.map((item, index) => {
						return (
							<Link key={index} className="navbar-item"
							to={item.link}
							>
							{item.name}
							</Link>
						)
					})}
						{/* <Link className="navbar-item"
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
						<Link className="navbar-item navbar-link"
							to="/vandra"
						>
							Vandra
						</Link>
		
						<Link className="navbar-item navbar-link"
							to="/omoss"
						>
							Om oss
						</Link> */}
					</div>
		
					<div className="navbar-end">		
					</div>
				</div>
				
				</nav>
			</div>
	  	)}
	/>
)

export default Navbar;
