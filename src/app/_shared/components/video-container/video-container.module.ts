import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoContainerComponent } from './video-container.component';

@NgModule({
	declarations: [VideoContainerComponent],
	exports: [
		VideoContainerComponent
	],
	imports: [
		CommonModule
	]
})
export class VideoContainerModule {}
