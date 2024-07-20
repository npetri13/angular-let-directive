import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import 'zone.js';

type Person = {
  gender: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  template: `
  <h1>ViewModel with AsyncPipe</h1>
  <pre>{{ vmForAsyncPipe$ | async| json }}</pre>

  <h1>With &commat; directive</h1>
  `,
})
export class App {
  #httpClient = inject(HttpClient);
  #request$ = this.#httpClient.get<Person[]>(
    'https://random-data-api.com/api/v2/users?size=20'
  );
  visible = signal<boolean>(false);

  vmForAsyncPipe$ = this.#request$.pipe(
    map((data) => {
      return {
        femalesCount: data.filter((person) => person.gender === 'Female')
          .length,
        malesCount: data.filter((person) => person.gender !== 'Female').length,
      };
    })
  );
  vmAsSignal = toSignal(this.#request$);
}

bootstrapApplication(App, { providers: [provideHttpClient()] });
