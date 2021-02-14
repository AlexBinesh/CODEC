
require  ('dotenv').config()
const express = require("express");
const app = express()

const jwt = require('jsonwebtoken')
console.log ("Starting CODEC Auth Server")
app.use(express.json())

const posts = [
    {
        username: 'Kyle',
        title: 'Post 1'
    },
    {
        username: 'Jim',
        title: 'Post 2'
    }
]

app.post('/CodecCreateToken', (req,res)=>{//Create a token and a refresh token
    //Authenticate User


    const username = req.body.username
    const user = { name : username}
    const accessToken =  generateAccessToken (user)
    const accToken =  "accessToken"

    console.log ("Username: "+req.body.EncryptObj)
    
 //   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
 //   refreshTokens.push(refreshToken)
    console.log ("++++++CodecCreateToken:: In the CodecAuthServer")
//    res.json({accesssToken: accessToken, refreshToken: refreshToken })
//'{ "accesssToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS3lsZSIsImlhdCI6MTYwMTYzOTYwMCwiZXhwIjoxNjAxNjQyNjAwfQ.vacpHAsyhtciab01dwouL1uxthm_AFZ5Hplj93ihkrU"}';
AccTok ="'{ \x22accessToken\x22: \x22" + accessToken+"\x22}'";
console.log ("-------CodecCreateToken:: This is the AccTok: "+ AccTok)

//res.json({ "accToken" : accessToken })
res.json(AccTok)
})

function generateAccessToken (user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3000s'})
}


app.get('/CodecVerifyToken', authenticateToken, (req,res)=>{
  console.log ("CodecVerifyToken:: In the function==>>")
  res.json(posts.filter(post => posts.username === req.query.id))
})

function authenticateToken (req, res, next){
  console.log ("authenticateToken:: In the authenticateToken==>>")
    const authHeader = req.headers ['authorization']
    console.log ("authenticateToken:: This is the authheader==>>" + authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null ){
      console.log ("authenticateToken:: Token was null==>>\n\n")
      return res.sendStatus(401)
    }
    console.log ("authenticateToken:: Token was NOT null==>> " +token+"\n\n")
    jwt.verify (token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err){ 
            console.log ("CodecVerifyToken: Invalid token: "+ err)
            return  res.sendStatus(403)
        }
        console.log ("CCodecVerifyToken: Token is valid")
        req.user = user
    next()
    })

}

async function asyncCallEncryptInput(EncryptedObject, InputVal2) {
    console.log("asyncCallEncryptInput: This is the Input Value: " + InputVal2);
            await EncryptInput(EncryptedObject, InputVal);
//        await ReturnBal(EncryptedObject, EncryptedObject.secretKey);
       
//        UpdatedEncryptedObject = await AddEncryptInput(EncryptedObject, InputVal2);
          UpdatedEncryptedObject = await AddEncryptInput(EncryptedObject, InputVal2);
      //  await ReturnBal(UpdatedEncryptedObject, EncryptedObject.secretKey);
}
 
function AddEncryptInput(EncrdObj, InputValue2) {
    { 
        ;(async () => {
    
    
      // Using CommonJS for RunKit
      const { Seal } = require('node-seal')
    //  const Morfix = await Seal()
    console.log("AddEncryptInput:: Adding this value to total: " + InputValue2);
    
      const Morfix = EncrdObj.Morfix;
    
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
    
      const context = EncrdObj.context
      if (!context.parametersSet()) {
        throw new Error(
          'Could not set the parameters in the given context. Please try different encryption parameters.'
        )
      }
    
      const encoder = Morfix.BatchEncoder(context)
      const keyGenerator = Morfix.KeyGenerator(context)
      const encryptor = Morfix.Encryptor(context, EncrdObj.publicKey)
      const evaluator = Morfix.Evaluator(context)
    
      // Create data to be encrypted
      const array = Int32Array.from([InputValue2])
    
      // Encode the Array
      const plainText = encoder.encode(array)
      // Encrypt the PlainText
    
      const cipherText = encryptor.encrypt(plainText)
    
      evaluator.add(EncrdObj.cipherText, cipherText, EncrdObj.cipherText) // Op (A), Op (B), Op (Dest)
    
    
      //console.log('decodedArray', decodedArray[0])
    
        })()
          
      } 
    
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(EncrdObj);
          });
      //  }, 2000);
      });
    
    }
    




app.listen(7000)