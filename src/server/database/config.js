const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'mysqlcluster4.registeredsite.com',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'concert_wallet',
});

module.exports = connection;


// const pw = process.env.password || require('./pw');
// const neo4j = require('neo4j-driver').v1;
//
// const driver = neo4j.driver('bolt://hobby-dfhkcmbeoeaggbkelacallol.dbs.graphenedb.com:24786', neo4j.auth.basic('testdriventaiwanese', pw));
//
// module.exports = driver;
