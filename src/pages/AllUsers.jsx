
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../services/config";
import { AuthContext } from "../context/auth.context";
import { NavLink } from "react-router-dom";


import {jwtDecode} from "jwt-decode"



function AllUsers() {

  const { authenticateUser } = useContext( AuthContext )

  const navigate = useNavigate()

  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const [genres, setGenres] = useState(null)
  const [instruments, setInstruments] = useState(null)
  const [locations, setLocations] = useState(null)

  const [ownId, setOwnId] = useState(null)




  useEffect(()=>{

    getUsers()
    // 


  },[])

  
  const getUsers = async () => {
    
    try {
      
      const response = await service.get("/all-users")
      const payload = jwtDecode(localStorage.getItem("authToken"))
      // console.log(payload) //decodificar el token para encontrar el id del perfil del usuairo en activo y hacer el search

      const tokenId = payload._id
      const index =response.data.map((user)=>{

        return user._id


      }).indexOf(tokenId) //con esto sabemos en que posición esta nuestro usuario en el array

      if(index > -1){

        
        setOwnId(response.data[index]._id)
      } // esto corrobora que si hay dato, nos va a devolver la location de nuestro user maligno

      console.log(response.data[index]._id)
      // console.log(response)
      const users = response.data.filter((eachUser)=>{

        if( eachUser._id !== tokenId){ //filtro de solo users de la misma ciudad pero que no sea el usuario online

          return eachUser

        }


      })
      setUsers(users)
      setIsLoading(false)
      console.log(response)



      let genres = response.data.map((eachGenre)=>{

          return eachGenre.genre
          


      })

      const genresWithOutDuplicate =[...new Set(genres)]; //! elimina duplucados del array
      setGenres(genresWithOutDuplicate)
      console.log(genresWithOutDuplicate)



      let instruments = response.data.map((eachInstrument)=>{

        if(eachInstrument._id !== tokenId)
        return eachInstrument.instrument        


    })

    const instrumentsWithOutDuplicate =[...new Set(instruments)]; //! elimina duplucados del array
    setInstruments(instrumentsWithOutDuplicate)
    console.log(instrumentsWithOutDuplicate)


    let locations = response.data.map((eachLocation)=>{

      return eachLocation.location        


  })

  const locationsWithOutDuplicate =[...new Set(locations)]; //! elimina duplucados del array
  setLocations(locationsWithOutDuplicate)
  console.log(locationsWithOutDuplicate)





      
      
    }catch(error){
      
      // console.log(error)
      
    }
    
  }
  
  if(isLoading){

    return (

      <h3>...loading</h3>

    )

  }

  return (

    <div className="all-users-container">


    <h3>All Artists </h3>

    <div className="grid-container">

    {users.map((eachUser)=>{

      

      return (

      <div className="grid-element" key={eachUser.username}>

        <img src={eachUser.picProfile} alt={eachUser.username}/>
        <p><strong>{eachUser.username}</strong> </p>
        <p>{eachUser.instrument}</p>
        <p>{eachUser.location}</p>

        <button className="boton">
            <NavLink to={`/profile/${eachUser._id}`}>View Profile</NavLink>
          </button>

      </div>

      
      )




    })}


    </div>

    

    </div>
  )


}

export default AllUsers