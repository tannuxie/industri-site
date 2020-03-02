import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Img from 'gatsby-image';
import { css } from '@emotion/core';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog';
import { AnimatePresence, motion } from 'framer-motion';
import CompareValues, { compareValues } from '../functions';

const ImgBox = ({ images, undertext }) => {
    const [photoIndex, setPhotoIndex] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const overlayImageOverlay = useRef(null);

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
        setIsOpen(true);
    }

    function closeOverlay() {
        console.log('in closeOverlay');
        setIsOpen(false);
    }

    // useLayoutEffect(() => {
    //     console.log('in UseEffect');
    //     console.log('photoIndex', photoIndex);

    //     // setCurrImg(chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2]);
    //     setIsMounted(true);

    //     return () => {
    //         console.log('in UseEffect, unmounting');
    //         setIsMounted(false);
    //     };
    // }, [photoIndex, isOpen, chunkedImages]);

    // useLayoutEffect(() => {
    //     console.log('in LayoutEffect');

    //     if (photoIndex !== null) {
    //         // setCurrImg(chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2]);
    //         setIsOpen(true);
    //     }
    // }, [photoIndex]);

    const variants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0 },
    };

    return (
        <div
            className="image-container"
            css={css`
                display: flex;
                justify-content: center;
                flex-direction: row;
                flex-wrap: wrap;

                .imgBox {
                    cursor: pointer;
                }
                ${chunkedImages.length > 1 && (`
                    @media (min-width: 1024px) {
                        .gatsby-image-wrapper {
                            max-height: 40vh;
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
                                imgStyle={{ objectFit: 'contain' }}
                            />
                        </div>
                    );
                });
            })}
            {undertext && undertext.length > 0 && (
                <p
                    css={css`
                        font-style: italic;
                        text-align: center;
                        width: 100%;
                        margin-bottom: 0;
                    `}
                >
                    {undertext}
                </p>
            )}
            <AnimatePresence>
            {(isOpen) && (
                <DialogOverlay
                    id="imgOverlay"
                    css={css`
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                    `}
                    onDismiss={() => closeOverlay()}
                    // onClick={() => openOverlay()}
                >
                    <motion.div
                        className="motion-div"
                        css={css`
                            position: fixed;
                            top: 0;
                            bottom: 0;
                            right: 0;
                            left: 0;
                            contain: strict;
                            z-index: 20000;
                            display: flex;
                        `}
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 150, damping: 50, mass: 0.7 }}
                    >
                        <div
                            className="background"
                            css={css`
                                position: absolute;
                                top: 0;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                background-color: rgba(0, 0, 0, 0.2);
                            `}
                        />
                        <DialogContent
                            css={css`
                                margin: 2vh auto 0;
                                padding: 15px;
                                width: 70vw;
                                max-height: 95vh;
                                position: relative;
                                display: flex;
                                flex-direction: row;
                                flex-wrap: wrap;
                                justify-content: center;
                                background-color: white;
                                align-self: center;
                                @media (max-width: 1680px) {
                                    width: 90vw;
                                }
                                @media (max-width: 769px) {
                                    width: 100%;
                                    margin: 0;
                                    padding: 0;
                                }


                                .gatsby-image-wrapper img {
                                    object-fit: contain !important;
                                }
                            `}
                            aria-label={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
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
                                        <div
                                            className='tools'
                                            css={css`
                                                position: absolute;
                                                top: 1.2rem;
                                                right: 1.2rem;
                                                z-index: 100;
                                                background-color: white;
                                                overflow: hidden;
                                                @media (max-width: 769px) {
                                                    right: 10px;
                                                    display: none;
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

                                                #imgbox-zoomin {
                                                    span {
                                                        :before {
                                                            content: '+';
                                                        }
                                                    }
                                                }
                                                #imgbox-zoomout {
                                                    padding: 0 5px 12px;
                                                    span {
                                                        :before {
                                                            content: '-';
                                                        }
                                                    }
                                                }
                                                #imgbox-zoomreset {
                                                    span {
                                                        :before {
                                                            content: '0';
                                                        }
                                                    }
                                                }
                                            `}
                                        >
                                            <button
                                                id="imgbox-zoomin"
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
                                                id="imgbox-zoomout"
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
                                                id="imgbox-zoomreset"
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
                                        </div>
                                        <TransformComponent>
                                            <Img
                                                fluid={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2]
                                                    .bildfil.childImageSharp.fluid}
                                                alt={chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
                                                imgStyle={{ objectFit: 'contain' }}
                                                style={{ maxHeight: '75vh'}}
                                                css={css`
                                                    min-width: 80vw;
                                                    @media (max-width: 769px) {
                                                        min-width: 95vw;
                                                    }
                                                `}
                                            />

                                        </TransformComponent>
                                    </>
                                )}
                            </TransformWrapper>
                            <div
                                css={css`
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: stretch;
                                    width: 100%;
                                `}
                            >
                                <h2
                                    css={css`
                                        margin-top: 1.25rem;
                                        flex-grow: 1;
                                        text-align: center;
                                        @media (max-width: 769px) {
                                            padding-left: 10px;
                                        }
                                    `}
                                >
                                    {chunkedImages[Math.floor(photoIndex / 2)][photoIndex % 2].beskrivning}
                                </h2>
                                <button
                                    id="imgbox-close"
                                    css={css`
                                        margin-top: 0.5rem;
                                        padding: 0 5px;
                                        max-height: calc(35px + 1.25rem);
                                        color: transparent;
                                        text-shadow: 0 0 0 #4e4e4e;
                                        border-width: 0;
                                        background-color: transparent;
                                        @media (max-width: 769px) {
                                            margin-right: 10px;
                                        }
                                    `}
                                    tabIndex={0}
                                    onClick={() => closeOverlay()}
                                    onKeyDown={(event) => {
                                        if (event.keycode === 13) {
                                            closeOverlay();
                                        }
                                    }}
                                >
                                    <span
                                        css={css`
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
                                        `}
                                    />
                                </button>
                            </div>
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
