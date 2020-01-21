import React from 'react';
// import '~style/style.scss';
import { css } from '@emotion/core';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import TableList from '~components/tablelist/tablelist';

const FilterCompanyList = ({ data, city }) => {
    console.log('filtercompanylist data', data);
    console.log('filtercompanylist city', city);

    const companies = data.company.edges.filter((item) => {
        return item.node.city.toLowerCase() === city.toLowerCase();
    }).map((item) => item.node);

    console.log('filtercompanylist companies', companies);

	return (
        <TableList data={companies} />
	);
};

export default (props) => (
	<StaticQuery
		query={graphql`
            query FilterCompanyQuery {
                company: allStrapiCompany(filter: {published: {eq: true}, mainimage: {id: {ne: null}}}) {
                    edges {
                        node {
                            id
                            strapiId
                            name
                            published
                            quality
                            summary
                            type
                            fields {
                                slug
                            }
                            city
                            address {
                                addresstext1
                                addresstext2
                                enddate
                                id
                                latitude
                                longitude
                                startdate
                            }
                            mainimage {
                                childImageSharp {
                                    fluid {
                                        ...GatsbyImageSharpFluid
                                        aspectRatio
                                    }
                                }
                            }
                        }
                    }
                }
            }
		`}
		render={(data) => (
			<FilterCompanyList data={data} {...props} />
		)}
	/>
);
