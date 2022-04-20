const api = { 
    key: '36d482a7a9c845e73c6ca8ab30a7eae0',
    base: 'https://api.openweathermap.org/data/2.5/weather?',
    end: '&units=metric&APPID='

  }

  const geo = {
    key: api.key,
    base: 'http://api.openweathermap.org/geo/1.0/direct?q=',
    end: '&limit=3&appid='
  }
  
  const apiRap = {
    base: 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=rapworld&q=&facet=categories&facet=bio_yearsactivestart&facet=bio_birthdate&facet=bio_yearsactiveend&facet=bio_deathdate&facet=location_city&facet=location_neighborhood&geofilter.distance=+',
    end: '&facet=location_city&facet=location_neighborhood&facet=name&refine.location_city='
  }

  
//Function that sets the lat and lon based on query results
//to fetch data from weather api
function weatherFunction(lat, lon){
  var weatherUrl = api.base + "&lat=" + lat + "&lon=" + lon + api.end + api.key
  console.log(weatherUrl)
  cityweather.url = sys.url = temperature.url = coords.url = weatherUrl
  cityweather.fetch({
      success: function(){
      console.log("WEATHER fetched")     
      } 
    });
    temperature.fetch({
      success: function(){
        console.log("temp fetched")
      } 
    });
    sys.fetch({
      success: function(){
        console.log("sys fetched")
      } 
    });
    coords.fetch({
      success: function(){
        console.log("coords fetched")
      } 
    });
}

//Weather Models Defined and Parsed Accordingly.
// URLS left blank to be defined when called into action.

var  CityWeather = Backbone.Model.extend({
initialize: function(){
  console.log("mainweather init")
}
});
var  Temperature = Backbone.Model.extend({
  initialize: function(){
    console.log("temp init")
  },
  parse: function(data) {
    return data.main ;
  }
  });
  var  Sys = Backbone.Model.extend({
    initialize: function(){
      console.log("sys init")
    },
    parse: function(response) {
      //unable to parse correctly. Output is attributes = single object with values rather than values injected directly into attributes.
      //I think because request times out since so many fetches are called. 
      return response.weather ;
    }
    });
    var  Coord = Backbone.Model.extend({
      initialize: function(){
        console.log("coord init")
      },
      parse: function(response) {
        return response.coord ;
      }
      });

//invoke models related to weather API
var cityweather = new CityWeather()
var temperature = new Temperature()
var sys = new Sys()
var coords = new Coord()

// Define city model and collection for search feature / query response
var  City = Backbone.Model.extend({
  defaults:{
  state: "nostate",
  }
})
var CityCollection = Backbone.Collection.extend({
      model: City,
    });

    // invoke them
var cities = new CityCollection()    
var city = new City()

//define view for searchbar
var SearchBox = Backbone.View.extend({  
  model: City,
  el: ".search-input",
  initialize:function(){
    //reset collection on start
    cities.reset()
           console.log("search")
  },
  //fire search function on keyup event
  events:{
     "keyup":"search"
  },
  search: function(q){
    cities.reset()
    //set input value to a query and inject into api address
    var q = document.getElementById("inp").value
    var geoRequest = geo.base + q + geo.end + api.key
    cities.url = geoRequest;
    cities.fetch({
        success: function(){
          //End up doing below commented code in the template further below called filter list

          // loop through models in collection and get attrbutes for each instance
          // for(var i = 0; i < cities.models.length; i++){
          //     console.log(cities.models[i].get("name") , 
          //     cities.models[i].get("state"), 
          //     cities.models[i].get("country"), 
          //     cities.models[i].get("lon"), 
          //     cities.models[i].get("lat"))
          // }
        }
    })
  }
});
//invoke search feature view
var inputBox = new SearchBox()

//define view for the display of the searchbox view's response
var FilterList = Backbone.View.extend({
el:".query-list",
 tagName: 'li',
 template: _.template(
   //if the models exist then output the names, states and countries
   //also add link to invoke weather function based on selcted cities geographical information(coordinates)
   '<% if (typeof(cities.models) !== "undefined") { %>' +
   '<% for(var i = 0; i < cities.models.length; i++){ %>' +
 '<li><a href="javascript:weatherFunction(<%= cities.models[i].get("lat") %>,<%= cities.models[i].get("lon") %>)"><%= cities.models[i].escape("name") %>' +
  ', ' + '<%= cities.models[i].escape("state") %>' +
   ', ' + '<%= cities.models[i].escape("country") %></a></li>' +
 '<% }} %>'),
  initialize: function() {
    this.listenTo(cities, "update", this.render);
  },
  render: function(){
    this.$el.html( this.template() )
  return this
  }

});
//invoke the filter list view apart of search feature
var list = new FilterList()

//Define view to display weather
var WeatherDisplay = Backbone.View.extend({
  el:".weather-display",
   template: _.template(
     '<% if (typeof(cityweather) !== "undefined") { %>' +
    '<h1>' + '<%= cityweather.escape("name") %>' + '</h1>' +
    '<h2>' + 'Temperature:' + '<%= temperature.escape("temp") %>' + '</h2>' +
    '<h3>' + 'Feels Like:' + '<%= temperature.escape("feels_like") %>' + '</h3>' +
    // '<h2>' + '<%= sys.attributes[0].main %>' + '</h2>' +
    // '<h3>' + '<%= sys.attributes[0].description %>' + '</h3>' +
   '<% } %>'),
    initialize: function() {
      this.listenTo(cityweather, "change", this.render);
    },
    render: function(){
      this.$el.html( this.template() )
    return this
    }
  
  });

  var weatherDisplay = new WeatherDisplay()





// function musicFunction(lat, lon){
//   var musicUrl = apiRap.base + coords.get("lat") + '%2C' + '+' + coords.get("lon") + '%2C+10000'
//   console.log(musicUrl)
//   musicCollection.url = musicUrl
//   musicCollection.fetch({
//     success: function(){
//       console.log("music Fetched")
//     }
//   })

// }


//define artist model and collection
var  Artist = Backbone.Model.extend({
  collection: MusicCollection,
  defaults:{
    name: "none",
    },
  parse: function(data){
    return data.fields
  }

})
var  MusicCollection = Backbone.Collection.extend({
model: Artist,
parse: function(data){
  return data.records
}
})
//INVOKE!!
var artist = new Artist()
var musicCollection = new MusicCollection();

// var MusicDisplay = new Backbone.View.extend({
//   el:".rapper",
//    template: _.template(
//      '<% if (typeof(musicCollection) !== "undefined") { %>' +
//     '<h1>' + '<%- musicCollection.models[0].escape("name") %>' + '</h1>' +
//    '<% } %>'),
//     initialize: function() {
//       this.listenTo(musicCollection, "update", this.render);
//     },
//     render: function(){
//       this.$el.html( this.template() )
//     return this
//     }
  
//   });


//define the view to display music artist (currently rapper) based on latest weather query

  var MusicDisplay = Backbone.View.extend({  
    model: City,
    el: ".rapper",
    template: _.template(
      '<% if (typeof(musicCollection) !== "undefined") { %>' +
     '<h1>' + '<%- musicCollection.models[0].escape("name") %>' + '</h1>' +
    '<% } %>'),
     initialize: function() {
       //listen for collection update and re render. not update only works on collections, change is for models.
       this.listenTo(musicCollection, "update", this.render);
     },
     render: function(){
       this.$el.html( this.template() )
     return this
     },
    events:{
       "click":"getrapper"
    },
    getrapper: function(q){
      musicCollection.reset()
      var musicUrl = apiRap.base + coords.get("lat") + '%2C' + '+' + coords.get("lon") + '%2C+10000'
      console.log(musicUrl)
      musicCollection.url = musicUrl
      musicCollection.fetch({
        success: function(){
          console.log("music Fetched")
        }
      })
    }
  });
  
  var musicDisplay = new MusicDisplay()


// var weatherJSONURL = api.base + "&lat=" + cities.models[0].get("lat") + "&lon=" + cities.models[0].get("lon") + api.end + api.key


// $( "#input" ).on("keyup", (e) => console.log(e))












 
 

