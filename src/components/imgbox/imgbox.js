import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { rhythm, scale } from '../../style/typography';
import CompareValues, { compareValues } from '../functions';

const ArrowBase = styled.i`
    border: solid #4e4e4e;
    border-width: 0 5px 5px 0;
    display: inline-block;
    padding: 15px;
`;

const ArrowLeft = css`
    transform: rotate(135deg);
    webkit-transform: rotate(135deg);
`;

const ArrowRight = css`
    transform: rotate(-45deg);
    webkit-transform: rotate(-45deg);
`;

const ImgboxSubtitle = styled.p`
    font-style: italic;
    text-align: center;
    width: 100%;
    margin-bottom: 0;
`;

const MotionStyles = css`
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	contain: strict;
	z-index: 20000;
	display: flex;
`;

const BackgroundDiv = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.2);
`;

const DialogStyles = css`
	margin: 2vh auto 0;
	padding: 15px;
	width: 75vw;
	max-height: 95vh;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: white;
	align-self: center;

	@media (max-width: 1680px) {
		width: 95vw;
    }
    @media (max-width: 1023px) {
        height: 60vh;
    }
	@media (max-width: 769px) {
		width: 100%;
		margin: 0;
		padding: 62px 0px 0px 0px;
	}
	.react-transform-component {
		flex-grow: 1;
		width: 100%;
		@media (max-width: 769px) {
			align-self: center;
		}
	}
	.react-transform-element {
		height: 100%;
	}
`;

const ToolsDiv = styled.div`
	position: absolute;
	top: 1.2rem;
	right: 1.2rem;
	z-index: 100;
	background-color: white;
	overflow: hidden;
	@media (max-width: 769px) {
		right: 10px;
		top: 0px;
	}
	button:first-of-type {
		margin-left: 0.5rem;
	}
	button:not(:last-of-type) {
		margin-right: 0.5rem;
	}
	button {
		padding: 0 10px;
		vertical-align: middle;
		max-height: calc(35px + 1.25rem);
		color: transparent;
		text-shadow: 0 0 0 #4e4e4e;
		border-width: 0;
		background-color: transparent;
		@media (max-width: 769px) {
			top: auto;
			right: 5px;
			bottom: 0;
		}
		span {
			height: 50px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			:before {
				font-weight: 300;
				font-family: Arial, sans-serif;
				font-size: 3rem;
				cursor: pointer;
			}
		}
	}

	#imgOverlay-zoomin {
		span {
			:before {
				content: '+';
			}
		}
	}
	#imgOverlay-zoomout {
		padding: 0 5px 12px;
		span {
			:before {
				content: '-';
			}
		}
	}
	#imgOverlay-zoomreset {
		span {
			:before {
				content: '0';
			}
		}
	}
`;

const OverlayImg = css`
    min-width: calc(75vw - 30px);
    max-height: 75vh;
    @media (max-width: 1680px) {
        min-width: calc(95vw - 30px);
    }
    @media (max-width: 769px) {
        min-width: calc(100vw - 17px);
        max-height: 50vh;
    }
`;

const OverlayBottomDiv = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: stretch;
	width: 100%;
	@media (max-width: 769px) {
		align-items: flex-end;
	}
`;

const OverlayBottomText = styled.h2`
	margin-top: 1.25rem;
	flex-grow: 1;
	text-align: center;
	@media (max-width: 769px) {
		padding-left: 10px;
	}
`;

const OverlayCloseBtn = styled.button`
	margin-top: 0.5rem;
	padding: 0 5px;
	max-height: calc(35px + 1.25rem);
	color: transparent;
	text-shadow: 0 0 0 #4e4e4e;
	border-width: 0;
	background-color: transparent;
	@media (max-width: 769px) {
		margin-right: 10px;
		padding-bottom: 0.75rem;
	}
	span {
		height: 50px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;

		:before {
			content: 'x';
			font-weight: 300;
			font-family: Arial, sans-serif;
			font-size: 3rem;
			cursor: pointer;
		}
	}
`;

const ImgBox = ({ images, undertext }) => {
    const [photoIndex, setPhotoIndex] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    function getAspectRatioSum(imagesToSum) {
        // console.log('in getAspectRatio');
        // console.log('aspect images: ', imagesToSum);

        const aspectSum = imagesToSum.map((currentImg) => (
        currentImg.bildfil.childImageSharp.fluid.aspectRatio))
        .reduce((accumulator, currentValue) => accumulator + currentValue);
        // console.log('aspectSum', aspectSum);

        return aspectSum;
    }

    const chunkedImages = useMemo(() => {
        const aspectRatioImages = images.map(((item) => {
            const current = item;
            current.aspectRatio = item.bildfil.childImageSharp.fluid.aspectRatio;
            return current;
        }));
        console.log('aspectRatioImages', aspectRatioImages);
        // const aspectSortedImages = aspectRatioImages.sort(compareValues('aspectRatio', 'asc'));
        const aspectSortedImages = aspectRatioImages;
        console.log('aspectSortedImages', aspectSortedImages);

        const newImagesArray = [];
        if (aspectSortedImages.length === 1) {
            newImagesArray.push(aspectSortedImages);
        } else {
            let lastElement = null;
            if (aspectSortedImages.length % 2 !== 0) {
                lastElement = aspectSortedImages.pop();
            }
            for (let index = 0; index < aspectSortedImages.length / 2; index++) {
                const earlyElement = aspectSortedImages[index];
                const endElement = aspectSortedImages[aspectSortedImages.length - 1 - index];
                newImagesArray.push([earlyElement, endElement]);
            }
            if (lastElement) {
                newImagesArray.push([lastElement]);
            }
        }
        console.log('newImagesArray', newImagesArray);

        return newImagesArray;
    }, [images]);

    function openOverlay(number) {
        console.log('in openOverlay', number);
        setPhotoIndex(number);
        if (number > 0) {
            setCanPrev(true);
        }
        if ((number + 1) < images.length) {
            setCanNext(true);
        }
        setIsOpen(true);
    }

    function closeOverlay() {
        console.log('in closeOverlay');
        setIsOpen(false);
        setCanPrev(false);
        setCanNext(false);
    }

    function prevImg() {
        console.log('in prevImg');
        const pIndex = photoIndex;
        setPhotoIndex(pIndex - 1);

        setCanNext(true);
        if ((pIndex - 2) < 0) {
            setCanPrev(false);
        }
    }

    function nextImg() {
        console.log('in nextImg');
        const pIndex = photoIndex;
        setPhotoIndex(pIndex + 1);

        setCanPrev(true);
        if ((pIndex + 2) >= images.length) {
            setCanNext(false);
        }
    }

    return (
        <div
            className="image-container"
            css={css`
                display: flex;
                justify-content: center;
                flex-direction: row;
                flex-wrap: wrap;

                ${chunkedImages.length > 1 && (`
                    @media (min-width: 1024px) {
                        .gatsby-image-wrapper {
                            max-height: 65vh;
                        }
                    }
                `)}
            `}
        >
            {chunkedImages.map((chunk, chunkIndex) => {
                // console.log('chunk nr', chunkIndex);
                // console.log('all chunks', chunkedImages);
                // console.log('chunk data', chunk);

                return chunk.map((item, imageIndex) => {
                    const {
                        id, beskrivning, bildfil,
                    } = item;
                    return (
                        <div
                            className="imgBox"
                            role="button"
                            key={`${id} ${beskrivning}`}
                            tabIndex={0}
                            onClick={() => {
                                console.log('chunk', (chunkIndex * 2) + imageIndex);
                                console.log('chunk data', chunk);
                                console.log('all chunks', chunkedImages);
                                console.log('test5', chunkedImages[Math.floor(((chunkIndex * 2) + imageIndex) / 2)][((chunkIndex * 2) + imageIndex) % 2].beskrivning);

                                openOverlay((chunkIndex * 2) + imageIndex);
                            }}
                            css={css`
                                width: ${(bildfil.childImageSharp.fluid.aspectRatio / getAspectRatioSum(chunk)) * 100}%;
                            `}
                            onKeyDown={(event) => {
                                if (event.keycode === 13) {
                                    openOverlay((chunkIndex * 2) + imageIndex);
                                }
                            }}
                        >
                            <Img
                                fluid={bildfil.childImageSharp.fluid}
                                alt={beskrivning}
                                imgStyle={{ objectFit: 'cover' }}
                            />
                        </div>
                    );
                });
            })}
            {undertext && undertext.length > 0 && (
                <ImgboxSubtitle
                    className='imgbox-subtitle'
                >
                    {undertext}
                </ImgboxSubtitle>
            )}
            <AnimatePresence>
            {(isOpen) && (
                <DialogOverlay
                    id="imgOverlay"
                    css={css`
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        ${chunkedImages[0].length === 1 && (`
                            #imgbox-previmg, #imgbox-nextimg {
                                display: none;
                            }
                        `)}
                    `}
                    onDismiss={() => closeOverlay()}
                    // onClick={() => openOverlay()}
                >
                    <motion.div
                        id="imgOverlay-motion"
                        css={MotionStyles}
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            type: 'spring', stiffness: 150, damping: 50, mass: 0.7,
                        }}
                    >
                        <BackgroundDiv />
                        <DialogContent
                            css={DialogStyles}
                            aria-label={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2]
                                .beskrivning}
                        >
                            <TransformWrapper
                                defaultScale={1}
                                scale={1}
                                defaultPositionX={0}
                                defaultPositionY={0}
                                positionX={0}
                                positionY={0}
                                options={{
                                        limitToWrapper: true,
                                }}
                                scalePadding={{
                                        size: 0.2,
                                }}
                                pan={{
                                        velocitySensitivity: 0.5,
                                        velocity: false,
                                }}
                            >
                                {({
                                    zoomIn, zoomOut, resetTransform, ...rest
                                }) => (
                                    <>
                                        <ToolsDiv
                                            id='imgOverlay-tools'
                                        >
                                            <button
                                                id='imgOverlay-previmg'
                                                aria-label="Visa föregående bild"
                                                css={css`
                                                    ${canPrev ? ('cursor: pointer;') : ('opacity: 0.3;')};
                                                `}
                                                tabIndex={0}
                                                onClick={() => {
                                                    if (canPrev) {
                                                        prevImg();
                                                    }
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.keycode === 13 && canPrev) {
                                                        prevImg();
                                                    }
                                                }}
                                                disabled={!canPrev}
                                            >
                                                <span>
                                                    <ArrowBase
                                                        className="arrow-left"
                                                        css={ArrowLeft}
                                                    />
                                                </span>
                                            </button>
                                            <button
                                                id='imgOverlay-nextimg'
                                                aria-label="Visa nästa bild"
                                                css={css`
                                                    ${canNext ? ('cursor: pointer') : ('opacity: 0.3;')};
                                                `}
                                                tabIndex={0}
                                                onClick={() => {
                                                    if (canNext) {
                                                        nextImg();
                                                    }
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.keycode === 13 && canNext) {
                                                        nextImg();
                                                    }
                                                }}
                                                disabled={!canNext}
                                            >
                                                <span>
                                                    <ArrowBase
                                                        className="arrow-right"
                                                        css={ArrowRight}
                                                    />
                                                </span>
                                            </button>
                                            <button
                                                id="imgOverlay-zoomin"
                                                aria-label="Zooma in på bilden"
                                                tabIndex={0}
                                                onClick={zoomIn}
                                                onKeyDown={(event) => {
                                                    if (event.keycode === 13) {
                                                        zoomIn();
                                                    }
                                                }}
                                            >
                                                <span />
                                            </button>
                                            <button
                                                id="imgOverlay-zoomout"
                                                aria-label="Zooma ut på bilden"
                                                tabIndex={0}
                                                onClick={zoomOut}
                                                onKeyDown={(event) => {
                                                    if (event.keycode === 13) {
                                                        zoomOut();
                                                    }
                                                }}
                                            >
                                                <span />
                                            </button>
                                            <button
                                                id="imgOverlay-zoomreset"
                                                aria-label="Nollställ bilden"
                                                tabIndex={0}
                                                onClick={resetTransform}
                                                onKeyDown={(event) => {
                                                    if (event.keycode === 13) {
                                                        resetTransform();
                                                    }
                                                }}
                                            >
                                                <span />
                                            </button>
                                        </ToolsDiv>
                                        <TransformComponent>
                                            <Img
                                                fluid={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2]
                                                    .bildfil.childImageSharp.fluid}
                                                alt={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
                                                imgStyle={{ objectFit: 'contain' }}
                                                css={OverlayImg}
                                            />

                                        </TransformComponent>
                                    </>
                                )}
                            </TransformWrapper>
                            <OverlayBottomDiv>
                                <OverlayBottomText>
                                    {chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
                                </OverlayBottomText>
                                <OverlayCloseBtn
                                    id="imgOverlay-close"
                                    tabIndex={0}
                                    onClick={() => closeOverlay()}
                                    onKeyDown={(event) => {
                                        if (event.keycode === 13) {
                                            closeOverlay();
                                        }
                                    }}
                                >
                                    <span />
                                </OverlayCloseBtn>
                            </OverlayBottomDiv>
                        </DialogContent>
                    </motion.div>
                </DialogOverlay>
                )}
            </AnimatePresence>
        </div>
    );
};

ImgBox.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        beskrivning: PropTypes.string,
        bildfil: PropTypes.shape({
            childImageSharp: PropTypes.object,
            id: PropTypes.string,
        }),
        id: PropTypes.number,
    })).isRequired,
    undertext: PropTypes.string,
};

ImgBox.defaultProps = {
    undertext: '',
};

export default ImgBox;
