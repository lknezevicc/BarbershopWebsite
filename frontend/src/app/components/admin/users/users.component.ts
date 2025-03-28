import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: false,

  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  selectedUser!: User;
  showModal = false;
  sortField: string  = '';
  sortOrder: 'asc' | 'desc' = 'asc';
  roleFilter: string = '';
  
  constructor(private userService: UserService, 
    private fb: FormBuilder, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((response) => {
      if (response.success) this.users = response.data;
    });
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.showModal = true;
  }

  closeEditModal(): void {
    this.showModal = false;
    this.userForm.reset();
  }

  onEditUser(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      console.error('Invalid form');
      return;
    }

    const updatedUser = this.userForm.value;

    this.userService.editUser(this.selectedUser._id, updatedUser).subscribe((response) => {
      if (response.success) {
        alert(response.message);
        this.loadUsers();
        this.closeEditModal();
      } else {
        alert(response.message);
      }
    });
  }


  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe((response) => {
      if (response.success) this.loadUsers();
    });
  }

  changeUserRole(userId: string, role: 'admin' | 'user'): void {
    this.userService.changeRole(userId, role).subscribe((response) => {
      if (response.success) {
        this.loadUsers();
      } else {
        alert('response.message');
      }
    });
  }

  viewUserHistory(userId: string): void {
    this.router.navigate([`/users/${userId}/history`]);
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)], this.asyncValidator],
      lastName: ['', [Validators.required, Validators.minLength(2)], this.asyncValidator],
      email: ['', [Validators.required, Validators.email], this.asyncValidator],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?:\+385|09)[0-9]{8,9}$/)
        ],
        this.asyncValidator
      ]
    });
  }

  asyncValidator(control: FormControl): Observable<ValidationErrors | null> {
    return of(control.value).pipe(
      map(value => {
        return value ? null : { asyncInvalid: true };
      })
    );
  }

  get f() {
    return this.userForm.controls;
  }

  setSortField(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
  }
}