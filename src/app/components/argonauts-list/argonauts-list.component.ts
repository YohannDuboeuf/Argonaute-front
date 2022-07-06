import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Argonaut } from 'src/models/argonaut.model';
import { ArgonautService } from 'src/shared/services/argonaut/argonaut.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-argonauts-list',
  templateUrl: './argonauts-list.component.html',
  styleUrls: ['./argonauts-list.component.scss'],
})

export class ArgonautsListComponent implements OnDestroy, OnInit {
  public argonautsSubject: BehaviorSubject<Argonaut[]> = new BehaviorSubject(
    [] as Argonaut[]
  );
  public argonautsList$: Observable<Argonaut[]> = this
    .argonautsSubject as Observable<Argonaut[]>;
  public argonautForm: FormGroup;
  private subscription: Subscription | null = null;

  constructor(
    private argonautService: ArgonautService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.argonautForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  public ngOnInit(): void {
    this.subscription = this.argonautService.getAll().subscribe((argonauts) => {
      this.argonautsSubject.next(argonauts);
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.argonautForm.valid) {
      return;
    }
    const formData: Argonaut = this.argonautForm?.value;
    console.log(formData.name);
    if (formData.name != "" || formData.name != null) {
      const response$: Observable<any> = this.argonautService.create(formData);
      this.subscription = response$.subscribe({
        next: (response) => {
          this.argonautsSubject.next(
            [...this.argonautsSubject.value, response.argonaute].sort(
              (a, b) => b.id - a.id
            )
          );
          this.argonautForm.reset();
        },
        error: (error) => {
          console.error('error', error);
        },
      });
    }
    else
    {
      console.log("nom invalid");
    }
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
