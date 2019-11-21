import React, { useState } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

export default (id) => (
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
            const toggle = () => setIsOpen(!isOpen);

            return (
            <div onClick={() => setIsOpen(!isOpen)}>
                <Img 
                    fluid={image[0].node.imagecontent.childImageSharp.fluid} 
                    alt={image[0].node.title} 
                />

            
                {isOpen && (
                    <Dialog isOpen={isOpen} onDismiss={toggle} onClick={() => toggle()}>
                        <Img 
                            fluid={image[0].node.imagecontent.childImageSharp.fluid} 
                            alt={image[0].node.title} 
                        />
                        <h2>{image[0].node.title} </h2>
                    </Dialog>
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