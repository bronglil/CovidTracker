import React from 'react';
import numeral from "numeral";
import "./Table.css";

const Table = ({ countries }) =>{
  return(
   <div className="table">
    {countries.map((country, cases) =>(
       <tr>
       <td>{country.country}</td>

       <td><strong>{numeral(country.cases).format("000,000")}</strong></td>
       </tr>
    ))
  };

   </div>
  );
}
export default Table;
