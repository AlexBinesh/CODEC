const express = require("express");
const app = express()
app.use(express.json())
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
//  host: '127.0.0.1',
  host: 'mpcdb.c1xekgwhzukm.us-east-1.rds.amazonaws.com',
  database: 'postgres',
//  password: 'password',
  password: '6q2iOGzHoTQ1xAbsERfI',
  port: 5432,
})
TimeOut = 2000;
app.get('/BranchBal',async(req,res)=>{
  
    console.log("This is the AcctName: "+ req.query.AcctName);
    console.log("This is the DataTable: "+ req.query.DataTable);
    let sql = "SELECT * FROM "+req.query.DataTable+"  where AcctName=" + "'" + req.query.AcctName + "'";
//    console.log("This is the sql: "+ sql);
        pool.query(sql, (error, results, fields) => {
          if (error) {
            return console.error(error.message);
          }
          console.log(results.rows[0].balance);
          let RetValue = results.rows[0].balance
          res.json({ RetValue });
        });
    })

    app.get('/NodesList',async(req,res)=>{
  
//      console.log("This is the AcctName: "+ req.query.AcctName);
      //console.log("This is the DataTable: "+ req.query.DataTable);
      //let sql = "SELECT * FROM "+req.query.DataTable;
      let sql = "SELECT * FROM branch_table";
      pool.query(sql, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
//        console.log("This is the row: " + results.rows[0].url);
        let RetValue = results.rows
        res.json({ RetValue });
      });
  })

  app.get('/UpdateResults',async(req,res)=>{
  
          AcctName  = req.query.AcctName;
          BranchList  = req.query.Branches;
          GrandTotal  = req.query.Total_Bal;
          let sql = "INSERT INTO Results_Table (acctname, branches, total_bal, timestamp) VALUES ('"+AcctName+"','"+ BranchList+"',"+ GrandTotal+",CURRENT_TIMESTAMP);"
          pool.query(sql, (error, results, fields) => {
            if (error) {
              return console.error(error.message);
            }
            console.log("Results Insert was successful " );
            let RetVal = 200
            res.json({ RetValue: RetVal });
          });
      })
    
  
app.listen(60000);
