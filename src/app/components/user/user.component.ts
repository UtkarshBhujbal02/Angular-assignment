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
