/*
Puerto 
 */
process.env.PORT = process.env.PORT || 3000;

/*
    Entorno
*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================================================
// Vencimiento del token
/*
 60 segundo
 60 minutos
 24 horas
 30 dias
*/
//=================================================
process.env.CADUCIDAD_TOKEN = '48h';

//=================================================
// SEED de autenticación 
//===============================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';
//========================
// Base de datos
//========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {

    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

/*=============================================
//Google client ID
===============================================*/
process.env.CLIENT_ID = process.env.CLIENT_ID || '223702095940-ondtcunbkudl35hqigei1npp8k1ccaur.apps.googleusercontent.com';