import React, { Component } from 'react';
// import '~style/style.scss';
import Navbar from '../navbar/navbar';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
        };
        this.headerRef = React.createRef();
        this.getElem = this.getElem.bind(this);
    }

    componentDidMount() {
        this.setState({
            isMounted: true,
        });
    }

    getElem() {
        return this.headerRef;
    }

    render() {
        const { isMounted } = this.state;
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
                    {isMounted && (
                        <Navbar
                            getParentElem={this.getElem}
                        />
                    )}
                </section>
        );
    }
}

export default Header;
