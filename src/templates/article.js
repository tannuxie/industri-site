import React from 'react';
import PropTypes from 'prop-types';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Helmet from '~components/helmet/helmet';
import ZoneParser from '~components/zoneparser/zoneparser';

const ArticleTemplate = ({ data }) => {
    console.log(data);
    const article = data.strapiArticle;

    return (
        <div>
            <Helmet childTitle={`${article.title}`} />
            <div>
                <h1
                    className="title is-1"
                    css={css`
                        text-align: center;
                        `}
                >
                        {article.title}
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
                            fluid={article.mainimage.childImageSharp.fluid}
                            alt={article.title}
                            imgStyle={{ objectFit: 'contain' }}
                        />
                        </div>
                    </div>
            </div>

            <div>
                <ZoneParser
                    content={article.content}
                    childMdx={article.children}
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

