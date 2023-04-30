import type { IWidget, LGraphNode } from "@litegraph-js/core";
import type ComfyApp from "$lib/components/ComfyApp";
import ComfyValueControlWidget from "./widgets/ComfyValueControlWidget";
import type { ComfyInputConfig } from "./IComfyInputSlot";
import type IComfyInputSlot from "./IComfyInputSlot";
import { BuiltInSlotShape } from "@litegraph-ts/core";

type WidgetFactory = (node: LGraphNode, inputName: string, inputData: any, app: ComfyApp) => IComfyInputSlot;

function getNumberDefaults(inputData: any, defaultStep: number): ComfyInputConfig {
    let defaultValue = inputData[1]["default"];
    let { min, max, step } = inputData[1];

    if (defaultValue == undefined) defaultValue = 0;
    if (min == undefined) min = 0;
    if (max == undefined) max = 2048;
    if (step == undefined) step = defaultStep;

    return { min, max, step: step, precision: 0, defaultValue };
}

function addComfyInput(node: LGraphNode, inputName: string, extraInfo: Partial<IComfyInputSlot> = {}): IComfyInputSlot {
    const input = node.addInput(inputName) as IComfyInputSlot
    for (const [k, v] of Object.entries(extraInfo))
        input[k] = v
    input.serialize = true;
    input.shape = BuiltInSlotShape.CARD_SHAPE;
    input.color_off = "lightblue"
    input.color_on = "lightblue"
    return input;
}

const FLOAT: WidgetFactory = (node: LGraphNode, inputName: string, inputData: any): IComfyInputSlot => {
    const config = getNumberDefaults(inputData, 0.5);
    return addComfyInput(node, inputName, { type: "number", config })
}

const INT: WidgetFactory = (node: LGraphNode, inputName: string, inputData: any): IComfyInputSlot => {
    const config = getNumberDefaults(inputData, 1);
    return addComfyInput(node, inputName, { type: "number", config })
};

const STRING: WidgetFactory = (node: LGraphNode, inputName: string, inputData: any, app: ComfyApp): IComfyInputSlot => {
    const defaultValue = inputData[1].default || "";
    const multiline = !!inputData[1].multiline;

    return addComfyInput(node, inputName, { type: "string", config: { defaultValue, multiline } })
};

const COMBO: WidgetFactory = (node: LGraphNode, inputName: string, inputData: any): IComfyInputSlot => {
    const type = inputData[0];
    let defaultValue = type[0];
    if (inputData[1] && inputData[1].default) {
        defaultValue = inputData[1].default;
    }
    return addComfyInput(node, inputName, { type: "string", config: { values: type, defaultValue } })
}

const IMAGEUPLOAD: WidgetFactory = (node: LGraphNode, inputName: string, inputData: any, app): IComfyInputSlot => {
    return addComfyInput(node, inputName, { type: "number", config: {} })
}

export type WidgetRepository = Record<string, WidgetFactory>

export const ComfyWidgets: WidgetRepository = {
    "INT:seed": INT,
    "INT:noise_seed": INT,
    FLOAT,
    INT,
    STRING,
    COMBO,
    IMAGEUPLOAD,
}
