import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { Utilities } from '../../services/utilities';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DinhMucNuoc } from '../../models/dinhmucnuoc.model';
import { DinhMucNuocService } from '../../services/dinhmucnuoc.service';
import { CongThucNuoc } from '../../models/congthucnuoc.model';

@Component({
    selector: "dinhmucnuoc",
    templateUrl: "./dinhmucnuoc.component.html",
    styleUrls: ["./dinhmucnuoc.component.css"]
})

export class DinhMucNuocComponent implements OnInit {
    private isNew = false;
    private isSaving = false;
    private isEdit = false;
    private checkbox: boolean = false;
    private showValidationErrors: boolean = false;
    private uniqueId: string = Utilities.uniqueId();
    private DinhMucNuocEdit: DinhMucNuoc = new DinhMucNuoc();
    tenCongThucNuoc: string = "";
    public formResetToggle = true;
    private isEditMode = false;
    private editingRowName: string;
    public changesSavedCallback: () => void;
    public changesFailedCallback: () => void;
    public changesCancelledCallback: () => void;

    @Input()
    isViewOnly: boolean;

    @Input()
    isGeneralEditor = false;

    @ViewChild('f')
    private form;

    @ViewChild('dinhmucModal')
    dinhmucModal: ModalDirective;

    constructor(private alertService: AlertService, private gvService: DinhMucNuocService) {
    }

    ngOnInit() {
        if (!this.isGeneralEditor) {
            this.loadData();
        }
    }

    loadData() {
        this.alertService.startLoadingMessage();
    }

    loadCongthucNuoc(row: CongThucNuoc) {
        this.tenCongThucNuoc = row.tenCongThucNuoc;
        return this.DinhMucNuocEdit;
    }

    resetForm(replace = false) {

        if (!replace) {
            this.form.reset();
        }
        else {
            this.formResetToggle = false;

            setTimeout(() => {
                this.formResetToggle = true;
            });
        }
    }

    onEditorModalHidden() {
        this.editingRowName = null;
        this.resetForm(true);
    }

    private cancel() {
        this.DinhMucNuocEdit = new DinhMucNuoc();
        this.showValidationErrors = false;
        this.resetForm();
        this.alertService.showMessage("Hủy thao tác", "Thao tác bị hủy bởi người dùng", MessageSeverity.default);
        this.alertService.resetStickyMessage();
        if (!this.isGeneralEditor)
            this.isEditMode = false;

        if (this.changesCancelledCallback)
            this.changesCancelledCallback();
    }
}