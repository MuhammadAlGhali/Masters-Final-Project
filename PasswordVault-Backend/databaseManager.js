const mysql = require("mysql");

let instance = null;

//setup for connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "password-vault",
  port: "3306",
});

//connect to database
connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("Database " + connection.state);
});

//Database Manager Class
class DatabaseManager {
  //get instance of the database manager
  static getDatabaseManagerInstance() {
    if (!instance) {
      instance = new DatabaseManager();
    }
    return instance;
  }

  //add user
  registerUser(email, firstname, lastname, password) {
    try {
      const response = new Promise((resolve, reject) => {
        const query = "INSERT INTO `users` VALUES (?,?,?,?)";

        connection.query(
          query,
          [email, firstname, lastname, password],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //get user information
  getUser(email) {
    try {
      const response = new Promise((resolve, reject) => {
        const query = "SELECT * FROM `users` WHERE email = ?";
        connection.query(query, [email], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //delete user
  deleteUser(email) {
    try {
      const response = new Promise((resolve, reject) => {
        const query = "DELETE FROM `users` WHERE email=?";
        connection.query(query, [email], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //update user email
  changeUserEmail(emailNew, emailOld) {
    try {
      const response = new Promise((resolve, reject) => {
        const query = "UPDATE `users` SET email=? WHERE email=?";
        connection.query(query, [emailNew, emailOld], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }

  //add a single password for a certain user
  addWebPass(user, username, url, password, notes = "") {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "INSERT INTO `websitepasswords`(`user`, `username`, `url`, `pass`, `notes`) VALUES (?,?,?,?,?)";
        connection.query(
          query,
          [user, username, url, password, notes],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //get all password for websites
  getAllWebPass(user) {
    try {
      const response = new Promise((resolve, reject) => {
        const query = "SELECT * FROM `websitepasswords` WHERE user=?";
        connection.query(query, [user], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //get a single web pass for websites
  getWebPass(user, username, url) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM `websitepasswords` WHERE user=? AND username=? AND url=?";
        connection.query(query, [user, username, url], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //update a single password for a user
  updateWebPass(password, note = "", user, username, url) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "UPDATE `websitepasswords` SET pass=?,notes=? WHERE user=? AND username=? AND url=?";
        connection.query(
          query,
          [password, note, user, username, url],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  //delete a single password for a single user
  deleteWebPass(user, username, url) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "DELETE FROM `websitepasswords` WHERE user=? AND username=? AND url=?";
        connection.query(query, [user, username, url], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //insert a card for a single user
  addCardPass(
    user,
    username,
    cardnumber,
    pin,
    expirymonth,
    expiryyear,
    notes = "",
    holdername,
    cardtype
  ) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "INSERT INTO `cards` (`user`, `username`, `cardnumber`, `pin`, `expirymonth`, `expiryyear`, `notes`, `holdername`, `cardtype`) VALUES (?,?,?,?,?,?,?,?,?)";
        connection.query(
          query,
          [
            user,
            username,
            cardnumber,
            pin,
            expirymonth,
            expiryyear,
            notes,
            holdername,
            cardtype,
          ],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //get all cards for a single user
  getAllCardPass(user) {
    try {
      const response = new Promise((resolve, reject) => {
        const query = "SELECT * FROM `cards` WHERE user=?";
        connection.query(query, [user], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //get a single card pass for a user
  getCardPass(user, username, holdername, cardnumber) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM `cards` WHERE user=? AND username=? AND holdername=? AND cardnumber=?";
        connection.query(
          query,
          [user, username, holdername, cardnumber],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //Update card info
  updateCardPass(
    pin,
    expirymonth,
    expiryyear,
    notes = "",
    cardtype,
    user,
    username,
    holdername,
    cardnumber
  ) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "UPDATE `cards` SET `pin`=?, `expirymonth`=? ,`expiryyear`=?,`notes`=?,`cardtype`=? WHERE user=? AND username=? AND holdername=? AND cardnumber=?";
        connection.query(
          query,
          [
            pin,
            expirymonth,
            expiryyear,
            notes,
            cardtype,
            user,
            username,
            holdername,
            cardnumber,
          ],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  //delete a single card for a single user
  deleteCardPass(user, username, holdername, cardId) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "DELETE FROM `cards` WHERE user=? AND username=? AND holdername=? AND cardId=?";
        connection.query(
          query,
          [user, username, holdername, cardId],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //insert a identity for a single user
  addIdentityPass(
    user,
    username,
    ifirstname,
    imiddlename = "",
    ilastname,
    iname,
    iemail,
    iphone,
    issn,
    ipassport,
    ilicense,
    iaddress1,
    iaddress2 = "",
    iaddress3 = "",
    icity,
    istate,
    icountry,
    izip,
    notes = ""
  ) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "INSERT INTO `Identity`(`user`, `username`, `ifirstname`, `imiddlename`, `ilastname`, `iname`, `iemail`, `iphone`, `issn`, `ipassport`, `ilicense`, `iaddress1`, `iaddress2`, `iaddress3`, `icity`, `istate`, `icountry`, `izip`, `notes`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        connection.query(
          query,
          [
            user,
            username,
            ifirstname,
            imiddlename,
            ilastname,
            iname,
            iemail,
            iphone,
            issn,
            ipassport,
            ilicense,
            iaddress1,
            iaddress2,
            iaddress3,
            icity,
            istate,
            icountry,
            izip,
            notes,
          ],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //get all identities for a single user
  getAllIdentityPass(user) {
    try {
      const response = new Promise((resolve, reject) => {
        const query = "SELECT * FROM `Identity` WHERE user=?";
        connection.query(query, [user], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //get a single identity pass for a user
  getIdentityPass(user, username, iname) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM `Identity` WHERE user=? AND username=? AND iname=?";
        connection.query(query, [user, username, iname], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
  //Update identity info
  updateIdentityPass(
    ifirstname,
    imiddlename = "",
    ilastname,
    iemail,
    iphone,
    issn,
    ipassport,
    ilicense,
    iaddress1,
    iaddress2 = "",
    iaddress3 = "",
    icity,
    istate,
    icountry,
    izip,
    notes = "",
    user,
    username,
    iname
  ) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "UPDATE `Identity` SET `ifirstname`=?,`imiddlename`=?,`ilastname`=?,`iemail`=?,`iphone`=?,`issn`=?,`ipassport`=?,`ilicense`=?,`iaddress1`=?,`iaddress2`=?,`iaddress3`=?,`icity`=?,`istate`=?, `icountry`=?,`izip`=?,`notes`=? WHERE user=? AND username=? AND iname=?";
        connection.query(
          query,
          [
            ifirstname,
            imiddlename,
            ilastname,
            iemail,
            iphone,
            issn,
            ipassport,
            ilicense,
            iaddress1,
            iaddress2,
            iaddress3,
            icity,
            istate,
            icountry,
            izip,
            notes,
            user,
            username,
            iname,
          ],
          (err, result) => {
            if (err) {
              reject(new Error(err.message));
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  //delete a single identity for a single user
  deleteIdentityPass(user, username, iname) {
    try {
      const response = new Promise((resolve, reject) => {
        const query =
          "DELETE FROM `Identity` WHERE user=? AND username=? AND iname=?";
        connection.query(query, [user, username, iname], (err, result) => {
          if (err) {
            reject(new Error(err.message));
          } else {
            resolve(result);
          }
        });
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = DatabaseManager;
