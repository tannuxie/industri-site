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
            streets: streets.filter(((item2) => item2.city.toLowerCase() === item.replace(/å/g, 'a')
            .replace(/ä/g, 'a')
            .replace(/ö/g, 'o').toLowerCase())),
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
                        @media (min-width: 1024px) {
                            margin: 2vh 0;
                        }
                        @media (max-width: 1023px) {
                            margin: 2vh 1vw;
                        }
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
                                    align-items: flex-end;
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
                                    fluid={street.streetimage.childImageSharp.fluid}
                                    alt={street.name}
                                    style={{
                                        maxHeight: '300px',
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
                    streetimage {
                        childImageSharp {
                            fluid {
                                src
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
            size
            undertext_bildbox
            undertext
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
            filter
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
            zoom
            size
            longitude
            latitude
            map_pins {
                longitude
                latitude
                id
                beskrivning
            }
            karta {
                zoom
                undertext
                longitude
                latitude
                id
                map_pins {
                    longitude
                    latitude
                    id
                    beskrivning
                }
            }
            bredd_karta
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
