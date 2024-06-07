import { useState, useEffect } from 'react';
import swal from 'sweetalert';
import './App.css';
import { useFetchEvents } from './useFetchEvents';
import logo from './assets/ticketmaster_logo.png';
import buscar from './assets/search.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function App() {
  const token = 'B98Q3wW2Qd66jLQ3nLFUCSBl1gDMgAqQ';
  const url1 = `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=MX&apikey=${token}`;

  const [url, setUrl] = useState(url1);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Obtener eventos y sugerencias próximos en México
  const { data, suggestions: fetchedSuggestions } = useFetchEvents(url, query, token);

  useEffect(() => {
    if (!selectedEvent) {
      setSuggestions(fetchedSuggestions);
    }
  }, [fetchedSuggestions, selectedEvent]);

  function obtenerValor() {
    if (query.trim() === '') {
      swal("Introduce un valor", "Por favor, introduce un valor en el campo de búsqueda.", "warning");
    } else {
      var url2 = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${token}&keyword=${query}`;
      setUrl(url2);
      setSearched(true);
      setQuery(''); // Vaciar el campo de entrada después de la búsqueda
      setSuggestions([]); // Limpiar sugerencias
    }
  }

  // Función para restablecer la URL a la página principal
  function volverAPrincipal() {
    setUrl(url1);
    setSearched(false);
    setOriginalData(null);
    setSelectedEvent(null);
    setQuery('');
    setSuggestions([]);
  }

  useEffect(() => {
    if (searched) {
      if (data && data.length === 0) {
        swal("No existen eventos", "No se encontraron eventos que coincidan con la búsqueda.", "info");
        setSearched(false);
      } else if (data && data.length > 0) {
        setOriginalData(data);
      }
    }
  }, [data, searched]);

  function formatearFechas(cadena) {
    var arrayCadenas = cadena.split('-');

    var dia = arrayCadenas[2];
    var mes = arrayCadenas[1];
    var ano = arrayCadenas[0];

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return dia + ' de ' + meses[mes-1] + ' de ' + ano;
  }

  function handleSuggestionClick(suggestion) {
    setQuery(suggestion.name);
    setSelectedEvent(suggestion);
    setSuggestions([]); // Limpiar sugerencias al seleccionar
    setSearched(true);
  }

  return (
    <>
      <div className='header'>
        <img src={logo} alt="" />
        <div className='buscadorContent'>
          <img className='iconoBuscar' src={buscar} alt="" />
          <input 
            type="text" 
            id='busqueda' 
            name='busqueda' 
            placeholder='Buscar por artista o evento'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedEvent(null); // Limpiar el evento seleccionado cuando se escribe en el input
            }} // Actualizar el valor de la consulta
          />
          <button type='button' className='btnBuscar' onClick={obtenerValor}>Buscar</button>
          {suggestions.length > 0 && (
            <div className='suggestions'>
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className='suggestion'
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {`${suggestion.name} - ${formatearFechas(suggestion.dates.start.localDate)}`}
                </div>
              ))}
            </div>
          )}
        </div>
        <i className="fas fa-home iconoCasa" onClick={volverAPrincipal}></i>
      </div>

      <div className='contentMain'>
        <>
          {selectedEvent ? (
            <div className='card'>
              <div className='statusIcon'>
                <FontAwesomeIcon icon={selectedEvent.dates.status.code === "onsale" ? faCheckCircle : faTimesCircle} />
              </div>
              <div className='imgCard'>
                <img src={selectedEvent.images[9].url} alt="" />
              </div>
              <div className='title'>
                <h3>{selectedEvent.name}</h3>
                <p>{formatearFechas(selectedEvent.dates.start.localDate)}</p>
              </div>
              <hr />
              <div className='lugar'>
                <h3><b>{selectedEvent._embedded ? selectedEvent._embedded.venues[0].city.name : 'No Disponible aun'}</b></h3>
                <p>{selectedEvent._embedded ? selectedEvent._embedded.venues[0].name : 'No Disponible aun'}</p>
              </div>
              <a className='btnBoletos' href={selectedEvent.url}>Comprar <br /> Boletos</a>
            </div>
          ) : (
            (originalData || data)?.map((evento) => (
              <>
                {evento.url &&
                  <div className='card' key={evento.id}>
                    <div className='statusIcon'>
                      <FontAwesomeIcon icon={evento.dates.status.code === "onsale" ? faCheckCircle : faTimesCircle} />
                    </div>
                    <div className='imgCard'>
                      <img src={evento.images[9].url} alt="" />
                    </div>
                    <div className='title'>
                      <h3>{evento.name}</h3>
                      <p>{formatearFechas(evento.dates.start.localDate)}</p>
                    </div>
                    <hr />
                    <div className='lugar'>
                      <h3><b>{evento._embedded ? evento._embedded.venues[0].city.name : 'No Disponible aun'}</b></h3>
                      <p>{evento._embedded ? evento._embedded.venues[0].name : 'No Disponible aun'}</p>
                    </div>
                    <a className='btnBoletos' href={evento.url}>Comprar <br /> Boletos</a>
                  </div>
                }
              </>
            ))
          )}
        </>
      </div>
    </>
  );
}

export default App;
