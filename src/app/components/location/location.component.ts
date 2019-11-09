import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {

  public lat;
  public lng;

  private appId: string;
  private appCode: string;

  public weather: any;
  public weatherIcon: string;
  public sunnyWeather = [1, 2, 3, 4, 5, 8, 30];
  public cloudyWeather = [12, 13, 16, 17, 18, 19, 26, 31, 32];
  public foggyWeather = [6, 20, 21, 22, 23, 24, 25, 33, 34];
  public partiallyCloudyWeather = [7, 9, 10, 11, 14, 15, 27, 28, 29];

  public temperatureOption = "fahrenheit";
  showTemperatureOptions = false;
  
  constructor(private http: HttpClient,
              private weatherService: WeatherService) {
    this.appId = "QiMIecbwLyeYQ1gq3II6";
    this.appCode = "Ro1G3902MJpE2hzm_z5Lhg";
    this.weather = [];
  }

  ngOnInit() {
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log("Latitude: " + this.lat);
          console.log("Longitude: " + this.lng);
          this.getWeather(position.coords);
        }
      },
        (error: PositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  public getWeather(coordinates: any) {
    this.http.jsonp("https://weather.cit.api.here.com/weather/1.0/report.json?product=observation&latitude=" + coordinates.latitude + "&longitude=" + coordinates.longitude + "&oneobservation=true&app_id=" + this.appId + "&app_code=" + this.appCode, "jsonpCallback")
        .pipe(map(result => (<any>result).observations.location[0]))
        .subscribe(result => {
            this.weather = result.observation;
            this.weatherIcon = "assets/img/Cloudy.png"
        }, error => {
            console.error(error);
        });
  }

  private updateShow(val){
    if(val=== 'temperature'){
      this.showTemperatureOptions = !this.showTemperatureOptions;
    }
  }
  private temperatureChoice(val: string){
    this.temperatureOption = val;
  }

}
