import React from 'react';
import { css } from "@emotion/core"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
//import '~style/style.scss';

const Mid = ({ data }) => (
	<div>
		<div className="container">
			<div className="tile is-ancestor"
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
							Aenean placerat venenatis velit, eget gravida mauris tempor id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nunc id ante sed massa fermentum bibendum. Morbi mollis facilisis rhoncus. Nulla faucibus ligula eget urna euismod dictum. Curabitur porta nisi non pretium mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Morbi luctus vehicula lectus, non aliquam lacus sollicitudin eu. Nullam vestibulum ultricies mi efficitur efficitur. Aenean iaculis mi quam, sed interdum ante cursus sed. 
						</div>
					</article>
					</div>
				</div>
			</div>
		</div>
		<div className="container">
			{data.allStrapiImage.edges.map((items, i) => (
				<>
					<div className="image">
						<Img key={i} fluid={items.node.imagecontent.childImageSharp.fluid} />
						<span>{items.node.title}</span>
					</div>
				</>
			))}
		</div>
	</div>
);

export default Midsection => (
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
		render={data => <Mid data={data} />}
	/>
)