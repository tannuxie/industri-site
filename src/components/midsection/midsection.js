import React from 'react';
import { css } from '@emotion/core';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
// import '~style/style.scss';
import text from '~components/text.json';

const Mid = ({ data }) => (
	<div>
		<div className="container">
			<div
                className="tile is-ancestor"
                css={css`
				justify-content: center;
			    `}
			>
				<div className="tile is-vertical is-6">
					<div className="tile is-parent">
					<article className="tile is-child notification is-info">
						<p className="title">Projektinfo</p>
						<p className="subtitle">Vad som händer här</p>
                        <div className="content">
                            {text.midSectionText}
                        </div>
					</article>
					</div>
				</div>
			</div>
		</div>
		<div className="container">
			{data.allStrapiImage.edges.map((items) => (
				<>
					<div className="image">
						<Img key={items.node.title} fluid={items.node.imagecontent.childImageSharp.fluid} />
						<span>{items.node.title}</span>
					</div>
				</>
			))}
		</div>
	</div>
);

export default (props) => (
	<StaticQuery
		query={graphql`
			query ImageQuery {
				allStrapiImage {
					edges {
						node {
							title
							imagecontent {
								childImageSharp {
									fluid(maxHeight: 900, maxWidth: 900) {
										...GatsbyImageSharpFluid
									}
								}
							}
						}
					}
				}
			}
		`}
		render={(data) => <Mid data={data} {...props} />}
	/>
);
