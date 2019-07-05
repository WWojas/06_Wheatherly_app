import React from 'react';
import countriesJSON from './json/euro-countries.json';

import wind from '../img/weather_icons/wind.svg';
import humidity from "../img/weather_icons/humidity.svg";
import pressure from '../img/weather_icons/pressure.svg';

import globe_country_icon from "../img/country_select_icon.svg";
import city_select_icon from "../img/city_select_icon.svg";

import styles from '../sass/body.modules.scss'


const APIKEY = '092ecba8a89f16a98481f4b6f05a8c21';

class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            country: '',
            city: '',

            fetchedCityList: [],
            citySuggestionList: [],
            cityInputValue: '',

            result: {
                temperature: '',
                humidity: '',
                pressure: '',
                wind: '',
                clouds: '',
                description: '',
                icon: ''
            },
            WeatherInfoVisible: false,
            suggestionsHidden: true,
            dataReady: false
        }
    }


    componentDidMount() {

        this.fetchCityList();
    }


    fetchCityList = () => {
        //
        // fetch('https://codewave.com.pl/weatherly_app/json/current.city.list.min.json')
        //

        fetch('https://codewave.com.pl/weatherly_app/json/current.city.list.min.json')
            .then( res => res.json())
            .then( response =>
                this.setState ({ fetchedCityList: response}))

    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.dataReady === false) {
            this.setState ({ dataReady: true
        });
            this.props.handleDataFetch(true)
        }}




    handleCountrySelect = (e, callback) => {

        this.setState({
            country: e.target.value,
            city: '',
            cityInputValue: '',
            fetchedCityList: [],
            citySuggestionList: [],
            WeatherInfoVisible: false,
            showGetWeatherBtn: false
        });

        callback(e.target.value)
    };


    filterCities = (country) => {

        const filteredCities = this.state.fetchedCityList.filter( element => element.country === country);

        this.setState ({ fetchedCityList: filteredCities})

    };


    generateCitySuggestions = (e) => {

        let userInputValue = e.target.value;
        let filteredSuggestionsArray = [];

        if (userInputValue.length > 0) {

            const regEx = new RegExp(`^${userInputValue}`, 'i');
            filteredSuggestionsArray = this.state.fetchedCityList.sort().filter(element => regEx.test(element.name))

            this.setState ({ suggestionsHidden: false})
        }
        this.setState ({
            citySuggestionList: filteredSuggestionsArray,
            cityInputValue: userInputValue,
        })
    };


    handleCitySelect = (e) => {
        this.setState ({ city: e.target.innerText, WeatherInfoVisible: false });

    };


    handleCityInputValue =(value) => {
        this.setState(() => ({cityInputValue: value}))
    };


    getWeather = async (e) => {
        e.preventDefault();

        await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.city},${this.state.country}&appid=${APIKEY}`)
            .then( res => res.json())
            .then( res =>

                this.setState ({
                    result: {
                        temperature: Math.round(res.main.temp - 273.15),
                        humidity: res.main.humidity,
                        pressure: Math.round(res.main.pressure),
                        wind: Math.round(res.wind.speed * 1.60934),
                        clouds: res.clouds.all,
                        description: res.weather[0]['main'],
                        icon: res.weather[0]['icon']
                    },
                    WeatherInfoVisible: true,
                    suggestionsHidden: true,
                    citySuggestionList: [],

                }))
            .then( res =>  this.handleBgIcon(this.state.result.description, this.state.result.temperature));

    };

    handleBgIcon = (description, temperature) => {

        if(temperature >= 25) {
            this.props.getBackground('linear-gradient(to bottom, #f2004a, #f8353c, #fb522d, #fb6a1b, #f88100)')
        } else if (description === 'Clear') {
            this.props.getBackground('linear-gradient(to bottom, #11b1d3, #53b8d8, #76bfdc, #92c6df, #aacde1)')
        } else if (description === 'Clouds') {
            this.props.getBackground('linear-gradient(to bottom, #22aff6, #5fb8ec, #85c1e2, #a6c8da, #c6cfd3)')
        } else if (description === 'Scattered clouds') {
            this.props.getBackground('linear-gradient(to bottom, #54c8cd, #70cddd, #8dd1e7, #a8d5ed, #c0d9f0, #c4daf1, #c9dcf3, #cdddf4, #c1dbf6, #b3d8f8, #a4d7f9, #92d5f9)')
        } else if (description === 'Broken clouds') {
            this.props.getBackground('linear-gradient(to bottom, #b9b9b9, #bec0c8, #bcc9d8, #b6d4e5, #addfed)')
        } else if (description === 'Shower rain') {
            this.props.getBackground('linear-gradient(to bottom, #adcfe5, #93b9d1, #7aa3be, #618eab, #477999)')
        } else if (description === 'Rain') {
            this.props.getBackground('linear-gradient(to bottom, #6292b1, #5b8cab, #5585a5, #4e7f9f, #477999)')
        } else if (description === 'Thunderstorm') {
            this.props.getBackground('linear-gradient(to bottom, #69228e, #784098, #875aa1, #9574a9, #a38db1)')
        } else if (description === 'Mist') {
            this.props.getBackground('linear-gradient(to bottom, #d5ccda, #c5bcc9, #b4acb9, #a59da9, #958e99)')
        } else if (description === 'Snow') {
            this.props.getBackground('linear-gradient(to bottom, #0074f2, #7b92f5, #b1b4f8, #dbd8fb, #ffffff)')
        }
    };




    render() {

        const imgIcon = `http://openweathermap.org/img/w/${this.state.result.icon}.png`;

        return (
            <main style={ this.state.dataReady ? {display: 'block'} : {display: 'none'}}>

                <section className='row text-center'>
                    <form className="col-12 col-md-6">

                        <div className="row">
                            <div className=" col-12 col-sm-6 col-md-10 text-center mb-4 ">

                                <img src={globe_country_icon} className={styles.select_icon} alt='icon'/>

                                <label> Select Country </label>
                                <select className='custom-select' onChange={ (e) => this.handleCountrySelect(e, this.filterCities)} required placeholder='Country...'>

                                    <option value='' data-desc='' placeholder='Country ...'>  </option>
                                    { countriesJSON.map(({name, code}) => {
                                        return (
                                            <option value={code} data-desc={name} key={code} > {name} </option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className=" col-12 col-sm-6 col-md-10 text-center" >

                                <img src={city_select_icon} className="select_icon" alt='city-select-icon' />
                                <label> Select City </label>

                                <input value={this.state.cityInputValue} className='custom-select' onChange={ this.generateCitySuggestions} placeholder='City...' required
                                       style = { this.state.fetchedCityList.length < 1 ? { background: 'dimgrey' } : {background: 'whitesmoke'}}/>

                                <ul className="cityList" style={ this.state.suggestionsHidden ? {display: 'none'} : {display: 'block'}} >


                                    {  this.state.citySuggestionList.map(({name, id, key}) => {

                                        return <li onClick={ (e) => this.handleCitySelect(e, this.handleCityInputValue)} value={name} key={id} > {name} </li>

                                    })}

                                </ul>
                            </div>
                        </div>


                        <div className="row">
                            <div className=" col-12 col-md-10 text-center mb-5 ">
                                <button type='submit' onClick = {this.getWeather} className=" col-10 mt-5 mb-5 text-center btn "
                                        style = { !this.state.city ? { background: 'dimgrey' } : {background: 'lightseagreen'}}
                                > Check Weather</button>
                            </div>
                        </div>
                    </form>


                    {this.state.WeatherInfoVisible && (
                        <div className=" col-12 col-md-6 Weather ">
                            <h3> { this.state.city}</h3>

                            <div className={styles.Weather__details}>

                                <div className="Weather__img flex justify-content-center">
                                    { this.state.result.temperature >= 25 && <span> HOT </span>}
                                    <h2> {this.state.result.temperature} </h2> <span>  &#8451;</span>
                                </div>

                                <div className="Weather__desc flex justify-content-center">
                                    <img src={imgIcon} alt='icon'/>
                                    <p className="m-0"> {this.state.result.description} </p>
                                </div>


                                <div className="Weather__numbers">
                                    <div className="row flex align-items-center text-center">
                                        <span className="col-12 col-sm-4 mb-2 mt-2"> <img src={humidity} alt='humidity'/> Humidity {this.state.result.humidity} % </span>
                                        <span className="col-12 col-sm-4 mb-2 mt-2"> <img src={pressure} alt='pressure'/> Pressure {this.state.result.pressure}  HPA </span>
                                        <span className="col-12 col-sm-4 mb-2 mt-2"> <img src={wind} alt='wind'/>  Wind {this.state.result.wind}km/h </span>
                                    </div>

                                </div>
                            </div>
                        </div>

                    )}
                </section>
            </main>

        )

    }
}

export default Body

