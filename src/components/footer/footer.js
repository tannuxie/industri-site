import React from 'react';
import { css } from "@emotion/core"
import { StaticQuery, graphql } from 'gatsby';
//import '~style/style.scss';

const Footer = () => (
	<StaticQuery
		query={graphql`
			query SocialQuery {
				site {
					siteMetadata {
						author
						description
					}
				}
			}
		`}
		render={data => (
			<footer className="footer center gradientBg">
				<div className="content has-text-centered">
					<p className="is-size-4">
					{data.site.siteMetadata.description}
					</p>
					<p className="is-size-4">
						Hemmagjord av {data.site.siteMetadata.author}
					</p>
				</div>
			</footer>
		)}
	/>
);

export default Footer;
