const express = require("express");
const app = express()
app.use(express.json())

const axios = require('axios');
const request = require('request');
//const SEAL = require('node-seal');
const SEAL = require('node-seal/allows_js_node_umd');

//let TableName = "branch_table" + myArgs[0]
//let AcctToLookUP;

  
let NodeAddresses =[
//                      'http://localhost:9000/CodecAPI' 
//                      ,'http://localhost:10000/CodecAPI'
//                   ,'http://localhost:11000/CodecAPI' 
//                     ,'http://localhost:12000/CodecAPI' 
                    ]
var AcctName; //="ABC123";
var AccToken = "";
let EncryptedObject = {};
var FirstNode = 'http://localhost:8000/CodecAPI'
let InputVal = (Math.random() * 100);
InputVal = InputVal.toFixed();
let data;
let ReturnValue;
let GrandTotal 
let BranchList;


app.get('/GetAcctBal',async(req,res)=>{
  
  console.log("This is the AcctName: "+ req.query.AcctName);
  AcctName = req.query.AcctName;

  let promise0 = new Promise(function(resolve, reject) {

    let SQL_URL = 'http://127.0.0.1:60000/NodesList';
//    console.log("222222 Calling this URL " + SQL_URL);
     axios.get(SQL_URL).then(response => {
//      console.log("********** This is the response code: " + response.status);
//      console.log("********** This is the response data: " + response.data.RetValue);
      ReturnedNodes = response.data.RetValue;

      FirstNode = ReturnedNodes[0].url+":"+ReturnedNodes[0].port+"/"+ReturnedNodes[0].api
//      BranchList = ReturnedNodes[0].branch;
      for( i = 1 ; i < ReturnedNodes.length ; i++){
//        console.log("1111111111111 NodeAddresses: " + NodeAddresses);
        NodeIndex = i-1; 
        NodeAddresses[NodeIndex]= ReturnedNodes[i].url+":"+ReturnedNodes[i].port+"/"+ReturnedNodes[i].api;
//        BranchList += "," + ReturnedNodes[i].branch;
//        console.log("This is the BranchList: " + BranchList);
//        console.log("This is the row: " + ReturnedNodes[i].url+":"+ReturnedNodes[i].port+"/"+ReturnedNodes[i].api);
      }
//      console.log("22222222222 NodeAddresses: " + NodeAddresses[1]);
      setTimeout(() => resolve(response), 200);
      //setTimeout(() => resolve(BranchAcctRes), 500);
      BranchAcctRes = response.data.RetValue
    //              return response.status;
    })
    .catch((error) => {
      console.log('error 3 ' + error);
    });
  
//    console.log("2222222 Before the Call " );
  
  //setTimeout(() => resolve(BranchAcctRes), 500);
  
  });
  promise0.then(
       result => {
    axios.post('http://localhost:7000/CodecCreateToken')
    .then((res) => {
        const Payload = res.data.substring(1,res.data.length-1);
        //console.log("Trimmed Payload" + Payload)
        ParsedPayload = JSON.parse(Payload);
//        console.log('Created Access Token: '+ ParsedPayload.accessToken);
        AccToken= ParsedPayload.accessToken;
        let RanNum = (Math.random() * 1000);
        RanNum = RanNum.toFixed();
        console.log("-------CodecCreateToken:: This is the Randon Number I am sending: " + RanNum)      
        let promise1 = new Promise(function(resolve, reject) {
        try{
          EncObj =  EncryptInput(EncryptedObject, RanNum);
          setTimeout(() => resolve(EncryptedObject), 1000);
        } catch (error) {
          console.log("Caught this error: " + error)      
        }
      });
      promise1.then(
        result => {
          let promise2 = new Promise(function(resolve, reject) {
            
      try{
        var FormData = require('form-data')
        data = new FormData();
        
        data.append('AcctName', AcctName);
        data.append('Auth_Serv_Add', "http://localhost:7000/CodecVerifyToken");
        data.append('AccToken', AccToken);
//        console.log("==========This is the AccToken: " + AccToken)      


        data.append('publicKey', EncryptedObject.publicKey);
        data.append('cipherText', EncryptedObject.cipherText);
//        console.log("In Promise 2 before appending NodeAddress call: " )      

        data.append('NodeAdds', JSON.stringify(NodeAddresses))
        data.append('NodeNumbers', JSON.stringify(NodeAddresses.length))
//        console.log("In Promise 3 AFTER appending NodeAddress call: " )      

        setTimeout(() => resolve(EncryptedObject), 1000);
      } catch (error) {
          console.log("promise1.then:: Caught this s error: " + error)      
      }
      });
        promise2.then(
          result => {
            const formHeaders = data.getHeaders();
//            console.log("In Promise 2 before HTTP call: " )      
 
            console.log('===========Calling this:  ' + FirstNode)
            axios.post(FirstNode, data, {
              //Authorization: 'Bearer '+AccToken,
              headers: formHeaders
            })
            .then(response => {
              RetString = response.data.RetVal;
              var RespArray = RetString.split(',');
              //console.log('Name Array is: ' + RespArray);
//              console.log('Token back from server is: ' + RespArray[RespArray.length -1]);
              console.log('First Branch: ' + RespArray[0]);
              console.log('Second Branch: ' + RespArray[1]);
              //console.log('++++++++++++++++Got back from server ' + response.data.RetVal)
              //return;
//              EncryptedObject.cipherText = response.data.RetVal;
              EncryptedObject.cipherText = RespArray[RespArray.length -1];
              BranchList = RespArray[RespArray.length -1] = '';
              console.log('This is the branch list: ' + BranchList);
             let promise5 = new Promise(function(resolve, reject) {
//                console.log('CodecAPI- 1 :: promise5 ' );
                Subtotal = ReturnBal(EncryptedObject);
                setTimeout(() => resolve(EncryptedObject), 1000);
             });
             promise5.then(
                  result => {
                    GrandTotal = EncryptedObject.Subtotal - RanNum;
                    console.log('ReturnBal:: Final Balance Received from the nodes: ' + GrandTotal ) 

                    let promise6 = new Promise(function(resolve, reject) {

                      let SQL_URL = 'http://127.0.0.1:60000/UpdateResults?AcctName='+AcctName + '&Branches='+BranchList+'&Total_Bal='+GrandTotal;
//                      console.log("6666666666666 Promise6 Calling UpdateResults, SQL_URL: " + SQL_URL);
                       axios.get(SQL_URL).then(response => {
                        ReturnValue = response.data.RetValue;
                        setTimeout(() => resolve(response), 1000);
//                        console.log("ReturnValue: " + ReturnValue)
                      })
                      .catch((error) => {
                        console.log('error 3 ' + error);
                      });
                    
                    });
                    promise6.then(
                         result => {
                          if (200 == ReturnValue){
                            console.log("Updated the Results table successfully. ")
                          }
                          else{
                            console.log("Update of Results table was unsuccessful. Return Code: " + ReturnValue)
                          }

                        });
                }
              );  
            })
            .catch(error => {
              console.log('Axios Error', error.message)
            })
            
          },
        );  
      console.log("===done with Promise1")
    }, 
  );  


    }).catch((err) => {
      console.error(err);
    });

  });  

  res.json({ GrandTotal });

})

function EncryptInput(EncryptedObject1, InputVal) {
  { 
    (async () => {
      //console.log("EncryptInput:: Initial value to add: " + InputVal);
      // Using CommonJS for RunKit
      const Morfix = await SEAL()
      const schemeType = Morfix.SchemeType.BFV
      const securityLevel = Morfix.SecurityLevel.tc128
      const polyModulusDegree = 4096
      const bitSizes = [36, 36, 37]
      const bitSize = 20
    
      const parms = Morfix.EncryptionParameters(schemeType)
    
      // Set the PolyModulusDegree
      parms.setPolyModulusDegree(polyModulusDegree)
    
      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus(
        Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
      )
    
      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus(
        Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
      )
    
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
    
      const encoder = Morfix.BatchEncoder(context)
      const keyGenerator = Morfix.KeyGenerator(context)
      const publicKey = keyGenerator.publicKey()
      const secretKey = keyGenerator.secretKey()
      const encryptor = Morfix.Encryptor(context, publicKey)
      const morfix = Morfix
      const decryptor = Morfix.Decryptor(context, secretKey)
      const evaluator = Morfix.Evaluator(context)
    
      // Create data to be encrypted
      const array = Int32Array.from([InputVal])
    
      // Encode the Array
      const plainText = encoder.encode(array)
      // Encrypt the PlainText
      const cipherText = encryptor.encrypt(plainText)

      EncryptedObject1.cipherText = await cipherText.save();
      EncryptedObject1.publicKey = await publicKey.save();
      EncryptedObject1.secretKey = await secretKey.save();

      return context
    })()
  } 
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(EncryptedObject1);
        return Promise.resolve(EncryptedObject1);
      });
    });
}

function ReturnBal(EncrdObj) {
  let decodedArray;
  { 
    ;(async () => {
      const Morfix = await SEAL()
      const schemeType = Morfix.SchemeType.BFV
      const securityLevel = Morfix.SecurityLevel.tc128
      const polyModulusDegree = 4096
      const bitSizes = [36, 36, 37]
      const bitSize = 20
  
      const parms = Morfix.EncryptionParameters(schemeType)
    
      // Set the PolyModulusDegree
      parms.setPolyModulusDegree(polyModulusDegree)
    
      // Create a suitable set of CoeffModulus primes
      parms.setCoeffModulus(
        Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
      )
    
      // Set the PlainModulus to a prime of bitSize 20.
      parms.setPlainModulus(
        Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
      )

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
    
      const encoder = Morfix.BatchEncoder(context)
      
      const UploadedSecretKey = Morfix.SecretKey()
      UploadedSecretKey.load(context, EncrdObj.secretKey)
      const decryptor = Morfix.Decryptor(context, UploadedSecretKey)

      const uploadedCipherText = Morfix.CipherText()
      uploadedCipherText.load(context, EncrdObj.cipherText)
      const decryptedPlainText = decryptor.decrypt(uploadedCipherText)
    
      // Decode the PlainText
      decodedArray = encoder.decode(decryptedPlainText)
      EncrdObj.Subtotal = decodedArray[0]
      console.log('ReturnBal:: Balance Received from the nodes: ', decodedArray[0]) 
      return decodedArray[0];
    })()
  } 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(decodedArray[0]);
    });
  });
}

function ReturnBal_Original(EncrdObj,UpdatedcipherText) {
  //  let EncryptedObject11 = EncryptedObject1;
  //  let InputVal  = 4;
  //  sync function EncryptInput(InputVal, EncryptedObject1) 
  { 
      ;(async () => {
    // ES6 or CommonJS
//     import { Seal } from 'node-seal'
//     const { Seal } = require('node-seal')

     const Morfix = await SEAL()     
    // Using CommonJS for RunKit
//    const { Seal } = require('node-seal')
//    const Morfix = await Seal()
  //  const Morfix = EncrdObj.Morfix;
  
    const schemeType = Morfix.SchemeType.BFV
    const securityLevel = Morfix.SecurityLevel.tc128
    const polyModulusDegree = 4096
    const bitSizes = [36, 36, 37]
    const bitSize = 20
    console.log("ReturnBal_Original:: 1: ")

    //    console.log("AddEncryptInput:: This is the public Key: "+ EncrdObj.publicKey)
//    console.log("AddEncryptInput:: This is the secret Key: "+ EncrdObj.secretKey)
  
    const parms = Morfix.EncryptionParameters(schemeType)
    console.log("ReturnBal_Original:: 2: ")
  
    // Set the PolyModulusDegree
    parms.setPolyModulusDegree(polyModulusDegree)
    console.log("ReturnBal_Original:: 3: ")

    // Create a suitable set of CoeffModulus primes
    parms.setCoeffModulus(
      Morfix.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
    )
    console.log("ReturnBal_Original:: 4: ")

    // Set the PlainModulus to a prime of bitSize 20.
    parms.setPlainModulus(
      Morfix.PlainModulus.Batching(polyModulusDegree, bitSize)
    )
    console.log("ReturnBal_Original:: 5: ")
  
  /*  const context = Morfix.Context(
      parms, // Encryption Parameters
      true, // ExpandModChain
      securityLevel // Enforce a security level
    )
  */
    const context = EncrdObj.context
    if (!context.parametersSet()) {
      throw new Error(
        'Could not set the parameters in the given context. Please try different encryption parameters.'
      )
    }
    console.log("ReturnBal_Original:: 6: ")

    const encoder = Morfix.BatchEncoder(context)
    console.log("ReturnBal_Original:: 7: ")
     const keyGenerator = Morfix.KeyGenerator(context)
    //*** const publicKey = keyGenerator.publicKey()
//    const secretKey = keyGenerator.secretKey()
    //****const encryptor = Morfix.Encryptor(context, EncrdObj.publicKey)
    console.log("ReturnBal_Original:: 8: ")
    const decryptor = Morfix.Decryptor(context, EncrdObj.secretKey)
    //const evaluator = Morfix.Evaluator(context)
  
    // Create data to be encrypted
    //const array = Int32Array.from([InputValue2])
  
    // Encode the Array
    //const plainText = encoder.encode(array)
  //console.log ("This is the plainText: "+ plainText)
    // Encrypt the PlainText
  
    //const cipherText = encryptor.encrypt(plainText)
  //EncryptedObject1.f = encryptor.encrypt(EncryptedObject1.cipherText)
      //EncryptedObject1.f = EncryptedObject1.cipherText;
  //  const cipherText = "";
    //console.log ("This is the cipherText: "+ EncryptedObject1.f)
  
    // Add the CipherText to itself and store it in the destination parameter (itself)
    //****evaluator.add(EncrdObj.cipherText, cipherText, EncrdObj.cipherText) // Op (A), Op (B), Op (Dest)
  
    // Or create return a new cipher with the result (omitting destination parameter)
    // const cipher2x = evaluator.add(cipherText, cipherText)
  
    // Decrypt the CipherText
    const decryptedPlainText = decryptor.decrypt(UpdatedcipherText)
  
    // Decode the PlainText
    const decodedArray = encoder.decode(decryptedPlainText)
  
    console.log('ReturnBal_Original:: Final Balance: ', decodedArray[0])
  
      })()
        
   } 
  
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(EncrdObj.cipherText);
      });
  //  }, 2000);
  });
  
  }

  app.listen(2020);

