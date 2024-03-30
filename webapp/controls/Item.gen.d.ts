import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";

declare module "./Item" {
    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ItemSettings extends $ControlSettings {
        text?: string | PropertyBindingInfo;
    }

    export default interface Item {
        // property: text
        getText(): string;
        setText(text: string): this;
    }
}
