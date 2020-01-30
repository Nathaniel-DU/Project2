var db = require("../models");
var axios = require("axios");
module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.render("index");
    });
  });

  // Create a new example
  app.get("/testdata/:name/:addr/:phone/:id", function (req, res) {
    console.log(`/api/testdata/:name/:addr/:phone = ${JSON.stringify(req.params)}`);
    db.SavedRestaurants.create({
      name: req.params.name,
      restaurantAddr: req.params.addr,
      restaurantPhone: req.params.phone,
      UserId: req.params.id
    }).then(function (result) {
      res.json(result);
    });
  });
  // NOT SURE IF WE NEED THIS. didn't want to delete
  // Load example page and pass in an example by id
  // app.get("/example/:id", function (req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function (dbExample) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });

  // Load Second Page
  // this will launch the second.handlebars page
  // app.get("/second/:name", function (req, res) {
  //   console.log(`In app.get(/second/:name), req.params.name = ${JSON.stringify(req.params.name)}`);
  //   res.render("second", {
  //     name: req.params.name
  //   });
  // });

  app.get("/second/:cell", function (req, res) {
    console.log(`In app.get(/second/:cell), req.params.cell = ${JSON.stringify(req.params.cell)}`);
    db.User.findOrCreate({
      where: {
        cell: req.params.cell
      },
      include: [db.SavedRestaurants]
    }).then(function (userData) {
      var returning_user = userData[0].name;

      console.log(`userData = ${JSON.stringify(userData)}`);
      var restaurant = [];
      var r = userData[0].SavedRestaurants;
      for(var i = 0; i < r.length; i++) {
        console.log(`restaurant name = ${JSON.stringify(userData[0].SavedRestaurants[i].name)}`);
        restaurant.push({name: userData[0].SavedRestaurants[i].name});
        console.log(`restaurant[${i}] = ${restaurant[i].name}`);
      }
      var uData = {
        name: userData[0].name,
        returning_user: returning_user,
        restaurant: restaurant
      };

      // if (userData[0].SavedRestaurants !== null) {
        // console.log(`restaurant1 = ${JSON.stringify(userData[0].SavedRestaurants[0].name)}`);
        // console.log(`restaurant2 = ${JSON.stringify(userData[0].SavedRestaurants[1].name)}`);
        // console.log(`restaurant3 = ${JSON.stringify(userData[0].SavedRestaurants[2].name)}`);
        console.log(`render second page with uData =  ${JSON.stringify(uData)} and returning_user = ${returning_user}`);
        res.render("second", uData);
      // } else {
        // console.log(`No saved restaurants for this user`);
        // res.render("second", {
        //   name: userData[0].name
        // });
      // }
    });
  });

  app.get("/second", function (req, res) {
    console.log(`In app.get(/second), req.body = ${JSON.stringify(req.body)}`);
    // res.render("second", {
    //   name: req.body.name,
    //   restaurants: req.body.SavedRestaurants
    // });
    res.render("second");
  });

  app.get("/restaurants", function (req, res) {
    console.log(`In app.get(/restaurants), req.body = ${JSON.stringify(req.body)}`);
    // res.render("results-modal", req.body);
  });

  // Takes in top 5 restaurants and passes to recommendation modal
  app.get("/topfive", function (req, res) {
    console.log(`In app.get(/topfive), req.body = ${JSON.stringify(req.body)}`);
    res.render("results-modal", req.body);
  });

  // Load survey page
  // Added by KB. This will launch the Survey Handlebars page
  // app.get("/survey/:location", function (req, res) {
  app.get("/survey", function (req, res) {
    //MOVE THIS TO HTML FROM API
    // MapDataApi call (req.body.loc)
    // var search = "80919";
    // var url = "https://nominatim.openstreetmap.org/?format=json&limit=1&addressdetails=1&countrycodes=US&q=";
    // var queryTerm = '';
    // for (let i = 0; i < search.length; i++) {
    //   if (search[i] === ' ') {
    //     queryTerm += '+';
    //   } else {
    //     queryTerm += search[i].toLowerCase();
    //   }
    // }

    // // Call the Open Street Maps API for location then call the TripAdvisor API passing in the
    // // lat/lon from the Open Street Maps results

    // // Open Street Maps call
    // axios.get(url + queryTerm).then(function (response) {
    //   // console.log(`OSM: axios response = ${JSON.stringify(response.data, null, 3)}`);
    //   var lat = response.data[0].lat;
    //   var lon = response.data[0].lon;

    //   // Trip Advisor call
    //   const options = {
    //     headers: {
    //       "x-rapidapi-host": "tripadvisor1.p.rapidapi.com",
    //       "x-rapidapi-key": "2c641ac47amshde4fb7d34f243e5p1ea1dajsn860dafbf04af"
    //     }
    //   };
    //   var url = "https://tripadvisor1.p.rapidapi.com/restaurants/list-by-latlng?limit=3&currency=USD&distance=2&lunit=km&combined_food=" + req.body.scores + "&lang=en_US&latitude=" + lat + "&longitude=" + lon;
    //   console.log(`TripAdvisor url = ${url}`);
    //   axios.get(url, options).then(function (response) {
    // console.log(`TA: axios response = ${JSON.stringify(response.data.data, null, 3)}`);
    // res.render("surveyUsingSurveyJS", { restaurant: response.data.data });
    res.render("surveyUsingSurveyJS");
    //   }).catch(function (error) {
    //     if (error.response) {
    //       // The request was made and the server responded with a status code
    //       // that falls out of the range of 2xx
    //       console.log(error.response.data);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     } else if (error.request) {
    //       // The request was made but no response was received
    //       // `error.request` is an object that comes back with details pertaining to the error that occurred.
    //       console.log(error.request);
    //     } else {
    //       // Something happened in setting up the request that triggered an Error
    //       console.log("Error", error.message);
    //     }
    //     console.log(error.config);
    //   });
    //   //END OF MOVED CODE

    // }).catch(function (error) {
    //   if (error.response) {
    //     // The request was made and the server responded with a status code
    //     // that falls out of the range of 2xx
    //     console.log(error.response.data);
    //     console.log(error.response.status);
    //     console.log(error.response.headers);
    //   } else if (error.request) {
    //     // The request was made but no response was received
    //     // `error.request` is an object that comes back with details pertaining to the error that occurred.
    //     console.log(error.request);
    //   } else {
    //     // Something happened in setting up the request that triggered an Error
    //     console.log("Error", error.message);
    //   }
    //   console.log(error.config);
    // });



    // res.render("surveyUsingSurveyJS", {
    //   location: req.params.location
    // });
  });

  // KB Sequelize Testing
  app.get("/api/tables/:table", function (req, res) {

    console.log(`htmlRoutes.js: req.params.table = ${req.params.table}`);
    switch (req.params.table) {
      case "users":
        db.User.findAll({}).then(function (data) {
          res.json(data);
        });
        break;

      case "restaurants":
        db.Restaurant.findAll({}).then(function (data) {
          res.json(data);
        });
        break;

      case "posts":
        db.Post.findAll({}).then(function (data) {
          res.json(data);
        });
        break;

      default:
        res.json({ status: "404" });
    }
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
