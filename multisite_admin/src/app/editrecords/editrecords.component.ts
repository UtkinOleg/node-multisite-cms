import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { format } from 'date-fns';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { RecordsService } from './../app.service';
import { confirmDialog } from '../dialog-confirm/dialog-confirm';
import { Param, Options, Document } from '../app.classes';

@Component({
  selector: 'app-editrecords',
  templateUrl: './editrecords.component.html',
  styleUrls: ['./editrecords.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]  
})
export class EditrecordsComponent implements OnInit {
  dataSource = new MatTableDataSource([]); // Document data
  columnsToDisplay = ['name', 'api', 'date', 'date2', 'edit', 'copy', 'preview', 'published', 'delete'];
  expandedElement: any | null;
  selectedElement: any | null;
  errorMessage: string;
  openEditor: boolean = false; // Flag for indicating opened document editor
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  options: Options = new Options(); // Object for site options
  document: Document = new Document(); // Current document object
  urlResponse: any | null;
  form: FormGroup;
  formOptions: FormGroup;
  formContent: any[];
  formQuestionsContent: any[];
  formQuestionsContentItems: any[];
  formQuestionsOptions: any[];
  formQuestionsOptionsItems: any[];
  config: any = { // HTML Editor config 
    height: '300px'
  };  
  params: Param[];
  breadcrumbs: Param[];
  firstURL: string;
  firstURLParams: Param[];
  firstURLHeaderParams: Param[];
  secondURL: string;
  secondURLParams: Param[];
  secondURLHeaderParams: Param[];
  paramUrlValue = new FormControl();
  headerParameter = new FormControl();
  headerParamValue = new FormControl();
  showMore: boolean = false;
  sub: any;
  type: string; // Set current type of content (default is page)
  newDocument: boolean = false; // Indicate new document status
  showProgress: boolean = false; // Indicate show progress bar
  selectable: boolean = true;
  filterValue: string;
  selectedZone: number;
  selectedPage: any;
  
  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.form.get('html').value);
  }

  constructor(private _router: Router, 
    public titleHTML: Title,
    public snackBar: MatSnackBar, 
    public _records: RecordsService,
    public urlDialog: MatDialog,
    public confirmDialog: MatDialog,
    public route: ActivatedRoute,
    public sanitizer: DomSanitizer) { 
      this.form = new FormGroup({
        html: new FormControl()
      })
      this.formOptions = new FormGroup({
        header: new FormControl(),
        footer: new FormControl(),
        main_header: new FormControl(),
        main_footer: new FormControl()
      })
    }

  ngOnInit() {
    this.initApp()
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initApp() : void {
    // Check current content type from URL
    this.sub = this.route.params.subscribe(params => {
      this.type = params['type'];
      // Switch open editor to false
      this.openEditor = false;
      // Set CMS title
      this.titleHTML.setTitle(this._records.title + ' - ' + this.type);
      // Load site data
      this.reloadData()
    })
  }  

  // Show message through SnackBar
  openSnackBar(arr: any, param?: string) {
    let message = arr[0] + (param ? param : '') + arr[1];
    this.snackBar.open(message, '', {
      duration: 2000
    });
  }

  // Get current content color
  // If no breadcrumbs set accent color
  getColor(element: Document): string {
    return element.content.breadcrumbs.length === 0 ? 'accent' : 'primary'
  }

  // Create new content
  addDocument() {
    // Switch mode
    this.newDocument = true;
    this.openEditor = true;
    // Create new doc object
    this.document = new Document();
    // Clear form content
    this.formContent = [];
    this.formQuestionsContent = [];
    this.formQuestionsContentItems = [];
    // Set default content HTML
    this.form.get('html').setValue(this.document.content.text);
  }

  // Load site data
  reloadData() {
    // Show progress
    this.showProgress = true;
    this.dataSource = new MatTableDataSource([]);
    // Get docs from API
    this._records.getDocuments(this.type).subscribe(
      data => {
        // Fill source array
        data.map(d => {
          d.dateC = format(new Date(d.date_create), 'dd-MM-yyyy HH:mm'); 
          d.dateM = d.date_modify ? format(new Date(d.date_modify), 'dd-MM-yyyy HH:mm') : ''; 
          this.dataSource.data.push(d) 
        });
        this.dataSource.sort = this.sort;
        this.urlResponse = null;
        this.showProgress = false;
        this.setFilter()
      },
      error =>  {
        this.showProgress = false;
        this.snackBar.open('Connection error. Can not load site data.', '', {
          duration: 2000,
        });
        this.errorMessage = <any>error
      });
      // Get options from API
      this._records.getOptions(this.type).subscribe(
        data => {
          data.map(d => {
            d.dateM = d.date_modify ? format(new Date(d.date_modify), 'dd-MM-yyyy HH:mm') : ''; 
            this.options = d;
            this.formOptions.get('header').setValue(this.options.content.header);
            this.formOptions.get('footer').setValue(this.options.content.footer);
            this.formOptions.get('main_header').setValue(this.options.content.main_header);
            this.formOptions.get('main_footer').setValue(this.options.content.main_footer);
        })
      },
      error =>  {
        this.showProgress = false;
        this.snackBar.open('Connection error', '', {
          duration: 2000,
        });
        this.errorMessage = <any>error
      });
  
  }

  // Preview document
  previewDoc(element: Document) {
    window.open(this._records.previewSite + '/' + this.type + '/' + element.url + '?preview=true', element.name, 'width=1200, height=900')
  }

  // Preview site
  previewSite() {
    window.open(this._records.previewSite, this._records.previewSite, 'width=1200, height=900')
  }

  // Get item string
  getItem(items: any[]): string {
    return items.length>0 ? items[0] + '...' : '<empty>'
  }

  // Edit document
  editDoc(element: Document): void {
    // Switch mode on
    this.showProgress = true;
    this.openEditor = true;
    this.newDocument = false;
    // Clear form content
    this.formContent = [];
    this.formQuestionsContent = [];
    this.formQuestionsContentItems = [];
    // Set current document
    this.document = element;
    // Set HTML content from doc
    this.form.get('html').setValue(this.document.content.text);
    // Set internal document content
    if (this.document.content.content) {
      this.document.content.content.forEach(element => {
        this.formContent.push(new FormGroup({
          html: new FormControl()
        }));
        if (element.name === 'text' || element.name === 'right_img' || element.name === 'indent' || element.name === 'sub_title') {
          this.formContent[this.formContent.length-1].get('html').setValue(element.text)
        }
      })
    } else {
      this.document.content.content = []
    }
    // Hide progress bar
    this.showProgress = false;
  }

  // Add new parameter
  addParam(n: any, v: any, params: Param[]): void {
    params.push({
      name: n.value,
      value: v.value
    })
  }

  // Add new content
  addContent(n: any, params: any[]): void {
    // Create form control
    this.formContent.push(new FormGroup({
      html: new FormControl()
    }));
    // Set value
    this.formContent[this.formContent.length-1].get('html').setValue('');
    // Set parameter
    params.push({
      name: n.value,
      text: '',
      items: []
    })
  }

  // Add new item
  addItem(n: any, params: any[]) {
    params.push(n.value)
  }

  // Remove parameter from Param[]
  remove(param: Param, params: Param[]): void {
    const index = params.indexOf(param);
    if (index >= 0) {
      params.splice(index, 1);
    }
  }

  // Delete document content
  delContent(index: number) {
    // Prepare dialog
    const dialogRef = this.confirmDialog.open(confirmDialog, {
      data: { message: 'Are you really want to delete content?' }
    });
    // Confirm Yes
    dialogRef.afterClosed().subscribe(result => {
      if (index >= 0 && result) {
        this.document.content.content.splice(index, 1);
        this.formContent.splice(index, 1);
      }
    })
  } 

  // Up content inside document
  upContent(index: number) {
    if (index>0) {
      this.arrayMove(this.document.content.content, index, index-1);
      this.arrayMove(this.formContent, index, index-1);
    }
  } 

  // Down content inside document
  downContent(index: number) {
    if (index < this.document.content.content.length-1) {
      this.arrayMove(this.document.content.content, index, index+1);
      this.arrayMove(this.formContent, index, index+1);
    }
  } 

  // Move content inside document
  arrayMove(arr: any[], fromIndex: number, toIndex: number) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  // Cancel document editor
  cancel(): void {
    this.openEditor = false;
    this.reloadData()
  }

  // Save site options
  saveOptions (): void {
    // Set options content values
    this.options.content.header = this.formOptions.get('header').value;
    this.options.content.footer = this.formOptions.get('footer').value;
    this.options.content.main_header = this.formOptions.get('main_header').value;
    this.options.content.main_footer = this.formOptions.get('main_footer').value;
    // API request
    this._records.postOptions(this.options, this.type).subscribe(data => {
      this.snackBar.open('Options saved', '', {
        duration: 2000,
      });
    }, error => console.log(<any>error))
  }
  
  // Set publish switch on
  publish(): void {
    this.document.published = true;
    this.saveData(true)  
  }

  // Set publish switch off
  unpublish(): void {
    this.document.published = false;
    this.saveData(true)  
  }

  // Save document data
  saveData(closeDlg: boolean): void {
    if (!this.document.name) {
    } else {
      // Get document content from HTML editor
      this.document.content.text = this.form.get('html').value;
      
      // Get document content from HTML editor
      this.document.content.content.forEach((element, index) => {
        if (element.name === 'text' || element.name === 'right_img' || element.name === 'indent' || element.name === 'sub_title') {
          element.text = this.formContent[index].get('html').value
        }
      });

      if (this.newDocument) {
        // If new document - POST API request
        this._records.postDocument(this.document, this.type).subscribe(data => {
          if (data.success) { 
            this.openEditor = !closeDlg;
            // If done then reload data
            if (closeDlg) this.reloadData();
          }
        }, error => console.log(<any>error))
      } else {
        // If exist document - PUT API request
        this._records.putDocument(this.document).subscribe(data => {
          if (data.success) { 
            this.openEditor = !closeDlg;
            if (!closeDlg) this.snackBar.open('Document saved', '', {
              duration: 2000,
            });
            // If done then reload data
            if (closeDlg) this.reloadData();
          }
        }, error => console.log(<any>error))
      }
    }
  }

  // Delete document
  delDoc(element: Document): void {
    // Prepare dialog
    const dialogRef = this.confirmDialog.open(confirmDialog, {
      data: { message: 'Are you really want to delete content?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Send DELETE API request
        this._records.deleteDocument(element).subscribe(data => {
          // If done reload data
          if (data.success) { 
            this.reloadData()
          }
        }, error => console.log(<any>error))
      }
    });
  }

  // Copy existed document
  copyDoc(element: Document): void {
    // Prepare dialog
    const dialogRef = this.confirmDialog.open(confirmDialog, {
      data: { message: 'Do you want to copy content?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Send POST API request with document data and type of content
        this._records.postDocument(element, this.type).subscribe(data => {
          if (data.success) { 
            this.reloadData()
          }
        }, error => console.log(<any>error))
      }
    })
  }

  // Get short name
  getShort(t: string): string {
    return t ? t.substring(0, 40) + '...' : '...'
  }

  // Apply filters on data table
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.setFilter()
  }
  
  // Set data filter
  setFilter() {
    if (this.filterValue) {
      this.dataSource.filter = this.filterValue.trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

}

