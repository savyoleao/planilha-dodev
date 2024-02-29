import {GoogleSpreadsheet} from 'google-spreadsheet'
import arquivo from './arquivo.json'
import credential from './credentials.json'
import { JWT } from 'google-auth-library'

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
];

const jwt = new JWT({
  email: credential.client_email,
  key: credential.private_key,
  scopes: SCOPES,
});

//Carregar os dados do cliente
async function GetDoc(){
   const document = new GoogleSpreadsheet(arquivo, jwt);
   await document.LoadInfo();

   return document;
}

