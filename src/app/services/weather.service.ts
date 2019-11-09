import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  public getWeather(latitude, longitude, appId: string, appCode: string) {
    return this.http.jsonp("https://weather.cit.api.here.com/weather/1.0/report.json?product=observation&latitude=" + latitude + "&longitude=" + longitude + "&oneobservation=true&app_id=" + appId + "&app_code=" + appCode, "jsonpCallback")
        .pipe(map(result => (<any>result).observations.location[0]));
  }
}
