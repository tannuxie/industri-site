import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Helmet from '~components/helmet/helmet';
// import ReactMarkdown from "react-markdown/with-html"
// import { MDXProvider, mdx } from '@mdx-js/react'
// import { MDXRenderer } from "gatsby-plugin-mdx"
// import MyMap from '~components/map/map'
// import ImgBox from '~components/imgbox/imgbox'
import ZoneParser from '~components/zoneparser/zoneparser';

const ArticleTemplate = ({ data }) => {
    console.log(data);
    // const content = data.strapiArticle.content.map((item) => {
    //     const current = item;
    //     let currentMdx = 0;
    //     if (current.textfield) {
    //         current.textfield = data.strapiArticle.children[currentMdx].body;
    //         currentMdx++;
    //     }

    //     return current;
    // });

    return (
        <div>
            <Helmet childTitle={`${data.strapiArticle.title}`} />
            <div>
                <h1
                    className="title is-1"
                    css={css`
                        text-align: center;
                        `}
                >
                        {data.strapiArticle.title}
                </h1>
                    <div
                        className="articleImageBox"
                        css={css`
                            width: 100%;
                            margin: 2rem 0;
                        `}
                    >
                        <div
                            css={css`
                                display: flex;
                                justify-content: center;
                            `}
                        >
                        <Img
                            fluid={data.strapiArticle.mainimage.childImageSharp.fluid}
                            alt={data.strapiArticle.title}
                            imgStyle={{ objectFit: 'contain' }}
                        />
                        </div>
                    </div>
            </div>

            <div>
                <ZoneParser
                    content={data.strapiArticle.content}
                    childMdx={data.strapiArticle.children}
                />
            </div>
        </div>
    );
};

ArticleTemplate.propTypes = {
	data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ArticleTemplate;

export const articleQuery = graphql`
    query ArticleTemplate($id: Int!) {
        strapiArticle(strapiId: {eq: $id}) {
            title
            content {
                id
                textfield
                undertext
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
                zoom
                longitude
                layout
                latitude
                text {
                    textfield
                    id
                }
                text_vanster {
                    textfield
                    id
                }
                text_hoger {
                    textfield
                    id
                }
                map_pin {
                    longitude
                    latitude
                    id
                    beskrivning
                }
                imgbox {
                    beskrivning
                    id
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
                width
                undertext_bildbox
            }
            id
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
            strapiId
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

