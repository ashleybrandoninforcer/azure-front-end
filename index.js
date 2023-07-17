const express = require('express')
const session = require('express-session')
const cors = require('cors')

// const router = express.Router()
const axios = require('axios')
const crypto = require('crypto')

const dotenv = require('dotenv')
require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const Redis = require('ioredis')
const RedisStore = require('connect-redis').default


const app = express()

dotenv.config()

const PORT = process.env.PORT || 4040

app.use(bodyParser.json());

const BASE_URL = process.env.BASE_URL
const URL_KEY = process.env.URL_KEY

const redis = new Redis()

//Init session/create cookie
app.use(
    session({
        key: "userId",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({client: redis}),
        cookie: {
            expires: 1000 * 60 * 60 * 24, //one day
        }
    })
)


//Session/cookie middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods:['GET', 'POST'],
  credentials: true
}))

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))


//Login functions
app.post('/login', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const authCode = req.body.authCode
  const backend_ep = process.env.BACKEND_EP
  const salt = process.env.SALT

  const hash = crypto.createHash('sha256')
  hash.update(password + salt)
  const hashedPassword = hash.digest('hex')

  const loginObj = {
    username: username,
    passhash: hashedPassword,
    mfacode: authCode
  }


  try {
    const loginRequest = await axios.post(backend_ep, loginObj, {
      params: {
        code: process.env.PARAMS_CODE
      }
    });

    const loginResponse = loginRequest.data;

    if (loginResponse.authenticated) {

      req.session.user = loginResponse
      let idString = JSON.stringify(loginResponse.clientid)

      redis.set('redisUser', idString)


      // Create object to send to front end
      const authMessage = {
        message: loginResponse.message,
        displayName: loginResponse.displayName,
        authenticated: loginResponse.authenticated
      };

      //auth frontend
      res.status(200).json(authMessage)

    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});
  
//useEffect calls this to see if user is logged in
app.get('/login', (req, res) => {
    if(req.session.user) {
        res.send({loggedIn: true, user: req.session.user })
    } else {
        res.send({loggedIn: false})
    }
})


app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Logout failed' });
      } else {
        res.clearCookie('sessionId', { expires: new Date(0) }); // Clear the session cookie by setting its expiration to a past date
        res.status(200).json({ message: 'Logout successful' });
      }
    });
  });


//Feature functions
app.post('/list-tenants', async (req, res) => {

  try {

    let requestBody = {
      clientid: 1,
      originatingIP: "0.0.0.0"
    }

      const POST_URL = `${BASE_URL}listTenantsFE?code=${URL_KEY}`
      const response = await axios.post(POST_URL, requestBody)

      res.status(200).json(response.data);

  } catch (error) {
      res.status(500).json({ message: 'Request failed' })
  }

})
 

app.post('/list-policies', async (req, res) => {

  const clientTenantId = req.body.ctId

  const redisCID = await redis.get('redisUser')

  try {

    //Get Policy Type IDs
    const GET_URL = `${BASE_URL}/getPolicyTypes?code=${URL_KEY}`
    const response = await axios.get(GET_URL)
    const data = response.data
    const uniqueTypeIds = [...new Set(data.map((item) => item.policyTypeID))]

    const requestBodies = uniqueTypeIds.map((policyTypeID) => {
      return {
        clientid: +redisCID,
        clientTenantId: +clientTenantId,
        originatingIP: "0.0.0.0",
        policyTypeID: policyTypeID,
        target: "365"
      }
    })
  
  const POST_URL = `${BASE_URL}/listPoliciesFE?code=${URL_KEY}`

  const promises = requestBodies.map(async (requestBody) => {
    const response = await axios.post(POST_URL, requestBody)
    return response.data
  })
  //parsedResponse
    const policiesOne = await Promise.all(promises)

  const policyTypes = response.data
  console.log(policiesOne)

  const policiesTwo = policiesOne.map((item) => {
    const PolicyTypeId = item.Result.PolicyTypeId
    const modifiedData = item.Data.map((child) => ({ ...child, PolicyTypeId }))
    return modifiedData
  })

  const policiesByType = {}



  //loop over policy types and add listpolicies responses as children
  policyTypes.forEach((type, index) => {
    const children = policiesTwo[index];
    if (children.length > 0) {
      policiesByType[type.policyTypeFriendlyName] = children;
    }
  });

  console.log(policiesByType)
  res.status(200).json(policiesByType)

  } catch (error) {
      res.status(500).json({ message: 'Request failed' })
  }

})

app.post('/send-backup', async (req, res) => {
 
  const backUpBody = req.body
  const redisCID = await redis.get('redisUser')

  let confirmationData = []
  let errorMessages = []

  try {
    for (const obj of backUpBody) {
    obj.clientid = +redisCID
    obj.originatingIP = "0.0.0.0"

      try {
        const response = await axios.post(`${BASE_URL}/backupPolicyFE`, obj, {
          params: {
            code: `${URL_KEY}`
          }
        })

        // console.log(response.data.Data.policyName)
        confirmationData.push(response.data.Data.policyName)


      } catch (error) {
        console.error('Error processing policies:', error)
        errorMessages.push({ message: 'Error processing policy' })
      }
    }

    res.status(200).json({ message: 'Selected policies backed up successfully', confirmationData, errorMessages })


    } catch (error) {
      console.error('Error processing policies:', error);
      res.status(500).json({ message: 'Error processing policies' })
    }

})



app.post('/send-deployment', async (req, res) => {

  const deploymentBody = req.body
  const redisCID = await redis.get('redisUser')
  console.log(redisCID)
  console.log(deploymentBody)

  let confirmationData = []
  let errorMessages = []

  try {
    for (const obj of deploymentBody) {
    obj.clientid = +redisCID
    obj.originatingIP = "0.0.0.0"

      try {
        const response = await axios.post(`${BASE_URL}/deployPolicyFE`, obj, {
          params: {
            code: `${URL_KEY}`
          }
        });

        console.log(response.data)
        confirmationData.push(response.data)


      } catch (error) {
        console.error('Error processing policies:', error)
        errorMessages.push({ message: 'Error processing policy' })
      }
    }

    res.status(200).json({ message: 'Selected policies backed up successfully', confirmationData, errorMessages })


    } catch (error) {
      console.error('Error processing policies:', error);
      res.status(500).json({ message: 'Error processing policies' })
    }


})

app.post('/get-backups-by-date', async (req,res) => {

  const ctid = req.body.ctId
  const redisCID = await redis.get('redisUser')

  try {
    let requestBody = {
      clientid: +redisCID,
      clientTenantId: +ctid,
      originatingIP: "0.0.0.0",
      queryMode: "automated"
    }

      const response = await axios.post(`${BASE_URL}/getAvailableBackupDatesFE`, requestBody, {
        params: {
          code: `${URL_KEY}`
        }
      });

      console.log(response.data)
      res.status(200).json(response.data);

  } catch (error) {
      res.status(500).json({ message: 'Request failed' })
  }

})

app.post('/get-backups-by-comment', async (req, res) => {

  const ctid = req.body.ctId
  const redisCID = await redis.get('redisUser')

  try {
    let requestBody = {
      clientid: +redisCID,
      clientTenantId: +ctid,
      originatingIP: "0.0.0.0",
      queryMode: "manual"
    }

      const response = await axios.post(`${BASE_URL}/getAvailableBackupDatesFE`, requestBody, {
        params: {
          code: `${URL_KEY}`
        }
      });

      console.log(response.data)
      res.status(200).json(response.data);

  } catch (error) {
      res.status(500).json({ message: 'Request failed' })
  }
})

app.post('/get-policies-by-backuprunid', async (req,res) => {


  const TYPES_URL = `${BASE_URL}/getPolicyTypes?code=${URL_KEY}`
  const typesResponse = await axios.get(TYPES_URL)
  const policyTypes = typesResponse.data

  const ctid = req.body.ctId
  const burid = req.body.burid
  const redisCID = await redis.get('redisUser')
  console.log(req.body.burid)

  try {
    let requestBody = {
      clientid: +redisCID,
      clientTenantId: +ctid,
      originatingIP: "0.0.0.0",
      mode: "backupRunId",
      backupRunId: +burid
    }

      const backedUpPolicies = await axios.post(`${BASE_URL}/getPolicyListByBackupRunID`, requestBody, {
        params: {
          code: `${URL_KEY}`
        }
      });

      const bupRes = backedUpPolicies.data.Data

      //group policies into arrays by policyTypeId
      const groupedObjects = bupRes.reduce((result, obj) => {
        const id = obj.policyTypeId;
        if (!result[id]) {
          result[id] = [];
        }
        result[id].push(obj);
        return result;
      }, {});
      

      const policiesByType = {};

      policyTypes.forEach((type) => {
        const name = type.policyTypeFriendlyName;
        const id = type.policyTypeID;
        const children = groupedObjects[id] || [];
        if (children.length > 0) {
          policiesByType[name] = children;
        }
      });

      res.status(200).json(policiesByType)


  } catch (error) {
      res.status(500).json({ message: 'Request failed' })
  }

})



app.post('/get-policies-by-comment', async (req, res) => {

  //Get Policy Types
  const TYPES_URL = `${BASE_URL}/getPolicyTypes?code=${URL_KEY}`
  const typesResponse = await axios.get(TYPES_URL)
  const policyTypes = typesResponse.data

  console.log(policyTypes)
  const ctid = req.body.ctId
  const buComment = req.body.comment
  const redisCID = await redis.get('redisUser')

  try {
    let requestBody = {
      clientid: +redisCID,
      clientTenantId: +ctid,
      originatingIP: "0.0.0.0",
      mode: "comment",
      comment: buComment
    }

      const backedUpPolicies = await axios.post(`${BASE_URL}/getPolicyListByBackupRunID`, requestBody, {
        params: {
          code: `${URL_KEY}`
        }
      });


      const bupRes = Array.isArray(backedUpPolicies.data.Data) ? backedUpPolicies.data.Data : [backedUpPolicies.data.Data];

      const groupedObjects = bupRes.reduce((result, obj) => {
        const id = obj.policyTypeId;
        if (!result[id]) {
          result[id] = [];
        }
        result[id].push(obj);
        return result;
      }, {});
      

      const policiesByType = {};

      policyTypes.forEach((type) => {
        const name = type.policyTypeFriendlyName;
        const id = type.policyTypeID;
        const children = groupedObjects[id] || [];
        if (children.length > 0) {
          policiesByType[name] = children;
        }
      });

      res.status(200).json(policiesByType)


  } catch (error) {
      res.status(500).json({ message: 'Request failed' })
  }
})

app.post('/send-restoration', async (req, res) => {

  const restoreBody = req.body
  const redisCID = await redis.get('redisUser')

  let confirmationData = []
  let errorMessages = []

  try {
    for (const obj of restoreBody) {
    obj.clientid = +redisCID
    obj.originatingIP = "0.0.0.0"

      try {
        const response = await axios.post(`${BASE_URL}/restorePolicyFE`, obj, {
          params: {
            code: `${URL_KEY}`
          }
        });

        console.log(response.data)
        confirmationData.push(response.data)


      } catch (error) {
        console.error('Error processing policies:', error)
        errorMessages.push({ message: 'Error processing policy' })
      }
    }

    res.status(200).json({ message: 'Selected policies backed up successfully', confirmationData, errorMessages })


    } catch (error) {
      console.error('Error processing policies:', error);
      res.status(500).json({ message: 'Error processing policies' })
    }


})


app.get('/policy-types', async (req, res) => {
  try {
      const response = await axios.get( `${BASE_URL}/getPolicyTypes?code=${URL_KEY}`)

      res.status(200).json(response.data)

  } catch (error) {
      next(error)
  }
})


app.listen(4040, () => {
  console.log(`Server started on port ${PORT}`);
})

