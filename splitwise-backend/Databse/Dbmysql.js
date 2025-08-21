const dotenv = require("dotenv");
dotenv.config();
const mysql = require("mysql2/promise");


const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    port:process.env.DB_PORT,
    database:process.env.DB_NAME,
    password:process.env.DB_PASS ,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const ConnectDB = async () => {
    try{
    const connection = await pool.getConnection();
    console.log("MYSQL connected :" , process.env.DB_HOST , "/", process.env.DB_NAME);
    await  connection.release(); // release back to pool
    }catch(error){
    console.error(' DB connection error:', error);
    process.exit(1);
    }

};
module.exports ={pool, ConnectDB};
