import { useRef, useState, useContext } from "react";
import "./Auth.css";
import authContext from "../context/auth-context";

const AuthPage = () => {
  const emailEl = useRef();
  const passwordEl = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const loggedUser = useContext(authContext);

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  const sumbitHandler = (event) => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return; //maybe an alert here
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!){
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!){
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password,
        },
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        if (isLogin && resData.data.login.token) {
          const loginData = resData.data.login;
          loggedUser.login(
            loginData.token,
            loginData.userId,
            loginData.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form className="auth-form" onSubmit={sumbitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogin ? "Sign Up" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
