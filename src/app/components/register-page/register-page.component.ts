import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

  constructor(
    private accountService: AccountService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  submit(): void {
    this.accountService.addAccount(this.account)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }

  @Input() account: Account;

}
