import React from 'react';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import ZoneParser from '~components/zoneparser/zoneparser';

const IndexPage = ({ data }) => {
    console.log('data', data);
    const startsidaData = data.strapiStaticContent;

    return (
        <>
            <div id="startsidaData-content">
                <ZoneParser
                    content={startsidaData.content}
                    childMdx={startsidaData.children}
                />
            </div>
        </>
    );
};

export default IndexPage;

export const startsidaQuery = graphql`
    query startsidaQuery {
        strapiStaticContent(role: {eq: "startsida"}) {
            id
            role
            strapiId
            content {
                size
                undertext_bildbox
                undertext
                layout
                filter
                bredd_bildbox
                text_vanster {
                    textfield
                }
                text_hoger {
                    textfield
                }
                text {
                    textfield
                }
                imgbox {
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
                karta {
                    id
                    latitude
                    longitude
                    zoom
                    undertext
                    map_pins {
                        latitude
                        longitude
                        beskrivning
                    }
                }
                bredd_karta
            }
            children {
                ... on Mdx {
                    id
                    body
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
                        words
                        sentences
                        paragraphs
                    }
                }
            }
        }
    }
`;
