import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';

/**
 * Basic loading strategy that allow preloading of a lazy loaded route after a certain amount of time.
 * provide in your route's data these properties -> {path:'..', loadChildren:'..', data:{preload:true, delay:1000}}
 */
export class WithDelayPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    const loadRoute = (delay) => (delay ? timer(delay).pipe(flatMap((_) => load())) : load());
    return route.data && route.data.preload ? loadRoute(route.data.delay) : of(null);
  }
}
