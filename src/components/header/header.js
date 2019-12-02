import React, { Component } from 'react';
// import '~style/style.scss';
import Navbar from '../navbar/navbar';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headerHeight: 0,
            isMounted: false,
        };
        this.headerRef = this.headerRef.bind(this);
        this.elemRef = this.getElem.bind(this);
    }

    componentDidMount() {
        console.log('in Header Created');
        this.setState(() => ({
            isMounted: true,
        }));
    }

    getElem() {
        console.log('in header getElem');
        // console.log(headerRef);
        // console.log(headerRef.current);
        console.log(this.state.headerHeight);
        return this.state.headerHeight;
    }

    checkTheHeader() {
        console.log('in Header checkTheHeader');
        // setHeaderObj(element);
        // console.log(headerObj);
        if (this.headerRef !== null) {
            console.log(`node isn't null...`);
            console.log(this.headerRef.clientHeight);
            this.setState(() => ({
                headerHeight: this.headerRef.clientHeight,
            }));
            console.log(`height: ${this.state.headerHeight}`);
        }
    }

    // useEffect(() => {
    // setHeaderHeight(headerRef.current.clientHeight);
    // dispatch({ })
    // console.log(headerHeight);
    // console.log(headerRef);
    // console.log(headerRef.current);
    //     return () => {
    //         console.log('in Header Cleanup');
    //     };
    // });

    render() {
        return (
                <section id="headerContainer" ref={this.headerRef} className="hero gradientBg">
                    <div className="hero-body">
                        <div className="container center">
                            <article className="media">
                                <div className="media-content">
                                    <div className="content">
                                        <h3 className="is-size-2 has-text-white">
                                            Sävsjö kommuns

                                        </h3>
                                        <h1 className="subtitle has-text-white is-size-1">
                                            Industrihistoria
                                        </h1>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                    {this.state.isMounted && (
                    <Navbar
                        getParentElem={this.elemRef}
                    />
                    )}
                </section>
        );
    }
}

export default Header;
