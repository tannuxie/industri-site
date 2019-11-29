import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

export default class MyMap extends Component {
	render() {
		const { addresses } = this.props;
		// console.log('component: ' + this.props.position);
		console.log(addresses);

		const myAddresses = addresses;
		let latest = null;

		for (let index = 0; index < myAddresses.length; index++) {
			const element = myAddresses[index];
			console.log(element);

			if (element.startdate !== undefined) {
				Object.assign(myAddresses[index], { subtitle: `${element.startdate} - ${element.enddate}` });
			} else if (element.subtitle !== undefined) {
				Object.assign(myAddresses[index], { subtitle: element.subtitle });
				latest = index;
				break;
			} else {
				Object.assign(myAddresses[index], { subtitle: '' });
				latest = index;
				break;
			}

			if (latest == null) {
				latest = index;
			} else if (myAddresses[latest].enddate === 'Nutid') {
				break;
			} else if (element.enddate === 'Nutid') {
				latest = index;
			} else if (element.enddate > myAddresses[latest].enddate) {
				latest = index;
			}
			console.log(`subtitle: ${myAddresses[index].subtitle}`);
		}


		if (typeof window !== 'undefined') {
			return (
				<div>
					<Map
						center={myAddresses[latest].position}
						zoom={15}
						style={{
							height: '500px',
						}}
					>
						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
						/>
						{myAddresses.map((element) => (
							<Marker key={element.name} position={element.position}>
								<Popup>
									<b>{element.name}</b>
									<br />
									{element.subtitle}
								</Popup>
							</Marker>
						))}
					</Map>
				</div>
			);
		}
		return null;
	}
}
