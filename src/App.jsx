import { useState } from 'react'
import './App.css'
import { useFetchEvents } from './useFetchEvents'
import logo from './assets/ticketmaster_logo.png'
import buscar from './assets/search.png'

function App() {
  
  const token = 'B98Q3wW2Qd66jLQ3nLFUCSBl1gDMgAqQ'
  const url1 = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=MX&apikey=${token}`

  const [url, setUrl] = useState(url1)

  function obtenerValor() {
    var input = document.getElementById('busqueda');

    // Verificar si el input es null o undefined
    if (input) {
        // Obtener el valor del input
        
        var valor = input.value;
        //getBusqueda(valor)
        var url2 = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${token}&keyword=${valor}`
        setUrl(url2)
        
        // Imprimir el valor en la consola
        console.log("El valor del input es:", valor);
    } else {
        alert('Inserta un Artista')
    }
    
  }

  //Obtener eventos proximos en Mexico
  const { data } = useFetchEvents(url)

  function formatearFechas(cadena) {
    var arrayCadenas = cadena.split('-')
    
    var dia = arrayCadenas[2]
    var mes = arrayCadenas[1]
    var ano = arrayCadenas[0] 
    
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ]
    return  dia + ' de ' + meses[mes-1] + ' de ' + ano
  }


  return (
    <>
      <div className='header'> 
        <img src={logo} alt="" /> 
        <div className='buscadorContent'>
          <img className='iconoBuscar' src={buscar} alt="" />
          <input type="text" id='busqueda' name='busqueda' placeholder='Buscar por artista o evento' />
          <button type='button' className='btnBuscar' onClick={obtenerValor}>Buscar</button>
        </div> 
      </div>

      <div className='contentMain'>
        <>
          {data?.map((evento) => (
            <>
              {evento.url &&
                <div className='card' key={evento.id}>
                  <div className='imgCard'>
                    <img src={evento.images[9].url} alt="" />
                  </div>
                  <div className='title'>
                    <h3>{evento.name}</h3>
                    <p>{ formatearFechas(evento.dates.start.localDate) }</p>
                  </div>
                  <hr />
                  <div className='lugar'>
                    <h3> <b>{evento._embedded != undefined ? evento._embedded.venues[0].city.name: 'No Disponible aun' }</b> </h3>
                    <p>{evento._embedded != undefined ? evento._embedded.venues[0].name : 'No Disponible aun'}</p>
                  </div>
                  
                  <a  className='btnBoletos' href={evento.url}>Comprar <br/> Boletos</a>

                </div>
              }   
            </>
          ))}
        </>
      </div>
    </>
  )
}

export default App
