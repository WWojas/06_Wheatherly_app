import React from 'react';
import logo from '../img/Logo_app.png'
import loading_big from "../img/loading_big.svg";

import styles from '../sass/header.modules.scss';

class Header extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
           text: true
       }
   }



    render() {

        return (
           <div>
               <header className="flex align-items-center justify-content-center pt-5 mb-5 bg-transparent" id='header'>
                   <img src={logo} className="logo" alt='logo_pic'/>
               </header>

               { !this.props.didAppLoad && (
                   <div className="col-12 justify-content-center flex ">
                       <img src={loading_big} className='loading_box_big'/>
                       <h4 className="m-4 loading_box_text"> Loading </h4>
                   </div>
               )

               }

           </div>

        )

    }
}

export default Header

