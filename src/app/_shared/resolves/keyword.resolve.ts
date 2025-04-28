import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { KeywordService } from '../services/http/keyword.service';

import { KeywordModel } from '../models/keyword.model';

@Injectable()
export class KeywordResolve {

	constructor(private keywordService: KeywordService) {}

	resolve(snapshot: ActivatedRouteSnapshot) {
		const keywordId = snapshot.params.id;
		return this.keywordService.getKeyword(keywordId).then(response => response as KeywordModel);
	}
}
