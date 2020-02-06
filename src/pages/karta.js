import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { css } from '@emotion/core';
import Img from 'gatsby-image';
import Slider from 'rc-slider';
import getDistance from 'geolib/es/getDistance';
import getCenterOfBounds from 'geolib/es/getCenterOfBounds';
import orderByDistance from 'geolib/es/orderByDistance';
import getBoundsOfDistance from 'geolib/es/getBoundsOfDistance';
import getBounds from 'geolib/es/getBounds';
import computeDestinationPoint from 'geolib/es/computeDestinationPoint';
import Loadable from 'react-loadable';
import CircularProgress from '@material-ui/core/CircularProgress';
import L from 'leaflet';
import '~style/slider.css';

// getDistance(start, end, accuracy = 1)
// By default the accuracy is 1 meter. If you need a more accurate result,
// you can set it to a lower value, e.g. to 0.01 for centimeter accuracy.
// You can set it higher to have the result rounded to the next value that
// is divisible by your chosen accuracy

// getCenter(coords)
// Calculates the geographical center of all points in a collection of geo
// coordinates. Takes an array of coordinates and calculates the center of it.

// getCenterOfBounds(coords)
// On polygons like political borders (eg. states), this may gives a
// closer result to human expectation, than getCenter, because that
// function can be disturbed by uneven distribution of point in different
// sides.

// getBounds(points)
// Calculates the bounds of geo coordinates.

// computeDestinationPoint(point, distance, bearing, radius = earthRadius)

const Loading = () => (
    <div css={css`
        width: 100%
        height: 500px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `}
    >
        <h1
            css={css`text-align: center;`}
        >
            Laddar karta...
        </h1>
        <CircularProgress />
    </div>
);

// pins ska vara en array med objekt som har
// name, position(array med lat, lng), subtitle(array av textrader)

const LoadableComponent = Loadable.Map({
    loader: {
      leaf: () => import('react-leaflet'),
    },
    loading: Loading,
    render(loaded, props) {
        const {
          Map, Marker, Popup, Tooltip, TileLayer,
        } = loaded.leaf;
        const {
            center, bounds, pins, zoom, changeActive,
        } = props;
        const myIcon = ((year) => {
            const icon = L.divIcon({
                        className: 'year-icon',
                        html: `<span>${year}</span>`,
                        });
            return icon;
        });

        return (
            <div>
                {(typeof window !== 'undefined') && (
                <Map
                    center={center}
                    bounds={bounds && bounds}
                    zoom={zoom && zoom}
                    maxZoom={17}
                    minZoom={10}
                    style={{
                        height: '600px',
                    }}
                    css={css`
                        .year-icon {
                            display: flex;
                            width: 45px!important;
                            height: 45px!important;
                            background-color: white;
                            justify-content: center;
                            opacity: 0.8;
                            border-radius: 50%;
                            align-items: center;
                            box-shadow: 0px 0px 3px 1px #000000b5;
                        }
                        .year-icon span {
                            font-size: 0.9rem;
                        }
                    `}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        maxZoom={17}
                        crossOrigin="anonymous"
                        bounds={bounds && (bounds * 1.5)}
                    />
                    {pins && pins.map((element) => (
                        <Marker
                            key={`${element.name } ${ element.position[0]}`}
                            position={element.position}
                            icon={myIcon(element.startdate)}
                            data-company={element.name}
                            // onClick={((e) => {
                            //     console.log(e);
                            //     changeActive(e.target.options['data-company']);
                            // })}
                        >
                            <Popup
                                onOpen={(() => {
                                    changeActive(element.strapiId);
                                })}
                                onClose={(() => {
                                    changeActive(-1);
                                })}
                            >
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

const KartSida = () => {
    const { createSliderWithTooltip } = Slider;
    const Range = createSliderWithTooltip(Slider.Range);

    // filter
    const [currentCity, setCurrentCity] = useState('alla');
    const [currentType, setCurrentType] = useState('alla');

    // lägre och övre max-värden för slidern
    const [lowerMax, setLowerMax] = useState(0);
    const [upperMax, setUpperMax] = useState(0);

    // nuvarande värden för slidern
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);

    // nuvarande antal aktuella företag
    const [nmbrCompaniesAfterCityType, setNmbrCompaniesAfterCityType] = useState(0);
    const [nmbrCompaniesAfterRange, setNmbrCompaniesAfterRange] = useState(0);

    // kartans state
    const [mapCenter, setMapCenter] = useState([]);
    const [mapBounds, setMapBounds] = useState([]);
    const [mapPins, setMapPins] = useState([]);

    // aktuellt företag
    const [currentCompany, setCurrentCompany] = useState(-1);
    const [infoTabOpen, setInfoTabOpen] = useState(0);

    const data = useStaticQuery(graphql`
        query AddressQuery {
            company: allStrapiCompany {
                edges {
                    node {
                        id
                        strapiId
                        name
                        city
                        type
                        summary
                        companyimage {
                          childImageSharp {
                            fluid(maxWidth: 970) {
                              aspectRatio
                              ...GatsbyImageSharpFluid
                            }
                          }
                        }
                        fields {
                            slug
                        }
                        address {
                            addresstext1
                            addresstext2
                            enddate(formatString: "YYYY")
                            id
                            latitude
                            longitude
                            startdate(formatString: "YYYY")
                        }
                    }
                }
            }
        }
    `);
    // const addressData = React.useMemo(() => {
    //     data.company.edges.map((item) => item.node);
    // }, [data.company.edges]);
    // // console.log('addressData', addressData);

    const withMinMaxData = useMemo(() => {
        console.log('in withMinMaxData');
        const thedata = data.company.edges.map((item) => item.node);
        const result = thedata.map((item) => {
            const current = item;
            const now = new Date();

            const currStart = current.address.map((addr) => Number(addr.startdate));
            console.log('currStart', currStart, 'min', Math.min(...currStart));
            current.min = Math.min(...currStart);

            const currEnd = current.address.map((addr) => Number(addr.enddate));
            console.log('currEnd', currEnd, 'max', Math.max(...currEnd));

            current.max = (currEnd.includes(0))
            ? now.getFullYear() : Math.max(...currEnd);
            const address = item.address.map((item2) => {
                const currAddr = item2;
                currAddr.name = item.name;
                currAddr.strapiId = item.strapiId;
                currAddr.city = item.city;
                currAddr.type = item.type;
                currAddr.slug = item.fields.slug;
                currAddr.startdate = Number(item2.startdate);
                currAddr.enddate = (!item2.enddate || item2.enddate === 0)
                ? now.getFullYear()
                : Number(item2.enddate);
                return currAddr;
            });
            current.address = address;
            return current;
        });
        console.log('withMinMaxData result', result);

        return result;
    }, [data]);

    // uppdatera kartans state
    useEffect(() => {
        console.log('in useEffect: map update');
        console.log('withMinMaxData', withMinMaxData);

        const filteredByCityType = withMinMaxData.filter((item) => (
            (currentCity !== 'alla') ? item.city === currentCity : item))
            .filter((item) => ((currentType !== 'alla') ? item.type === currentType : item));
        console.log('filteredbyCityType', filteredByCityType);
        setNmbrCompaniesAfterCityType(filteredByCityType.length);

        const min = (() => {
            if (filteredByCityType.length === 0) {
                return 1900;
            }
            const minValues = filteredByCityType.map((item) => item.min);
            const minNmbr = Math.min(...minValues);
            return minNmbr;
        })();
        console.log('findLowest result', min);

        if (value1 === 0 || value1 < min) {
            setValue1(min);
        }
        setLowerMax(min);

        const max = (() => {
            const now = new Date();
            if (filteredByCityType.length === 0) {
                console.log('findHighest result', now.getFullYear());
                return now.getFullYear();
            }
            const maxValues = filteredByCityType.map((item) => item.max);
            const result = Math.max(...maxValues);
            return result;
        })();
        console.log('findHighest result', max);

        if (value2 === 0 || value2 > max) {
            setValue2(max);
        }
        setUpperMax(max);

        const addresses = filteredByCityType.map((item) => item.address).flat();

        const filteredByRange = addresses.filter((item) => (
            (value1 !== lowerMax || value2 !== upperMax)
            ? (item.enddate >= value1 && item.startdate <= value2)
            : item
        ));

        console.log('addresses length', filteredByRange.length, 'content', filteredByRange);
        setNmbrCompaniesAfterRange(filteredByRange.length);
        const pins = filteredByRange.map((item) => {
            const obj = {
                position: [item.latitude, item.longitude],
                subtitle: [item.addresstext1, item.addresstext2],
                ...item,
            };
            return obj;
        });
        setMapPins(pins);
        console.log('pins:', pins);

        if (filteredByRange.length > 0) {
            const coordinates = filteredByRange.map((item) => ({
                latitude: item.latitude,
                longitude: item.longitude,
            }));
            console.log('coordinates', coordinates);
            console.log('center of coords', getCenterOfBounds(coordinates));

            const coordsByDistance = orderByDistance(getCenterOfBounds(coordinates), coordinates);
            console.log('coordsByDistance', coordsByDistance);

            // sätter minimum-värde på distance som 250 för att det inte
            // ska bli för inzoomat när det bara är 1 träff
            const distance = Math.max(getDistance(
                getCenterOfBounds(coordinates),
                coordsByDistance[coordsByDistance.length - 1],
            ), 250);
            console.log('distance', distance);

            const bounds = getBoundsOfDistance(
                getCenterOfBounds(coordinates),
                (distance * 1.5 + 1),
            );
            console.log('bounds', bounds);
            const boundsArray = [
                [bounds[0].latitude + 0.000000000001, bounds[0].longitude + 0.000000000001],
                [bounds[1].latitude, bounds[1].longitude],
            ];
            console.log('boundsArray', boundsArray);

            setMapBounds(boundsArray);
            setMapCenter(getCenterOfBounds(coordinates));
        }
    }, [currentCity, currentType, lowerMax, upperMax,
        value1, value2, withMinMaxData]);

    const changeActive = useCallback((company) => {
        // console.log('useCallback, this is', company);
        if (company === -1) {
            setInfoTabOpen(0);
            // setCurrentCompany(-1);
         } else {
            setCurrentCompany(company);
            setInfoTabOpen(1);
         }
    }, []);

    const currentCompanyData = useMemo(() => (
    (currentCompany !== -1)
    && withMinMaxData.find((item) => item.strapiId === currentCompany)
    ), [currentCompany]);

    const uniqueCompaniesInPins = useMemo(() => (
        mapPins.reduce((acc, curr) => {
            // Check if there exist an object in empty array whose CategoryId matches
            let isElemExist = acc.findIndex((item) => item.name === curr.name);
            if (isElemExist === -1) {
              let obj = {};
              obj.name = curr.name;
              obj.count = 1;
              obj.strapiId = curr.strapiId;
              acc.push(obj);
            } else {
              acc[isElemExist].count += 1;
            }
            console.log('acc', acc);
            return acc;
        }, [])
    ), [mapPins]);

    return (
        <section className="section">
            <div className="columns is-centered">
                <div className="column is-6 is-centered">
                    <div
                        css={css`
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 1rem;
                        `}
                    >
                        <div
                            className="select"
                        >
                            <select
                                onChange={((e) => {
                                    setCurrentCity(e.target.value);
                                    setValue1(0);
                                    setValue2(0);
                                    setInfoTabOpen(0);
                                })}
                            >
                                <option value="alla">Stad</option>
                                <option value="savsjo">Sävsjö</option>
                                <option value="vrigstad">Vrigstad</option>
                                <option value="stockaryd">Stockaryd</option>
                                <option value="rorvik">Rörvik</option>
                                <option value="hultagard">Hultagård</option>
                                <option value="hylletofta">Hylletofta</option>
                            </select>
                        </div>
                        <div
                            className="select"
                        >
                            <select
                                onChange={((e) => {
                                    setCurrentType(e.target.value);
                                    setValue1(0);
                                    setValue2(0);
                                    setInfoTabOpen(0);
                                })}
                            >
                                <option value="alla">Bransch</option>
                                <option value="tra">Trä</option>
                                <option value="metall">Metall</option>
                                <option value="moblertraforadling">Möbler / Träförädling</option>
                                <option value="livsmedel">Livsmedel</option>
                                <option value="skorklader">Skor & Kläder</option>
                                <option value="plastgummi">Plast / Gummi</option>
                                <option value="ovrigtdiverse">Övrigt / Diverse</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <Range
                            min={lowerMax}
                            max={upperMax}
                            disabled={nmbrCompaniesAfterCityType === 0}
                            defaultValue={[value1, value2]}
                            tipFormatter={(value) => `${value}`}
                            // onChange={((e) => {

                            // })}
                            onAfterChange={((e) => {
                                console.log(e);
                                setValue1(e[0]);
                                setValue2(e[1]);
                                setInfoTabOpen(0);
                            })}
                        />

                    </div>
                    <div
                        css={css`
                            display: flex;
                            justify-content: space-between;
                        `}
                    >
                        <span id="lowerMax">{lowerMax}</span>
                        <span id="upperMax">{upperMax}</span>
                    </div>
                    <div>
                        <h3
                            css={css`
                                text-align: center;
                                margin: 0;
                            `}
                        >
                            {(uniqueCompaniesInPins && uniqueCompaniesInPins.length > 0) && `${uniqueCompaniesInPins.length} företag ${(uniqueCompaniesInPins.length > 1 && (uniqueCompaniesInPins.length !== nmbrCompaniesAfterRange)) ? (`på ${nmbrCompaniesAfterRange} platser hittades!`) : ('hittades!')}`}
                        </h3>
                    </div>
                </div>
            </div>
            <div className="columns is-centered">
                <div className="column is-10 is-centered">
                    <div
                        id="map-container"
                        css={css`
                            width: 100%;
                            position: relative;
                            overflow: hidden;
                        `}
                    >
                        <LoadableComponent
                            center={mapCenter}
                            bounds={mapBounds}
                            pins={mapPins}
                            changeActive={changeActive}
                            // zoom={zoom}
                        />
                        <div
                            id="map-overlay"
                            css={css`
                                position: absolute;
                                bottom: 0%;
                                left: 100%;
                                background-color: rgb(250, 250, 250);
                                width: 100%;
                                height: 100%;
                                -webkit-transition: .5s ease;
                                transition: .5s ease;
                                z-index: 10000;
                                display: flex;
                                align-items: center;
                                ${infoTabOpen === 2 && (`
                                    left: 0%;
                                `)}
                            `}
                        >
                            <div
                                id="map-overlay-tab"
                                onClick={(() => setInfoTabOpen(2))}
                                onKeyDown={(event) => {
                                    if (event.keycode === 13) {
                                        setInfoTabOpen(2);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                css={css`
                                    position: absolute;
                                    bottom: 70%;
                                    left: 1%;
                                    background-color: rgb(250, 250, 250);
                                    width: 25%;
                                    height: 15%;
                                    transition: .5s ease;
                                    z-index: 20000;
                                    ${infoTabOpen !== 0 && (`
                                            left: -25%;

                                    `)}
                                `}
                            >
                                <div
                                    id="map-overlay-tab-content"
                                    css={css`
                                        text-align: center;
                                        height: 100%;
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: center;
                                        align-self: center;
                                        margin-right: 5px;
                                        box-shadow: 0px 0px 3px 1px #000000b5;
                                    `}
                                >
                                    Läs mer om
                                    {' '}
                                    {currentCompany !== -1
                                        ? (
                                            <b>
                                            {currentCompanyData.name}
                                            </b>
                                        ) : 'ett företag?'}
                                </div>
                            </div>
                            <div
                                id="map-overlay-content"
                                css={css`
                                    width: 100%;
                                    height: 100%;
                                    padding: 50px 75px;
                                    display: flex;
                                    flex-wrap: wrap;
                                `}
                            >
                                {currentCompany !== -1
                                && (
                                    <>
                                    <h1
                                        css={css`
                                            flex: 1 1 100%;
                                        `}
                                    >
                                        <Link to={`/industri/${currentCompanyData.fields.slug}`}>
                                            {currentCompanyData.name}
                                        </Link>
                                    </h1>
                                    <p
                                        css={css`
                                            flex: 1 0 50%;
                                            padding-right: 1.5rem;
                                        `}
                                    >
                                        {currentCompanyData.summary}
                                    </p>
                                    <Img
                                        fluid={currentCompanyData.companyimage.childImageSharp.fluid}
                                        alt={currentCompanyData.name}
                                        title={currentCompanyData.name}
                                        css={css`
                                            flex: 0 1 50%;
                                            max-height: 75%;
                                        `}
                                    />
                                    </>
                                )}

                                <div
                                    id="map-overlay-close"
                                    onClick={(() => setInfoTabOpen(1))}
                                    onKeyDown={(event) => {
                                        if (event.keycode === 13) {
                                            setInfoTabOpen(1);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    css={css`
                                        position: absolute;
                                        top: 1rem;
                                        right: 1rem;
                                        font-size: 2rem;
                                        padding: 0px 10px;
                                        cursor: pointer;
                                    `}
                                >
                                    X
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KartSida;
