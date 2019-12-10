import React from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import Helmet from '~components/helmet/helmet';
import ReactMarkdown from 'react-markdown/with-html';
import TableList from '~components/tablelist/tablelist';
import text from '~components/text.json';

const Vandra = ({ data }) => {
	const streets = data.allStrapiStreet.edges.map((x) => x.node);
	const images = data.allStrapiImage.edges.map((x) => x.node);
	console.log(streets);
	console.log(images);
	const renderStreets = [];

	text.cities.forEach((city) => {
		streets.forEach((street) => {
			if (street.city === city) {
				const image = images.filter((x) => x.streetimage
				!== null && x.streetimage.id === street.strapiId)[0];
				console.log(image);

				const renderStreet = {
					city: street.city,
					name: street.name,
					summary: street.summary,
					image: street.image,
				};
				renderStreets.push(renderStreet);
			}
		});
	});

	return (
		<>
            <Helmet childTitle={`${data.strapiArticle.title}`} />
			<div>
				<h1>Vandra</h1>
				<p>{text.vandraText}</p>
			</div>
			{text.cities.map((city) => (
					<>
						<div className="vandraCity">
							<h2 style={{ textTransform: 'capitalize' }}>{city}</h2>
							{renderStreets.filter((x) => x.city === city)
								.map((renderStreet) => (
									<>
										<div
											className="vandraItem"
											css={css`
											display: flex;
											flex-direction: column;
											padding-bottom: 30px;
											max-height: 400px;
											flex-wrap: wrap;
											align-items: stretch;
										`}
										>
											<h3 css={css`
												flex: 0 1 auto;
												display: flex;
												max-width: 50%;
											`}
											>
												{renderStreet.name}
											</h3>
											<p css={css`
												flex: 0 1 auto;
												display: flex;
												max-width: 50%;
											`}
											>
												{renderStreet.summary}
											</p>
											<Img
												fluid={renderStreet.image.imagecontent.childImageSharp.fluid}
												alt={renderStreet.image.title}
												imgStyle={{
													objectFit: 'contain',
												}}
												style={{
													maxHeight: '250px',
													display: 'flex',
													maxWidth: '50%',
													flex: '0 5 auto',
													alignSelf: 'flex-end',
													justifySelf: 'flex-start',
												}}
											/>
										</div>
									</>
								))}
						</div>
					</>
			))}
		</>
	);
};

export default Vandra;

export const vandraQuery = graphql`
	query vandraQuery {
		allStrapiStreet {
			edges {
				node {
					id
					city
					content
					fields {
						slug
					}
					imagecontent {
						id
						title
					}
					longitude
					latitude
					name
					summary
					zoom
					strapiId
					childMdx {
						body
						headings {
							value
						}
						tableOfContents
					}
				}
			}
		}
		allStrapiImage {
			edges {
				node {
					streetimage {
						id
						name
					}
					strapiId
					id
					description
					imagecontent {
						childImageSharp {
							fluid(maxWidth: 1920) {
								...GatsbyImageSharpFluid
							}
						}
					}
					title
				}
			}
		}
	}
`;
