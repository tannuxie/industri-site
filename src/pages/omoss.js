import React from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import Helmet from '~components/helmet/helmet';
import { rhythm, scale } from '../style/typography';
import ZoneParser from '~components/zoneparser/zoneparser';

const OmossPage = ({ data }) => {
    // console.log(data);
    const staticContent = data.static;
    return (
        <>
            <Helmet childTitle="Om oss" />
            <ZoneParser
                    content={staticContent.content}
                    childMdx={staticContent.children}
            />
        </>
    );
};

export default OmossPage;

export const omOssQuery = graphql`
    query omOssQuery {
        static: strapiStaticContent(role: {eq: "omoss"}) {
            id
            strapiId
            role
            children {
                ... on Mdx {
                    id
                    body
                }
            }
            content {
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
                bredd_bildbox
                bredd_karta
                filter
                id
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
                latitude
                layout
                longitude
                map_pins {
                    beskrivning
                    latitude
                    longitude
                }
                size
                text {
                    textfield
                }
                text_hoger {
                    textfield
                }
                text_vanster {
                    textfield
                }
                undertext
                undertext_bildbox
                size
                zoom
            }
        }
    }
`;
