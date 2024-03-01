const { GoogleSpreadsheet } = require('google-spreadsheet')
const arquivo = require('./arquivo.json')
const credential = require('./credentials.json')
const { JWT } = require('google-auth-library')

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
   const document = new GoogleSpreadsheet(arquivo.id, jwt);
   await document.loadInfo();

   return document;
}

//lê os dados e cria uma lista de informações do usuário
async function ReadWorkSheet(){
   let sheet = (await GetDoc()).sheetsByIndex[0]; //lê a planilha
   let rows = await sheet.getRows(); //lê e pega as informações da linha da planilha
   let users = rows.map((row) => {
      return row.toObject()
   }); //transforma os dados em objeto
   
   return users;
}

//subir as informações para a API
async function AddUser(data = {}){
   const response = await fetch('https://apigenerator.dronahq.com/api/aC6ZlLHD/planilha', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
   });
   
   return response.json();
}


async function TrackData(){
   let data = await ReadWorkSheet();

   data.map(async (user) => {
      let response = await AddUser(user) //adiciona na api
      console.log(response)
   });

   return console.log('SUCESSO')
}

TrackData()