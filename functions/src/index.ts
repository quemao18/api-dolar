import * as functions from "firebase-functions";
import {Request, Response} from "express";

import express = require("express");
import cors = require("cors");

const app = express();
import bodyParser = require("body-parser");
const request = require("request");

// Parse Query String
app.use(bodyParser.urlencoded({extended: false}));

// Parse posted JSON body
app.use(bodyParser.json());

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// build multiple CRUD interfaces:
app.get('/', (req: any, res: any) => res.send("Api Dólar"));

app.get('/dolarMonitor/fecha/:fecha', function(req: Request, res: Response){ 
    request('https://monitordolarvenezuela.com/gen-graf.php?pFecha='+req.params.fecha, 
    function (error: any, response: any, body: any) {  
        setResponse(error, response, body, res);
    });
});

app.get('/dolarToday', function(req: Request, res: Response){ 
    request('https://s3.amazonaws.com/dolartoday/data.json', 
    function (error: any, response: any, body: any) {  
        setResponse(error, response, body, res);
    });
});

function setResponse(error: any, response: any, body:any, res: Response){
    console.log('error:', error); // Print the error if one occurred and handle it
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    if(error) 
        res.send(error);
    res.send(body);
}

export const apiDolar  = functions.https.onRequest(app);