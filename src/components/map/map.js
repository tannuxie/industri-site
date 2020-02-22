import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
// import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { css } from '@emotion/core';
import Loadable from 'react-loadable';
import getDistance from 'geolib/es/getDistance';
import getCenterOfBounds from 'geolib/es/getCenterOfBounds';
import orderByDistance from 'geolib/es/orderByDistance';
import getBoundsOfDistance from 'geolib/es/getBoundsOfDistance';
import Loading from '~components/loading/loading';

const LoadableComponent = Loadable.Map({
    loader: {
      leaf: () => import('react-leaflet'),
    },
    loading: Loading,
    render(loaded, props) {
        const {
          Map, Marker, Popup, TileLayer,
        } = loaded.leaf;
        const {
            thePins, isActive, setActive,
            center, bounds,
        } = props;
        return (
            <div>
                {(typeof window !== 'undefined') && (
                <Map
                        center={center}
                        bounds={bounds}
                        // zoom={zoom}
                        scrollWheelZoom={isActive}
                        onFocus={() => setActive(true)}
                        style={{
                            height: '500px',
                        }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {thePins && thePins.map((element) => (
                        <Marker key={`${element.id && element.id} ${element.name} ${element.position[0]} ${element.subtitle && element.subtitle[0]}`} position={element.position}>
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

        const [isActive, setIsActive] = useState(false);
        const setActive = useCallback((boolean) => {
            setIsActive(boolean);
        }, []);

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
            } else if (!Array.isArray(element.subtitle)) {
                const text = element.subtitle.split(/[\r\n]/g).filter(Boolean);
                element.subtitle = text;
            }

            return element;
        });
        console.log('thePins', thePins);

        const allCoordinates = [address].concat(thePins.map((pin) => pin.position));
        console.log('allCoordinates', allCoordinates);

        const coordinates = allCoordinates.map((item) => ({
            latitude: item[0],
            longitude: item[1],
        }));
        console.log('map coordinates', coordinates);
        console.log('map center of coords', getCenterOfBounds(coordinates));

        const coordsByDistance = orderByDistance(getCenterOfBounds(coordinates), coordinates);
        console.log('map coordsByDistance', coordsByDistance);

        // sätter minimum-värde på distance som 250 för att det inte
        // ska bli för inzoomat när det bara är 1 träff
        const distance = Math.max(getDistance(
            getCenterOfBounds(coordinates),
            coordsByDistance[coordsByDistance.length - 1],
        ), 250);
        console.log('map distance', distance);

        const bounds = getBoundsOfDistance(
            getCenterOfBounds(coordinates),
            (distance * 1.5 + 1),
        );
        console.log('map bounds', bounds);
        const boundsArray = [
            [bounds[0].latitude + 0.000000000001, bounds[0].longitude + 0.000000000001],
            [bounds[1].latitude, bounds[1].longitude],
        ];
        console.log('map boundsArray', boundsArray);

        return (
            <div
                css={css`
                    width: 100%;
                `}
            >
                    <LoadableComponent
                        center={getCenterOfBounds(coordinates)}
                        bounds={boundsArray}
                        thePins={thePins}
                        isActive={isActive}
                        setActive={setActive}
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
