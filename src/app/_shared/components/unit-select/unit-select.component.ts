import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { TranslatePipe } from 'src/app/_shared/pipes/translate/translate.pipe';
import { Placeholder, SlideToggle } from 'src/app/_shared/constants/animations';
import { UnitModel } from 'src/app/_shared/models/unit.model';
import { UnitTreeService } from '../../services/unit/unit-tree.service';
import { UnitFilterService } from '../../services/unit/unit-filter.service';
import { UnitSelectionService } from '../../services/unit/unit-selection.service';
import { UnitSelectUIService } from '../../services/unit/unit-select-ui.service';

@Component({
  selector: 'app-unit-select',
  templateUrl: './unit-select.component.html',
  styleUrls: ['./unit-select.component.sass'],
  animations: [SlideToggle, Placeholder],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => UnitSelectComponent),
    },
    UnitSelectUIService
  ]
})
export class UnitSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  @ViewChild('dropdownEle') dropdownEle: ElementRef;
  @ViewChild('widthElement') widthElement: ElementRef;

  // Inputs
  @Input() units: UnitModel[] = [];
  @Input() placeholder: string;
  @Input() ignoredUnit: UnitModel;
  @Input() multiple = false;
  @Input() toggleUp = false;
  @Input() required = false;

  @Output() touched: EventEmitter<any> = new EventEmitter();

  // UI state
  title: string;
  isOpened = false;
  filterValue: string;
  filteredUnits: UnitModel[] = [];
  selected: any;
  currentCheckStatus = false;
  
  // Positioning
  top: number;
  bottom: number;
  width: number;
  
  // Constants
  readonly unitHeight = 50;
  
  // Change propagation function from ControlValueAccessor
  private propagateChange: (value: any) => void = () => {};

  constructor(
    private elementRef: ElementRef,
    private t: TranslatePipe,
    private unitTreeService: UnitTreeService,
    private unitFilterService: UnitFilterService,
    private unitSelectionService: UnitSelectionService,
    private uiService: UnitSelectUIService
  ) {}

  ngOnInit() {
    this.initializeComponent();
  }

  /**
   * Initialize component state
   */
  private initializeComponent(): void {
    // Set placeholder text
    if (!this.placeholder) {
      const keyword = this.multiple ? 'select_units' : 'select_unit';
      this.placeholder = this.t.transform(keyword);
    }
    
    // Initialize selection state
    if (this.multiple) {
      this.selected = [];
    }
    
    this.title = this.placeholder;
    
    // Load and process units
    this.loadUnits();
  }

  /**
   * Load and process units
   */
  loadUnits(): void {
    // Load units with possible ignore rules applied
    this.filteredUnits = this.unitFilterService.loadUnits(this.units, this.ignoredUnit);
  }
  
  ngOnChanges(): void {
    if (this.ignoredUnit) {
      // Reset and reapply ignore rules when ignoredUnit changes
      this.unitFilterService.refreshIgnoreRules(this.units, this.filteredUnits, this.ignoredUnit);
    }
  }
  
  /**
   * Toggle the dropdown visibility
   */
  toggleDropdown(): void {
    if (!this.hasUnits) {
      return;
    }
    
    this.touched.emit();
    this.isOpened = !this.isOpened;
    
    if (this.isOpened) {
      this.updateDropdownPosition();
    }
  }
  
  /**
   * Update dropdown position when window is scrolled or resized
   */
  @HostListener('window:scroll')
  @HostListener('window:resize')
  updateDropdownPosition(): void {
    if (!this.isOpened) {
      return;
    }
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const position = this.uiService.calculateDropdownPosition(
        this.elementRef,
        this.dropdownEle,
        this.widthElement,
        this.toggleUp
      );
      
      this.top = position.top;
      this.bottom = position.bottom;
      this.width = position.width;
    });
  }

  /**
   * Handle unit click event
   */
  unitClicked(unit: UnitModel): void {
    if (unit.ignore) {
      return;
    }
    
    if (this.multiple) {
      // Toggle selection for multiple mode
      this.toggleUnitSelection(unit);
    } else {
      // Single selection mode
      this.selectUnit(unit);
    }
  }
  
  /**
   * Toggle a unit's expanded/collapsed state
   */
  toggleUnit(unit: UnitModel, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    // Toggle the expanded state
    unit.isToggled = !unit.isToggled;
    
    // Update dropdown position after toggling
    this.updateDropdownPosition();
  }
  
  /**
   * Toggle selection state of a unit in multiple selection mode
   */
  toggleUnitSelection(unit: UnitModel): void {
    // Use service to handle unit selection
    const result = this.unitSelectionService.handleUnitSelection(unit, this.units, true);
    if (!result) return;
    
    // Update selected units
    this.selected = result.selected;
    
    // Update title for multiple selection
    this.updateSelectionTitle();
    
    // Emit changes
    this.propagateChange(result.selectedIds);
    
    // Update check status if needed
    if (result.updateCheckStatus) {
      this.currentCheckStatus = false;
    }
  }
  
  /**
   * Update the list of selected units and notify changes
   */
  private updateSelectedUnits(): void {
    const result = this.unitSelectionService.getSelectedUnits(this.units);
    
    this.selected = result.selectedUnits;
    
    // Update title for multiple selection
    this.updateSelectionTitle();
    
    // Emit changes
    this.propagateChange(result.selectedIds);
  }
  
  /**
   * Update the selection title for multiple selection
   */
  private updateSelectionTitle(): void {
    if (!this.multiple) {
      return;
    }
    
    this.title = this.uiService.formatSelectionTitle(this.selected, this.placeholder);
  }
  
  /**
   * Select a specific unit
   */
  selectUnit(unit: UnitModel, checked?: boolean): void {
    // Use service to handle unit selection
    const result = this.unitSelectionService.handleUnitSelection(
      unit, this.units, this.multiple, checked
    );
    if (!result) return;
    
    if (this.multiple) {
      // For multiple selection
      this.selected = result.selected;
      
      // Update title for multiple selection
      this.updateSelectionTitle();
      
      // Emit changes
      this.propagateChange(result.selectedIds);
      
      // Update check status if needed
      if (result.updateCheckStatus) {
        this.currentCheckStatus = false;
      }
    } else {
      // For single selection
      this.selected = result.selected;
      this.title = unit.name;
      
      if (result.closeDropdown) {
        this.isOpened = false;
        this.resetFilter();
      }
      
      // Emit the ID of the selected unit
      this.propagateChange(result.selectedId);
    }
  }
  
  /**
   * Select or deselect all units
   */
  selectAll(isChecked: boolean): void {
    // Apply selection to all non-ignored units
    this.unitSelectionService.selectAll(this.units, isChecked);
    
    // Update the current check status
    this.currentCheckStatus = isChecked;
    
    // Update the list of selected units
    this.updateSelectedUnits();
  }
  
  /**
   * Check if there are any non-ignored units available
   */
  get hasUnits(): boolean {
    return this.unitFilterService.hasVisibleUnits(this.units);
  }
  
  /**
   * Check if a unit has visible child units
   */
  hasMoreUnits(unit: UnitModel): boolean {
    return this.unitFilterService.hasVisibleChildren(unit);
  }
  
  /**
   * Reset selection
   */
  reset(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
  
    // Use service to reset selection
    const result = this.unitSelectionService.resetSelection(this.units, this.multiple);
    this.selected = result.selected;
  
    // Reset title and notify change
    this.title = this.placeholder;
    this.propagateChange(this.multiple ? [] : null);
  }
  
  /**
   * Check if the component has a selected value
   */
  hasValue(): boolean {
    if (this.multiple) {
      return this.selected && this.selected.length > 0;
    }
    return !!this.selected;
  }
  
  /**
   * Apply filter to units
   */
  initFilter(value: string): void {
    this.filterValue = value;
    this.filteredUnits = this.unitFilterService.applyFilter(this.units, value);
  }
  
  /**
   * Reset the filter and show all units
   */
  resetFilter(): void {
    this.filterValue = '';
    this.filteredUnits = this.unitFilterService.resetFilter(this.units);
  }
  
  /**
   * Handle incoming values from form control
   */
  writeValue(value: any): void {
    console.log(value)
    if (!value) {
      this.reset();
      return;
    }
  
    if (this.multiple && Array.isArray(value)) {
      // For multiple selection, match all values against units
      this.unitSelectionService.selectUnitsByIds(this.units, value);
      
      // Update selected value
      const result = this.unitSelectionService.getSelectedUnits(this.units);
      this.selected = result.selectedUnits;
      
      // Update title for multiple selection
      this.updateSelectionTitle();
    }
    
    if (!this.multiple) {
      // For single selection, find the unit by ID
      const unit = this.unitTreeService.findUnitById(value, this.units);
      if (unit) {
        this.selected = unit;
        this.title = unit.name;
      }
    }
  }
  
  /**
   * Register change handler
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  
  /**
   * Register touched handler
   */
  registerOnTouched(fn: any): void {
    // Not implemented for this component
  }
  
  /**
   * Handle document clicks to close dropdown
   */
  @HostListener('document:click', ['$event'])
  documentClicked(e: PointerEvent): void {
    if (!this.isOpened) {
      return;
    }
  
    // Close dropdown if clicked outside
    if (!this.elementRef.nativeElement.contains(e.target)) {
      this.isOpened = false;
      this.resetFilter();
    }
  }
}
