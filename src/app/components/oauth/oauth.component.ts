import { Component, OnInit } from '@angular/core';
import { OauthService } from '../../services/oauth.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.scss']

})

export class OauthComponent implements OnInit {
  oauthLink;

  constructor(
    private link: OauthService,
  ) {}
  linkTo(url) {
    window.open(url, "_blank");
  }
  ngOnInit() {
    this.link.getLink().subscribe(
      val => {
        this.oauthLink = val.body;
      }
    );
  }
}