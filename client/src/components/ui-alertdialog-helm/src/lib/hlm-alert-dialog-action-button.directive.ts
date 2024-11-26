import { Directive,computed, inject, input } from '@angular/core';
import { HlmButtonDirective } from '~/components/ui-button-helm/src';
import type { ClassValue } from 'clsx';
import { hlm } from '@spartan-ng/ui-core';

@Directive({
	selector: 'button[hlmAlertDialogAction]',
	standalone: true,
	hostDirectives: [HlmButtonDirective],
})
export class HlmAlertDialogActionButtonDirective {
  private readonly _hlmBtn = inject(HlmButtonDirective, { host: true });

  public readonly userClass = input<ClassValue>('', { alias: 'class' });
	protected readonly _computedClass = computed(() => hlm('mt-2 sm:mt-0 text-white', this.userClass()));

	constructor() {
		this._hlmBtn.variant = 'warning';
	}
}
