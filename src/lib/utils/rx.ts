import { BehaviorSubject, defer, Subject, take } from 'rxjs';
import { onMount } from 'svelte';

// see https://github.com/ReactiveX/rxjs/issues/4740#issuecomment-490601347

export class SvelteSubject<T> extends BehaviorSubject<T> {
  /**
   * Method provided to compatibility with svetle store contract.
   * Alias of next()
   */
  set(value: T) {
    super.next(value);
  }

  // constructor(initialValue: T) {
  //   super(initialValue);
  // }
}

// see https://github.com/timdeschryver/svelte-utils/blob/master/packages/rx/src/lifecycles.ts

export const onMount$ = defer(() => {
  const subject = new Subject<void>()
  onMount(() => {
    subject.next()
  })
  return subject.asObservable().pipe(
    take(1),
  )
})