import React, { useState } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';
import {zeroRightClassName,fullWidthClassName, noScrollbarsClassName} from 'react-remove-scroll-bar';

export default (id, caption) => (
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
            console.log('in staticQuery');
            console.log('id:');
            console.log(id);
            console.log(id.id);
            
            console.log('data:');            
            console.log(data);

            console.log('caption:');            
            console.log(caption);
            
            let aCaption = '';
            if(id.caption !== undefined) {
                aCaption = id.caption
            }

            //const images = data.allStrapiImage.edges
            const image = data.allStrapiImage.edges.filter(
                function (image) {
                    return image.node.strapiId == id.id;
                }
            )
            console.log('finished');
            console.log(image);            
            
            const [photoIndex, setPhotoIndex] = useState(0);
            const [isOpen, setIsOpen] = useState(false);
            const open = () => {
                setIsOpen(true);
                //document.getElementsByTagName("body")[0].style = 'margin-right:0px!important';
                var element = document.getElementsByTagName("body")[0];
                //element.style.marginRight = 'margin-right:0px!important';
                element.style.marginLeft = 'calc(100vw - 100%)';
                //margin-left: calc(100vw - 100%);
            }
            const close = () => {
                setIsOpen(false);
                var element = document.getElementsByTagName("body")[0];

                element.style.marginLeft = null;
            }

            return (
            <div onClick={() => setIsOpen(!isOpen)}>
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
            
                {isOpen && (
                    <DialogOverlay className={zeroRightClassName} isOpen={isOpen} onDismiss={close} onClick={() => open()}>
                        <DialogContent>
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
            )
        }}
    />
)



/*   constructor(props) {
    super(props);
 
    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }
 
  render() {
    const { photoIndex, isOpen } = this.state;
 
    return (
      <div>
        <button type="button" onClick={() => this.setState({ isOpen: true })}>
          Open Lightbox
        </button>
 
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
} */