import React, { Component } from 'react';
import { Link, graphql } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Helmet from '~components/helmet/helmet';
import FilterCompanyList from '~components/filtercompanylist/filtercompanylist';
import ReactMarkdown from 'react-markdown/with-html';

const CityListTemplate = ({ data, pageContext }) => {
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	return (
        <>
            <Helmet childTitle={capitalizeFirstLetter(pageContext.string)} />
            <h1 css={css`text-align: center;`}>
                Företag i
                {' '}
                {`${capitalizeFirstLetter(pageContext.string)}`}
            </h1>
            <FilterCompanyList
                data={data}
                city={capitalizeFirstLetter(pageContext.string)}
            />
        </>
	);
};

export default CityListTemplate;

export const citylistQuery = graphql`
    query citylistQuery($string: String!) {
        company: allStrapiCompany(filter: {city: {eq: $string}, published: {eq: true}, mainimage: {id: {ne: null}}}) {
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
            addresses {
                id
                addressstring1
                addressstring2
                startdate(formatString: "YYYY")
                enddate(formatString: "YYYY")
                company
                latitude
                longitude
            }
            mainimage {
                imagecontent {
                id
                }
                id
                title
            }
            city
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
            companyimage {
                name
                id
                summary
            }
            }
        }
        }
    }
`;
