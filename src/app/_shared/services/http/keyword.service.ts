import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from 'src/app/_shared/services/http/base-http.service';
import { UserSessionService } from 'src/app/_shared/services/state/user-session.service';

import { KeywordModel } from 'src/app/_shared/models/keyword.model';
import { DataTableCriteria } from 'src/app/_shared/components/data-table/classes/data-table-criteria';
import { DataTableResponse } from 'src/app/_shared/components/data-table/classes/data-table-response';

@Injectable()
export class KeywordService extends BaseHttpService {

	readonly endPoint = `${this.apiUrl}/keywords`;

	constructor(http: HttpClient, userSession: UserSessionService) {
		super(userSession, http);
	}

	getKeywords(criteria: DataTableCriteria): Promise<DataTableResponse> {
		const params = this.getDataTableParams(criteria);
		return this.post<DataTableResponse>(`${this.endPoint}/search`, {
			body: params
		});
	}
	
	getKeyword(keywordId: string): Promise<KeywordModel> {
		return this.get<KeywordModel>(`${this.endPoint}/${keywordId}`);
	}

	createKeyword(values: object): Promise<boolean> {
		return this.post<boolean>(this.endPoint, {
			body: values
		});
	}
	
	updateKeyword(keywordId: string, values: object): Promise<boolean> {
		return this.put<boolean>(`${this.endPoint}/${keywordId}`, {
			body: values
		});
	}
	
	deleteKeyword(keywordId: string): Promise<boolean> {
		return this.delete<boolean>(`${this.endPoint}/${keywordId}`);
	}
}
