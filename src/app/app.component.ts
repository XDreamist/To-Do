import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Guid } from "guid-typescript";
import { Todo } from "src/models/todo.model";

import { MatDialog } from '@angular/material/dialog';
import { DelDialogComponent } from './del-dialog/del-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  @ViewChild('txtf', { static: false }) txtf!: ElementRef<HTMLInputElement> | undefined;

  todos: Todo[] = []
  txt: string = "";
  isEditMode: boolean = false;
  
  onSubmit(form: NgForm){
  let todo = new Todo(Guid.create(), form.value.title, false);
  this.todos.push(todo);
  form.resetForm();
  this.isEditMode = false;
  }
  
  
  onComplete(id: Guid){
  let todo = this.todos.filter(x=>x.id === id)[0];
  todo.isComplete = true;
  }
  
  constructor(private dialog: MatDialog) {}

  onDelete(id: Guid){
    const dialogRef = this.dialog.open(DelDialogComponent, 
      {
        width: '500px',
        data: 'Are you sure you want to delete this task?',
        panelClass: 'custom-dialog'
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          let todo = this.todos.filter(x=>x.id === id)[0];
          let index = this.todos.indexOf(todo,0);
          if(index > -1){
            this.todos.splice(index,1);
          }
        }
      });
    }

    onEdit(id: Guid)
    {
      if(! this.isEditMode)
      {
        let todo = this.todos.filter(x=>x.id === id)[0];
        let index = this.todos.indexOf(todo,0);
        if(index > -1){
          this.todos.splice(index,1);
          this.txt = todo.title;
          if (this.txtf) {
            this.txtf.nativeElement.focus();
          }
          this.isEditMode = true;
        }
        else
        {
          this.isEditMode = false;
        }
      }
    }
  }