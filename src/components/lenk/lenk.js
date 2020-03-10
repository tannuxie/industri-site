import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { graphql, Link, useStaticQuery } from 'gatsby';
import ReactAudioPlayer from 'react-audio-player';

const Lenk = ({
    id, type, children,
}) => {
    const data = useStaticQuery(graphql`
        query LinkQuery {
            allStrapiCompany(filter: {published: {eq: true}}) {
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
            allStrapiArticle(filter: {published: {eq: true}}) {
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
    `);
    // beroende på type, iterera igenom och hitta slug, generera link
    console.log('in Lenk');
    console.log('id: ', id, 'type: ', type, 'children: ', children);
    console.log('number id', Number(id));

    console.log('data: ', data);

    let theLink = null;

    switch (type) {
        case 'article':
        case 'artikel': {
            console.log('case article');
            const object = data.allStrapiArticle.edges.find((item) => (
                item.node.strapiId === Number(id)
            ));
            console.log('article object: ', object);

            if (object) {
                theLink = (
                    <Link
                        to={`/artikel/${object.node.fields.slug}`}
                    >
                        {children}
                    </Link>
                );
            }
            break;
        }
        case 'company':
        case 'företag':
        case 'foretag': {
            console.log('case company');
            const object = data.allStrapiCompany.edges.find((item) => (
                item.node.strapiId === Number(id)
            ));
            console.log('company object: ', object);
            if (object) {
                theLink = (
                    <Link
                        to={`/industri/${object.node.fields.slug}`}
                    >
                        {children}
                    </Link>
                );
            }
            break;
        }
        case 'sound':
        case 'ljud':
        case 'ljudfil': {
            console.log('case sound');
            const object = data.allStrapiMedia.edges.find((item) => (
                item.node.strapiId === Number(id)
            ));
            console.log('media object: ', object);
            if (object
                && (object.node.media.extension === 'wav'
                || object.node.media.extension === 'mp3'
                || object.node.media.extension === 'ogg')
            ) {
                theLink = (
                    <ReactAudioPlayer
                        src={object.node.media.publicURL}
                        controls
                    />
                );
            }
            break;
        }
        default:
            break;
    }

    return theLink;
};

export default Lenk;
