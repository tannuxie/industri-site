import React, { useMemo } from 'react';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Helmet from '~components/helmet/helmet';
import FilterCompanyList from '~components/filtercompanylist/filtercompanylist';
import { capitalizeFirstLetter } from '~components/functions';
import ZoneParser from '~components/zoneparser/zoneparser';

const CityListTemplate = ({ data, pageContext }) => {
    const city = capitalizeFirstLetter(pageContext.string);
    // console.log(data);
    // console.log('cityTemplate city: ', city, city.toLowerCase(), city.toUpperCase());
    const cityContent = useMemo(() => data.staticContent.edges.filter((item) => {
        switch (item.node.role.toLowerCase()) {
            case 'savsjo':
            case 'sävsjö':
                return city === 'Sävsjö';
            case 'vrigstad':
                return city === 'Vrigstad';
            case 'stockaryd':
                return city === 'Stockaryd';
            case 'rorvik':
            case 'rörvik':
                return city === 'Rörvik';
            case 'hultagard':
            case 'hultagård':
                return city === 'Hultagård';
            case 'hylletofta':
                return city === 'Hylletofta';
            default:
                return null;
        }
    }).map((item) => item.node), [city, data.staticContent.edges]);
    // console.log(cityContent);

	return (
        <>
            <Helmet childTitle={city} />
            {(cityContent[0]) && (
                <div id="city-content">
                    <ZoneParser
                        content={cityContent[0].content}
                        childMdx={cityContent[0].children}
                    />
                </div>
            )}
            <h1
                className='table-headline'
                css={css`
                    text-align: center;
                `}
            >
                Företag i
                {' '}
                {`${city}`}
            </h1>
            <FilterCompanyList
                city={city}
            />
        </>
	);
};

export default CityListTemplate;

export const citylistQuery = graphql`
    query citylistQuery {
        staticContent: allStrapiStaticContent {
            edges {
              node {
                id
                strapiId
                role
                content {
                    undertext
                    bild {
                        beskrivning
                        bildfil {
                            childImageSharp {
                                fluid(maxWidth: 1920) {
                                    ...GatsbyImageSharpFluid
                                    aspectRatio
                                }
                                id
                            }
                            id
                        }
                        id
                    }
                    bredd_bildbox
                    imgbox {
                        beskrivning
                        bildfil {
                            childImageSharp {
                                fluid(maxWidth: 1920) {
                                    ...GatsbyImageSharpFluid
                                    aspectRatio
                                }
                                id
                            }
                            id
                        }
                        id
                    }
                    latitude
                    layout
                    longitude
                    map_pins {
                    beskrivning
                    latitude
                    longitude
                    id
                    }
                    text {
                        textfield
                        id
                    }
                    text_hoger {
                        textfield
                        id
                    }
                    text_vanster {
                        textfield
                        id
                    }
                    undertext_bildbox
                    size
                    zoom
                    id
                    size
                    bredd_karta
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
                }
                children {
                    ... on Mdx {
                        id
                        body
                    }
                }
              }
            }
          }
    }
`;
