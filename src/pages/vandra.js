import React from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Helmet from '~components/helmet/helmet';
import TableList from '~components/tablelist/tablelist';
import text from '~components/text.json';
import { rhythm, scale } from '../style/typography';
import ZoneParser from '~components/zoneparser/zoneparser';

const Vandra = ({ data }) => {
	const streets = data.streets.edges.map((item) => item.node);
    const cities = text.cities;
    console.log(streets);
    console.log(cities);
    const cityStreets = cities.map(((item) => ({
            name: item,
            streets: streets.filter(((item2) => item2.city.toLowerCase() === item.toLowerCase())),
        })));
    console.log(cityStreets);

    const staticContent = data.static;

	return (
		<>
            <Helmet childTitle='Vandra' />
			<div>
                <h1
                    css={css`
                    text-align: center;
                `}
                >
                    Vandra
                </h1>
                <ZoneParser
                    content={staticContent.content}
                    childMdx={staticContent.children}
                />
			</div>
			{cityStreets.map((city) => (
                <ExpansionPanel
                    key={city.name}
                    css={css`
                        margin: 2rem 0rem;
                    `}
                >
                    <ExpansionPanelSummary>
                                <h2 style={{ textTransform: 'capitalize' }}>{city.name}</h2>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {city.streets.length === 0 ? (
                        <h3>
                            Här finns ännu inget! Kom tillbaka snart så har
                            vi förhoppningsvis lagt till nya vandringar.
                        </h3>
                        ) : city.streets.map((street) => (
                            <div
                                key={street.name}
                                className="vandraItem"
                                css={css`
                                    display: flex;
                                    padding-bottom: 30px;
                                    max-height: 400px;
                                    align-items: stretch;
                                `}
                            >
                                <div
                                    css={css`
                                        flex: 1 0 50%;
                                    `}
                                >
                                    <h3
                                        css={css`
                                            white-space: normal;
                                            margin-top: calc(${rhythm} / 2);
                                            padding-right: calc(${rhythm} / 2);
                                            @media (max-width: 769px) {
                                                margin-top:0px;
                                            }
                                        `}
                                    >
                                        {street.name}
                                    </h3>
                                    <p css={css`
                                        flex: 0 1 auto;

                                        white-space: pre-wrap;
                                        margin-bottom: 0;
                                        position: relative;
                                        padding-right: calc(${rhythm} / 2);
                                        max-height: calc(${rhythm} * 8);
                                        overflow: hidden;

                                        :before {
                                            content: "...";
                                            position: absolute;
                                            bottom: 0;
                                            right: 0;
                                            width: 1rem;
                                        }
                                        :after {
                                            content: "";
                                            position: absolute;
                                            right: 0;
                                            width: 1rem;
                                            height: ${rhythm};
                                            background: white;
                                        }
                                    `}
                                    >
                                        {street.summary}
                                    </p>
                                </div>
                                <Img
                                    fluid={street.mainimage.childImageSharp.fluid}
                                    alt={street.name}
                                    style={{
                                        maxHeight: '250px',
                                    }}
                                />
                            </div>
                            ))}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
			))}
		</>
	);
};

export default Vandra;

export const vandraQuery = graphql`
    query vandraQuery {
        streets: allStrapiStreet(filter: {published: {eq: true}}) {
            edges {
                node {
                    id
                    strapiId
                    name
                    published
                    summary
                    city
                    fields {
                        slug
                    }
                    mainimage {
                        childImageSharp {
                            fluid {
                                ...GatsbyImageSharpFluid
                                aspectRatio
                            }
                        }
                    }
                    children {
                        ... on Mdx {
                            id
                            body
                            excerpt
                            frontmatter {
                                title
                            }
                            headings {
                                value
                                depth
                            }
                            tableOfContents
                            timeToRead
                            wordCount {
                                paragraphs
                                sentences
                                words
                            }
                        }
                    }
                }
            }
        }
        static: strapiStaticContent(role: {eq: "vandra"}) {
            id
            strapiId
            role
            content {
                width
                undertext_bildbox
                undertext
                textfield
                text_vanster {
                    textfield
                }
                text_hoger {
                    textfield
                }
                text {
                    textfield
                }
                layout
                imgbox {
                    bildfil {
                        childImageSharp {
                            fluid {
                                ...GatsbyImageSharpFluid
                                aspectRatio
                            }
                        }
                    }
                    beskrivning
                }
                filtrering
                bredd_bildbox
                bild {
                    beskrivning
                    bildfil {
                        childImageSharp {
                            fluid {
                                ...GatsbyImageSharpFluid
                                aspectRatio
                            }
                        }
                    }
                }
            }
            children {
              ... on Mdx {
                id
                body
              }
            }
        }
    }
`;
