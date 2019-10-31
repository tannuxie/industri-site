import React, { Component } from 'react'
import { Link, graphql } from 'gatsby'
import { css } from "@emotion/core"
import Img from 'gatsby-image'
import Layout from '~components/layout/layout'
import ReactMarkdown from "react-markdown/with-html" 
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

export class MyMap extends Component {
    render() {
        //console.log('component: ' + this.props.position);
        const myAddresses = this.props.addresses
        let latest = null;

        for (let index = 0; index < myAddresses.length; index++) {
            const element = myAddresses[index];
            console.log(element);
            
            if(latest == null) {
                latest = index;
            } else if(myAddresses[latest].enddate == 'Nutid') {
                break;
            } else if(element.enddate == 'Nutid') {
                latest = index
            } else if(element.enddate > myAddresses[latest].enddate) {
                latest = index
            }
        }

        if (typeof window !== 'undefined') {
            return (
                <Map center={myAddresses[latest].position} zoom={15} style={{
                    height:"500px"
                }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {myAddresses.map((element, i) => {
                        return (
                        <Marker position={element.position}>
                            <Popup>
                                <b>{this.props.name}</b><br/>
                                {element.startdate} - {element.enddate}
                            </Popup>
                        </Marker>
                        )
                    })}
                </Map>
            )
        } else {
            return null
        }
    }
}

const CompanyTemplate = ({ data }) => {
    //console.log('start: ' + Date.parse(data.strapiAddress.usedaddresses[0].startdate));
    //console.log('end: ' + data.strapiAddress.usedaddresses[0].enddate);
    
    let pos = []
    data.allStrapiAddress.edges.forEach(element => {
        let address = {
            'addressstring1': element.node.addressstring1,
            'addressstring2': element.node.addressstring2,
            'position': [],
            'startdate': element.node.usedaddresses[0].startdate,
            'enddate': element.node.usedaddresses[0].enddate !== null ? 
            element.node.usedaddresses[0].enddate : 'Nutid'            
        }
        address.position.push(Number(element.node.latitude), Number(element.node.longitude))
        pos.push(address)
    });

    /*pos.push(Number(data.strapiAddress.latitude), Number(data.strapiAddress.longitude));
    let lastDate = data.strapiAddress.usedaddresses[0].enddate !== null ? 
    data.strapiAddress.usedaddresses[0].enddate : 'Nutid'; */

    return (
    <Layout childTitle={`${data.strapiCompany.name}`}>
        <div>
            <h1 className="title is-1"
                css={css`
                text-align: center;
                `}
            >
                {data.strapiCompany.name}
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
                    fluid={data.strapiImage.imagecontent.childImageSharp.fluid} 
                    alt={data.strapiImage.title} 
                   />
                </div>
            </div>
        </div>
        <div>
            <MyMap 
                name={data.strapiCompany.name} 
                addresses={pos}
            />
        </div>
        <div 
            className="articleContent"
            css={css`
            @media (min-width: 768px) {
                margin: 0 15%;
            }
            @media (min-width: 1024px) {
                margin: 0 30%;                
              }
              clear: both;
            `}
        >
            <ReactMarkdown 
                source={data.strapiCompany.longtext} 
                escapeHtml={false}  
            />
        </div>

    </Layout>
    )
};

export default CompanyTemplate

export const companyQuery = graphql`
    query CompanyTemplate($id: Int!) {
        strapiCompany(strapiId: {eq: $id}) {
            strapiId
            id
            coverimage {
                id
                title
            }
            fields {
                slug
            }
            longtext
            name
            summary
            type
            updated_at
            created_at
            usedaddresses {
                address
                companyaddress
                enddate(formatString: "YYYY")
                id
                startdate(formatString: "YYYY")
            }
        }
        strapiImage(companycoverimage: {id: {eq: $id}}) {
            title
            id
            companycoverimage {
                id
                name
            }
            imagecontent {
                childImageSharp {
                    fluid(maxWidth: 1920) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
        allStrapiAddress(filter: {usedaddresses: {elemMatch: {companyaddress: {eq: $id}}}}) {
            edges {
                node {
                    addressstring1
                    addressstring2
                    id
                    latitude
                    longitude
                    strapiId
                    city {
                        id
                        name
                        zoom
                        longitude
                        latitude
                    }
                    street {
                        city
                        id
                        latitude
                        longitude
                        zoom
                        name
                    }
                    usedaddresses {
                        address
                        companyaddress
                        enddate(formatString: "YYYY")
                        id
                        startdate(formatString: "YYYY")
                    }
                }
            }
        }
    }
`