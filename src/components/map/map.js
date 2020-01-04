/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { css } from '@emotion/core';

export default class MyMap extends Component {
	render() {
		const {
            address, pins, undertext, zoom,
        } = this.props;

		console.log(pins);

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

            let text = element.name.split(/[\r\n]/g).filter(Boolean);
            console.log('text', text);
            // text = text[0].replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
            // console.log(text);

            if (!element.subtitle && text.length > 1) {
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

            return element;
        });

        console.log('thePins', thePins);


		if (typeof window !== 'undefined') {
			return (
                <div
                    css={css`
                        width: 100%;
                    `}
                >
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
							<Marker key={element.name} position={element.position}>
								<Popup>
									<b>{element.name}</b>
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
								</Popup>
							</Marker>
						))}
					</Map>
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
		}
		return null;
	}
}

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
