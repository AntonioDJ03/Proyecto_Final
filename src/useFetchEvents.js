import { useState, useEffect } from "react"
 

export function useFetchEvents(url) {
  const [data, setData] = useState(null)
  //Fetch para buscar eventos proximos en Mexico
  const getEventos = async() => {
    await fetch(url)
      .then((response) => response.json())
      .then(function (data){
        var events = data._embedded.events
        localStorage.setItem("events", JSON.stringify(events))
        setData(events)
        //console.log(events)
      })
      .catch((error) => {
        console.log(error)
        var events = JSON.parse(localStorage.getItem("events"))
        setData(events)
      })
  }

  useEffect( () => {
    getEventos()
    //getEventos()
 }, [url])

  return {data}
  }
