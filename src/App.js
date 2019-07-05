import React from 'react';
import './App.scss';
import Header from "./components/Header.js";
import Body from "./components/Body.js";
import Footer from "./components/Footer.js";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundGradient: 'linear-gradient(to top, #ffffff, #e4e7fd, #bed2fd, #87c0fb, #12b0f6)',
            isAppLoaded: false
        }
    }

    changeBackground = (src) => {
        this.setState ({
            backgroundGradient: src
        })
  };

    onHandleData = (data) => {
        this.setState ({ isAppLoaded: data})

    };


    render() {
        return (
            <div className='loading_wrapper' style={{ backgroundImage:`${this.state.backgroundGradient}`,
                            height: `${this.state.isAppLoaded ? '120vh' : '35vh'}`
                } }>
            <div className="container">
                <Header didAppLoad = {this.state.isAppLoaded} />
                <Body
                    getBackground = { (src) => this.changeBackground(src)}
                    handleDataFetch = { (data) => this.onHandleData(data)}
                />

                <Footer/>
            </div>
            </div>
        );
    }
}

export default App;
