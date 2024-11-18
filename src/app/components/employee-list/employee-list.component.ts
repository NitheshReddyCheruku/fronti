import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { catchError, map, Observable, of } from 'rxjs';
import { Employee } from 'src/app/models/auth.models';
import { EmployeeService } from 'src/app/Service/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees$: Observable<Employee[]>;
  loading = true;
  errorMessage = '';

  constructor(private employeeService: EmployeeService) {
    this.employees$ = this.employeeService.getEmployees().pipe(
      map(response => response.result),
      catchError(error => {
        this.errorMessage = error;
        console.error('Error loading employees:', error);
        return of([]);
      })
    );
  }

  ngOnInit() {
    this.employees$.subscribe({
      next: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  retryLoading() {
    this.loading = true;
    this.errorMessage = '';
    this.employees$ = this.employeeService.getEmployees().pipe(
      map(response => response.result),
      catchError(error => {
        this.errorMessage = error;
        return of([]);
      })
    );
  }
}