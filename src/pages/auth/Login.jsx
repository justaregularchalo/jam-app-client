
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../../services/config";
import { AuthContext } from "../../context/auth.context";
import { NavLink } from "react-router-dom";

function Login() {

  const { authenticateUser } = useContext( AuthContext )

  const navigate = useNavigate()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [ errorMessage, setErrorMessage ] = useState("")

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();

    // contactamos al backendddd
    try {
      
      const userValidationCredentials = { username, password }

      const response = await service.post("/auth/", userValidationCredentials)
      console.log(response)

      // almacenamos el token en una variable localStorage

      localStorage.setItem("authToken", response.data.authToken)

      await authenticateUser() // authenticateUser ejecutamos antes de redireccionar al usuario a la home porque es una funcion asíncrona

      navigate("/artists") 

    } catch (error) {
      // console.log(error)
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage)
      } else {
        navigate("/error") // error 500
      }
    }
  };

  return (
    <div className="signup-container">

<div className="left-column"> 
      <h1>Log</h1>


      <form className="signup-form"  onSubmit={handleLogin}>
        <label>username:</label>
        <input
          type="username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
        />

        <br />

        <label>password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />

        <br />

        <button type="submit">Log in</button>
      </form>
      
      <p style={{color: "purple"}}>{errorMessage}</p>

      <NavLink to="/signup"> Don't have an account? Sign Up</NavLink>




</div>
      <div className="right-column"> 

      <img src="./images/login image.png" alt="signup" width={700}/>

      </div>


    </div>
  );
}

export default Login;