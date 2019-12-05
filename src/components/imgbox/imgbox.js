import React, { Component } from 'react';
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
    }

    render() {
        const { photoIndex } = this.state;
        const { id } = this.props;
        console.log(id);

        let aCaption = '';
        if (id.caption !== undefined) {
            aCaption = id.caption;
        }

        // const images = data.allStrapiImage.edges
        const { data } = this.props;
        console.log(data);
        const image = data.allStrapiImage.edges
            .filter((animage) => animage.node.strapiId === id);
        // console.log('finished');
        // console.log(image);

        const open = () => {
            // setIsOpen(true);
            this.setState({
                isOpen: true,
            });
        };
        const close = () => {
            // setIsOpen(false);
            this.setState({
                isOpen: false,
            });
        };
        const { isOpen } = this.state;
        return (
			<>
				<Helmet>
					<body className={this.isOpen && 'right-scroll-bar-position'} />
				</Helmet>
				<div
					role="button"
					tabIndex={0}
					onClick={() => this.setState({ isOpen: !isOpen })}
					onKeyDown={(event) => { if (event.keycode === 13) this.setState({ isOpen: !isOpen }); }}
				>
					<Img
						fluid={image[0].node.imagecontent.childImageSharp.fluid}
						alt={image[0].node.title}
						imgStyle={{ objectFit: 'contain' }}
					/>
					{aCaption.length > 0 && (
						<p style={{
                            fontStyle: 'italic',
                            textAlign: 'center',
                            fontSize: '1.1rem',
						}}
						>
							{aCaption}
						</p>
					)}

					{isOpen && (
						<DialogOverlay css={css`z-index: 9999;`} isOpen={isOpen} onDismiss={this.close()} onClick={() => this.open()}>
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
        );
    }
}

ImgBox.propTypes = {
    id: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.object).isRequired,
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
