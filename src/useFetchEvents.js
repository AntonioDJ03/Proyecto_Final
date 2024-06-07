import { useState, useEffect } from "react";

export function useFetchEvents(url, query, token) {
  const [data, setData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const getEventos = async () => {
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        var events = data._embedded ? data._embedded.events : [];
        localStorage.setItem("events", JSON.stringify(events));
        setData(events);
      })
      .catch((error) => {
        console.log(error);
        var events = JSON.parse(localStorage.getItem("events")) || [];
        setData(events);
      });
  };

  const getSuggestions = async () => {
    if (query) {
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${token}&keyword=${query}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const events = data._embedded ? data._embedded.events : [];
          setSuggestions(events);
        })
        .catch((error) => {
          console.log(error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    getEventos();
  }, [url]);

  useEffect(() => {
    getSuggestions();
  }, [query, token]);

  return { data, suggestions };
}
