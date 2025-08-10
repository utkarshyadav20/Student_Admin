import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    
    {
        path: 'dashboard',
        loadComponent: () => import('../features/student-list-component/student-list-component.component').then(m => m.StudentListComponentComponent)
    },
    {
        path: 'student-form',
        loadComponent: () => import('../features/student-form/student-form.component').then(m => m.StudentFormComponent)
    },
    {
        path: 'student-form/edit/:email',
        loadComponent: () => import('../features/student-form/student-form.component').then(m => m.StudentFormComponent)
    },
    {
        path: 'courses',
        loadComponent: () => import('../features/courses/courses.component').then(m => m.CoursesComponent)
    },
    {
        path: 'courses/add',
        loadComponent: () => import('../features/add-course/add-course.component').then(m => m.AddCourseComponent)
    },
    {
        path: 'courses/edit/:course',
        loadComponent: () => import('../features/edit-course/edit-course.component').then(m => m.EditCourseComponent)
    },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];