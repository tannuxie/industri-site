import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { css } from "@emotion/core"
import { Helmet } from 'react-helmet';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';
import { zeroRightClassName,fullWidthClassName, noScrollbarsClassName } from 'react-remove-scroll-bar';

class ImgBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            photoIndex: 0,
            isOpen: false,
        }
        //this.open = this.open.bind(this)
        //this.close = this.close.bind(this)
    }

    // console.log('in staticQuery');
    // console.log('id:');
    // console.log(id);
    // console.log(id.id);
    
    // console.log('data:');            
    // console.log(data);

    // console.log('caption:');            
    // console.log(caption);
    
    render() {
    let aCaption = '';
    if(this.props.id.caption !== undefined) {
        aCaption = this.props.id.caption
    }

    //const images = data.allStrapiImage.edges
    const image = this.props.data.allStrapiImage.edges.filter(
        function (image) {
            return image.node.strapiId == this.props.id.id;
        }
    )
    //console.log('finished');
    //console.log(image);            
    
    //const [photoIndex, setPhotoIndex] = useState(0);
    //const [isOpen, setIsOpen] = useState(false);
    const open = () => {
        //setIsOpen(true);
        this.setState({
            isOpen: true
        })

        //document.getElementsByTagName("body")[0].style = 'margin-right:0px!important';
        //var element = document.getElementsByTagName("body")[0];
        //element.style.marginRight = 'margin-right:0px!important';
        //element.style.marginLeft = 'calc(100vw - 100%)';
        //margin-left: calc(100vw - 100%);
    }
    const close = () => {
        //setIsOpen(false);
        this.setState({
            isOpen: false
        })

        //var element = document.getElementsByTagName("body")[0];
        //element.style.marginLeft = null;
    }
        return (
            <>
                <Helmet>
                    <body className={this.isOpen && 'right-scroll-bar-position'} />
                </Helmet>
                <div onClick={() => this.setState({ isOpen: !this.state.isOpen})}>
                    <Img 
                        fluid={image[0].node.imagecontent.childImageSharp.fluid} 
                        alt={image[0].node.title} 
                        imgStyle={{ objectFit: 'contain' }}
                    />
                    {aCaption.length > 0 && (
                        <p style={{ fontStyle: 'italic',
                        textAlign: 'center',
                        fontSize: '1.1rem'}}>{aCaption}</p>
                    )}
                
                    {this.state.isOpen && (
                        <DialogOverlay css={css`z-index: 9999;`} isOpen={this.state.isOpen} onDismiss={this.close()} onClick={() => this.open()}>
                            <DialogContent aria-label={image[0].node.title}>
                                <Img 
                                    fluid={image[0].node.imagecontent.childImageSharp.fluid} 
                                    alt={image[0].node.title}
                                />
                                <h2>
                                    {aCaption.length > 0 ? aCaption : image[0].node.title}
                                </h2>
                            </DialogContent>
                        </DialogOverlay>
                    )}
                </div>
            </>
        )
    }
}

ImgBox.propTypes = {
    id: PropTypes.number,
    data: PropTypes.object
  };

export default props => (
    <StaticQuery
        query={graphql`
            query BoxQuery {
                allStrapiImage {
                    edges {
                        node {
                            id
                            strapiId
                            title
                            description
                            imagecontent {
                                childImageSharp {
                                    fluid(maxWidth: 1920) {
                                        ...GatsbyImageSharpFluid
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `}
        render={data => {
            <ImgBox data={data} {...props} />
        }}
    />
)