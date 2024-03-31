import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ControlSettings } from "sap/ui/core/Control";

declare module "./ItemV4" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $ItemV4Settings extends $ControlSettings {
        text?: string | PropertyBindingInfo;
    }

    export default interface ItemV4 {

        // property: text

        /**
         * Gets current value of property "text".
         *
         * Default value is: ""
         * @returns Value of property "text"
         */
        getText(): string;

        /**
         * Sets a new value for property "text".
         *
         * When called with a value of "null" or "undefined", the default value of the property will be restored.
         *
         * Default value is: ""
         * @param [text=""] New value for property "text"
         * @returns Reference to "this" in order to allow method chaining
         */
        setText(text: string): this;
    }
}
