import React, {useState, useEffect} from 'react';
import './App.css';
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import {sortData, prettyPrintStat} from "./util";

import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries]=useState([]);
  const [casesType, setCasesType]=useState("cases");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(response => response.json()).then(data => {
      setCountryInfo(data);

    });
  }, []);



  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries = data.map((country) => ({name: country.country, value: country.countryInfo.iso2}));

        let sortedData = sortData(data);

        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);

      });
    };
    getCountriesData();
  }, []);



  const onCountryChanges = async (event) => {
    setLoading(true);
    const countrycode = event.target.value;
    setCountry(countrycode);

    const url = countrycode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countrycode}`

    await fetch(url).then((response) => response.json()).then((data) => {
      setCountry(countrycode);
      setCountryInfo(data);
        setLoading(false);

      countrycode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
           setMapZoom(4);
    });
  };

  console.log( countryInfo);

  return (

    <div className="App">

    {/* left side */}

    <div className="app__left">
      <div className="app_header">
        <h1>Hello Covid app</h1>
        <FormControl className="app_dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChanges}>
            <MenuItem value="worldwide">
              worlwide</MenuItem>

            {
              countries.map((country) => (<MenuItem value={country.value}>
                {country.name}
              </MenuItem>))
            }

          </Select>
        </FormControl>
      </div>

      <div className="app_stats">
        <InfoBox
                    isRed
                    active={casesType === "cases"}
                    className="infoBox__cases"
                    onClick={(e) => setCasesType("cases")}
                    title="Coronavirus Cases"
                    total={prettyPrintStat(countryInfo.cases)}
                    cases={prettyPrintStat(countryInfo.todayCases)}
                    isloading={isLoading}
                  />
                  <InfoBox
                    active={casesType === "recovered"}
                    className="infoBox__recovered"
                    onClick={(e) => setCasesType("recovered")}
                    title="Recovered"
                    total={prettyPrintStat(countryInfo.recovered)}
                    cases={prettyPrintStat(countryInfo.todayRecovered)}
                    isloading={isLoading}
                  />
                  <InfoBox
                    isGrey
                    active={casesType === "deaths"}
                    className="infoBox__deaths"
                    onClick={(e) => setCasesType("deaths")}
                    title="Deaths"
                    total={prettyPrintStat(countryInfo.deaths)}
                    cases={prettyPrintStat(countryInfo.todayDeaths)}
                    isloading={isLoading}
                  />
      </div>

  {/* left side Map */}

      <Map
        casesType= {casesType}
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
      />

    </div>

    {/* Right side */}

    <Card className="app_right">
      <CardContent>
        {/* tables */}
      <h3>Live Cases By Country </h3>
        <Table countries={tableData}/>

         {/* Graph */}

         <h3 className="app__graphTitle">WorldWide new {casesType}</h3>
           <LineGraph className="app__graph" casesType={casesType} />

      </CardContent>
    </Card>

  </div>);
}

export default App;
