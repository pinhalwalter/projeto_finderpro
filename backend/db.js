import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'finder_pro'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conectado ao MySQL.');
  }
});

export default connection;

/*
create database finder_pro;

CREATE TABLE usuarios (
    id_usu INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone varchar(11) NOT NULL
);

CREATE TABLE historico (
    id_his INT AUTO_INCREMENT PRIMARY KEY,
    id_usu INT NOT NULL,
    link text NOT NULL,
    data_de_salvamento DATETIME,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id_usu)
);
*/
