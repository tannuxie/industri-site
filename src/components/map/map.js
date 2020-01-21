import React from 'react';
import PropTypes from 'prop-types';
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { css } from '@emotion/core';
import Loadable from 'react-loadable';

const Loading = () => {
    return (
        <div css={css`
            width: 100%
            height: 500px;
        `}
        >
            <h1
                css={css`text-align: center;`}
            >
                Laddar karta...
            </h1>
        </div>
    );
};

const LoadableComponent = Loadable.Map({
    loader: {
      leaf: () => import('react-leaflet'),
    },
    loading: Loading,
    render(loaded, props) {
        const {
          Map, Marker, Popup, TileLayer,
        } = loaded.leaf;
        const { address, zoom, thePins } = props;
        return (
            <div>
                {(typeof window !== 'undefined') && (
                <Map
                        center={address}
                        zoom={zoom}
                        style={{
                            height: '500px',
                        }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {thePins && thePins.map((element) => (
                        <Marker key={`${element.name } ${ element.position[0]}`} position={element.position}>
                            <Popup>
                                <b>{element.name}</b>
                                {element.subtitle && (
                                <>
                                    <br />
                                    {element.subtitle.map((line) => (
                                        <span
                                            key={line}
                                            css={css`
                                                display: block;
                                            `}
                                        >
                                            {line}
                                        </span>
                                    ))}
                                </>
                                )}
                            </Popup>
                        </Marker>
                    ))}
                </Map>
                )}
            </div>
        );
    },
  });

const MyMap = ({
    address, pins, undertext, zoom,
    }) => {
		console.log('MyMap', address, pins, undertext, zoom);

        // addresses shape
        // pins: PropTypes.arrayOf(PropTypes.shape({
        // name: PropTypes.string,
        // addressstring1: PropTypes.string,
        // addressstring2: PropTypes.string,
        // position: PropTypes.arrayOf(PropTypes.number),
        // subtitle: PropTypes.string,
        // })).isRequired,
        // undertext: PropTypes.string,
        // zoom: PropTypes.number,

		const thePins = pins.map((pin) => {
			console.log('pins element', pin);
            const element = pin;
            if (!element.subtitle) {
                const text = element.name.split(/[\r\n]/g).filter(Boolean);
                console.log('text', text);
                // text = text[0].replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
                // console.log(text);
                if (text.length > 1) {
                    element.name = text[0];
                    element.subtitle = '';
                    let temp = [];
                    for (let i = 1; i < text.length; i++) {
                        const string = text[i];
                        temp.push(string);
                        // if (i < text.length) {
                        //     element.subtitle += <br />;
                        // }
                    }
                    element.subtitle = temp;
                }
            } else {
                const text = element.subtitle.split(/[\r\n]/g).filter(Boolean);
                element.subtitle = text;
            }

            return element;
        });

        console.log('thePins', thePins);

        return (
            <div
                css={css`
                    width: 100%;
                `}
            >
                <>
                    <LoadableComponent
                        address={address}
                        zoom={zoom}
                        thePins={thePins}
                    />
                    {undertext.length > 0 && (
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
                </>
            </div>
        );
};

MyMap.propTypes = {
    address: PropTypes.arrayOf(PropTypes.number).isRequired,
    pins: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        position: PropTypes.arrayOf(PropTypes.number),
        subtitle: PropTypes.string,
    })),
    undertext: PropTypes.string,
    zoom: PropTypes.number,
};

MyMap.defaultProps = {
    pins: [],
    undertext: '',
    zoom: 15,
};

export default MyMap;
