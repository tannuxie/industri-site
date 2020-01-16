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
                width
                undertext_bildbox
                undertext
                textfield
                layout
                id
                filtrering
                bredd_bildbox
                text_vanster {
                    textfield
                    id
                }
                text_hoger {
                    textfield
                    id
                }
                text {
                    textfield
                    id
                }
                imgbox {
                    id
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
                    id
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
