const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
const ejs=require("ejs");

const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("index", {cityName:null, temperature:null, description:null, iconImage:null, execute:"false"});
});

app.post("/", function (req, res){

  const inputCityName=req.body.cityName;
  weatherInterface(inputCityName, res);

});

app.listen(process.env.PORT || 3000, function (){
  console.log("Server is running on port 3000");
});


function weatherInterface(inputCityName, res){

  const url="https://api.openweathermap.org/data/2.5/weather?q="+inputCityName+"&units=metric&appid=1f9fd4d7f9d4dc25eab1b94ebd5c033c";

  https.get(url, function (response){  //This is use for get data from someones server.
    console.log(response.statusCode);  //status code=200, that means url is ok.

      response.on("data", function (data){
        // console.log(data); //gives hexadecimal values of api
        const weatherData=JSON.parse(data);  //convert the hexadecimal values to jason format
        console.log(weatherData);

        const temp=weatherData.main.temp;   //get jason path (in this case temp)
        const description=weatherData.weather[0].description; //get jason path (in this case weather's description)

        const icon=weatherData.weather[0].icon;
        const iconImageUrl="https://openweathermap.org/img/wn/"+ icon +"@2x.png";

        res.render("index", {cityName:inputCityName, temperature:temp, description:description, iconImage:iconImageUrl, execute:"true"});

    });

  });

}
