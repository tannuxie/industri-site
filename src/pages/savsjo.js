import React from 'react';
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { css } from "@emotion/core"
import CompanyList from '~components/companylist/companylist'

const CITYCONST = 'Sävsjö'

const SavsjoPage = ({ data }) => {

    return (
        <CompanyList 
            data={data} 
            CITYCONST={CITYCONST}
        />
    );
};

export default SavsjoPage;

export const query = graphql`
    query SavsjoQuery {
        company: allStrapiCompany {
            edges {
                node {
                    id
                    companyquality
                    type
                    name
                    strapiId
                    summary
                    fields {
                        slug
                    }
                    usedaddresses {
                        id
                        address
                        startdate
                        enddate
                    }
                    coverimage {
                        imagecontent {
                            id
                        }
                        
                    }
                }
            }
        }
        address: allStrapiAddress {
            edges {
                node {
                    id
                    strapiId
                    longitude
                    latitude
                    addressstring1
                    addressstring2
                    city {
                        id
                        name
                    }
                    usedaddresses {
                        id
                        companyaddress
                        address
                        startdate
                        enddate
                    }
                }
            }
        }
        image: allStrapiImage {
            edges {
                node {
                    id
                    title
                    strapiId
                    imagecontent {
                        childImageSharp {
                            fluid(maxWidth: 970) {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                    companycoverimage {
                        name
                        id
                        summary
                    }
                }
            }
        }
        city: allStrapiCity {
            edges {
                node {
                    id
                    longitude
                    latitude
                    children {
                        id
                    }
                    name
                    parent {
                        id
                    }
                    strapiId
                    zoom
                    updated_at
                    streets {
                        id
                        name
                    }
                }
            }
        }
    }
` 