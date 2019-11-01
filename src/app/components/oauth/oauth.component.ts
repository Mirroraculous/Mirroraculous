import { Component, OnInit } from '@angular/core';
import { OauthService } from '../../services/oauth.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html'
})

export class OauthComponent implements OnInit {
  oauthLink;

  constructor(
    private link: OauthService,
  ) {}

  ngOnInit() {
    this.link.getLink().subscribe(
      val => {
        this.oauthLink = val.body;
      }
    );
  }
}