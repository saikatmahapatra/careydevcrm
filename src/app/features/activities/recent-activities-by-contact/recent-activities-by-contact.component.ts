import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { ActivityService } from '../service/activity.service';
import { Activity } from '../models/activity';
import { DateService } from '../../../services/date.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-activities-by-contact',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './recent-activities-by-contact.component.html',
  styleUrls: ['./recent-activities-by-contact.component.css']
})
export class RecentActivitiesByContactComponent implements OnInit {
  
  @Input() contactId: string;
  activities: Activity[];
  loading: boolean = true;
  errorLoading: boolean = false;

  constructor(private activityService: ActivityService, private router: Router,
    private dateService: DateService) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  private loadActivities() {
    this.activityService.fetchRecentActivitiesByContactId(this.contactId).subscribe(
      (activities: Activity[]) => this.handleFetchActivitiesResponse(activities),
      err => this.handleFetchActivitiesError(err)
    );
  }

  private handleFetchActivitiesResponse(activities: Activity[]) {
    this.activities = activities;
    this.loading = false;
  }

  private handleFetchActivitiesError(err: Error) {
    console.error(err);
    this.loading = false;
    this.errorLoading = true;
  }

  editActivity(activityId: string) {
    let route = '/activities/edit-activity';
    this.router.navigate([route], { queryParams: { activityId: activityId } });
  }
}
