import { Pipe, PipeTransform } from '@angular/core';
import { PERSONIL_BY_PID } from '../data/personil';
import { TPersonilPid } from '../types/personil';

@Pipe({
  name: 'personil'
})
export class PersonilPipe implements PipeTransform {

  transform(pid: TPersonilPid, ...args: unknown[]): unknown {
    return PERSONIL_BY_PID[pid].panggilan;
  }

}
