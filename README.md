###Live Link 
https://tradexa-assignment.netlify.app/


### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **Angular CLI** (Install globally via `npm install -g @angular/cli`)

### Installation

1. **Clone the repository** (or download the source code):
   ```bash
   git clone <repository-url>
   cd Tradexa-angular-assignment
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

1. **Start the development server**:
   ```bash
   ng serve
   ```
   Or use the npm script:
   ```bash
   npm start
   ```

2. **Open your browser**:
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

---

## Project Details & Submission

Below is the detailed explanation of the project features and code structure.

### How it Works

The application has a main "User" component that handles everything.

- **Fetching Data**: When the page loads, it calls the `https://jsonplaceholder.typicode.com/posts` API to get the initial list of data.
- **Displaying Data**: The data is shown in a simple table with ID, Title, and Body columns.
- **Adding Data**: I added an "Add Post" button that opens a form. The user can type a title and body.
- **Validation**: I made sure that empty posts can't be submitted. Both the HTML `required` attribute and a manual check in the TypeScript code prevent blank entries.
- **Submitting**: When the user clicks "Submit", the app sends a POST request to the API. Once the API confirms success, I add the new post to the top of the table so the user sees it immediately.

### Code Structure

#### `src/app/app.config.ts`

This file sets up the application. I added `provideHttpClient()` here so the app can make API requests.

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

#### `src/app/app.component.ts`

The main wrapper for the application.

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './components/user/user.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tradexa-angular-assignment';
}
```

#### `src/app/components/user/user.component.ts`

This is the main logic for the webpage.

```typescript
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  imports: [FormsModule],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {

  http = inject(HttpClient)
  API_URL = 'https://jsonplaceholder.typicode.com/posts';

  posts: any[] = [];
  isFormOpen: boolean = false;

  newPost: any = {
    title: '',
    body: '',
    userId: 1
  };

  error: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.getPosts();
  }

  getPosts() {
    this.http.get(this.API_URL).subscribe({
      next: (res: any) => {
        this.posts = res;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to fetch posts from server';
        console.error(err);
      }
    });
  }

  formToggle() {
    this.isFormOpen = !this.isFormOpen;
    this.successMessage = '';
    this.error = '';
  }

  onAddPost() {
    if (this.newPost.body == '' && this.newPost.title == '') {
      alert("Please enter title and body");
      return;
    } else if (this.newPost.title == '') {
      alert("Please enter title");
      return;
    } else if (this.newPost.body == '') {
      alert("Please enter body");
      return;
    }

    this.http.post(this.API_URL, this.newPost).subscribe({
      next: (res: any) => {
        this.successMessage = 'Post added successfully!';
        this.error = '';

        this.posts.unshift(res);

        this.newPost = { title: '', body: '', userId: 1 };
        this.isFormOpen = false;
      },
      error: (err) => {
        this.error = 'Failed to add post';
        console.error(err);
      }
    });
  }
}
```

#### `src/app/components/user/user.component.html`

The HTML template for the UI.

```html
<h1 style="text-align: center;">Tradexa Assignment</h1>

<div class="container">
    @if (error) {
    <div style="color: red; padding: 10px; border: 1px solid red; margin-bottom: 10px;">
        {{ error }}
    </div>
    }

    <button (click)="formToggle()">{{ isFormOpen ? 'Cancel' : 'Add New Post' }}</button>

    @if (isFormOpen) {
    <div style="margin: 20px 0; padding: 10px; border: 1px solid #ccc;">
        <h2>Create New Post</h2>
        <form (ngSubmit)="onAddPost()">
            <div>
                <label>Title:</label>
                <input type="text" [(ngModel)]="newPost.title" name="title" required
                    style="display: block; width: 100%; margin: 5px 0;">
            </div>
            <div>
                <label>Body:</label>
                <textarea [(ngModel)]="newPost.body" name="body" required rows="4"
                    style="display: block; width: 100%; margin: 5px 0;"></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
    }

    <table border="1" style="width: 100%; margin-top: 20px; border-collapse: collapse;">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Body</th>
            </tr>
        </thead>
        <tbody>
            @for (post of posts; track post.id) {
            <tr>
                <td>{{ post.id }}</td>
                <td>{{ post.title }}</td>
                <td>{{ post.body }}</td>
            </tr>
            }
        </tbody>
    </table>
</div>
```
