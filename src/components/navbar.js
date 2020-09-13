import React,{useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {usercontext} from '../App'
//import icon from '../img/icon.png'
import logo from '../img/logo.png'
import './stylesheet/style.css'
import Searchbar from './screens/searchbar'
const NavBar=()=> {

    const{state,dispatch}=useContext(usercontext) 
    const history=useHistory()
    const renderlist=()=>{
        const agentcheck=JSON.parse(localStorage.getItem("agent"))
        console.log(agentcheck)
        if(agentcheck==true){
            return [
                <li key='0'><img src={logo} height='50px' width='50px' /></li>,
                <li key="1"><Link to="/agentreqlist">requests</Link></li>,
                <li key="4">
                    <button onClick={()=>{
                        localStorage.clear();
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                    }}>
                        logout
                    </button>
                </li>
            ]
        }
        if(state){
            return [
                <li key='0'><img src={logo} height='50px' width='50px' /></li>,
                <li key="1"><Link to="/profile">profile</Link></li>,
                <li key="5"><Link to="/search">search</Link></li>,
                <li key="9"><Link to="/userreqlist">requests</Link></li>,
                <li key="4">
                    <button onClick={()=>{
                        localStorage.clear();
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                    }}>
                        logout
                    </button>
                </li>,
                  
               
            ]
        }else{
            return [
                <li key='6'><img src={logo} height='90px' width='90px' /></li>,
                <li key="7"><Link to="/signin">sign in</Link></li>,
                  <li key="8"><Link to="/signup">sign up</Link></li>
            ]
        }
    }
    return (
      <nav>
          <div className='nav'>
              
              <ul>
                  {renderlist()}
              </ul>
          </div>
      </nav>
    );
  }
  
  export default NavBar;