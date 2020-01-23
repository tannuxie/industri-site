import React from 'react';
import { Link, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import Helmet from '~components/helmet/helmet';
import { rhythm, scale } from '../style/typography';
import ZoneParser from '~components/zoneparser/zoneparser';

const OmossPage = ({ data }) => {
    console.log(data);
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
