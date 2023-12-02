const express = require("express");
const app = express();
const PORT = 5000;
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const { url } = require("inspector");
const aes256 = require("aes256");

//USE THE DATABASE MANAGER
const dbm = require("./databaseManager").getDatabaseManagerInstance();

const whitelist = new Set([
  "chrome-extension://mebfleiokpaacbokoibeokdifjbbeima",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
]);

const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: function (origin, callback) {
    if (whitelist.has(origin) || origin == undefined) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Create session and cookies
app.use(cookieParser("password-vault-server"));
app.use(
  session({
    secret: "password-vault-server",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 20, // 20 minutes
      sameSite: "none",
      secure: true,
    },
  })
);

//--------------Routes----------------

//Server Checking Route
app.get("/", (req, res) => {
  res.send("Password Vault Server Running");
});
//End Server Checking Route

//Add User
app.post("/api/user/register", (req, res) => {
  const input = req.body;

  email = input.email;
  firstname = input.firstname;
  lastname = input.lastname;
  password = aes256.encrypt(input.password, input.password);
  if (email && firstname && lastname && password) {
    const result = dbm.registerUser(email, firstname, lastname, password);
    result
      .then((output) => {
        res.status(200).json("New User Added");
      })
      .catch((err) => {
        res.status(400).json("User already exist");
      });
  } else {
    res
      .status(400)
      .json("Should add to request body: email, firstName, lastName, password");
  }
});
//End Add User

//Login User
app.post("/api/user/login", (req, res) => {
  const input = req.body;
  const valid = input.email && input.password;
  if (valid) {
    const result = dbm.getUser(input.email);
    result
      .then((output) => {
        if ((output.length = 1)) {
          const user = output[0];

          if (aes256.decrypt(input.password, user.password) == input.password) {
            if (req.session.email) {
              res.json("User Already Logged in");
            } else {
              req.session.email = user.email;
              var message = " logged in successfully";
              const sessId = req.session.id;
              res
                .status(200)
                .json(user.firstname + " " + user.lastname + message);
            }
          } else {
            res.status(400).json("Wrong Password");
          }
        }
        return;
      })
      .catch(() => res.status(400).json("User not Registered"));
  } else {
    res.status(400).json("Email and/or Password missing");
  }
});
//End Login User

//Logout User
app.post("/api/user/logout", (req, res) => {
  if (req.session.email) {
    req.session.destroy();
    res.status(200).json("Logged out successfully");
  } else {
    res.status(400).json("No user logged in");
  }
});
//End logout

//Get the User Information
app.get("/api/user", (req, res) => {
  if (req.session.email) {
    console.log("session present");
    let result = dbm.getUser(req.session.email);
    result
      .then((output) => {
        let user = output[0];
        console.log(user);
        let response;
        response = {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        };
        res.json(response);
      })
      .catch((err) => console.log(err));
  } else {
    res.status(401).json("No user found");
  }
});
//End get user information

//delte the User Information
app.delete("/api/user", (req, res) => {
  if (req.session.email) {
    let result = dbm.deleteUser(req.session.email);
    result
      .then((output) => {
        req.session.destroy();
        res.status(200).json("Deleted Successfully");
      })
      .catch((err) => console.log(err));
  } else {
    res.status(401).json("No user found");
  }
});
//End delete user information

//update the Username
app.put("/api/user", (req, res) => {
  if (req.session.email) {
    let result = dbm.changeUserEmail(req.body.email, req.session.email);
    result
      .then((output) => {
        req.session.email = req.body.email;
        res.status(200).json("Changed Username Successfully");
      })
      .catch((err) => console.log(err));
  } else {
    res.status(401).json("No user found");
  }
});
//End update username

//Add Website Password
app.post("/api/user/webpassword", (req, res) => {
  if (req.session.email) {
    let data = req.body;
    console.log(data);
    const valid = data.username && data.url && data.pass;
    data.note = data.note || "";

    if (valid) {
      const result = dbm.addWebPass(
        req.session.email,
        data.username,
        data.url,
        aes256.encrypt(data.username, data.pass),
        data.note
      );
      result
        .then((output) => {
          res.json("New Password Added");
        })
        .catch((err) => {
          res.status(400).json("Password already exists");
        });
    } else {
      res.status(400).json("Should add user, username, url, password, note");
    }
  } else {
    res.status(400).json("You should be signed in");
  }
});
//End Add Web Password

//Get All Website Passwords for a User
app.get("/api/user/webpassword", (req, res) => {
  if (req.session.email) {
    const result = dbm.getAllWebPass(req.session.email);
    result
      .then((output) => {
        const passwords = output.map((item) => {
          return {
            ...item,
            pass: aes256.decrypt(item.username, item.pass),
          };
        });
        res.status(200).json({ data: passwords });
      })
      .catch(() =>
        res.status(400).json("There are no passwords for this User")
      );
  } else {
    res.status(400).json("A user should be logged in");
  }
});
//End Get All Website Passwords for User

//Edit a single password for a single user
app.put("/api/user/webpassword", (req, res) => {
  if (req.session.email) {
    username1 = req.body.username;
    url1 = req.body.url;
    const getPass = dbm.getWebPass(req.session.email, username1, url1);
    getPass
      .then((output) => {
        let oldPass = output[0];
        username = oldPass.username;
        editUrl = oldPass.url;
        password = req.body.pass;
        note = req.body.note || "";
        const result = dbm.updateWebPass(
          aes256.encrypt(username, password),
          note,
          req.session.email,
          username,
          editUrl
        );
        result
          .then(() => {
            res.status(200).json("Password Upated Successfully");
          })
          .catch(() => res.status(400).json("Something went wrong"));
      })
      .catch(() => res.status(404).json("Password not found"));
  } else {
    res
      .status(400)
      .json("You should login first in order to update a password");
  }
});
//End Editing a single password

//Delete a password for a single user
app.delete("/api/user/webpassword", (req, res) => {
  if (req.session.email) {
    const data = req.query;
    const valid = data.username && data.url;
    if (valid) {
      const deletePass = dbm.deleteWebPass(
        req.session.email,
        data.username,
        data.url
      );
      deletePass
        .then((output) => {
          if (output.affectedRows > 0) {
            res.status(200).json("Password deleted successfully");
          } else {
            res.status(404).json("Can't find password to delete");
          }
        })
        .catch((err) => console.log(err));
    } else {
      res.status(400).json("Username or Url missing");
    }
  }
});
//End Delete Card for a single user

//Add Card Password
app.post("/api/user/card", (req, res) => {
  if (req.session.email) {
    let data = req.body;
    const valid =
      data.username &&
      data.cardnumber &&
      data.pin &&
      data.expirymonth &&
      data.expiryyear &&
      data.holdername &&
      data.cardtype;

    data.notes = data.notes || "";

    if (valid) {
      const result = dbm.addCardPass(
        req.session.email,
        data.username,
        aes256.encrypt(data.holdername, data.cardnumber),
        aes256.encrypt(data.holdername, data.pin),
        data.expirymonth,
        data.expiryyear,
        data.notes,
        data.holdername,
        data.cardtype
      );
      result
        .then((output) => {
          res.json("New Card Added");
        })
        .catch((err) => {
          res.status(400).json("Card already exists");
        });
    } else {
      res
        .status(400)
        .json(
          "Should add user, username, cardnumber, pin, expirymonth, expiryyear, notes, holdername, cardtype"
        );
    }
  } else {
    res.status(400).json("You should be signed in");
  }
});
//End Add Card Password

//Get All cards for a User
app.get("/api/user/card", (req, res) => {
  if (req.session.email) {
    const result = dbm.getAllCardPass(req.session.email);
    result
      .then((output) => {
        const cards = output.map((item) => {
          return {
            ...item,
            cardnumber: aes256.decrypt(item.holdername, item.cardnumber),
            pin: aes256.decrypt(item.holdername, item.pin),
          };
        });

        res.status(200).json({ data: cards });
      })
      .catch(() => res.status(400).json("There are no cards for this User"));
  } else {
    res.status(400).json("A user should be logged in");
  }
});
//End Get All cards for User

//Edit a single card for a single user
app.put("/api/user/card", (req, res) => {
  if (req.session.email) {
    username = req.body.username;
    holdername = req.body.holdername;
    cardnumber = req.body.cardnumber;
    const getCard = dbm.getCardPass(
      req.session.email,
      username,
      holdername,
      cardnumber
    );
    getCard
      .then((output) => {
        let oldCard = output[0];
        newusername = oldCard.username;
        newholdername = oldCard.holdername;
        newcardnumber = oldCard.cardnumber;
        pin = req.body.pin;
        expirymonth = req.body.expirymonth;
        expiryyear = req.body.expiryyear;
        notes = req.body.notes || "";
        cardtype = req.body.cardtype;
        const result = dbm.updateCardPass(
          aes256.encrypt(newusername, pin),
          expirymonth,
          expiryyear,
          notes,
          cardtype,
          req.session.email,
          newusername,
          newholdername,
          aes256.encrypt(newusername, newcardnumber)
        );
        result
          .then(() => {
            res.status(200).json("Card Upated Successfully");
          })
          .catch(() => res.status(400).json("Something went wrong"));
      })
      .catch(() => res.status(404).json("Card not found"));
  } else {
    res.status(400).json("You should login first in order to update a Card");
  }
});
//End Editing a single card

//Delete a card for a single user
app.delete("/api/user/card", (req, res) => {
  if (req.session.email) {
    const data = req.query;

    const valid = data.username && data.holdername && data.cardId;

    if (valid) {
      const deleteCardPass = dbm.deleteCardPass(
        req.session.email,
        data.username,
        data.holdername,
        data.cardId
      );
      deleteCardPass
        .then((output) => {
          if (output.affectedRows > 0) {
            console.log(output.affectedRows);
            res.status(200).json("Card deleted successfully");
          } else {
            res.status(404).json("Can't find Card to delete");
          }
        })
        .catch((err) => console.log(err));
    } else {
      res.status(400).json("Username or Holdername or cardId missing");
    }
  } else {
    res.status(400).json("You should be logged in to delete Card");
  }
});
//End Delete Card for a single user

//Add Identity Password
app.post("/api/user/identity", (req, res) => {
  if (req.session.email) {
    let data = req.body;
    console.log(data);
    const valid =
      data.username &&
      data.ifirstname &&
      data.ilastname &&
      data.iname &&
      data.iemail &&
      data.iphone &&
      data.issn &&
      data.ipassport &&
      data.ilicense &&
      data.iaddress1 &&
      data.icity &&
      data.istate &&
      data.icountry &&
      data.izip;
    data.imiddlename = data.imiddlename || "";
    data.iaddress2 = data.address2 || "";
    data.iaddress3 = data.address3 || "";
    data.notes = data.notes || "";

    if (valid) {
      const result = dbm.addIdentityPass(
        req.session.email,
        data.username,
        data.ifirstname,
        data.imiddlename,
        data.ilastname,
        data.iname,
        data.iemail,
        data.iphone,
        aes256.encrypt(data.iname, data.issn),
        aes256.encrypt(data.iname, data.ipassport),
        aes256.encrypt(data.iname, data.ilicense),
        data.iaddress1,
        data.address2,
        data.address3,
        data.icity,
        data.istate,
        data.icountry,
        data.izip,
        data.notes
      );
      result
        .then((output) => {
          res.json("New Identity Added");
        })
        .catch((err) => {
          res.status(400).json("Identity already exists");
        });
    } else {
      res
        .status(400)
        .json(
          "Should add user, username, ifirstname, ilastname , iname, iemail, iphone, issn, ipassport, ilicense, icity, istate, icountry, izip"
        );
    }
  } else {
    res.status(400).json("You should be signed in");
  }
});
//End Add Identity Password

//Get All Identities for a User
app.get("/api/user/identity", (req, res) => {
  if (req.session.email) {
    const result = dbm.getAllIdentityPass(req.session.email);
    result
      .then((output) => {
        const identities = output.map((item) => {
          return {
            ...item,
            issn: aes256.decrypt(item.iname, item.issn),
            ipassport: aes256.decrypt(item.iname, item.ipassport),
            ilicense: aes256.decrypt(item.iname, item.ilicense),
          };
        });

        res.status(200).json({ data: identities });
      })
      .catch(() =>
        res.status(400).json("There are no Identities for this User")
      );
  } else {
    res.status(400).json("A user should be logged in");
  }
});
//End Get All identities for User

//Edit a single Identity for a single user
app.put("/api/user/identity", (req, res) => {
  if (req.session.email) {
    oldusername = req.body.username;
    oldiname = req.body.iname;

    const getIdentity = dbm.getIdentityPass(
      req.session.email,
      oldusername,
      oldiname
    );
    getIdentity
      .then((output) => {
        let oldIdentity = output[0];
        newusername = oldIdentity.username;
        newiname = oldIdentity.iname;

        ifirstname = req.body.ifirstname;
        ilastname = req.body.ilastname;
        iemail = req.body.iemail;
        iphone = req.body.iphone;
        issn = req.body.issn;
        ipassport = req.body.ipassport;
        ilicense = req.body.ilicense;
        iaddress1 = req.body.iaddress1;
        icity = req.body.icity;
        istate = req.body.istate;
        icountry = req.body.icountry;
        izip = req.body.izip;

        iaddress2 = req.body.iaddress2 || "";
        iaddress3 = req.body.iaddress3 || "";
        imiddlename = req.body.imiddlename || "";
        notes = req.body.notes || "";

        const result = dbm.updateIdentityPass(
          ifirstname,
          imiddlename,
          ilastname,
          iemail,
          iphone,
          aes256.encrypt(newiname, issn),
          aes256.encrypt(newiname, ipassport),
          aes256.encrypt(newiname, ilicense),
          iaddress1,
          iaddress2,
          iaddress3,
          icity,
          istate,
          icountry,
          izip,
          notes,
          req.session.email,
          newusername,
          newiname
        );
        result
          .then(() => {
            res.status(200).json("Identity Upated Successfully");
          })
          .catch((err) => res.status(400).json("Something went wrong"));
      })
      .catch(() => res.status(404).json("Identity not found"));
  } else {
    res
      .status(400)
      .json("You should login first in order to update a Identity");
  }
});
//End edit single identity for a single user

//Delete a card for a single user
app.delete("/api/user/identity", (req, res) => {
  if (req.session.email) {
    const data = req.query;
    const valid = data.username && data.iname;
    if (valid) {
      const deleteIdentity = dbm.deleteIdentityPass(
        req.session.email,
        data.username,
        data.iname
      );
      deleteIdentity
        .then((output) => {
          if (output.affectedRows > 0) {
            console.log(output.affectedRows);
            res.status(200).json("Card deleted successfully");
          } else {
            res.status(404).json("Can't find Card to delete");
          }
        })
        .catch((err) => console.log(err));
    } else {
      res.status(400).json("Username or Holdername or cardnumber missing");
    }
  } else {
    res.status(400).json("You should be logged in to delete Card");
  }
});
//End Delete Card for a single user

//Listener
app.listen(PORT, (req, res) => {
  console.log(`Listening on port ${PORT}`);
});
