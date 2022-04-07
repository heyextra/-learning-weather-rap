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
    base: 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=rapworld&q=',
    end: '&facet=location_city&facet=location_neighborhood&facet=name&refine.location_city='
  }


function search(q){
  var q = document.getElementById("input").value
  if(q){
  var loc = q

  var geoJSONURL = geo.base + loc + geo.end + api.key

  var  City = Backbone.Model.extend({
  // Add defaults for lat lon etc...????
  })

  var CityCollection = Backbone.Collection.extend({
    model: City,
    url: geoJSONURL
  });


var  GetLocation = Backbone.Model.extend({
  // Add defaults for lat lon etc...????
  defaults: {
    id: "cit",
    name: "",
    lat: "",
    lon: "",
    state: "",
    country: ""
  }
  })
  
var cities = new CityCollection();

cities.fetch({
  success: function(){
  var location =  new GetLocation({
name: cities.models[0].get("name"),
lat: cities.models[0].get("lat"),
lon: cities.models[0].get("lon"),
state: cities.models[0].get("state"),
country: cities.models[0].get("country")
    })

  var weatherJSONURL = api.base + "&lat=" + location.get("lat") + "&lon=" + location.get("lon") + api.end + api.key
console.log(weatherJSONURL)

var  Weather = Backbone.Model.extend({
      
  })

 
  var WeatherCollection = Backbone.Collection.extend({
    model: Weather,
    url: weatherJSONURL
  });
  var result = new WeatherCollection()

result.fetch({
  success: function(){
    console.log(result.models[0].get("main") , result.models[0].get("weather"))
  }
})

    // console.log(cities.models[0].get("lon") , cities.models[0].get("lat"), cities.models[0].get("name")  , cities.models[0].get("state") , cities.models[0].get("country"));
 
  }
});

  }else{
    return console.log("nada")
  }

}




// var loc = "oakland"




//   var geoJSONURL = geo.base + loc + geo.end + api.key

//   var  City = Backbone.Model.extend({
//   // Add defaults for lat lon etc...????
//   })

  // var CityCollection = Backbone.Collection.extend({
  //   model: City,
  //   url: geoJSONURL
  // });

// var cities = new CityCollection();

// cities.fetch({
//   success: function(){
//       console.log(cities.models[0].get("lon") , cities.models[0].get("lat"), cities.models[0].get("name")  , cities.models[0].get("state") , cities.models[0].get("country"));
//   }
// });




 
 

