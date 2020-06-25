import { ChangeDetectorRef, Component, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { RecordsService } from './app.service';
import { confirmDialog } from './dialog-confirm/dialog-confirm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mobileQuery: MediaQueryList;
  title;
  public counter: number = 0;
  errorMessage : any;
  private _mobileQueryListener: () => void;
  @ViewChild('snav') snav: MatSidenav;

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    private _records: RecordsService,
    private titleHTML: Title,
    public confirmDialog: MatDialog,
    private _router: Router,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.title = this._records.title + ' ' + this._records.previewSite;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }  

  logout(): void {
    if (this.snav.opened) { 
      this.snav.toggle()
    }  
    this.titleHTML.setTitle(this._records.title);
    this._records.logout()
  }

  genSitemap(): void {
    const dialogRef = this.confirmDialog.open(confirmDialog, {
      data: { message: 'Do you want to generate sitemap.xml?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.open(this._records.previewSite + '/gensitemap', 'width=1200, height=900')
      }
    })
  }

}
