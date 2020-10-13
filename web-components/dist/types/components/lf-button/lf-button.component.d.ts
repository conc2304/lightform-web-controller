import { ButtonSize } from "./button-size.enum";
import { ButtonContext } from "./button-context.enum";
export declare class LfButton {
    size: ButtonSize;
    context: ButtonContext;
    disabled?: boolean;
    render(): any;
}
