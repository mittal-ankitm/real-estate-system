import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import NavBar from "./components/navbar"

import {BrowserRouter,Route,Switch,useHistory,useLocation} from 'react-router-dom'
import Home from './components/screens/home'
import Profile from './components/screens/profile'
import Property from './components/screens/property'
import Propinfo from './components/screens/propinfo'
import Signup from './components/screens/signup'
import Verify from './components/screens/verify'
import Transfer from './components/screens/transfer'
import Searchbar from './components/screens/searchbar'
import Signin from './components/screens/signin'
import UserProfile from './components/screens/userprofile'
import Confirmagent from './components/screens/confirmagent'
import Confirmbuyer from './components/screens/confirmbuyer'
import Confirmseller from './components/screens/confirmseller'
import AgentBuyer from './components/screens/agentbuyer'
import AgentSeller from './components/screens/agentseller'
import AgentReqList from './components/screens/agentlist'
import AgentSignin from './components/screens/agentlogin'
import TxnConfirm from './components/screens/txnconfirm'
import {initialstate,reducer} from './reducers/userreducer'
import UserReqList from './components/screens/userreqlist';
export const usercontext=createContext()

const Routing=()=>{
  const history=useHistory() 
  let location=useLocation()
  const {state,dispatch}=useContext(usercontext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    
    if(user){
      dispatch({type:"USER",payload:user})
     
    }
    else{
      if(location.pathname!='/agentsignin')
      history.push('/signin')
    }
  },[])
  return (
<Switch>

    <Route path='/signup'>
      <Signup />
    </Route>
    <Route path='/signin'>
      <Signin />
    </Route> 
    <Route path='/agentsignin'>
      <AgentSignin />
    </Route>
    <Route exact path='/profile'>
      <Profile />
    </Route>
    <Route path='/profile/:userid'>
      <UserProfile />
    </Route>
    <Route exact path='/property/:pid'>
      <Property />
    </Route>
    <Route path='/propinfo/:pid'>
      <Propinfo />
    </Route>
    <Route path='/verify/:roomid'>
      <Verify />
    </Route>
    <Route path='/transfer/:pid'>
      <Transfer />
    </Route>
    <Route path='/search'>
      <Searchbar />
    </Route>
    <Route path='/confirmagent/:roomid'>
      <Confirmagent />
    </Route>
    <Route path='/confirmbuyer/:roomid'>
      <Confirmbuyer />
    </Route>
    <Route path='/confirmseller/:roomid'>
      <Confirmseller />
    </Route>
    <Route path='/agentbuyerverify/:roomid'>
      <AgentBuyer />
    </Route>
    <Route path='/agentsellerverify/:roomid'>
      <AgentSeller />
    </Route>
    <Route path='/agentreqlist'>
      <AgentReqList />
    </Route>
    <Route path='/userreqlist'>
      <UserReqList />
    </Route>
    <Route path='/txn/:roomid'>
      <TxnConfirm />
    </Route>
    </Switch>
  )
}

function App() {

  const [state,dispatch]=useReducer(reducer,initialstate)

  return (
    <usercontext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <NavBar/>
    <Routing />
    </BrowserRouter>
    </usercontext.Provider>

  );
}

export default App;
