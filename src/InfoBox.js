import React from 'react';
import {Card, CardContent, Typography}  from "@material-ui/core";
import './InfoBox.css';


const  InfoBox = ({title, cases, total, isRed, isGrey, active, ...props}) =>{
  return(
  <Card  onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      } ${isGrey && "infoBox--grey"}`}>

  <CardContent>

   <Typography className="infoBox_title" color="textSecondary">
    {title}
   </Typography>
   {/* Number of Cases */}
         <h2
           className={`infoBox__cases ${!isRed && "infoBox__cases--green"} ${
             isGrey && "infoBox__cases--grey"
           }`}
         >
           {props.isloading ? <i className="fa fa-cog fa-spin fa-fw" /> : cases}
         </h2>

  <Typography className="infoBox_total" color="textSecondary">
 {total} Total
  </Typography>

  </CardContent>
  </Card>
  );
}
export default InfoBox;
