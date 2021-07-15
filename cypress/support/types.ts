
export interface IPanelContext {
    panelGroup: string;
    panelOption?: string;
    panel?: string;
}

export enum FieldType {
    Dropdown = 'select',
    Textbox = 'input',
    Toggle = 'toggle'
}

export enum PropertyState {
    Enabled = 'enabled',
    Disabled = 'disabled',
    ReadOnly = 'readonly'
}

export interface IPreference {
    name: string;
    value: any;
    type: FieldType;
}

export interface IDialogProperty {
    dialog: string; 
    name: string;
    type: FieldType;
    value: string;
}

export interface IDialogPropertyState {
    dialog: string;
    name: string;
    type: FieldType;
    state: PropertyState;
}

export interface IDialogButtonState {
    button: string;
    state: PropertyState;
}

export interface IDialogContext extends IPanelContext {
    dialog: string;
}

export interface IFibreSegmentCalibration {
    channel: string;
    monitorStart: number;
    monitorEnd: number;
    cableStart: number;
}

export interface IPropertyAliases {
    [key: string]: string;
}

export interface IZoneButtonState {
    zone: string;
    button: string;
    state: PropertyState;
}