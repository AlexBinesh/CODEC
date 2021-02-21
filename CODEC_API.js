require  ('dotenv').config()
const express = require("express");
const app = express();
const formidable = require('formidable');
const axios = require('axios');

const jwt = require('jsonwebtoken')
console.log ("Starting CODEC MAIN API...")
app.use(express.json())
let EncryptedObject = {};
const SEAL = require('node-seal/allows_js_node_umd');
var myArgs = process.argv.slice(2);
console.log('Listening on port: ', myArgs[0]);
console.log('==================================================================================================' );
//const SEAL = require('node-seal');
let BranchName = "Branch" + myArgs[0]
let AcctToLookUP;
 async function GetBankAcctBalance(BranchAcctRes) {

  console.log("@@@@@@@@@ Entered GetBankAcctBalance " );
  let res = await axios.get('http://127.0.0.1:60000/BranchBal?AcctName=ABC123');
  let data = res.data;
  console.log("********** This is the data from BankAPI " + res);
  BranchAcctRes = data;
}

app.post('/CodecAPI',  (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function(err, fields, files) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    let encObject = {};
    AcctToLookUP = fields.AcctName;
    encObject.cipherText = fields.cipherText;
    encObject.publicKey = fields.publicKey;
//    encObject.secretKey = fields.secretKey;
    encObject.encryptor = fields.encryptor;
    var NodeAddresses ;
//    console.log(  "RRRRRRRRRRRRRRRR: " +fields.NodeAdds[1]);  
    var NodeArray ;
    var NodeNums = JSON.parse(fields.NodeNumbers)
    let BranchAcctRes;
//    console.log('RRRRRRRRRRRRRRRRR CodecAPI- 1 :: NodeNums ' + NodeNums );
    if ( NodeNums > 0){
//      console.log(  "PPPPPPPPPPPPPPPP: " +JSON.parse(fields.NodeAdds));
      NodeAddresses= JSON.parse(fields.NodeAdds)//.split(','); 
//      console.log(  "PPPPPPPPPPPPPPPP: NodeAddresses 0: " +NodeAddresses[0]);
//      console.log(  "PPPPPPPPPPPPPPPP: NodeAddresses 1: " +NodeAddresses[1]);
      NodeArray = JSON.parse(fields.NodeAdds);
    }else{
        NodeAddresses = ''; 
    }


let promise7 = new Promise(function(resolve, reject) {
//  GetBankAcctBalance(BranchAcctRes);
//  console.log("1111111 This is the Acct To Look Up " + AcctToLookUP);
//       BranchAcctRes = axios.get('127.0.0.1:60000/BranchBal?AcctName=ABC123');
  let SQL_URL = 'http://127.0.0.1:60000/BranchBal?AcctName=' + AcctToLookUP +'&DataTable=' + BranchName;
//  console.log("222222 Calling this URL " + SQL_URL);
   axios.get(SQL_URL).then(response => {
//    console.log("********** This is the response code: " + response.status);
//    console.log("********** This is the response data: " + response.data.RetValue);
    setTimeout(() => resolve(response), 200);
    //setTimeout(() => resolve(BranchAcctRes), 500);
    BranchAcctRes = response.data.RetValue
  //              return response.status;
  })
  .catch((error) => {
    console.log('error 3 ' + error);
  });

//  console.log("2222222 Before the Call " );

//setTimeout(() => resolve(BranchAcctRes), 500);

});
promise7.then(
     result => {
       
//      console.log("44444444 This is the data from BankAPI " + BranchAcctRes);


      let promise4 = new Promise(function(resolve, reject) {
//          console.log(  "Calling GetBankAcctBal: " );
          AddEncryptInput(encObject, BranchAcctRes);
          setTimeout(() => resolve(encObject), 1000);
      });
      promise4.then(
        result => {
          let promise3 = new Promise(function(resolve, reject) {
              authenticateToken (fields.AccToken, fields.Auth_Serv_Add)
              setTimeout(() => resolve(encObject), 1000);
          });
          promise3.then(
            result => {
              let promise6 = new Promise(function(resolve, reject) {
 
                if (NodeNums < 1){ // If no more nodes, return
//                    console.log('CodecAPI- 1 ::Last NODE, Returning' );
                    res.json({ RetVal: encObject.TempcipherText });  
                  return;
                }
                
                SendToNextNode (fields.AccToken,  fields.Auth_Serv_Add, encObject, NodeNums, NodeArray);
                TimeOut = (NodeNums+1 )* 6000;
                console.log ("111111111111111111 AFTER SendToNextNode: Waiting to Receive in : "+ TimeOut )  

                setTimeout(() => resolve(encObject), TimeOut);
                
             });
             promise6.then(
                  result => {
                    console.log('CodecAPI- 1 :: Returning to the PREVIOUS Node' );

                  res.json({ RetVal: BranchName+','+encObject.TempcipherText });  
                }
              );  

          }
        );  

          }
        );  



  });

  //let data = res.data;
//  console.log("33333333 Before the Call " );
//  console.log('Completed promise7' );
}
);  

});


function authenticateToken (AccToken, Auth_Serv_Add, res){

  const token = AccToken && AccToken.split('.')[1]
//console.log ("authenticateToken: This is the token: "+ token)
if (Auth_Serv_Add == null ) return 402;
  if (token == null ) return 401;
//  console.log ("authenticateToken: This is the Auth Server: "+ Auth_Serv_Add)
  // Verify the Access Token

    const AuthStr = 'Bearer '.concat(AccToken);
 //   console.log("********** Before the call to Auth Server: " );
    axios.get(Auth_Serv_Add, { headers: { Authorization: AuthStr } }).then(response => {
//       console.log("********** This is the data: " + response.status);

      return response.status;
    })
    .catch((error) => {
      console.log('error 3 ' + error);
    });
  //eturn res.sendStatus(401);

}

//function SendToNextNode (AccToken, NodeAddr,Auth_Serv_Add, EncryptedObj, NodeNumb, NodeArray){
  function SendToNextNode (AccToken,Auth_Serv_Add, EncryptedObj, NodeNumb, NodeArray){
    
 /*        console.log ("SendToNextNode: ------------------- CodecAPI/Post: This is all the  Nodes: "+ NodeAddr )   
        console.log ("SendToNextNode++++++++++++++++++ CodecAPI/Post: This is next NodeAdress: "+ NodeAddr[1] )   
*/
        var FormData = require('form-data')
        data = new FormData();
        
//        console.log ("SendToNextNode: This is the NodeAdress 0: " )  
        data.append('Auth_Serv_Add', Auth_Serv_Add);
        data.append('AcctName', AcctToLookUP);
//        console.log ("SendToNextNode: This is the NodeAdress 1: " )  
        data.append('AccToken', AccToken);
        data.append('NodeNumbers', JSON.stringify(NodeNumb-1))
//        console.log ("SendToNextNode: This is the NodeAdress 2: " )  
        
        data.append('publicKey', EncryptedObj.publicKey);
        data.append('cipherText', EncryptedObj.TempcipherText);
        //console.log ("SendToNextNode: This is the NodeAdress 3: " )  
        //console.log ("SendToNextNode: This is the NodeAdress 1: "+ NodeAddr[0] )  
        //console.log ("SendToNextNode: This is the NodeAdress 4  NodeAddr[1]): " + NodeAddr[1])  
//        console.log ("SendToNextNode: This is the NodeAdress 5: " )  
        var NextNodeAddress;
        if (NodeNumb > 0){
//          data.append('NodeAdds', JSON.stringify(NodeAddr[1])) // Send the list starting with the next node address
//          console.log ("999999999999999999 SendToNextNode: This is the NodeAdress 5: |" + NodeArray[0].toString() + "|")  
          NextNodeAddress= NodeArray[0].toString();
          NodeArray.shift()
          data.append('NodeAdds', JSON.stringify(NodeArray)) // Send the list starting with the next node address
        }
        else{
          data.append('NodeAdds', 'Empty') // Send the list starting with the next node address
        }

        let promise2 = new Promise(function(resolve, reject) {
 //         console.log('--------------SendToNextNode- 1 :: promise2 . Sending this address to next node: |' + NodeAddr +"|" );
          const formHeaders = data.getHeaders(); 
         
          
//          console.log ("6666666666666666666 SendToNextNode: This is Number of Nodes left: |" + NodeNumb + "|")  
          //console.log ("777777777777777 SendToNextNode: These are the Nodes: |" + NodeAddr + "|")  
/*          if ( 1 == NodeNumb){
            //NextNodeAddress= NodeAddr.toString();
          }else{
            NextNodeAddress= NodeAddr[0];
          }
*/
          axios.post(NextNodeAddress, data, {
            //Authorization: 'Bearer '+AccToken,
            headers: formHeaders
          })
          .then(response => {
//            console.log('Got back from server ' + response.data.RetVal)
            //console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<Got back from server ' + response.data.RetVal)
            EncryptedObj.TempcipherText = response.data.RetVal;

            //let Subtotal = ReturnBal(EncryptedObject);
          }
          )
          .catch(error => {
            console.log('Axios Error', error.message)
            return;
          })
//          console.log ("101010101010 SendToNextNode: This is the NodeAdress 6: " )  

         // setTimeout(() => resolve(EncryptedObject), 1000);
       });    
        promise2.then(
          result => {
            console.log("In SendToNextNode- 2 :: promise2 then .: " )      

          },
        );  


 
      //eturn res.sendStatus(401);
    
      }
    
  
  function AddEncryptInput(EncrdObj, InputValue2) {
      { 
      ;(async () => {
      const Morfix = await SEAL()
        // Using CommonJS for RunKit
        //const { Seal } = require('node-seal')
      //  const Morfix = await Seal()
    
      //  const Morfix = EncrdObj.Morfix;

        const schemeType = Morfix.SchemeType.BFV
        const securityLevel = Morfix.SecurityLevel.tc128
        const polyModulusDegree = 4096
        const bitSizes = [36, 36, 37]
        const bitSize = 20
      
        const parms = Morfix.EncryptionParameters(schemeType)
      
        // Set the PolyModulusDegree
        parms.setPolyModulusDegree(polyModulusDegree)
//        console.log("AddEncryptInput:: Step 1: " ); /home/abinesh/CODEC/JWTAuth/CodecNetowrk/CODEC_Main_API_Temp_Partha.js
      
        // Create a suitable set of CoeffModulus primes
        parms.setCoeffModulus(
          Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
        )
//        console.log("AddEncryptInput:: Step 2: " );
      
        // Set the PlainModulus to a prime of bitSize 20.
        parms.setPlainModulus(
          Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
        )
//        console.log("AddEncryptInput:: Step 3: " );
      
        const context = Morfix.Context(
          parms, // Encryption Parameters
          true, // ExpandModChain
          securityLevel // Enforce a security level
        )
        
        if (!context.parametersSet()) {
          throw new Error(
            'Could not set the parameters in the given context. Please try different encryption parameters.'
          )
        }

//-1- For testing Secret key uncomment me         const UploadedSecretKey = Morfix.SecretKey()
//0- For testing Secret key uncomment me         UploadedSecretKey.load(context, EncrdObj.secretKey)
 //1- For testing Secret key uncomment me        const decryptor = Morfix.Decryptor(context, UploadedSecretKey)
  
        const UploadedPublicKey = Morfix.PublicKey()
        UploadedPublicKey.load(context, EncrdObj.publicKey)
        
  
        const uploadedCipherText = Morfix.CipherText()
        uploadedCipherText.load(context, EncrdObj.cipherText)  



      
        const encoder = Morfix.BatchEncoder(context)
        const keyGenerator = Morfix.KeyGenerator(context)
        const encryptor = Morfix.Encryptor(context, UploadedPublicKey)
        const evaluator = Morfix.Evaluator(context)
      
        // Create data to be encrypted
        const array = Int32Array.from([InputValue2])
      
        // Encode the Array
        const plainText = encoder.encode(array)
        // Encrypt the PlainText
      
        const cipherText = encryptor.encrypt(plainText)
      
        evaluator.add(uploadedCipherText, cipherText, uploadedCipherText) // Op (A), Op (B), Op (Dest)
        EncrdObj.cipherText = uploadedCipherText;
      
        EncrdObj.context = context;
//2- For testing Secret key uncomment me         const decryptedPlainText = decryptor.decrypt(EncrdObj.cipherText)
        const TempcipherText = await EncrdObj.cipherText.save();
        EncrdObj.TempcipherText = TempcipherText;
        
        //console.log('AddEncryptInput:: EncrdObj.cipherText 2: ', TempcipherText)
        
        // Decode the PlainText
//3- For testing Secret key uncomment me         decodedArray = encoder.decode(decryptedPlainText)
//4- For testing Secret key uncomment me        console.log('AddEncryptInput:: 3: ', decodedArray[0])        
        // This is not part of the object. I added it. AB
//5- For testing Secret key uncomment me       EncrdObj.decryptedPlainText = decryptedPlainText;
//        console.log ("AddEncryptInput: Before Returning TempcipherText...")
        console.log('AddEncryptInput:: This is the value to add to the Total: ', array[0]) 
        return TempcipherText;

          })()
            
        } 
      
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(EncrdObj);
            });
        //  }, 2000);
        });
      
      }

app.listen(myArgs[0]) //8000
console.log ("CODEC MAIN API started...")