
const express = require('express');
const Promise = require('bluebird');
const AppDAL = require('./dal');
const UserRepository = require('./user_repository');
const RoleRepository = require('./role_repository');
const UserRoleRepository = require('./user_role_repository');
const { resolve } = require('bluebird');
const { reject } = require('bluebird');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dal = new AppDAL('./database.sqlite3')

const userRepo = new UserRepository(dal)
const roleRepo = new RoleRepository(dal)
const userRoleRepo = new UserRoleRepository(dal)

app.get('/', function (req, res) {
  //
});

//#region Feature
app.get('/feature/test', (req, res) => {
  
  res.status(200);
  res.send();
});

app.get('/feature/getAll', (req, res) => {
  console.log("feature getall");

  roleRepo.getAllFeature().then(data => {
    resolve(data);
    res.send(data);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

app.post('/feature/create', (req, res)=> {
  roleRepo.createTable().then(data => {
    resolve(data);
    res.send(data);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

app.post('/feature', (req, res)=> {
  var userEmail = req.body.email;
  var featureName = req.body.featureName;
  var isEnabled = req.body.enable == true ? 1 : 0;

  var user = undefined;
  var feature = undefined;

  roleRepo.getByName(featureName).then(featureData => {
    if (!featureData) {
      res.status(304);
      res.send("Feature Does Not Exist");
      throw new Error('error');
    } else {
      feature = featureData;
      resolve(featureData);
    }
  }).then(() => userRepo.getByEmail(userEmail)).then(userData => {
    if (!userData) {
      res.status(304);
      res.send("User Does Not Exist");
      throw new Error('error');
    } else {
      user = userData;
      resolve(userData);
    }
  }).then(() => userRoleRepo.switchIsEnable(feature.id, user.id, isEnabled)).then(result => {
    resolve(200);
    res.send();
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
    res.status(304);
    res.send();
  });
});

app.put('/feature', (req, res)=> {
  userRoleRepo.getAllUserRole().then(userRoles => {
    return Promise.all(userRoles.map(x => {
      x.isEnabled = !x.isEnabled;
      return userRoleRepo.update({"id": x.id, "isEnabled": x.isEnabled});
    }));
  }).then(updatedDatas => {
      resolve(updatedDatas);
      res.status(200);
      res.send();
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
    res.status(304);
    res.send();
  });
});

app.post('/feature/createFeature', (req, res)=> {
  var featureName = req.body.featureName;

  roleRepo.getByName(featureName).then(featureData => {
    if (!featureData) {
      resolve(featureData);
    } else {
      res.status(400);
      res.send("Feature Already Available in DB");
      throw new Error('error');
    }
  }).then(() => roleRepo.create(featureName)).then(featureData => {
    resolve(featureData);
    res.send(featureData);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

app.get('/feature', (req, res) => {
  var featureName = req.query.featureName;
  var userEmail = req.query.email;

  var user = undefined;
  var feature = undefined;
  var isEnabled = undefined;
  userRepo.getByEmail(userEmail).then(userData => {
    if (!userData) {
      res.status(400);
      res.send("User Does Not Exist");
      throw new Error('error');
    } else {
      user = userData;
      resolve(userData);
    }
  }).then(() => roleRepo.getByName(featureName)).then(featureData => {
    if (!featureData) {
      res.status(400);
      res.send("Feature Does Not Exist");
      throw new Error('error');
    } else {
      feature = featureData;
      resolve(featureData);
    }
  }).then(() => userRoleRepo.getIsEnableByUserRoleId(feature.id, user.id)).then(result => {
    isEnabled = (result.isEnabled == 1);
    resolve(result);
    res.send({"canAccess": isEnabled});
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

//#endregion

//#region User
app.post('/user/create', (req, res)=> {
  userRepo.createTable().then(result => {
    resolve(result);

    res.send(result);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

app.get('/user/getAll', (req, res) => {
  userRepo.getAllUser().then(userDatas => {
    resolve(userDatas);
    res.send(userDatas);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

app.post('/user/createUser', (req, res)=> {
  var userName = req.body.userName;
  var userEmail = req.body.userEmail;

  console.log("create user");
  userRepo.getByEmail(userEmail).then(userData => {
    console.log("this is userData");
    console.log(userData);
    if (!userData) {
      resolve(userData);
    } else {
      res.status(400);
      res.send("User Email Already Available in DB");
      throw new Error("error");
    }
  }).then(() => userRepo.create(userName, userEmail)).then(result => {
    resolve(result);
    res.send(result);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

//#endregion

//#region UserRole
app.post('/userRole/create', (req, res)=> {
  userRoleRepo.createTable().then(result => {
    resolve(result);
    res.send(result);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

app.get('/userRole/getAll', (req, res) => {
  userRoleRepo.getAllUserRole().then(userRoleDatas => {
    resolve(userRoleDatas);
    res.send(userRoleDatas);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

app.post('/userRole/createUserRole', (req, res)=> {
  var featureName = req.body.featureName;
  var userEmail = req.body.userEmail;

  var feature = undefined;
  var user = undefined;

  roleRepo.getByName(featureName).then(featureData => {
    if (!featureData) {
      res.status(400);
      res.send("Feature Does Not Exist");
      throw new Error('error');
    } else {
      feature = featureData;
      resolve(featureData);
    }
  }).then(() => userRepo.getByEmail(userEmail)).then(userData => {
    if (!userData) {
      res.status(400);
      res.send("User Does Not Exist");
      throw new Error('error');
    } else {
      user = userData;
      resolve(userData);
    }
  }).then(() => userRoleRepo.getIsEnableByUserRoleId(feature.id, user.id)).then(userRoleData => {
    if (!userRoleData) {
      resolve(userRoleData);
    } else {
      res.status(400);
      res.send("Feature and User Already Existed For the Role");
      throw new Error("error");
    }
  }).then(() => userRoleRepo.create(false, feature.id, user.id)).then(result => {
    resolve(result);
    res.send(result);
  }).catch((err) => {
    console.log('Error: ');
    console.log(JSON.stringify(err));
  });
});

//#endregion


//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}..`));