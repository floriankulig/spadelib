@Injectable()
export class FormStateService {
  // RxJS Observable für errors - reaktive Streams
  private errorsSubject = new BehaviorSubject<Record<string, string>>({});
  readonly errors$ = this.errorsSubject.asObservable();

  // Signals für values - synchrone reaktive Primitives (Angular 16+)
  private valuesSignal = signal<Record<string, any>>({});
  readonly values = computed(() => this.valuesSignal());

  updateFieldObservable(field: string, error: string): void {
    // Observable Pattern: Neuer Stream-Wert wird emittiert
    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next({ ...currentErrors, [field]: error });
  }

  updateFieldSignal(field: string, value: any): void {
    // Signal Pattern: Direkte synchrone State-Mutation
    this.valuesSignal.update((state) => ({ ...state, [field]: value }));
  }
}
