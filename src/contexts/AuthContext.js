import { createContext, useEffect, useReducer } from "react";
import { Navigate } from "react-router";
import axios from '../utils/axios'
import {TOKEN_KEY, LOGIN_HOST, LOGIN_PATH} from '../utils/Constants'
let initState = {
    isAuth:false,
    user:null,
    login:()=>{},
    logout: ()=>{}
}
let AuthContext = createContext(initState)

const reducer = (oldState,action)=>{
    switch(action.type)
    {
        case 'LOGIN':
            return {
                ...oldState,
                isAuth:true
            }
        case 'LOGOUT':
            return {
                ...oldState,
                isAuth:false
            }
    }
}


export const AuthProvider = ({children})=>{
    const [state, dispatch] = useReducer(reducer,initState)

        const logout = ()=>{
            localStorage.removeItem(TOKEN_KEY);
            dispatch({
                type:'LOGOUT'
            })
        }
         const login = (email, password)=>{
        axios.post(`${LOGIN_HOST}${LOGIN_PATH}`,
        {
            email:email,
            password:password
        }
        )
        .then((response)=>{
            let token = response.data.token.access_token;
            let data = response.data;
            localStorage.setItem(TOKEN_KEY, JSON.stringify(data))
            dispatch({
                type:'LOGIN'
            })
            Navigate('/dashboard');
        })
        .catch((err)=>{
            console.log(err)
            
        })
    }
        useEffect(()=>{
            let data = JSON.parse(localStorage.getItem(TOKEN_KEY))
            if(data)
            {
                dispatch({
                    type:'LOGIN'
                })
            }
        },[])
        return <AuthContext.Provider
        value={{
            ...state,
            login,
            logout
        }}
        >

            {children}
        </AuthContext.Provider>
}
export default AuthContext;