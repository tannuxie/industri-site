/* eslint-disable arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { Link, StaticQuery, graphql } from 'gatsby';
import ReactAudioPlayer from 'react-audio-player';

const Lenk = ({
    data, id, type, children,
}) => {
    // beroende på type, iterera igenom och hitta slug, generera link
    console.log('in Lenk');
    console.log('id: ', id, 'type: ', type, 'children: ', children);
    console.log('data: ', data);

    let theLink = null;

    switch (type) {
        case 'article' || 'artikel': {
            const object = data.allStrapiArticle.edges.find((item) => {
                console.log('article item: ', item, 'theId: ', id);
                return item.node.strapiId === Number(id) && item.node.published === true;
            });
            console.log('article object: ', object);
            if (object) {
                theLink = (
                    <Link
                        to={`/${searchObject.type}/${searchObject.slug}`}
                    >
                        {children}
                    </Link>
                );
            }
            break;
        }
        case 'company' || 'företag' || 'foretag': {

            break;
        }
        case 'sound' || 'ljud' || 'ljudfil': {

            break;
        }
        default:
            break;
    }

    function getLink(theId, theType) {
        console.log('in getLink');
        console.log('id: ', theId, 'theType: ', theType);

        function isArticle() {
            const object = data.allStrapiArticle.edges.find((item) => {
                console.log('article item: ', item, 'theId: ', theId);
                return item.node.strapiId === Number(theId) && item.node.published === true;
            });
            console.log('article object: ', object);

            return object ? {
                name: object.node.title,
                slug: object.node.fields.slug,
                type: 'artikel',
            } : undefined;
        }
        function isCompany() {
            const object = data.allStrapiCompany.edges.find((item) => {
                console.log('company item: ', item, 'theId: ', theId);
                return item.node.strapiId === Number(theId) && item.node.published === true;
            });
            console.log('company object: ', object);

            return object ? {
                name: object.node.name,
                slug: object.node.fields.slug,
                type: 'industri',
            } : undefined;
        }
        const searchTypes = {
            article: isArticle,
            artikel: isArticle,
            company: isCompany,
            foretag: isCompany,
        };
        return searchTypes[theType]();
    }

    const searchObject = getLink(id, type);

    if (searchObject) {
        theLink = (
            <Link
                to={`/${searchObject.type}/${searchObject.slug}`}
            >
                {children}
            </Link>
        );
    }
    return theLink;
};

export default (props) => (
	<StaticQuery
		query={graphql`
            query LinkQuery {
                allStrapiCompany {
                    edges {
                        node {
                            id
                            name
                            fields {
                                slug
                            }
                            strapiId
                            published
                        }
                    }
                }
                allStrapiArticle {
                    edges {
                        node {
                            fields {
                                slug
                            }
                            strapiId
                            title
                            published
                        }
                    }
                }
                allStrapiMedia {
                    edges {
                        node {
                            id
                            name
                            strapiId
                            media {
                                base
                                extension
                                name
                                prettySize
                                publicURL
                                size
                            }
                        }
                    }
                }
            }
		`}
		render={(data) => (
			<Lenk data={data} {...props} />
		)}
	/>
);
