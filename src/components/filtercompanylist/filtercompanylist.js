import React, { useMemo } from 'react';
// import '~style/style.scss';
import { css } from '@emotion/core';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import TableList from '~components/tablelist/tablelist';

const FilterCompanyList = ({ data, city }) => {
    console.log('filtercompanylist data', data);
    console.log('filtercompanylist city', city);

    const companies = useMemo(() => data.company.edges.filter((item) => {
        switch (item.node.city) {
            case 'savsjo':
            case 'Sävsjö':
                return city === 'Sävsjö';
            case 'vrigstad':
            case 'Vrigstad':
                return city === 'Vrigstad';
            case 'stockaryd':
            case 'Stockaryd':
                return city === 'Stockaryd';
            case 'rorvik':
            case 'Rörvik':
                return city === 'Rörvik';
            case 'hultagard':
            case 'Hultagård':
                return city === 'Hultagård';
            case 'hylletofta':
            case 'Hylletofta':
                return city === 'Hylletofta';
            default:
                return false;
        }
    }).map((item) => item.node), [data]);

    console.log('filtercompanylist companies', companies);

	return (
        <TableList companyData={companies} />
	);
};

export default (props) => (
	<StaticQuery
		query={graphql`
            query FilterCompanyQuery {
                company: allStrapiCompany(filter: {published: {eq: true}, companyimage: {id: {ne: null}}}) {
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
                            companyimage {
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
