import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MailServerService } from 'src/app/_shared/services/http/mail-server.service';

import { ErrorMessages } from 'src/app/_shared/constants/error-messages';
import { UnitModel } from 'src/app/_shared/models/unit.model';
