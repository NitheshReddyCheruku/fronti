import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Employee } from '../../models/auth.models';
import { UserService } from '../../Service/user.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (error) => {
        console.error('Failed to fetch employees:', error);
        // Handle error (show message to user)
      }
    });
  }
}
