import React from 'react';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import { Helmet } from 'react-helmet';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import '@reach/dialog/styles.css';

// import { zeroRightClassName,fullWidthClassName, noScrollbarsClassName }
// from 'react-remove-scroll-bar';

class ImgBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photoIndex: 0,
            isOpen: false,
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open = () => {
        this.setState({
            isOpen: true,
        });
    };

    close = () => {
        this.setState({
            isOpen: false,
        });
    };

    render() {
        const { isOpen, photoIndex } = this.state;
        const { data, images, caption } = this.props;
        const aCaption = caption !== undefined ? caption : '';

        // const images = data.allStrapiImage.edges
        console.log(data);
        console.log(images);
        const ids = images.map((e) => e.id);
        console.log(ids);
        const selectImages = data.allStrapiImage.edges
            .filter((animage) => ids.indexOf(animage.node.strapiId) !== -1);

        console.log(selectImages);
        const aspectRatioSum = selectImages.map((e) => (
            e.node.imagecontent.childImageSharp.fluid.aspectRatio))
        .reduce((accumulator, currentValue, currentIndex, array) => accumulator + currentValue);
        // console.log('finished');
        // console.log(image);

        return (
			<>
				<Helmet>
					<body className={isOpen && 'right-scroll-bar-position'} />
				</Helmet>
                <div
                    css={css`
                        display: flex;
                        justify-content: center;
                        flex-direction: row;
                        flex-wrap: wrap;
                    `}
                >
                    {selectImages.map((item, index) => {
                        const {
                        id, strapiId, title, description, imagecontent,
                        } = item.node;
                        return (
                            <div
                                role="button"
                                key={title}
                                tabIndex={0}
                                onClick={() => this.setState({
                                    isOpen: !isOpen,
                                    photoIndex: index,
                                })}
                                style={{
                                    width: `${(imagecontent.childImageSharp.fluid.aspectRatio / aspectRatioSum) * 100}%`,
                                }}
                                onKeyDown={(event) => {
                                    if (event.keycode === 13) {
                                        this.setState({
                                            isOpen: !isOpen,
                                            photoIndex: index,
                                        });
                                    }
                                }}
                            >
                                <Img
                                    fluid={imagecontent.childImageSharp.fluid}
                                    alt={title}
                                    imgStyle={{ objectFit: 'contain' }}
                                />


                            </div>
                        );
                    })}
                    {aCaption.length > 0 && (
                        <p
                            css={css`
                                font-style: italic;
                                text-align: center;
                                font-size: 1.1rem;
                                width: 100%;
                                margin-bottom: 0;
                            `}
                        >
                            {aCaption}
                        </p>
                    )}
                    {isOpen && (
                        <DialogOverlay
                            css={css`z-index: 9999;`}
                            isOpen={isOpen}
                            onDismiss={this.close}
                            onClick={() => this.open}
                        >
                            <DialogContent
                                css={css`
                                    @media (max-width: 1920px) {
                                        width: 65vw;
                                    }
                                    @media (max-width: 1680px) {
                                        width: 75vw;
                                    }
                                    @media (max-width: 1023px) {
                                        width: 95vw;
                                    }
                                    @media (max-width: 769px) {
                                        width: 100vw;
                                        padding-left: 0;
                                        padding-right: 0;
                                    }
                                `}
                                aria-label={selectImages[photoIndex].node.title}
                            >
                                <Img
                                    fluid={selectImages[photoIndex]
                                        .node.imagecontent.childImageSharp.fluid}
                                    alt={selectImages[photoIndex].node.title}
                                />
                                <h2>
                                    {selectImages[photoIndex].node.title}
                                </h2>
                            </DialogContent>
                        </DialogOverlay>
                    )}
                </div>
			</>
        );
    }
}

ImgBox.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        desc: PropTypes.string,
    })).isRequired,
    caption: PropTypes.string,
    data: PropTypes.objectOf(PropTypes.object).isRequired,
};

ImgBox.defaultProps = {
    caption: undefined,
};

export default (props) => (
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
                                        aspectRatio
									}
								}
							}
						}
					}
				}
			}
		`}
		render={(data) => <ImgBox data={data} {...props} />}
	/>
);
