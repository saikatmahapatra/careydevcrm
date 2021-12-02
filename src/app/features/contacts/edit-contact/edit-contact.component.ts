import { Component, OnInit } from '@angular/core';
import { linesOfBusiness } from '../constants/line-of-business';
import { contactStatuses } from '../constants/contact-status';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Contact } from '../models/contact';
import { switchMap } from 'rxjs/operators';
import { AlertService } from 'carey-alert';
import { HttpErrorResponse } from '@angular/common/http';
import { BreadcrumbService } from '../../../ui/breadcrumb/breadcrumb.service';
import { DisplayValueMap } from '../../../models/name-value-map';
import { DisplayValueMapService } from '../../ui/service/display-map.service';
import { ContactService } from '../services/contact.service';
import { sources } from '../../../models/source';
import { addressTypes } from '../../../models/address-type';
import { phoneTypes } from '../../../models/phone-type';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {

  availableAddressTypes: DisplayValueMap[] = addressTypes;
  availablePhoneTypes: DisplayValueMap[] = phoneTypes;
  availableLobTypes: DisplayValueMap[] = linesOfBusiness;
  availableContactStatuses: DisplayValueMap[] = contactStatuses;
  availableSources: DisplayValueMap[] = sources;


  loading: boolean = true;
  contact: Contact = {} as Contact;

  constructor(private route: ActivatedRoute, private contactService: ContactService,
    private alertService: AlertService, private displayValueMapService: DisplayValueMapService,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    let contact$ = this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) =>
        this.contactService.fetchById(params.get('id')))
    );

    contact$.subscribe(
      (contact: Contact) => this.handleResponse(contact),
      err => this.handleError(err)
    );
  }

  private handleResponse(contact: Contact) {
    this.contact = contact;
    this.loading = false;
    this.breadcrumbService.updateBreadcrumb("Edit " + this.contact.firstName + " " + this.contact.lastName);
  }

  private handleError(err: Error) {
    console.log(err);
    this.loading = false;

    let alertMessage: string = 'Something went wrong, please call support';

    if (err instanceof HttpErrorResponse) {
      if (err.status) {
        if (err.status == 404) {
          alertMessage = 'Contact with that ID does not exist';
        }
      }
    }

    this.alertService.error(alertMessage);
  }
}
